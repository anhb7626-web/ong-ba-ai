/*
 * Ông Bà Kể – trạm trung chuyển AI (Cloudflare Worker)
 * Giữ API key Aliyun (DashScope) ở phía máy chủ, trang web không bao giờ thấy key.
 *
 * Biến môi trường (Cloudflare → Worker → Settings → Variables):
 *   DASHSCOPE_API_KEY  (Secret, bắt buộc)  – key của Aliyun Model Studio / DashScope
 *   DASHSCOPE_BASE     (không bắt buộc)    – mặc định cổng quốc tế:
 *                         https://dashscope-intl.aliyuncs.com/compatible-mode/v1
 *                       Tài khoản Aliyun Trung Quốc (aliyun.com) thì dùng:
 *                         https://dashscope.aliyuncs.com/compatible-mode/v1
 *   MODEL              (không bắt buộc)    – mặc định "qwen-plus"
 *   ASR_MODEL          (không bắt buộc)    – mô hình nghe giọng nói, mặc định "qwen3-asr-flash"
 *   VBEE_APP_ID, VBEE_TOKEN (Secret, không bắt buộc) – để ông bà đọc câu AI trả lời bằng giọng Vbee
 *                       (ông Anh Khôi, bà Mai Phương). Thiếu thì app dùng giọng của máy.
 *   VBEE_VOICE_ONG, VBEE_VOICE_BA (không bắt buộc) – đổi mã giọng Vbee
 *   ALLOWED_ORIGINS    (nên đặt)           – các trang được phép gọi, cách nhau dấu phẩy,
 *                       ví dụ: https://anhb7626-web.github.io,http://localhost:8000
 */

const SYSTEM = (persona) => {
  const x = persona === "ba" ? "bà" : "ông";
  return `Bạn đóng vai ${x} của một em bé người Việt 6–12 tuổi sống ở nước ngoài, đang tập nói tiếng Việt.
Quy tắc:
- Xưng "${x}", gọi em bé là "cháu". Chỉ nói tiếng Việt, giọng ấm áp, hiền hậu.
- Bạn là ${x}, không phải cháu: không bao giờ mở đầu bằng "${x.charAt(0).toUpperCase() + x.slice(1)} ơi" và không nhắc lại nguyên văn câu của cháu.
- Mỗi lượt chỉ 1–3 câu ngắn, từ ngữ đơn giản, hợp với trẻ nhỏ. Không dùng biểu tượng, không dùng markdown.
- Khi cháu nói sai ngữ pháp, sai từ hoặc trộn tiếng Anh, KHÔNG chê, KHÔNG nói "sai rồi". Hãy nhắc lại câu đúng một cách tự nhiên trong câu trả lời của mình (recast), rồi khen cháu.
- Luôn kết thúc bằng một câu hỏi ngắn để cháu nói tiếp.
- Có thể kể chuyện cổ tích, đồng dao, nói về Tết, món ăn, gia đình Việt Nam.
- Tránh mọi chủ đề không phù hợp với trẻ em. Không hỏi thông tin riêng tư như địa chỉ, số điện thoại, tên trường. Nếu cháu hỏi điều không phù hợp, nhẹ nhàng đổi sang chuyện khác.`;
};

const LIMIT_PER_MIN = 30;
const hits = new Map(); // giới hạn số lượt theo IP (trong một máy chủ Cloudflare)

function cors(origin, allowed) {
  const ok = !allowed.length || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
const json = (obj, status, headers) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });

/* Nghe giọng cháu: nhận đoạn ghi âm ngắn (base64), gửi Qwen ASR, trả về chữ. Không lưu lại ghi âm. */
const AUDIO_TYPES = ["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-wav", "audio/aac"];
async function asr(body, env, base, h) {
  const b64 = typeof body.audio === "string" ? body.audio : "";
  const mime = AUDIO_TYPES.find((t) => String(body.mime || "").startsWith(t)) || "audio/webm";
  if (!b64 || b64.length > 2_000_000) return json({ error: "Đoạn ghi âm không hợp lệ hoặc quá dài" }, 400, h);
  try {
    const r = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + String(env.DASHSCOPE_API_KEY).trim() },
      body: JSON.stringify({
        model: env.ASR_MODEL || "qwen3-asr-flash",
        messages: [{ role: "user", content: [{ type: "input_audio", input_audio: { data: `data:${mime};base64,${b64}` } }] }],
        stream: false,
        asr_options: { language: "vi", enable_itn: false }
      })
    });
    const j = await r.json();
    if (!r.ok) return json({ error: (j.error && j.error.message) || "Nhận giọng lỗi " + r.status }, 502, h);
    const text = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || "");
    return json({ text: String(typeof text === "string" ? text : JSON.stringify(text)).trim() }, 200, h);
  } catch (e) {
    return json({ error: "Không gọi được dịch vụ nhận giọng" }, 502, h);
  }
}

/* Đọc câu bằng giọng Vbee: trả về mp3. Câu đã đọc rồi được giữ trong bộ nhớ đệm của Cloudflare
   30 ngày, đọc lại không tốn thêm ký tự Vbee. */
async function sha(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function tts(body, env, h, ctx) {
  if (!env.VBEE_APP_ID || !env.VBEE_TOKEN) return json({ error: "Trạm chưa có mã Vbee" }, 501, h);
  const text = String(body.text || "").replace(/\s+/g, " ").trim();
  if (!text || text.length > 400) return json({ error: "Câu không hợp lệ hoặc quá dài" }, 400, h);
  const persona = body.persona === "ba" ? "ba" : "ong";
  const voice = persona === "ba" ? env.VBEE_VOICE_BA || "hn_female_maiphuong_vdts_48k-fhg"
    : env.VBEE_VOICE_ONG || "hn_male_phuthang_stor80dt_48k-fhg";
  const audioHeaders = { ...h, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" };
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request("https://obk-tts.cache/" + (await sha(voice + "|0.9|" + text)));
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return new Response(hit.body, { status: 200, headers: audioHeaders });
  }
  try {
    const r = await fetch("https://vbee.vn/api/v1/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + String(env.VBEE_TOKEN).trim() },
      body: JSON.stringify({ app_id: String(env.VBEE_APP_ID).trim(), response_type: "direct", input_text: text,
        voice_code: voice, audio_type: "mp3", bitrate: 128, speed_rate: "0.9" })
    });
    const j = await r.json().catch(() => ({}));
    const link = j.result && j.result.audio_link;
    if (!r.ok || !link) return json({ error: "Vbee lỗi " + r.status }, 502, h);
    const a = await fetch(link);
    if (!a.ok) return json({ error: "Không tải được giọng đọc" }, 502, h);
    const buf = await a.arrayBuffer();
    if (cache && ctx) ctx.waitUntil(cache.put(key, new Response(buf, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=2592000" } })));
    return new Response(buf, { status: 200, headers: audioHeaders });
  } catch (e) {
    return json({ error: "Không gọi được Vbee" }, 502, h);
  }
}

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const h = cors(origin, allowed);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/") return json({ ok: true, name: "ong-ba-ke-ai" }, 200, h);
    if (req.method !== "POST" || !["/chat", "/asr", "/tts"].includes(url.pathname)) return json({ error: "Không tìm thấy" }, 404, h);
    if (allowed.length && !allowed.includes(origin)) return json({ error: "Trang này không được phép dùng trạm AI" }, 403, h);
    if (!env.DASHSCOPE_API_KEY) return json({ error: "Trạm chưa có API key" }, 500, h);

    // giới hạn lượt gọi
    const ip = req.headers.get("CF-Connecting-IP") || "x";
    const now = Date.now();
    const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
    if (list.length >= LIMIT_PER_MIN) return json({ error: "Nhiều lượt quá, cháu chờ một chút nhé" }, 429, h);
    list.push(now); hits.set(ip, list);
    if (hits.size > 5000) hits.clear();

    let body;
    try { body = await req.json(); } catch { return json({ error: "Dữ liệu không hợp lệ" }, 400, h); }
    const base = (env.DASHSCOPE_BASE || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1").replace(/\/+$/, "");
    if (url.pathname === "/asr") return asr(body, env, base, h);
    if (url.pathname === "/tts") return tts(body, env, h, ctx);
    const persona = body.persona === "ba" ? "ba" : "ong";
    const msgs = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 400) }));
    if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ error: "Thiếu câu của cháu" }, 400, h);

    try {
      const r = await fetch(base + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + String(env.DASHSCOPE_API_KEY).trim() },
        body: JSON.stringify({
          model: env.MODEL || "qwen-plus",
          messages: [{ role: "system", content: SYSTEM(persona) }, ...msgs],
          max_tokens: 200,
          temperature: 0.7
        })
      });
      const j = await r.json();
      if (!r.ok) return json({ error: (j.error && j.error.message) || "AI lỗi " + r.status }, 502, h);
      const reply = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || "").trim();
      if (!reply) return json({ error: "AI không trả lời" }, 502, h);
      return json({ reply }, 200, h);
    } catch (e) {
      return json({ error: "Không gọi được AI" }, 502, h);
    }
  }
};
