# Product Brief

## Summary

ShipiOS is a web-first product for turning an app idea into a previewable, structured, exportable iOS starter app.

## Active MVP

The immediate MVP is `Orivo`, not the full ShipiOS generator.

`Orivo` focuses on:

- one-page generation flow
- App Store listing copy
- screenshot captions
- App Review-oriented checklist notes
- privacy notes
- launch copy
- paid export

This is intentionally smaller than the long-term ShipiOS vision and should be treated as the short-term commercial wedge.

## Target flow

1. User describes an app idea.
2. AI produces a ShipiOS schema.
3. The web app renders a browser preview from that schema.
4. Readiness checks evaluate missing or risky areas.
5. The export engine generates a SwiftUI starter project.

## Why this can work

The product is narrower than generic AI coding tools:

- it focuses on iOS starter apps
- it provides a visual preview
- it adds App Store readiness framing
- it produces deterministic exports rather than unstable free-form code

## V1 scope

Support only simple starter-app categories first:

- habit tracker
- journal
- checklist
- quiz
- recipe
- simple personal tracker
- showcase or portfolio app

## V1 non-goals

- arbitrary full-stack app generation
- complex production auth or social systems inside generated apps
- App Store approval guarantees
- full Mac build and simulator automation
- Flutter parity at launch

## Product principles

1. Narrow beats broad.
2. Preview must match export.
3. Generated code should be maintainable by a human iOS developer.
4. Readiness checks should be honest, not marketing fluff.
5. The product should help beginners while still being credible to serious builders.
