"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const tiers = [
    {
        name: "Starter",
        price: 29,
        description: "Per piccole flotte fino a 5 veicoli",
        features: [
            "Fino a 5 veicoli",
            "Fino a 10 autisti",
            "Dashboard operativa",
            "Gestione documenti",
            "Alert scadenze",
        ],
        priceId: "price_starter_monthly",
    },
    {
        name: "Professional",
        price: 79,
        description: "Per flotte in crescita fino a 20 veicoli",
        features: [
            "Fino a 20 veicoli",
            "Autisti illimitati",
            "Ottimizzazione AI",
            "Compliance avanzata",
            "Report personalizzati",
            "Supporto prioritario",
        ],
        priceId: "price_pro_monthly",
        popular: true,
    },
    {
        name: "Enterprise",
        price: 149,
        description: "Per flotte fino a 50 veicoli",
        features: [
            "Fino a 50 veicoli",
            "Tutto del Professional",
            "API personalizzate",
            "Integrazioni ERP",
            "Account manager dedicato",
            "SLA garantito",
        ],
        priceId: "price_enterprise_monthly",
    },
]

export default function PrezziPage() {
    const [loading, setLoading] = useState<string | null>(null)

    const handleCheckout = async (priceId: string) => {
        setLoading(priceId)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || "Errore durante il checkout")
            }
        } catch {
            alert("Errore di rete")
        } finally {
            setLoading(null)
        }
    }

    return (
        <MainLayout title="Prezzi">
            <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Scegli il tuo piano</h2>
                    <p className="text-sm text-muted-foreground mt-2">14 giorni di prova gratuita su tutti i piani</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={cn(
                                "rounded-xl border p-6 flex flex-col",
                                tier.popular
                                    ? "border-teal-300 bg-teal-50/30 shadow-lg shadow-teal-500/10 relative"
                                    : "border-border"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-white text-xs font-semibold">
                                    Consigliato
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                                <span className="text-muted-foreground ml-1">/mese</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                                        <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCheckout(tier.priceId)}
                                disabled={loading !== null}
                                className={cn(
                                    "w-full py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50",
                                    tier.popular
                                        ? "gradient-primary text-white hover:opacity-90"
                                        : "border border-border text-foreground hover:bg-secondary"
                                )}
                            >
                                {loading === tier.priceId ? "Caricamento..." : "Scegli Piano"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
