import Link from "next/link"
import { Check, X, Zap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const FREE_FEATURES = [
  { text: "10 AI conversations per day", included: true },
  { text: "Conversation practice mode", included: true },
  { text: "Join communities", included: true },
  { text: "Daily streaks & XP", included: true },
  { text: "Basic leaderboard", included: true },
  { text: "Unlimited AI messages", included: false },
  { text: "All 5 AI tutor modes", included: false },
  { text: "Create communities", included: false },
  { text: "Competitions & challenges", included: false },
  { text: "Priority support", included: false },
]

const PRO_FEATURES = [
  { text: "Unlimited AI conversations", included: true },
  { text: "All 5 AI tutor modes", included: true },
  { text: "Create & manage communities", included: true },
  { text: "Daily streaks & XP", included: true },
  { text: "Full leaderboard & ranking", included: true },
  { text: "Competitions & challenges", included: true },
  { text: "Vocabulary & grammar modes", included: true },
  { text: "Translation with breakdown", included: true },
  { text: "Quiz mode", included: true },
  { text: "Priority support", included: true },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Nav */}
      <div className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" /> Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Choose your plan
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-gray-900">$0</span>
                <span className="text-gray-400 mb-2">/month</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Perfect for getting started</p>
            </div>

            <Button asChild variant="outline" className="w-full mb-8" size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>

            <div className="space-y-3">
              {FREE_FEATURES.map(({ text, included }) => (
                <div key={text} className="flex items-center gap-3">
                  {included ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                  <span className={`text-sm ${included ? "text-gray-700" : "text-gray-400"}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro */}
          <div className="bg-emerald-500 rounded-3xl border-2 border-emerald-500 p-8 shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wide mb-2">Pro</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white">$4.99</span>
                <span className="text-emerald-200 mb-2">/month</span>
              </div>
              <p className="text-emerald-100 text-sm mt-2">Everything you need to become fluent</p>
            </div>

            <Button variant="white" className="w-full mb-8" size="lg" disabled>
              Coming Soon 🔜
            </Button>

            <div className="space-y-3">
              {PRO_FEATURES.map(({ text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-sm mt-10">
          Pro payments coming soon via PayPal. All current users get full access free during beta. 🎉
        </p>
      </div>
    </div>
  )
}
