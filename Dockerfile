# Dockerfile

FROM keymetrics/pm2:10-alpine
RUN mkdir /app
WORKDIR /app
RUN npm install
COPY . ./
EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js", "--name", "app"]