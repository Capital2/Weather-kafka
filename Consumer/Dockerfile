# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the server
CMD [ "node", "consumer.js" ]