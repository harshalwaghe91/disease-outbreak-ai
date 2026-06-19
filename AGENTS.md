# Coding Rules

## Architecture
- Keep frontend pages, reusable components, API access, and utilities in separate modules.
- Keep FastAPI routers thin; business logic belongs in services and persistence logic belongs in the database module.
- Use Pydantic schemas for every API request and response.
- Load the trained model once and reuse it across prediction requests.

## Code Quality
- Prefer small, focused functions with descriptive names.
- Add Python type hints and avoid mutable global application state.
- Keep secrets and deployment-specific URLs in environment variables.
- Never commit generated virtual environments, `node_modules`, secrets, or local `.env` files.
- Preserve API response shapes when changing backend implementation details.

## Safety and Data
- The chatbot provides general educational guidance, never a diagnosis or prescription.
- Emergency symptoms must trigger immediate emergency-care guidance.
- Prediction results are decision-support estimates and must display a medical disclaimer.
- Do not store personally identifying information in the demonstration database.

## Verification
- Run backend tests and import checks after backend changes.
- Run the frontend production build after frontend changes.
- Confirm mobile and desktop layouts for UI changes.

