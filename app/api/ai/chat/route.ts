import { getOpenAI } from "@/lib/openai/client"
import { buildSystemPrompt } from "@/lib/openai/prompts"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { Language, Level, TutorMode } from "@/types"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { messages, nativeLanguage, learningLanguage, level, mode, lessonContext } = body as {
      messages: { role: "user" | "assistant"; content: string }[]
      nativeLanguage: Language
      learningLanguage: Language
      level: Level
      mode: TutorMode
      lessonContext?: string
    }

    const systemPrompt = buildSystemPrompt({
      nativeLanguage: nativeLanguage || "somali",
      learningLanguage: learningLanguage || "english",
      level: level || "beginner",
      mode: mode || "conversation",
      lessonContext,
    })

    const openai = getOpenAI()
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20),
      ],
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
        } catch (err) {
          console.error("Stream error:", err)
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        }

        // Background: award XP (non-blocking)
        supabase.from("xp_transactions").insert({
          user_id: user.id, amount: 2, source: "conversation_message",
        }).then(() => {
          supabase.from("profiles")
            .update({ xp: supabase.rpc("increment_xp", { uid: user.id, amount: 2 }), last_active: new Date().toISOString() })
            .eq("user_id", user.id)
        })
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (err: any) {
    console.error("AI chat error:", err)
    return NextResponse.json({ error: err.message || "AI error" }, { status: 500 })
  }
}
