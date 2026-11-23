/* Hình minh họa Ông và Bà (SVG tự vẽ). Lớp .mouth cử động khi đang nói, .eyes chớp mắt. */
window.OBK_SVG = {
  ong: `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ông">
  <circle cx="100" cy="100" r="98" fill="#fde3a7"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#e9b949" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>
  <path d="M34 200 C38 152 66 136 100 136 C134 136 162 152 166 200Z" fill="#8a5a2b"/>
  <path d="M84 138 L100 160 L116 138Z" fill="#f7e9d0"/>
  <circle cx="100" cy="172" r="3" fill="#e9b949"/><circle cx="100" cy="186" r="3" fill="#e9b949"/>
  <rect x="88" y="122" width="24" height="20" rx="8" fill="#e8b88f"/>
  <ellipse cx="57" cy="96" rx="9" ry="12" fill="#e8b88f"/>
  <ellipse cx="143" cy="96" rx="9" ry="12" fill="#e8b88f"/>
  <ellipse cx="100" cy="90" rx="43" ry="47" fill="#f3c9a1"/>
  <ellipse cx="86" cy="56" rx="14" ry="7" fill="#fff" opacity=".45"/>
  <path d="M58 92 C52 70 60 58 72 56 C68 66 66 78 68 92Z" fill="#f4f1ea"/>
  <path d="M142 92 C148 70 140 58 128 56 C132 66 134 78 132 92Z" fill="#f4f1ea"/>
  <path d="M74 76 Q84 70 94 76" stroke="#f4f1ea" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M106 76 Q116 70 126 76" stroke="#f4f1ea" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g class="eyes">
    <ellipse cx="84" cy="90" rx="4.5" ry="5" fill="#3b2a1e"/>
    <ellipse cx="116" cy="90" rx="4.5" ry="5" fill="#3b2a1e"/>
  </g>
  <circle cx="84" cy="90" r="13" fill="none" stroke="#6b4423" stroke-width="3"/>
  <circle cx="116" cy="90" r="13" fill="none" stroke="#6b4423" stroke-width="3"/>
  <path d="M97 90 Q100 87 103 90" stroke="#6b4423" stroke-width="3" fill="none"/>
  <circle cx="74" cy="108" r="7" fill="#f29b8c" opacity=".55"/>
  <circle cx="126" cy="108" r="7" fill="#f29b8c" opacity=".55"/>
  <path d="M80 114 C82 136 92 150 100 152 C108 150 118 136 120 114 C112 122 88 122 80 114Z" fill="#f4f1ea"/>
  <ellipse class="mouth" cx="100" cy="121" rx="7" ry="3" fill="#8b3a2e"/>
  <path d="M82 114 Q92 108 100 114 Q108 108 118 114 Q108 118 100 116 Q92 118 82 114Z" fill="#fff"/>
  <path d="M96 100 Q100 106 104 100" stroke="#c98d68" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`,
  ba: `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bà">
  <circle cx="100" cy="100" r="98" fill="#f9d9cf"/>
  <circle cx="100" cy="100" r="98" fill="none" stroke="#e58b7a" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>
  <path d="M34 200 C38 152 66 136 100 136 C134 136 162 152 166 200Z" fill="#8e4a7a"/>
  <path d="M88 138 Q100 150 112 138" stroke="#6d3560" stroke-width="3" fill="none"/>
  <circle cx="86" cy="170" r="3" fill="#f2b632"/><circle cx="114" cy="170" r="3" fill="#f2b632"/>
  <path d="M60 175 Q72 168 80 180" stroke="#b0679d" stroke-width="3" fill="none"/>
  <path d="M140 175 Q128 168 120 180" stroke="#b0679d" stroke-width="3" fill="none"/>
  <rect x="88" y="122" width="24" height="20" rx="8" fill="#e8b88f"/>
  <circle cx="100" cy="34" r="20" fill="#a7a19a"/>
  <path d="M90 28 Q100 22 110 28" stroke="#c9c3bb" stroke-width="3" fill="none"/>
  <rect x="94" y="14" width="3" height="22" rx="1.5" fill="#c58b3a" transform="rotate(25 95 25)"/>
  <ellipse cx="57" cy="96" rx="9" ry="12" fill="#e8b88f"/>
  <ellipse cx="143" cy="96" rx="9" ry="12" fill="#e8b88f"/>
  <circle cx="56" cy="110" r="4" fill="#f2b632"/>
  <circle cx="144" cy="110" r="4" fill="#f2b632"/>
  <ellipse cx="100" cy="92" rx="42" ry="46" fill="#f3c9a1"/>
  <path d="M57 92 C54 58 76 44 100 44 C124 44 146 58 143 92 C136 72 122 62 100 62 C80 62 64 72 57 92Z" fill="#a7a19a"/>
  <path d="M100 46 C92 54 88 60 86 64" stroke="#8f8983" stroke-width="2.5" fill="none"/>
  <path d="M100 46 C108 54 112 60 114 64" stroke="#8f8983" stroke-width="2.5" fill="none"/>
  <path d="M76 80 Q84 76 92 80" stroke="#7a7068" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M108 80 Q116 76 124 80" stroke="#7a7068" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <g class="eyes">
    <ellipse cx="84" cy="93" rx="4.5" ry="5" fill="#3b2a1e"/>
    <ellipse cx="116" cy="93" rx="4.5" ry="5" fill="#3b2a1e"/>
  </g>
  <path d="M76 99 Q80 102 84 101" stroke="#d9a07e" stroke-width="2" fill="none"/>
  <path d="M124 99 Q120 102 116 101" stroke="#d9a07e" stroke-width="2" fill="none"/>
  <circle cx="74" cy="110" r="8" fill="#f2877a" opacity=".55"/>
  <circle cx="126" cy="110" r="8" fill="#f2877a" opacity=".55"/>
  <path d="M96 102 Q100 108 104 102" stroke="#c98d68" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M86 116 Q100 128 114 116" stroke="#b5513f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth" cx="100" cy="120" rx="6" ry="2.5" fill="#8b3a2e"/>
</svg>`
};
