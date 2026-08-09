// ═════════════════════════════════════════════════════════════
//  HERE — everything on this page
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

const IMG = '/images/architecture/here/'

export default {
  slug: 'here',
  title: 'Here',
  tagline: `An exploration of what it means to be human in a world of
            uncertainty — an open-air Museum to the Memory of Water, a
            storytelling amphitheater and a resident community, emerging from
            the Sonoran Desert on the bank of the Salt River.`,
  year: '2024',
  status: 'Graduate studio — unbuilt',
  location: 'Granite Reef Dam, Phoenix, AZ',

  hero: {
    // The clip plays muted and loops, with the poster showing until
    // it can start. Remove `video` and the still stands on its own.
    video: IMG + 'here-promo.mp4',
    src: IMG + 'here-poster.jpg', ar: '16 / 9',
    alt: 'The walled city — the sunken residential street',
    credit: ``,
    overlay: {
      lines: [
        ['Status', 'Graduate studio — unbuilt'],
        ['Role', 'Sole Designer'],
        ['Instructor', 'Karín Santiago, AIA, LEED AP BD+C'],
        ['Software', 'Revit · Rhino · Grasshopper · Lumion · Adobe Creative Suite'],
      ],
    },
  },

  facts: [
    ['Type',     'Museum · amphitheater · housing'],
    ['Status',   'Graduate studio — unbuilt'],
    ['Role',     'Sole designer'],
    ['Location', 'Salt River, Sonoran Desert, Arizona'],
    ['Scale',    '32,000 SF residential · 4.5M gallons annual capture'],
  ],

  // ══ THE POEM ══════════════════════════════════════════════
  //  The last thing reached climbing — the project said again, in
  //  the form it was first written in.
  poem: {
    title: `[Here]`,
    subtitle: `a project narrative in poem form`,
    // the verse sits over moving water, darkened enough to read on
    video: IMG + 'here-water.mp4',
    poster: IMG + 'here-water-poster.jpg',
    audio: IMG + 'here.mp3',
    credit: `Lyrics by Rachel Dudley · music by [Suno AI](https://suno.com/@sireneum)`,
    stanzas: [
      [`I am water. I am memory.`,
       `Zeitgeber — time-giver.`,
       `Marking what has been.`,
       `And carrying you to what will be.`],

      [`[Now]`,
       `You are being.`,
       `Connected to the ancient.`,
       `Present with the unknown.`,
       `[Here]`],
    ],
  },

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `The brief asked for a mixed-use development at the Granite Reef
             Dam: twenty-four independent living units, a museum dedicated to
             water, an amphitheater, and an investigation into 3D printed wall
             systems.

             It was also an opportunity to ask something larger: What it means
             to be human in a rapidly changing and uncertain technological
             landscape and physical climate.`,
    },

    {
      scale: 'precedent',
      resolve: `human + place =`,
      // each drawing set against the paragraph it belongs to
      rows: [
        { src: IMG + 'chinampas-precedent.jpg',
          alt: 'Chinampas — Tenochtitlan',
          caption: `Chinampas, Tenochtitlan.`,
          body: `The chinampas of Tenochtitlan fed hundreds of thousands — a
                 farming system that is also a water system, a structure that
                 is also a soil. Here they return as a circulating exhibit and
                 a growing medium, cooling the air as they irrigate.` },

        { src: IMG + 'calendar-stick.jpg',
          alt: "Oos:hikbina — Akimel O'odham calendar stick",
          caption: `*Oos:hikbina*, Akimel O'odham — and the shade drawn from it.`,
          body: `The Akimel O'odham, former residents of this land, kept a
                 shared memory on *oos:hikbina* — a saguaro calendar stick,
                 notched year by year. Its form is drawn into the shade
                 structure over the site's half-mile walking path, buffering
                 the sun and opening or closing the view depending on where
                 you stand.` },
      ],
      closing: `Each is a record of what it took for a **human** to stay in
                relationship with **place**.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `adapt :: discover`,
      body: `what did it mean to be human in this place before? what will it
             mean to be a human in this place later? what does it mean to be a
             human at all? the answer flows amorphous, like water, always
             ready to **discover** a new form, changing shape in
             **adaptation** to its vessel.`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `The site is designed to support a community of permanent residents
             who care for it and demonstrate sustainable, land-based living
             practices, as the Hohokam did for centuries. It serves as a
             cultural and eco-tourism hub, with an open-air amphitheater for
             cultural performances, gatherings and events.

             The community is shaped by a circuit of dense 3D-printed walls
             that regulate heat, give access to a stable thermal environment
             below ground, and give form to a storage system holding and
             circulating roughly 3.2 million gallons of rainwater — harvested
             from an existing ephemeral wash, filtered, and directed into the
             wall itself.`,
      // the sheets carry their own printed legends, so the room key
      // is on the drawing rather than repeated in the page
      carousel: [
        { src: IMG + 'sheet-site-plan.jpg',
          alt: 'Site plan — Here',
          title: `Site Plan`,           sub: `Proposed` },
        { src: IMG + 'sheet-visitor-circulation.jpg',
          alt: 'Visitor circulation',
          title: `Visitor Circulation`, sub: `Proposed` },
        { src: IMG + 'sheet-living-museum.jpg',
          alt: 'A living museum — the site in its setting',
          title: `A Living Museum`,     sub: `Site` },
      ],
    },

    {
      scale: 'return to center',
      body: `The walled city was once a common means of physical protection.
             This project adapts that solution for the modern-day threat.

             The residential area is sunken into the earth and surrounded by a
             fortress of thick 3D-printed walls which now support natural
             cooling and thermal regulation. The wall also creates a nearly
             half-mile-long raised path running along the perimeter — an
             elevated perspective of inside and out, emphasizing the balance
             between human adaptation and the surrounding landscape.`,
      carousel: [
        { src: IMG + 'sheet-walled-city.jpg',
          alt: 'The sunken residential street inside the wall',
          title: `The Walled City`,     sub: `Artifacts` },
        { src: IMG + 'sheet-perimeter-wall.jpg',
          alt: 'Perimeter wall section',
          title: `Perimeter Wall`,      sub: `Structure` },
        { src: IMG + 'sheet-site-section.jpg',
          alt: 'Site section through the residential spaces',
          title: `Residential Spaces`,  sub: `Section B–B` },
      ],
    },

    {
      scale: 'make it better',
      body: `Based on an average annual rainfall of nine inches, the design
             captures an estimated 4,500,000 gallons of runoff each year —
             enough to support the community's water needs while showing the
             practice itself.

             Below-grade siting and a network of earth-cooled air tubes,
             inspired by the natural blowholes at Wupatki National Monument,
             support passive cooling throughout the grounds. Each housing unit
             generates much of its own power through roof-integrated PV, and
             the site runs on shared driverless vehicles charged from the same
             solar banks.`,
      // A band of sheets at one height. `title` is what shows when you
      // hover a sheet — the same title it carries on the drawing.
      // A band of sheets at the drawing's own 11×17. `title` and `sub`
      // are what show when you hover one.
      carousel: [
        { src: IMG + 'sheet-water-management.jpg',      alt: 'Water management',
          title: `Water Management`,      sub: `Sustainability` },
        { src: IMG + 'sheet-earth-conditioned-air.jpg', alt: 'Earth conditioned air',
          title: `Earth Conditioned Air`, sub: `Sustainability` },
        { src: IMG + 'sheet-wall-system.jpg',           alt: '3D printed wall system',
          title: `3D Printed Wall System`, sub: `Structure` },
        { src: IMG + 'sheet-housing.jpg',               alt: 'Housing',
          title: `Housing`,               sub: `Sustainability` },
        { src: IMG + 'sheet-transportation.jpg',        alt: 'Transportation',
          title: `Transportation`,        sub: `Sustainability` },
        { src: IMG + 'sheet-tree-planters.jpg',         alt: 'Tree planters',
          title: `Tree Planters`,         sub: `Structure` },
        { src: IMG + 'sheet-chinampas-section.jpg',     alt: 'Chinampas section',
          title: `Chinampas`,             sub: `Artifacts` },
      ],
    },
  ],

  media: [],
}
