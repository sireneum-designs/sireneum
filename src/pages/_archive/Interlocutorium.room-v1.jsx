import { useEffect, useState } from 'react'
import '../work/work.css'
import './interlocutorium.css'
import Menu from '../components/Menu.jsx'

/* ── Interlocutorium ──────────────────────────────────────────
   Landing page for the Sireneum project of the same name.

   The page makes its own argument twice: once in words, once in
   the plan. The room diagram is not illustration — switching
   vantage points is the only way to find out that no vantage
   point sees the whole room.

   EVERYTHING EDITABLE LIVES IN THE BLOCK BELOW. Copy, links,
   clue positions and sight lines are all parameters; the
   component reads them and draws whatever is there. Adding a
   clue or a viewer means adding an entry, not editing JSX.
   ─────────────────────────────────────────────────────────── */

/* ── copy ────────────────────────────────────────────────── */
const TITLE   = 'interlocutorium'
const PREMISE = 'What can we see together that none of us can see alone?'

const LEDE =
  'A Sireneum project about how we make sense of shared problems from ' +
  'different places in the same room.'

/* ── where the questions live ─────────────────────────────
   Add the handle and the URL and the button appears. Entries
   with an empty href are skipped, so half-finished accounts
   never ship as dead links. */
const SOCIAL = [
  { label: 'instagram', handle: '', href: '' },
  { label: 'substack',  handle: '', href: '' },
  { label: 'linkedin',  handle: '', href: '' },
]

/* ── the room ─────────────────────────────────────────────
   Coordinates are in the SVG's own 720 × 460 space. The walls
   sit at x 40–680, y 40–420.

   A viewer is an apex on a wall plus the two far points its
   sight lines run to; the wedge between them is clipped to the
   room. A clue is a point, a glyph and the list of viewers
   whose wedge contains it — worked out from the geometry, so
   moving a clue means updating `seen` to match. `labelDx` nudges
   a caption off its glyph where the wall would clip it. */
const VIEWERS = [
  {
    id: 'A',
    label: 'you',
    at: [40, 150],
    cone: [[740, -40], [740, 330]],
    caption:
      'From where you stand: the door, the clock, the drawer, the safe. ' +
      'Not the key. From here you would swear this room has no key in it.',
  },
  {
    id: 'B',
    label: 'me',
    at: [680, 80],
    cone: [[-60, 300], [320, 460]],
    caption:
      'From where I stand: the key, the ladder, the drawer. No door. ' +
      'From this corner the room looks like it does not open at all.',
  },
  {
    id: 'C',
    label: 'someone else',
    at: [360, 420],
    cone: [[-60, -40], [560, -70]],
    caption:
      'From a third position: the mark on the wall, the clock, the safe — ' +
      'and a quarter of the room, with the rest behind them.',
  },
]

const TOGETHER_CAPTION =
  'Seven clues in the room. Standing anywhere, the most anyone sees is four.'

const CLUES = [
  { id: 'key',    at: [150, 300], glyph: 'key',    name: 'key',    seen: ['B'] },
  { id: 'drawer', at: [560, 150], glyph: 'drawer', name: 'drawer', seen: ['A', 'B'] },
  { id: 'ladder', at: [300, 355], glyph: 'ladder', name: 'ladder', seen: ['B'] },
  { id: 'clock',  at: [430, 105], glyph: 'clock',  name: 'clock',  seen: ['A', 'C'] },
  { id: 'door',   at: [662, 250], glyph: 'door',   name: 'door',   seen: ['A'], labelDx: -34 },
  { id: 'mark',   at: [120,  95], glyph: 'mark',   name: 'mark',   seen: ['C'] },
  { id: 'safe',   at: [250, 180], glyph: 'safe',   name: 'safe',   seen: ['A', 'C'] },
]

/* ── glyphs ───────────────────────────────────────────────
   Drawn, not iconography: one weight of line, the same hand as
   a plan. Each is centred on 0,0 so a clue can be moved by its
   coordinate alone. */
function Glyph({ kind }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }
  switch (kind) {
    case 'key':
      return (
        <g {...s}>
          <circle cx={-9} cy={0} r={5} />
          <path d="M -4 0 H 11" />
          <path d="M 6 0 V 5" />
          <path d="M 11 0 V 5" />
        </g>
      )
    case 'drawer':
      return (
        <g {...s}>
          <rect x={-11} y={-8} width={22} height={16} />
          <path d="M -11 0 H 11" />
          <path d="M -3 -4 H 3" />
          <path d="M -3 4 H 3" />
        </g>
      )
    case 'ladder':
      return (
        <g {...s}>
          <path d="M -6 -10 V 10" />
          <path d="M 6 -10 V 10" />
          <path d="M -6 -4 H 6" />
          <path d="M -6 2 H 6" />
        </g>
      )
    case 'clock':
      return (
        <g {...s}>
          <circle cx={0} cy={0} r={9} />
          <path d="M 0 -5 V 0 L 4 3" />
        </g>
      )
    case 'door':
      return (
        <g {...s}>
          <path d="M 0 -14 V 14" />
          <path d="M 0 -14 A 24 24 0 0 0 -22 8" strokeDasharray="3 4" />
        </g>
      )
    case 'mark':
      return (
        <g {...s}>
          <path d="M -6 -6 L 6 6" />
          <path d="M 6 -6 L -6 6" />
        </g>
      )
    case 'safe':
      return (
        <g {...s}>
          <rect x={-11} y={-10} width={22} height={20} />
          <circle cx={0} cy={0} r={5} />
          <path d="M 0 -5 V -8" />
        </g>
      )
    default:
      return null
  }
}

/* ── the plan ─────────────────────────────────────────────── */
function Room({ view }) {
  const lit = (id) => view === 'all' || view === id
  const clueLit = (c) => (view === 'all' ? true : c.seen.includes(view))

  return (
    <svg viewBox="0 0 720 448" role="img"
         aria-label="Plan of one room seen from three positions. Each position sees some of the seven clues; none sees all of them.">
      <defs>
        <clipPath id="intl-walls">
          <rect x={40} y={40} width={640} height={380} rx={2} />
        </clipPath>
      </defs>

      {/* floor */}
      <rect x={40} y={40} width={640} height={380} rx={2}
            fill="#0a0906" stroke="rgba(181,160,140,0.30)" strokeWidth={1} />

      {/* sight lines, clipped to the walls — overlapping wedges
          brighten on their own, which is the whole point */}
      <g clipPath="url(#intl-walls)">
        {VIEWERS.map(v => (
          <polygon
            key={v.id}
            className="plan-el"
            points={[v.at, ...v.cone].map(p => p.join(',')).join(' ')}
            fill="rgba(181,160,140,0.13)"
            opacity={lit(v.id) ? 1 : 0}
          />
        ))}
      </g>

      {/* clues */}
      {CLUES.map(c => (
        <g key={c.id} className="plan-el"
           transform={`translate(${c.at[0]} ${c.at[1]})`}
           opacity={clueLit(c) ? 1 : 0.07}
           color={clueLit(c) ? '#f0ece4' : '#b5a08c'}>
          <Glyph kind={c.glyph} />
          <text x={c.labelDx || 0} y={30} textAnchor="middle"
                fontFamily="var(--font-body)" fontSize={10}
                fontWeight={500} letterSpacing="0.18em"
                fill="rgba(181,160,140,0.75)">
            {c.name}
          </text>
        </g>
      ))}

      {/* viewers, on the walls */}
      {VIEWERS.map(v => (
        <g key={v.id} className="plan-el" opacity={lit(v.id) ? 1 : 0.22}>
          <circle cx={v.at[0]} cy={v.at[1]} r={5}
                  fill={lit(v.id) ? '#f0ece4' : '#b5a08c'} />
          <circle cx={v.at[0]} cy={v.at[1]} r={11}
                  fill="none" stroke="rgba(181,160,140,0.45)" strokeWidth={1} />
        </g>
      ))}
    </svg>
  )
}

/* ── page ─────────────────────────────────────────────────── */
export default function Interlocutorium() {
  const [view, setView] = useState('all')

  useEffect(() => { document.title = 'Interlocutorium — Sireneum' }, [])

  const caption =
    view === 'all'
      ? TOGETHER_CAPTION
      : VIEWERS.find(v => v.id === view)?.caption

  const links = SOCIAL.filter(s => s.href)

  return (
    <div className="work-root">
      <Menu delay={0} />

      <main className="intl-page">

        <span className="intl-kicker">
          a <a href="/">sireneum</a> project
        </span>

        <h1 className="intl-title">{TITLE}</h1>

        <p className="intl-premise">{PREMISE}</p>

        <p className="intl-lede">{LEDE}</p>

        {/* ── the room ── */}
        <section className="intl-room" aria-labelledby="intl-room-h">
          <h2 id="intl-room-h" className="intl-sec-label" style={{ marginBottom: '1rem' }}>
            the room
          </h2>

          <div className="intl-room-frame">
            <Room view={view} />
          </div>

          <div className="intl-eyes" role="group" aria-label="Choose a vantage point">
            {VIEWERS.map(v => (
              <button
                key={v.id}
                type="button"
                className={`intl-eye${view === v.id ? ' on' : ''}`}
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
                onMouseEnter={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
            <button
              type="button"
              className={`intl-eye${view === 'all' ? ' on' : ''}`}
              aria-pressed={view === 'all'}
              onClick={() => setView('all')}
              onMouseEnter={() => setView('all')}
            >
              all three
            </button>
          </div>

          <p className="intl-room-cap" aria-live="polite">{caption}</p>
        </section>

        {/* ── prose ── */}
        <section className="intl-sec">
          <div className="intl-sec-label">the premise</div>
          <div>
            <p>
              Picture an escape room. Everyone is already inside it — the same
              room, the same locked door, the same clock running.
            </p>
            <p>
              From where you stand you can see the drawer. From where I stand I
              can see the mark on the wall behind you. Neither of us is wrong.
              Neither of us is finished.
            </p>
            <p>
              The door does not open on the strongest argument. It opens on
              assembly.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">the wager</div>
          <div>
            <p>
              Interlocutorium runs on a small and slightly uncomfortable bet:
              that another person&rsquo;s view is <em>potentially useful
              information</em>.
            </p>
            <p>
              Not correct. Not equally weighted. Not automatically owed
              agreement. Useful — a reading taken from an angle you cannot
              occupy, by someone who is in the room with you.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">the practice</div>
          <div>
            <p>
              The project asks short, open questions in public, and then gets
              out of the way. No thesis hiding in the tail of the question. No
              answer waiting to be guessed.
            </p>
            <p>
              A good question here is one that several people can answer
              honestly and differently — where the differences themselves tell
              you something about the shape of the room.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">what it isn&rsquo;t</div>
          <div>
            <ul className="intl-nots">
              <li>Not a debate. Nobody is keeping score.</li>
              <li>Not consensus. Agreement is not the product.</li>
              <li>Not a program for becoming a better person.</li>
            </ul>
            <p>
              What it is after is <strong>resolution</strong>, in the optical
              sense: the same picture, more detail.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">the name</div>
          <div>
            <p>
              <em>Interlocutor</em>, one who speaks with, and <em>-eum</em>, a
              place devoted to something. In a monastery the parlour was the one
              room where the rule of silence lifted: the room kept for speaking
              between.
            </p>
            <p>
              Interlocutorium borrows the room and leaves the walls behind.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">where it lives</div>
          <div>
            <p>
              The questions post in public. Answer one, or read what other
              people answered — reading the room is the point.
            </p>
            {links.length > 0 ? (
              <div className="intl-follow">
                {links.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    {s.handle && <span className="handle">{s.handle}</span>}
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(181,160,140,0.55)' }}>
                Feed links land here as the accounts open.
              </p>
            )}
          </div>
        </section>

        <footer className="intl-foot">
          <p>
            Interlocutorium is a project of{' '}
            <a href="/">Sireneum</a>, a design studio devoted to creating
            cultures of shared attention. It isn&rsquo;t about fixing. It is
            about calling.
          </p>
          <span className="intl-mark">sireneum</span>
        </footer>

      </main>
    </div>
  )
}
