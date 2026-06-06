"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { Language } from "@/types"
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from "@/types"

const LANGUAGES: { value: Language | ""; label: string; flag: string }[] = [
  { value: "", label: "All Languages", flag: "🌍" },
  { value: "somali", label: "Somali", flag: "🇸🇴" },
  { value: "kiswahili", label: "Kiswahili", flag: "🇰🇪" },
  { value: "english", label: "English", flag: "🇬🇧" },
]

export default function CreateCommunityPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState<Language | "">("")
  const [type, setType] = useState<"public" | "private">("public")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error("Community name is required"); return }
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { data: community, error } = await supabase
      .from("communities")
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        language: language || null,
        type,
        created_by: user.id,
        member_count: 1,
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to create community. Please try again.")
      setLoading(false)
      return
    }

    // Add creator as admin
    await supabase.from("community_members").insert({
      community_id: community.id,
      user_id: user.id,
      role: "admin",
    })

    toast.success("Community created!")
    router.push(`/community/${community.id}`)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/community" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Create Community</h1>
          <p className="text-gray-500 text-sm">Build a space for learners to connect</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Community Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. Somali Learners Kenya"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
                required
              />
              <p className="text-xs text-gray-400 mt-1">{name.length}/60 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                className="flex w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                placeholder="What is this community about? Who should join?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-gray-400 mt-1">{description.length}/300 characters</p>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Language Focus</label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value as Language | "")}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                      language === lang.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("public")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    type === "public" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="text-2xl mb-1">🌍</div>
                  <p className="font-semibold text-gray-900 text-sm">Public</p>
                  <p className="text-xs text-gray-400">Anyone can join</p>
                </button>
                <button
                  type="button"
                  onClick={() => setType("private")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    type === "private" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="font-semibold text-gray-900 text-sm">Private</p>
                  <p className="text-xs text-gray-400">Invite only</p>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating..." : "Create Community 🚀"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
