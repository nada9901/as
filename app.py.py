from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import numpy as np

app = FastAPI(title="HealthGluco XGBoost Inference API")

# السماح للواجهة الأمامية بالاتصال
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# تحميل النموذج المدرب
model = xgb.Booster()
model.load_model("healthgluco_model.pkl")

class PatientFeatures(BaseModel):
    HighBP: int
    HighChol: int
    CholCheck: int
    BMI: float
    Smoker: int
    Stroke: int
    HeartDiseaseorAttack: int
    PhysActivity: int
    Fruits: int
    Veggies: int
    HvyAlcoholConsump: int
    AnyHealthcare: int
    NoDocbcCost: int
    GenHlth: int
    MentHlth: int
    PhysHlth: int
    DiffWalk: int
    Sex: int
    Age: int
    Education: int
    Income: int

@app.post("/predict")
def predict_diabetes(features: PatientFeatures):
    # ترتيب المدخلات وفق نفس ترتيب التدريب
    input_data = np.array([[
        features.HighBP, features.HighChol, features.CholCheck, features.BMI,
        features.Smoker, features.Stroke, features.HeartDiseaseorAttack,
        features.PhysActivity, features.Fruits, features.Veggies,
        features.HvyAlcoholConsump, features.AnyHealthcare, features.NoDocbcCost,
        features.GenHlth, features.MentHlth, features.PhysHlth,
        features.DiffWalk, features.Sex, features.Age,
        features.Education, features.Income
    ]])
    
    dmatrix = xgb.DMatrix(input_data)
    prob = float(model.predict(dmatrix)[0])
    
    # تطبيق العتبة السريرية السعودية (0.10)
    threshold = 0.10
    is_at_risk = prob >= threshold
    
    return {
        "probability": prob,
        "isAtRisk": is_at_risk,
        "clinicalThreshold": threshold,
        "riskLevel": "high" if prob >= 0.40 else ("moderate" if prob >= threshold else "low"),
        "featuresUsed": 21
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)