FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y curl python
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs

COPY . ./

RUN npm install --production

# Intended to be run from the 'release' or 'production' directory

CMD node main.js