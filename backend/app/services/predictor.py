from functools import lru_cache

import joblib
import pandas as pd

from app.config import MODEL_PATH

DISCLAIMER = "AI-generated risk estimate only; it does not replace diagnosis or advice from a licensed clinician."

RECOMMENDATIONS = {
    "Low": "Continue routine hygiene, hydration, and symptom monitoring. Seek care if symptoms persist or worsen.",
    "Medium": "Arrange a clinical consultation, limit close contact, and repeat relevant laboratory tests as advised.",
    "High": "Seek prompt medical assessment, follow infection-control precautions, and contact local health services if cases are clustering.",
}


@lru_cache(maxsize=1)
def load_model_bundle() -> dict:
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Run `python model/train_model.py` from the project root."
        )
    return joblib.load(MODEL_PATH)


def predict_outbreak(payload: dict) -> dict:
    bundle = load_model_bundle()
    frame = pd.DataFrame([payload])
    disease_model = bundle["disease_model"]
    risk_model = bundle["risk_model"]
    disease = str(disease_model.predict(frame)[0])
    risk = str(risk_model.predict(frame)[0])
    confidence = float(max(disease_model.predict_proba(frame)[0]))
    risk_midpoint = {"Low": 0.22, "Medium": 0.55, "High": 0.82}[risk]
    probability = min(0.99, max(0.01, risk_midpoint + (confidence - 0.5) * 0.2))
    return {
        "risk_level": risk,
        "disease_category": disease,
        "outbreak_probability": round(probability * 100, 2),
        "recommendation": RECOMMENDATIONS[risk],
        "disclaimer": DISCLAIMER,
    }
