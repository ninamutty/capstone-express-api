FROM node:6.7.0

MAINTAINER Nina Mutty

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install dependencies
COPY package.json /usr/src/app/
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
