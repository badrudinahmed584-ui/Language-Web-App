import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const language = searchParams.get("language")
  const search = searchParams.get("search")

  let query = supabase.from("communities").select("*").eq("type", "public").order("member_count", { ascending: false }).limit(20)
  if (language) query = query.eq("language", language)
  if (search) query = query.ilike("name", `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { data: community, error } = await supabase.from("communities").insert({
    ...body, created_by: user.id, member_count: 1,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from("community_members").insert({
    community_id: community.id, user_id: user.id, role: "admin",
  })

  return NextResponse.json(community)
}
