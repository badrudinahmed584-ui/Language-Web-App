"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/toast"

export function JoinButton({ communityId, communityName }: { communityId: string; communityName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleJoin() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { error } = await supabase.from("community_members").insert({
      community_id: communityId,
      user_id: user.id,
      role: "member",
    })

    if (error) {
      toast.error("Could not join community. You may already be a member.")
    } else {
      toast.success(`Joined ${communityName}!`)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Button onClick={handleJoin} disabled={loading} size="sm">
      {loading ? "Joining..." : "Join Community"}
    </Button>
  )
}
