import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json()

        if (!priceId) {
            return NextResponse.json({ error: "priceId richiesto" }, { status: 400 })
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: "Stripe non configurato. Aggiungi STRIPE_SECRET_KEY a .env.local" }, { status: 500 })
        }

        const session = await getStripe().checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Errore sconosciuto"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
