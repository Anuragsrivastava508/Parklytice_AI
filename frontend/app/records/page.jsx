"use client"

import React, { useEffect, useState } from "react"
import { FileSpreadsheet, Search, RefreshCw, Eye } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { PageHeader, DetailBox } from "@/components/page-header"
import { ParkWatchApi, MOCK_RECORDS } from "@/services/api"

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending review" },
  { value: "APPROVED", label: "Approved" },
  { value: "DISPATCHED", label: "Dispatched" },
]

export default function ViolationRecordsPage() {
  const [records, setRecords] = useState(MOCK_RECORDS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedRecord, setSelectedRecord] = useState(null)

  const loadRecords = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (selectedStatus) filters.validation_status = selectedStatus
      const data = await ParkWatchApi.getViolations(filters)
      setRecords(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [selectedStatus])

  const filteredRecords = records.filter(row => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      row.vehicle_number?.toLowerCase().includes(term) ||
      row.location?.toLowerCase().includes(term) ||
      row.id?.toLowerCase().includes(term)
    )
  })

  const pendingCount = records.filter(r => r.validation_status === "PENDING").length

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      <PageHeader
        badge="Audit Log"
        title="Violation records"
        description="Every detected parking offence with validation status, risk score, and location — your complete enforcement audit trail."
        action={
          <Button variant="outline" size="sm" onClick={loadRecords} className="text-xs hover:border-indigo-500 hover:text-indigo-600">
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Sync records
          </Button>
        }
      />

      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-800 text-sm">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{pendingCount} records awaiting review</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by plate, location, or incident ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card text-foreground border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 placeholder:text-muted-foreground transition-all"
          />
        </div>
        <div className="w-full md:w-52">
          <Select value={selectedStatus} onChange={setSelectedStatus} options={STATUS_OPTIONS} placeholder="All statuses" />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="text-xs pl-4">ID</TableHead>
                <TableHead className="text-xs">Vehicle</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="text-xs">Location</TableHead>
                <TableHead className="text-xs">Precinct</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Risk</TableHead>
                <TableHead className="text-right text-xs pr-4">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center p-10 text-muted-foreground text-sm">
                    No records match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((row) => {
                  let statusVar = "secondary"
                  if (row.validation_status === "APPROVED") statusVar = "success"
                  else if (row.validation_status === "PENDING") statusVar = "warning"
                  else if (row.validation_status === "DISPATCHED") statusVar = "info"

                  return (
                    <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground pl-4">{row.id}</TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground text-sm">{row.vehicle_number}</div>
                        <div className="text-[10px] text-muted-foreground">{row.vehicle_type}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {new Date(row.created_datetime).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-foreground">{row.location}</TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{row.police_station}</TableCell>
                      <TableCell>
                        <Badge variant={statusVar} className="text-[10px]">{row.validation_status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-semibold text-sm text-foreground">{row.risk_score?.toFixed(1) || "—"}</span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(row)} className="h-8 w-8">
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-indigo-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail modal — theme-aware */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)}>
          <DialogHeader>
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedRecord.id}</span>
              <Badge variant={
                selectedRecord.validation_status === "APPROVED" ? "success" :
                selectedRecord.validation_status === "PENDING" ? "warning" : "info"
              }>{selectedRecord.validation_status}</Badge>
            </div>
            <DialogTitle className="mt-2">Plate: {selectedRecord.vehicle_number}</DialogTitle>
            <DialogDescription className="text-xs">AI-detected parking violation</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4 text-sm">
            <DetailBox label="Incident description">
              <p className="text-muted-foreground leading-relaxed">{selectedRecord.description}</p>
            </DetailBox>

            <div className="grid grid-cols-2 gap-3">
              <DetailBox label="Vehicle type">{selectedRecord.vehicle_type}</DetailBox>
              <DetailBox label="Law section">Section {selectedRecord.offence_code}</DetailBox>
              <DetailBox label="Precinct">{selectedRecord.police_station}</DetailBox>
              <DetailBox label="Junction">{selectedRecord.junction_name}</DetailBox>
            </div>

            <DetailBox label="Risk assessment">
              <div className="flex justify-between items-center text-xs mb-1">
                <span>Score: <strong className="text-foreground">{selectedRecord.risk_score?.toFixed(1) || "N/A"} / 100</strong></span>
                <Badge variant="outline" className="text-[10px]">{selectedRecord.risk_category}</Badge>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">"{selectedRecord.risk_explanation}"</p>
            </DetailBox>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)} className="text-xs">Close</Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  )
}
