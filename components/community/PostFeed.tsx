"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { formatDistanceToNow } from "@/lib/utils"

interface Post {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: { display_name: string | null; avatar_url: string | null }
}

export function PostFeed({ communityId, isMember, currentUserId }: { communityId: string; isMember: boolean; currentUserId: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [posting, setPosting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from("community_posts")
      .select("*, profiles(display_name, avatar_url)")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setPosts(data || []))

    const channel = supabase
      .channel(`community-posts-${communityId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "community_posts",
        filter: `community_id=eq.${communityId}`,
      }, async (payload) => {
        const { data: profile } = await supabase
          .from("profiles").select("display_name, avatar_url").eq("user_id", payload.new.user_id).single()
        setPosts(prev => [{ ...payload.new, profiles: profile } as Post, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [communityId])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!newPost.trim()) return
    setPosting(true)

    const { error } = await supabase.from("community_posts").insert({
      community_id: communityId,
      user_id: currentUserId,
      content: newPost.trim(),
    })

    if (error) {
      toast.error("Failed to post. Make sure you're a member.")
    } else {
      setNewPost("")
    }
    setPosting(false)
  }

  return (
    <div className="space-y-4">
      {/* New post form */}
      {isMember && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handlePost} className="space-y-3">
              <textarea
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
                placeholder="Share something with the community..."
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                rows={2}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{newPost.length}/500</span>
                <Button type="submit" size="sm" disabled={posting || !newPost.trim()}>
                  {posting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!isMember && (
        <div className="text-center py-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-emerald-700 font-medium text-sm">Join this community to post and interact 👆</p>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl block mb-3">💬</span>
          <p className="text-gray-400 text-sm">No posts yet — be the first to share!</p>
        </div>
      ) : (
        posts.map(post => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  {post.profiles?.avatar_url && <AvatarImage src={post.profiles.avatar_url} />}
                  <AvatarFallback className="text-xs">
                    {post.profiles?.display_name?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{post.profiles?.display_name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(post.created_at)}</p>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
