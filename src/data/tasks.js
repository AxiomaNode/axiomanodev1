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
      }
    ]
  }
};