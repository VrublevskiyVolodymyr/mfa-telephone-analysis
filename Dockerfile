# Specify the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the code to the working directory
COPY . .

# Specify the port on which the server will run
EXPOSE 8080

# Run the application
CMD ["npm", "run", "start"]
