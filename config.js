/*
 * CẤU HÌNH AI THẬT
 * Dán địa chỉ trạm Cloudflare Worker của bạn vào aiEndpoint
 * (ví dụ "https://ong-ba-ke-ai.ten-ban.workers.dev").
 * Để trống "" thì app chỉ chạy bằng kịch bản soạn sẵn.
 * KHÔNG dán API key vào đây: key nằm trong Cloudflare, xem README.md.
 */
window.OBK_CONFIG = {
  aiEndpoint: "https://ong-ba-ai.anhb7626.workers.dev",

  /*
   * NHẠC NỀN BẰNG BÀI HÁT THẬT (không bắt buộc)
   * Bỏ file mp3 vào thư mục music/ rồi ghi tên file vào đây, ví dụ:
   *   music: ["music/bac-kim-thang.mp3", "music/inh-la-oi.mp3"]
   * hoặc tách theo chế độ: music: { calm: [...], lively: [...] }
   * Chỉ dùng bài mình có quyền dùng: tự thu (người nhà hát dân ca, đồng dao),
   * hoặc bản ghi được tác giả cho phép. Để trống [] thì app dùng nhạc ngũ cung tự tạo.
   * Hai bản Kìa con bướm vàng: giai điệu dân gian (Frère Jacques), phối và tạo bằng tools/nhac-nen/.
   */
  music: {
    calm: ["music/buom-vang-em.mp3"],   // kể chuyện, trò chuyện, nghe trước giờ ngủ
    lively: ["music/buom-vang-vui.mp3"] // đố vui, đồng dao
  }
};
