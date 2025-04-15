
# ClearPass - Digital No Due Clearance System

ClearPass is a digital clearance system that allows students to request and track clearance from various departments in an educational institution.

## Project Structure

- `backend/` - Django backend API
- `src/` - React frontend

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and run the setup script:
```bash
# On Unix/Linux/MacOS
chmod +x run_backend.sh
./run_backend.sh

# On Windows (using Git Bash or WSL)
# If using PowerShell/CMD, you'll need to run the commands in the script manually
chmod +x run_backend.sh
./run_backend.sh
```

The script will:
- Create a virtual environment
- Install the required dependencies
- Run migrations
- Set up initial test data
- Start the Django development server on port 8000

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Default Test Users

The system comes with pre-configured test users:

- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`
- Library Department: `library@example.com` / `library123`
- Accounts Department: `accounts@example.com` / `accounts123`

## Features

- User authentication (Student, Department, Admin roles)
- Clearance request submission
- Request tracking and approval workflow
- Digital certificate generation
- Analytics dashboard
- Mobile QR code verification
- Document management
- Real-time notifications
- Automated reminders
