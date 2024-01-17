FROM node:18-alpine AS environment

ARG APP_HOME=/app
ENV APP_HOME="${APP_HOME}"

WORKDIR "${APP_HOME}"

#<-------- BUILD -------->
FROM environment AS develop

COPY ["./package.json", "./package-lock.json", "${APP_HOME}"]

RUN npm install

FROM develop AS  builder

COPY . "${APP_HOME}"

RUN npm run build \
    && npm install ci --omit=dev

RUN  npm run typeorm_src migration:run

#<-------- SERVE -------->
FROM environment AS serve

COPY --from=builder "${APP_HOME}/node_modules" "${APP_HOME}/node_modules"
COPY --from=builder "${APP_HOME}/dist" "${APP_HOME}/dist"
COPY --from=builder "${APP_HOME}/.env*" "${APP_HOME}/"

EXPOSE 3000

CMD ["node", "./dist/main.js"]