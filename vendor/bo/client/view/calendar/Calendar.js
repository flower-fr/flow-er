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
    <!-- Sélecteur manuel jour / semaine -->
    <div class="btn-group me-2" role="group" aria-label="Étendue de la vue">
      <button type="button" class="btn btn-outline-primary btn-sm active" id="flCalBtnJour-1" title="Vue journée">Jour</button>
      <button type="button" class="btn btn-outline-primary btn-sm" id="flCalBtnSemaine-1" title="Vue semaine">Semaine</button>
    </div>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="flCalPrev-1" title="Jour / semaine précédente">
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
/* ---------- CSS du calendrier (préfixé flCal pour éviter les collisions) ----------
   Couleurs pilotées par variables : le bloc dark ci-dessous les redéfinit
   selon le thème global (Bootstrap data-bs-theme="dark" OU classe .dark-mode). */
.flcal-grid {
  --fl-bg: #fff; --fl-border: #dee2e6; --fl-soft-border: #e9ecef;
  --fl-head-bg: #f5f7fb; --fl-head-txt: inherit; --fl-sub: #6c757d;
  --fl-we-bg: #f0f0f2; --fl-we-txt: #adb5bd; --fl-today-bg: #e8f0fe;
  --fl-cell-bg: #fff; --fl-half: #eef0f4;
  --fl-slot-bg: #eef3ff; --fl-slot-border: #c4d2f5; --fl-slot-accent: #3b71db;
  --fl-slot-m: #2b4a9b; --fl-slot-mo: #34476b; --fl-slot-sa: #8592a6;
  --fl-shadow: rgba(0, 0, 0, .15);

  display: grid;
  grid-template-columns: 56px repeat(7, minmax(110px, 1fr));  /* ajusté en JS selon les jours affichés */
  border: 1px solid var(--fl-border);
  border-radius: .5rem;
  overflow: hidden;
  background: var(--fl-bg);
  font-size: .8rem;
}
.flcal-head {
  padding: 8px 4px; text-align: center; font-weight: 600;
  background: var(--fl-head-bg); color: var(--fl-head-txt);
  border-bottom: 1px solid var(--fl-border); border-left: 1px solid var(--fl-border);
}
.flcal-head small { display: block; font-weight: 400; color: var(--fl-sub); }
.flcal-head.today { background: var(--fl-today-bg); }
.flcal-head.we { background: var(--fl-we-bg); color: var(--fl-we-txt); }
.flcal-corner { background: var(--fl-head-bg); border-bottom: 1px solid var(--fl-border); }
.flcal-hlabel {
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; color: var(--fl-sub); background: var(--fl-head-bg); border-top: 1px solid var(--fl-border);
}
.flcal-hlabel.half { font-size: .58rem; color: var(--fl-we-txt); background: var(--fl-bg); }
.flcal-cell { border-left: 1px solid var(--fl-border); border-top: 1px solid var(--fl-soft-border);
  position: relative; min-height: 40px; background: var(--fl-cell-bg); }
.flcal-cell.half { min-height: 20px; }
.flcal-cell.half::before { content: ""; position: absolute; top:0; left:0; right:0; border-top: 1px dashed var(--fl-half); }
.flcal-cell.we { background: var(--fl-we-bg); }
.flcal-slot {
  position: absolute; z-index: 2;
  background: var(--fl-slot-bg); border: 1px solid var(--fl-slot-border);
  border-left: 4px solid var(--fl-slot-accent);
  border-radius: 6px; padding: 3px 6px; line-height: 1.3; overflow: hidden;
  cursor: pointer; font-size: .72rem; box-sizing: border-box;
}
.flcal-slot:hover { filter: brightness(.96); box-shadow: 0 2px 6px var(--fl-shadow); }
.flcal-slot .m { font-weight: 700; color: var(--fl-slot-m); display: block; }
.flcal-slot .g { color: var(--fl-sub); display: block; font-size: .95em; }
.flcal-slot .mo { display: block; font-size: .95em; font-weight: 600; color: var(--fl-slot-mo); }
.flcal-slot .sa { display: block; font-size: .9em; font-style: italic; color: var(--fl-slot-sa); }
.flcal-slot .sa::before { content: "📍 "; font-style: normal; }
.flcal-slot .ty { display: inline-block; font-size: .9em; font-weight: 600; color: var(--fl-slot-m); }
.flcal-slot .fo { display: block; font-size: .9em;  color: var(--fl-slot-mo); }
.flcal-slot .vi { display: block; font-size: .9em; color: var(--fl-slot-accent); font-weight: 600;
  text-decoration: underline; word-break: break-all; }
/* ---------- Thèmes de créneau par programme (Bachelor / M1 / M2 / LLM) :
   chaque thème redéfinit les variables du slot ; le bloc dark ci-dessous
   refait le fonçage pour le mode sombre. ---------- */
.flcal-slot.t-bachelor { --fl-slot-bg:#e9f7ee; --fl-slot-border:#bfe5cb; --fl-slot-accent:#2f9e44; --fl-slot-m:#1b6e2f; }
.flcal-slot.t-m1       { --fl-slot-bg:#fff4e0; --fl-slot-border:#ffd8a8; --fl-slot-accent:#e8590c; --fl-slot-m:#a84300; }
.flcal-slot.t-m2       { --fl-slot-bg:#f3e8ff; --fl-slot-border:#dcc8f5; --fl-slot-accent:#7048c8; --fl-slot-m:#5f3dc4; }
.flcal-slot.t-llm      { --fl-slot-bg:#e0f5f5; --fl-slot-border:#a8e6e6; --fl-slot-accent:#0c8599; --fl-slot-m:#0b7285; }
.flcal-slot.t-autre    { --fl-slot-bg:#f1f3f5; --fl-slot-border:#dfe3e8; --fl-slot-accent:#868e96; --fl-slot-m:#495057; }
[data-mdb-theme="dark"] .flcal-slot.t-bachelor, [data-bs-theme="dark"] .flcal-slot.t-bachelor, .flcal-dark .flcal-slot.t-bachelor
  { --fl-slot-bg:#153522; --fl-slot-border:#2f6b40; --fl-slot-accent:#51cf66; --fl-slot-m:#8ce99a; }
[data-mdb-theme="dark"] .flcal-slot.t-m1, [data-bs-theme="dark"] .flcal-slot.t-m1, .flcal-dark .flcal-slot.t-m1
  { --fl-slot-bg:#3a2a14; --fl-slot-border:#7a4d1c; --fl-slot-accent:#ff922b; --fl-slot-m:#ffc078; }
[data-mdb-theme="dark"] .flcal-slot.t-m2, [data-bs-theme="dark"] .flcal-slot.t-m2, .flcal-dark .flcal-slot.t-m2
  { --fl-slot-bg:#2c2140; --fl-slot-border:#563d90; --fl-slot-accent:#9775fa; --fl-slot-m:#d0bfff; }
[data-mdb-theme="dark"] .flcal-slot.t-llm, [data-bs-theme="dark"] .flcal-slot.t-llm, .flcal-dark .flcal-slot.t-llm
  { --fl-slot-bg:#12333a; --fl-slot-border:#1f6673; --fl-slot-accent:#3bc9db; --fl-slot-m:#66d9e8; }
[data-mdb-theme="dark"] .flcal-slot.t-autre, [data-bs-theme="dark"] .flcal-slot.t-autre, .flcal-dark .flcal-slot.t-autre
  { --fl-slot-bg:#2b2f36; --fl-slot-border:#495057; --fl-slot-accent:#adb5bd; --fl-slot-m:#ced4da; }
/* Légende des thèmes */
.flcal-thleg { display: flex; flex-wrap: wrap; gap: 12px; margin-top: .5rem; font-size: .75rem; color: var(--fl-sub); }
.flcal-thleg .chip { display: inline-flex; align-items: center; gap: 5px; }
.flcal-thleg .sw { width: 12px; height: 12px; border-radius: 3px; }
.flcal-thleg .sw.t-bachelor { background: #2f9e44; }
.flcal-thleg .sw.t-m1      { background: #e8590c; }
.flcal-thleg .sw.t-m2      { background: #7048c8; }
.flcal-thleg .sw.t-llm     { background: #0c8599; }
.flcal-thleg .sw.t-autre   { background: #868e96; }
.flcal-legend { margin-top: .5rem; font-size: .75rem; color: var(--fl-sub); }

/* ---------- Mode dark : suit le choix global de l'utilisateur ----------
   Convention du back-office : data-mdb-theme="dark" (ou "light") sur <html>.
   Palette alignée sur la feuille de style personnalisée back-office
   (surfaces #212529/#2b3035 type Bootstrap dark) : ajustez les valeurs
  essous si vos tons diffèrent — tout est dans ce bloc unique. */
[data-mdb-theme="dark"] .flcal-grid,
[data-bs-theme="dark"] .flcal-grid,
[data-theme="dark"] .flcal-grid,
.dark-mode .flcal-grid,
.flcal-grid.flcal-dark {
  --fl-bg: #262a31; --fl-border: #3a4048; --fl-soft-border: #31363e;
  --fl-head-bg: #2b3038; --fl-head-txt: #e3e6eb; --fl-sub: #9aa1ab;
  --fl-we-bg: #282c33; --fl-we-txt: #6a717c; --fl-today-bg: #2e3a52;
  --fl-cell-bg: #262a31; --fl-half: #343b46;
  --fl-slot-bg: #2c3650; --fl-slot-border: #3d5185; --fl-slot-accent: #6c8cf5;
  --fl-slot-m: #9db4f0; --fl-slot-mo: #c6cdd9; --fl-slot-sa: #8d95a3;
  --fl-shadow: rgba(0, 0, 0, .45);
}

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
            var PX_PAR_MIN_DEFAUT = 40 / 60                        // hypothèse : 40px/heure
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

            /* ---------- Étendue de la vue : jour vs semaine ----------
     Sélecteur MANUEL en haut du calendrier (boutons Jour / Semaine).
     Défaut = vue jour (première visite), puis choix mémorisé (localStorage).
     Pilotable aussi depuis vos fonctions JS : flCalSetDayMode(true|false|undefined) */
            var vueJour = true           // true = vue journée, false = vue semaine
            try { vueJour = (localStorage.getItem("flCalDayMode") || "jour") !== "semaine" } catch (e) {}

            function majBoutonsEtendue() {
                var bj = document.getElementById("flCalBtnJour-1"), bs = document.getElementById("flCalBtnSemaine-1")
                if (!bj || !bs) return
                bj.className = "btn btn-sm " + (vueJour ? "btn-primary active" : "btn-outline-primary")
                bs.className = "btn btn-sm " + (!vueJour ? "btn-primary active" : "btn-outline-primary")
            }
            function setVueJour(on) {
                vueJour = !!on
                try { localStorage.setItem("flCalDayMode", vueJour ? "jour" : "semaine") } catch (e) {}
                majBoutonsEtendue()
                renderCal()
            }
            document.getElementById("flCalBtnJour-1").addEventListener("click", function () { setVueJour(true) })
            document.getElementById("flCalBtnSemaine-1").addEventListener("click", function () { setVueJour(false) })
            majBoutonsEtendue()
            // le setMode initial (plus haut) a rendu le calendrier AVANT l'init de
            // vueJour -> second rendu avec la bonne étendue (jour par défaut)
            if (typeof mode !== "undefined" && mode === "cal") renderCal()

            /* ---------- API publique pour piloter le widget depuis vos fonctions ----
     flCalSetDayMode(true)        -> vue journée
     flCalSetDayMode(false)       -> vue semaine
     flCalSetDayMode()            -> bascule en calendrier SANS changer l'étendue
     flCalSetDate(new Date(...))  -> aller directement à une date
     flCalTheme(true|false)       -> forcer le thème du widget (mode dark)
     Chaque appel re-rend le calendrier immédiatement. */
            window.flCalSetDayMode = function (on) {
                if (on !== undefined && on !== null) setVueJour(!!on)  // met à jour aussi le sélecteur + localStorage
                document.getElementById("flViewBtnCal-1").click()      // s'assure d'être en vue calendrier
            };
            window.flCalIsDayMode = function () { return vueJour };
            window.flCalSetDate = function (d) {
                calDate = (d instanceof Date) ? new Date(d) : new Date()
                renderCal()
            };
            window.flCalTheme = function (dark) {
                document.querySelectorAll(".flcal-grid").forEach(function (g) {
                    g.classList.toggle("flcal-dark", !!dark)
                })
            };

            /* ---------- Détection du thème global (dark vs light) ----------
     1. attributs/classes explicites ; 2. repli par luminance du fond du
     body : si le fond global est sombre, le widget s'assombrit quoi qu'il
     arrive. La classe .flcal-dark est alors posée sur la grille. */
            function themeSombre() {
                var b = document.body
                // convention du back-office : data-mdb-theme sur <html>
                if (document.documentElement.matches("[data-mdb-theme=\"dark\"], [data-bs-theme=\"dark\"], [data-theme=\"dark\"]") ||
        b.matches(".dark-mode, .theme-dark, .dark") ||
        document.querySelector("[data-mdb-theme=\"dark\"], [data-bs-theme=\"dark\"], [data-theme=\"dark\"], .dark-mode, .theme-dark, .dark"))
                    return true
                // repli : luminance du fond du body (YIQ) — < 128 = sombre
                var rgb = getComputedStyle(b).backgroundColor.match(/\d+/g)
                if (!rgb || rgb.length < 3) return false
                return (299 * Number(rgb[0]) + 587 * Number(rgb[1]) + 114 * Number(rgb[2])) / 1000 < 128
            }

            /* ---------- Navigation de date : 1 jour / 7 jours selon l'étendue ---------- */
            document.getElementById("flCalPrev-1").addEventListener("click", function () {
                calDate.setDate(calDate.getDate() - (vueJour ? 1 : 7)); renderCal()
            })
            document.getElementById("flCalNext-1").addEventListener("click", function () {
                calDate.setDate(calDate.getDate() + (vueJour ? 1 : 7)); renderCal()
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

            /* ---------- Cartographie des colonnes PAR LIBELLÉ d'en-tête ----------
     Les colonnes présentes dépendent des filtres (pas de colonne vide) :
     on ne se base donc JAMAIS sur l'indice d'une colonne, mais sur le texte
     de son <th> : "Créneau horaire", "Durée", "Programme", "Groupe",
     "Nom du module", "Type", "Nom du formateur", "Salle", "Lien visio".
     Re-calculée à chaque rendu : si le moteur de recherche ajoute/retire
     une colonne, le widget suit automatiquement. */
            function carteColonnes() {
                var map = {}
                document.querySelectorAll("#flListTable-1 thead th").forEach(function (th, i) {
                    var t = th.textContent.toLowerCase()
                        .replace(/\s+/g, " ")                        // normalise espaces/retours ligne
                        .trim()
                    if (t.indexOf("créneau") !== -1 || t.indexOf("creneau") !== -1) map.horaire = i
                    else if (t.indexOf("durée") !== -1 || t.indexOf("duree") !== -1) map.duree = i
                    else if (t.indexOf("programme") !== -1) map.programme = i
                    else if (t.indexOf("groupe") !== -1) map.groupe = i
                    else if (t.indexOf("module") !== -1) map.module = i
                    else if (t.indexOf("type") !== -1) map.type = i
                    else if (t.indexOf("formateur") !== -1) map.formateur = i
                    else if (t.indexOf("salle") !== -1) map.salle = i
                    else if (t.indexOf("visio") !== -1 || t.indexOf("lien") !== -1) map.visio = i
                })
                return map
            }

            function esc(t) {
                return String(t || "").replace(/[&<>"']/g, function (c) {
                    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]
                })
            }

            /* ---------- Thème de couleur selon le programme ----------
     Statuts Bachelors (B1+B2+B3, "TC Bachelors..."), M1, M2, LLM.
     On examine programme PUIS groupe (le programme peut être vide dans
     la ligne, le groupe porte alors l'information). */
            function themeProgramme(programme, groupe) {
                var t = (programme + " " + groupe).toLowerCase()
                if (t.indexOf("llm") !== -1) return "llm"
                if (t.indexOf("bachelor") !== -1) return "bachelor"
                if (t.indexOf("m2") !== -1 || t.indexOf("mastère 2") !== -1 || t.indexOf("master 2") !== -1) return "m2"
                if (t.indexOf("m1") !== -1 || t.indexOf("mastère 1") !== -1 || t.indexOf("master 1") !== -1) return "m1"
                return "autre"
            }

            /* ---------- Extraction des créneaux depuis la table existante ----------
     Chaque ligne (tr.listRow dans les tbody flCollapse-N-1) est lue via
     la carte des colonnes ; les données absentes sont simplement omises. */
            function extraireCreneaux() {
                var map = carteColonnes()
                var creneaux = []
                document.querySelectorAll("#flListTable-1 tbody[id^='flCollapse-'] tr.listRow").forEach(function (tr) {
                    var tds = tr.querySelectorAll("td")
                    function cell(k) { return (map[k] !== undefined && tds[map[k]]) ? tds[map[k]].textContent.trim() : "" }
                    var visioTd = (map.visio !== undefined && tds[map.visio]) ? tds[map.visio] : null
                    var visioA = visioTd ? visioTd.querySelector("a[href]") : null

                    var horaire = cell("horaire")                     // "Lu 02/11/2026 09:00"
                    var m = horaire.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/)
                    if (!m) return
                    var debut = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]))
                    var dureeH = parseFloat(cell("duree")) || 0       // "4h", éventuellement "1h30"
                    var groupes = cell("groupe").replace(/^\[|\]$/g, "").trim()
                    var programme = cell("programme")
                    var detail = tr.querySelector("a[id^='flListDetail-']")   // lien détail du cours
                    creneaux.push({
                        date: debut,
                        duree: Math.round(dureeH * 60),
                        groupes: groupes,
                        programme: programme,
                        module: cell("module"),
                        type: cell("type"),                             // "Cours", "Contrôle continu"...
                        formateur: cell("formateur"),
                        salle: cell("salle"),
                        visio: visioA ? { url: visioA.href, label: (visioA.textContent.trim() || visioA.href) } : null,
                        theme: themeProgramme(programme, groupes),
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

            /* ---------- Rendu du calendrier (semaine ou journée) ----------
     - mode semaine : lundi à vendredi + samedi/dimanche SEULEMENT s'ils
       contiennent des créneaux (sinon masqués pour gagner de la place) ;
     - mode journée (moteur de recherche sur "journée") : une seule colonne. */
            function renderCal() {
                var cont = document.getElementById("flCalView-1")
                var jourCourant = iso(new Date())
                var modeJour = vueJour

                /* Créneaux groupés par date ISO pour savoir quels jours sont occupés */
                var parIso = {}
                extraireCreneaux().forEach(function (c) {
                    var k = iso(c.date);
                    (parIso[k] = parIso[k] || []).push(c)
                })

                /* Jours à afficher */
                var days = []
                if (modeJour) {
                    var dj = new Date(calDate); dj.setHours(0, 0, 0, 0)
                    days.push(dj)
                } else {
                    var lundi = lundiDe(calDate)
                    for (var i = 0; i < 7; i++) {
                        var d = new Date(lundi); d.setDate(d.getDate() + i)
                        // Samedi ET dimanche sont évalués séparément, jour par jour :
                        // chacun n'est affiché que si SA date exacte porte au moins un créneau.
                        if (i < 5 || (parIso[iso(d)] || []).length) days.push(d)  // WE masqués si vides
                    }
                    /* Diagnostic si besoin : lancer  window.flCalDebug = true  en console,
         puis changer de semaine : les dates détectées dans la table sont
         listées -> si une date dimanche apparaît, une ligne de la liste
         porte un créneau ce dimanche-là (rattrapage, e-learning...). */
                    if (window.flCalDebug) console.debug("[flCal] créneaux détectés : " + Object.keys(parIso).join(", "))
                }
                var nbCols = days.length

                /* Titre et champ date */
                if (modeJour) {
                    document.getElementById("flCalTitle-1").textContent =
        "Journée du " + days[0].getDate() + " " + MOIS[days[0].getMonth()] + " " + days[0].getFullYear()
                } else {
                    var dimanche = new Date(lundiDe(calDate)); dimanche.setDate(dimanche.getDate() + 6)
                    document.getElementById("flCalTitle-1").textContent =
        "Semaine du " + lundiDe(calDate).getDate() + " " + MOIS[lundiDe(calDate).getMonth()] +
        " au " + dimanche.getDate() + " " + MOIS[dimanche.getMonth()] + " " + dimanche.getFullYear()
                }
                document.getElementById("flCalDate-1").value = iso(calDate)

                /* Grille : nb de colonnes = nb de jours affichés ; thème dark appliqué
       à chaque rendu -> suit le toggle global sans rechargement */
                var html = "<div class=\"flcal-grid" + (themeSombre() ? " flcal-dark" : "") +
      "\" style=\"grid-template-columns: 56px repeat(" + nbCols +
      ", minmax(" + (nbCols === 1 ? "160" : "110") + "px, 1fr));\">"
                html += "<div class=\"flcal-corner\"></div>"
                days.forEach(function (d) {
                    var we = d.getDay() === 0 || d.getDay() === 6
                    var cls = "flcal-head" + (we ? " we" : "") + (iso(d) === jourCourant ? " today" : "")
                    html += "<div class=\"" + cls + "\">" + JOURS[(d.getDay() + 6) % 7] +
        "<small>" + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "</small></div>"
                })

                for (var t = HEURE_DEBUT * 60; t < HEURE_FIN * 60; t += PAS) {
                    var full = t % 60 === 0
                    html += "<div class=\"flcal-hlabel" + (full ? "" : " half") + "\">" +
        (full ? String(t / 60).padStart(2, "0") + "h" : "|" + (t % 60)) + "</div>"
                    days.forEach(function (d) {
                        var we = d.getDay() === 0 || d.getDay() === 6
                        html += "<div class=\"flcal-cell" + (full ? "" : " half") + (we ? " we" : "") + "\"></div>"
                    })
                }
                html += "</div>"
                cont.innerHTML = html

                var cells = cont.querySelectorAll(".flcal-cell")

                /* Échelle réelle : on mesure la 1re heure rendue (cellule pleine +
       cellule demi) au lieu de supposer 40px/heure — immunise le widget
       contre tout style extérieur qui modifierait les hauteurs (padding,
       line-height, media query, zoom...). */
                var pxParMin = PX_PAR_MIN_DEFAUT
                var cellules = cont.querySelectorAll(".flcal-cell")
                if (cellules.length >= 2 * nbCols) {
                    pxParMin = (cellules[0].offsetHeight + cellules[nbCols].offsetHeight) / 60
                }

                /* Placement des créneaux, jour affiché par jour affiché (position p = colonne) */
                var total = 0
                days.forEach(function (d, p) {
                    var slots = parIso[iso(d)] || []
                    if (!slots.length) return
                    total += slots.length
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

                    var colCells = Array.prototype.filter.call(cells, function (el, i) { return i % nbCols === p })
                    if (!colCells.length) return

                    clusters.forEach(function (cl) {
                        // affectation des pistes : une piste est libre si elle est finie avant le début du créneau
                        var finsPistes = []
                        cl.slots.forEach(function (s) {
                            var deb = s.date.getTime(), pi = -1
                            for (var i = 0; i < finsPistes.length; i++) {
                                if (finsPistes[i] <= deb) { pi = i; break }
                            }
                            if (pi === -1) { pi = finsPistes.length; finsPistes.push(0) }
                            finsPistes[pi] = deb + s.duree * 60000
                            s.piste = pi
                        })
                        var nPistes = finsPistes.length

                        cl.slots.forEach(function (s) {
                            var deb = s.date.getHours() * 60 + s.date.getMinutes()
                            var el = document.createElement("div")
                            el.className = "flcal-slot t-" + s.theme
                            el.innerHTML =
            "<span class=\"m\">" + fmtH(deb) + "–" + fmtH(deb + s.duree) + "</span>" +
            (s.module ? "<span class=\"mo\">" + esc(s.module) + "</span>" : "") +
            (s.type ? "<span class=\"ty\">" + esc(s.type) + "</span>" : "") +
            (s.formateur ? "<span class=\"fo\">" + esc(s.formateur) + "</span>" : "") +
            (s.groupes ? "<span class=\"g\">" + esc(s.groupes) + "</span>" : "") +
            (s.salle ? "<span class=\"sa\">" + esc(s.salle) + "</span>" : "") +
            (s.visio ? "<a class=\"vi\" href=\"" + esc(s.visio.url) + "\" target=\"_blank\" rel=\"noopener\">" +
              "🔗 " + esc(s.visio.label) + "</a>" : "")
                            el.style.top = (deb - HEURE_DEBUT * 60) * pxParMin + "px"
                            el.style.height = (s.duree * pxParMin - 4) + "px"
                            el.style.left = "calc(" + (s.piste / nPistes * 100) + "% + 3px)"
                            el.style.width = "calc(" + (100 / nPistes) + "% - 6px)"
                            el.title = [s.module, s.type, s.formateur, s.groupes, s.salle].filter(Boolean).join(" · ")
                            // le clic sur le créneau déclenche la fiche détail du cours (même action que la loupe)
                            if (s.link) el.addEventListener("click", function () { s.link.click() })
                            // le clic sur le lien visio ouvre la visio SANS déclencher le détail
                            var vi = el.querySelector("a.vi")
                            if (vi) vi.addEventListener("click", function (e) { e.stopPropagation() })
                            colCells[0].appendChild(el)
                        })
                    })
                })

                if (!total) {
                    cont.insertAdjacentHTML("beforeend",
                        "<p class=\"text-muted fst-italic mt-2\">Aucun créneau " + (modeJour ? "ce jour." : "cette semaine.") + "</p>")
                } else {
                    /* Légende des thèmes de couleur présents sur la vue */
                    var LEGENDE = { bachelor: "Bachelor", m1: "M1", m2: "M2", llm: "LLM", autre: "Autre" }
                    var presents = {}
                    days.forEach(function (d) {
                        (parIso[iso(d)] || []).forEach(function (c) { presents[c.theme] = true })
                    })
                    var leg = "<div class=\"flcal-thleg\">" +
        Object.keys(LEGENDE).filter(function (k) { return presents[k] }).map(function (k) {
            return "<span class=\"chip\"><span class=\"sw t-" + k + "\"></span>" + LEGENDE[k] + "</span>"
        }).join("") + "</div>"
                    cont.insertAdjacentHTML("beforeend", leg)
                }
            }
        })()
    }
}
