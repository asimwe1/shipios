# ShipiOS Web

This is the `Next.js` product app for ShipiOS.

The active product surface inside it is currently `Orivo`, a narrower MVP focused on generating App Store launch kits from app ideas.

It will own:

- landing pages
- auth flows
- dashboard and project management
- prompt input
- browser preview shell
- export and readiness UI

## Current state

The app was scaffolded with `create-next-app` and then adjusted into a working `Orivo` one-page MVP flow.

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

1. Replace local storage state with real persistence.
2. Add AI-backed generation instead of deterministic local templates.
3. Persist successful Lemon Squeezy purchases beyond local browser storage.
4. Keep the longer-term ShipiOS architecture isolated until the MVP proves demand.
