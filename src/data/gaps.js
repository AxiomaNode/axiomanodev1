export const gapsDatabase = {
  quadratic: [
    {
      id: "conceptual",
      title: "Tushuncha bo'shlig'i",
      description:
        "Tenglamaning ildizi faqat formula natijasi sifatida qabul qilinadi, uning ma'nosi tushunilmaydi.",
      recommendation:
        "Ildiz — bu tenglamani to'g'ri qiladigan son ekanligini mashq qiling. Ildizni topganingizda, uni tenglamaga qo'yib tekshiring.",
      signs: {
        A1: [
          "Formula orqali topilgan javob",
          "Hisoblashdan keyingi son",
          "Bilmayman"
        ],
        A2: ["Yo'q", "Bilmayman"]
      }
    },
    {
      id: "discriminant",
      title: "Diskriminantni tushunish",
      description:
        "Diskriminant nima ko'rsatishini tushunmaslik — u faqat formula qismi deb qabul qilinadi.",
      recommendation:
        "Eslab qoling: D > 0 — ikkita ildiz, D = 0 — bitta ildiz, D < 0 — haqiqiy ildiz yo'q. Har safar D ni hisoblaganingizda, uning ma'nosini o'ylab ko'ring.",
      signs: {
        A3: [
          "Ildizlarning qiymati",
          "Formula ishlatish kerakligini",
          "Bilmayman"
        ]
      }
    },
    {
      id: "formal",
      title: "Formulani qo'llash xatosi",
      description:
        "Formulalar mexanik ravishda ishlatiladi, qachon va nima uchun ishlatilishi tushunilmaydi.",
      recommendation:
        "Formulani yozishdan oldin, tenglama turini aniqlang. Har bir formula ma'lum holat uchun ishlaydi — buni anglash muhim.",
      signs: {
        B1: ["Noto'g'ri formula ishlatish", "Bilmayman"],
        B2: ["Noto'g'ri belgi", "Hech narsa xato emas", "Bilmayman"]
      }
    },
    {
      id: "methodical",
      title: "Usulni tanlash qiyinchiligi",
      description:
        "Masalani echishda eng samarali usulni tanlay olmaslik — har doim bitta usulga tayanish.",
      recommendation:
        "Oddiy tenglamalar → ko'paytuvchilarga ajratish, murakkab → formula, baholash → grafik. Har xil usullarni sinab ko'ring.",
      signs: {
        C1: ["Diskriminant formulasi", "Grafik", "Bilmayman"],
        C2: ["Ko'paytuvchilarga ajratish", "Grafik", "Bilmayman"]
      }
    }
  ],
  systems: [
    {
      id: "conceptual",
      title: "Sistemani tushunish",
      description:
        "Tenglamalar sistemasini echish nimani anglatishini noto'g'ri tushunish.",
      recommendation:
        "Yechim barcha tenglamalarni bir vaqtda qanoatlantirishi kerak. Har bir tenglamani alohida echish — bu sistema echish emas.",
      signs: {
        S1: [
          "Har bir tenglamani alohida echish",
          "Barcha tenglamalarni qo'shish",
          "Bilmayman"
        ],
        S2: [
          "Har doim yechimi bor",
          "Faqat tenglamalar noto'g'ri bo'lsa",
          "Bilmayman"
        ]
      }
    },
    {
      id: "substitution",
      title: "O'rniga qo'yish usuli",
      description:
        "O'rniga qo'yish usulining mantiqiy asosi tushunilmaydi — qadamlar mexanik bajariladi.",
      recommendation:
        "Birinchi tenglamadan o'zgaruvchini ifodalang, keyin ikkinchisiga qo'ying. Har bir qadamning sababi bor — uni tushunishga harakat qiling.",
      signs: {
        S3: [
          "Qaysi o'zgaruvchini ifodalashni bilmaslik",
          "Noto'g'ri o'rniga qo'yish",
          "Bilmayman"
        ]
      }
    }
  ],
  functions: [
    {
      id: "conceptual",
      title: "Funksiya tushunchasi",
      description:
        "Funksiya nima ekanligini — kirish va chiqish o'rtasidagi bog'lanishni tushunmaslik.",
      recommendation:
        "Funksiya — bu har bir kirishga bitta chiqish mos keladi. Jadval va grafiklar orqali mashq qiling.",
      signs: {
        F1: [
          "Formula",
          "Jadval",
          "Bilmayman"
        ],
        F2: [
          "Grafik chizish kerak",
          "Formulani yodlash kerak",
          "Bilmayman"
        ]
      }
    },
    {
      id: "graphical",
      title: "Grafikni o'qish",
      description:
        "Grafikdan ma'lumot o'qiy olmaslik yoki noto'g'ri talqin qilish.",
      recommendation:
        "Grafikda x o'qi — kirish, y o'qi — chiqish. Nuqtalarni aniqlang va ularning ma'nosini tushunishga harakat qiling.",
      signs: {
        F3: [
          "Koordinatalarni noto'g'ri o'qish",
          "Grafikni teskari talqin qilish",
          "Bilmayman"
        ]
      }
    }
  ],
  inequalities: [
    {
      id: "conceptual",
      title: "Tengsizlik tushunchasi",
      description:
        "Tengsizlikning yechimi bitta son emas, balki sonlar to'plami ekanligini tushunmaslik.",
      recommendation:
        "Tengsizlik yechimi — bu oraliq. Son chizig'ida ko'rsatib, qaysi sonlar mos kelishini tekshiring.",
      signs: {
        I1: [
          "Bitta son",
          "Sonlar oralig'i",
          "Bilmayman"
        ]
      }
    },
    {
      id: "sign_flip",
      title: "Belgi o'zgarishi",
      description:
        "Manfiy songa ko'paytirganda yoki bo'lganda belgi o'zgarishini unutish.",
      recommendation:
        "Qoida: manfiy songa ko'paytirsangiz yoki bo'lsangiz, tengsizlik belgisi teskari bo'ladi. Buni har doim esda tuting.",
      signs: {
        I2: [
          "Belgini o'zgartirmaslik",
          "Qachon o'zgartirishni bilmaslik",
          "Bilmayman"
        ]
      }
    }
  ]
};