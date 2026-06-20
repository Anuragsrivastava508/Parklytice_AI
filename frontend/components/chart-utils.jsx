"use client"

import React from "react"

export const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  success: "#14b8a6",
  danger: "#ef4444",
  coral: "#f97316",
  pink: "#ec4899",
  cyan: "#06b6d4",
}

export const CHART_PALETTE = [
  "#6366f1",
  "#8b5cf6",
  "#f59e0b",
  "#14b8a6",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#f97316",
]

export function ChartTooltip({ active, payload, label, labelFormatter, theme = "light" }) {
  if (!active || !payload?.length) return null

  const isDark = theme === "dark"

  return (
    <div
      className={`rounded-xl border px-3.5 py-2.5 shadow-xl backdrop-blur-md ${
        isDark
          ? "bg-slate-900/95 border-slate-700/80 text-slate-100"
          : "bg-white/95 border-indigo-100 text-slate-800"
      }`}
    >
      <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 ${
        isDark ? "text-indigo-300" : "text-indigo-600"
      }`}>
        {labelFormatter ? labelFormatter(label) : label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className={isDark ? "text-slate-300" : "text-slate-600"}>{entry.name}</span>
            </div>
            <span className="font-mono font-bold">{entry.value?.toLocaleString?.() ?? entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartLegend({ payload, onClick, hiddenKeys = [] }) {
  if (!payload?.length) return null

  return (
    <div className="flex flex-wrap justify-center gap-3 pt-2">
      {payload.map((entry, i) => {
        const hidden = hiddenKeys.includes(entry.dataKey)
        return (
          <button
            key={i}
            type="button"
            onClick={() => onClick?.(entry.dataKey)}
            className={`flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wide transition-opacity cursor-pointer hover:opacity-80 ${
              hidden ? "opacity-40 line-through" : "opacity-100"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
          </button>
        )
      })}
    </div>
  )
}
