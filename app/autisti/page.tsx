"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import {
    Plus,
    Search,
    Phone,
    Mail,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Shield,
    Thermometer,
} from "lucide-react"
import { demoDrivers } from "@/lib/demo-data"
import {
    formatDate,
    formatHours,
    getDrivingHoursStatus,
    isExpiringSoon,
    isExpired,
    cn,
} from "@/lib/utils"

export default function AutoristiPage() {
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)

    const filtered = demoDrivers.filter(d =>
        `${d.name} ${d.surname} ${d.licenseNumber}`.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <MainLayout title="Gestione Autisti">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Autisti</h2>
                        <p className="text-sm text-muted-foreground">{demoDrivers.length} autisti registrati</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        Nuovo Autista
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cerca per nome, cognome, numero patente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Driver Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((driver) => {
                        const drivingStatus = getDrivingHoursStatus(driver.dailyHoursUsed)
                        const licenseExpiring = isExpiringSoon(driver.licenseDeadline)
                        const licenseExpired = isExpired(driver.licenseDeadline)
                        const cqcExpiring = driver.cqcDeadline ? isExpiringSoon(driver.cqcDeadline) : false
                        const cqcExpired = driver.cqcDeadline ? isExpired(driver.cqcDeadline) : false
                        const adrExpiring = driver.adrDeadline ? isExpiringSoon(driver.adrDeadline) : false
                        const hasAlerts = licenseExpiring || licenseExpired || cqcExpiring || cqcExpired || adrExpiring

                        return (
                            <div key={driver.id} className="glass rounded-xl p-5 hover:bg-secondary/30 transition-all">
                                {/* Driver header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                            {driver.name[0]}{driver.surname[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{driver.name} {driver.surname}</p>
                                            <p className="text-xs text-muted-foreground">{driver.licenseNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {hasAlerts && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                                        <div className={cn(
                                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                                            driver.isAvailable
                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", driver.isAvailable ? "bg-emerald-400" : "bg-amber-400")} />
                                            {driver.isAvailable ? "Disponibile" : "In Servizio"}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-1.5 mb-4">
                                    {driver.phone && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            {driver.phone}
                                        </p>
                                    )}
                                    {driver.email && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5" />
                                            {driver.email}
                                        </p>
                                    )}
                                </div>

                                {/* Driving hours */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            Ore guida oggi
                                        </span>
                                        <span className={cn(
                                            "font-semibold",
                                            drivingStatus === "critical" ? "text-red-400" :
                                                drivingStatus === "warning" ? "text-amber-400" : "text-emerald-400"
                                        )}>
                                            {formatHours(driver.dailyHoursUsed)} / 9h
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all",
                                                drivingStatus === "critical" ? "bg-red-400" :
                                                    drivingStatus === "warning" ? "bg-amber-400" : "bg-emerald-400"
                                            )}
                                            style={{ width: `${Math.min((driver.dailyHoursUsed / 9) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs mt-1">
                                        <span className="text-muted-foreground">Settimanale</span>
                                        <span className="text-muted-foreground">{formatHours(driver.weeklyHoursUsed)} / 56h</span>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="space-y-2 pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5" />
                                            Patente
                                        </span>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            licenseExpired ? "text-red-400" : licenseExpiring ? "text-amber-400" : "text-emerald-400"
                                        )}>
                                            {licenseExpired ? "⚠ Scaduta" : licenseExpiring ? "⚠ " : "✓ "}
                                            {formatDate(driver.licenseDeadline)}
                                        </span>
                                    </div>
                                    {driver.cqcDeadline && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                CQC
                                            </span>
                                            <span className={cn(
                                                "text-xs font-medium",
                                                cqcExpired ? "text-red-400" : cqcExpiring ? "text-amber-400" : "text-emerald-400"
                                            )}>
                                                {cqcExpired ? "⚠ Scaduta" : cqcExpiring ? "⚠ " : "✓ "}
                                                {formatDate(driver.cqcDeadline)}
                                            </span>
                                        </div>
                                    )}
                                    {driver.adrCertificate && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Thermometer className="w-3.5 h-3.5" />
                                                ADR
                                            </span>
                                            <span className={cn(
                                                "text-xs font-medium",
                                                adrExpiring ? "text-amber-400" : "text-emerald-400"
                                            )}>
                                                {adrExpiring ? "⚠ " : "✓ "}
                                                {formatDate(driver.adrDeadline)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {driver.notes && (
                                    <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-3">{driver.notes}</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* New Driver Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-foreground">Nuovo Autista</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</label>
                                    <input type="text" placeholder="Mario" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cognome</label>
                                    <input type="text" placeholder="Rossi" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Numero Patente</label>
                                <input type="text" placeholder="IT123456789" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scadenza Patente</label>
                                    <input type="date" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scadenza CQC</label>
                                    <input type="date" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                                <input type="email" placeholder="mario.rossi@azienda.it" className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input type="checkbox" className="rounded border-border" />
                                Certificato ADR
                            </label>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                Annulla
                            </button>
                            <button className="flex-1 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                Aggiungi Autista
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
