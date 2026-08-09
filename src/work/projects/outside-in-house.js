// ═════════════════════════════════════════════════════════════
//  OUTSIDE-IN HOUSE — everything on this page
//
//  This is the only file you edit for this project. Words, images,
//  captions, marker positions, all of it.
//
//  Writing rules, all of them:
//    · keep the backticks ` ` around the text
//    · *asterisks around a phrase* make it italic
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
//    media    images beneath the text
//    pair     two views in identical frames, titles on the image
//    plans    a drawing shown beside `plan`
//    plan     a drawing with A/B/C view markers, and a room key
//    collage  a sheet of details; click any one to read it full size
// ═════════════════════════════════════════════════════════════

const IMG = '/images/architecture/outside-in-house/'

export default {
  slug: 'outside-in-house',
  title: 'Outside-In House',
  tagline: `A residential remodel that turns a modest post-war CMU ranch into an
            Eichler-inspired retreat around an open-air courtyard.`,
  year: '2025–26',
  status: 'Permitting',
  location: 'Central Phoenix, Arizona',
  lead: true,

  // ── the landing image ─────────────────────────────────────
  hero: {
    src: IMG + 'hero_render_night.jpg',
    alt: 'The house at dusk, courtyard glowing through the entry',
    // small print, bottom right of the image
    credit: `Rendering generated using ArchSynth`,
    overlay: {
      lines: [
        ['Status', 'In permitting'],
        // the scope sits with Role so it reads as what you did
        ['Role', `Lead Designer · Project Manager`,
                 `Concept design, architectural and MEP systems design and
                  documentation, consultant coordination, and permitting.`],
        ['AOR', 'Devan Porter, DSP'],
      ],
    },
  },

  facts: [
    ['Type',     'Residential remodel'],
    ['Status',   'In permitting'],
    ['Role',     'Lead Designer · Project Manager'],
    ['AOR',      'Devan Porter, DSP'],
    ['Location', 'Central Phoenix, Arizona'],
    ['Area',     '1,696 → 1,946 SF livable'],
  ],

  body: [
    `A 1950s block ranch, bought by owners who had just moved down from the
     Pacific Northwest and found the house turning its back on the one thing
     they had come for.`,
  ],

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `The homeowners were drawn to the neighborhood by its mid-century
             charm, but the floor plan of their 1955 CMU ranch had been
             haphazardly modified many times over the years by previous owners.

             They needed independent space for adult children to visit, a home
             office capable of receiving clients, and a strong connection to the
             outdoors, all while returning the home to its original charm and
             honoring the quiet character of the neighborhood.`,
    },

    {
      scale: 'precedent',
      body: `The Eichler courtyard floor plan demonstrates how a home can offer
             privacy and protection from the outside world, while still remaining
             open to it at the same time.

             Reinterpreted for Phoenix's harsh climate and today's energy
             standards, the best **ideas from the past integrate with the
             present** context.`,
      // Climbing away, the paragraph dissolves and its bold phrase
      // reassembles as this line. Words here that also appear in bold
      // above fly up out of the sentence; everything else fades in.
      resolve: `past + present =`,
      media: [
        { kind: 'drawing', src: IMG + 'eichler_precedent.jpg',
          alt: 'Eichler atrium plan',
          // sits in the margin beside the paragraph; click to enlarge
          beside: true,
          caption: `Eichler Homes plan HPO-15, Claude Oakland, Architect.
                    Via [MCM Daily](https://blog.mcmdaily.com/the-art-of-the-eichler/).` },
      ],
    },
    {
      scale: 'central question',
      feature: true,        // set larger than body text, and scatters
      resolve: `modern :: original`,
      body: `can a modest post-war ranch house become a **modern** and comfortable
             multigenerational home without abandoning its **original**
             character?`,
    },

  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The original facade featured a soldier-stacked block wall which had
             become hidden underneath decades of overgrown landscaping.

             The decision was made to preserve this as the anchor of an entry
             sequence capable of simultaneously announcing its presence to
             visitors while also offering a generous and deliberate transition
             between the street and the interior areas of the home.`,
      // Two views of one elevation in identical 16:10 frames. `focus`
      // moves the crop: 'center', 'top', 'bottom', or a pair like '50% 35%'.
      pair: [
        { src: IMG + 'revit_facade_render.jpg',
          alt: 'Revit rendering of the proposed front facade',
          focus: 'center',
          caption: `Revit Generated Rendering` },
        { src: IMG + 'IMG_3664_edited.jpg',
          alt: 'The existing front facade',
          focus: '50% 55%',
          caption: `Before — Front Façade` },
      ],
    },

    {
      scale: 'return to center',
      body: `Years of unpermitted additions and alterations had created a chaotic
             plan with varying floor heights.

             The floor plan was rearranged to maintain existing utility locations
             and CMU walls while creating three distinct living zones under one
             roof, all sharing one central courtyard — a primary living area for
             the main residents, a detached front office, and two independently
             accessible guest bedrooms sharing a tandem bathroom suite.`,
      // side by side so the two can actually be compared. Click either
      // to open it large. The proposed plan carries the markers.
      plans: [
        { src: IMG + 'old-floor-plan.jpg',
          alt: 'Existing floor plan', caption: `Existing — 1,696 SF livable`,
          // the key prints beneath the drawing, inside the same white
          key: {
            columns: 2,
            items: [
              [1,  'Carport'],
              [2,  'Entry'],
              [3,  'Living'],
              [4,  'Bedroom'],
              [5,  'Bathroom'],
              [6,  'Kitchen'],
              [7,  'Dining'],
              [8,  'Storage'],
              [9,  'Arizona Room'],
              [10, 'Laundry'],
              [11, 'Utility'],
              [12, 'Covered Patio'],
            ],
          } },
      ],
      plan: {
        src: IMG + 'new-floor-plan.jpg',
        alt: 'Proposed floor plan — Outside-In House',
        caption: `Proposed — 1,946 SF livable`,
        key: {
          columns: 3,
          items: [
            [1,  'Attached Carport'],
            [2,  'Den'],
            [3,  'Open-Air Entry Courtyard'],
            [4,  'Bed 3'],
            [5,  'Portico'],
            [6,  'Closet 3'],
            [7,  'Vanity'],
            [8,  'Toilet / Bath'],
            [9,  'Bed 2'],
            [10, 'Closet 2'],
            [11, 'Primary Closet'],
            [12, 'Utility'],
            [13, 'Closet 4'],
            [14, 'Primary Bath'],
            [15, 'Toilet'],
            [16, 'Vestibule'],
            [17, 'Primary Bed'],
            [18, 'Great Room'],
            [19, 'Covered Patio'],
            [20, 'Dining'],
            [21, 'Kitchen'],
            [22, 'Powder'],
            [23, 'Pantry / Laundry'],
            [24, 'Back Entry'],
          ],
        },
        // Percentages of the image, landing on the A/B/C glyphs already
        // drawn on the plan — they say where you are standing.
        // To adjust: open the page with ?spots on the end of the URL,
        // click the exact point, and paste the numbers it gives you.
        // Each marker stands exactly where you would be to see the
        // view it opens. `credit` prints small on the image itself,
        // the same way it does on the landing render.
        spots: [
          { id: 'A', x: 56.4, y: 29.0, src: IMG + 'render_a.jpg',
            alt: `The open-air entry courtyard`,
            caption: `A — the open-air entry courtyard`,
            credit: `Rendering generated using ArchSynth` },
          { id: 'B', x: 56.2, y: 43.8, src: IMG + 'render_b.jpg',
            alt: `The great room, looking out`,
            caption: `B — the great room, looking out`,
            credit: `Rendering generated using ArchSynth` },
          { id: 'C', x: 51.4, y: 12.8, src: IMG + 'render_c.jpg',
            alt: `The house from the street`,
            caption: `C — the house from the street`,
            credit: `Rendering generated using ArchSynth` },
        ],
      },
    },

    {
      scale: 'make it better',
      body: `To ensure comfort even during harsh Phoenix summer heat and meet
             current energy requirements, continuous insulation above the roof
             deck was found to be both the most energy- and the most
             cost-effective solution.

             Bonus: this strategy maintains the thin low-slope profile of the
             original house and ensures that HVAC ducting would be encapsulated
             in the building envelope.`,
      // A sheet of details; click any one to read it full size.
      // These drawings carry their own titles, so no captions here.
      // Order here is the order they are placed on the sheet:
      // detail 1 across the top, the envelope plan down the left, and
      // the legend + two sections down the right.
      collage: [
        { src: IMG + 'thermal_envelope_wall_section.jpg', tall: true,
          alt: 'Thermal envelope wall section' },
        { src: IMG + 'envelope_plan.jpg',
          alt: 'Envelope plan' },
        { src: IMG + 'energy_legend.jpg', legend: true,
          alt: 'Energy compliance path and thermal envelope legend' },
        { src: IMG + 'envelope_section_1.jpg',
          alt: 'Thermal envelope section, east–west' },
        { src: IMG + 'envelope_section_2.jpg',
          alt: 'Thermal envelope section, north–south' },
      ],
    },
  ],

  media: [],
}
