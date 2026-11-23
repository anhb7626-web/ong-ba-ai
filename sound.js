/*
 * Âm thanh của Ông Bà Kể – tất cả tự tạo bằng Web Audio API, không dùng file nhạc,
 * nên không vướng bản quyền và không tốn dung lượng.
 *
 *  - Nhạc nền: giai điệu ngũ cung (Đô Rê Fa Sol La) gảy như đàn tranh, có luyến "nhấn",
 *    nốt trầm giữ nhịp, phát ngẫu nhiên nên không lặp đi lặp lại.
 *  - Tiếng động: bấm nút (mõ gỗ), trả lời đúng (chuỗi nốt đi lên), nhắc lại (hai nốt dịu),
 *    hết bài (chuông nhỏ).
 *  - Nhạc tự nhỏ lại khi ông bà đang nói (duck).
 */
(function () {
  let ctx = null, master, musicBus, sfxBus, timer = null, playing = false;
  let musicVol = 0.16, nextTime = 0, step = 0, idx = 4;
  // Ngũ cung Bắc trên nền Đô: C D F G A, hai quãng tám
  const BASE = 261.63;
  const SCALE = [0, 2, 5, 7, 9, 12, 14, 17, 19, 21].map((s) => BASE * Math.pow(2, s / 12));
  const BPM = 66, BEAT = 60 / BPM;

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    // vang nhẹ cho ấm
    const delay = ctx.createDelay(); delay.delayTime.value = 0.28;
    const fb = ctx.createGain(); fb.gain.value = 0.28;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master); musicBus.connect(delay);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.5; sfxBus.connect(master);
    return true;
  }

  /* Tiếng gảy kiểu đàn tranh: vài họa âm, tắt dần nhanh, có thể "nhấn" lên nốt */
  function pluck(freq, t, vol, bus, bend) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass";
    lp.frequency.setValueAtTime(freq * 6, t); lp.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.6);
    lp.connect(g); g.connect(bus);
    [[1, "triangle", 1], [2, "sine", 0.35], [3, "sine", 0.12]].forEach(([m, type, a]) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(freq * m, t);
      if (bend) { // luyến nhấn: kéo lên rồi trả về
        o.frequency.linearRampToValueAtTime(freq * m * 1.06, t + 0.25);
        o.frequency.linearRampToValueAtTime(freq * m, t + 0.6);
      }
      const og = ctx.createGain(); og.gain.value = a;
      o.connect(og); og.connect(lp);
      o.start(t); o.stop(t + 2);
    });
  }
  function soft(freq, t, dur, vol, bus, type = "sine") {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.05);
  }

  /* Bộ phát nhạc: lên lịch trước vài trăm mili giây */
  function schedule() {
    while (nextTime < ctx.currentTime + 0.4) {
      const bar = step % 8;
      if (bar === 0) { // nốt trầm mỗi ô nhịp
        const root = (Math.floor(step / 8) % 4 === 2) ? BASE / 2 * 1.4983 : BASE / 2;
        soft(root, nextTime, BEAT * 7.5, 0.22, musicBus);
        soft(root / 2, nextTime, BEAT * 7.5, 0.12, musicBus);
      }
      // giai điệu: đi từng bậc là chính, thỉnh thoảng nhảy, có lúc nghỉ
      const rest = Math.random() < (bar % 2 ? 0.45 : 0.15);
      if (!rest) {
        const r = Math.random();
        idx += r < 0.4 ? 1 : r < 0.8 ? -1 : (Math.random() < 0.5 ? 2 : -2);
        if (idx < 2) idx = 3; if (idx > SCALE.length - 1) idx = SCALE.length - 3;
        pluck(SCALE[idx], nextTime, 0.32, musicBus, Math.random() < 0.18);
      }
      nextTime += BEAT * (bar === 7 ? 1.5 : 1) / 1;
      step++;
    }
  }

  const api = {
    musicOn: false,
    sfxOn: true,
    unlock() { return init(); },
    startMusic() {
      if (!init() || playing) return;
      playing = true;
      nextTime = ctx.currentTime + 0.1;
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setTargetAtTime(musicVol, ctx.currentTime, 0.8);
      timer = setInterval(schedule, 120);
    },
    stopMusic() {
      if (!ctx || !playing) return;
      playing = false;
      musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setTimeout(() => { if (!playing) clearInterval(timer); }, 1200);
    },
    duck(on) {
      if (!ctx || !playing) return;
      musicBus.gain.setTargetAtTime(on ? musicVol * 0.25 : musicVol, ctx.currentTime, on ? 0.12 : 0.6);
    },
    sfx(name) {
      if (!api.sfxOn || !init()) return;
      const t = ctx.currentTime + 0.01;
      if (name === "tap") { // mõ gỗ
        soft(900, t, 0.06, 0.35, sfxBus, "sine");
        soft(1800, t, 0.03, 0.12, sfxBus, "square");
      } else if (name === "correct") {
        [0, 2, 3, 5].forEach((k, i) => pluck(SCALE[k + 2], t + i * 0.09, 0.45, sfxBus));
      } else if (name === "gentle") {
        pluck(SCALE[5], t, 0.3, sfxBus, true); pluck(SCALE[3], t + 0.22, 0.28, sfxBus);
      } else if (name === "finish") {
        [0, 2, 3, 4, 5, 7].forEach((k, i) => pluck(SCALE[k + 1], t + i * 0.1, 0.4, sfxBus));
        soft(SCALE[5] * 2, t + 0.6, 1.6, 0.12, sfxBus, "sine");
      } else if (name === "page") {
        const n = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
        n.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = 0.8;
        const g = ctx.createGain(); g.gain.value = 0.18;
        n.connect(f); f.connect(g); g.connect(sfxBus); n.start(t);
      }
    }
  };
  window.OBK_SOUND = api;
})();
