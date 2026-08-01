from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), default="Patient", nullable=False)
    age_group = Column(Integer, default=7, nullable=False)
    sex = Column(Integer, default=0, nullable=False)
    bmi = Column(Float, default=24.0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())
    last_login = Column(String(64), nullable=True)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    bmi = Column(Float, nullable=False)
    high_bp = Column(Integer, nullable=False)
    high_chol = Column(Integer, nullable=False)
    chol_check = Column(Integer, nullable=False)
    stroke = Column(Integer, nullable=False)
    heart_disease_or_attack = Column(Integer, nullable=False)
    smoker = Column(Integer, nullable=False)
    hvy_alcohol_consump = Column(Integer, nullable=False)
    phys_activity = Column(Integer, nullable=False)
    fruits = Column(Integer, nullable=False)
    veggies = Column(Integer, nullable=False)
    ment_hlth = Column(Integer, nullable=False)
    phys_hlth = Column(Integer, nullable=False)
    diff_walk = Column(Integer, nullable=False)
    gen_hlth = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)
    age = Column(Integer, nullable=False)
    education = Column(Integer, nullable=False)
    income = Column(Integer, nullable=False)
    any_healthcare = Column(Integer, nullable=False)
    no_docbc_cost = Column(Integer, nullable=False)
    probability = Column(Float, nullable=False)
    prediction_class = Column(Integer, nullable=False)
    risk_tier = Column(String(32), nullable=False)
    color_code = Column(String(16), nullable=False)
    created_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())

    user = relationship("User", back_populates="predictions")
    recommendation_history = relationship("RecommendationHistory", back_populates="prediction", cascade="all, delete")


class RecommendationHistory(Base):
    __tablename__ = "recommendation_history"

    id = Column(String(64), primary_key=True)
    prediction_id = Column(String(64), ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    top_risk_factors = Column(String(1024), nullable=False)
    recommendations = Column(String(4096), nullable=False)
    created_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())

    prediction = relationship("Prediction", back_populates="recommendation_history")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), nullable=False)
    action = Column(String(128), nullable=False)
    endpoint = Column(String(255), nullable=False)
    ip_address = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False)
    timestamp = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())
    details = Column(String(512), nullable=True)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(512), unique=True, nullable=False)
    expires_at = Column(String(64), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(String(64), primary_key=True)
    setting_key = Column(String(128), unique=True, nullable=False)
    setting_value = Column(String(1024), nullable=False)
    description = Column(String(512), nullable=False)
    updated_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(String(1024), nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    notification_type = Column(String(64), nullable=False)
    created_at = Column(String(64), default=lambda: datetime.datetime.utcnow().isoformat())

    user = relationship("User", back_populates="notifications")
