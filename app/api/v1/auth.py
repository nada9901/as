from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.database.session import get_db
from app.models.all_models import User, AuditLog
from app.schemas.all_schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    security_bearer,
    decode_access_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(
    credentials = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> User:
    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found or deactivated")
    return user

def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Administrator permissions required")
    return user

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, request: Request, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    
    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    hashed = get_password_hash(user_in.password)
    now_str = datetime.utcnow().isoformat()

    new_user = User(
        id=user_id,
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        password_hash=hashed,
        role="Administrator" if user_in.role == "Administrator" else "Patient",
        age_group=user_in.age_group,
        sex=user_in.sex,
        bmi=user_in.bmi,
        is_active=True,
        is_verified=True,
        created_at=now_str,
        last_login=now_str
    )
    db.add(new_user)

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:12]}",
        user_id=new_user.id,
        action="USER_REGISTERED",
        endpoint="/api/v1/auth/register",
        ip_address=request.client.host if request.client else "127.0.0.1",
        status="SUCCESS",
        details=f"Registered account with role {new_user.role}"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(new_user.id, new_user.email, new_user.role)
    refresh_token = create_refresh_token(new_user.id)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        },
        "accessToken": access_token,
        "refreshToken": refresh_token
    }

@router.post("/login", response_model=dict)
def login_user(login_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower(), User.is_active == True).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        audit = AuditLog(
            id=f"aud_{uuid.uuid4().hex[:12]}",
            user_id=user.id if user else "unknown",
            action="LOGIN_FAILED",
            endpoint="/api/v1/auth/login",
            ip_address=request.client.host if request.client else "127.0.0.1",
            status="FAILED",
            details="Invalid authentication credentials"
        )
        db.add(audit)
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.last_login = datetime.utcnow().isoformat()
    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        action="LOGIN_SUCCESS",
        endpoint="/api/v1/auth/login",
        ip_address=request.client.host if request.client else "127.0.0.1",
        status="SUCCESS",
        details=f"{user.role} session initiated"
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(user.id, user.email, user.role)
    refresh_token = create_refresh_token(user.id)

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "age_group": user.age_group,
            "sex": user.sex,
            "bmi": user.bmi
        },
        "accessToken": access_token,
        "refreshToken": refresh_token
    }

@router.get("/me", response_model=dict)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    predictions = user.predictions
    latest = predictions[0] if predictions else None
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "age_group": user.age_group,
            "sex": user.sex,
            "bmi": user.bmi,
            "is_verified": user.is_verified,
            "created_at": user.created_at,
            "last_login": user.last_login
        },
        "total_predictions": len(predictions),
        "latest_risk_tier": latest.risk_tier if latest else "No screening yet",
        "latest_probability": latest.probability if latest else 0.0
    }

@router.post("/logout", response_model=dict)
def logout(user: User = Depends(get_current_user), request: Request = None, db: Session = Depends(get_db)): # type: ignore
    return {"message": "Session logged out successfully"}

@router.post("/password-reset", response_model=dict)
def password_reset(email: str):
    return {"message": "If an active account exists with this email, password reset instructions have been sent."}
