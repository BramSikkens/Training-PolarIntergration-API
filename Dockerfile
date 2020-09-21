FROM node:10 AS builder

# Create app directory
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM node:10
WORKDIR /app

COPY --from=builder /app/dist .

EXPOSE 5000


CMD [ "node","." ]