# Daisy API Reference For ShipiOS

Base URL:

```text
https://www.daisy.now/api
```

Auth:

```text
Authorization: Bearer $DAISY_API_KEY
```

## Recommended path

Prefer Daisy runs instead of direct screen-by-screen generation.

### 1. Reuse or create a project

```bash
curl -s "https://www.daisy.now/api/projects" \
  -H "Authorization: Bearer $DAISY_API_KEY"
```

```bash
curl -s -X POST "https://www.daisy.now/api/projects" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"idea":"fitness tracker for runners","name":"Runr"}'
```

### 2. Start a run

Use `wait: "none"` by default and poll.

```bash
curl -s -X POST "https://www.daisy.now/api/projects/abc123/runs" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "message": "Design onboarding and a home screen for an iPhone habit tracker.",
    "wait": "none"
  }'
```

### 3. Poll the run

```bash
while true; do
  STATE=$(curl -s "https://www.daisy.now/api/projects/abc123/runs/run_xyz" \
    -H "Authorization: Bearer $DAISY_API_KEY")
  STATUS=$(echo "$STATE" | jq -r .status)
  case "$STATUS" in
    succeeded|failed|cancelled) echo "$STATE" | jq .; break ;;
  esac
  sleep 3
done
```

### 4. Resolve screens

```bash
for SID in $(echo "$STATE" | jq -r '.operations[].screenId'); do
  curl -s "https://www.daisy.now/api/projects/abc123/screens/$SID" \
    -H "Authorization: Bearer $DAISY_API_KEY" \
    | jq '{id, label, status, html}'
done
```

### 5. Save HTML or render screenshots

```bash
curl -s "https://www.daisy.now/api/projects/abc123/screens/scr_1" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  | jq -r '.html' > welcome.html
```

```bash
curl -s -X POST "https://www.daisy.now/api/screenshots" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"abc123","screenId":"scr_1","format":"png"}' \
  -o welcome.png
```

## Direct screen operations

Use only when exact screen-level control is needed.

### Create one screen

```bash
curl -s -X POST "https://www.daisy.now/api/projects/abc123/screens" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "label": "Settings",
    "brief": "iOS-style settings list with profile, notifications, privacy, theme, and delete account."
  }'
```

### Batch update screens

```bash
curl -s -X PATCH "https://www.daisy.now/api/projects/abc123/screens" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "screens": [
      { "id": "scr_1", "x": 120, "y": 0, "userResized": true },
      { "id": "scr_2", "html": "<!doctype html>…" }
    ]
  }'
```

### Batch delete screens

```bash
curl -s -X DELETE "https://www.daisy.now/api/projects/abc123/screens" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ids":["scr_1","scr_2"]}'
```

### Update theme on a project

```bash
curl -s -X PATCH "https://www.daisy.now/api/projects/abc123" \
  -H "Authorization: Bearer $DAISY_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"theme":{"colors":{"primary":"#0A84FF","background":"#0B0F17","text":"#F2F4F7"},"radius":"medium"}}'
```

## Important constraints

- one active run per project
- use `Idempotency-Key` on idempotent writes
- only screenshot screens with status `done`
- poll every 3-5 seconds, not aggressively
- do not look for preview URLs; use `html` or `/screenshots`

## Common failures

- `401 unauthorized:api`: invalid or missing key
- `403 forbidden:api`: wrong plan, missing scope, or exhausted credits
- `409 conflict:api`: active run already exists or screen is not rendered yet
- `429 rate_limit:api`: wait `Retry-After`
- `500 internal_error`: retry with backoff

## Save these after each Daisy task

- project id
- run id
- screen ids
- output paths for screenshots and HTML

