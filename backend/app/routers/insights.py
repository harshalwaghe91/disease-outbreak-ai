from fastapi import APIRouter, Query

from app.database import analytics_summary, dashboard_summary, list_predictions

router = APIRouter(tags=["Insights"])


@router.get("/dashboard")
def dashboard():
    return dashboard_summary()


@router.get("/reports")
def reports(limit: int = Query(default=100, ge=1, le=500)):
    return {"reports": list_predictions(limit)}


@router.get("/analytics")
def analytics():
    return analytics_summary()

