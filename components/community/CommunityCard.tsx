import Link from "next/link"
import { Users, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Community } from "@/types"

const LANG_FLAGS: Record<string, string> = { somali: "🇸🇴", kiswahili: "🇰🇪", english: "🇬🇧" }

export function CommunityCard({ community, isMember }: { community: Community; isMember?: boolean }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
            {community.avatar_url || (community.language ? LANG_FLAGS[community.language] : "🌍")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate">{community.name}</h3>
              {community.type === "private" && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
            </div>
            {community.description && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{community.description}</p>}
            <div className="flex items-center gap-2">
              {community.language && (
                <Badge variant="default">{LANG_FLAGS[community.language]} {community.language}</Badge>
              )}
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" />{community.member_count}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/community/${community.id}`}>View</Link>
          </Button>
          {!isMember && (
            <Button asChild size="sm" className="flex-1">
              <Link href={`/community/${community.id}`}>Join</Link>
            </Button>
          )}
          {isMember && <Badge variant="secondary" className="flex-1 justify-center py-1">✓ Member</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}
