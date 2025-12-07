FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL="/api"
ENV NEXT_PUBLIC_PDF_API_URL="/pdf"

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]