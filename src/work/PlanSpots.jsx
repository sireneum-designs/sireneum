import { useState } from 'react'

/* ── Plan with view markers ───────────────────────────────────
   The markers sit exactly where you would be standing to see the
   linked view, so their positions are information, not decoration.

   Coordinates are percentages of the image, set per project in
   src/work/projects/<slug>.js. To find them precisely rather than by
   eye, add ?spots to the URL:

       localhost:5173/work/outside-in-house?spots

   The plan then shows a crosshair and a readout. Click anywhere and
   the exact `x` and `y` are printed on screen and copied to your
   clipboard, ready to paste into the project file. Remove ?spots and
   it goes away.
   ─────────────────────────────────────────────────────────── */

const CALIBRATING =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('spots')

export function PlanKey({ plan }) {
  if (!plan.key) return null
  // The key sits BENEATH the drawing inside the same white mat, rather
  // than floating on top of it. Overlaying meant it kept landing on
  // linework whichever corner it was anchored to; the white simply
  // extends to make room instead.
  const { columns = 1, items = [] } = plan.key
  // filled column by column, the way a printed key reads: 1–8 down the
  // first column, 9–16 down the second, rather than snaking across
  const rows = Math.ceil(items.length / columns)
  return (
    <dl
      className="plan-key"
      style={{ '--cols': columns, '--rows': rows }}
      aria-label="Room key"
    >
      {items.map(([n, name], i) =>
        n === '—'
          ? <div className="plan-key-rule" key={i}><dt /><dd>{name}</dd></div>
          : <div className="plan-key-row" key={i}><dt>{n}</dt><dd>{name}</dd></div>
      )}
    </dl>
  )
}

export default function PlanSpots({ plan, onEnlarge, onSpot }) {
  const [open, setOpen] = useState(null)
  const [probe, setProbe] = useState(null)

  const readOff = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    const text = `x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`
    setProbe({ x, y, text })
    navigator.clipboard?.writeText(text).catch(() => {})
    console.log(text)
  }

  return (
    <div className="planspots">
      <figure className="planspots-plan">
        <div
          className={`media-frame mat bordered${CALIBRATING ? ' calibrating' : ''}`}
          onClick={CALIBRATING ? readOff : undefined}
        >
          {plan.src ? (
            <img
              src={plan.src}
              alt={plan.alt || ''}
              onClick={CALIBRATING ? undefined : onEnlarge}
              style={!CALIBRATING && onEnlarge ? { cursor: 'zoom-in' } : undefined}
            />
          ) : (
            <span className="shot-ph" style={{ aspectRatio: plan.ar || '4 / 3' }}>
              <span>{plan.alt || 'plan'}</span>
            </span>
          )}

          {plan.caption && <span className="plan-title">{plan.caption}</span>}
          <PlanKey plan={plan} />

          {plan.spots?.map(s => (
            <button
              key={s.id}
              className={`planspot${open === s.id ? ' on' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onMouseEnter={() => setOpen(s.id)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => setOpen(s.id)}
              onBlur={() => setOpen(null)}
              onClick={(e) => { e.stopPropagation(); onSpot?.(plan.spots.indexOf(s)) }}
              aria-label={s.alt || `View ${s.id}`}
            >
              {s.id}
            </button>
          ))}

          {CALIBRATING && probe && (
            <>
              <span className="probe" style={{ left: `${probe.x}%`, top: `${probe.y}%` }} />
              <span className="probe-read" style={{ left: `${probe.x}%`, top: `${probe.y}%` }}>
                {probe.text}
              </span>
            </>
          )}
        </div>

      </figure>
    </div>
  )
}
