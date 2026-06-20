"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ShieldAlert, KeyRound, UserCheck, ChevronRight, UserPlus,
  FileText, MapPin, AlertTriangle, TrendingDown, Eye, EyeOff, LogIn
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ParkWatchApi } from "@/services/api"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState("login")

  const [officerId, setOfficerId] = useState("8092-BLR")
  const [password, setPassword] = useState("password123")
  const [name, setName] = useState("")
  const [precinct, setPrecinct] = useState("IND-BLR-SOUTH")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (mode === "login") {
        if (!officerId.trim() || !password.trim()) {
          setError("All fields are required.")
          setLoading(false)
          return
        }

        const res = await ParkWatchApi.login(officerId.trim(), password)
        if (res.status === "success" || res.user) {
          setSuccess("Authentication granted! Redirecting...")
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("officerId", res.user?.officer_id || officerId)
          localStorage.setItem("officerName", res.user?.name || "Officer Patil")
          localStorage.setItem("officerPrecinct", res.user?.precinct || precinct)

          setTimeout(() => router.push("/"), 800)
        } else {
          setError(res.message || "Failed to authenticate.")
        }
      } else {
        if (!officerId.trim() || !password.trim() || !name.trim() || !precinct.trim()) {
          setError("All fields are required.")
          setLoading(false)
          return
        }

        const res = await ParkWatchApi.register({
          officer_id: officerId.trim(),
          name: name.trim(),
          password: password,
          precinct: precinct.trim(),
          role: "officer"
        })

        if (res.status === "success") {
          setSuccess("Account successfully created! Please log in.")
          setTimeout(() => {
            setMode("login")
            setSuccess("")
            setPassword("")
          }, 1500)
        } else {
          setError(res.message || "Registration failed.")
        }
      }
    } catch (err) {
      setError("Server connection error. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-background/80 text-foreground border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all placeholder:text-muted-foreground"

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-background overflow-y-auto">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950" />
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 rounded-full bg-amber-500/15 blur-[90px] animate-pulse-glow" />

        <div className="relative z-10">
          <Logo size="lg" className="[&_span]:text-white [&_.text-muted-foreground]:text-indigo-200/70" />
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <div>
            <p className="text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
              Operational Challenge
            </p>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
              Poor Visibility on Parking-Induced Congestion
            </h1>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            On-street illegal parking and spillover parking near commercial areas, metro stations, and events choke carriageways and intersections.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: AlertTriangle, text: "Enforcement is patrol-based and reactive" },
              { icon: MapPin, text: "No heatmap of violations vs. congestion impact" },
              { icon: TrendingDown, text: "Difficult to prioritize enforcement zones" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Icon className="h-4 w-4 text-indigo-300" />
                </div>
                <span className="text-sm text-slate-200">{text}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm">
            <p className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider mb-1.5">Problem Statement</p>
            <p className="text-sm text-indigo-100 leading-relaxed">
              How can AI-driven parking intelligence detect illegal parking hotspots and quantify their impact on traffic flow to enable targeted enforcement?
            </p>
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-slate-500 font-mono">
          Parklytics AI v2.0 • Traffic Violation Detection Platform
        </p>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 mesh-bg">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <Card className="border border-border/80 shadow-2xl shadow-indigo-500/5 dark:shadow-black/30 rounded-2xl overflow-hidden bg-card/90 backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500" />

            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-foreground">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {mode === "login"
                    ? "Sign in to access the enforcement dashboard"
                    : "Register a new enforcement officer profile"}
                </p>
              </div>

              {/* Auth mode tabs — Officer Sign In & Register only */}
              <div className="flex rounded-xl bg-muted p-1 mb-6">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccess("") }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "login"
                      ? "bg-card text-indigo-600 shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Officer Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(""); setSuccess("") }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "register"
                      ? "bg-card text-indigo-600 shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2 animate-shake">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                    <span>{success}</span>
                  </div>
                )}

                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">Operator Full Name</label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Officer Patil" className={inputClass} required />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">Officer ID / Username</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={officerId} onChange={(e) => setOfficerId(e.target.value)} placeholder="e.g. 8092-BLR" className={inputClass} required />
                  </div>
                </div>

                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">Precinct Region / Jurisdiction</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input type="text" value={precinct} onChange={(e) => setPrecinct(e.target.value)} placeholder="e.g. IND-BLR-SOUTH" className={inputClass} required />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">Passphrase Key</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pr-12`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-indigo-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-indigo-500/25 transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {mode === "login" ? "Authenticating..." : "Creating Account..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {mode === "login" ? "Sign In to Dashboard" : "Create New Account"}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>

            <div className="bg-muted/50 border-t border-border py-3.5 text-center text-[10px] font-mono text-muted-foreground">
              SECURE ENFORCEMENT CHANNEL • BLR SOUTH PRECINCT
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
