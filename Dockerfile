# Copyright 2016, Z Lab Corporation. All rights reserved.

FROM node:argon
MAINTAINER Kazumasa Kohtaka "kkohtaka@gmail.com"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
