import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Logistic Brain — Gestione Flotta & Viaggi",
    description: "Piattaforma avanzata per la pianificazione e gestione dei viaggi logistici. Ottimizzazione rotte, monitoraggio autisti, compliance normativa CE 561/2006.",
    keywords: ["logistica", "gestione flotta", "pianificazione viaggi", "autisti", "veicoli", "ADR"],
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
