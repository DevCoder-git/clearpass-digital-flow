
from rest_framework import serializers
from .models import User, Department, ClearanceRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['id']

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'head', 'head_name']
        
    def get_head_name(self, obj):
        if obj.head:
            return obj.head.get_full_name() or obj.head.username
        return None

class ClearanceRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ClearanceRequest
        fields = ['id', 'student', 'student_name', 'department', 'department_name', 
                  'status', 'comment', 'request_date', 'response_date']
    
    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username
    
    def get_department_name(self, obj):
        return obj.department.name
