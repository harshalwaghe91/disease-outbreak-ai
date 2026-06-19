from fastapi import APIRouter

from app.schemas import ChatRequest, ChatResponse
from app.services.chatbot import create_chat_response

router = APIRouter(tags=["Consultation"])


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    return create_chat_response(payload.message)

