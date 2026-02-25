import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Logistic Brain - Ottimizzazione Trasporti con AI",
    description: "Piattaforma intelligente per PMI dell'autotrasporto italiano. Ottimizza percorsi, gestisci la flotta e i tuoi autisti con l'AI. Compliance integrata.",
    keywords: ["logistica", "ottimizzazione rotte", "autotrasporto", "AI", "gestione flotta", "PMI"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body className={`${inter.className} antialiased`}>
                {children}
                <Toaster position="bottom-right" richColors />
            </body>
        </html>
    );
}
