from pathlib import Path

import numpy as np
import pandas as pd

OUTPUT_PATH = Path(__file__).with_name("synthetic_lab_data.csv")
DISEASES = [
    "Viral Infection", "Bacterial Infection", "Respiratory Disease",
    "Dengue-like Illness", "Flu-like Illness",
]
SYMPTOMS = {
    "Viral Infection": "fever fatigue body ache",
    "Bacterial Infection": "high fever chills localized pain",
    "Respiratory Disease": "cough breathing difficulty chest congestion",
    "Dengue-like Illness": "high fever rash joint pain headache",
    "Flu-like Illness": "fever cough sore throat body ache",
}


def generate_dataset(rows: int = 5000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    disease = rng.choice(DISEASES, rows)
    age = rng.integers(1, 91, rows)
    location = rng.choice(["Urban North", "Urban South", "Rural East", "Rural West", "Coastal"], rows)
    temperature = rng.normal(37.8, 1.0, rows)
    oxygen = rng.normal(96, 2.3, rows)
    wbc = rng.normal(8.5, 3.1, rows)
    platelets = rng.normal(240, 75, rows)
    crp = np.abs(rng.normal(16, 20, rows))
    esr = np.abs(rng.normal(25, 18, rows))

    bacterial = disease == "Bacterial Infection"
    respiratory = disease == "Respiratory Disease"
    dengue = disease == "Dengue-like Illness"
    flu = disease == "Flu-like Illness"
    wbc[bacterial] += rng.normal(6, 1.8, bacterial.sum())
    crp[bacterial] += rng.normal(45, 15, bacterial.sum())
    oxygen[respiratory] -= rng.normal(5, 2, respiratory.sum())
    platelets[dengue] -= rng.normal(125, 35, dengue.sum())
    temperature[dengue | flu] += rng.normal(0.7, 0.3, (dengue | flu).sum())

    severity = (
        (temperature > 39).astype(int) + (oxygen < 93).astype(int)
        + (crp > 55).astype(int) + (platelets < 110).astype(int)
        + (wbc > 15).astype(int)
    )
    risk = np.where(severity >= 3, "High", np.where(severity >= 1, "Medium", "Low"))
    frame = pd.DataFrame({
        "age": age,
        "gender": rng.choice(["Male", "Female", "Other"], rows, p=[0.48, 0.48, 0.04]),
        "location": location,
        "symptoms": [SYMPTOMS[item] for item in disease],
        "wbc_count": np.clip(wbc, 1, 35).round(2),
        "rbc_count": np.clip(rng.normal(4.7, 0.65, rows), 2, 7).round(2),
        "platelet_count": np.clip(platelets, 30, 600).round(2),
        "hemoglobin": np.clip(rng.normal(13.5, 1.8, rows), 6, 20).round(2),
        "crp": np.clip(crp, 0, 250).round(2),
        "esr": np.clip(esr, 0, 150).round(2),
        "temperature": np.clip(temperature, 35, 42).round(2),
        "oxygen_saturation": np.clip(oxygen, 75, 100).round(2),
        "blood_sugar": np.clip(rng.normal(115, 38, rows), 45, 350).round(2),
        "disease_category": disease,
        "risk_level": risk,
    })
    return frame


if __name__ == "__main__":
    data = generate_dataset()
    data.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(data)} rows to {OUTPUT_PATH}")

