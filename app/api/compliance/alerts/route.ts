import { NextResponse } from "next/server"
import { demoAlerts, demoDocuments } from "@/lib/demo-data"

export async function GET() {
    const expiredDocs = demoDocuments.filter(d => d.status === "EXPIRED")
    const expiringSoonDocs = demoDocuments.filter(d => d.status === "EXPIRING_SOON")
    const criticalAlerts = demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved)
    const warningAlerts = demoAlerts.filter(a => a.severity === "WARNING" && !a.isResolved)

    return NextResponse.json({
        data: {
            alerts: demoAlerts.filter(a => !a.isResolved),
            expiredDocuments: expiredDocs,
            expiringSoonDocuments: expiringSoonDocs,
            summary: {
                critical: criticalAlerts.length,
                warning: warningAlerts.length,
                expired: expiredDocs.length,
                expiringSoon: expiringSoonDocs.length,
            }
        }
    })
}
