"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg text-white font-semibold text-sm",
      type === "success" && "bg-emerald-500",
      type === "error" && "bg-red-500",
      type === "info" && "bg-blue-500",
    )}>
      {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      <span className="ml-1">{message}</span>
    </div>
  )
}

interface ToastState { message: string; type: "success" | "error" | "info"; id: number }
let toastId = 0
type ToastListener = (toast: ToastState | null) => void
const listeners = new Set<ToastListener>()

export const toast = {
  success: (message: string) => { const t = { message, type: "success" as const, id: toastId++ }; listeners.forEach((l) => l(t)) },
  error: (message: string) => { const t = { message, type: "error" as const, id: toastId++ }; listeners.forEach((l) => l(t)) },
  info: (message: string) => { const t = { message, type: "info" as const, id: toastId++ }; listeners.forEach((l) => l(t)) },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = React.useState<ToastState | null>(null)
  React.useEffect(() => { listeners.add(setCurrent); return () => { listeners.delete(setCurrent) } }, [])
  return (
    <>
      {children}
      {current && <Toast key={current.id} message={current.message} type={current.type} onClose={() => setCurrent(null)} />}
    </>
  )
}
