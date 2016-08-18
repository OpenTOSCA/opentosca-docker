FROM node:4

MAINTAINER Johannes Wettinger, http://github.com/jojow

WORKDIR /pre-runner

ADD package.json /pre-runner/package.json
ADD pre.js /pre-runner/pre.js

RUN npm install

CMD [ "npm", "start" ]
