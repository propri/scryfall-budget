FROM node:12-alpine

COPY package.json /app/
WORKDIR /app
RUN npm install

RUN mkdir /app/data
COPY *.js /app/

ENTRYPOINT ["node", "index.js"]

