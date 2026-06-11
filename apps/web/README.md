# ShipiOS Web

This is the `Next.js` product app for ShipiOS.

It will own:

- landing pages
- auth flows
- dashboard and project management
- prompt input
- browser preview shell
- export and readiness UI

## Current state

The app was scaffolded with `create-next-app` and then adjusted so the default page reflects the ShipiOS workspace instead of the stock template.

## Run

From the repository root:

```bash
npm run dev
```

Or directly from this app:

```bash
npm run dev
```

## Next implementation targets

1. Replace the placeholder home screen with real landing and product routes.
2. Introduce a shared schema package for preview-safe data.
3. Add project dashboard and prompt-to-schema flow.
4. Connect export jobs to the worker and Rust engine boundary.
