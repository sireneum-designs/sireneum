import { useEffect, useRef, useState } from 'react'
import './work.css'
import { projects } from './projects.js'
import Menu from '../components/Menu.jsx'

/* ── The rack ─────────────────────────────────────────────────
   The work, shelved like CDs seen edge-on. Every project is a
   spine with its title running up it; the one you are on pulls
   forward and opens into its cover. Click the cover to go in.

   Arrow keys walk the rack, Home and End jump to either end, and
   Enter opens what is showing. Nothing here is decorative-only —
   the whole rack is a single roving-focus listbox, so it works
   from the keyboard exactly as it does from the mouse.
   ─────────────────────────────────────────────────────────── */

export default function WorkIndex() {
  const [at, setAt] = useState(0)
  const rack = useRef(null)

  useEffect(() => { document.title = 'Work — Rachel Dudley' }, [])

  const go = (i) => setAt(Math.max(0, Math.min(projects.length - 1, i)))

  const onKey = (e) => {
    const k = e.key
    if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); go(at + 1) }
    else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); go(at - 1) }
    else if (k === 'Home') { e.preventDefault(); go(0) }
    else if (k === 'End')  { e.preventDefault(); go(projects.length - 1) }
    else if (k === 'Enter' || k === ' ') {
      e.preventDefault()
      window.location.href = `/work/${projects[at].slug}`
    }
  }

  const open = projects[at]

  return (
    <div className="work-root">
      <Menu delay={0} />

      <div className="rack-page">
        <div
          className="rack"
          ref={rack}
          role="listbox"
          tabIndex={0}
          aria-label="Selected work"
          aria-activedescendant={`spine-${open.slug}`}
          onKeyDown={onKey}
        >
          {projects.map((p, i) => {
            const isOpen = i === at
            return (
              <a
                id={`spine-${p.slug}`}
                key={p.slug}
                href={`/work/${p.slug}`}
                className={`spine${isOpen ? ' open' : ''}`}
                style={{ '--n': i }}
                role="option"
                aria-selected={isOpen}
                tabIndex={-1}
                onMouseEnter={() => go(i)}
                onFocus={() => go(i)}
                onClick={(e) => { if (!isOpen) { e.preventDefault(); go(i) } }}
              >
                {/* the cover, seen when this one is pulled out */}
                <span className="cover">
                  {p.hero?.src
                    ? <img src={p.hero.src} alt="" />
                    : <span className="cover-blank" />}
                  <span className="cover-face">
                    <span className="cover-title">{p.title}</span>
                    <span className="cover-tagline">{p.tagline}</span>
                    <span className="cover-meta">
                      {[p.year, p.status].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </span>

                {/* the spine, seen the rest of the time */}
                <span className="spine-label">
                  <span className="spine-title">{p.title}</span>
                  <span className="spine-year">{p.year}</span>
                </span>
              </a>
            )
          })}
        </div>

        <div className="rack-foot">
          <span className="rack-count">
            {String(at + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <span className="rack-hint">← → to browse · click to open</span>
        </div>
      </div>
    </div>
  )
}
