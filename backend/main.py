"""
HotelPro Admin API — Main Application Entry Point
All business logic is in routers/. This file handles only app config, middleware, and startup.
"""
import os
import time
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, Request, UploadFile, File, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

import models
from database import engine, get_db

import cloudinary
import cloudinary.uploader

from routers import services, categories, projects, admin, content

# ===== ENV =====
load_dotenv()

# ===== LOGGING =====
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("hotelpro")

# ===== CLOUDINARY =====
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD"),
    api_key=os.getenv("CLOUDINARY_KEY"),
    api_secret=os.getenv("CLOUDINARY_SECRET"),
    secure=True,
)

# ===== CREATE TABLES =====
models.Base.metadata.create_all(bind=engine)

# ===== STARTUP EVENT =====
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure default admin exists
    from auth import get_password_hash
    db = next(get_db())
    admin_count = db.query(models.Admin).count()
    if admin_count == 0:
        logger.info("No admins found in DB. Creating default admin@example.com user...")
        default_admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
        default_admin = models.Admin(
            email="admin@example.com",
            username="AdminUser",
            hashed_password=get_password_hash(default_admin_password)
        )
        db.add(default_admin)
        db.commit()
    db.close()
    yield

# ===== APP =====
app = FastAPI(
    title="HotelPro Admin API",
    description="Enterprise Hotel Management API — Modular Architecture",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ===== MIDDLEWARE STACK =====
app.add_middleware(GZipMiddleware, minimum_size=500)

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")
if ALLOWED_HOSTS != ["*"]:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rootfrontend.netlify.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    method = request.method
    path = request.url.path
    try:
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000, 1)
        sc = response.status_code
        msg = f"{method} {path} -> {sc} ({duration_ms}ms)"
        if sc >= 500:
            logger.error(msg)
        elif sc >= 400:
            logger.warning(msg)
        else:
            logger.info(msg)
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        return response
    except Exception as exc:
        duration_ms = round((time.time() - start_time) * 1000, 1)
        logger.exception(f"{method} {path} -> EXCEPTION ({duration_ms}ms): {exc}")
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled: {request.method} {request.url.path}: {exc}")
    return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred."})

# ===== INCLUDE ROUTERS =====
app.include_router(services.router)
app.include_router(categories.router)
app.include_router(projects.router)
app.include_router(admin.router)
app.include_router(content.router)

# ===== ROOT ENDPOINTS =====
@app.get("/")
def root():
    return {"message": "Welcome to HotelPro Admin API v3. Go to /docs for Swagger."}

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "version": "3.0.0"}

@app.post("/upload", tags=["Media"])
async def upload_image(file: UploadFile = File(...)):
    result = cloudinary.uploader.upload(file.file, folder="hotel_pro")
    return {"url": result.get("secure_url"), "public_id": result.get("public_id")}

@app.post("/seed-demo", tags=["System"])
def seed_demo_endpoint(db: Session = Depends(get_db)):
    demo_services = [
        models.Service(title_en="Hotel Management", title_ru="Управление Отелем", desc_en="Full operational management.", desc_ru="Полное операционное управление.", icon="management", is_popular=True),
        models.Service(title_en="Pre-Opening", title_ru="Pre-Opening", desc_en="Complete preparation before launch.", desc_ru="Полная подготовка до запуска.", icon="preopening", is_popular=True),
        models.Service(title_en="Consulting", title_ru="Консалтинг", desc_en="Market research and feasibility.", desc_ru="Исследование рынка.", icon="consulting", is_popular=False),
    ]
    demo_projects = [
        models.Project(name="Hilton Tashkent", city="Tashkent", role_en="Management", role_ru="Управление", stars=5, category="management", is_featured=True),
        models.Project(name="Bukhara Heritage", city="Bukhara", role_en="Pre-Opening", role_ru="Pre-Opening", stars=4, category="preopening", is_featured=True),
    ]
    db.add_all(demo_services)
    db.add_all(demo_projects)
    if not db.query(models.Stat).first():
        db.add_all([
            models.Stat(label_en="Hotels", label_ru="Отелей", value="60+"),
            models.Stat(label_en="Experience", label_ru="Опыт", value="15+"),
        ])
    db.commit()
    return {"message": "Demo data seeded"}

logger.info("HotelPro API v3 started — modular architecture.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
