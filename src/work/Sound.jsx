import { createContext, useContext, useEffect, useRef, useState } from 'react'

/* ── Sound ────────────────────────────────────────────────────
   One track for the whole page, owned here rather than by the
   section it belongs to — so it keeps playing wherever the visitor
   scrolls, and the control stays put instead of disappearing with
   the poem.

   It starts muted and playing, because muted autoplay is the only
   kind a browser allows. The control unmutes rather than starts.

   The analyser is handed out through context: the drawing behind
   the poem reads it to shape its lines, and falls back to its own
   slow swell whenever the track is silent.
   ─────────────────────────────────────────────────────────── */

const Ctx = createContext(null)
export const useSound = () => useContext(Ctx)

/* a credit line may carry one [text](url) link */
function credited(text) {
  return String(text).split(/(\[[^\]]+\]\([^)]+\))/).map((chunk, i) => {
    const m = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m
      ? <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
      : chunk
  })
}

export function SoundProvider({ src, credit, label = 'the song', children }) {
  const player  = useRef(null)
  const stopped = useRef(false)        // set only if the visitor stops it
  const graph   = useRef(null)         // { ctx, analyser, data }
  const [loud, setLoud] = useState(false)
  const [ready, setReady] = useState(false)

  /* start it muted; nothing else is permitted without a gesture */
  useEffect(() => {
    const el = player.current
    if (!el || !src) return
    el.muted = true
    el.play().then(() => setReady(true)).catch(() => setReady(true))
  }, [src])

  /* `loop` on the element is what repeats it, but a tab left in the
     background long enough can be suspended and never resume on its
     own. This picks it back up — muting is the visitor's business, so
     anything they have muted is left alone. */
  useEffect(() => {
    const el = player.current
    if (!el || !src) return
    const keep = () => {
      if (document.hidden || stopped.current) return
      if (el.paused) el.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', keep)
    const id = setInterval(keep, 4000)
    return () => { document.removeEventListener('visibilitychange', keep); clearInterval(id) }
  }, [src])

  const toggle = async () => {
    const el = player.current
    if (!el) return
    if (loud) { el.muted = true; setLoud(false); return }

    if (!graph.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) {
        const ctx = new AC()
        const source = ctx.createMediaElementSource(el)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.8
        source.connect(analyser)
        analyser.connect(ctx.destination)
        graph.current = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) }
      }
    }
    if (graph.current?.ctx.state === 'suspended') await graph.current.ctx.resume()
    el.muted = false
    try { await el.play() } catch { /* the visitor can press again */ }
    setLoud(true)
  }

  if (!src) return children

  return (
    <Ctx.Provider value={{ graph, loud }}>
      {children}
      <audio
        ref={player}
        src={src}
        loop                      /* repeats until the visitor says otherwise */
        muted
        playsInline
        preload="auto"
        onEnded={(e) => { e.currentTarget.currentTime = 0; e.currentTarget.play().catch(() => {}) }}
      />
      <button
        className={`sound-dock${loud ? ' on' : ''}${ready ? ' in' : ''}`}
        onClick={toggle}
        aria-pressed={loud}
        aria-label={loud ? `Mute ${label}` : `Unmute ${label}`}
      >
        <span className="sound-bars" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        {/* the label names the action, not the state — it says what
            pressing it will do, which is what a control is for */}
        <span className="sound-word">{loud ? 'sound off' : 'sound on'}</span>
      </button>

      {/* the credit belongs to the track, so it travels with it */}
      {credit && (
        <div className={`sound-credit${ready ? ' in' : ''}`}>{credited(credit)}</div>
      )}
    </Ctx.Provider>
  )
}
