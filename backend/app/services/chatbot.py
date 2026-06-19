from datetime import datetime, timezone

DISCLAIMER = "This chatbot provides general information only and is not a medical diagnosis. Consult a qualified healthcare professional."

EMERGENCY_TERMS = {
    "chest pain", "breathing difficulty", "difficulty breathing", "can't breathe",
    "cannot breathe", "unconscious", "unconsciousness", "seizure", "stroke",
    "face drooping", "slurred speech", "sudden weakness",
}


def create_chat_response(message: str) -> dict:
    text = message.lower().strip()
    emergency = any(term in text for term in EMERGENCY_TERMS)
    if emergency:
        response = (
            "This may be a medical emergency. Call your local emergency number or go to the "
            "nearest emergency department now. Do not drive yourself. If available, ask someone "
            "to stay with you while help arrives."
        )
    elif any(word in text for word in ("fever", "temperature", "chills")):
        response = (
            "Rest, drink fluids, and monitor your temperature. Seek medical advice if fever is high, "
            "lasts more than a few days, or occurs with rash, confusion, dehydration, or breathing problems."
        )
    elif any(word in text for word in ("cough", "cold", "sore throat", "flu")):
        response = (
            "Hydration, rest, warm fluids, and avoiding smoke may help mild respiratory symptoms. "
            "Consider testing when an infection is circulating locally, and seek care if symptoms worsen."
        )
    elif any(word in text for word in ("headache", "migraine")):
        response = (
            "Rest in a quiet room, hydrate, and note possible triggers. A sudden severe headache, "
            "head injury, stiff neck, weakness, or confusion needs urgent medical assessment."
        )
    elif any(word in text for word in ("stomach", "vomit", "diarrhea", "nausea")):
        response = (
            "Take small, frequent sips of oral rehydration fluid and choose light foods as tolerated. "
            "Seek care for blood, severe pain, persistent vomiting, or signs of dehydration."
        )
    elif any(word in text for word in ("dengue", "rash", "joint pain")):
        response = (
            "Dengue-like symptoms require clinical evaluation and often a blood test. Hydrate and "
            "avoid self-medicating with aspirin or ibuprofen until a clinician rules out bleeding risk."
        )
    elif any(word in text for word in ("hello", "hi", "hey")):
        response = "Hello! Tell me your general health concern or symptoms, and I can share safe next-step guidance."
    else:
        response = (
            "I can offer general guidance about common symptoms, prevention, and when to seek care. "
            "Please describe the symptom, how long it has lasted, and whether it is getting worse."
        )
    return {
        "response": response,
        "emergency": emergency,
        "disclaimer": DISCLAIMER,
        "timestamp": datetime.now(timezone.utc),
    }

