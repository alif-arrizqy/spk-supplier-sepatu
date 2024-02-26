# Use an official Node.js runtime as a parent image
FROM node:14.15-alpine

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install sequelize
RUN npm install sequelize

# Install sequelize-cli
RUN npm i -g sequelize-cli

# Copy the rest of the application code to the container
COPY . .

# Make file executable
RUN chmod +x startup.sh

# Start the application
ENTRYPOINT [ "./startup.sh" ]