"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Badge, UserBadge } from "@/types"

const BADGES: Badge[] = [
  { id: "first-lesson", name: "First Step", description: "Complete your first lesson", icon: "🎯", criteria_json: {} },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", criteria_json: {} },
  { id: "streak-30", name: "Month Master", description: "Maintain a 30-day streak", icon: "⚡", criteria_json: {} },
  { id: "xp-500", name: "Learner", description: "Earn 500 XP", icon: "📚", criteria_json: {} },
  { id: "xp-2000", name: "Scholar", description: "Earn 2000 XP", icon: "🎓", criteria_json: {} },
  { id: "vocab-50", name: "Word Collector", description: "Learn 50 words", icon: "📖", criteria_json: {} },
  { id: "community", name: "Community Member", description: "Join a community", icon: "👥", criteria_json: {} },
  { id: "champion", name: "Champion", description: "Win a challenge", icon: "🏆", criteria_json: {} },
]

export function BadgeGrid({ userBadges = [] }: { userBadges?: UserBadge[] }) {
  const [selected, setSelected] = useState<Badge | null>(null)
  const earnedIds = new Set(userBadges.map(ub => ub.badge_id))
  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {BADGES.map(badge => {
          const earned = earnedIds.has(badge.id)
          return (
            <button key={badge.id} onClick={() => setSelected(badge)}
              className={cn("flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all",
                earned ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400" : "border-gray-100 bg-gray-50 opacity-50 hover:opacity-70")}>
              <span className={cn("text-3xl", !earned && "grayscale")}>{badge.icon}</span>
              <span className="text-xs font-medium text-center text-gray-600 leading-tight">{badge.name}</span>
            </button>
          )
        })}
      </div>
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{selected?.icon}</span>{selected?.name}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{selected?.description}</p>
          {selected && (earnedIds.has(selected.id)
            ? <p className="text-sm text-emerald-600 font-medium">✅ Earned!</p>
            : <p className="text-sm text-amber-600 font-medium">🔒 Not yet earned — keep learning!</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
