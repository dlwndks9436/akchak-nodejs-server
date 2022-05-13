FROM node:latest
WORKDIR /app
COPY package.json .
ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
 then yarn; \
 else yarn install --production; \
 fi

COPY . .
RUN npx sequelize-cli db:create
RUN npx sequelize-cli db:migrate
ENV PORT 30000
EXPOSE $PORT
CMD ["node", "index.js"]