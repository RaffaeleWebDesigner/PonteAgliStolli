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

  // ---------------- CLASSIFICA ----------------
  classifica: [
    { pos: 1,  squadra: "Rondine Calcio",        pg: 24, v: 17, n: 5, p: 2,  gf: 52, gs: 18 },
    { pos: 2,  squadra: "Subbiano",               pg: 24, v: 16, n: 4, p: 4,  gf: 47, gs: 22 },
    { pos: 3,  squadra: "Ponte agli Stolli",       pg: 24, v: 14, n: 6, p: 4,  gf: 44, gs: 24 },
    { pos: 4,  squadra: "Chiassa Veneri",          pg: 24, v: 13, n: 5, p: 6,  gf: 40, gs: 27 },
    { pos: 5,  squadra: "Bibbiena Calcio",         pg: 24, v: 11, n: 7, p: 6,  gf: 36, gs: 29 },
    { pos: 6,  squadra: "Terranuova Traiana",      pg: 24, v: 10, n: 6, p: 8,  gf: 33, gs: 30 },
    { pos: 7,  squadra: "San Giovanni Valdarno",   pg: 24, v: 9,  n: 8, p: 7,  gf: 31, gs: 29 },
    { pos: 8,  squadra: "Cavriglia",               pg: 24, v: 9,  n: 6, p: 9,  gf: 30, gs: 33 },
    { pos: 9,  squadra: "Foiano",                  pg: 24, v: 8,  n: 7, p: 9,  gf: 28, gs: 32 },
    { pos: 10, squadra: "Montevarchi Auxilium",    pg: 24, v: 7,  n: 8, p: 9,  gf: 27, gs: 31 },
    { pos: 11, squadra: "Poppi",                   pg: 24, v: 7,  n: 6, p: 11, gf: 25, gs: 36 },
    { pos: 12, squadra: "Castiglion Fibocchi",     pg: 24, v: 6,  n: 6, p: 12, gf: 22, gs: 38 },
    { pos: 13, squadra: "Laterina",                pg: 24, v: 5,  n: 6, p: 13, gf: 20, gs: 40 },
    { pos: 14, squadra: "Ambra Vallesanta",        pg: 24, v: 3,  n: 4, p: 17, gf: 16, gs: 47 },
  ],
  promozionePos: 2,   // fino a questa posizione (inclusa): zona promozione/playoff
  retrocessionePos: 13, // da questa posizione (inclusa): zona retrocessione

  // ---------------- MARCATORI ----------------
  marcatori: [
    { giocatore: "Samuele Tognetti",    squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Tommaso Marini",      squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Samuele Arvia",       squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Raffaele Ciccarelli", squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Filippo Riminesi",    squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Niccolò Consolati",   squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Amin Nider",          squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Gabriele Taverna",    squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Raffaele Ciccarelli", squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Mirko Borgogni",      squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Emanuele Imperatore", squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Elia Gabbrielli",     squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Luca Bonchi",         squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Tommaso Morandini",   squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Anton Pjetri",        squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Roberto Chelaru",     squadra: "Ponte agli Stolli", gol: 0 },
    { giocatore: "Cristian Boci",       squadra: "Ponte agli Stolli", gol: 0 },
  ],

  // ---------------- CALENDARIO (partite da giocare) ----------------
  calendario: {
    campionato: [
      { giornata: 25, data: "2026-08-02", ora: "16:00", casa: "Ponte agli Stolli", ospite: "Bibbiena Calcio", luogo: "Campo Comunale, Ponte agli Stolli" },
      { giornata: 25, data: "2026-08-02", ora: "16:00", casa: "Subbiano", ospite: "Foiano", luogo: "Campo Sportivo Subbiano" },
      { giornata: 26, data: "2026-08-09", ora: "16:00", casa: "Chiassa Veneri", ospite: "Ponte agli Stolli", luogo: "Campo Chiassa Veneri" },
      { giornata: 27, data: "2026-08-16", ora: "16:30", casa: "Ponte agli Stolli", ospite: "Rondine Calcio", luogo: "Campo Comunale, Ponte agli Stolli" },
      { giornata: 28, data: "2026-08-23", ora: "16:30", casa: "Poppi", ospite: "Ponte agli Stolli", luogo: "Campo Sportivo Poppi" },
    ],
    coppa: [
      { giornata: "Quarti di finale", data: "2026-07-30", ora: "20:30", casa: "Ponte agli Stolli", ospite: "Castiglion Fibocchi", luogo: "Campo Comunale, Ponte agli Stolli" },
      { giornata: "Semifinale", data: "2026-08-13", ora: "20:30", casa: "Da definire", ospite: "Ponte agli Stolli", luogo: "Da definire" },
    ],
  },

  // ---------------- RISULTATI (partite giocate + pagelle) ----------------
  risultati: [
    {
      id: "r1",
      competizione: "Campionato",
      giornata: 24,
      data: "2026-07-19",
      casa: "Ponte agli Stolli",
      ospite: "Ambra Vallesanta",
      golCasa: 3,
      golOspite: 1,
      pagelle: [
        { giocatore: "Marco Galli", ruolo: "Portiere", voto: 6.5, nota: "Sicuro tra i pali, para un rigore nel primo tempo." },
        { giocatore: "Andrea Rossi", ruolo: "Attaccante", voto: 7.5, nota: "Doppietta e assist, partita da protagonista." },
        { giocatore: "Davide Conti", ruolo: "Centrocampista", voto: 7, nota: "Gol e grande corsa per tutta la gara." },
        { giocatore: "Riccardo Lombardi", ruolo: "Attaccante", voto: 6, nota: "Poco servito, ma sempre pericoloso." },
        { giocatore: "Simone Bardi", ruolo: "Difensore", voto: 6, nota: "Attento in marcatura, chiude bene gli spazi." },
      ],
    },
    {
      id: "r2",
      competizione: "Campionato",
      giornata: 23,
      data: "2026-07-12",
      casa: "Terranuova Traiana",
      ospite: "Ponte agli Stolli",
      golCasa: 2,
      golOspite: 2,
      pagelle: [
        { giocatore: "Marco Galli", ruolo: "Portiere", voto: 6, nota: "Incolpevole sui due gol subiti." },
        { giocatore: "Andrea Rossi", ruolo: "Attaccante", voto: 6.5, nota: "Un gol pesante che vale il pareggio." },
        { giocatore: "Luca Fontana", ruolo: "Difensore", voto: 5.5, nota: "Qualche errore di troppo in disimpegno." },
        { giocatore: "Davide Conti", ruolo: "Centrocampista", voto: 6.5, nota: "Regia ordinata, buona gara." },
      ],
    },
    {
      id: "r3",
      competizione: "Coppa",
      giornata: "Ottavi di finale",
      data: "2026-07-05",
      casa: "Ponte agli Stolli",
      ospite: "Laterina",
      golCasa: 4,
      golOspite: 0,
      pagelle: [
        { giocatore: "Marco Galli", ruolo: "Portiere", voto: 6, nota: "Serata tranquilla, clean sheet." },
        { giocatore: "Riccardo Lombardi", ruolo: "Attaccante", voto: 8, nota: "Tripletta, in serata di grazia." },
        { giocatore: "Davide Conti", ruolo: "Centrocampista", voto: 7, nota: "Gol e ottima prestazione a centrocampo." },
      ],
    },
  ],

  // ---------------- ROSA GIOCATORI ----------------
  giocatori: [
    { numero: 1,  nome: "Samuele Tognetti",    ruolo: "Portiere",       nascita: null, presenze: 0, gol: 0 },
    { numero: 2,  nome: "Tommaso Marini",      ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 3,  nome: "Samuele Arvia",       ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 4,  nome: "Raffaele Ciccarelli", ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 5,  nome: "Filippo Riminesi",    ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 6,  nome: "Niccolò Consolati",   ruolo: "Difensore",      nascita: null, presenze: 0, gol: 0 },
    { numero: 8,  nome: "Gabriele Taverna",    ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 10, nome: "Mirko Borgogni",      ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 11, nome: "Emanuele Imperatore", ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 13, nome: "Elia Gabbrielli",     ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 15, nome: "Luca Bonchi",         ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 16, nome: "Tommaso Morandini",   ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 17, nome: "Anton Pjetri",        ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 18, nome: "Roberto Chelaru",     ruolo: "Centrocampista", nascita: null, presenze: 0, gol: 0 },
    { numero: 7,  nome: "Amin Nider",          ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 9,  nome: "Raffaele Ciccarelli", ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
    { numero: 19, nome: "Cristian Boci",       ruolo: "Attaccante",     nascita: null, presenze: 0, gol: 0 },
  ],

  // ---------------- STAFF ----------------
  staff: [
    { nome: "Paolo Cresti",   ruolo: "Allenatore" },
    { nome: "Michele Donati", ruolo: "Vice Allenatore" },
    { nome: "Stefano Landi",  ruolo: "Preparatore Atletico" },
    { nome: "Federico Nuti",  ruolo: "Preparatore dei Portieri" },
    { nome: "Enrico Bassi",   ruolo: "Dirigente Accompagnatore" },
    { nome: "Roberto Cini",   ruolo: "Presidente" },
    { nome: "Giulia Manetti", ruolo: "Segreteria / Team Manager" },
    { nome: "Alessandro Poli",ruolo: "Fisioterapista" },
  ],

  // ---------------- SPONSOR ----------------
  sponsor: [
    { nome: "Main Sponsor S.r.l.", livello: "Main Sponsor", desc: "Sponsor ufficiale di maglia", sito: "#" },
    { nome: "Edilizia Valdarno",   livello: "Gold Sponsor",  desc: "Partner tecnico strutture", sito: "#" },
    { nome: "Ristorante Il Ponte", livello: "Gold Sponsor",  desc: "Partner ufficiale eventi", sito: "#" },
    { nome: "Farmacia Centrale",   livello: "Silver Sponsor",desc: "Sponsor sanitario", sito: "#" },
    { nome: "AutoService Rossi",   livello: "Silver Sponsor",desc: "Mobilità squadra", sito: "#" },
    { nome: "Bar Sport Stolli",    livello: "Silver Sponsor",desc: "Punto di ritrovo tifosi", sito: "#" },
  ],
};
