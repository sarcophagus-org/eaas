## Quick Start

### Setup env

From project root:

- `cd apps/eaas-api && cp .env.example .env`
- `cp archaeologists.example.json archaeologists.json`
- `nano .env`
- Set the API environment variables
- `nano archaeologists.json`, and:
  - Set `requiredArchaeologists` to the number of archaeologists you want to be present during resurrection
  - Set `addresses` to an array of the addresses of your preferred archaeologists
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
