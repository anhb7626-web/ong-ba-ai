/*
 * ÔNG BÀ KỂ – FILE NỘI DUNG
 * ------------------------------------------------------------
 * Muốn thêm bài, chỉ cần sửa file này. Không cần sửa app.js.
 *
 * Ký hiệu trong câu:
 *   {X}  = "ông" hoặc "bà" (tùy nhân vật cháu chọn)
 *   {Xc} = "Ông" hoặc "Bà" (viết hoa đầu câu)
 *
 * Các loại lượt (bước) trong truyện / trò chuyện:
 *   { t: "say", text: "..." }
 *       Ông/bà kể một câu, cháu bấm "Tiếp".
 *   { t: "ask", text: "...", choices: [...], answer: 0, recast: "...", yes: "..." }
 *       Hỏi có đáp án. answer = vị trí đáp án đúng (đếm từ 0).
 *       recast = câu ông/bà nhắc lại cho đúng khi cháu trả lời sai.
 *       yes    = (không bắt buộc) câu nói thêm khi cháu trả lời đúng.
 *       accept = (không bắt buộc) các từ khác cũng được tính là đúng khi cháu gõ/nói.
 *   { t: "ask", open: true, text: "...", choices: [...], reply: "..." }
 *       Câu hỏi mở, cháu trả lời gì cũng được; ông/bà đáp lại bằng "reply".
 *       choices có thể bỏ trống để cháu tự gõ hoặc nói.
 *
 * Từ khó: thêm vào mục glossary ở cuối file. App tự gạch chân
 * từ đó ở mọi câu, bấm "Xem nghĩa" sẽ hiện tiếng Anh và tiếng Trung.
 *
 * parentTips: 3 câu gợi ý để bố mẹ hỏi con trong bữa cơm sau bài học.
 */

window.OBK_DATA = {

  /* ===================== 1. KỂ CHUYỆN CỔ TÍCH ===================== */
  stories: [
    {
      id: "tam-cam",
      title: "Tấm Cám",
      emoji: "🐟",
      steps: [
        { t: "say", text: "Ngày xửa ngày xưa, có hai chị em cùng cha khác mẹ. Chị tên là Tấm, em tên là Cám." },
        { t: "ask", text: "Cháu nhớ không, người chị tên là gì?",
          choices: ["Tấm", "Cám", "Cô Tiên"], answer: 0,
          recast: "À, người chị tên là Tấm. Em mới là Cám cháu ạ." },
        { t: "say", text: "Tấm hiền lành, chăm chỉ. Cám thì lười biếng. Một hôm, dì ghẻ bảo hai chị em ra đồng bắt tôm tép." },
        { t: "say", text: "Tấm bắt được đầy giỏ. Cám mải chơi nên giỏ trống trơn. Cám bèn lừa chị xuống ao gội đầu, rồi trút hết tôm tép của chị." },
        { t: "ask", text: "Cám làm vậy có ngoan không cháu?",
          choices: ["Có, Cám ngoan", "Không, Cám không ngoan"], answer: 1,
          recast: "Cám làm vậy là không ngoan đâu cháu, vì Cám lừa chị và lấy đồ của chị.",
          yes: "Cám lừa chị là không ngoan, cháu nói đúng lắm." },
        { t: "say", text: "Tấm ngồi khóc. Bụt hiện lên hỏi: Vì sao con khóc? Trong giỏ chỉ còn một con cá bống nhỏ, Bụt bảo Tấm đem về nuôi." },
        { t: "ask", text: "Ai hiện lên giúp Tấm?",
          choices: ["Bụt", "Dì ghẻ", "Cám"], answer: 0,
          recast: "À, Bụt hiện lên giúp Tấm đấy cháu." },
        { t: "say", text: "Rồi nhà vua mở hội. Dì ghẻ không cho Tấm đi. Nhưng nhờ Bụt giúp, Tấm có quần áo đẹp và đôi hài thêu." },
        { t: "say", text: "Trên đường đi, Tấm đánh rơi một chiếc hài. Nhà vua nhặt được, cho tìm người đi vừa chiếc hài. Đó chính là Tấm!" },
        { t: "ask", text: "Tấm đánh rơi cái gì?",
          choices: ["Chiếc hài", "Cái nón", "Con cá"], answer: 0,
          recast: "Tấm đánh rơi một chiếc hài. Hài là giày thêu của người ngày xưa đấy cháu." },
        { t: "say", text: "Tấm trở thành hoàng hậu. Truyện còn dài lắm, nhưng người hiền lành bao giờ cũng được hạnh phúc cháu ạ." },
        { t: "ask", open: true, text: "Cháu thích nhân vật nào nhất trong truyện?",
          choices: ["Tấm", "Bụt", "Nhà vua"],
          reply: "Cháu chọn hay lắm! Còn {X} thì thích Tấm, vì Tấm hiền lành và chăm chỉ." }
      ],
      parentTips: [
        "Vì sao Tấm ngồi khóc hả con?",
        "Bụt đã giúp Tấm những gì?",
        "Con có muốn hiền lành như Tấm không? Vì sao?"
      ]
    },
    {
      id: "dua-hau",
      title: "Sự tích dưa hấu",
      emoji: "🍉",
      steps: [
        { t: "say", text: "Ngày xưa, vua Hùng có một người con nuôi tên là Mai An Tiêm. An Tiêm rất thông minh và chăm chỉ." },
        { t: "say", text: "Một lần, An Tiêm nói: của cải là do mình làm ra. Vua giận lắm, đày An Tiêm cùng vợ con ra một hòn đảo hoang." },
        { t: "ask", text: "Gia đình An Tiêm phải ra sống ở đâu?",
          choices: ["Đảo hoang", "Thành phố", "Cung điện"], answer: 0,
          recast: "À, gia đình An Tiêm phải ra sống ở một hòn đảo hoang, không có ai cả." },
        { t: "say", text: "Trên đảo, An Tiêm không hề nản lòng. Chàng dựng nhà, bắt cá, tìm nước ngọt cho cả nhà." },
        { t: "say", text: "Một hôm, chim bay đến, thả xuống những hạt giống màu đen. An Tiêm đem gieo. Hạt mọc thành cây, ra quả to, vỏ xanh, ruột đỏ, ăn ngọt mát." },
        { t: "ask", text: "Ruột quả dưa hấu có màu gì?",
          choices: ["Màu đỏ", "Màu xanh", "Màu tím"], answer: 0,
          recast: "Ruột dưa hấu màu đỏ, còn vỏ thì màu xanh cháu ạ." },
        { t: "say", text: "An Tiêm khắc tên mình lên quả, thả xuống biển. Thuyền buôn vớt được, tìm đến đảo đổi hàng. Hòn đảo trở nên đông vui." },
        { t: "say", text: "Vua biết chuyện thì hối hận, cho đón An Tiêm về. Từ đó, quả ấy được gọi là dưa hấu." },
        { t: "ask", text: "Vì sao cả nhà An Tiêm sống được trên đảo hoang?",
          choices: ["Vì An Tiêm chăm chỉ", "Vì có người mang cơm đến", "Vì An Tiêm ngủ suốt ngày"], answer: 0,
          recast: "Nhờ An Tiêm chăm chỉ làm việc nên cả nhà mới sống được trên đảo đấy cháu.",
          accept: ["cham chi", "lam viec"] },
        { t: "ask", open: true, text: "Cháu ăn dưa hấu bao giờ chưa? Cháu thấy dưa hấu thế nào?",
          choices: ["Ngọt lắm ạ", "Mát lắm ạ", "Cháu chưa ăn bao giờ"],
          reply: "Ngày Tết, nhà mình hay bày quả dưa hấu ruột đỏ để mong cả năm may mắn đấy cháu." }
      ],
      parentTips: [
        "Mai An Tiêm đã làm gì để sống trên đảo hoang?",
        "Vì sao quả dưa hấu lại có tên như vậy?",
        "Nếu con ở trên đảo hoang, con sẽ làm gì đầu tiên?"
      ]
    },
    {
      id: "cay-khe",
      title: "Cây khế",
      emoji: "⭐",
      steps: [
        { t: "say", text: "Ngày xưa có hai anh em. Khi cha mẹ mất, người anh tham lam lấy hết của cải, chỉ cho em một cây khế." },
        { t: "ask", text: "Người em được chia cái gì?",
          choices: ["Một cây khế", "Một ngôi nhà", "Một con trâu"], answer: 0,
          recast: "À, người em chỉ được chia một cây khế thôi cháu ạ." },
        { t: "say", text: "Người em chăm sóc cây khế rất chu đáo. Cây ra rất nhiều quả. Một hôm, có một con chim lạ bay đến ăn khế." },
        { t: "say", text: "Chim nói: Ăn một quả, trả cục vàng, may túi ba gang, mang đi mà đựng." },
        { t: "ask", text: "Chim bảo người em may túi to bao nhiêu?",
          choices: ["Ba gang", "Mười gang", "Thật to"], answer: 0,
          recast: "Chim bảo may túi ba gang. Một gang là bằng một bàn tay xòe ra đấy cháu." },
        { t: "say", text: "Chim chở người em ra đảo có nhiều vàng bạc. Người em chỉ lấy vàng vừa đầy túi ba gang, rồi về nhà sống sung túc." },
        { t: "say", text: "Người anh biết chuyện, đòi đổi cây khế. Anh may túi mười hai gang, lấy thật nhiều vàng. Túi nặng quá, chim chao cánh, người anh rơi xuống biển." },
        { t: "ask", text: "Người anh là người như thế nào?",
          choices: ["Tham lam", "Hiền lành", "Hay giúp đỡ"], answer: 0,
          recast: "Người anh tham lam, lấy quá nhiều nên mới bị rơi xuống biển cháu ạ." },
        { t: "ask", open: true, text: "Nếu cháu là người em, cháu sẽ làm gì với vàng?",
          choices: ["Cháu chia cho mọi người", "Cháu mua quà cho bố mẹ", "Cháu cất đi"],
          reply: "Cháu nghĩ hay lắm. {Xc} mong cháu luôn biết đủ và biết chia sẻ như người em." }
      ],
      parentTips: [
        "Chim lạ trả cho người em bằng gì?",
        "Vì sao người anh bị rơi xuống biển?",
        "Con thích làm người anh hay người em? Vì sao?"
      ]
    }
  ],

  /* ===================== 2. TRÒ CHUYỆN HẰNG NGÀY ===================== */
  chats: [
    {
      id: "bua-com",
      title: "Bữa cơm gia đình",
      emoji: "🍚",
      steps: [
        { t: "say", text: "Cháu ơi, đến giờ ăn cơm rồi! Nhà mình có lệ, trước khi ăn con cháu mời ông bà, bố mẹ trước." },
        { t: "ask", text: "Cháu mời {X} ăn cơm đi nào.",
          choices: ["Cháu mời {X} ăn cơm ạ", "Ăn đi", "Con đói"], answer: 0,
          accept: ["moi"],
          recast: "Mình nói thế này nhé: Cháu mời {X} ăn cơm ạ. Nói vậy là lễ phép lắm.",
          yes: "{Xc} cảm ơn cháu. Cháu lễ phép quá!" },
        { t: "ask", open: true, text: "Hôm nay có canh chua và cá kho. Cháu thích món nào?",
          choices: ["Canh chua", "Cá kho", "Cả hai món"],
          reply: "{Xc} cũng thích lắm. Cơm nóng ăn với canh chua là ngon nhất!" },
        { t: "ask", text: "Khi ăn cơm, mình dùng cái gì để gắp thức ăn?",
          choices: ["Đôi đũa", "Cái kéo", "Cây bút"], answer: 0,
          recast: "Mình dùng đôi đũa để gắp thức ăn cháu ạ." },
        { t: "ask", text: "Ăn xong, cháu nói gì với bố mẹ?",
          choices: ["Con ăn xong rồi ạ, con cảm ơn bố mẹ", "Không nói gì"], answer: 0,
          accept: ["cam on", "xong roi"],
          recast: "Ăn xong, cháu nói: Con ăn xong rồi ạ, con cảm ơn bố mẹ." },
        { t: "say", text: "Ăn cơm cùng cả nhà là vui nhất. Tối nay cháu nhớ mời cả nhà nhé!" }
      ],
      parentTips: [
        "Hôm nay con mời cả nhà ăn cơm nhé!",
        "Con thích món nào nhất trong bữa cơm hôm nay?",
        "Con thử gắp thức ăn cho bố mẹ bằng đũa xem nào?"
      ]
    },
    {
      id: "di-hoc",
      title: "Đi học",
      emoji: "🎒",
      steps: [
        { t: "ask", open: true, text: "Hôm nay cháu đi học có vui không?",
          choices: ["Vui ạ", "Hơi mệt ạ", "Bình thường ạ"],
          reply: "{Xc} nghe cháu kể mà vui lây." },
        { t: "ask", open: true, text: "Ở trường, cháu thích môn học nào nhất?",
          choices: ["Môn Toán", "Môn Vẽ", "Môn Thể dục", "Môn Âm nhạc"],
          reply: "Môn đó hay quá! Cháu học chăm nhé." },
        { t: "ask", open: true, text: "Bạn thân của cháu tên là gì? Cháu gõ hoặc nói cho {X} nghe nhé.",
          reply: "Tên bạn hay quá! Lần sau cháu dạy bạn ấy nói “Xin chào” bằng tiếng Việt nhé." },
        { t: "ask", text: "Khi gặp cô giáo, cháu chào thế nào?",
          choices: ["Em chào cô ạ", "Ê cô", "Hi"], answer: 0,
          accept: ["chao co"],
          recast: "Mình chào thế này nhé: Em chào cô ạ. Nhớ khoanh tay nữa nhé." },
        { t: "say", text: "Cháu đi học chăm ngoan, {X} vui lắm. Mai cháu kể tiếp cho {X} nghe nhé!" }
      ],
      parentTips: [
        "Hôm nay ở trường có chuyện gì vui không con?",
        "Bạn thân của con tên là gì? Bạn ấy thích gì?",
        "Con chào cô giáo bằng tiếng Việt thế nào?"
      ]
    },
    {
      id: "gia-dinh",
      title: "Gia đình của cháu",
      emoji: "🏡",
      steps: [
        { t: "ask", open: true, text: "Nhà cháu có mấy người?",
          choices: ["Ba người", "Bốn người", "Năm người", "Đông lắm ạ"],
          reply: "Nhà cháu chắc vui lắm nhỉ!" },
        { t: "ask", text: "Mẹ của mẹ cháu, cháu gọi là gì?",
          choices: ["Bà ngoại", "Bà nội", "Cô"], answer: 0,
          recast: "Mẹ của mẹ là bà ngoại. Còn mẹ của bố là bà nội cháu ạ." },
        { t: "ask", text: "Còn bố của bố, cháu gọi là gì?",
          choices: ["Ông nội", "Ông ngoại", "Chú"], answer: 0,
          recast: "Bố của bố là ông nội cháu nhé. Bố của mẹ mới là ông ngoại." },
        { t: "ask", text: "Em gái của bố, cháu gọi là gì?",
          choices: ["Cô", "Dì", "Mợ"], answer: 0,
          recast: "Em gái của bố thì mình gọi là cô, còn em gái của mẹ thì gọi là dì." },
        { t: "ask", open: true, text: "Cháu thương ai nhất nhà?",
          choices: ["Bố", "Mẹ", "Ông bà", "Cả nhà"],
          reply: "Cả nhà ai cũng thương cháu nhiều lắm." }
      ],
      parentTips: [
        "Con có nhớ bà ngoại tên là gì không?",
        "Em gái của bố thì con gọi là gì nhỉ?",
        "Con muốn gọi điện cho ông bà để nói gì?"
      ]
    },
    {
      id: "ngay-tet",
      title: "Ngày Tết",
      emoji: "🧧",
      steps: [
        { t: "say", text: "Cháu ơi, sắp đến Tết rồi! Ở Việt Nam, nhà nhà đều dọn dẹp, trang trí hoa đào, hoa mai." },
        { t: "ask", text: "Ngày Tết, người Việt hay gói bánh gì?",
          choices: ["Bánh chưng", "Bánh mì", "Bánh kem"], answer: 0,
          accept: ["chung"],
          recast: "Ngày Tết mình gói bánh chưng cháu ạ. Bánh chưng gói bằng lá dong, bên trong có gạo nếp, đậu xanh và thịt." },
        { t: "say", text: "Sáng mùng Một, các cháu mặc quần áo đẹp, đến chúc Tết ông bà." },
        { t: "ask", text: "Cháu chúc Tết {X} thế nào nhỉ?",
          choices: ["Cháu chúc {X} sống lâu, mạnh khỏe ạ", "Cho cháu tiền", "Chào {X}"], answer: 0,
          accept: ["chuc", "manh khoe", "song lau"],
          recast: "Mình chúc thế này nhé: Cháu chúc {X} sống lâu, mạnh khỏe ạ. Ông bà nghe là vui lắm.",
          yes: "{Xc} cảm ơn cháu! {Xc} cũng chúc cháu chăm ngoan, học giỏi." },
        { t: "say", text: "Rồi ông bà lì xì cho cháu một phong bao đỏ. Lì xì còn gọi là mừng tuổi, để chúc cháu một năm mới may mắn." },
        { t: "ask", text: "Khi được lì xì, cháu nói gì?",
          choices: ["Cháu cảm ơn {X} ạ", "Ít quá", "Không nói gì"], answer: 0,
          accept: ["cam on"],
          recast: "Khi được lì xì, cháu nhận bằng hai tay và nói: Cháu cảm ơn {X} ạ." },
        { t: "ask", open: true, text: "Tết ở nhà cháu có gì vui? Cháu kể cho {X} nghe với.",
          choices: ["Nhà cháu gói bánh chưng", "Cháu mặc áo dài", "Cháu xem múa lân", "Cháu gọi điện chúc Tết ông bà"],
          reply: "Vui quá! Ở đâu có cả nhà quây quần thì ở đó là Tết cháu ạ." }
      ],
      parentTips: [
        "Tết này con muốn chúc ông bà câu gì?",
        "Con nhận lì xì thì phải nói gì nhỉ?",
        "Nhà mình cùng gói bánh chưng hoặc làm một món Tết nhé!"
      ]
    }
  ],

  /* ===================== 3. ĐỒNG DAO – CA DAO ===================== */
  /* lines: các câu thơ; group: mỗi lần đọc theo bao nhiêu câu;
     meaning: các câu giải thích; ask: một câu hỏi nhỏ sau bài. */
  rhymes: [
    {
      id: "dung-dang",
      title: "Dung dăng dung dẻ",
      emoji: "👫",
      kind: "Đồng dao",
      group: 2,
      lines: [
        "Dung dăng dung dẻ", "Dắt trẻ đi chơi",
        "Đến ngõ nhà trời", "Lạy cậu lạy mợ",
        "Cho cháu về quê", "Cho dê đi học",
        "Cho cóc ở nhà", "Cho gà bới bếp",
        "Ngồi xệp xuống đây"
      ],
      meaning: [
        "Đây là bài đồng dao các bạn nhỏ nắm tay nhau, vừa đi vừa hát.",
        "Đến câu cuối, cả nhóm cùng ngồi xệp xuống đất, cười vui."
      ],
      ask: { text: "Đến câu cuối, các bạn nhỏ làm gì?",
             choices: ["Ngồi xuống", "Chạy đi", "Đi ngủ"], answer: 0,
             accept: ["ngoi"],
             recast: "Đến câu cuối, các bạn nhỏ cùng ngồi xệp xuống đấy cháu." },
      parentTips: [
        "Con nắm tay bố mẹ hát Dung dăng dung dẻ nhé!",
        "Trong bài, con dê được đi đâu?",
        "Con thích con vật nào trong bài nhất?"
      ]
    },
    {
      id: "cong-cha",
      title: "Công cha như núi Thái Sơn",
      emoji: "⛰️",
      kind: "Ca dao",
      group: 2,
      lines: [
        "Công cha như núi Thái Sơn", "Nghĩa mẹ như nước trong nguồn chảy ra",
        "Một lòng thờ mẹ kính cha", "Cho tròn chữ hiếu mới là đạo con"
      ],
      meaning: [
        "Công ơn của cha to lớn như ngọn núi cao. Tình thương của mẹ nhiều như nước chảy từ nguồn, không bao giờ cạn.",
        "Vì vậy, con cái phải yêu thương và kính trọng cha mẹ. Như thế gọi là có hiếu."
      ],
      ask: { text: "Công cha được so sánh với cái gì?",
             choices: ["Núi Thái Sơn", "Dòng sông", "Bầu trời"], answer: 0,
             accept: ["nui"],
             recast: "Công cha được so sánh với núi Thái Sơn, một ngọn núi rất cao cháu ạ." },
      parentTips: [
        "Con đọc cho bố mẹ nghe câu Công cha như núi Thái Sơn nhé.",
        "Theo con, thế nào là một người con có hiếu?",
        "Hôm nay con muốn giúp bố mẹ việc gì?"
      ]
    },
    {
      id: "bau-bi",
      title: "Bầu ơi thương lấy bí cùng",
      emoji: "🎃",
      kind: "Ca dao",
      group: 1,
      lines: [
        "Bầu ơi thương lấy bí cùng", "Tuy rằng khác giống nhưng chung một giàn"
      ],
      meaning: [
        "Quả bầu và quả bí khác nhau, nhưng cùng leo trên một giàn.",
        "Ý bài là: những người sống cùng một nơi phải thương yêu, giúp đỡ nhau. Người Việt mình ở xa quê cũng vậy đấy cháu."
      ],
      ask: { text: "Bầu và bí cùng leo ở đâu?",
             choices: ["Một giàn", "Một cái chậu", "Một cái ao"], answer: 0,
             accept: ["gian"],
             recast: "Bầu và bí cùng leo trên một giàn cháu ạ." },
      parentTips: [
        "Bầu và bí khác nhau ở chỗ nào hả con?",
        "Ở trường, con đã giúp bạn nào chưa?",
        "Con kể tên một người hàng xóm mà nhà mình hay giúp đỡ nhé."
      ]
    },
    {
      id: "bat-com",
      title: "Ai ơi bưng bát cơm đầy",
      emoji: "🌾",
      kind: "Ca dao",
      group: 1,
      lines: [
        "Ai ơi bưng bát cơm đầy", "Dẻo thơm một hạt, đắng cay muôn phần"
      ],
      meaning: [
        "Mỗi hạt gạo là công sức vất vả của bác nông dân, phải cày cấy dưới nắng mưa.",
        "Vì vậy, khi ăn cơm mình phải quý từng hạt, không bỏ phí cháu nhé."
      ],
      ask: { text: "Bài ca dao nhắc mình điều gì?",
             choices: ["Quý hạt cơm, không bỏ phí", "Ăn thật nhanh", "Không cần ăn cơm"], answer: 0,
             accept: ["quy", "bo phi"],
             recast: "Bài ca dao nhắc mình phải quý hạt cơm, không bỏ phí cháu ạ." },
      parentTips: [
        "Hạt gạo từ đâu mà có hả con?",
        "Hôm nay con có ăn hết cơm không?",
        "Con đọc lại câu Ai ơi bưng bát cơm đầy cho cả nhà nghe nhé."
      ]
    },
    {
      id: "con-meo",
      title: "Con mèo mà trèo cây cau",
      emoji: "🐱",
      kind: "Đồng dao",
      group: 2,
      lines: [
        "Con mèo mà trèo cây cau", "Hỏi thăm chú chuột đi đâu vắng nhà",
        "Chú chuột đi chợ đường xa", "Mua mắm mua muối giỗ cha chú mèo"
      ],
      meaning: [
        "Đây là bài vui. Mèo đi tìm chuột, nhưng chuột trốn mất.",
        "Chuột còn trêu mèo là đi chợ mua đồ về làm giỗ cho cha của mèo. Chú chuột tinh nghịch quá!"
      ],
      ask: { text: "Chú chuột bảo là đi đâu?",
             choices: ["Đi chợ", "Đi học", "Đi ngủ"], answer: 0,
             accept: ["cho"],
             recast: "Chú chuột nói là đi chợ đường xa, mua mắm mua muối cháu ạ." },
      parentTips: [
        "Con mèo trèo lên cây gì hả con?",
        "Chú chuột đi chợ mua những gì?",
        "Con đọc bài Con mèo mà trèo cây cau thật nhanh xem nào!"
      ]
    },
    {
      id: "ba-cong",
      title: "Bà còng đi chợ trời mưa",
      emoji: "🦐",
      kind: "Đồng dao",
      group: 2,
      lines: [
        "Bà còng đi chợ trời mưa", "Cái tôm cái tép đi đưa bà còng",
        "Đưa bà qua quãng đường đồng", "Đưa bà vào tận ngõ trong nhà bà"
      ],
      meaning: [
        "Trời mưa, bà cụ đi chợ một mình rất vất vả.",
        "Cái tôm cái tép ngoan ngoãn đưa bà về tận nhà. Bài dạy mình biết giúp đỡ người già."
      ],
      ask: { text: "Ai đưa bà còng về nhà?",
             choices: ["Cái tôm cái tép", "Con mèo", "Con chó"], answer: 0,
             accept: ["tom", "tep"],
             recast: "Cái tôm cái tép đưa bà còng về tận nhà đấy cháu." },
      parentTips: [
        "Trời mưa, ai đưa bà còng về nhà?",
        "Con có thể giúp ông bà việc gì?",
        "Lần sau gặp ông bà, con nói gì để hỏi thăm?"
      ]
    }
  ],

  /* ===================== 4. ĐỐ VUI VĂN HÓA ===================== */
  /* Mỗi lượt chơi lấy ngẫu nhiên quizPerRound câu. */
  quizPerRound: 5,
  quizzes: [
    { q: "Tết Nguyên Đán là Tết gì?",
      choices: ["Tết đón năm mới âm lịch", "Tết trồng cây", "Tết thiếu nhi"], answer: 0,
      explain: "Tết Nguyên Đán là Tết đón năm mới theo âm lịch, là Tết lớn nhất trong năm." },
    { q: "Ngày Tết, trẻ em thường được nhận gì?",
      choices: ["Tiền lì xì", "Bài tập", "Cái ô"], answer: 0,
      explain: "Ông bà, bố mẹ mừng tuổi cho trẻ em bằng phong bao lì xì màu đỏ." },
    { q: "Bánh chưng có hình gì?",
      choices: ["Hình vuông", "Hình tròn", "Hình tam giác"], answer: 0,
      explain: "Bánh chưng hình vuông, gói bằng lá dong, là món không thể thiếu ngày Tết." },
    { q: "Áo dài là gì?",
      choices: ["Trang phục truyền thống của Việt Nam", "Áo mưa", "Áo ngủ"], answer: 0,
      explain: "Áo dài là trang phục truyền thống, người Việt hay mặc vào ngày Tết và ngày lễ." },
    { q: "Đêm Trung thu, các bạn nhỏ thích rước gì?",
      choices: ["Đèn ông sao", "Cây thông", "Quả bóng bay"], answer: 0,
      explain: "Đêm rằm tháng Tám, các bạn nhỏ rước đèn ông sao, phá cỗ, ăn bánh nướng bánh dẻo." },
    { q: "Sợi phở được làm từ gì?",
      choices: ["Gạo", "Len", "Giấy"], answer: 0,
      explain: "Bánh phở làm từ bột gạo, ăn với nước dùng nóng, thịt bò hoặc thịt gà." },
    { q: "Nón lá có hình gì?",
      choices: ["Hình chóp nhọn", "Hình vuông", "Hình ngôi sao"], answer: 0,
      explain: "Nón lá hình chóp, làm từ lá cọ, để che nắng che mưa." },
    { q: "Ngày Tết ở miền Bắc, nhà mình hay chơi hoa gì?",
      choices: ["Hoa đào", "Hoa hướng dương", "Hoa tuyết"], answer: 0,
      explain: "Miền Bắc chơi hoa đào màu hồng, còn miền Nam chơi hoa mai màu vàng." },
    { q: "Ngày Tết ở miền Nam, nhà mình hay chơi hoa gì?",
      choices: ["Hoa mai", "Hoa đào", "Hoa sen"], answer: 0,
      explain: "Miền Nam chơi hoa mai vàng rực rỡ ngày Tết." },
    { q: "Bánh mì Việt Nam thường kẹp những gì?",
      choices: ["Thịt, pa-tê và rau", "Kem", "Kẹo"], answer: 0,
      explain: "Bánh mì Việt Nam giòn, kẹp thịt, pa-tê, rau thơm và dưa chua." },
    { q: "Múa lân thường có vào dịp nào?",
      choices: ["Tết và Trung thu", "Thứ Hai hằng tuần", "Lúc đi ngủ"], answer: 0,
      explain: "Múa lân có vào dịp Tết và Trung thu, tiếng trống rộn ràng để mang may mắn." },
    { q: "Thủ đô của Việt Nam là thành phố nào?",
      choices: ["Hà Nội", "Huế", "Đà Nẵng"], answer: 0,
      explain: "Thủ đô của Việt Nam là Hà Nội, có Hồ Gươm rất đẹp." },
    { q: "Ngày Tết, người Việt chúc nhau câu gì?",
      choices: ["Chúc mừng năm mới", "Chúc ngủ ngon", "Sinh nhật vui vẻ"], answer: 0,
      explain: "Ngày Tết, mình chúc nhau: Chúc mừng năm mới, an khang thịnh vượng." },
    { q: "Người đầu tiên đến nhà sáng mùng Một Tết gọi là gì?",
      choices: ["Người xông đất", "Người đi chợ", "Người đưa thư"], answer: 0,
      explain: "Người đến nhà đầu tiên sáng mùng Một là người xông đất, mang may mắn cho cả năm." },
    { q: "Người Việt hay nói mình là con cháu của ai?",
      choices: ["Con Rồng cháu Tiên", "Con mèo cháu chuột", "Con gà cháu vịt"], answer: 0,
      explain: "Truyền thuyết kể cha Lạc Long Quân là rồng, mẹ Âu Cơ là tiên, nên người Việt là con Rồng cháu Tiên." }
  ],
  quizTips: [
    "Tết năm nay con muốn chúc ông bà câu gì?",
    "Con kể cho bố mẹ một món ăn Việt Nam mà con thích nhé.",
    "Con có muốn mặc áo dài vào dịp Tết không?"
  ],

  /* Gợi ý chung khi cháu chưa học bài nào */
  generalTips: [
    "Hôm nay con học được từ tiếng Việt nào mới?",
    "Con kể cho bố mẹ nghe ông bà đã nói gì nhé.",
    "Con thích chơi phần nào nhất: kể chuyện, đồng dao hay đố vui?"
  ],

  /* ===================== TỪ KHÓ (Xem nghĩa) ===================== */
  /* "từ": { en: "tiếng Anh", zh: "tiếng Trung giản thể", py: "pinyin" } */
  glossary: {
    "chúc Tết": { en: "to give New Year wishes", zh: "拜年", py: "bàinián" },
    "mùng Một": { en: "the first day of Lunar New Year", zh: "正月初一", py: "zhēngyuè chūyī" },
    "dì ghẻ": { en: "stepmother", zh: "继母", py: "jìmǔ" },
    "Bụt": { en: "the kind Buddha spirit (in folk tales)", zh: "佛仙（童话中的善良神仙）", py: "fóxiān" },
    "tôm tép": { en: "small shrimp", zh: "小虾", py: "xiǎo xiā" },
    "cá bống": { en: "goby fish", zh: "虾虎鱼", py: "xiāhǔyú" },
    "giỏ": { en: "basket", zh: "篮子", py: "lánzi" },
    "ao": { en: "pond", zh: "池塘", py: "chítáng" },
    "hài": { en: "embroidered slipper", zh: "绣花鞋", py: "xiùhuāxié" },
    "hoàng hậu": { en: "queen", zh: "皇后", py: "huánghòu" },
    "hiền lành": { en: "kind, gentle", zh: "善良", py: "shànliáng" },
    "chăm chỉ": { en: "hard-working", zh: "勤劳", py: "qínláo" },
    "lười biếng": { en: "lazy", zh: "懒惰", py: "lǎnduò" },
    "lừa": { en: "to trick", zh: "欺骗", py: "qīpiàn" },
    "con nuôi": { en: "adopted child", zh: "养子", py: "yǎngzǐ" },
    "của cải": { en: "wealth, belongings", zh: "财富", py: "cáifù" },
    "đày": { en: "to send into exile", zh: "流放", py: "liúfàng" },
    "đảo hoang": { en: "deserted island", zh: "荒岛", py: "huāngdǎo" },
    "hạt giống": { en: "seed", zh: "种子", py: "zhǒngzi" },
    "thuyền buôn": { en: "merchant ship", zh: "商船", py: "shāngchuán" },
    "hối hận": { en: "to regret", zh: "后悔", py: "hòuhuǐ" },
    "tham lam": { en: "greedy", zh: "贪婪", py: "tānlán" },
    "cây khế": { en: "star fruit tree", zh: "杨桃树", py: "yángtáo shù" },
    "gang": { en: "hand span (thumb to little finger)", zh: "一拃（张开手掌的长度）", py: "yì zhǎ" },
    "sung túc": { en: "well-off, comfortable", zh: "富足", py: "fùzú" },
    "lễ phép": { en: "polite, respectful", zh: "有礼貌", py: "yǒu lǐmào" },
    "đôi đũa": { en: "pair of chopsticks", zh: "一双筷子", py: "yì shuāng kuàizi" },
    "canh chua": { en: "Vietnamese sour soup", zh: "越南酸汤", py: "Yuènán suāntāng" },
    "cá kho": { en: "braised fish", zh: "红烧鱼", py: "hóngshāoyú" },
    "khoanh tay": { en: "to fold your arms (to greet politely)", zh: "双手交叉（表示礼貌）", py: "shuāngshǒu jiāochā" },
    "bà ngoại": { en: "grandmother (mother's mother)", zh: "外婆", py: "wàipó" },
    "bà nội": { en: "grandmother (father's mother)", zh: "奶奶", py: "nǎinai" },
    "ông nội": { en: "grandfather (father's father)", zh: "爷爷", py: "yéye" },
    "ông ngoại": { en: "grandfather (mother's father)", zh: "外公", py: "wàigōng" },
    "dì": { en: "aunt (mother's younger sister)", zh: "姨妈", py: "yímā" },
    "mợ": { en: "aunt (wife of mother's brother)", zh: "舅妈", py: "jiùmā" },
    "ngõ": { en: "small lane, alley", zh: "小巷", py: "xiǎoxiàng" },
    "ngồi xệp": { en: "to sit down on the floor", zh: "坐在地上", py: "zuò zài dì shang" },
    "núi Thái Sơn": { en: "Mount Tai (a very high mountain)", zh: "泰山", py: "Tàishān" },
    "nguồn": { en: "spring, source of a river", zh: "源头", py: "yuántóu" },
    "chữ hiếu": { en: "filial piety (love and respect for parents)", zh: "孝道", py: "xiàodào" },
    "khác giống": { en: "of a different kind", zh: "不同品种", py: "bùtóng pǐnzhǒng" },
    "giàn": { en: "trellis (frame for climbing plants)", zh: "棚架", py: "péngjià" },
    "dẻo thơm": { en: "soft and fragrant (cooked rice)", zh: "软糯香甜", py: "ruǎnnuò xiāngtián" },
    "đắng cay": { en: "hardship", zh: "辛酸", py: "xīnsuān" },
    "bỏ phí": { en: "to waste", zh: "浪费", py: "làngfèi" },
    "cây cau": { en: "areca palm tree", zh: "槟榔树", py: "bīngláng shù" },
    "giỗ": { en: "death anniversary (family memorial day)", zh: "忌日", py: "jìrì" },
    "bà còng": { en: "old woman with a bent back", zh: "驼背的老奶奶", py: "tuóbèi de lǎo nǎinai" },
    "âm lịch": { en: "lunar calendar", zh: "农历", py: "nónglì" },
    "lì xì": { en: "lucky money (in red envelopes)", zh: "压岁钱", py: "yāsuìqián" },
    "mừng tuổi": { en: "to give New Year wishes and lucky money", zh: "拜年给压岁钱", py: "bàinián gěi yāsuìqián" },
    "bánh chưng": { en: "square sticky rice cake", zh: "方粽子", py: "fāng zòngzi" },
    "lá dong": { en: "dong leaves (used to wrap rice cakes)", zh: "柊叶", py: "zhōngyè" },
    "áo dài": { en: "Vietnamese long dress", zh: "越南长衫", py: "Yuènán chángshān" },
    "trang phục truyền thống": { en: "traditional costume", zh: "传统服装", py: "chuántǒng fúzhuāng" },
    "đèn ông sao": { en: "star-shaped lantern", zh: "五角星灯笼", py: "wǔjiǎoxīng dēnglong" },
    "phá cỗ": { en: "Mid-Autumn feast for children", zh: "中秋儿童宴", py: "Zhōngqiū értóng yàn" },
    "nón lá": { en: "conical leaf hat", zh: "斗笠", py: "dǒulì" },
    "múa lân": { en: "lion dance", zh: "舞狮", py: "wǔshī" },
    "hoa đào": { en: "peach blossom", zh: "桃花", py: "táohuā" },
    "hoa mai": { en: "yellow apricot blossom", zh: "黄梅花", py: "huáng méihuā" },
    "xông đất": { en: "first-footing (first visitor of the New Year)", zh: "新年第一位上门的客人", py: "xīnnián dì yī wèi shàngmén de kèrén" },
    "con Rồng cháu Tiên": { en: "children of the Dragon and the Fairy", zh: "龙子仙孙", py: "lóng zǐ xiān sūn" },
    "thủ đô": { en: "capital city", zh: "首都", py: "shǒudū" }
  }
};
