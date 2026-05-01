export default function DesignSection({ node }) {
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
      <div style={{
        marginTop: '3rem',
        padding: '1.2rem 1.4rem',
        border: '1px solid rgba(181,160,140,0.12)',
        borderRadius: '3px',
        fontSize: '0.8rem',
        color: 'rgba(181,160,140,0.35)',
        fontStyle: 'italic',
        fontFamily: 'var(--font-display)',
      }}>
        This story is still being written.
      </div>
    </div>
  )
}
