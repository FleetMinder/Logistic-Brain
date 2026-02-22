import { MainLayout } from "@/components/layout/main-layout"
import { demoTrips } from "@/lib/demo-data"
import {
    formatDateTime,
    formatKm,
    formatCurrency,
    getTripStatusColor,
    getTripStatusLabel,
    getVehicleTypeColor,
    getVehicleTypeLabel,
    getStopTypeLabel,
    cn,
} from "@/lib/utils"
import {
    MapPin,
    Truck,
    User,
    Calendar,
    Package,
    Euro,
    Fuel,
    AlertTriangle,
    Globe,
    CheckCircle2,
    Clock,
    ArrowLeft,
    FileText,
} from "lucide-react"
import Link from "next/link"

const stopTypeColor: Record<string, string> = {
    PICKUP: "bg-emerald-400",
    DELIVERY: "bg-red-400",
    REST_STOP: "bg-amber-400",
    CUSTOMS: "bg-sky-400",
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const trip = demoTrips.find(t => t.id === id) || demoTrips[0]

    return (
        <MainLayout title="Dettaglio Viaggio">
            <div className="space-y-6 animate-fade-in max-w-5xl">
                {/* Back + Header */}
                <div>
                    <Link href="/viaggi" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Torna ai Viaggi
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border", getTripStatusColor(trip.status))}>
                                    {getTripStatusLabel(trip.status)}
                                </span>
                                {trip.isAdr && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/25">
                                        <AlertTriangle className="w-3 h-3" />
                                        ADR
                                    </span>
                                )}
                                {trip.isInternational && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                                        <Globe className="w-3 h-3" />
                                        Internazionale
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mt-2">{trip.cargoType}</h2>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                Modifica
                            </button>
                            <button className="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                Aggiorna Stato
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Details grid */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-foreground mb-4">Informazioni Viaggio</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Data Partenza</p>
                                        <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            {formatDateTime(trip.startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Km Totali</p>
                                        <p className="text-sm font-medium text-foreground mt-1">{formatKm(trip.totalKm)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Peso Carico</p>
                                        <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
                                            <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                            {trip.cargoWeight?.toLocaleString("it-IT")} kg
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Costo Stimato</p>
                                        <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
                                            <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                                            {formatCurrency(trip.estimatedCost)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Carburante</p>
                                        <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1.5">
                                            <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                                            {formatCurrency(trip.fuelCost)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Pedaggi</p>
                                        <p className="text-sm font-medium text-foreground mt-1">{formatCurrency(trip.tollCost)}</p>
                                    </div>
                                </div>
                            </div>
                            {trip.notes && (
                                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground">Note: {trip.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Stops Timeline */}
                        <div className="glass rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-foreground mb-5">Tappe del Viaggio</h3>
                            <div className="space-y-0">
                                {trip.stops.map((stop, index) => (
                                    <div key={stop.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-3 h-3 rounded-full border-2 border-background",
                                                stopTypeColor[stop.type] || "bg-zinc-400"
                                            )} />
                                            {index < trip.stops.length - 1 && (
                                                <div className="w-0.5 h-12 bg-border/50 my-1" />
                                            )}
                                        </div>
                                        <div className="pb-8 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-xs font-medium text-primary uppercase tracking-wider">{getStopTypeLabel(stop.type)}</p>
                                                    <p className="text-sm font-semibold text-foreground mt-0.5">{stop.address}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {stop.city}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">Arrivo stimato</p>
                                                    <p className="text-xs font-medium text-foreground">{formatDateTime(stop.estimatedArrival)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Driver */}
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Autista Assegnato</h3>
                            {trip.driver ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                        {trip.driver.name[0]}{trip.driver.surname[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{trip.driver.name} {trip.driver.surname}</p>
                                        <p className="text-xs text-muted-foreground">Autista</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Nessun autista assegnato</p>
                                    <button className="mt-2 text-xs text-primary hover:underline">Assegna autista</button>
                                </div>
                            )}
                        </div>

                        {/* Vehicle */}
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Veicolo Assegnato</h3>
                            {trip.vehicle ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{trip.vehicle.plate}</p>
                                            <p className="text-xs text-muted-foreground">{trip.vehicle.brand} {trip.vehicle.model}</p>
                                        </div>
                                    </div>
                                    <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium border", getVehicleTypeColor(trip.vehicle.type))}>
                                        {getVehicleTypeLabel(trip.vehicle.type)}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Truck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Nessun veicolo assegnato</p>
                                    <button className="mt-2 text-xs text-primary hover:underline">Assegna veicolo</button>
                                </div>
                            )}
                        </div>

                        {/* Documents */}
                        <div className="glass rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Documenti</h3>
                            <div className="space-y-2">
                                {trip.isInternational ? (
                                    <>
                                        <div className="flex items-center gap-2 text-xs">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span className="text-foreground">CMR — Lettera di Vettura</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Clock className="w-4 h-4 text-amber-400" />
                                            <span className="text-foreground">Documenti Doganali</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-foreground">DDT — Documento di Trasporto</span>
                                    </div>
                                )}
                                {trip.isAdr && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-foreground">Certificati ADR</span>
                                    </div>
                                )}
                            </div>
                            <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors">
                                <FileText className="w-3.5 h-3.5" />
                                Gestisci Documenti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
