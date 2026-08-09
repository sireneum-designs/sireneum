import { useEffect, useRef } from 'react'
import { useSound } from './Sound.jsx'

/* ── WaveBed ──────────────────────────────────────────────────
   The drawing behind the poem, with its lines redrawn live.

   The image is raster, so its lines cannot be animated. The canvas
   draws the same motif from scratch instead: a ridge of stacked
   contours above the horizon, a field of hairlines below it.

   It always moves. Muted, it runs off a slow procedural swell, so
   the section is alive before anyone touches anything. Unmuted, the
   same drawing is driven by the song's own spectrum. One code path,
   so there is no state in which nothing happens.

   The track itself is owned by the page, not by this section, so it
   keeps playing wherever the visitor scrolls. This only reads the
   analyser it hands out.
   ─────────────────────────────────────────────────────────── */

const BANDS  = 96
const RIDGES = 40
const SPIKES = 130

export default function WaveBed({ still }) {
  const canvas = useRef(null)
  const frame  = useRef(0)
  const sound  = useSound()

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c2d = cv.getContext('2d')

    const size = () => {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width  = Math.max(1, Math.round(r.width  * dpr))
      cv.height = Math.max(1, Math.round(r.height * dpr))
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0)
      return r
    }
    let box = size()
    const onResize = () => { box = size() }
    window.addEventListener('resize', onResize)

    const band = new Array(BANDS)
    const t0 = performance.now()

    const draw = () => {
      frame.current = requestAnimationFrame(draw)
      const now = (performance.now() - t0) / 1000
      const g = sound?.graph?.current
      let live = false

      if (g) {
        g.analyser.getByteFrequencyData(g.data)
        for (let i = 0; i < BANDS; i++) {
          const n = Math.floor((i / BANDS) * (g.data.length * 0.7))
          band[i] = g.data[n] / 255
          if (band[i] > 0.02) live = true
        }
      }
      if (!live) {
        // a slow swell, so the drawing breathes while the track is silent
        for (let i = 0; i < BANDS; i++) {
          const u = i / BANDS
          band[i] =
            0.30 + 0.20 * Math.sin(now * 0.55 + u * 5.2)
                 + 0.13 * Math.sin(now * 0.90 - u * 9.1)
                 + 0.07 * Math.sin(now * 1.70 + u * 17.0)
        }
      }

      const { width: W, height: H } = box
      const horizon = H * 0.56        // of the bed, which already starts low
      c2d.clearRect(0, 0, W, H)

      const at = (t) => {
        const x = t < 0.5 ? t * 2 : (1 - t) * 2       // mirrored shoulders
        const f = x * (BANDS - 1)
        const i = Math.floor(f)
        const a = band[i] ?? 0
        const b = band[Math.min(BANDS - 1, i + 1)] ?? 0
        return a + (b - a) * (f - i)
      }

      c2d.lineWidth = 0.6
      for (let r = 0; r < RIDGES; r++) {
        const k = r / RIDGES
        const damp = 1 - k * 0.7
        c2d.beginPath()
        for (let px = 0; px <= W; px += 3) {
          const t = px / W
          const y = horizon - at(t) * horizon * 0.8 * damp + k * (horizon * 0.5)
          px === 0 ? c2d.moveTo(px, y) : c2d.lineTo(px, y)
        }
        c2d.strokeStyle = `rgba(240,236,228,${(0.30 - k * 0.23).toFixed(3)})`
        c2d.stroke()
      }

      c2d.lineWidth = 0.7
      for (let s2 = 0; s2 < SPIKES; s2++) {
        const t = s2 / SPIKES
        const v = at(t)
        const x = t * W
        c2d.beginPath()
        c2d.moveTo(x, horizon)
        c2d.lineTo(x, horizon + v * (H - horizon) * 1.1)
        c2d.strokeStyle = `rgba(240,236,228,${(0.08 + v * 0.34).toFixed(3)})`
        c2d.stroke()
      }
    }
    draw()
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('resize', onResize)
    }
  }, [sound])

  return (
    <div className="wavebed" aria-hidden="true">
      {still && <img className="wavebed-still" src={still} alt="" />}
      <canvas className="wavebed-canvas" ref={canvas} />
    </div>
  )
}
