import { Fragment, useEffect, useRef } from 'react'
import '../work/work.css'
import '../work/story.css'
import Menu from '../components/Menu.jsx'
import { story } from './story-copy.js'
// the question → response device, shared with the work pages
import { morph, Response, responseFor, useResolveMotion } from '../work/resolve.jsx'
import { useLandOn } from '../work/land.js'

/* ── Story ────────────────────────────────────────────────────
   The same shape as a project page, because it is the same idea.

   The visitor lands on the portrait. Climbing is *sireneum* — the
   design persona, the name, the myth, the way of working. Descending
   is *rachel* — chronological, a CV told as a story.

   Two accounts of one person, reached from the same middle.
   ─────────────────────────────────────────────────────────── */

function inline(text, key) {
  // **bold**, *italic*, and [text](url)
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/).map((chunk, j) => {
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return (
      <a key={`${key}-${j}`} href={link[2]} target="_blank" rel="noopener noreferrer">
        {link[1]}
      </a>
    )
    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4)
      return <strong key={`${key}-${j}`}>{chunk.slice(2, -2)}</strong>
    if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2)
      return <em key={`${key}-${j}`}>{chunk.slice(1, -1)}</em>
    return chunk.replace(/\s+/g, ' ')
  })
}

function prose(text) {
  return text.trim().split(/\n\s*\n/).map((block, i) => {
    const lines = block.trim().split(/\n/).map(l => l.trim()).filter(Boolean)
    const ordered   = lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l))
    const unordered = lines.length > 1 && lines.every(l => /^-\s/.test(l))
    // a block whose lines all begin `> ` is a verse: the lines stack tight,
    // so the group lands on the eye as one beat instead of separate thoughts
    const verse     = lines.every(l => /^>\s/.test(l))
    if (verse) {
      return (
        <div key={i} className="verse">
          {lines.map((l, j) => <p key={j}>{inline(l.replace(/^>\s/, ''), `${i}-${j}`)}</p>)}
        </div>
      )
    }
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

function Section({ item, id }) {
  const figs = item.media || []
  // a section that names a `resolve` line hands its bold words to the
  // response above it, so its body is split into movable pieces
  const cls = `sec sec-say rise${item.resolve ? ' morph' : ''}${item.feature ? ' feature' : ''}`
  return (
    <>
      <section className={cls} data-rung={id}>
        <div className="sec-inner">
          <div className="sec-label">{item.label}</div>
          <div>
            {item.title && <h2>{item.title}</h2>}
            {item.resolve ? morph(item) : prose(item.body)}
          </div>
        </div>
      </section>

      {figs.length > 0 && (
        <section className="sec sec-show rise">
          <div className="sec-inner">
            <div className={`figs${figs.length === 2 ? ' two' : ''}`}>
              {figs.map((f, n) => (
                <figure key={n}>
                  <div className="crop">
                    <img src={f.src} alt={f.alt || ''} loading="lazy" />
                  </div>
                  {f.caption && <figcaption className="fig-cap">{f.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

/* The poem and the introduction, first thing reached descending. */
function Intro({ intro }) {
  return (
    <section className="sec sec-intro rise">
      <div className="sec-inner">
        <aside className="poem">
          <div className="poem-head"><span>{intro.poem.title}</span></div>
          <div className="poem-lines">
            {intro.poem.lines.map((l, i) => <p key={i}>{l}</p>)}
          </div>
          <div className="poem-by">— {intro.poem.by}</div>
        </aside>
        <div className="narrative">{prose(intro.narrative)}</div>
      </div>
    </section>
  )
}

/* One CV section: a label in the gutter, entries on a timeline spine.
   `when` is optional — without it an entry still sits on the spine, so
   a list and a chronology read as one document. */
function CVSection({ item }) {
  return (
    <section className="sec sec-say sec-cv rise">
      <div className="sec-inner">
        <div className="sec-label">{item.label}</div>
        <div>
          {item.lede  && <p className="cv-lede">{item.lede}</p>}

          {item.creed && (
            <dl className="cv-creed">
              {item.creed.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          )}

          {item.chant && (
            <div className="cv-chant">
              {item.chant.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          )}

          {item.body && prose(item.body)}
          {item.note && <p className="cv-note-top">{item.note}</p>}

          {item.entries && (
            <div className="cv-entries">
              {item.entries.map((e, i) => (
                <div className="cv-entry" key={i}>
                  <div className="cv-when">
                    {e.when}
                    {e.badge && (
                      /* the badge goes where the title goes — to the
                         verification record, not to the image file */
                      <a className="cv-badge-link" href={e.href || e.badge}
                         target="_blank" rel="noopener noreferrer"
                         aria-label={`Verify: ${e.title.replace(/\s+/g, ' ')}`}>
                        <img className="cv-badge" src={e.badge} alt="" />
                      </a>
                    )}
                  </div>
                  <div className="cv-what">
                    <div className="cv-title">
                      {e.href
                        ? <a href={e.href}>{e.title}</a>
                        : e.title}
                      {e.org && <span className="cv-org">{e.org.replace(/\s+/g, ' ')}</span>}
                    </div>
                    {e.note && <p className="cv-note">{e.note.replace(/\s+/g, ' ')}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
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

export default function Story() {
  const heroRef = useRef(null)

  useEffect(() => { document.title = 'Story — Sireneum' }, [])

  /* land on the portrait, with sireneum sitting above it */
  useLandOn(heroRef, story)

  useResolveMotion(story)

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 })
    document.querySelectorAll('.rise').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // authored outward from the portrait, so it plays inward
  const up = [...story.sireneum].reverse()

  // the central question sits at the far end of the climb and its words
  // fly up into the response above it — same device as the work pages
  const { before: responseBefore, lines: responseLines } =
    responseFor(up, n => `up-${n}`)

  return (
    <div className="work-root story-doc">
      <Menu delay={0} />

      {/* ── climbing: sireneum ── */}
      {up.map((s, n) => (
        <Fragment key={`up-${n}`}>
          {n === responseBefore && <Response lines={responseLines} atTop={n === 0} />}
          <Section item={s} id={`up-${n}`} />
        </Fragment>
      ))}

      {/* ── the landing ──────────────────────────────────────
          Not a portrait band any more. The poem sits left, the
          introduction right, and the headshot with the name above
          them — small, because the words are the subject here.
          ─────────────────────────────────────────────────── */}
      <div className="landing" ref={heroRef}>
        <div className="landing-inner">

          <div className="landing-head">
            <div className="landing-id">
              <h1>{story.title}</h1>
              {story.hero.role && <div className="landing-role">{story.hero.role}</div>}
              <dl>
                {story.hero.lines.map(([term, value, note]) => (
                  <div className="hero-row" key={term}>
                    <dt>{term}</dt>
                    <dd>
                      {inline(value, term)}
                      {note && <span className="hero-scope">{note.replace(/\s+/g, ' ')}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="headshot">
              {story.hero.src
                ? <img src={story.hero.src} alt={story.hero.alt} />
                : <span className="shot-ph" style={{ aspectRatio: '4 / 5' }}>
                    <span>{story.hero.alt}</span>
                  </span>}
              {story.hero.credit && <figcaption>{story.hero.credit}</figcaption>}
            </figure>
          </div>

        </div>

        <span className="land-dir up" aria-hidden="true"><Arrow dir="up" />{story.up}</span>
        <span className="land-dir down" aria-hidden="true">{story.down}<Arrow dir="down" /></span>
      </div>

      {/* ── descending: rachel ──
          No marker here: the landing already names this direction on the
          image itself, and repeating it read as a second heading. */}
      <Intro intro={story.intro} />
      {story.cv.filter(c => !c.hidden).map((c, n) => <CVSection item={c} key={`cv-${n}`} />)}

      <div className="work-shell" style={{ paddingTop: 0 }}>
        <nav className="work-nav">
          <div>
            <a href="/work">
              <span className="nav-dir">The work</span>
              <span className="nav-title">Architecture</span>
            </a>
          </div>
          <div style={{ textAlign: 'right' }}>
            <a href="/process">
              <span className="nav-dir">How I think</span>
              <span className="nav-title">Process</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  )
}
