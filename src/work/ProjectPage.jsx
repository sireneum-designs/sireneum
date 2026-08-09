import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './work.css'
import './story.css'
import { projects, getProject, projectIndex } from './projects.js'
import Menu from '../components/Menu.jsx'
import PlanSpots, { PlanKey } from './PlanSpots.jsx'
import { ViewerProvider, useViewer } from './Viewer.jsx'
import WaveBed from './WaveBed.jsx'
import { SoundProvider } from './Sound.jsx'

/* ── Project page ─────────────────────────────────────────────
   A ladder of abstraction, told as a page that actually scrolls.

   The project sits at the middle and the page opens there. Above it,
   climbing, is *why* — each section a wider frame. Below, descending,
   is *how* — closer to the material, ending in the set.

   No sticky stage, no crossfade. Images travel up and off, text
   arrives beneath them. The only motion beyond scrolling is a single
   gentle rise as each section enters, once.
   ─────────────────────────────────────────────────────────── */

function inline(text, key) {
  // **two asterisks** = bold, *one* = italic
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((chunk, j) => {
    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4)
      return <strong key={`${key}-${j}`}>{chunk.slice(2, -2)}</strong>
    if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2)
      return <em key={`${key}-${j}`}>{chunk.slice(1, -1)}</em>
    return chunk.replace(/\s+/g, ' ')
  })
}

/* A question set to come apart.

   Each word is its own inline-block carrying a fixed direction and
   distance. A single `--gone` value on the section, written by the
   scroll handler below, drives all of them at once — so the whole
   line disperses as you climb away from it and draws back together
   on the way down. Nothing is remembered; it is purely positional.  */
function hash(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

/* ── the response ─────────────────────────────────────────────
   Two paragraphs on this page each hand a phrase to a third thing
   sitting between them: the precedent gives `past + present =`, the
   central question gives `modern :: original`.

   Neither paragraph is consumed. The response lines are separate
   copies that *rise out of* their source words — starting exactly on
   top of them, at their size, and travelling into place as you climb
   past. The originals stay where they are and stay readable.

   `rung.resolve` names the line. Any word in it that also appears, in
   order, inside a **bold** run of that rung's body is a survivor and
   gets flown; everything else in the line is a connector that fades.
   ─────────────────────────────────────────────────────────── */
function parseResolve(rung) {
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
function morph(rung) {
  const { claimed, parts, isB, norm } = parseResolve(rung)
  let run = 0   // index into the bold runs
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

  return parts.map((chunks, pi) => (
    <p className="q" key={pi}>
      {chunks.map((chunk, ci) => {
        if (!isB(chunk)) {
          return norm(chunk).split(' ').filter(Boolean).map((word) => {
            const i = w++
            return (
              <span className="w" key={`${ci}-${i}`} style={vec(i)}>
                {word}{' '}
              </span>
            )
          })
        }
        const k = run++
        const rec = claimed.get(k)
        const text = norm(chunk.slice(2, -2))

        // a run claimed whole stays whole, and flies as one piece
        if (rec?.whole) {
          const i = w++
          return (
            <span className="w keep" data-k={`${k}`} key={`${ci}-${i}`} style={vec(i)}>
              <strong>{text}</strong>{' '}
            </span>
          )
        }
        return text.split(' ').map((word) => {
          const i = w++
          const keep = rec?.words.has(word)
          return (
            <span className={`w${keep ? ' keep' : ''}`}
                  data-k={keep ? `${k}:${word}` : undefined}
                  key={`${ci}-${i}`} style={vec(i)}>
              <strong>{word}</strong>{' '}
            </span>
          )
        })
      })}
    </p>
  ))
}

function Poem({ poem }) {
  return (
    <section className={`sec sec-poem rise${poem.video || poem.still ? ' over-video' : ''}`}>
      {poem.video && (
        <video className="poem-bed" src={poem.video} poster={poem.poster}
               autoPlay muted loop playsInline aria-hidden="true" />
      )}
      {poem.still && <WaveBed still={poem.still} />}
      <div className="sec-inner">
        <aside className="poem">
          <div className="poem-head"><span>{poem.title}</span></div>
          {poem.subtitle && <div className="poem-sub">{poem.subtitle}</div>}
          <div className="poem-lines">
            {poem.stanzas.map((st, i) => (
              <div className="stanza" key={i}>
                {st.map((l, j) => <p key={j}>{l}</p>)}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

function Response({ lines, atTop }) {
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
              data-src={ln.src}
              style={{ '--lag': ln.lag }}
              key={i}
            >
              {ln.tokens.map((t, j) =>
                <span className={t.fly ? 'rw' : 'sep'} data-k={t.key} key={j}>{t.t}</span>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/* captions take [text](url), for image credits */
function caption(text) {
  return text.replace(/\s+/g, ' ').split(/(\[[^\]]+\]\([^)]+\))/).map((chunk, j) => {
    const m = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m
      ? <a key={j} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
      : chunk
  })
}

function prose(text) {
  return text.trim().split(/\n\s*\n/).map((block, i) => {
    const lines = block.trim().split(/\n/).map(l => l.trim()).filter(Boolean)
    const ordered   = lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l))
    const unordered = lines.length > 1 && lines.every(l => /^-\s/.test(l))
    if (ordered || unordered) {
      const List = ordered ? 'ol' : 'ul'
      return (
        <List key={i} className="rung-list">
          {lines.map((l, j) => <li key={j}>{inline(l.replace(/^(\d+\.|-)\s/, ''), `${i}-${j}`)}</li>)}
        </List>
      )
    }
    return <p key={i}>{inline(block, i)}</p>
  })
}

/* An image, or — where the file does not exist yet — a labelled box of
   the right proportion standing in for it. Lets a page be laid out and
   judged before a single asset has been exported. */
function Shot({ item, className, style }) {
  if (!item.src) {
    return (
      <span className="shot-ph" style={{ aspectRatio: item.ar || '4 / 3', ...style }}>
        <span>{item.alt || 'image'}</span>
      </span>
    )
  }
  return (
    <img src={item.src} alt={item.alt || ''} className={className}
         style={style} loading="lazy" />
  )
}

function Fig({ item }) {
  const matted = item.kind === 'drawing' || item.kind === 'diagram'
  if (!item.src) {
    return (
      <figure>
        <div className="media-placeholder"><span className="ph-alt">{item.alt}</span></div>
      </figure>
    )
  }
  // fills its column, but never scaled up past the file's own pixels
  const natural = item.actualSize
    ? { width: '100%', maxWidth: `${item.actualSize}px` }
    : undefined
  return (
    <figure className={item.actualSize ? 'natural' : undefined}>
      {matted
        ? <div className="mat"><img src={item.src} alt={item.alt || ''} style={natural} loading="lazy" /></div>
        : <div className="crop"><img src={item.src} alt={item.alt || ''} style={natural} loading="lazy" /></div>}
      {item.caption && <figcaption className="fig-cap">{caption(item.caption)}</figcaption>}
    </figure>
  )
}

/* ── strip ────────────────────────────────────────────────────
   Three sheets at the width of the text above them, the middle one
   standing forward and overlapping its neighbours — a sheet lifted
   off a table, the rest still lying there.

   The track is moved by transform rather than by scrolling, because a
   scroller clips: the middle sheet has to be able to grow past the
   row it sits in. Sheets keep the drawing's own 11×17, so nothing is
   cropped, and clicking opens one full size.
   ─────────────────────────────────────────────────────────── */
function Strip({ items, onOpen, ar }) {
  const N = items.length
  const [playing, setPlaying] = useState(-1)
  // Three copies of the run, sitting at the middle one. Stepping past
  // either end quietly rebases to the equivalent sheet in the middle
  // copy with the transition off, so there is always another sheet
  // waiting on both sides and the seam is never visible.
  const loop = [...items, ...items, ...items]
  const [at, setAt] = useState(N)
  const [glide, setGlide] = useState(true)

  useEffect(() => {
    if (at >= N && at < 2 * N) return
    const id = setTimeout(() => {
      setGlide(false)
      setAt(N + (((at % N) + N) % N))
    }, 660)
    return () => clearTimeout(id)
  }, [at, N])

  // put the transition back on once the rebase has painted
  useEffect(() => {
    if (glide) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setGlide(true)))
    return () => cancelAnimationFrame(id)
  }, [glide])

  const here = ((at % N) + N) % N

  return (
    <div
      className="strip"
      style={{ '--ar': ar || items[0]?.ar || '17 / 11' }}
      tabIndex={0}
      role="group"
      aria-label="Drawings"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); setAt(at - 1) }
        if (e.key === 'ArrowRight') { e.preventDefault(); setAt(at + 1) }
      }}
    >
      <div className={`strip-track${glide ? '' : ' still'}`} style={{ '--i': at }}>
        {loop.map((it, n) => (
          <div className={`strip-cell${n === at ? ' on' : ''}${it.video ? ' clip' : ''}${playing === n ? ' playing' : ''}`} key={n}>
            <button
              className="strip-sheet"
              onClick={(e) => {
                if (n !== at) return setAt(n)
                // a clip plays where it stands; a drawing opens full size
                if (!it.video) return onOpen(n % N)
                const v = e.currentTarget.querySelector('video')
                if (!v) return
                if (v.paused) v.play().catch(() => {})
                else v.pause()
              }}
              tabIndex={n === at ? 0 : -1}
              aria-hidden={n < N || n >= 2 * N ? true : undefined}
              aria-label={n !== at
                ? `Show ${it.title || it.alt}`
                : it.video ? `Play ${it.title || it.alt}` : `Enlarge ${it.title || it.alt}`}
            >
              {it.video
                ? <video src={it.video} poster={it.src} muted loop playsInline preload="metadata"
                         className={it.fit === 'contain' ? 'contain' : undefined}
                         onPlay={() => setPlaying(n)}
                         onPause={() => setPlaying(p => (p === n ? -1 : p))} />
                : <Shot item={it} className={it.fit === 'contain' ? 'contain' : undefined} />}
              {it.video && <span className="strip-play" aria-hidden="true">▶</span>}
              <span className="strip-face">
                {it.sub && <span className="strip-sub">{it.sub}</span>}
                <span className="strip-title">{it.title || it.alt}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <button className="strip-arrow left" onClick={() => setAt(at - 1)}
              aria-label="Previous">‹</button>
      <button className="strip-arrow right" onClick={() => setAt(at + 1)}
              aria-label="Next">›</button>

      <div className="strip-dots">
        {items.map((it, n) => (
          <button key={n} className={`strip-dot${n === here ? ' on' : ''}`}
                  onClick={() => setAt(N + n)} aria-label={it.title || it.alt} />
        ))}
      </div>
    </div>
  )
}

/* one rung → a text section, then its pictures */
function Rung({ rung, climbing, id }) {
  const open = useViewer()
  // everything clickable in this rung, in reading order
  const gallery = [
    ...(rung.plans || []),
    ...(rung.plan ? [rung.plan] : []),
    ...(rung.collage || []),
    ...(rung.carousel || []),
    ...(rung.media || []),
    ...(rung.rows || []),
  ]
  const carouselOffset = (rung.plans || []).length + (rung.plan ? 1 : 0) + (rung.collage || []).length
  const asideOffset = carouselOffset + (rung.carousel || []).length
  const aside = (rung.media || []).filter(m => m.beside)
  const stacked = (rung.media || []).filter(m => !m.beside)
  const said = (rung.title || rung.body) && (
    <section
      className={`sec sec-say rise${rung.resolve ? ' morph' : ''}${rung.feature ? ' feature' : ''}${aside.length ? ' with-aside' : ''}`}
      data-rung={id}
    >
      <div className="sec-inner">
        <div className="sec-label">{rung.scale}</div>
        <div>
          {rung.title && <h2>{rung.title}</h2>}
          {rung.body && (rung.resolve ? morph(rung) : prose(rung.body))}
        </div>
        {rung.rows && (
          <div className="paired">
            {rung.rows.map((r, n) => (
              <Fragment key={n}>
                <figure className="paired-fig">
                  <button className="mat plate"
                          onClick={() => open(gallery, asideOffset + n)}
                          aria-label={`Enlarge ${r.alt}`}>
                    <Shot item={r} />
                  </button>
                  {r.caption && <figcaption className="fig-cap">{caption(r.caption)}</figcaption>}
                </figure>
                <div className="paired-text">{prose(r.body)}</div>
              </Fragment>
            ))}
            {rung.closing && (
              <div className="paired-close">{morph(rung)}</div>
            )}
          </div>
        )}

        {aside.length > 0 && (
          <div className={`say-asides${aside.length > 1 ? ' many' : ''}`}>
            {aside.map((m, n) => (
              <figure className="say-aside" key={n}>
                <button className="mat plate" onClick={() => open(gallery, asideOffset + n)}
                        aria-label={`Enlarge ${m.alt}`}>
                  <Shot item={m} />
                </button>
                {m.caption && <figcaption className="fig-cap">{caption(m.caption)}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )

  // Climbing, the page is read bottom to top, so the pictures sit
  // above their words. A strip does the same in either direction: the
  // drawings lead and the paragraph reads as a caption under them.
  const textLast = climbing || !!rung.carousel
  return (
    <>
      {!textLast && said}

      {rung.pair && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <div className="pair">
              {rung.pair.map((p, n) => (
                <figure key={n}>
                  <button className="frame" onClick={() => open(rung.pair, n)}
                          aria-label={`Enlarge ${p.alt}`}>
                    <Shot item={p} style={{ objectPosition: p.focus || 'center' }} />
                    {p.caption && <span className="on-image">{p.caption}</span>}
                  </button>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {stacked.length > 0 && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <div className={`figs${stacked.length === 2 ? ' two' : ''}`}>
              {stacked.map((item, n) => <Fig item={item} key={n} />)}
            </div>
          </div>
        </section>
      )}

      {(rung.plans || rung.plan) && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <div className="plans">
              {(rung.plans || []).map((pl, n) => (
                <figure key={n}>
                  <button className="mat plate keyed" onClick={() => open(gallery, n)}
                          aria-label={`Enlarge ${pl.alt}`}>
                    <Shot item={pl} />
                    {pl.caption && <span className="plan-title">{pl.caption}</span>}
                    <PlanKey plan={pl} />
                  </button>
                </figure>
              ))}
              {rung.plan && (
                <PlanSpots
                  plan={rung.plan}
                  onEnlarge={() => open(gallery, (rung.plans || []).length)}
                  onSpot={(i) => open(rung.plan.spots, i)}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {rung.carousel && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <Strip
              items={rung.carousel}
              ar={rung.carouselAr}
              onOpen={(n) => open(gallery, carouselOffset + n)}
            />
          </div>
        </section>
      )}

      {rung.collage && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <div className="collage">
              {rung.collage.map((c, n) => (
                <figure key={n} className={[c.tall && 'tall', c.legend && 'legend']
                                             .filter(Boolean).join(' ') || undefined}>
                  <button className="mat plate"
                          onClick={() => open(gallery, (rung.plans||[]).length + (rung.plan?1:0) + n)}
                          aria-label={`Enlarge ${c.alt}`}>
                    <Shot item={c} />
                  </button>
                  {c.caption && <figcaption className="fig-cap">{caption(c.caption)}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
      {textLast && said}
    </>
  )
}

/* ── route marker ─────────────────────────────────────────────
   The two directions out of the landing need to read as *paths*, not
   as titles. So they are drawn the way a callout is drawn on a sheet:
   a leader line running out of the image, a bubble on it, and an
   arrowhead carrying on in the direction of travel.

   Same convention above and below, mirrored — which is what makes the
   pair legible as one diagram rather than two labels.
   ─────────────────────────────────────────────────────────── */
function Route({ dir, word }) {
  return (
    <div className={`route ${dir}`} aria-hidden="true">
      <span className="route-stem short" />
      <span className="route-bubble">
        <span className="route-aka">a.k.a.</span>
        <span className="route-word">the {word}</span>
      </span>
      <span className="route-stem long" />
      <Arrow dir={dir} />
    </div>
  )
}

function Arrow({ dir }) {
  const up = dir === 'up'
  return (
    <svg className={`dir-arrow ${dir}`} width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true">
      <path d={up ? 'M1 8L7.5 1.5L14 8' : 'M1 1L7.5 7.5L14 1'}
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProjectPage({ slug }) {
  const project = getProject(slug)
  const heroRef = useRef(null)

  useEffect(() => {
    if (project) document.title = `${project.title} — Rachel Dudley`
  }, [project])

  /* open at the project, with the *why* sitting above it */
  useLayoutEffect(() => {
    if (!project) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const el = heroRef.current
    if (el) window.scrollTo(0, el.offsetTop)
  }, [project])

  /* Two scroll-linked things, on one loop.

     The response lines rise out of the words that made them: each copy
     is measured against its source word and the delta stored as
     `--fx/--fy/--fs`, then run backwards — at progress 0 the copy sits
     exactly on top of its original at the original's size, at 1 it has
     arrived. The central question's words scatter on their own, later
     progress.

     All of it is positional, so scrolling back runs it in reverse and
     there is no state to reset. */
  useEffect(() => {
    if (!project) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lines  = [...document.querySelectorAll('.response-line')]
    const morphs = [...document.querySelectorAll('.sec-say.morph')]
    const block  = document.querySelector('.sec-response')

    // where the response lines come to rest, once the page can climb
    // no further — the whole assembly is timed against this
    let restMid = 0
    const findRest = () => {
      const stack = block?.querySelector('.response-stack')
      if (!stack) return
      const r = stack.getBoundingClientRect()
      restMid = r.top + window.scrollY + r.height / 2
    }

    const measure = () => {
      // neutralise both transforms first, or we measure the animation
      morphs.forEach(el => el.style.setProperty('--gone', '0'))
      lines.forEach(l => l.style.setProperty('--t', '1'))
      lines.forEach(line => {
        const src = document.querySelector(`.sec-say[data-rung="${line.dataset.src}"]`)
        if (!src) return
        const to = [...line.querySelectorAll('.rw')]
        to.forEach((t) => {
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
      })
      lines.forEach(l => l.style.removeProperty('--t'))
      findRest()
    }

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
        // further than the page can actually scroll. On a page with
        // something above the response — a poem, say — that is half the
        // screen; on one where the response is the first thing, it is
        // wherever the page runs out. Either way the words arrive
        // somewhere you can see them, which the old fixed reading of
        // scroll position could not guarantee.
        const stack = block.querySelector('.response-stack')
        const r = stack.getBoundingClientRect()
        const mid = r.top + r.height / 2
        // high enough that the question below it is still on screen and
        // legible once it has reassembled — settling at mid-height left
        // the answer stranded at the bottom edge
        const rest = Math.min(restMid, vh * 0.3)
        t = clamp01(1 - (rest - mid) / (vh * 0.85))
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
  }, [project])

  /* one gentle rise per section, once */
  useEffect(() => {
    if (!project) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 })
    document.querySelectorAll('.rise').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [project])

  if (!project) {
    return (
      <div className="work-root">
        <Menu delay={0} />
        <div className="work-shell">
          <h1 className="work-title">Not found</h1>
          <p className="work-tagline">
            No project at that address.{' '}
            <a href="/work" style={{ color: 'var(--taupe-full)' }}>See all work →</a>
          </p>
        </div>
      </div>
    )
  }

  const i    = projectIndex(slug)
  const prev = i > 0 ? projects[i - 1] : null
  const next = i < projects.length - 1 ? projects[i + 1] : null
  const why  = [...(project.why || [])].reverse()   // authored outward, plays inward

  // Every rung that names a `resolve` line contributes one line to the
  // response, which sits at the far end of the climb — the last thing
  // reached, drawing its words up out of everything below it.
  const sources = why.map((r, n) => ({ r, n })).filter(x => x.r.resolve)
  const responseBefore = sources.length ? sources[0].n : -1
  const responseLines = [...sources]
    .sort((a, b) => b.n - a.n)          // back into authored order
    .map(({ r, n }) => ({
      src: `why-${n}`,
      lead: !!r.feature,
      lag: r.feature ? 0 : 0.22,
      tokens: parseResolve(r).tokens,
    }))

  return (
   <ViewerProvider>
    <SoundProvider src={project.poem?.audio} credit={project.poem?.credit}>
    <div className={`work-root story-doc${project.hero?.light ? ' on-light' : ''}`}>
      <Menu delay={0} />

      {/* ── climbing: why ── */}
      {project.poem && <Poem poem={project.poem} />}
      {project.banner && (
        <section className="sec sec-banner rise">
          <img src={project.banner.src} alt={project.banner.alt || ''} />
        </section>
      )}
      {why.map((r, n) => (
        <Fragment key={`why-${n}`}>
          {n === responseBefore && <Response lines={responseLines} atTop={n === 0} />}
          <Rung rung={r} climbing id={`why-${n}`} />
        </Fragment>
      ))}
      {why.length > 0 && <Route dir="up" word="why" />}

      {/* ── the hero ── */}
      <div className={`story-hero${project.hero?.src ? '' : ' empty'}`} ref={heroRef}>
        {project.hero?.video ? (
          <video
            src={project.hero.video}
            poster={project.hero.src || undefined}
            autoPlay muted loop playsInline
            aria-label={project.hero.alt || ''}
          />
        ) : project.hero?.src ? (
          <img src={project.hero.src} alt={project.hero.alt || ''} />
        ) : (
          <span className="ph-alt">{project.hero?.alt}</span>
        )}

        {project.hero?.credit && (
          <span className="hero-credit">{project.hero.credit}</span>
        )}

        <span className="hero-dir2 up" aria-hidden="true"><Arrow dir="up" />meaning</span>

        <div className="hero-card">
          <h1>{project.title}</h1>
          {project.subtitle && <div className="hero-said">{project.subtitle}</div>}
          {project.location && <div className="hero-where">{project.location}</div>}
          <dl>
            {project.hero?.overlay?.lines.map(([term, value, scope]) => (
              <div className="hero-row" key={term}>
                <dt>{term}</dt>
                <dd>
                  {Array.isArray(value)
                    ? value.map((v, i) => (
                        <span className="hero-line" key={i}>{v.replace(/\s+/g, ' ')}</span>
                      ))
                    : value}
                  {scope && <span className="hero-scope">{scope.replace(/\s+/g, ' ')}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <span className="hero-dir2 down" aria-hidden="true">making<Arrow dir="down" /></span>
      </div>

      {/* ── descending: how ── */}
      {(project.how || []).length > 0 && <Route dir="down" word="how" />}
      {(project.how || []).map((r, n) => <Rung rung={r} id={`how-${n}`} key={`how-${n}`} />)}

      <div className="work-shell" style={{ paddingTop: 0 }}>
        <nav className="work-nav">
          <div>{prev && (
            <a href={`/work/${prev.slug}`}>
              <span className="nav-dir">← Previous</span>
              <span className="nav-title">{prev.title}</span>
            </a>)}
          </div>
          <div style={{ textAlign: 'right' }}>{next && (
            <a href={`/work/${next.slug}`}>
              <span className="nav-dir">Next →</span>
              <span className="nav-title">{next.title}</span>
            </a>)}
          </div>
        </nav>
      </div>
    </div>
    </SoundProvider>
   </ViewerProvider>
  )
}
