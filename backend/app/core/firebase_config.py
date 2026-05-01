import os
import firebase_admin
from firebase_admin import credentials, firestore

#
def init_firebase_admin():
    if not firebase_admin._apps:
        cred_path = os.getenv('FIREBASE_CREDENTIALS', './firebase/firebase_admin_sdk.json')
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print('Firebase admin initialized')
# 
def get_firestore_client():
    """Remember to init the firebase admin before using"""
    return firestore.client()