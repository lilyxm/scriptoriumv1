# Use the official Node.js image from the Docker Hub
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.js when the container launches
CMD ["node", "Main.js"]