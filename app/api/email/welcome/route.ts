import { NextResponse } from "next/server"
import { getResend } from "@/lib/resend"
import { WelcomeEmail } from "@/components/emails/welcome"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email richiesta" }, { status: 400 })
        }

        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: "Resend non configurato. Aggiungi RESEND_API_KEY a .env.local" }, { status: 500 })
        }

        const resend = getResend()
        const { data, error } = await resend.emails.send({
            from: "Logistic Brain <onboarding@resend.dev>",
            to: email,
            subject: "Benvenuto su Logistic Brain!",
            react: WelcomeEmail({ name: name || "Utente" }),
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, id: data?.id })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Errore sconosciuto"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
