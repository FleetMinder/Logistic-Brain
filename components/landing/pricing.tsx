"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
    },
]

export function Pricing() {
    return (
        <section id="prezzi" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Prezzi</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Scegli il piano giusto per la tua flotta
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        Tutti i piani includono 14 giorni di prova gratuita. Nessuna carta di credito richiesta.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={cn(
                                "rounded-xl border p-6 flex flex-col",
                                tier.popular
                                    ? "border-teal-300 bg-teal-50/30 shadow-lg shadow-teal-500/10 relative"
                                    : "border-border"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-white text-xs font-semibold">
                                    Piu popolare
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
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "block text-center py-3 rounded-lg text-sm font-semibold transition-all",
                                    tier.popular
                                        ? "gradient-primary text-white hover:opacity-90"
                                        : "border border-border text-foreground hover:bg-secondary"
                                )}
                            >
                                Inizia la prova gratuita
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
