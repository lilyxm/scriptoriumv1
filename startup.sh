#!/bin/bash

# Function to check version
check_version() {
    local cmd=$1
    local required_version=$2
    local version_flag=$3
    local version_regex=$4

    if ! command -v $cmd &> /dev/null; then
        echo "Error: $cmd is not installed."
        exit 1
    fi

    local version=$($cmd $version_flag 2>&1)
    if [[ ! $version =~ $version_regex ]]; then
        echo "Error: $cmd version $required_version or higher is required."
        exit 1
    fi
}

# Install required packages
echo "Installing required packages..."
npm install

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Create an admin user
echo "Creating admin user..."
node createAdminUser.js

# Check for required versions
echo "Checking for required versions..."

# Node.js 20+
check_version "node" "20+" "--version" "v(20|[2-9][0-9])"

# gcc
check_version "gcc" "any version" "--version" "gcc"

# g++
check_version "g++" "any version" "--version" "g\+\+"

# Python 3.10+
check_version "python3" "3.10+" "--version" "Python (3\.1[0-9]|3\.[2-9][0-9])"

# Java 20+
check_version "java" "20+" "-version" "openjdk (20|21|[2-9][0-9])"



echo "Setup complete."