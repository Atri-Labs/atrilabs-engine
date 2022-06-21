FROM node AS build

COPY . /code

WORKDIR /code

RUN yarn install && yarn run build && yarn run buildManifests

FROM node:lts-slim

COPY --from=build /code /code

WORKDIR /code

ENTRYPOINT [ "yarn", "run", "server" ]