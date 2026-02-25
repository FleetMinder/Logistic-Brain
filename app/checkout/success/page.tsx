import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">Pagamento completato!</h1>
                <p className="text-muted-foreground mb-8">
                    Il tuo abbonamento e attivo. Ora puoi accedere a tutte le funzionalita del piano scelto.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex px-6 py-3 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    Vai alla Dashboard
                </Link>
            </div>
        </div>
    )
}
