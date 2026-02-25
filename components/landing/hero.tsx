"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Cpu, Route, Shield, ArrowRight } from "lucide-react"

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-white to-white" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium mb-8"
                >
                    <Cpu className="w-3.5 h-3.5" />
                    Powered by AI — Gemini 2.0
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto"
                >
                    Ottimizza i tuoi trasporti con{" "}
                    <span className="text-gradient">l&apos;intelligenza artificiale</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
                >
                    La piattaforma intelligente per le PMI dell&apos;autotrasporto italiano.
                    Riduci i costi, ottimizza i percorsi e gestisci la tua flotta in un unico posto.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-teal-500/25"
                    >
                        Prova Gratis
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-foreground text-base font-semibold hover:bg-secondary transition-colors"
                    >
                        Vedi Demo
                    </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-muted-foreground"
                >
                    <span className="flex items-center gap-2">
                        <Route className="w-4 h-4 text-teal-600" />
                        Ottimizzazione percorsi
                    </span>
                    <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        Compliance CE 561/2006
                    </span>
                    <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-teal-600" />
                        AI integrata
                    </span>
                </motion.div>

                {/* Dashboard mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 relative"
                >
                    <div className="rounded-xl border border-border bg-white shadow-2xl shadow-black/5 overflow-hidden max-w-4xl mx-auto">
                        <div className="h-8 bg-secondary/50 border-b border-border flex items-center gap-1.5 px-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="p-6 bg-gradient-to-b from-secondary/20 to-white">
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {[
                                    { label: "Viaggi Attivi", value: "3", color: "border-teal-200 bg-teal-50" },
                                    { label: "Autisti", value: "4/6", color: "border-emerald-200 bg-emerald-50" },
                                    { label: "Flotta", value: "4/6", color: "border-indigo-200 bg-indigo-50" },
                                    { label: "Risparmi AI", value: "12%", color: "border-amber-200 bg-amber-50" },
                                ].map((card) => (
                                    <div key={card.label} className={`rounded-lg border p-3 ${card.color}`}>
                                        <p className="text-[10px] text-muted-foreground uppercase">{card.label}</p>
                                        <p className="text-xl font-bold text-foreground mt-1">{card.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="h-24 bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">Dashboard Operativa</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
