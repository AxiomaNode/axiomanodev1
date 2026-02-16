export const diagnosticQuestions = {
  quadratic: {
    sections: [
      {
        id: "conceptual",
        title: {
          en: "A. Conceptual Understanding",
          ru: "A. Понятийное понимание",
          uz: "A. Tushunchaviy tushunish"
        },
        questions: [
          {
            id: "A1",
            text: {
              en: "What is a root of an equation?",
              ru: "Что такое корень уравнения?",
              uz: "Tenglama ildizi nima?"
            },
            options: {
              en: [
                "A value that makes the equation true",
                "An answer found by a formula",
                "A number after calculations",
                "I don't know"
              ],
              ru: [
                "Значение, обращающее уравнение в верное равенство",
                "Ответ, найденный по формуле",
                "Число после вычислений",
                "Не знаю"
              ],
              uz: [
                "Tenglamani to'g'ri tenglikka aylantiradigan qiymat",
                "Formula orqali topilgan javob",
                "Hisoblashdan keyin chiqqan son",
                "Bilmayman"
              ]
            }
          },
          {
            id: "A2",
            text: {
              en: "Can a quadratic equation have no real solutions?",
              ru: "Может ли квадратное уравнение не иметь действительных решений?",
              uz: "Kvadrat tenglama haqiqiy yechimlarga ega bo'lmasligi mumkinmi?"
            },
            options: {
              en: ["Yes", "No", "I don't know"],
              ru: ["Да", "Нет", "Не знаю"],
              uz: ["Ha", "Yo'q", "Bilmayman"]
            }
          },
          {
            id: "A3",
            text: {
              en: "What does the discriminant tell us?",
              ru: "О чём говорит дискриминант?",
              uz: "Diskriminant nima haqida ma'lumot beradi?"
            },
            options: {
              en: [
                "Number and type of roots",
                "Value of the roots",
                "Whether to use a formula",
                "I don't know"
              ],
              ru: [
                "Количество и тип корней",
                "Значение корней",
                "Нужно ли использовать формулу",
                "Не знаю"
              ],
              uz: [
                "Ildizlarning soni va turi",
                "Ildizlarning qiymati",
                "Formula ishlatish kerakmi",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "formal",
        title: {
          en: "B. Typical Mistakes",
          ru: "B. Типичные ошибки",
          uz: "B. Odatdagi xatolar"
        },
        questions: [
          {
            id: "B1",
            text: {
              en: "Find the mistake: x² − 5x = 0 → x = (5 ± √25)/2",
              ru: "Найдите ошибку: x² − 5x = 0 → x = (5 ± √25)/2",
              uz: "Xatoni toping: x² − 5x = 0 → x = (5 ± √25)/2"
            },
            options: {
              en: [
                "Wrong formula usage",
                "Should factor the equation",
                "No mistake",
                "I don't know"
              ],
              ru: [
                "Неправильное использование формулы",
                "Нужно вынести множитель",
                "Ошибки нет",
                "Не знаю"
              ],
              uz: [
                "Formuladan noto'g'ri foydalanish",
                "Ko'paytuvchiga ajratish kerak",
                "Xato yo'q",
                "Bilmayman"
              ]
            }
          },
          {
            id: "B2",
            text: {
              en: "What's wrong with: (x+3)² = x² + 9?",
              ru: "Что не так с: (x+3)² = x² + 9?",
              uz: "Nimada xato: (x+3)² = x² + 9?"
            },
            options: {
              en: [
                "Missing middle term 6x",
                "Wrong sign",
                "Nothing wrong",
                "I don't know"
              ],
              ru: [
                "Пропущен средний член 6x",
                "Неправильный знак",
                "Всё правильно",
                "Не знаю"
              ],
              uz: [
                "O'rta had 6x qoldirilgan",
                "Noto'g'ri ishora",
                "Hamma narsa to'g'ri",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "methodical",
        title: {
          en: "C. Choosing a Method",
          ru: "C. Выбор метода",
          uz: "C. Usulni tanlash"
        },
        questions: [
          {
            id: "C1",
            text: {
              en: "Best method to solve x² − 9 = 0?",
              ru: "Лучший метод решения x² − 9 = 0?",
              uz: "x² − 9 = 0 ni yechishning eng yaxshi usuli?"
            },
            options: {
              en: [
                "Factoring (difference of squares)",
                "Discriminant formula",
                "Graph",
                "I don't know"
              ],
              ru: [
                "Разложение (разность квадратов)",
                "Формула дискриминанта",
                "График",
                "Не знаю"
              ],
              uz: [
                "Ko'paytuvchilarga ajratish (kvadratlar ayirmasi)",
                "Diskriminant formulasi",
                "Grafik",
                "Bilmayman"
              ]
            }
          },
          {
            id: "C2",
            text: {
              en: "Best method to solve 3x² + 7x − 5 = 0?",
              ru: "Лучший метод решения 3x² + 7x − 5 = 0?",
              uz: "3x² + 7x − 5 = 0 ni yechishning eng yaxshi usuli?"
            },
            options: {
              en: [
                "Discriminant formula",
                "Factoring",
                "Graph",
                "I don't know"
              ],
              ru: [
                "Формула дискриминанта",
                "Разложение на множители",
                "График",
                "Не знаю"
              ],
              uz: [
                "Diskriminant formulasi",
                "Ko'paytuvchilarga ajratish",
                "Grafik",
                "Bilmayman"
              ]
            }
          }
        ]
      }
    ]
  },

  systems: {
    sections: [
      {
        id: "conceptual",
        title: {
          en: "A. Understanding Systems",
          ru: "A. Понимание систем",
          uz: "A. Sistemalarni tushunish"
        },
        questions: [
          {
            id: "S1",
            text: {
              en: "What does it mean to solve a system of equations?",
              ru: "Что значит решить систему уравнений?",
              uz: "Tenglamalar sistemasini yechish nimani anglatadi?"
            },
            options: {
              en: [
                "Find values that satisfy all equations",
                "Solve each equation separately",
                "Add all equations together",
                "I don't know"
              ],
              ru: [
                "Найти значения, удовлетворяющие всем уравнениям",
                "Решить каждое уравнение отдельно",
                "Сложить все уравнения",
                "Не знаю"
              ],
              uz: [
                "Barcha tenglamalarni qanoatlantiruvchi qiymatlarni topish",
                "Har bir tenglamani alohida yechish",
                "Barcha tenglamalarni qo'shish",
                "Bilmayman"
              ]
            }
          },
          {
            id: "S2",
            text: {
              en: "Can a system have no solutions?",
              ru: "Может ли система не иметь решений?",
              uz: "Sistema yechimsiz bo'lishi mumkinmi?"
            },
            options: {
              en: ["Yes, if lines are parallel", "No, always has a solution", "Only if equations are wrong", "I don't know"],
              ru: ["Да, если прямые параллельны", "Нет, всегда есть решение", "Только если уравнения неправильные", "Не знаю"],
              uz: ["Ha, agar to'g'ri chiziqlar parallel bo'lsa", "Yo'q, doimo yechim bor", "Faqat tenglamalar noto'g'ri bo'lsa", "Bilmayman"]
            }
          }
        ]
      },
      {
        id: "methods",
        title: {
          en: "B. Solution Methods",
          ru: "B. Методы решения",
          uz: "B. Yechish usullari"
        },
        questions: [
          {
            id: "M1",
            text: {
              en: "Which method is best for: {x + y = 5, x - y = 1}?",
              ru: "Какой метод лучше для: {x + y = 5, x - y = 1}?",
              uz: "Qaysi usul yaxshiroq: {x + y = 5, x - y = 1}?"
            },
            options: {
              en: [
                "Addition method",
                "Substitution",
                "Graphing",
                "I don't know"
              ],
              ru: [
                "Метод сложения",
                "Подстановка",
                "Графический",
                "Не знаю"
              ],
              uz: [
                "Qo'shish usuli",
                "O'rniga qo'yish",
                "Grafik usul",
                "Bilmayman"
              ]
            }
          },
          {
            id: "M2",
            text: {
              en: "Which method for: {y = 2x + 1, 3x + y = 9}?",
              ru: "Какой метод для: {y = 2x + 1, 3x + y = 9}?",
              uz: "Qaysi usul: {y = 2x + 1, 3x + y = 9}?"
            },
            options: {
              en: [
                "Substitution (y already isolated)",
                "Addition method",
                "Graphing",
                "I don't know"
              ],
              ru: [
                "Подстановка (y уже выражен)",
                "Метод сложения",
                "Графический",
                "Не знаю"
              ],
              uz: [
                "O'rniga qo'yish (y ajratilgan)",
                "Qo'shish usuli",
                "Grafik usul",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "mistakes",
        title: {
          en: "C. Common Errors",
          ru: "C. Частые ошибки",
          uz: "C. Tez-tez uchraydigan xatolar"
        },
        questions: [
          {
            id: "E1",
            text: {
              en: "What's wrong: {2x + y = 5, 2x + y = 3} has solution x=1, y=1?",
              ru: "Что не так: {2x + y = 5, 2x + y = 3} имеет решение x=1, y=1?",
              uz: "Nimada xato: {2x + y = 5, 2x + y = 3} x=1, y=1 yechimga ega?"
            },
            options: {
              en: [
                "System has no solutions (contradictory)",
                "Calculation mistake",
                "Nothing wrong",
                "I don't know"
              ],
              ru: [
                "Система не имеет решений (противоречивая)",
                "Ошибка в вычислениях",
                "Всё правильно",
                "Не знаю"
              ],
              uz: [
                "Sistema yechimsiz (qarama-qarshi)",
                "Hisoblashdagi xato",
                "Hamma narsa to'g'ri",
                "Bilmayman"
              ]
            }
          }
        ]
      }
    ]
  },

  functions: {
    sections: [
      {
        id: "basics",
        title: {
          en: "A. Function Basics",
          ru: "A. Основы функций",
          uz: "A. Funksiya asoslari"
        },
        questions: [
          {
            id: "F1",
            text: {
              en: "What is a function?",
              ru: "Что такое функция?",
              uz: "Funksiya nima?"
            },
            options: {
              en: [
                "A rule that assigns each input exactly one output",
                "Any mathematical formula",
                "A graph on paper",
                "I don't know"
              ],
              ru: [
                "Правило, сопоставляющее каждому входу ровно один выход",
                "Любая математическая формула",
                "График на бумаге",
                "Не знаю"
              ],
              uz: [
                "Har bir kirishga aynan bitta chiqishni mos qo'yadigan qoida",
                "Istalgan matematik formula",
                "Qog'ozdagi grafik",
                "Bilmayman"
              ]
            }
          },
          {
            id: "F2",
            text: {
              en: "What does f(3) = 7 mean?",
              ru: "Что означает f(3) = 7?",
              uz: "f(3) = 7 nimani anglatadi?"
            },
            options: {
              en: [
                "When input is 3, output is 7",
                "f equals 3 times 7",
                "x = 3 and y = 7",
                "I don't know"
              ],
              ru: [
                "Когда вход 3, выход 7",
                "f равно 3 умножить на 7",
                "x = 3 и y = 7",
                "Не знаю"
              ],
              uz: [
                "Kirish 3 bo'lganda, chiqish 7",
                "f 3 ga 7 ni ko'paytirganga teng",
                "x = 3 va y = 7",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "linear",
        title: {
          en: "B. Linear Functions",
          ru: "B. Линейные функции",
          uz: "B. Chiziqli funksiyalar"
        },
        questions: [
          {
            id: "L1",
            text: {
              en: "What does the coefficient 'k' represent in y = kx + b?",
              ru: "Что означает коэффициент 'k' в y = kx + b?",
              uz: "y = kx + b da 'k' koeffitsenti nimani bildiradi?"
            },
            options: {
              en: [
                "Slope (steepness of line)",
                "Y-intercept",
                "X-intercept",
                "I don't know"
              ],
              ru: [
                "Угловой коэффициент (наклон прямой)",
                "Точка пересечения с осью Y",
                "Точка пересечения с осью X",
                "Не знаю"
              ],
              uz: [
                "Og'ish koeffitsienti (to'g'ri chiziq qiyaligi)",
                "Y o'qi bilan kesishish nuqtasi",
                "X o'qi bilan kesishish nuqtasi",
                "Bilmayman"
              ]
            }
          },
          {
            id: "L2",
            text: {
              en: "If k > 0 in y = kx + b, the function:",
              ru: "Если k > 0 в y = kx + b, функция:",
              uz: "Agar k > 0 bo'lsa y = kx + b da, funksiya:"
            },
            options: {
              en: [
                "Increases (goes up)",
                "Decreases (goes down)",
                "Stays constant",
                "I don't know"
              ],
              ru: [
                "Возрастает (идёт вверх)",
                "Убывает (идёт вниз)",
                "Постоянная",
                "Не знаю"
              ],
              uz: [
                "O'sadi (yuqoriga boradi)",
                "Kamayadi (pastga boradi)",
                "O'zgarmas",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "quadratic_func",
        title: {
          en: "C. Quadratic Functions",
          ru: "C. Квадратичные функции",
          uz: "C. Kvadratik funksiyalar"
        },
        questions: [
          {
            id: "Q1",
            text: {
              en: "The graph of y = x² is:",
              ru: "График y = x² это:",
              uz: "y = x² grafigi:"
            },
            options: {
              en: [
                "Parabola opening upward",
                "Straight line",
                "Parabola opening downward",
                "I don't know"
              ],
              ru: [
                "Парабола, ветви вверх",
                "Прямая линия",
                "Парабола, ветви вниз",
                "Не знаю"
              ],
              uz: [
                "Yuqoriga ochilgan parabola",
                "To'g'ri chiziq",
                "Pastga ochilgan parabola",
                "Bilmayman"
              ]
            }
          },
          {
            id: "Q2",
            text: {
              en: "How does y = x² + 3 differ from y = x²?",
              ru: "Чем отличается y = x² + 3 от y = x²?",
              uz: "y = x² + 3 y = x² dan qanday farq qiladi?"
            },
            options: {
              en: [
                "Shifted up by 3 units",
                "Shifted left by 3",
                "Narrower parabola",
                "I don't know"
              ],
              ru: [
                "Сдвинут вверх на 3",
                "Сдвинут влево на 3",
                "Более узкая парабола",
                "Не знаю"
              ],
              uz: [
                "3 birlikka yuqoriga surilgan",
                "3 ga chapga surilgan",
                "Torroq parabola",
                "Bilmayman"
              ]
            }
          }
        ]
      }
    ]
  },

  inequalities: {
    sections: [
      {
        id: "basics",
        title: {
          en: "A. Understanding Inequalities",
          ru: "A. Понимание неравенств",
          uz: "A. Tengsizliklarni tushunish"
        },
        questions: [
          {
            id: "I1",
            text: {
              en: "What's the difference between equation and inequality?",
              ru: "В чём разница между уравнением и неравенством?",
              uz: "Tenglama va tengsizlik o'rtasidagi farq nima?"
            },
            options: {
              en: [
                "Inequality has a range of solutions",
                "Inequality is harder",
                "No difference",
                "I don't know"
              ],
              ru: [
                "Неравенство имеет множество решений",
                "Неравенство сложнее",
                "Нет разницы",
                "Не знаю"
              ],
              uz: [
                "Tengsizlik yechimlar to'plamiga ega",
                "Tengsizlik qiyinroq",
                "Farq yo'q",
                "Bilmayman"
              ]
            }
          },
          {
            id: "I2",
            text: {
              en: "What happens when you multiply both sides by -1?",
              ru: "Что происходит при умножении обеих частей на -1?",
              uz: "Ikkala tomonni -1 ga ko'paytirganda nima bo'ladi?"
            },
            options: {
              en: [
                "Inequality sign flips",
                "Nothing changes",
                "Solution becomes invalid",
                "I don't know"
              ],
              ru: [
                "Знак неравенства меняется",
                "Ничего не меняется",
                "Решение становится неверным",
                "Не знаю"
              ],
              uz: [
                "Tengsizlik belgisi teskari bo'ladi",
                "Hech narsa o'zgarmaydi",
                "Yechim noto'g'ri bo'ladi",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "solving",
        title: {
          en: "B. Solving Inequalities",
          ru: "B. Решение неравенств",
          uz: "B. Tengsizliklarni yechish"
        },
        questions: [
          {
            id: "S1",
            text: {
              en: "Solve: 2x + 3 > 7. What is x?",
              ru: "Решите: 2x + 3 > 7. Чему равно x?",
              uz: "Yeching: 2x + 3 > 7. x nechaga teng?"
            },
            options: {
              en: [
                "x > 2",
                "x < 2",
                "x = 2",
                "I don't know"
              ],
              ru: [
                "x > 2",
                "x < 2",
                "x = 2",
                "Не знаю"
              ],
              uz: [
                "x > 2",
                "x < 2",
                "x = 2",
                "Bilmayman"
              ]
            }
          },
          {
            id: "S2",
            text: {
              en: "How to write: x is between 2 and 5?",
              ru: "Как записать: x между 2 и 5?",
              uz: "Qanday yoziladi: x 2 va 5 orasida?"
            },
            options: {
              en: [
                "2 < x < 5",
                "x > 2 or x < 5",
                "x = 2 to 5",
                "I don't know"
              ],
              ru: [
                "2 < x < 5",
                "x > 2 или x < 5",
                "x = от 2 до 5",
                "Не знаю"
              ],
              uz: [
                "2 < x < 5",
                "x > 2 yoki x < 5",
                "x = 2 dan 5 gacha",
                "Bilmayman"
              ]
            }
          }
        ]
      },
      {
        id: "mistakes",
        title: {
          en: "C. Common Mistakes",
          ru: "C. Частые ошибки",
          uz: "C. Tez-tez uchraydigan xatolar"
        },
        questions: [
          {
            id: "M1",
            text: {
              en: "What's wrong: -x < 3 → x < -3?",
              ru: "Что не так: -x < 3 → x < -3?",
              uz: "Nimada xato: -x < 3 → x < -3?"
            },
            options: {
              en: [
                "Sign should flip: x > -3",
                "Nothing wrong",
                "Should be x = -3",
                "I don't know"
              ],
              ru: [
                "Знак должен поменяться: x > -3",
                "Всё правильно",
                "Должно быть x = -3",
                "Не знаю"
              ],
              uz: [
                "Belgi teskari bo'lishi kerak: x > -3",
                "Hamma narsa to'g'ri",
                "x = -3 bo'lishi kerak",
                "Bilmayman"
              ]
            }
          }
        ]
      }
    ]
  }
};