# Project Status

Last updated: 2026-06-17

## Repository state

Prepared as an initial monorepo foundation.

Completed:

- created Rust crates with `cargo new`
- created root and TypeScript package placeholders with `npm init -y`
- scaffolded `apps/web` with `create-next-app`
- added root workspace documentation and repo hygiene files
- documented architecture, workflows, review standards, and current decisions
- added initial schema artifacts and example files
- implemented the AppLaunchKit MVP flow in the Next.js app as a one-page generator with supporting routes retained in the repo
- replaced the Stripe server payment routes with Lemon Squeezy checkout and webhook routes
- added Lemon Squeezy environment templates and configured Vercel production environment variables for the web app
- aligned GitHub Actions with the real default branch and added a GitHub-driven Vercel production deploy workflow for `apps/web`
- cleaned the public AppLaunchKit copy to remove internal MVP language and replaced the old simulated checkout route with real Lemon Squeezy checkout

Pending:

- install shared TypeScript dependencies
- replace local storage-only unlock state with durable persistence tied to payment records
- connect AI generation instead of the current deterministic template-based copy builder
- wire Rust schema generation into TypeScript types for later ShipiOS phases
- implement first ShipiOS preview primitives and engine export commands

## Important decisions already made

- web-first product with `Next.js`
- AppLaunchKit is the current MVP inside the ShipiOS repo
- Rust engine boundary from early stage
- schema as product contract
- deterministic export over free-form code generation
- App Store readiness as product framing, not approval guarantee
- Lemon Squeezy is the current MVP payment provider

## Known blockers

- network/package download may still be required to complete `npm install`
- no CI dependency installation is wired yet
- the root `npm` workspace lock/install state is inconsistent locally and still needs cleanup before local `apps/web` builds are trustworthy
- the stable Vercel alias `https://web-landrysb.vercel.app` is behind Vercel authentication, which currently returns `401` for webhook requests
- GitHub now handles production web deployment on pushes to `master`, but web validation remains outside the main CI workflow until the npm workspace/package-lock state is normalized

## Immediate next tasks

1. Complete workspace dependency installation.
2. Wire real AI generation into AppLaunchKit.
3. Add durable checkout and export persistence.
4. Add generated or mirrored TypeScript schema types for later ShipiOS work.
5. Extend validation coverage and begin ShipiOS-specific export templates after MVP validation.
