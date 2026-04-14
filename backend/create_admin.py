"""
Script to create/update admin user.
Run: python create_admin.py
"""
from database import SessionLocal
from auth import get_password_hash
import models

def create_admin():
    db = SessionLocal()
    
    email = "frontendruslan@gmail.com"
    password = "admin123"
    
    # Check if this email already exists
    existing = db.query(models.Admin).filter(models.Admin.email == email).first()
    if existing:
        existing.hashed_password = get_password_hash(password)
        existing.is_active = True
        db.commit()
        print(f"Admin password updated for: {email}")
    else:
        admin = models.Admin(
            email=email,
            username="ruslan",
            hashed_password=get_password_hash(password),
            is_active=True
        )
        db.add(admin)
        db.commit()
        print(f"Admin created: {email}")
    
    print(f"Email: {email}")
    print(f"Password: {password}")
    db.close()

if __name__ == "__main__":
    create_admin()
