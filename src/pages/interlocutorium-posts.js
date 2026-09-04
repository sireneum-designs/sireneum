/* ── Interlocutorium posts ────────────────────────────────────
   THIS FILE NO LONGER HOLDS THE POSTS. It collects them.

   Each post is now its own JSON file in
   src/content/interlocutorium/, so the web editor at /admin can
   write one without touching code. Vite reads every file in that
   folder at build time and hands them over as one array — adding
   a file is publishing a post, and nothing here changes.

   Editing by hand still works: copy an existing JSON file, give
   it a new name, change the fields.

   FIELDS (all of this is repeated in the /admin form's help text)
     id        required. Short slug, unique, same as the filename.
               Also the post's anchor: /interlocutorium#<id>.
     date      required. YYYY-MM-DD. Sorts and displays.
     media     optional. Leave it out for a text-only post.
       kind      'video' | 'image'
       src       path under /interlocutorium/ — leading slash, no
                 'public' (public/x.mp4 is served at /x.mp4)
       poster    video only. A still shown before playback;
                 without one the post opens on a black rectangle.
       alt       image only. What the picture shows.
       aspect    CSS ratio, default '9 / 16' (a vertical short).
                 '1 / 1' square, '16 / 9' landscape.
     caption   required. Blank lines separate paragraphs.
               **bold**, *italic* and [text](url) all work.
     question  optional. The question the post ends on, set apart
               from the caption because it is the point.
     credits   optional. One line under the post — music, images,
               anything that needs crediting. Takes the same
               markup as the caption, so [Suno](https://…) links
               a credit to the thing being credited.
     discuss   optional. Where the post is live and open for
               replies: a list of { where, href }. One entry per
               platform. Entries with an empty href are skipped,
               so a post can go up here before it goes up there.
   ─────────────────────────────────────────────────────────── */

const files = import.meta.glob('../content/interlocutorium/*.json', { eager: true })

export const posts = Object.entries(files)
  // the filename is the fallback id, so a post written by hand
  // still has one even if the field was forgotten
  .map(([path, mod]) => {
    const post = mod.default ?? mod
    const name = path.split('/').pop().replace(/\.json$/, '')
    return { ...post, id: post.id || name }
  })
  // a post with no date would sort unpredictably; better to see
  // it missing here than to see it in the wrong place on the page
  .filter(p => p.date && p.caption)
