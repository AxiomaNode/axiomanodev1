export const questions = {
  quadratic: [
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
      text: "x = 4 qiymati x² − 5x − 4 = 0 tenglamaning ildizi ekanligini qanday isbotlash mumkin?",
      options: [
        { value: "Diskriminantni hisoblash orqali", label: "A" },
        { value: "x = 4 ni tenglamaga qo'yib, natija 0 chiqishini tekshirish", label: "B" },
        { value: "Vieta teoremasidan foydalanish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 4 ni tenglamaga qo'yib, natija 0 chiqishini tekshirish"
    },
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
      id: "S3",
      text: "Qo‘shish usulida (eliminatsiya) qaysi holatda ko'paytirish koeffitsienti tanlash kerak bo'ladi?",
      options: [
        { value: "O'zgaruvchilar koeffitsientlari allaqachon teng bo'lsa", label: "A" },
        { value: "Bir o'zgaruvchining koeffitsientlari qarama-qarshi yoki teng bo'lmasa", label: "B" },
        { value: "Faqat grafik usul ishlatilganda", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bir o'zgaruvchining koeffitsientlari qarama-qarshi yoki teng bo'lmasa"
    },
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
      id: "F3",
      text: "Funksiyaning grafikda vertikal chiziq testi nima uchun ishlatiladi?",
      options: [
        { value: "Funksiya o'suvchi yoki kamayuvchi ekanligini aniqlash uchun", label: "A" },
        { value: "Har bir x ga faqat bitta y mos kelishini tekshirish uchun", label: "B" },
        { value: "Parabolani chizish uchun", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Har bir x ga faqat bitta y mos kelishini tekshirish uchun"
    }
  ],

  inequalities: [
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
      id: "I3", 
      text: "x² − 9 ≤ 0 tengsizlikning yechimi qaysi?",
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