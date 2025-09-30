FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY services/auth-users/package.json ./services/auth-users/package.json
COPY services/interactions/package.json ./services/interactions/package.json
COPY services/recipes/package.json ./services/recipes/package.json
COPY services/api-gateway/package.json ./services/api-gateway/package.json
COPY services/notifications-service/package.json ./services/notifications-service/package.json

RUN npm install

COPY . .

WORKDIR /app/services/notifications-service
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app/services/notifications-service
COPY --from=builder /app/node_modules /usr/src/app/node_modules
COPY --from=builder /app/services/notifications-service/build ./build
COPY --from=builder /app/services/notifications-service/package.json ./package.json
USER node
CMD [ "npm", "start" ]