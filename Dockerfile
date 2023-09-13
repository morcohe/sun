FROM node:18-alpine AS runner
ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV PSQL_CONNECTION_LINK=postgresql://postgres:Aa12345@host.docker.internal/NadavDB
ENV SECRET=SsI+ory1UJaR+KCjCZ2CCKmLEZuD5/rnC/CX5YdIwWXa9ZEmNZ4WNUTeZevB1CPHjjVpkaCtS/7Oe1nIPAX9nAksOLtHPDQdi/h1SGuzzvDRYHe1Fu+ZTckUXwa+rSk+SM9y5hVrCT30i03ZZo6U87rNkajNg7mG5XDiYYG5f6I=
ENV DEV_BASE_URL=http://localhost:4001
ENV PROD_BASE_URL=http://localhost:4001

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY . .
RUN npm cache verify
RUN npm install
RUN npm run build
COPY . .
ENV PORT=4001
EXPOSE 4001
CMD [ "npm", "start" ]