FROM node:18 AS api-gateway-runner

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

WORKDIR /app/services/api-gateway

EXPOSE 3000

CMD [ "npx", "ts-node", "src/index.ts" ]