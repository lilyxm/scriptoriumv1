echo "Please open docker before running this script."

# Install required packages
echo "Installing required packages..."
npm install

# Reset the database
npx prisma migrate reset --force
# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Create an admin user
echo "Populating Database..."
node seed.js

# Build Docker images using docker-compose
docker-compose build --no-cache

# Pull all required images for the services defined in the docker-compose file
docker-compose pull
echo "Setup complete."