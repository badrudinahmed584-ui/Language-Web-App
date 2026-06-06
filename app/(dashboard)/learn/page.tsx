import { AIChat } from "@/components/ai/AIChat"
import { createClient } from "@/lib/supabase/server"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { XPBar } from "@/components/gamification/XPBar"

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Salaam, {profile?.display_name?.split(" ")[0] || "Learner"}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Ready to learn today?</p>
        </div>
        <div className="flex items-center gap-4">
          <StreakCounter count={profile?.streak_count || 0} compact />
        </div>
      </div>

      {profile && (
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
          <XPBar xp={profile.xp || 0} />
        </div>
      )}

      <AIChat />
    </div>
  )
}
