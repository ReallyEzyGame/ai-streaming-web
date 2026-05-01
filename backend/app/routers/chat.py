import os
from dotenv import load_dotenv
import requests # using ollama for localhost only, the later development will be replace with other librayr
from fastapi import APIRouter
from app.schemas.chat import TextMessageRequest

load_dotenv()


router = APIRouter(prefix='/api/chat', tags=['chat'])
# for running on localhost
OLLAMA_URL = os.getenv('OLLAMA_URL')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL')


@router.post("/")
def chat(receive: TextMessageRequest):

    payload = {
        'model': OLLAMA_MODEL,
        'prompt': receive.message,
        'stream': False
    }
    
    reply = requests.post(OLLAMA_URL, json=payload)
    
    return reply.json().get('response')