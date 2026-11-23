/*
 * Hình minh họa Ông và Bà (SVG tự vẽ, lấy cảm hứng tranh dân gian Đông Hồ:
 * nét viền đậm, màu phẳng đỏ – vàng – xanh trên nền giấy điệp).
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
      <text x="156" y="38" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="#b3261e">à…</text>
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

  const ong = frame("#b3261e", "#e9b949").replace("__BODY__", `
    <!-- áo dài the, cổ trắng -->
    <path d="M26 206 C30 156 62 134 100 134 C138 134 170 156 174 206Z" fill="#2f3e66" stroke="${INK}" stroke-width="3"/>
    <path d="M100 136 C114 150 128 160 146 168" stroke="${INK}" stroke-width="2.5" fill="none"/>
    <circle cx="122" cy="154" r="2.6" fill="#e9b949" stroke="${INK}" stroke-width="1"/>
    <circle cx="136" cy="162" r="2.6" fill="#e9b949" stroke="${INK}" stroke-width="1"/>
    <path d="M58 170 q10 -6 18 4 M142 186 q-8 -8 -18 0" stroke="#4b5b88" stroke-width="2" fill="none"/>
    <path d="M84 134 Q100 148 116 134 L113 127 Q100 139 87 127Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <rect x="90" y="118" width="20" height="16" rx="6" fill="#e2ad7f" stroke="${INK}" stroke-width="2"/>
    <g class="head">
      <ellipse cx="62" cy="98" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="138" cy="98" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="100" cy="94" rx="38" ry="42" fill="#f4c99c" stroke="${INK}" stroke-width="3"/>
      <!-- khăn xếp -->
      <path d="M60 82 C58 52 78 38 100 38 C122 38 142 52 140 82 C128 72 114 69 100 69 C86 69 72 72 60 82Z" fill="#1f1a17" stroke="${INK}" stroke-width="3"/>
      <path d="M64 70 C78 58 122 58 136 70" stroke="#5a4c42" stroke-width="2.2" fill="none"/>
      <path d="M68 60 C82 50 118 50 132 60" stroke="#5a4c42" stroke-width="2.2" fill="none"/>
      <path d="M76 50 C88 44 112 44 124 50" stroke="#5a4c42" stroke-width="2.2" fill="none"/>
      <!-- lông mày bạc -->
      <path d="M74 84 Q84 76 94 82" stroke="#fffaf0" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M74 84 Q84 76 94 82" stroke="${INK}" stroke-width="1" fill="none" opacity=".4"/>
      <path d="M106 82 Q116 76 126 84" stroke="#fffaf0" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M106 82 Q116 76 126 84" stroke="${INK}" stroke-width="1" fill="none" opacity=".4"/>
      ${eyes(94)}
      <circle cx="74" cy="108" r="6.5" fill="#e0533f" opacity=".45"/>
      <circle cx="126" cy="108" r="6.5" fill="#e0533f" opacity=".45"/>
      <path d="M97 98 Q100 108 104 104" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- râu dài -->
      <path d="M82 116 C80 140 92 160 100 176 C108 160 120 140 118 116 C110 124 90 124 82 116Z" fill="#fffaf0" stroke="${INK}" stroke-width="2.5"/>
      <path d="M92 132 Q96 148 100 160 M108 132 Q104 148 100 160" stroke="#d8cfc0" stroke-width="1.5" fill="none"/>
      <ellipse class="mouth" cx="100" cy="121" rx="6" ry="2.6" fill="#8b2e22" stroke="${INK}" stroke-width="1.2"/>
      <path d="M100 114 C94 110 84 112 78 118 C86 116 94 118 100 117 C106 118 114 116 122 118 C116 112 106 110 100 114Z" fill="#fffaf0" stroke="${INK}" stroke-width="2"/>
      ${earHand("#2f3e66")}
    </g>
    ${extras("#2f3e66")}`) + ponder;

  const ba = frame("#3f7d4e", "#c0392b").replace("__BODY__", `
    <!-- áo tứ thân, yếm đỏ, thắt lưng xanh -->
    <path d="M26 206 C30 156 62 134 100 134 C138 134 170 156 174 206Z" fill="#8a5a2b" stroke="${INK}" stroke-width="3"/>
    <path d="M86 134 L100 166 L114 134Z" fill="#c0392b" stroke="${INK}" stroke-width="2.5"/>
    <path d="M70 140 C80 160 88 176 92 206 M130 140 C120 160 112 176 108 206" stroke="${INK}" stroke-width="2.5" fill="none"/>
    <path d="M60 186 Q100 176 140 186 L142 196 Q100 186 58 196Z" fill="#4f9a5e" stroke="${INK}" stroke-width="2.5"/>
    <rect x="90" y="118" width="20" height="16" rx="6" fill="#e2ad7f" stroke="${INK}" stroke-width="2"/>
    <g class="head">
      <ellipse cx="62" cy="100" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="138" cy="100" rx="7" ry="10" fill="#efbf90" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="61" cy="114" r="3.6" fill="#e9b949" stroke="${INK}" stroke-width="1.5"/>
      <circle cx="139" cy="114" r="3.6" fill="#e9b949" stroke="${INK}" stroke-width="1.5"/>
      <ellipse cx="100" cy="96" rx="37" ry="41" fill="#f4c99c" stroke="${INK}" stroke-width="3"/>
      <!-- tóc bạc ở thái dương -->
      <path d="M64 92 C64 78 70 72 78 70 M136 92 C136 78 130 72 122 70" stroke="#c9c2b8" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- khăn mỏ quạ -->
      <path d="M58 90 C54 60 74 42 100 40 C126 42 146 60 142 90 C136 78 120 70 106 68 L100 58 L94 68 C80 70 64 78 58 90Z" fill="#1f1a17" stroke="${INK}" stroke-width="3"/>
      <path d="M86 44 L100 18 L114 44Z" fill="#1f1a17" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M70 66 C84 54 116 54 130 66" stroke="#4a3f38" stroke-width="2" fill="none"/>
      <path d="M76 86 Q85 80 93 84" stroke="#6f655c" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M107 84 Q115 80 124 86" stroke="#6f655c" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      ${eyes(96)}
      <path d="M77 103 Q81 106 85 104 M123 103 Q119 106 115 104" stroke="#cf9a74" stroke-width="1.6" fill="none"/>
      <circle cx="74" cy="111" r="7" fill="#e0533f" opacity=".45"/>
      <circle cx="126" cy="111" r="7" fill="#e0533f" opacity=".45"/>
      <path d="M97 100 Q100 110 104 106" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M86 117 Q100 129 114 117" stroke="${INK}" stroke-width="2.5" fill="#c0392b" stroke-linecap="round"/>
      <ellipse class="mouth" cx="100" cy="121" rx="5.5" ry="2.4" fill="#8b2e22" stroke="${INK}" stroke-width="1.2"/>
      ${earHand("#8a5a2b")}
    </g>
    ${extras("#8a5a2b")}`) + ponder;

  window.OBK_SVG = {
    ong: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ông">${ong}</svg>`,
    ba: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bà">${ba}</svg>`
  };
})();
