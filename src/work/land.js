import { useLayoutEffect } from 'react'

/* ── landing in the middle ────────────────────────────────────
   A project page and the story both open partway down: on the
   hero, with the climb sitting above it. That scroll has to be set
   before the first paint — which is also before the images above
   the hero have loaded.

   Those images carry no width or height, so until each one arrives
   its box is nothing at all. Every one that loads adds its height
   to the document *above* the mark we already jumped to, and the
   page drifts down by exactly that much: you land looking at the
   end of the climb instead of the hero.

   So rather than measure once and hope, the position is re-taken
   every time the document changes height — and abandoned the
   moment the visitor scrolls for themselves, since from then on
   where they are is their business, not ours.
   ─────────────────────────────────────────────────────────── */
export function useLandOn(ref, dep) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    let done = false

    const land = () => {
      if (done) return
      // against the document, not the offset parent — offsetTop is only
      // the whole story while nothing above is positioned
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
      if (Math.abs(top - window.scrollY) > 1) window.scrollTo(0, top)
    }

    // `scroll` is deliberately not one of these: our own scrolling
    // raises it, and we would call the visitor's arrival our own
    const intents = ['wheel', 'touchstart', 'keydown', 'pointerdown']

    function finish() {
      if (done) return
      done = true
      ro.disconnect()
      clearTimeout(backstop)
      window.removeEventListener('load', land)
      intents.forEach(e => window.removeEventListener(e, finish))
    }

    const ro = new ResizeObserver(land)
    ro.observe(document.documentElement)
    if (document.body) ro.observe(document.body)

    window.addEventListener('load', land)
    document.fonts?.ready.then(land)
    intents.forEach(e => window.addEventListener(e, finish, { passive: true }))

    // nothing holds the page for long, however slow the images are
    const backstop = setTimeout(finish, 5000)

    land()
    return finish
  }, [dep])
}
