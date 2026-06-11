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

