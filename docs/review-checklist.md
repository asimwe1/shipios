# Review Checklist

Use this when reviewing ShipiOS changes yourself or when evaluating agent output.

## Product fit

- Does this help the narrow ShipiOS workflow, or is it generic filler?
- Does it preserve the iOS starter-app focus?

## Architecture

- Does the change keep schema as the source of truth?
- Is the work in the correct layer: web, worker, contract, or engine?
- Does it introduce coupling that will make Rust or Next.js migration harder?

## Code quality

- Are names clear?
- Is the code maintainable without the original author present?
- Are comments useful instead of decorative?
- Are files small and coherent?

## AI smell detection

- Repeated boilerplate with no real abstraction reason
- inconsistent naming
- unused config or dead branches
- copied patterns that do not match the repo
- placeholder text left in committed files

## Validation

- Are there examples or tests for the changed behavior?
- If no tests exist yet, is the missing coverage stated clearly?
- Does documentation match the actual state of the repository?

