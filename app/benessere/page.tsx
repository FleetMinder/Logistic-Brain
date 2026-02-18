import { MainLayout } from "@/components/layout/main-layout"
import {
    Clock,
    AlertTriangle,
    CheckCircle2,
    Heart,
    Coffee,
    Moon,
    Activity,
    Info,
} from "lucide-react"
import { demoDrivers } from "@/lib/demo-data"
import {
    formatHours,
    getDrivingHoursStatus,
    cn,
} from "@/lib/utils"

const CE561Rules = [
    { rule: "Guida giornaliera", limit: "9 ore (max 10h, 2x/settimana)", icon: Clock },
    { rule: "Interruzione obbligatoria", limit: "45 min ogni 4.5h di guida", icon: Coffee },
    { rule: "Riposo giornaliero", limit: "Minimo 11 ore consecutive", icon: Moon },
    { rule: "Guida settimanale", limit: "Massimo 56 ore", icon: Activity },
    { rule: "Guida bisettimanale", limit: "Massimo 90 ore in 2 settimane", icon: Activity },
]

export default function BenesserePage() {
    return (
        <MainLayout title="Benessere Autisti">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-foreground">Monitoraggio Benessere</h2>
                    <p className="text-sm text-muted-foreground">Conformità Regolamento CE 561/2006 — Tempi di guida e riposo</p>
                </div>

                {/* CE 561/2006 Rules */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Info className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Regolamento CE 561/2006</h3>
                            <p className="text-xs text-muted-foreground">Limiti obbligatori per la guida professionale</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CE561Rules.map((rule, i) => {
                            const Icon = rule.icon
                            return (
                                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">{rule.rule}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{rule.limit}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Driver Wellness Cards */}
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">Stato Attuale Autisti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {demoDrivers.map((driver) => {
                            const dailyStatus = getDrivingHoursStatus(driver.dailyHoursUsed, 9)
                            const weeklyStatus = getDrivingHoursStatus(driver.weeklyHoursUsed, 56)
                            const breakNeeded = driver.dailyHoursUsed >= 4.5 && driver.isAvailable === false

                            return (
                                <div key={driver.id} className="glass rounded-xl p-5">
                                    {/* Driver header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                                {driver.name[0]}{driver.surname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{driver.name} {driver.surname}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {driver.isAvailable ? "Disponibile" : "In Servizio"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {breakNeeded && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                                    <Coffee className="w-3 h-3" />
                                                    Pausa
                                                </span>
                                            )}
                                            <Heart className={cn(
                                                "w-5 h-5",
                                                dailyStatus === "critical" ? "text-red-400" :
                                                    dailyStatus === "warning" ? "text-amber-400" : "text-emerald-400"
                                            )} />
                                        </div>
                                    </div>

                                    {/* Driving hours - Daily */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="text-muted-foreground flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Guida Giornaliera
                                                </span>
                                                <span className={cn(
                                                    "font-semibold",
                                                    dailyStatus === "critical" ? "text-red-400" :
                                                        dailyStatus === "warning" ? "text-amber-400" : "text-emerald-400"
                                                )}>
                                                    {formatHours(driver.dailyHoursUsed)} / 9h
                                                </span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        dailyStatus === "critical" ? "bg-red-400" :
                                                            dailyStatus === "warning" ? "bg-amber-400" : "bg-emerald-400"
                                                    )}
                                                    style={{ width: `${Math.min((driver.dailyHoursUsed / 9) * 100, 100)}%` }}
                                                />
                                            </div>
                                            {dailyStatus === "warning" && (
                                                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Avviso: 80% del limite giornaliero raggiunto
                                                </p>
                                            )}
                                            {dailyStatus === "critical" && (
                                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    LIMITE RAGGIUNTO — Riposo obbligatorio
                                                </p>
                                            )}
                                        </div>

                                        {/* Weekly hours */}
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="text-muted-foreground flex items-center gap-1.5">
                                                    <Activity className="w-3.5 h-3.5" />
                                                    Guida Settimanale
                                                </span>
                                                <span className={cn(
                                                    "font-semibold",
                                                    weeklyStatus === "critical" ? "text-red-400" :
                                                        weeklyStatus === "warning" ? "text-amber-400" : "text-emerald-400"
                                                )}>
                                                    {formatHours(driver.weeklyHoursUsed)} / 56h
                                                </span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        weeklyStatus === "critical" ? "bg-red-400" :
                                                            weeklyStatus === "warning" ? "bg-amber-400" : "bg-emerald-400"
                                                    )}
                                                    style={{ width: `${Math.min((driver.weeklyHoursUsed / 56) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Break status */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-xs">
                                                {driver.dailyHoursUsed < 4.5 ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-emerald-400">Pausa non necessaria</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-amber-400">Pausa 45min richiesta</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs ml-auto">
                                                <Moon className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-muted-foreground">Riposo: 11h min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Log Activity */}
                <div className="glass rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Registra Attività</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Inizio Guida", icon: "🚛", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
                            { label: "Pausa (45 min)", icon: "☕", color: "bg-amber-500/20 border-amber-500/30 text-amber-400" },
                            { label: "Fine Guida", icon: "🏁", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
                            { label: "Riposo Notturno", icon: "🌙", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
                        ].map((action) => (
                            <button
                                key={action.label}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all hover:scale-[1.02]",
                                    action.color
                                )}
                            >
                                <span className="text-2xl">{action.icon}</span>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
