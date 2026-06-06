import { AIChat } from "@/components/ai/AIChat"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { XPBar } from "@/components/gamification/XPBar"
import { ProfileConsumer } from "@/components/providers/ProfileConsumer"

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ProfileConsumer>
        {(profile) => (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900">
                  Salaam, {profile?.display_name?.split(" ")[0] || "Learner"}! 👋
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Ready to learn today?</p>
              </div>
              <StreakCounter count={profile?.streak_count || 0} compact />
            </div>
            {profile && (
              <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
                <XPBar xp={profile.xp || 0} />
              </div>
            )}
          </>
        )}
      </ProfileConsumer>
      <AIChat />
    </div>
  )
}
