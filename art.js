/*
 * Tranh minh họa giao diện (SVG tự vẽ, phong cách tranh dân gian: nét mực đậm, màu phẳng).
 * OBK_ART.hero      – cảnh mái ngói, đèn lồng, giàn bầu ở trang đầu
 * OBK_ART.icon(id)  – tranh nhỏ cho chế độ và từng bài (theo id trong data.js)
 */
(function () {
  const K = "#2b1d14";           // mực
  const R = "#c23b22", Y = "#e8a317", G = "#3f7d4e", B = "#2f4f7f", P = "#e98b8b", W = "#fff8e8", S = "#f4c99c";
  const sw = 'stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const svg = (body, vb = "0 0 64 64") => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

  const lantern = (x, y, s = 1, col = R, delay = 0) => `
    <g class="swing" style="transform-origin:${x}px ${y - 30 * s}px;animation-delay:${delay}s">
    <g transform="translate(${x} ${y}) scale(${s})">
      <ellipse class="glow" cx="0" cy="6" rx="26" ry="24" fill="${Y}" opacity="0"/>
      <line x1="0" y1="-30" x2="0" y2="-12" stroke="${K}" stroke-width="2"/>
      <rect x="-7" y="-14" width="14" height="5" rx="1.5" fill="${Y}" ${sw}/>
      <ellipse cx="0" cy="6" rx="17" ry="16" fill="${col}" ${sw}/>
      <path d="M-9 -7 Q-14 6 -9 19 M0 -10 V22 M9 -7 Q14 6 9 19" stroke="${K}" stroke-width="1.6" fill="none" opacity=".55"/>
      <rect x="-7" y="20" width="14" height="5" rx="1.5" fill="${Y}" ${sw}/>
      <path d="M-3 25 L-4 38 M0 25 V40 M3 25 L4 38" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/>
    </g></g>`;

  const hero = svg(`
    <defs>
      <pattern id="ngoi" width="16" height="10" patternUnits="userSpaceOnUse">
        <rect width="16" height="10" fill="#a4442a"/>
        <path d="M0 10 Q8 0 16 10" fill="#bd5634" stroke="${K}" stroke-width="1.6"/>
      </pattern>
    </defs>
    <rect class="sky" x="0" y="0" width="360" height="150" fill="transparent"/>
    <g class="stars" fill="#fff6d8">
      <circle cx="40" cy="104" r="1.4"/><circle cx="96" cy="128" r="1.1"/><circle cx="180" cy="118" r="1.5"/>
      <circle cx="210" cy="140" r="1"/><circle cx="276" cy="132" r="1.3"/><circle cx="348" cy="112" r="1.2"/>
    </g>
    <g class="sun"><circle cx="300" cy="80" r="30" fill="${Y}" opacity=".22"/><circle cx="300" cy="80" r="20" fill="${Y}" opacity=".35"/></g>
    <g class="moon"><circle cx="300" cy="84" r="18" fill="#fff3c4" ${sw}/><circle cx="294" cy="80" r="3" fill="#ead9a0"/><circle cx="306" cy="90" r="2.2" fill="#ead9a0"/></g>
    <g class="cloud c1"><path d="M0 110 q6 -10 16 -6 q4 -10 16 -6 q10 -2 12 8 q8 2 4 8 h-48 q-6 -2 0 -4z" fill="#fffaf0" ${sw} opacity=".9"/></g>
    <g class="cloud c2"><path d="M0 128 q6 -8 14 -5 q4 -8 13 -4 q8 0 9 7 q6 2 2 6 h-38 q-4 -2 0 -4z" fill="#fffaf0" ${sw} opacity=".8"/></g>
    <!-- giàn bầu -->
    <path d="M14 150 V70 M14 70 H96" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>
    <g class="leaves" fill="${G}" ${sw}>
      <path d="M22 70 c-12 -4 -14 12 -2 14 c4 -2 6 -8 2 -14z"/>
      <path d="M44 70 c-10 -8 -18 6 -8 12 c5 0 8 -6 8 -12z"/>
      <path d="M66 70 c-12 -4 -14 12 -2 14 c4 -2 6 -8 2 -14z"/>
      <path d="M88 70 c-10 -8 -18 6 -8 12 c5 0 8 -6 8 -12z"/>
    </g>
    <g class="gourd"><path d="M52 76 c0 6 -8 8 -8 18 c0 9 6 14 12 14 c6 0 12 -5 12 -14 c0 -10 -8 -12 -8 -18z" fill="#9cc46a" ${sw}/>
    <path d="M56 76 v-6" stroke="${K}" stroke-width="2.5"/></g>
    <!-- mái ngói -->
    <path d="M-10 52 L30 14 H330 L370 52 Z" fill="url(#ngoi)" ${sw}/>
    <path d="M30 14 H330" stroke="${K}" stroke-width="3"/>
    <path d="M24 10 Q30 2 40 6 L40 16 H24 Z" fill="#a4442a" ${sw}/>
    <path d="M336 10 Q330 2 320 6 L320 16 H336 Z" fill="#a4442a" ${sw}/>
    <path d="M-10 52 H370" stroke="${K}" stroke-width="3"/>
    <rect x="-10" y="52" width="380" height="10" fill="#7a5230" ${sw}/>
    <path d="M-14 50 Q-24 38 -10 34" fill="none" stroke="${K}" stroke-width="3"/>
    <path d="M374 50 Q384 38 370 34" fill="none" stroke="${K}" stroke-width="3"/>
    <!-- đèn lồng -->
    ${lantern(130, 92, 1, R, 0)}
    ${lantern(240, 98, .9, "#d9572e", -1.1)}
    ${lantern(330, 86, .7, R, -.5)}
  `, "0 0 360 150");

  const icons = {
    /* chế độ */
    stories: `<rect x="8" y="16" width="48" height="34" rx="3" fill="${W}" ${sw}/><path d="M32 16 V50" ${sw}/><path d="M14 24 H27 M14 30 H27 M14 36 H24 M37 24 H50 M37 30 H50 M37 36 H47" stroke="${K}" stroke-width="2" stroke-linecap="round" opacity=".55"/><path d="M8 50 Q20 46 32 50 Q44 46 56 50 V54 Q44 50 32 54 Q20 50 8 54Z" fill="${R}" ${sw}/><circle cx="50" cy="12" r="6" fill="${Y}" ${sw}/>`,
    chats: `<path d="M10 34 H54 Q54 54 32 54 Q10 54 10 34Z" fill="${B}" ${sw}/><path d="M14 34 Q16 22 32 22 Q48 22 50 34" fill="${W}" ${sw}/><path d="M24 26 q2 -3 4 0 M32 24 q2 -3 4 0" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M40 8 L56 30 M46 6 L60 26" stroke="#b07b45" stroke-width="3.5" stroke-linecap="round"/><path d="M40 8 L56 30 M46 6 L60 26" stroke="${K}" stroke-width="1" opacity=".5"/><path d="M18 14 q-3 -4 0 -8 M26 14 q-3 -4 0 -8" stroke="${K}" stroke-width="2" fill="none" opacity=".45"/>`,
    rhymes: `<ellipse cx="32" cy="22" rx="20" ry="7" fill="${R}" ${sw}/><path d="M12 22 V44 Q32 54 52 44 V22" fill="#d9572e" ${sw}/><ellipse cx="32" cy="22" rx="14" ry="4.5" fill="${Y}" ${sw}/><path d="M12 30 Q32 40 52 30 M12 38 Q32 48 52 38" stroke="${K}" stroke-width="1.6" fill="none" opacity=".45"/><path d="M50 6 L40 18 M54 10 L44 20" stroke="#b07b45" stroke-width="3" stroke-linecap="round"/><circle cx="51" cy="7" r="3" fill="${W}" ${sw}/><circle cx="55" cy="11" r="3" fill="${W}" ${sw}/>`,
    quiz: `<line x1="32" y1="4" x2="32" y2="12" stroke="${K}" stroke-width="2"/><rect x="25" y="10" width="14" height="5" rx="1.5" fill="${Y}" ${sw}/><ellipse cx="32" cy="32" rx="20" ry="18" fill="${R}" ${sw}/><path d="M21 18 Q15 32 21 46 M32 14 V50 M43 18 Q49 32 43 46" stroke="${K}" stroke-width="1.6" fill="none" opacity=".45"/><rect x="25" y="49" width="14" height="5" rx="1.5" fill="${Y}" ${sw}/><path d="M29 54 V62 M32 54 V63 M35 54 V62" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/><text x="32" y="39" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="${W}">?</text>`,
    ai: `<rect x="12" y="18" width="40" height="32" rx="10" fill="${G}" ${sw}/><circle cx="25" cy="33" r="4" fill="${W}" ${sw}/><circle cx="39" cy="33" r="4" fill="${W}" ${sw}/><path d="M26 42 Q32 46 38 42" ${sw} fill="none"/><path d="M32 18 V10" ${sw}/><circle cx="32" cy="8" r="3.5" fill="${Y}" ${sw}/><path d="M12 30 H6 M52 30 H58" ${sw}/>`,

    /* truyện */
    "tam-cam": `<path d="M8 32 Q24 14 42 32 Q24 50 8 32Z" fill="${Y}" ${sw}/><path d="M42 32 L56 22 L54 32 L56 42Z" fill="${R}" ${sw}/><circle cx="17" cy="29" r="2.4" fill="${K}"/><path d="M24 24 q4 8 0 16 M30 24 q4 8 0 16" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M6 52 q8 -4 16 0 t16 0 t16 0" stroke="${B}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="50" cy="12" r="3" fill="none" stroke="${B}" stroke-width="2"/><circle cx="56" cy="6" r="2" fill="none" stroke="${B}" stroke-width="2"/>`,
    "dua-hau": `<path d="M6 30 A26 26 0 0 0 58 30 Z" fill="${G}" ${sw}/><path d="M11 30 A21 21 0 0 0 53 30 Z" fill="${W}" stroke="none"/><path d="M14 30 A18 18 0 0 0 50 30 Z" fill="${R}" ${sw}/><g fill="${K}"><ellipse cx="24" cy="36" rx="1.6" ry="2.4"/><ellipse cx="32" cy="41" rx="1.6" ry="2.4"/><ellipse cx="40" cy="36" rx="1.6" ry="2.4"/><ellipse cx="28" cy="33" rx="1.4" ry="2"/><ellipse cx="36" cy="33" rx="1.4" ry="2"/></g><path d="M44 10 q6 -2 10 4 q-6 2 -10 -4z" fill="${G}" ${sw}/>`,
    "cay-khe": `<path d="M32 30 L37 12 L42 30 L58 26 L46 38 L52 54 L37 44 L22 54 L28 38 L16 26 Z" fill="${Y}" ${sw} transform="translate(-5 0)"/><path d="M32 30 V44" stroke="${K}" stroke-width="1.5" opacity=".4"/><path d="M48 6 q8 0 10 8 q-6 2 -10 -8z" fill="${G}" ${sw}/><path d="M10 10 q6 -4 12 0 q-4 2 -6 6 q-2 -4 -6 -6z" fill="${K}"/>`,
    /* trò chuyện */
    "bua-com": `<path d="M8 34 H56 Q56 54 32 54 Q8 54 8 34Z" fill="${W}" ${sw}/><path d="M8 40 H56" stroke="${B}" stroke-width="3"/><path d="M12 34 Q14 20 32 20 Q50 20 52 34" fill="${W}" ${sw}/><path d="M22 26 q2 -3 4 0 M30 24 q2 -3 4 0 M38 26 q2 -3 4 0" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M42 6 L58 28 M48 4 L62 24" stroke="${R}" stroke-width="3.5" stroke-linecap="round"/>`,
    "di-hoc": `<rect x="12" y="16" width="40" height="40" rx="8" fill="${R}" ${sw}/><path d="M22 16 V10 Q32 4 42 10 V16" fill="none" ${sw}/><rect x="18" y="30" width="28" height="16" rx="4" fill="${Y}" ${sw}/><path d="M32 30 V36" ${sw}/><path d="M12 26 H52" stroke="${K}" stroke-width="2" opacity=".4"/>`,
    "gia-dinh": `<path d="M8 30 L32 10 L56 30" fill="none" ${sw}/><path d="M6 30 L32 8 L58 30 Z" fill="#a4442a" ${sw}/><rect x="14" y="30" width="36" height="26" fill="${W}" ${sw}/><rect x="27" y="40" width="10" height="16" fill="${Y}" ${sw}/><rect x="17" y="35" width="7" height="7" fill="${B}" ${sw}/><rect x="40" y="35" width="7" height="7" fill="${B}" ${sw}/><path d="M32 22 l-3 -3 a2 2 0 0 1 3 -2 a2 2 0 0 1 3 2z" fill="${P}" stroke="${K}" stroke-width="1.5"/>`,
    /* đồng dao, ca dao */
    "dung-dang": `<circle cx="20" cy="18" r="7" fill="${S}" ${sw}/><circle cx="44" cy="18" r="7" fill="${S}" ${sw}/><path d="M13 16 Q20 6 27 16" fill="${K}"/><path d="M37 16 Q44 6 51 16" fill="${K}"/><path d="M12 54 L16 28 H24 L28 54Z" fill="${R}" ${sw}/><path d="M36 54 L40 28 H48 L52 54Z" fill="${B}" ${sw}/><path d="M24 34 Q32 40 40 34" fill="none" ${sw}/>`,
    "cong-cha": `<path d="M2 54 L24 14 L36 32 L44 22 L62 54Z" fill="${G}" ${sw}/><path d="M24 14 L18 26 L24 24 L28 30" fill="${W}" ${sw}/><path d="M4 58 q10 -4 20 0 t20 0 t20 0" stroke="${B}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="52" cy="12" r="6" fill="${Y}" ${sw}/>`,
    "bau-bi": `<path d="M4 12 H60" stroke="#7a5230" stroke-width="4" stroke-linecap="round"/><path d="M20 12 c0 6 -8 8 -8 20 c0 10 6 16 12 16 c6 0 12 -6 12 -16 c0 -12 -8 -14 -8 -20z" fill="#9cc46a" ${sw} transform="translate(-4 0)"/><ellipse cx="44" cy="38" rx="13" ry="11" fill="${Y}" ${sw}/><path d="M38 30 q6 8 0 16 M50 30 q-6 8 0 16" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M44 27 V14" ${sw}/>`,
    "bat-com": `<path d="M8 32 H56 Q56 52 32 52 Q8 52 8 32Z" fill="${B}" ${sw}/><path d="M12 32 Q14 18 32 18 Q50 18 52 32" fill="${W}" ${sw}/><path d="M32 6 V20 M32 10 l-5 -3 M32 14 l5 -3 M32 8 l5 -3 M32 12 l-5 -3" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/>`,
    "con-meo": `<path d="M34 6 V58" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/><path d="M34 8 q-14 -4 -22 4 M34 8 q14 -4 22 4 M34 8 q-10 4 -14 14 M34 8 q10 4 14 14" stroke="${G}" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="40" rx="10" ry="9" fill="${Y}" ${sw}/><path d="M16 34 L16 26 L22 32 M32 34 L32 26 L26 32" fill="${Y}" ${sw}/><circle cx="21" cy="39" r="1.6" fill="${K}"/><circle cx="27" cy="39" r="1.6" fill="${K}"/><path d="M22 44 q2 2 4 0" stroke="${K}" stroke-width="1.6" fill="none"/>`,
    "ba-cong": `<path d="M10 40 Q12 20 34 22 Q52 24 54 40" fill="${P}" ${sw}/><path d="M10 40 Q30 46 54 40" fill="none" ${sw}/><path d="M54 38 L62 32 M54 40 L62 44" ${sw}/><circle cx="46" cy="30" r="2" fill="${K}"/><path d="M14 40 L10 50 M22 42 L20 52 M30 43 L30 53 M38 42 L40 52" ${sw}/><path d="M18 26 q4 -6 8 0 M26 23 q4 -6 8 0" stroke="${K}" stroke-width="1.6" fill="none" opacity=".45"/><path d="M8 8 l2 6 M18 4 l2 6 M28 8 l2 6" stroke="${B}" stroke-width="2" stroke-linecap="round"/>`
  };

  window.OBK_ART = {
    hero,
    icon(id) { return icons[id] ? svg(icons[id]) : ""; }
  };
})();
