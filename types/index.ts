export type Language = 'somali' | 'kiswahili' | 'english'
export type LanguagePair = `${Language}-${Language}`
export type Level = 'beginner' | 'intermediate' | 'advanced'
export type Rank = 'Explorer' | 'Learner' | 'Scholar' | 'Master' | 'Grandmaster'

export interface Profile {
  user_id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  country: string | null
  native_language: Language
  learning_languages: Language[]
  level: Level
  xp: number
  streak_count: number
  last_active: string
  rank: Rank
  created_at: string
}

export interface Community {
  id: string
  name: string
  description: string | null
  language: string | null
  type: 'public' | 'private'
  avatar_url: string | null
  created_by: string
  member_count: number
  created_at: string
}

export interface CommunityMember {
  community_id: string
  user_id: string
  role: 'member' | 'admin'
  joined_at: string
}

export interface CommunityPost {
  id: string
  community_id: string
  user_id: string
  content: string
  type: string
  likes_count: number
  created_at: string
  profiles?: { display_name: string | null; avatar_url: string | null }
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name: string | null
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  profiles?: { display_name: string | null; avatar_url: string | null }
}

export interface Lesson {
  id: string
  language_pair: LanguagePair
  level: Level
  title: string
  content_json: LessonContent
  xp_reward: number
  order_index: number
}

export interface LessonContent {
  introduction: string
  vocabulary: VocabularyItem[]
  grammar_points: string[]
  exercises: Exercise[]
  cultural_note?: string
}

export interface VocabularyItem {
  word: string
  translation: string
  pronunciation: string
  example: string
}

export interface Exercise {
  type: 'multiple_choice' | 'translation' | 'fill_blank'
  question: string
  options?: string[]
  answer: string
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  criteria_json: object
}

export interface UserBadge {
  user_id: string
  badge_id: string
  earned_at: string
  badges?: Badge
}

export interface Challenge {
  id: string
  title: string
  description: string | null
  community_id: string | null
  type: 'vocabulary' | 'conversation' | 'streak' | 'quiz'
  start_date: string | null
  end_date: string | null
  metrics_json: object
  created_by: string
  created_at: string
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export type TutorMode = 'conversation' | 'vocabulary' | 'grammar' | 'translation' | 'quiz'

export const XP_REWARDS = {
  lesson_complete: 20,
  quiz_perfect: 30,
  quiz_pass: 15,
  daily_streak: 10,
  vocabulary_mastered: 5,
  conversation_message: 2,
  challenge_win: 100,
  challenge_participate: 25,
} as const

export const RANK_THRESHOLDS: Record<Rank, number> = {
  Explorer: 0,
  Learner: 500,
  Scholar: 2000,
  Master: 5000,
  Grandmaster: 10000,
}

export function calculateRank(xp: number): Rank {
  if (xp >= 10000) return 'Grandmaster'
  if (xp >= 5000) return 'Master'
  if (xp >= 2000) return 'Scholar'
  if (xp >= 500) return 'Learner'
  return 'Explorer'
}

export function xpToNextRank(xp: number): { current: Rank; next: Rank | null; needed: number; progress: number } {
  const rank = calculateRank(xp)
  const thresholds = Object.entries(RANK_THRESHOLDS) as [Rank, number][]
  const currentIndex = thresholds.findIndex(([r]) => r === rank)
  const nextEntry = thresholds[currentIndex + 1]
  if (!nextEntry) return { current: rank, next: null, needed: 0, progress: 100 }
  const [nextRank, nextThreshold] = nextEntry
  const currentThreshold = RANK_THRESHOLDS[rank]
  const progress = Math.floor(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  return { current: rank, next: nextRank, needed: nextThreshold - xp, progress }
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  somali: 'Somali',
  kiswahili: 'Kiswahili',
  english: 'English',
}

export const LANGUAGE_FLAGS: Record<Language, string> = {
  somali: '🇸🇴',
  kiswahili: '🇰🇪',
  english: '🇬🇧',
}
