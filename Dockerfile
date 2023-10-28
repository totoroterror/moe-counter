FROM node:20-alpine AS build

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

ADD . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev --ignore-scripts

COPY --from=BUILD /app/assets assets
COPY --from=BUILD /app/dist dist

CMD [ "npm", "run", "start" ]
