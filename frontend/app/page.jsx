"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  ShieldCheck, Clock, ShieldAlert, CheckCircle,
  ArrowUpRight, TrendingUp, Activity, Layers, Zap, Radio
} from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ParkWatchApi, MOCK_SUMMARY, MOCK_HOTSPOTS } from "@/services/api"
import { ChartTooltip, CHART_COLORS } from "@/components/chart-utils"
import { useTheme } from "@/components/theme-provider"

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Brush
} from "recharts"

const chartData = [
  { time: "08:00", active: 1400, resolved: 800, congestion: 62 },
  { time: "10:00", active: 2800, resolved: 1400, congestion: 78 },
  { time: "12:00", active: 3100, resolved: 2100, congestion: 71 },
  { time: "14:00", active: 2600, resolved: 2300, congestion: 65 },
  { time: "16:00", active: 2900, resolved: 2200, congestion: 74 },
  { time: "18:00", active: 4200, resolved: 2900, congestion: 91 },
  { time: "20:00", active: 3200, resolved: 3300, congestion: 68 },
  { time: "22:00", active: 1800, resolved: 2500, congestion: 45 }
]

export default function Dashboard() {
  const { theme } = useTheme()
  const [summary, setSummary] = useState(MOCK_SUMMARY)
  const [hotspots, setHotspots] = useState(MOCK_HOTSPOTS)
  const [liveTickets, setLiveTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [hiddenSeries, setHiddenSeries] = useState([])

  const gridColor = theme === "dark" ? "#1e293b" : "#f1f5f9"
  const axisColor = theme === "dark" ? "#64748b" : "#94a3b8"

  useEffect(() => {
    const loadData = async () => {
      try {
        const sum = await ParkWatchApi.getSummary()
        const spots = await ParkWatchApi.getHotspots()
        setSummary(sum)
        setHotspots(spots)
      } catch (e) {
        console.error("Failed to load operations summary", e)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    const mockLiveViolations = [
      { id: "INC-9082", plate: "KA03HA9876", type: "Double Parking", location: "Silk Board", risk: 92.5, time: "Just now" },
      { id: "INC-8104", plate: "KA05JK5543", type: "Bus Lane Block", location: "Hudson Circle", risk: 84.2, time: "2m ago" },
      { id: "INC-7761", plate: "KA51MC1234", type: "Obstruction", location: "ORR Kadubisanahalli", risk: 75.4, time: "5m ago" }
    ]
    setLiveTickets(mockLiveViolations)

    const interval = setInterval(() => {
      const suffixes = ["HA", "MC", "ND", "EG"]
      const randomPlate = `KA0${Math.floor(Math.random() * 9) + 1}${suffixes[Math.floor(Math.random() * 4)]}${Math.floor(1000 + Math.random() * 9000)}`
      const locations = ["Silk Board", "Hudson Circle", "Marathahalli Bridge", "Koramangala 80ft Road"]
      const types = ["Double Parking", "Obstruction", "Footpath Parking", "No Parking Zone"]

      const newTicket = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        plate: randomPlate,
        type: types[Math.floor(Math.random() * 4)],
        location: locations[Math.floor(Math.random() * 4)],
        risk: Math.floor(40 + Math.random() * 55),
        time: "Just now"
      }
      setLiveTickets(prev => [newTicket, ...prev.slice(0, 4)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const toggleSeries = (dataKey) => {
    setHiddenSeries(prev =>
      prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <PageHeader
        badge="Live Dashboard"
        title="Parking congestion at a glance"
        description="See where illegal parking is choking traffic, track enforcement progress, and act on AI-prioritized hotspots — all in one view."
        action={
          <Badge className="animate-pulse bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50 font-mono text-[10px] px-3 py-1">
            <Radio className="h-3 w-3 mr-1.5 inline" />
            LIVE
          </Badge>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover-effect kpi-glow-red border-border bg-card overflow-hidden">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Active Backlog</span>
                <h3 className="font-mono text-3xl font-bold text-red-500">{summary.active_violations.toLocaleString()}</h3>
              </div>
              <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-red-500" />
              <span className="text-red-500 font-bold">+4.2%</span>
              <span>increase this hour</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect kpi-glow-teal border-border bg-card overflow-hidden">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Resolved (24h)</span>
                <h3 className="font-mono text-3xl font-bold text-teal-500">{summary.resolved_violations.toLocaleString()}</h3>
              </div>
              <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-xl">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
              <span className="text-teal-500 font-bold">91.4%</span>
              <span>enforcement efficiency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect kpi-glow-indigo border-border bg-card overflow-hidden">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Avg. Response Delay</span>
                <h3 className="font-mono text-3xl font-bold text-foreground">{summary.average_action_delay_mins.toFixed(1)}m</h3>
              </div>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="text-teal-500 font-bold">-2.1m</span>
              <span>faster than yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect kpi-glow-amber border-border bg-card overflow-hidden">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Peak Congestion</span>
                <h3 className="font-mono text-3xl font-bold text-amber-500">{(summary.peak_hour_ratio * 100).toFixed(1)}%</h3>
              </div>
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Rush-hour parking spillover</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 border-border bg-card overflow-hidden">
          <CardHeader className="p-4 md:p-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">Congestion Impact Overview</CardTitle>
                <CardDescription className="text-xs">Parking violations vs resolution & traffic flow impact — click legend to toggle</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] self-start sm:self-center border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300">
                INTERACTIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[340px] p-2 md:p-6 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="congestionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <Tooltip content={<ChartTooltip theme={theme} />} />
                <Legend
                  onClick={(e) => toggleSeries(e.dataKey)}
                  wrapperStyle={{ fontSize: "10px", cursor: "pointer", paddingTop: "8px" }}
                  formatter={(value, entry) => (
                    <span style={{ opacity: hiddenSeries.includes(entry.dataKey) ? 0.4 : 1, textDecoration: hiddenSeries.includes(entry.dataKey) ? "line-through" : "none" }}>
                      {value}
                    </span>
                  )}
                />
                <Brush dataKey="time" height={24} stroke={CHART_COLORS.primary} fill={theme === "dark" ? "#1e293b" : "#f8fafc"} travellerWidth={8} />
                {!hiddenSeries.includes("active") && (
                  <Area type="monotone" dataKey="active" stroke={CHART_COLORS.danger} strokeWidth={2.5} fillOpacity={1} fill="url(#activeGrad)" name="Active Backlog" dot={{ r: 3, fill: CHART_COLORS.danger }} activeDot={{ r: 6, stroke: CHART_COLORS.danger, strokeWidth: 2, fill: theme === "dark" ? "#131c2e" : "#fff" }} animationDuration={1200} />
                )}
                {!hiddenSeries.includes("resolved") && (
                  <Area type="monotone" dataKey="resolved" stroke={CHART_COLORS.success} strokeWidth={2.5} fillOpacity={1} fill="url(#resolvedGrad)" name="Resolved" dot={{ r: 3, fill: CHART_COLORS.success }} activeDot={{ r: 6, stroke: CHART_COLORS.success, strokeWidth: 2, fill: theme === "dark" ? "#131c2e" : "#fff" }} animationDuration={1200} />
                )}
                {!hiddenSeries.includes("congestion") && (
                  <Area type="monotone" dataKey="congestion" stroke={CHART_COLORS.accent} strokeWidth={2} fillOpacity={1} fill="url(#congestionGrad)" name="Congestion Index" dot={{ r: 3, fill: CHART_COLORS.accent }} activeDot={{ r: 6, stroke: CHART_COLORS.accent, strokeWidth: 2, fill: theme === "dark" ? "#131c2e" : "#fff" }} animationDuration={1200} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Feed — AI detection, no CCTV OCR */}
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader className="p-4 md:p-6 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500 animate-pulse shrink-0" />
              <CardTitle className="text-sm font-bold text-foreground">Live Violation Feed</CardTitle>
            </div>
            <CardDescription className="text-xs">Real-time AI parking violation alerts from patrol sensors</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="flex flex-col gap-2.5 h-[280px] overflow-y-auto pr-1">
              {liveTickets.map((ticket, index) => {
                let riskColor = "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"
                if (ticket.risk > 80) riskColor = "bg-red-500/10 text-red-500 border-red-200 dark:border-red-800"
                else if (ticket.risk > 60) riskColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"

                return (
                  <div
                    key={ticket.id + index}
                    className="flex justify-between items-center p-3 rounded-xl border border-border hover:border-indigo-400/40 hover:bg-indigo-500/5 transition-all group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-foreground">{ticket.plate}</span>
                        <Badge variant="outline" className="text-[9px] font-mono border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 px-1.5 py-0">{ticket.type}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{ticket.location} • {ticket.time}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${riskColor}`}>
                      {ticket.risk}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspots Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="p-4 md:p-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">Critical Parking Hotspots</CardTitle>
              <CardDescription className="text-xs">Highest ranked illegal parking clusters impacting traffic flow</CardDescription>
            </div>
            <Link href="/map" className="self-start sm:self-center">
              <Button variant="outline" size="sm" className="font-mono text-xs hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300">
                View Heatmap
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground font-mono text-xs">
              <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
              Loading hotspot clusters...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/30">
                  <TableHead className="font-mono text-xs pl-4 md:pl-6">Rank</TableHead>
                  <TableHead className="font-mono text-xs">Location</TableHead>
                  <TableHead className="font-mono text-xs">Density</TableHead>
                  <TableHead className="font-mono text-xs">Repeat Rate</TableHead>
                  <TableHead className="font-mono text-xs">Offence Type</TableHead>
                  <TableHead className="font-mono text-xs">Risk Score</TableHead>
                  <TableHead className="text-right font-mono text-xs pr-4 md:pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotspots.slice(0, 4).map((hotspot) => {
                  const risk = hotspot.composite_rank_score
                  let riskBadge = <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-mono">{risk.toFixed(1)}</Badge>
                  if (risk >= 80) riskBadge = <Badge className="bg-red-500/10 text-red-500 border border-red-200 dark:border-red-800 text-[10px] font-mono">{risk.toFixed(1)}</Badge>

                  return (
                    <TableRow key={hotspot.hotspot_id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-indigo-600 dark:text-indigo-400 pl-4 md:pl-6">#{hotspot.rank}</TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground text-xs">{hotspot.location}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{hotspot.hotspot_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground text-xs">{hotspot.violation_count}</div>
                        <div className="text-[10px] text-muted-foreground">{hotspot.cluster_size_km2.toFixed(3)} km²</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {(hotspot.risk_inputs.repeat_vehicle_ratio * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 font-mono">{hotspot.risk_inputs.dominant_violation_type}</Badge>
                      </TableCell>
                      <TableCell>{riskBadge}</TableCell>
                      <TableCell className="text-right pr-4 md:pr-6">
                        <Link href={`/hotspots/${hotspot.hotspot_id}`}>
                          <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10">Analyze</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
