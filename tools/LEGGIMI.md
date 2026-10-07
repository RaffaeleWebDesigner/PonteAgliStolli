# Aggiornare i risultati da un foglio Google

I **risultati** del sito possono essere scritti in un foglio Google da piu' persone, anche da telefono.
Tutto il resto (classifica, rosa, staff, sponsor, campi) NON e' nel foglio: lo aggiorna chi gestisce il sito
modificando direttamente `assets/js/data.js`. Il sito resta identico: cambia solo da dove arrivano i risultati.

## Come funziona

1. Chi aggiorna scrive nel foglio, nelle schede **Partite**, **Reti** e **Pagelle**.
2. Ogni ~15 minuti GitHub esegue `tools/sync_sheet.py` (workflow `.github/workflows/sync-foglio.yml`): legge il foglio,
   controlla i dati e riscrive **solo** i blocchi `// >>> FOGLIO:... // <<< FOGLIO:...` di `data.js`
   (calendario, risultati con marcatori e pagelle, classifica marcatori, gol dei giocatori).
3. Se i dati sono cambiati, fa il commit e il sito si ripubblica da solo.
4. Se nel foglio c'e' un errore (data inesistente, giocatore non in elenco, marcatori piu' dei gol, ...) **non cambia niente**
   e il workflow fallisce, indicando scheda e riga da correggere (appare in Actions e arriva la mail di GitHub).

## Schede del foglio

| Scheda | Chi la modifica | Contenuto |
|---|---|---|
| Partite | tutti | calendario e risultati: con «Gol casa» e «Gol ospite» compilati la partita passa in Risultati |
| Reti | tutti | un marcatore per riga (Data, Avversario, Giocatore, Gol) |
| Pagelle | tutti | un voto per riga (Data, Avversario, Giocatore, Voto, Commento) |
| Rosa, Squadre | solo il proprietario | elenchi per i menu a tendina (non letti dal sito) |
| Istruzioni | — | guida per chi aggiorna |

Si calcolano da soli: la classifica marcatori (solo Campionato e Coppa, non le amichevoli) e i gol di ogni giocatore
(tutte le competizioni). La rosa (nomi, numeri, ruoli, presenze) e' letta da `data.js`.

**Quando cambia la rosa** (giocatore nuovo, numero cambiato): si modifica `data.js` e si rigenera il modello
(`python tools/crea_modello_foglio.py`) per copiare gli elenchi aggiornati nelle schede Rosa/Squadre del foglio.

## Collegare il foglio

1. Crea il foglio dal modello (`python tools/crea_modello_foglio.py`, richiede `pip install openpyxl`) e importalo in Google Fogli.
2. Condividilo: chi deve scrivere come **Editor**; accesso generale **«Chiunque abbia il link» → Lettore** (serve alla sincronizzazione).
3. Scrivi l'ID del foglio (la parte lunga del link tra `/d/` e `/edit`) in `tools/sheet.config.json`, campo `sheetId`.
4. Nel workflow togli il `#` alle righe `schedule:` e `- cron:` per attivare l'aggiornamento automatico.

## Prove in locale

```
python tools/sync_sheet.py --csv-dir CARTELLA_CON_I_CSV --output prova.js   # non tocca data.js
python tools/sync_sheet.py                                                  # legge il foglio online e riscrive data.js
```

Richiede Python 3 e Node (per leggere la rosa da `data.js`).
Codici di uscita: 0 ok, 1 errori nei dati del foglio, 2 foglio non raggiungibile o schede/colonne rinominate, 3 foglio non collegato.

## Note

- GitHub puo' ritardare le esecuzioni programmate di qualche minuto, e le disattiva dopo 60 giorni senza alcuna attivita'
  nella repo: in quel caso basta riattivarle da Actions.
- Non rinominare le schede ne' la prima riga di ogni scheda.
