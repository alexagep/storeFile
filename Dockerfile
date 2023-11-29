FROM node:18-debian-bookworm-slim 

RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --chown=node:node . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]


