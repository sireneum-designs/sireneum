import { useEffect } from 'react'
import '../work/work.css'
import '../work/story.css'
import Menu from '../components/Menu.jsx'

/* ── Process ──────────────────────────────────────────────────
   Set as a letter, because that is what it is: an address to
   whoever has arrived here wanting to know how the work is made.

   Out of Phase is the long answer, so this points at it rather
   than trying to summarise something that resists summary.
   ─────────────────────────────────────────────────────────── */

const OUT_OF_PHASE = 'https://outofphaseresearch.netlify.app'

export default function Process() {
  useEffect(() => { document.title = 'Process — Sireneum' }, [])

  return (
    <div className="work-root story-doc">
      <Menu delay={0} />

      <div className="letter-page">
        <article className="letter">

          <p className="letter-to">To Whom It May Concern:</p>

          <p>Every interesting project begins with a tension.</p>

          <p>
            A constrained site. An impossible code requirement. A client whose
            space no longer fits their life. A community facing challenge in
            search of a way forward.
          </p>

          <p>
            Too often, design solves one problem while unintentionally creating
            two more. There are no perfect solutions. But meaningful design
            requires patiently attending to multiple perspectives before
            responding.
          </p>

          <p className="letter-turn">
            This makes my process surprisingly simple: listen, synthesize,
            rinse, repeat.
          </p>

          <p>
            If this overly flattened summary leaves the discerning visitor
            unsatisfied, I have just the answer:{' '}
            <a href={OUT_OF_PHASE} target="_blank" rel="noopener noreferrer">
              Out of Phase
            </a>
            {' '}— a disorientingly deep dive into my background and design
            process, including how I approach and apply research.
          </p>

          <p>
            Fair warning: it&rsquo;s so full of words, you may even find it
            self-indulgent.
          </p>

          <p>Enjoy.</p>

          <p className="letter-sign">— Rachel</p>

        </article>
      </div>
    </div>
  )
}
