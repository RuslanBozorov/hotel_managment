from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from datetime import datetime
from database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String)
    title_ru = Column(String)
    desc_en = Column(Text)
    desc_ru = Column(Text)
    icon = Column(String)
    image_url = Column(String, nullable=True)
    is_popular = Column(Boolean, default=False)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    city = Column(String)
    role_en = Column(String)
    role_ru = Column(String)
    stars = Column(Integer, default=5)
    image_url = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    category = Column(String, default="Management")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    phone = Column(String)
    email = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    service_type = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, processed, rejected
    created_at = Column(DateTime, default=datetime.utcnow)

class Stat(Base):
    __tablename__ = "stats"

    id = Column(Integer, primary_key=True, index=True)
    label_en = Column(String)
    label_ru = Column(String)
    value = Column(String)
    icon = Column(String)

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    username = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    role_en = Column(String)
    role_ru = Column(String)
    image_url = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    email = Column(String, nullable=True)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    text_en = Column(Text)
    text_ru = Column(Text)
    author = Column(String)
    position_en = Column(String)
    position_ru = Column(String)
    avatar_url = Column(String, nullable=True)

class Partner(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    logo_url = Column(String, nullable=True)

class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String)
    title_ru = Column(String)
    content_en = Column(Text)
    content_ru = Column(Text)
    category = Column(String)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Faq(Base):
    __tablename__ = "faqs"
    id = Column(Integer, primary_key=True, index=True)
    question_en = Column(String)
    question_ru = Column(String)
    answer_en = Column(Text)
    answer_ru = Column(Text)

class Timeline(Base):
    __tablename__ = "timelines"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(String)
    desc_en = Column(Text)
    desc_ru = Column(Text)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value_en = Column(Text)
    value_ru = Column(Text)
 