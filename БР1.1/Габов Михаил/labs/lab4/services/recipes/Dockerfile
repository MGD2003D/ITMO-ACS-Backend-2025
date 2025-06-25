FROM node:18 AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY services/auth-users/package.json ./services/auth-users/package.json
COPY services/interactions/package.json ./services/interactions/package.json
COPY services/recipes/package.json ./services/recipes/package.json
COPY services/api-gateway/package.json ./services/api-gateway/package.json
ENV NODE_ENV=development
RUN npm install
COPY . .
WORKDIR /app/services/recipes
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app/services/recipes
COPY --from=builder /app/node_modules /usr/src/app/node_modules
COPY --from=builder /app/services/recipes/build ./build
COPY --from=builder /app/services/recipes/package.json ./package.json
USER node
EXPOSE 3002
CMD [ "npm", "start" ]