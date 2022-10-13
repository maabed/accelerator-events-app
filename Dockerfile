FROM node:16-alpine
WORKDIR /app

RUN apk update && apk add python3 make g++

COPY package.json .
COPY package-lock.json .

COPY .env .env
COPY . .

RUN npm install
RUN npm run build

EXPOSE 9000 9001
CMD ["npm", "start"]
