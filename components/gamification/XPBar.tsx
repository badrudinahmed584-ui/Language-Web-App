"use client"
import { xpToNextRank, RANK_THRESHOLDS } from "@/types"
import { Progress } from "@/components/ui/progress"

const rankColors: Record<string, string> = {
  Explorer: "text-gray-500", Learner: "text-emerald-600",
  Scholar: "text-blue-600", Master: "text-purple-600", Grandmaster: "text-amber-500",
}
const rankEmoji: Record<string, string> = {
  Explorer: "🌱", Learner: "📚", Scholar: "🎓", Master: "⭐", Grandmaster: "👑",
}

export function XPBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const { current, next, needed, progress } = xpToNextRank(xp)
  if (compact) return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-amber-500">{xp.toLocaleString()} XP</span>
      <span className={`text-xs font-semibold ${rankColors[current]}`}>{rankEmoji[current]} {current}</span>
    </div>
  )
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${rankColors[current]}`}>{rankEmoji[current]} {current}</span>
        {next ? <span className="text-xs text-gray-400">{needed} XP to {next}</span> : <span className="text-xs text-amber-500 font-bold">MAX RANK 👑</span>}
      </div>
      <Progress value={progress} className="h-2.5" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{xp.toLocaleString()} XP</span>
        {next && <span>{RANK_THRESHOLDS[next].toLocaleString()} XP</span>}
      </div>
    </div>
  )
}
