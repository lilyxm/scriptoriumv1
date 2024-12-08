#!/bin/bash

# Build all images defined in the docker-compose file
docker-compose build --no-cache

# Pull all required images for the services defined in the docker-compose file
docker-compose pull