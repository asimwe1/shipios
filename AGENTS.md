# ShipiOS Agent Guide

This repository is prepared for multiple future contributors: human developers, Codex sessions, and any specialist agents you spin up later.

## What ShipiOS is

ShipiOS is not a generic app builder.

The target product is a focused workflow for:

- generating a structured app plan from a prompt
- previewing the app in the browser
- checking App Store readiness at a starter-project level
- exporting deterministic SwiftUI starter code

## Non-negotiable architecture rules

1. The schema is the source of truth.
2. AI output must terminate into schema, not into final Swift files.
3. Preview and export must read the same schema version.
4. The Rust engine boundary should stay pure: schema in, artifacts/checks out.
5. Product concerns such as auth, billing, dashboards, and prompt UX belong in the web app.

## Expected work split

- `apps/web`: product UI, routes, auth, billing, prompt flow, preview shell
- `apps/worker`: background orchestration, job polling, storage handoff
- `crates/shipios_schema`: canonical Rust data model
- `crates/shipios_engine`: validation, scoring, SwiftUI generation, packaging
- `crates/shipios_cli`: local development and export commands
- `packages/schema`: TypeScript schema mirror or generated types
- `packages/preview-components`: browser preview components

## Before you change code

1. Read [docs/status.md](docs/status.md).
2. Read [docs/architecture.md](docs/architecture.md).
3. Check whether the work belongs to the product layer or engine layer.
4. Preserve the schema contract unless the task explicitly requires a versioned schema change.

## Standards

- Keep code readable before clever.
- Leave comments only where intent would otherwise be hard to recover.
- Prefer deterministic templates over ad hoc AI-generated code.
- Add or update docs whenever architecture, workflow, or repo status changes.
- If a scaffold or dependency is created by a standard tool, record that in `docs/status.md`.

## Handoffs

When finishing a major task, update:

- [docs/status.md](docs/status.md)
- [docs/workflows.md](docs/workflows.md) if the team process changed
- [.agents/handoff-template.md](.agents/handoff-template.md) when handing work to another contributor

