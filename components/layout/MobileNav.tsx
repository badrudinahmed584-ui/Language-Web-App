"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, MessageCircle, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/compete", icon: Trophy, label: "Compete" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 pb-safe">
      <div className="flex items-center justify-around">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn("flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl transition-colors",
              pathname.startsWith(href) ? "text-emerald-600" : "text-gray-400 hover:text-gray-700")}>
            <Icon className={cn("w-6 h-6", pathname.startsWith(href) && "stroke-[2.5]")} />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
