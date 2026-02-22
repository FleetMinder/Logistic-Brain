import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, isBefore, addDays, differenceInDays } from "date-fns"
import { it } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// --- Date formatting ---

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

// --- Number formatting ---

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

// --- Compliance: document status ---

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

export function daysUntilExpiry(date: Date | string | null | undefined): number | null {
    if (!date) return null
    return differenceInDays(new Date(date), new Date())
}

export function getDocumentStatus(expirationDate: Date | string | null | undefined): "VALID" | "EXPIRING_SOON" | "EXPIRED" | "MISSING" {
    if (!expirationDate) return "MISSING"
    if (isExpired(expirationDate)) return "EXPIRED"
    if (isExpiringSoon(expirationDate)) return "EXPIRING_SOON"
    return "VALID"
}

export function getExpiryUrgencyLabel(date: Date | string | null | undefined): string {
    if (!date) return "Non disponibile"
    const days = daysUntilExpiry(date)
    if (days === null) return "Non disponibile"
    if (days < 0) return `Scaduto da ${Math.abs(days)} giorni`
    if (days === 0) return "Scade oggi"
    if (days === 1) return "Scade domani"
    if (days <= 7) return `Scade tra ${days} giorni`
    if (days <= 30) return `Scade tra ${days} giorni`
    if (days <= 90) return `Scade tra ${Math.ceil(days / 7)} settimane`
    return `Scade il ${formatDate(date)}`
}

// --- Compliance: driving hours (CE 561/2006) ---

export function getDrivingHoursStatus(hoursUsed: number, maxHours = 9): "ok" | "warning" | "critical" {
    const percentage = (hoursUsed / maxHours) * 100
    if (percentage >= 100) return "critical"
    if (percentage >= 80) return "warning"
    return "ok"
}

export function getRemainingDrivingHours(hoursUsed: number, maxHours = 9): number {
    return Math.max(0, maxHours - hoursUsed)
}

export function needsMandatoryBreak(continuousDrivingHours: number): boolean {
    return continuousDrivingHours >= 4.5
}

export function getRestStatus(lastRestEnd: Date | string | null | undefined): "ok" | "warning" | "critical" {
    if (!lastRestEnd) return "ok"
    const hoursSinceRest = (Date.now() - new Date(lastRestEnd).getTime()) / (1000 * 60 * 60)
    if (hoursSinceRest >= 13) return "critical" // Should have rested by now
    if (hoursSinceRest >= 11) return "warning"
    return "ok"
}

// --- Compliance: tachograph ---

export function getTachographDownloadStatus(lastDownload: Date | string | null | undefined): "ok" | "warning" | "overdue" {
    if (!lastDownload) return "overdue"
    const daysSince = differenceInDays(new Date(), new Date(lastDownload))
    if (daysSince > 28) return "overdue"
    if (daysSince > 21) return "warning"
    return "ok"
}

// --- Compliance: overall score ---

export function getComplianceColor(score: number): string {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
}

export function getComplianceBgColor(score: number): string {
    if (score >= 80) return "bg-emerald-500/15 border-emerald-500/25"
    if (score >= 60) return "bg-amber-500/15 border-amber-500/25"
    return "bg-red-500/15 border-red-500/25"
}

export function getComplianceLabel(score: number): string {
    if (score >= 90) return "Eccellente"
    if (score >= 80) return "Buono"
    if (score >= 60) return "Attenzione"
    if (score >= 40) return "Critico"
    return "Non conforme"
}

// --- Status colors & labels ---

export function getTripStatusColor(status: string): string {
    const colors: Record<string, string> = {
        PLANNED: "bg-sky-500/15 text-sky-400 border-sky-500/25",
        IN_PROGRESS: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
        CANCELLED: "bg-red-500/15 text-red-400 border-red-500/25",
    }
    return colors[status] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
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
        STANDARD: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
        ADR: "bg-orange-500/15 text-orange-400 border-orange-500/25",
        FRIGO: "bg-sky-500/15 text-sky-400 border-sky-500/25",
        ECCEZIONALE: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
    }
    return colors[type] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
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
        VALID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
        EXPIRING_SOON: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        EXPIRED: "bg-red-500/15 text-red-400 border-red-500/25",
        MISSING: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
    }
    return colors[status] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
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

export function getAlertSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
        CRITICAL: "bg-red-500/15 text-red-400 border-red-500/25",
        WARNING: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        INFO: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    }
    return colors[severity] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
}

export function getTachographTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        ANALOG: "Analogico",
        DIGITAL_V1: "Digitale V1",
        DIGITAL_V2: "Digitale V2",
        SMART_V2: "Smart V2",
    }
    return labels[type] || type
}

export function getTachographTypeColor(type: string): string {
    const colors: Record<string, string> = {
        ANALOG: "bg-red-500/15 text-red-400 border-red-500/25",
        DIGITAL_V1: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        DIGITAL_V2: "bg-sky-500/15 text-sky-400 border-sky-500/25",
        SMART_V2: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    }
    return colors[type] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/25"
}
