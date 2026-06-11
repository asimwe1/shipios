# ShipiOS Worker

This package is reserved for background job orchestration.

Expected responsibilities:

- pick export jobs from the database or queue
- call the Rust CLI or engine
- upload generated artifacts
- update job status for the web app

Do not put product UI logic here.

