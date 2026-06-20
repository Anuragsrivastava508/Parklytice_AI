"use client"

import React, { useEffect, useState } from "react"
import {
  AlertOctagon, CheckCircle, ShieldAlert, Truck, Users,
  Clock, Target, Zap, ChevronRight
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { PageHeader, DetailBox, getPriorityStyles } from "@/components/page-header"
import { ParkWatchApi } from "@/services/api"

const PRIORITY_CONFIG = {
  CRITICAL: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-200 dark:border-red-800", icon: AlertOctagon },
  HIGH: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-200 dark:border-orange-800", icon: Zap },
  MEDIUM: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-200 dark:border-amber-800", icon: Target },
  LOW: { color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-200 dark:border-teal-800", icon: Clock },
}

export default function RecommendationsQueuePage() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [dispatchStatus, setDispatchStatus] = useState("")

  const loadQueue = async () => {
    setLoading(true)
    try {
      const data = await ParkWatchApi.getRecommendations()
      setQueue(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [])

  const handleApplyDispatch = async () => {
    if (!selectedItem) return
    setDispatchStatus("routing")
    try {
      const asset = selectedItem.priority === "CRITICAL" ? "TOW-UNIT-04" : "WARDEN-UNIT-11"
      await ParkWatchApi.applyRecommendation(
        selectedItem.hotspot_id,
        selectedItem.recommended_action,
        asset
      )
      setDispatchStatus("success")
      setQueue(prev => prev.filter(item =>
        !(item.hotspot_id === selectedItem.hotspot_id && item.recommended_action === selectedItem.recommended_action)
      ))
      setTimeout(() => {
        setDispatchStatus("")
        setSelectedItem(null)
      }, 2000)
    } catch (e) {
      setDispatchStatus("error")
    }
  }

  const criticalCount = queue.filter(q => q.priority === "CRITICAL").length
  const highCount = queue.filter(q => q.priority === "HIGH").length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-xs text-muted-foreground">
        <div className="h-7 w-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
        <span>Analyzing enforcement priorities...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <PageHeader
        badge="AI Dispatch"
        title="Smart enforcement recommendations"
        description="Our AI ranks parking hotspots by congestion impact and suggests the best action — tow trucks, warden patrols, or infrastructure fixes."
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-muted-foreground">Total actions:</span>
          <span className="font-bold text-foreground">{queue.length}</span>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-200 dark:border-red-800 text-sm">
            <AlertOctagon className="h-4 w-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-semibold">{criticalCount} critical</span>
          </div>
        )}
        {highCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-200 dark:border-orange-800 text-sm">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-orange-600 dark:text-orange-400 font-semibold">{highCount} high priority</span>
          </div>
        )}
      </div>

      {/* Queue cards — theme-aware */}
      <div className="grid grid-cols-1 gap-3">
        {queue.length === 0 ? (
          <Card className="border-dashed border-border bg-card/50 p-12 text-center">
            <CheckCircle className="h-10 w-10 text-teal-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm font-semibold text-foreground">All clear — no pending actions</p>
            <p className="text-xs text-muted-foreground mt-1">Every precinct is within safe congestion limits right now.</p>
          </Card>
        ) : (
          queue.map((item, index) => {
            const config = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.MEDIUM
            const PriorityIcon = config.icon

            return (
              <Card
                key={index}
                className={`border-l-4 ${getPriorityStyles(item.priority)} border border-border bg-card hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer group`}
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`text-[10px] font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                        <PriorityIcon className="h-3 w-3 mr-1 inline" />
                        {item.priority}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">{item.hotspot_id}</span>
                      <span className="text-sm font-semibold text-foreground">{item.location}</span>
                    </div>

                    <p className="text-sm font-medium text-foreground leading-snug">{item.recommended_action}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">{item.reason}</p>

                    <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <strong className="text-foreground">{item.violation_count}</strong> violations
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertOctagon className="h-3 w-3" />
                        Risk: <strong className="text-foreground">{item.composite_risk_score.toFixed(1)}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Deploy: <strong className="text-foreground">{item.suggested_deployment_window}</strong>
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs group-hover:border-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/5"
                  >
                    Review & Deploy
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Detail modal — fully theme-aware */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
          <DialogHeader>
            <Badge className={`w-fit text-[10px] ${PRIORITY_CONFIG[selectedItem.priority]?.bg} ${PRIORITY_CONFIG[selectedItem.priority]?.color} border ${PRIORITY_CONFIG[selectedItem.priority]?.border}`}>
              {selectedItem.priority} Priority
            </Badge>
            <DialogTitle className="mt-2">{selectedItem.recommended_action}</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedItem.location} · {selectedItem.hotspot_id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4 text-xs">
            {dispatchStatus === "success" && (
              <div className="p-3 bg-teal-500/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 rounded-xl flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Unit dispatched successfully and en route.</span>
              </div>
            )}
            {dispatchStatus === "error" && (
              <div className="p-3 bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Dispatch failed — check network connection.</span>
              </div>
            )}

            <DetailBox label="Why this action?">
              <p className="leading-relaxed text-muted-foreground">{selectedItem.reason}</p>
            </DetailBox>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailBox label="Expected impact">
                {selectedItem.expected_impact}
              </DetailBox>
              <DetailBox label="Response deadline">
                Action required within 30 minutes
              </DetailBox>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-200/50 dark:border-indigo-800/50">
              {selectedItem.priority === "CRITICAL" ? (
                <Truck className="h-5 w-5 text-red-500 shrink-0" />
              ) : (
                <Users className="h-5 w-5 text-indigo-500 shrink-0" />
              )}
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Suggested unit</p>
                <p className="text-sm font-bold text-foreground">
                  {selectedItem.priority === "CRITICAL" ? "Tow Unit TOW-UNIT-04" : "Warden Unit WARDEN-UNIT-11"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApplyDispatch}
              disabled={dispatchStatus === "routing" || dispatchStatus === "success"}
              className="text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
            >
              {dispatchStatus === "routing" ? "Dispatching..." : "Approve & Route Unit"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  )
}
