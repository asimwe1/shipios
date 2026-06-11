# Architecture

## High-level system

```text
Prompt
  -> AI planner
  -> ShipiOS schema
  -> React preview
  -> readiness checks
  -> Rust export engine
  -> ZIP or GitHub export
```

## Why this shape

ShipiOS has two distinct concerns:

- product and orchestration
- deterministic generation and validation

Trying to solve both in a single layer usually leads to either slow product iteration or unreliable exports.

## Layers

### Product layer

Primary home: `apps/web`

Responsibilities:

- landing pages
- auth
- pricing and billing
- prompt UI
- project dashboard
- browser preview shell
- job status UI
- export requests

Preferred stack:

- `Next.js`
- `React`
- `Tailwind`
- `TypeScript`

### Orchestration layer

Primary home: `apps/worker`

Responsibilities:

- export job polling
- invoking the engine
- uploading artifacts to storage
- updating job state

This can start small and stay in TypeScript.

### Contract layer

Primary homes:

- `crates/shipios_schema`
- `packages/schema`
- `schemas/`

Responsibilities:

- define the ShipiOS app model
- keep versioning explicit
- provide a single source of truth for preview and export

### Engine layer

Primary homes:

- `crates/shipios_engine`
- `crates/shipios_cli`

Responsibilities:

- schema validation
- readiness scoring
- SwiftUI generation
- ZIP assembly
- deterministic file output

## Core contract rule

The AI should generate schema, not SwiftUI files.

That keeps:

- previews deterministic
- exports testable
- engine changes isolated
- future language migrations possible

## Migration strategy

Phase 1:

- Next.js web app
- TypeScript orchestration
- Rust schema and engine boundary prepared early

Phase 2:

- real export jobs
- artifact storage
- readiness checks

Phase 3:

- stronger Rust validation and export coverage
- GitHub export

Phase 4:

- optional Flutter path
- Mac build/test automation

## Schema versioning

- version every schema explicitly
- avoid silent breaking changes
- keep sample schemas in `examples/`
- update both docs and examples when schema changes

