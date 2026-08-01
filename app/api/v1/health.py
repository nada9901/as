from fastapi import APIRouter
from app.ml.model_loader import load_model_artifact

router = APIRouter(tags=["Health"])

@router.get("/health", summary="Health Check Endpoint")
def get_health_status():
    loader = load_model_artifact()
    return {
        "status": "healthy",
        "model_loaded": loader.loaded,
        "model_version": loader.model_metadata.get("version", "1.0.0-XGBoost-Trained"),
        "threshold": 0.10
    }
