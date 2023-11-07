## Quick Start

- `cd apps/eaas-api`
- `cp .env.example .env`
- `nano .env` and set the environment variables

- `cd ../..`
- `docker compose up -d`
- `cd apps/eaas-api && npm run migrate:latest`

Start the interface:

- `cd apps/eaas-interface`
- `npm run dev`
- Or if in project root: `npm run dev:app `
