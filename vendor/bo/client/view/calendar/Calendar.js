import View from "../View.js"

export default class Calendar extends View
{
    constructor({ controller, entity, view, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view || "default"
        this.layout = layout
    }

    initialize = async () =>
    {
    }

    render = () =>
    {    
        const html = []
        html.push(`
<!-- ============================================================
   WIDGET LISTE ↔ CALENDRIER — à intégrer dans #flList-1 (Mes Cours)
   1) Coller le bloc HTML au début du card-body de #flList-1
      (juste avant <div class="table-responsive">).
   2) Coller le <style> et le <script> n'importe où après.
   Le calendrier se construit automatiquement à partir des lignes
   de la table existante (#flListTable-1) : aucune donnée à doubler.
   ============================================================ -->

<!-- ---------- HTML : bouton à deux états + conteneur calendrier ---------- -->
<div class="d-flex align-items-center justify-content-between flex-wrap mb-3" id="flViewSwitch-1">

  <!-- Bouton à deux états : Liste vs Calendrier -->
  <div class="btn-group" role="group" aria-label="Basculer la vue">
    <button type="button" class="btn btn-primary btn-sm active" id="flViewBtnList-1">
      <i class="fas fa-list me-1"></i> Liste
    </button>
    <button type="button" class="btn btn-outline-primary btn-sm" id="flViewBtnCal-1">
      <i class="fas fa-calendar-week me-1"></i> Calendrier
    </button>
  </div>

  <!-- Navbar de dates (visible uniquement en vue calendrier) -->
  <div class="d-flex align-items-center gap-1 d-none" id="flCalNav-1">
    <button type="button" class="btn btn-outline-secondary btn-sm" id="flCalPrev-1" title="Semaine précédente">
      <i class="fas fa-chevron-left"></i>
    </button>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="flCalToday-1">Aujourd'hui</button>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="flCalNext-1" title="Semaine suivante">
      <i class="fas fa-chevron-right"></i>
    </button>
    <input type="date" class="form-control form-control-sm ms-2" id="flCalDate-1" style="width:160px;">
    <span class="ms-2 text-muted small" id="flCalTitle-1"></span>
  </div>
</div>

<!-- Conteneur de la vue calendrier (remplace la liste quand visible) -->
<div id="flCalView-1" style="display:none;"></div>
        `)

        return html.join("\n")
    }

    style = () =>
    {
        const html = []
        html.push(`
<style>
/* ---------- CSS du calendrier (préfixé flCal pour éviter les collisions) ---------- */
.flcal-grid {
  display: grid;
  grid-template-columns: 56px repeat(7, minmax(110px, 1fr));
  border: 1px solid #dee2e6;
  border-radius: .5rem;
  overflow: hidden;
  background: #fff;
  font-size: .8rem;
}
.flcal-head {
  padding: 8px 4px; text-align: center; font-weight: 600;
  background: #f5f7fb; border-bottom: 1px solid #dee2e6; border-left: 1px solid #dee2e6;
}
.flcal-head small { display: block; font-weight: 400; color: #6c757d; }
.flcal-head.today { background: #e8f0fe; }
.flcal-head.we { background: #f0f0f2; color: #adb5bd; }
.flcal-corner { background: #f5f7fb; border-bottom: 1px solid #dee2e6; }
.flcal-hlabel {
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; color: #6c757d; background: #f5f7fb; border-top: 1px solid #dee2e6;
}
.flcal-hlabel.half { font-size: .58rem; color: #adb5bd; background: #fafbfd; }
.flcal-cell { border-left: 1px solid #dee2e6; border-top: 1px solid #e9ecef; position: relative; min-height: 40px; background: #fff; }
.flcal-cell.half { min-height: 20px; }
.flcal-cell.half::before { content: ""; position: absolute; top:0; left:0; right:0; border-top: 1px dashed #eef0f4; }
.flcal-cell.we { background: #f0f0f2; }
.flcal-slot {
  position: absolute; z-index: 2;
  background: #eef3ff; border: 1px solid #c4d2f5; border-left: 4px solid #3b71db;
  border-radius: 6px; padding: 3px 6px; line-height: 1.3; overflow: hidden;
  cursor: pointer; font-size: .72rem; box-sizing: border-box;
}
.flcal-slot:hover { filter: brightness(.96); box-shadow: 0 2px 6px rgba(0,0,0,.15); }
.flcal-slot .m { font-weight: 700; color: #2b4a9b; display: block; }
.flcal-slot .g { color: #6c757d; display: block; font-size: .95em; }
.flcal-slot .mo { display: block; font-size: .95em; font-weight: 600; color: #34476b; }
.flcal-slot .sa { display: block; font-size: .9em; font-style: italic; color: #8592a6; }
.flcal-slot .sa::before { content: "📍 "; font-style: normal; }
.flcal-legend { margin-top: .5rem; font-size: .75rem; color: #6c757d; }
@media (max-width: 768px) {
  .flcal-grid { grid-template-columns: 40px repeat(7, minmax(64px, 1fr)); font-size: .65rem; }
  .flcal-cell { min-height: 28px; }
  .flcal-cell.half { min-height: 14px; }
  .flcal-slot { font-size: .6rem; }
}
</style>
        `)

        return html.join("\n")
    }

    trigger = () =>
    {
        /* ============================================================
   JS : bascule Liste/Calendrier, navigation de semaine,
   construction du calendrier à partir de la table existante.
   ============================================================ */
        (function () {
            "use strict"

            var HEURE_DEBUT = 8, HEURE_FIN = 19, PAS = 30         // minutes
            var PX_PAR_MIN = 40 / 60                              // 40 px par heure
            var JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
            var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin",
                "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

            var calDate = new Date()      // date de référence de la semaine affichée
            var mode = "liste"            // "liste" | "cal"

            /* ---------- Bascule des vues ---------- */
            function setMode(m) {
                mode = m
                try { localStorage.setItem("flViewMode", m) } catch (e) { /* stockage indisponible */ }
                var btnL = document.getElementById("flViewBtnList-1")
                var btnC = document.getElementById("flViewBtnCal-1")
                var nav = document.getElementById("flCalNav-1")
                var cal = document.getElementById("flCalView-1")
                var table = document.querySelector("#flList-1 .table-responsive")
                btnL.className = "btn btn-sm " + (m === "liste" ? "btn-primary active" : "btn-outline-primary")
                btnC.className = "btn btn-sm " + (m === "cal" ? "btn-primary active" : "btn-outline-primary")
                nav.classList.toggle("d-none", m !== "cal")   // classe Bootstrap : jamais visible en mode liste
                cal.style.display = (m === "cal") ? "" : "none"
                if (table) table.style.display = (m === "liste") ? "" : "none"
                if (m === "cal") renderCal()
            }
            document.getElementById("flViewBtnList-1").addEventListener("click", function () { setMode("liste") })
            document.getElementById("flViewBtnCal-1").addEventListener("click", function () { setMode("cal") })

            /* Vue au chargement : le choix mémorisé de l'utilisateur, sinon calendrier */
            var modeInitial = "cal"
            try { modeInitial = localStorage.getItem("flViewMode") || "cal" } catch (e) {}
            setMode(modeInitial === "liste" ? "liste" : "cal")

            /* ---------- Navigation de semaine ---------- */
            document.getElementById("flCalPrev-1").addEventListener("click", function () {
                calDate.setDate(calDate.getDate() - 7); renderCal()
            })
            document.getElementById("flCalNext-1").addEventListener("click", function () {
                calDate.setDate(calDate.getDate() + 7); renderCal()
            })
            document.getElementById("flCalToday-1").addEventListener("click", function () {
                calDate = new Date(); renderCal()
            })
            document.getElementById("flCalDate-1").addEventListener("change", function (e) {
                if (!e.target.value) return
                var p = e.target.value.split("-")
                calDate = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]))
                renderCal()
            })

            /* ---------- Extraction des créneaux depuis la table existante ----------
     Chaque ligne de créneau (tr.listRow dans les tbody flCollapse-N-1) contient :
       td[2] : "Je 01/10/2026 14:00"  (jour abrégé, date, heure)
       td[3] : "4h"                   (durée)
       td[4] : "  [Groupe ...]"       (groupes)
       td[1] : lien flListDetail-<coursId>-1 (détail du cours)
  ------------------------------------------------------------------ */
            function extraireCreneaux() {
                var creneaux = []
                document.querySelectorAll("#flListTable-1 tbody[id^='flCollapse-'] tr.listRow").forEach(function (tr) {
                    var tds = tr.querySelectorAll("td")
                    if (tds.length < 5) return
                    var horaire = tds[2].textContent.trim()          // "Je 01/10/2026 14:00"
                    var m = horaire.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/)
                    if (!m) return
                    var debut = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]))
                    var dureeH = parseFloat(tds[3].textContent.trim()) || 0   // "4h", "3h", éventuellement "1h30"
                    var dureeMn = Math.round(dureeH * 60)
                    var grp = tds[4].textContent.trim().replace(/^\[|\]$/g, "").trim()
                    var detail = tr.querySelector("a[id^='flListDetail-']")   // lien détail du cours
                    creneaux.push({
                        date: debut,
                        duree: dureeMn,
                        groupes: grp,
                        /* Module et salle : fournis par data-attributes sur le <tr> côté serveur
           (ex: <tr class="listRow" data-module="Droit pénal" data-salle="B204">),
           ou en cellules supplémentaires de la ligne si elles existent. */
                        module: tr.dataset.module || (tds[5] ? tds[5].textContent.trim() : ""),
                        salle: tr.dataset.salle || (tds[6] ? tds[6].textContent.trim() : ""),
                        idCours: detail ? detail.id.replace(/^flListDetail-/, "").replace(/-1$/, "") : null,
                        link: detail || null
                    })
                })
                return creneaux
            }

            function iso(d) {
                return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0")
            }
            function lundiDe(d) {
                var c = new Date(d)
                c.setDate(c.getDate() - (c.getDay() + 6) % 7)
                c.setHours(0, 0, 0, 0)
                return c
            }
            function fmtH(mn) {
                return String(Math.floor(mn / 60)).padStart(2, "0") + ":" + String(mn % 60).padStart(2, "0")
            }

            /* ---------- Rendu du calendrier de la semaine ---------- */
            function renderCal() {
                var cont = document.getElementById("flCalView-1")
                var lundi = lundiDe(calDate)
                var dimanche = new Date(lundi); dimanche.setDate(dimanche.getDate() + 6)
                var jourCourant = iso(new Date())

                document.getElementById("flCalTitle-1").textContent =
      "Semaine du " + lundi.getDate() + " " + MOIS[lundi.getMonth()] +
      " au " + dimanche.getDate() + " " + MOIS[dimanche.getMonth()] + " " + dimanche.getFullYear()
                document.getElementById("flCalDate-1").value = iso(calDate)

                var days = []
                for (var i = 0; i < 7; i++) {
                    var d = new Date(lundi); d.setDate(d.getDate() + i)
                    days.push(d)
                }

                var html = "<div class=\"flcal-grid\">"
                html += "<div class=\"flcal-corner\"></div>"
                days.forEach(function (d, i) {
                    var cls = "flcal-head" + (i >= 5 ? " we" : "") + (iso(d) === jourCourant ? " today" : "")
                    html += "<div class=\"" + cls + "\">" + JOURS[i] +
        "<small>" + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "</small></div>"
                })

                for (var t = HEURE_DEBUT * 60; t < HEURE_FIN * 60; t += PAS) {
                    var full = t % 60 === 0
                    html += "<div class=\"flcal-hlabel" + (full ? "" : " half") + "\">" +
        (full ? String(t / 60).padStart(2, "0") + "h" : "|" + (t % 60)) + "</div>"
                    days.forEach(function (d, i) {
                        html += "<div class=\"flcal-cell" + (full ? "" : " half") + (i >= 5 ? " we" : "") + "\"></div>"
                    })
                }
                html += "</div>"
                cont.innerHTML = html

                var cells = cont.querySelectorAll(".flcal-cell")
                var creneaux = extraireCreneaux().filter(function (c) {
                    return c.date.getTime() >= lundi.getTime() &&
             c.date.getTime() < dimanche.getTime() + 86400000
                })

                /* Répartition par jour, puis juxtaposition des créneaux concomitants :
       les créneaux qui se chevauchent sont répartis sur des "pistes"
       côte à côte dans la colonne du jour (aucune superposition). */
                var parJour = [[], [], [], [], [], [], []]
                creneaux.forEach(function (c) {
                    var idx = c.date.getDay() === 0 ? 6 : c.date.getDay() - 1   // lundi=0 … dimanche=6
                    parJour[idx].push(c)
                })

                parJour.forEach(function (slots, idx) {
                    if (!slots.length) return
                    slots.sort(function (a, b) { return a.date - b.date })

                    // clusters de créneaux liés par chevauchement (transitif)
                    var clusters = [], cluster = null, finCluster = 0
                    slots.forEach(function (s) {
                        var deb = s.date.getTime(), fin = deb + s.duree * 60000
                        if (!cluster || deb >= finCluster) {
                            cluster = { slots: [s] }
                            finCluster = fin
                            clusters.push(cluster)
                        } else {
                            cluster.slots.push(s)
                            finCluster = Math.max(finCluster, fin)
                        }
                    })

                    var colCells = Array.prototype.filter.call(cells, function (el, i) { return i % 7 === idx })
                    if (!colCells.length) return

                    clusters.forEach(function (cl) {
                        // affectation des pistes : une piste est libre si elle est finie avant le début du créneau
                        var finsPistes = []
                        cl.slots.forEach(function (s) {
                            var deb = s.date.getTime(), p = -1
                            for (var i = 0; i < finsPistes.length; i++) {
                                if (finsPistes[i] <= deb) { p = i; break }
                            }
                            if (p === -1) { p = finsPistes.length; finsPistes.push(0) }
                            finsPistes[p] = deb + s.duree * 60000
                            s.piste = p
                        })
                        var nPistes = finsPistes.length

                        cl.slots.forEach(function (s) {
                            var deb = s.date.getHours() * 60 + s.date.getMinutes()
                            var el = document.createElement("div")
                            el.className = "flcal-slot"
                            el.innerHTML =
            "<span class=\"m\">" + fmtH(deb) + "–" + fmtH(deb + s.duree) + "</span>" +
            "<span class=\"g\">" + s.groupes + "</span>" +
            (s.module ? "<span class=\"mo\">" + s.module + "</span>" : "") +
            (s.salle ? "<span class=\"sa\">" + s.salle + "</span>" : "")
                            el.style.top = (deb - HEURE_DEBUT * 60) * PX_PAR_MIN + "px"
                            el.style.height = (s.duree * PX_PAR_MIN - 4) + "px"
                            el.style.left = "calc(" + (s.piste / nPistes * 100) + "% + 3px)"
                            el.style.width = "calc(" + (100 / nPistes) + "% - 6px)"
                            el.title = s.groupes
                            // le clic sur le créneau déclenche la fiche détail du cours (même action que la loupe)
                            if (s.link) el.addEventListener("click", function () { s.link.click() })
                            colCells[0].appendChild(el)
                        })
                    })
                })

                if (!creneaux.length) {
                    cont.insertAdjacentHTML("beforeend",
                        "<p class=\"text-muted fst-italic mt-2\">Aucun créneau cette semaine.</p>")
                }
            }
        })()
    }
}
