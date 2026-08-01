import pytest
from app.schemas.all_schemas import PredictionInputPayload
from app.ml.predictor import predict_diabetes_risk, get_risk_tier

def test_ml_threshold_and_high_risk():
    high_risk_payload = PredictionInputPayload(
        BMI=33.5,
        HighBP=1,
        HighChol=1,
        CholCheck=1,
        Stroke=0,
        HeartDiseaseorAttack=0,
        Smoker=1,
        HvyAlcoholConsump=0,
        PhysActivity=0,
        Fruits=0,
        Veggies=0,
        MentHlth=5,
        PhysHlth=5,
        DiffWalk=0,
        GenHlth=4,
        Sex=1,
        Age=9,
        Education=4,
        Income=5,
        AnyHealthcare=1,
        NoDocbcCost=0
    )
    result = predict_diabetes_risk(high_risk_payload)
    assert result.prediction_class == 1
    assert result.probability >= 10.0
    assert result.risk_tier in ["Moderate Risk", "High Risk"]
    assert len(result.recommendations) > 0

def test_ml_low_risk_tier():
    low_risk_payload = PredictionInputPayload(
        BMI=21.0,
        HighBP=0,
        HighChol=0,
        CholCheck=1,
        Stroke=0,
        HeartDiseaseorAttack=0,
        Smoker=0,
        HvyAlcoholConsump=0,
        PhysActivity=1,
        Fruits=1,
        Veggies=1,
        MentHlth=0,
        PhysHlth=0,
        DiffWalk=0,
        GenHlth=1,
        Sex=0,
        Age=3,
        Education=6,
        Income=8,
        AnyHealthcare=1,
        NoDocbcCost=0
    )
    result = predict_diabetes_risk(low_risk_payload)
    assert result.risk_tier == "Low Risk"
    assert result.color_code == "green"
    assert result.prediction_class == 0

def test_risk_tier_boundaries():
    assert get_risk_tier(0.10)["tier"] == "Low Risk"
    assert get_risk_tier(0.15)["tier"] == "Moderate Risk"
    assert get_risk_tier(0.40)["tier"] == "High Risk"
