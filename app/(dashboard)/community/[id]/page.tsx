import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ArrowLeft, Users, Lock, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { JoinButton } from "@/components/community/JoinButton"
import { PostFeed } from "@/components/community/PostFeed"

const LANG_FLAGS: Record<string, string> = { somali: "🇸🇴", kiswahili: "🇰🇪", english: "🇬🇧" }

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: community }, { data: membership }, { data: members }] = await Promise.all([
    supabase.from("communities").select("*").eq("id", id).single(),
    supabase.from("community_members").select("role").eq("community_id", id).eq("user_id", user!.id).single(),
    supabase.from("community_members")
      .select("user_id, role, joined_at, profiles(display_name, avatar_url)")
      .eq("community_id", id)
      .limit(10),
  ])

  if (!community) notFound()

  const isMember = !!membership
  const isAdmin = membership?.role === "admin"

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/community" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Communities
      </Link>

      {/* Community Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl flex-shrink-0">
              {community.language ? LANG_FLAGS[community.language] : "🌍"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-gray-900">{community.name}</h1>
                {community.type === "private"
                  ? <Lock className="w-4 h-4 text-gray-400" />
                  : <Globe className="w-4 h-4 text-gray-400" />
                }
              </div>
              {community.description && <p className="text-gray-500 mb-3">{community.description}</p>}
              <div className="flex items-center gap-3 flex-wrap">
                {community.language && (
                  <Badge variant="default">{LANG_FLAGS[community.language]} {community.language}</Badge>
                )}
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {community.member_count} members
                </span>
                {isAdmin && <Badge variant="secondary">⚙️ Admin</Badge>}
              </div>
            </div>
            <div className="flex-shrink-0">
              {isMember ? (
                <Badge variant="default" className="py-1.5 px-3">✓ Member</Badge>
              ) : (
                <JoinButton communityId={community.id} communityName={community.name} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts feed */}
        <div className="lg:col-span-2">
          <PostFeed communityId={community.id} isMember={isMember} currentUserId={user!.id} />
        </div>

        {/* Members sidebar */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Members
              </h3>
              <div className="space-y-3">
                {(members || []).map((m: any) => (
                  <div key={m.user_id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {m.profiles?.avatar_url && <AvatarImage src={m.profiles.avatar_url} />}
                      <AvatarFallback className="text-xs">
                        {m.profiles?.display_name?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {m.profiles?.display_name || "Anonymous"}
                      </p>
                      {m.role === "admin" && <p className="text-xs text-emerald-600">Admin</p>}
                    </div>
                  </div>
                ))}
              </div>
              {community.member_count > 10 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  +{community.member_count - 10} more members
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
