import { NextRequest, NextResponse } from "next/server"

interface DriverContext {
    id: string
    name: string
    surname: string
    isAvailable: boolean
    dailyHoursUsed: number
    weeklyHoursUsed: number
    biweeklyHoursUsed: number
    adrCertificate: boolean
    licenseDeadline: string
    cqcDeadline: string
    adrDeadline: string | null
    tachographCardDeadline: string
    lastTachographDownload: string
    lastWeeklyRest: string | null
    notes: string | null
}

interface VehicleContext {
    id: string
    plate: string
    brand: string
    model: string
    type: string
    maxCapacityKg: number
    maxCapacityM3: number | null
    isAvailable: boolean
    tachographType: string
    revisionDeadline: string
    insuranceDeadline: string
    notes: string | null
}

interface TripContext {
    id: string
    status: string
    cargoType: string
    cargoWeight: number
    isInternational: boolean
    isAdr: boolean
    startDate: string
    totalKm: number
    estimatedCost: number
    stops: Array<{ city: string; type: string }>
    driverId: string | null
    vehicleId: string | null
    complianceCheck?: {
        overallStatus: string
        issues: string[]
    }
}

interface DispatchRequest {
    userQuery: string
    context: {
        drivers: DriverContext[]
        vehicles: VehicleContext[]
        trips: TripContext[]
    }
}

function buildComplianceAnalysis(context: DispatchRequest["context"]): string {
    const issues: string[] = []
    const today = new Date()

    context.drivers.forEach(d => {
        const licDays = Math.ceil((new Date(d.licenseDeadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const cqcDays = Math.ceil((new Date(d.cqcDeadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const tachDays = d.lastTachographDownload
            ? Math.floor((today.getTime() - new Date(d.lastTachographDownload).getTime()) / (1000 * 60 * 60 * 24))
            : 999

        if (licDays <= 0) issues.push(`BLOCCANTE: Patente di ${d.name} ${d.surname} SCADUTA`)
        else if (licDays <= 30) issues.push(`URGENTE: Patente di ${d.name} ${d.surname} scade tra ${licDays} giorni`)

        if (cqcDays <= 0) issues.push(`BLOCCANTE: CQC di ${d.name} ${d.surname} SCADUTA`)
        else if (cqcDays <= 30) issues.push(`URGENTE: CQC di ${d.name} ${d.surname} scade tra ${cqcDays} giorni`)

        if (d.adrCertificate && d.adrDeadline) {
            const adrDays = Math.ceil((new Date(d.adrDeadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            if (adrDays <= 0) issues.push(`BLOCCANTE: Cert. ADR di ${d.name} ${d.surname} SCADUTO`)
            else if (adrDays <= 30) issues.push(`URGENTE: Cert. ADR di ${d.name} ${d.surname} scade tra ${adrDays} giorni`)
        }

        if (tachDays > 28) issues.push(`VIOLAZIONE: Scarico tachigrafo di ${d.name} ${d.surname} scaduto (${tachDays} giorni, limite 28)`)

        if (d.dailyHoursUsed >= 9) issues.push(`LIMITE: ${d.name} ${d.surname} ha raggiunto il limite giornaliero (${d.dailyHoursUsed}h/9h)`)
        else if (d.dailyHoursUsed >= 7.2) issues.push(`ATTENZIONE: ${d.name} ${d.surname} all'80% del limite giornaliero (${d.dailyHoursUsed}h/9h)`)

        if (d.weeklyHoursUsed >= 56) issues.push(`LIMITE: ${d.name} ${d.surname} ha raggiunto il limite settimanale (${d.weeklyHoursUsed}h/56h)`)
        else if (d.weeklyHoursUsed >= 44.8) issues.push(`ATTENZIONE: ${d.name} ${d.surname} all'80% del limite settimanale (${d.weeklyHoursUsed}h/56h)`)

        if (d.biweeklyHoursUsed >= 90) issues.push(`LIMITE: ${d.name} ${d.surname} ha raggiunto il limite bisettimanale (${d.biweeklyHoursUsed}h/90h)`)
        else if (d.biweeklyHoursUsed >= 80) issues.push(`ATTENZIONE: ${d.name} ${d.surname} vicino al limite bisettimanale (${d.biweeklyHoursUsed}h/90h)`)
    })

    context.vehicles.forEach(v => {
        const revDays = Math.ceil((new Date(v.revisionDeadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const insDays = Math.ceil((new Date(v.insuranceDeadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (revDays <= 0) issues.push(`BLOCCANTE: Revisione veicolo ${v.plate} SCADUTA`)
        else if (revDays <= 30) issues.push(`URGENTE: Revisione veicolo ${v.plate} scade tra ${revDays} giorni`)

        if (insDays <= 0) issues.push(`BLOCCANTE: Assicurazione veicolo ${v.plate} SCADUTA`)
        else if (insDays <= 30) issues.push(`URGENTE: Assicurazione veicolo ${v.plate} scade tra ${insDays} giorni`)

        if (v.tachographType === "DIGITAL_V1" || v.tachographType === "ANALOG") {
            issues.push(`OBBLIGO: Veicolo ${v.plate} necessita retrofit tachigrafo Smart V2 entro 01/07/2026`)
        }
    })

    context.trips.forEach(t => {
        if (t.complianceCheck && t.complianceCheck.issues.length > 0) {
            t.complianceCheck.issues.forEach(issue => {
                issues.push(`VIAGGIO ${t.id}: ${issue}`)
            })
        }

        if (t.isAdr && t.driverId) {
            const driver = context.drivers.find(d => d.id === t.driverId)
            if (driver && !driver.adrCertificate) {
                issues.push(`BLOCCANTE: Viaggio ADR ${t.id} assegnato ad autista senza certificato ADR (${driver.name} ${driver.surname})`)
            }
        }

        if (t.isInternational) {
            issues.push(`DOCUMENTO: Viaggio internazionale ${t.id} — verificare CMR e documenti doganali`)
        }
    })

    return issues.length > 0 ? issues.join("\n") : "Nessun problema di compliance rilevato."
}

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: "GEMINI_API_KEY non configurata",
                    details:
                        "Aggiungi GEMINI_API_KEY nel file .env.local per abilitare l'AI Dispatch. Puoi ottenere una chiave su https://aistudio.google.com/",
                },
                { status: 503 }
            )
        }

        const body: DispatchRequest = await req.json()
        const { userQuery, context } = body

        const complianceAnalysis = buildComplianceAnalysis(context)

        const driversSection = context.drivers
            .map(
                (d) =>
                    `- ${d.name} ${d.surname} (ID: ${d.id})
    - Stato: ${d.isAvailable ? "Disponibile" : "In servizio"}
    - Ore guida: giorno ${d.dailyHoursUsed}h/9h | settimana ${d.weeklyHoursUsed}h/56h | bisett. ${d.biweeklyHoursUsed}h/90h
    - Ore residue: giorno ${Math.max(0, 9 - d.dailyHoursUsed)}h | settimana ${Math.max(0, 56 - d.weeklyHoursUsed)}h
    - Certificato ADR: ${d.adrCertificate ? "Si" : "No"}${d.adrDeadline ? ` (scade: ${new Date(d.adrDeadline).toLocaleDateString("it-IT")})` : ""}
    - Patente: scade ${new Date(d.licenseDeadline).toLocaleDateString("it-IT")}
    - CQC: scade ${new Date(d.cqcDeadline).toLocaleDateString("it-IT")}
    - Ultimo scarico tachigrafo: ${new Date(d.lastTachographDownload).toLocaleDateString("it-IT")}
    - Ultimo riposo settimanale: ${d.lastWeeklyRest ? new Date(d.lastWeeklyRest).toLocaleDateString("it-IT") : "N/D"}
    ${d.notes ? `- Note: ${d.notes}` : ""}`
            )
            .join("\n\n")

        const vehiclesSection = context.vehicles
            .map(
                (v) =>
                    `- ${v.brand} ${v.model} — Targa: ${v.plate} (ID: ${v.id})
    - Tipo: ${v.type} | Capacita: ${v.maxCapacityKg.toLocaleString("it-IT")} kg${v.maxCapacityM3 ? ` / ${v.maxCapacityM3} m3` : ""}
    - Stato: ${v.isAvailable ? "Disponibile" : "In uso"}
    - Tachigrafo: ${v.tachographType}
    - Revisione: scade ${new Date(v.revisionDeadline).toLocaleDateString("it-IT")}
    - Assicurazione: scade ${new Date(v.insuranceDeadline).toLocaleDateString("it-IT")}
    ${v.notes ? `- Note: ${v.notes}` : ""}`
            )
            .join("\n\n")

        const tripsSection = context.trips
            .map(
                (t) =>
                    `- ${t.cargoType} — ${t.totalKm.toLocaleString("it-IT")} km (ID: ${t.id})
    - Stato: ${t.status} | Data: ${new Date(t.startDate).toLocaleDateString("it-IT")}
    - Peso: ${t.cargoWeight.toLocaleString("it-IT")} kg | Costo stimato: EUR ${t.estimatedCost.toLocaleString("it-IT")}
    - ADR: ${t.isAdr ? "Si (richiesto)" : "No"} | Internazionale: ${t.isInternational ? "Si" : "No"}
    - Percorso: ${t.stops.map((s) => `${s.city} (${s.type})`).join(" > ")}
    - Autista: ${t.driverId || "Non assegnato"} | Veicolo: ${t.vehicleId || "Non assegnato"}
    - Compliance: ${t.complianceCheck?.overallStatus || "Non verificato"}${t.complianceCheck?.issues?.length ? ` — ${t.complianceCheck.issues.join("; ")}` : ""}`
            )
            .join("\n\n")

        const systemPrompt = `Sei un esperto di logistica, ottimizzazione dei trasporti e compliance normativa per aziende italiane di autotrasporto (PMI con 1-50 veicoli). Il tuo obiettivo principale e OTTIMIZZARE costi, tempi e risorse, garantendo al contempo la piena conformita normativa.

COMPETENZE DI OTTIMIZZAZIONE:
- Ottimizzazione percorsi: consolidamento carichi, scelta percorsi alternativi, riduzione km a vuoto
- Gestione flotta: bilanciamento utilizzo veicoli, matching ottimale veicolo-carico, pianificazione manutenzione
- Gestione autisti: bilanciamento carichi di lavoro, ottimizzazione turni nel rispetto dei limiti orari
- Riduzione costi: carburante (velocita ottimale, percorsi efficienti), pedaggi, straordinari
- Pianificazione: scheduling settimanale, prevenzione colli di bottiglia, gestione picchi

COMPETENZE NORMATIVE:
- Regolamento CE 561/2006: tempi di guida e riposo (9h/giorno max, estendibile a 10h due volte a settimana; 56h/settimana; 90h/bisettimanale; pausa 45min ogni 4h30; riposo giornaliero 11h consecutive min; riposo settimanale 45h consecutive)
- Normativa ADR: trasporto merci pericolose (certificato autista obbligatorio, approvazione veicolo, equipaggiamento di sicurezza, documenti di trasporto ADR)
- Convenzione CMR / eCMR: lettera di vettura per trasporti internazionali su strada
- Tachigrafo digitale (Reg. UE 165/2014): scarico dati conducente ogni 28 giorni, dati veicolo ogni 90 giorni, calibrazione ogni 2 anni, obbligo Smart V2 entro 01/07/2026
- Mobility Package (Reg. UE 2020/1054): max 3 operazioni cabotaggio in 7 giorni + cooling-off 4 giorni, rientro veicolo ogni 8 settimane, rientro autista ogni 4 settimane, divieto riposo settimanale in cabina

APPROCCIO — OTTIMIZZAZIONE + COMPLIANCE:
Per ogni raccomandazione:
1. Proponi la soluzione PIU EFFICIENTE in termini di costi, tempi e risorse
2. Verifica che sia conforme (documenti, ore guida, veicolo adatto)
3. Se l'opzione ottimale non e conforme, proponi la migliore alternativa conforme e quantifica il delta di costo
4. Fornisci sempre stime numeriche: risparmio in EUR, riduzione km, riduzione tempo

CHECKLIST COMPLIANCE per ogni assegnazione:
1. Documenti autista validi alla data del viaggio (patente, CQC, ADR se richiesto)?
2. Ore di guida residue sufficienti (giornaliere, settimanali, bisettimanali)?
3. Documenti veicolo validi (revisione, assicurazione)?
4. Veicolo adatto (tipo, capacita peso, ADR)?
5. Scarico tachigrafo in regola (entro 28 giorni)?
6. Se internazionale: CMR disponibile, regole cabotaggio rispettate?

Rispondi in italiano, in modo chiaro, professionale e strutturato. Non usare emoji. Tono formale e orientato ai risultati.
Cita i riferimenti normativi specifici (es. "Art. 6 Reg. CE 561/2006") quando rilevi problemi.`

        const userPrompt = `## DATA ODIERNA: ${new Date().toLocaleDateString("it-IT")}

## ANALISI COMPLIANCE AUTOMATICA
${complianceAnalysis}

---

## FLOTTA

### AUTISTI (${context.drivers.length})
${driversSection}

### VEICOLI (${context.vehicles.length})
${vehiclesSection}

### VIAGGI (${context.trips.length})
${tripsSection}

---

## RICHIESTA DELL'OPERATORE

${userQuery}

---

Struttura la risposta in:
1. **Raccomandazione Ottimale** — la soluzione piu efficiente con stima di risparmio in EUR, km e tempo
2. **Verifica Compliance** — conferma conformita di ogni assegnazione proposta, con riferimenti normativi
3. **Alternative** — se la soluzione ottimale non e conforme, proponi alternative con analisi costi-benefici
4. **Ottimizzazioni Aggiuntive** — consolidamento carichi, percorsi alternativi, bilanciamento flotta
5. **Scadenze e Azioni** — problemi urgenti e azioni immediate necessarie`

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }],
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: userPrompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 4096,
                    },
                }),
            }
        )

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text()
            console.error("Gemini API error:", errorText)
            return NextResponse.json(
                { error: "Errore nella risposta dell'AI", details: errorText },
                { status: 502 }
            )
        }

        const geminiData = await geminiResponse.json()
        const aiText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Nessuna risposta dall'AI."

        return NextResponse.json({ result: aiText })
    } catch (error) {
        console.error("AI Dispatch error:", error)
        return NextResponse.json(
            { error: "Errore interno del server", details: String(error) },
            { status: 500 }
        )
    }
}
