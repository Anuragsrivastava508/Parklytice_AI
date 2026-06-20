"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function Select({ value, onChange, options, placeholder = "Select...", className = "" }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium",
          "bg-card border border-border text-foreground",
          "hover:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
          "transition-all duration-200 shadow-sm",
          open && "ring-2 ring-indigo-500/20 border-indigo-500"
        )}
      >
        <span className={cn(!selected?.value && "text-muted-foreground")}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-56 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-left transition-colors",
                  value === option.value
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="h-3.5 w-3.5 text-indigo-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select
