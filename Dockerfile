FROM node:12-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json /app/
WORKDIR /app
RUN npm install

RUN mkdir /app/data
COPY *.js /app/

USER appuser

ENTRYPOINT ["node", "index.js"]

