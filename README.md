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

If this is the first time running the API docker container, or if previously deleted:

- `npm run migrate:latest`
- `npm run seed:dev`

### Start the interface

From interface directory (`cd apps/webapp/eaas-client`):

- `npm run start`

### Notes:

- Embalmer email from seeded data is: `admin@example.com`
- Embalmer password from seeded data is: `admin`
