"use client"

import React, { useEffect, useState } from "react"
import { Users, UserX, AlertTriangle, RefreshCw, Car } from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader, InfoPanel } from "@/components/page-header"
import { ParkWatchApi, MOCK_OFFENDERS } from "@/services/api"

export default function RepeatOffendersPage() {
  const [offenders, setOffenders] = useState(MOCK_OFFENDERS)
  const [loading, setLoading] = useState(false)

  const loadOffenders = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      setOffenders(MOCK_OFFENDERS)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOffenders()
  }, [])

  const towCount = offenders.filter(o => o.status.includes("TOW")).length
  const totalUnpaid = offenders.reduce((a, o) => a + o.unpaid_tickets, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <PageHeader
        badge="Repeat Offenders"
        title="Chronic parking violators"
        description="Vehicles flagged by AI plate-matching for repeated offences — prioritized for tow, boot, or impound action."
        action={
          <Button variant="outline" size="sm" onClick={loadOffenders} className="text-xs hover:border-indigo-500 hover:text-indigo-600">
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoPanel label="Flagged vehicles" value={offenders.length} icon={Car} />
        <InfoPanel label="Tow recommended" value={towCount} accent="red" icon={AlertTriangle} />
        <InfoPanel label="Unpaid citations" value={totalUnpaid} accent="amber" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground">Top violating vehicles</CardTitle>
            <CardDescription className="text-xs">Highest offence count in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/30">
                  <TableHead className="text-xs pl-4">Plate number</TableHead>
                  <TableHead className="text-xs">Vehicle type</TableHead>
                  <TableHead className="text-xs">Offences</TableHead>
                  <TableHead className="text-xs">Unpaid</TableHead>
                  <TableHead className="text-right text-xs pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offenders.map((row) => {
                  let badgeVar = "warning"
                  if (row.status.includes("TOW") || row.status.includes("IMPOUND")) badgeVar = "destructive"

                  return (
                    <TableRow key={row.vehicle_number} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-foreground text-sm pl-4">{row.vehicle_number}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.type}</TableCell>
                      <TableCell className="font-mono text-sm">{row.count} incidents</TableCell>
                      <TableCell className="font-mono text-red-500 font-bold text-sm">{row.unpaid_tickets}</TableCell>
                      <TableCell className="text-right pr-4">
                        <Badge variant={badgeVar} className="text-[10px]">{row.status.replace("_", " ")}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Policy card — theme-aware */}
        <Card className="border-border bg-card overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <UserX className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">Escalation policy</CardTitle>
                <CardDescription className="text-xs">How repeat offenders are handled</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-6 text-sm text-muted-foreground leading-relaxed">
            <div className="p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs text-foreground font-semibold mb-1">3+ active violations</p>
              <p className="text-xs">Automatic boot alert during warden patrol scans.</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs text-foreground font-semibold mb-1">5+ unpaid citations</p>
              <p className="text-xs">Tow recommendation to impound lot. Plate synced with registration database.</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">Repeat offenders drive 32.4% of total backlog.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
