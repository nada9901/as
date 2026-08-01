import uuid
import json
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.all_models import Prediction, RecommendationHistory, AuditLog, Notification, User
from app.schemas.all_schemas import PredictionInputPayload, PredictionResponse
from app.api.v1.auth import get_current_user
from app.ml.predictor import predict_diabetes_risk

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("", response_model=PredictionResponse)
def create_prediction(
    input_data: PredictionInputPayload,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result: PredictionResponse = predict_diabetes_risk(input_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    pred_id = f"pred_{uuid.uuid4().hex[:12]}"
    now_str = datetime.utcnow().isoformat()

    db_pred = Prediction(
        id=pred_id,
        user_id=user.id,
        bmi=input_data.BMI,
        high_bp=input_data.HighBP,
        high_chol=input_data.HighChol,
        chol_check=input_data.CholCheck,
        stroke=input_data.Stroke,
        heart_disease_or_attack=input_data.HeartDiseaseorAttack,
        smoker=input_data.Smoker,
        hvy_alcohol_consump=input_data.HvyAlcoholConsump,
        phys_activity=input_data.PhysActivity,
        fruits=input_data.Fruits,
        veggies=input_data.Veggies,
        ment_hlth=input_data.MentHlth,
        phys_hlth=input_data.PhysHlth,
        diff_walk=input_data.DiffWalk,
        gen_hlth=input_data.GenHlth,
        sex=input_data.Sex,
        age=input_data.Age,
        education=input_data.Education,
        income=input_data.Income,
        any_healthcare=input_data.AnyHealthcare,
        no_docbc_cost=input_data.NoDocbcCost,
        probability=result.probability,
        prediction_class=result.prediction_class,
        risk_tier=result.risk_tier,
        color_code=result.color_code,
        created_at=now_str
    )
    db.add(db_pred)

    rec_hist = RecommendationHistory(
        id=f"rec_{uuid.uuid4().hex[:12]}",
        prediction_id=pred_id,
        user_id=user.id,
        top_risk_factors=json.dumps(result.top_risk_factors),
        recommendations=json.dumps(result.recommendations),
        created_at=now_str
    )
    db.add(rec_hist)

    if result.risk_tier == "High Risk":
        note = Notification(
            id=f"notif_{uuid.uuid4().hex[:12]}",
            user_id=user.id,
            title="High Risk Clinical Alert",
            message=f"Your screening evaluated at {result.probability}% probability. Please schedule a clinical consult.",
            is_read=False,
            notification_type="CLINICAL_ALERT",
            created_at=now_str
        )
        db.add(note)

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:12]}",
        user_id=user.id,
        action="PREDICTION_COMPLETED",
        endpoint="/api/v1/predict",
        ip_address=request.client.host if request.client else "127.0.0.1",
        status="SUCCESS",
        details=f"Probability: {result.probability}% ({result.risk_tier})"
    )
    db.add(audit)
    db.commit()

    return result

@router.get("/history", response_model=dict)
def get_prediction_history(
    risk_tier: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Prediction)
    if user.role != "Administrator":
        query = query.filter(Prediction.user_id == user.id)
    if risk_tier:
        query = query.filter(Prediction.risk_tier == risk_tier)
    
    preds = query.order_by(Prediction.created_at.desc()).limit(limit).all()
    results = []
    for p in preds:
        rec = p.recommendation_history[0] if p.recommendation_history else None
        top_factors = json.loads(rec.top_risk_factors) if rec else []
        recs = json.loads(rec.recommendations) if rec else []
        results.append({
            "id": p.id,
            "user_id": p.user_id,
            "probability": p.probability,
            "prediction_class": p.prediction_class,
            "risk_tier": p.risk_tier,
            "color_code": p.color_code,
            "top_risk_factors": top_factors,
            "recommendations": recs,
            "created_at": p.created_at
        })
    return {"total": len(results), "predictions": results}

@router.get("/history/{id}", response_model=dict)
def get_prediction_by_id(
    id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Prediction).filter(Prediction.id == id)
    if user.role != "Administrator":
        query = query.filter(Prediction.user_id == user.id)
    pred = query.first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction screening record not found")
    rec = pred.recommendation_history[0] if pred.recommendation_history else None
    return {
        "id": pred.id,
        "user_id": pred.user_id,
        "probability": pred.probability,
        "prediction_class": pred.prediction_class,
        "risk_tier": pred.risk_tier,
        "color_code": pred.color_code,
        "top_risk_factors": json.loads(rec.top_risk_factors) if rec else [],
        "recommendations": json.loads(rec.recommendations) if rec else [],
        "created_at": pred.created_at
    }

@router.post("/compare", response_model=dict)
def compare_predictions(
    prediction_ids: List[str],
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if len(prediction_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two prediction IDs to compare")
    query = db.query(Prediction).filter(Prediction.id.in_(prediction_ids))
    if user.role != "Administrator":
        query = query.filter(Prediction.user_id == user.id)
    preds = query.order_by(Prediction.created_at.asc()).all()
    return {
        "comparison": [
            {
                "id": p.id,
                "created_at": p.created_at,
                "probability": p.probability,
                "risk_tier": p.risk_tier,
                "bmi": p.bmi
            }
            for p in preds
        ],
        "trend_analysis": {
            "probability_diff": preds[-1].probability - preds[0].probability if len(preds) >= 2 else 0,
            "bmi_diff": preds[-1].bmi - preds[0].bmi if len(preds) >= 2 else 0
        }
    }
