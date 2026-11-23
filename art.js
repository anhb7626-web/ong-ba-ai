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
    bedtime: `<path d="M40 8 A22 22 0 1 0 56 40 A18 18 0 1 1 40 8Z" fill="${Y}" ${sw}/><circle cx="14" cy="14" r="2.5" fill="${W}" ${sw}/><circle cx="54" cy="12" r="2" fill="${W}" ${sw}/><path d="M44 50 h10 l-10 8 h10" fill="none" stroke="${B}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 20 h7 l-7 6 h7" fill="none" stroke="${B}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
    teacher: `<rect x="10" y="12" width="44" height="34" rx="3" fill="${G}" ${sw}/><rect x="14" y="16" width="36" height="26" fill="#2f5d3a"/><path d="M19 24 h16 M19 30 h22 M19 36 h12" stroke="${W}" stroke-width="2.2" stroke-linecap="round"/><path d="M20 46 L16 58 M44 46 L48 58" ${sw}/><path d="M42 30 L56 8 L60 11 L46 33 L41 35Z" fill="${Y}" ${sw}/>`,
    ai: `<rect x="12" y="18" width="40" height="32" rx="10" fill="${G}" ${sw}/><circle cx="25" cy="33" r="4" fill="${W}" ${sw}/><circle cx="39" cy="33" r="4" fill="${W}" ${sw}/><path d="M26 42 Q32 46 38 42" ${sw} fill="none"/><path d="M32 18 V10" ${sw}/><circle cx="32" cy="8" r="3.5" fill="${Y}" ${sw}/><path d="M12 30 H6 M52 30 H58" ${sw}/>`,

    /* truyện */
    "tam-cam": `<path d="M8 32 Q24 14 42 32 Q24 50 8 32Z" fill="${Y}" ${sw}/><path d="M42 32 L56 22 L54 32 L56 42Z" fill="${R}" ${sw}/><circle cx="17" cy="29" r="2.4" fill="${K}"/><path d="M24 24 q4 8 0 16 M30 24 q4 8 0 16" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M6 52 q8 -4 16 0 t16 0 t16 0" stroke="${B}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="50" cy="12" r="3" fill="none" stroke="${B}" stroke-width="2"/><circle cx="56" cy="6" r="2" fill="none" stroke="${B}" stroke-width="2"/>`,
    "dua-hau": `<path d="M6 30 A26 26 0 0 0 58 30 Z" fill="${G}" ${sw}/><path d="M11 30 A21 21 0 0 0 53 30 Z" fill="${W}" stroke="none"/><path d="M14 30 A18 18 0 0 0 50 30 Z" fill="${R}" ${sw}/><g fill="${K}"><ellipse cx="24" cy="36" rx="1.6" ry="2.4"/><ellipse cx="32" cy="41" rx="1.6" ry="2.4"/><ellipse cx="40" cy="36" rx="1.6" ry="2.4"/><ellipse cx="28" cy="33" rx="1.4" ry="2"/><ellipse cx="36" cy="33" rx="1.4" ry="2"/></g><path d="M44 10 q6 -2 10 4 q-6 2 -10 -4z" fill="${G}" ${sw}/>`,
    "cay-khe": `<path d="M32 30 L37 12 L42 30 L58 26 L46 38 L52 54 L37 44 L22 54 L28 38 L16 26 Z" fill="${Y}" ${sw} transform="translate(-5 0)"/><path d="M32 30 V44" stroke="${K}" stroke-width="1.5" opacity=".4"/><path d="M48 6 q8 0 10 8 q-6 2 -10 -8z" fill="${G}" ${sw}/><path d="M10 10 q6 -4 12 0 q-4 2 -6 6 q-2 -4 -6 -6z" fill="${K}"/>`,
    /* trò chuyện */
    "bua-com": `<path d="M8 34 H56 Q56 54 32 54 Q8 54 8 34Z" fill="${W}" ${sw}/><path d="M8 40 H56" stroke="${B}" stroke-width="3"/><path d="M12 34 Q14 20 32 20 Q50 20 52 34" fill="${W}" ${sw}/><path d="M22 26 q2 -3 4 0 M30 24 q2 -3 4 0 M38 26 q2 -3 4 0" stroke="${K}" stroke-width="1.6" fill="none" opacity=".5"/><path d="M42 6 L58 28 M48 4 L62 24" stroke="${R}" stroke-width="3.5" stroke-linecap="round"/>`,
    "di-hoc": `<rect x="12" y="16" width="40" height="40" rx="8" fill="${R}" ${sw}/><path d="M22 16 V10 Q32 4 42 10 V16" fill="none" ${sw}/><rect x="18" y="30" width="28" height="16" rx="4" fill="${Y}" ${sw}/><path d="M32 30 V36" ${sw}/><path d="M12 26 H52" stroke="${K}" stroke-width="2" opacity=".4"/>`,
    "gia-dinh": `<path d="M8 30 L32 10 L56 30" fill="none" ${sw}/><path d="M6 30 L32 8 L58 30 Z" fill="#a4442a" ${sw}/><rect x="14" y="30" width="36" height="26" fill="${W}" ${sw}/><rect x="27" y="40" width="10" height="16" fill="${Y}" ${sw}/><rect x="17" y="35" width="7" height="7" fill="${B}" ${sw}/><rect x="40" y="35" width="7" height="7" fill="${B}" ${sw}/><path d="M32 22 l-3 -3 a2 2 0 0 1 3 -2 a2 2 0 0 1 3 2z" fill="${P}" stroke="${K}" stroke-width="1.5"/>`,
    "ngay-tet": `<rect x="14" y="18" width="36" height="36" fill="${G}" ${sw}/><path d="M14 30 H50 M14 42 H50 M26 18 V54 M38 18 V54" stroke="${Y}" stroke-width="3"/><path d="M14 30 H50 M14 42 H50 M26 18 V54 M38 18 V54" stroke="${K}" stroke-width="1" opacity=".5"/><path d="M48 4 v8" stroke="${K}" stroke-width="2"/><rect x="42" y="10" width="14" height="18" rx="2" fill="${R}" ${sw}/><circle cx="49" cy="19" r="3.5" fill="${Y}" stroke="${K}" stroke-width="1.5"/><g fill="${Y}" stroke="${K}" stroke-width="1.5"><circle cx="8" cy="10" r="3"/><circle cx="14" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/></g>`,
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

  /* ---------- Nhãn dán con giống (phỏng theo tranh Đông Hồ) ---------- */
  const stickers = [
    { id: "ga", name: "Gà trống", body: `<path d="M18 46 Q14 28 28 24 Q30 14 38 16 Q44 18 42 26 Q54 28 52 42 Q50 52 36 54 Q22 54 18 46Z" fill="${Y}" ${sw}/><path d="M36 12 q2 -6 6 -2 q4 -4 5 2 q-5 2 -11 0z" fill="${R}" ${sw}/><path d="M43 22 L50 24 L43 26Z" fill="${Y}" ${sw}/><circle cx="38" cy="21" r="1.8" fill="${K}"/><path d="M18 40 Q4 30 10 18 Q14 30 20 32 Q8 20 16 12 Q18 26 24 30" fill="${G}" ${sw}/><path d="M28 54 V60 M36 54 V60" ${sw}/><path d="M26 38 q8 6 16 0" stroke="${R}" stroke-width="2.5" fill="none"/>` },
    { id: "lon", name: "Lợn đàn", body: `<ellipse cx="32" cy="36" rx="24" ry="15" fill="#3a2f2a" ${sw}/><path d="M14 30 q6 -4 12 0 q-6 4 -12 0z M30 26 q6 -4 12 0 q-6 4 -12 0z M24 42 q6 -4 12 0 q-6 4 -12 0z" fill="none" stroke="${W}" stroke-width="2"/><ellipse cx="56" cy="36" rx="5" ry="6" fill="${P}" ${sw}/><path d="M46 22 l4 -6 l3 8" fill="#3a2f2a" ${sw}/><circle cx="48" cy="31" r="1.8" fill="${W}"/><path d="M16 50 v8 M26 51 v8 M40 51 v8 M48 50 v8" ${sw}/><path d="M8 34 q-4 -4 0 -8" ${sw} fill="none"/>` },
    { id: "ca-chep", name: "Cá chép", body: `<path d="M8 34 Q26 12 46 30 Q26 52 8 34Z" fill="#e2703a" ${sw}/><path d="M46 30 L60 18 Q56 30 60 44Z" fill="${R}" ${sw}/><path d="M20 28 q4 4 0 8 M28 24 q4 6 0 14 M36 26 q4 6 0 10" stroke="${K}" stroke-width="1.6" fill="none" opacity=".6"/><circle cx="16" cy="31" r="2.2" fill="${K}"/><path d="M8 36 q-4 4 -2 10 M10 36 q-2 6 2 10" stroke="${K}" stroke-width="1.6" fill="none"/><path d="M26 16 l6 -8 l4 10" fill="${Y}" ${sw}/>` },
    { id: "trau", name: "Trâu", body: `<ellipse cx="30" cy="38" rx="22" ry="13" fill="#5b5f6a" ${sw}/><ellipse cx="52" cy="32" rx="9" ry="8" fill="#5b5f6a" ${sw}/><path d="M46 26 Q40 14 50 12 Q46 18 50 24 M58 26 Q64 14 56 12 Q60 18 56 24" fill="${W}" ${sw}/><circle cx="54" cy="31" r="1.6" fill="${W}"/><path d="M14 48 v10 M22 50 v8 M38 50 v8 M46 46 v12" ${sw}/><path d="M8 34 q-4 6 -2 12" ${sw} fill="none"/><circle cx="20" cy="14" r="5" fill="${Y}" ${sw}/>` },
    { id: "coc", name: "Cóc", body: `<ellipse cx="32" cy="40" rx="22" ry="15" fill="#7fa65a" ${sw}/><circle cx="22" cy="26" r="7" fill="#7fa65a" ${sw}/><circle cx="42" cy="26" r="7" fill="#7fa65a" ${sw}/><circle cx="22" cy="26" r="3" fill="${K}"/><circle cx="42" cy="26" r="3" fill="${K}"/><path d="M20 42 Q32 50 44 42" ${sw} fill="none"/><circle cx="16" cy="46" r="2" fill="${Y}"/><circle cx="48" cy="38" r="2" fill="${Y}"/><circle cx="30" cy="52" r="2" fill="${Y}"/><path d="M10 52 l-6 6 M54 52 l6 6" ${sw}/>` },
    { id: "chuot", name: "Chuột", body: `<ellipse cx="30" cy="40" rx="18" ry="12" fill="#9a8f86" ${sw}/><circle cx="46" cy="32" r="8" fill="#9a8f86" ${sw}/><circle cx="44" cy="22" r="5" fill="${P}" ${sw}/><circle cx="50" cy="31" r="1.6" fill="${K}"/><path d="M54 34 h6 M54 36 l6 2" stroke="${K}" stroke-width="1.5"/><path d="M12 40 Q2 30 10 22" ${sw} fill="none"/><path d="M20 30 L24 10 L28 30" fill="${R}" ${sw}/><path d="M22 50 v6 M36 50 v6" ${sw}/>` },
    { id: "vit", name: "Vịt", body: `<path d="M10 40 Q12 26 30 30 Q36 14 46 18 Q52 22 48 30 Q58 34 52 46 Q40 56 22 52 Q10 50 10 40Z" fill="${W}" ${sw}/><path d="M48 22 L60 24 L48 28Z" fill="${Y}" ${sw}/><circle cx="44" cy="22" r="1.8" fill="${K}"/><path d="M20 40 q10 6 20 0" stroke="${K}" stroke-width="2" fill="none" opacity=".5"/><path d="M4 56 q8 -4 16 0 t16 0 t16 0 t12 0" stroke="${B}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
    { id: "rong", name: "Rồng", body: `<path d="M6 44 Q14 30 24 40 Q34 50 42 36 Q48 24 58 30" fill="none" stroke="${G}" stroke-width="9" stroke-linecap="round"/><path d="M6 44 Q14 30 24 40 Q34 50 42 36 Q48 24 58 30" fill="none" stroke="${K}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/><circle cx="56" cy="28" r="7" fill="${G}" ${sw}/><circle cx="58" cy="26" r="1.6" fill="${K}"/><path d="M52 22 l-4 -8 M58 21 l2 -9" stroke="${R}" stroke-width="2.5" stroke-linecap="round"/><path d="M14 36 l-2 -6 M30 44 l0 -8 M44 32 l-3 -6" stroke="${R}" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="16" r="5" fill="${R}" ${sw}/>` }
  ];

  /* ---------- Cảnh nền cho từng bài (có chuyển động nhẹ) ---------- */
  const sky = (c1, c2) => `<defs><linearGradient id="sk${c1.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="360" height="120" fill="url(#sk${c1.slice(1)})"/>`;
  const birds = `<g class="fly"><path d="M0 0 q5 -5 10 0 q5 -5 10 0" fill="none" stroke="${K}" stroke-width="2"/><path d="M26 10 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="${K}" stroke-width="2"/></g>`;
  const scenes = {
    stories: sky("#fbe8c3", "#f6d9a6") + `<circle cx="300" cy="34" r="18" fill="${Y}" opacity=".5"/>` + birds +
      `<path d="M0 90 Q90 70 180 88 T360 84 V120 H0Z" fill="#9cc46a" ${sw}/>`,
    "tam-cam": sky("#dff0f5", "#cfe6ee") +
      `<path d="M0 70 Q60 56 120 66 T240 62 T360 66 V120 H0Z" fill="#9cc46a" ${sw}/>` +
      `<path d="M0 84 Q180 74 360 84 V120 H0Z" fill="#6fa6c9" ${sw}/>` +
      `<g class="wave"><path d="M10 98 q10 -6 20 0 t20 0 M120 104 q10 -6 20 0 t20 0 M250 96 q10 -6 20 0 t20 0" stroke="${W}" stroke-width="2" fill="none"/></g>` +
      `<g class="swim"><path d="M0 0 Q12 -10 26 0 Q12 10 0 0Z" fill="${Y}" ${sw}/><path d="M26 0 L36 -7 L34 0 L36 7Z" fill="${R}" ${sw}/><circle cx="7" cy="-2" r="1.6" fill="${K}"/></g>` +
      `<g fill="${G}" ${sw}><path d="M300 70 q-4 -30 2 -44 q4 20 2 44z"/><path d="M314 72 q0 -26 10 -36 q-2 20 -6 36z"/><path d="M290 72 q-8 -20 -16 -26 q6 16 8 26z"/></g>` +
      `<g><circle cx="70" cy="40" r="10" fill="${P}" ${sw}/><path d="M70 50 v16" ${sw}/></g>`,
    "dua-hau": sky("#cfe9f2", "#bde0ea") + `<circle cx="300" cy="30" r="16" fill="${Y}" ${sw}/>` + birds +
      `<path d="M0 86 Q180 76 360 86 V120 H0Z" fill="#4d8fbf" ${sw}/>` +
      `<g class="wave"><path d="M20 100 q10 -6 20 0 t20 0 M150 106 q10 -6 20 0 t20 0 M280 98 q10 -6 20 0 t20 0" stroke="${W}" stroke-width="2" fill="none"/></g>` +
      `<path d="M70 88 Q120 50 190 88Z" fill="#e9cf8f" ${sw}/>` +
      `<path d="M130 62 q-2 -26 4 -36" stroke="#7a5230" stroke-width="4" fill="none"/><path d="M134 26 q-16 -4 -26 6 M134 26 q14 -6 26 2 M134 26 q-6 10 -16 12 M134 26 q8 8 18 10" stroke="${G}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<g><ellipse cx="160" cy="80" rx="12" ry="9" fill="${G}" ${sw}/><path d="M152 76 q8 4 16 0" stroke="#9cc46a" stroke-width="2" fill="none"/></g>` +
      `<g class="boat"><path d="M250 86 h40 l-6 8 h-28z" fill="#7a5230" ${sw}/><path d="M270 86 V60 L290 82Z" fill="${W}" ${sw}/></g>`,
    "cay-khe": sky("#fbeecf", "#f6dfae") + `<circle cx="40" cy="30" r="14" fill="${Y}" opacity=".6"/>` +
      `<path d="M0 92 Q180 80 360 92 V120 H0Z" fill="#9cc46a" ${sw}/>` +
      `<path d="M200 92 q4 -30 -2 -50" stroke="#7a5230" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<g class="sway-tree"><circle cx="200" cy="38" r="34" fill="${G}" ${sw}/><circle cx="172" cy="48" r="20" fill="${G}" ${sw}/><circle cx="228" cy="48" r="20" fill="${G}" ${sw}/>` +
      `<g fill="${Y}" ${sw}><path d="M186 40 l3 -8 l3 8 l8 -2 l-6 6 l4 7 l-9 -4 l-9 4 l4 -7 l-6 -6z"/><path d="M214 30 l3 -8 l3 8 l8 -2 l-6 6 l4 7 l-9 -4 l-9 4 l4 -7 l-6 -6z"/><path d="M216 56 l3 -8 l3 8 l8 -2 l-6 6 l4 7 l-9 -4 l-9 4 l4 -7 l-6 -6z"/></g></g>` +
      `<g class="bigbird"><path d="M0 0 q14 -14 30 0 q16 -14 30 0 q-14 6 -30 4 q-16 2 -30 -4z" fill="#3a2f2a" ${sw}/><path d="M30 2 l6 6 l-8 0z" fill="${Y}" ${sw}/></g>`,
    chats: sky("#fbe8c3", "#f6d9a6") +
      `<rect x="0" y="86" width="360" height="34" fill="#b07b45" ${sw}/><path d="M0 96 H360" stroke="${K}" stroke-width="1.5" opacity=".4"/>` +
      `<ellipse cx="180" cy="84" rx="110" ry="14" fill="#c99a63" ${sw}/>` +
      `<g><path d="M130 80 H170 Q170 96 150 96 Q130 96 130 80Z" fill="${B}" ${sw}/><path d="M134 80 Q136 68 150 68 Q164 68 166 80" fill="${W}" ${sw}/></g>` +
      `<g><path d="M190 80 H234 Q234 98 212 98 Q190 98 190 80Z" fill="${W}" ${sw}/><path d="M196 80 Q212 70 228 80" fill="#e2703a" ${sw}/></g>` +
      `<g class="steam"><path d="M146 62 q-4 -6 0 -12 q4 -6 0 -12 M156 62 q-4 -6 0 -12 q4 -6 0 -12" stroke="${K}" stroke-width="2" fill="none" opacity=".4"/></g>` +
      `<path d="M240 74 L270 60 M244 78 L274 66" stroke="${R}" stroke-width="3" stroke-linecap="round"/>`,
    rhymes: sky("#f3dcea", "#ecc9dd") + birds +
      `<path d="M0 94 Q180 84 360 94 V120 H0Z" fill="#9cc46a" ${sw}/>` +
      `<g><path d="M110 50 L180 22 L250 50Z" fill="#a4442a" ${sw}/><rect x="124" y="50" width="112" height="44" fill="${W}" ${sw}/><rect x="166" y="64" width="28" height="30" fill="${R}" ${sw}/><path d="M104 52 q-8 -10 2 -14 M256 52 q8 -10 -2 -14" stroke="${K}" stroke-width="2.5" fill="none"/></g>` +
      `<g class="kids"><circle cx="60" cy="74" r="6" fill="${S}" ${sw}/><path d="M54 96 l4 -16 h6 l4 16z" fill="${R}" ${sw}/><circle cx="84" cy="74" r="6" fill="${S}" ${sw}/><path d="M78 96 l4 -16 h6 l4 16z" fill="${B}" ${sw}/><path d="M66 84 h14" ${sw}/></g>`,
    quiz: sky("#fbe8c3", "#f8d98f") +
      `<path d="M0 18 Q180 40 360 18" stroke="${K}" stroke-width="2" fill="none"/>` +
      [40, 100, 160, 220, 280, 330].map((x, i) => `<g class="swing" style="transform-origin:${x}px ${20 + Math.sin(i) * 4}px;animation-delay:${-i * .4}s"><line x1="${x}" y1="${22 + (i % 2) * 6}" x2="${x}" y2="${34 + (i % 2) * 6}" stroke="${K}" stroke-width="1.5"/><ellipse cx="${x}" cy="${48 + (i % 2) * 6}" rx="13" ry="12" fill="${[R, Y, "#d9572e", G, R, Y][i]}" ${sw}/><rect x="${x - 5}" y="${58 + (i % 2) * 6}" width="10" height="4" fill="${Y}" ${sw}/></g>`).join("") +
      `<path d="M0 100 Q180 90 360 100 V120 H0Z" fill="#c99a63" ${sw}/>`,
    "ngay-tet": sky("#fbe3c3", "#f7cfa0") +
      `<path d="M0 98 Q180 88 360 98 V120 H0Z" fill="#c99a63" ${sw}/>` +
      `<path d="M40 98 q6 -30 -8 -58 M32 60 q-16 -6 -22 -20 M36 74 q14 -10 30 -8" stroke="#6b4a2b" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<g class="sway-tree">` + [[30, 40], [12, 38], [22, 24], [62, 64], [46, 52], [10, 56], [70, 58], [36, 30]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="6" fill="${Y}" ${sw}/><circle r="2" fill="${R}"/></g>`).join("") + `</g>` +
      `<g><rect x="150" y="70" width="40" height="28" fill="${G}" ${sw}/><path d="M150 84 H190 M170 70 V98" stroke="${Y}" stroke-width="3"/><rect x="200" y="74" width="34" height="24" fill="${G}" ${sw}/><path d="M200 86 H234 M217 74 V98" stroke="${Y}" stroke-width="3"/></g>` +
      [270, 310].map((x, i) => `<g class="swing" style="transform-origin:${x}px 0;animation-delay:${-i * .6}s"><line x1="${x}" y1="0" x2="${x}" y2="22" stroke="${K}" stroke-width="1.5"/><rect x="${x - 10}" y="22" width="20" height="40" rx="3" fill="${R}" ${sw}/><circle cx="${x}" cy="42" r="6" fill="${Y}" stroke="${K}" stroke-width="1.5"/><path d="M${x - 4} 62 v8 M${x + 4} 62 v8" stroke="${Y}" stroke-width="2"/></g>`).join(""),
    bedtime: `<rect width="360" height="120" fill="#1f2a4a"/>` +
      [[30, 20], [80, 40], [130, 14], [210, 30], [250, 12], [320, 44], [170, 50], [290, 22]].map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${-i * .7}s" cx="${x}" cy="${y}" r="${1.5 + (i % 3)}" fill="${W}"/>`).join("") +
      `<g class="drift"><path d="M300 16 A20 20 0 1 0 318 48 A16 16 0 1 1 300 16Z" fill="${Y}" ${sw}/></g>` +
      `<path d="M0 98 Q180 86 360 98 V120 H0Z" fill="#2c3b2e" ${sw}/>` +
      `<g><path d="M110 70 L160 44 L210 70Z" fill="#5a3324" ${sw}/><rect x="120" y="70" width="80" height="30" fill="#3a3550" ${sw}/><rect x="152" y="78" width="16" height="22" fill="${Y}" opacity=".9" ${sw}/><rect x="130" y="78" width="12" height="10" fill="${Y}" opacity=".7" ${sw}/><rect x="178" y="78" width="12" height="10" fill="${Y}" opacity=".7" ${sw}/></g>`,
    ai: null
  };
  scenes.ai = scenes.chats;

  window.OBK_ART.sticker = (id) => { const s = stickers.find((x) => x.id === id); return s ? svg(s.body) : ""; };
  window.OBK_ART.stickers = stickers.map(({ id, name }) => ({ id, name }));
  window.OBK_ART.scene = (id, mode) => {
    const body = scenes[id] || scenes[mode];
    return body ? svg(body, "0 0 360 120") : "";
  };
})();
