
# ClearPass Django Backend

This is the Django backend for the ClearPass application. Follow these instructions to set up and run the backend.

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## API Endpoints

- `/api/auth/login/` - User login
- `/api/auth/logout/` - User logout
- `/api/clearance/requests/` - Clearance requests
- `/api/departments/` - Departments list
- `/api/students/` - Students list (admin only)

## Connecting to the Frontend

To connect this backend with the React frontend, you'll need to:

1. Configure the frontend to make API requests to the Django backend
2. Implement CORS handling in the Django backend
3. Replace the mock authentication with real authentication

