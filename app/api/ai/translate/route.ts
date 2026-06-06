import { openai } from "@/lib/openai/client"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { Language } from "@/types"

const LANGUAGE_NAMES: Record<Language, string> = {
  somali: "Somali", kiswahili: "Kiswahili", english: "English",
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { text, fromLanguage, toLanguage } = await request.json() as {
    text: string; fromLanguage: Language; toLanguage: Language
  }

  const prompt = `Translate the following ${LANGUAGE_NAMES[fromLanguage]} text to ${LANGUAGE_NAMES[toLanguage]}.

Return a JSON object with:
- "translation": the translated text
- "wordByWord": array of {word, translation} for each significant word
- "culturalNotes": any cultural context or notes (empty string if none)
- "alternativePhrasing": one alternative way to say it (empty string if not applicable)

Text to translate: "${text}"

Respond ONLY with valid JSON.`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.3,
    response_format: { type: "json_object" },
  })

  const result = JSON.parse(completion.choices[0].message.content || "{}")
  return NextResponse.json(result)
}
