import { useState, useRef, useCallback, useEffect } from 'react'
import { nodes, edges } from '../data.js'

const VB = 100  // viewBox units (percentage-based)

export default function Constellation({ activeNode, onSelectNode, compressed }) {
  const [hovered, setHovered] = useState(null)
  const [revealed, setRevealed] = useState(new Set(['sireneum']))
  const bgRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ tips: [], trail: [], frame: 0, mx: 0, my: 0, dropTimer: 0, W: 1, H: 1, dpr: 1 })

  // Reveal child nodes when a parent is activated
  useEffect(() => {
    if (!activeNode) return
    const children = nodes.filter(n => n.parent === activeNode).map(n => n.id)
    if (children.length > 0) {
      setRevealed(prev => {
        const next = new Set(prev)
        children.forEach(id => next.add(id))
        return next
      })
    }
  }, [activeNode])

  // Frost background
  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    const GEN = [
      { maxAge: 600, forkP: 0.002,  alpha: 0.18, lw: 0.45, wobble: 0.06,  guided: false },
      { maxAge: 360, forkP: 0.007,  alpha: 0.11, lw: 0.32, wobble: 0.08,  guided: false },
      { maxAge: 200, forkP: 0.02,   alpha: 0.065,lw: 0.22, wobble: 0.11,  guided: false },
      { maxAge: 100, forkP: 0.05,   alpha: 0.036,lw: 0.15, wobble: 0.15,  guided: false },
      { maxAge: 50,  forkP: 0,      alpha: 0.018,lw: 0.09, wobble: 0.20,  guided: false },
    ]
    const STEP = 0.34, MAX_TIPS = 1200

    function spawnTip(x, y, angle, gen) {
      if (s.tips.length >= MAX_TIPS) return
      s.tips.push({ x, y, angle, gen, age: 0 })
    }

    function resize() {
      s.dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.parentElement.getBoundingClientRect()
      s.W = r.width; s.H = r.height
      canvas.width  = Math.round(s.W * s.dpr)
      canvas.height = Math.round(s.H * s.dpr)
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0)
    }

    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      s.frame++

      // Update tips (draw to persistent frost canvas)
      const segs = [[], [], [], [], []]
      const forks = []
      for (let i = s.tips.length - 1; i >= 0; i--) {
        const t = s.tips[i]; t.age++
        const g = GEN[t.gen]
        if (t.age > g.maxAge || t.x < 1 || t.x > s.W - 1 || t.y < 1 || t.y > s.H - 1) {
          s.tips.splice(i, 1); continue
        }
        t.angle += (Math.random() - .5) * g.wobble
        const nx = t.x + Math.cos(t.angle) * STEP
        const ny = t.y + Math.sin(t.angle) * STEP
        segs[t.gen].push(t.x, t.y, nx, ny)
        t.x = nx; t.y = ny
        if (g.forkP > 0 && Math.random() < g.forkP && t.gen < 4 && s.tips.length < MAX_TIPS)
          forks.push({ x: t.x, y: t.y, angle: t.angle, gen: t.gen + 1 })
      }
      for (let g = 0; g < 5; g++) {
        const sg = segs[g]; if (!sg.length) continue
        ctx.beginPath(); ctx.lineWidth = GEN[g].lw
        ctx.strokeStyle = `rgba(181,160,140,${GEN[g].alpha})`
        for (let i = 0; i < sg.length; i += 4) { ctx.moveTo(sg[i], sg[i+1]); ctx.lineTo(sg[i+2], sg[i+3]) }
        ctx.stroke()
      }
      for (const f of forks) {
        const da = (0.38 + Math.random() * .42) * (Math.random() < .5 ? 1 : -1)
        spawnTip(f.x, f.y, f.angle + da, f.gen)
        if (Math.random() < .40) spawnTip(f.x, f.y, f.angle - da * .76, f.gen)
      }

      // Seed from cursor
      s.dropTimer++
      if (s.dropTimer >= 18) {
        const a = Math.atan2(
          s.my - (s.trail[s.trail.length - 2]?.y || s.my),
          s.mx - (s.trail[s.trail.length - 2]?.x || s.mx)
        )
        const p = a + Math.PI / 2
        spawnTip(s.mx, s.my, p + (Math.random() - .5) * .35, 0)
        spawnTip(s.mx, s.my, p + Math.PI + (Math.random() - .5) * .35, 0)
        s.dropTimer = 0
      }

      s.trail.push({ x: s.mx, y: s.my })
      if (s.trail.length > 400) s.trail.shift()
    }

    function handleMouseMove(e) {
      const r = canvas.getBoundingClientRect()
      s.mx = e.clientX - r.left
      s.my = e.clientY - r.top
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)
    window.addEventListener('mousemove', handleMouseMove)
    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      ro.disconnect()
    }
  }, [])

  const visibleNodes = nodes.filter(n => revealed.has(n.id))
  const visibleEdges = edges.filter(([a, b]) => revealed.has(a) && revealed.has(b))

  function nodeState(id) {
    if (id === activeNode)   return 'active'
    if (id === hovered)      return 'hovered'
    if (id === 'sireneum')   return 'center'
    if (!activeNode)         return 'idle'
    const connected = edges.some(([a,b]) => (a===activeNode&&b===id)||(b===activeNode&&a===id))
    return connected ? 'connected' : 'dimmed'
  }

  // Node visual config
  const nodeR = { center: 9, active: 8, hovered: 7, connected: 6, idle: 5, dimmed: 4 }
  const nodeAlpha = { center: 0.85, active: 0.95, hovered: 0.80, connected: 0.65, idle: 0.50, dimmed: 0.18 }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1)',
      width: compressed ? '40%' : '100%',
      overflow: 'hidden',
    }}>
      {/* Frost canvas */}
      <canvas ref={bgRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        display: 'block', opacity: 0.9,
      }} />

      {/* Header */}
      {!compressed && (
        <div style={{
          position: 'absolute', top: '1.5rem', left: '1.8rem',
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.35)', fontFamily: 'var(--font-body)',
        }}>
          Sireneum — Rachel Dudley
        </div>
      )}

      {/* SVG constellation */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible',
        }}
      >
        {/* Edges */}
        {visibleEdges.map(([aId, bId]) => {
          const a = nodes.find(n => n.id === aId)
          const b = nodes.find(n => n.id === bId)
          if (!a || !b) return null
          const isActive = aId === activeNode || bId === activeNode || aId === hovered || bId === hovered
          return (
            <line key={`${aId}-${bId}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? 'rgba(181,160,140,0.7)' : 'rgba(181,160,140,0.10)'}
              strokeWidth={isActive ? 0.22 : 0.12}
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
          )
        })}

        {/* Nodes */}
        {visibleNodes.map(node => {
          const st = nodeState(node.id)
          const r = nodeR[st]
          const alpha = nodeAlpha[st]
          const isCenter = node.id === 'sireneum'
          const isActive = st === 'active'

          return (
            <g key={node.id}
              onClick={() => onSelectNode(node.id)}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring */}
              {(isActive || isCenter || st === 'hovered') && (
                <circle cx={node.x} cy={node.y} r={r + 3.5}
                  fill="none"
                  stroke={`rgba(181,160,140,${isActive ? 0.22 : 0.10})`}
                  strokeWidth="0.3"
                />
              )}

              {/* Node dot */}
              <circle
                cx={node.x} cy={node.y} r={r * 0.8}
                fill={`rgba(181,160,140,${alpha})`}
                style={{ transition: 'r 0.25s, fill 0.25s' }}
              />

              {/* Label */}
              <text
                x={node.x}
                y={node.y - r - 1.8}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: isCenter ? '2.2px' : '1.9px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fill: `rgba(240,236,228,${alpha})`,
                  transition: 'fill 0.25s',
                  userSelect: 'none',
                }}
              >
                {node.label}
              </text>

              {/* Tagline on hover */}
              {st === 'hovered' && (
                <text
                  x={node.x} y={node.y + r + 2.8}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '1.6px',
                    fill: 'rgba(181,160,140,0.65)',
                    userSelect: 'none',
                  }}
                >
                  {node.tagline}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip on hover */}
      {hovered && !activeNode && (() => {
        const n = nodes.find(x => x.id === hovered)
        if (!n) return null
        return (
          <div style={{
            position: 'absolute', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10,9,6,0.88)',
            border: '1px solid rgba(181,160,140,0.15)',
            borderRadius: '3px', padding: '0.7rem 1.1rem',
            maxWidth: '300px', textAlign: 'center',
            pointerEvents: 'none', zIndex: 5,
            animation: 'fadeUp 0.18s ease both',
          }}>
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translate(-50%,6px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(181,160,140,0.65)', marginBottom: '0.3rem', fontFamily: 'var(--font-body)' }}>
              {n.tagline}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(240,236,228,0.65)', lineHeight: 1.5, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              {n.desc}
            </div>
          </div>
        )
      })()}

      {/* Footer hint */}
      {!compressed && (
        <div style={{
          position: 'absolute', bottom: '1.2rem', left: '1.8rem',
          fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.25)', fontFamily: 'var(--font-body)',
        }}>
          click any node to explore
        </div>
      )}
    </div>
  )
}
