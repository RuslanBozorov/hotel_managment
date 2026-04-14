from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional, List
from datetime import datetime
import re

# ===== SHARED VALIDATORS =====
def validate_phone(v: str) -> str:
    """Validate international phone format: +998901234567 or 998901234567"""
    if v is None:
        return v
    cleaned = re.sub(r'[\s\-\(\)]', '', v)
    if not re.match(r'^\+?\d{9,15}$', cleaned):
        raise ValueError('Phone must be 9-15 digits, optionally starting with +')
    return cleaned

def validate_url(v: str) -> str:
    """Validate URL format - accepts http://, https://, or /paths/ for local files"""
    if v is None or v == '':
        return v
    # Allow local paths like /images/... as well as full URLs
    if not re.match(r'^(https?://|/|[a-zA-Z]:)', v):
        raise ValueError('URL must start with http://, https://, or /')
    return v

def validate_slug(v: str) -> str:
    """Validate slug format: lowercase letters, numbers, hyphens"""
    if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', v):
        raise ValueError('Slug must contain only lowercase letters, numbers, and hyphens')
    return v

# Services
class ServiceBase(BaseModel):
    title_en: str
    title_ru: str
    desc_en: str
    desc_ru: str
    icon: Optional[str] = "fa-star"
    image_url: Optional[str] = None
    is_popular: bool = False

    @field_validator('image_url')
    @classmethod
    def check_image_url(cls, v):
        return validate_url(v) if v else v

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ru: Optional[str] = None
    desc_en: Optional[str] = None
    desc_ru: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    is_popular: Optional[bool] = None

class Service(ServiceBase):
    id: int
    class Config:
        from_attributes = True

# Categories
class CategoryBase(BaseModel):
    name_en: str
    name_ru: str
    slug: str

    @field_validator('slug')
    @classmethod
    def check_slug(cls, v):
        return validate_slug(v)

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name_en: Optional[str] = None
    name_ru: Optional[str] = None
    slug: Optional[str] = None

    @field_validator('slug')
    @classmethod
    def check_slug(cls, v):
        if v is None: return v
        return validate_slug(v)

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# Projects
class ProjectBase(BaseModel):
    name: str
    city: str
    role_en: str
    role_ru: str
    stars: int = 5
    image_url: Optional[str] = None
    is_featured: bool = False
    category_id: Optional[int] = None

    @field_validator('stars')
    @classmethod
    def check_stars(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Stars must be between 1 and 5')
        return v

    @field_validator('image_url')
    @classmethod
    def check_project_image(cls, v):
        return validate_url(v) if v else v

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    role_en: Optional[str] = None
    role_ru: Optional[str] = None
    stars: Optional[int] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    category_id: Optional[int] = None

    @field_validator('stars')
    @classmethod
    def check_stars(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Stars must be between 1 and 5')
        return v

class ProjectResponse(ProjectBase):
    id: int
    category: Optional[str] = None
    category_name_en: Optional[str] = None
    category_name_ru: Optional[str] = None
    class Config:
        from_attributes = True

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

# Applications
class ApplicationBase(BaseModel):
    fullname: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None
    service_type: Optional[str] = None

    @field_validator('phone')
    @classmethod
    def check_phone(cls, v):
        return validate_phone(v)

    @field_validator('email')
    @classmethod
    def check_email(cls, v):
        if v is None or v == '':
            return v
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v.lower()

    @field_validator('fullname')
    @classmethod
    def check_fullname(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Full name must be at least 2 characters')
        return v.strip()

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    fullname: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    message: Optional[str] = None
    service_type: Optional[str] = None
    status: Optional[str] = None

class Application(ApplicationBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Admin Authentication
class AdminRegister(BaseModel):
    email: str
    username: str
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    admin: AdminResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Team Members
class TeamMemberBase(BaseModel):
    fullname: str
    role_en: str
    role_ru: str
    bio_en: Optional[str] = None
    bio_ru: Optional[str] = None
    telegram: Optional[str] = None
    image_url: Optional[str] = None
    linkedin: Optional[str] = None
    email: Optional[str] = None

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    fullname: Optional[str] = None
    role_en: Optional[str] = None
    role_ru: Optional[str] = None
    bio_en: Optional[str] = None
    bio_ru: Optional[str] = None
    telegram: Optional[str] = None
    image_url: Optional[str] = None
    linkedin: Optional[str] = None
    email: Optional[str] = None

class TeamMember(TeamMemberBase):
    id: int
    class Config:
        from_attributes = True

# Stats
class StatBase(BaseModel):
    label_en: str
    label_ru: str
    value: str
    icon: Optional[str] = "fa-star"

class StatCreate(StatBase):
    pass

class StatUpdate(BaseModel):
    label_en: Optional[str] = None
    label_ru: Optional[str] = None
    value: Optional[str] = None
    icon: Optional[str] = None

class Stat(StatBase):
    id: int
    class Config:
        from_attributes = True

# Testimonials
class TestimonialBase(BaseModel):
    text_en: str
    text_ru: str
    author: str
    position_en: str
    position_ru: str
    avatar_url: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    text_en: Optional[str] = None
    text_ru: Optional[str] = None
    author: Optional[str] = None
    position_en: Optional[str] = None
    position_ru: Optional[str] = None
    avatar_url: Optional[str] = None

class Testimonial(TestimonialBase):
    id: int
    class Config:
        from_attributes = True

# Partners
class PartnerBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    category: str = "brand" # brand, partner

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    category: Optional[str] = None

class Partner(PartnerBase):
    id: int
    class Config:
        from_attributes = True

# Blogs
class BlogBase(BaseModel):
    title_en: str
    title_ru: str
    content_en: str
    content_ru: str
    category: str
    author: Optional[str] = "Admin"
    image_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title_en: Optional[str] = None
    title_ru: Optional[str] = None
    content_en: Optional[str] = None
    content_ru: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None

class Blog(BlogBase):
    id: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Faqs
class FaqBase(BaseModel):
    question_en: str
    question_ru: str
    answer_en: str
    answer_ru: str

class FaqCreate(FaqBase):
    pass

class FaqUpdate(BaseModel):
    question_en: Optional[str] = None
    question_ru: Optional[str] = None
    answer_en: Optional[str] = None
    answer_ru: Optional[str] = None

class Faq(FaqBase):
    id: int
    class Config:
        from_attributes = True

# Timelines
class TimelineBase(BaseModel):
    year: str
    desc_en: str
    desc_ru: str

class TimelineCreate(TimelineBase):
    pass

class TimelineUpdate(BaseModel):
    year: Optional[str] = None
    desc_en: Optional[str] = None
    desc_ru: Optional[str] = None

class Timeline(TimelineBase):
    id: int
    class Config:
        from_attributes = True

# Settings
class SettingBase(BaseModel):
    key: str
    value_en: str
    value_ru: str

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    value_en: Optional[str] = None
    value_ru: Optional[str] = None

class Setting(SettingBase):
    id: int
    class Config:
        from_attributes = True

class SettingBulkUpdate(BaseModel):
    settings: List[SettingCreate]
