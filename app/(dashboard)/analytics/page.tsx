import { createClient } from "@/lib/supabase/server"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XPBar } from "@/components/gamification/XPBar"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { BadgeGrid } from "@/components/gamification/BadgeGrid"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: userBadges }, { data: lessonCount }, { data: recentXP }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
    supabase.from("user_badges").select("*, badges(*)").eq("user_id", user!.id),
    supabase.from("user_progress").select("lesson_id", { count: "exact" }).eq("user_id", user!.id),
    supabase.from("xp_transactions").select("amount, source, created_at").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10),
  ])

  const stats = [
    { label: "Total XP", value: (profile?.xp || 0).toLocaleString(), emoji: "⭐" },
    { label: "Day Streak", value: profile?.streak_count || 0, emoji: "🔥" },
    { label: "Lessons Done", value: lessonCount?.length || 0, emoji: "📚" },
    { label: "Badges Earned", value: userBadges?.length || 0, emoji: "🏅" },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-100">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Your Progress</h1>
          <p className="text-gray-500 text-sm">Track your learning journey</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <span className="text-3xl">{s.emoji}</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {profile && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Rank Progress</CardTitle></CardHeader>
          <CardContent>
            <XPBar xp={profile.xp || 0} />
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent>
          <BadgeGrid userBadges={userBadges || []} />
        </CardContent>
      </Card>

      {recentXP && recentXP.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentXP.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{tx.source.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold text-emerald-600">+{tx.amount} XP</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
