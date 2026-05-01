from fastapi import APIRouter, Depends, HTTPException
from google.cloud.firestore import SERVER_TIMESTAMP, Client
from app.schemas.store import ChatMessageRequest, ChatMessageResponse, NewConversationRequest, NewConversationResponse
from app.dependencies.store import get_db

router = APIRouter(
    prefix='/api/store',
    tags=['Store']
)
#
@router.post('/new', response_model=NewConversationResponse)
async def create_new_conversation(request: NewConversationRequest, db: Client = Depends(get_db)):
    try:
        con_ref = db.collection('users').document(request.uid).collection('conversations')
        
        _, doc_ref = con_ref.add({
            'title': request.title,
            'lastUpdated': SERVER_TIMESTAMP
        })
        
        return NewConversationResponse(conversation_id=doc_ref.id)
    except Exception as e:
        print(f'Error creating conversation: {e}')
        raise HTTPException(status_code=500, detail='Unable to create conversation')
#
@router.post('/', response_model=ChatMessageResponse)
async def send_message_to_firestore(request: ChatMessageRequest, db: Client = Depends(get_db)):
    try:
        message_ref = db.collection('users').document(request.uid) \
                        .collection('conversations').document(request.conversation_id) \
                        .collection('messages')

        user_message_data = {
            'role': request.role,
            'content': request.content,
            'timestamp': SERVER_TIMESTAMP 
        }
    
        _, doc_ref = message_ref.add(user_message_data)
    
        conv_ref = db.collection('users').document(request.uid) \
                     .collection('conversations').document(request.conversation_id)
        
        conv_ref.set({'lastUpdated': SERVER_TIMESTAMP}, merge=True)
    
        return ChatMessageResponse(
            status="success",
            message="Message has been saved to firestore",
            user_msg_id=doc_ref.id
        )
    except Exception as e:
        print(f'Error saving to firestore: {e}')
        raise HTTPException(status_code=500, detail=f'Internal error: {str(e)}')