// Определение пробелов для каждой темы
export const gapsDatabase = {
  quadratic: [
    {
      id: "conceptual",
      title: {
        en: "Conceptual Gap",
        ru: "Понятийный пробел",
        uz: "Tushunchadagi bo'shliq"
      },
      description: {
        en: "The root of the equation is treated formally, without understanding its meaning.",
        ru: "Корень уравнения воспринимается формально, без понимания его смысла.",
        uz: "Tenglama ildizi rasmiy ravishda, ma'nosini tushunmasdan qabul qilinadi."
      },
      recommendation: {
        en: "Practice understanding: a root makes the equation true. Try substituting values.",
        ru: "Практикуйте понимание: корень обращает уравнение в верное равенство. Попробуйте подставлять значения.",
        uz: "Tushunishni mashq qiling: ildiz tenglamani to'g'ri tenglikka aylantiradi. Qiymatlarni almashtiring."
      },
      signs: {
        A1: ["An answer found by a formula", "A number after calculations", "I don't know", "Ответ, найденный по формуле", "Число после вычислений", "Не знаю", "Formula orqali topilgan javob", "Hisoblashdan keyin chiqqan son", "Bilmayman"],
        A2: ["No", "I don't know", "Нет", "Не знаю", "Yo'q", "Bilmayman"]
      }
    },
    {
      id: "discriminant",
      title: {
        en: "Discriminant Understanding",
        ru: "Понимание дискриминанта",
        uz: "Diskriminantni tushunish"
      },
      description: {
        en: "Unclear about what discriminant indicates: number and type of roots.",
        ru: "Непонятно, о чём говорит дискриминант: количество и тип корней.",
        uz: "Diskriminant nima haqida gapirishi noaniq: ildizlarning soni va turi."
      },
      recommendation: {
        en: "Study: D>0 (two roots), D=0 (one root), D<0 (no real roots).",
        ru: "Изучите: D>0 (два корня), D=0 (один корень), D<0 (нет действительных корней).",
        uz: "O'rganing: D>0 (ikkita ildiz), D=0 (bitta ildiz), D<0 (haqiqiy ildiz yo'q)."
      },
      signs: {
        A3: ["Value of the roots", "Whether to use a formula", "I don't know", "Значение корней", "Нужно ли использовать формулу", "Не знаю", "Ildizlarning qiymati", "Formula ishlatish kerakmi", "Bilmayman"]
      }
    },
    {
      id: "formal",
      title: {
        en: "Formula Application",
        ru: "Применение формул",
        uz: "Formulalarni qo'llash"
      },
      description: {
        en: "Knowledge of formulas exists, but without understanding when and why to apply them.",
        ru: "Знание формул есть, но без понимания, когда и почему их применять.",
        uz: "Formulalar ma'lum, lekin qachon va nima uchun qo'llashni tushunmaslik."
      },
      recommendation: {
        en: "Learn to recognize equation types before applying formulas. Not every equation needs the discriminant formula!",
        ru: "Научитесь распознавать типы уравнений перед применением формул. Не каждому уравнению нужна формула дискриминанта!",
        uz: "Formulalarni qo'llashdan oldin tenglama turlarini tanishni o'rganing. Har bir tenglama uchun diskriminant formulasi kerak emas!"
      },
      signs: {
        B1: ["Wrong formula usage", "I don't know", "Неправильное использование формулы", "Не знаю", "Formuladan noto'g'ri foydalanish", "Bilmayman"],
        B2: ["Wrong sign", "Nothing wrong", "I don't know", "Неправильный знак", "Всё правильно", "Не знаю", "Noto'g'ri ishora", "Hamma narsa to'g'ri", "Bilmayman"]
      }
    },
    {
      id: "methodical",
      title: {
        en: "Method Selection",
        ru: "Выбор метода",
        uz: "Usulni tanlash"
      },
      description: {
        en: "Difficulties in choosing the appropriate method or approach to solve the problem.",
        ru: "Трудности в выборе подходящего метода или подхода к решению задачи.",
        uz: "Muammoni hal qilish uchun mos usul yoki yondashuvni tanlashda qiyinchiliklar."
      },
      recommendation: {
        en: "Practice: simple equations → factoring, complex → formula, graphical for estimation.",
        ru: "Практикуйтесь: простые уравнения → разложение, сложные → формула, графический для оценки.",
        uz: "Mashq qiling: oddiy tenglamalar → ko'paytuvchilarga ajratish, murakkab → formula, baholash uchun grafik."
      },
      signs: {
        C1: ["Discriminant formula", "Graph", "I don't know", "Формула дискриминанта", "График", "Не знаю", "Diskriminant formulasi", "Grafik", "Bilmayman"],
        C2: ["Factoring", "Graph", "I don't know", "Разложение на множители", "График", "Не знаю", "Ko'paytuvchilarga ajratish", "Grafik", "Bilmayman"]
      }
    }
  ],

  systems: [
    {
      id: "conceptual",
      title: {
        en: "System Concept",
        ru: "Концепция системы",
        uz: "Sistema tushunchasi"
      },
      description: {
        en: "Misunderstanding of what a system solution means: values satisfying ALL equations.",
        ru: "Непонимание того, что значит решение системы: значения, удовлетворяющие ВСЕМ уравнениям.",
        uz: "Sistema yechimi nimani anglatishini tushunmaslik: BARCHA tenglamalarni qanoatlantiruvchi qiymatlar."
      },
      recommendation: {
        en: "Always check your solution in all equations. Practice identifying when systems have no solutions.",
        ru: "Всегда проверяйте решение во всех уравнениях. Практикуйте определение случаев, когда систем не имеет решений.",
        uz: "Yechimni har doim barcha tenglamalarda tekshiring. Sistemalar yechimsiz bo'lgan holatlarni aniqlashni mashq qiling."
      },
      signs: {
        S1: ["Solve each equation separately", "Add all equations together", "I don't know", "Решить каждое уравнение отдельно", "Сложить все уравнения", "Не знаю", "Har bir tenglamani alohida yechish", "Barcha tenglamalarni qo'shish", "Bilmayman"],
        S2: ["No, always has a solution", "Only if equations are wrong", "I don't know", "Нет, всегда есть решение", "Только если уравнения неправильные", "Не знаю", "Yo'q, doimo yechim bor", "Faqat tenglamalar noto'g'ri bo'lsa", "Bilmayman"]
      }
    },
    {
      id: "methods",
      title: {
        en: "Method Choice",
        ru: "Выбор метода",
        uz: "Usulni tanlash"
      },
      description: {
        en: "Unable to select the most efficient method for solving a system.",
        ru: "Неспособность выбрать наиболее эффективный метод решения системы.",
        uz: "Sistemani yechish uchun eng samarali usulni tanlay olmaslik."
      },
      recommendation: {
        en: "Learn: Addition when coefficients align, Substitution when one variable is isolated.",
        ru: "Изучите: Сложение когда коэффициенты выровнены, Подстановка когда одна переменная выражена.",
        uz: "O'rganing: Koeffitsientlar mos kelganda qo'shish, bir o'zgaruvchi ajratilganda o'rniga qo'yish."
      },
      signs: {
        M1: ["Substitution", "Graphing", "I don't know", "Подстановка", "Графический", "Не знаю", "O'rniga qo'yish", "Grafik usul", "Bilmayman"],
        M2: ["Addition method", "Graphing", "I don't know", "Метод сложения", "Графический", "Не знаю", "Qo'shish usuli", "Grafik usul", "Bilmayman"]
      }
    },
    {
      id: "errors",
      title: {
        en: "Contradiction Recognition",
        ru: "Распознавание противоречий",
        uz: "Qarama-qarshiliklarni aniqlash"
      },
      description: {
        en: "Failing to recognize contradictory or dependent systems.",
        ru: "Неспособность распознать противоречивые или зависимые системы.",
        uz: "Qarama-qarshi yoki bog'liq sistemalarni taniy olmaslik."
      },
      recommendation: {
        en: "Parallel lines (same slope, different intercepts) = no solution. Identical lines = infinite solutions.",
        ru: "Параллельные прямые (одинаковый наклон, разные пересечения) = нет решений. Совпадающие прямые = бесконечно много решений.",
        uz: "Parallel chiziqlar (bir xil qiyalik, turli kesishishlar) = yechim yo'q. Bir xil chiziqlar = cheksiz yechimlar."
      },
      signs: {
        E1: ["Calculation mistake", "Nothing wrong", "I don't know", "Ошибка в вычислениях", "Всё правильно", "Не знаю", "Hisoblashdagi xato", "Hamma narsa to'g'ri", "Bilmayman"]
      }
    }
  ],

  functions: [
    {
      id: "concept",
      title: {
        en: "Function Definition",
        ru: "Определение функции",
        uz: "Funksiya ta'rifi"
      },
      description: {
        en: "Unclear about what a function is: a rule assigning each input one output.",
        ru: "Непонятно, что такое функция: правило, сопоставляющее каждому входу один выход.",
        uz: "Funksiya nima ekanligi noaniq: har bir kirishga bitta chiqishni mos qo'yadigan qoida."
      },
      recommendation: {
        en: "Think of functions as machines: you put in x, you get out f(x). Practice with real examples.",
        ru: "Думайте о функциях как о машинах: вы вставляете x, получаете f(x). Практикуйтесь на реальных примерах.",
        uz: "Funksiyalarni mashina sifatida tasavvur qiling: x kiritasiz, f(x) olasiz. Haqiqiy misollar bilan mashq qiling."
      },
      signs: {
        F1: ["Any mathematical formula", "A graph on paper", "I don't know", "Любая математическая формула", "График на бумаге", "Не знаю", "Istalgan matematik formula", "Qog'ozdagi grafik", "Bilmayman"],
        F2: ["f equals 3 times 7", "x = 3 and y = 7", "I don't know", "f равно 3 умножить на 7", "x = 3 и y = 7", "Не знаю", "f 3 ga 7 ni ko'paytirganga teng", "x = 3 va y = 7", "Bilmayman"]
      }
    },
    {
      id: "linear",
      title: {
        en: "Linear Function Properties",
        ru: "Свойства линейных функций",
        uz: "Chiziqli funksiya xususiyatlari"
      },
      description: {
        en: "Confusion about slope and intercept meaning in linear functions.",
        ru: "Путаница в понимании наклона и точки пересечения в линейных функциях.",
        uz: "Chiziqli funksiyalarda qiyalik va kesishish nuqtasini tushunishda chalkashlik."
      },
      recommendation: {
        en: "k = slope (rise/run), b = y-intercept (starting point). Practice graphing y = kx + b.",
        ru: "k = наклон (подъём/пробег), b = точка пересечения с Y (начальная точка). Практикуйте построение y = kx + b.",
        uz: "k = qiyalik (ko'tarilish/yugurish), b = Y kesishish nuqtasi (boshlang'ich nuqta). y = kx + b ni chizishni mashq qiling."
      },
      signs: {
        L1: ["Y-intercept", "X-intercept", "I don't know", "Точка пересечения с осью Y", "Точка пересечения с осью X", "Не знаю", "Y o'qi bilan kesishish nuqtasi", "X o'qi bilan kesishish nuqtasi", "Bilmayman"],
        L2: ["Decreases (goes down)", "Stays constant", "I don't know", "Убывает (идёт вниз)", "Постоянная", "Не знаю", "Kamayadi (pastga boradi)", "O'zgarmas", "Bilmayman"]
      }
    },
    {
      id: "quadratic",
      title: {
        en: "Quadratic Function Graphs",
        ru: "Графики квадратичных функций",
        uz: "Kvadratik funksiya grafiklari"
      },
      description: {
        en: "Not understanding parabola shapes and transformations.",
        ru: "Непонимание форм парабол и их преобразований.",
        uz: "Parabola shakllarini va ularning o'zgarishlarini tushunmaslik."
      },
      recommendation: {
        en: "y = x² is basic parabola. Adding numbers shifts it vertically. Study transformations.",
        ru: "y = x² это базовая парабола. Добавление чисел сдвигает её вертикально. Изучите преобразования.",
        uz: "y = x² asosiy paraboladir. Sonlar qo'shish uni vertikal siljitadi. O'zgarishlarni o'rganing."
      },
      signs: {
        Q1: ["Straight line", "Parabola opening downward", "I don't know", "Прямая линия", "Парабола, ветви вниз", "Не знаю", "To'g'ri chiziq", "Pastga ochilgan parabola", "Bilmayman"],
        Q2: ["Shifted left by 3", "Narrower parabola", "I don't know", "Сдвинут влево на 3", "Более узкая парабола", "Не знаю", "3 ga chapga surilgan", "Torroq parabola", "Bilmayman"]
      }
    }
  ],

  inequalities: [
    {
      id: "concept",
      title: {
        en: "Inequality Nature",
        ru: "Природа неравенств",
        uz: "Tengsizlik tabiati"
      },
      description: {
        en: "Not understanding that inequalities have ranges of solutions, not single values.",
        ru: "Непонимание того, что неравенства имеют диапазоны решений, а не отдельные значения.",
        uz: "Tengsizliklar yechimlar oralig'iga ega ekanligini tushunmaslik, alohida qiymatlar emas."
      },
      recommendation: {
        en: "Practice: equation gives x=3, inequality gives x>3 (all numbers greater than 3).",
        ru: "Практикуйте: уравнение даёт x=3, неравенство даёт x>3 (все числа больше 3).",
        uz: "Mashq qiling: tenglama x=3 beradi, tengsizlik x>3 beradi (3 dan katta barcha sonlar)."
      },
      signs: {
        I1: ["Inequality is harder", "No difference", "I don't know", "Неравенство сложнее", "Нет разницы", "Не знаю", "Tengsizlik qiyinroq", "Farq yo'q", "Bilmayman"]
      }
    },
    {
      id: "sign_rules",
      title: {
        en: "Sign Flipping Rule",
        ru: "Правило смены знака",
        uz: "Belgi almashtirish qoidasi"
      },
      description: {
        en: "Forgetting to flip inequality sign when multiplying/dividing by negative numbers.",
        ru: "Забывание о смене знака неравенства при умножении/делении на отрицательные числа.",
        uz: "Manfiy sonlarga ko'paytirish/bo'lishda tengsizlik belgisini almashtirishni unutish."
      },
      recommendation: {
        en: "REMEMBER: Multiply or divide by negative → flip the sign! Practice this rule repeatedly.",
        ru: "ЗАПОМНИТЕ: Умножение или деление на отрицательное → меняем знак! Практикуйте это правило многократно.",
        uz: "ESLAB QOLING: Manfiyga ko'paytirish yoki bo'lish → belgini teskarisiga o'zgartiring! Bu qoidani takroran mashq qiling."
      },
      signs: {
        I2: ["Nothing changes", "Solution becomes invalid", "I don't know", "Ничего не меняется", "Решение становится неверным", "Не знаю", "Hech narsa o'zgarmaydi", "Yechim noto'g'ri bo'ladi", "Bilmayman"],
        M1: ["Nothing wrong", "Should be x = -3", "I don't know", "Всё правильно", "Должно быть x = -3", "Не знаю", "Hamma narsa to'g'ri", "x = -3 bo'lishi kerak", "Bilmayman"]
      }
    },
    {
      id: "notation",
      title: {
        en: "Interval Notation",
        ru: "Запись интервалов",
        uz: "Oraliqlarni yozish"
      },
      description: {
        en: "Incorrect notation for solution intervals and ranges.",
        ru: "Неправильная запись интервалов решений и диапазонов.",
        uz: "Yechim oraliqlarini va diapazonlarini noto'g'ri yozish."
      },
      recommendation: {
        en: "Learn standard notation: 2 < x < 5 means x is between 2 and 5.",
        ru: "Изучите стандартную запись: 2 < x < 5 означает x между 2 и 5.",
        uz: "Standart yozuvni o'rganing: 2 < x < 5 degani x 2 va 5 orasida."
      },
      signs: {
        S2: ["x > 2 or x < 5", "x = 2 to 5", "I don't know", "x > 2 или x < 5", "x = от 2 до 5", "Не знаю", "x > 2 yoki x < 5", "x = 2 dan 5 gacha", "Bilmayman"]
      }
    }
  ]
};

export function analyzeResults(topicId, answers) {
  const topicGaps = gapsDatabase[topicId];
  if (!topicGaps) return [];

  const detected = [];

  topicGaps.forEach((gap) => {
    let isDetected = false;

    for (const questionId in gap.signs) {
      const selected = answers[questionId];
      if (selected && gap.signs[questionId].includes(selected)) {
        isDetected = true;
        break;
      }
    }

    if (isDetected) {
      detected.push(gap);
    }
  });

  return detected;
}