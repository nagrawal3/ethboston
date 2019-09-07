FROM node:12 as builder
RUN mkdir /app
WORKDIR /app
ENV SKIP_PREFLIGHT_CHECK=true
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./src ./src
COPY ./public ./public
COPY ./README.md .
COPY ./.eslintrc.js ./.prettierrc.js ./.markdownlint.json ./.eslintignore ./.prettierignore ./
RUN npm run validate
RUN npm run build

# production image stage
FROM node:12
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/build ./
RUN npm install -g serve@6.4.9
EXPOSE 80
CMD ["serve", "-p", "80", "-s", "."]
