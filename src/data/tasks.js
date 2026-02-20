export const tasks = {
  quadratic: {
    conceptual: [
      {
        id: "qc1",
        text: "x² − 9 = 0 tenglamaning ildizlari qaysi?",
        options: [
          { label: "A", value: "x = 3" },
          { label: "B", value: "x = 9" },
          { label: "C", value: "x = 3 va x = −3" },
          { label: "D", value: "x = −9" }
        ],
        correct: "C",
        explanation: "x² = 9, demak x = ±3. Ildiz — bu tenglamani to'g'ri qiladigan son."
      },
      {
        id: "qc2",
        text: "x = 2 soni x² − 3x + 2 = 0 tenglamaning ildizimi?",
        options: [
          { label: "A", value: "Ha, chunki 4 − 6 + 2 = 0" },
          { label: "B", value: "Yo'q" },
          { label: "C", value: "Tekshirish mumkin emas" },
          { label: "D", value: "Faqat formula bilan aniqlanadi" }
        ],
        correct: "A",
        explanation: "2² − 3(2) + 2 = 4 − 6 + 2 = 0. Ha, bu ildiz."
      },
      {
        id: "qc3",
        text: "Agar x² = 16 bo'lsa, x nechaga teng?",
        options: [
          { label: "A", value: "x = 4" },
          { label: "B", value: "x = 8" },
          { label: "C", value: "x = 4 va x = −4" },
          { label: "D", value: "x = 16" }
        ],
        correct: "C",
        explanation: "x² = 16 dan x = ±4. Ikki ildiz bor."
      },
      {
        id: "qc4",
        text: "Kvadrat tenglamaning standart ko'rinishi qaysi?",
        options: [
          { label: "A", value: "ax + b = 0" },
          { label: "B", value: "ax² + bx + c = 0, a ≠ 0" },
          { label: "C", value: "x² = a" },
          { label: "D", value: "ax³ + bx² = 0" }
        ],
        correct: "B",
        explanation: "Kvadrat tenglama ax² + bx + c = 0 ko'rinishida bo'lib, a ≠ 0 bo'lishi shart."
      },
      {
        id: "qc5",
        text: "x = −1 soni x² + x = 0 tenglamaning ildizimi?",
        options: [
          { label: "A", value: "Ha, chunki 1 + (−1) = 0" },
          { label: "B", value: "Yo'q" },
          { label: "C", value: "Faqat x = 0 ildiz" },
          { label: "D", value: "Aniqlab bo'lmaydi" }
        ],
        correct: "A",
        explanation: "(−1)² + (−1) = 1 − 1 = 0. Demak x = −1 ildiz."
      },
      {
        id: "qc6",
        text: "Agar tenglama (x − 5)(x + 2) = 0 bo'lsa, ildizlar qaysi?",
        options: [
          { label: "A", value: "x = 5 va x = 2" },
          { label: "B", value: "x = −5 va x = 2" },
          { label: "C", value: "x = 5 va x = −2" },
          { label: "D", value: "x = −5 va x = −2" }
        ],
        correct: "C",
        explanation: "Ko'paytma nolga teng bo'lishi uchun omillardan biri nolga teng: x − 5 = 0 → x = 5; x + 2 = 0 → x = −2."
      }
    ],
    discriminant: [
      {
        id: "qd1",
        text: "x² + 2x + 5 = 0 uchun D ni hisoblang. Nechta ildiz bor?",
        options: [
          { label: "A", value: "D = 16, ikkita ildiz" },
          { label: "B", value: "D = −16, ildiz yo'q" },
          { label: "C", value: "D = 0, bitta ildiz" },
          { label: "D", value: "D = 4, ikkita ildiz" }
        ],
        correct: "B",
        explanation: "D = 4 − 20 = −16 < 0. Haqiqiy ildiz yo'q."
      },
      {
        id: "qd2",
        text: "D = 0 bo'lganda nima bo'ladi?",
        options: [
          { label: "A", value: "Yechim yo'q" },
          { label: "B", value: "Ikkita turli ildiz" },
          { label: "C", value: "Bitta takrorlanuvchi ildiz" },
          { label: "D", value: "Cheksiz ildiz" }
        ],
        correct: "C",
        explanation: "D = 0 bo'lganda tenglamaning bitta (takrorlanuvchi) ildizi bor."
      },
      {
        id: "qd3",
        text: "x² − 5x + 6 = 0 uchun diskriminant qancha?",
        options: [
          { label: "A", value: "D = 1" },
          { label: "B", value: "D = 25" },
          { label: "C", value: "D = −1" },
          { label: "D", value: "D = 49" }
        ],
        correct: "A",
        explanation: "D = b² − 4ac = 25 − 24 = 1 > 0. Ikkita haqiqiy ildiz bor."
      },
      {
        id: "qd4",
        text: "3x² − 12x + 12 = 0 uchun D nechaga teng?",
        options: [
          { label: "A", value: "D = 0" },
          { label: "B", value: "D = 144" },
          { label: "C", value: "D = −144" },
          { label: "D", value: "D = 288" }
        ],
        correct: "A",
        explanation: "D = (−12)² − 4·3·12 = 144 − 144 = 0. Bitta takrorlanuvchi ildiz."
      },
      {
        id: "qd5",
        text: "D > 0 bo'lganda tenglamaning nechta ildizi bor?",
        options: [
          { label: "A", value: "Ildiz yo'q" },
          { label: "B", value: "Bitta ildiz" },
          { label: "C", value: "Ikkita ildiz" },
          { label: "D", value: "Uchta ildiz" }
        ],
        correct: "C",
        explanation: "D > 0 bo'lganda tenglamaning ikkita turli haqiqiy ildizi mavjud."
      }
    ],
    formal: [
      {
        id: "qf1",
        text: "2x² + 4x = 0 ni eching.",
        options: [
          { label: "A", value: "x = 0 va x = −2" },
          { label: "B", value: "x = 2" },
          { label: "C", value: "x = −4" },
          { label: "D", value: "Yechim yo'q" }
        ],
        correct: "A",
        explanation: "2x(x + 2) = 0, demak x = 0 yoki x = −2."
      },
      {
        id: "qf2",
        text: "x² − 6x + 9 = 0. Ildizlar nechta?",
        options: [
          { label: "A", value: "Ildiz yo'q" },
          { label: "B", value: "x = 3 (bitta ildiz)" },
          { label: "C", value: "x = 3 va x = −3" },
          { label: "D", value: "x = 9" }
        ],
        correct: "B",
        explanation: "(x − 3)² = 0, demak x = 3 — bitta takrorlanuvchi ildiz."
      },
      {
        id: "qf3",
        text: "x² − 7x + 10 = 0 tenglamaning ildizlari?",
        options: [
          { label: "A", value: "x = 2 va x = 5" },
          { label: "B", value: "x = −2 va x = −5" },
          { label: "C", value: "x = 1 va x = 10" },
          { label: "D", value: "x = 7 va x = 1" }
        ],
        correct: "A",
        explanation: "(x − 2)(x − 5) = 0. Yig'indisi −7, ko'paytmasi 10: 2 va 5."
      },
      {
        id: "qf4",
        text: "Diskriminant formulasi to'g'ri ko'rsatilgan qaysi?",
        options: [
          { label: "A", value: "D = b² + 4ac" },
          { label: "B", value: "D = b² − 4ac" },
          { label: "C", value: "D = 2b − 4ac" },
          { label: "D", value: "D = −b² + 4ac" }
        ],
        correct: "B",
        explanation: "Diskriminant formulasi: D = b² − 4ac."
      },
      {
        id: "qf5",
        text: "x² − 4 = 0 tenglamani eching.",
        options: [
          { label: "A", value: "x = 2" },
          { label: "B", value: "x = ±4" },
          { label: "C", value: "x = ±2" },
          { label: "D", value: "x = 4" }
        ],
        correct: "C",
        explanation: "x² = 4, demak x = ±2."
      },
      {
        id: "qf6",
        text: "Vieta teoremasi bo'yicha x² + px + q = 0 da ildizlar yig'indisi nechaga teng?",
        options: [
          { label: "A", value: "q" },
          { label: "B", value: "p" },
          { label: "C", value: "−p" },
          { label: "D", value: "−q" }
        ],
        correct: "C",
        explanation: "Vieta teoremasi: x₁ + x₂ = −p, x₁ · x₂ = q."
      }
    ],
    methodical: [
      {
        id: "qm1",
        text: "x² − 25 = 0 uchun eng qulay usul qaysi?",
        options: [
          { label: "A", value: "Diskriminant formulasi" },
          { label: "B", value: "x² = 25 → x = ±5" },
          { label: "C", value: "Grafik usuli" },
          { label: "D", value: "Ko'paytuvchilarga ajratish" }
        ],
        correct: "B",
        explanation: "Bu eng oddiy usul — to'g'ridan-to'g'ri x² = 25 dan x = ±5."
      },
      {
        id: "qm2",
        text: "x² + 6x + 8 = 0 ni ko'paytuvchilarga ajrating.",
        options: [
          { label: "A", value: "(x + 2)(x + 4)" },
          { label: "B", value: "(x − 2)(x − 4)" },
          { label: "C", value: "(x + 1)(x + 8)" },
          { label: "D", value: "(x + 6)(x + 2)" }
        ],
        correct: "A",
        explanation: "2 + 4 = 6 ✓, 2 × 4 = 8 ✓. Demak (x + 2)(x + 4)."
      },
      {
        id: "qm3",
        text: "Qaysi holatda diskriminant formulasini ishlatish eng maqsadga muvofiq?",
        options: [
          { label: "A", value: "x² = a ko'rinishida" },
          { label: "B", value: "Ko'paytuvchilar oson topilganda" },
          { label: "C", value: "Murakkab koeffitsientlarda" },
          { label: "D", value: "c = 0 bo'lganda" }
        ],
        correct: "C",
        explanation: "Diskriminant formulasi murakkab yoki kasr koeffitsientlarda eng qulay."
      }
    ]
  },

  systems: {
    conceptual: [
      {
        id: "sc1",
        text: "x + y = 5 va x − y = 1 sistemasining yechimi qaysi?",
        options: [
          { label: "A", value: "x = 3, y = 2" },
          { label: "B", value: "x = 5, y = 1" },
          { label: "C", value: "x = 2, y = 3" },
          { label: "D", value: "Yechim yo'q" }
        ],
        correct: "A",
        explanation: "Tenglamalarni qo'shsak: 2x = 6, x = 3. Demak y = 2. Tekshirish: 3+2=5 ✓, 3−2=1 ✓"
      },
      {
        id: "sc2",
        text: "Tenglamalar sistemasining yechimi nima?",
        options: [
          { label: "A", value: "Faqat x qiymati" },
          { label: "B", value: "Barcha noma'lumlarning qiymatlari" },
          { label: "C", value: "Tenglamalar yig'indisi" },
          { label: "D", value: "Diskriminant" }
        ],
        correct: "B",
        explanation: "Sistema yechimi — barcha noma'lumlar uchun bir vaqtda hamma tenglamalarni qanoatlantiruvchi qiymatlar to'plami."
      },
      {
        id: "sc3",
        text: "2x + y = 8 va x = 3 bo'lsa, y nechaga teng?",
        options: [
          { label: "A", value: "y = 5" },
          { label: "B", value: "y = 2" },
          { label: "C", value: "y = 11" },
          { label: "D", value: "y = 3" }
        ],
        correct: "B",
        explanation: "x = 3 ni birinchi tenglamaga qo'yilsa: 6 + y = 8, y = 2."
      },
      {
        id: "sc4",
        text: "Quyidagi juft qiymatlardan qaysi biri x + 2y = 10 tenglamani qanoatlantiradi?",
        options: [
          { label: "A", value: "x = 4, y = 3" },
          { label: "B", value: "x = 2, y = 4" },
          { label: "C", value: "x = 6, y = 3" },
          { label: "D", value: "x = 0, y = 5" }
        ],
        correct: "B",
        explanation: "2 + 2(4) = 2 + 8 = 10 ✓. Boshqalari: 4+6=10 ✓ ham. Lekin C: 6+6=12 ✗. Tekshirish: B to'g'ri."
      }
    ],
    substitution: [
      {
        id: "ss1",
        text: "y = 2x va x + y = 9. x nechaga teng?",
        options: [
          { label: "A", value: "x = 9" },
          { label: "B", value: "x = 3" },
          { label: "C", value: "x = 4.5" },
          { label: "D", value: "x = 6" }
        ],
        correct: "B",
        explanation: "y = 2x ni ikkinchisiga qo'ysak: x + 2x = 9, 3x = 9, x = 3."
      },
      {
        id: "ss2",
        text: "y = x − 1 va 2x + y = 11. y qancha?",
        options: [
          { label: "A", value: "y = 4" },
          { label: "B", value: "y = 3" },
          { label: "C", value: "y = 5" },
          { label: "D", value: "y = 6" }
        ],
        correct: "B",
        explanation: "2x + (x − 1) = 11 → 3x = 12 → x = 4. y = 4 − 1 = 3."
      },
      {
        id: "ss3",
        text: "Qo'shish usulida qaysi amal bajariladi?",
        options: [
          { label: "A", value: "Biror noma'lum ifodalanadi" },
          { label: "B", value: "Ikki tenglama qo'shiladi yoki ayiriladi" },
          { label: "C", value: "Grafik chiziladi" },
          { label: "D", value: "Diskriminant topiladi" }
        ],
        correct: "B",
        explanation: "Qo'shish (algebraik yig'ish) usulida bir noma'lumni yo'qotish uchun tenglamalar qo'shiladi yoki ayiriladi."
      },
      {
        id: "ss4",
        text: "x = 3y va 2x − y = 10. y nechaga teng?",
        options: [
          { label: "A", value: "y = 2" },
          { label: "B", value: "y = 3" },
          { label: "C", value: "y = 5" },
          { label: "D", value: "y = 1" }
        ],
        correct: "A",
        explanation: "2(3y) − y = 10 → 6y − y = 10 → 5y = 10 → y = 2."
      }
    ],
    elimination: [
      {
        id: "se1",
        text: "3x + 2y = 12 va 3x − 2y = 6. x va y ni toping.",
        options: [
          { label: "A", value: "x = 3, y = 1.5" },
          { label: "B", value: "x = 2, y = 3" },
          { label: "C", value: "x = 4, y = 0" },
          { label: "D", value: "x = 1, y = 4.5" }
        ],
        correct: "A",
        explanation: "Qo'shsak: 6x = 18 → x = 3. Ayirsak: 4y = 6 → y = 1.5."
      },
      {
        id: "se2",
        text: "x + y = 7 va x − y = 3. x nechaga teng?",
        options: [
          { label: "A", value: "x = 5" },
          { label: "B", value: "x = 7" },
          { label: "C", value: "x = 3" },
          { label: "D", value: "x = 2" }
        ],
        correct: "A",
        explanation: "Tenglamalarni qo'shsak: 2x = 10 → x = 5."
      }
    ]
  },

  functions: {
    conceptual: [
      {
        id: "fc1",
        text: "f(x) = 2x + 1 bo'lsa, f(4) = ?",
        options: [
          { label: "A", value: "7" },
          { label: "B", value: "9" },
          { label: "C", value: "8" },
          { label: "D", value: "5" }
        ],
        correct: "B",
        explanation: "f(4) = 2(4) + 1 = 8 + 1 = 9."
      },
      {
        id: "fc2",
        text: "f(x) = x² − 3 bo'lsa, f(−2) = ?",
        options: [
          { label: "A", value: "−7" },
          { label: "B", value: "1" },
          { label: "C", value: "7" },
          { label: "D", value: "−1" }
        ],
        correct: "B",
        explanation: "f(−2) = (−2)² − 3 = 4 − 3 = 1."
      },
      {
        id: "fc3",
        text: "Funksiya ta'rifi nima?",
        options: [
          { label: "A", value: "Har bir y uchun bir nechta x" },
          { label: "B", value: "Har bir x uchun aynan bitta y" },
          { label: "C", value: "x va y o'rtasidagi ixtiyoriy bog'liqlik" },
          { label: "D", value: "Faqat chiziqli bog'liqlik" }
        ],
        correct: "B",
        explanation: "Funksiya — har bir x argumentiga aynan bitta y qiymat mos keladigan qoida."
      },
      {
        id: "fc4",
        text: "g(x) = 3x − 5 bo'lsa, g(0) nechaga teng?",
        options: [
          { label: "A", value: "3" },
          { label: "B", value: "5" },
          { label: "C", value: "−5" },
          { label: "D", value: "0" }
        ],
        correct: "C",
        explanation: "g(0) = 3(0) − 5 = −5."
      },
      {
        id: "fc5",
        text: "f(x) = 5 bo'lsa (doimiy funksiya), f(100) nechaga teng?",
        options: [
          { label: "A", value: "100" },
          { label: "B", value: "500" },
          { label: "C", value: "5" },
          { label: "D", value: "0" }
        ],
        correct: "C",
        explanation: "Doimiy funksiyada har qanday x uchun qiymat o'zgarmaydi. f(100) = 5."
      },
      {
        id: "fc6",
        text: "h(x) = x² + 2x bo'lsa, h(3) nechaga teng?",
        options: [
          { label: "A", value: "15" },
          { label: "B", value: "13" },
          { label: "C", value: "11" },
          { label: "D", value: "9" }
        ],
        correct: "A",
        explanation: "h(3) = 9 + 6 = 15."
      }
    ],
    graphical: [
      {
        id: "fg1",
        text: "Agar grafik (0, 3) nuqtadan o'tsa, bu nimani bildiradi?",
        options: [
          { label: "A", value: "x = 3 bo'lganda y = 0" },
          { label: "B", value: "Funksiyaning boshlang'ich qiymati 3" },
          { label: "C", value: "Grafik x o'qini 3 da kesadi" },
          { label: "D", value: "Funksiyaning ildizi 3" }
        ],
        correct: "B",
        explanation: "(0, 3) — bu y o'qi bilan kesishish nuqtasi. x = 0 da y = 3."
      },
      {
        id: "fg2",
        text: "f(x) = x ning grafigi qaysi?",
        options: [
          { label: "A", value: "Parabola" },
          { label: "B", value: "Boshlanuvchi nuqtadan o'tadigan to'g'ri chiziq" },
          { label: "C", value: "Gorizontal to'g'ri chiziq" },
          { label: "D", value: "Vertikal to'g'ri chiziq" }
        ],
        correct: "B",
        explanation: "f(x) = x — bu koordinatalar boshi orqali o'tadigan 45° li to'g'ri chiziq."
      },
      {
        id: "fg3",
        text: "Grafik x o'qini (4, 0) da kessа, bu nima?",
        options: [
          { label: "A", value: "Funksiyaning qiymati" },
          { label: "B", value: "Funksiyaning ildizi (nol nuqtasi)" },
          { label: "C", value: "y o'qi bilan kesishish" },
          { label: "D", value: "Koordinatalar boshi" }
        ],
        correct: "B",
        explanation: "Grafik x o'qini kesgan nuqta funksiyaning ildizi yoki nol nuqtasidir."
      },
      {
        id: "fg4",
        text: "f(x) = 2x + 3 funksiyasining qiyalik koeffitsienti (slope) nechaga teng?",
        options: [
          { label: "A", value: "3" },
          { label: "B", value: "2x" },
          { label: "C", value: "2" },
          { label: "D", value: "5" }
        ],
        correct: "C",
        explanation: "f(x) = mx + b shaklida m = 2 — qiyalik koeffitsienti."
      }
    ],
    domain: [
      {
        id: "fd1",
        text: "f(x) = 1/x funksiyasining ta'rif sohasi qaysi?",
        options: [
          { label: "A", value: "Barcha haqiqiy sonlar" },
          { label: "B", value: "x ≠ 0 bo'lgan haqiqiy sonlar" },
          { label: "C", value: "x > 0" },
          { label: "D", value: "x ≥ 0" }
        ],
        correct: "B",
        explanation: "x = 0 bo'lganda bo'lish amali bajarilmaydi. Shuning uchun x ≠ 0."
      },
      {
        id: "fd2",
        text: "f(x) = √x funksiyasining ta'rif sohasi qaysi?",
        options: [
          { label: "A", value: "Barcha haqiqiy sonlar" },
          { label: "B", value: "x > 0" },
          { label: "C", value: "x ≥ 0" },
          { label: "D", value: "x ≠ 0" }
        ],
        correct: "C",
        explanation: "Manfiy sondan kvadrat ildiz olib bo'lmaydi. Shuning uchun x ≥ 0."
      }
    ]
  },

  inequalities: {
    conceptual: [
      {
        id: "ic1",
        text: "2x + 1 > 7 tengsizlikning yechimi qaysi?",
        options: [
          { label: "A", value: "x > 3" },
          { label: "B", value: "x > 4" },
          { label: "C", value: "x = 3" },
          { label: "D", value: "x < 3" }
        ],
        correct: "A",
        explanation: "2x > 6, x > 3. Yechim — 3 dan katta barcha sonlar."
      },
      {
        id: "ic2",
        text: "x < 5 tengsizlikni qanoatlantiruvchi butun son qaysi?",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "6" },
          { label: "C", value: "4" },
          { label: "D", value: "5.1" }
        ],
        correct: "C",
        explanation: "4 < 5 ✓. 5 yoki undan katta sonlar x < 5 ni qanoatlantirmaydi."
      },
      {
        id: "ic3",
        text: "3x − 2 ≥ 10 tengsizligini eching.",
        options: [
          { label: "A", value: "x ≥ 4" },
          { label: "B", value: "x ≥ 3" },
          { label: "C", value: "x > 4" },
          { label: "D", value: "x ≤ 4" }
        ],
        correct: "A",
        explanation: "3x ≥ 12 → x ≥ 4."
      },
      {
        id: "ic4",
        text: "Tengsizlik sonlar o'qida qanday ko'rsatiladi?",
        options: [
          { label: "A", value: "Doimo nuqta bilan" },
          { label: "B", value: "Ochiq yoki yopiq krujok va strelka" },
          { label: "C", value: "Faqat yopiq krujok" },
          { label: "D", value: "X belgisi" }
        ],
        correct: "B",
        explanation: "≤ yoki ≥ uchun yopiq (to'ldirilgan) krujok, < yoki > uchun ochiq krujok ishlatiladi."
      },
      {
        id: "ic5",
        text: "5 − 2x < 1 ni eching.",
        options: [
          { label: "A", value: "x < 2" },
          { label: "B", value: "x > 2" },
          { label: "C", value: "x > −2" },
          { label: "D", value: "x < −2" }
        ],
        correct: "B",
        explanation: "−2x < −4 → x > 2 (manfiy songa bo'linganda belgi o'zgaradi)."
      }
    ],
    sign_flip: [
      {
        id: "is1",
        text: "−3x < 12 tengsizlikni eching.",
        options: [
          { label: "A", value: "x < −4" },
          { label: "B", value: "x > −4" },
          { label: "C", value: "x < 4" },
          { label: "D", value: "x > 4" }
        ],
        correct: "B",
        explanation: "Manfiy songa bo'lganda belgi o'zgaradi: x > −4."
      },
      {
        id: "is2",
        text: "−x > 5 bo'lsa, x nechaga teng?",
        options: [
          { label: "A", value: "x > 5" },
          { label: "B", value: "x > −5" },
          { label: "C", value: "x < −5" },
          { label: "D", value: "x < 5" }
        ],
        correct: "C",
        explanation: "Ikki tarafni −1 ga ko'paytirsak (yoki bo'lsak), belgi o'zgaradi: x < −5."
      },
      {
        id: "is3",
        text: "−2x ≥ 8 tengsizligini eching.",
        options: [
          { label: "A", value: "x ≥ −4" },
          { label: "B", value: "x ≤ −4" },
          { label: "C", value: "x ≥ 4" },
          { label: "D", value: "x ≤ 4" }
        ],
        correct: "B",
        explanation: "Manfiy songa bo'lganda: x ≤ −4."
      },
      {
        id: "is4",
        text: "Qaysi amalda tengsizlik belgisi o'zgaradi?",
        options: [
          { label: "A", value: "Ikki tarafga musbat son qo'shganda" },
          { label: "B", value: "Ikki tarafni musbat songa ko'paytirganda" },
          { label: "C", value: "Ikki tarafni manfiy songa ko'paytirganda yoki bo'lganda" },
          { label: "D", value: "Ikki tarafdan bir xil son ayirganda" }
        ],
        correct: "C",
        explanation: "Faqat manfiy songa ko'paytirish yoki bo'lish paytida tengsizlik belgisi o'zgaradi."
      }
    ],
    compound: [
      {
        id: "ico1",
        text: "−1 < x ≤ 3 oraliqdagi butun sonlar qaysi?",
        options: [
          { label: "A", value: "0, 1, 2, 3" },
          { label: "B", value: "−1, 0, 1, 2, 3" },
          { label: "C", value: "0, 1, 2" },
          { label: "D", value: "−1, 0, 1, 2" }
        ],
        correct: "A",
        explanation: "x > −1 (−1 kirmaydi) va x ≤ 3 (3 kiradi). Butun sonlar: 0, 1, 2, 3."
      },
      {
        id: "ico2",
        text: "2 < x < 6 va x < 4 bir vaqtda bo'lsa, x qaysi oraliqda?",
        options: [
          { label: "A", value: "2 < x < 6" },
          { label: "B", value: "2 < x < 4" },
          { label: "C", value: "x < 4" },
          { label: "D", value: "4 < x < 6" }
        ],
        correct: "B",
        explanation: "Ikki shartning kesishishi: 2 < x < 4."
      }
    ]
  },

  percentages: {
    conceptual: [
      {
        id: "pc1",
        text: "50 ning 20% i nechaga teng?",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "10" },
          { label: "C", value: "20" },
          { label: "D", value: "25" }
        ],
        correct: "B",
        explanation: "50 × 20/100 = 50 × 0.2 = 10."
      },
      {
        id: "pc2",
        text: "200 dan 150 necha foiz?",
        options: [
          { label: "A", value: "50%" },
          { label: "B", value: "75%" },
          { label: "C", value: "25%" },
          { label: "D", value: "60%" }
        ],
        correct: "B",
        explanation: "150/200 × 100 = 75%."
      },
      {
        id: "pc3",
        text: "Narx 400 dan 500 ga oshdi. Necha foizga oshdi?",
        options: [
          { label: "A", value: "20%" },
          { label: "B", value: "25%" },
          { label: "C", value: "10%" },
          { label: "D", value: "100%" }
        ],
        correct: "B",
        explanation: "(500 − 400)/400 × 100 = 100/400 × 100 = 25%."
      },
      {
        id: "pc4",
        text: "X ning 40% i 80 ga teng. X nechaga teng?",
        options: [
          { label: "A", value: "40" },
          { label: "B", value: "120" },
          { label: "C", value: "200" },
          { label: "D", value: "160" }
        ],
        correct: "C",
        explanation: "0.4 × X = 80 → X = 200."
      },
      {
        id: "pc5",
        text: "300 dan 15% ni ayirsak nechaga teng?",
        options: [
          { label: "A", value: "285" },
          { label: "B", value: "255" },
          { label: "C", value: "245" },
          { label: "D", value: "265" }
        ],
        correct: "B",
        explanation: "15% dan 300 = 45. 300 − 45 = 255."
      }
    ],
    applied: [
      {
        id: "pa1",
        text: "Do'konda 30% chegirma bor. Narx 600 so'm. Chegirmadan keyin narx qancha?",
        options: [
          { label: "A", value: "420 so'm" },
          { label: "B", value: "180 so'm" },
          { label: "C", value: "480 so'm" },
          { label: "D", value: "570 so'm" }
        ],
        correct: "A",
        explanation: "600 × 0.70 = 420. Yoki: 600 − 600×0.30 = 600 − 180 = 420."
      },
      {
        id: "pa2",
        text: "Ish haqi 2000 so'mdan 2500 so'mga oshdi. Necha foizga oshdi?",
        options: [
          { label: "A", value: "20%" },
          { label: "B", value: "25%" },
          { label: "C", value: "500%" },
          { label: "D", value: "15%" }
        ],
        correct: "B",
        explanation: "(2500 − 2000)/2000 × 100 = 500/2000 × 100 = 25%."
      }
    ]
  },

  ratios: {
    conceptual: [
      {
        id: "rc1",
        text: "4:6 nisbatini soddalashting.",
        options: [
          { label: "A", value: "1:3" },
          { label: "B", value: "2:3" },
          { label: "C", value: "3:4" },
          { label: "D", value: "4:6" }
        ],
        correct: "B",
        explanation: "EKUB(4, 6) = 2. 4÷2 : 6÷2 = 2:3."
      },
      {
        id: "rc2",
        text: "Sinf qizlar va o'g'illar nisbati 3:2. Jami 30 o'quvchi. Qizlar nechta?",
        options: [
          { label: "A", value: "12" },
          { label: "B", value: "15" },
          { label: "C", value: "18" },
          { label: "D", value: "20" }
        ],
        correct: "C",
        explanation: "Jami ulush: 3 + 2 = 5. Qizlar: 30 × 3/5 = 18."
      },
      {
        id: "rc3",
        text: "x:4 = 6:8 bo'lsa, x nechaga teng?",
        options: [
          { label: "A", value: "x = 3" },
          { label: "B", value: "x = 6" },
          { label: "C", value: "x = 2" },
          { label: "D", value: "x = 12" }
        ],
        correct: "A",
        explanation: "Proporsiyada: x × 8 = 4 × 6 → 8x = 24 → x = 3."
      },
      {
        id: "rc4",
        text: "A va B ning nisbati 5:3. B = 12 bo'lsa, A nechaga teng?",
        options: [
          { label: "A", value: "A = 15" },
          { label: "B", value: "A = 20" },
          { label: "C", value: "A = 7.2" },
          { label: "D", value: "A = 60" }
        ],
        correct: "B",
        explanation: "A/12 = 5/3 → A = 12 × 5/3 = 20."
      }
    ]
  },

  geometry: {
    area: [
      {
        id: "ga1",
        text: "To'rtburchakning uzunligi 8 sm, eni 5 sm. Yuzasi nechaga teng?",
        options: [
          { label: "A", value: "26 sm²" },
          { label: "B", value: "40 sm²" },
          { label: "C", value: "13 sm²" },
          { label: "D", value: "80 sm²" }
        ],
        correct: "B",
        explanation: "S = uzunlik × en = 8 × 5 = 40 sm²."
      },
      {
        id: "ga2",
        text: "Uchburchakning asosi 10 sm, balandligi 6 sm. Yuzasi qancha?",
        options: [
          { label: "A", value: "60 sm²" },
          { label: "B", value: "16 sm²" },
          { label: "C", value: "30 sm²" },
          { label: "D", value: "45 sm²" }
        ],
        correct: "C",
        explanation: "S = (asos × balandlik) / 2 = (10 × 6) / 2 = 30 sm²."
      },
      {
        id: "ga3",
        text: "Radiusi 7 sm bo'lgan doiraning yuzi qancha? (π ≈ 3.14)",
        options: [
          { label: "A", value: "43.96 sm²" },
          { label: "B", value: "153.86 sm²" },
          { label: "C", value: "21.98 sm²" },
          { label: "D", value: "49 sm²" }
        ],
        correct: "B",
        explanation: "S = πr² = 3.14 × 49 ≈ 153.86 sm²."
      },
      {
        id: "ga4",
        text: "Tomoni 6 sm bo'lgan kvadratning perimetri qancha?",
        options: [
          { label: "A", value: "12 sm" },
          { label: "B", value: "36 sm" },
          { label: "C", value: "24 sm" },
          { label: "D", value: "18 sm" }
        ],
        correct: "C",
        explanation: "P = 4 × a = 4 × 6 = 24 sm."
      }
    ],
    pythagorean: [
      {
        id: "gp1",
        text: "To'g'ri burchakli uchburchakda katetlar 3 va 4. Gipotenuza nechaga teng?",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "7" },
          { label: "C", value: "√7" },
          { label: "D", value: "6" }
        ],
        correct: "A",
        explanation: "c² = 3² + 4² = 9 + 16 = 25. c = √25 = 5."
      },
      {
        id: "gp2",
        text: "Pifagor teoremasi qanday ifodalanadi?",
        options: [
          { label: "A", value: "a + b = c" },
          { label: "B", value: "a² + b² = c²" },
          { label: "C", value: "a² − b² = c²" },
          { label: "D", value: "2(a + b) = c" }
        ],
        correct: "B",
        explanation: "Pifagor teoremasi: a² + b² = c², bu yerda c — gipotenuza."
      },
      {
        id: "gp3",
        text: "Gipotenuza 13, katet 5. Ikkinchi katet nechaga teng?",
        options: [
          { label: "A", value: "8" },
          { label: "B", value: "12" },
          { label: "C", value: "√194" },
          { label: "D", value: "10" }
        ],
        correct: "B",
        explanation: "b² = 13² − 5² = 169 − 25 = 144. b = 12."
      }
    ]
  }
};