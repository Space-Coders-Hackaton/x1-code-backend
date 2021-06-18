FROM node:14-alpine

WORKDIR /usr/app

COPY package.json package.json

COPY ormconfig.json ormconfig.json

COPY ./.env ./.env

RUN npm install

COPY . .

EXPOSE ${SERVER_PORT}

CMD ["npm", "run", "dev:server"]
