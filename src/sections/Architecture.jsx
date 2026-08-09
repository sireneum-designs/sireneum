import { projects } from '../work/projects.js'

export default function ArchitectureSection({ node }) {
  if (!node) return null
  return (
    <div style={{ padding: '3rem 2.5rem' }}>
      <div style={{
        fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(181,160,140,0.65)', fontFamily: 'var(--font-body)',
        marginBottom: '0.5rem',
      }}>
        {node.tagline}
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
        fontWeight: 300,
        color: 'rgba(240,236,228,0.92)',
        marginBottom: '1.5rem',
        lineHeight: 1.15,
      }}>
        {node.label}
      </h2>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: 300,
        lineHeight: 1.85,
        color: 'rgba(240,236,228,0.6)',
      }}>
        {node.desc}
      </p>
      {/* Projects — links into the /work section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.9)', fontFamily: 'var(--font-body)',
          fontWeight: 500, marginBottom: '1rem',
        }}>
          Projects
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {projects.map(p => (
            <a
              key={p.slug}
              href={`/work/${p.slug}`}
              style={{
                display: 'block',
                padding: '0.9rem 1.1rem',
                border: '1px solid rgba(181,160,140,0.12)',
                borderRadius: '3px',
                transition: 'border-color 380ms cubic-bezier(0.16,1,0.3,1), background 380ms cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(181,160,140,0.28)'
                e.currentTarget.style.background  = '#1c1914'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(181,160,140,0.12)'
                e.currentTarget.style.background  = 'transparent'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 300,
                color: 'rgba(240,236,228,0.92)', lineHeight: 1.2, marginBottom: '0.2rem',
              }}>
                {p.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300,
                color: 'rgba(240,236,228,0.55)', lineHeight: 1.55,
              }}>
                {p.tagline}
              </div>
            </a>
          ))}
        </div>

        <a
          href="/work"
          className="btn"
          style={{ marginTop: '1.5rem' }}
        >
          All work ↗
        </a>
      </div>
    </div>
  )
}
