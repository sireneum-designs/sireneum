import { useEffect, useRef, useState } from 'react'
import ContactForm from './ContactForm.jsx'

// Logo file candidates — first one that loads wins.
// Drop your logo into public/images/ as sireneum-logo.svg or sireneum-logo.png
const LOGO_CANDIDATES = ['/images/sireneum-logo.svg', '/images/sireneum-logo.png']

export default function Landing({ onEnter, holding = false }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  /* ── Background: resonance rewards stillness ─────────────────
     Two waves travel the same line, slightly out of phase —
     quietly interfering, never quite agreeing. When the visitor's
     cursor comes to rest — when they actually attend — the waves
     drift into phase and bloom into resonance. Restless movement
     scatters them again. At deep stillness, individual particles
     of light join the resonant line: other resonant particles,
     invited into the dance.
     Attention here is not motion. It is staying with.          */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf, frame = 0, W, H, dpr

    /* — attention gradient: cursor speed → agitation → calm —
       Not a switch. Fast movement is full disturbance, absolute
       stillness is full resonance, and every speed in between
       lives somewhere on the gradient.                          */
    const pointer = { x: null, y: null, px: null, py: null }
    let speedSm = 0        // smoothed cursor speed (px per frame)
    let calm = 0.5         // 0 = agitation, 1 = deep stillness
    function onPointerMove(e) {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    window.addEventListener('pointermove', onPointerMove)

    function updateCalm() {
      let speed = 0
      if (pointer.x !== null && pointer.px !== null) {
        speed = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py)
      }
      pointer.px = pointer.x
      pointer.py = pointer.y
      speedSm += (speed - speedSm) * 0.12
      // continuous: a slow drift sits mid-gradient, a flick nears chaos
      const agitation = Math.min(1, Math.pow(speedSm / 18, 0.8))
      const target = 1 - agitation
      // settling is slow (~4s to deep calm); disturbance answers faster
      const rate = target > calm ? 0.010 : 0.045 + 0.05 * agitation
      calm += (target - calm) * rate
    }

    /* — geometry — */
    const baseY = () => H * 0.7
    const K = 0.0058                        // spatial frequency
    const OMEGA = 0.85                      // temporal frequency
    const taper = (x) => Math.sin(Math.PI * x / W)

    /* — the chorus: four voices. Disturbance scribbles them into
         overlapping noise; calm lets them keep their own character
         but travel together — resonance as ensemble, not merger. — */
    const WAVES = [
      { A: 40, phi: 0,    wob: 0.26, ws: 0.29 },
      { A: 33, phi: 1.57, wob: 0.34, ws: 0.23 },
      { A: 27, phi: 3.14, wob: 0.30, ws: 0.36 },
      { A: 22, phi: 4.71, wob: 0.38, ws: 0.19 },
    ]

    /* — resonant particles: gather as the chorus agrees — */
    const SPARKS = 64
    const sparks = Array.from({ length: SPARKS }, () => ({
      u: Math.random(),
      speed: 0.00035 + Math.random() * 0.0005,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 0.02 + Math.random() * 0.03,
    }))

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.parentElement.clientWidth
      H = canvas.parentElement.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(t, c) {
      ctx.clearRect(0, 0, W, H)

      const y0 = baseY()
      const breathe = 1 + 0.08 * Math.sin(t * 0.18)   // ocean-like swell
      const chaos = Math.pow(1 - c, 1.35)             // disturbance energy

      // scribble: the disturbance of a restless eye — organic noise
      // displacement that scales continuously with agitation
      const scribble = (x, i) =>
        (Math.sin(x * 0.012 + t * 1.9 + i * 4.7)
          * Math.sin(x * 0.0053 - t * 1.3 + i * 2.3)
          + 0.5 * Math.sin(x * 0.021 + t * 2.6 + i * 8.1)
        ) * 26 * chaos

      // phases: scattered + wobbling in chaos → a small constant
      // stagger in calm, so the voices stay distinct while agreeing
      const phase = (w, i) =>
        (w.phi + w.wob * Math.sin(t * w.ws + i * 2.1)) * (1 - c)
        + i * 0.32 * c

      // each voice fans out slightly in calm — parallel, not merged
      const lineY = (w, i, x) =>
        y0 + (i - 1.5) * 7 * c
        + taper(x) * (w.A * breathe * Math.sin(K * x - t * OMEGA + phase(w, i))
          + scribble(x, i))

      // the chorus — clearly visible at every point on the gradient
      WAVES.forEach((w, i) => {
        ctx.beginPath()
        for (let x = 0; x <= W; x += 3) {
          const y = lineY(w, i, x)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(196,178,158,${0.32 + 0.12 * c})`
        ctx.lineWidth = 1.4
        ctx.stroke()
      })

      // the ensemble's sum — buried in noise at agitation,
      // one bright swell as the voices find each other
      const sumAt = (x) => {
        let sum = 0
        for (let i = 0; i < WAVES.length; i++) {
          const w = WAVES[i]
          sum += w.A * Math.sin(K * x - t * OMEGA + phase(w, i))
        }
        return sum * 0.8 * breathe
      }
      const bloom = Math.pow(c, 1.5)
      ctx.save()
      if (bloom > 0.04) {
        ctx.shadowColor = 'rgba(214,199,180,0.6)'
        ctx.shadowBlur = 24 * bloom
      }
      ctx.beginPath()
      for (let x = 0; x <= W; x += 2) {
        const y = y0 + taper(x) * sumAt(x)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(228,216,200,${0.05 + 0.38 * bloom})`
      ctx.lineWidth = 1 + 1.6 * bloom
      ctx.stroke()
      ctx.restore()

      // resonant particles — gather along the gradient's upper half
      const gate = Math.max(0, (c - 0.5) / 0.5)
      if (gate > 0.01) {
        for (const sp of sparks) {
          sp.u += sp.speed
          if (sp.u > 1) sp.u -= 1
          sp.tw += sp.twSpeed
          const x = sp.u * W
          const y = y0 + taper(x) * sumAt(x)
          const a = gate * (0.2 + 0.35 * (0.5 + 0.5 * Math.sin(sp.tw)))
          ctx.beginPath()
          ctx.arc(x, y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(240,236,228,${a})`
          ctx.fill()
        }
      }
    }

    function loop() {
      raf = requestAnimationFrame(loop)
      frame++
      updateCalm()
      draw(frame * 0.016, calm)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    if (reduceMotion) {
      // static, gently resonant composition
      draw(12, 0.75)
    } else {
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  function handleEnter() {
    setLeaving(true)
    setTimeout(onEnter, 900)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink)',
      opacity: leaving ? 0 : 1,
      transition: leaving ? 'opacity 0.85s cubic-bezier(0.4,0,1,1)' : 'none',
    }}>
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        display: 'block', pointerEvents: 'none',
      }} />

      {/* Hamburger menu — top right (hidden while holding) */}
      {!holding && <div style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '5px',
        cursor: 'pointer', zIndex: 10, padding: '8px',
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease 0.8s',
      }}
        onClick={handleEnter}
        title="Enter"
      >
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '22px', height: '1px',
            background: 'rgba(181,160,140,0.5)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>}

      {/* Contact menu — top right (drops below the hamburger when the full site is live) */}
      <div style={{
        position: 'absolute', top: holding ? '1.5rem' : '3.8rem', right: '1.8rem',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        zIndex: 10,
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease 0.8s',
      }}>
        <button
          onClick={() => setContactOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: contactOpen ? 'rgba(181,160,140,0.85)' : 'rgba(181,160,140,0.45)',
            padding: '0.4rem 0',
            transition: 'color 0.25s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(181,160,140,0.85)'}
          onMouseLeave={e => e.currentTarget.style.color = contactOpen ? 'rgba(181,160,140,0.85)' : 'rgba(181,160,140,0.45)'}
        >
          contact
        </button>

        {contactOpen && (
          <div style={{
            marginTop: '0.6rem',
            background: 'rgba(10,9,6,0.92)',
            border: '1px solid rgba(181,160,140,0.18)',
            borderRadius: '3px',
            padding: '0.9rem 1.2rem',
            display: 'flex', flexDirection: 'column', gap: '0.7rem',
            textAlign: 'left',
            animation: 'contactIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            <style>{`@keyframes contactIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <ContactForm compact />
          </div>
        )}
      </div>

      {/* Center content — above the wave line */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.6rem',
        textAlign: 'center',
        transform: 'translateY(-6vh)',
      }}>
        {/* Logo — your file from public/images/, falls back to generated mark */}
        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.2s var(--ease-out) 0.1s, transform 1.2s var(--ease-out) 0.1s',
          marginBottom: '-0.7rem',
        }}>
          <Logo />
        </div>

        {/* Wordmark */}
        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1.2s var(--ease-out) 0.4s, transform 1.2s var(--ease-out) 0.4s',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            color: 'var(--cream-full)',
            lineHeight: 1,
          }}>
            sireneum
          </h1>
        </div>

        {/* Tagline */}
        <div style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 1.4s var(--ease-out) 0.75s',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(200,180,154,0.8)',
            letterSpacing: '0.04em',
          }}>
            design that resonates
          </p>
        </div>

      </div>

      {/* Enter prompt — anchored at the bottom, below the animation.
          In holding mode it becomes a quiet status line instead. */}
      <div style={{
        position: 'absolute', bottom: '2.2rem', left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        zIndex: 2,
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.4s var(--ease-out) 1.2s',
      }}>
        {holding ? (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(181,160,140,0.45)',
            userSelect: 'none',
          }}>
            propagating soon
          </div>
        ) : (
          <button
            onClick={handleEnter}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem', fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(181,160,140,0.4)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(181,160,140,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(181,160,140,0.4)'}
            >
              enter
            </div>
            <ChevronDown />
          </button>
        )}
      </div>
    </div>
  )
}

/* Persistent logo: tries public/images/sireneum-logo.svg, then .png.
   Until one of those files exists, shows the generated wave mark. */
function Logo() {
  const [idx, setIdx] = useState(0)

  if (idx >= LOGO_CANDIDATES.length) return <SireneumMark />

  return (
    <img
      src={LOGO_CANDIDATES[idx]}
      alt="Sireneum"
      style={{ height: '150px', width: 'auto', display: 'block' }}
      onError={() => setIdx(idx + 1)}
    />
  )
}

// Generative fallback logomark — animated sine waves in circle
function SireneumMark() {
  const svgRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    let frame = 0
    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      frame++
      const svg = svgRef.current
      if (!svg) return
      const paths = svg.querySelectorAll('.wave')
      const t = frame * 0.018
      paths.forEach((p, k) => {
        const offset = (k / paths.length) * Math.PI * 2
        const amp = 12 + k * 2.5
        const freq = 1.5 + k * 0.2
        const phase = t + offset
        let d = ''
        const steps = 80
        const W = 120, H = 60, cy = H / 2
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W
          const a = (i / steps) * Math.PI * 2
          const y = cy + Math.sin(a * freq + phase) * amp * Math.sin(Math.PI * i / steps)
          d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`
        }
        p.setAttribute('d', d)
      })
    }
    animate()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 160 160"
      width="96" height="96"
      style={{ overflow: 'visible' }}
    >
      <circle cx="80" cy="80" r="68"
        fill="none" stroke="rgba(181,160,140,0.55)" strokeWidth="1.2" />
      <defs>
        <clipPath id="logo-clip">
          <circle cx="80" cy="80" r="66" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-clip)" transform="translate(20,80)">
        {[0, 1, 2, 3, 4, 5, 6].map(k => (
          <path
            key={k}
            className="wave"
            fill="none"
            stroke={`rgba(181,160,140,${0.12 + k * 0.08})`}
            strokeWidth={0.7 + k * 0.15}
          />
        ))}
      </g>
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none"
      style={{ opacity: 0.3, animation: 'bounceDown 2.2s ease-in-out infinite' }}>
      <style>{`
        @keyframes bounceDown {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
      `}</style>
      <path d="M1 1L9 9L17 1" stroke="rgba(181,160,140,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
