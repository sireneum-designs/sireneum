/* ── client-plans-digest ──────────────────────────────────────
   Once a day at 6:00 AM Arizona time, emails the studio a summary
   of client comment-flag activity it hasn't seen yet. Sends
   nothing when there's nothing new, and never repeats an item.

   "Seen" means the studio opened that flag (or clicked
   "Mark all seen") after the comment was posted; see seenAt in
   client-plans.mts.

   Settings (Netlify environment variables, Functions scope):
     RESEND_API_KEY   required to send (resend.com API key)
     DIGEST_TO        default design@sireneum.com
     DIGEST_FROM      default "Sireneum client plans <onboarding@resend.dev>"
     DIGEST_DRY_RUN   "1" = print the email to the log instead of sending

   State: digest/state.json in the client-plans store remembers
   when the last email went out.
   ─────────────────────────────────────────────────────────── */
import { getStore } from "@netlify/blobs"
import type { Config } from "@netlify/functions"

const store = () => getStore({ name: "client-plans", consistency: "strong" })
const env = (k: string) => (globalThis as any).Netlify?.env?.get(k) ?? process.env[k] ?? ""
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c])
const when = (iso: string) => new Date(iso).toLocaleString("en-US", { timeZone: "America/Phoenix", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })

/* same rule as the dashboard count: client entries newer than the flag's seenAt */
function unseenEntries(doc: any) {
  const out: { flag: any, entry: any }[] = []
  for (const f of Object.values(doc.flags || {}) as any[]) {
    const seen = String(f.seenAt || "")
    for (const e of (Array.isArray(f.thread) ? f.thread : [])) if (e && e.by === "client" && String(e.at) > seen) out.push({ flag: f, entry: e })
  }
  return out
}

export default async () => {
  const s = store(), now = new Date().toISOString()
  const state: any = (await s.get("digest/state.json", { type: "json" })) || {}
  const since = String(state.lastSent || "")
  const site = env("URL") || "https://sireneum.com"

  const groups: { slug: string, name: string, items: { flag: any, entry: any }[], sheets: any }[] = []
  const { blobs } = await s.list({ prefix: "projects/" })
  for (const b of blobs) {
    const d: any = await s.get(b.key, { type: "json" })
    if (!d) continue
    const items = unseenEntries(d).filter(x => String(x.entry.at) > since)
    if (items.length) groups.push({ slug: d.slug, name: d.meta?.tb?.project || d.slug, items, sheets: d.sheets || {} })
  }
  if (!groups.length) { console.log("digest: nothing new"); return new Response("nothing new") }

  const total = groups.reduce((a, g) => a + g.items.length, 0)
  const subject = `New client comments: ${groups.map(g => g.name).join(", ")} (${total})`
  const text = groups.map(g => [`${g.name} — ${site}/client/${g.slug}`, ...g.items.map(({ flag, entry }) =>
    `  Flag ${flag.no} (${g.sheets[flag.sheet]?.no || "sheet"}) · ${entry.who} · ${when(entry.at)}${entry.kind === "reply" ? " · reply" : ""}\n    ${String(entry.text || "").replace(/\n/g, "\n    ")}`)].join("\n")).join("\n\n")
    + "\n\nOpen a flag (or use Mark all seen) to stop it appearing in tomorrow's email."
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">` + groups.map(g =>
    `<h3 style="margin:18px 0 6px">${esc(g.name)} · <a href="${esc(site)}/client/${esc(g.slug)}">open plan</a></h3>` +
    g.items.map(({ flag, entry }) => `<div style="margin:0 0 10px;padding:8px 10px;border-left:3px solid #d4561a;background:#f6f7f8">
      <div style="font-size:12px;color:#555">Flag ${esc(flag.no)} · ${esc(g.sheets[flag.sheet]?.no || "")} · ${esc(entry.who)} · ${esc(when(entry.at))}${entry.kind === "reply" ? " · reply" : ""}${flag.status === "closed" ? " · closed" : ""}</div>
      <div style="white-space:pre-wrap;margin-top:3px">${esc(entry.text)}</div></div>`).join("")).join("")
    + `<p style="font-size:12px;color:#666;margin-top:16px">Open a flag (or use Mark all seen) to keep it out of tomorrow's email.</p></div>`

  if (env("DIGEST_DRY_RUN") === "1") { console.log(`digest (dry run)\nSubject: ${subject}\n\n${text}`); return new Response("dry run") }
  const key = env("RESEND_API_KEY")
  if (!key) { console.log("digest: RESEND_API_KEY not set; not sending"); return new Response("not configured") }

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env("DIGEST_FROM") || "Sireneum client plans <onboarding@resend.dev>", to: [env("DIGEST_TO") || "design@sireneum.com"], subject, text, html })
  })
  if (!r.ok) { console.error("digest: send failed", r.status, await r.text()); return new Response("send failed", { status: 502 }) }
  await s.setJSON("digest/state.json", { lastSent: now, lastCount: total })
  console.log(`digest: sent ${total} item(s)`)
  return new Response("sent")
}

// 13:00 UTC = 6:00 AM in Arizona all year (no daylight saving there)
export const config: Config = { schedule: "0 13 * * *" }
