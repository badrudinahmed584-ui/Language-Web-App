"use client"
import { useEffect } from "react"
import { useUserStore } from "@/lib/store/userStore"
import type { Profile } from "@/types"

export function ProfileProvider({ children, initialProfile }: { children: React.ReactNode; initialProfile: Profile | null }) {
  const setProfile = useUserStore(s => s.setProfile)
  useEffect(() => {
    if (initialProfile) setProfile(initialProfile)
  }, [initialProfile, setProfile])
  return <>{children}</>
}
