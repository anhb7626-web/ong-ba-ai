// In ra danh sách mọi câu ông/bà có thể nói (JSON), dùng cho các công cụ tạo giọng đọc.
// Chạy: node tools/list-speech.js > speech.json   (cần Playwright)
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto("file://" + path.join(__dirname, "..", "index.html"));
  const r = await p.evaluate(() => ({ ong: OBK_listSpeech("ong"), ba: OBK_listSpeech("ba") }));
  await b.close();
  process.stdout.write(JSON.stringify(r));
})();
