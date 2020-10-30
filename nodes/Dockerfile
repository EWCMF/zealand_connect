#Node.js version 14.x
FROM node:14
#Create app directory
WORKDIR /usr/src/app

#Init commands.
COPY package*.json ./

RUN npm install

COPY . .

# Denne virker ikke nødvendig da workflow'et allerede har testet node.js
#RUN npm test

EXPOSE 3000

npx sequelize-cli db:migrate

#Last command.
CMD ["npm","start"]
