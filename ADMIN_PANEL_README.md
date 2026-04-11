# Hotel Management Admin Panel

## 🎯 O'ziga xos xususiyatlari

### Backend (FastAPI + SQLAlchemy)
- ✅ Admin autentifikatsiyasi (JWT tokenlar orqali)
- ✅ Admin ro'yxatdan o'tish va login
- ✅ Parollar bcrypt orqali xeshlangan
- ✅ Services, Projects, Applications CRUD operatsiyalari
- ✅ Cloudinary integratsiyasi rasm yuklash uchun

### Frontend (React + TypeScript)
- ✅ Admin Login/Register sahifasi
- ✅ Admin Dashboard (protected route)
- ✅ Applications boshqaruvi (status o'zgartirishlar)
- ✅ Services boshqaruvi (qo'shish/o'chirish)
- ✅ Projects boshqaruvi (qo'shish)
- ✅ Responsive dizayn

## 🚀 O'rnatish va Ishga Tushirish

### Backend Tayyorlanishi

1. **Requirements-ni o'rnatish:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Serverni ishga tushirish:**
```bash
python main.py
# yoki
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

Backend API:
- 📍 **Root:** `http://127.0.0.1:8001`
- 📖 **Swagger:** `http://127.0.0.1:8001/docs`
- 📝 **ReDoc:** `http://127.0.0.1:8001/redoc`

### Frontend Tayyorlanishi

1. **Dependencies-ni o'rnatish:**
```bash
cd Front
npm install
```

2. **Development serverni ishga tushirish:**
```bash
npm run dev
```

Frontend:
- 📍 **Local:** `http://localhost:5173`

## 📋 API Endpointlari

### Admin Autentifikatsiya

#### Ro'yxatdan o'tish
```javascript
POST /admin/register
Body: {
  "email": "admin@example.com",
  "username": "admin",
  "password": "password123"
}
```

#### Login
```javascript
POST /admin/login
Body: {
  "email": "admin@example.com",
  "password": "password123"
}
Response: {
  "access_token": "token...",
  "token_type": "bearer",
  "admin": { id, email, username, is_active, created_at }
}
```

#### Joriy Admin Ma'lumotlari
```javascript
GET /admin/me
Headers: Authorization: Bearer <token>
```

### Applications

```javascript
GET /applications       # Barcha arizalarni olish
POST /applications      # Yangi ariza yaratish
PATCH /applications/{id}/status  # Status o'zgartirishlar (pending/processed/rejected)
```

### Services

```javascript
GET /services           # Barcha xizmatlarni olish
POST /services          # Yangi xizmat qo'shish
DELETE /services/{id}   # Xizmatni o'chirish
```

### Projects

```javascript
GET /projects           # Barcha loyihalarni olish
POST /projects          # Yangi loyiha qo'shish
```

## 🔐 Autentifikatsiya

1. **Login sahifasida ro'yxatdan o'ting:** `/admin/login`
2. **Email va parol kiriting**
3. **Token avtomatik saqlanadi** localStorage-da
4. **Dashboard-ga o'tamiz:** `/admin/dashboard`

### Token Boshqaruvi
- Token **localStorage**-da saqlanadi
- Login bo'lgan topilmasa,eski `/admin/login` ga yo'naltiriladi
- Logout tugmasida token o'chiriladi

## 💾 Database

SQLite-da saqlanadi: `hotel_pro.db`

### Jadvallar
- `admins` - Adminlar tomonidan yaratilgan account-lar
- `applications` - Foydalanuvchilar arizalari
- `services` - Hotel xizmatlar
- `projects` - Tuik loyihalar
- `stats` - Statistika ma'lumotlari

## 🛠️ O'rnatish va Konfiguratsiya

### Backend Sozlamalari

[backend/main.py](backend/main.py)-da:
```python
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

**⚠️ Production-da SECRET_KEY o'zgartirilishi KERAK!**

### Frontend API URL

[Front/src/services/api.ts](Front/src/services/api.ts)-da:
```typescript
const API_BASE_URL = 'http://127.0.0.1:8001';
```

## 🎨 Frontend Sahifalari

- `/admin/login` - Login/Register
- `/admin/dashboard` - Admin Panel asosiy sahifasi
  - Applications tab - Arizalarni boshqarish
  - Services tab - Xizmatlarni boshqarish
  - Projects tab - Loyihalarni boshqarish

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

## 🚨 Error Handling

Frontend barcha xatoliklarni ko'rsatadi:
- Noto'g'ri login credentials
- Network xatoliqlari
- Validation xatoliqlari

## 🔄 CORS

Backend CORS-ni barcha origin-lardan qabul qiladi. Production-da o'zgartirish kerak:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specifik domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📦 Dependencies

### Backend
- FastAPI - Web framework
- SQLAlchemy - ORM
- Pydantic - Data validation
- python-jose - JWT tokens
- passlib + bcrypt - Password hashing
- Cloudinary - Image storage

### Frontend
- React - UI framework
- TypeScript - Type safety
- React Router - Navigation
- Vite - Build tool

## 🆘 Troubleshooting

### Backend port allaqachon band
```bash
# 8001 portni ishlatib ko'ring
uvicorn main:app --host 127.0.0.1 --port 8001
```

### CORS xatoligi
- Frontend va backend URL-lari tekshirilsin
- Backend CORS sozlamalari tekshirilsin

### Login ishlamayotgan bo'lsa
- Database mavjudligini tekshirilsin
- Admin-ni ro'yxatdan o'tkazish kerak (birinchi marta)

## 📧 API Testing

### Postman Collection
Swagger UI: `http://127.0.0.1:8001/docs` - barcha endpointlarni testlab ko'ring

## 🎓 Keyingi Qadam

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Admin roles va permissions
- [ ] Audit logs
- [ ] Advanced analytics
- [ ] Mobile app

---

**Happy Coding! 🚀**
