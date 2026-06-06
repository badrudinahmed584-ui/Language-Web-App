"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, ArrowRight, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { Language, Level } from "@/types"
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from "@/types"

const LANGUAGES: Language[] = ["somali", "kiswahili", "english"]
const LEVELS: { value: Level; label: string; desc: string; emoji: string }[] = [
  { value: "beginner", label: "Beginner", desc: "I'm just starting out", emoji: "🌱" },
  { value: "intermediate", label: "Intermediate", desc: "I know some basics", emoji: "📚" },
  { value: "advanced", label: "Advanced", desc: "I want to refine my skills", emoji: "🎓" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [nativeLanguage, setNativeLanguage] = useState<Language>("somali")
  const [learningLanguages, setLearningLanguages] = useState<Language[]>([])
  const [level, setLevel] = useState<Level>("beginner")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function toggleLearning(lang: Language) {
    setLearningLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  async function handleFinish() {
    if (learningLanguages.length === 0) { toast.error("Pick at least one language to learn!"); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    const { error } = await supabase.from("profiles").upsert({
      user_id: user.id,
      native_language: nativeLanguage,
      learning_languages: learningLanguages,
      level,
    })
    if (error) { toast.error("Something went wrong. Please try again."); setLoading(false); return }
    router.push("/learn")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4 shadow-lg shadow-emerald-200">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-2 rounded-full transition-all", s === step ? "w-8 bg-emerald-500" : s < step ? "w-4 bg-emerald-300" : "w-4 bg-gray-200")} />
            ))}
          </div>
          <p className="text-sm text-gray-400">Step {step} of 3</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">What's your native language?</h2>
                <p className="text-gray-500 mt-1">We'll personalize your lessons based on this.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => setNativeLanguage(lang)}
                    className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                      nativeLanguage === lang ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200")}>
                    <span className="text-3xl">{LANGUAGE_FLAGS[lang]}</span>
                    <span className="font-semibold text-gray-900 text-lg">{LANGUAGE_LABELS[lang]}</span>
                    {nativeLanguage === lang && <Check className="ml-auto w-5 h-5 text-emerald-500" />}
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)} className="w-full" size="lg">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">What do you want to learn?</h2>
                <p className="text-gray-500 mt-1">Select all that apply.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {LANGUAGES.filter(l => l !== nativeLanguage).map(lang => (
                  <button key={lang} onClick={() => toggleLearning(lang)}
                    className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                      learningLanguages.includes(lang) ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200")}>
                    <span className="text-3xl">{LANGUAGE_FLAGS[lang]}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{LANGUAGE_LABELS[lang]}</p>
                      <p className="text-sm text-gray-400">
                        {lang === "somali" ? "Spoken by 25M+ people in East Africa" : lang === "kiswahili" ? "Lingua franca of East Africa" : "Global language of business & education"}
                      </p>
                    </div>
                    {learningLanguages.includes(lang) && <Check className="w-5 h-5 text-emerald-500" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">Back</Button>
                <Button onClick={() => learningLanguages.length > 0 ? setStep(3) : toast.error("Select at least one!")} className="flex-1" size="lg">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">What's your level?</h2>
                <p className="text-gray-500 mt-1">For your target language(s).</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {LEVELS.map(({ value, label, desc, emoji }) => (
                  <button key={value} onClick={() => setLevel(value)}
                    className={cn("flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                      level === value ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-gray-200")}>
                    <span className="text-3xl">{emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-400">{desc}</p>
                    </div>
                    {level === value && <Check className="w-5 h-5 text-emerald-500" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" size="lg">Back</Button>
                <Button onClick={handleFinish} className="flex-1" size="lg" disabled={loading}>
                  {loading ? "Setting up..." : "Start Learning 🚀"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
