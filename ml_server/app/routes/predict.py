from fastapi import APIRouter
from pydantic import BaseModel
from app.services.predictor import run_prediction

router = APIRouter()

class PatientData(BaseModel):
    age: float
    height: float
    weight: float
    gender: int
    ap_hi: float
    ap_lo: float
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

@router.post("/predict")
def predict(data: PatientData):
    result = run_prediction(data.dict())
    return result