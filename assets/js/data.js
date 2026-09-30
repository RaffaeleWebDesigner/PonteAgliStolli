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
    { pos: 14, squadra: "ASD Vaccherreccia", pg: 0, v: 0, n: 0, p: 0, gf: 0, gs: 0 },
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
    { numero: 8,  giocatore: "Gabriele Taverna",    squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 9,  giocatore: "Raffaele Ciccarelli", squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 10, giocatore: "Amin Nider",          squadra: "Ponte agli Stolli", gol: 0 },
    { numero: 11, giocatore: "Gamal Ibrahim Ahmed Ibrahim Gabr", squadra: "Ponte agli Stolli", gol: 0 },
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
    campionato: [],
    coppa: [],
    amichevoli: [
      { giornata: null, data: "2026-10-03", ora: "15:00", casa: "Ginestra", ospite: "Ponte agli Stolli", luogo: "Campo Pestello Verde, Montevarchi (AR)" },
    ],
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
  ],

  // ---------------- ROSA GIOCATORI ----------------
  giocatori: [
    { numero: 1,  nome: "Filippo Riminesi",    ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 3,  nome: "Elia Gabbrielli",     ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 4,  nome: "Andrea Mingaj",       ruolo: "Difensore",      nascita: null, presenze: 1, gol: 2 },
    { numero: 5,  nome: "Raffaele Ciccarelli", ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 6,  nome: "Jaouhar Nakoua",      ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 8,  nome: "Gabriele Taverna",    ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 9,  nome: "Raffaele Ciccarelli", ruolo: "Attaccante",     nascita: null, presenze: 1, gol: 1 },
    { numero: 10, nome: "Amin Nider",          ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 11, nome: "Gamal Ibrahim Ahmed Ibrahim Gabr", ruolo: "Attaccante", nascita: null, presenze: 0, gol: 0 },
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
  staff: [
    { nome: "Elisa Arnetoli",       ruolo: "Presidente" },
    { nome: "Ciccarelli Agostino",  ruolo: "Vice Presidente" },
    { nome: "Davide Veneri",        ruolo: "Allenatore" },
    { nome: "Federico Zenoni",      ruolo: "Secondo Allenatore" },
    { nome: "Cosimo Arnetoli",      ruolo: "Preparatore dei Portieri" },
    { nome: "Alberto Tognetti",     ruolo: "Dirigente" },
    { nome: "Lorenzo Butti",        ruolo: "Accompagnatore" },
    { nome: "Domenica Taverna",     ruolo: "Accompagnatore" },
    { nome: "Tommaso Morandini",    ruolo: "Collaboratore" },
  ],

  // ---------------- SPONSOR ----------------
  sponsor: [
    { nome: "Surgika", desc: "", sito: "#" },
    { nome: "Ditta edile Ciccarelli Agostino", desc: "", sito: "#" },
    { nome: "Agenzia Autoscuola Valdarnese", desc: "", sito: "#" },
  ],
};
