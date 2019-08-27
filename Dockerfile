# Dockerfile

FROM keymetrics/pm2:10-alpine
RUN mkdir /app
WORKDIR /app
RUN apk add yarn
ENV YARN_VERSION 1.17.3
RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarnCOPY ./package.json ./
RUN yarn install
COPY . ./
EXPOSE 3000

CMD ["pm2-runtime", "main.js", "--name", "app"]