# Copyright 2016, Z Lab Corporation. All rights reserved.

FROM node:6.2.1
MAINTAINER Kazumasa Kohtaka "kkohtaka@gmail.com"

RUN useradd --user-group --create-home --shell /bin/false app && \
  npm install --global gulp-cli

COPY . /home/app/
RUN chown -R app:app /home/app/*

USER app
ENV HOME=/home/app
WORKDIR /home/app
RUN npm install && \
  npm cache clean

EXPOSE 3000
CMD [ "npm", "start" ]
