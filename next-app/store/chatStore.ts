import {create} from 'zustand'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Omit<Message, 'timestamp'>) => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: Date.now() }],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
})) 