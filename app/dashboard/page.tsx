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
    Shield,
    ChevronRight,
} from "lucide-react"
import { demoStats, demoTrips, demoDrivers, demoAlerts } from "@/lib/demo-data"
import {
    formatKm,
    formatCurrency,
    getTripStatusColor,
    getTripStatusLabel,
    formatHours,
    getDrivingHoursStatus,
    getComplianceColor,
    getComplianceLabel,
    cn,
} from "@/lib/utils"
import Link from "next/link"

function KpiCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "teal",
    href,
}: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ElementType
    trend?: string
    color?: "teal" | "emerald" | "amber" | "red" | "indigo"
    href?: string
}) {
    const colorMap = {
        teal: "from-teal-500/15 to-teal-600/5 border-teal-500/15 text-teal-400",
        emerald: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/15 text-emerald-400",
        amber: "from-amber-500/15 to-amber-600/5 border-amber-500/15 text-amber-400",
        red: "from-red-500/15 to-red-600/5 border-red-500/15 text-red-400",
        indigo: "from-indigo-500/15 to-indigo-600/5 border-indigo-500/15 text-indigo-400",
    }

    const card = (
        <div className={cn(
            "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all",
            colorMap[color],
            href && "hover:scale-[1.02] cursor-pointer"
        )}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-current/10">
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

    if (href) {
        return <Link href={href}>{card}</Link>
    }
    return card
}

export default function DashboardPage() {
    const activeTrips = demoTrips.filter(t => t.status === "IN_PROGRESS")
    const plannedTrips = demoTrips.filter(t => t.status === "PLANNED")
    const criticalAlerts = demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved)
    const warningAlerts = demoAlerts.filter(a => a.severity === "WARNING" && !a.isResolved)
    const score = demoStats.complianceScore

    return (
        <MainLayout title="Dashboard">
            <div className="space-y-6 animate-fade-in">
                {/* Welcome + Compliance Score */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Dashboard Operativa</h2>
                        <p className="text-muted-foreground text-sm mt-1">
                            {new Date().toLocaleDateString("it-IT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/compliance" className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors",
                            score >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15" :
                                score >= 60 ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15" :
                                    "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15"
                        )}>
                            <Shield className="w-4 h-4" />
                            Compliance: {score}%
                        </Link>
                        <Link
                            href="/viaggi"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <Route className="w-4 h-4" />
                            Nuovo Viaggio
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Viaggi Attivi"
                        value={activeTrips.length}
                        subtitle={`${plannedTrips.length} pianificati`}
                        icon={Route}
                        color="teal"
                        href="/viaggi"
                    />
                    <KpiCard
                        title="Autisti"
                        value={`${demoStats.availableDrivers}/${demoStats.totalDrivers}`}
                        subtitle={`${demoStats.totalDrivers - demoStats.availableDrivers} in servizio`}
                        icon={Users}
                        color="emerald"
                        href="/autisti"
                    />
                    <KpiCard
                        title="Flotta"
                        value={`${demoStats.availableVehicles}/${demoStats.totalVehicles}`}
                        subtitle={`${demoStats.totalVehicles - demoStats.availableVehicles} in viaggio`}
                        icon={Truck}
                        color="indigo"
                        href="/veicoli"
                    />
                    <KpiCard
                        title="Alert Critici"
                        value={criticalAlerts.length}
                        subtitle={`${warningAlerts.length} avvisi`}
                        icon={AlertTriangle}
                        color={criticalAlerts.length > 0 ? "red" : "emerald"}
                        href="/compliance"
                    />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-teal-400" />
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
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                <Euro className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Costi Operativi (Feb)</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(demoStats.totalCostThisMonth)}</p>
                        <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Fuel className="w-3 h-3 text-amber-400" /> Carburante: {formatCurrency(3870)}</span>
                        </div>
                    </div>

                    <Link href="/compliance" className="glass rounded-xl p-5 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    score >= 80 ? "bg-emerald-500/15" : score >= 60 ? "bg-amber-500/15" : "bg-red-500/15"
                                )}>
                                    <Shield className={cn("w-4 h-4", getComplianceColor(score))} />
                                </div>
                                <p className="text-sm font-semibold text-foreground">Compliance Score</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className={cn("text-2xl font-bold", getComplianceColor(score))}>{score}% — {getComplianceLabel(score)}</p>
                        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full",
                                    score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-red-400"
                                )}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{criticalAlerts.length} critici, {warningAlerts.length} avvisi attivi</p>
                    </Link>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Trips with Compliance Status */}
                    <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-border/50">
                            <h3 className="text-sm font-semibold text-foreground">Viaggi Recenti</h3>
                            <Link href="/viaggi" className="text-xs text-primary hover:underline">Vedi tutti</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/30">
                                        <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 uppercase tracking-wider">Viaggio</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider hidden md:table-cell">Autista</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider">Stato</th>
                                        <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3 uppercase tracking-wider">Compliance</th>
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
                                                            {trip.stops[0]?.city} — {trip.stops[trip.stops.length - 1]?.city}
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
                                            <td className="px-3 py-3.5 text-center">
                                                {trip.complianceCheck.overallStatus === "OK" ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                                                ) : trip.complianceCheck.overallStatus === "WARNING" ? (
                                                    <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-red-400 mx-auto" />
                                                )}
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
                            <Link href="/autisti" className="text-xs text-primary hover:underline">Vedi tutti</Link>
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

                {/* Critical Alerts */}
                {criticalAlerts.length > 0 && (
                    <div className="glass rounded-xl overflow-hidden border border-red-500/15">
                        <div className="flex items-center justify-between p-5 border-b border-red-500/15 bg-red-500/5">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <h3 className="text-sm font-semibold text-red-400">Alert Critici — Azione Richiesta</h3>
                            </div>
                            <Link href="/compliance" className="text-xs text-primary hover:underline flex items-center gap-1">
                                Compliance Center <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border/20">
                            {criticalAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-start gap-4 p-4">
                                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0 animate-pulse" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
