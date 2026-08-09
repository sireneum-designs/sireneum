# sireneum.com — where things live

Last updated 6 August 2026.

## You already have a backup. Don't build another one.

The live site is deployed from GitHub: **github.com/sireneum-designs/sireneum**, branch `main`.

I compared commit **`e781fae`** (current `origin/main`) against this folder file by file.
Before I added the `/work` section, **they were identical**. This folder *is* the live site.

That means the backup you were about to make already exists, in two places:

1. **GitHub history.** Every "Add files via upload" commit is a permanent snapshot. `e781fae`
   is the one currently live. It cannot be overwritten by anything you do next.
2. **Netlify deploy history.** Netlify → Deploys → pick any earlier deploy → *Publish deploy*.
   The live site reverts in about thirty seconds, no code required.

So the rollback path is already there. Copying folders around would add work and a third
thing to keep straight, which is the problem you're trying to solve, not the solution.

## The three folders, and which one matters

| Folder | What it is | What to do |
|---|---|---|
| `Website\CLAUDE\sireneum` | **This one.** Matches live, plus the new `/work` section. | Work here. |
| `Website\SIRENEUM\sireneum` | A git clone of the same GitHub repo, last pulled **11 May** — three months stale. | Archive it. See below. |
| `Website\OUT OF PHASE\outofphase` | Separate project — the ARC 651 research site. Unrelated. | Leave alone. |

The stale copy is what cost us an hour today: it looked like the real site, so I built into
it. It has no unique work in it — everything it contains is either on GitHub already or
superseded here.

**Do this today** (two minutes, zero risk): rename `Website\SIRENEUM` to
`Website\_ARCHIVE_2026-08-06_stale-clone`. The underscore sorts it to the top and the name
says what it is. Don't delete it yet — rename is reversible, delete isn't. Bin it in a month
once you're sure.

**Don't reorganize anything else before Sunday.** Renaming the folder you're actively running
breaks your VS Code window, your terminal path and your dev server, in exchange for tidiness
you can have on Monday.

## What changed in here today

Three existing files, plus new additions. Nothing else was touched.

**Modified**
- `src/App.jsx` — added `/work` routing. Deliberately placed *outside* the `HOLDING` gate.
- `src/sections/Architecture.jsx` — placeholder replaced with the project list.
- `src/sections/Work.jsx` — placeholder replaced with a link through to `/work`.

**New**
- `src/work/` — `projects.js` (the only file you edit), `ProjectPage.jsx`, `WorkIndex.jsx`, `work.css`
- `public/images/architecture/<slug>/` — one folder per project, each with a `_WHAT-GOES-HERE.md`

**Housekeeping**
- `gitignore` → `.gitignore`. Without the dot git ignores it, which means `node_modules`
  (40MB, thousands of files) was eligible to be committed. Now it isn't.
- Deleted four `vite.config.js.timestamp-*.mjs` files — build crud, safe to remove, they come
  back and can be deleted again.
- Removed an empty `public/fonts/` folder that existed locally but not on GitHub.

## HOLDING mode and why /work still works

`src/App.jsx` line 9:

```js
const HOLDING = true
```

While that's `true` the landing page shows "propagating soon" and won't let anyone into the
constellation. That's why you couldn't navigate — working as designed.

**`/work` bypasses it entirely.** The route resolves before the holding gate, so:

- `sireneum.com` → still the holding page, for everyone
- `sireneum.com/work` → the portfolio, for anyone with the link

Nothing on the landing page links to `/work`, so it stays unlisted until you send it. That's
what lets you give Ranch Mine a portfolio without launching the whole site.

Set `HOLDING = false` when you're ready to open the front door.

## Publishing

Same as you've been doing — upload the changed files to GitHub through the web interface,
and Netlify rebuilds. Files to upload:

- `src/App.jsx`, `src/sections/Architecture.jsx`, `src/sections/Work.jsx`
- the whole `src/work/` folder
- `public/images/architecture/` once it has images in it
- `.gitignore` (and delete the old `gitignore` on GitHub)

**Do not upload `node_modules` or `dist`.**

### Worth doing after Sunday

Uploading through the browser works, but it's why the local copy drifted out of sync and why
there are two folders. Connecting this folder to the repo with git properly would make
"save my work," "back it up" and "publish it" the same action instead of three. It's a
half hour of setup and the wrong week to learn it.

## Running it

```
npm run dev
```

→ http://localhost:5173/work

If it complains about re-optimising dependencies and then errors, stop it and start it again —
`package-lock.json` changed when dependencies were installed and Vite wants to rebuild its
cache once.
