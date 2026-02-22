"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import {
    Plus,
    Search,
    MapPin,
    Calendar,
    Truck,
    User,
    ChevronRight,
    AlertTriangle,
    Package,
    Globe,
} from "lucide-react"
import { demoTrips } from "@/lib/demo-data"
import {
    formatDate,
    formatKm,
    formatCurrency,
    getTripStatusColor,
    getTripStatusLabel,
    getVehicleTypeColor,
    getVehicleTypeLabel,
    cn,
} from "@/lib/utils"
import Link from "next/link"

const statusFilters = ["Tutti", "PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

export default function ViaggiPage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("Tutti")
    const [showModal, setShowModal] = useState(false)

    const filtered = demoTrips.filter((trip) => {
        const matchSearch =
            trip.cargoType.toLowerCase().includes(search.toLowerCase()) ||
            trip.driver?.name.toLowerCase().includes(search.toLowerCase()) ||
            trip.driver?.surname.toLowerCase().includes(search.toLowerCase()) ||
            trip.vehicle?.plate.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "Tutti" || trip.status === statusFilter
        return matchSearch && matchStatus
    })

    return (
        <MainLayout title="Gestione Viaggi">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Viaggi</h2>
                        <p className="text-sm text-muted-foreground">{demoTrips.length} viaggi totali</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Nuovo Viaggio
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cerca per merce, autista, targa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {statusFilters.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                    statusFilter === s
                                        ? "bg-primary/15 text-primary border-primary/25"
                                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                                )}
                            >
                                {s === "Tutti" ? "Tutti" : getTripStatusLabel(s)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trip Cards */}
                <div className="space-y-3">
                    {filtered.map((trip) => (
                        <Link
                            key={trip.id}
                            href={`/viaggi/${trip.id}`}
                            className="block glass rounded-xl p-5 hover:bg-secondary/30 transition-all hover:scale-[1.005] group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", getTripStatusColor(trip.status))}>
                                            {getTripStatusLabel(trip.status)}
                                        </span>
                                        {trip.isAdr && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/25">
                                                <AlertTriangle className="w-3 h-3" />
                                                ADR
                                            </span>
                                        )}
                                        {trip.isInternational && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                                                <Globe className="w-3 h-3" />
                                                Internazionale
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-semibold text-foreground mt-2">{trip.cargoType}</h3>

                                    <div className="flex items-center gap-1 mt-1">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {trip.stops.map(s => s.city).join(" — ")}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(trip.startDate)}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <User className="w-3.5 h-3.5" />
                                            {trip.driver?.name} {trip.driver?.surname}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Truck className="w-3.5 h-3.5" />
                                            {trip.vehicle?.plate}
                                            <span className={cn("ml-1 px-1.5 py-0.5 rounded text-[10px] border", getVehicleTypeColor(trip.vehicle?.type || "STANDARD"))}>
                                                {getVehicleTypeLabel(trip.vehicle?.type || "STANDARD")}
                                            </span>
                                        </div>
                                        {trip.cargoWeight && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Package className="w-3.5 h-3.5" />
                                                {trip.cargoWeight.toLocaleString("it-IT")} kg
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-foreground">{formatKm(trip.totalKm)}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(trip.estimatedCost)}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-16 glass rounded-xl">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-foreground font-medium">Nessun viaggio trovato</p>
                            <p className="text-sm text-muted-foreground mt-1">Prova a modificare i filtri di ricerca</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Trip Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Nuovo Viaggio</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo Merce</label>
                                <input type="text" placeholder="es. Materiali edili, ADR Classe 3..." className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Partenza</label>
                                    <input type="datetime-local" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Peso (kg)</label>
                                    <input type="number" placeholder="0" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Autista</label>
                                    <select className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="">Seleziona autista</option>
                                        <option>Marco Rossi</option>
                                        <option>Luigi Ferrari</option>
                                        <option>Giovanna Conti</option>
                                        <option>Roberto Marino</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Veicolo</label>
                                    <select className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="">Seleziona veicolo</option>
                                        <option>AB 123 CD — Iveco Daily</option>
                                        <option>IJ 789 KL — Volvo FH Frigo</option>
                                        <option>QR 345 ST — DAF XF 480</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                    <input type="checkbox" className="rounded border-border" />
                                    Trasporto ADR
                                </label>
                                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                    <input type="checkbox" className="rounded border-border" />
                                    Internazionale
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                Annulla
                            </button>
                            <button className="flex-1 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                Crea Viaggio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
