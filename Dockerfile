FROM node:latest
WORKDIR  /usr/src/app
COPY package*.json ./
COPY docs ./docs
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm", "start"]