
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Extended User model to handle different roles"""
    STUDENT = 'student'
    DEPARTMENT = 'department'
    ADMIN = 'admin'
    
    ROLE_CHOICES = (
        (STUDENT, 'Student'),
        (DEPARTMENT, 'Department'),
        (ADMIN, 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)

class Department(models.Model):
    """Departments that can provide clearance"""
    name = models.CharField(max_length=100)
    head = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, related_name='headed_department')
    
    def __str__(self):
        return self.name

class ClearanceRequest(models.Model):
    """Clearance requests made by students to departments"""
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_APPROVED, 'Approved'),
        (STATUS_REJECTED, 'Rejected'),
    )
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clearance_requests')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='clearance_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    comment = models.TextField(blank=True, null=True)
    request_date = models.DateField(auto_now_add=True)
    response_date = models.DateField(null=True, blank=True)
    
    class Meta:
        unique_together = ('student', 'department')
        
    def __str__(self):
        return f"{self.student.username} - {self.department.name} ({self.status})"
