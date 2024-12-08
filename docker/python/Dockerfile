# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app


# Make port 80 available to the world outside this container
EXPOSE 80

# Run Main.py when the container launches
CMD ["python", "Main.py"]