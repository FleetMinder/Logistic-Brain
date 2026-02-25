import { MainLayout } from "@/components/layout/main-layout"
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    Truck,
    Users,
    Activity,
    Coffee,
    Moon,
    Info,
    ChevronRight,
} from "lucide-react"
import { demoDrivers, demoVehicles, demoAlerts, demoStats, demoDocuments } from "@/lib/demo-data"
import {
    cn,
    formatDate,
    formatHours,
    getDrivingHoursStatus,
    getExpiryUrgencyLabel,
    daysUntilExpiry,
    getComplianceColor,
    getComplianceLabel,
    getTachographDownloadStatus,
    getTachographTypeLabel,
    getTachographTypeColor,
} from "@/lib/utils"
import Link from "next/link"

const CE561_LIMITS = {
    dailyMax: 9,
    dailyExtended: 10,
    weeklyMax: 56,
    biweeklyMax: 90,
    continuousMax: 4.5,
    breakMinutes: 45,
    dailyRestMin: 11,
    weeklyRestMin: 45,
}

export default function CompliancePage() {
    const score = demoStats.complianceScore
    const breakdown = demoStats.complianceBreakdown

    const criticalAlerts = demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved)
    const warningAlerts = demoAlerts.filter(a => a.severity === "WARNING" && !a.isResolved)

    // Documents expiring within 30 days
    const expiringDocs = demoDocuments
        .filter(d => d.expirationDate && daysUntilExpiry(d.expirationDate) !== null && daysUntilExpiry(d.expirationDate)! <= 30 && daysUntilExpiry(d.expirationDate)! >= 0)
        .sort((a, b) => (daysUntilExpiry(a.expirationDate) ?? 999) - (daysUntilExpiry(b.expirationDate) ?? 999))

    // Vehicles needing tachograph V2 retrofit
    const vehiclesNeedingRetrofit = demoVehicles.filter(v => (v.tachographType as string) === "DIGITAL_V1" || (v.tachographType as string) === "ANALOG")

    return (
        <MainLayout title="Compliance Center">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-foreground">Compliance Center</h2>
                    <p className="text-sm text-muted-foreground">Stato di conformita normativa della flotta — Reg. CE 561/2006, ADR, Tachigrafo, Documenti</p>
                </div>

                {/* Compliance Score + Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Overall Score */}
                    <div className="glass rounded-xl p-6 flex flex-col items-center justify-center">
                        <Shield className={cn("w-8 h-8 mb-2", getComplianceColor(score))} />
                        <p className={cn("text-4xl font-bold", getComplianceColor(score))}>{score}%</p>
                        <p className={cn("text-sm font-medium mt-1", getComplianceColor(score))}>{getComplianceLabel(score)}</p>
                        <p className="text-xs text-muted-foreground mt-2 text-center">Score complessivo di conformita</p>
                    </div>

                    {/* Breakdown cards */}
                    {[
                        { label: "Documenti Autisti", score: breakdown.driverDocs, icon: Users, desc: "Patenti, CQC, ADR" },
                        { label: "Documenti Veicoli", score: breakdown.vehicleDocs, icon: Truck, desc: "Revisioni, Assicurazioni" },
                        { label: "Ore di Guida", score: breakdown.drivingHours, icon: Activity, desc: "CE 561/2006" },
                    ].map((item) => {
                        const Icon = item.icon
                        return (
                            <div key={item.label} className="glass rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-xs font-semibold text-foreground">{item.label}</p>
                                    </div>
                                    <p className={cn("text-lg font-bold", getComplianceColor(item.score))}>{item.score}%</p>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            item.score >= 80 ? "bg-emerald-500" :
                                                item.score >= 60 ? "bg-amber-500" : "bg-red-500"
                                        )}
                                        style={{ width: `${item.score}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Critical & Warning Alerts */}
                {criticalAlerts.length > 0 && (
                    <div className="glass rounded-xl p-6 border-red-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-red-600">{criticalAlerts.length} Alert Critici — Azione Immediata</h3>
                                <p className="text-xs text-muted-foreground">Problemi che bloccano o possono bloccare le operazioni</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {criticalAlerts.map(alert => (
                                <div key={alert.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {warningAlerts.length > 0 && (
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-amber-600">{warningAlerts.length} Avvisi — Attenzione Richiesta</h3>
                                <p className="text-xs text-muted-foreground">Scadenze imminenti e limiti in avvicinamento</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {warningAlerts.map(alert => (
                                <div key={alert.id} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CE 561/2006 — Driving Hours Monitor */}
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Tempi di Guida — CE 561/2006</h3>
                                <p className="text-xs text-muted-foreground">Monitoraggio in tempo reale</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {demoDrivers.map(driver => {
                                const dailyStatus = getDrivingHoursStatus(driver.dailyHoursUsed, CE561_LIMITS.dailyMax)
                                const weeklyStatus = getDrivingHoursStatus(driver.weeklyHoursUsed, CE561_LIMITS.weeklyMax)
                                const biweeklyStatus = getDrivingHoursStatus(driver.biweeklyHoursUsed, CE561_LIMITS.biweeklyMax)
                                const tachStatus = getTachographDownloadStatus(driver.lastTachographDownload)

                                const hasCritical = dailyStatus === "critical" || weeklyStatus === "critical" || biweeklyStatus === "critical" || tachStatus === "overdue"
                                const hasWarning = dailyStatus === "warning" || weeklyStatus === "warning" || biweeklyStatus === "warning" || tachStatus === "warning"

                                return (
                                    <div key={driver.id} className={cn(
                                        "p-4 rounded-lg border transition-colors",
                                        hasCritical ? "bg-red-50 border-red-200" :
                                            hasWarning ? "bg-amber-50 border-amber-200" :
                                                "bg-secondary/30 border-border/50"
                                    )}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                                                    {driver.name[0]}{driver.surname[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{driver.name} {driver.surname}</p>
                                                    <p className="text-[11px] text-muted-foreground">{driver.isAvailable ? "Disponibile" : "In servizio"}</p>
                                                </div>
                                            </div>
                                            {hasCritical && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                            {!hasCritical && hasWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                                            {!hasCritical && !hasWarning && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                        </div>

                                        {/* Hours bars */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "Giorno", used: driver.dailyHoursUsed, max: CE561_LIMITS.dailyMax, status: dailyStatus },
                                                { label: "Settimana", used: driver.weeklyHoursUsed, max: CE561_LIMITS.weeklyMax, status: weeklyStatus },
                                                { label: "Bisett.", used: driver.biweeklyHoursUsed, max: CE561_LIMITS.biweeklyMax, status: biweeklyStatus },
                                            ].map(bar => (
                                                <div key={bar.label}>
                                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                                        <span className="text-muted-foreground">{bar.label}</span>
                                                        <span className={cn(
                                                            "font-semibold",
                                                            bar.status === "critical" ? "text-red-600" :
                                                                bar.status === "warning" ? "text-amber-600" : "text-emerald-600"
                                                        )}>
                                                            {formatHours(bar.used)}/{bar.max}h
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                bar.status === "critical" ? "bg-red-500" :
                                                                    bar.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${Math.min((bar.used / bar.max) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tachograph status */}
                                        {tachStatus !== "ok" && (
                                            <div className={cn(
                                                "mt-2 flex items-center gap-1.5 text-[11px]",
                                                tachStatus === "overdue" ? "text-red-600" : "text-amber-600"
                                            )}>
                                                <AlertTriangle className="w-3 h-3" />
                                                Scarico tachigrafo: {tachStatus === "overdue" ? "SCADUTO" : "in scadenza"} (ultimo: {formatDate(driver.lastTachographDownload)})
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Expiring Documents */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">Scadenze Documenti</h3>
                                        <p className="text-xs text-muted-foreground">Prossimi 30 giorni</p>
                                    </div>
                                </div>
                                <Link href="/documenti" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    Tutti <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="space-y-2">
                                {expiringDocs.length === 0 ? (
                                    <div className="text-center py-6">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                        <p className="text-sm text-emerald-600">Nessuna scadenza imminente</p>
                                    </div>
                                ) : (
                                    expiringDocs.map(doc => {
                                        const days = daysUntilExpiry(doc.expirationDate)
                                        const isUrgent = days !== null && days <= 7
                                        return (
                                            <div key={doc.id} className={cn(
                                                "p-3 rounded-lg border flex items-center justify-between",
                                                isUrgent ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                                            )}>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {doc.driverId && demoDrivers.find(d => d.id === doc.driverId)
                                                            ? `${demoDrivers.find(d => d.id === doc.driverId)!.name} ${demoDrivers.find(d => d.id === doc.driverId)!.surname}`
                                                            : doc.vehicleId && demoVehicles.find(v => v.id === doc.vehicleId)
                                                                ? `${demoVehicles.find(v => v.id === doc.vehicleId)!.plate}`
                                                                : ""}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={cn(
                                                        "text-xs font-semibold",
                                                        isUrgent ? "text-red-600" : "text-amber-600"
                                                    )}>
                                                        {getExpiryUrgencyLabel(doc.expirationDate)}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground">{formatDate(doc.expirationDate)}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Tachograph V2 Retrofit Status */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Tachigrafo Smart V2</h3>
                                    <p className="text-xs text-muted-foreground">Obbligo retrofit entro 01/07/2026 (Reg. UE 165/2014)</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {demoVehicles.map(vehicle => (
                                    <div key={vehicle.id} className={cn(
                                        "p-3 rounded-lg border flex items-center justify-between",
                                        vehicle.tachographType === "SMART_V2" || vehicle.tachographType === "DIGITAL_V2"
                                            ? "bg-secondary/30 border-border/50"
                                            : "bg-amber-50 border-amber-200"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{vehicle.plate}</p>
                                                <p className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "inline-flex px-2 py-0.5 rounded text-xs font-medium border",
                                            getTachographTypeColor(vehicle.tachographType)
                                        )}>
                                            {getTachographTypeLabel(vehicle.tachographType)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {vehiclesNeedingRetrofit.length > 0 && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-600">
                                        <strong>{vehiclesNeedingRetrofit.length} veicoli</strong> necessitano del retrofit al Smart Tachograph V2.
                                        Scadenza obbligo: <strong>1 luglio 2026</strong> ({daysUntilExpiry(new Date("2026-07-01"))} giorni).
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* CE 561/2006 Quick Reference */}
                        <div className="glass rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Reg. CE 561/2006</h3>
                                    <p className="text-xs text-muted-foreground">Limiti tempi di guida e riposo</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { rule: "Guida giornaliera", limit: "9h (max 10h, 2x/sett.)", icon: Clock },
                                    { rule: "Interruzione", limit: "45 min ogni 4h30", icon: Coffee },
                                    { rule: "Riposo giornaliero", limit: "11h consecutive min.", icon: Moon },
                                    { rule: "Guida settimanale", limit: "56h massimo", icon: Activity },
                                ].map((rule, i) => {
                                    const Icon = rule.icon
                                    return (
                                        <div key={i} className="p-2.5 bg-secondary/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon className="w-3.5 h-3.5 text-primary" />
                                                <p className="text-[11px] font-semibold text-foreground">{rule.rule}</p>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">{rule.limit}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
