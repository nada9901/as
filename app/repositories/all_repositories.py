from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.all_models import User, Prediction, AuditLog, Notification

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower()).first()

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_all(self, role: Optional[str] = None) -> List[User]:
        query = self.db.query(User)
        if role:
            query = query.filter(User.role == role)
        return query.all()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user


class PredictionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, prediction: Prediction) -> Prediction:
        self.db.add(prediction)
        self.db.commit()
        self.db.refresh(prediction)
        return prediction

    def get_by_id(self, pred_id: str) -> Optional[Prediction]:
        return self.db.query(Prediction).filter(Prediction.id == pred_id).first()

    def get_by_user(self, user_id: str, risk_tier: Optional[str] = None) -> List[Prediction]:
        query = self.db.query(Prediction).filter(Prediction.user_id == user_id)
        if risk_tier:
            query = query.filter(Prediction.risk_tier == risk_tier)
        return query.order_by(Prediction.created_at.desc()).all()

    def get_all(self) -> List[Prediction]:
        return self.db.query(Prediction).order_by(Prediction.created_at.desc()).all()


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, log: AuditLog) -> AuditLog:
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_all(self, limit: int = 100) -> List[AuditLog]:
        return self.db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
