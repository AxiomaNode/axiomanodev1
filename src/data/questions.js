export const questions = {
  quadratic: [
    // ── gap: conceptual ──
    {
      id: "A1",
      text: "x² − x − 6 = 0 tenglamasining ildizlari qaysi juft?",
      options: [
        { value: "(3, −2)", label: "A" },
        { value: "(−3, 2)", label: "B" },
        { value: "(3, 2)", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "(3, −2)"
    },
    {
      id: "A2",
      text: "x = −2 ni x² + 3x − 10 = 0 ga qo'ysak natija nima? x = −2 bu tenglamaning ildizimi?",
      options: [
        { value: "Ha, (−2)² + 3(−2) − 10 = 0", label: "A" },
        { value: "Yo'q, 4 − 6 − 10 = −12 ≠ 0", label: "B" },
        { value: "Ha, chunki 2² + 3(2) − 10 = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Yo'q, 4 − 6 − 10 = −12 ≠ 0"
    },
    {
      id: "A2b",
      text: "x² − 7x + 12 = 0 da x = 4 ildizmi? Tekshirish: 4² − 7(4) + 12 = ?",
      options: [
        { value: "16 − 28 + 12 = 0 ✓ — ildiz", label: "A" },
        { value: "16 − 28 + 12 = 4 ✗ — ildiz emas", label: "B" },
        { value: "D = 49 − 48 = 1 > 0, demak ildiz bor", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "16 − 28 + 12 = 0 ✓ — ildiz"
    },
    {
      id: "A2c",
      text: "x = −3 ni x² + 5x + 6 = 0 ga qo'ysak: (−3)² + 5(−3) + 6 = 9 − 15 + 6 = ?",
      options: [
        { value: "0 — x = −3 ildiz", label: "A" },
        { value: "−6 — ildiz emas", label: "B" },
        { value: "6 — ildiz emas", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "0 — x = −3 ildiz"
    },

    // ── gap: discriminant ──
    {
      id: "A3",
      text: "2x² − 3x + 5 = 0 uchun D = b² − 4ac = 9 − 40 = −31. Bu nima anglatadi?",
      options: [
        { value: "D < 0 → haqiqiy ildizlar yo'q", label: "A" },
        { value: "D < 0 → bitta ildiz bor", label: "B" },
        { value: "D < 0 → ildizlar manfiy", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "D < 0 → haqiqiy ildizlar yo'q"
    },
    {
      id: "A3b",
      text: "x² − 6x + 9 = 0 uchun D = 36 − 36 = 0. Ildizlar qanday?",
      options: [
        { value: "x = ±3 (ikki ildiz)", label: "A" },
        { value: "x = 3 (bitta takrorlanuvchi ildiz)", label: "B" },
        { value: "Haqiqiy ildiz yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 3 (bitta takrorlanuvchi ildiz)"
    },
    {
      id: "A3c",
      text: "x² + 2x + 5 = 0: D = 4 − 20 = −16. Quyidagilardan qaysi biri to'g'ri?",
      options: [
        { value: "x = (−2 ± 4) / 2, ya'ni x = 1 yoki x = −3", label: "A" },
        { value: "Haqiqiy sonlar to'plamida ildiz yo'q", label: "B" },
        { value: "x = −1 yagona ildiz", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Haqiqiy sonlar to'plamida ildiz yo'q"
    },

    // ── gap: formal ──
    {
      id: "B1",
      text: "5x² − 10x = 0 ni yechishning eng samarali usuli?",
      options: [
        { value: "D = 100 − 0 = 100, x = (10 ± 10) / 10", label: "A" },
        { value: "5x(x − 2) = 0, demak x = 0 yoki x = 2", label: "B" },
        { value: "x² = 2x, demak x = 2", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "5x(x − 2) = 0, demak x = 0 yoki x = 2"
    },
    {
      id: "B2",
      text: "y = x² − 4x + 4 parabola Ox o'qiga qanday joylashgan? D = ?",
      options: [
        { value: "D = 16 − 16 = 0 → bitta nuqtada tegadi (x = 2)", label: "A" },
        { value: "D = 16 + 16 = 32 > 0 → ikki nuqtada kesadi", label: "B" },
        { value: "D < 0 → tegmaydi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "D = 16 − 16 = 0 → bitta nuqtada tegadi (x = 2)"
    },
    {
      id: "B1b",
      text: "3x² = 0 tenglamasini yechishning to'g'ri usuli qaysi?",
      options: [
        { value: "Diskriminant formulasi: x = (0 ± √0) / 6", label: "A" },
        { value: "x² = 0 demak x = 0 (yagona ildiz)", label: "B" },
        { value: "x = ±√3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² = 0 demak x = 0 (yagona ildiz)"
    },
    {
      id: "B2b",
      text: "x² − 9 = 0 ni ajratish usuli bilan: (x − 3)(x + 3) = 0. Ildizlar?",
      options: [
        { value: "x = 3 faqat", label: "A" },
        { value: "x = ±3", label: "B" },
        { value: "x = 9", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = ±3"
    },

    // ── gap: methodical ──
    {
      id: "C1",
      text: "x² + x − 6 = 0 uchun to'g'ri ko'paytuvchilarga ajratish qaysi? (p·q = −6, p+q = 1)",
      options: [
        { value: "(x + 3)(x − 2) = 0", label: "A" },
        { value: "(x + 6)(x − 1) = 0", label: "B" },
        { value: "(x − 3)(x + 2) = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "(x + 3)(x − 2) = 0"
    },
    {
      id: "C2",
      text: "−x² + 4x − 3 = 0 ni yechish uchun eng samarali birinchi qadam?",
      options: [
        { value: "Bevosita kvadrat formula ishlatish", label: "A" },
        { value: "−1 ga ko'paytirish: x² − 4x + 3 = 0", label: "B" },
        { value: "x = (−4 ± √(16 − 12)) / (−2)", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−1 ga ko'paytirish: x² − 4x + 3 = 0"
    },
    {
      id: "C1b",
      text: "x² − 25 = 0: qaysi ko'paytuvchi to'g'ri? (x² − a²) = (x − a)(x + a)",
      options: [
        { value: "(x − 25)(x + 1) = 0", label: "A" },
        { value: "(x − 5)(x + 5) = 0", label: "B" },
        { value: "(x − 5)² = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "(x − 5)(x + 5) = 0"
    },
    {
      id: "C2b",
      text: "x² − 10x + 25 = 0: eng tez usul? Diqqat: (x − 5)² ≠ (x − 5)(x + 5)",
      options: [
        { value: "Ayirmaning kvadrati: (x − 5)(x + 5) = 0 → x = ±5", label: "A" },
        { value: "To'liq kvadrat: (x − 5)² = 0 → x = 5", label: "B" },
        { value: "D = 100 − 100 = 0 → x = 10/2 = 5", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "To'liq kvadrat: (x − 5)² = 0 → x = 5"
    },

    // ── general ──
    {
      id: "D1",
      text: "x² − 5x + 6 = 0 ildizlari x₁ va x₂. Vieta: x₁ + x₂ = ? va x₁ · x₂ = ?",
      options: [
        { value: "x₁ + x₂ = 5,   x₁ · x₂ = 6", label: "A" },
        { value: "x₁ + x₂ = −5,  x₁ · x₂ = 6", label: "B" },
        { value: "x₁ + x₂ = 5,   x₁ · x₂ = −6", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x₁ + x₂ = 5,   x₁ · x₂ = 6"
    }
  ],

  systems: [
    // ── gap: conceptual ──
    {
      id: "S1",
      text: "2x + y = 5 va 4x + 2y = 10 sistema nechta yechimga ega? Nima uchun?",
      options: [
        { value: "Bitta — ular kesishadi", label: "A" },
        { value: "Cheksiz — ikkinchi tenglama birinchining 2 barobari", label: "B" },
        { value: "Nol — qarama-qarshi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Cheksiz — ikkinchi tenglama birinchining 2 barobari"
    },
    {
      id: "S2",
      text: "x + y = 3 va 2x + 2y = 7 sistema haqida nima deyish mumkin?",
      options: [
        { value: "Bitta yechim: (2, 1)", label: "A" },
        { value: "Cheksiz ko'p yechim", label: "B" },
        { value: "Yechim yo'q — tenglamalar qarama-qarshi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Yechim yo'q — tenglamalar qarama-qarshi"
    },
    {
      id: "S1b",
      text: "(2, −1) juftligi x − 2y = 4 va 3x + y = 5 sistemasining yechimimi? Tekshiring.",
      options: [
        { value: "Ha — 2−2(−1)=4 ✓ va 6+(−1)=5 ✓", label: "A" },
        { value: "Yo'q — birinchi tenglamadan chiqmaydi", label: "B" },
        { value: "Yo'q — ikkinchi tenglamadan chiqmaydi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Ha — 2−2(−1)=4 ✓ va 6+(−1)=5 ✓"
    },
    {
      id: "S2b",
      text: "x + y = 3 va x − y = 1 sistemasini qo'shish usulida yechsak x = ?",
      options: [
        { value: "x = 2", label: "A" },
        { value: "x = 1", label: "B" },
        { value: "x = 4", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 2"
    },

    // ── gap: substitution ──
    {
      id: "S3",
      text: "3x + 2y = 12 va x = 4 − y sistemasini o'rniga qo'yish usulida yechsak y = ?",
      options: [
        { value: "y = 0", label: "A" },
        { value: "y = 6", label: "B" },
        { value: "y = 2", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "y = 0"
    },
    {
      id: "S3b",
      text: "2x − y = 5 tenglamasidan y ni ifodalasak?",
      options: [
        { value: "y = 5 + 2x", label: "A" },
        { value: "y = 2x − 5", label: "B" },
        { value: "y = 5 − 2x", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "y = 2x − 5"
    },
    {
      id: "S3c",
      text: "5x + 3y = 11 va x = 1 + y bo'lsa, y = ? (o'rniga qo'ying)",
      options: [
        { value: "y = 1", label: "A" },
        { value: "y = 2", label: "B" },
        { value: "y = 3/8", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "y = 1"
    },

    // ── general ──
    {
      id: "S4",
      text: "x − 2y = 3 va 3x − 6y = 10 sistemasi: koeffitsientlar proporsionalmi?",
      options: [
        { value: "Ha, proporsional → cheksiz yechim", label: "A" },
        { value: "Proporsional emas → bitta yechim", label: "B" },
        { value: "Koeffitsientlar proporsional, o'ng taraf emas → yechim yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Koeffitsientlar proporsional, o'ng taraf emas → yechim yo'q"
    }
  ],

  functions: [
    // ── gap: conceptual ──
    {
      id: "F1",
      text: "Quyidagilardan qaysi biri funksiya emas va nima uchun?",
      options: [
        { value: "y = x² (har bir x ga bitta y)", label: "A" },
        { value: "y = ±√x (musbat x ga ikki y mos keladi)", label: "B" },
        { value: "y = 2x + 1 (chiziqli, funksiya)", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "y = ±√x (musbat x ga ikki y mos keladi)"
    },
    {
      id: "F2",
      text: "f(x) = x² − 4x + 3 bo'lsa, f(0) + f(4) = ?",
      options: [
        { value: "3 + 3 = 6", label: "A" },
        { value: "3 + (−1) = 2", label: "B" },
        { value: "0 + 0 = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "3 + 3 = 6"
    },
    {
      id: "F1b",
      text: "g(x) = 3x − 2 uchun g(g(2)) = ?",
      options: [
        { value: "10", label: "A" },
        { value: "4", label: "B" },
        { value: "12", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "10"
    },
    {
      id: "F1c",
      text: "f(a + 1) = 7 va f(x) = 2x + 1 bo'lsa, a = ?",
      options: [
        { value: "a = 2", label: "A" },
        { value: "a = 3", label: "B" },
        { value: "a = 4", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "a = 2"
    },

    // ── gap: graphical ──
    {
      id: "F3",
      text: "Vertikal chiziq testi: x = 2 da grafik 3 nuqtada kesishsa nima deyamiz?",
      options: [
        { value: "Funksiya tez o'sadi x = 2 da", label: "A" },
        { value: "Bu funksiya grafigi EMAS (bitta x ga 3 ta y)", label: "B" },
        { value: "Funksiya x = 2 da uzilishga ega", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bu funksiya grafigi EMAS (bitta x ga 3 ta y)"
    },
    {
      id: "F3b",
      text: "Grafik (−3, 0) va (0, 9) nuqtalardan o'tsa, f(−3) + f(0) = ?",
      options: [
        { value: "0 + 9 = 9", label: "A" },
        { value: "9 + 0 = 9 (tartib farq qilmaydi)", label: "B" },
        { value: "−3 + 0 = −3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "0 + 9 = 9"
    },
    {
      id: "F3c",
      text: "f(x) = x² ning ta'rif sohasi (domain) qaysi?",
      options: [
        { value: "Faqat musbat sonlar (x > 0)", label: "A" },
        { value: "Barcha haqiqiy sonlar (−∞, +∞)", label: "B" },
        { value: "Faqat x ≥ 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Barcha haqiqiy sonlar (−∞, +∞)"
    }
  ],

  inequalities: [
    // ── gap: conceptual ──
    {
      id: "I1",
      text: "(x − 2)(x + 3) > 0: musbat ko'paytma qachon hosil bo'ladi?",
      options: [
        { value: "x < −3 yoki x > 2", label: "A" },
        { value: "−3 < x < 2", label: "B" },
        { value: "x > 2 faqat", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x < −3 yoki x > 2"
    },
    {
      id: "I1b",
      text: "x² − 4x + 3 ≤ 0 tengsizligini yechish: birinchi qadam?",
      options: [
        { value: "x² − 4x + 3 = 0 ildizlarini topish (x=1, x=3)", label: "A" },
        { value: "Ikkala tarafni x ga bo'lish", label: "B" },
        { value: "Kvadrat ildiz olish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² − 4x + 3 = 0 ildizlarini topish (x=1, x=3)"
    },
    {
      id: "I1c",
      text: "x² < 9 → |x| < 3 → bu qanday yozilib ko'rsatiladi?",
      options: [
        { value: "x < 3", label: "A" },
        { value: "−3 < x < 3", label: "B" },
        { value: "x > −3 yoki x < 3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−3 < x < 3"
    },

    // ── gap: sign_flip ──
    {
      id: "I2",
      text: "−3x + 12 ≤ 6 → −3x ≤ −6 → x ___  2. Bo'shliqni to'ldiring.",
      options: [
        { value: "x ≤ 2 (belgi saqlanadi)", label: "A" },
        { value: "x ≥ 2 (manfiy ga bo'lganda belgi teskari)", label: "B" },
        { value: "x < 2", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x ≥ 2 (manfiy ga bo'lganda belgi teskari)"
    },
    {
      id: "I2b",
      text: "−2x > 8 tengsizligini yechsak: x = ?",
      options: [
        { value: "x > −4", label: "A" },
        { value: "x < −4", label: "B" },
        { value: "x > 4", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x < −4"
    },
    {
      id: "I2c",
      text: "3 − 5x ≥ −7 → −5x ≥ −10 → x ___ 2. Belgi?",
      options: [
        { value: "x ≥ 2", label: "A" },
        { value: "x ≤ 2 (−5 ga bo'lganda teskari)", label: "B" },
        { value: "x > 2", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x ≤ 2 (−5 ga bo'lganda teskari)"
    },

    // ── general ──
    {
      id: "I3",
      text: "x² − 9 ≤ 0 → (x−3)(x+3) ≤ 0. Ildizlar x = ±3. Yechim?",
      options: [
        { value: "x ≤ −3 yoki x ≥ 3", label: "A" },
        { value: "−3 ≤ x ≤ 3", label: "B" },
        { value: "x ≤ 3 faqat", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−3 ≤ x ≤ 3"
    }
  ],

  percentages: [
    // ── gap: conceptual ──
    {
      id: "PR1",
      text: "500 so'm narx 40% ga oshdi, so'ng 40% ga tushdi. Oxirgi narx?",
      options: [
        { value: "500 so'm (o'zgarmadi)", label: "A" },
        { value: "420 so'm (500 × 1.4 × 0.6 = 420)", label: "B" },
        { value: "460 so'm", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "420 so'm (500 × 1.4 × 0.6 = 420)"
    },
    {
      id: "PR2",
      text: "Narx 20% ga tushib 240 so'm bo'ldi. Asl narx?",
      options: [
        { value: "300 so'm", label: "A" },
        { value: "288 so'm (240 × 1.2)", label: "B" },
        { value: "200 so'm", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "300 so'm"
    },
    {
      id: "PR3",
      text: "15 dan 18 ga o'tish necha foiz o'sish?",
      options: [
        { value: "15%", label: "A" },
        { value: "20%", label: "B" },
        { value: "3%", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "20%"
    },
    {
      id: "PR4",
      text: "Yig'im = 800 so'm, soliq 15%. To'lash kerak bo'lgan jami miqdor?",
      options: [
        { value: "920 so'm", label: "A" },
        { value: "815 so'm", label: "B" },
        { value: "680 so'm", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "920 so'm"
    },
    {
      id: "PR5",
      text: "A dan B ga o'tganda +25%. B dan A ga qaytganda necha foiz kamayish?",
      options: [
        { value: "25% kamayish", label: "A" },
        { value: "20% kamayish", label: "B" },
        { value: "75% kamayish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "20% kamayish"
    },
    {
      id: "PR6",
      text: "60 dan 45 ga pasayish necha foiz?",
      options: [
        { value: "15%", label: "A" },
        { value: "25%", label: "B" },
        { value: "33.3%", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "25%"
    },
    {
      id: "PR7",
      text: "1000 so'm 3 yil 10% yillik foizda (murakkab). Oxirgi qiymat?",
      options: [
        { value: "1300 so'm (oddiy foiz)", label: "A" },
        { value: "1331 so'm (1000 × 1.1³)", label: "B" },
        { value: "1100 so'm", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "1331 so'm (1000 × 1.1³)"
    },
    {
      id: "PR8",
      text: "Mahsulot narxi ketma-ket 10% va 10% oshirildi. Jami o'sish necha foiz?",
      options: [
        { value: "20%", label: "A" },
        { value: "21% (1.1 × 1.1 = 1.21)", label: "B" },
        { value: "19%", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "21% (1.1 × 1.1 = 1.21)"
    }
  ]
};