
#!/bin/bash

# Exit on error
set -e

echo "Setting up Django backend..."

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if needed
if [ ! -f ".setup_done" ]; then
    echo "Setting up initial data..."
    python setup_data.py
    touch .setup_done
fi

# Run the development server
echo "Starting development server..."
python manage.py runserver
