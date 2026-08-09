// ═════════════════════════════════════════════════════════════
//  THE STORY PAGE — everything on it
//
//  The visitor lands in the middle, on the introduction. From there:
//    UP    → sireneum. The design persona: the name, the myth,
//            the way of working.
//    DOWN  → rachel. Chronological. A CV, told as a story.
//
//  Writing rules, all of them:
//    · keep the backticks ` ` around the text
//    · *asterisks around a phrase* make it italic
//    · a blank line starts a new paragraph
//    · lines beginning `1. ` or `- ` become a list
//
//  `label` is the small gray word at the left of each section.
//  `media` is optional — one image makes a full-bleed band, two
//  sit side by side.
// ═════════════════════════════════════════════════════════════

export const story = {

  title: `Rachel Dudley`,

  // ══ THE LANDING ════════════════════════════════════════════
  //  Where the visitor arrives. The poem sits left, the introduction
  //  right, and the headshot with the name above them both.
  hero: {
    src: '/images/origin/rd-headshot.jpg',
    alt: `Rachel Dudley`,
    credit: '',   // photographer, if you want one
    // sits directly under the name, not as a row in the list
    role: `Architectural Designer · P.E. (Electrical), Arizona`,
    lines: [
      ['Practice', `Sireneum Designs`,
                   `Independent design practice integrating architecture,
                    engineering, visualization, and research through
                    residential and community-scale projects.`],
      ['Based', `Litchfield Park, Arizona`],
      ['CV', `[Download the paper version](/writing/rachel-dudley-cv-2608.pdf)`],
    ],
  },

  // the two directions, named on the portrait
  up:   `sireneum's story`,
  down: `rachel's story`,

  // ══ SCROLLING UP — sireneum, the design persona ════════════
  //    index 0 = one step up. Furthest from the portrait = last.
  sireneum: [
    {
      label: `the name`,
      title: `a place for resonant voices`,
      body: `Sireneum is a neologism.

             *Siren* — from the Greek mythology.
             *-eum* — a Latin suffix meaning 'a place for'.

             Sireneum is a place where curiosity is invited, difference is held
             safely, and meaningful relationships can propagate.`,
    },
    {
      label: `resonance`,
      title: `sirens don't compel by force`,
      body: `We are drawn toward what already resonates within us. The Siren's
             song is irresistible because it reveals something true.

             I believe architecture works the same way. The places that support
             us most do not demand our attention, they call to us.`,
    },
    {
      label: `committed to hearing`,
      title: `every song carries some truth`,
      body: `In Homer's *Odyssey*, Odysseus did not close his ears to the
             Sirens' song. He knew he needed to listen, even though that
             required taking a risk.

             Sireneum is committed to hearing what a site, a client, or a
             community is trying to say, even if the message is
             uncomfortable.

             Like Odysseus, I believe this is the only way to navigate the
             rocky coast and make it safely to shore as a group.`,
    },
  ],

  // ══ THE INTRODUCTION ══════════════════════════════════════
  //  First thing reached descending into *rachel*. The poem sits
  //  left, the introduction right.
  intro: {
    poem: {
      title: `The Cats of Kilkenny`,
      by: `Anonymous`,
      lines: [
        `There were once two cats of Kilkenny,`,
        `Each thought there was one cat too many;`,
        `So they fought and the fit,`,
        `And they scratched and they bit,`,
        `Till, excepting their nails,`,
        `And the tips of their tails,`,
        `Instead of two cats, there weren't any.`,
      ],
    },

    narrative: `I ran across this poem the other day and it struck a chord. It
                tells a story of opposing forces so consumed by their differences
                — by their contradictions — that they end up destroying
                themselves.

                **It's so easy these days to let difference become combat instead
                of conversation.**

                Hi, I'm Rachel. I'm a composite waveform, full of contradictions.

                I am often loquacious but always listening deeply. I am a
                generalist who also loves getting into the weeds. I am light.
                Both a particle and a wave.

                My dominant frequency is curiosity. I will not be growing out of
                my "why?" phase. My mind lives in the interstitial spaces between
                neurology, psychology, sociology, biology, physics, history,
                philosophy and storytelling.

                I am a daughter, wife, parent, friend and colleague. I am consumed
                by a persistent desire to turn meaning into matter and I intend to
                use my time to design systems and spaces where others feel enabled
                to do the same.

                **And. I will always have time for a conversation with
                contradiction.**`,
  },

  // ══ SCROLLING DOWN — rachel, chronological ═════════════════
  // ══ THE CV ════════════════════════════════════════════════
  //  Follows the trajectory of Rachel_Dudley_CV_Draft. Each section
  //  is a label in the gutter and a run of entries on a timeline
  //  spine. `when` is optional — without it an entry still sits on
  //  the spine, so a list and a chronology look like one document.
  cv: [
    {
      label: `practice focus`,
      lede: `Strengthening relationships between humans and their places.`,
      chant: [
        `Architecture shapes what we notice.`,
        `What we notice shapes what we care for.`,
        `What we care for, cares for us.`,
      ],
      body: `I see our environment not just as objects to be manipulated, but
             as something we exist in relationship with.`,
    },

    {
      label: `education`,
      entries: [
        { when: `2026`, title: `Master of Architecture`,
          org: `Arizona State University`,
          note: `Four-time Design Excellence Award recipient · Distinguished
                 Graduate` },
        { when: `2009`, title: `B.S. Electrical Engineering`,
          org: `Arizona State University`,
          note: `Power & Signal Processing · Capstone Design Team Award ·
                 summa cum laude` },
        { when: `2003`, title: `B.S. Business Administration`,
          org: `Regis University`,
          note: `Honors Program · minor in Communication · summa cum laude` },
      ],
    },

    {
      // Hidden, not deleted — /work does this job, and listing the
      // projects twice weakened both. Remove `hidden` to bring it back.
      hidden: true,
      label: `selected projects`,
      entries: [
        { title: `Outside-In House`, org: `Lead Designer · Project Manager`,
          href: `/work/outside-in-house`,
          note: `Residential remodel in central Phoenix that reimagines a
                 modest 1955 CMU ranch style home around an Eichler-inspired
                 central courtyard.` },
        { title: `The Divide`, href: `/work/the-divide`,
          note: `Capstone studio exploring environmental systems, adaptive
                 public architecture and the conditions that support
                 antifragility in the context of disaster in Litchfield
                 Park, AZ.` },
        { title: `Here`, org: `Museum to the Memory of Water`,
          href: `/work/here`,
          note: `Mixed use design investigating the importance of water and
                 environmental adaptation in the desert of Arizona.` },
        { title: `The PODject`, href: `/work/podject`,
          note: `Urban infill housing prototype exploring flexible living,
                 community, and shared resources in the Boyle Heights
                 neighborhood of LA.` },
        { title: `ISIAC`, href: `/work/isiac`,
          note: `A multigenerational learning environment in the Leimert Park
                 neighborhood of LA, designed to support artistic
                 collaboration, shared making, and community
                 self-determination.` },
      ],
    },

    {
      label: `selected writing`,
      entries: [
        { title: `particle:wave:: Architecture at the Threshold of Resonance`,
          // drop the PDF at public/writing/ and it is served from the root
          href: `/writing/particle-wave.pdf`,
          note: `Critical essay exploring architecture through systems
                 thinking, perception, and feedback.` },
      ],
    },

    {
      label: `experience`,
      entries: [
        { when: `2022 — now`, title: `Sireneum`,
          org: `Principal · Architectural Designer`,
          note: `Independent freelance design practice.` },
        { when: `2010 — 2021`, title: `TEAM Integrated Engineering / BB&E`,
          org: `Electrical Engineer`,
          note: `Supporting the Air Force Civil Engineer Center.` },
      ],
    },

    {
      label: `technical skills`,
      entries: [
        { title: `Computational design`,
          note: `Revit · Rhino · Grasshopper · QGIS · ClimateStudio · Adobe
                 Creative Suite · Lumion` },
        { title: `Human–AI collaborative design`,
          note: `Iterative concept development, research synthesis, design
                 critique, visualization, and technical communication feedback
                 and assistance.` },
      ],
    },

    {
      label: `community engagement`,
      entries: [
        { when: `2026`,
          title: `Designing Sustainable Solutions with Communities:
                  Rim Country Learning Landscape`,
          org: `Arizona State University Professional Learning Hub Certificate`,
          badge: `/images/credentials/asu-community-science-badge.png`,
          href: `https://api.badgr.io/public/assertions/_G0FpftcS8agPoWPRCfNOw`,
          note: `Earning Criteria: Community-engaged research practiced with reciprocity, respect
                 and humility; relationships built with the people who live
                 there; concrete, doable projects co-designed around community
                 priorities and carried through to outcomes partners can use.` },

        { when: `2018 — now`, title: `City of Litchfield Park`,
          org: `Board of Adjustment (Chair) · Design Review Board (Vice Chair)` },
      ],
    },

    {
      label: `references`,
      note: `Contact information available on request.`,
      entries: [
        { title: `Ian Dickenson, AIA`,  org: `Associate Principal, Sasaki` },
        { title: `Devan Porter, AIA`,   org: `Principal, Design Service Professionals` },
        { title: `Claudio Vekstein`,    org: `Program Head & Professor of Architecture,
                                              Arizona State University` },
        { title: `Karín Santiago, AIA, LEED AP BD+C`,
          org: `Principal, Lightvox Studio` },
      ],
    },
  ],
}
