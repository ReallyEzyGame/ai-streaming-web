import { db } from '../../firebase/firebase'
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    orderBy,
    query,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore'



const API_STORE_URL = import.meta.env.VITE_API_STORE_URL
/**
 * Retrie conversation from firestore through calling API  
 * retrieveConversation -- call firestore to retrieve data --> conversation of the ith chat  
 * - ith: ith conversation in the conversation list
 * - conversation: { index, title, list of messages}
 * - message: { id, role, content }
 */
export async function getConversationListFromFireStore(uid) {
    if (!uid)
        throw new Error("UID is required")

    const convRef = collection(db, 'users', uid, 'conversations')
    const q = query(convRef, orderBy('lastUpdated', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
/**
 * Retrie list of conversation headers from firestore through calling API  
 * retrieveConversation -- call firestore to retrieve data --> conversation of the ith chat  
 * - ith: ith conversation in the conversation list  
 * - conversation: { index, title, list of headers}  
 * - header: { index, title }  
 */
export async function getConversationFromFireStore(uid, convId) {
    const messageRef = collection(db, 'users', uid, 'conversations', convId, 'messages')
    const q = query(messageRef, orderBy('timestamp', 'asc'))

    const snapshot = await getDocs(q)
    const headerDoc = await getDoc(doc(db, 'users', uid, 'conversations', convId))

    return {
        id: convId,
        title: headerDoc.data()?.title || 'Untitled',
        messages: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
}
export function subscribeToMessage(uid, convId, callback) {
    const messageRef = collection(db, 'users', uid, 'conversations', convId, 'messages')
    const q = query(messageRef, orderBy('timestamp', 'asc'))

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        callback(messages)
    })
}
// Tạo một cuộc hội thoại mới
export const createConversationInFireStore = async (uid, title) => {
    try {
        const response = await fetch(`${API_STORE_URL}/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({uid, title})
        })

        if (!response.ok) throw new Error('FE to BE connection error')
    
        const data = await response.json()
        return data.conversation_id
    } catch (error) {
        console.error('Error creating conversation via BE: ', error)
        throw error
    }
};
// Lưu tin nhắn vào một cuộc hội thoại cụ thể
export const saveMessageToFireStore = async (uid, convId, message) => {
    if (!message.content) {
        console.warn('Message has no content, skipping save:', message)
        return
    }
    try {
        const response = await fetch(`${API_STORE_URL}/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                uid: uid,
                conversation_id: convId,
                role: message.role,
                content: message.content
            })
        })
        if (!response.ok) throw new Error('FE to BE connection error')
        return await response.json()
    } catch (error) {
        console.error("Error saving message:", error);
        throw error
    }
};