// ═════════════════════════════════════════════════════════════
//  THE DIVIDE — everything on this page
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

const IMG = '/images/architecture/the-divide/'
const AR  = '3 / 2'          // the presentation boards are 36×24

export default {
  slug: 'the-divide',
  title: 'The Divide',
  tagline: `A disaster-responsive community hub for the low Sonoran Desert —
            architecture as the physical substrate of an intelligence that
            emerges under pressure rather than collapsing.`,
  year: '2025',
  status: 'Graduate studio — unbuilt',
  location: 'Litchfield Park, Arizona',

  hero: {
    src: IMG + 'amphitheater-night.jpg', ar: '16 / 9',
    alt: 'The amphitheater at night, under the canopy',
    credit: ``,
    overlay: {
      lines: [
        ['Status', 'Graduate studio — unbuilt'],
        ['Role', 'Sole Designer'],
        ['Instructor', 'Arne Emerson, Partner, Morphosis'],
        ['Software', 'Revit · Rhino · Grasshopper · Lumion · Adobe Creative Suite'],
      ],
    },
  },

  facts: [
    ['Type',     'Civic / community hub'],
    ['Status',   'Graduate studio — unbuilt'],
    ['Role',     'Sole Designer'],
    ['Location', 'Litchfield Park, Arizona'],
    ['Climate',  'ASHRAE 2B — extreme heat, prolonged drought'],
  ],

  // ══ THE POEM ══════════════════════════════════════════════
  poem: {
    title: `The Divide`,
    subtitle: `a project narrative poem`,
    // the drawing stands behind the verse; press play and the lines
    // in it are redrawn live from the song
    still: IMG + 'wave.jpg',
    audio: IMG + 'the-divide.mp3',
    credit: `Lyrics by Rachel Dudley · music by [Suno AI](https://suno.com/@sireneum)`,
    stanzas: [
      [`steel and shadow, walls too high,`,
       `echo chambers, hollow sky`,
       `the lines we draw cut far too deep`,
       `the price we pay—is it too steep?`],

      [`life`, `unfolds`, `unrehearsed`],

      [`meaning`, `reveals itself`, `uncoerced`],

      [`no escape, we find a way`,
       `through breath, through space,`,
       `another day`,
       `here in crisis comes direction`,
       `we are wired for connection`],
    ],
  },

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `Disasters do not arrive neatly labeled, one at a time. The brief
             simply asked us to identify a disaster and respond to it.

             Litchfield Park is a small desert suburb of Phoenix facing extreme
             heat, prolonged drought and aging infrastructure — and alongside
             those, polarization, defensive isolation, social fragmentation.

             It also sits in the shadow of Palo Verde, the largest nuclear
             generating station in the United States, which needs more than 65
             million gallons of fresh water a day to stay stable. In a region
             already short of water that is an impossible equation: divert the
             water from people, agriculture and shade, or risk failure at
             nuclear scale.`,
    },

    {
      scale: 'precedent',
      resolve: `complexity + curiosity =`,
      rows: [
        { src: IMG + 'sheet-precedents.jpg', ar: AR,
          alt: 'Precedent studies',
          caption: `Louvre Abu Dhabi · Medina Haram Piazza · Turaif Palace.`,
          body: `A dome that filters light into a rain of it. A field of
                 umbrellas that opens and closes with the day. Earth walls that
                 hold a courtyard cool. Each one mediates rather than blocks —
                 taking an unbearable input and passing on something a body can
                 live inside.` },

        { src: IMG + 'sheet-gradients.jpg', ar: AR,
          alt: 'The gradient invites transition',
          caption: `Six gradients: hot–cold, light–shadow, remembering–forgetting,
                    together–alone, work–play, sheltering–growing.`,
          body: `The second precedent is not a building. An RLC circuit uses a
                 resistor, an inductor and a capacitor in relationship to smooth
                 spikes, absorb shocks and prevent destructive oscillation. Given
                 an erratic input it reshapes the output into something
                 manageable — which is exactly what a canopy, a thermally massive
                 wall and a cistern do.` },
      ],
      closing: `Neither answers anything. Both make a place where **complexity**
                is allowed, and where contradiction turns into **curiosity**
                rather than defensiveness.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `coherence :: uncoerced`,
      body: `humans exist in a context of constant uncertainty. how can our
             built environment support community **coherence** and trust
             *before* we need each other the most? So that when faced with
             disaster, cooperation naturally emerges, **uncoerced**?`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The site is a pivotal liminal space between public and private
             realms, mediating the transition from busy mixed-use corridors to
             quiet residential areas. It is also a community nexus, home to two
             pieces of historic infrastructure: the Scout Lodge and the Airline
             Canal.

             Thirty-five miles away, Palo Verde. The vulnerability mapping sets
             the plant's radius against air quality, cost-burdened housing, and
             the residents least able to move — the old and the very young.`,
      carousel: [
        { src: IMG + 'sheet-site-map.jpg', ar: AR, alt: 'Context — site map',
          title: `Site Map`,          sub: `Context` },
        { src: IMG + 'sheet-context-region.jpg', ar: AR, alt: 'Litchfield Park in the region',
          title: `Litchfield Park`,   sub: `Disaster = Loss` },
        { src: IMG + 'sheet-vulnerability.jpg', ar: AR, alt: 'Mapping vulnerability',
          title: `Mapping Vulnerability`, sub: `Supplemental` },
      ],
    },

    {
      scale: 'return to center',
      body: `In the human brain the salience network decides what matters and
             shifts attention between reflection and action. Its ability to do
             that in a crisis depends on being well developed *before* the
             crisis occurs.

             So the plan is organized as a salient space: the Neuron and its
             branching support structure at the center, historic fabric kept,
             and flexible rooms — learning and making, small and large meeting,
             indoor food market, an emergency operations center and vault —
             arranged so the community can co-author their use over time.`,
      carousel: [
        { src: IMG + 'sheet-program.jpg', ar: AR, alt: 'Salient space — program',
          title: `Program`,        sub: `Salient Space` },
        { src: IMG + 'sheet-circulation.jpg', ar: AR, alt: 'Salient space — circulation',
          title: `Circulation`,    sub: `Salient Space` },
        { src: IMG + 'sheet-design-response.jpg', ar: AR, alt: 'Design response',
          title: `Design Response`, sub: `The Divide` },
        { src: IMG + 'sheet-plans-lower.jpg', ar: AR, alt: 'Floor plans, lower',
          title: `Floor Plans`,    sub: `Lower` },
        { src: IMG + 'sheet-plans-upper.jpg', ar: AR, alt: 'Floor plans, upper',
          title: `Floor Plans`,    sub: `Upper` },
      ],
    },

    {
      scale: 'adaptive shade',
      body: `In this climate direct sun is the thing that decides whether a
             place is usable at all — often even in winter. The canopy is what
             makes the rest of the project possible.

             It does more than shade. It directs rainwater into a large embedded
             cistern; it was studied as a dynamically actuated surface that could
             open to let winter sun and cloudy-day light through, or close to
             shade the whole site in summer; and its panels are a light-filtering
             BIPV material, so the same structure that protects the site from
             solar radiation also captures and redirects it.

             These are iterations from Rhino and Grasshopper — click a clip to
             watch it move.`,
      carousel: [
        { src: IMG + 'canopy-folding.jpg', video: IMG + 'canopy-folding.mp4', ar: '16 / 9',
          alt: 'Parametric folding shade structure tests',
          title: `Folding Tests`,     sub: `Parametric` },
        { src: IMG + 'canopy-starshade.jpg', video: IMG + 'canopy-starshade.mp4', ar: '16 / 9',
          alt: 'Starshade canopy animation',
          title: `Starshade`,         sub: `Parametric` },
        { src: IMG + 'canopy-shade-study.jpg', video: IMG + 'canopy-shade-study.mp4', ar: '16 / 9',
          alt: 'Combined shade study',
          title: `Shade Study`,       sub: `Solar` },
        { src: IMG + 'sheet-water-capture.jpg', ar: AR, alt: 'Water capture section',
          title: `Water Capture`,     sub: `Section` },
        { src: IMG + 'cistern.jpg', ar: '16 / 9', alt: 'The cistern, looking across',
          title: `The Cistern`,       sub: `View` },
        { src: IMG + 'sheet-precedents.jpg', ar: AR, alt: 'Precedent studies',
          title: `Canopy Precedents`, sub: `Inspiration` },
      ],
    },

    {
      scale: 'make it better',
      body: `Walls and roof assemblies are built for the worst case: earth
             integration and radiation shielding, thermally massive fortress
             walls that take the day's heat and pass it slowly to the interior
             overnight, and a sunken garden reaching the more stable
             temperatures below grade.

             An adaptable semi-transparent PV canopy harvests rain and slows
             evapotranspiration for the gardens under it, regenerating a riparian
             microbiome along the historic canal — and turning solar radiation
             into electricity and living plant systems rather than merely
             blocking it.`,
      carousel: [
        { src: IMG + 'sheet-design-physical.jpg', ar: AR, alt: 'Design solutions — physical',
          title: `Physical Strategies`, sub: `Design Solutions` },
        { src: IMG + 'sheet-wall-assembly.jpg', ar: AR, alt: '3D printed wall assembly',
          title: `Wall Assembly`,   sub: `Structure` },
        { src: IMG + 'sheet-elevations-ns.jpg', ar: AR, alt: 'North and south elevations',
          title: `North + South`,   sub: `Elevations` },
        { src: IMG + 'sheet-elevations-we.jpg', ar: AR, alt: 'West and east elevations',
          title: `West + East`,     sub: `Elevations` },
      ],
    },
  ],

  media: [],
}
