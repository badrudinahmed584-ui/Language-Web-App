import { createClient } from "@/lib/supabase/server"
import { CommunityCard } from "@/components/community/CommunityCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: communities }, { data: myMemberships }] = await Promise.all([
    supabase.from("communities").select("*").eq("type", "public").order("member_count", { ascending: false }).limit(20),
    supabase.from("community_members").select("community_id").eq("user_id", user!.id),
  ])

  const myIds = new Set((myMemberships || []).map(m => m.community_id))

  const myCommunities = (communities || []).filter(c => myIds.has(c.id))
  const discoverCommunities = (communities || []).filter(c => !myIds.has(c.id))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Communities</h1>
          <p className="text-gray-500 text-sm mt-0.5">Learn together, grow together</p>
        </div>
        <Button asChild>
          <Link href="/community/create"><Plus className="w-4 h-4 mr-1" /> New Community</Link>
        </Button>
      </div>

      {myCommunities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-4">My Communities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCommunities.map(c => <CommunityCard key={c.id} community={c} isMember />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-gray-700 mb-4">Discover</h2>
        {discoverCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoverCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-5xl">🌍</span>
            <p className="text-gray-500 mt-3 mb-4">No communities yet — be the first!</p>
            <Button asChild><Link href="/community/create">Create Community</Link></Button>
          </div>
        )}
      </section>
    </div>
  )
}
