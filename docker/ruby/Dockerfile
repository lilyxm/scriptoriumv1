# Use the official Ruby image from the Docker Hub
FROM ruby:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install Ruby and any needed gems specified in the Gemfile
RUN apt-get update && apt-get install -y ruby-full && bundle install

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the Ruby file
CMD ["ruby", "Main.rb"]