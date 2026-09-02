FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://admin:dummy@localhost:5432/chatdb?schema=public"

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]