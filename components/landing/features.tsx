"use client"

import { motion } from "motion/react"
import { Cpu, Truck, Shield, BarChart3 } from "lucide-react"

const features = [
    {
        icon: Cpu,
        title: "Ottimizzazione AI",
        description: "L'intelligenza artificiale analizza percorsi, assegnazioni autista-veicolo e costi per trovare la soluzione migliore.",
        color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
        icon: Truck,
        title: "Gestione Flotta",
        description: "Veicoli, manutenzione, documenti e scadenze in un unico posto. Mai piu fogli di calcolo.",
        color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
        icon: Shield,
        title: "Compliance Automatica",
        description: "Monitoraggio CE 561/2006, ADR, tachigrafi e scadenze documenti. Alert automatici prima delle violazioni.",
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
        icon: BarChart3,
        title: "Dashboard in Tempo Reale",
        description: "KPI operativi, stato autisti, viaggi attivi e alert critici sempre sotto controllo.",
        color: "bg-amber-50 text-amber-600 border-amber-200",
    },
]

export function Features() {
    return (
        <section id="funzionalita" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Funzionalita</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Tutto quello che ti serve per gestire la tua flotta
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                        Una piattaforma completa per ottimizzare le operazioni, ridurre i costi e restare in regola.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="rounded-xl border border-border p-6 hover:shadow-lg hover:shadow-black/5 transition-shadow"
                            >
                                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${feature.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
