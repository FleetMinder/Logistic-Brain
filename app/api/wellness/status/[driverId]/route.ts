import { NextResponse } from "next/server"
import { demoDrivers } from "@/lib/demo-data"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ driverId: string }> }
) {
    const { driverId } = await params
    const driver = demoDrivers.find(d => d.id === driverId)
    if (!driver) {
        return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const maxDailyHours = 9
    const maxWeeklyHours = 56
    const breakThreshold = 4.5

    const status = {
        driverId: driver.id,
        name: `${driver.name} ${driver.surname}`,
        dailyHoursUsed: driver.dailyHoursUsed,
        dailyHoursRemaining: Math.max(0, maxDailyHours - driver.dailyHoursUsed),
        weeklyHoursUsed: driver.weeklyHoursUsed,
        weeklyHoursRemaining: Math.max(0, maxWeeklyHours - driver.weeklyHoursUsed),
        breakRequired: driver.dailyHoursUsed >= breakThreshold,
        canDrive: driver.dailyHoursUsed < maxDailyHours && driver.weeklyHoursUsed < maxWeeklyHours,
        alerts: [] as string[],
    }

    if (driver.dailyHoursUsed >= maxDailyHours) {
        status.alerts.push("LIMITE GIORNALIERO RAGGIUNTO — Riposo obbligatorio")
    } else if (driver.dailyHoursUsed >= maxDailyHours * 0.8) {
        status.alerts.push("Avviso: 80% del limite giornaliero raggiunto")
    }

    if (driver.weeklyHoursUsed >= maxWeeklyHours * 0.9) {
        status.alerts.push("Avviso: 90% del limite settimanale raggiunto")
    }

    return NextResponse.json({ data: status })
}
