from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_URL
from app.database import initialize_database
from app.routers import chat, insights, prediction


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="OutbreakAI API",
    description="Laboratory-data disease outbreak prediction and general consultation API",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(allowed_origins)),
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router)
app.include_router(chat.router)
app.include_router(insights.router)


@app.get("/")
def root():
    return {"name": "OutbreakAI API", "status": "healthy", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
