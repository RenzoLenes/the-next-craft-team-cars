window.FleepcareJury = (function () {
  var PERSONAS = [
    {
      id: "esceptico",
      name: "El Escéptico",
      voiceRate: 1.05,
      templates: [
        "«{snippet}» — eso es marketing, no una tesis. ¿Qué falla concreta predices que un taller no vea ya?",
        "Suena a otro dashboard OBD con lipstick. ¿Por qué alguien apagaría Torque / Car Scanner por esto?",
        "Si el claim es «predecir fallas», ¿dónde está el ground truth? Sin datos etiquetados, es adivinanza cara.",
      ],
    },
    {
      id: "contadora",
      name: "La Contadora",
      voiceRate: 0.95,
      templates: [
        "Sin CAC, LTV ni ticket claro, «$5–15/mes» es un deseo. ¿Quién paga y cada cuánto?",
        "El dongle es commodity. El margen está en la suscripción — ¿o en el upsell al taller? Elige uno y mátalo.",
        "«Evitar una reparación mayor» no es unit economics. Dame un escenario con números o cállate el ROI.",
      ],
    },
    {
      id: "maker",
      name: "El Maker",
      voiceRate: 1.1,
      templates: [
        "OBD-II no es magia: PIDs varían por fabricante. ¿Soportas qué marcas, qué DTCs, qué frecuencia de muestreo?",
        "Telemetría → nube → alerta. ¿Edge offline? ¿Latencia? ¿Batería del dongle? El stack aún es un slide.",
        "Si no defines el pipeline de features (temp, misfire, voltaje) el «modelo predictivo» es un if-else disfrazado.",
      ],
    },
  ];

  var SOFT = [
    "innovador",
    "fácil",
    "simple",
    "potente",
    "único",
    "revolucionario",
    "seamless",
    "inteligente",
    "mejor",
    "óptimo",
  ];

  var TROPES = [
    "iot",
    "saas",
    "plataforma",
    "ecosistema",
    "dashboard",
    "app",
    "nube",
    "ai",
    "ia",
    "predictivo",
  ];

  var NEXT_ROUNDS = {
    what: "En una frase: ¿qué NO eres (vs. lectores OBD genéricos)?",
    why: "Nombra el dolor en dólares o minutos, no en adjetivos.",
    who: "¿Persona early adopter concreta (edad, auto, hábito) o solo «dueños»?",
    where: "¿Primera geo / canal de distribución del dongle?",
    when: "¿Qué señal dispara la primera alerta útil en la semana 1?",
    how: "Describe el flujo de un solo PID hasta una alerta con acción.",
    "how-much": "Escribe un P&L de servilleta: costo dongle + margen mes 12.",
  };

  var muted = false;

  function setMuted(value) {
    muted = !!value;
    if (muted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  function isMuted() {
    return muted;
  }

  function pick(arr, seed) {
    return arr[Math.abs(seed) % arr.length];
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  function stripMarkdown(text) {
    return String(text || "").replace(/\*\*/g, "").trim();
  }

  function snippetFrom(text, seed) {
    var clean = stripMarkdown(text).replace(/\s+/g, " ");
    if (clean.length < 12) return clean || "…(vacío)";
    var words = clean.split(" ");
    if (words.length <= 6) return clean;
    var start = Math.abs(seed) % Math.max(1, words.length - 5);
    return words.slice(start, start + 5).join(" ") + "…";
  }

  function analyze(text, blockId) {
    var raw = stripMarkdown(text);
    var lower = raw.toLowerCase();
    var words = raw.split(/\s+/).filter(Boolean);
    var len = words.length;
    var hasNumbers = /\d/.test(raw);
    var hasBecause = /porque|ya que|debido|para que|así|de modo que/i.test(raw);
    var softHits = SOFT.filter(function (w) {
      return lower.indexOf(w) !== -1;
    });
    var tropeHits = TROPES.filter(function (w) {
      return lower.indexOf(w) !== -1;
    });
    var hasObd = /obd/i.test(raw);
    var hasMoney = /\$|usd|precio|costo|suscrip/i.test(raw);

    var score = 55;
    if (len < 18) score -= 22;
    else if (len < 35) score -= 10;
    else if (len > 55 && len < 120) score += 8;
    else if (len >= 120) score += 4;

    if (hasNumbers) score += 12;
    if (hasBecause) score += 8;
    if (hasObd && blockId !== "what") score += 3;
    if (hasMoney && (blockId === "how-much" || blockId === "why")) score += 10;

    score -= softHits.length * 7;
    score -= Math.min(tropeHits.length, 4) * 4;
    if (!hasNumbers && (blockId === "how-much" || blockId === "why")) score -= 15;
    if (len < 8) score = Math.min(score, 18);

    score = Math.max(4, Math.min(96, score));

    return {
      len: len,
      hasNumbers: hasNumbers,
      hasBecause: hasBecause,
      softHits: softHits,
      tropeHits: tropeHits,
      score: score,
    };
  }

  function buildCritiques(text, blockId, analysis) {
    var seed = hash(stripMarkdown(text) + "|" + blockId);
    var snip = snippetFrom(text, seed);
    var critiques = [];

    PERSONAS.forEach(function (p, i) {
      var t = pick(p.templates, seed + i * 17);
      critiques.push({
        persona: p.name,
        personaId: p.id,
        text: t.replace("{snippet}", snip),
      });
    });

    if (analysis.softHits.length) {
      critiques[0].text =
        "Palabras blandas detectadas («" +
        analysis.softHits.slice(0, 2).join("», «") +
        "»). Queman credibilidad. Cámbialas por hechos.";
    }
    if (!analysis.hasNumbers && blockId === "how-much") {
      critiques[1].text =
        "Cero cifras. Un how-much sin números es fanfic financiero.";
    }
    if (analysis.len < 20) {
      critiques[2].text =
        "Demasiado corto. El jurado no puede juzgar vapor. Expande o confiesa que aún no sabes.";
    }

    return critiques;
  }

  function judge(text, blockId) {
    var analysis = analyze(text, blockId);
    var critiques = buildCritiques(text, blockId, analysis);
    var harshest = critiques.reduce(function (a, b) {
      return b.text.length > a.text.length ? b : a;
    });

    return {
      score: analysis.score,
      analysis: analysis,
      critiques: critiques,
      harshest: harshest,
      nextRound: NEXT_ROUNDS[blockId] || "¿Qué evidencia nueva cambiaría este veredicto?",
      label:
        analysis.score >= 75
          ? "SOBREVIVE — por ahora"
          : analysis.score >= 45
            ? "HERIDO — reescribe"
            : "DESTRUIDO — vuelve a pensar",
    };
  }

  function speak(verdict) {
    if (muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var line =
      verdict.harshest.persona +
      ". Veredicto " +
      verdict.score +
      ". " +
      verdict.harshest.text;
    var u = new SpeechSynthesisUtterance(line);
    u.lang = "es-ES";
    u.rate = 1.02;
    u.pitch = verdict.score < 40 ? 0.85 : 1;
    window.speechSynthesis.speak(u);
  }

  return {
    PERSONAS: PERSONAS,
    judge: judge,
    speak: speak,
    setMuted: setMuted,
    isMuted: isMuted,
  };
})();
