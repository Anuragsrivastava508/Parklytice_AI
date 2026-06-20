"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Cpu, Bell, Menu } from "lucide-react"

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [officerName, setOfficerName] = useState("Officer Patil")
  const [officerId, setOfficerId] = useState("8092-BLR")
  const [officerPrecinct, setOfficerPrecinct] = useState("IND-BLR-SOUTH")

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true"
    if (!isAuth && pathname !== "/login") {
      router.push("/login")
    } else if (isAuth && pathname === "/login") {
      router.push("/")
    } else {
      setAuthChecked(true)
      setOfficerName(localStorage.getItem("officerName") || "Officer Patil")
      setOfficerId(localStorage.getItem("officerId") || "8092-BLR")
      setOfficerPrecinct(localStorage.getItem("officerPrecinct") || "IND-BLR-SOUTH")
    }
  }, [pathname, router])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  if (!authChecked && pathname !== "/login") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="flex items-center justify-center bg-background h-screen">
          <ThemeProvider>
            <div className="flex flex-col items-center space-y-3">
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-muted-foreground">Loading Parklytics AI...</span>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  if (pathname === "/login") {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Parklytics AI — Traffic Violation Detection</title>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        </head>
        <body className="antialiased">
          <ThemeProvider>
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  const initials = officerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Parklytics AI — Traffic Violation Detection</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased flex bg-background text-foreground h-screen overflow-hidden">
        <ThemeProvider>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="flex-1 flex flex-col h-screen overflow-hidden relative mesh-bg">
            <header className="h-14 border-b border-border glass-panel px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl md:hidden cursor-pointer border border-border transition-colors"
                  aria-label="Open navigation sidebar"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">
                    Traffic Violation Detection
                  </p>
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <span className="text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 font-semibold hidden md:inline-block">
                  {officerPrecinct}
                </span>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-lg border border-border">
                  <Cpu className="h-3.5 w-3.5 text-teal-500 animate-pulse" />
                  <span>AI Inference: 14ms</span>
                </div>

                <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border cursor-pointer transition-colors">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md shadow-indigo-500/25">
                    {initials}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold leading-none text-foreground">{officerName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5">{officerId}</span>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
