"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Layers, MapPin, RefreshCw, Thermometer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { ParkWatchApi, MOCK_HOTSPOTS, MOCK_HEATMAP_GEOJSON } from "@/services/api"

const MapClient = dynamic(() => import("@/components/map-client"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-muted/30 rounded-xl flex items-center justify-center border border-border">
      <div className="flex flex-col items-center space-y-3 font-mono text-xs text-muted-foreground">
        <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <span>Loading geospatial tiles...</span>
      </div>
    </div>
  )
})

export default function HotspotMapPage() {
  const [hotspots, setHotspots] = useState(MOCK_HOTSPOTS)
  const [heatmap, setHeatmap] = useState(MOCK_HEATMAP_GEOJSON)
  const [loading, setLoading] = useState(false)
  const [selectedStation, setSelectedStation] = useState("")
  const [selectedHotspotId, setSelectedHotspotId] = useState(null)

  const loadMapData = async () => {
    setLoading(true)
    try {
      const filters = selectedStation ? { police_station: selectedStation } : {}
      const spotsData = await ParkWatchApi.getHotspots(filters)
      const heatGeo = await ParkWatchApi.getHeatmapGeojson(4, filters)
      setHotspots(spotsData)
      setHeatmap(heatGeo)
    } catch (e) {
      console.error("Failed to load spatial map layers", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMapData()
  }, [selectedStation])

  const stations = ["Madivala", "HAL Old Airport", "Cubbon Park", "Indiranagar", "Whitefield"]
  const stationOptions = [
    { value: "", label: "All Precincts" },
    ...stations.map(s => ({ value: s, label: s.toUpperCase() }))
  ]

  const activeSpot = hotspots.find(h => h.hotspot_id === selectedHotspotId)

  return (
    <div className="space-y-6 h-full flex flex-col max-w-7xl mx-auto pb-12">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-border pb-5 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Parking Hotspot Map</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-detected illegal parking clusters mapped against traffic congestion zones
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="w-44">
            <Select value={selectedStation} onChange={setSelectedStation} options={stationOptions} placeholder="All Precincts" />
          </div>
          <Button variant="outline" size="sm" onClick={loadMapData} className="font-mono text-xs hover:border-indigo-500 hover:text-indigo-600">
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">

        {/* Left panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                <CardTitle className="text-sm font-bold text-foreground">Map Layers</CardTitle>
              </div>
              <CardDescription className="text-[11px]">Dynamic congestion & violation overlays</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Active Clusters</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{hotspots.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Heatmap Nodes</span>
                <span className="text-foreground font-semibold">{heatmap.metadata?.grid_cells || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Detection Radius</span>
                <span className="text-foreground">150 meters</span>
              </div>
              <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-amber-500/10 border border-indigo-200/30 dark:border-indigo-800/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Congestion Heat</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  <div className="flex-1 bg-teal-400 rounded-l-full" title="Low" />
                  <div className="flex-1 bg-amber-400" title="Medium" />
                  <div className="flex-1 bg-orange-500" title="High" />
                  <div className="flex-1 bg-red-500 rounded-r-full" title="Critical" />
                </div>
              </div>
            </CardContent>
          </Card>

          {activeSpot ? (
            <Card className="border-indigo-200/50 dark:border-indigo-800/50 bg-indigo-500/5 overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <Badge className="text-[9px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">Selected Hotspot</Badge>
                  <button onClick={() => setSelectedHotspotId(null)} className="text-[10px] font-bold text-muted-foreground hover:text-indigo-600 cursor-pointer">Clear</button>
                </div>
                <CardTitle className="text-sm font-bold mt-2 text-foreground">{activeSpot.location}</CardTitle>
                <CardDescription className="text-[10px] font-mono text-muted-foreground">{activeSpot.hotspot_id}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Violations</span>
                  <span className="text-foreground font-bold">{activeSpot.violation_count}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Risk Rating</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeSpot.composite_rank_score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Dominant Offence</span>
                  <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">{activeSpot.risk_inputs.dominant_violation_type}</span>
                </div>
                {activeSpot.recommendations?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[9px] font-bold text-muted-foreground block mb-1">AI Dispatch Strategy</span>
                    <p className="text-[11px] text-foreground leading-relaxed font-sans font-semibold">{activeSpot.recommendations[0].action}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center p-6 text-center border-dashed border-border bg-card/50 min-h-[150px]">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground font-mono text-[11px]">
                <MapPin className="h-5 w-5 text-indigo-400/60" />
                <span>Select a hotspot on the map to review congestion impact and dispatch actions.</span>
              </div>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3 h-[450px] lg:h-[550px] relative rounded-2xl overflow-hidden border border-border shadow-lg shadow-indigo-500/5">
          <MapClient
            hotspots={hotspots}
            heatmap={heatmap}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={setSelectedHotspotId}
          />
        </div>
      </div>
    </div>
  )
}
