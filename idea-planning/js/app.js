(function () {
  var QA_ORDER = ["what", "why", "who", "where", "when", "how", "how-much"];
  var STORAGE_KEY = "fleepcare-jury-v2";
  var baseContent = null;
  var content = null;
  var verdicts = {};
  var editingId = null;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatAnswer(text) {
    var escaped = escapeHtml(text);
    return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadBase() {
    var raw = window.FleepcareContent;
    if (!raw) throw new Error("No se encontró window.FleepcareContent.");
    if (!raw.hero || !raw.meta) {
      throw new Error("Faltan content/hero.js o content/meta.js.");
    }
    if (!raw.notes) throw new Error("Falta content/notes.js");
    QA_ORDER.forEach(function (id) {
      if (!raw[id]) throw new Error("Falta content/" + id + ".js");
    });
    return deepClone(raw);
  }

  function readStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStorage() {
    var payload = {
      hero: content.hero,
      meta: content.meta,
      notes: content.notes,
      qa: {},
      verdicts: verdicts,
    };
    QA_ORDER.forEach(function (id) {
      payload.qa[id] = {
        question: content[id].question,
        answer: content[id].answer,
        en: content[id].en,
        id: content[id].id,
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function mergeWithStorage(base) {
    var stored = readStorage();
    var merged = deepClone(base);
    if (!stored) return merged;
    if (stored.hero) {
      Object.assign(merged.hero, stored.hero);
    }
    if (stored.meta) {
      Object.assign(merged.meta, stored.meta);
    }
    if (stored.notes) {
      Object.assign(merged.notes, stored.notes);
    }
    if (stored.qa) {
      QA_ORDER.forEach(function (id) {
        if (stored.qa[id]) {
          if (stored.qa[id].answer != null) merged[id].answer = stored.qa[id].answer;
          if (stored.qa[id].question != null) {
            merged[id].question = stored.qa[id].question;
          }
        }
      });
    }
    if (stored.verdicts) {
      verdicts = stored.verdicts;
    }
    return merged;
  }

  function renderBrand(brand, accent) {
    if (accent && brand.endsWith(accent)) {
      var base = brand.slice(0, -accent.length);
      return escapeHtml(base) + "<span>" + escapeHtml(accent) + "</span>";
    }
    return escapeHtml(brand);
  }

  function scoreClass(score) {
    if (score >= 75) return "score-high";
    if (score >= 45) return "score-mid";
    return "score-low";
  }

  function renderHero() {
    var hero = content.hero;
    document.getElementById("hero-brand").innerHTML = renderBrand(
      hero.brand,
      hero.brandAccent
    );
    document.getElementById("hero-headline").textContent = hero.headline;
    document.getElementById("hero-lead").textContent = hero.lead;
  }

  function renderMeta() {
    document.getElementById("section-label").textContent =
      content.meta.sectionLabel || "LA CÁMARA";
    document.getElementById("site-footer").textContent =
      content.meta.footer || "Cámara del Jurado · Fleepcare";
  }

  function renderVerdictPanel(id) {
    var v = verdicts[id];
    if (!v) {
      return '<div class="verdict verdict-empty">Aún sin veredicto. Invoca al jurado.</div>';
    }
    var bullets = v.critiques
      .map(function (c) {
        return (
          '<li><span class="persona">' +
          escapeHtml(c.persona) +
          "</span> " +
          escapeHtml(c.text) +
          "</li>"
        );
      })
      .join("");
    return (
      '<div class="verdict ' +
      scoreClass(v.score) +
      '">' +
      '<div class="verdict-top">' +
      '<span class="verdict-score">' +
      v.score +
      "</span>" +
      '<div class="verdict-meter"><i style="width:' +
      v.score +
      '%"></i></div>' +
      '<span class="verdict-label">' +
      escapeHtml(v.label) +
      "</span>" +
      "</div>" +
      "<ul class=\"verdict-list\">" +
      bullets +
      "</ul>" +
      '<p class="next-round"><strong>Próximo round:</strong> ' +
      escapeHtml(v.nextRound) +
      "</p>" +
      "</div>"
    );
  }

  function renderEditPanel(id) {
    if (editingId !== id) return "";
    var item = content[id];
    return (
      '<div class="edit-panel">' +
      '<label class="edit-label">Reescribe para sobrevivir</label>' +
      '<textarea class="edit-area" data-edit-answer rows="5">' +
      escapeHtml(item.answer) +
      "</textarea>" +
      '<div class="edit-actions">' +
      '<button type="button" class="btn btn-primary" data-action="save-edit">Guardar</button>' +
      '<button type="button" class="btn" data-action="cancel-edit">Cancelar</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderQa() {
    var list = document.getElementById("qa-list");
    list.innerHTML = QA_ORDER.map(function (id) {
      var item = content[id];
      var shake =
        verdicts[id] && verdicts[id].score < 45 ? " is-shaking" : "";
      return (
        '<article class="qa-item' +
        shake +
        '" data-id="' +
        escapeHtml(id) +
        '">' +
        '<p class="qa-en">' +
        escapeHtml(item.en) +
        "</p>" +
        '<h2 class="qa-q">' +
        escapeHtml(item.question) +
        "</h2>" +
        '<p class="qa-a">' +
        formatAnswer(item.answer) +
        "</p>" +
        renderVerdictPanel(id) +
        '<div class="qa-actions">' +
        '<button type="button" class="btn btn-summon" data-action="summon">Invocar jurado</button>' +
        '<button type="button" class="btn" data-action="rewrite">Reescribir</button>' +
        '<button type="button" class="btn" data-action="export-one">Descargar .js</button>' +
        "</div>" +
        renderEditPanel(id) +
        "</article>"
      );
    }).join("");
  }

  function renderNotes() {
    var panel = document.getElementById("notes-panel");
    if (!panel || !content.notes) return;
    var notes = content.notes;
    var features = (notes.features || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    var limits = (notes.limits || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    panel.innerHTML =
      '<p class="section-label">' +
      escapeHtml(notes.title || "Anotaciones") +
      "</p>" +
      '<div class="notes-grid">' +
      '<div class="notes-block">' +
      '<h2 class="notes-heading">' +
      escapeHtml(notes.featuresLabel || "Funcionalidades") +
      "</h2>" +
      '<ul class="notes-list">' +
      features +
      "</ul>" +
      "</div>" +
      '<div class="notes-block">' +
      '<h2 class="notes-heading">' +
      escapeHtml(notes.limitsLabel || "Limitaciones") +
      "</h2>" +
      '<ul class="notes-list notes-list-limits">' +
      limits +
      "</ul>" +
      "</div>" +
      "</div>";
  }

  function initMotion() {
    var items = document.querySelectorAll(".qa-item, .notes-panel");
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach(function (el, i) {
      el.style.transitionDelay = i * 0.05 + "s";
      observer.observe(el);
    });
  }

  function serializeJsFile(key, value) {
    var body = JSON.stringify(value, null, 2);
    if (key === "how-much") {
      return (
        "window.FleepcareContent = window.FleepcareContent || {};\n" +
        'window.FleepcareContent["how-much"] = ' +
        body +
        ";\n"
      );
    }
    return (
      "window.FleepcareContent = window.FleepcareContent || {};\n" +
      "window.FleepcareContent." +
      key +
      " = " +
      body +
      ";\n"
    );
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 500);
  }

  function exportOne(id) {
    var payload = {
      id: content[id].id,
      en: content[id].en,
      question: content[id].question,
      answer: content[id].answer,
    };
    downloadText(id + ".js", serializeJsFile(id, payload));
  }

  function exportAll() {
    var files = [
      { name: "hero.js", body: serializeJsFile("hero", content.hero) },
      { name: "meta.js", body: serializeJsFile("meta", content.meta) },
      { name: "notes.js", body: serializeJsFile("notes", content.notes) },
    ];
    QA_ORDER.forEach(function (id) {
      files.push({
        name: id + ".js",
        body: serializeJsFile(id, {
          id: content[id].id,
          en: content[id].en,
          question: content[id].question,
          answer: content[id].answer,
        }),
      });
    });
    files.forEach(function (file, i) {
      setTimeout(function () {
        downloadText(file.name, file.body);
      }, i * 180);
    });
  }

  function averageScore() {
    var ids = Object.keys(verdicts);
    if (!ids.length) return 55;
    var sum = 0;
    ids.forEach(function (id) {
      sum += verdicts[id].score;
    });
    return sum / ids.length;
  }

  function refresh() {
    renderHero();
    renderMeta();
    renderQa();
    renderNotes();
    initMotion();
    if (window.FleepcareViz) {
      window.FleepcareViz.setScore(averageScore());
    }
  }

  function summon(id) {
    if (!window.FleepcareJury) return;
    var verdict = window.FleepcareJury.judge(content[id].answer, id);
    verdicts[id] = verdict;
    writeStorage();
    if (window.FleepcareViz) {
      window.FleepcareViz.setScore(verdict.score);
      window.FleepcareViz.pulse(verdict.score < 45 ? 0.45 : 0.15);
    }
    window.FleepcareJury.speak(verdict);
    refresh();
    var el = document.querySelector('.qa-item[data-id="' + id + '"]');
    if (el) {
      el.classList.add("verdict-flash");
      setTimeout(function () {
        el.classList.remove("verdict-flash");
      }, 700);
    }
  }

  function onListClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var article = btn.closest(".qa-item");
    if (!article) return;
    var id = article.getAttribute("data-id");
    var action = btn.getAttribute("data-action");

    if (action === "summon") {
      summon(id);
    } else if (action === "rewrite") {
      editingId = id;
      refresh();
      var area = article.querySelector("[data-edit-answer]") ||
        document.querySelector(
          '.qa-item[data-id="' + id + '"] [data-edit-answer]'
        );
      if (area) area.focus();
    } else if (action === "export-one") {
      exportOne(id);
    } else if (action === "cancel-edit") {
      editingId = null;
      refresh();
    } else if (action === "save-edit") {
      var ta = article.querySelector("[data-edit-answer]");
      if (!ta) return;
      content[id].answer = ta.value.trim();
      editingId = null;
      writeStorage();
      if (window.FleepcareViz) window.FleepcareViz.pulse(0.2);
      // Re-judge silently after rewrite if already judged
      if (verdicts[id] && window.FleepcareJury) {
        verdicts[id] = window.FleepcareJury.judge(content[id].answer, id);
        writeStorage();
      }
      refresh();
    }
  }

  function bindGlobals() {
    document.getElementById("btn-reset").addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      content = deepClone(baseContent);
      verdicts = {};
      editingId = null;
      if (window.FleepcareViz) window.FleepcareViz.setScore(55);
      refresh();
    });

    document.getElementById("btn-export-all").addEventListener("click", function () {
      exportAll();
    });

    var muteBtn = document.getElementById("btn-mute");
    muteBtn.addEventListener("click", function () {
      if (!window.FleepcareJury) return;
      var next = !window.FleepcareJury.isMuted();
      window.FleepcareJury.setMuted(next);
      muteBtn.textContent = next ? "Voz: off" : "Voz: on";
      muteBtn.setAttribute("aria-pressed", next ? "true" : "false");
    });

    document.getElementById("qa-list").addEventListener("click", onListClick);
  }

  function showError(message) {
    var main = document.querySelector("main");
    main.innerHTML =
      '<p class="section-label">Error</p><p class="qa-a">' +
      escapeHtml(message) +
      "</p>";
  }

  function init() {
    try {
      baseContent = loadBase();
      content = mergeWithStorage(baseContent);
      // Chamber label override if still old copy
      if (
        !content.meta.sectionLabel ||
        content.meta.sectionLabel === "Análisis 5W2H"
      ) {
        content.meta.sectionLabel = "LA CÁMARA · 5W2H";
      }
      if (window.FleepcareViz) {
        window.FleepcareViz.init(document.getElementById("chamber-canvas"));
        window.FleepcareViz.setScore(averageScore());
      }
      bindGlobals();
      refresh();
    } catch (err) {
      console.error(err);
      showError(err.message);
    }
  }

  init();
})();
