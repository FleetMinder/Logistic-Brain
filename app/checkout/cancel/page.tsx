import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">Pagamento annullato</h1>
                <p className="text-muted-foreground mb-8">
                    Il pagamento non e stato completato. Puoi tornare ai piani e riprovare quando vuoi.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/prezzi"
                        className="inline-flex px-6 py-3 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Torna ai Piani
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex px-6 py-3 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
