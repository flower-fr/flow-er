import View from "../View.js"

export default class RichForm extends View
{
    constructor({ controller, entity, view, id, layout, onSuccess })
    {
        super({ controller })
        this.identifier = Date.now()
        this.entity = entity
        this.view = view
        this.id = id
        this.layout = layout
        this.onSuccess = onSuccess
    }

    initialize = async () =>
    {
    }

    render = () =>
    {    
        const html = []
        html.push(`
            <style>
            /* --------- Éditeur wysiwyg du sujet (stocké en markdown) --------- */
            .fl-wysiwyg-toolbar { display: flex; gap: .3rem; flex-wrap: wrap; margin-bottom: .4rem; }
            .fl-wysiwyg-toolbar .btn { padding: .25rem .6rem; }
            .fl-wysiwyg {
            min-height: 130px; padding: .7rem .8rem; border: 1px solid var(--border);
            border-radius: var(--radius); background: var(--surface); outline: none; font-size: .92rem;
            transition: border-color var(--fl-speed), box-shadow var(--fl-speed);
            }
            .fl-wysiwyg:focus { border-color: var(--fl-primary);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--fl-primary) 22%, transparent); }
            .fl-wysiwyg:empty::before { content: "Rédigez le sujet de l'épreuve…"; color: var(--text-dim); }
            .fl-md-preview { font-family: ui-monospace, Consolas, monospace; font-size: .76rem;
            color: var(--text-dim); background: var(--surface-2); border: 1px dashed var(--border);
            border-radius: var(--radius); padding: .5rem .6rem; margin-top: .45rem; white-space: pre-wrap; }

            /* --------- Saisie structurée (consignes, barème) --------- */
            .fl-row-list { display: flex; flex-direction: column; gap: .45rem; }
            .fl-row-item { display: flex; align-items: center; gap: .5rem; }
            .fl-row-item .form-control,
            .fl-row-item .form-select { margin: 0; }
            .fl-row-num { min-width: 1.6rem; text-align: right; font-size: .8rem; color: var(--text-dim); font-weight: 600; }
            .fl-row-remove { flex: 0 0 auto; width: 2rem; height: 2rem; border: none; border-radius: 50%;
            background: transparent; color: var(--text-dim); cursor: pointer; font-size: .9rem; line-height: 1; }
            .fl-row-remove:hover { background: rgba(220, 76, 76, .12); color: var(--fl-danger); }
            .fl-add-row { width: 100%; margin-top: .45rem; }
            .fl-bareme-grid { display: grid; grid-template-columns: 1fr 5.5rem 2rem; gap: .5rem; align-items: center; }
            .fl-bareme-head { display: grid; grid-template-columns: 1fr 5.5rem 2rem; gap: .5rem;
            font-size: .74rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase;
            letter-spacing: .04em; margin-bottom: .25rem; }
            .fl-bareme-total { font-size: .85rem; color: var(--text-dim); margin: .55rem 0 0;
            display: flex; justify-content: flex-end; align-items: baseline; gap: .3rem; }
            .fl-bareme-total b { color: var(--fl-primary); font-size: 1.05rem; }
            .fl-field-msg { font-size: .8rem; color: var(--fl-danger); font-weight: 600; margin: .3rem 0 0; display: none; }
            .fl-field-msg.show { display: block; }

            /* --------- Documents joints --------- */
            .fl-doc-item {
            display: flex; align-items: center; gap: .6rem; padding: .45rem .6rem;
            border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface-2);
            font-size: .85rem; margin-bottom: .35rem;
            }
            .fl-doc-remove {
            margin-left: auto; border: none; background: transparent; color: var(--fl-danger);
            cursor: pointer; font-size: .95rem; padding: .1rem .4rem; border-radius: var(--radius);
            }
            .fl-doc-remove:hover { background: rgba(220,76,76,.12); }
            .fl-doc-meta { color: var(--text-dim); font-size: .74rem; }
            </style>

      <div class="fl-alert-success" id="flForm-messageOk">Demande enregistrée</div>

      <div class="fl-modal-context" id="flEpreuveContext"></div>

      <div class="form-outline">
        <input class="form-control" placeholder=" " id="e-libelle" maxlength="255">
        <label class="form-label" for="e-libelle">Libellé de l'épreuve (ex. Examen final – session 1)</label>
      </div>

      <!-- Sujet : wysiwyg minimal, stocké en markdown -->
      <div class="fl-section-title">Sujet (stocké en markdown)</div>
      <div class="fl-wysiwyg-toolbar" id="sujetToolbar">
        <button type="button" class="btn btn-outline-secondary btn-sm" data-cmd="bold" title="Gras (Ctrl+B)"><b>B</b></button>
        <button type="button" class="btn btn-outline-secondary btn-sm" data-cmd="italic" title="Italique (Ctrl+I)"><i>I</i></button>
        <button type="button" class="btn btn-outline-secondary btn-sm" data-cmd="formatBlock" data-value="h3" title="Titre">H3</button>
        <button type="button" class="btn btn-outline-secondary btn-sm" data-cmd="insertUnorderedList" title="Liste à puces">• —</button>
        <button type="button" class="btn btn-outline-secondary btn-sm" data-cmd="insertOrderedList" title="Liste numérotée">1.</button>
      </div>
      <div class="fl-wysiwyg" id="sujetEditor" contenteditable="true" spellcheck="true"></div>
      <div class="fl-md-preview" id="sujetMdPreview"></div>
      <input type="hidden" id="e-sujet-md">

      <!-- Consignes : liste structurée → stockée en JSON -->
      <div class="fl-section-title">Consignes</div>
      <div class="fl-row-list" id="consignesList"></div>
      <input type="hidden" id="e-consignes">
      <button type="button" class="btn btn-outline-secondary btn-sm fl-add-row" id="consignesAdd">＋ Ajouter une consigne</button>
      <p class="fl-field-msg" id="consignesMsg"></p>

      <!-- Barème : grille structurée (critère + points) → stockée en JSON -->
      <div class="fl-section-title">Barème de notation</div>
      <div class="fl-bareme-head"><span>Critère</span><span style="text-align:right">Points</span><span></span></div>
      <div class="fl-row-list" id="baremeList"></div>
      <input type="hidden" id="e-bareme">
      <button type="button" class="btn btn-outline-secondary btn-sm fl-add-row" id="baremeAdd">＋ Ajouter un critère</button>
      <p class="fl-bareme-total" id="baremeTotal"></p>
      <p class="fl-field-msg" id="baremeMsg"></p>

      <!-- Documents -->
      <div class="fl-section-title">Documents joints</div>
      <input type="file" class="form-control" id="e-documents" multiple accept=".pdf,.docx,.xlsx,.pptx,.md,image/*">
      <p class="fl-inputfile-note">PDF, Word, Excel, images… Les fichiers seront téléversés avec l'épreuve.</p>
      <div id="docList" style="margin-top:.5rem;"></div>

      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1.2rem;">
        <button class="btn btn-outline-secondary" data-close>Annuler</button>
        <button class="btn btn-primary" id="e-submit">Créer l'épreuve</button>
      </div>
        `)

        return html.join("\n")
    }

    trigger = () =>
    {
        /* ============================================================
   trigger() — câblage du formulaire « + Épreuve » dans la modale
   ------------------------------------------------------------
   À appeler APRÈS injection du HTML du formulaire dans le body
   de la modale flModalToggle1 (et après ouverture de la modale).
   Le HTML injecté doit exposer exactement ces id :
     e-libelle, sujetToolbar, sujetEditor, e-sujet-md, sujetMdPreview,
     consignesList, consignesAdd, consignesMsg, e-consignes,
     baremeHead (facultatif), baremeList, baremeAdd, baremeMsg,
     baremeTotal, e-bareme, e-documents, docList, flForm-messageOk,
     e-submit (+ data-close pour Annuler si présent)
   ============================================================ */
        "use strict"

        /* context (adapter à votre page) :
     {
       program_module_id: 123,          // obligatoire : id du module affiché
       module: "Droit civil",          // facultatif : affichage
       close: function () { ... }      // facultatif : ferme votre modale
                                          (sinon flCloseModal est utilisée)
     }
     Si l'id du module n'est pas passé en argument, trigger() le lit
     sur la carte : data-fl-id de l'élément le plus proche du bouton. */
        var programModuleId = this.id
        if (programModuleId === undefined || programModuleId === null) {
            var holder = document.getElementById("flCardEpreuveButton")
            var card = holder ? holder.closest("[data-fl-id]") : null
            programModuleId = card ? card.getAttribute("data-fl-id") : null
        }

        /* ---------- État local (recréé à chaque ouverture : zéro résidu) ---------- */
        var consignesItems = [""]                            // texte libre → JSON
        var baremeItems = [{ critere: "", points: "" }]      // critères → JSON
        var epreuveDocs = []                                 // File objects

        /* ---------- Helpers (portée locale, rien de global) ---------- */
        function $(id) { return document.getElementById(id) }
        function setValue(id, v) { $(id).value = v }
        function setText(id, v) { $(id).textContent = v }
        function escAttr(s) {
            return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
                .replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        function escHtml(s) {
            return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        function fieldMsg(id, text) {
            var el = $(id)
            el.textContent = text
            el.classList.toggle("show", !!text)
        }

        /* ============================================================
     Sujet wysiwyg → markdown
     ============================================================ */
        function htmlToMarkdown(root) {
            function inlineWrap(el) {
                var inner = walk(el).trim()
                if (!inner) return ""
                var cs = window.getComputedStyle(el)
                if (cs.fontWeight === "bold" || +cs.fontWeight >= 600) inner = "**" + inner + "**"
                if (cs.fontStyle === "italic") inner = "*" + inner + "*"
                return inner
            }
            function walk(node) {
                var out = ""
                Array.prototype.forEach.call(node.childNodes, function (n) {
                    if (n.nodeType === Node.TEXT_NODE) {
                        out += n.textContent.replace(/\u00a0/g, " ")
                    } else if (n.nodeType === Node.ELEMENT_NODE) {
                        var tag = n.tagName.toLowerCase()
                        var t = walk(n).trim()
                        switch (tag) {
                        case "br": out += "  \n"; break
                        case "b": case "strong": out += t ? "**" + t + "**" : ""; break
                        case "i": case "em": out += t ? "*" + t + "*" : ""; break
                        case "h1": case "h2": case "h3": case "h4":
                            out += "\n\n" + "#".repeat(+tag[1]) + " " + t + "\n\n"; break
                        case "ul": case "ol": {
                            Array.prototype.forEach.call(n.querySelectorAll(":scope > li"), function (item, i) {
                                out += (tag === "ol" ? (i + 1) + ". " : "- ") +
                  walk(item).trim().replace(/\n{2,}/g, "\n") + "\n"
                            })
                            out += "\n"; break
                        }
                        case "li": out += t; break
                        case "p": case "div": out += "\n\n" + t + "\n\n"; break
                        default: out += inlineWrap(n)
                        }
                    }
                })
                return out
            }
            return walk(root).replace(/\n{3,}/g, "\n\n").trim()
        }
        function syncSujet() {
            var md = htmlToMarkdown($("sujetEditor"))
            setValue("e-sujet-md", md)
            setText("sujetMdPreview", md ? "md » " + md : "")
        }
        Array.prototype.forEach.call(
            document.querySelectorAll("#sujetToolbar [data-cmd]"),
            function (btn) {
                btn.addEventListener("mousedown", function (e) { e.preventDefault() })
                btn.addEventListener("click", function () {
                    var cmd = btn.getAttribute("data-cmd")
                    if (cmd === "formatBlock") document.execCommand("formatBlock", false, btn.getAttribute("data-value"))
                    else document.execCommand(cmd, false, null)
                    syncSujet()
                })
            })
        $("sujetEditor").addEventListener("keydown", function (e) {
            if (e.ctrlKey && ["b", "i"].indexOf(e.key.toLowerCase()) !== -1) {
                e.preventDefault()
                document.execCommand(e.key.toLowerCase() === "b" ? "bold" : "italic")
                syncSujet()
            }
        })
        $("sujetEditor").addEventListener("input", syncSujet)

        /* ============================================================
     Consignes : lignes de texte libre → JSON
     ============================================================ */
        function renderConsignes() {
            $("consignesList").innerHTML = consignesItems.map(function (t, i) {
                return "<div class=\"fl-row-item\">" +
        "<span class=\"fl-row-num\">" + (i + 1) + ".</span>" +
        "<input type=\"text\" class=\"form-control\" data-ci=\"" + i + "\" value=\"" + escAttr(t) + "\" placeholder=\"Ex. Documents non autorisés.\">" +
        "<button type=\"button\" class=\"fl-row-remove\" data-cr=\"" + i + "\" title=\"Retirer la consigne\">✕</button>" +
        "</div>"
            }).join("")
            Array.prototype.forEach.call(document.querySelectorAll("[data-ci]"), function (inp) {
                inp.addEventListener("input", function () {
                    consignesItems[Number(inp.getAttribute("data-ci"))] = inp.value
                    syncConsignes()
                })
            })
            Array.prototype.forEach.call(document.querySelectorAll("[data-cr]"), function (b) {
                b.addEventListener("click", function () {
                    consignesItems.splice(Number(b.getAttribute("data-cr")), 1)
                    if (!consignesItems.length) consignesItems = [""]
                    renderConsignes(); syncConsignes()
                })
            })
            syncConsignes()
        }
        function syncConsignes() {
            var arr = consignesItems.map(function (t) { return t.trim() }).filter(Boolean)
            setValue("e-consignes", JSON.stringify(arr))
        }
        $("consignesAdd").addEventListener("click", function () {
            consignesItems.push("")
            renderConsignes()
            var last = document.querySelector("[data-ci='" + (consignesItems.length - 1) + "']")
            if (last) last.focus()
        })

        /* ============================================================
     Barème : lignes critère + points → JSON (total en direct)
     ============================================================ */
        function renderBareme() {
            $("baremeList").innerHTML = baremeItems.map(function (it, i) {
                return "<div class=\"fl-bareme-grid\">" +
        "<input type=\"text\" class=\"form-control\" data-bc=\"" + i + "\" value=\"" + escAttr(it.critere) + "\" placeholder=\"Ex. Introduction et problématique\">" +
        "<input type=\"number\" class=\"form-control\" data-bp=\"" + i + "\" value=\"" + escAttr(it.points) + "\" min=\"0\" step=\"0.5\" style=\"text-align:right\" placeholder=\"—\">" +
        "<button type=\"button\" class=\"fl-row-remove\" data-br=\"" + i + "\" title=\"Retirer le critère\">✕</button>" +
        "</div>"
            }).join("")
            Array.prototype.forEach.call(document.querySelectorAll("[data-bc]"), function (inp) {
                inp.addEventListener("input", function () {
                    baremeItems[Number(inp.getAttribute("data-bc"))].critere = inp.value
                    syncBareme()
                })
            })
            Array.prototype.forEach.call(document.querySelectorAll("[data-bp]"), function (inp) {
                inp.addEventListener("input", function () {
                    baremeItems[Number(inp.getAttribute("data-bp"))].points = inp.value
                    syncBareme()
                })
            })
            Array.prototype.forEach.call(document.querySelectorAll("[data-br]"), function (b) {
                b.addEventListener("click", function () {
                    baremeItems.splice(Number(b.getAttribute("data-br")), 1)
                    if (!baremeItems.length) baremeItems = [{ critere: "", points: "" }]
                    renderBareme(); syncBareme()
                })
            })
            syncBareme()
        }
        function syncBareme() {
            var arr = [], total = 0
            baremeItems.forEach(function (it) {
                var crit = (it.critere || "").trim()
                var pts = parseFloat(it.points)
                if (crit && !isNaN(pts) && pts >= 0) { arr.push({ critere: crit, points: pts }); total += pts }
            })
            setValue("e-bareme", JSON.stringify(arr))
            $("baremeTotal").innerHTML = "Total du barème : <b>" + (total % 1 ? total.toFixed(1) : total) + "</b> point(s)"
        }
        $("baremeAdd").addEventListener("click", function () {
            baremeItems.push({ critere: "", points: "" })
            renderBareme()
            var last = document.querySelector("[data-bc='" + (baremeItems.length - 1) + "']")
            if (last) last.focus()
        })

        /* ---------- Validation à la soumission ---------- */
        function collectConsignes() {
            var arr = consignesItems.map(function (t) { return t.trim() }).filter(Boolean)
            if (!arr.length) { fieldMsg("consignesMsg", "Ajoutez au moins une consigne."); return null }
            fieldMsg("consignesMsg", "")
            return arr
        }
        function collectBareme() {
            var arr = [], err = ""
            baremeItems.forEach(function (it, i) {
                var crit = (it.critere || "").trim()
                var pts = parseFloat(it.points)
                if (!crit && (it.points === "" || isNaN(pts))) return // ligne entièrement vide : ignorée
                if (!crit) { err = "Ligne " + (i + 1) + " : renseignez le libellé du critère."; return }
                if (isNaN(pts) || pts < 0) { err = "Ligne " + (i + 1) + " : les points doivent être un nombre ≥ 0."; return }
                arr.push({ critere: crit, points: pts })
            })
            if (err) { fieldMsg("baremeMsg", err); return null }
            if (!arr.length) { fieldMsg("baremeMsg", "Ajoutez au moins un critère de notation."); return null }
            fieldMsg("baremeMsg", "")
            return arr
        }

        /* ============================================================
     Documents joints
     ============================================================ */
        /* Types acceptés : extensions + signatures MIME images */
        var DOCS_OK = ["pdf", "docx", "xlsx", "pptx", "md"]
        var IMG_RE = /^image\/(png|jpe?g|gif|bmp|webp|svg\+xml|tiff?)$/i
        function docAccepte(file) {
            var ext = (file.name.split(".").pop() || "").toLowerCase()
            if (DOCS_OK.indexOf(ext) !== -1) return true
            if (IMG_RE.test(file.type)) return true
            return false
        }
        function fmtSize(o) {
            if (o < 1024) return o + " o"
            if (o < 1048576) return (o / 1024).toFixed(1) + " Ko"
            return (o / 1048576).toFixed(1) + " Mo"
        }
        function renderDocuments() {
            $("docList").innerHTML = epreuveDocs.map(function (d, i) {
                return "<div class=\"fl-doc-item\">📄 <span>" + escHtml(d.name) + "</span>" +
        "<span class=\"fl-doc-meta\">" + fmtSize(d.size) + "</span>" +
        "<button type=\"button\" class=\"fl-doc-remove\" data-i=\"" + i + "\" title=\"Retirer\">✕</button></div>"
            }).join("")
            Array.prototype.forEach.call(document.querySelectorAll(".fl-doc-remove"), function (b) {
                b.addEventListener("click", function () {
                    epreuveDocs.splice(Number(b.getAttribute("data-i")), 1)
                    renderDocuments()
                })
            })
        }
        $("e-documents").addEventListener("change", function () {
            var refuses = []
            Array.prototype.forEach.call(this.files, function (f) {
                if (docAccepte(f)) epreuveDocs.push(f)
                else refuses.push(f.name)
            })
            this.value = ""
            renderDocuments()
            if (refuses.length) {
                alert("Type de fichier non autorisé :\n" + refuses.join("\n") +
        "\n\nFormats acceptés : PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), Markdown (.md) et images.")
            }
        })

        /* ============================================================
     Soumission de l'épreuve
     ============================================================ */
        $("e-submit").addEventListener("click", function () {
            var libelle = $("e-libelle").value.trim()
            var sujetMd = $("e-sujet-md").value
            var consignes = collectConsignes()
            var bareme = collectBareme()

            if (!libelle) { alert("Le libellé de l'épreuve est obligatoire."); return }
            if (!sujetMd) { alert("Le sujet est obligatoire."); return }
            if (consignes === null) return
            if (bareme === null) return

            var epreuve = {
                entity: "cours_epreuve",
                transaction: "add",
                method: "POST",
                program_module_id: programModuleId,
                libelle: libelle,
                sujet_md: sujetMd,
                consignes: consignes,
                bareme: bareme,
                documents: epreuveDocs.map(function (d, i) {
                    return { field: "documents[" + i + "]", name: d.name, size: d.size, type: d.type }
                })
            }

            /* Construction du body en multipart/formData :
       - champ unique documents (JSON texte) pour les métadonnées
       - un champ documents[i] par fichier binaire (nom original conservé) */
            var fd = new FormData()
            fd.append("documents", JSON.stringify(epreuve.documents))
            epreuveDocs.forEach(function (f, i) {
                fd.append("documents[" + i + "]", f, f.name)
            })
            delete epreuve.documents
            fd.append("data", JSON.stringify(epreuve))
            // Alternative : champ par champ si votre API attend un JSON global :
            // fd.append("data", JSON.stringify(epreuve)); puis les fichiers en documents[0..n].

            /* Envoi réel (schéma des entités fl du BO) : décommentez.
       Ne PAS définir Content-Type manuellement : le navigateur pose
       lui-même le boundary multipart. */
            /*
    fetch("/core/v1", { method: "POST", body: fd })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function () {
        $("flForm-messageOk").classList.add("show");
        setTimeout(closeModal, 1200);
      })
      .catch(function (e) {
        alert("Enregistrement impossible : " + e.message);
      });
    return;
    */

            // Mode démo : feedback identique au BO (« Demande enregistrée »)
            console.log("FormData épreuve :", epreuve, epreuveDocs)
            $("flForm-messageOk").classList.add("show")
            setTimeout(closeModal, 1200)
        })

        /* ============================================================
     Initialisation (état vierge à chaque ouverture de la modale)
     ============================================================ */
        setValue("e-libelle", "")
        $("sujetEditor").innerHTML = ""
        syncSujet()
        renderConsignes()
        renderBareme()
        renderDocuments()
        fieldMsg("consignesMsg", "")
        fieldMsg("baremeMsg", "")
        $("flForm-messageOk").classList.remove("show")
    }
}
