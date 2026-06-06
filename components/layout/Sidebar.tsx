"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, MessageCircle, Trophy, BarChart3, User, LogOut, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { XPBar } from "@/components/gamification/XPBar"
import { useUserStore } from "@/lib/store/userStore"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const NAV = [
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/compete", icon: Trophy, label: "Compete" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, clearProfile } = useUserStore()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearProfile()
    router.push("/")
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-100 p-4 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black text-gray-900">AfriQ <span className="text-emerald-500">AI</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              pathname.startsWith(href)
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      {profile && (
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <XPBar xp={profile.xp} />
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback>{profile.display_name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{profile.display_name || "Learner"}</p>
              <StreakCounter count={profile.streak_count} compact />
            </div>
            <button onClick={handleSignOut} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
