import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { LANGUAGE_FLAGS } from "@/types"
import type { Language } from "@/types"

interface LeaderboardEntry {
  rank: number; user_id: string; display_name: string
  avatar_url?: string | null; xp: number; level_rank: string; languages?: Language[]
}

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const { rank, display_name, avatar_url, xp, level_rank, languages } = entry
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null
  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-2xl transition-colors", rank <= 3 ? "bg-amber-50 border border-amber-100" : "hover:bg-gray-50")}>
      <div className="w-8 text-center">
        {medal ? <span className="text-2xl">{medal}</span> : <span className="text-sm font-bold text-gray-400">#{rank}</span>}
      </div>
      <Avatar className="h-10 w-10">
        {avatar_url && <AvatarImage src={avatar_url} />}
        <AvatarFallback>{display_name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{display_name || "Anonymous"}</p>
        <p className="text-xs text-gray-400">{level_rank}</p>
      </div>
      {(languages?.length ?? 0) > 0 && <div className="flex gap-1">{(languages || []).map(l => <span key={l} className="text-lg">{LANGUAGE_FLAGS[l]}</span>)}</div>}
      <div className="text-right">
        <p className="font-bold text-emerald-600">{xp.toLocaleString()}</p>
        <p className="text-xs text-gray-400">XP</p>
      </div>
    </div>
  )
}
