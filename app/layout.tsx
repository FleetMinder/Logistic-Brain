import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Logistic Brain - Compliance & Operations Hub",
    description: "Compliance hub per PMI dell'autotrasporto italiano. Monitoraggio scadenze, CE 561/2006, ADR, tachigrafo digitale, eCMR. AI Dispatch con verifica normativa integrata.",
    keywords: ["logistica", "compliance", "autotrasporto", "CE 561/2006", "ADR", "tachigrafo", "eCMR", "PMI"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it" className="dark">
            <body className={`${inter.className} antialiased`}>
                {children}
            </body>
        </html>
    );
}
