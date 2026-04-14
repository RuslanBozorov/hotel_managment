from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
import models, schemas
from database import get_db
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/register")
def register_admin(admin_data: schemas.AdminRegister, db: Session = Depends(get_db)):
    existing_admin = db.query(models.Admin).filter(
        (models.Admin.email == admin_data.email) | (models.Admin.username == admin_data.username)
    ).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    hashed_password = get_password_hash(admin_data.password)
    db_admin = models.Admin(
        email=admin_data.email,
        username=admin_data.username,
        hashed_password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return {"message": "Admin registered successfully", "admin": db_admin}

@router.post("/login", response_model=schemas.Token)
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Admin account is inactive")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": admin
    }

@router.get("/me", response_model=schemas.AdminResponse)
def get_current_admin_info(current_admin: models.Admin = Depends(get_current_admin)):
    return current_admin
