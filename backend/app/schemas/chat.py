# app/schemas/chat.py
from pydantic import BaseModel

class TextMessageRequest(BaseModel):
    message: str
    
class TextMessageResponse(BaseModel):
    message: str