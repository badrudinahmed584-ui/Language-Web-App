"use client"
import { useUserStore } from "@/lib/store/userStore"
import type { Profile } from "@/types"

export function ProfileConsumer({ children }: { children: (profile: Profile | null) => React.ReactNode }) {
  const profile = useUserStore(s => s.profile)
  return <>{children(profile)}</>
}
