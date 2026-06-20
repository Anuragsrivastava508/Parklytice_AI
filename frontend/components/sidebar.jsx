"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Map, AlertOctagon, FileSpreadsheet,
  ShieldAlert, Users, BarChart3, LogOut, X, Sun, Moon, Sparkles
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useTheme } from "@/components/theme-provider"

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Hotspot Map", path: "/map", icon: Map },
    { name: "AI Actions", path: "/recommendations", icon: AlertOctagon },
    { name: "Records", path: "/records", icon: FileSpreadsheet },
    { name: "Precinct Health", path: "/stations", icon: ShieldAlert },
    { name: "Repeat Offenders", path: "/offenders", icon: Users },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ]

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("officerId")
    localStorage.removeItem("officerName")
    localStorage.removeItem("officerPrecinct")
    router.push("/login")
    if (onClose) onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`w-64 bg-card border-r border-border h-screen fixed md:sticky top-0 left-0 flex flex-col justify-between z-50 shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col space-y-5 p-4">
          {/* Logo */}
          <div className="flex items-center justify-between px-1 pt-1">
            <Link href="/" onClick={() => onClose?.()}>
              <Logo size="sm" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg md:hidden transition-colors"
              aria-label="Close navigation sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Theme toggle */}
          <div className="px-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/60 border border-border hover:border-indigo-400/40 transition-all group"
            >
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 text-indigo-400" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold text-foreground">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${theme === "dark" ? "bg-indigo-600" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50 shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-indigo-500" : "text-muted-foreground"}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-sm font-medium transition-all border border-transparent hover:border-red-200 dark:hover:border-red-800/50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          <div className="flex items-center gap-2 px-2">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-muted-foreground">
              AI Engine: Online
            </span>
          </div>
          <p className="text-[9px] font-mono text-muted-foreground/70 px-2">Parklytics AI v2.0</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
