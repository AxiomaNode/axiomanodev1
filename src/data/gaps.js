// src/data/gaps.js
export const gapsDatabase = {
  quadratic: [
    {
      id: "conceptual",
      title: "Tushuncha bo'shlig'i",
      description: "Ildiz va tenglama ma'nosi tushunilmaydi: 'ildiz' = 'formula natijasi' deb o'ylanadi.",
      recommendation: "Ildiz — bu tenglamani 0 qiladigan qiymat. Har doim topilgan qiymatni tenglamaga qo‘yib tekshiring.",
      signs: {
        A1: ["Tenglamani qanoatlantiruvchi har qanday son", "Diskriminantning musbat ildizi", "Bilmayman"],
        A2: ["Diskriminantni hisoblash orqali", "Vieta teoremasidan foydalanish", "Bilmayman"],
        A2b: ["Grafik chizish", "Diskriminantni hisoblash", "Bilmayman"],
        A2c: ["6", "−6", "-6", "Bilmayman"]
      }
    },
    {
      id: "discriminant",
      title: "Diskriminantni tushunish",
      description: "Diskriminant nimani anglatishini bilmaslik: ildizlar soni va reallarda mavjudligi bilan bog‘lay olmaslik.",
      recommendation: "D > 0 — 2 ta haqiqiy ildiz, D = 0 — 1 ta takroriy ildiz, D < 0 — haqiqiy ildiz yo‘q.",
      signs: {
        A3: ["Ikkitasi", "Bitta", "Bilmayman"],
        A3b: ["Hech qanday", "Ikkita har xil ildiz", "Bilmayman"],
        A3c: ["Tenglama x = 4 da yechimga ega", "Ildizlar manfiy sonlar", "Bilmayman"]
      }
    },
    {
      id: "formal",
      title: "Formulani qo'llash xatosi",
      description: "Usul va qoida tanlash o‘rniga, hammasini bitta formula bilan 'urinish': strukturani ko‘rmaslik.",
      recommendation: "Avval tenglama turini aniqlang: umumiy ko‘paytuvchi bormi, ayirma kvadratmi, to‘liq kvadratmi, yoki formula kerakmi.",
      signs: {
        B1: ["2x² + 5x + 3 = 0", "x² − 7x + 12 = 0", "x² - 7x + 12 = 0", "Bilmayman"],
        B2: ["Parabola Ox o'qiga tegmagan", "Parabola ikki nuqtada kesishadi", "Bilmayman"],
        B1b: ["Diskriminant formulasi: x = (0 ± √0) / 6", "Diskriminant formulasi: x = (0 +- sqrt(0)) / 6", "x = ±√3", "x = +-sqrt(3)", "Bilmayman"],
        B2b: ["Diskriminant formulasini ishlatish", "Ko'paytuvchilarga ajratib x(x−4) = 0", "Ko'paytuvchilarga ajratib x(x-4) = 0", "Bilmayman"]
      }
    },
    {
      id: "methodical",
      title: "Usulni tanlash qiyinchiligi",
      description: "Eng samarali usulni tanlay olmaslik: struktura ko‘rinib turgan joyda ham og‘ir yo‘lni tanlash.",
      recommendation: "Tez yo‘lni qidiring: to‘liq kvadrat, ayirma kvadrat, umumiy ko‘paytuvchi. Kerak bo‘lsa keyin formula.",
      signs: {
        C1: ["x² − 5x + 6 = 0", "x² − 9 = 0", "x² - 9 = 0", "Bilmayman"],
        C2: ["Kvadrat ildiz chiqarish", "Faqat diskriminant formulasi", "Bilmayman"],
        C1b: ["Diskriminant: D = 100, x = ±5", "Diskriminant: D = 100, x = +-5", "Grafik chizish", "Bilmayman"],
        C2b: ["Diskriminant formulasi", "Grafik", "Bilmayman"]
      }
    }
  ],

  systems: [
    {
      id: "conceptual",
      title: "Sistemani tushunish",
      description: "Sistemaning yechimi 'har bir tenglama alohida' emas, balki ikkalasini bir vaqtda qanoatlantirishi kerakligini tushunmaslik.",
      recommendation: "Yechim — (x, y) jufti. U barcha tenglamalarni bir vaqtda to‘g‘ri qilishi shart.",
      signs: {
        S1: ["Tenglamalar bir-biriga parallel bo'lganda", "Determinant nolga teng bo'lganda", "Bilmayman"],
        S2: ["Bitta yechim: (3, 2)", "Yechim yo'q", "Bilmayman"],
        S1b: ["Har bir tenglamani alohida qanoatlantiruvchi x va y", "Tenglamalarning o'rtacha qiymati", "Bilmayman"],
        S2b: ["Ha, x = 5, y = 2", "Cheksiz ko'p yechim bor", "Bilmayman"],
        S4: ["Bitta yechim", "Cheksiz ko'p yechim", "Bilmayman"]
      }
    },
    {
      id: "substitution",
      title: "O'rniga qo'yish usuli",
      description: "O‘rniga qo‘yish usulining mantiqiy ketma-ketligini bilmaslik: qaysi qadam birinchi bo‘lishini adashtirish.",
      recommendation: "Avval bitta tenglamadan x yoki y ni ifodalang, keyin ikkinchisiga qo‘ying, so‘ng orqaga qaytib ikkinchi o‘zgaruvchini toping.",
      signs: {
        S3: ["O'zgaruvchilar koeffitsientlari allaqachon teng bo'lsa", "Faqat grafik usul ishlatilganda", "Bilmayman"],
        S3b: ["x = 8 + 2y", "x = 2y − 8", "x = 2y - 8", "Bilmayman"],
        S3c: ["Ikki tenglamani qo'shish", "Har ikki tenglamani koeffitsientga bo'lish", "Bilmayman"]
      }
    }
  ],

  functions: [
    {
      id: "conceptual",
      title: "Funksiya tushunchasi",
      description: "Funksiya sharti: har bir x ga aniq bitta y bo‘lishi kerak. Bu mantiqni qo‘llay olmaslik.",
      recommendation: "Funksiya: har bir kirish (x) uchun bitta chiqish (y). Agar bir x ga ikkita y chiqsa — funksiya emas.",
      signs: {
        F1: ["y = x²", "y = 2x + 1", "Bilmayman"],
        F2: ["−2", "-2", "6", "Bilmayman"],
        F1b: ["Har bir chiqishga bitta kirish mos keladi", "Kirish va chiqish teng bo'lishi kerak", "Bilmayman"],
        F1c: ["x = 7 da f ning qiymati 3 ga teng", "3 va 7 funksiya ildizlari", "Bilmayman"]
      }
    },
    {
      id: "graphical",
      title: "Grafikni o'qish",
      description: "Grafikdan ma'lumotni noto‘g‘ri talqin qilish: nuqta ma’nosi, vertikal test, (x, y) o‘qilishi.",
      recommendation: "Nuqta (x, y) bo‘lsa, f(x)=y. Vertikal chiziq testi: bir x ga bitta y bo‘lishi kerak.",
      signs: {
        F3: ["Funksiya o'suvchi yoki kamayuvchi ekanligini aniqlash uchun", "Parabolani chizish uchun", "Bilmayman"],
        F3b: ["f(5) = 2", "Funksiya x = 5 da nolga teng", "Bilmayman"],
        F3c: ["Funksiya tez o'smoqda", "Funksiya manfiy qiymatlar qabul qiladi", "Bilmayman"]
      }
    }
  ],

  inequalities: [
    {
      id: "conceptual",
      title: "Tengsizlik tushunchasi",
      description: "Tengsizlik yechimi bitta son emas, balki sonlar to‘plami (oraliq) ekanligini unutish.",
      recommendation: "Tengsizlik yechimini son chizig‘ida tasavvur qiling: qaysi sonlar shartni qanoatlantiradi?",
      signs: {
        I1: ["−3 < x < 2", "-3 < x < 2", "x > −3", "x > -3", "Bilmayman"],
        I1b: ["Faqat x = 3", "3 dan kichik barcha sonlar", "Bilmayman"],
        I1c: ["x < 3", "x > −3", "x > -3", "Bilmayman"],
        I3: ["x ≤ −3 yoki x ≥ 3", "x ≤ -3 yoki x ≥ 3", "x < 0", "Bilmayman"]
      }
    },
    {
      id: "sign_flip",
      title: "Belgi o'zgarishi",
      description: "Manfiy songa ko‘paytirish/bo‘lishda tengsizlik belgisi teskari bo‘lishini unutish.",
      recommendation: "Qoida: manfiy songa ko‘paytirsangiz yoki bo‘lsangiz, tengsizlik belgisi teskari bo‘ladi.",
      signs: {
        I2: ["Hech qachon o'zgarmaydi", "Faqat musbat songa bo'lganda o'zgaradi", "Bilmayman"],
        I2b: ["x > −5", "x > -5", "x > 5", "Bilmayman"],
        I2c: ["Har doim ikkala tarafga bir xil son qo'shganda", "Faqat kvadratga oshirganda", "Bilmayman"]
      }
    }
  ]
};