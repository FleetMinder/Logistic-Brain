import * as React from "react"

interface WelcomeEmailProps {
    name?: string
}

export function WelcomeEmail({ name = "Utente" }: WelcomeEmailProps) {
    return (
        <div style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: 560, margin: "0 auto", padding: 32 }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{
                    display: "inline-block",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #2db39e 0%, #2492a0 100%)",
                    marginBottom: 16,
                }} />
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                    Benvenuto su Logistic Brain
                </h1>
            </div>

            {/* Body */}
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                Ciao <strong>{name}</strong>,
            </p>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 24 }}>
                Grazie per aver scelto Logistic Brain! La tua piattaforma per l&apos;ottimizzazione
                dei trasporti e pronta. Ecco cosa puoi fare subito:
            </p>

            {/* Features list */}
            <div style={{ marginBottom: 32 }}>
                {[
                    "Ottimizza i percorsi con l'AI",
                    "Gestisci la tua flotta e i tuoi autisti",
                    "Monitora la compliance in tempo reale",
                ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: "#f0fdfa",
                            border: "1px solid #99f6e4",
                            textAlign: "center",
                            lineHeight: "24px",
                            fontSize: 12,
                            color: "#0d9488",
                            fontWeight: 700,
                            flexShrink: 0,
                        }}>
                            {i + 1}
                        </div>
                        <span style={{ fontSize: 14, color: "#334155" }}>{item}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <a
                    href="https://logistic-brain.vercel.app/dashboard"
                    style={{
                        display: "inline-block",
                        padding: "14px 32px",
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #2db39e 0%, #2492a0 100%)",
                        color: "white",
                        fontSize: 16,
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    Vai alla Dashboard
                </a>
            </div>

            {/* Footer */}
            <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", marginBottom: 24 }} />
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                Logistic Brain — Ottimizzazione Trasporti con AI
                <br />
                H-Farm College — Technology for Entrepreneurs
            </p>
        </div>
    )
}
