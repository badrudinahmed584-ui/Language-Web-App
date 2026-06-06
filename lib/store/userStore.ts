import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'
import { calculateRank } from '@/types'

interface UserState {
  profile: Profile | null
  setProfile: (profile: Profile) => void
  addXP: (amount: number) => void
  setStreak: (count: number) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      addXP: (amount) =>
        set((state) => {
          if (!state.profile) return state
          const newXP = state.profile.xp + amount
          return {
            profile: {
              ...state.profile,
              xp: newXP,
              rank: calculateRank(newXP),
            },
          }
        }),
      setStreak: (count) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, streak_count: count } : null,
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'afriq-user-store',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)
