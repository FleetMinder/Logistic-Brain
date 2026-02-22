"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import {
    FileText,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Upload,
    Search,
} from "lucide-react"
import { demoDocuments, demoDrivers, demoVehicles, demoTrips } from "@/lib/demo-data"
import {
    formatDate,
    getDocumentTypeLabel,
    cn,
} from "@/lib/utils"

const tabs = ["Tutti", "Scaduti/In Scadenza", "Autisti", "Veicoli", "Viaggi"]

export default function DocumentiPage() {
    const [activeTab, setActiveTab] = useState("Tutti")
    const [search, setSearch] = useState("")

    const filtered = demoDocuments.filter(doc => {
        const matchSearch = getDocumentTypeLabel(doc.type).toLowerCase().includes(search.toLowerCase())
        if (activeTab === "Tutti") return matchSearch
        if (activeTab === "Scaduti/In Scadenza") return matchSearch && ((doc.status as string) === "EXPIRED" || doc.status === "EXPIRING_SOON")
        if (activeTab === "Autisti") return matchSearch && doc.driverId !== null
        if (activeTab === "Veicoli") return matchSearch && doc.vehicleId !== null
        if (activeTab === "Viaggi") return matchSearch && doc.tripId !== null
        return matchSearch
    })

    const getEntityName = (doc: typeof demoDocuments[0]) => {
        if (doc.driverId) {
            const driver = demoDrivers.find(d => d.id === doc.driverId)
            return driver ? `${driver.name} ${driver.surname}` : "Autista"
        }
        if (doc.vehicleId) {
            const vehicle = demoVehicles.find(v => v.id === doc.vehicleId)
            return vehicle ? vehicle.plate : "Veicolo"
        }
        if (doc.tripId) {
            const trip = demoTrips.find(t => t.id === doc.tripId)
            return trip ? trip.cargoType : "Viaggio"
        }
        return "—"
    }

    const statusIcon = {
        VALID: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        EXPIRING_SOON: <Clock className="w-4 h-4 text-amber-400" />,
        EXPIRED: <AlertTriangle className="w-4 h-4 text-red-400" />,
        MISSING: <AlertTriangle className="w-4 h-4 text-zinc-400" />,
    }

    const statusLabel = {
        VALID: "Valido",
        EXPIRING_SOON: "In Scadenza",
        EXPIRED: "Scaduto",
        MISSING: "Mancante",
    }

    const expiringSoon = demoDocuments.filter(d => d.status === "EXPIRING_SOON").length
    const expired = demoDocuments.filter(d => (d.status as string) === "EXPIRED").length

    return (
        <MainLayout title="Documenti & Compliance">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Documenti</h2>
                        <p className="text-sm text-muted-foreground">{demoDocuments.length} documenti totali</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                        <Upload className="w-4 h-4" />
                        Carica Documento
                    </button>
                </div>

                {/* Alert summary */}
                {(expired > 0 || expiringSoon > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {expired > 0 && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/15">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-red-400">{expired} Documenti Scaduti</p>
                                    <p className="text-xs text-red-400/60">Richiedono rinnovo immediato</p>
                                </div>
                            </div>
                        )}
                        {expiringSoon > 0 && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/15">
                                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-400">{expiringSoon} In Scadenza (30gg)</p>
                                    <p className="text-xs text-amber-400/60">Pianifica il rinnovo</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cerca per tipo documento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 flex-wrap border-b border-border pb-3">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                activeTab === tab
                                    ? "bg-primary/15 text-primary border border-primary/25"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Documents Table */}
                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider">Documento</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider hidden md:table-cell">Entita</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider">Stato</th>
                                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider hidden lg:table-cell">Scadenza</th>
                                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filtered.map((doc) => (
                                <tr key={doc.id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{getDocumentTypeLabel(doc.type)}</p>
                                                {doc.fileName && <p className="text-xs text-muted-foreground">{doc.fileName}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 hidden md:table-cell">
                                        <p className="text-sm text-foreground">{getEntityName(doc)}</p>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {statusIcon[doc.status as keyof typeof statusIcon]}
                                            <span className={cn(
                                                "text-xs font-medium",
                                                doc.status === "VALID" ? "text-emerald-400" :
                                                    doc.status === "EXPIRING_SOON" ? "text-amber-400" :
                                                        (doc.status as string) === "EXPIRED" ? "text-red-400" : "text-zinc-400"
                                            )}>
                                                {statusLabel[doc.status as keyof typeof statusLabel]}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 hidden lg:table-cell">
                                        <p className="text-sm text-foreground">{formatDate(doc.expirationDate)}</p>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="text-xs text-primary hover:underline">Visualizza</button>
                                            <button className="text-xs text-muted-foreground hover:text-foreground">Rinnova</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-foreground font-medium">Nessun documento trovato</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
