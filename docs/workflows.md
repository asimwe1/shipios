# Workflows

## Repo setup workflow

1. Scaffold major apps with standard generators.
2. Add dependencies through package-manager commands where practical.
3. Patch project-specific config only after the generated baseline exists.
4. Record the scaffold and dependency changes in `docs/status.md`.

## Feature workflow

1. Start from the schema contract.
2. Add or update an example schema if behavior changes.
3. implement preview changes in the web/product layer
4. implement export or validation changes in the engine layer
5. verify preview and export still align
6. update docs if the contract or architecture changed

## Mobile design workflow

1. Use the project Daisy skill when the task is to design or iterate on native mobile screens.
2. Reuse the same Daisy project for the same app or feature thread.
3. Prefer Daisy runs over one-screen-at-a-time generation.
4. Save Daisy project ids, run ids, and screen ids in handoff notes.
5. Keep designs narrow, iPhone-native, and structurally believable for future SwiftUI work.

## Review workflow

1. Validate schema changes first.
2. Check whether preview and export still share the same assumptions.
3. Look for accidental product/engine boundary leaks.
4. Reject vague AI-generated code that lacks clear ownership or intent.
5. Document remaining risks rather than pretending a task is finished.

## Multi-agent workflow

Use separate agents or contributors for disjoint work only.

Good splits:

- web UI shell vs Rust engine internals
- docs and repo hygiene vs implementation
- schema examples vs export templates

Bad splits:

- two contributors editing the same schema version rules
- parallel work inside the same generator templates without coordination

## Status update workflow

Any meaningful change to repo structure, tooling, or architecture should update:

- `docs/status.md`
- `README.md` if the public repo story changed
- `AGENTS.md` if contributor rules changed

## GitHub delivery workflow

1. Treat `master` as the current default branch until the repository is intentionally renamed.
2. Pushes and pull requests should be validated by GitHub Actions before anyone treats the change as deployable.
3. The Rust workspace is checked in CI from the repository root.
4. The web app is checked in CI from `apps/web` using its app-local `package-lock.json`.
5. Production web deploys are triggered by GitHub Actions on pushes to `master` and use the linked Vercel project IDs plus a `VERCEL_TOKEN` repository secret.
