from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

import models, schemas
from database import get_db

router = APIRouter(tags=["Projects"])

@router.get("/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    # Fix N+1: use joinedload to eagerly load category_rel
    projects = db.query(models.Project).options(joinedload(models.Project.category_rel)).all()
    result = []
    for p in projects:
        data = schemas.ProjectResponse.model_validate(p)
        if p.category_rel:
            data.category_name_en = p.category_rel.name_en
            data.category_name_ru = p.category_rel.name_ru
            data.category = p.category_rel.slug
        result.append(data)
    return result

@router.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    project_data = project.model_dump()
    if project_data.get('category_id'):
        cat = db.query(models.Category).filter(models.Category.id == project_data['category_id']).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Invalid category_id")
    
    try:
        db_project = models.Project(**project_data)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        db.delete(project)
        db.commit()
        return {"message": "Project deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    update_data = project.model_dump(exclude_unset=True)
    if 'category_id' in update_data and update_data['category_id']:
        cat = db.query(models.Category).filter(models.Category.id == update_data['category_id']).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Invalid category_id")
            
    try:
        for key, value in update_data.items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
        return db_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")
