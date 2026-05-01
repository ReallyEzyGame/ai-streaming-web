from app.core.firebase_config import get_firestore_client


def get_db():
    try:
        db = get_firestore_client()
        yield db
    finally:
        pass