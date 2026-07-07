/* Bilgi Atlası — Coğrafya
   Harita üzerinde beş mod: İller, Bölgeler, Göller, Dağlar, Toprak Türleri.
   - İller: 3 deneme (100/60/30 puan). Doğru il yeşil, bilinemeyen kırmızı.
   - Diğer modlar: tek deneme hakkı. Doğru = 100 puan, yanlışta doğru cevap açığa çıkar. */

(function () {
  "use strict";

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
  const SVGNS = "http://www.w3.org/2000/svg";

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

  // ---------- Coğrafya verileri ----------
  const REGIONS = [
    { name: "Marmara Bölgesi", plakas: ["10","11","16","17","22","34","39","41","54","59","77"] },
    { name: "Ege Bölgesi", plakas: ["03","09","20","35","43","45","48","64"] },
    { name: "Akdeniz Bölgesi", plakas: ["01","07","15","31","32","46","33","80"] },
    { name: "İç Anadolu Bölgesi", plakas: ["68","06","18","26","70","38","71","40","42","50","51","58","66"] },
    { name: "Karadeniz Bölgesi", plakas: ["05","08","74","69","14","19","81","28","29","78","37","52","53","55","57","60","61","67"] },
    { name: "Doğu Anadolu Bölgesi", plakas: ["04","75","12","13","23","24","25","30","76","36","44","49","62","65"] },
    { name: "Güneydoğu Anadolu Bölgesi", plakas: ["02","72","21","27","79","47","56","63","73"] },
  ];

  // Göller: hangi ilde + o ilin merkezine göre küçük kaydırma (dx,dy SVG birimi)
  const LAKES = [
    { name: "Van Gölü", pk: "65" },
    { name: "Tuz Gölü", pk: "68" },
    { name: "Beyşehir Gölü", pk: "42", dx: -22, dy: 8 },
    { name: "Eğirdir Gölü", pk: "32", dx: 6, dy: -6 },
    { name: "Burdur Gölü", pk: "15", dy: -8 },
    { name: "Salda Gölü", pk: "15", dx: -16, dy: 10 },
    { name: "İznik Gölü", pk: "16", dx: 10, dy: 4 },
    { name: "Sapanca Gölü", pk: "54", dy: 6 },
    { name: "Manyas (Kuş) Gölü", pk: "10", dx: 14, dy: -10 },
    { name: "Acıgöl", pk: "20", dx: -18 },
    { name: "Çıldır Gölü", pk: "75" },
    { name: "Hazar Gölü", pk: "23", dy: 8 },
    { name: "Bafa Gölü", pk: "09", dx: -10, dy: 14 },
    { name: "Marmara Gölü", pk: "45", dx: -12, dy: -12 },
  ];

  // Dağlar / doruklar
  const MOUNTAINS = [
    { name: "Ağrı Dağı", pk: "04", dx: 18, dy: -6 },
    { name: "Erciyes Dağı", pk: "38", dy: 10 },
    { name: "Uludağ", pk: "16", dy: 14 },
    { name: "Süphan Dağı", pk: "13", dx: 8, dy: -8 },
    { name: "Kaçkar Dağı", pk: "53", dy: 6 },
    { name: "Palandöken Dağı", pk: "25", dy: 8 },
    { name: "Hasan Dağı", pk: "68", dy: 16 },
    { name: "Nemrut Dağı", pk: "02", dx: 10, dy: -6 },
    { name: "Cilo Dağı", pk: "30", dy: 6 },
    { name: "Kaz Dağı (İda)", pk: "17", dx: 14, dy: 12 },
    { name: "Bey Dağları", pk: "07", dx: -18, dy: -6 },
    { name: "Munzur Dağları", pk: "62", dy: -6 },
  ];

  // Toprak türleri: görüldüğü örnek il grupları (herhangi biri doğru sayılır)
  const SOILS = [
    { name: "Terra Rossa (Kırmızı Akdeniz Toprağı)", plakas: ["07","33","01","48","31"] },
    { name: "Çernozyom (Kara Toprak)", plakas: ["25","36","75","76"] },
    { name: "Alüvyal Topraklar (Akarsu Ovaları)", plakas: ["55","09","45","10"] },
    { name: "Çöl / Kırmızımsı Kahverengi Topraklar", plakas: ["63","21","47"] },
    { name: "Kahverengi Orman Toprakları", plakas: ["53","61","14","37"] },
  ];

  // ---------- Mod tanımları ----------
  // type: 'province' | 'group' | 'point'
  const MODES = {
    iller:    { key: "iller",    icon: "🏙️", name: "İller", color: "#2b7de9", type: "province", tries: 3,
                tag: "81 il · 3 hak", desc: "Verilen ili haritada bul. 3 deneme hakkın var.",
                prompt: "Haritadan doğru ili seç" },
    bolgeler: { key: "bolgeler", icon: "🧩", name: "Bölgeler", color: "#16a34a", type: "group", tries: 1,
                tag: "7 bölge · tek hak", desc: "Sorulan coğrafi bölgeyi bul — o bölgeden herhangi bir ile tıkla.",
                prompt: "Bölgeyi bul: o bölgeden bir ile tıkla" },
    goller:   { key: "goller",   icon: "💧", name: "Göller", color: "#0891b2", type: "point", tries: 1,
                tag: "göller · tek hak", desc: "Haritadaki noktalardan sorulan gölü bul. Tek deneme!",
                prompt: "Sorulan gölün noktasını seç" },
    daglar:   { key: "daglar",   icon: "⛰️", name: "Dağlar", color: "#b45309", type: "point", tries: 1,
                tag: "dağlar · tek hak", desc: "Haritadaki noktalardan sorulan dağı bul. Tek deneme!",
                prompt: "Sorulan dağın noktasını seç" },
    toprak:   { key: "toprak",   icon: "🟤", name: "Toprak Türleri", color: "#92400e", type: "group", tries: 1,
                tag: "toprak · tek hak", desc: "Sorulan toprak türünün görüldüğü yeri haritadan seç.",
                prompt: "Bu toprak türünün görüldüğü ile tıkla" },
  };

  // ---------- Coğrafya alt menüsü ----------
  const modeGrid = document.getElementById("mode-grid");
  ["iller","bolgeler","goller","daglar","toprak"].forEach(k => {
    const m = MODES[k];
    const b = document.createElement("button");
    b.className = "mode-card";
    b.style.setProperty("--c", m.color);
    b.innerHTML =
      '<span class="mode-ico">' + m.icon + '</span>' +
      '<span class="mode-title">' + m.name + '</span>' +
      '<span class="mode-desc">' + m.desc + '</span>' +
      '<span class="mode-tag">' + m.tag + '</span>';
    b.addEventListener("click", () => startMode(k));
    modeGrid.appendChild(b);
  });

  // ---------- Oyun durumu ----------
  const state = {
    mode: null,
    questions: [],   // [{ name, key }]
    index: 0,
    score: 0,
    correct: 0,
    missed: [],
    tries: 1,
    locked: false,
  };

  // ---------- Arayüz elemanları ----------
  const el = {
    pillIcon: document.getElementById("mode-pill-icon"),
    pillName: document.getElementById("mode-pill-name"),
    targetName: document.getElementById("target-name"),
    score: document.getElementById("stat-score"),
    correct: document.getElementById("stat-correct"),
    wrong: document.getElementById("stat-wrong"),
    progress: document.getElementById("stat-progress"),
    tries: document.getElementById("stat-tries"),
    triesWrap: document.getElementById("stat-tries"),
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

  // ---------- İşaretçi katmanı (göl/dağ) ----------
  let markerLayer = null;
  let markerLabels = null;
  const markers = new Map(); // id -> { g, data }

  function clearMarkers() {
    if (markerLayer) markerLayer.remove();
    if (markerLabels) markerLabels.remove();
    markerLayer = markerLabels = null;
    markers.clear();
    mapWrap.classList.remove("mode-point");
  }

  function buildMarkers(list) {
    clearMarkers();
    mapWrap.classList.add("mode-point");
    markerLayer = document.createElementNS(SVGNS, "g");
    markerLabels = document.createElementNS(SVGNS, "g");
    list.forEach((item, i) => {
      const c = center(item.pk);
      const cx = c.x + (item.dx || 0);
      const cy = c.y + (item.dy || 0);
      const g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "marker");
      g.dataset.id = String(i);
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("cx", cx); circle.setAttribute("cy", cy); circle.setAttribute("r", "6.5");
      g.appendChild(circle);
      markerLayer.appendChild(g);
      markers.set(String(i), { g, cx, cy, name: item.name });
    });
    svg.appendChild(markerLayer);
    svg.appendChild(markerLabels); // etiketler üstte
  }

  function labelMarker(id) {
    const m = markers.get(id);
    if (!m) return;
    const t = document.createElementNS(SVGNS, "text");
    t.setAttribute("class", "marker-label");
    t.setAttribute("x", m.cx); t.setAttribute("y", m.cy - 10);
    t.textContent = m.name;
    markerLabels.appendChild(t);
  }

  // ---------- Mod başlatma ----------
  function startMode(key) {
    const mode = MODES[key];
    state.mode = mode;
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.missed = [];
    state.locked = false;

    // Haritayı temizle
    provinces.forEach(p => p.groups.forEach(g =>
      g.classList.remove("correct", "missed", "flash-wrong", "reveal", "done")));
    resetView();

    el.pillIcon.textContent = mode.icon;
    el.pillName.textContent = mode.name;
    // Ekranı önce göster: getBBox (işaretçi konumları) yalnızca görünür SVG'de doğru çalışır
    showScreen("game");

    // Soruları hazırla
    if (mode.type === "province") {
      state.questions = shuffle([...provinces.keys()]).map(pk => ({ name: provinces.get(pk).name, pk }));
      clearMarkers();
    } else if (mode.type === "group") {
      const src = key === "bolgeler" ? REGIONS : SOILS;
      state.questions = shuffle(src.map(g => ({ name: g.name, plakas: g.plakas })));
      clearMarkers();
    } else if (mode.type === "point") {
      const src = key === "goller" ? LAKES : MOUNTAINS;
      buildMarkers(src);
      state.questions = shuffle(src.map((item, i) => ({ name: item.name, id: String(i) })));
    }

    nextQuestion(true);
  }

  function nextQuestion(first) {
    if (!first) state.index++;
    state.tries = state.mode.tries;
    if (state.index >= total()) { endGame(); return; }
    el.targetName.textContent = currentQ().name;
    setFeedback(state.mode.prompt);
    updateHud();
    state.locked = false;
  }

  function awardPoints() {
    if (state.mode.tries === 3) return [0, 30, 60, 100][state.tries];
    return 100;
  }

  // ---------- Cevap: il / grup modları ----------
  function guessProvince(pk, x, y) {
    if (state.locked) return;
    const q = currentQ();
    const mode = state.mode;
    const clicked = provinces.get(pk);

    let isCorrect;
    if (mode.type === "province") isCorrect = pk === q.pk;
    else isCorrect = q.plakas.indexOf(pk) !== -1; // grup modu: bölge/toprak

    if (isCorrect) {
      const pts = awardPoints();
      state.score += pts;
      state.correct++;
      if (mode.type === "province") {
        clicked.groups.forEach(g => g.classList.add("correct", "done"));
      } else {
        // Tüm grubu yeşile boya
        q.plakas.forEach(p => provinces.get(p).groups.forEach(g => g.classList.add("correct", "done")));
      }
      showTooltip(x, y, q.name + " ✔ +" + pts, "ok");
      setFeedback("Doğru! " + q.name + " (+" + pts + " puan)", "ok");
      state.locked = true;
      setTimeout(() => nextQuestion(), mode.type === "province" ? 900 : 1100);
      return;
    }

    // Yanlış
    state.tries--;
    showTooltip(x, y, clicked.name + " ✘", "bad");
    clicked.groups.forEach(g => g.classList.add("flash-wrong"));
    setTimeout(() => clicked.groups.forEach(g => g.classList.remove("flash-wrong")), 800);

    if (state.tries <= 0) {
      state.missed.push(q.name);
      revealGroup(q);
      const msg = mode.type === "province"
        ? "Olmadı! Doğru cevap: " + q.name + " (kırmızı bölge)"
        : "Olmadı! " + q.name + " → açığa çıkan bölge";
      setFeedback(msg, "bad");
      state.locked = true;
      updateHud();
      setTimeout(() => nextQuestion(), 1800);
    } else {
      setFeedback("Yanlış: " + clicked.name + " — tekrar dene! (" + state.tries + " hak kaldı)", "bad");
      updateHud();
    }
  }

  function revealGroup(q) {
    if (state.mode.type === "province") {
      const t = provinces.get(q.pk);
      t.groups.forEach(g => g.classList.add("missed", "done", "reveal"));
      setTimeout(() => t.groups.forEach(g => g.classList.remove("reveal")), 1600);
    } else {
      q.plakas.forEach(p => provinces.get(p).groups.forEach(g => g.classList.add("missed", "done", "reveal")));
      setTimeout(() => q.plakas.forEach(p =>
        provinces.get(p).groups.forEach(g => g.classList.remove("reveal"))), 1600);
    }
  }

  // ---------- Cevap: nokta modları (göl/dağ) ----------
  function guessPoint(id, x, y) {
    if (state.locked) return;
    const q = currentQ();
    const m = markers.get(id);
    if (m.g.classList.contains("correct") || m.g.classList.contains("missed")) return;

    if (id === q.id) {
      const pts = awardPoints();
      state.score += pts;
      state.correct++;
      m.g.classList.add("correct");
      labelMarker(id);
      showTooltip(x, y, q.name + " ✔ +" + pts, "ok");
      setFeedback("Doğru! " + q.name + " (+" + pts + " puan)", "ok");
    } else {
      state.missed.push(q.name);
      m.g.classList.add("missed");
      const correct = markers.get(q.id);
      correct.g.classList.add("correct", "reveal");
      labelMarker(q.id);
      setTimeout(() => correct.g.classList.remove("reveal"), 1600);
      showTooltip(x, y, m.name + " ✘", "bad");
      setFeedback("Olmadı! Doğru cevap: " + q.name + " (açığa çıktı)", "bad");
    }
    state.locked = true;
    updateHud();
    setTimeout(() => nextQuestion(), 1300);
  }

  // ---------- Sonuç ----------
  function endGame() {
    const pct = total() ? state.correct / total() : 0;
    document.getElementById("result-emoji").textContent = pct >= 0.8 ? "🏆" : pct >= 0.5 ? "🎉" : "📚";
    document.getElementById("result-title").textContent =
      pct >= 0.8 ? "Harika!" : pct >= 0.5 ? "Güzel iş!" : "Devam et!";
    document.getElementById("result-sub").textContent =
      state.mode.name + " modunu tamamladın.";
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
  svg.addEventListener("pointerdown", e => { downPos = { x: e.clientX, y: e.clientY }; });

  svg.addEventListener("click", e => {
    if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return; // sürükleme
    if (!state.mode) return;

    if (state.mode.type === "point") {
      const g = e.target.closest(".marker");
      if (!g) return;
      guessPoint(g.dataset.id, e.clientX, e.clientY);
      return;
    }

    const g = e.target.closest("g[data-iladi]");
    if (!g) return;
    const pk = g.dataset.plakakodu;
    if (!pk || pk === "00") return;
    if (g.classList.contains("done")) {
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
    const newH = vb[3] * scale;
    vb = [sx - (sx - vb[0]) * scale, sy - (sy - vb[1]) * scale, newW, newH];
    applyVB();
  }

  mapWrap.addEventListener("wheel", e => {
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

  // ---------- Menü / buton bağlantıları ----------
  document.getElementById("btn-cografya").addEventListener("click", () => showScreen("cografya"));
  document.querySelectorAll("[data-back]").forEach(b =>
    b.addEventListener("click", () => showScreen(b.dataset.back)));
  document.getElementById("btn-menu").addEventListener("click", () => showScreen("cografya"));
  document.getElementById("btn-again").addEventListener("click", () => startMode(state.mode.key));
  document.getElementById("btn-modes").addEventListener("click", () => showScreen("cografya"));
  document.getElementById("btn-result-menu").addEventListener("click", () => showScreen("menu"));
})();
