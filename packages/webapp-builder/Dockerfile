FROM node

COPY . /code

WORKDIR /code

RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "run", "server" ]