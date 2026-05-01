import { create } from 'zustand'
import { generate_str } from '../api/be/apiLlm'
import { useUserInfo } from './useUserInfo'
import { serverTimestamp } from 'firebase/firestore'


export const useChatStore = create((set) => ({
    messages: [],
    isLoading: false,

    sendMessage: async (userText) => {
        // update user text
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: userText }],
            isLoading: true
        }))

        const aiRes = await generate_str(userText)
        console.log('in useChatStore: ', aiRes)
        const aiMsg = {
            role: 'assistant',
            content: aiRes,
            timestamp: serverTimestamp()
        }
        // update client text
        set((state) => ({
            messages: [...state.messages, aiMsg],
            isLoading: false
        }))

        return aiMsg
    },
}))