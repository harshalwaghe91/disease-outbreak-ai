from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    age: int = Field(ge=0, le=120)
    gender: Literal["Male", "Female", "Other"]
    location: str = Field(min_length=2, max_length=100)
    symptoms: str = Field(min_length=2, max_length=500)
    wbc_count: float = Field(ge=0, le=100)
    rbc_count: float = Field(ge=0, le=10)
    platelet_count: float = Field(ge=0, le=1000)
    hemoglobin: float = Field(ge=0, le=25)
    crp: float = Field(ge=0, le=500)
    esr: float = Field(ge=0, le=200)
    temperature: float = Field(ge=30, le=45)
    oxygen_saturation: float = Field(ge=50, le=100)
    blood_sugar: float = Field(ge=20, le=800)


class PredictionResponse(BaseModel):
    id: int
    risk_level: str
    disease_category: str
    outbreak_probability: float
    recommendation: str
    disclaimer: str
    created_at: datetime


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    response: str
    emergency: bool
    disclaimer: str
    timestamp: datetime

