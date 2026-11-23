# Ông Bà Kể 🏮

Trợ lý luyện nói tiếng Việt cho trẻ em gốc Việt 6–12 tuổi ở nước ngoài (thế hệ 2–3).
Mô hình minh họa cho bài tham luận tại Diễn đàn Tiếng Việt toàn cầu 2026.

Web app tĩnh (HTML/CSS/JS), không cần máy chủ, chạy trên GitHub Pages.

## Tính năng

- Chọn nhân vật **Ông** hoặc **Bà** (hình SVG tự vẽ, có chớp mắt, mấp máy miệng khi nói).
- 4 chế độ: **Kể chuyện cổ tích**, **Trò chuyện hằng ngày**, **Đồng dao – ca dao**, **Đố vui văn hóa**.
- Trẻ trả lời bằng **bấm chọn**, **gõ chữ** (gõ không dấu vẫn được) hoặc **nói** (🎤).
- Khi trẻ sai, ông bà **không chê** mà nhắc lại câu đúng một cách tự nhiên (recast), rồi khen.
- Đọc to bằng Web Speech API (giọng vi-VN); nhận dạng giọng nói tiếng Việt trên Chrome.
  Trình duyệt không hỗ trợ thì vẫn dùng bằng chữ.
- **Xem nghĩa**: từ khó được gạch chân, hiện nghĩa tiếng Anh và tiếng Trung (giản thể + pinyin).
- **Góc phụ huynh**: thời gian luyện, từ mới đã gặp, 3 câu gợi ý hỏi con trong bữa cơm. Lưu bằng localStorage.
- **Mời bé nói lại** câu đúng sau khi được nhắc (uptake), **tô màu chữ sai dấu** khi bé nói hoặc gõ.
- **Sổ nhãn dán** 8 con giống phỏng theo tranh Đông Hồ, mỗi bài học xong nhận một con.
- **Nhạc nền đàn tranh ngũ cung** tự tạo bằng Web Audio, tiếng động, cảnh nền chuyển động, cảnh đêm sau 18 giờ, màn mở đầu kéo rèm.
- **Chạy khi mất mạng** và cài lên màn hình điện thoại (PWA) khi mở qua GitHub Pages.
- **Trò chuyện tự do với AI thật** (Qwen của Aliyun) qua một trạm Cloudflare Worker. Không bật thì app chạy hoàn toàn bằng kịch bản.

## Cấu trúc

| File | Nội dung |
|---|---|
| `index.html` | Khung trang |
| `style.css` | Giao diện |
| `app.js` | Phần xử lý |
| `characters.js` | Hình Ông, Bà (SVG) |
| `data.js` | **Toàn bộ nội dung bài học**: truyện, trò chuyện, đồng dao, câu đố, từ điển |
| `config.js` | Địa chỉ trạm AI |
| `worker/` | Code trạm AI (Cloudflare Worker) |

## Thêm bài mới

Mở `data.js`, chép một bài có sẵn rồi sửa. Hướng dẫn chi tiết nằm ngay đầu file. Ví dụ một lượt hỏi:

```js
{ t: "ask", text: "Ai hiện lên giúp Tấm?",
  choices: ["Bụt", "Dì ghẻ", "Cám"], answer: 0,
  recast: "À, Bụt hiện lên giúp Tấm đấy cháu." }
```

Từ khó thêm vào mục `glossary` ở cuối file, app tự gạch chân ở mọi câu.

## Chạy thử trên máy

Mở `index.html` bằng Chrome là chạy. Muốn dùng micro thì nên chạy qua máy chủ nhỏ:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

## Bật GitHub Pages

Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, thư mục `/ (root)` → Save.
Sau 1–2 phút trang có ở `https://anhb7626-web.github.io/ong-ba-ai/`.

## Gắn AI thật (Qwen – Aliyun) qua Cloudflare Worker

API key **không bao giờ** để trên trang web. Key nằm trong Cloudflare, trang chỉ gọi tới trạm.

### 1. Lấy API key Aliyun

- Tài khoản quốc tế: vào **Alibaba Cloud Model Studio** (alibabacloud.com) → API Key → tạo key.
- Tài khoản Trung Quốc: vào **阿里云百炼 (Bailian)** (aliyun.com) → API-KEY → tạo key.
- Nên đặt hạn mức chi tiêu cho tài khoản để không phát sinh quá.

### 2. Tạo Worker (cách dễ, không cần cài gì)

1. Đăng ký tài khoản miễn phí tại https://dash.cloudflare.com
2. **Workers & Pages → Create → Create Worker** → đặt tên `ong-ba-ke-ai` → **Deploy**.
3. Bấm **Edit code**, xóa code mẫu, dán toàn bộ nội dung `worker/worker.js` → **Deploy**.
4. Vào **Settings → Variables and Secrets**, thêm:
   - `DASHSCOPE_API_KEY` – loại **Secret** – dán key Aliyun.
   - `ALLOWED_ORIGINS` – loại Text – `https://anhb7626-web.github.io`
   - Nếu là tài khoản Aliyun **Trung Quốc**, thêm `DASHSCOPE_BASE` = `https://dashscope.aliyuncs.com/compatible-mode/v1`
     (tài khoản quốc tế thì bỏ qua, mặc định đã đúng).
   - (Tùy chọn) `MODEL` – mặc định `qwen-plus`. Muốn rẻ hơn dùng `qwen-turbo`, muốn hay hơn dùng `qwen-max`.
5. Chép địa chỉ Worker, dạng `https://ong-ba-ke-ai.<tên-bạn>.workers.dev`.

### 3. Nối trang với Worker

Mở `config.js`, dán địa chỉ vào `aiEndpoint`, lưu lại và đẩy lên GitHub.
Trên trang: **⚙️ Cài đặt → Bật trò chuyện tự do với AI → Kiểm tra kết nối**.

Trạm đã có sẵn: chỉ nhận yêu cầu từ trang của bạn, giới hạn 20 lượt/phút mỗi người, câu trả lời ngắn,
dặn AI đóng vai ông/bà, dùng recast, không hỏi thông tin riêng tư của trẻ.
Nếu AI lỗi hoặc mất mạng, app tự mời trẻ quay về bài soạn sẵn.

## Lưu ý trình duyệt

- **Chrome** (máy tính, Android) hỗ trợ đầy đủ đọc to và nhận giọng nói tiếng Việt.
- **Safari / iPhone**: đọc to được nếu máy có giọng tiếng Việt (Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói); nhận giọng nói có thể không ổn định, trẻ vẫn gõ hoặc bấm chọn được.
- Nhận giọng nói của Chrome cần kết nối Internet.

## Giọng đọc

- Mọi câu trong kịch bản đã có file mp3 đọc sẵn trong `audio/` (Ông: giọng Nam Minh, Bà: giọng Hoài My – Microsoft Neural).
  `audio-manifest.js` liệt kê các câu đã có file.
- Câu nào chưa có file (ví dụ câu mới thêm, hoặc câu trả lời của AI) sẽ đọc bằng giọng của trình duyệt.
  Nên mở trang bằng **Microsoft Edge** để có giọng trình duyệt tự nhiên nhất.
- Sau khi thêm bài trong `data.js`, tạo file cho câu mới:

```bash
pip install edge-tts
npm i -D playwright && npx playwright install chromium
node tools/list-speech.js > speech.json
python3 tools/gen-audio-edge.py speech.json
```

  (Hoặc dùng FPT.AI: `FPT_API_KEY=... node tools/gen-audio.js`.)
