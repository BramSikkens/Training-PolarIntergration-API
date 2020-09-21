FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 5000


CMD [ "node","dist" ]