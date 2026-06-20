# ShipiOS Project Context

## Current architectural decision

ShipiOS should start as:

- `Next.js` web product
- `Supabase/Postgres` for data and auth later
- `Cloudflare R2` for export storage later
- background jobs for generation/export flow
- Rust engine for strict schema validation and deterministic SwiftUI export

## Current product surface

The current public-facing product is a one-page App Store launch-kit workflow, not the full long-term app generator.

## Daisy design workflow

Use the project skill:

- `.codex/skills/shipios-daisy-mobile-design/SKILL.md`

Use Daisy when a task needs:

- native iPhone screen concepts
- reusable app screen mockups
- iteration on ShipiOS-generated app interfaces

For concrete API details, read:

- `.codex/skills/shipios-daisy-mobile-design/references/daisy-api.md`

## Naming direction

`ShipiOS` is still the internal repo name, but the chosen public-facing product brand is `Orivo`.

Current external product name:

- `Orivo`

See:

- `docs/product-naming.md`

## Working mental model

- Next.js is the shop
- Rust is the factory
- Postgres is the memory
- R2 is the warehouse
- jobs are the delivery mechanism

## Product wedge

Do not position ShipiOS as a general AI app builder.

The wedge is:

`previewable SwiftUI starter apps with App Store readiness checks`

## Immediate repo state

- Rust crates exist
- TypeScript workspace placeholders exist
- documentation exists
- `apps/web` still needs to be scaffolded with `create-next-app`
