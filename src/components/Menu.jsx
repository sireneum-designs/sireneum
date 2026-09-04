import { useEffect, useState } from 'react'
import ContactForm from './ContactForm.jsx'

/* ── Site menu ────────────────────────────────────────────────
   Hamburger, top right. Opens a quiet panel rather than a
   full-screen takeover — the landing animation stays visible
   behind it, which is the point of the landing.

   Contact expands in place instead of routing away, so the
   form is never more than two clicks from anywhere.
   ─────────────────────────────────────────────────────────── */

// Lowercase throughout — house style, matching the sireneum wordmark.
const LINKS = [
  { label: 'story',   href: '/story',   note: 'sireneum, and how I got here' },
  { label: 'work',    href: '/work',    note: 'architecture — selected projects' },
  { label: 'process', href: '/process', note: 'how I think about design' },
  { label: 'interlocutorium', href: '/interlocutorium', note: 'an inquiry into us, made by us' },
]

export default function Menu({ delay = 0.8, top = '1.5rem', panelTop = '4.2rem' }) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Escape closes
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setContactOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <style>{`
        @keyframes menuIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        .menu-link { display:block; text-decoration:none; padding:0.55rem 0; }
        /* standalone classes — .ml-note also has to work inside <button>,
           which is why these aren't scoped under .menu-link */
        .ml-label {
          display:block;
          font-family: var(--font-display);
          font-size: 1.32rem; font-weight: 400; line-height: 1.15;
          letter-spacing: -0.015em;
          color: rgba(240,236,228,0.72);
          transition: color 220ms cubic-bezier(0.16,1,0.3,1);
        }
        .ml-note {
          display:block; margin-top:0.2rem;
          font-family: var(--font-body);
          font-size: 0.7rem; font-weight: 300; letter-spacing:0.02em;
          line-height: 1.4;
          color: rgba(181,160,140,0.45);
          text-transform: none;
        }
        .menu-link:hover .ml-label,
        .menu-contact-btn:hover .ml-label { color: var(--cream); }
        .menu-link:hover .ml-note,
        .menu-contact-btn:hover .ml-note  { color: rgba(181,160,140,0.7); }
        .menu-contact-btn {
          display:block; width:100%;
          background:none; border:none; cursor:pointer;
          padding:0.55rem 0; text-align:left;
        }
      `}</style>

      {/* ── hamburger ── */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', top, right: '1.5rem',
          zIndex: 60,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: '5px', width: '38px', height: '38px',
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
          opacity: ready ? 1 : 0,
          transition: `opacity 1.2s ease ${delay}s`,
        }}
      >
        {[0, 1, 2].map(i => (
          /* colour lives in the stylesheet — the bars blend against
             whatever is behind them, so they read on a white render
             and on the black page without being told which is which */
          <div key={i} className={`menu-bar${open ? ' open' : ''}`} style={{
            width: '22px', height: '1px',
            transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 200ms, background 220ms',
            transform: open
              ? (i === 0 ? 'translateY(6px) rotate(45deg)'
                : i === 2 ? 'translateY(-6px) rotate(-45deg)' : 'none')
              : 'none',
            opacity: open && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* ── panel ── */}
      {open && (
        <>
          {/* click-away layer — deliberately not a dim overlay, so the
              landing animation keeps running behind the menu */}
          <div
            onClick={() => { setOpen(false); setContactOpen(false) }}
            style={{ position: 'fixed', inset: 0, zIndex: 55 }}
          />

          <nav style={{
            position: 'fixed', top: panelTop, right: '1.8rem',
            zIndex: 58,
            minWidth: '240px', maxWidth: 'calc(100vw - 3.6rem)',
            background: 'rgba(10,9,6,0.94)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(181,160,140,0.18)',
            borderRadius: '3px',
            padding: '1.1rem 1.4rem 1.3rem',
            animation: 'menuIn 280ms cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {/* Way home — the wordmark, so it isn't a fifth nav item */}
            <a
              href="/"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.6rem', fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(181,160,140,0.45)',
                textDecoration: 'none',
                paddingBottom: '0.85rem',
                marginBottom: '0.4rem',
                borderBottom: '1px solid rgba(181,160,140,0.15)',
              }}
            >
              sireneum
            </a>

            {LINKS.map(l => (
              <a className="menu-link" href={l.href} key={l.href}>
                <span className="ml-label">{l.label}</span>
                <span className="ml-note">{l.note}</span>
              </a>
            ))}

            <button
              className="menu-contact-btn"
              onClick={() => setContactOpen(o => !o)}
              aria-expanded={contactOpen}
            >
              <span className="ml-label">contact</span>
              <span className="ml-note">{contactOpen ? 'close' : 'say hello'}</span>
            </button>

            {contactOpen && (
              <div style={{
                marginTop: '0.9rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(181,160,140,0.15)',
                animation: 'menuIn 240ms cubic-bezier(0.16,1,0.3,1) both',
              }}>
                <ContactForm compact />
              </div>
            )}
          </nav>
        </>
      )}
    </>
  )
}
