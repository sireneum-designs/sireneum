// ═════════════════════════════════════════════════════════════
//  THE PODJECT — everything on this page
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

const IMG = '/images/architecture/podject/'
const AR  = '3 / 2'

export default {
  slug: 'podject',
  title: 'The PODject',
  tagline: `Multi-family housing as a domestic infrastructure of mutual
            support, beside the new 6th Street Viaduct.`,
  year: '2023',
  status: 'Graduate studio — unbuilt',
  location: 'Boyle Heights, Los Angeles',

  hero: {
    src: IMG + 'sheet-street-view.jpg', ar: '3 / 2',
    alt: 'The stepped terraces from the shared street',
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
    ['Type',     'Mixed-use residential'],
    ['Status',   'Graduate studio — unbuilt'],
    ['Role',     'Sole Designer'],
    ['Location', 'Boyle Heights, Los Angeles'],
    ['Context',  '81,669 residents · 77% renters · median age 32.3'],
  ],

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `Design an 85,000-square-foot urban infill housing development on a
             constrained site beneath the new Sixth Street Viaduct in Boyle
             Heights, Los Angeles.`,
    },

    {
      scale: 'precedent',
      resolve: `independence + interdependence =`,
      rows: [
        { src: IMG + 'sheet-precedent-arcology.jpg', ar: AR,
          alt: 'Arcology precedent',
          caption: `Paolo Soleri, Arcosanti · 79 & Park, Bjarke Ingels Group.`,
          body: `Soleri's arcology argued that density and ecology are the same
                 problem, and that a settlement should be legible as one
                 organism. What survives is not the form but the premise: a
                 building can be a settlement rather than a stack of
                 identical units.` },

        { src: IMG + 'sheet-precedent-capsule.jpg', ar: AR,
          alt: 'Capsule tower precedent',
          caption: `Kisho Kurokawa, Nakagin Capsule Tower · Chapamala Daichi
                    Housing Complex, Studio Bakoko.`,
          body: `Nakagin made the unit replaceable and the frame permanent. It
                 failed as maintenance and succeeded as an idea: that a
                 dwelling can change while the structure holding it does not,
                 and that a household is a moving thing.` },
      ],
      closing: `Both insist a dwelling can hold its own **independence** and
                still be built out of **interdependence**.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `housing :: community`,
      body: `can **housing** support many different ways of living while
             strengthening the **community** as a whole?`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The site is bounded by the viaduct above and a double-height
             industrial building on a zero lot line to the south.

             Rather than treat that blank wall as an imposition, the project
             makes it a locus of participation: an expansive surface for
             community-created street art, continuous with the neighborhood's
             existing landscape of murals.`,
      carousel: [
        { src: IMG + 'sheet-context-geographic.jpg', ar: AR, alt: 'Geographic context',
          title: `Geographic`,   sub: `Context` },
        { src: IMG + 'sheet-context-historic.jpg', ar: AR, alt: 'Historic context',
          title: `Historic`,     sub: `Context` },
        { src: IMG + 'sheet-context-demographic.jpg', ar: AR, alt: 'Demographic context',
          title: `Demographic`,  sub: `Context` },
        { src: IMG + 'sheet-context-site.jpg', ar: AR, alt: 'The site and the viaduct',
          title: `The Site`,     sub: `Context` },
      ],
    },

    {
      scale: 'return to center',
      body: `Five household types — the human, the heritage, the multifamily,
             the productivity, the reintegrator — become the pod: a
             self-organizing system of mixed household types supporting
             diverse and healthy communities that work for everyone.

             Each pod combines scaled-down private units of varying size with a
             shared kitchen, outdoor area and live/work space, so residents can
             assemble their own micro living systems as need changes.`,
      carousel: [
        { src: IMG + 'sheet-concept-households.jpg', ar: AR, alt: 'Concept households becoming the pod',
          title: `Concept Households`, sub: `Process` },
        { src: IMG + 'sheet-massing.jpg', ar: AR, alt: 'Massing development',
          title: `Massing`,      sub: `Development` },
        { src: IMG + 'sheet-site-plan.jpg', ar: AR, alt: 'Site plan',
          title: `Site Plan`,    sub: `Proposed` },
        { src: IMG + 'sheet-program-organization.jpg', ar: AR, alt: 'Program organization',
          title: `Organization`, sub: `Program` },
        { src: IMG + 'sheet-program-pods.jpg', ar: AR, alt: 'Pods as multi-family incubators',
          title: `The Pods`,     sub: `Program` },
        { src: IMG + 'sheet-circulation.jpg', ar: AR, alt: 'Circulation',
          title: `Circulation`,  sub: `Program` },
      ],
    },

    {
      scale: 'make it better',
      body: `The stepped-back massing makes the roof of each unit the terrace of
             the one above — green space that also captures water into a network
             of plants for downspouts, and landscape counterpoise remaining
             rainwater toward underground cover for future landscaping use.

             Rooftop PV supports the community, increasing thermal efficiency
             and biodiversity while offering habitat for pollinators. The
             building is set back on all sides to encourage air movement, and
             exhibits a high degree of porosity.`,
      carousel: [
        { src: IMG + 'sheet-water-solar.jpg', ar: AR, alt: 'Water capture and solar power',
          title: `Water + Solar`, sub: `Ecological` },
        { src: IMG + 'sheet-ventilation.jpg', ar: AR, alt: 'Natural ventilation',
          title: `Ventilation`,   sub: `Ecological` },
        { src: IMG + 'sheet-sections-ab.jpg', ar: AR, alt: 'Sections A and B',
          title: `Sections A + B`, sub: `Building` },
        { src: IMG + 'sheet-section-c.jpg', ar: AR, alt: 'Section C and site section',
          title: `Section C`,     sub: `Site + Building` },
        { src: IMG + 'sheet-section-mural.jpg', ar: AR, alt: 'Section D through the mural wall',
          title: `The Mural Wall`, sub: `Section D` },
        { src: IMG + 'sheet-narrative.jpg', ar: AR, alt: 'The courtyard',
          title: `The Courtyard`, sub: `View` },
      ],
    },
  ],

  media: [],
}
