import { useState, useEffect } from 'react'
import Landing from './components/Landing.jsx'
import Constellation from './components/Constellation.jsx'
import StoryPanel from './components/StoryPanel.jsx'

const YEAR = new Date().getFullYear()

// HOLDING MODE — true: public placeholder ("propagating soon", no enter).
// Set to false when the full site is ready to launch.
const HOLDING = true

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'map' | 'story'
  const [activeNode, setActiveNode] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)

  function enterMap() {
    if (HOLDING) return
    setView('map')
  }

  function openNode(id) {
    setActiveNode(id)
    setTimeout(() => setPanelOpen(true), 40)
  }

  function closePanel() {
    setPanelOpen(false)
    setTimeout(() => setActiveNode(null), 400)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', background: 'var(--ink)' }}>

      {/* Landing screen */}
      {view === 'landing' && (
        <Landing onEnter={enterMap} holding={HOLDING} />
      )}

      {/* Constellation map + story panel */}
      {view === 'map' && (
        <>
          <Constellation
            activeNode={activeNode}
            onSelectNode={openNode}
            compressed={panelOpen}
          />
          <StoryPanel
            nodeId={activeNode}
            visible={panelOpen}
            onClose={closePanel}
            onNavigate={(id) => {
              setPanelOpen(false)
              setTimeout(() => { setActiveNode(id); setTimeout(() => setPanelOpen(true), 60) }, 300)
            }}
          />
        </>
      )}

      {/* Copyright */}
      {view !== 'landing' && (
        <div style={{
          position: 'fixed', bottom: '0.8rem', right: '1.1rem',
          fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(181,160,140,0.28)', fontFamily: 'var(--font-body)',
          pointerEvents: 'none', zIndex: 9999, userSelect: 'none',
        }}>
          © {YEAR} Sireneum Designs
        </div>
      )}
    </div>
  )
}
