// ── Constellation nodes ───────────────────────────────────────
// x, y are percentage-based positions in the viewBox (0–100)
// depth: 0 = center, 1 = primary, 2 = secondary (child of primary)

export const nodes = [

  // ── Center ────────────────────────────────────────────────
  {
    id: 'sireneum',
    label: 'Sireneum',
    tagline: 'design that resonates',
    depth: 0,
    x: 50, y: 50,
    desc: 'A design studio for complex problems and the people willing to sit with them.',
  },

  // ── Primary nodes ─────────────────────────────────────────
  {
    id: 'origin',
    label: 'Origin',
    tagline: 'where this came from',
    depth: 1,
    x: 22, y: 28,
    desc: 'The overlapping threads — engineer, architect, researcher, designer — and how they braided into something that required a new name.',
    parent: 'sireneum',
  },
  {
    id: 'process',
    label: 'Process',
    tagline: 'roots of curiosity',
    depth: 1,
    x: 72, y: 20,
    desc: 'A non-linear, exploratory approach that generates form through iterative interaction with the environment rather than through a predetermined sequence.',
    parent: 'sireneum',
  },
  {
    id: 'work',
    label: 'Work',
    tagline: 'the body of evidence',
    depth: 1,
    x: 82, y: 62,
    desc: 'Design, architecture, and research — built, unbuilt, and speculative.',
    parent: 'sireneum',
  },
  {
    id: 'position',
    label: 'Position',
    tagline: 'what I believe',
    depth: 1,
    x: 30, y: 78,
    desc: 'A working manifesto — on complexity, on participation, on what design is actually for.',
    parent: 'sireneum',
  },
  {
    id: 'conversation',
    label: 'Conversation',
    tagline: 'ongoing dialogue',
    depth: 1,
    x: 14, y: 62,
    desc: 'An evolving space for dialogue — essays, exchanges, and eventually something that sounds like a conversation.',
    parent: 'sireneum',
  },

  // ── Work children ─────────────────────────────────────────
  {
    id: 'design',
    label: 'Design',
    tagline: 'community + craft',
    depth: 2,
    x: 88, y: 42,
    desc: 'Participatory design interventions, community building, and 3D printed objects.',
    parent: 'work',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    tagline: 'built + unbuilt',
    depth: 2,
    x: 92, y: 72,
    desc: 'Buildings and spaces — realized and speculative.',
    parent: 'work',
  },
  {
    id: 'research',
    label: 'Research',
    tagline: 'Out of Phase',
    depth: 2,
    x: 70, y: 82,
    desc: 'Academic and practice-based research into how systems change and what architecture can do about it.',
    parent: 'work',
    link: 'https://outofphaseresearch.netlify.app',
  },

  // ── Origin children ────────────────────────────────────────
  {
    id: 'engineering',
    label: 'Engineering',
    tagline: 'first language',
    depth: 2,
    x: 10, y: 14,
    desc: 'A decade as a structural engineer — learning to read buildings from the inside out.',
    parent: 'origin',
  },
  {
    id: 'studio',
    label: 'Studio Practice',
    tagline: 'translation',
    depth: 2,
    x: 32, y: 12,
    desc: 'The shift from engineering to design — finding the space where technical rigor and creative inquiry meet.',
    parent: 'origin',
  },

]

// ── Edges (connections between nodes) ────────────────────────
export const edges = [
  ['sireneum', 'origin'],
  ['sireneum', 'process'],
  ['sireneum', 'work'],
  ['sireneum', 'position'],
  ['sireneum', 'conversation'],
  ['work',     'design'],
  ['work',     'architecture'],
  ['work',     'research'],
  ['origin',   'engineering'],
  ['origin',   'studio'],
  // Cross-connections
  ['process',  'research'],
  ['position', 'conversation'],
  ['origin',   'process'],
]

// ── Related (for "explore related" at bottom of each story) ──
export const related = {
  sireneum:     ['origin', 'work', 'position'],
  origin:       ['process', 'position', 'engineering', 'studio'],
  process:      ['origin', 'research', 'work'],
  work:         ['design', 'architecture', 'research'],
  position:     ['origin', 'conversation', 'process'],
  conversation: ['position', 'work'],
  design:       ['work', 'architecture', 'research'],
  architecture: ['work', 'design'],
  research:     ['work', 'process', 'position'],
  engineering:  ['origin', 'studio'],
  studio:       ['origin', 'engineering'],
}
