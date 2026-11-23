"""
Tạo file giọng đọc (mp3) bằng Vbee AIVoice (giọng tiếng Việt miền Bắc, có bản quyền theo gói Vbee).

Mã Vbee KHÔNG được ghi vào mã nguồn hay kho mã. Đặt qua biến môi trường:

  export VBEE_APP_ID=...    # App ID ở trang API Integration của Vbee
  export VBEE_TOKEN=...     # Token ở cùng trang
  node tools/list-speech.js > speech.json
  python3 tools/gen-audio-vbee.py speech.json            # chỉ tạo câu chưa có
  python3 tools/gen-audio-vbee.py speech.json --force    # tạo lại tất cả

Sau khi chạy, audio-manifest.js được cập nhật.
"""
import json, os, sys, time, urllib.request, urllib.error, concurrent.futures as cf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
API = "https://vbee.vn/api/v1/tts"
# Ông: Anh Khôi (giọng nam lớn tuổi, trầm ấm, kể chuyện). Bà: Mai Phương (giọng nữ trung niên ấm áp).
VOICES = {
    "ong": dict(voice_code=os.environ.get("VBEE_VOICE_ONG", "hn_male_phuthang_stor80dt_48k-fhg"), speed_rate="0.9"),
    "ba":  dict(voice_code=os.environ.get("VBEE_VOICE_BA", "hn_female_maiphuong_vdts_48k-fhg"), speed_rate="0.9"),
}
APP_ID = os.environ.get("VBEE_APP_ID", "")
TOKEN = os.environ.get("VBEE_TOKEN", "")


def call(url, data=None):
    req = urllib.request.Request(url, data=json.dumps(data).encode() if data else None,
                                 headers={"Content-Type": "application/json", "Authorization": "Bearer " + TOKEN},
                                 method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def synth(text, cfg):
    body = dict(app_id=APP_ID, response_type="indirect", callback_url="https://example.com/vbee-callback",
                input_text=text, voice_code=cfg["voice_code"], audio_type="mp3", bitrate=128,
                speed_rate=cfg["speed_rate"])
    res = call(API, body)
    rid = (res.get("result") or {}).get("request_id")
    if not rid:
        raise RuntimeError(f"không tạo được yêu cầu: {res}")
    for _ in range(90):
        time.sleep(2)
        r = (call(f"{API}/{rid}").get("result") or {})
        if r.get("status") == "SUCCESS" and r.get("audio_link"):
            return r["audio_link"]
        if r.get("status") == "FAILURE":
            raise RuntimeError(f"Vbee báo lỗi: {r}")
    raise TimeoutError("quá lâu chưa xong")


def one(item, path, cfg):
    for attempt in range(3):
        try:
            link = synth(item["text"], cfg)
            tmp = path + ".part"
            urllib.request.urlretrieve(link, tmp)
            if os.path.getsize(tmp) > 1000:
                os.replace(tmp, path)
                return True
        except Exception as e:
            print("  thử lại:", item["text"][:40], e)
            time.sleep(3 * (attempt + 1))
    return False


def main(src, force):
    if not APP_ID or not TOKEN:
        sys.exit("Thiếu VBEE_APP_ID hoặc VBEE_TOKEN trong biến môi trường.")
    lists = json.load(open(src, encoding="utf-8"))
    manifest = {}
    for persona, cfg in VOICES.items():
        d = os.path.join(ROOT, "audio", persona)
        os.makedirs(d, exist_ok=True)
        todo = [it for it in lists[persona]
                if force or not os.path.exists(os.path.join(d, it["key"] + ".mp3"))]
        print(persona, "cần tạo", len(todo), "câu")
        with cf.ThreadPoolExecutor(3) as ex:
            oks = list(ex.map(lambda it: one(it, os.path.join(d, it["key"] + ".mp3"), cfg), todo))
        failed = [it["text"] for it, ok in zip(todo, oks) if not ok]
        if failed:
            print(persona, "lỗi", len(failed), failed[:5])
        manifest[persona] = sorted(it["key"] for it in lists[persona]
                                   if os.path.exists(os.path.join(d, it["key"] + ".mp3")))
        print(persona, "có", len(manifest[persona]), "/", len(lists[persona]), "câu")
    with open(os.path.join(ROOT, "audio-manifest.js"), "w", encoding="utf-8") as f:
        f.write("// Tự sinh bởi tools/gen-audio-vbee.py – danh sách câu đã có file giọng đọc\n")
        f.write("window.OBK_AUDIO = " + json.dumps(manifest) + ";\n")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "speech.json", "--force" in sys.argv)
