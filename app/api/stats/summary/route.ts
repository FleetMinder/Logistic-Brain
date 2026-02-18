import { NextResponse } from "next/server"
import { demoStats, demoTrips, demoDrivers, demoVehicles, demoAlerts } from "@/lib/demo-data"

export async function GET() {
    const summary = {
        ...demoStats,
        recentTrips: demoTrips.slice(0, 5),
        criticalAlerts: demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved),
        availableDrivers: demoDrivers.filter(d => d.isAvailable),
        availableVehicles: demoVehicles.filter(v => v.isAvailable),
    }
    return NextResponse.json({ data: summary })
}
