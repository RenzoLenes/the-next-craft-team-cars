window.FleepcareViz = (function () {
  var canvas;
  var ctx;
  var particles = [];
  var raf = 0;
  var tension = 0.35;
  var targetTension = 0.35;
  var glitch = 0;
  var reduced = false;

  function resize() {
    if (!canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(n) {
    particles = [];
    var w = window.innerWidth;
    var h = window.innerHeight;
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.6 + Math.random() * 2.2,
        a: 0.15 + Math.random() * 0.35,
      });
    }
  }

  function setScore(score) {
    // Low score = high tension
    targetTension = 1 - Math.max(0, Math.min(100, score)) / 100;
    glitch = 1;
  }

  function pulse(amount) {
    targetTension = Math.min(1, targetTension + (amount || 0.25));
    glitch = Math.max(glitch, 0.7);
  }

  function tick() {
    if (!ctx || !canvas) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    tension += (targetTension - tension) * 0.04;
    glitch *= 0.92;

    ctx.clearRect(0, 0, w, h);

    // Atmosphere wash
    var g = ctx.createRadialGradient(
      w * 0.5,
      h * 0.2,
      40,
      w * 0.5,
      h * 0.4,
      w * 0.7
    );
    var agitate = 0.04 + tension * 0.12;
    g.addColorStop(0, "rgba(45, 155, 122," + (0.06 + tension * 0.1) + ")");
    g.addColorStop(0.45, "rgba(26, 107, 122," + (0.04 + tension * 0.06) + ")");
    g.addColorStop(1, "rgba(12, 31, 46, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    var speed = 0.35 + tension * 2.8;
    particles.forEach(function (p) {
      p.vx += (Math.random() - 0.5) * agitate;
      p.vy += (Math.random() - 0.5) * agitate;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx * speed;
      p.y += p.vy * speed;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (1 + tension), 0, Math.PI * 2);
      ctx.fillStyle =
        "rgba(" +
        (12 + Math.floor(tension * 40)) +
        "," +
        (31 + Math.floor(tension * 80)) +
        "," +
        (46 + Math.floor(tension * 40)) +
        "," +
        (p.a + tension * 0.25) +
        ")";
      ctx.fill();
    });

    // Glitch scanlines on harsh verdicts
    if (glitch > 0.08) {
      ctx.globalAlpha = glitch * 0.35;
      for (var i = 0; i < 6; i++) {
        var y = Math.random() * h;
        ctx.fillStyle = "rgba(45, 155, 122, 0.35)";
        ctx.fillRect(0, y, w, 1 + Math.random() * 2);
      }
      ctx.globalAlpha = 1;
    }

    if (!reduced) {
      raf = requestAnimationFrame(tick);
    }
  }

  function init(canvasEl) {
    canvas = canvasEl;
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize();
    spawn(reduced ? 24 : 70);
    window.addEventListener("resize", function () {
      resize();
    });
    if (!reduced) {
      raf = requestAnimationFrame(tick);
    } else {
      tick();
    }
  }

  function destroy() {
    if (raf) cancelAnimationFrame(raf);
  }

  return {
    init: init,
    setScore: setScore,
    pulse: pulse,
    destroy: destroy,
  };
})();
