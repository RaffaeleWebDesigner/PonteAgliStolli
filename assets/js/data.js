/*
  DATI DEL SITO — ASD PONTE AGLI STOLLI
  ----------------------------------------------------------------
  Tutti i contenuti del sito (classifica, marcatori, calendario,
  risultati, pagelle, rosa, staff, sponsor) partono da qui.
  Sono dati di ESEMPIO (bozza): modifica pure liberamente i valori,
  aggiungi o togli righe: le pagine si aggiornano da sole.
  Il nome della nostra squadra è definito in TEAM_NAME.
*/

const TEAM_NAME = "Ponte agli Stolli";

const SITE_DATA = {

  // ---------------- CAMPIONATO ----------------
  campionato: { nome: "Campionato UISP", categoria: "Categoria 2", girone: "Girone C", stagione: "2026/2027" },

  // ---------------- DATI LEGALI (usati da Privacy, Cookie, Note legali e dalle note a fondo pagina) ----------------
  // Lasciati vuoti i campi che non conosco: sul sito compaiono evidenziati in giallo finche' non vengono compilati.
  societa: {
    denominazione: "Associazione Sportiva Dilettantistica Ponte agli Stolli (ASD Ponte agli Stolli)",
    sede: "",           // es. "Via Esempio 1, 50063 Figline e Incisa Valdarno (FI)"
    codiceFiscale: "",
    email: "",          // email a cui scrivere per esercitare i diritti privacy o chiedere rimozioni
    pec: "",            // facoltativa: se vuota la riga PEC non viene mostrata
    instagram: "",      // es. "nomeaccount" o il link completo: se vuoto, il link Instagram nel footer resta nascosto
    aggiornamento: "7 ottobre 2026",
  },

  // ---------------- CAMPI DI GIOCO ----------------
  // Link a Google Maps dei campi. La chiave deve essere il testo esatto del campo "luogo" delle partite.
  // Se un campo non e' elencato qui, il bottone "Apri in Maps" cerca il testo del luogo su Google Maps.
  campi: {
    "Campo Sportivo il Madonnino - Figline Valdarno": "https://maps.app.goo.gl/PG61SfoZdhuoHYqG7",
  },

  // ---------------- CLASSIFICA ----------------
  classifica: [
    { pos: 1, squadra: "AS Giglio", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 2, squadra: "ASD Gaiole", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 3, squadra: "Baco Donnini", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 4, squadra: "Ginestra", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 5, squadra: "Levane Leona", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 6, squadra: "Levanella '86", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 7, squadra: "Malva", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 8, squadra: "Montanino", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 9, squadra: "Pietrapiana Giglio Verde", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 10, squadra: "Pol. Il Ponte", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 11, squadra: "Ponte agli Stolli", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 12, squadra: "San Cipriano", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 13, squadra: "Sereto GS", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
    { pos: 14, squadra: "ASD Vacchereccia", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
  ],
  promozionePos: 0,     // fino a questa posizione (inclusa): zona promozione/playoff (0 = nessuna)
  retrocessionePos: 99, // da questa posizione (inclusa): zona retrocessione (99 = nessuna)

  // ---------------- MARCATORI ----------------
  // Conta solo i gol di Campionato e Coppa: le amichevoli NON entrano in questa classifica.
  marcatori: [
    { numero: 1,  giocatore: "Filippo Riminesi",    squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 3,  giocatore: "Elia Gabbrielli",     squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 4,  giocatore: "Andrea Mingaj",       squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 5,  giocatore: "Raffaele Ciccarelli", squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 6,  giocatore: "Jaouhar Nakoua",      squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 7,  giocatore: "Tommaso Brandi",      squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 8,  giocatore: "Gabriele Taverna",    squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 9,  giocatore: "Raffaele Ciccarelli", squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 10, giocatore: "Amin Nider",          squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 11, giocatore: "Jam", squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 13, giocatore: "Luca Bonchi",         squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 14, giocatore: "Tommaso Marini",      squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 16, giocatore: "Samuele Arvia",       squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 17, giocatore: "Anton Pjetri",        squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 21, giocatore: "Mattia Ortichi",      squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 22, giocatore: "Samuele Tognetti",    squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 30, giocatore: "Emanuele Imperatore", squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 34, giocatore: "Mattia Tapinassi",    squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 77, giocatore: "Niccolò Consolati",   squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 99, giocatore: "Mirko Borgogni",       squadra: "Ponte agli Stolli", gol: 0 },
  ],



  // ---------------- CALENDARIO (partite da giocare) ----------------
  calendario: {
    campionato: [
      { giornata: "1ª Andata", data: "2026-10-09", ora: "21:00", periodo: "9-12 ottobre 2026", casa: "Ponte agli Stolli", ospite: "Ginestra", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "2ª Andata", data: null, ora: null, periodo: "16-19 ottobre 2026", casa: "Malva", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "3ª Andata", data: "2026-10-23", ora: "21:00", periodo: "23-26 ottobre 2026", casa: "Ponte agli Stolli", ospite: "Pietrapiana Giglio Verde", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "4ª Andata", data: null, ora: null, periodo: "30 ottobre - 2 novembre 2026", casa: "Sereto GS", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "5ª Andata", data: null, ora: null, periodo: "6-9 novembre 2026", casa: "Pol. Il Ponte", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "6ª Andata", data: "2026-11-13", ora: "21:00", periodo: "13-16 novembre 2026", casa: "Ponte agli Stolli", ospite: "Levane Leona", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "7ª Andata", data: null, ora: null, periodo: "20-23 novembre 2026", casa: "Montanino", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "8ª Andata", data: "2026-11-27", ora: "21:00", periodo: "27-30 novembre 2026", casa: "Ponte agli Stolli", ospite: "Baco Donnini", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "9ª Andata", data: null, ora: null, periodo: "4-7 dicembre 2026", casa: "ASD Vacchereccia", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "10ª Andata", data: "2026-12-11", ora: "21:00", periodo: "11-14 dicembre 2026", casa: "Ponte agli Stolli", ospite: "AS Giglio", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "11ª Andata", data: null, ora: null, periodo: "18-21 dicembre 2026", casa: "ASD Gaiole", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "12ª Andata", data: "2027-01-08", ora: "21:00", periodo: "8-11 gennaio 2027", casa: "Ponte agli Stolli", ospite: "San Cipriano", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "13ª Andata", data: null, ora: null, periodo: "15-18 gennaio 2027", casa: "Levanella '86", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "1ª Ritorno", data: null, ora: null, periodo: "22-25 gennaio 2027", casa: "Ginestra", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "2ª Ritorno", data: "2027-01-29", ora: "21:00", periodo: "29 gennaio - 1 febbraio 2027", casa: "Ponte agli Stolli", ospite: "Malva", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "3ª Ritorno", data: null, ora: null, periodo: "5-8 febbraio 2027", casa: "Pietrapiana Giglio Verde", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "4ª Ritorno", data: "2027-02-12", ora: "21:00", periodo: "12-15 febbraio 2027", casa: "Ponte agli Stolli", ospite: "Sereto GS", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "5ª Ritorno", data: "2027-02-19", ora: "21:00", periodo: "19-22 febbraio 2027", casa: "Ponte agli Stolli", ospite: "Pol. Il Ponte", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "6ª Ritorno", data: null, ora: null, periodo: "26 febbraio - 1 marzo 2027", casa: "Levane Leona", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "7ª Ritorno", data: "2027-03-05", ora: "21:00", periodo: "5-8 marzo 2027", casa: "Ponte agli Stolli", ospite: "Montanino", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "8ª Ritorno", data: null, ora: null, periodo: "12-15 marzo 2027", casa: "Baco Donnini", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "9ª Ritorno", data: "2027-03-19", ora: "21:00", periodo: "19-22 marzo 2027", casa: "Ponte agli Stolli", ospite: "ASD Vacchereccia", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "10ª Ritorno", data: null, ora: null, periodo: "2-5 aprile 2027", casa: "AS Giglio", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "11ª Ritorno", data: "2027-04-09", ora: "21:00", periodo: "9-12 aprile 2027", casa: "Ponte agli Stolli", ospite: "ASD Gaiole", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
      { giornata: "12ª Ritorno", data: null, ora: null, periodo: "16-19 aprile 2027", casa: "San Cipriano", ospite: "Ponte agli Stolli", luogo: null },
      { giornata: "13ª Ritorno", data: "2027-04-23", ora: "21:00", periodo: "23-26 aprile 2027", casa: "Ponte agli Stolli", ospite: "Levanella '86", luogo: "Campo Sportivo il Madonnino - Figline Valdarno" },
    ],
    coppa: [],
    amichevoli: [],
  },

  // ---------------- RISULTATI (partite giocate + pagelle) ----------------
  risultati: [
    {
      id: "r1",
      competizione: "Amichevole",
      giornata: null,
      data: "2026-09-24",
      casa: "San Cipriano",
      ospite: "Ponte agli Stolli",
      golCasa: 1,
      golOspite: 0,
      reti: [],
      pagelle: [],
    },
    {
      id: "r2",
      competizione: "Amichevole",
      giornata: null,
      data: "2026-09-28",
      casa: "Montanino",
      ospite: "Ponte agli Stolli",
      golCasa: 0,
      golOspite: 3,
      reti: [
        { giocatore: "Raffaele Ciccarelli", numero: 9, gol: 1 },
        { giocatore: "Andrea Mingaj", gol: 2 },
      ],
      pagelle: [],
    },
    {
      id: "r3",
      competizione: "Amichevole",
      giornata: null,
      data: "2026-10-03",
      casa: "Ginestra",
      ospite: "Ponte agli Stolli",
      golCasa: 1,
      golOspite: 4,
      reti: [
        { giocatore: "Amin Nider", numero: 10, gol: 1 },
        { giocatore: "Jam", numero: 11, gol: 2 },
        { giocatore: "Mirko Borgogni", numero: 99, gol: 1 },
      ],
      pagelle: [],
    },
  ],

  // ---------------- ROSA GIOCATORI ----------------
  // presenze e gol: contano solo Campionato e Coppa (come la classifica marcatori), le amichevoli no.
  giocatori: [
    { numero: 1,  nome: "Filippo Riminesi",    ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 3,  nome: "Elia Gabbrielli",     ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 4,  nome: "Andrea Mingaj",       ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 5,  nome: "Raffaele Ciccarelli", ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 6,  nome: "Jaouhar Nakoua",      ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 7,  nome: "Tommaso Brandi",      ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 8,  nome: "Gabriele Taverna",    ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 9,  nome: "Raffaele Ciccarelli", ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 10, nome: "Amin Nider",          ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 11, nome: "Jam", ruolo: "Attaccante", nascita: null, presenze: 0, gol: 0 },
    { numero: 13, nome: "Luca Bonchi",         ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 14, nome: "Tommaso Marini",      ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 16, nome: "Samuele Arvia",       ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 17, nome: "Anton Pjetri",        ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 21, nome: "Mattia Ortichi",      ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 22, nome: "Samuele Tognetti",    ruolo: "Portiere",       nascita: null, presenze: 0, gol: 0 },
    { numero: 30, nome: "Emanuele Imperatore", ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 34, nome: "Mattia Tapinassi",    ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 77, nome: "Niccolò Consolati",   ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 99, nome: "Mirko Borgogni",       ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
  ],

  // ---------------- STAFF ----------------
  // gruppo: sezione della pagina Staff. foto (facoltativa): percorso di una foto, es. "assets/img/staff/davide-veneri.jpg"
  staff: [
    { gruppo: "Dirigenza",     nome: "Elisa Arnetoli",      ruolo: "Presidente" },
    { gruppo: "Dirigenza",     nome: "Ciccarelli Agostino", ruolo: "Vice Presidente" },
    { gruppo: "Dirigenza",     nome: "Alberto Tognetti",    ruolo: "Dirigente" },
    { gruppo: "Dirigenza",     nome: "Lorenzo Butti",       ruolo: "Accompagnatore" },
    { gruppo: "Dirigenza",     nome: "Domenico Taverna",    ruolo: "Accompagnatore" },
    { gruppo: "Dirigenza",     nome: "Tommaso Morandini",   ruolo: "Collaboratore" },
    { gruppo: "Staff tecnico", nome: "Davide Veneri",       ruolo: "Allenatore" },
    { gruppo: "Staff tecnico", nome: "Federico Zenoni",     ruolo: "Secondo Allenatore" },
    { gruppo: "Staff tecnico", nome: "Cosimo Arnetoli",     ruolo: "Preparatore dei Portieri" },
  ],

  // ---------------- SPONSOR ----------------
  sponsor: [
    { nome: "Surgika", desc: "", sito: "#", logo: "assets/img/sponsor/surgika.png", sfondo: "#ffffff" },
    { nome: "Ditta edile Ciccarelli Agostino", desc: "", sito: "#", logo: "assets/img/sponsor/ciccarelli-agostino.png", sfondo: "#000000" },
    { nome: "Agenzia Autoscuola Valdarnese", desc: "", sito: "#" },
  ],
};
