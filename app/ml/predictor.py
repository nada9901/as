import math
from typing import Dict, Any, List
from app.schemas.all_schemas import PredictionInputPayload, PredictionResponse

RECOMMENDATIONS_MAP: Dict[str, str] = {
    'BMI': "Your BMI indicates overweight/obesity. Aim for a BMI of 18.5-24.9 through balanced nutrition and regular exercise.",
    'HighBP': "High blood pressure detected. Monitor regularly, reduce sodium intake, and consult a healthcare provider.",
    'HighChol': "High cholesterol detected. Focus on heart-healthy fats, soluble fiber, and regular clinical follow-ups.",
    'CholCheck': "Regular cholesterol screening is essential. Ensure you get your lipid panel checked at least every 4-5 years.",
    'Stroke': "History of stroke significantly elevates cardiometabolic risk. Ensure adherence to antiplatelet or prescribed cardiac therapy.",
    'HeartDiseaseorAttack': "Coronary heart disease history requires strict glycemic and vascular risk factor management.",
    'Smoker': "Smoking significantly increases diabetes risk and microvascular damage. Seek support to quit smoking immediately.",
    'HvyAlcoholConsump': "Heavy alcohol intake impairs liver glucose regulation and pancreas function. Reduce alcohol consumption.",
    'PhysActivity': "Physical inactivity is a major risk factor. Aim for at least 150 minutes of moderate aerobic exercise weekly.",
    'Fruits': "Fruit intake is below optimal frequency. Incorporate whole fruits rich in antioxidants and fiber into your daily diet.",
    'Veggies': "Vegetable consumption is low. Add non-starchy green vegetables to every main meal to improve insulin sensitivity.",
    'MentHlth': "Frequent poor mental health days affect cortisol and glycemic stability. Consider professional psychological or stress support.",
    'PhysHlth': "Reported physical health burden may limit mobility. Consult a physical therapist or clinician for adaptive exercise plans.",
    'DiffWalk': "Difficulty walking or climbing stairs may impede standard workouts. Explore low-impact water aerobics or seated resistance exercises.",
    'GenHlth': "Poor general health reported. Schedule a comprehensive medical check-up for thorough metabolic screening.",
    'Sex': "Male sex is associated with visceral adiposity risks; maintain waist circumference below recommended clinical thresholds.",
    'Age': "Age is a non-modifiable risk factor for type 2 diabetes. Increase screening frequency as you enter older age brackets.",
    'Education': "Enhancing health literacy about carbohydrate counting and nutrition labels can dramatically lower HbA1c trajectory.",
    'Income': "Discuss affordable, insurance-covered preventative wellness programs and generic prescription options with your care team.",
    'AnyHealthcare': "Maintain continuous health insurance coverage to ensure timely access to HbA1c testing and endocrine specialist visits.",
    'NoDocbcCost': "If cost has prevented doctor visits, contact community health clinics or patient assistance programs for subsidized screenings."
}

def get_risk_tier(probability_decimal: float) -> dict:
    if probability_decimal < 0.15:
        return {"tier": "Low Risk", "color": "green"}
    elif 0.15 <= probability_decimal < 0.40:
        return {"tier": "Moderate Risk", "color": "orange"}
    else:
        return {"tier": "High Risk", "color": "red"}

def predict_diabetes_risk(user_data: PredictionInputPayload) -> PredictionResponse:
    log_odds = -2.85

    if user_data.BMI >= 35: log_odds += 1.15
    elif user_data.BMI >= 30: log_odds += 0.82
    elif user_data.BMI >= 25: log_odds += 0.38

    if user_data.HighBP == 1: log_odds += 0.68
    if user_data.HighChol == 1: log_odds += 0.54
    if user_data.CholCheck == 0: log_odds += 0.32
    if user_data.Stroke == 1: log_odds += 0.45
    if user_data.HeartDiseaseorAttack == 1: log_odds += 0.61

    if user_data.Smoker == 1: log_odds += 0.18
    if user_data.HvyAlcoholConsump == 1: log_odds += 0.14
    if user_data.PhysActivity == 0: log_odds += 0.42
    if user_data.Fruits == 0: log_odds += 0.19
    if user_data.Veggies == 0: log_odds += 0.22

    if user_data.GenHlth == 5: log_odds += 1.25
    elif user_data.GenHlth == 4: log_odds += 0.88
    elif user_data.GenHlth == 3: log_odds += 0.45
    elif user_data.GenHlth == 2: log_odds += 0.15

    if user_data.PhysHlth >= 15: log_odds += 0.35
    elif user_data.PhysHlth >= 7: log_odds += 0.18

    if user_data.MentHlth >= 15: log_odds += 0.19
    if user_data.DiffWalk == 1: log_odds += 0.38

    if user_data.Age >= 10: log_odds += 0.72
    elif user_data.Age >= 8: log_odds += 0.48
    elif user_data.Age >= 6: log_odds += 0.28

    if user_data.Sex == 1: log_odds += 0.08
    if user_data.Education <= 3: log_odds += 0.24
    if user_data.Income <= 3: log_odds += 0.22
    if user_data.NoDocbcCost == 1: log_odds += 0.16

    prob_decimal = 1.0 / (1.0 + math.exp(-log_odds))
    prob_percent = round(prob_decimal * 100.0, 2)

    # Section 1 & 4.B: Optimal Medical Threshold = 0.10 (10%)
    prediction_class = 1 if prob_decimal >= 0.10 else 0
    risk_info = get_risk_tier(prob_decimal)

    top_factors: List[str] = []
    recommendations: List[str] = []

    if user_data.BMI >= 25:
        top_factors.append(f"BMI ({user_data.BMI} kg/m² - {'Obese' if user_data.BMI >= 30 else 'Overweight'})")
        recommendations.append(RECOMMENDATIONS_MAP['BMI'])
    if user_data.HighBP == 1:
        top_factors.append("High Blood Pressure (Hypertension)")
        recommendations.append(RECOMMENDATIONS_MAP['HighBP'])
    if user_data.HighChol == 1:
        top_factors.append("High Cholesterol (Hyperlipidemia)")
        recommendations.append(RECOMMENDATIONS_MAP['HighChol'])
    if user_data.GenHlth >= 4:
        top_factors.append(f"General Health Rated {'Poor' if user_data.GenHlth == 5 else 'Fair'}")
        recommendations.append(RECOMMENDATIONS_MAP['GenHlth'])
    if user_data.PhysActivity == 0:
        top_factors.append("Physical Inactivity (0 days in last 30 days)")
        recommendations.append(RECOMMENDATIONS_MAP['PhysActivity'])
    if user_data.Smoker == 1:
        top_factors.append("History of Tobacco Use (>100 cigarettes)")
        recommendations.append(RECOMMENDATIONS_MAP['Smoker'])
    if user_data.HeartDiseaseorAttack == 1 or user_data.Stroke == 1:
        top_factors.append("Cardiovascular / Stroke History")
        if user_data.HeartDiseaseorAttack == 1: recommendations.append(RECOMMENDATIONS_MAP['HeartDiseaseorAttack'])
        if user_data.Stroke == 1 and RECOMMENDATIONS_MAP['Stroke'] not in recommendations:
            recommendations.append(RECOMMENDATIONS_MAP['Stroke'])
    if user_data.Fruits == 0 or user_data.Veggies == 0:
        top_factors.append("Suboptimal Dietary Fiber / Produce Intake")
        if user_data.Fruits == 0: recommendations.append(RECOMMENDATIONS_MAP['Fruits'])
        if user_data.Veggies == 0: recommendations.append(RECOMMENDATIONS_MAP['Veggies'])
    if user_data.Age >= 9:
        top_factors.append(f"Older Age Group ({'65+' if user_data.Age >= 10 else '60-64'})")
        recommendations.append(RECOMMENDATIONS_MAP['Age'])

    if len(top_factors) == 0:
        top_factors.append("No dominant high-risk clinical factors identified")
        recommendations.append("Great job maintaining a healthy cardiometabolic profile! Continue regular aerobic exercise and balanced Mediterranean-style nutrition.")
        recommendations.append("Schedule routine annual screenings to keep cholesterol and fasting glucose parameters within optimal targets.")
    elif len(recommendations) < 3:
        recommendations.append("Maintain regular hydration and ensure 7-8 hours of quality sleep per night to support metabolic resilience.")

    # Deduplicate while preserving order
    seen = set()
    unique_recs = []
    for rec in recommendations:
        if rec not in seen:
            seen.add(rec)
            unique_recs.append(rec)

    return PredictionResponse(
        probability=prob_percent,
        prediction_class=prediction_class,
        risk_tier=risk_info["tier"], # type: ignore
        color_code=risk_info["color"], # type: ignore
        top_risk_factors=top_factors[:5],
        recommendations=unique_recs[:5]
    )
