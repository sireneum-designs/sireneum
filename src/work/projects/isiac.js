// ═════════════════════════════════════════════════════════════
//  ISIAC — everything on this page
//
//  This is the only file you edit for this project. Words, images,
//  captions, marker positions, all of it.
//
//  Writing rules, all of them:
//    · keep the backticks ` ` around the text
//    · *asterisks around a phrase* make it italic
//    · **two asterisks** make it bold
//    · a blank line starts a new paragraph
//    · lines beginning `1. ` or `- ` become a numbered or bulleted list
//
//  STRUCTURE
//    hero   the landing image. The visitor arrives here.
//    why    scrolling UP. index 0 = one step up, then wider and wider.
//           a rung with `resolve` feeds a line into the response,
//           which is placed at the far end of the climb.
//    how    scrolling DOWN. index 0 = one step down, then finer.
//
//  Each why/how entry can carry:
//    media    images beneath the text; add `beside: true` to set one
//             in the margin alongside the paragraph instead
//    pair     two views in identical frames, titles on the image
//    plans    a drawing shown beside `plan`
//    plan     a drawing with A/B/C view markers, and a room key
//    collage  a sheet of details on one white ground; `legend: true`
//             marks a note rather than a drawing, set at 58% width
//
//  Any item with no `src` draws a labeled box of the right shape
//  instead, so the page can be judged before the files exist. `ar`
//  sets that box's proportion.
// ═════════════════════════════════════════════════════════════

const IMG = '/images/architecture/isiac/'
const AR  = '3 / 2'

export default {
  slug: 'isiac',
  title: 'ISIAC',
  tagline: `Institute for the Systemic Integration of Academic Creativity — an
            interdisciplinary makerstudio for the education of multipotentialites,
            in Leimert Park.`,
  year: '2024',
  status: 'Graduate studio — unbuilt',
  location: 'Leimert Park, Los Angeles',
  // a second line under the title, for a name worth spelling out
  subtitle: 'Institute for the Systemic Integration of Academic Creativity',

  hero: {
    src: IMG + 'entry-render.jpg', ar: '16 / 9',
    alt: 'The entry, looking through',
    credit: ``,
    overlay: {
      lines: [
        ['Status', 'Graduate studio — unbuilt'],
        ['Role', 'Sole Designer'],
        ['Instructor', 'Ian Dickenson, Associate Principal, Sasaki'],
        ['Software', 'Rhino · Grasshopper · Adobe Creative Suite'],
      ],
    },
  },

  facts: [
    ['Type',      'Educational'],
    ['Status',    'Graduate studio — unbuilt'],
    ['Role',      'Sole Designer'],
    ['Location',  'Leimert Park, Los Angeles'],
    ['Scale',     '43,000 GSF · 400 pupils · K–12 and beyond'],
    ['Structure', 'Mixed steel and lumber framing, CLT'],
  ],

  // a full-width image at the head of the climb, above the response
  banner: {
    src: IMG + 'history-collage.jpg',
    alt: 'The neighborhood, collaged',
  },

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `A community education facility for Leimert Park — a historically
             Black neighborhood whose response to systemic exclusion has
             produced an unusually durable cultural inheritance.

             Learning by doing, for makers and formgivers of all ages — a
             facility where creative problem solving can take root and spread
             into the wider community.`,
    },

    {
      scale: 'precedent',
      resolve: `different + safe =`,
      rows: [
        { src: IMG + 'sheet-precedent-watts.jpg', ar: AR,
          alt: 'Watts Towers',
          caption: `Simon Rodia, Watts Towers, 1921–1954.`,
          body: `Rodia built for thirty-three years out of what came to hand —
                 steel, mortar, bottle glass, broken tile — with no plan, no
                 crew and no permit. What holds it together is not a system but
                 an insistence, and the result is one of the most coherent
                 things anyone has made in Los Angeles.` },

        { src: IMG + 'sheet-experiential-collage.jpg', ar: AR,
          alt: 'Experiential collage',
          caption: `The neighborhood's own inheritance, collaged.`,
          body: `The Brockman Gallery, Art + Practice, the Vision Theater. A
                 lineage of institutions built by the community for itself,
                 which is the actual precedent: the building is not bringing
                 creativity to Leimert Park, it is making room for what is
                 already there.` },
      ],
      closing: `Both are made of parts that stay **different**, and are
                nonetheless held **safe** together.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `community :: integrated`,
      body: `can a school hold the needs of the individual, the local
             **community**, and society at-large in productive tension,
             allowing all to become part of a stronger **integrated** whole?`,
    },

    {
      scale: 'the name',
      body: `According to Egyptian mythology, Isis gathered the scattered parts
             of Osiris, and through her love, reanimated him into one
             integrated whole.

             Named after her, ISIAC takes a systems approach: it creates a
             built environment that navigates the tension between the
             individual and the collective, and integrates the two toward
             synergistic results. Learning by doing, for makers and formgivers
             of all ages.`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The site sits at the commercial center of a residential
             neighborhood, where users approach on foot from Leimert, Crenshaw
             and Degnan. The entry sequence is organized around a mosaic
             surface intended for collaboration with local artists.

             Three distinct masses become one cohesive whole, directly
             expressing the institution's forming role in the community.`,
      carousel: [
        { src: IMG + 'sheet-context-street.jpg', ar: AR, alt: 'Context at street level',
          title: `Street Level`,     sub: `Context` },
        { src: IMG + 'sheet-context-above.jpg', ar: AR, alt: 'Context above street level',
          title: `Above Street`,     sub: `Context` },
        { src: IMG + 'sheet-site-plan.jpg', ar: AR, alt: 'Site plan',
          title: `Site Plan`,        sub: `Proposed` },
        { src: IMG + 'sheet-west-perspective.jpg', ar: AR, alt: 'West perspective render',
          title: `West Perspective`, sub: `Render` },
      ],
    },

    {
      scale: 'return to center',
      body: `Maker space, open-air flex classroom, machine shop, library, lab,
             sound and photo, VR/AR studio, retail and gathering — programmed
             so the disciplines can see each other work.

             Three volumes, each with its own identity, integrated into one
             continuous form; the plans keep the seams legible rather than
             smoothing them away.`,
      carousel: [
        { src: IMG + 'sheet-concept.jpg', ar: AR, alt: 'Concept development',
          title: `Concept`,       sub: `Development` },
        { src: IMG + 'sheet-program.jpg', ar: AR, alt: 'Program diagram',
          title: `Program`,       sub: `Diagram` },
        { src: IMG + 'sheet-plan-ground.jpg', ar: AR, alt: 'Ground floor plan',
          title: `Ground Floor`,  sub: `Plan` },
        { src: IMG + 'sheet-plan-first.jpg', ar: AR, alt: 'First floor plan',
          title: `First Floor`,   sub: `Plan` },
        { src: IMG + 'sheet-plan-second.jpg', ar: AR, alt: 'Second floor plan',
          title: `Second Floor`,  sub: `Plan` },
        { src: IMG + 'sheet-sections.jpg', ar: AR, alt: 'Longitudinal and transverse sections',
          title: `Sections`,      sub: `Longitudinal + Transverse` },
      ],
    },

    {
      scale: 'make it better',
      body: `Solar heating, natural ventilation and daylighting, and a
             ground-source heat pump, create an integrated energy-efficient
             systems design.

             A cable-tensioned roof combined with a glulam post-and-beam system
             provides the necessary support for a 40-foot span while keeping
             the interior free of columns.`,
      carousel: [
        { src: IMG + 'sheet-structure.jpg', ar: AR, alt: 'Structure iterations',
          title: `Iterations`,    sub: `Structure` },
        { src: IMG + 'sheet-passive.jpg', ar: AR, alt: 'Passive systems design',
          title: `Passive Systems`, sub: `Narrative` },
        { src: IMG + 'sheet-active.jpg', ar: AR, alt: 'Active systems',
          title: `Active Systems`, sub: `Technical` },
        { src: IMG + 'sheet-facade.jpg', ar: AR, alt: 'Facade and structure sequence',
          title: `Facade`,        sub: `Technical` },
        { src: IMG + 'sheet-wall-section.jpg', ar: AR, alt: 'Wall section',
          title: `Wall Section`,  sub: `Typical` },
        { src: IMG + 'sheet-workshop.jpg', ar: AR, alt: 'Workshop view from adjacent classroom',
          title: `Workshop`,      sub: `View` },
      ],
    },
  ],

  media: [],
}
