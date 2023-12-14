## Quick Start

### Setup env

From project root:

- `cd apps/eaas-api && cp .env.example .env`
- `cp archaeologists.example.json archaeologists.json`
- `nano .env`
- Set the API environment variables.
- `nano archaeologists.json`, and:
  - Set `requiredArchaeologists` to the number of archaeologists you want to be present during resurrection (threshold)
  - Set `addresses` to an array of the addresses of your preferred archaeologists
  - Whenever you want to update your preferred archaeologists and threshold, you can do so by updating this file
- `cd ../eaas-interface && cp .env.example .env`

### Start the API

From project root:

- `docker compose up -d`
- `cd apps/eaas-api`

If this is the first time running the API docker container, or if the database has been updated or deleted:

- `npm run migrate:latest`
- `npm run seed:dev`

### Start the interface

From interface directory (`cd apps/eaas-client`):

- `npm run start`

### Notes:

- Embalmer email from seeded data is: `admin@example.com`
- Embalmer password from seeded data is: `admin`
- The service will be run on the network whose chain ID is specified in the API's `.env` file. To switch networks, update `CHAIN_ID` and `PROVIDER_URL` in the API's `.env` file, and then restart the API container.
