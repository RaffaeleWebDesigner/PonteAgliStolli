/* Logica di rendering condivisa fra le pagine del sito ASD Ponte agli Stolli */

const MESI_IT = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
const GIORNI_IT = ["dom","lun","mar","mer","gio","ven","sab"];

function formatData(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${GIORNI_IT[d.getDay()]} ${String(d.getDate()).padStart(2,"0")} ${MESI_IT[d.getMonth()]} ${d.getFullYear()}`;
}

function descrizioneQuando(m) {
  if (m.data) return `${formatData(m.data)}${m.ora ? " · " + m.ora : ""}`;
  return `Data da definire${m.periodo ? " · " + m.periodo : ""}`;
}

function descrizioneLuogo(m) {
  return m.luogo || "Luogo da definire";
}

function isOwnTeam(nome) {
  return nome === TEAM_NAME;
}

function esitoSquadra(golCasa, golOspite, isCasa) {
  if (golCasa === golOspite) return "draw";
  const vinceCasa = golCasa > golOspite;
  if (isCasa) return vinceCasa ? "win" : "loss";
  return vinceCasa ? "loss" : "win";
}

function esitoLabel(key) {
  return { win: "V", draw: "N", loss: "P" }[key];
}

/* ---------------- NAV ---------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
  const current = document.body.dataset.page;
  document.querySelectorAll(".main-nav a").forEach(a => {
    if (a.dataset.page === current) a.classList.add("active");
  });
}

/* ---------------- CLASSIFICA ---------------- */
function renderClassifica(targetSelector, limit) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const rows = limit ? SITE_DATA.classifica.slice(0, limit) : SITE_DATA.classifica;
  el.innerHTML = rows.map(r => {
    const diff = r.gf - r.gs;
    const punti = r.v * 3 + r.n;
    let posClass = "";
    if (r.pos <= SITE_DATA.promozionePos) posClass = "promo";
    else if (r.pos >= SITE_DATA.retrocessionePos) posClass = "relega";
    return `<tr class="${isOwnTeam(r.squadra) ? "own-team" : ""}">
      <td class="center"><span class="pos-badge ${posClass}">${r.pos}</span></td>
      <td>${r.squadra}</td>
      <td class="center"><strong>${punti}</strong></td>
      <td class="center">${r.pg}</td>
      <td class="center">${r.v}</td>
      <td class="center">${r.n}</td>
      <td class="center">${r.p}</td>
      <td class="center">${r.gf}</td>
      <td class="center">${r.gs}</td>
      <td class="center">${diff > 0 ? "+" + diff : diff}</td>
    </tr>`;
  }).join("");
}

/* ---------------- MARCATORI ---------------- */
function renderMarcatori(targetSelector, limit) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const sorted = [...SITE_DATA.marcatori].sort((a, b) => b.gol - a.gol);
  const rows = limit ? sorted.slice(0, limit) : sorted;
  el.innerHTML = rows.map((m, i) => `
    <tr class="${isOwnTeam(m.squadra) ? "own-team" : ""}">
      <td class="center"><span class="pos-badge">${i + 1}</span></td>
      <td>${m.giocatore}${m.numero != null ? ` <span style="color:var(--text-light);font-weight:400;">#${m.numero}</span>` : ""}</td>
      <td class="center"><strong>${m.gol}</strong></td>
    </tr>
  `).join("");
}

/* ---------------- CALENDARIO ---------------- */
function renderCalendarioLista(matches, targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  if (!matches.length) {
    el.innerHTML = `<div class="empty-note">Nessuna partita in programma al momento.</div>`;
    return;
  }
  const byGiornata = {};
  matches.forEach(m => {
    const key = m.giornata;
    if (!byGiornata[key]) byGiornata[key] = [];
    byGiornata[key].push(m);
  });
  el.innerHTML = Object.keys(byGiornata).map(g => `
    <div class="giornata-group">
      ${byGiornata[g][0].giornata == null ? "" : `<div class="giornata-title">${typeof byGiornata[g][0].giornata === "number" ? "Giornata " + g : g}</div>`}
      ${byGiornata[g].map(m => `
        <div class="match-row">
          <div class="teams">
            <span class="${isOwnTeam(m.casa) ? "own" : ""}">${m.casa}</span>
            <span style="color:var(--text-light);font-weight:400;">vs</span>
            <span class="${isOwnTeam(m.ospite) ? "own" : ""}">${m.ospite}</span>
          </div>
          <div class="meta">${descrizioneQuando(m)}<br>${descrizioneLuogo(m)}</div>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      document.querySelector("#" + btn.dataset.tab).classList.add("active");
    });
  });
}

function initCalendarioTabs() {
  renderCalendarioLista(SITE_DATA.calendario.campionato, "#lista-campionato");
  renderCalendarioLista(SITE_DATA.calendario.coppa, "#lista-coppa");
  renderCalendarioLista(SITE_DATA.calendario.amichevoli, "#lista-amichevoli");
  initTabs();
}

/* ---------------- RISULTATI + PAGELLE ---------------- */
function votoClass(voto) {
  if (voto >= 7) return "high";
  if (voto < 6) return "low";
  return "";
}

function renderRisultatoBlock(r) {
  const isCasaOwn = isOwnTeam(r.casa);
  const esito = esitoSquadra(r.golCasa, r.golOspite, isCasaOwn);
  const giornata = r.giornata ? " · " + (typeof r.giornata === "number" ? "G" + r.giornata : r.giornata) : "";
  return `
  <div class="result-block">
    <div class="match-row result-row" data-target="pagelle-${r.id}">
      <div class="teams">
        <span class="${isCasaOwn ? "own" : ""}">${r.casa}</span>
        <span class="score">${r.golCasa} - ${r.golOspite}</span>
        <span class="${!isCasaOwn ? "own" : ""}">${r.ospite}</span>
      </div>
      <div class="meta">
        <span class="badge-pill ${esito}">${esitoLabel(esito)}</span>
        &nbsp; ${formatData(r.data)}${giornata}
        &nbsp; <span class="chevron">&#9656; pagelle</span>
      </div>
    </div>
    <div class="pagelle-panel" id="pagelle-${r.id}"><div class="pagelle-inner">
      <h4>Pagelle giocatori — ${r.casa} ${r.golCasa}-${r.golOspite} ${r.ospite}</h4>
      <div class="pagelle-list">
        ${r.pagelle.length ? "" : (r.reti && r.reti.length ? `
          <div class="reti-note">
            <strong>Reti:</strong>
            ${r.reti.map(g => `${g.giocatore}${g.numero != null ? " #" + g.numero : ""}${g.gol > 1 ? " (" + g.gol + ")" : ""}`).join(", ")}
          </div>
          <div class="empty-note">Pagelle non ancora disponibili.</div>
        ` : '<div class="empty-note">Pagelle non ancora disponibili.</div>')}
        ${r.pagelle.map(p => `
          <div class="pagella-item">
            <div class="voto ${votoClass(p.voto)}">${p.voto}</div>
            <div class="info">
              <strong>${p.giocatore} <span style="font-weight:400;color:var(--text-light);">(${p.ruolo})</span></strong>
              <span>${p.nota}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div></div>
  </div>`;
}

function renderRisultati() {
  const sezioni = [
    { selector: "#risultati-campionato", chiave: "Campionato" },
    { selector: "#risultati-coppa", chiave: "Coppa" },
    { selector: "#risultati-amichevoli", chiave: "Amichevole" },
  ];
  const results = [...SITE_DATA.risultati].sort((a, b) => new Date(b.data) - new Date(a.data));
  sezioni.forEach(s => {
    const el = document.querySelector(s.selector);
    if (!el) return;
    const items = results.filter(r => r.competizione === s.chiave);
    el.innerHTML = items.length
      ? items.map(renderRisultatoBlock).join("")
      : '<div class="empty-note">Nessun risultato al momento.</div>';
    el.querySelectorAll(".result-row").forEach(row => {
      row.addEventListener("click", () => {
        row.classList.toggle("open");
        document.getElementById(row.dataset.target).classList.toggle("open");
      });
    });
  });
  initTabs();
}

/* ---------------- ROSA ---------------- */
function iniziali(nome) {
  return nome.split(" ").map(p => p[0]).join("").toUpperCase();
}

function eta(nascita) {
  if (!nascita) return null;
  const b = new Date(nascita);
  const diff = new Date() - b;
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function renderRosa(targetSelector, filtro) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const list = filtro && filtro !== "Tutti"
    ? SITE_DATA.giocatori.filter(g => g.ruolo === filtro)
    : SITE_DATA.giocatori;
  const ordered = [...list].sort((a, b) => (a.numero ?? 999) - (b.numero ?? 999));
  el.innerHTML = ordered.map(g => `
    <div class="player-card">
      <div class="player-photo">${iniziali(g.nome)}</div>
      <div class="body">
        ${g.numero != null ? `<div class="number">#${g.numero}</div>` : ""}
        <div class="name">${g.nome}</div>
        <div class="role">${g.ruolo}</div>
        <div class="stats">
          ${g.nascita ? `<div><strong>${eta(g.nascita)}</strong>anni</div>` : ""}
          <div><strong>${g.presenze}</strong>presenze</div>
          <div><strong>${g.gol}</strong>gol</div>
        </div>
      </div>
    </div>
  `).join("");
}

function initRosaFiltri() {
  renderRosa("#rosa-grid", "Tutti");
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(b => {
    b.addEventListener("click", () => {
      btns.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderRosa("#rosa-grid", b.dataset.ruolo);
    });
  });
}

/* ---------------- STAFF ---------------- */
function renderStaff(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = SITE_DATA.staff.map(s => `
    <div class="staff-card">
      <div class="staff-photo">${iniziali(s.nome)}</div>
      <div class="body">
        <div class="name">${s.nome}</div>
        <div class="role">${s.ruolo}</div>
      </div>
    </div>
  `).join("");
}

/* ---------------- SPONSOR ---------------- */
function renderSponsor(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = `
    <div class="grid cols-3">
      ${SITE_DATA.sponsor.map(s => `
        <div class="sponsor-card">
          <div class="sponsor-logo">${s.nome.split(" ")[0]}</div>
          <div class="name">${s.nome}</div>
          ${s.desc ? `<div class="desc">${s.desc}</div>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

/* ---------------- HOME WIDGETS ---------------- */
function renderHomeWidgets() {
  const prossima = document.querySelector("#widget-prossima");
  if (prossima) {
    const tutte = [...SITE_DATA.calendario.campionato, ...SITE_DATA.calendario.coppa, ...SITE_DATA.calendario.amichevoli]
      .filter(m => isOwnTeam(m.casa) || isOwnTeam(m.ospite));
    const adesso = new Date();
    const conData = tutte
      .filter(m => m.data && new Date(`${m.data}T${m.ora || "23:59"}:00`) >= adesso)
      .sort((a, b) => new Date(a.data) - new Date(b.data));
    const next = conData[0] || tutte.find(m => !m.data);
    prossima.innerHTML = next ? `
      <div class="match-row" style="margin-bottom:0;"${next.data ? ` data-kickoff="${next.data}T${next.ora || "00:00"}:00"` : ""}>
        <div class="teams">
          <span class="${isOwnTeam(next.casa) ? "own" : ""}">${next.casa}</span>
          <span style="color:var(--text-light);font-weight:400;">vs</span>
          <span class="${isOwnTeam(next.ospite) ? "own" : ""}">${next.ospite}</span>
        </div>
        <div class="meta">${descrizioneQuando(next)}<br>${descrizioneLuogo(next)}</div>
      </div>
    ` : `<div class="empty-note">Nessuna partita in programma.</div>`;
  }

  const ultimo = document.querySelector("#widget-ultimo");
  if (ultimo) {
    const results = [...SITE_DATA.risultati].sort((a, b) => new Date(b.data) - new Date(a.data));
    const last = results[0];
    ultimo.innerHTML = last ? `
      <div class="match-row" style="margin-bottom:0;">
        <div class="teams">
          <span class="${isOwnTeam(last.casa) ? "own" : ""}">${last.casa}</span>
          <span class="score">${last.golCasa} - ${last.golOspite}</span>
          <span class="${isOwnTeam(last.ospite) ? "own" : ""}">${last.ospite}</span>
        </div>
        <div class="meta">${last.competizione} · ${formatData(last.data)} · <a href="risultati.html">vedi pagelle &rarr;</a></div>
      </div>
    ` : `<div class="empty-note">Nessun risultato disponibile.</div>`;
  }

  renderClassifica("#widget-classifica tbody", 5);
  renderMarcatori("#widget-marcatori tbody", 5);
}

function renderLeagueInfo() {
  const c = SITE_DATA.campionato;
  if (!c) return;
  const text = `${c.nome} · ${c.categoria} · ${c.girone} · ${c.stagione}`;
  document.querySelectorAll("[data-league]").forEach(el => { el.textContent = text; });
}

/* ---------------- DATI LEGALI ---------------- */
const ETICHETTE_SOCIETA = { sede: "sede legale", codiceFiscale: "codice fiscale", email: "email di contatto", pec: "PEC", denominazione: "denominazione" };

function renderSocieta() {
  const s = SITE_DATA.societa || {};
  document.querySelectorAll("[data-societa]").forEach(el => {
    const chiave = el.dataset.societa;
    const valore = String(s[chiave] || "").trim();
    if (!valore) {
      if (el.hasAttribute("data-opzionale")) {
        (el.closest("[data-riga]") || el).remove();
      } else {
        el.textContent = `[${ETICHETTE_SOCIETA[chiave] || chiave} da completare]`;
        el.classList.add("da-completare");
      }
      return;
    }
    if (chiave === "email" || chiave === "pec") {
      const a = document.createElement("a");
      a.href = "mailto:" + valore;
      a.textContent = valore;
      el.textContent = "";
      el.appendChild(a);
    } else {
      el.textContent = valore;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => { initNav(); renderLeagueInfo(); renderSocieta(); });
