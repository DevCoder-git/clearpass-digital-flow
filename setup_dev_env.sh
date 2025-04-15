
#!/bin/bash

# Exit on error
set -e

echo "Setting up ClearPass development environment..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Set up backend
echo "Setting up backend..."
cd backend
chmod +x run_backend.sh

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Set up initial data
echo "Setting up initial data..."
python setup_data.py

echo "Setup complete! To start the servers:"
echo "1. For backend: cd backend && ./run_backend.sh"
echo "2. For frontend: npm run dev"
