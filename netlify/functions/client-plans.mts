/* ── client-plans ─────────────────────────────────────────────
   Storage API for the client plan tool at sireneum.com/client/<slug>.

   Data lives in Netlify Blobs (store "client-plans"):
     projects/<slug>.json   the whole project: sheets, symbols, schedule…
     auth/<slug>.json       salted hash of the project's passcode
     assets/<slug>/<id>     uploaded base drawings (JPEG)

   Who can do what:
     PLANS_ADMIN_KEY (env var)  → every project, create projects, reset passcodes
     a project's passcode       → read and edit that one project

   Note: Blobs stores are shared across deploy contexts, so a Deploy
   Preview of this function reads and writes the real projects.
   ─────────────────────────────────────────────────────────── */
import { getStore } from "@netlify/blobs"
import type { Config, Context } from "@netlify/functions"

const store = () => getStore({ name: "client-plans", consistency: "strong" })
const SLUG = /^[a-z0-9][a-z0-9-]{1,40}$/
const ID = /^[A-Za-z0-9_-]{1,40}$/
const COLLS = ["sheets", "items", "wires", "notes", "dims", "fixtures", "flags"]
const MAX_ASSET = 4_200_000

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } })
const err = (message: string, status: number) => json({ error: message }, status)

function safeEqual(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}
async function sha(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("")
}
function isAdmin(key: string) {
  const admin = Netlify.env.get("PLANS_ADMIN_KEY") || ""
  return admin.length >= 12 && safeEqual(key, admin)
}
async function role(slug: string, key: string): Promise<"admin" | "editor" | null> {
  if (!key) return null
  if (isAdmin(key)) return "admin"
  const auth = await store().get(`auth/${slug}.json`, { type: "json" }) as { salt: string, hash: string } | null
  if (!auth) return null
  return safeEqual(await sha(auth.salt + key), auth.hash) ? "editor" : null
}
async function setPasscode(slug: string, passcode: string) {
  const salt = crypto.randomUUID()
  await store().setJSON(`auth/${slug}.json`, { salt, hash: await sha(salt + passcode) })
}
function emptyProject(slug: string, b: Record<string, string>) {
  return {
    slug, rev: 1, created: new Date().toISOString(), updated: new Date().toISOString(),
    meta: {
      tb: { project: b.name || slug, addr: b.addr || "", client: b.client || "", projno: b.projno || "", date: "", issue: "Schematic Design", drawn: "", checked: "" },
      firm: { name: "Sireneum Designs", addr1: "", addr2: "", phone: "", email: "design@sireneum.com", web: "sireneum.com" },
      revisions: [], ref: null, display: { tagNo: true }
    },
    sheets: {}, items: {}, wires: {}, notes: {}, dims: {}, fixtures: {}, flags: {}
  }
}

/* Apply a batch of edits to the newest stored copy. Each op names one object,
   so two people editing different symbols never overwrite each other. */
async function applyOps(slug: string, ops: any[]) {
  const s = store(), key = `projects/${slug}.json`
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await s.getWithMetadata(key, { type: "json" })
    if (!cur) return null
    const doc: any = cur.data
    for (const op of ops) {
      if (op.c === "meta") { if (op.v && typeof op.v === "object") doc.meta = op.v; continue }
      if (!COLLS.includes(op.c) || !ID.test(String(op.id || ""))) continue
      doc[op.c] = doc[op.c] || {}
      if (op.v === null) delete doc[op.c][op.id]
      else if (op.v && typeof op.v === "object") {
        const next: any = { ...op.v, id: op.id }
        // Comment threads only grow: keep every entry either side has, so two
        // people replying at the same moment both keep their messages.
        const prev = doc[op.c][op.id]
        if (op.c === "flags" && prev && Array.isArray(prev.thread)) {
          const seen = new Map<string, any>()
          for (const e of [...prev.thread, ...(Array.isArray(next.thread) ? next.thread : [])]) if (e && e.id) seen.set(e.id, e)
          next.thread = [...seen.values()].sort((a, b) => String(a.at).localeCompare(String(b.at)))
        }
        doc[op.c][op.id] = next
      }
    }
    doc.rev = (doc.rev || 0) + 1
    doc.updated = new Date().toISOString()
    const res = await s.setJSON(key, doc, { onlyIfMatch: cur.etag })
    if (res.modified) return doc.rev
    await new Promise(r => setTimeout(r, 60 + Math.random() * 140))
  }
  throw new Error("busy")
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url)
  const parts = url.pathname.replace(/^\/api\/client\/?/, "").split("/").filter(Boolean)
  const key = req.headers.get("x-plan-key") || ""
  const s = store()

  try {
    /* ── admin: list and create projects ── */
    if (parts[0] === "_projects") {
      if (!isAdmin(key)) return err("Admin key required.", 401)
      if (req.method === "GET") {
        const { blobs } = await s.list({ prefix: "projects/" })
        const out = []
        for (const b of blobs) {
          const d: any = await s.get(b.key, { type: "json" })
          if (d) out.push({ slug: d.slug, name: d.meta?.tb?.project || d.slug, client: d.meta?.tb?.client || "", updated: d.updated, sheets: Object.keys(d.sheets || {}).length })
        }
        out.sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
        return json({ projects: out })
      }
      if (req.method === "POST") {
        const b = await req.json().catch(() => ({}))
        const slug = String(b.slug || "").toLowerCase()
        if (!SLUG.test(slug)) return err("Use 2–41 lowercase letters, numbers or hyphens for the project address.", 400)
        if (String(b.passcode || "").length < 8) return err("The client passcode must be at least 8 characters.", 400)
        const created = await s.setJSON(`projects/${slug}.json`, emptyProject(slug, b), { onlyIfNew: true })
        if (!created.modified) return err("A project already uses that address.", 409)
        await setPasscode(slug, String(b.passcode))
        return json({ ok: true, slug })
      }
      return err("Method not allowed.", 405)
    }

    const slug = (parts[0] || "").toLowerCase()
    if (!SLUG.test(slug)) return err("Not found.", 404)
    const docKey = `projects/${slug}.json`

    /* ── who am I? (also tells the login screen whether the project exists) ── */
    if (parts[1] === "auth") {
      const meta = await s.getMetadata(docKey)
      if (!meta) return err("No project at this address.", 404)
      const r = await role(slug, key)
      return r ? json({ role: r }) : err("Passcode not recognized.", 401)
    }

    const r = await role(slug, key)
    if (!r) return err("Passcode not recognized.", 401)

    /* ── admin: change the client passcode ── */
    if (parts[1] === "passcode" && req.method === "POST") {
      if (r !== "admin") return err("Only the studio can change the passcode.", 403)
      const b = await req.json().catch(() => ({}))
      if (String(b.passcode || "").length < 8) return err("The passcode must be at least 8 characters.", 400)
      await setPasscode(slug, String(b.passcode))
      return json({ ok: true })
    }

    /* ── base drawings ── */
    if (parts[1] === "assets") {
      if (req.method === "POST" && !parts[2]) {
        const buf = await req.arrayBuffer()
        if (!buf.byteLength) return err("Empty upload.", 400)
        if (buf.byteLength > MAX_ASSET) return err("That drawing is too large. Keep uploads under 4 MB.", 413)
        const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20)
        await s.set(`assets/${slug}/${id}`, buf, { metadata: { type: req.headers.get("content-type") || "image/jpeg" } })
        return json({ id })
      }
      if (req.method === "GET" && parts[2] && ID.test(parts[2])) {
        const a = await s.getWithMetadata(`assets/${slug}/${parts[2]}`, { type: "arrayBuffer" })
        if (!a) return err("Drawing not found.", 404)
        return new Response(a.data as ArrayBuffer, { headers: { "content-type": String((a.metadata as any)?.type || "image/jpeg"), "cache-control": "private, max-age=86400" } })
      }
      return err("Not found.", 404)
    }

    /* ── edits ── */
    if (parts[1] === "ops" && req.method === "POST") {
      const b = await req.json().catch(() => null)
      if (!b || !Array.isArray(b.ops) || b.ops.length > 2000) return err("Bad request.", 400)
      const rev = await applyOps(slug, b.ops)
      if (rev === null) return err("No project at this address.", 404)
      return json({ rev })
    }

    /* ── read the project ── */
    if (!parts[1] && req.method === "GET") {
      const doc: any = await s.get(docKey, { type: "json" })
      if (!doc) return err("No project at this address.", 404)
      const since = Number(url.searchParams.get("rev") || 0)
      if (since && since === doc.rev) return json({ unchanged: true, rev: doc.rev, role: r })
      return json({ doc, role: r })
    }

    return err("Not found.", 404)
  } catch (e: any) {
    if (e?.message === "busy") return err("The project is busy. Try again in a moment.", 503)
    console.error(e)
    return err("Something went wrong on the server.", 500)
  }
}

export const config: Config = {
  path: "/api/client/*",
  rateLimit: { windowLimit: 240, windowSize: 60, aggregateBy: ["ip", "domain"] }
}
