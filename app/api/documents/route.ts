import { NextResponse } from "next/server"
import { demoDocuments } from "@/lib/demo-data"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get("tripId")
    const driverId = searchParams.get("driverId")
    const vehicleId = searchParams.get("vehicleId")
    const status = searchParams.get("status")

    let docs = demoDocuments
    if (tripId) docs = docs.filter(d => d.tripId === tripId)
    if (driverId) docs = docs.filter(d => d.driverId === driverId)
    if (vehicleId) docs = docs.filter(d => d.vehicleId === vehicleId)
    if (status) docs = docs.filter(d => d.status === status)

    return NextResponse.json({ data: docs, total: docs.length })
}

export async function POST(request: Request) {
    const body = await request.json()
    const newDoc = {
        id: `doc-${Date.now()}`,
        status: "VALID",
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    return NextResponse.json({ data: newDoc }, { status: 201 })
}
