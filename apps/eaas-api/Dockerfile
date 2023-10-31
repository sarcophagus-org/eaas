FROM node:16.18-slim as base
RUN apt-get update

WORKDIR /home/apps/api

COPY package*.json ./

RUN npm install

COPY . .

FROM base as production
ENV NODE_PATH=/.build