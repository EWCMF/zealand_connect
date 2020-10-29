#Node.js version 14.x erstattet med 12 for at synkronisere med github workflow'et.
FROM node:12
#Create app directory
WORKDIR /usr/src/app

#Init commands.
COPY package*.json ./

RUN npm install

COPY . .

#RUN npm test

EXPOSE 3000

#Last command.
CMD ["npm","start"]
