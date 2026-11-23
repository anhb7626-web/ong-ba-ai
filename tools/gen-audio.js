/*
 * Tạo file giọng đọc (mp3) cho mọi câu trong data.js bằng FPT.AI Text-to-Speech.
 * Chạy:  FPT_API_KEY=xxxx node tools/gen-audio.js
 * Cần Node 18+ và Playwright (npm i -D playwright; npx playwright install chromium).
 * Câu đã có file sẽ được bỏ qua, nên khi thêm bài mới chỉ tốn ký tự cho câu mới.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const KEY = process.env.FPT_API_KEY;
const VOICES = { ong: process.env.VOICE_ONG || "leminh", ba: process.env.VOICE_BA || "banmai" };
const SPEED = process.env.SPEED || "-1";
const ROOT = path.join(__dirname, "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tts(text, voice) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch("https://api.fpt.ai/hmi/tts/v5", {
      method: "POST",
      headers: { "api-key": KEY, speed: SPEED, voice },
      body: text
    });
    const j = await r.json().catch(() => ({}));
    if (j.error === 0 && j.async) {
      for (let i = 0; i < 30; i++) {
        await sleep(i === 0 ? 1500 : 1000);
        const f = await fetch(j.async);
        if (f.ok) {
          const buf = Buffer.from(await f.arrayBuffer());
          if (buf.length > 1000) return buf;
        }
      }
    }
    if (/rate limit/i.test(j.message || "")) {
      // Tài khoản miễn phí bị giới hạn số lượt: chờ rồi thử lại, không tính là một lần thử
      console.warn("  bị giới hạn lượt gọi, chờ 60 giây…");
      await sleep(60000); attempt--; continue;
    }
    console.warn("  thử lại:", text, JSON.stringify(j).slice(0, 160));
    await sleep(3000 * (attempt + 1));
  }
  throw new Error("Không tạo được: " + text);
}

(async () => {
  if (!KEY) { console.error("Thiếu FPT_API_KEY"); process.exit(1); }
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto("file://" + path.join(ROOT, "index.html"));
  const lists = await p.evaluate(() => ({ ong: OBK_listSpeech("ong"), ba: OBK_listSpeech("ba") }));
  await b.close();

  const manifest = { ong: [], ba: [] };
  let made = 0, chars = 0;
  for (const persona of ["ong", "ba"]) {
    const dir = path.join(ROOT, "audio", persona);
    fs.mkdirSync(dir, { recursive: true });
    const todo = lists[persona].filter((x) => x.text.length >= 3);
    let i = 0;
    const worker = async () => {
      while (i < todo.length) {
        const { key, text } = todo[i++];
        const file = path.join(dir, key + ".mp3");
        if (!fs.existsSync(file)) {
          try {
            fs.writeFileSync(file, await tts(text, VOICES[persona]));
            made++; chars += text.length;
            await sleep(+(process.env.GAP_MS || 1500));
            if (made % 20 === 0) console.log(`  đã tạo ${made} file…`);
          } catch (e) { console.error(e.message); continue; }
        }
        manifest[persona].push(key);
      }
    };
    const n = +(process.env.CONCURRENCY || 1);
    await Promise.all(Array.from({ length: n }, worker));
    manifest[persona].sort();
  }
  fs.writeFileSync(path.join(ROOT, "audio-manifest.js"),
    "// Tự sinh bởi tools/gen-audio.js – danh sách câu đã có file giọng đọc\nwindow.OBK_AUDIO = " + JSON.stringify(manifest) + ";\n");
  console.log(`Xong. Tạo mới ${made} file (${chars} ký tự). Ông: ${manifest.ong.length}, Bà: ${manifest.ba.length}.`);
})();
