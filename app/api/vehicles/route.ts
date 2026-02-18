import { NextResponse } from "next/server"
import { demoVehicles } from "@/lib/demo-data"

export async function GET() {
    return NextResponse.json({ data: demoVehicles, total: demoVehicles.length })
}

export async function POST(request: Request) {
    const body = await request.json()
    const newVehicle = {
        id: `vehicle-${Date.now()}`,
        ...body,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    return NextResponse.json({ data: newVehicle }, { status: 201 })
}
