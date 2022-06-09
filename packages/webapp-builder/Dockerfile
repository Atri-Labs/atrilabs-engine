FROM node AS build

COPY . /code

WORKDIR /code

RUN npm install && npm run build

FROM node:lts-slim

COPY --from=build /code /code

WORKDIR /code

ENTRYPOINT [ "npm", "run", "server" ]