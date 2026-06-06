import { calculateRank } from '@/types'

export async function awardXP(
  supabase: ReturnType<typeof import('../supabase/server').createClient> extends Promise<infer T> ? T : never,
  userId: string,
  source: string,
  amount: number,
  metadata?: object
) {
  await supabase.from('xp_transactions').insert({
    user_id: userId,
    amount,
    source,
    metadata: metadata || {},
  })

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, rank')
    .eq('user_id', userId)
    .single()

  const currentXP = profile?.xp || 0
  const newXP = currentXP + amount
  const oldRank = profile?.rank || 'Explorer'
  const newRank = calculateRank(newXP)

  await supabase
    .from('profiles')
    .update({ xp: newXP, rank: newRank, last_active: new Date().toISOString() })
    .eq('user_id', userId)

  return { amount, newXP, newRank, rankUp: newRank !== oldRank }
}

export async function updateStreak(
  supabase: ReturnType<typeof import('../supabase/server').createClient> extends Promise<infer T> ? T : never,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_active')
    .eq('user_id', userId)
    .single()

  if (!profile) return

  const lastActive = new Date(profile.last_active)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

  let newStreak = profile.streak_count
  if (diffDays === 1) {
    newStreak = profile.streak_count + 1
  } else if (diffDays > 1) {
    newStreak = 1
  }

  await supabase
    .from('profiles')
    .update({ streak_count: newStreak, last_active: now.toISOString() })
    .eq('user_id', userId)

  // Bonus XP for streak milestones
  if ([7, 30, 100].includes(newStreak)) {
    const bonus = newStreak === 7 ? 50 : newStreak === 30 ? 200 : 500
    await awardXP(supabase, userId, 'streak_milestone', bonus, { streak: newStreak })
  }

  return newStreak
}
