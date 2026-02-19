---
description: come deployare su Vercel (git push che aggiorna tutti i repo)
---

# Deploy su Vercel

Questo progetto ha **2 remote GitHub** sincronizzati automaticamente:
- `FleetMinder/Logistic-Brain` (repository organizzazione)
- `broger10/logistic-brain` (repository personale — collegato a Vercel)

> [!IMPORTANT]
> Vercel guarda **broger10/logistic-brain**. Un singolo `git push` aggiorna entrambi i repo grazie alla configurazione multi-pushurl.

## Procedura standard (ogni modifica)

1. Apporta le modifiche al codice

2. Aggiungi i file modificati:
```
git add .
```

3. Crea il commit:
```
git commit -m "tipo: descrizione breve in italiano"
```

4. Pusha (aggiorna entrambi i repo in un colpo solo):
```
git push
```

5. Vercel rileva automaticamente il push su `broger10/logistic-brain` e avvia il deploy.

6. Monitora il deploy su: https://vercel.com/fleetminder/logistic-brain

## Variabili d'ambiente Vercel

Le API key e variabili secret vanno configurate nel pannello Vercel:
**Settings → Environment Variables**

Variabili richieste:
- `GEMINI_API_KEY` — chiave per l'AI Dispatch (Google AI Studio)
- `DATABASE_URL` — URL Neon PostgreSQL
- `DIRECT_URL` — Direct URL Neon PostgreSQL

Non mettere MAI chiavi API nel codice o nel `.env.local` committato.

## Verifica configurazione remotes

// turbo
```
git remote -v
```

Deve mostrare:
```
origin  https://github.com/FleetMinder/Logistic-Brain.git (fetch)
origin  https://github.com/FleetMinder/Logistic-Brain.git (push)
origin  https://github.com/broger10/logistic-brain.git (push)
```
