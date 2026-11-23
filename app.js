/* Ông Bà Kể – phần xử lý. Nội dung bài học nằm trong data.js. */
(function () {
  "use strict";

  const D = window.OBK_DATA;
  const SND = window.OBK_SOUND;
  const ic = (d, fill) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${fill ? d : `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</g>`}</svg>`;
  const IC = {
    speaker: ic('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9q2 3 0 6M19 6.5q4 5.5 0 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>', true),
    book: ic('<path d="M3 5q4-2 9 1q5-3 9-1v14q-4-2-9 1q-5-3-9-1z"/><path d="M12 6v14"/>'),
    mic: ic('<rect x="8.5" y="3" width="7" height="12" rx="3.5" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>', true),
    send: ic('<path d="M4 12h14M12 5l7 7-7 7"/>'),
    check: ic('<path d="M5 12.5l4.5 4.5L19 7"/>'),
    again: ic('<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v4.5h4.5"/>'),
    grid: ic('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    family: ic('<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.5 20c0-4 2.5-7 5.5-7s5.5 3 5.5 7M13 20c.3-3 2-5 4-5s3.8 2 4 5"/>'),
    skip: ic('<path d="M5 6l7 6-7 6M13 6l7 6-7 6"/>')
  };
  const CFG = window.OBK_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ===================== Lưu trữ (localStorage) ===================== */
  const store = {
    get(k, def) {
      try { const v = localStorage.getItem("obk_" + k); return v == null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set(k, v) { try { localStorage.setItem("obk_" + k, JSON.stringify(v)); } catch (e) {} }
  };

  const settings = Object.assign(
    { autoread: true, rate: 0.9, ai: !!CFG.aiEndpoint, endpoint: "", music: true, sfx: true, fx: true, name: "" },
    store.get("settings", {})
  );
  const saveSettings = () => store.set("settings", settings);

  function stats() {
    return Object.assign({ seconds: 0, days: {}, words: {}, lessons: [], said: 0, uptake: 0, toneMiss: {}, stickers: [] }, store.get("stats", {}));
  }
  function saveStats(s) { store.set("stats", s); }
  const today = () => new Date().toISOString().slice(0, 10);

  /* ===================== Trạng thái ===================== */
  const state = {
    char: store.get("char", null), // "ong" | "ba"
    screen: "home",
    history: [],
    mode: null,
    session: null
  };

  /* ===================== Tiện ích chữ ===================== */
  function fill(s) {
    const x = state.char === "ba" ? "bà" : "ông";
    return String(s)
      .replace(/\{Xc\}/g, x.charAt(0).toUpperCase() + x.slice(1))
      .replace(/\{X\}/g, x);
  }
  function norm(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  const words = (s) => norm(s).split(" ").filter(Boolean);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* Từ điển: tách theo âm tiết, so khớp cụm dài nhất (tối đa 5 âm tiết) */
  const GLOSS = {};
  let GLOSS_MAX = 1;
  Object.keys(D.glossary).forEach((k) => {
    GLOSS[k.toLowerCase()] = Object.assign({ word: k }, D.glossary[k]);
    GLOSS_MAX = Math.max(GLOSS_MAX, k.split(" ").length);
  });

  function markup(text) {
    // trả về {html, found:[word]}; gạch chân các từ có trong glossary
    const tokens = text.split(/(\s+)/);
    const out = tokens.map(esc);
    const syl = [];
    tokens.forEach((t, i) => { if (t.trim()) syl.push(i); });
    const clean = (t) => t.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
    const found = [];
    for (let a = 0; a < syl.length; a++) {
      for (let n = Math.min(GLOSS_MAX, syl.length - a); n >= 1; n--) {
        const slice = syl.slice(a, a + n).map((i) => tokens[i]);
        if (slice.slice(0, -1).some((t) => /[^\p{L}]$/u.test(t))) continue; // không vượt dấu câu
        if (slice.slice(1).some((t) => /^[^\p{L}]/u.test(t))) continue;
        const g = GLOSS[slice.map(clean).join(" ").toLowerCase()];
        if (!g) continue;
        const first = syl[a], last = syl[a + n - 1];
        const lead = tokens[first].match(/^[^\p{L}]*/u)[0];
        const trail = tokens[last].match(/[^\p{L}]*$/u)[0];
        const raw = tokens.slice(first, last + 1).join("");
        const core = raw.slice(lead.length, raw.length - trail.length);
        out[first] = esc(lead) + '<span class="w" data-w="' + esc(g.word) + '">' + esc(core) + "</span>" + esc(trail);
        for (let i = first + 1; i <= last; i++) out[i] = "";
        if (!found.includes(g.word)) found.push(g.word);
        a += n - 1;
        break;
      }
    }
    return { html: out.join(""), found };
  }

  /* ===================== Giọng nói ===================== */
  const synth = window.speechSynthesis;
  let viVoice = null;
  function loadVoices() {
    if (!synth) return;
    const vs = synth.getVoices();
    const vi = vs.filter((v) => /^vi/i.test(v.lang));
    // Ưu tiên giọng "Natural" của Edge: Nam Minh (nam) cho Ông, Hoài My (nữ) cho Bà
    const want = state.char === "ba" ? /hoai\s*my|hoàimy|female|nữ/i : /nam\s*minh|male|nam/i;
    viVoice = vi.find((v) => /natural|online/i.test(v.name) && want.test(v.name))
      || vi.find((v) => /natural|online/i.test(v.name))
      || vi.find((v) => /google/i.test(v.name))
      || vi[0] || null;
    renderVoiceStatus();
  }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  function setTalking(on) {
    $$('[data-svg="current"]').forEach((el) => el.classList.toggle("talking", on));
  }

  /* Tách câu thành từng đoạn để ghép với file âm thanh đọc sẵn (audio/) */
  function segments(text) {
    return String(text).replace(/<[^>]+>/g, "").split(/(?<=[.!?:])\s+/).map((x) => x.trim()).filter(Boolean);
  }
  function hashKey(persona, seg) {
    let h = 0x811c9dc5;
    const str = persona + "|" + seg.normalize("NFC");
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16).padStart(8, "0");
  }
  const AUDIO = window.OBK_AUDIO || {};
  const audioSet = { ong: new Set(AUDIO.ong || []), ba: new Set(AUDIO.ba || []) };
  const player = new Audio();
  player.preload = "auto";
  // mở khóa phát âm thanh trên iPhone ở lần chạm đầu tiên
  document.addEventListener("pointerdown", function unlock() {
    player.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
    player.play().catch(() => {});
    document.removeEventListener("pointerdown", unlock);
  }, { once: true });

  /* Biểu cảm nhân vật: "happy" (vui), "nod" (gật đầu), "listen" (nghiêng đầu nghe) */
  const MOODS = ["happy", "nod", "listen"];
  let moodTimer = null;
  function setMood(mood, ms) {
    const els = $$('[data-svg="current"]');
    els.forEach((el) => MOODS.forEach((m) => el.classList.toggle(m, m === mood)));
    clearTimeout(moodTimer);
    if (mood && ms) moodTimer = setTimeout(() => setMood(null), ms);
  }

  let speakToken = 0;
  function browserSay(seg, token) {
    return new Promise((resolve) => {
      if (token !== speakToken) return resolve();
      if (!synth || !(viVoice || synth.getVoices().length)) {
        setTimeout(resolve, Math.min(4000, 500 + seg.length * 45));
        return;
      }
      let finished = false;
      const end = () => { if (!finished) { finished = true; resolve(); } };
      const u = new SpeechSynthesisUtterance(seg);
      u.lang = "vi-VN";
      if (viVoice) u.voice = viVoice;
      u.rate = settings.rate * (state.char === "ong" ? 0.95 : 1);
      u.pitch = state.char === "ong" ? 0.8 : 1.15;
      u.onend = end; u.onerror = end;
      setTimeout(end, 1500 + seg.length * 140); // Chrome đôi khi không gọi onend
      synth.speak(u);
    });
  }
  function fileSay(url, token) {
    return new Promise((resolve) => {
      if (token !== speakToken) return resolve();
      let finished = false;
      const end = () => { if (!finished) { finished = true; player.onended = player.onerror = null; resolve(); } };
      player.onended = end; player.onerror = end;
      player.src = url;
      player.playbackRate = Math.max(0.7, Math.min(1.3, settings.rate / 0.9));
      player.play().catch(end);
    });
  }
  async function speak(text, force) {
    if (!force && !settings.autoread) return;
    const token = ++speakToken;
    if (synth) synth.cancel();
    player.pause();
    const persona = state.char === "ba" ? "ba" : "ong";
    setTalking(true);
    SND.duck(true);
    for (const seg of segments(text)) {
      if (token !== speakToken) return;
      const key = hashKey(persona, seg);
      if (audioSet[persona].has(key)) await fileSay(`audio/${persona}/${key}.mp3`, token);
      else await browserSay(seg, token);
    }
    if (token === speakToken) { setTalking(false); SND.duck(false); }
  }
  function stopSpeak() { speakToken++; if (synth) synth.cancel(); player.pause(); setTalking(false); SND.duck(false); }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  function listen(onResult, onState) {
    if (!SR) return;
    if (rec) { try { rec.stop(); } catch (e) {} rec = null; onState(false); return; }
    stopSpeak();
    rec = new SR();
    rec.lang = "vi-VN";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript);
      onResult(alts);
    };
    rec.onerror = (e) => {
      onState(false, e.error === "not-allowed" ? "Cháu cần cho phép dùng micro nhé." :
        e.error === "no-speech" ? "Ông bà chưa nghe thấy gì, cháu nói lại nhé." :
        e.error === "network" ? "Không kết nối được dịch vụ nhận giọng nói. Cháu gõ chữ nhé." :
        "Micro chưa dùng được, cháu gõ chữ hoặc bấm chọn nhé.");
    };
    rec.onend = () => { rec = null; onState(false); };
    try { rec.start(); onState(true); } catch (e) { rec = null; onState(false); }
  }

  /* ===================== Màn hình ===================== */
  function renderArt() {
    const h = $("#hero-art"); if (h && !h.innerHTML) h.innerHTML = window.OBK_ART.hero;
    $$("[data-icon]").forEach((el) => { if (!el.innerHTML) el.innerHTML = window.OBK_ART.icon(el.dataset.icon); });
    $$("[data-sticker]").forEach((el) => { if (!el.innerHTML) el.innerHTML = window.OBK_ART.sticker(el.dataset.sticker); });
  }
  function renderSvgSlots() {
    $$("[data-svg]").forEach((el) => {
      const which = el.dataset.svg === "current" ? (state.char || "ong") : el.dataset.svg;
      if (el.dataset.drawn !== which) { el.innerHTML = window.OBK_SVG[which]; el.dataset.drawn = which; }
    });
  }

  function show(screen, push = true) {
    if (state.screen === "session" && screen !== "session") endSession();
    if (push && state.screen !== screen) state.history.push(state.screen);
    state.screen = screen;
    $$(".screen").forEach((s) => (s.hidden = s.id !== "screen-" + screen));
    $("#btn-back").hidden = screen === "home";
    renderSvgSlots();
    window.scrollTo(0, 0);
    if (screen === "parent") renderParent();
    if (screen === "stickers") renderStickers();
    if (screen === "modes") setGreeting();
    if (screen === "settings") renderSettings();
  }
  function back() {
    stopSpeak();
    let prev = state.history.pop() || "home";
    if (prev === "session") prev = state.history.pop() || "modes";
    show(prev, false);
  }

  function setGreeting() {
    const x = state.char === "ba" ? "Bà" : "Ông";
    const n = (settings.name || "").trim();
    $("#greet-text").textContent = n
      ? `${x} đây! ${n} ơi, hôm nay cháu muốn làm gì với ${x.toLowerCase()} nào?`
      : `${x} đây! Hôm nay cháu muốn làm gì với ${x.toLowerCase()} nào?`;
    $("#sticker-count").textContent = `${stats().stickers.length}/${window.OBK_ART.stickers.length}`;
  }
  function chooseChar(c) {
    state.char = c; store.set("char", c);
    loadVoices();
    renderSvgSlots();
    const x = c === "ba" ? "Bà" : "Ông";
    setGreeting();
    show("modes");
    speak(`${x} đây! Hôm nay cháu muốn làm gì với ${x.toLowerCase()} nào?`);
  }

  const MODE_NAMES = { stories: "📖 Kể chuyện cổ tích", chats: "🍚 Trò chuyện hằng ngày", rhymes: "🎶 Đồng dao – ca dao" };

  function openMode(mode) {
    stopSpeak();
    if (mode === "quiz") { startSession("quiz", null); return; }
    state.mode = mode;
    $("#list-title").textContent = MODE_NAMES[mode].replace(/^\S+\s/, "");
    const list = $("#item-list");
    list.innerHTML = "";
    const done = new Set(stats().lessons.map((l) => l.id));
    D[mode].forEach((item) => {
      const b = document.createElement("button");
      b.className = "item";
      const sub = mode === "rhymes" ? item.kind : mode === "stories" ? `${item.steps.length} lượt` : "Trò chuyện";
      b.innerHTML = `<span class="item-emoji">${window.OBK_ART.icon(item.id) || item.emoji || "⭐"}</span><span>${esc(item.title)}<small>${esc(sub)}</small></span>` +
        (done.has(item.id) ? '<span class="check" title="Đã học">✓</span>' : "");
      b.onclick = () => startSession(mode, item);
      list.appendChild(b);
    });
    if (mode === "chats") {
      const b = document.createElement("button");
      b.className = "item ai";
      const on = aiReady();
      b.innerHTML = `<span class="item-emoji">${window.OBK_ART.icon("ai")}</span><span>Trò chuyện tự do<small>${on ? "Nói gì cũng được, AI thật" : "Cần bật AI thật trong Cài đặt"}</small></span>`;
      b.onclick = () => on ? startSession("ai", { id: "ai", title: "Trò chuyện tự do" }) : show("settings");
      list.appendChild(b);
    }
    show("list");
  }

  /* ===================== Dựng các lượt cho từng chế độ ===================== */
  function buildSteps(mode, item) {
    if (mode === "stories" || mode === "chats") return item.steps.slice();
    if (mode === "rhymes") {
      const steps = [{ t: "say", text: `Bây giờ {X} đọc ${item.kind.toLowerCase()} “${item.title}”. Cháu nghe trước nhé.` }];
      steps.push({ t: "poem", lines: item.lines });
      const g = item.group || 2;
      steps.push({ t: "say", text: "Giờ cháu đọc theo {X} từng câu nhé." });
      for (let i = 0; i < item.lines.length; i += g) {
        steps.push({ t: "repeat", text: item.lines.slice(i, i + g).join(", ") });
      }
      item.meaning.forEach((m, i) => steps.push({ t: "say", text: (i === 0 ? "Cháu có biết bài này nghĩa là gì không? " : "") + m }));
      if (item.ask) steps.push(Object.assign({ t: "ask" }, item.ask));
      return steps;
    }
    if (mode === "quiz") {
      const pool = D.quizzes.slice().sort(() => Math.random() - 0.5).slice(0, D.quizPerRound || 5);
      const steps = [{ t: "say", text: `Mình chơi đố vui nhé! {Xc} đố cháu ${pool.length} câu.` }];
      pool.forEach((q, i) => {
        const right = q.choices[q.answer];
        // xáo trộn đáp án
        const order = q.choices.map((_, k) => k).sort(() => Math.random() - 0.5);
        steps.push({
          t: "ask", text: `Câu ${i + 1}: ${q.q}`,
          choices: order.map((k) => q.choices[k]), answer: order.indexOf(q.answer),
          recast: `À, đáp án là: ${right}. ${q.explain}`,
          yes: q.explain, quiz: true
        });
      });
      return steps;
    }
    return [];
  }

  /* ===================== Buổi học ===================== */
  let tick = null;
  function startSession(mode, item) {
    stopSpeak();
    const s = state.session = {
      mode, item,
      title: mode === "quiz" ? "Đố vui văn hóa" : item.title,
      steps: mode === "ai" ? [] : buildSteps(mode, item),
      i: -1, tries: 0, score: 0, total: 0,
      ai: [], // lịch sử trò chuyện AI
      seen: new Set()
    };
    $("#session-title").textContent = s.title;
    const scene = window.OBK_ART.scene(item && item.id, mode);
    $("#log").innerHTML = scene ? `<div class="scene" aria-hidden="true">${scene}</div>` : "";
    $("#progress-bar").style.width = "0%";
    SND.style(mode === "quiz" || mode === "rhymes" ? "lively" : "calm");
    show("session");
    // đếm thời gian luyện
    clearInterval(tick);
    tick = setInterval(() => {
      if (document.hidden || state.screen !== "session") return;
      const st = stats(); st.seconds += 5; st.days[today()] = (st.days[today()] || 0) + 5; saveStats(st);
    }, 5000);
    if (mode === "ai") startAI(); else next();
  }
  function endSession() {
    clearInterval(tick); tick = null;
    SND.style("calm");
    stopSpeak();
    if (rec) { try { rec.stop(); } catch (e) {} }
    state.session = null;
  }

  function progress() {
    const s = state.session;
    if (!s || !s.steps.length) return;
    $("#progress-bar").style.width = Math.round(((s.i + 1) / s.steps.length) * 100) + "%";
  }

  function scrollDown() {
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    });
  }

  function addWordsSeen(found, looked) {
    if (!found.length) return;
    const st = stats();
    found.forEach((w) => {
      const e = st.words[w] || { first: today(), looked: false };
      if (looked) e.looked = true;
      st.words[w] = e;
    });
    saveStats(st);
  }

  /* Bong bóng lời của ông/bà */
  function gpSay(text, opts = {}) {
    const t = fill(text);
    const wrap = document.createElement("div");
    wrap.className = "msg msg-gp" + (opts.cls ? " " + opts.cls : "");
    let found = [];
    let html;
    if (opts.lines) {
      html = opts.lines.map((l) => {
        const m = markup(fill(l)); found = found.concat(m.found);
        return `<span class="line">${m.html}</span>`;
      }).join("");
    } else {
      const m = markup(t); found = m.found; html = m.html;
    }
    found = [...new Set(found)];
    wrap.innerHTML = `<div class="text">${html}</div><div class="msg-tools"></div>`;
    const tools = $(".msg-tools", wrap);
    const say = opts.lines ? opts.lines.map(fill).join(". ") : t;
    const bSpeak = document.createElement("button");
    bSpeak.className = "tool"; bSpeak.innerHTML = IC.speaker + "Nghe lại";
    bSpeak.onclick = () => speak(say, true);
    tools.appendChild(bSpeak);
    if (found.length) {
      const bMean = document.createElement("button");
      bMean.className = "tool"; bMean.innerHTML = IC.book + "Xem nghĩa";
      bMean.onclick = () => toggleMeanings(wrap, found, bMean);
      tools.appendChild(bMean);
      addWordsSeen(found, false);
    }
    $$(".w", wrap).forEach((el) => (el.onclick = () => openWord(el.dataset.w)));
    $("#log").appendChild(wrap);
    scrollDown();
    return { el: wrap, spoken: speak(say) };
  }

  function toggleMeanings(wrap, found, btn) {
    const old = $(".meanings", wrap);
    if (old) { old.remove(); btn.innerHTML = IC.book + "Xem nghĩa"; return; }
    const box = document.createElement("div");
    box.className = "meanings";
    found.forEach((w) => {
      const g = GLOSS[w.toLowerCase()];
      const d = document.createElement("div");
      d.className = "meaning";
      d.innerHTML = `<b>${esc(g.word)}</b> · 🇬🇧 ${esc(g.en)} · 🇨🇳 <span class="zh">${esc(g.zh)}</span> <span class="py">${esc(g.py || "")}</span>`;
      box.appendChild(d);
    });
    wrap.appendChild(box);
    btn.innerHTML = IC.book + "Ẩn nghĩa";
    addWordsSeen(found, true);
    scrollDown();
  }

  function openWord(w) {
    const g = GLOSS[w.toLowerCase()];
    if (!g) return;
    addWordsSeen([g.word], true);
    $("#sheet-body").innerHTML =
      `<h3>${esc(g.word)}</h3><div class="lang">` +
      `<span>Tiếng Anh</span><span>${esc(g.en)}</span>` +
      `<span>Tiếng Trung</span><span>${esc(g.zh)} <em class="muted">${esc(g.py || "")}</em></span></div>` +
      `<p><button class="btn btn-green" id="sheet-say">${IC.speaker} Nghe từ này</button></p>`;
    $("#sheet").hidden = false;
    $("#sheet-say").onclick = () => speak(g.word, true);
  }

  function kidSay(text) {
    const d = document.createElement("div");
    d.className = "msg msg-kid";
    d.innerHTML = `<div class="text">${esc(text)}</div>`;
    $("#log").appendChild(d);
    scrollDown();
    return d;
  }

  /* So câu cháu nói/gõ với câu mẫu từng chữ: đúng, sai dấu, hay chưa nghe thấy */
  const wkey = (w) => w.normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const hasMarks = (t) => /[^\x00-\x7F]/.test(t);
  function toneCheck(target, alts, src) {
    const tw = fill(target).split(/\s+/).filter((w) => wkey(w));
    // gõ không dấu thì không chấm dấu (do bàn phím, không phải do phát âm)
    const checkTone = src === "voice" || alts.some(hasMarks);
    let best = null;
    alts.forEach((a) => {
      const exact = new Set(a.split(/\s+/).map(wkey));
      const plain = new Set([...exact].map(norm));
      const res = tw.map((w) => {
        const k = wkey(w);
        if (exact.has(k)) return { w, st: "ok" };
        if (plain.has(norm(k))) return { w, st: checkTone ? "tone" : "ok" };
        return { w, st: "miss" };
      });
      const sc = res.filter((r) => r.st !== "miss").length + res.filter((r) => r.st === "ok").length / 10;
      if (!best || sc > best.sc) best = { res, sc };
    });
    const res = best.res;
    const hit = res.filter((r) => r.st !== "miss").length / Math.max(1, res.length);
    return { res, hit, tones: res.filter((r) => r.st === "tone").map((r) => wkey(r.w)) };
  }
  function showToneCheck(kidEl, check) {
    const box = document.createElement("div");
    box.className = "tone-check";
    box.innerHTML = check.res.map((r) => `<span class="tw ${r.st}">${esc(r.w)}</span>`).join(" ") +
      (check.tones.length ? '<span class="tone-note">Chữ màu cam: cháu nói gần đúng, nhớ chú ý dấu nhé.</span>' : "");
    kidEl.appendChild(box);
    scrollDown();
  }
  function recordSaid(check, isUptake) {
    const st = stats();
    st.said++;
    if (isUptake) st.uptake++;
    (check ? check.tones : []).forEach((w) => (st.toneMiss[w] = (st.toneMiss[w] || 0) + 1));
    saveStats(st);
  }

  /* Câu mẫu để cháu nói lại sau khi được nhắc (uptake) */
  function modelOf(step) {
    if (step.model) return fill(step.model);
    const segs = segments(fill(step.recast)).filter((x) => !/:$/.test(x));
    let m = (segs[0] || "").replace(/^(À|Ừ|Ồ|Đúng là),?\s*/u, "");
    return m.charAt(0).toUpperCase() + m.slice(1);
  }
  function inviteRepeat(model) {
    gpSay("Cháu nói lại câu đó cùng {X} nhé!");
    answerBox({
      header: `<div class="model-card"><span class="model-label">Cháu nói theo</span>${esc(model)}</div>`,
      placeholder: "Hoặc gõ lại câu…",
      extraButtons: `<div class="btn-row two"><button class="btn btn-green" id="btn-said">${IC.check} Cháu nói rồi</button><button class="btn btn-ghost" id="btn-skip">${IC.skip} Bỏ qua</button></div>`,
      onAnswer: async (txt, alts, idx, src) => {
        const el = kidSay(txt);
        const check = toneCheck(model, alts, src);
        showToneCheck(el, check);
        recordSaid(check, true);
        panel("");
        await wait(300);
        setMood("happy", 2000); SND.sfx("correct");
        gpSay(check.hit >= 0.6 ? pick(READ_OK) : pick(READ_DONE), { cls: "praise" });
        showContinue();
      }
    });
    $("#btn-said").onclick = () => { stopSpeak(); recordSaid(null, true); panel(""); setMood("happy", 2000); SND.sfx("correct"); gpSay(pick(READ_DONE), { cls: "praise" }); showContinue(); };
    $("#btn-skip").onclick = () => { stopSpeak(); next(); };
  }

  function typing() {
    const d = document.createElement("div");
    d.className = "msg msg-gp";
    d.innerHTML = '<div class="text typing"><span></span><span></span><span></span></div>';
    $("#log").appendChild(d);
    scrollDown();
    return d;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ----- Ô trả lời ----- */
  function panel(html) { const p = $("#input-panel"); p.innerHTML = html; if (html) scrollDown(); return p; }

  function showContinue(label = "Tiếp") {
    const p = panel(`<button class="btn btn-big" id="btn-next">${label} ${IC.send}</button>`);
    $("#btn-next", p).onclick = () => { stopSpeak(); next(); };
  }

  function answerBox({ choices, placeholder, onAnswer, extraButtons, suggest, header }) {
    const hasMic = !!SR;
    let html = header || "";
    if (suggest && suggest.length) html += `<div class="suggest">${suggest.map((s, i) => `<button data-s="${i}">${esc(s)}</button>`).join("")}</div>`;
    if (choices && choices.length) html += `<div class="choices">${choices.map((c, i) => `<button class="choice" data-i="${i}">${esc(fill(c))}</button>`).join("")}</div>`;
    html += `<form class="answer-row" autocomplete="off">
        <input type="text" id="answer" placeholder="${esc(placeholder || "Cháu gõ câu trả lời…")}" enterkeyhint="send" lang="vi">
        ${hasMic ? '<button type="button" class="round-btn mic" id="btn-mic" aria-label="Nói">' + IC.mic + '</button>' : ""}
        <button type="submit" class="round-btn" aria-label="Gửi">${IC.send}</button>
      </form>`;
    if (extraButtons) html += extraButtons;
    html += '<p class="listen-note" id="listen-note"></p>';
    const p = panel(html);
    let locked = false;
    const submit = (txt, alts, idx, src) => {
      if (locked || !String(txt).trim()) return;
      locked = true;
      stopSpeak();
      onAnswer(String(txt).trim(), alts || [txt], idx, src || (idx != null ? "tap" : "typed"));
    };
    $$(".choice", p).forEach((b) => (b.onclick = () => submit(b.textContent, null, +b.dataset.i)));
    $$(".suggest button", p).forEach((b) => (b.onclick = () => { $("#answer").value = b.textContent; $("#answer").focus(); }));
    $("form", p).onsubmit = (e) => { e.preventDefault(); submit($("#answer").value); };
    const mic = $("#btn-mic", p);
    if (mic) mic.onclick = () => listen(
      (alts) => submit(alts[0], alts, null, "voice"),
      (on, err) => {
        mic.classList.toggle("on", on);
        setMood(on ? "listen" : null);
        $("#listen-note").textContent = on ? (state.char === "ba" ? "Bà" : "Ông") + " đang nghe cháu nói…" : (err || "");
      }
    );
    return p;
  }

  /* ----- Chấm câu trả lời ----- */
  function scoreChoice(input, choice) {
    const iw = words(input), cw = words(fill(choice));
    if (!iw.length || !cw.length) return 0;
    const inSet = new Set(iw);
    const hit = cw.filter((w) => inSet.has(w)).length;
    return hit / cw.length;
  }
  function judge(step, alts, idx) {
    if (idx != null) return idx === step.answer;
    for (const a of alts) {
      const n = " " + norm(a) + " ";
      if ((step.accept || []).some((k) => n.includes(" " + norm(k) + " "))) return true;
      const scores = step.choices.map((c) => scoreChoice(a, c));
      const best = Math.max(...scores);
      if (best > 0 && scores[step.answer] === best && scores.filter((x) => x === best).length === 1) return true;
    }
    return false;
  }

  const PRAISE = [
    "Đúng rồi! Cháu giỏi quá!", "Giỏi lắm cháu ơi!", "Hay quá! Cháu nhớ giỏi thật!",
    "Đúng rồi, {X} thương cháu quá!", "Tuyệt vời! Cháu thông minh lắm!"
  ];
  const ENCOURAGE = [
    "Cháu cố gắng lắm, giỏi lắm!", "Không sao đâu, cháu học nhanh lắm!",
    "Cháu chịu khó quá, {X} vui lắm!", "Lần sau cháu nhớ ngay thôi, giỏi lắm!"
  ];
  const REPLY_OPEN = ["Ồ, thế à!", "Hay quá!", "À, {X} hiểu rồi."];
  const READ_DONE = ["Cháu đọc hay quá!", "Giỏi lắm, đọc to rõ ràng!", "Hay lắm cháu ơi!"];
  const READ_OK = ["Cháu đọc đúng rồi! Hay quá!", "Giỏi quá, đọc chuẩn lắm!"];

  function confetti() {
    if (document.body.classList.contains("no-fx")) return;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "confetti c" + (i % 4);
      s.style.left = Math.random() * 90 + 5 + "vw";
      s.style.top = 60 + Math.random() * 80 + "px";
      s.style.animationDelay = Math.random() * 0.3 + "s";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1900);
    }
  }

  /* ----- Chạy từng lượt ----- */
  async function next() {
    const s = state.session;
    if (!s) return;
    s.i++; s.tries = 0;
    progress();
    if (s.i >= s.steps.length) { finish(); return; }
    const step = s.steps[s.i];
    panel("");
    if (step.t === "say") {
      gpSay(step.text);
      showContinue();
    } else if (step.t === "poem") {
      gpSay("", { lines: step.lines, cls: "poem" });
      showContinue("Cháu nghe xong rồi");
    } else if (step.t === "repeat") {
      runRepeat(step);
    } else if (step.t === "ask") {
      runAsk(step);
    }
  }

  function runAsk(step) {
    const s = state.session;
    gpSay(step.text);
    const choices = step.choices && step.choices.length ? step.choices : null;
    answerBox({
      choices,
      placeholder: choices ? "Hoặc gõ chữ…" : "Cháu gõ chữ…",
      onAnswer: async (txt, alts, idx, src) => {
        kidSay(txt);
        if (src !== "tap") recordSaid(null, false);
        panel("");
        await wait(350);
        if (step.open) {
          const head = idx == null ? pick(REPLY_OPEN) + " " : "";
          await gpSay(head + step.reply, { cls: "praise" }).spoken;
          showContinue();
          return;
        }
        s.total++;
        if (judge(step, alts, idx)) {
          s.score++;
          confetti();
          setMood("happy", 2600);
          SND.sfx("correct");
          gpSay(pick(PRAISE) + (step.yes ? " " + step.yes : ""), { cls: "praise" });
        } else {
          // Recast: nhắc lại câu đúng một cách tự nhiên, rồi khen
          setMood("nod", 1400);
          SND.sfx("gentle");
          await gpSay(step.recast + " " + pick(ENCOURAGE), { cls: "praise" }).spoken;
          if (state.session !== s) return;
          inviteRepeat(modelOf(step));
          return;
        }
        showContinue();
      }
    });
  }

  function runRepeat(step) {
    const s = state.session;
    gpSay("Cháu đọc theo nhé: " + step.text);
    const doneBtn = '<div class="btn-row" style="margin-top:10px"><button class="btn btn-green" id="btn-read">' + IC.check + ' Cháu đọc to xong rồi</button></div>';
    answerBox({
      placeholder: "Gõ lại câu thơ…",
      extraButtons: doneBtn,
      onAnswer: (txt, alts, idx, src) => handle(txt, alts, src)
    });
    $("#btn-read").onclick = () => { stopSpeak(); handle(null); };
    async function handle(txt, alts, src) {
      let best = 0;
      if (txt) {
        const el = kidSay(txt);
        const check = toneCheck(step.text, alts, src);
        showToneCheck(el, check);
        recordSaid(check, false);
        best = check.hit;
      } else recordSaid(null, false);
      panel("");
      await wait(300);
      if (!txt) { gpSay(pick(READ_DONE), { cls: "praise" }); showContinue(); return; }
      if (best >= 0.6 || s.tries >= 1) {
        confetti();
        gpSay((best >= 0.6 ? pick(READ_OK) : "Cháu cố gắng lắm! Mình cùng đọc lại một lần nữa nhé: " + step.text), { cls: "praise" });
        showContinue();
      } else {
        s.tries++;
        gpSay("Gần đúng rồi cháu ơi! Cháu nghe {X} đọc lại nhé: " + step.text);
        answerBox({ placeholder: "Cháu thử lại nhé…", extraButtons: doneBtn, onAnswer: (t, a, i, src2) => handle(t, a, src2) });
        $("#btn-read").onclick = () => { stopSpeak(); handle(null); };
      }
    }
  }

  function finish() {
    const s = state.session;
    const st = stats();
    const lessonId = s.mode === "quiz" ? "quiz" : s.item.id;
    const firstTime = !st.lessons.some((l) => l.id === lessonId) || s.mode === "quiz";
    let award = null;
    if (firstTime) {
      award = window.OBK_ART.stickers.find((x) => !st.stickers.includes(x.id));
      if (award) st.stickers.push(award.id);
    }
    st.lessons = [{ id: s.mode === "quiz" ? "quiz" : s.item.id, mode: s.mode, title: s.title, date: today() }]
      .concat(st.lessons.filter((l) => l.id !== (s.mode === "quiz" ? "quiz" : s.item.id))).slice(0, 20);
    saveStats(st);
    $("#progress-bar").style.width = "100%";
    SND.sfx("finish");
    let msg;
    if (s.mode === "quiz") msg = `Cháu trả lời đúng ${s.score} trên ${s.total} câu. ${s.score >= s.total - 1 ? "Giỏi quá!" : "Cháu học thêm là nhớ hết ngay!"} {Xc} thương cháu!`;
    else if (s.mode === "stories") msg = "Hết truyện rồi! Cháu nghe chăm chú lắm. Tối nay cháu kể lại cho bố mẹ nghe nhé!";
    else if (s.mode === "rhymes") msg = "Cháu đọc thuộc bài rồi đấy! Cháu đọc cho bố mẹ nghe nhé!";
    else msg = "{Xc} nói chuyện với cháu vui quá! Mai mình nói chuyện tiếp nhé.";
    confetti();
    gpSay(msg, { cls: "praise" });
    const p = panel(`<div class="btn-row">
      <button class="btn btn-big" id="btn-again">${IC.again} ${s.mode === "quiz" ? "Chơi lượt mới" : "Học lại bài này"}</button>
      <button class="btn btn-big btn-green" id="btn-other">${IC.grid} Chọn bài khác</button>
      <button class="btn btn-ghost" id="btn-to-parent">${IC.family} Gợi ý cho bố mẹ</button></div>`);
    $("#btn-again", p).onclick = () => startSession(s.mode, s.item);
    $("#btn-other", p).onclick = () => { if (s.mode === "quiz") show("modes"); else openMode(s.mode); };
    $("#btn-to-parent", p).onclick = () => show("parent");
    if (award) setTimeout(() => showReward(award), 900);
  }

  function showReward(st) {
    const n = (settings.name || "").trim();
    $("#reward-art").innerHTML = window.OBK_ART.sticker(st.id);
    $("#reward-title").textContent = n ? `Giỏi lắm, ${n}!` : "Giỏi lắm cháu ơi!";
    $("#reward-name").textContent = st.name;
    $("#reward").hidden = false;
    SND.sfx("finish");
    $("#reward-ok").focus();
  }

  function renderStickers() {
    const own = new Set(stats().stickers);
    $("#sticker-grid").innerHTML = window.OBK_ART.stickers.map((x) => own.has(x.id)
      ? `<div class="sticker got">${window.OBK_ART.sticker(x.id)}<span>${esc(x.name)}</span></div>`
      : `<div class="sticker locked">${window.OBK_ART.sticker(x.id)}<span>Chưa mở</span></div>`).join("");
    $("#sticker-progress").textContent = `Cháu đã có ${own.size} trên ${window.OBK_ART.stickers.length} nhãn dán. Học xong một bài mới là được thêm một nhãn.`;
  }

  /* ===================== AI thật ===================== */
  function endpoint() { return (settings.endpoint || CFG.aiEndpoint || "").trim().replace(/\/+$/, ""); }
  function aiReady() { return settings.ai && !!endpoint(); }

  async function callAI(messages) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 20000);
    try {
      const r = await fetch(endpoint() + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: state.char || "ong", messages }),
        signal: ctrl.signal
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.reply) throw new Error(j.error || "HTTP " + r.status);
      return j.reply;
    } finally { clearTimeout(to); }
  }

  function startAI() {
    const s = state.session;
    const hello = fill("Cháu ơi, hôm nay cháu muốn kể gì cho {X} nghe nào?");
    s.ai.push({ role: "assistant", content: hello });
    gpSay(hello);
    aiInput();
  }
  function aiInput() {
    answerBox({
      placeholder: "Cháu nói gì với " + (state.char === "ba" ? "bà" : "ông") + " nào…",
      suggest: ["Hôm nay cháu đi học", "Cháu có một con mèo", "Cháu thích ăn phở", "Ông bà kể chuyện đi"].map((x) => x.replace("Ông bà", state.char === "ba" ? "Bà" : "Ông")),
      extraButtons: '<button class="link-btn" id="btn-ai-end">Kết thúc trò chuyện</button>',
      onAnswer: async (txt) => {
        const s = state.session;
        if (!s) return;
        kidSay(txt);
        panel("");
        s.ai.push({ role: "user", content: txt.slice(0, 300) });
        const dots = typing();
        try {
          const reply = await callAI(s.ai.slice(-12));
          dots.remove();
          if (!state.session) return;
          s.ai.push({ role: "assistant", content: reply });
          gpSay(reply);
          aiInput();
        } catch (e) {
          dots.remove();
          gpSay("{Xc} nghe không rõ lắm, chắc mạng yếu. Mình nói chuyện theo bài soạn sẵn nhé!");
          const p = panel(`<div class="btn-row"><button class="btn btn-big" id="btn-retry">${IC.again} Thử lại</button>
            <button class="btn btn-big btn-green" id="btn-script">${IC.grid} Trò chuyện theo bài</button></div>`);
          $("#btn-retry", p).onclick = () => { s.ai.pop(); aiInput(); };
          $("#btn-script", p).onclick = () => openMode("chats");
          console.warn("AI lỗi:", e);
        }
      }
    });
    $("#btn-ai-end").onclick = () => { state.session.steps = [1]; state.session.i = 0; finish(); };
  }

  /* ===================== Góc phụ huynh ===================== */
  function renderParent() {
    const st = stats();
    $("#st-today").textContent = Math.round((st.days[today()] || 0) / 60);
    $("#st-total").textContent = Math.round(st.seconds / 60);
    $("#st-lessons").textContent = st.lessons.length;
    $("#st-said").textContent = st.said;
    $("#st-uptake").textContent = st.uptake;
    $("#st-stickers").textContent = st.stickers.length;
    const n = (settings.name || "").trim();
    $("#parent-sub").textContent = n ? `Tiến bộ của ${n}` : "Tiến bộ của con";
    const tm = Object.entries(st.toneMiss).sort((a, b) => b[1] - a[1]).slice(0, 10);
    $("#tone-list").innerHTML = tm.length
      ? tm.map(([w, c]) => `<span class="chip tone">${esc(w)} <b>${c}</b></span>`).join("")
      : '<span class="muted">Chưa có. Khi con nói to và đọc theo, chữ nào con hay nói sai dấu sẽ hiện ở đây.</span>';

    // gợi ý: lấy từ bài gần nhất
    let tips = D.generalTips, from = "Con chưa học bài nào, đây là gợi ý chung.";
    const last = st.lessons[0];
    if (last) {
      if (last.id === "quiz") { tips = D.quizTips; from = "Theo bài vừa học: Đố vui văn hóa"; }
      else {
        const all = [].concat(D.stories, D.chats, D.rhymes);
        const it = all.find((x) => x.id === last.id);
        if (it && it.parentTips) { tips = it.parentTips; from = "Theo bài vừa học: " + it.title; }
        else if (last.id === "ai") { from = "Theo buổi trò chuyện tự do"; }
      }
    }
    $("#tips-from").textContent = from;
    $("#tips").innerHTML = tips.slice(0, 3).map((t) => `<li>${esc(t)}</li>`).join("");

    const ws = Object.keys(st.words).sort((a, b) => (st.words[b].first > st.words[a].first ? 1 : -1));
    $("#words-count").textContent = ws.length ? `(${ws.length} từ)` : "";
    const chips = $("#word-chips");
    chips.innerHTML = ws.length ? "" : '<span class="muted">Chưa có từ nào. Con học một bài là sẽ có nhé!</span>';
    ws.forEach((w) => {
      const b = document.createElement("button");
      b.className = "chip" + (st.words[w].looked ? " starred" : ""); b.textContent = w;
      b.onclick = () => openWord(w);
      chips.appendChild(b);
    });

    $("#recent").innerHTML = st.lessons.length
      ? st.lessons.slice(0, 6).map((l) => `<li>${esc(l.title)} <span class="muted">· ${l.date.split("-").reverse().join("/")}</span></li>`).join("")
      : '<li class="muted">Chưa có bài nào.</li>';
  }

  /* ===================== Cài đặt ===================== */
  function renderVoiceStatus() {
    const el = $("#voice-status");
    if (!el) return;
    if (!synth) el.textContent = "Trình duyệt này không đọc to được. Cháu vẫn đọc chữ được nhé.";
    else if (viVoice) el.textContent = "✅ Đã có giọng tiếng Việt: " + viVoice.name;
    else el.textContent = "⚠️ Máy chưa có giọng đọc tiếng Việt. Hãy dùng Chrome, hoặc cài giọng tiếng Việt trong cài đặt của máy.";
  }
  function renderSettings() {
    $("#set-autoread").checked = settings.autoread;
    $("#set-rate").value = settings.rate;
    $("#rate-label").textContent = settings.rate.toFixed(2) + "×";
    $("#set-ai").checked = settings.ai;
    $("#set-music").checked = settings.music;
    $("#set-sfx").checked = settings.sfx;
    $("#set-fx").checked = settings.fx;
    $("#set-endpoint").value = settings.endpoint || CFG.aiEndpoint || "";
    renderVoiceStatus();
    $("#mic-status").textContent = SR
      ? "✅ Trình duyệt này nhận được giọng nói tiếng Việt. Bấm nút micro đỏ khi trả lời."
      : "⚠️ Trình duyệt này chưa nhận giọng nói. Hãy dùng Chrome trên máy tính hoặc Android. Cháu vẫn gõ chữ hoặc bấm chọn được.";
    $("#ai-status").textContent = endpoint()
      ? (settings.ai ? "AI đang bật." : "AI đang tắt.")
      : "Chưa có địa chỉ trạm AI. Xem hướng dẫn trong README.md của dự án.";
  }

  /* ===================== Danh sách mọi câu ông bà có thể nói =====================
     Dùng cho công cụ tạo file âm thanh (tools/gen-audio.js). Khi thêm bài trong data.js,
     chạy lại công cụ đó để có giọng đọc cho câu mới; câu chưa có file sẽ đọc bằng giọng trình duyệt. */
  window.OBK_listSpeech = function (persona) {
    const keep = state.char;
    state.char = persona;
    const out = [];
    const add = (t) => { if (t) out.push(fill(t)); };
    const x = persona === "ba" ? "Bà" : "Ông";
    add(`${x} đây! Hôm nay cháu muốn làm gì với ${x.toLowerCase()} nào?`);
    ["stories", "chats", "rhymes"].forEach((mode) => D[mode].forEach((item) => {
      buildSteps(mode, item).forEach((st) => {
        if (st.t === "poem") add(st.lines.join(". "));
        else if (st.t === "repeat") {
          add("Cháu đọc theo nhé: " + st.text);
          add("Gần đúng rồi cháu ơi! Cháu nghe {X} đọc lại nhé: " + st.text);
          add("Cháu cố gắng lắm! Mình cùng đọc lại một lần nữa nhé: " + st.text);
        } else { add(st.text); add(st.recast); add(st.yes); add(st.reply); }
      });
    }));
    add("Mình chơi đố vui nhé! {Xc} đố cháu " + (D.quizPerRound || 5) + " câu.");
    D.quizzes.forEach((q) => { add(q.q); add("À, đáp án là: " + q.choices[q.answer] + ". " + q.explain); add(q.explain); });
    for (let n = 1; n <= (D.quizPerRound || 5); n++) add("Câu " + n + ":");
    for (let n = 0; n <= (D.quizPerRound || 5); n++) add(`Cháu trả lời đúng ${n} trên ${D.quizPerRound || 5} câu.`);
    [].concat(PRAISE, ENCOURAGE, REPLY_OPEN, READ_DONE, READ_OK, [
      "Giỏi quá!", "Cháu học thêm là nhớ hết ngay!", "{Xc} thương cháu!",
      "Hết truyện rồi! Cháu nghe chăm chú lắm. Tối nay cháu kể lại cho bố mẹ nghe nhé!",
      "Cháu đọc thuộc bài rồi đấy! Cháu đọc cho bố mẹ nghe nhé!",
      "{Xc} nói chuyện với cháu vui quá! Mai mình nói chuyện tiếp nhé.",
      "Cháu ơi, hôm nay cháu muốn kể gì cho {X} nghe nào?",
      "{Xc} nghe không rõ lắm, chắc mạng yếu. Mình nói chuyện theo bài soạn sẵn nhé!",
      "Chào cháu, {X} đây. Cháu có khỏe không?",
      "Cháu nói lại câu đó cùng {X} nhé!"
    ]).forEach(add);
    Object.keys(D.glossary).forEach((w) => out.push(w));
    state.char = keep;
    const seen = new Map();
    out.forEach((t) => segments(t).forEach((seg) => {
      const k = hashKey(persona, seg);
      if (!seen.has(k)) seen.set(k, seg);
    }));
    return Array.from(seen, ([key, text]) => ({ key, text }));
  };

  /* ===================== Gắn sự kiện ===================== */
  function bind() {
    $$(".char-card").forEach((b) => (b.onclick = () => chooseChar(b.dataset.char)));
    $$(".mode-card").forEach((b) => (b.onclick = () => openMode(b.dataset.mode)));
    $("#btn-switch-char").onclick = () => show("home");
    $("#btn-back").onclick = back;
    $("#brand").onclick = () => { state.history = []; show(state.char ? "modes" : "home", false); };
    $("#btn-parent").onclick = () => show("parent");
    $("#btn-settings").onclick = () => show("settings");
    $("#sheet-close").onclick = () => ($("#sheet").hidden = true);
    $("#sheet").onclick = (e) => { if (e.target.id === "sheet") $("#sheet").hidden = true; };
    $("#btn-reset").onclick = () => {
      if (confirm("Xóa toàn bộ thời gian luyện và từ đã học trên máy này?")) { store.set("stats", {}); renderParent(); }
    };
    $("#set-autoread").onchange = (e) => { settings.autoread = e.target.checked; saveSettings(); if (!settings.autoread) stopSpeak(); };
    $("#set-rate").oninput = (e) => { settings.rate = +e.target.value; $("#rate-label").textContent = settings.rate.toFixed(2) + "×"; saveSettings(); };
    $("#btn-test-voice").onclick = () => speak(fill("Chào cháu, {X} đây. Cháu có khỏe không?"), true);
    $("#set-music").onchange = (e) => { settings.music = e.target.checked; saveSettings(); applyFx(); musicFollow(); };
    $("#set-sfx").onchange = (e) => { settings.sfx = e.target.checked; saveSettings(); applyFx(); };
    $("#set-fx").onchange = (e) => { settings.fx = e.target.checked; saveSettings(); applyFx(); };
    $("#set-ai").onchange = (e) => { settings.ai = e.target.checked; saveSettings(); renderSettings(); };
    $("#set-endpoint").onchange = (e) => { settings.endpoint = e.target.value.trim(); saveSettings(); renderSettings(); };
    $("#btn-test-ai").onclick = async () => {
      const el = $("#ai-status");
      if (!endpoint()) { el.textContent = "Chưa có địa chỉ trạm AI."; return; }
      el.textContent = "Đang kiểm tra…";
      try { const r = await callAI([{ role: "user", content: "Cháu chào ông bà ạ" }]); el.textContent = "✅ Kết nối được! AI trả lời: " + r; }
      catch (e) { el.textContent = "❌ Chưa kết nối được: " + e.message; }
    };
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#sheet").hidden = true; });
  }

  /* ===================== Nhạc, tiếng động, cảnh nền ===================== */
  function applyFx() {
    SND.sfxOn = settings.sfx;
    document.body.classList.toggle("no-fx", !settings.fx);
    const h = new Date().getHours();
    document.body.classList.toggle("night", h >= 18 || h < 6);
    const btn = $("#btn-music");
    btn.classList.toggle("off", !settings.music);
    btn.setAttribute("aria-pressed", settings.music ? "true" : "false");
  }
  function makePetals() {
    const box = $("#petals");
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.className = "petal" + (i % 3 === 0 ? " mai" : "");
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = 9 + Math.random() * 9 + "s";
      p.style.animationDelay = -Math.random() * 18 + "s";
      p.style.transform = "scale(" + (0.7 + Math.random() * 0.6) + ")";
      box.appendChild(p);
    }
  }
  function musicFollow() { if (settings.music) SND.startMusic(); else SND.stopMusic(); }
  // Trình duyệt chỉ cho phát âm thanh sau lần chạm đầu tiên
  document.addEventListener("pointerdown", function first() {
    SND.unlock(); musicFollow();
    document.removeEventListener("pointerdown", first);
  });
  // Tiếng "cốc" khi bấm nút (trừ ô đáp án: đã có tiếng đúng/sai riêng)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.classList.contains("choice")) return;
    if (b.classList.contains("mode-card") || b.classList.contains("item") || b.classList.contains("char-card")) SND.sfx("page");
    else SND.sfx("tap");
  }, true);

  bind();
  const nameEl = $("#kid-name");
  nameEl.value = settings.name || "";
  nameEl.oninput = () => { settings.name = nameEl.value.trim().slice(0, 20); saveSettings(); };
  $("#btn-stickers").onclick = () => show("stickers");
  $("#reward-ok").onclick = () => { $("#reward").hidden = true; };

  /* Màn mở đầu kéo rèm (mỗi lần mở trang một lần) */
  (function splash() {
    const sp = $("#splash");
    let seen = false;
    try { seen = sessionStorage.getItem("obk_splash") === "1"; } catch (e) {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { sp.remove(); return; }
    const open = () => {
      if (sp.classList.contains("open")) return;
      sp.classList.add("open");
      try { sessionStorage.setItem("obk_splash", "1"); } catch (e) {}
      setTimeout(() => sp.remove(), 1300);
    };
    sp.addEventListener("click", open);
    setTimeout(open, 2400);
  })();

  /* Chạy được khi mất mạng (chỉ khi trang chạy qua https, ví dụ GitHub Pages) */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  $("#btn-music").onclick = () => { settings.music = !settings.music; saveSettings(); applyFx(); musicFollow(); };
  makePetals();
  applyFx();
  setInterval(applyFx, 60000);
  renderArt();
  renderSvgSlots();
  if (state.char) setGreeting();
  show("home", false);
})();
