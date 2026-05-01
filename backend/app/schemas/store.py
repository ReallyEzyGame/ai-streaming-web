# app/schemas/chat.py
from pydantic import BaseModel, Field

class ChatMessageRequest(BaseModel):
    uid: str = Field(..., description="User ID from Firebase Auth") 
    conversation_id: str = Field(..., description="Convresation's ID ")
    content: str = Field(..., description="User's text")
    role: str = Field(..., description="User or Assistant")
    
class ChatMessageResponse(BaseModel):
    status: str
    message: str
    user_msg_id: str = None

class NewConversationRequest(BaseModel):
    uid: str = Field(...)
    title: str = Field(...)

class NewConversationResponse(BaseModel):
    conversation_id: str