# Third-party notices: `src/shaders`

The code, HTML scene sources and font in this folder appear to be copied or adapted from the
`@designcodeio/threeui` package (version 1.2.0 is installed as a dependency). That package is
released under the MIT License, copyright (c) 2026 Meng To. The full licence text is in
`LICENSE-threeui-MIT.txt` and must stay with these files.

- `fonts/fragment-mono.woff2`: Fragment Mono, Copyright 2022 The Fragment-Mono Project Authors,
  licensed under the SIL Open Font License 1.1. Licence text: `fonts/OFL-fragment-mono.md`.
- Some scene sources in `neuform-isolated/sources/` load fonts or libraries from public CDNs
  (for example Google Fonts). Those remote files are not part of this repository.

Provenance note: the developer who added this folder should confirm the exact source of each
file. `components/ThreeUIScene.tsx` (which uses `neuform-isolated`) is not imported by the app at
the time of writing.
