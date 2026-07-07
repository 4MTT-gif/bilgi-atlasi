/* Bilgi Atlası — Türkiye Haritası: Şehir Bulma
   Oyun akışı: rastgele bir il sorulur, kullanıcı haritadan bulmaya çalışır.
   Doğru → il yeşil boyanır. 3 yanlış deneme → il kırmızı boyanır ve sıradaki ile geçilir. */

(function () {
  "use strict";

  // ---------- Ekran yönetimi ----------
  const screens = {
    menu: document.getElementById("menu-screen"),
    game: document.getElementById("game-screen"),
    result: document.getElementById("result-screen"),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  // ---------- Harita kurulumu ----------
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = window.TURKIYE_SVG;
  const svg = mapContainer.querySelector("svg");

  // İller plaka koduna göre gruplanır (İstanbul iki parçadır: Avrupa + Asya)
  const provinces = new Map(); // plakakodu -> { name, groups: [g, ...] }
  svg.querySelectorAll("g[data-iladi]").forEach(g => {
    const pk = g.dataset.plakakodu;
    if (!pk || pk === "00") return; // Kıbrıs oyun dışı
    const name = g.dataset.iladi.replace(/\s*\(.*\)$/, "");
    if (!provinces.has(pk)) provinces.set(pk, { name, groups: [] });
    provinces.get(pk).groups.push(g);
  });

  const TOTAL = provinces.size;

  // ---------- Oyun durumu ----------
  const state = {
    order: [],       // sorulacak plaka kodları (karışık)
    index: 0,        // sıradaki soru
    score: 0,
    correct: 0,
    missed: [],      // bilinemeyen il adları
    tries: 3,
    locked: false,   // geçiş animasyonu sırasında tıklama kilidi
  };

  // ---------- Arayüz elemanları ----------
  const el = {
    targetName: document.getElementById("target-name"),
    score: document.getElementById("stat-score"),
    correct: document.getElementById("stat-correct"),
    wrong: document.getElementById("stat-wrong"),
    progress: document.getElementById("stat-progress"),
    tries: document.getElementById("stat-tries"),
    feedback: document.getElementById("feedback-bar"),
    tooltip: document.getElementById("tooltip"),
    mapWrap: document.getElementById("map-wrap"),
  };

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function currentTarget() {
    return provinces.get(state.order[state.index]);
  }

  function updateHud() {
    el.score.textContent = "⭐ " + state.score;
    el.correct.textContent = "✅ " + state.correct;
    el.wrong.textContent = "❌ " + state.missed.length;
    el.progress.textContent = state.index + "/" + TOTAL;
    el.tries.textContent = "💙".repeat(state.tries) + "🖤".repeat(3 - state.tries);
  }

  function setFeedback(text, cls) {
    el.feedback.textContent = text;
    el.feedback.className = "feedback-bar" + (cls ? " " + cls : "");
  }

  function showTooltip(x, y, text, cls) {
    const rect = el.mapWrap.getBoundingClientRect();
    el.tooltip.textContent = text;
    el.tooltip.className = "tooltip" + (cls ? " " + cls : "");
    el.tooltip.style.left = (x - rect.left) + "px";
    el.tooltip.style.top = (y - rect.top) + "px";
    clearTimeout(showTooltip._t);
    showTooltip._t = setTimeout(() => el.tooltip.classList.add("hidden"), 1600);
  }

  // ---------- Oyun akışı ----------
  function startGame() {
    state.order = shuffle([...provinces.keys()]);
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.missed = [];
    state.tries = 3;
    state.locked = false;
    provinces.forEach(p => p.groups.forEach(g =>
      g.classList.remove("correct", "missed", "flash-wrong", "reveal", "done")));
    resetView();
    nextQuestion(true);
    showScreen("game");
  }

  function nextQuestion(first) {
    if (!first) state.index++;
    state.tries = 3;
    if (state.index >= TOTAL) { endGame(); return; }
    el.targetName.textContent = currentTarget().name;
    setFeedback("Haritadan bir il seç");
    updateHud();
    state.locked = false;
  }

  function handleGuess(pk, x, y) {
    if (state.locked) return;
    const clicked = provinces.get(pk);
    const target = currentTarget();

    if (pk === state.order[state.index]) {
      // Doğru! Kalan deneme sayısına göre puan
      const points = [0, 30, 60, 100][state.tries];
      state.score += points;
      state.correct++;
      target.groups.forEach(g => g.classList.add("correct", "done"));
      showTooltip(x, y, target.name + " ✔ +" + points, "ok");
      setFeedback("Doğru! " + target.name + " (+" + points + " puan)", "ok");
      state.locked = true;
      setTimeout(() => nextQuestion(), 900);
    } else {
      // Yanlış il seçildi
      state.tries--;
      showTooltip(x, y, clicked.name + " ✘", "bad");
      clicked.groups.forEach(g => g.classList.add("flash-wrong"));
      setTimeout(() => clicked.groups.forEach(g => g.classList.remove("flash-wrong")), 800);

      if (state.tries <= 0) {
        // Hak bitti: hedef il kırmızı işaretlenir
        state.missed.push(target.name);
        target.groups.forEach(g => g.classList.add("missed", "done", "reveal"));
        setTimeout(() => target.groups.forEach(g => g.classList.remove("reveal")), 1600);
        setFeedback("Olmadı! Doğru cevap: " + target.name + " (kırmızı bölge)", "bad");
        state.locked = true;
        updateHud();
        setTimeout(() => nextQuestion(), 1800);
      } else {
        setFeedback("Yanlış: " + clicked.name + " — tekrar dene! (" + state.tries + " hak kaldı)", "bad");
        updateHud();
      }
    }
  }

  function endGame() {
    document.getElementById("result-score").textContent = state.score;
    document.getElementById("result-correct").textContent = state.correct;
    document.getElementById("result-wrong").textContent = state.missed.length;
    const missedBox = document.getElementById("result-missed");
    if (state.missed.length > 0) {
      missedBox.classList.remove("hidden");
      document.getElementById("missed-list").textContent = state.missed.join(", ");
    } else {
      missedBox.classList.add("hidden");
    }
    showScreen("result");
  }

  // ---------- Harita etkileşimi: tıklama ----------
  let downPos = null;

  svg.addEventListener("pointerdown", e => {
    downPos = { x: e.clientX, y: e.clientY };
  });

  svg.addEventListener("click", e => {
    // Sürükleme sonrası tıklamayı yok say
    if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
    const g = e.target.closest("g[data-iladi]");
    if (!g) return;
    const pk = g.dataset.plakakodu;
    if (!pk || pk === "00") return;
    if (g.classList.contains("done")) {
      const p = provinces.get(pk);
      showTooltip(e.clientX, e.clientY, p.name + " (tamamlandı)");
      return;
    }
    handleGuess(pk, e.clientX, e.clientY);
  });

  // ---------- Harita etkileşimi: zoom ve kaydırma ----------
  const baseVB = svg.getAttribute("viewBox").split(" ").map(Number); // [x y w h]
  let vb = [...baseVB];

  function applyVB() {
    svg.setAttribute("viewBox", vb.join(" "));
  }

  function resetView() {
    vb = [...baseVB];
    applyVB();
  }

  function zoomAt(factor, cx, cy) {
    // cx, cy: ekran koordinatı → SVG koordinatına çevir
    const rect = svg.getBoundingClientRect();
    const sx = vb[0] + ((cx - rect.left) / rect.width) * vb[2];
    const sy = vb[1] + ((cy - rect.top) / rect.height) * vb[3];
    const newW = Math.min(baseVB[2] * 1.2, Math.max(baseVB[2] / 8, vb[2] / factor));
    const scale = newW / vb[2];
    const newH = vb[3] * scale;
    vb = [sx - (sx - vb[0]) * scale, sy - (sy - vb[1]) * scale, newW, newH];
    applyVB();
  }

  el.mapWrap.addEventListener("wheel", e => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY);
  }, { passive: false });

  document.getElementById("zoom-in").addEventListener("click", () => {
    const r = svg.getBoundingClientRect();
    zoomAt(1.35, r.left + r.width / 2, r.top + r.height / 2);
  });
  document.getElementById("zoom-out").addEventListener("click", () => {
    const r = svg.getBoundingClientRect();
    zoomAt(1 / 1.35, r.left + r.width / 2, r.top + r.height / 2);
  });
  document.getElementById("zoom-reset").addEventListener("click", resetView);

  // Sürükleme + iki parmakla yakınlaştırma (pointer events)
  const pointers = new Map();
  let lastPinchDist = 0;

  el.mapWrap.addEventListener("pointerdown", e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      lastPinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    mapContainer.classList.add("dragging");
  });

  el.mapWrap.addEventListener("pointermove", e => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);

    if (pointers.size === 1) {
      // Kaydırma
      const rect = svg.getBoundingClientRect();
      vb[0] -= (e.clientX - prev.x) * (vb[2] / rect.width);
      vb[1] -= (e.clientY - prev.y) * (vb[3] / rect.height);
      applyVB();
    } else if (pointers.size === 2) {
      // İki parmak: pinch zoom
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinchDist > 0) {
        zoomAt(dist / lastPinchDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
      }
      lastPinchDist = dist;
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });

  function releasePointer(e) {
    pointers.delete(e.pointerId);
    lastPinchDist = 0;
    if (pointers.size === 0) mapContainer.classList.remove("dragging");
  }
  el.mapWrap.addEventListener("pointerup", releasePointer);
  el.mapWrap.addEventListener("pointercancel", releasePointer);
  el.mapWrap.addEventListener("pointerleave", releasePointer);

  // ---------- Buton bağlantıları ----------
  document.getElementById("btn-harita-oyunu").addEventListener("click", startGame);
  document.getElementById("btn-again").addEventListener("click", startGame);
  document.getElementById("btn-menu").addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-result-menu").addEventListener("click", () => showScreen("menu"));
})();
