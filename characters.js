/*
 * Hình minh họa Ông và Bà, vẽ đời thường như ông bà thật của các cháu hôm nay
 * (ông tóc bạc, kính tròn, áo len; bà tóc uốn muối tiêu, áo bà ba hoa),
 * giữ nét tranh dân gian Đông Hồ:
 * nét viền đậm, màu phẳng đỏ – vàng – xanh trên nền giấy điệp.
 * Các lớp dùng cho cử động:
 *   .head        – đầu (nghiêng khi nghe, gật khi nhắc lại, nhún khi vui)
 *   .eyes-open   – mắt thường (chớp mắt)
 *   .eyes-happy  – mắt cười (hiện khi cháu trả lời đúng)
 *   .mouth       – miệng (mấp máy khi đang nói)
 *   .hands       – hai tay vỗ (vui)   .ear-hand – tay khum sau tai (nghe)
 *   .ponder      – bong bóng "à…" (nghĩ, khi cháu nói chưa đúng)
 */
(function () {
  const INK = "#2b1d14";
  const frame = (ring, accent) => `
  <defs>
    <pattern id="diep-${ring.slice(1)}" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="#f6e9c9"/>
      <circle cx="2" cy="3" r=".7" fill="#e3cf9f"/><circle cx="7" cy="8" r=".6" fill="#eadcb4"/>
      <circle cx="8" cy="2" r=".5" fill="#fff6dc"/>
    </pattern>
    <clipPath id="clip-${ring.slice(1)}"><circle cx="100" cy="100" r="92"/></clipPath>
  </defs>
  <circle cx="100" cy="100" r="96" fill="${ring}"/>
  <circle cx="100" cy="100" r="92" fill="url(#diep-${ring.slice(1)})"/>
  <g clip-path="url(#clip-${ring.slice(1)})">
    <path d="M18 70 q8 -10 18 -4 q4 -10 14 -6 q-2 8 -10 8 q-6 8 -22 2z" fill="${accent}" opacity=".55"/>
    <path d="M150 52 q8 -10 18 -4 q4 -10 14 -6 q-2 8 -10 8 q-6 8 -22 2z" fill="${accent}" opacity=".55"/>
    <circle cx="165" cy="120" r="5" fill="${accent}" opacity=".35"/><circle cx="32" cy="128" r="4" fill="${accent}" opacity=".35"/>
    __BODY__
  </g>
  <circle cx="100" cy="100" r="92" fill="none" stroke="${INK}" stroke-width="3"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="1 6" stroke-linecap="round"/>`;

  const eyes = (y) => `
    <g class="eyes-open">
      <ellipse cx="85" cy="${y}" rx="3.6" ry="4.4" fill="${INK}"/>
      <ellipse cx="115" cy="${y}" rx="3.6" ry="4.4" fill="${INK}"/>
      <circle cx="86.2" cy="${y - 1.4}" r="1.1" fill="#fff"/><circle cx="116.2" cy="${y - 1.4}" r="1.1" fill="#fff"/>
    </g>
    <g class="eyes-happy">
      <path d="M79 ${y + 1} Q85 ${y - 6} 91 ${y + 1}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M109 ${y + 1} Q115 ${y - 6} 121 ${y + 1}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>`;


  /* Tay vỗ (vui), tay khum sau tai (đang nghe), dấu "à…" (nghĩ, khi cháu nói chưa đúng) */
  const hand = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip} 1)">
      <path d="M-9 8 C-12 -2 -8 -12 0 -13 C8 -12 11 -3 8 8Z" fill="#efbf90" stroke="${INK}" stroke-width="2.2"/>
      <path d="M-4 -6 L-4 2 M1 -8 L1 2 M5 -6 L5 2" stroke="#c98f63" stroke-width="1.3" stroke-linecap="round"/>
    </g>`;
  const extras = (sleeve) => `
    <g class="hands">
      <path d="M58 206 C62 190 70 184 82 180 L88 180 C78 190 72 200 70 206Z" fill="${sleeve}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M142 206 C138 190 130 184 118 180 L112 180 C122 190 128 200 130 206Z" fill="${sleeve}" stroke="${INK}" stroke-width="2.5"/>
      <g class="hand-l">${hand(90, 170, 1)}</g>
      <g class="hand-r">${hand(110, 170, -1)}</g>
      <g class="clap-spark" stroke="#e9b949" stroke-width="3" stroke-linecap="round">
        <path d="M100 150 L100 140 M86 154 L80 146 M114 154 L120 146"/>
      </g>
    </g>`;

  const ponder = `
    <g class="ponder">
      <path d="M136 14 h40 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-26 l-8 8 v-8 h-6 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8z" fill="#fffaf0" stroke="${INK}" stroke-width="2.5"/>
      <text x="156" y="38" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="17" fill="#b3261e">à…</text>
    </g>`;
  const earHand = (sleeve) => `
      <g class="ear-hand">
        <g class="sound-arcs" stroke="#b3261e" stroke-width="3.5" fill="none" stroke-linecap="round">
          <path d="M164 88 q6 10 0 20"/><path d="M171 82 q10 16 0 32"/>
        </g>
        <path d="M150 140 C148 126 148 116 150 108 L158 110 C158 120 160 130 164 140Z" fill="${sleeve}" stroke="${INK}" stroke-width="2.2"/>
        <path d="M144 112 C142 100 144 86 152 82 C160 84 160 96 158 112Z" fill="#efbf90" stroke="${INK}" stroke-width="2.2"/>
        <path d="M148 92 q4 -2 7 1 M147 99 q4 -2 8 1" stroke="#c98f63" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      </g>`;

  /* ---------- Ông, đời thường: tóc bạc ngắn, kính tròn, ria bạc, sơ mi + áo len ---------- */
  const ong = frame("#b3261e", "#e9b949").replace("__BODY__", `
    <!-- áo len cài khuy, sơ mi trắng bên trong -->
    <path d="M26 206 C30 156 62 134 100 134 C138 134 170 156 174 206Z" fill="#4f6391" stroke="${INK}" stroke-width="3"/>
    <path d="M80 136 L100 184 L120 136Z" fill="#fdf6e3" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M86 132 L100 150 L78 150Z" fill="#fffdf6" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M114 132 L100 150 L122 150Z" fill="#fffdf6" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="100" cy="194" r="3" fill="#d99a1c" stroke="${INK}" stroke-width="1.3"/>
    <path d="M56 176 q8 -4 14 2 M144 176 q-8 -4 -14 2" stroke="#3b4c78" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M62 196 h10 M128 196 h10" stroke="#3b4c78" stroke-width="2" stroke-linecap="round"/>
    <rect x="90" y="118" width="20" height="16" rx="6" fill="#e2ad7f" stroke="${INK}" stroke-width="2"/>
    <g class="head">
      <ellipse cx="62" cy="98" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="138" cy="98" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="100" cy="94" rx="38" ry="42" fill="#f4c99c" stroke="${INK}" stroke-width="3"/>
      <!-- tóc bạc ngắn, trán hói nhẹ -->
      <path d="M61 96 C56 66 74 50 100 50 C126 50 144 66 139 96 C136 84 132 76 126 72 C118 64 108 62 100 62 C92 62 82 64 74 72 C68 76 64 84 61 96Z" fill="#ece7de" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M70 68 q6 -6 12 -6 M118 62 q8 2 12 8 M92 56 q8 -2 16 0" stroke="#b9b1a4" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- nếp trán -->
      <path d="M86 72 q14 -4 28 0" stroke="#d29a6e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <!-- lông mày bạc rậm -->
      <path d="M73 80 Q83 74 94 79" stroke="#9a9286" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M106 79 Q117 74 127 80" stroke="#9a9286" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${eyes(94)}
      <!-- kính tròn -->
      <g fill="none" stroke="${INK}" stroke-width="2.4">
        <circle cx="85" cy="94" r="11.5" fill="#fff" fill-opacity=".22"/>
        <circle cx="115" cy="94" r="11.5" fill="#fff" fill-opacity=".22"/>
        <path d="M96.5 92 Q100 88.5 103.5 92"/>
        <path d="M73.5 92 L63 89 M126.5 92 L137 89"/>
      </g>
      <path d="M78 88 l4 -3 M108 88 l4 -3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
      <circle cx="73" cy="110" r="6.5" fill="#e0533f" opacity=".42"/>
      <circle cx="127" cy="110" r="6.5" fill="#e0533f" opacity=".42"/>
      <path d="M97 99 Q100 109 104 105" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- miệng cười + ria bạc ngắn -->
      <path d="M88 119 Q100 129 112 119" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse class="mouth" cx="100" cy="121.5" rx="5.5" ry="2.4" fill="#8b2e22" stroke="${INK}" stroke-width="1.2"/>
      <path d="M100 113 C94 110 86 111 82 116 C88 116 95 117 100 116 C105 117 112 116 118 116 C114 111 106 110 100 113Z" fill="#ece7de" stroke="${INK}" stroke-width="1.8"/>
      <path d="M83 124 q-3 3 -2 7 M117 124 q3 3 2 7" stroke="#d29a6e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      ${earHand("#4f6391")}
    </g>
    ${extras("#4f6391")}`) + ponder;

  /* ---------- Bà, đời thường: tóc uốn muối tiêu, áo bà ba hoa nhỏ, dây chuyền ngọc ---------- */
  /* tóc uốn: vòng xoăn viền ngoài + khối tóc phủ lên, mái xoăn trên trán */
  const HAIR = "#8f877e", HL = "#cfc8bd";
  const rim = [[57,110],[54,94],[57,78],[64,64],[75,53],[89,46],[100,44],[111,46],[125,53],[136,64],[143,78],[146,94],[143,110]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9.5" fill="${HAIR}" stroke="${INK}" stroke-width="2.4"/>`).join("");
  const hairBack = rim + `<path d="M60 112 C52 92 54 64 76 54 C88 48 112 48 124 54 C146 64 148 92 140 112Z" fill="${HAIR}"/>`;
  const fringe = `<path d="M64 94 Q63 80 74 79 Q77 69 88 71 Q93 63 102 66 Q110 62 115 70 Q126 69 127 79 Q137 81 136 94 C136 64 120 52 100 52 C80 52 64 64 64 94Z" fill="${HAIR}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <g stroke="${HL}" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M80 74 q4 -4 8 0"/><path d="M97 67 q4 -4 8 0"/><path d="M114 73 q4 -4 8 0"/>
        <path d="M66 62 q4 -4 8 0"/><path d="M90 50 q4 -4 8 0"/><path d="M112 50 q4 -4 8 0"/><path d="M128 60 q4 -4 8 0"/>
        <path d="M56 92 q3 -4 7 -1"/><path d="M138 90 q3 -4 7 -1"/>
      </g>`;
  const ba = frame("#3f7d4e", "#c0392b").replace("__BODY__", `
    <defs>
      <pattern id="hoa-baba" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#c9667f"/>
        <g fill="#fbe3e9"><circle cx="4" cy="4" r="1.4"/><circle cx="6.4" cy="4" r="1.4"/><circle cx="5.2" cy="2" r="1.4"/><circle cx="5.2" cy="6" r="1.4"/></g>
        <circle cx="5.2" cy="4" r="1" fill="#e9b949"/>
        <g fill="#fbe3e9"><circle cx="12" cy="12" r="1.2"/><circle cx="14" cy="12" r="1.2"/><circle cx="13" cy="10.4" r="1.2"/><circle cx="13" cy="13.6" r="1.2"/></g>
        <circle cx="13" cy="12" r=".8" fill="#e9b949"/>
      </pattern>
    </defs>
    <!-- áo bà ba hoa nhỏ, cổ tròn, hàng khuy giữa -->
    <path d="M26 206 C30 156 62 134 100 134 C138 134 170 156 174 206Z" fill="url(#hoa-baba) #c9667f" stroke="${INK}" stroke-width="3"/>
    <path d="M84 134 Q100 148 116 134" fill="#e2ad7f" stroke="${INK}" stroke-width="2.4"/>
    <path d="M100 146 L100 206" stroke="${INK}" stroke-width="2" opacity=".55"/>
    <g fill="#fdf6e3" stroke="${INK}" stroke-width="1.2"><circle cx="100" cy="160" r="2.4"/><circle cx="100" cy="176" r="2.4"/><circle cx="100" cy="192" r="2.4"/></g>
    <!-- dây chuyền mặt ngọc -->
    <path d="M87 135 Q100 152 113 135" stroke="#d99a1c" stroke-width="1.6" fill="none"/>
    <path d="M100 145 q-4 5 0 10 q4 -5 0 -10z" fill="#4f9a5e" stroke="${INK}" stroke-width="1.3"/>
    <rect x="90" y="118" width="20" height="16" rx="6" fill="#e2ad7f" stroke="${INK}" stroke-width="2"/>
    <g class="head">
      ${hairBack}
      <ellipse cx="62" cy="101" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="138" cy="101" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="61" cy="114" r="3.4" fill="#4f9a5e" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="139" cy="114" r="3.4" fill="#4f9a5e" stroke="${INK}" stroke-width="1.5"/>
      <ellipse cx="100" cy="97" rx="36" ry="40" fill="#f4c99c" stroke="${INK}" stroke-width="3"/>
      ${fringe}
      <path d="M77 85 Q85 80 93 84" stroke="#5d544c" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M107 84 Q115 80 123 85" stroke="#5d544c" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      ${eyes(96)}
      <!-- vết chân chim khi cười -->
      <path d="M72 94 l-4 -2 M72 98 l-4 1 M128 94 l4 -2 M128 98 l4 1" stroke="#cf9a74" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="75" cy="111" r="7" fill="#e0533f" opacity=".45"/>
      <circle cx="125" cy="111" r="7" fill="#e0533f" opacity=".45"/>
      <path d="M97 100 Q100 110 104 106" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M86 117 Q100 129 114 117" stroke="${INK}" stroke-width="2.5" fill="#d0574a" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse class="mouth" cx="100" cy="121" rx="5.5" ry="2.4" fill="#8b2e22" stroke="${INK}" stroke-width="1.2"/>
      ${earHand("#c9667f")}
    </g>
    ${extras("#c9667f")}`) + ponder;

  window.OBK_SVG = {
    ong: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ông">${ong}</svg>`,
    ba: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bà">${ba}</svg>`
  };
})();
