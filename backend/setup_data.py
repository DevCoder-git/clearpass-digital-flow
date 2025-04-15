
#!/usr/bin/env python
"""
Script to populate initial data for the ClearPass project.
Run after migrations: python setup_data.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clearpass_project.settings')
django.setup()

from clearpass.models import User, Department
from django.utils import timezone

def create_users():
    """Create initial users"""
    users = [
        {
            'username': 'admin@example.com',
            'email': 'admin@example.com',
            'password': 'admin123',
            'role': 'admin',
            'first_name': 'Admin',
            'last_name': 'User'
        },
        {
            'username': 'student@example.com',
            'email': 'student@example.com',
            'password': 'student123',
            'role': 'student',
            'first_name': 'Student',
            'last_name': 'User'
        },
        {
            'username': 'library@example.com',
            'email': 'library@example.com',
            'password': 'library123',
            'role': 'department',
            'first_name': 'Library',
            'last_name': 'Department'
        },
        {
            'username': 'accounts@example.com',
            'email': 'accounts@example.com',
            'password': 'accounts123',
            'role': 'department',
            'first_name': 'Accounts',
            'last_name': 'Department'
        }
    ]
    
    for user_data in users:
        password = user_data.pop('password')
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults=user_data
        )
        if created:
            user.set_password(password)
            user.save()
            print(f"Created user: {user.email}")

def create_departments():
    """Create initial departments"""
    departments = [
        {
            'name': 'Library',
            'head': 'library@example.com'
        },
        {
            'name': 'Accounts',
            'head': 'accounts@example.com'
        },
        {
            'name': 'Hostel',
            'head': None
        },
        {
            'name': 'Academic Department',
            'head': None
        },
        {
            'name': 'Laboratory',
            'head': None
        },
        {
            'name': 'Sports Department',
            'head': None
        }
    ]
    
    for dept_data in departments:
        head_email = dept_data.pop('head')
        head = None
        if head_email:
            try:
                head = User.objects.get(email=head_email)
            except User.DoesNotExist:
                pass
        
        dept, created = Department.objects.get_or_create(
            name=dept_data['name'],
            defaults={'head': head}
        )
        if created:
            print(f"Created department: {dept.name}")

if __name__ == "__main__":
    print("Setting up initial data...")
    create_users()
    create_departments()
    print("Done!")
