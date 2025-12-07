FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL="/api"
ENV NEXT_PUBLIC_GEMINI_API_URL="/api/gemini"

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]