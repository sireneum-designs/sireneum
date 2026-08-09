import { useEffect } from 'react'

/* ── question → response ──────────────────────────────────────
   The device at the top of every climbing page, kept in one place
   so the work pages and the story page behave identically.

   A section that names a `resolve` line hands that line to the
   response block sitting above it. Any word in the line that also
   appears, in order, inside a **bold** run of the section's body is
   a survivor: a copy of it starts sitting exactly on top of the
   original, at the original's size, and travels up into the response
   as you climb past. Everything else in the line is a connector and
   simply fades in.

   Meanwhile the question itself comes apart and settles back — read,
   scattered, returned — so it is still legible beneath the finished
   answer at the top of the page.

   All of it is positional. Scrolling back runs it in reverse and
   there is no state to reset.
   ─────────────────────────────────────────────────────────── */

export function hash(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function parseResolve(rung) {
  const isB   = c => c.startsWith('**') && c.endsWith('**') && c.length > 4
  const norm  = t => t.replace(/\s+/g, ' ').trim()
  // a rung built of paired rows carries its bold words in the closing
  // line rather than in a body, so that is where the line comes from
  const source = rung.closing || rung.body
  const parts = source.trim().split(/\n\s*\n/).map(b => b.split(/(\*\*[^*]+\*\*)/))
  const spec  = norm(rung.resolve).split(' ')

  // Every bold run in the body, in reading order. A run is the atom we
  // try to match first — that is what lets a resolved line carry a
  // phrase like `change shape` and not just single words.
  const runs = []
  parts.forEach(chunks => chunks.forEach(c => {
    if (isB(c)) runs.push(norm(c.slice(2, -2)))
  }))

  // Walk the resolved line, claiming runs as we go. A run matches
  // either whole — its text equal to the next few tokens — or, failing
  // that, by any single word inside it.
  // Each flown piece carries a key naming the run it came from, and
  // the copy in the resolved line carries the same key. Pairing on
  // that rather than on position means the resolved line can put the
  // words in a different order from the sentence they came out of.
  const claimed = new Map()      // run index → { whole } | { words:Set }
  const taken   = new Set()
  const tokens  = []
  let i = 0
  while (i < spec.length) {
    let hit = null
    for (let k = 0; k < runs.length && !hit; k++) {
      const words = runs[k].split(' ')
      const key   = `${k}`
      if (!taken.has(key) && words.every((w, n) => spec[i + n] === w)) {
        hit = { k, len: words.length, whole: true, key }
      }
    }
    for (let k = 0; k < runs.length && !hit; k++) {
      const words = runs[k].split(' ')
      const key   = `${k}:${spec[i]}`
      if (taken.has(key)) continue
      // Exact word, or a shared stem — so a resolved line can read
      // `adapt` where the sentence says `adaptation`, or `preservation`
      // where it says `preserving`. Five characters of agreement, and
      // at least 60% of the shorter word, which is tight enough that
      // two unrelated words will not be mistaken for each other.
      const stem = (a, b) => {
        let n = 0
        while (n < a.length && n < b.length && a[n] === b[n]) n++
        return n >= 5 && n >= Math.min(a.length, b.length) * 0.6
      }
      const word = words.find(w => w === spec[i] || stem(w, spec[i]))
      if (word) hit = { k, len: 1, whole: false, word, key }
    }
    if (hit) {
      const rec = claimed.get(hit.k) || { whole: false, words: new Set() }
      if (hit.whole) rec.whole = true
      else rec.words.add(hit.word)
      claimed.set(hit.k, rec)
      taken.add(hit.key)
      tokens.push({ t: spec.slice(i, i + hit.len).join(' '), fly: true, key: hit.key })
      i += hit.len
    } else {
      tokens.push({ t: spec[i], fly: false })
      i += 1
    }
  }
  return { tokens, claimed, parts, isB, norm }
}

/* a body split so each piece can be moved, and each survivor found
   again by the measuring pass */
export function morph(rung) {
  const { claimed, isB, norm } = parseResolve(rung)
  const source = rung.closing || rung.body
  let run = 0   // index into the bold runs, in reading order
  let w = 0     // index over all pieces, for the scatter vectors
  const vec = (i) => {
    const angle = hash(i) * Math.PI * 2
    const dist  = 70 + hash(i + 100) * 130
    return {
      '--dx':  (Math.cos(angle) * dist).toFixed(1),
      '--dy':  (Math.sin(angle) * dist * 0.7 + 40).toFixed(1),
      '--rot': ((hash(i + 200) - 0.5) * 40).toFixed(1),
      '--lag': (hash(i + 300) * 0.28).toFixed(3),
    }
  }

  /* Punctuation that follows a bold word belongs to it. Left on its own
     it became a separate inline-block and opened a gap — `safety , and`,
     `uncoerced ?`. So it is lifted out of the following chunk and hung on
     the end of the bold span, outside the <strong> the measuring pass
     reads, so neither the flight nor the word matching is affected. */
  const tailsFor = (chunks) => {
    const tails = []
    const kept  = chunks.slice()
    for (let i = 0; i < kept.length - 1; i++) {
      if (!isB(kept[i])) continue
      const m = kept[i + 1].match(/^\s*([,.;:!?)\]…—]+)/)
      if (!m) continue
      tails[i] = m[1]
      kept[i + 1] = kept[i + 1].slice(m[0].length)
    }
    return { kept, tails }
  }

  const pieces = (raw, key) => {
    const { kept, tails } = tailsFor(raw)
    return kept.map((chunk, ci) => {
      if (!isB(chunk)) {
        // *italics* survive the split too — each word keeps its own
        // span so it can still scatter, and an italic run simply
        // wraps every word inside it
        return norm(chunk).split(/(\*[^*]+\*)/).map((r, ri) => {
          const it = r.startsWith('*') && r.endsWith('*') && r.length > 2
          const text = it ? r.slice(1, -1) : r
          return text.split(' ').filter(Boolean).map((word) => {
            const i = w++
            return (
              <span className="w" key={`${key}-${ci}-${ri}-${i}`} style={vec(i)}>
                {it ? <em>{word}</em> : word}{' '}
              </span>
            )
          })
        })
      }
      const k = run++
      const rec = claimed.get(k)
      const text = norm(chunk.slice(2, -2))
      const tail = tails[ci] || ''

      // a run claimed whole stays whole, and flies as one piece
      if (rec?.whole) {
        const i = w++
        return (
          <span className="w keep" data-k={`${k}`} key={`${key}-${ci}-${i}`} style={vec(i)}>
            <strong>{text}</strong>{tail}{' '}
          </span>
        )
      }
      const words = text.split(' ')
      return words.map((word, wi) => {
        const i = w++
        const keep = rec?.words.has(word)
        return (
          <span className={`w${keep ? ' keep' : ''}`}
                data-k={keep ? `${k}:${word}` : undefined}
                key={`${key}-${ci}-${i}`} style={vec(i)}>
            <strong>{word}</strong>{wi === words.length - 1 ? tail : ''}{' '}
          </span>
        )
      })
    })
  }

  // Blocks whose lines all begin `> ` are verses: they keep the tight
  // stacking they have in ordinary prose, so a section does not lose its
  // rhythm just because it feeds a word to the response.
  return source.trim().split(/\n\s*\n/).map((block, pi) => {
    const lines = block.trim().split(/\n/).map(l => l.trim()).filter(Boolean)
    if (lines.every(l => /^>\s/.test(l))) {
      return (
        <div className="verse" key={pi}>
          {lines.map((l, li) => (
            <p className="q" key={li}>
              {pieces(l.replace(/^>\s/, '').split(/(\*\*[^*]+\*\*)/), `${pi}-${li}`)}
            </p>
          ))}
        </div>
      )
    }
    return (
      <p className="q" key={pi}>
        {pieces(block.split(/(\*\*[^*]+\*\*)/), pi)}
      </p>
    )
  })
}

export function Response({ lines, atTop }) {
  // Sitting at the head of the page it needs runway above it, or there
  // is no scroll left for the lines to assemble in.
  return (
    <section className={`sec sec-response rise${atTop ? ' at-top' : ''}`}>
      <div className="sec-inner">
        <div className="sec-label">response</div>
        <div className="response-stack">
          {lines.map((ln, i) => (
            <p
              className={`response-line${ln.lead ? ' lead' : ''}`}
              style={{ '--lag': ln.lag }}
              key={i}
            >
              {/* the source is named on the word, not the line, so one
                  line can draw its words out of several sections */}
              {ln.tokens.map((t, j) =>
                <span className={t.fly ? 'rw' : 'sep'}
                      data-k={t.key} data-src={t.src} key={j}>{t.t}</span>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Build the response lines for a climb. Every section that names a
   `resolve` contributes to the response; the block is rendered
   immediately before the first of them — the far end of the climb.

   A section gets its own line by default. Sections that share a
   `resolveLine` number are joined into one line instead, in authored
   order, so a single equation can draw its terms out of two different
   places in the story: `attention +` rising from one section and
   `safety =` from another still read as one line. */
export function responseFor(climb, idOf) {
  const sources = climb.map((r, n) => ({ r, n })).filter(x => x.r.resolve)
  const lines = []
  const byKey = new Map()

  ;[...sources]
    .sort((a, b) => b.n - a.n)          // back into authored order
    .forEach(({ r, n }) => {
      const key = r.resolveLine != null ? `line:${r.resolveLine}` : `own:${n}`
      let line = byKey.get(key)
      if (!line) {
        line = { lead: false, lag: 0.22, tokens: [] }
        byKey.set(key, line)
        lines.push(line)
      }
      // the question leads: it is set larger, and it arrives first
      if (r.feature) { line.lead = true; line.lag = 0 }
      parseResolve(r).tokens.forEach(t => line.tokens.push({ ...t, src: idOf(n) }))
    })

  return { before: sources.length ? sources[0].n : -1, lines }
}

/* The scroll-linked half: measure each response word against the word
   it came from, then run the delta backwards as the page climbs. */
export function useResolveMotion(dep) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lines  = [...document.querySelectorAll('.response-line')]
    const morphs = [...document.querySelectorAll('.sec-say.morph')]
    const block  = document.querySelector('.sec-response')
    if (!lines.length || !block) return

    // where the response lines come to rest, once the page can climb
    // no further — the whole assembly is timed against this
    let restMid = 0
    const findRest = () => {
      const stack = block?.querySelector('.response-stack')
      if (!stack) return
      const r = stack.getBoundingClientRect()
      restMid = r.top + window.scrollY + r.height / 2
    }

    // Sections carry a `rise` transform until they have entered the
    // viewport, and both the response and its sources are above the fold
    // when the page opens — so every rect was being read through a
    // translate that was not there by the time you scrolled to it. That
    // is what left words a little short of where they belonged.
    const risen = [block, ...morphs].filter(Boolean)
    const settled = (fn) => {
      const saved = risen.map(el => el.style.transform)
      risen.forEach(el => { el.style.transform = 'none' })
      try { fn() } finally {
        risen.forEach((el, i) => { el.style.transform = saved[i] })
      }
    }

    const measure = () => settled(() => {
      // neutralise both transforms first, or we measure the animation
      morphs.forEach(el => el.style.setProperty('--gone', '0'))
      lines.forEach(l => l.style.setProperty('--t', '1'))
      // every flown word finds its own source, so the words of one line
      // may have come out of different sections
      document.querySelectorAll('.response-line .rw').forEach((t) => {
        const src = document.querySelector(`.sec-say[data-rung="${t.dataset.src}"]`)
        if (!src) return
        const f = src.querySelector(`.keep[data-k="${t.dataset.k}"] strong`)
        if (!f) return
        const a = t.getBoundingClientRect()
        const b = f.getBoundingClientRect()
        if (!a.width || !b.width) return
        t.style.setProperty('--fx', (b.left - a.left).toFixed(1))
        t.style.setProperty('--fy',
          ((b.top + b.height / 2) - (a.top + a.height / 2)).toFixed(1))
        t.style.setProperty('--fs', (b.width / a.width).toFixed(4))
      })
      findRest()
      lines.forEach(l => l.style.removeProperty('--t'))
    })

    const clamp01 = v => Math.min(1, Math.max(0, v))

    let queued = false
    const paint = () => {
      queued = false
      const vh = window.innerHeight

      let t = 0
      if (block && restMid > 0) {
        // Measured off the lines themselves, not the section — the
        // section carries a tall pad above it for runway, and that pad
        // is inside its box, so measuring the box measured the middle
        // of the empty space.
        //
        // `rest` is where the lines finish: mid-screen normally, but no
        // further than the page can actually scroll.
        const stack = block.querySelector('.response-stack')
        const r = stack.getBoundingClientRect()
        const mid = r.top + r.height / 2
        // high enough that the question below it is still on screen and
        // legible once it has reassembled
        const rest = Math.min(restMid, vh * 0.3)
        // Arrive with room to spare. The lagging line only finishes at
        // t = 1 (its own 0.22 of lag plus 0.78 of travel), so timing that
        // to the exact end of the scroll left it permanently short of
        // home — and left the question permanently half scattered. The
        // last tenth of the climb is now spent arrived.
        t = clamp01((1 - (rest - mid) / (vh * 0.85)) / 0.9)
        block.style.setProperty('--t', t.toFixed(3))
      }

      // The question comes apart while the response is assembling and
      // settles back once it has. So it is read, then scattered, then
      // returned — sitting legibly beneath the finished lines at the
      // top of the climb rather than being left as a blur.
      const swell = Math.sin(Math.PI * t)
      morphs.forEach(el => {
        if (!el.classList.contains('feature')) return   // only the question scatters
        el.style.setProperty('--gone', swell.toFixed(3))
      })
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(paint)
    }
    const onResize = () => { measure(); paint() }

    measure()
    paint()
    document.fonts?.ready.then(onResize)   // webfonts change the metrics
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [dep])
}
