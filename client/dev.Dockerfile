FROM node:10.12

ENV SKIP_PREFLIGHT_CHECK=true

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

EXPOSE 3000
CMD ["npm", "start"]
