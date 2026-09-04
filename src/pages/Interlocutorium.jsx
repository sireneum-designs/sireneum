import { useEffect } from 'react'
import '../work/work.css'
import './interlocutorium.css'
import Menu from '../components/Menu.jsx'
import { posts } from './interlocutorium-posts.js'

/* ── Interlocutorium ──────────────────────────────────────────
   Landing page for the Sireneum project of the same name.

   The page says what the project is, and then gets out of the
   way: the posts are the substance. Publishing one means adding
   an entry to interlocutorium-posts.js — nothing in here needs
   touching.

   The first version of this page was built around an
   escape-room diagram. It is kept, whole and documented, in
   src/pages/_archive/.
   ─────────────────────────────────────────────────────────── */

/* ── copy ────────────────────────────────────────────────── */
const YEAR    = new Date().getFullYear()
const TITLE   = 'interlocutorium'
const PREMISE = 'We see more together than anyone sees alone.'

const LEDE = 'An inquiry into us, made by us.'

/* ── where the posts also live ────────────────────────────
   Add a handle and a URL and the button appears. Entries with
   an empty href are skipped, so a half-opened account never
   ships as a dead link. */
const SOCIAL = [
  { label: 'instagram', handle: '', href: '' },
  { label: 'substack',  handle: '', href: '' },
  { label: 'linkedin',  handle: '', href: '' },
]

/* ── text ─────────────────────────────────────────────────
   Captions are written as plain text with blank lines between
   paragraphs; **bold**, *italic* and [text](url) are honoured.
   Same device as the story pages, kept local so this page has
   no dependency on them. */
function inline(text, key) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/)
    .map((chunk, j) => {
      const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) return (
        <a key={`${key}-${j}`} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
        </a>
      )
      if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4)
        return <strong key={`${key}-${j}`}>{chunk.slice(2, -2)}</strong>
      if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2)
        return <em key={`${key}-${j}`}>{chunk.slice(1, -1)}</em>
      return chunk
    })
}

function prose(text) {
  return text.trim().split(/\n\s*\n/).map((block, i) => (
    <p key={i}>{inline(block.trim().replace(/\s*\n\s*/g, ' '), i)}</p>
  ))
}

/* Dates are written as YYYY-MM-DD and read back as local time —
   parsing them as UTC would show the previous day west of
   Greenwich, which is where these are written. */
function showDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

/* ── one post ─────────────────────────────────────────────── */
function Post({ post }) {
  const m = post.media
  // entries with no href yet are skipped, so a post can go up here
  // before it goes up there
  const discuss = (post.discuss || []).filter(d => d.href)
  // entries still waiting for a URL. Shown only while running
  // `npm run dev`, as a reminder to come back and paste them —
  // Vite strips this branch from the production build, so a
  // half-filled post never shows a placeholder to a visitor.
  const pending = (post.discuss || []).filter(d => !d.href).map(d => d.where)

  return (
    <article id={post.id} className={`intl-post${m ? '' : ' no-media'}`}>

      {m && (
        <div className="intl-post-media" style={{ aspectRatio: m.aspect || '9 / 16' }}>
          {m.kind === 'video' ? (
            <video
              src={m.src}
              poster={m.poster}
              controls
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={m.src} alt={m.alt || ''} loading="lazy" />
          )}
        </div>
      )}

      <div className="intl-post-body">
        <span className="intl-post-date">{showDate(post.date)}</span>

        {prose(post.caption)}

        {post.question && <p className="intl-question">{post.question}</p>}

        {post.credits && (
          <p className="intl-post-credit">{inline(post.credits, 'credit')}</p>
        )}

        {discuss.length > 0 && (
          <div className="intl-post-foot">
            <span>join the discussion</span>
            {discuss.map(d => (
              <a key={d.where} href={d.href} target="_blank" rel="noopener noreferrer">
                {d.where} ↗
              </a>
            ))}
          </div>
        )}

        {import.meta.env.DEV && pending.length > 0 && (
          <div className="intl-post-foot intl-post-pending">
            <span>
              no link yet for {pending.join(', ')} — add it in
              interlocutorium-posts.js (dev only, never shipped)
            </span>
          </div>
        )}
      </div>
    </article>
  )
}

/* ── page ─────────────────────────────────────────────────── */
export default function Interlocutorium() {
  useEffect(() => { document.title = 'Interlocutorium — Sireneum' }, [])

  // newest first, whatever order the file is written in
  const feed = [...posts].sort((a, b) => String(b.date).localeCompare(String(a.date)))
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

        {/* ── what it is ── */}
        <section className="intl-sec">
          <div className="intl-sec-label">what this is</div>
          <div>
            <p>
              Interlocutorium is a project of <a href="/">Sireneum</a>, a design
              studio devoted to creating cultures of shared attention.
            </p>
            <p>
              From <em>interlocutor</em>, one who speaks with, and <em>-eum</em>,
              a place devoted to a particular purpose.
            </p>
            <p>
              The Interlocutorium is a place where we bravely ask questions about
              who we are, together.
            </p>
          </div>
        </section>

        <section className="intl-sec">
          <div className="intl-sec-label">why</div>
          <div>
            <p>
              The goal isn&rsquo;t agreement. It&rsquo;s more resolution: same
              picture, more detail. And following curiosity wherever it leads.
            </p>
            <div className="intl-stack">
              <p>No debate. No keeping score.</p>
              <p>No consensus.</p>
              <p>No advice. No prescriptions.</p>
            </div>
          </div>
        </section>

        {/* ── the posts ── */}
        <section className="intl-posts" aria-labelledby="intl-posts-h">
          <div className="intl-posts-head">
            <h2 id="intl-posts-h" className="intl-sec-label" style={{ padding: 0 }}>
              the posts
            </h2>
            {feed.length > 0 && (
              <span className="intl-posts-count">
                {feed.length} {feed.length === 1 ? 'post' : 'posts'}
              </span>
            )}
          </div>

          {feed.length > 0 ? (
            feed.map(p => <Post key={p.id} post={p} />)
          ) : (
            <div className="intl-empty">
              <p>
                The first one is being cut. It lands here, and everything after
                it, as it goes out.
              </p>
            </div>
          )}

          {links.length > 0 && (
            <div className="intl-follow">
              {links.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  {s.handle && <span className="handle">{s.handle}</span>}
                </a>
              ))}
            </div>
          )}
        </section>

        <footer className="intl-foot">
          <p>
            © {YEAR} Sireneum Designs. All rights reserved. The writing, images
            and video on this page are original works. Publication is not a
            licence: rights are reserved, including against inclusion in any
            dataset used to train a model, and for text and data mining. Terms
            in full at <a href="/llms.txt">/llms.txt</a>.
          </p>
          <a className="intl-mark" href="/">sireneum</a>
        </footer>

      </main>
    </div>
  )
}
