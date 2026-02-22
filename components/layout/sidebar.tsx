"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Route,
    Users,
    Truck,
    FileText,
    Shield,
    Settings,
    ChevronLeft,
    ChevronRight,
    Hexagon,
    AlertTriangle,
    Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { demoStats, demoAlerts } from "@/lib/demo-data"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/compliance", label: "Compliance", icon: Shield },
    { href: "/viaggi", label: "Viaggi", icon: Route },
    { href: "/ai-dispatch", label: "AI Dispatch", icon: Cpu },
    { href: "/autisti", label: "Autisti", icon: Users },
    { href: "/veicoli", label: "Veicoli", icon: Truck },
    { href: "/documenti", label: "Documenti", icon: FileText },
]

const bottomNavItems = [
    { href: "/impostazioni", label: "Impostazioni", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const criticalCount = demoAlerts.filter(a => a.severity === "CRITICAL" && !a.isResolved).length
    const warningCount = demoAlerts.filter(a => a.severity === "WARNING" && !a.isResolved).length
    const totalUrgent = criticalCount + warningCount

    return (
        <aside
            className={cn(
                "relative flex flex-col h-screen border-r border-border transition-all duration-300 ease-in-out",
                "bg-sidebar",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
                collapsed && "justify-center px-2"
            )}>
                <div className="flex-shrink-0 w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                    <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <p className="text-sm font-bold text-foreground tracking-tight leading-none">LOGISTIC</p>
                        <p className="text-xs font-semibold text-gradient leading-none mt-0.5">BRAIN</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon
                    const isCompliance = item.href === "/compliance"
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-sidebar-primary/12 text-sidebar-primary border border-sidebar-primary/15"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={cn(
                                "w-[18px] h-[18px] flex-shrink-0 transition-colors",
                                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                            )} />
                            {!collapsed && (
                                <span className="animate-fade-in">
                                    {item.label}
                                </span>
                            )}
                            {!collapsed && isCompliance && totalUrgent > 0 && (
                                <span className={cn(
                                    "ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full",
                                    criticalCount > 0
                                        ? "bg-red-500/20 text-red-400"
                                        : "bg-amber-500/20 text-amber-400"
                                )}>
                                    {totalUrgent}
                                </span>
                            )}
                            {isActive && !collapsed && !isCompliance && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Compliance score badge */}
            {!collapsed && (
                <Link href="/compliance" className="block mx-3 mb-3">
                    <div className={cn(
                        "p-3 rounded-lg border animate-fade-in transition-colors hover:bg-secondary/50",
                        demoStats.complianceScore >= 80
                            ? "bg-emerald-500/8 border-emerald-500/15"
                            : demoStats.complianceScore >= 60
                                ? "bg-amber-500/8 border-amber-500/15"
                                : "bg-red-500/8 border-red-500/15"
                    )}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Shield className={cn(
                                    "w-4 h-4 flex-shrink-0",
                                    demoStats.complianceScore >= 80 ? "text-emerald-400" :
                                        demoStats.complianceScore >= 60 ? "text-amber-400" : "text-red-400"
                                )} />
                                <p className="text-xs font-semibold text-foreground">Compliance</p>
                            </div>
                            <p className={cn(
                                "text-lg font-bold",
                                demoStats.complianceScore >= 80 ? "text-emerald-400" :
                                    demoStats.complianceScore >= 60 ? "text-amber-400" : "text-red-400"
                            )}>
                                {demoStats.complianceScore}%
                            </p>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all",
                                    demoStats.complianceScore >= 80 ? "bg-emerald-400" :
                                        demoStats.complianceScore >= 60 ? "bg-amber-400" : "bg-red-400"
                                )}
                                style={{ width: `${demoStats.complianceScore}%` }}
                            />
                        </div>
                        {criticalCount > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                <p className="text-[11px] text-red-400">{criticalCount} alert critici</p>
                            </div>
                        )}
                    </div>
                </Link>
            )}

            {/* Bottom nav */}
            <div className="px-2 pb-4 space-y-0.5 border-t border-sidebar-border pt-4">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-sidebar-primary/12 text-sidebar-primary"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                        </Link>
                    )
                })}
            </div>

            {/* Collapse button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors shadow-sm z-10"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>
        </aside>
    )
}
