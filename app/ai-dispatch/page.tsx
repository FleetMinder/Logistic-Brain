"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useState } from "react"
import {
    Users,
    Truck,
    Route,
    Zap,
    Copy,
    CheckCheck,
    AlertTriangle,
    Clock,
    Package,
    Globe,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Cpu,
    Target,
    TrendingUp,
    Shield,
} from "lucide-react"
import { demoDrivers, demoVehicles, demoTrips } from "@/lib/demo-data"
import {
    getVehicleTypeLabel,
    getVehicleTypeColor,
    getTripStatusLabel,
    getTripStatusColor,
    formatHours,
    cn,
} from "@/lib/utils"

const PRESETS = [
    {
        label: "Verifica compliance completa",
        icon: Shield,
        query:
            "Esegui una verifica compliance completa di tutti i viaggi pianificati e attivi: controlla validita documenti autisti (patente, CQC, ADR), documenti veicoli (revisione, assicurazione), ore di guida CE 561/2006 (giornaliere, settimanali, bisettimanali), scadenze scarico tachigrafo, e requisiti CMR per i viaggi internazionali. Segnala tutti i BLOCCHI e le VIOLAZIONI.",
    },
    {
        label: "Assegna autisti (compliance-first)",
        icon: Users,
        query:
            "Analizza i viaggi pianificati e suggerisci la migliore assegnazione degli autisti disponibili. Per ogni assegnazione VERIFICA: ore di guida residue sufficienti, documenti validi alla data del viaggio, certificato ADR se richiesto, scarico tachigrafo in regola. Blocca le assegnazioni non conformi e suggerisci alternative.",
    },
    {
        label: "Scadenze critiche",
        icon: AlertTriangle,
        query:
            "Elenca tutte le scadenze critiche della flotta nei prossimi 30 giorni: documenti autisti (patente, CQC, ADR), documenti veicoli (revisione, assicurazione), scarichi tachigrafo scaduti, e obblighi di retrofit tachigrafo V2. Per ogni scadenza indica l'impatto operativo e le azioni da intraprendere.",
    },
    {
        label: "Pianifica settimana",
        icon: Target,
        query:
            "Pianifica la distribuzione dei viaggi per la settimana considerando: disponibilita autisti, ore di guida residue (giornaliere/settimanali/bisettimanali CE 561/2006), validita documenti, disponibilita veicoli, requisiti ADR, e obblighi di riposo settimanale. Priorita: conformita normativa prima, poi efficienza.",
    },
    {
        label: "Ottimizza costi",
        icon: TrendingUp,
        query:
            "Analizza le assegnazioni attuali e suggerisci come ridurre i costi operativi mantenendo la piena conformita normativa. Considera: ottimizzazione rotte, abbinamento autista-veicolo-viaggio, riduzione km a vuoto, e pianificazione pause obbligatorie lungo il percorso.",
    },
]

function formatAIResponse(text: string) {
    const lines = text.split("\n")
    return lines.map((line, i) => {
        if (line.startsWith("## ")) {
            return (
                <h3 key={i} className="text-base font-bold text-foreground mt-5 mb-2 first:mt-0">
                    {line.replace("## ", "")}
                </h3>
            )
        }
        if (line.startsWith("### ")) {
            return (
                <h4 key={i} className="text-sm font-semibold text-primary mt-4 mb-1">
                    {line.replace("### ", "")}
                </h4>
            )
        }
        if (/^\d+\.\s/.test(line)) {
            const parts = line.replace(/^\d+\.\s/, "")
            return (
                <div key={i} className="flex gap-2 mt-3">
                    <span className="text-primary font-bold text-sm flex-shrink-0">
                        {line.match(/^\d+/)?.[0]}.
                    </span>
                    <span className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: parts.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                </div>
            )
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
            const content = line.replace(/^[-•]\s/, "")
            return (
                <div key={i} className="flex gap-2 ml-4 mt-1">
                    <span className="text-primary/50 flex-shrink-0 mt-1">•</span>
                    <span
                        className="text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                        }}
                    />
                </div>
            )
        }
        if (line.startsWith("---")) {
            return <hr key={i} className="border-border/40 my-4" />
        }
        if (line.trim() === "") {
            return <div key={i} className="h-1" />
        }
        return (
            <p
                key={i}
                className="text-sm text-muted-foreground leading-relaxed mt-1"
                dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                }}
            />
        )
    })
}

export default function AiDispatchPage() {
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [aiResponse, setAiResponse] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [errorDetails, setErrorDetails] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [contextExpanded, setContextExpanded] = useState(true)

    const availableDrivers = demoDrivers.filter((d) => d.isAvailable)
    const availableVehicles = demoVehicles.filter((v) => v.isAvailable)
    const plannedTrips = demoTrips.filter((t) => t.status === "PLANNED" || t.status === "IN_PROGRESS")

    const handleAnalyze = async (customQuery?: string) => {
        const finalQuery = customQuery || query
        if (!finalQuery.trim()) return

        setIsLoading(true)
        setAiResponse(null)
        setError(null)
        setErrorDetails(null)

        try {
            const context = {
                drivers: demoDrivers.map((d) => ({
                    id: d.id,
                    name: d.name,
                    surname: d.surname,
                    isAvailable: d.isAvailable,
                    dailyHoursUsed: d.dailyHoursUsed,
                    weeklyHoursUsed: d.weeklyHoursUsed,
                    biweeklyHoursUsed: d.biweeklyHoursUsed,
                    adrCertificate: d.adrCertificate,
                    licenseDeadline: d.licenseDeadline.toISOString(),
                    cqcDeadline: d.cqcDeadline.toISOString(),
                    adrDeadline: d.adrDeadline?.toISOString() ?? null,
                    tachographCardDeadline: d.tachographCardDeadline.toISOString(),
                    lastTachographDownload: d.lastTachographDownload.toISOString(),
                    lastWeeklyRest: d.lastWeeklyRest?.toISOString() ?? null,
                    notes: d.notes,
                })),
                vehicles: demoVehicles.map((v) => ({
                    id: v.id,
                    plate: v.plate,
                    brand: v.brand,
                    model: v.model,
                    type: v.type,
                    maxCapacityKg: v.maxCapacityKg,
                    maxCapacityM3: v.maxCapacityM3 ?? null,
                    isAvailable: v.isAvailable,
                    tachographType: v.tachographType,
                    revisionDeadline: v.revisionDeadline.toISOString(),
                    insuranceDeadline: v.insuranceDeadline.toISOString(),
                    notes: v.notes ?? null,
                })),
                trips: demoTrips.map((t) => ({
                    id: t.id,
                    status: t.status,
                    cargoType: t.cargoType,
                    cargoWeight: t.cargoWeight,
                    isInternational: t.isInternational,
                    isAdr: t.isAdr,
                    startDate: t.startDate.toISOString(),
                    totalKm: t.totalKm,
                    estimatedCost: t.estimatedCost,
                    stops: t.stops.map((s) => ({ city: s.city, type: s.type })),
                    driverId: t.driverId,
                    vehicleId: t.vehicleId,
                    complianceCheck: t.complianceCheck ? {
                        overallStatus: t.complianceCheck.overallStatus,
                        issues: t.complianceCheck.issues,
                    } : undefined,
                })),
            }

            const res = await fetch("/api/ai-dispatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userQuery: finalQuery, context }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Errore sconosciuto")
                setErrorDetails(data.details || null)
            } else {
                setAiResponse(data.result)
            }
        } catch (err) {
            setError("Errore di rete. Verifica la connessione.")
            setErrorDetails(String(err))
        } finally {
            setIsLoading(false)
        }
    }

    const handlePreset = (preset: (typeof PRESETS)[0]) => {
        setQuery(preset.query)
        handleAnalyze(preset.query)
    }

    const handleCopy = () => {
        if (aiResponse) {
            navigator.clipboard.writeText(aiResponse)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <MainLayout title="AI Dispatch">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">AI Dispatch</h2>
                                <p className="text-xs text-muted-foreground">
                                    Compliance-first dispatch — verifica normativa automatica
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-medium text-primary">Gemini 2.0 Flash</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left panel — Context */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="glass rounded-xl overflow-hidden">
                            <button
                                onClick={() => setContextExpanded(!contextExpanded)}
                                className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                            >
                                <span className="text-sm font-semibold text-foreground">
                                    Contesto Flotta
                                </span>
                                {contextExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>

                            {contextExpanded && (
                                <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-3">
                                    {/* Available Drivers */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                                Autisti disponibili ({availableDrivers.length}/{demoDrivers.length})
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {demoDrivers.map((d) => (
                                                <div
                                                    key={d.id}
                                                    className={cn(
                                                        "flex items-center justify-between text-xs p-2 rounded-lg",
                                                        d.isAvailable ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-secondary/50 opacity-60"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={cn(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                d.isAvailable ? "bg-emerald-400" : "bg-red-400"
                                                            )}
                                                        />
                                                        <span className="font-medium text-foreground">
                                                            {d.name} {d.surname}
                                                        </span>
                                                        {d.adrCertificate && (
                                                            <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/15">
                                                                ADR
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatHours(d.dailyHoursUsed)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Available Vehicles */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Truck className="w-3.5 h-3.5 text-sky-400" />
                                            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                                                Veicoli disponibili ({availableVehicles.length}/{demoVehicles.length})
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {demoVehicles.map((v) => (
                                                <div
                                                    key={v.id}
                                                    className={cn(
                                                        "flex items-center justify-between text-xs p-2 rounded-lg",
                                                        v.isAvailable ? "bg-sky-500/5 border border-sky-500/10" : "bg-secondary/50 opacity-60"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={cn(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                v.isAvailable ? "bg-sky-400" : "bg-red-400"
                                                            )}
                                                        />
                                                        <span className="font-medium text-foreground">{v.plate}</span>
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                                                            getVehicleTypeColor(v.type)
                                                        )}
                                                    >
                                                        {getVehicleTypeLabel(v.type)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Planned Trips */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Route className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                                                Viaggi attivi/pianificati ({plannedTrips.length})
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {plannedTrips.map((t) => (
                                                <div
                                                    key={t.id}
                                                    className="text-xs p-2 rounded-lg bg-amber-500/5 border border-amber-500/10"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-foreground truncate flex-1 mr-2">
                                                            {t.cargoType}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                "flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold border",
                                                                getTripStatusColor(t.status)
                                                            )}
                                                        >
                                                            {getTripStatusLabel(t.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                                                        <span>{t.stops[0]?.city} — {t.stops[t.stops.length - 1]?.city}</span>
                                                        {t.isAdr && (
                                                            <span className="flex items-center gap-0.5 text-orange-400">
                                                                <AlertTriangle className="w-2.5 h-2.5" /> ADR
                                                            </span>
                                                        )}
                                                        {t.isInternational && (
                                                            <span className="flex items-center gap-0.5 text-indigo-400">
                                                                <Globe className="w-2.5 h-2.5" /> INT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats summary box */}
                        <div className="glass rounded-xl p-4 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                Riepilogo Per AI
                            </p>
                            {[
                                { label: "Autisti totali", value: demoDrivers.length, color: "text-foreground" },
                                {
                                    label: "Autisti disponibili",
                                    value: availableDrivers.length,
                                    color: "text-emerald-400",
                                },
                                { label: "Veicoli disponibili", value: availableVehicles.length, color: "text-sky-400" },
                                {
                                    label: "Viaggi da pianificare",
                                    value: demoTrips.filter((t) => t.status === "PLANNED").length,
                                    color: "text-amber-400",
                                },
                                {
                                    label: "Viaggi ADR",
                                    value: plannedTrips.filter((t) => t.isAdr).length,
                                    color: "text-orange-400",
                                },
                                {
                                    label: "Viaggi internazionali",
                                    value: plannedTrips.filter((t) => t.isInternational).length,
                                    color: "text-indigo-400",
                                },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{stat.label}</span>
                                    <span className={cn("font-bold", stat.color)}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right panel — Prompt + Output */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Preset buttons */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Ottimizzazioni rapide
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                                {PRESETS.map((preset) => {
                                    const Icon = preset.icon
                                    return (
                                        <button
                                            key={preset.label}
                                            onClick={() => handlePreset(preset)}
                                            disabled={isLoading}
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/60 border border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                            <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                                                {preset.label}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Prompt input */}
                        <div className="glass rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Cpu className="w-4 h-4 text-primary" />
                                    <p className="text-sm font-semibold text-foreground">
                                        Richiesta personalizzata
                                    </p>
                                </div>
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                            handleAnalyze()
                                        }
                                    }}
                                    placeholder="Descrivi cosa vuoi ottimizzare... Es: &quot;Assegna gli autisti disponibili tenendo conto dei requisiti ADR per i viaggi di domani&quot;"
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/25 resize-none min-h-[80px] transition-all"
                                    rows={3}
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-muted-foreground">
                                        <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px]">
                                            Cmd+Enter
                                        </kbd>{" "}
                                        per analizzare
                                    </p>
                                    <button
                                        onClick={() => handleAnalyze()}
                                        disabled={isLoading || !query.trim()}
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Analizzando...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-4 h-4" />
                                                Analizza con AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <div className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-4 border border-primary/15 bg-primary/5">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                                        <Cpu className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -inset-2 rounded-3xl border-2 border-primary/25 animate-ping" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-foreground">
                                        Analisi in corso...
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Gemini sta elaborando i dati della tua flotta
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error state */}
                        {error && (
                            <div className="glass rounded-xl overflow-hidden border border-red-500/25">
                                <div className="flex items-center gap-3 p-4 bg-red-500/5 border-b border-red-500/15">
                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-400">{error}</p>
                                        {errorDetails && (
                                            <p className="text-xs text-red-400/60 mt-0.5">{errorDetails}</p>
                                        )}
                                    </div>
                                </div>
                                {error.includes("GEMINI_API_KEY") && (
                                    <div className="p-4 text-xs text-muted-foreground space-y-2">
                                        <p className="font-medium text-foreground">Come configurare l&apos;AI:</p>
                                        <ol className="list-decimal list-inside space-y-1 ml-1">
                                            <li>
                                                Ottieni una chiave API gratuita su{" "}
                                                <a
                                                    href="https://aistudio.google.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Google AI Studio
                                                </a>
                                            </li>
                                            <li>
                                                Crea o modifica il file{" "}
                                                <code className="bg-secondary px-1 rounded">.env.local</code> nella
                                                root del progetto
                                            </li>
                                            <li>
                                                Aggiungi la riga:{" "}
                                                <code className="bg-secondary px-1 rounded">
                                                    GEMINI_API_KEY=la_tua_chiave
                                                </code>
                                            </li>
                                            <li>Riavvia il server di sviluppo</li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* AI Response */}
                        {aiResponse && !isLoading && (
                            <div className="glass rounded-xl overflow-hidden border border-primary/15 animate-fade-in">
                                <div className="flex items-center justify-between p-4 border-b border-primary/10 bg-primary/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                                            <Cpu className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            Analisi AI
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            — Gemini 2.0 Flash
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                Copiato!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                Copia
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="p-5 max-h-[60vh] overflow-y-auto scrollbar-thin">
                                    <div className="space-y-0.5">{formatAIResponse(aiResponse)}</div>
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {!aiResponse && !isLoading && !error && (
                            <div className="glass rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-border/50">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                                    <Cpu className="w-8 h-8 text-primary/60" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Pronto per l&apos;ottimizzazione
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                        Seleziona un&apos;ottimizzazione rapida o scrivi una richiesta personalizzata
                                        per analizzare la tua flotta con l&apos;AI
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Package className="w-3.5 h-3.5 text-primary" />
                                        {demoTrips.length} viaggi analizzati
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        {demoDrivers.length} autisti
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                        {demoVehicles.length} veicoli
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
