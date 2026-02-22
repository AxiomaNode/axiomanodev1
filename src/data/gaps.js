export const gapsDatabase = {
  quadratic: [
    {
      id: "conceptual",
      title: "Tushuncha bo'shlig'i",
      description: "Tenglamaning ildizi faqat formula natijasi sifatida qabul qilinadi, uning ma'nosi tushunilmaydi.",
      recommendation: "Ildiz — bu tenglamani to'g'ri qiladigan son ekanligini mashq qiling. Ildizni topganingizda, uni tenglamaga qo'yib tekshiring.",
      signs: {
        A1:  ["Tenglamani qanoatlantiruvchi har qanday son", "Diskriminantning musbat ildizi", "Bilmayman"],
        A2:  ["Diskriminantni hisoblash orqali", "Vieta teoremasidan foydalanish", "Bilmayman"],
        A2b: ["Grafik chizish", "Diskriminantni hisoblash", "Bilmayman"],
        A2c: ["6", "-6", "Bilmayman"],
      }
    },
    {
      id: "discriminant",
      title: "Diskriminantni tushunish",
      description: "Diskriminant nima ko'rsatishini tushunmaslik — u faqat formula qismi deb qabul qilinadi.",
      recommendation: "Eslab qoling: D > 0 — ikkita ildiz, D = 0 — bitta ildiz, D < 0 — haqiqiy ildiz yo'q.",
      signs: {
        A3:  ["Ikkitasi", "Bitta", "Bilmayman"],
        A3b: ["Hech qanday", "Ikkita har xil ildiz", "Bilmayman"],
        A3c: ["Tenglama x = 4 da yechimga ega", "Ildizlar manfiy sonlar", "Bilmayman"],
      }
    },
    {
      id: "formal",
      title: "Formulani qo'llash xatosi",
      description: "Formulalar mexanik ravishda ishlatiladi, qachon va nima uchun ishlatilishi tushunilmaydi.",
      recommendation: "Formulani yozishdan oldin, tenglama turini aniqlang. Har bir formula ma'lum holat uchun ishlaydi.",
      signs: {
        B1:  ["2x² + 5x + 3 = 0", "x² - 7x + 12 = 0", "Bilmayman"],
        B2:  ["Parabola Ox o'qiga tegmagan", "Parabola ikki nuqtada kesishadi", "Bilmayman"],
        B1b: ["Diskriminant formulasi: x = (0 +- sqrt(0)) / 6", "x = +-sqrt(3)", "Bilmayman"],
        B2b: ["Diskriminant formulasini ishlatish", "Ko'paytuvchilarga ajratib x(x-4) = 0", "Bilmayman"],
      }
    },
    {
      id: "methodical",
      title: "Usulni tanlash qiyinchiligi",
      description: "Masalani echishda eng samarali usulni tanlay olmaslik — har doim bitta usulga tayanish.",
      recommendation: "Oddiy tenglamalar → ko'paytuvchilarga ajratish, murakkab → formula, baholash → grafik.",
      signs: {
        C1:  ["x² - 5x + 6 = 0", "x² - 9 = 0", "Bilmayman"],
        C2:  ["Kvadrat ildiz chiqarish", "Faqat diskriminant formulasi", "Bilmayman"],
        C1b: ["Diskriminant: D = 100, x = +-5", "Grafik chizish", "Bilmayman"],
        C2b: ["Diskriminant formulasi", "Grafik", "Bilmayman"],
      }
    }
  ],
  systems: [
    {
      id: "conceptual",
      title: "Sistemani tushunish",
      description: "Tenglamalar sistemasini echish nimani anglatishini noto'g'ri tushunish.",
      recommendation: "Yechim barcha tenglamalarni bir vaqtda qanoatlantirishi kerak.",
      signs: {
        S1:  ["Tenglamalar bir-biriga parallel bo'lganda", "Determinant nolga teng bo'lganda", "Bilmayman"],
        S2:  ["Bitta yechim: (3, 2)", "Yechim yo'q", "Bilmayman"],
        S1b: ["Har bir tenglamani alohida qanoatlantiruvchi x va y", "Tenglamalarning o'rtacha qiymati", "Bilmayman"],
        S2b: ["Ha, x = 5, y = 2", "Cheksiz ko'p yechim bor", "Bilmayman"],
      }
    },
    {
      id: "substitution",
      title: "O'rniga qo'yish usuli",
      description: "O'rniga qo'yish usulining mantiqiy asosi tushunilmaydi — qadamlar mexanik bajariladi.",
      recommendation: "Birinchi tenglamadan o'zgaruvchini ifodalang, keyin ikkinchisiga qo'ying.",
      signs: {
        S3:  ["O'zgaruvchilar koeffitsientlari allaqachon teng bo'lsa", "Faqat grafik usul ishlatilganda", "Bilmayman"],
        S3b: ["x = 8 + 2y", "x = 2y - 8", "Bilmayman"],
        S3c: ["Ikki tenglamani qo'shish", "Har ikki tenglamani koeffitsientga bo'lish", "Bilmayman"],
      }
    }
  ],
  functions: [
    {
      id: "conceptual",
      title: "Funksiya tushunchasi",
      description: "Funksiya nima ekanligini — kirish va chiqish o'rtasidagi bog'lanishni tushunmaslik.",
      recommendation: "Funksiya — bu har bir kirishga bitta chiqish mos keladi.",
      signs: {
        F1:  ["y = x²", "y = 2x + 1", "Bilmayman"],
        F2:  ["-2", "6", "Bilmayman"],
        F1b: ["Har bir chiqishga bitta kirish mos keladi", "Kirish va chiqish teng bo'lishi kerak", "Bilmayman"],
        F1c: ["x = 7 da f ning qiymati 3 ga teng", "3 va 7 funksiya ildizlari", "Bilmayman"],
      }
    },
    {
      id: "graphical",
      title: "Grafikni o'qish",
      description: "Grafikdan ma'lumot o'qiy olmaslik yoki noto'g'ri talqin qilish.",
      recommendation: "Grafikda x o'qi — kirish, y o'qi — chiqish.",
      signs: {
        F3:  ["Funksiya o'suvchi yoki kamayuvchi ekanligini aniqlash uchun", "Parabolani chizish uchun", "Bilmayman"],
        F3b: ["f(5) = 2", "Funksiya x = 5 da nolga teng", "Bilmayman"],
        F3c: ["Funksiya tez o'smoqda", "Funksiya manfiy qiymatlar qabul qiladi", "Bilmayman"],
      }
    }
  ],
  inequalities: [
    {
      id: "conceptual",
      title: "Tengsizlik tushunchasi",
      description: "Tengsizlikning yechimi bitta son emas, balki sonlar to'plami ekanligini tushunmaslik.",
      recommendation: "Tengsizlik yechimi — bu oraliq. Son chizig'ida ko'rsatib, qaysi sonlar mos kelishini tekshiring.",
      signs: {
        I1:  ["-3 < x < 2", "x > -3", "Bilmayman"],
        I1b: ["Faqat x = 3", "3 dan kichik barcha sonlar", "Bilmayman"],
        I1c: ["x < 3", "x > -3", "Bilmayman"],
      }
    },
    {
      id: "sign_flip",
      title: "Belgi o'zgarishi",
      description: "Manfiy songa ko'paytirganda yoki bo'lganda belgi o'zgarishini unutish.",
      recommendation: "Qoida: manfiy songa ko'paytirsangiz yoki bo'lsangiz, tengsizlik belgisi teskari bo'ladi.",
      signs: {
        I2:  ["Hech qachon o'zgarmaydi", "Faqat musbat songa bo'lganda o'zgaradi", "Bilmayman"],
        I2b: ["x > -5", "x > 5", "Bilmayman"],
        I2c: ["Har doim ikkala tarafga bir xil son qo'shganda", "Faqat kvadratga oshirganda", "Bilmayman"],
      }
    }
  ]
};