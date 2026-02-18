export const questions = {
  quadratic: [
    {
      id: "A1",
      text: "Kvadrat tenglamaning ildizi nima?",
      options: [
        { value: "Formula orqali topilgan javob", label: "A" },
        { value: "Tenglamani to'g'ri qiladigan son", label: "B" },
        { value: "Hisoblashdan keyingi son", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Tenglamani to'g'ri qiladigan son"
    },
    {
      id: "A2",
      text: "x = 3 tenglamaning x² − 5x + 6 = 0 ildizi ekanligini qanday tekshirish mumkin?",
      options: [
        { value: "Formulaga qo'yib ko'rish", label: "A" },
        { value: "x ni tenglamaga qo'yib, 0 chiqishini tekshirish", label: "B" },
        { value: "Yo'q", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x ni tenglamaga qo'yib, 0 chiqishini tekshirish"
    },
    {
      id: "A3",
      text: "Diskriminant (D) nima haqida ma'lumot beradi?",
      options: [
        { value: "Ildizlarning qiymati", label: "A" },
        { value: "Ildizlar soni va mavjudligi", label: "B" },
        { value: "Formula ishlatish kerakligini", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Ildizlar soni va mavjudligi"
    },
    {
      id: "B1",
      text: "3x² + 6x = 0 tenglamani echishda qaysi usul eng qulay?",
      options: [
        { value: "Diskriminant formulasi", label: "A" },
        { value: "Umumiy ko'paytuvchini ajratish: 3x(x + 2) = 0", label: "B" },
        { value: "Noto'g'ri formula ishlatish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Umumiy ko'paytuvchini ajratish: 3x(x + 2) = 0"
    },
    {
      id: "B2",
      text: "x² − 4x + 4 = 0 tenglamada D = 0. Bu nima degani?",
      options: [
        { value: "Yechim yo'q", label: "A" },
        { value: "Bitta takrorlanuvchi ildiz bor", label: "B" },
        { value: "Noto'g'ri belgi", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bitta takrorlanuvchi ildiz bor"
    },
    {
      id: "C1",
      text: "2x² − 8 = 0 tenglamani echishda eng qulay usul qaysi?",
      options: [
        { value: "Diskriminant formulasi", label: "A" },
        { value: "x² = 4 deb to'g'ridan-to'g'ri echish", label: "B" },
        { value: "Grafik", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x² = 4 deb to'g'ridan-to'g'ri echish"
    },
    {
      id: "C2",
      text: "x² − 5x + 6 = 0 uchun qaysi usul qulay?",
      options: [
        { value: "Ko'paytuvchilarga ajratish: (x−2)(x−3) = 0", label: "A" },
        { value: "Grafik", label: "B" },
        { value: "Ko'paytuvchilarga ajratish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Ko'paytuvchilarga ajratish: (x−2)(x−3) = 0"
    }
  ],
  systems: [
    {
      id: "S1",
      text: "Tenglamalar sistemasini echish nima degani?",
      options: [
        { value: "Har bir tenglamani alohida echish", label: "A" },
        { value: "Barcha tenglamalarni bir vaqtda qanoatlantiruvchi qiymatlarni topish", label: "B" },
        { value: "Barcha tenglamalarni qo'shish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Barcha tenglamalarni bir vaqtda qanoatlantiruvchi qiymatlarni topish"
    },
    {
      id: "S2",
      text: "Tenglamalar sistemasining yechimi bo'lmasligi mumkinmi?",
      options: [
        { value: "Har doim yechimi bor", label: "A" },
        { value: "Ha, agar tenglamalar ziddiyatli bo'lsa", label: "B" },
        { value: "Faqat tenglamalar noto'g'ri bo'lsa", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Ha, agar tenglamalar ziddiyatli bo'lsa"
    },
    {
      id: "S3",
      text: "O'rniga qo'yish usulida birinchi qadam nima?",
      options: [
        { value: "Ikkala tenglamani qo'shish", label: "A" },
        { value: "Bitta tenglamadan o'zgaruvchini ifodalash", label: "B" },
        { value: "Qaysi o'zgaruvchini ifodalashni bilmaslik", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Bitta tenglamadan o'zgaruvchini ifodalash"
    }
  ],
  functions: [
    {
      id: "F1",
      text: "Funksiya nima?",
      options: [
        { value: "Formula", label: "A" },
        { value: "Har bir kirishga bitta chiqish mos keladigan qoida", label: "B" },
        { value: "Jadval", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "Har bir kirishga bitta chiqish mos keladigan qoida"
    },
    {
      id: "F2",
      text: "f(3) = 7 nima degani?",
      options: [
        { value: "x = 7 bo'lganda javob 3", label: "A" },
        { value: "x = 3 bo'lganda funksiyaning qiymati 7", label: "B" },
        { value: "Grafik chizish kerak", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 3 bo'lganda funksiyaning qiymati 7"
    },
    {
      id: "F3",
      text: "Grafikda nuqta (2, 5) nima bildiradi?",
      options: [
        { value: "x = 5, y = 2", label: "A" },
        { value: "x = 2 bo'lganda y = 5", label: "B" },
        { value: "Koordinatalarni noto'g'ri o'qish", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x = 2 bo'lganda y = 5"
    }
  ],
  inequalities: [
    {
      id: "I1",
      text: "x > 3 tengsizlikning yechimi nima?",
      options: [
        { value: "Bitta son", label: "A" },
        { value: "3 dan katta barcha sonlar", label: "B" },
        { value: "Sonlar oralig'i", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "3 dan katta barcha sonlar"
    },
    {
      id: "I2",
      text: "−2x > 6 tengsizlikni echganda nima sodir bo'ladi?",
      options: [
        { value: "x > −3", label: "A" },
        { value: "x < −3 (belgi o'zgaradi)", label: "B" },
        { value: "Belgini o'zgartirmaslik", label: "C" },
        { value: "Bilmayman", label: "D" }
      ],
      correct: "x < −3 (belgi o'zgaradi)"
    }
  ]
};