FROM node:14.17.3-alpine3.13 
WORKDIR  /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD ["npm", "start"]