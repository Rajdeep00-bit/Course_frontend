# Use an official node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the current directory contents into the container at /app
COPY . /app

# Build the app
RUN npm run build

# Install a simple server to serve the built app
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the server to serve the app
CMD ["serve", "-s", "build"]
