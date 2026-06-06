"use client"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { AIMessage } from "@/types"

export function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3 max-w-[90%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
          A
        </div>
      )}
      <div className={cn(
        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-emerald-500 text-white rounded-tr-sm"
          : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
      )}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-emerald-700">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
              code: ({ children }) => <code className="bg-gray-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-300 pl-3 my-2 text-amber-800 bg-amber-50 rounded-r-lg py-1">{children}</blockquote>,
              ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
              li: ({ children }) => <li>{children}</li>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
