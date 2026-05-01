import { create } from 'zustand'
import {
    getConversationFromFireStore,
    getConversationListFromFireStore,
    subscribeToMessage,
    createConversationInFireStore,
    saveMessageToFireStore
} from '../api/be/messageService'
import { serverTimestamp } from 'firebase/firestore'
/**
* - messages: contain a list of header, header: { uid, title }  
* - email: user email  
* - name: user name  
* - isLoggedIn: boolean flag to determine if the user have logged in or not  
* - currentConversation: full conversation: { index, title, list of messages}  
* message: { index, role, content }  
*/
export const useUserInfo = create((set, get) => ({
    uid: null,
    isLoggedIn: false,
    userEmail: null,
    userName: null,
    currentConversation: {},           // full conversation
    currentConversationIdx: null,
    conversations: [],            // conversation list
    isLoading: false,
    isAuthChecking: true,

    setUser: (user) => set({
        uid: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        isLoggedIn: true,
        isAuthChecking: false
    }),
    setAuthChecking: (val) => set({ isAuthChecking: val}),
    fetchCoversations: async () => {
        const { uid } = get()
        if (!uid)
            return

        set({ isLoading: true })
        const list = await getConversationListFromFireStore(uid)
        set({
            conversations: list,
            isLoading: false
        })
    },
    setConversation: async (convId) => {
        const { uid } = get()
        set({ isLoading: true })

        try {
            const detail = await getConversationFromFireStore(uid, convId)
            set({ currentConversation: detail, currentConversationIdx: convId, isLoading: false })
        } catch (error) {
            console.error("Failed to load chat: ", error)
            set({ isLoading: false })
        }
    },
    appendMessage: async (message) => {
        const { uid, currentConversationIdx } = get();

        set((state) => ({
            currentConversation: {
                ...state.currentConversation,
                messages: [...(state.currentConversation?.messages || []), message]
            }
        }));

        if (uid && currentConversationIdx) {
            await saveMessageToFireStore(uid, currentConversationIdx, message);
        }
    },
    makeNewConversation: async (text) => {
        const { uid, fetchCoversations } = get();
        if (!uid) return;

        set({ isLoading: true });
        try {
            // 1. Lưu lên Firestore và lấy ID thật
            const newConvId = await createConversationInFireStore(uid, text);

            // 2. Cập nhật state local với ID mới
            const newConv = { id: newConvId, title: text };
            set((state) => ({
                conversations: [newConv, ...state.conversations],
                currentConversationIdx: newConvId, // Sử dụng ID từ Firestore thay vì length
            }));

            // 3. Tải nội dung hội thoại mới (để khởi tạo mảng messages trống)
            await get().setConversation(newConvId);
        } catch (error) {
            console.error("Failed to create conversation:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    listenToMessages: (convId) => {
        const { uid } = get()
        if (!uid)
            return

        return subscribeToMessage(uid, convId, (messages) => {
            set((state) => ({
                currentConversation: { ...state.currentConversation, messages }
            }))
        })
    },
    setEmpty: () => set({
        uid: null,
        isLoggedIn: false,
        userName: null,
        userEmail: null,
        currentConversation: [],
        currentConversationIdx: null,
        messages: [],
        isAuthChecking: false
    }),
    startNewChat: () => set({
        currentConversation: { messages: [] },
        currentConversationIdx: null
    }),
}))