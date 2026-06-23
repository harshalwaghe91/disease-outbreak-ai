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


def _clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def _clinical_severity(payload: dict) -> float:
    """Return a transparent 0-1 severity signal from the submitted measurements."""
    temperature = _clamp((payload["temperature"] - 37.2) / 3.0)
    low_oxygen = _clamp((96.0 - payload["oxygen_saturation"]) / 10.0)
    inflammation = _clamp(payload["crp"] / 100.0)
    esr = _clamp(payload["esr"] / 100.0)
    abnormal_wbc = _clamp(abs(payload["wbc_count"] - 7.5) / 12.0)
    low_platelets = _clamp((180.0 - payload["platelet_count"]) / 150.0)
    abnormal_sugar = _clamp(max(0.0, abs(payload["blood_sugar"] - 105.0) - 30.0) / 180.0)
    return (
        temperature * 0.20
        + low_oxygen * 0.25
        + inflammation * 0.15
        + esr * 0.10
        + abnormal_wbc * 0.12
        + low_platelets * 0.13
        + abnormal_sugar * 0.05
    )


def _clinically_adjusted_category(payload: dict, model_category: str) -> str:
    symptoms = payload["symptoms"].lower()
    if payload["platelet_count"] < 150 and any(term in symptoms for term in ("fever", "rash", "joint", "headache")):
        return "Dengue-like Illness"
    if payload["oxygen_saturation"] < 94 or any(term in symptoms for term in ("breathing", "shortness of breath", "chest congestion")):
        return "Respiratory Disease"
    if payload["wbc_count"] > 12 or payload["crp"] > 35:
        return "Bacterial Infection"
    if "fever" in symptoms and any(term in symptoms for term in ("cough", "sore throat", "body ache")):
        return "Flu-like Illness"
    return model_category


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
    model_disease = str(disease_model.predict(frame)[0])
    model_risk = str(risk_model.predict(frame)[0])
    confidence = float(max(disease_model.predict_proba(frame)[0]))
    severity = _clinical_severity(payload)
    model_risk_adjustment = {"Low": 0.00, "Medium": 0.10, "High": 0.20}[model_risk]
    probability = _clamp(0.08 + severity * 0.78 + confidence * 0.08 + model_risk_adjustment, 0.03, 0.97)
    risk = "High" if probability >= 0.68 else "Medium" if probability >= 0.38 else "Low"
    disease = _clinically_adjusted_category(payload, model_disease)
    return {
        "risk_level": risk,
        "disease_category": disease,
        "outbreak_probability": round(probability * 100, 2),
        "recommendation": RECOMMENDATIONS[risk],
        "disclaimer": DISCLAIMER,
    }
