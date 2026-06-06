import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { Navbar } from "@/components/layout/Navbar"
import { ProfileProvider } from "@/components/providers/ProfileProvider"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <ProfileProvider initialProfile={profile}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-64">
          <Navbar />
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">{children}</main>
        </div>
        <MobileNav />
      </div>
    </ProfileProvider>
  )
}
