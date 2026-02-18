import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface MainLayoutProps {
    children: React.ReactNode
    title?: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={title} />
                <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
