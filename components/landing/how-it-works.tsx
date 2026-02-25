"use client"

import { motion } from "motion/react"
import { Upload, Cpu, TrendingDown } from "lucide-react"

const steps = [
    {
        step: "01",
        icon: Upload,
        title: "Carica i tuoi dati",
        description: "Inserisci autisti, veicoli e viaggi. Importa da file o inserisci manualmente in pochi minuti.",
    },
    {
        step: "02",
        icon: Cpu,
        title: "L'AI ottimizza",
        description: "L'intelligenza artificiale analizza la tua flotta e suggerisce le migliori assegnazioni, rotte e pianificazioni.",
    },
    {
        step: "03",
        icon: TrendingDown,
        title: "Monitora e risparmia",
        description: "Segui i KPI in tempo reale, ricevi alert automatici e riduci i costi operativi mese dopo mese.",
    },
]

export function HowItWorks() {
    return (
        <section id="come-funziona" className="py-24 bg-secondary/30">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">Come Funziona</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Tre passi per ottimizzare la tua flotta
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-500/20">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{step.step}</span>
                                <h3 className="text-lg font-semibold text-foreground mt-2 mb-3">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
