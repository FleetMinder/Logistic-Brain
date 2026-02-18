import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns"
import { it } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined, fmt = "dd/MM/yyyy"): string {
    if (!date) return "—"
    return format(new Date(date), fmt, { locale: it })
}

export function formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return "—"
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: it })
}

export function formatRelative(date: Date | string | null | undefined): string {
    if (!date) return "—"
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: it })
}

export function formatKm(km: number | null | undefined): string {
    if (km == null) return "—"
    return `${km.toLocaleString("it-IT")} km`
}

export function formatCurrency(amount: number | null | undefined): string {
    if (amount == null) return "—"
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount)
}

export function formatHours(hours: number | null | undefined): string {
    if (hours == null) return "—"
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function isExpiringSoon(date: Date | string | null | undefined, daysThreshold = 30): boolean {
    if (!date) return false
    const d = new Date(date)
    const threshold = addDays(new Date(), daysThreshold)
    return isBefore(d, threshold) && isAfter(d, new Date())
}

export function isExpired(date: Date | string | null | undefined): boolean {
    if (!date) return false
    return isBefore(new Date(date), new Date())
}

export function getDocumentStatus(expirationDate: Date | string | null | undefined): "VALID" | "EXPIRING_SOON" | "EXPIRED" | "MISSING" {
    if (!expirationDate) return "MISSING"
    if (isExpired(expirationDate)) return "EXPIRED"
    if (isExpiringSoon(expirationDate)) return "EXPIRING_SOON"
    return "VALID"
}

export function getDrivingHoursStatus(hoursUsed: number, maxHours = 9): "ok" | "warning" | "critical" {
    const percentage = (hoursUsed / maxHours) * 100
    if (percentage >= 100) return "critical"
    if (percentage >= 80) return "warning"
    return "ok"
}

export function getTripStatusColor(status: string): string {
    const colors: Record<string, string> = {
        PLANNED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        IN_PROGRESS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export function getTripStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        PLANNED: "Pianificato",
        IN_PROGRESS: "In Corso",
        COMPLETED: "Completato",
        CANCELLED: "Annullato",
    }
    return labels[status] || status
}

export function getVehicleTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        STANDARD: "Standard",
        ADR: "ADR",
        FRIGO: "Refrigerato",
        ECCEZIONALE: "Eccezionale",
    }
    return labels[type] || type
}

export function getVehicleTypeColor(type: string): string {
    const colors: Record<string, string> = {
        STANDARD: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        ADR: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        FRIGO: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        ECCEZIONALE: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export function getDocumentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        DDT: "DDT",
        CMR: "CMR",
        ADR_CERT: "Cert. ADR",
        LICENSE: "Patente",
        CQC: "CQC",
        REVISION: "Revisione",
        INSURANCE: "Assicurazione",
        CUSTOMS: "Doganale",
        PERMIT: "Permesso",
    }
    return labels[type] || type
}

export function getDocumentStatusColor(status: string): string {
    const colors: Record<string, string> = {
        VALID: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        EXPIRING_SOON: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        EXPIRED: "bg-red-500/20 text-red-400 border-red-500/30",
        MISSING: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export function getStopTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        PICKUP: "Ritiro",
        DELIVERY: "Consegna",
        REST_STOP: "Sosta",
        CUSTOMS: "Dogana",
    }
    return labels[type] || type
}
