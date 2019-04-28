# build ===============================
FROM node:10 as build

WORKDIR /react-ssr-starter

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# run ===============================
FROM node:10-alpine as run

WORKDIR /react-ssr-starter

COPY --from=build /react-ssr-starter .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
