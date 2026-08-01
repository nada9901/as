from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.all_models import User, Notification
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/users", tags=["User Account & Profile"])

@router.get("/profile", response_model=dict)
def get_user_profile(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "age_group": user.age_group,
        "sex": user.sex,
        "bmi": user.bmi,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "last_login": user.last_login
    }

@router.put("/profile", response_model=dict)
def update_user_profile(
    full_name: str = None, # type: ignore
    age_group: int = None, # type: ignore
    sex: int = None, # type: ignore
    bmi: float = None, # type: ignore
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if full_name: user.full_name = full_name
    if age_group is not None: user.age_group = age_group
    if sex is not None: user.sex = sex
    if bmi is not None: user.bmi = bmi

    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "age_group": user.age_group,
        "sex": user.sex,
        "bmi": user.bmi
    }

@router.get("/notifications", response_model=list)
def get_user_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notes = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()
    return [
        {"id": n.id, "title": n.title, "message": n.message, "is_read": n.is_read, "notification_type": n.notification_type, "created_at": n.created_at}
        for n in notes
    ]

@router.put("/notifications/{id}/read", response_model=dict)
def mark_notification_read(id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Notification).filter(Notification.id == id, Notification.user_id == user.id).first()
    if note:
        note.is_read = True
        db.commit()
    return {"success": True}

@router.delete("/account", response_model=dict)
def delete_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.is_active = False
    db.commit()
    return {"message": "Account deactivated successfully"}
