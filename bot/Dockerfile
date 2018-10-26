# FROM node:8.1.0
FROM node:7.8.0
RUN apt-get update

# for cairo
RUN apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

RUN mkdir /app
WORKDIR /app
ADD package.json package.json
RUN npm install

# by seperating out this step by using a seperate directory
# we can make all the changes we want to src without having to do any of the
# above lines when we re-build
ADD src src

# when we're simply running it locally, in development
# we'll override this with `-v` to map to src live
# note this means you'll still have to rebuild  when you

# currently only used for twitter secret stuff.
ADD .env .env
ENV TZ="/usr/share/zoneinfo/America/New_York"

# and then finally run it
# CMD node ./src/index.js
CMD node  --harmony-async-await ./src/index.js
