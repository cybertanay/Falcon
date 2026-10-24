# Asset register

Recorded 2026-10-24 during the legal, privacy and accessibility audit. Every image, font and
third-party file used by the website should be listed here, with its source and licence, before
launch. Entries marked **To confirm** need an answer from the business owner.

## Images in this repository (`public/images/`)

| File | Used on | Source found in file metadata | Licence / rights | Status |
|---|---|---|---|---|
| `FalconLogo.png` | Favicon, JSON-LD logo | None (no metadata) | **To confirm**: who designed the logo, and whether Falcon owns it outright | To confirm |
| `hero_spices_banner_1786195263727.jpg` | Home hero, social share image | C2PA manifest: "Created by Google Generative AI" (`trainedAlgorithmicMedia`) | AI-generated. Check the terms of the Google tool used. Not a photo of Falcon's goods or premises | Labelled illustrative |
| `turmeric_product_1786195278080.jpg` | Turmeric product | C2PA: Google Generative AI | AI-generated, as above | Labelled illustrative |
| `chilli_product_1786195293751.jpg` | Red chilli product | C2PA: Google Generative AI | AI-generated, as above | Labelled illustrative |
| `cumin_product_1786195311107.jpg` | Cumin product | C2PA: Google Generative AI | AI-generated, as above | Labelled illustrative |
| `garlic_product_1786195323982.jpg` | Garlic product | C2PA: Google Generative AI | AI-generated, as above | Labelled illustrative |

These files moved from `src/assets/images/` to `public/images/` because the old `/src/assets/...`
paths only worked on the development server; production builds left the product images out.

## Images loaded from Unsplash (`src/data/products.ts`)

Unsplash images are free to use under the [Unsplash License](https://unsplash.com/license), which
does not allow selling unmodified copies or building a competing image service. Photographer
credit is not required but is good practice. They show generic spices, not Falcon's goods.

| Unsplash photo id | Used for | Notes |
|---|---|---|
| `photo-1615485290382-441e4d049cb5` | Turmeric gallery | Photographer **to confirm** |
| `photo-1596040033229-a9821ebd058d` | Turmeric gallery | Photographer **to confirm** |
| `photo-1588880331179-bc9b93a8cb5e` | Red chilli gallery | Photographer **to confirm** |
| `photo-1599909581977-80257c23789b` | Red chilli gallery | Photographer **to confirm** |
| `photo-1509358271058-acd05cc93224` | Cumin gallery **and** black pepper main image | Same photo for two products; check that it really shows black pepper |
| `photo-1618160702438-9b02ab6515c9` | Garlic gallery | Photographer **to confirm** |
| `photo-1608797178974-15b35a640532` | Green cardamom main image | Photographer **to confirm** |

Hot-linking sends each visitor's IP address to Unsplash (named in the Privacy Policy). Downloading
the files into `public/images/` would remove that third-party request.

## Images not to publish

- `1260_relpepp_...webp`, the pepper image in the local Falcon folder (not in this repository). Its
  XMP rights field says "Alan Shortall". Do not add it to the site without a licence from the rights
  holder.

## Fonts

| Font | How it is loaded | Licence |
|---|---|---|
| Playfair Display, Plus Jakarta Sans, Space Grotesk | Self-hosted through `@fontsource/*` packages (imported in `src/main.tsx`) | SIL Open Font License 1.1, text in each package's `LICENSE` |
| Fragment Mono | `src/shaders/fonts/fragment-mono.woff2` | SIL OFL 1.1, see `src/shaders/fonts/OFL-fragment-mono.md` |

Google Fonts is no longer loaded by the public site.

## Code and design assets

- `src/shaders/`: from `@designcodeio/threeui` (MIT). See `src/shaders/THIRD_PARTY_NOTICES.md`.
- npm dependencies: licences are listed in each package under `node_modules`.

## User uploads (`public/uploads/`)

Product images uploaded through the admin dashboard are stored here. The `test_audit_pepper_*` and
`_________traversal_test_*` files are left over from the security test suite and should be removed
from the repository and from any deployed copy.
