import { create } from 'zustand'
import type { AIMessage, TutorMode, Language, Level } from '@/types'

interface ChatState {
  messages: AIMessage[]
  sessionId: string | null
  mode: TutorMode
  nativeLanguage: Language
  learningLanguage: Language
  level: Level
  isLoading: boolean
  addMessage: (message: AIMessage) => void
  appendToLastMessage: (text: string) => void
  setMode: (mode: TutorMode) => void
  setLanguages: (native: Language, learning: Language) => void
  setLevel: (level: Level) => void
  setSessionId: (id: string) => void
  setLoading: (loading: boolean) => void
  clearChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  mode: 'conversation',
  nativeLanguage: 'somali',
  learningLanguage: 'english',
  level: 'beginner',
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  appendToLastMessage: (text) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content: last.content + text }
      }
      return { messages }
    }),
  setMode: (mode) => set({ mode, messages: [] }),
  setLanguages: (nativeLanguage, learningLanguage) => set({ nativeLanguage, learningLanguage }),
  setLevel: (level) => set({ level }),
  setSessionId: (sessionId) => set({ sessionId }),
  setLoading: (isLoading) => set({ isLoading }),
  clearChat: () => set({ messages: [], sessionId: null }),
}))
