"use client"
import { Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StreakCounter } from "@/components/gamification/StreakCounter"
import { XPBar } from "@/components/gamification/XPBar"
import { useUserStore } from "@/lib/store/userStore"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Navbar() {
  const { profile, clearProfile } = useUserStore()
  const router = useRouter()
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearProfile()
    router.push("/")
  }
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link href="/learn" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-black text-gray-900">AfriQ <span className="text-emerald-500">AI</span></span>
      </Link>
      {profile && (
        <div className="flex items-center gap-3">
          <StreakCounter count={profile.streak_count} compact />
          <XPBar xp={profile.xp} compact />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full ring-2 ring-emerald-200 hover:ring-emerald-400 transition-all">
                <Avatar className="h-8 w-8">
                  {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                  <AvatarFallback>{profile.display_name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href="/profile">👤 Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/analytics">📊 Analytics</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50">🚪 Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}
