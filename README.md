## Quick Start

### Setup env

From project root:

- `cd apps/eaas-api && cp .env.example .env`
- `nano .env`
- Set the API environment variables
- `cd ../eaas-interface && cp .env.example .env`

### Start the API

From project root:

- `docker compose up -d`
- `cd apps/eaas-api`
- `npm run migrate:latest`
- `npm run seed:dev`

### Start the interface

From project root:

- `npm run dev:app `

Or if in the interface directory:

- `npm run dev`
