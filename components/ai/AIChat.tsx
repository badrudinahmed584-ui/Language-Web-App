"use client"
import { useRef, useEffect, useState } from "react"
import { Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeSelector } from "./ModeSelector"
import { MessageBubble } from "./MessageBubble"
import { useChatStore } from "@/lib/store/chatStore"
import { useUserStore } from "@/lib/store/userStore"
import { toast } from "@/components/ui/toast"
import { LANGUAGE_LABELS } from "@/types"

const WELCOME_MESSAGES: Record<string, string> = {
  conversation: "Salaam! 👋 I'm AfriQ, your personal language tutor. Let's have a conversation! What would you like to talk about today?",
  vocabulary: "Let's build your vocabulary! 📖 Tell me a topic (family, food, travel, work) and I'll teach you key words with pronunciations and examples.",
  grammar: "Ready to master grammar? ✏️ Ask me about any grammar rule — verb tenses, sentence structure, noun classes — and I'll explain it clearly!",
  translation: "Translation mode is on! 🔄 Type or paste any text and I'll translate it with a word-by-word breakdown and cultural notes.",
  quiz: "Quiz time! 🎯 I'll test your knowledge with questions. Tell me what topic you'd like to be quizzed on, or I'll choose one for you!",
}

export function AIChat() {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const {
    messages, addMessage, appendToLastMessage, mode,
    nativeLanguage, learningLanguage, level, isLoading, setLoading, clearChat,
  } = useChatStore()
  const { profile } = useUserStore()

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({ role: "assistant", content: WELCOME_MESSAGES[mode] })
    }
  }, [mode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    addMessage({ role: "user", content: userMessage })
    addMessage({ role: "assistant", content: "" })
    setLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          nativeLanguage: profile?.native_language || nativeLanguage,
          learningLanguage: profile?.learning_languages?.[0] || learningLanguage,
          level: profile?.level || level,
          mode,
        }),
      })

      if (!response.body) throw new Error("No response body")
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") break
            try {
              const { text } = JSON.parse(data)
              if (text) appendToLastMessage(text)
            } catch {}
          }
        }
      }
    } catch (err) {
      toast.error("Failed to get response. Check your OpenAI API key.")
      appendToLastMessage("Sorry, I encountered an error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const learningLang = profile?.learning_languages?.[0] || learningLanguage
  const nativeLang = profile?.native_language || nativeLanguage

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">AI Language Tutor</h2>
            <p className="text-xs text-gray-400">
              {LANGUAGE_LABELS[nativeLang]} → {LANGUAGE_LABELS[learningLang]} · {profile?.level || level}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat">
            <Trash2 className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        <ModeSelector />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.content === "" && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">A</div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === "translation" ? "Paste text to translate..." : "Type a message..."}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
