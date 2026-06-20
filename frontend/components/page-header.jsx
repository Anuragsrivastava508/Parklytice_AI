"use client"

import React from "react"

export function PageHeader({ title, description, badge, action, children }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 border-b border-border pb-5">
      <div className="space-y-1.5">
        {badge && (
          <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  )
}

export function InfoPanel({ label, value, sub, icon: Icon, accent = "indigo" }) {
  const accents = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/50",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    red: "bg-red-500/10 text-red-500 border-red-200/50 dark:border-red-800/50",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200/50 dark:border-teal-800/50",
  }

  return (
    <div className={`p-3 rounded-xl border ${accents[accent] || accents.indigo}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5 opacity-80" />}
        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

export function DetailBox({ label, children, className = "" }) {
  return (
    <div className={`p-3 rounded-xl bg-muted/50 border border-border ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground block mb-1">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

export function getPriorityStyles(priority) {
  const styles = {
    CRITICAL: "border-l-red-500 bg-red-500/5",
    HIGH: "border-l-orange-500 bg-orange-500/5",
    MEDIUM: "border-l-amber-500 bg-amber-500/5",
    LOW: "border-l-teal-500 bg-teal-500/5",
  }
  return styles[priority] || styles.MEDIUM
}

export default PageHeader
