import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XPBar } from "@/components/gamification/XPBar"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { BadgeGrid } from "@/components/gamification/BadgeGrid"
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from "@/types"
import type { Language } from "@/types"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: userBadges }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
    supabase.from("user_badges").select("*, badges(*)").eq("user_id", user!.id),
  ])

  const initials = profile?.display_name?.slice(0, 2).toUpperCase() || "??"

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{profile?.display_name || "Learner"}</h1>
              <p className="text-gray-500 text-sm mb-2">{profile?.country || "Earth 🌍"}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">🌱 Native: {profile?.native_language ? LANGUAGE_LABELS[profile.native_language as Language] : "—"}</Badge>
                <Badge variant="default">📚 {profile?.level || "beginner"}</Badge>
                <Badge variant="purple">👑 {profile?.rank || "Explorer"}</Badge>
              </div>
            </div>
          </div>

          {profile?.bio && <p className="mt-4 text-gray-600 text-sm">{profile.bio}</p>}

          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-500 mb-2">Learning</p>
            <div className="flex gap-2">
              {(profile?.learning_languages || []).map((l: Language) => (
                <Badge key={l} variant="outline">{LANGUAGE_FLAGS[l]} {LANGUAGE_LABELS[l]}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-black text-amber-500">{(profile?.xp || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Total XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex justify-center">
            <StreakCounter count={profile?.streak_count || 0} />
          </CardContent>
        </Card>
      </div>

      {profile && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Rank Progress</CardTitle></CardHeader>
          <CardContent><XPBar xp={profile.xp || 0} /></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent><BadgeGrid userBadges={userBadges || []} /></CardContent>
      </Card>
    </div>
  )
}
