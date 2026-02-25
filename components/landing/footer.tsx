import { Hexagon } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="py-12 border-t border-border bg-secondary/20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                            <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-foreground tracking-tight leading-none">LOGISTIC</p>
                            <p className="text-[10px] font-semibold text-gradient leading-none mt-0.5">BRAIN</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#funzionalita" className="hover:text-foreground transition-colors">Funzionalita</a>
                        <a href="#prezzi" className="hover:text-foreground transition-colors">Prezzi</a>
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                    </div>

                    {/* Credits */}
                    <p className="text-xs text-muted-foreground">
                        H-Farm College — Technology for Entrepreneurs
                    </p>
                </div>
            </div>
        </footer>
    )
}
