"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function CtaSection() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setLoading(true)
        try {
            const res = await fetch("/api/email/welcome", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name: email.split("@")[0] }),
            })
            const data = await res.json()
            if (data.success) {
                setSent(true)
                toast.success("Email inviata! Controlla la tua casella.")
            } else {
                toast.error(data.error || "Errore nell'invio")
            }
        } catch {
            toast.error("Errore di rete")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl gradient-primary p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Pronto a ottimizzare la tua flotta?
                        </h2>
                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                            Inserisci la tua email per iniziare con 14 giorni di prova gratuita.
                        </p>

                        {sent ? (
                            <div className="flex items-center justify-center gap-2 text-white">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-lg font-semibold">Grazie! Controlla la tua email.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="La tua email aziendale"
                                    required
                                    className="w-full sm:flex-1 px-4 py-3 rounded-xl text-sm text-foreground bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-muted-foreground"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-700 text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {loading ? "Invio..." : "Inizia Gratis"}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
