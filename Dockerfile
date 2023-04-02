FROM node:alpine

RUN mkdir -p /user/src/app
RUN chmod -R 777 /user/src/app
WORKDIR /user/src/app
COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3001

RUN yarn run build

CMD ["sh", "-c", "yarn run start:prod && yarn run seedOnce"]
