"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Hexagon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled ? "bg-white/90 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
        )}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Hexagon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground tracking-tight leading-none">LOGISTIC</p>
                        <p className="text-xs font-semibold text-gradient leading-none mt-0.5">BRAIN</p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#funzionalita" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funzionalita</a>
                    <a href="#prezzi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Prezzi</a>
                    <a href="#come-funziona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Come Funziona</a>
                </div>

                {/* CTA buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Accedi
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Prova Gratis
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-b border-border px-6 py-4 space-y-3 animate-fade-in">
                    <a href="#funzionalita" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Funzionalita</a>
                    <a href="#prezzi" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Prezzi</a>
                    <a href="#come-funziona" onClick={() => setMobileOpen(false)} className="block text-sm text-foreground py-2">Come Funziona</a>
                    <hr className="border-border" />
                    <Link href="/dashboard" className="block text-sm text-foreground py-2">Accedi</Link>
                    <Link
                        href="/dashboard"
                        className="block text-center px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold"
                    >
                        Prova Gratis
                    </Link>
                </div>
            )}
        </nav>
    )
}
