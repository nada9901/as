from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from typing_extensions import Literal

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "Patient"
    age_group: int = 7
    sex: int = 0
    bmi: float = 24.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    age_group: int
    sex: int
    bmi: float
    is_active: bool
    is_verified: bool
    created_at: str
    last_login: Optional[str] = None

class PredictionInputPayload(BaseModel):
    BMI: float = Field(..., ge=10.0, le=100.0)
    HighBP: int = Field(..., ge=0, le=1)
    HighChol: int = Field(..., ge=0, le=1)
    CholCheck: int = Field(..., ge=0, le=1)
    Stroke: int = Field(..., ge=0, le=1)
    HeartDiseaseorAttack: int = Field(..., ge=0, le=1)
    Smoker: int = Field(..., ge=0, le=1)
    HvyAlcoholConsump: int = Field(..., ge=0, le=1)
    PhysActivity: int = Field(..., ge=0, le=1)
    Fruits: int = Field(..., ge=0, le=1)
    Veggies: int = Field(..., ge=0, le=1)
    MentHlth: int = Field(..., ge=0, le=30)
    PhysHlth: int = Field(..., ge=0, le=30)
    DiffWalk: int = Field(..., ge=0, le=1)
    GenHlth: int = Field(..., ge=1, le=5)
    Sex: int = Field(..., ge=0, le=1)
    Age: int = Field(..., ge=1, le=13)
    Education: int = Field(..., ge=1, le=6)
    Income: int = Field(..., ge=1, le=8)
    AnyHealthcare: int = Field(..., ge=0, le=1)
    NoDocbcCost: int = Field(..., ge=0, le=1)

class PredictionResponse(BaseModel):
    probability: float
    prediction_class: int
    risk_tier: Literal["Low Risk", "Moderate Risk", "High Risk"]
    color_code: Literal["green", "orange", "red"]
    top_risk_factors: List[str]
    recommendations: List[str]

class PredictionHistoryRecord(PredictionResponse):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: str

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    action: str
    endpoint: str
    ip_address: str
    status: str
    timestamp: str
    details: Optional[str] = None
