import { createClient } from "@/lib/supabase/server"
import { LeaderboardRow } from "@/components/gamification/LeaderboardRow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export default async function CompetePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("user_id, display_name, avatar_url, xp, rank, learning_languages")
    .order("xp", { ascending: false })
    .limit(50)

  const leaderboard = (topUsers || []).map((u, i) => ({
    rank: i + 1,
    user_id: u.user_id,
    display_name: u.display_name || "Anonymous",
    avatar_url: u.avatar_url,
    xp: u.xp || 0,
    level_rank: u.rank || "Explorer",
    languages: u.learning_languages || [],
  }))

  const myRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-md shadow-amber-100">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Compete</h1>
          <p className="text-gray-500 text-sm">{myRank > 0 ? `You're ranked #${myRank} globally` : "Start learning to get ranked!"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🌍 Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          {leaderboard.length > 0 ? (
            <div className="space-y-1">
              {leaderboard.map(entry => <LeaderboardRow key={entry.user_id} entry={entry} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl block mb-3">🏆</span>
              <p>No learners yet — be the first on the leaderboard!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
