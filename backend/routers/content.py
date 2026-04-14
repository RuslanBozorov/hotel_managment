from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from notifications import notify_new_application, send_test_message

router = APIRouter(tags=["Content"])

# --- APPLICATIONS ---
@router.get("/applications", response_model=List[schemas.Application])
def get_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).order_by(models.Application.created_at.desc()).all()

@router.post("/applications", response_model=schemas.Application)
def create_application(
    app_data: schemas.ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_app = models.Application(**app_data.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)

    # Fire-and-forget Telegram notification (never blocks the response)
    background_tasks.add_task(notify_new_application, db, app_data.model_dump())

    return db_app

@router.patch("/applications/{app_id}/status", response_model=schemas.Application)
def update_application_status(app_id: int, status: str, db: Session = Depends(get_db)):
    db_app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    db_app.status = status
    db.commit()
    db.refresh(db_app)
    return db_app

@router.delete("/applications/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db)):
    app_data = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app_data:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app_data)
    db.commit()
    return {"message": "Application deleted"}

@router.put("/applications/{app_id}", response_model=schemas.Application)
def update_application(app_id: int, app_update: schemas.ApplicationUpdate, db: Session = Depends(get_db)):
    db_app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    for key, value in app_update.model_dump(exclude_unset=True).items():
        setattr(db_app, key, value)
    db.commit()
    db.refresh(db_app)
    return db_app

# --- TEAM ---
@router.get("/team", response_model=List[schemas.TeamMember])
def get_team_members(db: Session = Depends(get_db)):
    return db.query(models.TeamMember).all()

@router.post("/team", response_model=schemas.TeamMember)
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    db_member = models.TeamMember(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/team/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()
    return {"message": "Team member deleted"}

@router.put("/team/{member_id}", response_model=schemas.TeamMember)
def update_team_member(member_id: int, member_update: schemas.TeamMemberUpdate, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    for key, value in member_update.model_dump(exclude_unset=True).items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

# --- STATS ---
@router.get("/stats", response_model=List[schemas.Stat])
def get_stats(db: Session = Depends(get_db)):
    return db.query(models.Stat).all()

@router.post("/stats", response_model=schemas.Stat)
def create_stat(stat: schemas.StatCreate, db: Session = Depends(get_db)):
    db_stat = models.Stat(**stat.model_dump())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

@router.delete("/stats/{stat_id}")
def delete_stat(stat_id: int, db: Session = Depends(get_db)):
    db_stat = db.query(models.Stat).filter(models.Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    db.delete(db_stat)
    db.commit()
    return {"message": "Stat deleted"}

@router.put("/stats/{stat_id}", response_model=schemas.Stat)
def update_stat(stat_id: int, stat_update: schemas.StatUpdate, db: Session = Depends(get_db)):
    db_stat = db.query(models.Stat).filter(models.Stat.id == stat_id).first()
    if not db_stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    for key, value in stat_update.model_dump(exclude_unset=True).items():
        setattr(db_stat, key, value)
    db.commit()
    db.refresh(db_stat)
    return db_stat

# --- TESTIMONIALS ---
@router.get("/testimonials", response_model=List[schemas.Testimonial])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).all()

@router.post("/testimonials", response_model=schemas.Testimonial)
def create_testimonial(testimonial: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    db_t = models.Testimonial(**testimonial.model_dump())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

@router.delete("/testimonials/{t_id}")
def delete_testimonial(t_id: int, db: Session = Depends(get_db)):
    db_t = db.query(models.Testimonial).filter(models.Testimonial.id == t_id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Testimonial deleted"}

# --- PARTNERS ---
@router.get("/partners", response_model=List[schemas.Partner])
def get_partners(db: Session = Depends(get_db)):
    return db.query(models.Partner).all()

@router.post("/partners", response_model=schemas.Partner)
def create_partner(partner: schemas.PartnerCreate, db: Session = Depends(get_db)):
    db_p = models.Partner(**partner.model_dump())
    db.add(db_p)
    db.commit()
    db.refresh(db_p)
    return db_p

@router.delete("/partners/{p_id}")
def delete_partner(p_id: int, db: Session = Depends(get_db)):
    db_p = db.query(models.Partner).filter(models.Partner.id == p_id).first()
    if not db_p:
        raise HTTPException(status_code=404, detail="Partner not found")
    db.delete(db_p)
    db.commit()
    return {"message": "Partner deleted"}

@router.put("/partners/{p_id}", response_model=schemas.Partner)
def update_partner(p_id: int, partner: schemas.PartnerUpdate, db: Session = Depends(get_db)):
    db_p = db.query(models.Partner).filter(models.Partner.id == p_id).first()
    if not db_p:
        raise HTTPException(status_code=404, detail="Partner not found")
    for key, value in partner.model_dump(exclude_unset=True).items():
        setattr(db_p, key, value)
    db.commit()
    db.refresh(db_p)
    return db_p

# --- BLOGS ---
@router.get("/blogs", response_model=List[schemas.Blog])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(models.Blog).all()

@router.post("/blogs", response_model=schemas.Blog)
def create_blog(blog: schemas.BlogCreate, db: Session = Depends(get_db)):
    db_b = models.Blog(**blog.model_dump())
    db.add(db_b)
    db.commit()
    db.refresh(db_b)
    return db_b

@router.delete("/blogs/{b_id}")
def delete_blog(b_id: int, db: Session = Depends(get_db)):
    db_b = db.query(models.Blog).filter(models.Blog.id == b_id).first()
    if not db_b:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(db_b)
    db.commit()
    return {"message": "Blog deleted"}

@router.put("/blogs/{b_id}", response_model=schemas.Blog)
def update_blog(b_id: int, blog: schemas.BlogUpdate, db: Session = Depends(get_db)):
    db_b = db.query(models.Blog).filter(models.Blog.id == b_id).first()
    if not db_b:
        raise HTTPException(status_code=404, detail="Blog not found")
    for key, value in blog.model_dump(exclude_unset=True).items():
        setattr(db_b, key, value)
    db.commit()
    db.refresh(db_b)
    return db_b

# --- FAQ ---
@router.get("/faqs", response_model=List[schemas.Faq])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.Faq).all()

@router.post("/faqs", response_model=schemas.Faq)
def create_faq(faq: schemas.FaqCreate, db: Session = Depends(get_db)):
    db_f = models.Faq(**faq.model_dump())
    db.add(db_f)
    db.commit()
    db.refresh(db_f)
    return db_f

@router.delete("/faqs/{f_id}")
def delete_faq(f_id: int, db: Session = Depends(get_db)):
    db_f = db.query(models.Faq).filter(models.Faq.id == f_id).first()
    if not db_f:
        raise HTTPException(status_code=404, detail="Faq not found")
    db.delete(db_f)
    db.commit()
    return {"message": "Faq deleted"}

# --- TIMELINES ---
@router.get("/timelines", response_model=List[schemas.Timeline])
def get_timelines(db: Session = Depends(get_db)):
    return db.query(models.Timeline).all()

@router.post("/timelines", response_model=schemas.Timeline)
def create_timeline(timeline: schemas.TimelineCreate, db: Session = Depends(get_db)):
    db_t = models.Timeline(**timeline.model_dump())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

@router.delete("/timelines/{t_id}")
def delete_timeline(t_id: int, db: Session = Depends(get_db)):
    db_t = db.query(models.Timeline).filter(models.Timeline.id == t_id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Timeline not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Timeline deleted"}

# --- SETTINGS ---
@router.get("/settings", response_model=List[schemas.Setting])
def get_settings(db: Session = Depends(get_db)):
    return db.query(models.Setting).all()

@router.get("/settings/{key}", response_model=schemas.Setting)
def get_setting_by_key(key: str, db: Session = Depends(get_db)):
    s = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not s:
        raise HTTPException(status_code=404)
    return s

@router.post("/settings", response_model=schemas.Setting)
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

@router.post("/settings/bulk", response_model=List[schemas.Setting])
def bulk_update_settings(bulk_data: schemas.SettingBulkUpdate, db: Session = Depends(get_db)):
    updated_settings = []
    for setting in bulk_data.settings:
        db_s = db.query(models.Setting).filter(models.Setting.key == setting.key).first()
        if db_s:
            db_s.value_en = setting.value_en
            db_s.value_ru = setting.value_ru
        else:
            db_s = models.Setting(**setting.model_dump())
            db.add(db_s)
        updated_settings.append(db_s)
    db.commit()
    for s in updated_settings:
        db.refresh(s)
    return updated_settings

# --- TELEGRAM TEST ---
@router.post("/telegram/test")
def test_telegram_connection(db: Session = Depends(get_db)):
    """Send a test message to verify Telegram bot configuration."""
    success = send_test_message(db)
    if success:
        return {"status": "ok", "message": "Test message sent successfully! Check your Telegram."}
    else:
        raise HTTPException(
            status_code=400,
            detail="Failed to send test message. Please verify your Bot Token and Chat ID."
        )
