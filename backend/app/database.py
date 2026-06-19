import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

from app.config import DATABASE_PATH


@contextmanager
def get_connection():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                age INTEGER NOT NULL,
                gender TEXT NOT NULL,
                location TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                lab_data TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                disease_category TEXT NOT NULL,
                outbreak_probability REAL NOT NULL,
                recommendation TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


def save_prediction(payload: dict, result: dict) -> dict:
    created_at = datetime.now(timezone.utc).isoformat()
    lab_fields = {
        key: value
        for key, value in payload.items()
        if key not in {"age", "gender", "location", "symptoms"}
    }
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO predictions (
                age, gender, location, symptoms, lab_data, risk_level,
                disease_category, outbreak_probability, recommendation, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["age"], payload["gender"], payload["location"],
                payload["symptoms"], json.dumps(lab_fields), result["risk_level"],
                result["disease_category"], result["outbreak_probability"],
                result["recommendation"], created_at,
            ),
        )
        prediction_id = cursor.lastrowid
    return {"id": prediction_id, "created_at": created_at, **result}


def list_predictions(limit: int = 100) -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """SELECT id, age, gender, location, symptoms, risk_level,
                      disease_category, outbreak_probability, recommendation, created_at
               FROM predictions ORDER BY id DESC LIMIT ?""",
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]


def dashboard_summary() -> dict:
    with get_connection() as connection:
        total = connection.execute("SELECT COUNT(*) FROM predictions").fetchone()[0]
        high_risk = connection.execute(
            "SELECT COUNT(*) FROM predictions WHERE risk_level = 'High'"
        ).fetchone()[0]
        average = connection.execute(
            "SELECT COALESCE(AVG(outbreak_probability), 0) FROM predictions"
        ).fetchone()[0]
        locations = connection.execute(
            "SELECT COUNT(DISTINCT location) FROM predictions"
        ).fetchone()[0]
    return {
        "total_predictions": total,
        "high_risk_cases": high_risk,
        "average_probability": round(average, 2),
        "locations_monitored": locations,
    }


def analytics_summary() -> dict:
    with get_connection() as connection:
        risk_rows = connection.execute(
            "SELECT risk_level AS name, COUNT(*) AS value FROM predictions GROUP BY risk_level"
        ).fetchall()
        disease_rows = connection.execute(
            """SELECT disease_category AS name, COUNT(*) AS cases
               FROM predictions GROUP BY disease_category ORDER BY cases DESC"""
        ).fetchall()
        trend_rows = connection.execute(
            """SELECT substr(created_at, 1, 10) AS date, COUNT(*) AS predictions,
                      ROUND(AVG(outbreak_probability), 2) AS probability
               FROM predictions GROUP BY date ORDER BY date LIMIT 30"""
        ).fetchall()
    return {
        "risk_distribution": [dict(row) for row in risk_rows],
        "disease_distribution": [dict(row) for row in disease_rows],
        "daily_trend": [dict(row) for row in trend_rows],
    }

