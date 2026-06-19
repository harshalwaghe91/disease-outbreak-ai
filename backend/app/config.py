import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", PROJECT_ROOT / "database" / "outbreak.db"))
MODEL_PATH = Path(os.getenv("MODEL_PATH", PROJECT_ROOT / "model" / "outbreak_model.pkl"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

