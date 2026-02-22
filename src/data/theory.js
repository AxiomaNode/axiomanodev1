/**
 * Theory content database
 * Structure per topic:
 *   sections[] — board content blocks (text, fact, definition, example, method, formula)
 *   puzzles[]  — escalating exercises with mentor fallback on failure
 */

export const theoryTopics = [
  { id: "quadratic",    title: "Kvadrat tenglamalar",   subtitle: "ax² + bx + c = 0" },
  { id: "functions",   title: "Funksiyalar",            subtitle: "f(x) va grafiklar" },
  { id: "inequalities",title: "Tengsizliklar",          subtitle: "Oraliqlar va belgilar" },
];

export const theory = {

  /* ─────────────────────────────────────────
     QUADRATIC EQUATIONS
  ───────────────────────────────────────── */
  quadratic: {
    id: "quadratic",
    title: "Kvadrat tenglamalar",
    subtitle: "What ax² + bx + c = 0 actually means — and why the formula looks the way it does",

    sections: [
      /* ── SECTION 1: What is it ── */
      {
        id: "what",
        title: "What is it?",
        blocks: [
          {
            type: "text",
            content:
              "A quadratic equation is any equation where the highest power of x is exactly 2. The standard form is ax² + bx + c = 0, where a ≠ 0. That last condition matters — if a were 0, the x² disappears and it becomes a simple linear equation.",
          },
          {
            type: "fact",
            label: "Origin",
            content:
              "Babylonian mathematicians (~2000 BCE) solved problems like: 'A field has area 60 and one side is 7 more than the other — find the sides.' They had no symbolic algebra, just geometric reasoning about squares. The word 'quadratic' itself comes from Latin quadratus — square.",
          },
          {
            type: "definition",
            term: "Root (ildiz)",
            content:
              "A root is any value of x that makes the equation equal to exactly zero. Not approximately zero — exactly zero. If you substitute a root back into the equation, you always get 0. This is the one test that never lies.",
          },
          {
            type: "example",
            title: "Verifying a root — the only reliable check",
            steps: [
              "Take x² − 5x + 6 = 0",
              "Claim: x = 2 is a root. Test it: (2)² − 5(2) + 6 = 4 − 10 + 6 = 0 ✓",
              "Claim: x = 3 is a root. Test it: (3)² − 5(3) + 6 = 9 − 15 + 6 = 0 ✓",
              "Claim: x = 1 is a root. Test it: (1)² − 5(1) + 6 = 1 − 5 + 6 = 2 ✗",
              "A root passes the test. A non-root fails it. Simple.",
            ],
          },
        ],
      },

      /* ── SECTION 2: How and why ── */
      {
        id: "why",
        title: "How and why?",
        blocks: [
          {
            type: "text",
            content:
              "There are three methods to solve quadratic equations. The critical skill is not performing them mechanically — it's recognizing which one fits the equation in front of you in under five seconds.",
          },
          {
            type: "method",
            number: "01",
            title: "Direct extraction",
            when: "When there is no x term (b = 0)",
            example: "2x² − 18 = 0  →  x² = 9  →  x = ±3",
            note: "Never use the formula here. x² = k always has x = ±√k.",
          },
          {
            type: "method",
            number: "02",
            title: "Factoring",
            when: "When you can find two numbers that multiply to c and sum to b",
            example: "x² − 5x + 6 = 0  →  (x − 2)(x − 3) = 0  →  x = 2  or  x = 3",
            note: "Look for the common factor first. 6x² − 18x = 0? Factor 6x out instantly.",
          },
          {
            type: "method",
            number: "03",
            title: "Quadratic formula",
            when: "When factoring isn't obvious or discriminant analysis is needed",
            example: "x = (−b ± √(b² − 4ac)) / 2a",
            note: "This always works, but it's the slowest. Use it last, not first.",
          },
          {
            type: "discriminant",
            title: "The Discriminant — where it comes from",
            story:
              "When you 'complete the square' on ax² + bx + c = 0, you inevitably reach a point where you need the square root of (b² − 4ac). This expression appears naturally from the algebra — it wasn't invented separately. René Descartes noticed in 1637 that the sign of this expression predicts the geometry before you compute anything.",
            formula: "D = b² − 4ac",
            meaning: [
              { condition: "D > 0", icon: "↗", result: "Two distinct roots. Parabola crosses x-axis twice." },
              { condition: "D = 0", icon: "→", result: "One repeated root. Parabola just touches x-axis." },
              { condition: "D < 0", icon: "↘", result: "No real roots. Parabola never reaches x-axis." },
            ],
          },
          {
            type: "insight",
            title: "Vieta's shortcut (most students never learn this)",
            content:
              "For any quadratic x² + bx + c = 0, the sum of the roots always equals −b, and the product of the roots always equals c. If the roots are r₁ and r₂, then r₁ + r₂ = −b and r₁ × r₂ = c. This means you can often find roots by inspection — or verify your answer instantly.",
            example: "x² − 7x + 12 = 0. Roots must sum to 7 and multiply to 12. That's 3 and 4. Done.",
          },
        ],
      },
    ],

    /* ── PUZZLES ── */
    puzzles: [
      {
        id: "tp1",
        level: 1,
        label: "Warm-up",
        difficulty: "easy",
        text: "x² − 16 = 0 tenglamaning ildizlari qaysi?",
        options: [
          { label: "A", value: "x = 4" },
          { label: "B", value: "x = 4 yoki x = −4" },
          { label: "C", value: "x = 256" },
          { label: "D", value: "x = 8" },
        ],
        correct: "B",
        explanation:
          "x² = 16. To'g'ridan-to'g'ri ildiz chiqaramiz: x = ±4. Kvadrat ildizda har doim IKKI javob bor — musbat va manfiy. Formula kerak emas.",
        mentor: {
          title: "Ildiz nima ekanini eslang",
          text: "16 ning kvadrat ildizi 4 yoki −4 bo'lishi mumkin, chunki (+4)² = 16 va (−4)² = 16. Har doim ikki variant bor.",
        },
      },
      {
        id: "tp2",
        level: 2,
        label: "Method choice",
        difficulty: "easy",
        text: "5x² − 15x = 0 uchun eng qulay birinchi qadam qaysi?",
        options: [
          { label: "A", value: "Diskriminant formulasini ishlating" },
          { label: "B", value: "5x ni umumiy ko'paytuvchi sifatida ajrating: 5x(x − 3) = 0" },
          { label: "C", value: "Ikkala tomonni x ga bo'ling" },
          { label: "D", value: "Ko'paytuvchilarga ajratish mumkin emas" },
        ],
        correct: "B",
        explanation:
          "c = 0 bo'lganda doim umumiy ko'paytuvchi bor. 5x ajratamiz → 5x(x − 3) = 0 → x = 0 yoki x = 3. Diqqat: x ga bo'lish xato — x = 0 yechimini yo'qotib qo'yamiz.",
        mentor: {
          title: "Formula oxirgi chora, birinchi emas",
          text: "c = 0 bo'lsa (erkin had yo'q), har doim x umumiy ko'paytuvchi sifatida ajratiladi. 5x ajratsak 5x(x − 3) = 0, va har ikki ko'paytuvchi nolga teng bo'lishi mumkin: x = 0 yoki x = 3. Formuladan tezroq.",
        },
      },
      {
        id: "tp3",
        level: 3,
        label: "Discriminant thinking",
        difficulty: "medium",
        text: "Hisob-kitobsiz: x² + 2x + 5 = 0 nechta haqiqiy ildizga ega?",
        options: [
          { label: "A", value: "Ikkita haqiqiy ildiz" },
          { label: "B", value: "Bitta haqiqiy ildiz" },
          { label: "C", value: "Haqiqiy ildiz yo'q" },
          { label: "D", value: "Hisoblashsiz aytib bo'lmaydi" },
        ],
        correct: "C",
        explanation:
          "D = b² − 4ac = 4 − 20 = −16. D < 0 bo'lganda parabola x o'qini kesib o'tmaydi. Haqiqiy ildiz yo'q. Buni yechmasdan oldin bilish mumkin edi.",
        mentor: {
          title: "Diskriminant kelajakni ko'rsatadi",
          text: "D = (2)² − 4(1)(5) = 4 − 20 = −16. Manfiy diskriminant = formuladagi kvadrat ildiz ostida manfiy son. Bu haqiqiy sonlar uchun mavjud emas. Parabola x o'qidan yuqorida turadi — hech qachon uni kesib o'tmaydi.",
        },
      },
      {
        id: "tp4",
        level: 3,
        label: "Looks hard, is easy",
        difficulty: "medium",
        text: "(x − 4)(x + 7) = 0 uchun x ning qiymatlari qanday?",
        options: [
          { label: "A", value: "Avval ochish kerak, keyin formula" },
          { label: "B", value: "x = 4 yoki x = −7 (to'g'ridan-to'g'ri)" },
          { label: "C", value: "x = −4 yoki x = 7" },
          { label: "D", value: "x = 28" },
        ],
        correct: "B",
        explanation:
          "Tenglama allaqachon ko'paytuvchilarga ajratilgan! Ko'paytma nolga teng bo'lishi uchun ko'paytuvchilardan biri nolga teng bo'lishi kerak. (x − 4) = 0 → x = 4. (x + 7) = 0 → x = −7. Ochish va qayta boshlash shart emas.",
        mentor: {
          title: "Nolga ko'paytma qoidasi",
          text: "A × B = 0 bo'lsa, A = 0 yoki B = 0 bo'lishi kerak. Bu shu qadar oddiy. (x − 4)(x + 7) = 0 ko'rib, 'ochishim kerak' deb o'ylamaslik — bu allaqachon javob.",
        },
      },
      {
        id: "tp5",
        level: 4,
        label: "Pattern breaker",
        difficulty: "hard",
        text: "To'g'ri to'rtburchakning yuzasi 28 va perimetri 22. Uzun tomonini L deb belgilasak, qaysi tenglama to'g'ri?",
        options: [
          { label: "A", value: "L² − 11L + 28 = 0" },
          { label: "B", value: "L² + 11L − 28 = 0" },
          { label: "C", value: "L² − 22L + 28 = 0" },
          { label: "D", value: "2L² − 11L + 14 = 0" },
        ],
        correct: "A",
        explanation:
          "Perimetr 22 → 2(L + W) = 22 → W = 11 − L. Yuza: L × W = 28 → L(11 − L) = 28 → 11L − L² = 28 → L² − 11L + 28 = 0. Ko'paytuvchilarga ajratsa: (L − 4)(L − 7) = 0, tomonlar 4 va 7.",
        mentor: {
          title: "Nostandart masalalar qanday tuziladi",
          text: "Ikki noma'lum, bitta yig'indi sharti (perimetrdan), bitta ko'paytma sharti (yuzadan). Bu ikki shart birga kvadrat tenglamani hosil qiladi. Ko'rsatkich: ikkita noma'lum + ularning ko'paytmasi = kvadrat tenglama.",
        },
      },
      {
        id: "tp6",
        level: 5,
        label: "Deep insight",
        difficulty: "hard",
        text: "x² + bx + 18 = 0 tenglamaning ildizlari 2 va 9 bo'lsa, b nechaga teng?",
        options: [
          { label: "A", value: "b = 11" },
          { label: "B", value: "b = −11" },
          { label: "C", value: "b = 7" },
          { label: "D", value: "Formulasiz topa olmayman" },
        ],
        correct: "B",
        explanation:
          "Vieta teoremasiga ko'ra: ildizlar yig'indisi = −b. 2 + 9 = 11 = −b → b = −11. Tekshirish: ildizlar ko'paytmasi = c = 18. 2 × 9 = 18 ✓. Hech qanday hisob-kitob kerak emas.",
        mentor: {
          title: "Vieta teoremasini ko'pchilik o'rganmaydi",
          text: "x² + bx + c = 0 uchun: ildizlar yig'indisi = −b va ildizlar ko'paytmasi = c. Ildizlar 2 va 9 bo'lsa: ko'paytma = 18 = c ✓, yig'indi = 11 = −b, demak b = −11. Bu formulaga muhtoj emas — koeffitsientlar va ildizlar orasidagi munosabat.",
        },
      },
    ],
  },

  /* ─────────────────────────────────────────
     FUNCTIONS — placeholder structure
  ───────────────────────────────────────── */
  functions: {
    id: "functions",
    title: "Funksiyalar",
    subtitle: "Every input, exactly one output — and why that matters",
    sections: [
      {
        id: "what",
        title: "What is it?",
        blocks: [
          {
            type: "text",
            content:
              "A function is a rule that assigns exactly one output to each input. Not approximately one — exactly one. This single constraint is what makes functions predictable and useful.",
          },
          {
            type: "fact",
            label: "Origin",
            content:
              "Gottfried Leibniz coined the term 'function' in 1673 while working on calculus. He needed a word for 'quantity that depends on another quantity.' Before that, mathematicians just drew curves without naming the relationship.",
          },
          {
            type: "definition",
            term: "Function",
            content:
              "f: A → B is a function if for every element x in set A, there is exactly one element f(x) in set B. The key word is 'exactly one' — two different outputs for the same input violates the definition.",
          },
        ],
      },
      {
        id: "why",
        title: "How and why?",
        blocks: [
          {
            type: "text",
            content:
              "The vertical line test is a quick visual check: if any vertical line crosses a graph more than once, it's not a function. The reason is geometric: a vertical line represents all points with the same x-value — if it hits the curve twice, x has two outputs.",
          },
          {
            type: "insight",
            title: "f(x) notation explained",
            content:
              "f(3) = 7 means: when x = 3, the output is 7. The 'f' names the function, the '3' is the input, and '= 7' is the output. It's not multiplication — it's a notation for 'apply function f to input 3'.",
            example: "If f(x) = x² + 1, then f(3) = 9 + 1 = 10. Not f × 3.",
          },
        ],
      },
    ],
    puzzles: [
      {
        id: "fp1",
        level: 1,
        label: "Warm-up",
        difficulty: "easy",
        text: "y = ±√x funksiyami?",
        options: [
          { label: "A", value: "Ha, bu funksiya" },
          { label: "B", value: "Yo'q — bir x ga ikki y qiymat mos keladi" },
          { label: "C", value: "Faqat x > 0 bo'lganda funksiya" },
          { label: "D", value: "Bilmayman" },
        ],
        correct: "B",
        explanation:
          "x = 4 uchun y = +2 va y = −2 ikkalasi ham mos keladi. Bu funksiya tarifini buzadi: bitta kirishga faqat bitta chiqish bo'lishi kerak.",
        mentor: {
          title: "Funksiyaning asosiy sharti",
          text: "Bitta kirishga BITTA chiqish. y = ±√x da x = 9 uchun y = 3 yoki y = −3 bo'ladi — ikkita javob. Funksiya emas.",
        },
      },
      {
        id: "fp2",
        level: 2,
        label: "Notation",
        difficulty: "easy",
        text: "f(x) = 2x − 3 bo'lsa, f(−2) + f(5) nechaga teng?",
        options: [
          { label: "A", value: "0" },
          { label: "B", value: "4" },
          { label: "C", value: "−1" },
          { label: "D", value: "10" },
        ],
        correct: "A",
        explanation:
          "f(−2) = 2(−2) − 3 = −4 − 3 = −7. f(5) = 2(5) − 3 = 10 − 3 = 7. Yig'indi: −7 + 7 = 0.",
        mentor: {
          title: "f(x) — bu ko'paytirish emas",
          text: "f(−2) degani: x o'rniga −2 qo'ying. f(−2) = 2(−2) − 3 = −7. f(5) = 2(5) − 3 = 7. Yig'indisi 0.",
        },
      },
    ],
  },

  /* ─────────────────────────────────────────
     INEQUALITIES — placeholder
  ───────────────────────────────────────── */
  inequalities: {
    id: "inequalities",
    title: "Tengsizliklar",
    subtitle: "Solutions as ranges, not single values",
    sections: [
      {
        id: "what",
        title: "What is it?",
        blocks: [
          {
            type: "text",
            content:
              "An inequality says that two expressions are not equal — one is greater or lesser. Unlike equations, the solution is not a single value but an entire interval of values.",
          },
          {
            type: "definition",
            term: "Solution set",
            content:
              "The solution of x > 3 is not 'x = 4' or 'x = 5' — it's all numbers greater than 3. Infinitely many. You represent this on a number line, not as a single point.",
          },
          {
            type: "method",
            number: "01",
            title: "The sign flip rule",
            when: "When multiplying or dividing by a negative number",
            example: "−2x > 6  →  x < −3  (sign flips when dividing by −2)",
            note: "This is the single most common error. Negative divisor always flips the inequality.",
          },
        ],
      },
      {
        id: "why",
        title: "How and why?",
        blocks: [
          {
            type: "text",
            content:
              "For quadratic inequalities, always find the roots first, then test which intervals satisfy the inequality. The parabola's shape (opening up or down) tells you which regions are above/below zero.",
          },
          {
            type: "insight",
            title: "Why the sign flips with negatives",
            content:
              "If 3 > 2, then −3 < −2. Multiplying by −1 reverses the order of numbers on the number line. This isn't a rule to memorize — it's geometry. Negation mirrors the number line.",
            example: "3 > 2, multiply both by −1: −3 < −2. The inequality flipped.",
          },
        ],
      },
    ],
    puzzles: [
      {
        id: "ip1",
        level: 1,
        label: "Warm-up",
        difficulty: "easy",
        text: "−3x + 9 > 0 ni yeching.",
        options: [
          { label: "A", value: "x > 3" },
          { label: "B", value: "x < 3" },
          { label: "C", value: "x > −3" },
          { label: "D", value: "x < −3" },
        ],
        correct: "B",
        explanation:
          "−3x > −9. Manfiy songa bo'lamiz — belgi teskari bo'ladi: x < 3.",
        mentor: {
          title: "Manfiy songa bo'lganda belgi o'zgaradi",
          text: "−3x > −9 da ikkala tomonni −3 ga bo'lamiz. Manfiy bo'lgani uchun '>' teskari bo'lib '<' bo'ladi: x < 3.",
        },
      },
    ],
  },
};