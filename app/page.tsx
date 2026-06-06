import Link from "next/link"
import { Zap, Bot, Users, Trophy, MessageCircle, TrendingUp, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

const LANGUAGES = [
  { flag: "🇸🇴", name: "Somali", speakers: "25M+", desc: "Official language of Somalia" },
  { flag: "🇰🇪", name: "Kiswahili", speakers: "200M+", desc: "East Africa's lingua franca" },
  { flag: "🇬🇧", name: "English", speakers: "1.5B+", desc: "Global language of opportunity" },
]

const FEATURES = [
  { icon: Bot, title: "AI Language Tutor", desc: "GPT-4o powered tutor that understands East African culture and context. Practice conversations, grammar, vocabulary, and translation.", color: "bg-emerald-100 text-emerald-600" },
  { icon: Users, title: "Communities", desc: "Join Somali learners, Kiswahili masters, and English clubs. Create study groups and share resources with learners across East Africa.", color: "bg-blue-100 text-blue-600" },
  { icon: Trophy, title: "Competitions", desc: "Compete with other learners and communities. Weekly challenges, global leaderboards, XP races, and monthly tournaments.", color: "bg-amber-100 text-amber-600" },
  { icon: MessageCircle, title: "Real Conversations", desc: "Practice with real humans via private messages and group chats. Find language exchange partners who speak what you're learning.", color: "bg-purple-100 text-purple-600" },
  { icon: TrendingUp, title: "Gamification", desc: "Earn XP, maintain daily streaks, unlock badges, and climb through ranks: Explorer → Learner → Scholar → Master → Grandmaster.", color: "bg-orange-100 text-orange-600" },
  { icon: Globe, title: "For the Diaspora", desc: "Built for Somalis in Kenya, Ethiopia, Somalia, and worldwide. Learn Somali to reconnect with your roots, or Kiswahili to thrive in East Africa.", color: "bg-rose-100 text-rose-600" },
]

const STEPS = [
  { step: "1", title: "Choose your languages", desc: "Pick your native language and what you want to learn — Somali, Kiswahili, or English." },
  { step: "2", title: "Learn with AI", desc: "Chat with your AI tutor, complete lessons, and practice conversations at your own pace." },
  { step: "3", title: "Join the community", desc: "Connect with other learners, join challenges, compete on leaderboards, and make friends." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">AfriQ <span className="text-emerald-500">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/login">Sign In</Link></Button>
            <Button asChild><Link href="/signup">Get Started Free</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            🌍 Built for East Africa & the Somali Diaspora
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Learn <span className="text-emerald-500">Somali</span>,{" "}
            <span className="text-blue-500">Kiswahili</span> &{" "}
            <span className="text-amber-500">English</span>
            <br />powered by AI
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            AfriQ AI is an AI-powered African language learning platform with AI tutoring, real human conversations, communities, and friendly competition. Free forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/signup">Start Learning Free 🚀</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free forever · Available worldwide</p>
        </div>
      </section>

      {/* Languages */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Three Languages. One Platform.</h2>
        <p className="text-center text-gray-500 mb-12">Master the languages of East Africa and the world</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANGUAGES.map(lang => (
            <div key={lang.name} className="bg-white rounded-3xl border-2 border-gray-100 p-8 text-center hover:border-emerald-200 hover:shadow-lg transition-all">
              <span className="text-6xl">{lang.flag}</span>
              <h3 className="text-2xl font-black text-gray-900 mt-4">{lang.name}</h3>
              <p className="text-3xl font-bold text-emerald-500 mt-1">{lang.speakers}</p>
              <p className="text-gray-400 text-sm mt-2">speakers</p>
              <p className="text-gray-600 text-sm mt-3">{lang.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Everything you need to become fluent</h2>
          <p className="text-center text-gray-500 mb-12">Built specifically for East African learners and the diaspora</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-4">How it works</h2>
        <p className="text-center text-gray-500 mb-12">Get started in under 2 minutes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                {step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-500 px-6 py-20 text-center text-white">
        <h2 className="text-4xl font-black mb-4">Ready to start your journey?</h2>
        <p className="text-emerald-100 mb-8 text-lg">Join thousands of learners across East Africa and the diaspora</p>
        <Button asChild variant="white" size="xl">
          <Link href="/signup">Create Your Free Account 🚀</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-black text-xl">AfriQ AI</span>
        </div>
        <p className="text-sm">The leading AI language learning platform for Africa and the African diaspora.</p>
        <p className="text-xs mt-4">Made with ❤️ for East Africa</p>
      </footer>
    </div>
  )
}
