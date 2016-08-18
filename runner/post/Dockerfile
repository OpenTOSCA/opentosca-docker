FROM node:4

MAINTAINER Johannes Wettinger, http://github.com/jojow

WORKDIR /post-runner

ADD package.json /post-runner/package.json
ADD post.js /post-runner/post.js

RUN npm install

CMD [ "npm", "start" ]
