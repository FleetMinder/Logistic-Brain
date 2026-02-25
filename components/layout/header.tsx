"use client"

import { Bell, Search, User, ChevronDown } from "lucide-react"
import { demoAlerts } from "@/lib/demo-data"
import { useState } from "react"
import { cn } from "@/lib/utils"

const unreadAlerts = demoAlerts.filter(a => !a.isRead)

export function Header({ title }: { title?: string }) {
    const [showAlerts, setShowAlerts] = useState(false)

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Left: Title */}
            <div>
                {title && (
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cerca viaggi, autisti..."
                        className="pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 transition-all"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadAlerts.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {unreadAlerts.length}
                            </span>
                        )}
                    </button>

                    {showAlerts && (
                        <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                            <div className="p-4 border-b border-border">
                                <h3 className="text-sm font-semibold text-foreground">Notifiche</h3>
                                <p className="text-xs text-muted-foreground">{unreadAlerts.length} non lette</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto scrollbar-thin">
                                {demoAlerts.filter(a => !a.isResolved).slice(0, 6).map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={cn(
                                            "p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors",
                                            !alert.isRead && "bg-primary/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                                alert.severity === "CRITICAL" ? "bg-red-500" :
                                                    alert.severity === "WARNING" ? "bg-amber-500" : "bg-sky-500"
                                            )} />
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center">
                                <a href="/compliance" className="text-xs text-primary hover:underline">Vedi tutti gli alert</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* User menu */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground hidden md:block">Admin</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
                </button>
            </div>
        </header>
    )
}
