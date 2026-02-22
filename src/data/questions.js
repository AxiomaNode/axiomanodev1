export const questions = {
  quadratic: [
    // ── gap: conceptual (A1, A2, A2b, A2c) ──
    {
      id: "A1",
      text: "Kvadrat tenglama ildizlari nima deb ataladi?",
      options: [
        { value: "Tenglamani qanoatlantiruvchi har qanday son", label: "A" },
        { value: "Tenglama nolga teng bo'ladigan x qiymatlari", label: "B" },
        { value: "Diskriminantning musbat ildizi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Tenglama nolga teng bo'ladigan x qiymatlari"
    },
    {
      id: "A2",
      text: "x = 4 qiymati x² − 5x + 4 = 0 tenglamaning ildizi ekanligini qanday isbotlash mumkin?",
      options: [
        { value: "Diskriminantni hisoblash orqali", label: "A" },
        { value: "x = 4 ni tenglamaga qo'yib, natija 0 chiqishini tekshirish", label: "B" },
        { value: "Vieta teoremasidan foydalanish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 4 ni tenglamaga qo'yib, natija 0 chiqishini tekshirish"
    },
    {
      id: "A2b",
      text: "x² − 3x + 2 = 0 tenglamasining ildizlari x = 1 va x = 2 ekanligini tekshirishning eng to'g'ri usuli qaysi?",
      options: [
        { value: "Grafik chizish", label: "A" },
        { value: "Har bir qiymatni tenglamaga almashtirish", label: "B" },
        { value: "Diskriminantni hisoblash", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Har bir qiymatni tenglamaga almashtirish"
    },
    {
      id: "A2c",
      text: "Agar x = −3 tenglamaning ildizi bo'lsa, u holda x² + 5x + 6 = 0 ga nima chiqadi?",
      options: [
        { value: "0", label: "A" },
        { value: "6", label: "B" },
        { value: "−6", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "0"
    },

    // ── gap: discriminant (A3, A3b, A3c) ──
    {
      id: "A3",
      text: "Diskriminant D < 0 bo'lsa, haqiqiy sonlar to'plamida nechta ildiz bo'ladi?",
      options: [
        { value: "Ikkitasi", label: "A" },
        { value: "Bitta", label: "B" },
        { value: "Hech qanday haqiqiy ildiz yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Hech qanday haqiqiy ildiz yo'q"
    },
    {
      id: "A3b",
      text: "D = 0 bo'lganda tenglama nechta ildizga ega bo'ladi?",
      options: [
        { value: "Hech qanday", label: "A" },
        { value: "Bitta (takrorlanuvchi) ildiz", label: "B" },
        { value: "Ikkita har xil ildiz", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bitta (takrorlanuvchi) ildiz"
    },
    {
      id: "A3c",
      text: "x² + 4x + 8 = 0 tenglamasining diskriminanti D = 16 − 32 = −16. Bu nima anglatadi?",
      options: [
        { value: "Tenglama x = 4 da yechimga ega", label: "A" },
        { value: "Haqiqiy son ildizlari mavjud emas", label: "B" },
        { value: "Ildizlar manfiy sonlar", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Haqiqiy son ildizlari mavjud emas"
    },

    // ── gap: formal (B1, B2, B1b, B2b) ──
    {
      id: "B1",
      text: "Quyidagi tenglamalardan qaysi biri umumiy ko'paytuvchi orqali eng oson yechiladi?",
      options: [
        { value: "2x² + 5x + 3 = 0", label: "A" },
        { value: "6x² − 18x = 0", label: "B" },
        { value: "x² − 7x + 12 = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "6x² − 18x = 0"
    },
    {
      id: "B2",
      text: "x² + 6x + 9 = 0 tenglamada diskriminant D = 0 bo'lishining geometrik ma'nosi nima?",
      options: [
        { value: "Parabola Ox o'qiga tegmagan", label: "A" },
        { value: "Parabola Ox o'qiga bitta nuqtada tegadi (cho'qqi Ox da)", label: "B" },
        { value: "Parabola ikki nuqtada kesishadi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Parabola Ox o'qiga bitta nuqtada tegadi (cho'qqi Ox da)"
    },
    {
      id: "B1b",
      text: "3x² = 0 tenglamasini yechishning to'g'ri usuli qaysi?",
      options: [
        { value: "Diskriminant formulasi: x = (0 ± √0) / 6", label: "A" },
        { value: "x² = 0 demak x = 0", label: "B" },
        { value: "x = ±√3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² = 0 demak x = 0"
    },
    {
      id: "B2b",
      text: "x² − 4 = 0 tenglamasini yechishning eng tez usuli qaysi?",
      options: [
        { value: "Diskriminant formulasini ishlatish", label: "A" },
        { value: "x² = 4 demak x = ±2", label: "B" },
        { value: "Ko'paytuvchilarga ajratib x(x−4) = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² = 4 demak x = ±2"
    },

    // ── gap: methodical (C1, C2, C1b, C2b) ──
    {
      id: "C1",
      text: "Quyidagi tenglamalardan qaysi biri ko'paytuvchilarga ajratish usuli bilan yechilmaydi?",
      options: [
        { value: "x² − 5x + 6 = 0", label: "A" },
        { value: "x² + 4x + 5 = 0", label: "B" },
        { value: "x² − 9 = 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² + 4x + 5 = 0"
    },
    {
      id: "C2",
      text: "−x² + 6x − 8 = 0 tenglamani yechish uchun eng samarali usul qaysi?",
      options: [
        { value: "Kvadrat ildiz chiqarish", label: "A" },
        { value: "Tenglamani −1 ga ko'paytirib, keyin ko'paytuvchilarga ajratish", label: "B" },
        { value: "Faqat diskriminant formulasi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Tenglamani −1 ga ko'paytirib, keyin ko'paytuvchilarga ajratish"
    },
    {
      id: "C1b",
      text: "x² − 25 = 0 tenglamasini echishning ENG TEZKOR usuli qaysi?",
      options: [
        { value: "Diskriminant: D = 100, x = ±5", label: "A" },
        { value: "Ayirmaning kvadrati: (x−5)(x+5) = 0", label: "B" },
        { value: "Grafik chizish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Ayirmaning kvadrati: (x−5)(x+5) = 0"
    },
    {
      id: "C2b",
      text: "x² + 2x + 1 = 0 tenglamasini ko'rganingizda birinchi fikringiz qaysi usul?",
      options: [
        { value: "Diskriminant formulasi", label: "A" },
        { value: "To'liq kvadrat: (x+1)² = 0", label: "B" },
        { value: "Grafik", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "To'liq kvadrat: (x+1)² = 0"
    },

    // ── general ──
    {
      id: "D1",
      text: "Agar ax² + bx + c = 0 tenglamaning ildizlari x₁ va x₂ bo'lsa, x₁ + x₂ = ?",
      options: [
        { value: "−b/a", label: "A" },
        { value: "c/a", label: "B" },
        { value: "b/a", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−b/a"
    }
  ],

  systems: [
    // ── gap: conceptual (S1, S2, S1b, S2b) ──
    {
      id: "S1",
      text: "Ikki tenglamali sistemada yechimlar soni qanday holatlarda cheksiz ko'p bo'ladi?",
      options: [
        { value: "Tenglamalar bir-biriga proporsional bo'lganda", label: "A" },
        { value: "Tenglamalar bir-biriga parallel bo'lganda", label: "B" },
        { value: "Determinant nolga teng bo'lganda", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Tenglamalar bir-biriga proporsional bo'lganda"
    },
    {
      id: "S2",
      text: "x + y = 5 va 2x + 2y = 10 tenglamalar sistemasining yechimlari qanday?",
      options: [
        { value: "Bitta yechim: (3, 2)", label: "A" },
        { value: "Cheksiz ko'p yechim (butun chiziq)", label: "B" },
        { value: "Yechim yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Cheksiz ko'p yechim (butun chiziq)"
    },
    {
      id: "S1b",
      text: "Sistema yechimi nima degan so'z?",
      options: [
        { value: "Har bir tenglamani alohida qanoatlantiruvchi x va y", label: "A" },
        { value: "Barcha tenglamalarni bir vaqtda qanoatlantiruvchi x va y", label: "B" },
        { value: "Tenglamalarning o'rtacha qiymati", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Barcha tenglamalarni bir vaqtda qanoatlantiruvchi x va y"
    },
    {
      id: "S2b",
      text: "x + y = 3 va x + y = 7 sistemasining yechimi bormi?",
      options: [
        { value: "Ha, x = 5, y = 2", label: "A" },
        { value: "Yo'q, bu tenglamalar qarama-qarshi", label: "B" },
        { value: "Cheksiz ko'p yechim bor", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Yo'q, bu tenglamalar qarama-qarshi"
    },

    // ── gap: substitution (S3, S3b, S3c) ──
    {
      id: "S3",
      text: "Qo'shish usulida (eliminatsiya) qaysi holatda koeffitsient tanlash kerak bo'ladi?",
      options: [
        { value: "O'zgaruvchilar koeffitsientlari allaqachon teng bo'lsa", label: "A" },
        { value: "Bir o'zgaruvchining koeffitsientlari qarama-qarshi yoki teng bo'lmasa", label: "B" },
        { value: "Faqat grafik usul ishlatilganda", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bir o'zgaruvchining koeffitsientlari qarama-qarshi yoki teng bo'lmasa"
    },
    {
      id: "S3b",
      text: "x + 2y = 8 tenglamasidan x ni ifodalasak nima chiqadi?",
      options: [
        { value: "x = 8 + 2y", label: "A" },
        { value: "x = 8 − 2y", label: "B" },
        { value: "x = 2y − 8", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 8 − 2y"
    },
    {
      id: "S3c",
      text: "O'rniga qo'yish usulida birinchi qadam nima?",
      options: [
        { value: "Ikki tenglamani qo'shish", label: "A" },
        { value: "Bir tenglamadan bitta o'zgaruvchini ifodalab, ikkinchisiga qo'yish", label: "B" },
        { value: "Har ikki tenglamani koeffitsientga bo'lish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bir tenglamadan bitta o'zgaruvchini ifodalab, ikkinchisiga qo'yish"
    },

    // ── general ──
    {
      id: "S4",
      text: "x − 2y = 3 va 3x − 6y = 10 sistemasi nechta yechimga ega?",
      options: [
        { value: "Bitta yechim", label: "A" },
        { value: "Cheksiz ko'p yechim", label: "B" },
        { value: "Hech qanday yechim yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Hech qanday yechim yo'q"
    }
  ],

  functions: [
    // ── gap: conceptual (F1, F2, F1b, F1c) ──
    {
      id: "F1",
      text: "Quyidagilardan qaysi biri funksiya emas?",
      options: [
        { value: "y = x²", label: "A" },
        { value: "y = ±√x", label: "B" },
        { value: "y = 2x + 1", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "y = ±√x"
    },
    {
      id: "F2",
      text: "Agar f(x) = x² − 4x + 3 bo'lsa, f(2) + f(−1) nechaga teng?",
      options: [
        { value: "0", label: "A" },
        { value: "−2", label: "B" },
        { value: "6", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "0"
    },
    {
      id: "F1b",
      text: "Funksiyaning asosiy xususiyati qaysi?",
      options: [
        { value: "Har bir chiqishga bitta kirish mos keladi", label: "A" },
        { value: "Har bir kirishga aniq bitta chiqish mos keladi", label: "B" },
        { value: "Kirish va chiqish teng bo'lishi kerak", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Har bir kirishga aniq bitta chiqish mos keladi"
    },
    {
      id: "F1c",
      text: "f(3) = 7 nima degan ma'noni anglatadi?",
      options: [
        { value: "x = 7 da f ning qiymati 3 ga teng", label: "A" },
        { value: "x = 3 da f ning qiymati 7 ga teng", label: "B" },
        { value: "3 va 7 funksiya ildizlari", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 3 da f ning qiymati 7 ga teng"
    },

    // ── gap: graphical (F3, F3b, F3c) ──
    {
      id: "F3",
      text: "Funksiyaning grafikda vertikal chiziq testi nima uchun ishlatiladi?",
      options: [
        { value: "Funksiya o'suvchi yoki kamayuvchi ekanligini aniqlash uchun", label: "A" },
        { value: "Har bir x ga faqat bitta y mos kelishini tekshirish uchun", label: "B" },
        { value: "Parabolani chizish uchun", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Har bir x ga faqat bitta y mos kelishini tekshirish uchun"
    },
    {
      id: "F3b",
      text: "Grafikda x = 2 da y = 5 nuqta bor. Bu nima anglatadi?",
      options: [
        { value: "f(5) = 2", label: "A" },
        { value: "f(2) = 5", label: "B" },
        { value: "Funksiya x = 5 da nolga teng", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "f(2) = 5"
    },
    {
      id: "F3c",
      text: "Grafikda bitta vertikal chiziq ikki nuqtada kesishsa, bu nima anglatadi?",
      options: [
        { value: "Funksiya tez o'smoqda", label: "A" },
        { value: "Bu funksiya grafigi emas", label: "B" },
        { value: "Funksiya manfiy qiymatlar qabul qiladi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bu funksiya grafigi emas"
    }
  ],

  inequalities: [
    // ── gap: conceptual (I1, I1b, I1c) ──
    {
      id: "I1",
      text: "(x − 2)(x + 3) > 0 tengsizlikning yechimi qaysi intervalda?",
      options: [
        { value: "x < −3 yoki x > 2", label: "A" },
        { value: "−3 < x < 2", label: "B" },
        { value: "x > −3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x < −3 yoki x > 2"
    },
    {
      id: "I1b",
      text: "x > 3 tengsizligining yechimi nima?",
      options: [
        { value: "Faqat x = 3", label: "A" },
        { value: "3 dan katta barcha sonlar", label: "B" },
        { value: "3 dan kichik barcha sonlar", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "3 dan katta barcha sonlar"
    },
    {
      id: "I1c",
      text: "x² < 9 tengsizligining yechimi qaysi?",
      options: [
        { value: "x < 3", label: "A" },
        { value: "−3 < x < 3", label: "B" },
        { value: "x > −3", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−3 < x < 3"
    },

    // ── gap: sign_flip (I2, I2b, I2c) ──
    {
      id: "I2",
      text: "−3x + 12 ≤ 6 tengsizlikni yechganda belgi qanday o'zgaradi?",
      options: [
        { value: "Hech qachon o'zgarmaydi", label: "A" },
        { value: "−3 ga bo'lganda (yoki ko'paytirganda) teskari bo'ladi", label: "B" },
        { value: "Faqat musbat songa bo'lganda o'zgaradi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−3 ga bo'lganda (yoki ko'paytirganda) teskari bo'ladi"
    },
    {
      id: "I2b",
      text: "−x > 5 tengsizligini yechsak x = ?",
      options: [
        { value: "x > −5", label: "A" },
        { value: "x < −5", label: "B" },
        { value: "x > 5", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x < −5"
    },
    {
      id: "I2c",
      text: "Qachon tengsizlik belgisi teskari bo'ladi?",
      options: [
        { value: "Har doim ikkala tarafga bir xil son qo'shganda", label: "A" },
        { value: "Manfiy songa ko'paytirish yoki bo'lishda", label: "B" },
        { value: "Faqat kvadratga oshirganda", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Manfiy songa ko'paytirish yoki bo'lishda"
    },

    // ── general ──
    {
      id: "I3",
      text: "x² − 9 ≤ 0 tengsizligining yechimi qaysi?",
      options: [
        { value: "x ≤ −3 yoki x ≥ 3", label: "A" },
        { value: "−3 ≤ x ≤ 3", label: "B" },
        { value: "x < 0", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "−3 ≤ x ≤ 3"
    }
  ]
};