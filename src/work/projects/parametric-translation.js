// ═════════════════════════════════════════════════════════════
//  PARAMETRIC TRANSLATION — everything on this page
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

const IMG = '/images/architecture/parametric-translation/'

export default {
  slug: 'parametric-translation',
  title: 'Parametric Translation',
  tagline: `Rhino and Grasshopper into Revit, with the fidelity of the
            translation actually measured.`,
  year: '2024',
  status: 'Method',
  method: true,

  hero: {
    src: '', ar: '16 / 9',
    alt: 'The translated surface, Rhino beside Revit',
    credit: ``,
    overlay: {
      lines: [
        ['Status', 'Method'],
        ['Role', `Author of the process`,
                 `Definition, translation, and the verification step.`],
        ['Tools', 'Rhino · Grasshopper · Revit'],
      ],
    },
  },

  facts: [
    ['Type',  'Computational method'],
    ['Role',  'Author of the translation process'],
    ['Tools', 'Rhino, Grasshopper, Revit'],
  ],

  // ══ SCROLLING UP — meaning ═════════════════════════════════
  why: [
    {
      scale: 'design brief',
      body: `Complex NURBS geometry authored in Rhino does not survive the trip
             into Revit intact. Native conversion gives you either a mesh too
             coarse to build from or a family too heavy to document.

             When the constructed surface has to match the modeled surface —
             because the geometry is doing real work — that gap becomes the
             whole problem.`,
    },

    {
      scale: 'precedent',
      body: `Most complex form is doing visual work, and an approximation is
             fine. Sometimes a surface is performing: it was derived to produce
             a specific behavior, and a surface that is nearly right produces
             behavior that is entirely wrong.

             So the standard is not resemblance. It is
             **measured agreement against a stated tolerance**.`,
      resolve: `measured + stated = evidence`,
      media: [
        { kind: 'diagram', src: '', ar: '4 / 3', beside: true,
          alt: 'Deviation analysis',
          caption: `TODO — deviation analysis on your own geometry.` },
      ],
    },

    {
      scale: 'central question',
      feature: true,
      resolve: `assert :: demonstrate`,
      body: `a translated model that looks right is not proof — so what would
             tell you it had failed, did you run it, and does the workflow
             **assert** its fidelity or **demonstrate** it?`,
    },
  ],

  // ══ SCROLLING DOWN — making ════════════════════════════════
  how: [
    {
      scale: 'where to begin',
      body: `TODO — generate your own doubly-curved surface to demonstrate on.
             Your own geometry, no client, nothing to clear.`,
      pair: [
        { src: '', ar: '16 / 10', alt: 'Source surface in Rhino',
          focus: 'center', caption: `Source — Rhino` },
        { src: '', ar: '16 / 10', alt: 'Translated element in Revit',
          focus: 'center', caption: `Translated — Revit` },
      ],
    },

    {
      scale: 'the definition',
      body: `TODO — how the Grasshopper definition rebuilds precise Rhino
             surfaces as documentable, constructible Revit elements rather than
             a mesh too coarse to build from or a family too heavy to document.`,
      media: [
        { kind: 'diagram', src: '', ar: '16 / 9',
          alt: 'Grasshopper definition',
          caption: `The definition, end to end.` },
      ],
    },

    {
      scale: 'the check',
      body: `TODO — the verification step: sampling the translated geometry
             against the source and reporting deviation against a stated
             tolerance. Without it you are asserting fidelity, not showing it.`,
      collage: [
        { src: '', ar: '4 / 3', alt: 'Deviation map' },
        { src: '', ar: '3 / 4', alt: 'Sampling method' },
        { src: '', ar: '4 / 5', legend: true, alt: 'Legend' },
        { src: '', ar: '5 / 2', alt: 'Section through source and translation' },
        { src: '', ar: '5 / 2', alt: 'Tolerance summary' },
      ],
    },
  ],

  media: [],
}
