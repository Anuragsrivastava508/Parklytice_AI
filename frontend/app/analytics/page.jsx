"use client"

import React, { useEffect, useState } from "react"
import { BarChart3, TrendingUp, Clock, AlertTriangle, ShieldCheck, Filter, RefreshCw } from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ParkWatchApi } from "@/services/api"
import { ChartTooltip, CHART_PALETTE, CHART_COLORS } from "@/components/chart-utils"
import { useTheme } from "@/components/theme-provider"

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts"

export default function AnalyticsPage() {
  const { theme } = useTheme()
  const [selectedStation, setSelectedStation] = useState("")
  const [selectedVehicleType, setSelectedVehicleType] = useState("")
  const [hourlyData, setHourlyData] = useState([])
  const [typesData, setTypesData] = useState({ violation_type_distribution: [], vehicle_type_distribution: [] })
  const [loading, setLoading] = useState(true)
  const [activePieIndex, setActivePieIndex] = useState(null)

  const gridColor = theme === "dark" ? "#1e293b" : "#f1f5f9"
  const axisColor = theme === "dark" ? "#64748b" : "#94a3b8"

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (selectedStation) filters.police_station = selectedStation
      if (selectedVehicleType) filters.vehicle_type = selectedVehicleType

      const hourly = await ParkWatchApi.getHourlyAnalytics(filters)
      const types = await ParkWatchApi.getTypeBreakdowns(filters)

      setHourlyData(hourly)
      setTypesData(types)
    } catch (e) {
      console.error("Failed to load database analytics", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [selectedStation, selectedVehicleType])

  const stations = ["Madivala", "HAL Old Airport", "Cubbon Park", "Indiranagar", "Whitefield"]
  const vehicleTypes = ["CAR", "MOTOR CYCLE", "TRUCK / BUS", "AUTO RICKSHAW"]

  const stationOptions = [
    { value: "", label: "All Precincts" },
    ...stations.map(s => ({ value: s, label: s.toUpperCase() }))
  ]
  const vehicleOptions = [
    { value: "", label: "All Vehicle Classes" },
    ...vehicleTypes.map(v => ({ value: v, label: v }))
  ]

  const insights = [
    { metric: "Double Parking", impact: "High", trend: "+3.2%", details: "Primary bottleneck in Silk Board peak hour blockages." },
    { metric: "Pedestrian Encroachment", impact: "Medium", trend: "-1.8%", details: "Footpath parking decreasing in Cubbon Park due to active warden patrol loops." },
    { metric: "Commuter Rush-Hour Peak", impact: "Critical", trend: "+5.1%", details: "Commuter flow delays rise between 08:30 and 10:30 AM." }
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Operational Intelligence</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Temporal congestion trends, offence categories, and jurisdictional compliance
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAnalytics} className="font-mono text-xs self-start md:self-center hover:border-indigo-500 hover:text-indigo-600">
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Reload Report
        </Button>
      </div>

      {/* Filter panel */}
      <Card className="border-border bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Select value={selectedStation} onChange={setSelectedStation} options={stationOptions} placeholder="All Precincts" />
            <Select value={selectedVehicleType} onChange={setSelectedVehicleType} options={vehicleOptions} placeholder="All Vehicle Classes" />
          </div>
        </CardContent>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-hover-effect border-border bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Optimal Patrol Window</span>
              <h4 className="text-sm font-bold text-foreground font-mono mt-0.5">08:00 - 11:00 AM</h4>
              <p className="text-[10px] text-muted-foreground">Rush hour peak congestion period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect border-border bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">AI Detection Rate</span>
              <h4 className="text-sm font-bold text-foreground font-mono mt-0.5">99.4% Accuracy</h4>
              <p className="text-[10px] text-muted-foreground">Automated parking violation detection</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect border-border bg-card sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase font-bold">Core Bottleneck</span>
              <h4 className="text-sm font-bold text-foreground font-mono mt-0.5">Double Parking</h4>
              <p className="text-[10px] text-muted-foreground">Represents 30.5% of total backlogs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] font-mono text-xs text-muted-foreground py-12 border border-dashed border-border rounded-2xl bg-card">
          <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
          <span>Querying intelligence database...</span>
        </div>
      ) : (
        <>
          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="p-4 md:p-6 pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">Temporal Profile (24H)</CardTitle>
                  <CardDescription className="text-xs">Violation load mapped over a 24-hour cycle — hover for details</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs self-start sm:self-center border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300">
                  INTERACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-80 p-2 md:p-6 pt-0">
              {hourlyData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">
                  No records matching selected filters.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                        <stop offset="50%" stopColor={CHART_COLORS.secondary} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke={axisColor} fontSize={11} tickLine={false} tickFormatter={(h) => `${h}:00`} />
                    <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <Tooltip content={<ChartTooltip theme={theme} labelFormatter={(h) => `Hour: ${h}:00`} />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#hourGrad)"
                      name="Violations"
                      dot={{ r: 3, fill: CHART_COLORS.primary }}
                      activeDot={{ r: 7, stroke: CHART_COLORS.primary, strokeWidth: 2, fill: theme === "dark" ? "#131c2e" : "#fff" }}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="p-4 md:p-6 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  <CardTitle className="text-sm font-bold text-foreground">Offence Classification</CardTitle>
                </div>
                <CardDescription className="text-xs">Hover segments for breakdown — click to highlight</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-2 md:p-6 pt-0 flex items-center justify-center">
                {typesData.violation_type_distribution.length === 0 ? (
                  <div className="text-muted-foreground font-mono text-xs">No records available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typesData.violation_type_distribution}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={activePieIndex !== null ? 95 : 88}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="type"
                        animationDuration={1200}
                        onMouseEnter={(_, index) => setActivePieIndex(index)}
                        onMouseLeave={() => setActivePieIndex(null)}
                      >
                        {typesData.violation_type_distribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                            opacity={activePieIndex === null || activePieIndex === index ? 1 : 0.4}
                            stroke={theme === "dark" ? "#131c2e" : "#fff"}
                            strokeWidth={2}
                            style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                      <Legend layout="horizontal" align="center" verticalAlign="bottom" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="p-4 md:p-6 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  <CardTitle className="text-sm font-bold text-foreground">Vehicle Classification</CardTitle>
                </div>
                <CardDescription className="text-xs">Violation distribution by vehicle type</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-2 md:p-6 pt-0">
                {typesData.vehicle_type_distribution.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs">No records available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typesData.vehicle_type_distribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="type" stroke={axisColor} fontSize={10} tickLine={false} />
                      <YAxis stroke={axisColor} fontSize={11} tickLine={false} />
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                      <Tooltip content={<ChartTooltip theme={theme} />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Offences" animationDuration={1200}>
                        {typesData.vehicle_type_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-sm font-bold text-foreground">Decision Support Insights</CardTitle>
              <CardDescription className="text-xs">Key metrics from localized spatial queue patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30">
                    <TableHead className="font-mono text-xs pl-4 md:pl-6">Congestion Trigger</TableHead>
                    <TableHead className="font-mono text-xs">Impact</TableHead>
                    <TableHead className="font-mono text-xs">Weekly Trend</TableHead>
                    <TableHead className="font-mono text-xs pr-4 md:pr-6">Assessment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insights.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-xs text-foreground pl-4 md:pl-6">{item.metric}</TableCell>
                      <TableCell>
                        <Badge className={`text-[9px] font-mono ${
                          item.impact === "Critical" ? "bg-red-500/10 text-red-500 border border-red-200 dark:border-red-800" :
                          item.impact === "High" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" :
                          "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                        }`}>{item.impact}</Badge>
                      </TableCell>
                      <TableCell className={`font-mono text-xs font-semibold ${item.trend.startsWith("+") ? "text-red-500" : "text-teal-500"}`}>{item.trend}</TableCell>
                      <TableCell className="text-xs text-muted-foreground pr-4 md:pr-6 py-3 leading-relaxed">{item.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
