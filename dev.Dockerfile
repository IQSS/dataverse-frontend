FROM node:19.6.1
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
EXPOSE 5173
CMD ["npm", "start"]
