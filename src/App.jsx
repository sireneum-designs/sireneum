import { useState, useEffect } from 'react'
import Landing from './components/Landing.jsx'
import Constellation from './components/Constellation.jsx'
import StoryPanel from './components/StoryPanel.jsx'
import WorkIndex from './work/WorkIndex.jsx'
import ProjectPage from './work/ProjectPage.jsx'
import Story from './pages/Story.jsx'
import Process from './pages/Process.jsx'

const YEAR = new Date().getFullYear()

// HOLDING MODE — true: the landing stays a placeholder and the constellation
// map is closed. Set false when the full site is ready to launch.
const HOLDING = true

// ── Routes ──────────────────────────────────────────────────
// Deliberately OUTSIDE the holding gate: these pages are reachable from the
// menu (and by direct link) while the constellation behind the landing is
// still closed. Resolved synchronously so pages never flash the landing view.
function resolveRoute() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path === '/work')          return { page: 'work-index' }
  if (path.startsWith('/work/')) return { page: 'project', slug: path.slice('/work/'.length) }
  if (path === '/story')         return { page: 'story' }
  if (path === '/process')       return { page: 'process' }
  return null
}

export default function App() {
  const route = resolveRoute()

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

  // ── Routed pages ────────────────────────────────────────────
  // After all hooks, so hook order stays stable. Bypasses HOLDING.
  if (route) {
    switch (route.page) {
      case 'work-index': return <WorkIndex />
      case 'project':    return <ProjectPage slug={route.slug} />
      case 'story':      return <Story />
      case 'process':    return <Process />
      default:           break
    }
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
