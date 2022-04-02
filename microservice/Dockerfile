FROM node:17-alpine AS builder

ARG workdir=/usr/src/app

WORKDIR ${workdir}
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build && npm prune --production


FROM node:17-alpine

ARG workdir=/usr/src/app

WORKDIR ${workdir}

RUN rm -rf ${workdir}/dist/migrations/*.d.ts ${workdir}/dist/migrations/*.map
RUN chown node ${workdir}
COPY --from=builder ${workdir}/dist ${workdir}/dist
COPY --from=builder ${workdir}/node_modules ${workdir}/node_modules
COPY --from=builder ${workdir}/package.json ${workdir}/package.json

USER node
CMD ["node", "dist/main.js"]