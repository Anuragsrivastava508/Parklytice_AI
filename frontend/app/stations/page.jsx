"use client"

import React, { useEffect, useState } from "react"
import { ShieldAlert, Clock, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader, InfoPanel } from "@/components/page-header"
import { ParkWatchApi, MOCK_STATIONS } from "@/services/api"
import { ChartTooltip, CHART_COLORS } from "@/components/chart-utils"
import { useTheme } from "@/components/theme-provider"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from "recharts"

export default function PoliceStationPerformancePage() {
  const { theme } = useTheme()
  const [stations, setStations] = useState(MOCK_STATIONS)
  const [loading, setLoading] = useState(false)

  const gridColor = theme === "dark" ? "#1e293b" : "#f1f5f9"
  const axisColor = theme === "dark" ? "#64748b" : "#94a3b8"

  const loadStations = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      setStations(MOCK_STATIONS)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStations()
  }, [])

  const topStation = stations[0]
  const overloadedCount = stations.filter(s => s.avg_delay >= 24).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <PageHeader
        badge="Precinct Health"
        title="Which areas need help first?"
        description="Compare violation volumes and response times across police jurisdictions — so you know where to send patrol units."
        action={
          <Button variant="outline" size="sm" onClick={loadStations} className="text-xs hover:border-indigo-500 hover:text-indigo-600">
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InfoPanel label="Precincts tracked" value={stations.length} icon={ShieldAlert} />
        <InfoPanel label="Overloaded zones" value={overloadedCount} sub="Response delay ≥ 24 min" icon={AlertTriangle} accent="red" />
        <InfoPanel label="Total active backlog" value={stations.reduce((a, s) => a + s.active, 0).toLocaleString()} icon={TrendingUp} accent="amber" />
        <InfoPanel label="Fastest response" value={`${Math.min(...stations.map(s => s.avg_delay)).toFixed(1)} min`} icon={Clock} accent="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <Card className="lg:col-span-2 border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground">Violations by jurisdiction</CardTitle>
            <CardDescription className="text-xs">Total offences vs unresolved active backlog per precinct</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="station" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <Tooltip content={<ChartTooltip theme={theme} />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Total Offences">
                  {stations.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS.primary} opacity={0.85} />
                  ))}
                </Bar>
                <Bar dataKey="active" fill={CHART_COLORS.accent} radius={[6, 6, 0, 0]} name="Active Backlog">
                  {stations.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS.accent} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical sector — theme-aware, NOT white */}
        <Card className="flex flex-col justify-between border-border bg-card overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
          <CardHeader className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/10">
                <ShieldAlert className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">Highest backlog zone</CardTitle>
                <CardDescription className="text-xs">Jurisdiction needing immediate attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center pb-6">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Top priority precinct</span>
              <h3 className="text-2xl font-bold text-foreground">{topStation?.station || "N/A"}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Patrol response times here exceed SLA by ~10 minutes. Reallocating warden units could reduce intersection blockages quickly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoPanel
                label="Active load"
                value={`${topStation?.active?.toLocaleString() || 0}`}
                sub="open incidents"
                accent="red"
              />
              <InfoPanel
                label="Avg delay"
                value={`${topStation?.avg_delay?.toFixed(1) || 0} min`}
                sub="response time"
                accent="amber"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground">Precinct leaderboard</CardTitle>
          <CardDescription className="text-xs">Ranked by violation volume — green means healthy response times, red means overloaded</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="text-xs pl-4">Rank</TableHead>
                <TableHead className="text-xs">Precinct</TableHead>
                <TableHead className="text-xs">Total violations</TableHead>
                <TableHead className="text-xs">Active backlog</TableHead>
                <TableHead className="text-xs">Response delay</TableHead>
                <TableHead className="text-right text-xs pr-4">Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((row) => {
                const isCrit = row.avg_delay >= 24.0
                return (
                  <TableRow key={row.station} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-indigo-600 dark:text-indigo-400 pl-4">#{row.rank}</TableCell>
                    <TableCell className="font-semibold text-foreground text-sm">{row.station}</TableCell>
                    <TableCell className="font-mono text-sm">{row.count.toLocaleString()}</TableCell>
                    <TableCell className="font-mono font-semibold text-red-500">{row.active.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-sm">
                        <Clock className={`h-3.5 w-3.5 ${isCrit ? "text-red-500" : "text-muted-foreground"}`} />
                        <span className={isCrit ? "text-red-500 font-bold" : "text-foreground"}>{row.avg_delay.toFixed(1)}m</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Badge variant={isCrit ? "destructive" : "success"}>
                        {isCrit ? "Overloaded" : "Healthy"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
