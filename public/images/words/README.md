# Word illustration images

Drop a picture for each review word here. The filename must match the `image`
field in `src/data/words.ts` (lowercase word + `.jpeg`):

- `teacher.jpeg`
- `bell.jpeg`
- `librarian.jpeg`
- `library.jpeg`
- `clock.jpeg`
- `desk.jpeg`

Notes:
- Square images work best (they're shown in rounded square frames). ~512×512 is plenty.
- Until a file exists, the app automatically shows the word's emoji instead, so
  nothing breaks if some images are missing.
- To use a different format (e.g. `.jpg`), update the `image` path in
  `src/data/words.ts` to match.
