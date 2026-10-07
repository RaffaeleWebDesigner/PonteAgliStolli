#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sincronizza i risultati del sito (assets/js/data.js) dal foglio Google.

Il foglio contiene SOLO cio' che aggiornano gli altri: Partite (calendario e risultati), Reti (marcatori) e Pagelle.
Classifica, rosa, staff, sponsor e campi NON sono nel foglio: si modificano direttamente in data.js.

Lo script legge le tre schede, controlla che i dati siano corretti e riscrive SOLO i blocchi compresi tra
"// >>> FOGLIO:nome" e "// <<< FOGLIO:nome" in data.js (calendario, risultati, marcatori e gol dei giocatori).
La rosa (nomi, numeri, ruoli, presenze) viene letta da data.js, che e' la fonte ufficiale.

Se nel foglio c'e' un errore, NON modifica niente (il sito resta com'e') e spiega cosa correggere.

Uso:
    python tools/sync_sheet.py                       legge il foglio online (serve sheetId in tools/sheet.config.json)
    python tools/sync_sheet.py --csv-dir CARTELLA    legge file CSV locali (per le prove)
    python tools/sync_sheet.py --output FILE         scrive il risultato in un altro file (per le prove)

Codici di uscita: 0 = ok, 1 = errori nel foglio, 2 = foglio non raggiungibile o non valido, 3 = foglio non configurato.
"""
import argparse
import csv
import datetime
import io
import json
import re
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
FILE_CONFIG = RADICE / "tools" / "sheet.config.json"
FILE_DATI = RADICE / "assets" / "js" / "data.js"

COMPETIZIONI = {"campionato": "Campionato", "coppa": "Coppa", "amichevole": "Amichevole", "amichevoli": "Amichevole"}
CHIAVE_CALENDARIO = {"Campionato": "campionato", "Coppa": "coppa", "Amichevole": "amichevoli"}
RUOLI = ["Portiere", "Difensore", "Centrocampista", "Attaccante"]
# competizioni i cui gol entrano nella classifica marcatori (le amichevoli NO)
COMPETIZIONI_MARCATORI = ("Campionato", "Coppa")


class ErroreFoglio(Exception):
    """Il foglio non e' raggiungibile o non ha la struttura attesa."""


def norm(testo):
    """minuscolo, senza accenti, spazi o punteggiatura: serve per confrontare nomi e intestazioni"""
    t = unicodedata.normalize("NFD", str(testo)).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", t.lower())


# ------------------------------------------------------------------ lettura del foglio
SCHEDE = {
    # scheda: (colonne {chiave: nomi accettati}, colonne obbligatorie)
    "partite": ({"competizione": {"competizione"}, "giornata": {"giornata"}, "data": {"data"}, "ora": {"ora", "orario"},
                 "periodo": {"periodo"}, "casa": {"casa"}, "ospite": {"ospite", "trasferta"}, "luogo": {"luogo", "campo"},
                 "golcasa": {"golcasa"}, "golospite": {"golospite"}},
                ["competizione", "casa", "ospite", "golcasa", "golospite"]),
    "reti": ({"data": {"data"}, "avversario": {"avversario"}, "giocatore": {"giocatore"}, "gol": {"gol", "reti"}},
             ["data", "avversario", "giocatore"]),
    "pagelle": ({"data": {"data"}, "avversario": {"avversario"}, "giocatore": {"giocatore"}, "voto": {"voto"},
                 "commento": {"commento", "nota"}},
                ["data", "avversario", "giocatore", "voto"]),
}


def scarica(nome_scheda, config, cartella):
    if cartella:
        percorso = Path(cartella) / f"{nome_scheda}.csv"
        if not percorso.exists():
            raise ErroreFoglio(f"File di prova mancante: {percorso}")
        return percorso.read_text(encoding="utf-8-sig")
    url = ("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tqx=out:csv&headers=1&sheet=%s"
           % (config["sheetId"], urllib.parse.quote(nome_scheda)))
    try:
        richiesta = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (sincronizzazione sito ASD Ponte agli Stolli)"})
        with urllib.request.urlopen(richiesta, timeout=45) as r:
            testo = r.read().decode("utf-8-sig")
    except urllib.error.HTTPError as e:
        raise ErroreFoglio(f"Scheda «{nome_scheda}»: Google ha risposto con errore {e.code}. "
                           "Controlla che il foglio sia condiviso con «Chiunque abbia il link: Lettore».")
    except Exception as e:
        raise ErroreFoglio(f"Scheda «{nome_scheda}»: impossibile leggere il foglio ({e}).")
    if testo.lstrip().startswith("<"):
        raise ErroreFoglio(f"Scheda «{nome_scheda}»: Google non ha restituito i dati. "
                           "Il foglio deve essere condiviso con «Chiunque abbia il link: Lettore» e la scheda deve chiamarsi esattamente così.")
    return testo


def leggi_righe(testo, nome_scheda, chiave_scheda):
    colonne, obbligatorie = SCHEDE[chiave_scheda]
    righe = list(csv.reader(io.StringIO(testo)))
    if not righe:
        raise ErroreFoglio(f"Scheda «{nome_scheda}»: e' vuota.")
    intestazioni = [norm(h) for h in righe[0]]
    indici = {}
    for chiave, accettati in colonne.items():
        for i, h in enumerate(intestazioni):
            if h in accettati:
                indici[chiave] = i
                break
    mancanti = [c for c in obbligatorie if c not in indici]
    if mancanti:
        nomi = {"golcasa": "Gol casa", "golospite": "Gol ospite"}
        raise ErroreFoglio(f"Scheda «{nome_scheda}»: mancano le colonne {', '.join(nomi.get(m, m.upper() if len(m) <= 2 else m.capitalize()) for m in mancanti)}. "
                           "Non rinominare la prima riga e non cambiare i nomi delle schede.")
    risultato = []
    for numero_riga, r in enumerate(righe[1:], start=2):
        valori = {k: (r[i].strip() if i < len(r) else "") for k, i in indici.items()}
        if any(valori.values()):
            risultato.append((numero_riga, valori))
    return risultato


def carica_rosa_dal_sito():
    """La rosa e' gestita in data.js (non nel foglio): la leggo da li' con node."""
    codice = ("const vm=require('vm'),fs=require('fs');const x={};vm.createContext(x);"
              "vm.runInContext(fs.readFileSync(process.argv[1],'utf8')+';this.__d=SITE_DATA;',x);"
              "console.log(JSON.stringify(x.__d.giocatori))")
    try:
        uscita = subprocess.run(["node", "-e", codice, str(FILE_DATI)], capture_output=True, text=True, check=True, encoding="utf-8").stdout
        rosa = json.loads(uscita)
    except (FileNotFoundError, subprocess.CalledProcessError, json.JSONDecodeError) as e:
        raise ErroreFoglio(f"Non riesco a leggere la rosa da data.js ({e}).")
    for p in rosa:
        p["gol"] = 0               # i gol si ricalcolano dalla scheda Reti
    return rosa


# ------------------------------------------------------------------ conversioni (con messaggi chiari)
class Errori:
    def __init__(self):
        self.lista = []
        self.avvisi = []

    def errore(self, scheda, riga, messaggio):
        self.lista.append(f"Scheda «{scheda}»{'' if riga == '-' else f', riga {riga}'}: {messaggio}")

    def avviso(self, scheda, riga, messaggio):
        self.avvisi.append(f"Scheda «{scheda}»{'' if riga == '-' else f', riga {riga}'}: {messaggio}")


def p_testo(v):
    return v.strip() or None


def p_int(v, err, scheda, riga, campo, minimo=0, default=None):
    v = v.strip().replace(",", ".")
    if not v:
        return default
    try:
        f = float(v)
        if f != int(f) or int(f) < minimo:
            raise ValueError
        return int(f)
    except ValueError:
        err.errore(scheda, riga, f"«{campo}» deve essere un numero intero (trovato «{v}»).")
        return default


def p_data(v, err, scheda, riga, campo="Data"):
    v = v.strip()
    if not v:
        return None
    m = re.fullmatch(r"(\d{4})-(\d{1,2})-(\d{1,2})", v)
    if m:
        y, mo, d = map(int, m.groups())
    else:
        m = re.fullmatch(r"(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})", v)
        if not m:
            err.errore(scheda, riga, f"«{campo}» non e' una data valida (trovato «{v}»): scrivila come GG/MM/AAAA, ad esempio 09/10/2026.")
            return None
        d, mo, y = map(int, m.groups())
        if y < 100:
            y += 2000
    try:
        return datetime.date(y, mo, d).isoformat()
    except ValueError:
        err.errore(scheda, riga, f"«{campo}» non esiste nel calendario (trovato «{v}»).")
        return None


def p_ora(v, err, scheda, riga):
    v = v.strip()
    if not v:
        return None
    m = re.fullmatch(r"(\d{1,2})[:.](\d{2})(?::\d{2})?", v)
    if not m or int(m.group(1)) > 23 or int(m.group(2)) > 59:
        err.errore(scheda, riga, f"«Ora» non e' valida (trovato «{v}»): scrivila come 21:00.")
        return None
    return f"{int(m.group(1)):02d}:{m.group(2)}"


def p_giornata(v):
    v = v.strip()
    if not v:
        return None
    return int(v) if re.fullmatch(r"\d+", v) else v


def p_voto(v, err, scheda, riga):
    v = v.strip().replace(",", ".")
    try:
        f = float(v)
        if not 0 <= f <= 10:
            raise ValueError
        return int(f) if f == int(f) else f
    except ValueError:
        err.errore(scheda, riga, f"«Voto» deve essere un numero da 0 a 10 (trovato «{v}»).")
        return None


# ------------------------------------------------------------------ costruzione dei dati del sito
def costruisci(tabelle, squadra, rosa, err):
    def trova_giocatore(etichetta, scheda, riga):
        m = re.fullmatch(r"(.+?)\s*#\s*(\d+)", etichetta.strip())
        if m:
            nome, numero = m.group(1).strip(), int(m.group(2))
            candidati = [p for p in rosa if norm(p["nome"]) == norm(nome) and p["numero"] == numero]
        else:
            candidati = [p for p in rosa if norm(p["nome"]) == norm(etichetta)]
        if not candidati:
            err.errore(scheda, riga, f"il giocatore «{etichetta}» non e' tra i giocatori della squadra: sceglilo dall'elenco a tendina. Se e' un giocatore nuovo, avvisa Raffaele.")
        elif len(candidati) > 1:
            err.errore(scheda, riga, f"ci sono piu' giocatori chiamati «{etichetta}»: scegli quello giusto dall'elenco (con il numero).")
        else:
            return candidati[0]
        return None

    # ---- Partite: quelle con il risultato vanno in Risultati, le altre nel Calendario
    calendario = {"campionato": [], "coppa": [], "amichevoli": []}
    risultati = []
    for riga, v in tabelle["partite"]:
        comp = COMPETIZIONI.get(norm(v["competizione"]))
        if not comp:
            err.errore("Partite", riga, f"«Competizione» deve essere Campionato, Coppa o Amichevole (trovato «{v['competizione']}»).")
            continue
        casa, ospite = p_testo(v["casa"]), p_testo(v["ospite"])
        if not casa or not ospite:
            err.errore("Partite", riga, "mancano le squadre (Casa e Ospite).")
            continue
        if squadra and norm(squadra) not in (norm(casa), norm(ospite)):
            err.errore("Partite", riga, f"in ogni partita deve giocare «{squadra}» (trovato «{casa}» - «{ospite}»).")
        data = p_data(v.get("data", ""), err, "Partite", riga)
        ora = p_ora(v.get("ora", ""), err, "Partite", riga)
        giornata = p_giornata(v.get("giornata", ""))
        luogo = p_testo(v.get("luogo", ""))
        gc = p_int(v["golcasa"], err, "Partite", riga, "Gol casa")
        go = p_int(v["golospite"], err, "Partite", riga, "Gol ospite")
        if (gc is None) != (go is None):
            err.errore("Partite", riga, "per registrare il risultato servono sia «Gol casa» che «Gol ospite».")
            continue
        if gc is None:
            calendario[CHIAVE_CALENDARIO[comp]].append({
                "giornata": giornata, "data": data, "ora": ora, "periodo": p_testo(v.get("periodo", "")),
                "casa": casa, "ospite": ospite, "luogo": luogo})
        else:
            if not data:
                if not v.get("data", "").strip():
                    err.errore("Partite", riga, "una partita giocata deve avere la «Data».")
                continue
            risultati.append({"id": "", "competizione": comp, "giornata": giornata, "data": data, "casa": casa,
                              "ospite": ospite, "golCasa": gc, "golOspite": go, "reti": [], "pagelle": []})
    risultati.sort(key=lambda r: r["data"])
    visti = set()
    for i, r in enumerate(risultati, start=1):
        r["id"] = f"r{i}"
        chiave = (r["data"], norm(r["casa"]), norm(r["ospite"]))
        if chiave in visti:
            err.errore("Partite", "-", f"la partita {r['casa']} - {r['ospite']} del {r['data']} compare due volte.")
        visti.add(chiave)

    def trova_partita(v, scheda, riga):
        data = p_data(v["data"], err, scheda, riga)
        avv = norm(v["avversario"])
        if not data:
            if not v["data"].strip():
                err.errore(scheda, riga, "manca la «Data» della partita.")
            return None
        trovate = [r for r in risultati if r["data"] == data and avv in (norm(r["casa"]), norm(r["ospite"]))]
        if len(trovate) != 1:
            err.errore(scheda, riga, f"non trovo nella scheda Partite una partita GIOCATA il {data} contro «{v['avversario']}» "
                                     "(scrivi prima il risultato nella scheda Partite).")
            return None
        return trovate[0]

    # ---- Reti
    for riga, v in tabelle["reti"]:
        partita = trova_partita(v, "Reti", riga)
        giocatore = trova_giocatore(v["giocatore"], "Reti", riga) if v["giocatore"] else None
        if not v["giocatore"]:
            err.errore("Reti", riga, "manca il giocatore.")
        gol = p_int(v.get("gol", ""), err, "Reti", riga, "Gol", minimo=1, default=1)
        if partita and giocatore:
            esistente = next((x for x in partita["reti"] if x["_p"] is giocatore), None)
            if esistente:
                esistente["gol"] += gol
            else:
                partita["reti"].append({"_p": giocatore, "giocatore": giocatore["nome"], **({"numero": giocatore["numero"]} if giocatore["numero"] is not None else {}), "gol": gol})
    # ---- Pagelle
    for riga, v in tabelle["pagelle"]:
        partita = trova_partita(v, "Pagelle", riga)
        giocatore = trova_giocatore(v["giocatore"], "Pagelle", riga) if v["giocatore"] else None
        voto = p_voto(v["voto"], err, "Pagelle", riga)
        if partita and giocatore and voto is not None:
            partita["pagelle"].append({"giocatore": giocatore["nome"], "ruolo": giocatore["ruolo"], "voto": voto,
                                       "nota": v.get("commento", "")})

    # ---- gol dei giocatori e classifica marcatori
    for r in risultati:
        for x in r["reti"]:
            x["_p"]["gol"] += x["gol"]
    marcatori = []
    for p in rosa:
        gol = sum(x["gol"] for r in risultati if r["competizione"] in COMPETIZIONI_MARCATORI for x in r["reti"] if x["_p"] is p)
        marcatori.append({"numero": p["numero"], "giocatore": p["nome"], "squadra": squadra, "gol": gol})
    for r in risultati:
        for x in r["reti"]:
            del x["_p"]
        # controllo di coerenza: i marcatori della nostra squadra non possono superare i gol segnati
        nostri = r["golCasa"] if norm(r["casa"]) == norm(squadra) else r["golOspite"]
        if sum(x["gol"] for x in r["reti"]) > nostri:
            err.errore("Reti", "-", f"nella partita {r['casa']} - {r['ospite']} del {r['data']} i marcatori ({sum(x['gol'] for x in r['reti'])} gol) "
                                    f"sono piu' dei gol segnati dalla nostra squadra ({nostri}).")

    return {"marcatori": marcatori, "calendario": calendario, "risultati": risultati, "giocatori": rosa}


# ------------------------------------------------------------------ scrittura di data.js
def js(valore):
    return json.dumps(valore, ensure_ascii=False)


def blocco_lista(chiave, elementi, multilinea=False):
    if not elementi:
        return f"  {chiave}: [],"
    righe = [f"  {chiave}: ["]
    for e in elementi:
        if multilinea:
            righe.append("    " + json.dumps(e, ensure_ascii=False, indent=2).replace("\n", "\n    ") + ",")
        else:
            righe.append("    " + js(e) + ",")
    righe.append("  ],")
    return "\n".join(righe)


def genera_blocchi(dati):
    cal = dati["calendario"]
    righe = ["  calendario: {"]
    for k in ("campionato", "coppa", "amichevoli"):
        if not cal[k]:
            righe.append(f"    {k}: [],")
        else:
            righe.append(f"    {k}: [")
            righe += ["      " + js(e) + "," for e in cal[k]]
            righe.append("    ],")
    righe.append("  },")
    return {
        "marcatori": blocco_lista("marcatori", dati["marcatori"]),
        "calendario": "\n".join(righe),
        "risultati": blocco_lista("risultati", dati["risultati"], multilinea=True),
        "giocatori": blocco_lista("giocatori", dati["giocatori"]),
    }


def sostituisci_blocco(testo, chiave, nuovo):
    inizio = f"  // >>> FOGLIO:{chiave}\n"
    fine = f"  // <<< FOGLIO:{chiave}"
    a, b = testo.find(inizio), testo.find(fine)
    if a < 0 or b < a:
        raise ErroreFoglio(f"In data.js mancano i marcatori «// >>> FOGLIO:{chiave}» / «// <<< FOGLIO:{chiave}».")
    return testo[:a + len(inizio)] + nuovo + "\n" + testo[b:]


# ------------------------------------------------------------------ programma principale
def main():
    ap = argparse.ArgumentParser(description="Sincronizza data.js dal foglio Google")
    ap.add_argument("--csv-dir", help="legge file CSV locali invece del foglio online (prove)")
    ap.add_argument("--output", help="scrive il risultato in questo file invece di data.js (prove)")
    args = ap.parse_args()

    config = json.loads(FILE_CONFIG.read_text(encoding="utf-8"))
    if not args.csv_dir and not config.get("sheetId", "").strip():
        print("Foglio Google non ancora collegato (sheetId vuoto in tools/sheet.config.json): non faccio nulla.")
        return 3
    squadra = config.get("squadra", "Ponte agli Stolli")

    try:
        tabelle = {}
        for chiave, nome in config["schede"].items():
            testo = scarica(nome, config, args.csv_dir)
            tabelle[chiave] = leggi_righe(testo, nome, chiave)
    except ErroreFoglio as e:
        print(f"ERRORE: {e}")
        return 2

    try:
        rosa = carica_rosa_dal_sito()
    except ErroreFoglio as e:
        print(f"ERRORE: {e}")
        return 2
    err = Errori()
    dati = costruisci(tabelle, squadra, rosa, err)
    for a in err.avvisi:
        print("Avviso:", a)
    if err.lista:
        print(f"\nIl foglio contiene {len(err.lista)} errore/i: il sito NON e' stato aggiornato (restano i dati di prima).\n")
        for e in err.lista:
            print(" -", e)
        return 1

    destinazione = Path(args.output) if args.output else FILE_DATI
    sorgente = (FILE_DATI).read_text(encoding="utf-8").replace("\r\n", "\n")
    try:
        for chiave, blocco in genera_blocchi(dati).items():
            sorgente = sostituisci_blocco(sorgente, chiave, blocco)
    except ErroreFoglio as e:
        print(f"ERRORE: {e}")
        return 2
    destinazione.write_text(sorgente, encoding="utf-8", newline="\n")
    print(f"OK: {len(dati['calendario']['campionato']) + len(dati['calendario']['coppa']) + len(dati['calendario']['amichevoli'])} partite da giocare, "
          f"{len(dati['risultati'])} risultati, {sum(len(r['reti']) for r in dati['risultati'])} righe di marcatori, "
          f"{sum(len(r['pagelle']) for r in dati['risultati'])} pagelle, {len(dati['giocatori'])} giocatori in rosa.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
