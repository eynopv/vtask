FROM node:14-alpine3.10

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . ./
RUN npm run build
RUN npm run db:init
RUN ls ./
RUN ls ./dist


EXPOSE 3000

CMD [ "/bin/sh", "-c", "npm run start" ]
