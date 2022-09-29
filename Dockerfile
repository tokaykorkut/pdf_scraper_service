FROM node:16-alpine

# Install graphics magick
RUN apk update && apk add graphicsmagick && rm -rf /var/lib/apt/lists/*

#Install ghost script
RUN apk update && apk add ghostscript && rm -rf /var/lib/apt/lists/*

# Install app dependencies
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . ./

CMD [ "node", "--experimental-modules", "--es-module-specifier-resolution=node","src/app.js" ]
