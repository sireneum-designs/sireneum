import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './work.css'
import './story.css'
import { projects, getProject, projectIndex } from './projects.js'
import Menu from '../components/Menu.jsx'
import PlanSpots, { PlanKey } from './PlanSpots.jsx'
import { ViewerProvider, useViewer } from './Viewer.jsx'
import WaveBed from './WaveBed.jsx'
import { SoundProvider } from './Sound.jsx'
// the question → response device, shared with the story page
import { morph, Response, responseFor, useResolveMotion } from './resolve.jsx'

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

/* ── project shuttle ─────────────────────────────────────────
   Previous and next, fixed at the edges and vertically centred, so a
   visitor can move between projects from anywhere on the page rather
   than scrolling to the foot to find the link. Deliberately quiet:
   a chevron that only names its destination on hover.
   ─────────────────────────────────────────────────────────── */
function Shuttle({ prev, next }) {
  return (
    <>
      {prev && (
        <a className="shuttle left" href={`/work/${prev.slug}`} aria-label={`Previous: ${prev.title}`}>
          <span className="shuttle-chev" aria-hidden="true">‹</span>
          <span className="shuttle-name">{prev.title}</span>
        </a>
      )}
      {next && (
        <a className="shuttle right" href={`/work/${next.slug}`} aria-label={`Next: ${next.title}`}>
          <span className="shuttle-name">{next.title}</span>
          <span className="shuttle-chev" aria-hidden="true">›</span>
        </a>
      )}
    </>
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

  useResolveMotion(project)

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
  const { before: responseBefore, lines: responseLines } =
    responseFor(why, n => `why-${n}`)

  return (
   <ViewerProvider>
    <SoundProvider src={project.poem?.audio} credit={project.poem?.credit}>
    <div className={`work-root story-doc${project.hero?.light ? ' on-light' : ''}`}>
      <Menu delay={0} />
      <Shuttle prev={prev} next={next} />

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
