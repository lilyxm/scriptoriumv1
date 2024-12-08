# Use the official GCC image
FROM gcc:latest

# Install necessary build dependencies (if any)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the C program into the container
COPY Main.c .

# Compile the C program
RUN gcc -o main Main.c

# Set the command to run the executable
CMD ["./main"]
