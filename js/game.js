/* Bilgi Atlası — Coğrafya motoru
   İçerik js/data.js (window.GEO) içinde. Üç etkileşim türü: province / group / features.
   İl modu 3 deneme (100/60/30); diğer tüm modlar tek deneme (100 puan). */

(function () {
  "use strict";

  const GEO = window.GEO;
  const SVGNS = "http://www.w3.org/2000/svg";

  // ---------- Ekran yönetimi ----------
  const screens = {
    menu: document.getElementById("menu-screen"),
    cografya: document.getElementById("cografya-screen"),
    game: document.getElementById("game-screen"),
    result: document.getElementById("result-screen"),
  };
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  // ---------- Harita kurulumu ----------
  const mapWrap = document.getElementById("map-wrap");
  const mapContainer = document.getElementById("map-container");
  mapContainer.innerHTML = window.TURKIYE_SVG;
  const svg = mapContainer.querySelector("svg");

  // İller plaka koduna göre gruplanır (İstanbul iki parçadır: Avrupa + Asya)
  const provinces = new Map(); // plaka -> { name, groups:[g,...], center:{x,y}|null }
  svg.querySelectorAll("g[data-iladi]").forEach(g => {
    const pk = g.dataset.plakakodu;
    if (!pk || pk === "00") return; // Kıbrıs oyun dışı
    const name = g.dataset.iladi.replace(/\s*\(.*\)$/, "");
    if (!provinces.has(pk)) provinces.set(pk, { name, groups: [], center: null });
    provinces.get(pk).groups.push(g);
  });

  // Bir ilin merkezini (bbox ortası) SVG koordinatında hesapla
  function center(pk) {
    const p = provinces.get(pk);
    if (!p) return { x: 0, y: 0 };
    if (p.center) return p.center;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    p.groups.forEach(g => {
      const b = g.getBBox();
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
      x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    });
    p.center = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    return p.center;
  }

  // ---------- Coğrafya alt menüsü (kategorili) ----------
  const container = document.getElementById("topic-container");
  GEO.categories.forEach(cat => {
    const section = document.createElement("div");
    section.className = "cat-section";
    const h = document.createElement("h3");
    h.className = "cat-title";
    h.textContent = cat.title;
    section.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "mode-grid";
    cat.topics.forEach(key => {
      const m = GEO.topics[key];
      if (!m) return;
      const b = document.createElement("button");
      b.className = "mode-card";
      b.style.setProperty("--c", m.color);
      b.innerHTML =
        '<span class="mode-ico">' + m.icon + '</span>' +
        '<span class="mode-title">' + m.name + '</span>' +
        '<span class="mode-desc">' + m.desc + '</span>' +
        '<span class="mode-tag">' + m.tag + '</span>';
      b.addEventListener("click", () => startTopic(key));
      grid.appendChild(b);
    });
    section.appendChild(grid);
    container.appendChild(section);
  });

  // ---------- Oyun durumu ----------
  const state = {
    key: null, mode: null,
    questions: [], index: 0,
    score: 0, correct: 0, missed: [],
    tries: 1, locked: false,
  };

  const el = {
    pillIcon: document.getElementById("mode-pill-icon"),
    pillName: document.getElementById("mode-pill-name"),
    targetLabel: document.querySelector(".target-label"),
    targetName: document.getElementById("target-name"),
    score: document.getElementById("stat-score"),
    correct: document.getElementById("stat-correct"),
    wrong: document.getElementById("stat-wrong"),
    progress: document.getElementById("stat-progress"),
    tries: document.getElementById("stat-tries"),
    fill: document.getElementById("progress-fill"),
    feedback: document.getElementById("feedback-bar"),
    tooltip: document.getElementById("tooltip"),
  };

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function total() { return state.questions.length; }
  function currentQ() { return state.questions[state.index]; }

  function updateHud() {
    el.score.textContent = "⭐ " + state.score;
    el.correct.textContent = "✅ " + state.correct;
    el.wrong.textContent = "❌ " + state.missed.length;
    el.progress.textContent = state.index + "/" + total();
    const max = state.mode.tries;
    el.tries.textContent = "💙".repeat(state.tries) + "🖤".repeat(max - state.tries);
    el.fill.style.width = (total() ? (state.index / total()) * 100 : 0) + "%";
  }

  function setFeedback(text, cls) {
    el.feedback.textContent = text;
    el.feedback.className = "feedback-bar" + (cls ? " " + cls : "");
  }

  function showTooltip(x, y, text, cls) {
    const rect = mapWrap.getBoundingClientRect();
    el.tooltip.textContent = text;
    el.tooltip.className = "tooltip" + (cls ? " " + cls : "");
    el.tooltip.style.left = (x - rect.left) + "px";
    el.tooltip.style.top = (y - rect.top) + "px";
    clearTimeout(showTooltip._t);
    showTooltip._t = setTimeout(() => el.tooltip.classList.add("hidden"), 1600);
  }

  function clearProvinceStyles() {
    provinces.forEach(p => p.groups.forEach(g =>
      g.classList.remove("correct", "missed", "flash-wrong", "reveal", "done")));
  }

  // ---------- İşaretçi / çizgi katmanı (features) ----------
  let featureLayer = null, labelLayer = null;
  const features = new Map(); // id -> { g, name, kind, labelX, labelY }

  function clearFeatures() {
    if (featureLayer) featureLayer.remove();
    if (labelLayer) labelLayer.remove();
    featureLayer = labelLayer = null;
    features.clear();
    mapWrap.classList.remove("mode-point");
  }

  function buildFeatures(list) {
    clearFeatures();
    mapWrap.classList.add("mode-point");
    featureLayer = document.createElementNS(SVGNS, "g");
    labelLayer = document.createElementNS(SVGNS, "g");

    list.forEach((item, i) => {
      const id = String(i);
      const g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "marker" + (item.kind === "line" ? " line-feature" : ""));
      g.dataset.id = id;
      let lx, ly;

      if (item.kind === "line") {
        const pts = item.plakas.map(pk => center(pk));
        const str = pts.map(p => p.x + "," + p.y).join(" ");
        // Geniş şeffaf tıklama alanı
        const hit = document.createElementNS(SVGNS, "polyline");
        hit.setAttribute("points", str);
        hit.setAttribute("class", "line-hit");
        // Görünür çizgi
        const vis = document.createElementNS(SVGNS, "polyline");
        vis.setAttribute("points", str);
        vis.setAttribute("class", "line-vis");
        g.appendChild(hit); g.appendChild(vis);
        const mid = pts[Math.floor(pts.length / 2)];
        lx = mid.x; ly = mid.y - 4;
      } else {
        const c = center(item.pk);
        const cx = c.x + (item.dx || 0), cy = c.y + (item.dy || 0);
        const circle = document.createElementNS(SVGNS, "circle");
        circle.setAttribute("cx", cx); circle.setAttribute("cy", cy); circle.setAttribute("r", "6.5");
        g.appendChild(circle);
        lx = cx; ly = cy - 10;
      }

      featureLayer.appendChild(g);
      features.set(id, { g, name: item.name, kind: item.kind, lx, ly });
    });

    svg.appendChild(featureLayer);
    svg.appendChild(labelLayer);
  }

  function labelFeature(id) {
    const f = features.get(id);
    if (!f) return;
    const t = document.createElementNS(SVGNS, "text");
    t.setAttribute("class", "marker-label");
    t.setAttribute("x", f.lx); t.setAttribute("y", f.ly);
    t.textContent = f.name;
    labelLayer.appendChild(t);
  }

  // ---------- Konu başlatma ----------
  function startTopic(key) {
    const mode = GEO.topics[key];
    state.key = key; state.mode = mode;
    state.index = 0; state.score = 0; state.correct = 0; state.missed = []; state.locked = false;

    clearProvinceStyles();
    resetView();
    el.pillIcon.textContent = mode.icon;
    el.pillName.textContent = mode.name;
    el.targetLabel.textContent = mode.type === "group" ? "Bul:" : "Bul:";
    showScreen("game"); // getBBox yalnızca görünür SVG'de doğru çalışır

    if (mode.type === "province") {
      clearFeatures();
      const keys = mode.allProvinces ? [...provinces.keys()] : mode.items.map(x => x.pk);
      state.questions = shuffle(keys).map(pk => ({ name: provinces.get(pk).name, pk }));
    } else if (mode.type === "group") {
      clearFeatures();
      state.questions = shuffle(mode.groups.map(g => ({ name: g.name, plakas: g.plakas })));
    } else { // features
      buildFeatures(mode.features);
      state.questions = shuffle(mode.features.map((f, i) => ({ name: f.name, id: String(i) })));
    }

    nextQuestion(true);
  }

  function nextQuestion(first) {
    if (!first) state.index++;
    state.tries = state.mode.tries;
    if (state.index >= total()) { endGame(); return; }
    // Grup modunda her soru bağımsız — harita boyamalarını temizle (küme çakışmaları için)
    if (state.mode.type === "group") clearProvinceStyles();
    el.targetName.textContent = currentQ().name;
    setFeedback(first && state.mode.note ? "ℹ️ " + state.mode.note : state.mode.prompt);
    updateHud();
    state.locked = false;
  }

  function awardPoints() {
    return state.mode.tries === 3 ? [0, 30, 60, 100][state.tries] : 100;
  }

  // ---------- Cevap: province / group ----------
  function paintGroup(plakas, cls) {
    plakas.forEach(p => {
      const pr = provinces.get(p);
      if (pr) pr.groups.forEach(g => g.classList.add(...cls));
    });
  }

  function guessProvince(pk, x, y) {
    if (state.locked) return;
    const q = currentQ(), mode = state.mode, clicked = provinces.get(pk);
    const isCorrect = mode.type === "province" ? pk === q.pk : q.plakas.indexOf(pk) !== -1;

    if (isCorrect) {
      const pts = awardPoints();
      state.score += pts; state.correct++;
      if (mode.type === "province") clicked.groups.forEach(g => g.classList.add("correct", "done"));
      else paintGroup(q.plakas, ["correct", "done"]);
      showTooltip(x, y, q.name + " ✔ +" + pts, "ok");
      setFeedback("Doğru! " + q.name + " (+" + pts + " puan)", "ok");
      state.locked = true;
      setTimeout(() => nextQuestion(), mode.type === "province" ? 900 : 1100);
      return;
    }

    state.tries--;
    showTooltip(x, y, clicked.name + " ✘", "bad");
    clicked.groups.forEach(g => g.classList.add("flash-wrong"));
    setTimeout(() => clicked.groups.forEach(g => g.classList.remove("flash-wrong")), 800);

    if (state.tries <= 0) {
      state.missed.push(q.name);
      if (mode.type === "province") {
        const t = provinces.get(q.pk);
        t.groups.forEach(g => g.classList.add("missed", "done", "reveal"));
        setTimeout(() => t.groups.forEach(g => g.classList.remove("reveal")), 1600);
        setFeedback("Olmadı! Doğru cevap: " + q.name + " (kırmızı bölge)", "bad");
      } else {
        // Grup modu: doğru kümeyi yeşille açığa çıkar (öğretici)
        paintGroup(q.plakas, ["correct", "reveal"]);
        setTimeout(() => q.plakas.forEach(p =>
          provinces.get(p) && provinces.get(p).groups.forEach(g => g.classList.remove("reveal"))), 1600);
        setFeedback("Olmadı! " + q.name + " → doğru alan yeşille gösterildi", "bad");
      }
      state.locked = true; updateHud();
      setTimeout(() => nextQuestion(), 1800);
    } else {
      setFeedback("Yanlış: " + clicked.name + " — tekrar dene! (" + state.tries + " hak kaldı)", "bad");
      updateHud();
    }
  }

  // ---------- Cevap: features (nokta/çizgi) ----------
  function guessFeature(id, x, y) {
    if (state.locked) return;
    const q = currentQ(), f = features.get(id);
    if (f.g.classList.contains("correct") || f.g.classList.contains("missed")) return;

    if (id === q.id) {
      const pts = awardPoints();
      state.score += pts; state.correct++;
      f.g.classList.add("correct");
      labelFeature(id);
      showTooltip(x, y, q.name + " ✔ +" + pts, "ok");
      setFeedback("Doğru! " + q.name + " (+" + pts + " puan)", "ok");
    } else {
      state.missed.push(q.name);
      f.g.classList.add("missed");
      const cor = features.get(q.id);
      cor.g.classList.add("correct", "reveal");
      labelFeature(q.id);
      setTimeout(() => cor.g.classList.remove("reveal"), 1600);
      showTooltip(x, y, f.name + " ✘", "bad");
      setFeedback("Olmadı! Doğru cevap: " + q.name + " (açığa çıktı)", "bad");
    }
    state.locked = true; updateHud();
    setTimeout(() => nextQuestion(), 1400);
  }

  // ---------- Sonuç ----------
  function endGame() {
    const pct = total() ? state.correct / total() : 0;
    document.getElementById("result-emoji").textContent = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "🎉" : "📚";
    document.getElementById("result-title").textContent =
      pct >= 0.8 ? "Harika!" : pct >= 0.5 ? "Güzel iş!" : "Devam et!";
    document.getElementById("result-sub").textContent = state.mode.name + " modunu tamamladın.";
    document.getElementById("result-score").textContent = state.score;
    document.getElementById("result-correct").textContent = state.correct;
    document.getElementById("result-wrong").textContent = state.missed.length;
    const missedBox = document.getElementById("result-missed");
    if (state.missed.length > 0) {
      missedBox.classList.remove("hidden");
      document.getElementById("missed-list").textContent = state.missed.join(", ");
    } else missedBox.classList.add("hidden");
    showScreen("result");
  }

  // ---------- Harita tıklama ----------
  let downPos = null;
  svg.addEventListener("pointerdown", e => { downPos = { x: e.clientX, y: e.clientY }; });

  svg.addEventListener("click", e => {
    if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return; // sürükleme
    if (!state.mode) return;

    if (state.mode.type === "features") {
      const g = e.target.closest(".marker");
      if (!g) return;
      guessFeature(g.dataset.id, e.clientX, e.clientY);
      return;
    }

    const g = e.target.closest("g[data-iladi]");
    if (!g) return;
    const pk = g.dataset.plakakodu;
    if (!pk || pk === "00") return;
    if (state.mode.type === "province" && g.classList.contains("done")) {
      showTooltip(e.clientX, e.clientY, provinces.get(pk).name + " (tamamlandı)");
      return;
    }
    guessProvince(pk, e.clientX, e.clientY);
  });

  // ---------- Zoom ve kaydırma ----------
  const baseVB = svg.getAttribute("viewBox").split(" ").map(Number);
  let vb = [...baseVB];
  function applyVB() { svg.setAttribute("viewBox", vb.join(" ")); }
  function resetView() { vb = [...baseVB]; applyVB(); }

  function zoomAt(factor, cx, cy) {
    const rect = svg.getBoundingClientRect();
    const sx = vb[0] + ((cx - rect.left) / rect.width) * vb[2];
    const sy = vb[1] + ((cy - rect.top) / rect.height) * vb[3];
    const newW = Math.min(baseVB[2] * 1.2, Math.max(baseVB[2] / 8, vb[2] / factor));
    const scale = newW / vb[2];
    vb = [sx - (sx - vb[0]) * scale, sy - (sy - vb[1]) * scale, newW, vb[3] * scale];
    applyVB();
  }

  mapWrap.addEventListener("wheel", e => {
    e.preventDefault();
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY);
  }, { passive: false });

  document.getElementById("zoom-in").addEventListener("click", () => {
    const r = svg.getBoundingClientRect(); zoomAt(1.35, r.left + r.width / 2, r.top + r.height / 2);
  });
  document.getElementById("zoom-out").addEventListener("click", () => {
    const r = svg.getBoundingClientRect(); zoomAt(1 / 1.35, r.left + r.width / 2, r.top + r.height / 2);
  });
  document.getElementById("zoom-reset").addEventListener("click", resetView);

  const pointers = new Map();
  let lastPinchDist = 0;
  mapWrap.addEventListener("pointerdown", e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      lastPinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    mapContainer.classList.add("dragging");
  });
  mapWrap.addEventListener("pointermove", e => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    if (pointers.size === 1) {
      const rect = svg.getBoundingClientRect();
      vb[0] -= (e.clientX - prev.x) * (vb[2] / rect.width);
      vb[1] -= (e.clientY - prev.y) * (vb[3] / rect.height);
      applyVB();
    } else if (pointers.size === 2) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinchDist > 0) zoomAt(dist / lastPinchDist, (a.x + b.x) / 2, (a.y + b.y) / 2);
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
  mapWrap.addEventListener("pointerup", releasePointer);
  mapWrap.addEventListener("pointercancel", releasePointer);
  mapWrap.addEventListener("pointerleave", releasePointer);

  // ---------- Menü bağlantıları ----------
  document.getElementById("btn-cografya").addEventListener("click", () => showScreen("cografya"));
  document.querySelectorAll("[data-back]").forEach(b =>
    b.addEventListener("click", () => showScreen(b.dataset.back)));
  document.getElementById("btn-menu").addEventListener("click", () => showScreen("cografya"));
  document.getElementById("btn-again").addEventListener("click", () => startTopic(state.key));
  document.getElementById("btn-modes").addEventListener("click", () => showScreen("cografya"));
  document.getElementById("btn-result-menu").addEventListener("click", () => showScreen("menu"));
})();
