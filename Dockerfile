FROM node:20 AS base

WORKDIR /app
COPY [ "package.json", "package-lock.json", "./" ]

FROM base as dev
ENV NODE_ENV=development
RUN npm install --frozen-lockfile
COPY . .
CMD [ "npm", "run", "start:dev" ]

FROM dev as test
ENV NODE_ENV=test
CMD [ "npm", "run", "test" ]

FROM test as test-cov
CMD [ "npm", "run", "test:cov" ]

FROM dev as test-watch
ENV GIT_WORK_TREE=/app GIT_DIR=/app/.git
RUN apk add git
CMD [ "npm", "run", "test:watch" ]

FROM base as prod
ENV NODE_ENV=production
RUN npm install --frozen-lockfile --production
COPY . .
RUN npm add global @nestjs/cli
RUN npm run build
CMD [ "npm", "run", "start:prod" ]