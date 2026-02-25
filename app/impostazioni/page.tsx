import { MainLayout } from "@/components/layout/main-layout"
import {
    Building2,
    Key,
    Bell,
    Shield,
    Save,
    Database,
} from "lucide-react"

export default function ImpostazioniPage() {
    return (
        <MainLayout title="Impostazioni">
            <div className="space-y-6 animate-fade-in max-w-3xl">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Impostazioni</h2>
                    <p className="text-sm text-muted-foreground">Configurazione azienda, API e preferenze</p>
                </div>

                {/* Company */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Dati Azienda</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Ragione Sociale", value: "Logistic Brain S.r.l.", type: "text" },
                            { label: "Partita IVA", value: "IT12345678901", type: "text" },
                            { label: "Indirizzo", value: "Via della Logistica 1, Milano", type: "text" },
                            { label: "Email", value: "info@logisticbrain.it", type: "email" },
                            { label: "Telefono", value: "+39 02 1234567", type: "tel" },
                            { label: "Albo Autotrasportatori", value: "IT-MI-12345", type: "text" },
                        ].map((field) => (
                            <div key={field.label}>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field.label}</label>
                                <input
                                    type={field.type}
                                    defaultValue={field.value}
                                    className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        ))}
                    </div>
                    <button className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                        <Save className="w-4 h-4" />
                        Salva Modifiche
                    </button>
                </div>

                {/* Database */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Database className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">Database — Neon DB</h3>
                            <p className="text-xs text-muted-foreground">Connessione PostgreSQL serverless</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DATABASE_URL</label>
                            <input
                                type="password"
                                placeholder="postgresql://user:pass@ep-xxx.neon.tech/neondb"
                                className="mt-1.5 w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Configura in <code className="bg-secondary px-1 rounded">.env.local</code> per sicurezza</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs text-emerald-600">Modalita Demo — Dati locali attivi</p>
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Key className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "Mapbox API Key", placeholder: "pk.eyJ1...", desc: "Per mappe e geocodifica" },
                            { label: "OpenRouteService API Key", placeholder: "5b3ce3597...", desc: "Per ottimizzazione rotte HGV" },
                            { label: "HERE Maps API Key", placeholder: "your-here-key", desc: "Alternativa per routing" },
                        ].map((api) => (
                            <div key={api.label}>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{api.label}</label>
                                <p className="text-xs text-muted-foreground mb-1.5">{api.desc}</p>
                                <input
                                    type="password"
                                    placeholder={api.placeholder}
                                    className="w-full px-3 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Bell className="w-4 h-4 text-amber-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Notifiche</h3>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: "Alert scadenza documenti (30 giorni prima)", defaultChecked: true },
                            { label: "Alert ore guida autisti (80% del limite)", defaultChecked: true },
                            { label: "Alert revisione veicoli", defaultChecked: true },
                            { label: "Notifiche email giornaliere", defaultChecked: false },
                            { label: "Report settimanale automatico", defaultChecked: false },
                        ].map((notif) => (
                            <label key={notif.label} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                                <span className="text-sm text-foreground">{notif.label}</span>
                                <div className={`relative w-10 h-5 rounded-full transition-colors ${notif.defaultChecked ? "bg-primary" : "bg-secondary border border-border"}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${notif.defaultChecked ? "translate-x-5" : "translate-x-0.5"}`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* GDPR */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-red-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Privacy & GDPR</h3>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>I dati degli autisti sono trattati in conformita al <strong className="text-foreground">Regolamento UE 2016/679 (GDPR)</strong>.</p>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                Esporta Dati
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-red-50 border border-red-500/25 text-sm font-medium text-red-600 hover:bg-red-500/25 transition-colors">
                                Elimina Dati
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
