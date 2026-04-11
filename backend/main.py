from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

import models, schemas
from database import SessionLocal, engine, get_db
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, File

# JWT Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    admin = db.query(models.Admin).filter(models.Admin.email == token_data.email).first()
    if admin is None:
        raise credentials_exception
    return admin

# Cloudinary Configuration
cloudinary.config( 
  cloud_name = "dgqfoffgj", 
  api_key = "362179194275199", 
  api_secret = "-Ze8usmX2vTPTr26V45mYe3DZZU",
  secure = True
)

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HotelPro Admin API",
    description="API for Hotel Management LMS Admin Panel",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to HotelPro Admin API. Go to /docs for Swagger documentation."}

@app.post("/upload", tags=["Media"])
async def upload_image(file: UploadFile = File(...)):
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="hotel_pro")
        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- SERVICES ENDPOINTS ---
@app.get("/services", response_model=List[schemas.Service], tags=["Services"])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.post("/services", response_model=schemas.Service, tags=["Services"])
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    db_service = models.Service(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.delete("/services/{service_id}", tags=["Services"])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"message": "Service deleted"}

@app.put("/services/{service_id}", response_model=schemas.Service, tags=["Services"])
def update_service(service_id: int, service: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service

# --- PROJECTS ENDPOINTS ---
@app.get("/projects", response_model=List[schemas.Project], tags=["Projects"])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.post("/projects", response_model=schemas.Project, tags=["Projects"])
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}", tags=["Projects"])
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

@app.put("/projects/{project_id}", response_model=schemas.Project, tags=["Projects"])
def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

# --- APPLICATIONS ENDPOINTS ---
@app.get("/applications", response_model=List[schemas.Application], tags=["Applications"])
def get_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).order_by(models.Application.created_at.desc()).all()

@app.post("/applications", response_model=schemas.Application, tags=["Applications"])
def create_application(app_data: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_app = models.Application(**app_data.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@app.patch("/applications/{app_id}/status", response_model=schemas.Application, tags=["Applications"])
def update_application_status(app_id: int, status: str, db: Session = Depends(get_db)):
    db_app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    db_app.status = status
    db.commit()
    db.refresh(db_app)
    return db_app

@app.delete("/applications/{app_id}", tags=["Applications"])
def delete_application(app_id: int, db: Session = Depends(get_db)):
    app_data = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app_data:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app_data)
    db.commit()
    return {"message": "Application deleted"}

@app.put("/applications/{app_id}", response_model=schemas.Application, tags=["Applications"])
def update_application(app_id: int, app_update: schemas.ApplicationUpdate, db: Session = Depends(get_db)):
    db_app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    update_data = app_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_app, key, value)
    
    db.commit()
    db.refresh(db_app)
    return db_app

# --- TEAM MEMBERS ENDPOINTS ---
@app.get("/team", response_model=List[schemas.TeamMember], tags=["Team"])
def get_team_members(db: Session = Depends(get_db)):
    return db.query(models.TeamMember).all()

@app.post("/team", response_model=schemas.TeamMember, tags=["Team"])
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    db_member = models.TeamMember(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.delete("/team/{member_id}", tags=["Team"])
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()
    return {"message": "Team member deleted"}

@app.put("/team/{member_id}", response_model=schemas.TeamMember, tags=["Team"])
def update_team_member(member_id: int, member_update: schemas.TeamMemberUpdate, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    update_data = member_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_member, key, value)
    
    db.commit()
    db.refresh(db_member)
    return db_member


# --- STATS ENDPOINTS ---
@app.get("/stats", response_model=List[schemas.Stat], tags=["Stats"])
def get_stats(db: Session = Depends(get_db)):
    return db.query(models.Stat).all()

@app.post("/stats", response_model=schemas.Stat, tags=["Stats"])
def create_stat(stat: schemas.StatCreate, db: Session = Depends(get_db)):
    db_stat = models.Stat(**stat.model_dump())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

@app.delete("/stats/{stat_id}", tags=["Stats"])
def delete_stat(stat_id: int, db: Session = Depends(get_db)):
    db_stat = db.query(models.Stat).filter(models.Stat.id == stat_id).first()
    if not db_stat: raise HTTPException(status_code=404, detail="Stat not found")
    db.delete(db_stat)
    db.commit()
    return {"message": "Stat deleted"}

@app.put("/stats/{stat_id}", response_model=schemas.Stat, tags=["Stats"])
def update_stat(stat_id: int, stat_update: schemas.StatUpdate, db: Session = Depends(get_db)):
    db_stat = db.query(models.Stat).filter(models.Stat.id == stat_id).first()
    if not db_stat: raise HTTPException(status_code=404, detail="Stat not found")
    update_data = stat_update.model_dump(exclude_unset=True)
    for key, value in update_data.items(): setattr(db_stat, key, value)
    db.commit()
    db.refresh(db_stat)
    return db_stat

# --- TESTIMONIALS ENDPOINTS ---
@app.get("/testimonials", response_model=List[schemas.Testimonial], tags=["Testimonials"])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).all()

@app.post("/testimonials", response_model=schemas.Testimonial, tags=["Testimonials"])
def create_testimonial(testimonial: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    db_t = models.Testimonial(**testimonial.model_dump())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

@app.delete("/testimonials/{t_id}", tags=["Testimonials"])
def delete_testimonial(t_id: int, db: Session = Depends(get_db)):
    db_t = db.query(models.Testimonial).filter(models.Testimonial.id == t_id).first()
    if not db_t: raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Testimonial deleted"}

# --- PARTNERS ENDPOINTS ---
@app.get("/partners", response_model=List[schemas.Partner], tags=["Partners"])
def get_partners(db: Session = Depends(get_db)):
    return db.query(models.Partner).all()

@app.post("/partners", response_model=schemas.Partner, tags=["Partners"])
def create_partner(partner: schemas.PartnerCreate, db: Session = Depends(get_db)):
    db_p = models.Partner(**partner.model_dump())
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    return db_p

@app.delete("/partners/{p_id}", tags=["Partners"])
def delete_partner(p_id: int, db: Session = Depends(get_db)):
    db_p = db.query(models.Partner).filter(models.Partner.id == p_id).first()
    if not db_p: raise HTTPException(status_code=404, detail="Partner not found")
    db.delete(db_p)
    db.commit()
    return {"message": "Partner deleted"}

# --- BLOG ENDPOINTS ---
@app.get("/blogs", response_model=List[schemas.Blog], tags=["Blogs"])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(models.Blog).all()

@app.post("/blogs", response_model=schemas.Blog, tags=["Blogs"])
def create_blog(blog: schemas.BlogCreate, db: Session = Depends(get_db)):
    db_b = models.Blog(**blog.model_dump())
    db.add(db_b)
    db.commit()
    db.refresh(db_b)
    return db_b

@app.delete("/blogs/{b_id}", tags=["Blogs"])
def delete_blog(b_id: int, db: Session = Depends(get_db)):
    db_b = db.query(models.Blog).filter(models.Blog.id == b_id).first()
    if not db_b: raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(db_b)
    db.commit()
    return {"message": "Blog deleted"}

# --- FAQ ENDPOINTS ---
@app.get("/faqs", response_model=List[schemas.Faq], tags=["Faqs"])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.Faq).all()

@app.post("/faqs", response_model=schemas.Faq, tags=["Faqs"])
def create_faq(faq: schemas.FaqCreate, db: Session = Depends(get_db)):
    db_f = models.Faq(**faq.model_dump())
    db.add(db_f)
    db.commit()
    db.refresh(db_f)
    return db_f

@app.delete("/faqs/{f_id}", tags=["Faqs"])
def delete_faq(f_id: int, db: Session = Depends(get_db)):
    db_f = db.query(models.Faq).filter(models.Faq.id == f_id).first()
    if not db_f: raise HTTPException(status_code=404, detail="Faq not found")
    db.delete(db_f)
    db.commit()
    return {"message": "Faq deleted"}

# --- TIMELINE ENDPOINTS ---
@app.get("/timelines", response_model=List[schemas.Timeline], tags=["Timelines"])
def get_timelines(db: Session = Depends(get_db)):
    return db.query(models.Timeline).all()

@app.post("/timelines", response_model=schemas.Timeline, tags=["Timelines"])
def create_timeline(timeline: schemas.TimelineCreate, db: Session = Depends(get_db)):
    db_t = models.Timeline(**timeline.model_dump())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

@app.delete("/timelines/{t_id}", tags=["Timelines"])
def delete_timeline(t_id: int, db: Session = Depends(get_db)):
    db_t = db.query(models.Timeline).filter(models.Timeline.id == t_id).first()
    if not db_t: raise HTTPException(status_code=404, detail="Timeline not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Timeline deleted"}

# --- SETTINGS ENDPOINTS ---
@app.get("/settings", response_model=List[schemas.Setting], tags=["Settings"])
def get_settings(db: Session = Depends(get_db)):
    return db.query(models.Setting).all()

@app.get("/settings/{key}", response_model=schemas.Setting, tags=["Settings"])
def get_setting_by_key(key: str, db: Session = Depends(get_db)):
    s = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not s: raise HTTPException(status_code=404)
    return s

@app.post("/settings", response_model=schemas.Setting, tags=["Settings"])
def update_or_create_setting(setting: schemas.SettingCreate, db: Session = Depends(get_db)):
    db_s = db.query(models.Setting).filter(models.Setting.key == setting.key).first()
    if db_s:
        db_s.value_en = setting.value_en
        db_s.value_ru = setting.value_ru
    else:
        db_s = models.Setting(**setting.model_dump())
        db.add(db_s)
    db.commit()
    db.refresh(db_s)
    return db_s


# --- ADMIN ENDPOINTS ---
@app.post("/admin/register", tags=["Admin"])
def register_admin(admin_data: schemas.AdminRegister, db: Session = Depends(get_db)):
    # Check if admin already exists
    existing_admin = db.query(models.Admin).filter(
        (models.Admin.email == admin_data.email) | (models.Admin.username == admin_data.username)
    ).first()
    
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Create new admin
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

@app.post("/admin/login", response_model=schemas.Token, tags=["Admin"])
def login_admin(admin_login: schemas.AdminLogin, db: Session = Depends(get_db)):
    # Find admin by email
    admin = db.query(models.Admin).filter(models.Admin.email == admin_login.email).first()
    
    if not admin or not verify_password(admin_login.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Admin account is inactive")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": admin
    }

@app.get("/admin/me", response_model=schemas.AdminResponse, tags=["Admin"])
def get_current_admin_info(
    current_admin: models.Admin = Depends(get_current_admin)
):
    return current_admin

@app.post("/seed-demo", tags=["System"])
def seed_demo_endpoint(db: Session = Depends(get_db)):
    # 1. Services
    services = [
        models.Service(title_en="Hotel Management", title_ru="Управление Отелем", desc_en="Full operational management including staff and finance.", desc_ru="Полное операционное управление, включая персонал и финансы.", icon="management", is_popular=True),
        models.Service(title_en="Pre-Opening", title_ru="Pre-Opening", desc_en="Complete preparation 12 months before launch.", desc_ru="Полная подготовка за 12 месяцев до запуска.", icon="preopening", is_popular=True),
        models.Service(title_en="Consulting", title_ru="Консалтинг", desc_en="Market research and feasibility studies.", desc_ru="Исследование рынка и технико-экономическое обоснование.", icon="consulting", is_popular=False),
        models.Service(title_en="Marketing", title_ru="Маркетинг", desc_en="Digital presence and revenue optimization.", desc_ru="Цифровое присутствие и оптимизация доходов.", icon="marketing", is_popular=False),
        models.Service(title_en="Staff Training", title_ru="Обучение персонала", desc_en="International service standards training.", desc_ru="Обучение международным стандартам обслуживания.", icon="training", is_popular=False),
        models.Service(title_en="Franchise Support", title_ru="Поддержка франшизы", desc_en="Assistance with Hilton, Marriott, etc.", desc_ru="Помощь с Hilton, Marriott и др.", icon="franchise", is_popular=False),
    ]

    # 2. Projects
    projects = [
        models.Project(name="Hilton Tashkent", city="Tashkent", role_en="Management", role_ru="Управление", stars=5, category="management", is_featured=True),
        models.Project(name="Bukhara Heritage", city="Bukhara", role_en="Pre-Opening", role_ru="Pre-Opening", stars=4, category="preopening", is_featured=True),
        models.Project(name="Samarkand Grand", city="Samarkand", role_en="Consulting", role_ru="Консалтинг", stars=5, category="consulting", is_featured=True),
        models.Project(name="Fergana Business", city="Fergana", role_en="Marketing", role_ru="Маркетинг", stars=3, category="marketing", is_featured=False),
        models.Project(name="Khiva Silk Road", city="Khiva", role_en="Management", role_ru="Управление", stars=4, category="management", is_featured=False),
        models.Project(name="Chimyon Resort", city="Tashkent", role_en="Pre-Opening", role_ru="Pre-Opening", stars=3, category="preopening", is_featured=False),
    ]

    # 3. Blogs
    blogs = [
        models.Blog(title_en="Revenue Management Tips", title_ru="Советы по Revenue Management", content_en="Optimize your ADR and Occupancy...", content_ru="Оптимизируйте свой ADR и загрузку...", category="Marketing"),
        models.Blog(title_en="Pre-opening Checklists", title_ru="Чек-листы для открытия", content_en="Everything you need to know before opening...", content_ru="Все, что нужно знать перед открытием...", category="Pre-Opening"),
        models.Blog(title_en="Uzbekistan Tourism Trends", title_ru="Тренды туризма в Узбекистане", content_en="Growth in 2025 and beyond...", content_ru="Рост в 2025 году и далее...", category="Industry"),
    ]

    # Clear lists to avoid duplicates if necessary (optional)
    # db.query(models.Service).delete()
    # db.query(models.Project).delete()
    # db.query(models.Blog).delete()

    db.add_all(services)
    db.add_all(projects)
    db.add_all(blogs)
    
    # Also add some stats if they don't exist
    if not db.query(models.Stat).first():
        stats = [
            models.Stat(label_en="Hotels", label_ru="Отелей", value="60+"),
            models.Stat(label_en="Experience", label_ru="Опыт", value="15+"),
        ]
        db.add_all(stats)
        
    db.commit()
    return {"message": "Extensive demo data seeded"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
