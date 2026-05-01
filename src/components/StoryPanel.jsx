import { useEffect, useRef } from 'react'
import { nodes, related } from '../data.js'

// Section components — stubs for now, will be built out
import OriginSection      from '../sections/Origin.jsx'
import ProcessSection     from '../sections/Process.jsx'
import WorkSection        from '../sections/Work.jsx'
import PositionSection    from '../sections/Position.jsx'
import ConversationSection from '../sections/Conversation.jsx'
import DesignSection      from '../sections/Design.jsx'
import ArchitectureSection from '../sections/Architecture.jsx'
import ResearchSection    from '../sections/Research.jsx'

const SECTION_MAP = {
  origin:       OriginSection,
  process:      ProcessSection,
  work:         WorkSection,
  position:     PositionSection,
  conversation: ConversationSection,
  design:       DesignSection,
  architecture: ArchitectureSection,
  research:     ResearchSection,
}

export default function StoryPanel({ nodeId, visible, onClose, onNavigate }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [nodeId])

  const node = nodes.find(n => n.id === nodeId)
  const Section = SECTION_MAP[nodeId] || DefaultSection
  const relatedIds = related[nodeId] || []

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: '60%',
      background: 'var(--ink-mid)',
      borderLeft: '1px solid var(--border)',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>

      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.45)',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          transition: 'color 0.2s',
          fontFamily: 'var(--font-body)',
        }}
          onMouseEnter={e => e.currentTarget.style.color='rgba(181,160,140,0.88)'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(181,160,140,0.45)'}
        >
          ← Constellation
        </button>

        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.28)', fontFamily: 'var(--font-body)',
        }}>
          Sireneum
        </div>

        <div style={{ width: '100px' }} />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Section node={node} />

        {/* Related nodes */}
        {relatedIds.length > 0 && (
          <div style={{
            padding: '2rem 2.5rem 1.5rem',
            borderTop: '1px solid var(--border)',
          }}>
            <div className="label" style={{ marginBottom: '0.8rem' }}>
              Explore further
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {relatedIds.map(id => {
                const n = nodes.find(x => x.id === id)
                if (!n) return null
                return (
                  <button key={id} onClick={() => onNavigate(id)} style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '0.35rem 0.8rem',
                    cursor: 'pointer',
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(181,160,140,0.55)',
                    fontFamily: 'var(--font-body)',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color='rgba(181,160,140,0.9)'
                      e.currentTarget.style.borderColor='rgba(181,160,140,0.35)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color='rgba(181,160,140,0.55)'
                      e.currentTarget.style.borderColor='rgba(181,160,140,0.12)'
                    }}
                  >
                    {n.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div style={{ height: '3rem' }} />
      </div>
    </div>
  )
}

// Default section — shown for nodes without a dedicated component
function DefaultSection({ node }) {
  if (!node) return null
  return (
    <div style={{ padding: '3rem 2.5rem' }}>
      <div className="label-accent" style={{ marginBottom: '0.5rem' }}>{node.tagline}</div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
        fontWeight: 300,
        color: 'var(--cream-full)',
        marginBottom: '1.5rem',
        lineHeight: 1.15,
      }}>
        {node.label}
      </h2>
      <p className="body-serif">{node.desc}</p>
      <div style={{
        marginTop: '3rem',
        padding: '1.2rem 1.4rem',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        fontSize: '0.8rem',
        color: 'rgba(181,160,140,0.4)',
        fontStyle: 'italic',
        fontFamily: 'var(--font-display)',
      }}>
        This story is still being written.
      </div>
    </div>
  )
}
