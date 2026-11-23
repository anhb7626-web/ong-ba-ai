"""
Tạo file giọng đọc (mp3) bằng giọng Microsoft Neural: Nam Minh (Ông), Hoài My (Bà).
Dùng thư viện edge-tts (dịch vụ đọc to của trình duyệt Edge, không chính thức, hợp cho demo phi thương mại).

  pip install edge-tts
  node tools/list-speech.js > speech.json
  python3 tools/gen-audio-edge.py speech.json

Câu đã có file sẽ được bỏ qua. Sau khi chạy, audio-manifest.js được cập nhật.
"""
import asyncio, json, os, sys
import edge_tts

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
VOICES = {
    "ong": dict(voice="vi-VN-NamMinhNeural", rate="-12%", pitch="-6Hz"),
    "ba":  dict(voice="vi-VN-HoaiMyNeural",  rate="-10%", pitch="-3Hz"),
}
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")

async def one(text, path, cfg, sem):
    async with sem:
        for attempt in range(4):
            try:
                c = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"], proxy=PROXY)
                tmp = path + ".part"
                await c.save(tmp)
                if os.path.getsize(tmp) > 1000:
                    os.replace(tmp, path)
                    return True
            except Exception as e:
                print("  thử lại:", text, e)
            await asyncio.sleep(2 * (attempt + 1))
        return False

async def main(src):
    lists = json.load(open(src, encoding="utf-8"))
    sem = asyncio.Semaphore(4)
    manifest = {}
    for persona, cfg in VOICES.items():
        d = os.path.join(ROOT, "audio", persona)
        os.makedirs(d, exist_ok=True)
        jobs = []
        for item in lists[persona]:
            path = os.path.join(d, item["key"] + ".mp3")
            if not os.path.exists(path):
                jobs.append((item, one(item["text"], path, cfg, sem)))
        results = await asyncio.gather(*[j for _, j in jobs])
        failed = [it["text"] for (it, _), ok in zip(jobs, results) if not ok]
        if failed: print(persona, "lỗi", len(failed), failed[:5])
        manifest[persona] = sorted(it["key"] for it in lists[persona]
                                   if os.path.exists(os.path.join(d, it["key"] + ".mp3")))
        print(persona, "có", len(manifest[persona]), "/", len(lists[persona]), "câu")
    with open(os.path.join(ROOT, "audio-manifest.js"), "w", encoding="utf-8") as f:
        f.write("// Tự sinh bởi tools/gen-audio-edge.py – danh sách câu đã có file giọng đọc\n")
        f.write("window.OBK_AUDIO = " + json.dumps(manifest) + ";\n")

asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "speech.json"))
