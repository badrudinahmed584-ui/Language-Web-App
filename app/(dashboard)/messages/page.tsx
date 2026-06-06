import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from("conversation_participants")
    .select("conversation_id, conversations(id, type, name, created_at)")
    .eq("user_id", user!.id)
    .limit(20)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-100">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm">Chat with language exchange partners</p>
        </div>
      </div>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((cp: any) => (
            <Card key={cp.conversation_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link href={`/messages/${cp.conversation_id}`} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {cp.conversations?.type === "group" ? "👥" : "💬"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cp.conversations?.name || "Direct Message"}</p>
                    <p className="text-xs text-gray-400">{cp.conversations?.type}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <span className="text-5xl block mb-3">💬</span>
          <h3 className="font-bold text-gray-900 mb-1">No conversations yet</h3>
          <p className="text-gray-500 text-sm mb-6">Find language exchange partners in communities</p>
          <Button asChild><Link href="/community">Explore Communities</Link></Button>
        </div>
      )}
    </div>
  )
}
