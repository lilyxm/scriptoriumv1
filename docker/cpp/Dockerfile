# Use the official GCC image from the Docker Hub
FROM gcc:latest

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Compile the C++ program
RUN g++ -o main Main.cpp

# Make port 80 available to the world outside this container
EXPOSE 80

# Run the compiled program when the container launches
CMD ["./main"]