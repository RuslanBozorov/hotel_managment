# HotelPro Admin Backend

This is a Python-based backend for the Hotel Management LMS Admin Panel, built with **FastAPI** and **SQLAlchemy**.

## Features
- **FastAPI**: High performance, easy to use, and automatic Swagger documentation.
- **SQLite**: Local database setup (no extra configuration needed).
- **CORS**: Configured to allow requests from the React frontend.
- **Swagger UI**: Accessible at `/docs`.

## Getting Started

### 1. Requirements
Ensure you have Python 3.8+ installed.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
python main.py
```
Or using uvicorn:
```bash
uvicorn main:app --reload
```

### 4. API Documentation
Once the server is running, open:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Directory Structure
- `main.py`: App initialization and route definitions.
- `models.py`: Database models (SQLAlchemy).
- `schemas.py`: Data validation and serialization (Pydantic).
- `database.py`: DB connection and session management.
