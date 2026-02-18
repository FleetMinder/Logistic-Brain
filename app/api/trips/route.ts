import { NextResponse } from "next/server"
import { demoTrips } from "@/lib/demo-data"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const driverId = searchParams.get("driverId")
    const vehicleId = searchParams.get("vehicleId")

    let trips = demoTrips

    if (status) trips = trips.filter(t => t.status === status)
    if (driverId) trips = trips.filter(t => t.driverId === driverId)
    if (vehicleId) trips = trips.filter(t => t.vehicleId === vehicleId)

    return NextResponse.json({ data: trips, total: trips.length })
}

export async function POST(request: Request) {
    const body = await request.json()
    const newTrip = {
        id: `trip-${Date.now()}`,
        status: "PLANNED",
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    return NextResponse.json({ data: newTrip }, { status: 201 })
}
