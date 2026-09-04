# _archive

Finished work that is not currently wired into the site. Nothing in here is
imported by `App.jsx`, so Vite never bundles it — these files cost the build
nothing and add nothing to `dist`. They are kept in the repo (rather than in
`_originals/`, which git ignores) so the history survives on GitHub.

## Interlocutorium.room-v1 — 3 September 2026

The first Interlocutorium landing page, built around the escape-room metaphor:
one plan of a room, three vantage points, seven clues, and a control that
switches between them. Each viewer's sight cone lights a different subset;
none of the three sees more than four of the seven.

Retired because the project, as it actually runs today, is a place to post
observations and questions — not an escape-room premise. Rachel wanted the
mechanic kept for possible later use.

To bring it back: copy the two files into `src/pages/` as
`Interlocutorium.jsx` / `interlocutorium.css`. The room is self-contained —
`VIEWERS`, `CLUES` and the `Room` component are the whole device, and the
clue-to-viewer `seen` lists are worked out from the cone geometry, so moving a
clue means recomputing which cones contain it.
