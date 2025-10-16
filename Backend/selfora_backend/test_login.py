#!/usr/bin/env python
"""
Test script to verify password authentication
Run this from the Django project root:
python test_login.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'selfora_backend.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User

def test_user_login(email, password):
    """Test if a user can login with given credentials"""
    print(f"\n{'='*60}")
    print(f"Testing login for: {email}")
    print(f"{'='*60}")
    
    try:
        # Get user
        user_obj = User.objects.get(email=email)
        print(f"✅ User found: {user_obj.username} ({user_obj.email})")
        print(f"   - Is active: {user_obj.is_active}")
        print(f"   - Is staff: {user_obj.is_staff}")
        print(f"   - Password hash: {user_obj.password[:50]}...")
        
        # Test authentication
        user = authenticate(username=user_obj.username, password=password)
        
        if user is not None:
            print(f"\n✅ AUTHENTICATION SUCCESSFUL!")
            print(f"   User {user.email} can login!")
            return True
        else:
            print(f"\n❌ AUTHENTICATION FAILED!")
            print(f"   Password is incorrect for {email}")
            print(f"\n💡 Try these steps:")
            print(f"   1. Register a NEW account through the frontend")
            print(f"   2. Use the EXACT same password you just registered with")
            print(f"   3. Or reset password with:")
            print(f"      python manage.py shell")
            print(f"      >>> from users.models import User")
            print(f"      >>> u = User.objects.get(email='{email}')")
            print(f"      >>> u.set_password('YourNewPassword')")
            print(f"      >>> u.save()")
            return False
            
    except User.DoesNotExist:
        print(f"❌ User not found with email: {email}")
        print(f"\n💡 Please register first at: http://localhost:3000/register")
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("SelfOra Login Authentication Test")
    print("="*60)
    
    # List all users
    users = User.objects.all()
    print(f"\nTotal users in database: {users.count()}")
    for user in users:
        print(f"  - {user.email} (username: {user.username})")
    
    # Test specific users
    print("\n" + "="*60)
    print("Enter credentials to test (or press Enter to skip):")
    print("="*60)
    
    email = input("Email: ").strip()
    if email:
        password = input("Password: ").strip()
        test_user_login(email, password)
    else:
        print("\nNo email provided. Testing existing users...")
        print("\n⚠️  I don't know the passwords for existing users.")
        print("💡 Best solution: Register a NEW account and test with that!")
    
    print("\n" + "="*60)
    print("Test complete!")
    print("="*60 + "\n")
