"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChatStore } from "@/lib/store/chatStore"
import type { TutorMode } from "@/types"

const MODES: { value: TutorMode; label: string; emoji: string }[] = [
  { value: "conversation", label: "Chat", emoji: "💬" },
  { value: "vocabulary", label: "Vocab", emoji: "📖" },
  { value: "grammar", label: "Grammar", emoji: "✏️" },
  { value: "translation", label: "Translate", emoji: "🔄" },
  { value: "quiz", label: "Quiz", emoji: "🎯" },
]

export function ModeSelector() {
  const { mode, setMode } = useChatStore()
  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as TutorMode)}>
      <TabsList className="w-full">
        {MODES.map(({ value, label, emoji }) => (
          <TabsTrigger key={value} value={value} className="flex-1 text-xs sm:text-sm">
            <span className="hidden sm:inline mr-1">{emoji}</span>{label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
