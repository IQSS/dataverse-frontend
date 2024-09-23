FROM node:18-alpine AS builder

WORKDIR /app
ADD . /app/
ARG CONFIG=public
COPY ./dev-authn-env/frontend/${CONFIG}/vite.config.ts /app/vite.config.ts

WORKDIR /app
RUN npm run build --configuration=production

FROM nginx:1.26.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
ARG CONFIG=public
COPY ./dev-authn-env/frontend/${CONFIG}/nginx.conf /etc/nginx/conf.d/default.conf