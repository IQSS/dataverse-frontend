FROM node:22-alpine AS builder

ADD ./dev-authn-env/frontend/git /app/
ARG CONFIG=public
COPY ./dev-authn-env/frontend/${CONFIG}/vite.config.ts /app/vite.config.ts
COPY ./dev-authn-env/frontend/${CONFIG}/.env /app/.env
COPY ./.npmrc /app/.npmrc

WORKDIR /app/packages/design-system
RUN npm install && npm run build

WORKDIR /app
RUN npm install && npm run build

FROM nginx:1.27.1-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
ARG CONFIG=public
COPY ./dev-authn-env/frontend/${CONFIG}/nginx.conf /etc/nginx/conf.d/default.conf
ARG DATAVERSE_SERVER=http://dvproxy:5050/api
RUN sed -i -e 's@DATAVERSE_SERVER@'"$DATAVERSE_SERVER"'@' /etc/nginx/conf.d/default.conf