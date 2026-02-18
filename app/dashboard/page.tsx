import { MainLayout } from "@/components/layout/main-layout"
import {
    Route,
    Users,
    Truck,
    AlertTriangle,
    TrendingUp,
    Clock,
    CheckCircle2,
    MapPin,
    ArrowUpRight,
    Fuel,
    Euro,
} from "lucide-react"
import { demoStats, demoTrips, demoDrivers, demoAlerts } from "@/lib/demo-data"
import {
    formatDate,
    formatKm,
    formatCurrency,
    getTripStatusColor,
    getTripStatusLabel,
    getVehicleTypeColor,
    getVehicleTypeLabel,
    formatHours,
    getDrivingHoursStatus,
    cn,
} from "@/lib/utils"
import Link from "next/link"

function KpiCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue",
}: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ElementType
    trend?: string
    color?: "blue" | "emerald" | "amber" | "red" | "purple"
}) {
    const colorMap = {
        blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
        emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
        amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
        red: "from-red-500/20 to-red-600/5 border-red-500/20 text-red-400",
        purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
    }

    return (
        <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all hover:scale-[1.02] ${colorMap[color]}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-current/10`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center gap-1 mt-3">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">{trend}</span>
                </div>
            )}
        </div>
    )
}

export default function DashboardPage() {
    const activeTrips = demoTrips.filter(t => t.status === "IN_PROGRESS")
    const plannedTrips = demoTrips.filter(t => t.status === "PLANNED")
    const criticalAlerts = demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved)
    const warningAlerts = demoAlerts.filter(a => a.severity === "WARNING" && !a.isResolved)

    return (
        <MainLayout title="Dashboard">
            <div className="space-y-6 animate-fade-in">
                {/* Welcome */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Buonasera, Admin 👋</h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            {new Date().toLocaleDateString("it-IT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <Link
                        href="/viaggi"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
                    >
                        <Route className="w-4 h-4" />
                        Nuovo Viaggio
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Viaggi Attivi"
                        value={activeTrips.length}
                        subtitle={`${plannedTrips.length} pianificati`}
                        icon={Route}
                        color="blue"
                        trend="+2 questa settimana"
                    />
                    <KpiCard
                        title="Autisti Disponibili"
                        value={`${demoStats.availableDrivers}/${demoStats.totalDrivers}`}
                        subtitle="3 in servizio"
                        icon={Users}
                        color="emerald"
                    />
                    <KpiCard
                        title="Flotta Disponibile"
                        value={`${demoStats.availableVehicles}/${demoStats.totalVehicles}`}
                        subtitle="2 in viaggio"
                        icon={Truck}
                        color="purple"
                    />
                    <KpiCard
                        title="Alert Critici"
                        value={criticalAlerts.length}
                        subtitle={`${warningAlerts.length} avvisi`}
                        icon={AlertTriangle}
                        color="red"
                    />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Km Percorsi (Feb)</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{formatKm(demoStats.totalKmThisMonth)}</p>
                        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full w-3/4 gradient-primary rounded-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">75% obiettivo mensile</p>
                    </div>

                    <div className="glass rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Euro className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Costi Operativi (Feb)</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(demoStats.totalCostThisMonth)}</p>
                        <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Fuel className="w-3 h-3 text-amber-400" /> Carburante: {formatCurrency(2460)}</span>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Compliance Score</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{demoStats.complianceScore}%</p>
                        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${demoStats.complianceScore}%`,
                                    background: demoStats.complianceScore >= 90 ? "#10b981" : demoStats.complianceScore >= 70 ? "#f59e0b" : "#ef4444"
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">4 documenti da rinnovare</p>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Trips */}
                    <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-border/50">
                            <h3 className="text-sm font-semibold text-foreground">Viaggi Recenti</h3>
                            <Link href="/viaggi" className="text-xs text-primary hover:underline">Vedi tutti →</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider">Viaggio</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider hidden md:table-cell">Autista</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider">Stato</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider hidden lg:table-cell">Data</th>
                                        <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider hidden lg:table-cell">Km</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {demoTrips.map((trip) => (
                                        <tr key={trip.id} className="hover:bg-secondary/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{trip.cargoType}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                                        <p className="text-xs text-muted-foreground">
                                                            {trip.stops[0]?.city} → {trip.stops[trip.stops.length - 1]?.city}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 hidden md:table-cell">
                                                <p className="text-sm text-foreground">{trip.driver?.name} {trip.driver?.surname}</p>
                                                <p className="text-xs text-muted-foreground">{trip.vehicle?.plate}</p>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", getTripStatusColor(trip.status))}>
                                                    {getTripStatusLabel(trip.status)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3.5 hidden lg:table-cell">
                                                <p className="text-xs text-muted-foreground">{formatDate(trip.startDate)}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                                                <p className="text-sm text-foreground">{formatKm(trip.totalKm)}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Driver Status */}
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-border/50">
                            <h3 className="text-sm font-semibold text-foreground">Stato Autisti</h3>
                            <Link href="/autisti" className="text-xs text-primary hover:underline">Vedi tutti →</Link>
                        </div>
                        <div className="divide-y divide-border/20">
                            {demoDrivers.map((driver) => {
                                const status = getDrivingHoursStatus(driver.dailyHoursUsed)
                                return (
                                    <div key={driver.id} className="p-4 hover:bg-secondary/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                                                    {driver.name[0]}{driver.surname[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">{driver.name} {driver.surname}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {driver.isAvailable ? "Disponibile" : "In Servizio"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                driver.isAvailable ? "bg-emerald-400" : "bg-amber-400"
                                            )} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Ore guida oggi</span>
                                                <span className={cn(
                                                    "font-semibold",
                                                    status === "critical" ? "text-red-400" :
                                                        status === "warning" ? "text-amber-400" : "text-emerald-400"
                                                )}>{formatHours(driver.dailyHoursUsed)} / 9h</span>
                                            </div>
                                            <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        status === "critical" ? "bg-red-400" :
                                                            status === "warning" ? "bg-amber-400" : "bg-emerald-400"
                                                    )}
                                                    style={{ width: `${Math.min((driver.dailyHoursUsed / 9) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {criticalAlerts.length > 0 && (
                    <div className="glass rounded-xl overflow-hidden border border-red-500/20">
                        <div className="flex items-center gap-3 p-5 border-b border-red-500/20 bg-red-500/5">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <h3 className="text-sm font-semibold text-red-400">Alert Critici — Azione Richiesta</h3>
                        </div>
                        <div className="divide-y divide-border/20">
                            {criticalAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-start gap-4 p-4">
                                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0 animate-pulse" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                                    </div>
                                    <Link href="/documenti" className="ml-auto text-xs text-primary hover:underline flex-shrink-0">
                                        Gestisci →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
