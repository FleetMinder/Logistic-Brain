import { NextResponse } from "next/server"
import { demoDrivers } from "@/lib/demo-data"

export async function GET() {
    return NextResponse.json({ data: demoDrivers, total: demoDrivers.length })
}

export async function POST(request: Request) {
    const body = await request.json()
    const newDriver = {
        id: `driver-${Date.now()}`,
        ...body,
        weeklyHoursUsed: 0,
        dailyHoursUsed: 0,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    return NextResponse.json({ data: newDriver }, { status: 201 })
}
