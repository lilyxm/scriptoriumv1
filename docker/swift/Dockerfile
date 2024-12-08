# Use the official Swift image from the Docker Hub
FROM swift:latest

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Build the Swift file
RUN swiftc Main.swift -o Main

# Run the compiled Swift program
CMD ["./Main"]