// ─────────────────────────────────────────────────────────────
//  WORK — the project list
//
//  Each project's words and images live in its own file under
//  src/work/projects/. That is the file to edit; this one only says
//  which projects exist and in what order.
//
//  ORDER BELOW = ORDER ON THE SITE. Strongest first.
//
//  Parametric Translation is written and waiting in
//  projects/parametric-translation.js — it is simply not imported
//  yet. Add the import and drop it back in the list to publish it.
//
//  MEDIA
//  Drop image files in  public/images/architecture/<slug>/  and
//  reference them as IMG + 'filename.jpg' inside the project file.
//  Any item with no `src` draws a labelled box of the right shape
//  instead, so a page can be laid out and judged before the files
//  exist.
// ─────────────────────────────────────────────────────────────

import outsideInHouse        from './projects/outside-in-house.js'
import theDivide             from './projects/the-divide.js'
import here                  from './projects/here.js'
import rcll                  from './projects/rcll.js'
import stJohns               from './projects/st-johns.js'
import isiac                 from './projects/isiac.js'
import podject               from './projects/podject.js'

export const projects = [
  outsideInHouse,
  rcll,
  theDivide,
  here,
  isiac,
  stJohns,
  podject,
]

export const getProject   = (slug) => projects.find(p => p.slug === slug)
export const projectIndex = (slug) => projects.findIndex(p => p.slug === slug)
