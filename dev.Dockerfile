FROM node:19.6.1-alpine as BUILD_IMAGE

WORKDIR /usr/src/app/packages/design-system
COPY ./packages/design-system ./
RUN npm install
RUN npm run build

WORKDIR /usr/src/app
COPY package.json ./
COPY .npmrc ./
RUN npm install

FROM node:19.6.1-alpine 

WORKDIR /usr/src/app
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 5173
CMD ["npm", "start"]
