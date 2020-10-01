FROM node:10 AS builder

# Create app directory
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 5000


CMD [ "node","." ]