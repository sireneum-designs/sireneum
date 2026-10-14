/* ── first-visit walkthrough ─────────────────────────────────
   Loaded by index.html. Runs once per browser per project for
   client (passcode) logins; the "Guide" button in the header
   replays it any time. Studio logins don't see it automatically;
   add ?tour to the address to preview it.

   Remembered in localStorage as "pos-tour-<slug>" = TOUR_VERSION.
   Bump TOUR_VERSION when the steps change enough that clients
   should see the tour again.
   ─────────────────────────────────────────────────────────── */
(() => {
  "use strict"
  const TOUR_VERSION = "1"
  const CONTACT = "design@sireneum.com"
  const SLUG = (location.pathname.split("/").filter(Boolean)[1] || "").toLowerCase()
  if (!SLUG) return                                        // studio dashboard: no tour
  const KEY = "pos-tour-" + SLUG
  const $ = id => document.getElementById(id)
  const lsGet = k => { try { return localStorage.getItem(k) } catch (e) { return null } }
  const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  const mod = isMac ? "Cmd" : "Ctrl"
  const kb = t => `<kbd>${t}</kbd>`

  /* target: a function returning the element to spotlight (null = centered card).
     open: a <details> to open while the step shows (restored afterwards). */
  const side = name => [...document.querySelectorAll(".side details > summary")]
    .find(s => s.textContent.trim().toLowerCase() === name)?.parentElement || null
  const STEPS = [
    { title: "Welcome to your plan",
      body: () => `This is the working lighting &amp; electrical plan for <b>${esc(($("hdrProj")?.textContent || "your project").trim())}</b>. A one-minute tour shows you how to look around, make changes and leave us comments.<br><br>Nothing you do during the tour changes the plan.` },
    { target: () => $("sheetSel"), title: "Switch sheets",
      body: "Pick a sheet here: <b>A-101</b> Lighting &amp; Switching Plan or <b>A-102</b> Reflected Ceiling Plan.<br><br>Light fixtures marked <span class=\"tour-shared\">shared</span> sit in the same spot on both sheets, so moving one moves it on both." },
    { target: () => $("stage"), title: "Look around", pad: -12,
      body: `${kb("Scroll")} to zoom, and ${kb("drag empty space")} to pan.<br><br>Lost? <b>Fit</b> in the toolbar brings the whole sheet back into view.` },
    { target: () => $("pal"), title: "Add a symbol",
      body: "Drag a symbol from this panel onto the plan, or click it once and then click the plan where it goes." },
    { target: () => document.querySelector(".tools"), title: "Move, rotate, delete",
      body: `Click a symbol and drag to move it. ${kb("Shift")}-click to select several.<br><br>${kb("Space")} or ${kb("R")} rotates · ${kb("Delete")} removes · ${kb(mod + "+Z")} undoes.` },
    { target: () => side("selection"), open: () => side("selection"), title: "Choose the fixture type",
      body: "With a light selected, pick its type (A, B, C…) here. The <b>Schedules</b> below list what each type is and how many are on the plan." },
    { target: () => $("sync"), title: "It saves by itself",
      body: "Every change saves automatically. Wait until this badge says <b>Saved</b> before you close the tab." },
    { target: () => $("tFlag"), title: "Not sure? Leave a comment",
      body: `When you're unsure, a comment flag is better than an edit. Click <b>Comment flag</b> (or press ${kb("C")}), click the spot on the plan, and type. The first time, it asks for your name.` },
    { target: () => $("dComments"), open: () => $("dComments"), title: "Comments",
      body: "Open flags for this sheet are listed here. We reply in the same thread, and Sireneum closes a flag once it's resolved." },
    { target: () => $("bRefresh"), title: "Start with Refresh",
      body: "Click <b>Refresh</b> at the start of each session so you're looking at the latest version. Keep the plan open in just <b>one</b> browser tab.<br><br>If you'd move or delete something we placed, leave a flag saying why." },
    { target: () => side("display"), open: () => side("display"), title: "Working at the same time",
      body: "If we've agreed to work on the plan together, turn on <b>Live updates</b> here. It turns itself off after 10 quiet minutes." },
    { target: () => $("bPrint"), title: "Print or save a PDF",
      body: "<b>Print / Export…</b> makes a to-scale PDF with the title block, notes and schedules." },
    { title: "You're all set",
      body: `Replay this tour any time with the <b>Guide</b> button at the top.<br><br>Questions: <a href="mailto:${CONTACT}">${CONTACT}</a>` },
  ]

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]) }

  /* ── styles (uses the app's own color tokens, so dark mode follows) ── */
  const css = document.createElement("style")
  css.textContent = `
  .tour-block{position:fixed;inset:0;z-index:80;background:transparent}
  .tour-spot{position:fixed;z-index:81;border-radius:6px;pointer-events:none;box-shadow:0 0 0 2px var(--ink),0 0 0 100vmax rgba(10,14,18,.55);transition:left .25s,top .25s,width .25s,height .25s}
  .tour-spot.none{left:50%!important;top:50%!important;width:0!important;height:0!important;box-shadow:0 0 0 100vmax rgba(10,14,18,.55)}
  .tour-card{position:fixed;z-index:82;width:min(360px,calc(100vw - 32px));background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:6px;box-shadow:0 12px 32px rgba(0,0,0,.28);padding:16px 18px 14px;font-family:var(--body);font-size:14px;line-height:1.5}
  .tour-card .tour-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--muted);text-transform:uppercase}
  .tour-card h3{font-family:var(--display);font-size:21px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;margin:4px 0 8px}
  .tour-card p{margin:0}
  .tour-card kbd{font-family:var(--mono);font-size:12px;border:1px solid var(--line);border-bottom-width:2px;border-radius:3px;padding:0 5px;background:var(--bg);white-space:nowrap}
  .tour-card .tour-shared{font-size:11px;color:var(--ok);letter-spacing:.04em;text-transform:uppercase;font-weight:600}
  .tour-nav{display:flex;align-items:center;gap:8px;margin-top:14px}
  .tour-dots{display:flex;gap:4px;margin-right:auto}
  .tour-dots i{width:6px;height:6px;border-radius:50%;background:var(--line)}
  .tour-dots i.on{background:var(--ink)}
  .tour-skip{background:none;border:none;color:var(--muted);cursor:pointer;padding:6px 4px;font-size:13px;text-decoration:underline}
  .tour-card.center{left:50%!important;top:50%!important;transform:translate(-50%,-50%);width:min(440px,calc(100vw - 32px))}
  @media (prefers-reduced-motion:reduce){.tour-spot{transition:none}}`
  document.head.appendChild(css)

  /* ── runtime ── */
  let i = 0, els = null, opened = []

  function start() {
    if (els) return
    els = {
      block: Object.assign(document.createElement("div"), { className: "tour-block" }),
      spot: Object.assign(document.createElement("div"), { className: "tour-spot" }),
      card: Object.assign(document.createElement("div"), { className: "tour-card" }),
    }
    els.card.setAttribute("role", "dialog")
    els.card.setAttribute("aria-modal", "true")
    els.card.setAttribute("aria-labelledby", "tourTitle")
    els.block.addEventListener("pointerdown", e => e.preventDefault())
    document.body.append(els.block, els.spot, els.card)
    window.addEventListener("keydown", onKey, true)
    window.addEventListener("resize", place)
    i = 0; show()
  }

  function end() {
    if (!els) return
    restore()
    Object.values(els).forEach(e => e.remove()); els = null
    window.removeEventListener("keydown", onKey, true)
    window.removeEventListener("resize", place)
    lsSet(KEY, TOUR_VERSION)
    $("bTour")?.focus()
  }

  function restore() { opened.forEach(d => { d.open = false }); opened = [] }

  function show() {
    restore()
    const s = STEPS[i]
    const d = s.open && s.open()
    if (d && !d.open) { d.open = true; opened.push(d) }
    const last = i === STEPS.length - 1
    els.card.innerHTML = `
      <div class="tour-eyebrow">Quick guide · ${i + 1} of ${STEPS.length}</div>
      <h3 id="tourTitle">${s.title}</h3>
      <p>${typeof s.body === "function" ? s.body() : s.body}</p>
      <div class="tour-nav">
        <span class="tour-dots" aria-hidden="true">${STEPS.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</span>
        ${last ? "" : `<button type="button" class="tour-skip" data-a="skip">Skip</button>`}
        ${i ? `<button type="button" class="btn" data-a="back">Back</button>` : ""}
        <button type="button" class="btn primary" data-a="next">${last ? "Start working" : i ? "Next" : "Show me"}</button>
      </div>`
    els.card.querySelectorAll("[data-a]").forEach(b => b.onclick = () => act(b.dataset.a))
    const t = s.target && s.target()
    if (t) t.scrollIntoView({ block: "nearest", inline: "nearest" })
    place()
    els.card.querySelector('[data-a="next"]').focus({ preventScroll: true })
  }

  function act(a) {
    if (a === "skip") return end()
    if (a === "back" && i > 0) { i--; return show() }
    if (a === "next") { if (i === STEPS.length - 1) return end(); i++; show() }
  }

  function onKey(e) {
    if (!els) return
    if (e.key === "Escape") { e.preventDefault(); end() }
    else if (e.key === "ArrowRight") { e.preventDefault(); act("next") }
    else if (e.key === "ArrowLeft") { e.preventDefault(); act("back") }
    else if (e.key === "Tab") {                       // keep focus inside the card
      const f = [...els.card.querySelectorAll("button,a[href]")]
      const k = f.indexOf(document.activeElement)
      e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus()
    }
    else if (e.key === "Enter" || e.key === " ") {
      if (els.card.contains(document.activeElement)) return   // let the focused button act
      e.preventDefault()
    }
    e.stopPropagation()                               // the plan's shortcuts stay quiet
  }

  function place() {
    if (!els) return
    const s = STEPS[i], t = s.target && s.target(), c = els.card
    const r = t && t.getBoundingClientRect()
    if (!r || (!r.width && !r.height)) {
      els.spot.className = "tour-spot none"; c.className = "tour-card center"; return
    }
    els.spot.className = "tour-spot"; c.className = "tour-card"
    const pad = s.pad ?? 6, vw = innerWidth, vh = innerHeight
    const box = { l: Math.max(4, r.left - pad), t: Math.max(4, r.top - pad), r: Math.min(vw - 4, r.right + pad), b: Math.min(vh - 4, r.bottom + pad) }
    Object.assign(els.spot.style, { left: box.l + "px", top: box.t + "px", width: (box.r - box.l) + "px", height: (box.b - box.t) + "px" })
    const cw = c.offsetWidth, ch = c.offsetHeight, gap = 14, m = 16
    const fits = { below: vh - box.b - gap >= ch + m, above: box.t - gap >= ch + m, right: vw - box.r - gap >= cw + m, left: box.l - gap >= cw + m }
    let x, y
    if (fits.right && box.b - box.t > vh * .45) { x = box.r + gap; y = box.t }
    else if (fits.left && box.b - box.t > vh * .45) { x = box.l - gap - cw; y = box.t }
    else if (fits.below) { y = box.b + gap; x = box.l }
    else if (fits.above) { y = box.t - gap - ch; x = box.l }
    else if (fits.right) { x = box.r + gap; y = box.t }
    else if (fits.left) { x = box.l - gap - cw; y = box.t }
    else { x = (vw - cw) / 2; y = vh - ch - m }       // big target: card over its lower edge
    c.style.left = Math.min(Math.max(m, x), vw - cw - m) + "px"
    c.style.top = Math.min(Math.max(m, y), vh - ch - m) + "px"
  }

  /* ── wait for the plan to open, add the Guide button, auto-start once ── */
  function ready() {
    const app = $("app")
    return app && !app.hidden && $("sheetSel")?.options.length > 0
  }
  function boot() {
    if (!$("bTour")) {
      const b = Object.assign(document.createElement("button"), { type: "button", className: "btn", id: "bTour", textContent: "Guide", title: "A quick tour of the plan tool" })
      b.onclick = start
      $("bRefresh")?.before(b)
    }
    const forced = new URLSearchParams(location.search).has("tour")
    const client = document.body.classList.contains("client")
    if (forced || (client && lsGet(KEY) !== TOUR_VERSION)) setTimeout(start, 600)
  }
  if (ready()) boot()
  else {
    const mo = new MutationObserver(() => { if (ready()) { mo.disconnect(); boot() } })
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] })
  }
})()
