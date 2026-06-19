from fastapi import APIRouter, HTTPException

from app.database import save_prediction
from app.schemas import PredictionInput, PredictionResponse
from app.services.predictor import predict_outbreak

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionInput):
    try:
        input_data = payload.model_dump()
        result = predict_outbreak(input_data)
        return save_prediction(input_data, result)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

