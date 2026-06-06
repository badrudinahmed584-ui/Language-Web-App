"use client"
import { cn } from "@/lib/utils"

export function StreakCounter({ count, compact = false }: { count: number; compact?: boolean }) {
  const isActive = count > 0
  if (compact) return (
    <div className="flex items-center gap-1">
      <span className={cn("text-lg", !isActive && "grayscale opacity-50")}>🔥</span>
      <span className={cn("text-sm font-bold", isActive ? "text-orange-500" : "text-gray-400")}>{count}</span>
    </div>
  )
  return (
    <div className={cn("flex flex-col items-center gap-1 rounded-2xl p-4", isActive ? "bg-orange-50" : "bg-gray-50")}>
      <span className={cn("text-4xl", !isActive && "grayscale opacity-40")}>🔥</span>
      <span className={cn("text-2xl font-black", isActive ? "text-orange-500" : "text-gray-300")}>{count}</span>
      <span className="text-xs text-gray-500 font-medium">Day Streak</span>
    </div>
  )
}
