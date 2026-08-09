// ═════════════════════════════════════════════════════════════
//  RIM COUNTRY LEARNING LANDSCAPE — everything on this page
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

const IMG = '/images/architecture/rcll/'
const AR  = '16 / 9'

export default {
  slug: 'rcll',
  title: 'Rim Country Learning Landscape',
  subtitle: 'Start anywhere. Go everywhere.',
  tagline: `An integrated vision for Arizona's home and destination for
            nature-based education and wellbeing — a distributed network of
            villages, co-designed with the community it belongs to.`,
  year: '2026',
  status: 'Vision — community proposal',
  location: 'Payson and Rim Country, Arizona',

  hero: {
    src: IMG + 'workshop-1.jpg', ar: '3 / 2',
    alt: 'Residents mapping their everyday paths at the community workshop',
    credit: ``,
    overlay: {
      lines: [
        ['Status', 'Vision — community proposal'],
        ['Role', 'Student designer · Integrated Vision team'],
        ['Course', `Designing Sustainable Solutions with Communities —
                    Arizona State University with Gila Community College`],
        ['Software', 'Adobe Creative Suite · Illustrator · After Effects'],
      ],
    },
  },

  facts: [
    ['Type',     'Community vision / nature-based education'],
    ['Status',   'Vision — community proposal'],
    ['Role',     'Student designer, Integrated Vision team'],
    ['Location', 'Payson and Rim Country, Arizona'],
    ['Method',   'Community co-design · multimethod research'],
  ],

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `Work with the local community to co-design and propose an
             integrated vision for Rim Country Learning Landscape as Arizona's
             premier home and destination for nature-based education and
             wellbeing experiences.

             Leverage existing resources to develop small, low-cost
             interventions.`,
    },

    {
      scale: 'precedent',
      resolve: `community + co-design =`,
      rows: [
        { src: IMG + 'slide-precedent-villages.jpg', ar: AR,
          alt: 'Early Mogollon Rim settlements',
          caption: `Early Mogollon Rim settlements.`,
          body: `The villages here did not stand apart from the landscape —
                 they were built into it, which made the relationship between
                 people and place legible, livable and meaningful. Not a
                 mini-cluster of themed buildings. A human-scaled, adaptable,
                 place-making artifact woven into the land.` },

        { src: IMG + 'slide-precedent-botanical.jpg', ar: AR,
          alt: 'Desert Botanical Garden',
          caption: `Desert Botanical Garden, begun in the 1930s.`,
          body: `A small effort by local citizens and scientists that grew into
                 a layered system of education, research, tourism and
                 engagement. Its two limitations are instructive: it is
                 anchored to a single location, and that location is
                 undesirable in summer. Rim Country is neither.` },
      ],
      closing: `Both were made by the **community** that lived there, which is
                why **co-design** is the method here rather than the courtesy.`,
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `growth :: preservation`,
      body: `can we create opportunity for economic **growth** in Rim Country
             while also protecting and **preserving** its existing character?`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `Payson already works. Residents value the town's pace, its
             character and its relationship with the landscape — and that care
             shows up as caution, as attentiveness, and as a desire to protect
             what exists.

             So the research started by listening. Interviews, site visits,
             a Mentimeter survey, and an interactive community workshop —
             asking what kinds of interaction feel right here, what would feel
             like too much, and what should never change.`,
      carouselAr: AR,
      carousel: [
        { src: IMG + 'research-multimethod.jpg', ar: AR, alt: 'Multimethod research',
          title: `Multimethod Research`, sub: `Method` },
        { src: IMG + 'research-community-input.jpg', ar: AR, alt: 'Community input',
          title: `Community Input`,     sub: `Method` },
        { src: IMG + 'research-what-builds-trust.jpg', ar: AR, alt: 'What builds trust',
          title: `What Builds Trust`,   sub: `Ethics` },
      ],
    },

    {
      scale: 'a network of villages',
      body: `The vision is not one destination. It is a distributed network of
             villages — flexible, place-based hubs that support learning,
             recreation, wellbeing and community life, built on what already
             exists and grown outward over time.

             Rim Country reads in four layers: the foundation of parks, trails
             and landmarks already used and valued; the circulation that links
             them; the villages themselves, where lightweight interventions
             mediate between them; and the temporal layer of pop-ups, seasonal
             programming and curricula that adapt at low cost.`,
      carouselAr: AR,
      carousel: [
        { src: IMG + 'slide-network.jpg', ar: AR, alt: 'A network of villages',
          title: `A Network of Villages`, sub: `Integrated Vision` },
        { src: IMG + 'rcll-network.jpg', video: IMG + 'rcll-network.mp4', ar: AR,
          alt: 'The network, assembling',
          title: `The Network Forming`,  sub: `Animation` },
        { src: IMG + 'slide-parts.jpg', ar: AR, alt: 'The parts of Rim Country',
          title: `The Parts`,            sub: `Rim Country` },
        { src: IMG + 'rcll-parts.jpg', video: IMG + 'rcll-parts.mp4', ar: AR,
          alt: 'The parts, assembling',
          title: `Foundation to Activation`, sub: `Animation` },
        { src: IMG + 'slide-layers.jpg', ar: AR, alt: 'The four layers',
          title: `The Four Layers`,      sub: `Experience` },
        { src: IMG + 'slide-intersection.jpg', ar: AR, alt: 'The intersection',
          title: `The Intersection`,     sub: `Education · Wellbeing · Economy` },
      ],
    },

    {
      scale: 'start anywhere',
      body: `Change happens slowly. Start with signage and small interventions
             that build social capital, and over time the Learning Landscape
             becomes visible.

             The Mini Paths of Payson was the live case study: a community
             journaling project asking residents to draw a path they take
             often and say why it matters. It maps the everyday routes that
             connect lives, places and community — and it doubles as the first
             piece of the network, built entirely out of paper, a table and a
             conversation.`,
      // one band, one shape. Anything that is not this shape is shown
      // whole on its own ground rather than cropped to fit.
      carouselAr: AR,
      carousel: [
        { src: IMG + 'mini-paths-card-1.jpg', fit: 'contain',
          alt: 'Mini Paths card, how it works',
          title: `How It Works`,        sub: `Mini Paths of Payson` },
        { src: IMG + 'mini-paths-card-2.jpg', fit: 'contain',
          alt: 'Mini Paths card, why it matters',
          title: `Why It Matters`,      sub: `Mini Paths of Payson` },
        { src: IMG + 'paths-map.jpg', fit: 'contain', alt: 'The Mini Paths map',
          title: `The Paths Map`,       sub: `Live Case Study` },
        { src: IMG + 'workshop-2.jpg', alt: 'The community workshop table',
          title: `The Workshop`,        sub: `Co-design` },
        { src: IMG + 'experiential-map.jpg', fit: 'contain', alt: 'Experiential map',
          title: `Experiential Map`,    sub: `Vision` },
      ],
    },
  ],

  media: [],
}
