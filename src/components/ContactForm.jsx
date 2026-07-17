import { useState } from 'react'

/* ── Contact form (Netlify Forms) ────────────────────────────────
   Replaces the plain-text email/phone that scrapers were harvesting.
   - Posts to Netlify Forms (the hidden mirror form lives in index.html
     so Netlify's build bot can detect it).
   - "bot-field" is a honeypot: hidden from humans, tempting to bots.
     Netlify silently discards any submission that fills it.
   - Compact by default; pass `compact={false}` for a roomier layout. */

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(240,236,228,0.04)',
  border: '1px solid rgba(181,160,140,0.22)',
  borderRadius: '3px',
  padding: '0.55rem 0.7rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.78rem',
  fontWeight: 300,
  letterSpacing: '0.03em',
  color: 'rgba(240,236,228,0.85)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.6rem',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(181,160,140,0.55)',
  marginBottom: '0.3rem',
  display: 'block',
  textAlign: 'left',
}

function encode(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

export default function ContactForm({ compact = true }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...data }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem', fontStyle: 'italic',
        color: 'rgba(240,236,228,0.7)',
        padding: '0.5rem 0', lineHeight: 1.6,
      }}>
        Received. Thank you for reaching out — I'll respond soon.
      </div>
    )
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.7rem',
        width: compact ? 'min(280px, 74vw)' : '100%',
        maxWidth: '420px',
      }}
    >
      <input type="hidden" name="form-name" value="contact" />

      {/* Honeypot — invisible to humans, irresistible to bots */}
      <p style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label>
          Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div>
        <label style={labelStyle} htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" required style={fieldStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(181,160,140,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(181,160,140,0.22)'} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" required style={fieldStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(181,160,140,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(181,160,140,0.22)'} />
      </div>

      <div>
        <label style={labelStyle} htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" required rows={compact ? 3 : 5}
          style={{ ...fieldStyle, resize: 'vertical' }}
          onFocus={e => e.target.style.borderColor = 'rgba(181,160,140,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(181,160,140,0.22)'} />
      </div>

      <button type="submit" disabled={status === 'sending'} style={{
        alignSelf: 'flex-start',
        background: 'none', cursor: 'pointer',
        border: '1px solid rgba(181,160,140,0.35)',
        borderRadius: '3px',
        padding: '0.5rem 1.1rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.65rem', fontWeight: 500,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(240,236,228,0.75)',
        opacity: status === 'sending' ? 0.5 : 1,
        transition: 'color 0.2s, border-color 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(240,236,228,1)'; e.currentTarget.style.borderColor = 'rgba(181,160,140,0.7)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(240,236,228,0.75)'; e.currentTarget.style.borderColor = 'rgba(181,160,140,0.35)' }}
      >
        {status === 'sending' ? 'sending…' : 'send'}
      </button>

      {status === 'error' && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.68rem',
          color: 'rgba(200,120,100,0.8)', lineHeight: 1.5,
        }}>
          Something went wrong — please try again.
        </div>
      )}

      {/* Quiet human-facing note; full machine-facing policy lives at /llms.txt */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.62rem', fontStyle: 'italic',
        color: 'rgba(181,160,140,0.35)',
        lineHeight: 1.5, textAlign: 'left',
      }}>
        Genuine inquiries welcome. Automated commercial solicitation is declined — see /llms.txt.
      </div>
    </form>
  )
}
