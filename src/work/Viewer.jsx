import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/* ── Viewer ───────────────────────────────────────────────────
   Click any drawing and it comes to the centre of the screen at
   full size. Arrow keys move through the set, Escape closes, so a
   collage of details can be read one at a time without leaving
   the page.
   ─────────────────────────────────────────────────────────── */

const Ctx = createContext(() => {})
export const useViewer = () => useContext(Ctx)

export function ViewerProvider({ children }) {
  const [set, setSet] = useState(null)   // { items, i }

  const open = useCallback((items, i = 0) => setSet({ items, i }), [])
  const close = useCallback(() => setSet(null), [])

  const step = useCallback((d) => {
    setSet(s => s && ({ ...s, i: (s.i + d + s.items.length) % s.items.length }))
  }, [])

  useEffect(() => {
    if (!set) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft')  step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [set, close, step])

  const item = set?.items[set.i]

  return (
    <Ctx.Provider value={open}>
      {children}
      {set && (
        <div className="viewer" onClick={close} role="dialog" aria-modal="true">
          <button className="viewer-x" onClick={close} aria-label="Close">✕</button>

          {set.items.length > 1 && (
            <>
              <button className="viewer-arrow left"
                onClick={e => { e.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
              <button className="viewer-arrow right"
                onClick={e => { e.stopPropagation(); step(1) }} aria-label="Next">›</button>
            </>
          )}

          <figure className="viewer-fig" onClick={e => e.stopPropagation()}>
            <div className="viewer-frame">
              <img src={item.src} alt={item.alt || ''} />
              {item.credit && <span className="viewer-credit">{item.credit}</span>}
            </div>
            {(item.caption || set.items.length > 1) && (
              <figcaption>
                {item.caption}
                {set.items.length > 1 && (
                  <span className="viewer-count">{set.i + 1} / {set.items.length}</span>
                )}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </Ctx.Provider>
  )
}
