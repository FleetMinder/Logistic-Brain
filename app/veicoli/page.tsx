"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import {
    Plus,
    Search,
    Truck,
    AlertTriangle,
    CheckCircle2,
    Wrench,
    Calendar,
} from "lucide-react"
import { demoVehicles } from "@/lib/demo-data"
import {
    formatDate,
    getVehicleTypeColor,
    getVehicleTypeLabel,
    getTachographTypeLabel,
    getTachographTypeColor,
    isExpiringSoon,
    isExpired,
    cn,
} from "@/lib/utils"

export default function VeicoliPage() {
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState("Tutti")
    const [showModal, setShowModal] = useState(false)

    const types = ["Tutti", "STANDARD", "ADR", "FRIGO", "ECCEZIONALE"]

    const filtered = demoVehicles.filter(v => {
        const matchSearch = `${v.plate} ${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
        const matchType = typeFilter === "Tutti" || v.type === typeFilter
        return matchSearch && matchType
    })

    return (
        <MainLayout title="Gestione Veicoli">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Veicoli</h2>
                        <p className="text-sm text-muted-foreground">{demoVehicles.length} veicoli registrati</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Nuovo Veicolo
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Cerca per targa, marca, modello..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                    <div className="flex gap-2">
                        {types.map(t => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                                    typeFilter === t
                                        ? "bg-primary/15 text-primary border-primary/25"
                                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                                )}
                            >
                                {t === "Tutti" ? "Tutti" : getVehicleTypeLabel(t)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((vehicle) => {
                        const revisionExpiring = vehicle.revisionDeadline ? isExpiringSoon(vehicle.revisionDeadline) : false
                        const revisionExpired = vehicle.revisionDeadline ? isExpired(vehicle.revisionDeadline) : false
                        const insuranceExpiring = vehicle.insuranceDeadline ? isExpiringSoon(vehicle.insuranceDeadline) : false
                        const hasAlerts = revisionExpiring || revisionExpired || insuranceExpiring

                        return (
                            <div key={vehicle.id} className="glass rounded-xl p-5 hover:bg-secondary/30 transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                                            <Truck className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-foreground tracking-wider">{vehicle.plate}</p>
                                            <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        {hasAlerts && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", getVehicleTypeColor(vehicle.type))}>
                                            {getVehicleTypeLabel(vehicle.type)}
                                        </span>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {vehicle.maxCapacityKg && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Portata</p>
                                            <p className="text-sm font-medium text-foreground">{vehicle.maxCapacityKg.toLocaleString("it-IT")} kg</p>
                                        </div>
                                    )}
                                    {vehicle.maxCapacityM3 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">Volume</p>
                                            <p className="text-sm font-medium text-foreground">{vehicle.maxCapacityM3} m3</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-muted-foreground">Anno</p>
                                        <p className="text-sm font-medium text-foreground">{vehicle.yearOfManufacture}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Carburante</p>
                                        <p className="text-sm font-medium text-foreground">{vehicle.fuelType}</p>
                                    </div>
                                </div>

                                {/* Status + Tachograph */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                                        vehicle.isAvailable
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : "bg-amber-50 text-amber-600 border-amber-200"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", vehicle.isAvailable ? "bg-emerald-500" : "bg-amber-500")} />
                                        {vehicle.isAvailable ? "Disponibile" : "In Servizio"}
                                    </span>
                                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border", getTachographTypeColor(vehicle.tachographType))}>
                                        Tach. {getTachographTypeLabel(vehicle.tachographType)}
                                    </span>
                                </div>

                                {/* Deadlines */}
                                <div className="space-y-2 pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Wrench className="w-3.5 h-3.5" />
                                            Revisione
                                        </span>
                                        <span className={cn(
                                            "text-xs font-medium flex items-center gap-1",
                                            revisionExpired ? "text-red-600" : revisionExpiring ? "text-amber-600" : "text-emerald-600"
                                        )}>
                                            {revisionExpired ? <AlertTriangle className="w-3 h-3" /> : revisionExpiring ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                            {revisionExpired ? "Scaduta" : ""} {formatDate(vehicle.revisionDeadline)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Assicurazione
                                        </span>
                                        <span className={cn(
                                            "text-xs font-medium flex items-center gap-1",
                                            insuranceExpiring ? "text-amber-600" : "text-emerald-600"
                                        )}>
                                            {insuranceExpiring ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                            {formatDate(vehicle.insuranceDeadline)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Ultima manutenzione
                                        </span>
                                        <span className="text-xs text-muted-foreground">{formatDate(vehicle.lastMaintenance)}</span>
                                    </div>
                                </div>

                                {vehicle.notes && (
                                    <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">{vehicle.notes}</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* New Vehicle Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Nuovo Veicolo</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Targa</label>
                                    <input type="text" placeholder="AB 123 CD" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</label>
                                    <select className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="STANDARD">Standard</option>
                                        <option value="ADR">ADR</option>
                                        <option value="FRIGO">Refrigerato</option>
                                        <option value="ECCEZIONALE">Eccezionale</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Marca</label>
                                    <input type="text" placeholder="Iveco" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modello</label>
                                    <input type="text" placeholder="Daily 35S18" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scadenza Revisione</label>
                                    <input type="date" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portata (kg)</label>
                                    <input type="number" placeholder="24000" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                Annulla
                            </button>
                            <button className="flex-1 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                Aggiungi Veicolo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
