from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.ml.model_loader import load_model_artifact
from app.api.v1 import health, auth, predict, admin, user
from app.models.all_models import Base
from app.database.session import engine

# Automatically create tables for SQLite/dev environment
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HealthGluco API",
    description="Production-ready healthcare SaaS platform for XGBoost-powered diabetes risk prediction, longitudinal tracking, and clinical recommendations",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_v1_router = APIRouter(prefix=settings.API_V1_STR)
api_v1_router.include_router(health.router)
api_v1_router.include_router(auth.router)
api_v1_router.include_router(predict.router)
api_v1_router.include_router(admin.router)
api_v1_router.include_router(user.router)

app.include_router(api_v1_router)

@app.on_event("startup")
async def startup_event():
    loader = load_model_artifact()
    print(f"=============================================================")
    print(f"🏥 HealthGluco Python FastAPI Backend Started (v{settings.VERSION})")
    print(f"🧠 ML Artifact Status: {'LOADED (0.10 Threshold)' if loader.loaded else 'FALLBACK'}")
    print(f"📜 Swagger Docs URL   : {settings.API_V1_STR}/docs")
    print(f"=============================================================")

@app.get("/", tags=["Root"])
def read_root():
    return {
        "name": "HealthGluco API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
