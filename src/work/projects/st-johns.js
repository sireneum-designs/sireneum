// ═════════════════════════════════════════════════════════════
//  ST. JOHN'S INNOVATION CAMPUS — everything on this page
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

const IMG = '/images/architecture/st-johns/'
const AR  = '3 / 2'

export default {
  slug: 'st-johns',
  title: "St. John's Innovation Campus",
  tagline: `A workforce training campus for the City of St. Johns — automotive,
            energy technology and welding under one roof, designed to generate
            more power than it uses.`,
  year: '2024',
  status: 'Schematic design — unbuilt',
  location: "St. Johns, Arizona",

  hero: {
    src: IMG + 'sheet-cover.jpg', ar: '3 / 2',
    alt: 'The campus approach',
    credit: ``,
    // the landing image is white, so the page's furniture inverts on it
    light: true,
    overlay: {
      lines: [
        ['Status', 'Schematic design — unbuilt'],
        ['Role', 'Architectural Designer'],
        // an array puts each name on its own line, at full size
        ['AOR', [`Claudio Vekstein, Program Head & Professor of Architecture,
                  Arizona State University`,
                 `Devan Porter, Principal, Design Service Professionals`]],
        ['Software', 'Revit · Rhino · Adobe Creative Suite'],
      ],
    },
  },

  facts: [
    ['Type',     'Educational / workforce training'],
    ['Status',   'Schematic design'],
    ['Role',     'Architectural Designer'],
    ['Location', "St. Johns, Arizona"],
    ['Energy',   '806,000 kWh generated · 97,000 gal harvested, annually'],
  ],

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `The City of St. Johns, a small town on the Colorado Plateau in
             western Arizona, faces major transition due to the planned
             retirement of the coal-fired Coronado Generating Station nearby
             that has traditionally sustained their economy.

             Because of this, St. John's Innovation Campus must deliver
             community support and educational programming capable of
             delivering important workforce skill development and retraining.`,
    },

    {
      scale: 'precedent',
      resolve: `learn + generate =`,
      rows: [
        { src: IMG + 'sheet-passive-strategies.jpg', ar: AR,
          alt: 'Passive design strategies',
          caption: `Solar orientation and predominant winds.`,
          body: `The plan is set against the sun and the wind before it is set
                 against anything else. The wings turn to take north light into
                 the shops, put their backs to the summer west, and open to the
                 prevailing breeze — so the envelope is doing work no mechanical
                 system has to repeat.` },

        { src: IMG + 'sheet-terracing.jpg', ar: AR,
          alt: 'Terraced massing strategy',
          caption: `Terracing the section to the slope.`,
          body: `The roof steps with the ground rather than flattening it. Each
                 step becomes clerestory: daylight deep into plan, stack
                 ventilation out of the top, and a south face angled to carry
                 photovoltaics without a separate array.` },
      ],
      closing: `The envelope has two jobs at once — to hold the rooms where
                people **learn** a trade, and to **generate** what it takes to
                keep them running.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `adapt :: sustain`,
      body: `can a building where people learn a trade also be the catalyst for
             **sustain**able growth and the ability to **adapt** in the face of
             uncertain change?`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The campus sits on Airport Road at the edge of town. The site plan
             sets the wings against the approach, keeps service and student
             traffic apart, and leaves the center open as the arrival court.

             Departments are zoned so that the noisiest work sits furthest from
             the classrooms, without putting either out of sight of the other.`,
      carousel: [
        { src: IMG + 'sheet-project-information.jpg', ar: AR, alt: 'Master plan and location',
          title: `Master Plan`,   sub: `Project Information` },
        { src: IMG + 'sheet-site-plan.jpg', ar: AR, alt: 'Site plan',
          title: `Site Plan`,     sub: `Proposed` },
      ],
    },

    {
      scale: 'return to center',
      body: `A single circulation spine runs the length of the plan and bends
             with the site, so every department opens off one route and the
             building can be read at a glance from inside it.`,
      carousel: [
        { src: IMG + 'sheet-area-plan.jpg', ar: AR, alt: 'Area plan',
          title: `Area Plan`,     sub: `Plans` },
        { src: IMG + 'sheet-section-perspective.jpg', ar: AR, alt: 'Section perspective',
          title: `Section Perspective`, sub: `Drawings` },
        { src: IMG + 'sheet-interiors.jpg', ar: AR, alt: 'Interior perspectives',
          title: `Interiors`,     sub: `Perspectives` },
      ],
    },

    {
      scale: 'make it better',
      body: `Each year the building is capable of generating 806,000 kWh of
             solar energy and
             harvests 97,000 gallons of rainwater — a net power producer,
             running DC distribution to the shops where the equipment wants it.

             Passive heating and cooling, natural daylighting, circular
             materials and access to nature were carried through the drawings
             rather than added to them: the standing-seam roof is the array, the
             clerestory is the light fixture, and the terrace is the water
             catchment.`,
      carousel: [
        { src: IMG + 'sheet-sustainable.jpg', ar: AR, alt: 'Sustainable strategies',
          title: `Sustainable Strategies`, sub: `Section Perspective` },
        { src: IMG + 'sheet-elev-north-wing.jpg', ar: AR, alt: 'North wing elevations',
          title: `North Wing`,    sub: `Elevations` },
        { src: IMG + 'sheet-elev-south-wing.jpg', ar: AR, alt: 'South wing elevations',
          title: `South Wing`,    sub: `Elevations` },
        { src: IMG + 'sheet-elev-east-wing.jpg', ar: AR, alt: 'East wing elevations',
          title: `East Wing`,     sub: `Elevations` },
        { src: IMG + 'sheet-sections-1.jpg', ar: AR, alt: 'Building sections',
          title: `Building Sections`, sub: `Drawings` },
        { src: IMG + 'sheet-perspectives.jpg', ar: AR, alt: 'Building perspectives',
          title: `Building Perspectives`, sub: `Renders` },
      ],
    },
  ],

  media: [],
}
