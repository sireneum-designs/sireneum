import { useEffect, useRef, useState } from 'react'

export default function Landing({ onEnter }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Staggered entrance
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, frame = 0, W, H, dpr

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.parentElement.clientWidth
      H = canvas.parentElement.clientHeight
      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // Flowing contour lines — recreates the Tilda background generatively
    function draw() {
      raf = requestAnimationFrame(draw)
      frame++
      ctx.clearRect(0, 0, W, H)

      const t = frame * 0.0042
      const cx = W * 0.5, cy = H * 0.5

      // Draw 24 flowing contour lines
      for (let k = 0; k < 24; k++) {
        const phase  = (k / 24) * Math.PI * 2
        const radius = 80 + k * 18 + Math.sin(t * 0.7 + phase) * 28
        const twist  = Math.sin(t * 0.4 + phase * 0.6) * 0.35
        const amp    = 40 + Math.sin(t * 0.9 + phase * 1.3) * 22

        ctx.beginPath()
        for (let a = 0; a <= Math.PI * 2; a += 0.025) {
          const r = radius
            + Math.sin(a * 3 + t + phase) * amp * 0.5
            + Math.sin(a * 5 + t * 1.3 + phase * 0.8) * amp * 0.28
            + Math.cos(a * 2 + t * 0.6 + phase * 1.2) * amp * 0.22
          const x = cx + Math.cos(a + twist) * r
          const y = cy + Math.sin(a + twist) * r * 0.6  // slightly elliptical
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()

        const alpha = 0.022 + (k / 24) * 0.015
        ctx.strokeStyle = `rgba(181,160,140,${alpha})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
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

      {/* Hamburger menu — top right */}
      <div style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '5px',
        cursor: 'pointer', zIndex: 10, padding: '8px',
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease 0.8s',
      }}
        onClick={handleEnter}
        title="Enter"
      >
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: '22px', height: '1px',
            background: 'rgba(181,160,140,0.5)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>

      {/* Center content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.8rem',
        textAlign: 'center',
      }}>
        {/* Logo mark — SVG version of the Sireneum circle */}
        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.2s var(--ease-out) 0.1s, transform 1.2s var(--ease-out) 0.1s',
        }}>
          <SireneumMark />
        </div>

        {/* Wordmark */}
        <div style={{
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 1.2s var(--ease-out) 0.4s, transform 1.2s var(--ease-out) 0.4s',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'rgba(240,236,228,0.92)',
            lineHeight: 1,
          }}>
            sireneum
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 1.4s var(--ease-out) 0.75s',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
            fontWeight: 300,
            color: 'rgba(181,160,140,0.7)',
            letterSpacing: '0.06em',
          }}>
            design that resonates
          </div>
        </div>

        {/* Enter prompt */}
        <div style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 1.4s var(--ease-out) 1.2s',
          marginTop: '1rem',
        }}>
          <button
            onClick={handleEnter}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(181,160,140,0.4)', fontFamily: 'var(--font-body)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(181,160,140,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(181,160,140,0.4)'}
            >
              enter
            </div>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  )
}

// Generative Sireneum logomark — animated sine waves in circle
function SireneumMark() {
  const svgRef = useRef(null)
  const rafRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    let frame = 0
    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      frame++
      frameRef.current = frame
      const svg = svgRef.current
      if (!svg) return
      const paths = svg.querySelectorAll('.wave')
      const t = frame * 0.018
      paths.forEach((p, k) => {
        const offset = (k / paths.length) * Math.PI * 2
        const amp    = 12 + k * 2.5
        const freq   = 1.5 + k * 0.2
        const phase  = t + offset
        // Build path: horizontal sine wave
        let d = ''
        const steps = 80
        const W = 120, H = 60, cx = W/2, cy = H/2
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W
          // Map x→angle for the sine, but add twist
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
      {/* Circle */}
      <circle cx="80" cy="80" r="68"
        fill="none" stroke="rgba(181,160,140,0.55)" strokeWidth="1.2" />

      {/* Clipping circle */}
      <defs>
        <clipPath id="logo-clip">
          <circle cx="80" cy="80" r="66" />
        </clipPath>
      </defs>

      {/* Wave group — clipped to circle */}
      <g clipPath="url(#logo-clip)" transform="translate(20,80)">
        {[0,1,2,3,4,5,6].map(k => (
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
