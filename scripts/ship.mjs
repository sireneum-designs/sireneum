/* ── ship ─────────────────────────────────────────────────────
   One command to publish everything that has changed:

     npm run ship "what changed, in a few words"

   Stages every change, commits with that message, pushes to
   main. Netlify does the rest.

   Deliberately simple. It is `git add -A && git commit && git
   push` with the arguments in the right order and a readable
   error when something is off — not a replacement for knowing
   what git is doing.
   ─────────────────────────────────────────────────────────── */

import { execSync } from 'node:child_process'

const message = process.argv.slice(2).join(' ').trim()

if (!message) {
  console.error('\n  A message is required — it is what future-you reads.\n')
  console.error('  npm run ship "Interlocutorium: first post"\n')
  process.exit(1)
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
const read = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim()

try {
  if (!read('git status --porcelain')) {
    console.log('\n  Nothing has changed. Nothing to ship.\n')
    process.exit(0)
  }

  const branch = read('git rev-parse --abbrev-ref HEAD')
  const files = read('git status --porcelain').split('\n').length

  console.log(`\n  ${files} file(s) → ${branch}\n`)

  run('git add -A')
  run(`git commit -m "${message.replace(/"/g, '\\"')}"`)
  run('git push')

  console.log('\n  Pushed. Netlify is building — about a minute.\n')
} catch {
  // git has already printed the real reason above; adding our own
  // guess on top of it would only be noise
  console.error('\n  Stopped — see the git error above. Nothing was pushed.\n')
  process.exit(1)
}
