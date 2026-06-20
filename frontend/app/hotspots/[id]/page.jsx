"use client"

import React, { useEffect, useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Play, ShieldAlert, CheckCircle, MapPin, Clock, Users } from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DetailBox, getPriorityStyles } from "@/components/page-header"
import RiskMeter from "@/components/risk-meter"
import { ParkWatchApi } from "@/services/api"

export default function HotspotDetailPage({ params }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [hotspot, setHotspot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dispatchStatus, setDispatchStatus] = useState("")

  useEffect(() => {
    if (id) {
      ParkWatchApi.getHotspotById(id).then(data => {
        setHotspot(data)
        setLoading(false)
      })
    }
  }, [id])

  const handleRouteEnforcement = async (action, priority) => {
    setDispatchStatus("sending")
    try {
      const asset = priority === "CRITICAL" ? "TOW-UNIT-04" : "WARDEN-UNIT-11"
      await ParkWatchApi.applyRecommendation(id, action, asset)
      setDispatchStatus("success")
      setTimeout(() => setDispatchStatus(""), 4000)
    } catch (e) {
      setDispatchStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs text-muted-foreground">
        <div className="h-7 w-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
        <span>Loading hotspot analysis...</span>
      </div>
    )
  }

  if (!hotspot) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
        </Link>
        <Card className="p-8 text-center border-border bg-card text-muted-foreground">
          Hotspot "{id}" not found.
        </Card>
      </div>
    )
  }

  const risk = hotspot.composite_rank_score
  let riskAccent = "teal"
  if (risk >= 80) riskAccent = "red"
  else if (risk >= 60) riskAccent = "amber"

  const riskBorderClass =
    risk >= 80 ? "border-red-500/30 bg-red-500/5" :
    risk >= 60 ? "border-amber-500/30 bg-amber-500/5" :
    "border-teal-500/30 bg-teal-500/5"

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">

        <Card className="flex-1 border-border bg-card overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{hotspot.hotspot_id}</span>
              <Badge className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Rank #{hotspot.rank}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-foreground mt-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              {hotspot.location}
            </CardTitle>
            <CardDescription className="text-xs">
              {hotspot.location.includes("Silk") ? "Madivala Precinct" : "HAL Old Airport Precinct"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 font-mono text-xs">
            {[
              { label: "Total violations", value: `${hotspot.violation_count} instances`, icon: ShieldAlert },
              { label: "Cluster area", value: `${hotspot.cluster_size_km2.toFixed(3)} km²`, icon: MapPin },
              { label: "Dominant offence", value: hotspot.risk_inputs.dominant_violation_type, icon: Clock },
              { label: "Repeat offender rate", value: `${(hotspot.risk_inputs.repeat_vehicle_ratio * 100).toFixed(0)}%`, icon: Users },
            ].map(({ label, value, icon: Icon }, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
                <span className="text-foreground font-bold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`lg:w-80 border ${riskBorderClass} flex flex-col items-center justify-center p-6 text-center overflow-hidden`}>
          <RiskMeter score={risk} size={150} />
          <h4 className="font-bold text-sm mt-4 text-foreground">Congestion risk score</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
            Based on violation density, repeat rates, and peak-hour traffic impact.
          </p>
        </Card>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground">Recommended actions</CardTitle>
          <CardDescription className="text-xs">AI-generated enforcement strategies ranked by expected congestion relief</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">

          {dispatchStatus === "success" && (
            <div className="p-3 bg-teal-500/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Unit dispatched and en route to coordinate zone.
            </div>
          )}
          {dispatchStatus === "error" && (
            <div className="p-3 bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Dispatch failed — check gateway connection.
            </div>
          )}

          {hotspot.recommendations?.map((rec, index) => {
            const isCritical = rec.priority === "CRITICAL" || rec.priority === "HIGH"
            return (
              <div
                key={index}
                className={`border-l-4 ${getPriorityStyles(rec.priority)} flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border hover:border-indigo-400/30 transition-all gap-4`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={isCritical ? "destructive" : "warning"} className="text-[10px]">
                      {rec.priority}
                    </Badge>
                    <h4 className="font-bold text-sm text-foreground">{rec.action}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.reason}</p>
                  <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                    <span>Confidence: <strong className="text-indigo-600 dark:text-indigo-400">{(rec.confidence * 100).toFixed(0)}%</strong></span>
                    <span>Window: <strong className="text-foreground">{rec.suggested_deployment_window}</strong></span>
                  </div>
                </div>
                <Button
                  variant={isCritical ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRouteEnforcement(rec.action, rec.priority)}
                  disabled={dispatchStatus === "sending"}
                  className={`text-xs shrink-0 ${isCritical ? "bg-gradient-to-r from-indigo-600 to-violet-600" : ""}`}
                >
                  <Play className="h-3 w-3 mr-1.5 fill-current" />
                  {dispatchStatus === "sending" ? "Routing..." : "Dispatch now"}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
