# /admin — the post editor

Last updated 4 September 2026.

A web form at **sireneum.com/admin** for adding Interlocutorium posts without
opening VS Code. It is [Decap CMS](https://decapcms.org) — a static editor that
runs entirely in the browser.

## How it works

There is no database and no server of ours.

1. You sign in with GitHub.
2. The form writes a JSON file into `src/content/interlocutorium/` and uploads
   any video or image into `public/interlocutorium/`.
3. Saving commits both to `main` on `github.com/sireneum-designs/sireneum`.
4. Netlify sees the commit and rebuilds. The post is live in about a minute.

So the repo stays the single source of truth, the history is ordinary git
history, and anything the form can do you can also do by editing a file. If the
CMS ever breaks or is abandoned, the content is untouched — plain JSON in a
folder.

## What has to be done once, by hand

**This part is not finished.** The code is in place; the sign-in is not, because
it needs clicks in the Netlify and GitHub dashboards that only you can make.

### 1. Give GitHub sign-in a way in

Decap's GitHub backend needs an OAuth client. Netlify has historically provided
one, and if your site still offers it this is the shortest path:

> Netlify dashboard → the sireneum site → **Site configuration** →
> **Access control** → **OAuth** → **Install provider** → GitHub.

If that section is missing — Netlify has been retiring parts of this area — use
one of these instead:

- **DecapBridge** (`decapbridge.com`), a hosted sign-in service built for this
  exact problem. Add its `base_url` to `public/admin/config.yml` under
  `backend:`.
- **Self-hosted OAuth**, a small serverless function in this repo that does the
  GitHub handshake. More moving parts; only worth it if you would rather not
  depend on another service.

Note for context: Netlify **Identity** and **Git Gateway** — the older path most
Decap tutorials describe — are deprecated. Don't start there.

### 2. Decide who can post

With the GitHub backend, whoever can commit to the repo can post. To let an
employee in, add them as a collaborator on the GitHub repo with write access.
Removing their access removes their ability to post, immediately, and every post
carries their name in the commit. That is the whole permissions system.

### 3. Try it locally first (optional, and free)

Uncomment `local_backend: true` in `public/admin/config.yml`, then:

```
npm run dev            # terminal 1
npx decap-server       # terminal 2
```

Open http://localhost:5173/admin — it edits the files on this machine, with no
sign-in and no commits. Good for seeing whether the form asks for the right
things before wiring up authentication. Re-comment the line when done.

## Compress video before uploading

The form uploads whatever you give it, straight into the repo, at full size.
Git keeps every version forever, so a careless 60 MB upload is permanent weight
in every future clone.

Compress first — ffmpeg is already installed:

```
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
       -c:a aac -b:a 128k -movflags +faststart output.mp4
```

Then pull a poster frame from a moment where the title card is fully on screen:

```
ffmpeg -ss 8 -i output.mp4 -frames:v 1 -vf scale=720:-2 -q:v 4 output.jpg
```

Rules of thumb: **under 10 MB per video.** CRF is the quality dial — lower is
bigger and better, 25 is invisible for social video, 28 starts to show. Keep the
uncompressed master out of the repo; `_originals/` is gitignored and exists for
exactly that.

## If the feed looks wrong after a post

- **Post missing entirely** — it needs both `date` and `caption`; the loader
  drops anything without them rather than rendering a broken card.
- **Post in the wrong order** — the feed sorts by `date`, newest first,
  regardless of when the file was added.
- **Black rectangle instead of a still** — no `poster` was uploaded.
- **A discussion link is missing** — links with a blank URL are skipped on
  purpose. While running `npm run dev` the post shows a note saying which ones
  are still empty; that note never appears on the live site.
