# ShipiOS

ShipiOS is being prepared as a focused product for turning an app idea into a previewable, exportable, App Store-aware iOS starter project.

The working architecture for this repository is:

- `Next.js` for the web product, dashboard, preview UI, auth, billing, and orchestration
- a shared app schema contract as the source of truth
- a Rust engine boundary for deterministic validation, SwiftUI export, and packaging

## Current status

This repository has been prepared as a clean monorepo foundation.

Ready now:

- repo structure for apps, packages, crates, schemas, examples, docs, and CI
- Rust workspace with initial crates for schema, engine, and CLI
- documentation for architecture, workflows, review standards, and project status
- agent and Codex guidance for future contributors
- example ShipiOS app schema and a first example project

Pending:

- install Node dependencies for the web app and shared TypeScript packages
- wire schema generation between Rust and TypeScript
- implement the first preview renderer and exporter

## Monorepo layout

```text
shipios/
  apps/
    web/                      # Next.js product app
    worker/                   # Background job orchestration
  crates/
    shipios_schema/           # Rust schema contract
    shipios_engine/           # Rust validation/export engine
    shipios_cli/              # Local/export CLI
  packages/
    schema/                   # TypeScript schema package
    preview-components/       # React preview primitives
  schemas/                    # JSON schema contract artifacts
  examples/                   # Example app schemas
  docs/                       # Architecture and operating docs
  .agents/                    # Multi-agent handoff guidance
  .codex/                     # Project-specific Codex context
```

## Product positioning

The narrow product thesis is:

`Prompt -> Schema -> Preview -> Readiness score -> SwiftUI export`

That is intentionally narrower than a generic AI app builder. The product should stay focused on iOS starter apps and App Store readiness rather than trying to generate arbitrary software.

## Core rules

1. The ShipiOS app schema is the contract.
2. AI should generate schema, not free-form SwiftUI projects.
3. Preview and export must be derived from the same schema.
4. Deterministic templates beat clever but unstable generation.
5. Rust should own strict validation and export once the product loop is proven.

## Key docs

- [Project Brief](docs/product-brief.md)
- [Architecture](docs/architecture.md)
- [Workflows](docs/workflows.md)
- [Review Checklist](docs/review-checklist.md)
- [Current Status](docs/status.md)
- [Agent Guide](AGENTS.md)

## Bootstrap notes

This repository was intentionally prepared with generator-first tooling where possible:

- `cargo new` was used for Rust crates
- `npm init -y` was used for the root and package placeholders
- `create-next-app` should be used for `apps/web` rather than hand-building a Next app

If you continue setup later, prefer official generators and package-manager commands over hand-editing manifests when introducing new dependencies.
