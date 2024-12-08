# Use the official Ubuntu image as the base image
FROM bash:latest

# Set the working directory
WORKDIR /app

# Copy the Main.sh file to the working directory
COPY Main.sh .

# Give execution permissions to the Main.sh file
RUN chmod +x Main.sh

# Run the Main.sh script
CMD ["./Main.sh"]