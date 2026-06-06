import { openai } from "@/lib/openai/client"
import { buildSystemPrompt } from "@/lib/openai/prompts"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { Language, Level, TutorMode } from "@/types"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { messages, sessionId, nativeLanguage, learningLanguage, level, mode, lessonContext } = await request.json() as {
    messages: { role: "user" | "assistant"; content: string }[]
    sessionId?: string
    nativeLanguage: Language
    learningLanguage: Language
    level: Level
    mode: TutorMode
    lessonContext?: string
  }

  const systemPrompt = buildSystemPrompt({ nativeLanguage, learningLanguage, level, mode, lessonContext })

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.slice(-20),
    ],
    stream: true,
    max_tokens: 1000,
    temperature: 0.7,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      let fullContent = ""
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          fullContent += text
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
        // Award XP for conversation practice
        await supabase.from("xp_transactions").insert({
          user_id: user.id, amount: 2, source: "conversation_message",
        })
        await supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq("user_id", user.id)

        // Save session
        if (sessionId) {
          await supabase.from("ai_conversations").upsert({
            id: sessionId, user_id: user.id,
            language_pair: `${nativeLanguage}-${learningLanguage}`,
            messages_json: [...messages, { role: "assistant", content: fullContent }],
            updated_at: new Date().toISOString(),
          })
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`))
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  })
}
