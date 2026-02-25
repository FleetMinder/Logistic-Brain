import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Webhook non configurato" }, { status: 400 })
    }

    try {
        const event = getStripe().webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object
                console.log("[Stripe] Checkout completato:", session.id, "Email:", session.customer_email)
                break
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object
                console.log("[Stripe] Abbonamento cancellato:", subscription.id)
                break
            }
            default:
                console.log("[Stripe] Evento:", event.type)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Errore webhook"
        console.error("[Stripe] Errore webhook:", message)
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
