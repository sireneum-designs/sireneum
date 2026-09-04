# public/interlocutorium/

Media for the posts on /interlocutorium. Drop files straight in here —
anything in `public/` is served from the site root, so a file saved as
`public/interlocutorium/2609-attention.mp4` is reachable at
`/interlocutorium/2609-attention.mp4`, which is exactly what goes in the
`media.src` field of an entry in `src/pages/interlocutorium-posts.js`.

## What to put here

- **video** — `.mp4`, H.264, the vertical crop as posted. Keep each one under
  about 10 MB if you can; a 60-second short at 1080×1920 lands near there at a
  sane bitrate.
- **poster** — a `.jpg` still for each video, same base name. The browser shows
  it before the video loads, so the page never opens on a black rectangle.
- **image** — `.jpg` or `.png` for posts that are stills rather than video.

## Naming

`YYMM-short-slug.mp4`, matching the post's `id`. Chronological order in a
directory listing, and the file's name says which post it belongs to.

Do not save images as `.webp`.
