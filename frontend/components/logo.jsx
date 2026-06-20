"use client"

import React from "react"

export function Logo({ size = "md", showText = true, className = "" }) {
  const sizes = {
    sm: { icon: 28, text: "text-sm" },
    md: { icon: 36, text: "text-base" },
    lg: { icon: 48, text: "text-xl" },
    xl: { icon: 64, text: "text-2xl" },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="parklytics-grad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="0.5" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="parklytics-glow" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#parklytics-glow)" />
        <circle cx="32" cy="32" r="28" stroke="url(#parklytics-grad)" strokeWidth="2" strokeOpacity="0.4" fill="none" />
        <circle cx="32" cy="32" r="20" stroke="url(#parklytics-grad)" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="4 3" fill="none" />
        <rect x="18" y="16" width="28" height="32" rx="6" fill="url(#parklytics-grad)" />
        <path
          d="M28 24h8c4.4 0 8 3.6 8 8s-3.6 8-8 8h-4v8"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="48" cy="14" r="3" fill="#f59e0b" />
        <circle cx="52" cy="22" r="2" fill="#6366f1" opacity="0.8" />
        <circle cx="14" cy="48" r="2.5" fill="#14b8a6" />
        <path d="M46 12 L50 16 M50 12 L46 16" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight text-foreground ${s.text}`}>
            Parklytics <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">AI</span>
          </span>
          <span className="text-[9px] font-medium text-muted-foreground tracking-wide uppercase mt-0.5 hidden sm:block">
            Traffic Violation Detection
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
