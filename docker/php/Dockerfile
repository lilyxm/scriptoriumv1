FROM php:8.1

# Set the working directory
WORKDIR /usr/src/app

# Copy the PHP file to the container
COPY Main.php .


# Make port 80 available to the world outside this container
EXPOSE 80

# Run the PHP file
CMD [ "php", "./Main.php" ]