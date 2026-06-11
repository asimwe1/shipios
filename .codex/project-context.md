# ShipiOS Project Context

## Current architectural decision

ShipiOS should start as:

- `Next.js` web product
- `Supabase/Postgres` for data and auth later
- `Cloudflare R2` for export storage later
- background jobs for generation/export flow
- Rust engine for strict schema validation and deterministic SwiftUI export

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

