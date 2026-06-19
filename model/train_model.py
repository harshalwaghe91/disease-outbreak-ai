from datetime import datetime, timezone
from pathlib import Path

import joblib
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from generate_dataset import OUTPUT_PATH, generate_dataset

MODEL_PATH = Path(__file__).with_name("outbreak_model.pkl")
TARGETS = ["disease_category", "risk_level"]
CATEGORICAL = ["gender", "location"]
TEXT = "symptoms"
NUMERIC = [
    "age", "wbc_count", "rbc_count", "platelet_count", "hemoglobin",
    "crp", "esr", "temperature", "oxygen_saturation", "blood_sugar",
]


def build_pipeline() -> Pipeline:
    preprocessing = ColumnTransformer([
        ("numeric", StandardScaler(), NUMERIC),
        ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ("symptoms", TfidfVectorizer(max_features=80, ngram_range=(1, 2)), TEXT),
    ])
    return Pipeline([
        ("preprocessing", preprocessing),
        ("classifier", RandomForestClassifier(n_estimators=220, random_state=42, class_weight="balanced", n_jobs=-1)),
    ])


def score(model, features, target) -> dict:
    predicted = model.predict(features)
    precision, recall, f1, _ = precision_recall_fscore_support(
        target, predicted, average="weighted", zero_division=0
    )
    return {
        "accuracy": round(accuracy_score(target, predicted), 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
    }


def train() -> dict:
    data = generate_dataset()
    data.to_csv(OUTPUT_PATH, index=False)
    features = data.drop(columns=TARGETS)
    train_x, test_x, train_y, test_y = train_test_split(
        features, data[TARGETS], test_size=0.2, random_state=42, stratify=data["disease_category"]
    )
    disease_model = build_pipeline().fit(train_x, train_y["disease_category"])
    risk_model = build_pipeline().fit(train_x, train_y["risk_level"])
    metrics = {
        "disease": score(disease_model, test_x, test_y["disease_category"]),
        "risk": score(risk_model, test_x, test_y["risk_level"]),
    }
    bundle = {
        "disease_model": disease_model,
        "risk_model": risk_model,
        "metrics": metrics,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_rows": len(data),
    }
    joblib.dump(bundle, MODEL_PATH)
    return metrics


if __name__ == "__main__":
    results = train()
    print(f"Model saved to {MODEL_PATH}")
    for target, values in results.items():
        print(target, values)

