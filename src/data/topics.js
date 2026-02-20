import {
  ChartSpline,
  BookOpen,
  Calculator,
  Scale,
  Percent,
  Divide,
  Ruler,
  Radical,
  ArrowDown01,
  Equal,
} from "lucide-react";

export const topics = [
  {
    id: "quadratic",
    title: "Kvadrat tenglamalar",
    icon: Radical,           
    description: "Ildizlar, diskriminant va echish usullari.",
    difficulty: "medium"
  },
  {
    id: "systems",
    title: "Tenlamalar sistemasi",
    icon: ArrowDown01,
    description: "Chiziqli sistemalarni echish va ziddiyatlar.",
    difficulty: "medium"
  },
  {
    id: "functions",
    title: "Funksiyalar",
    icon: ChartSpline,              
    description: "Funksiya tushunchasi, grafiklar va ta'rif sohasi.",
    difficulty: "easy"
  },
  {
    id: "inequalities",
    title: "Tengsizliklar",
    icon: Equal,
    description: "Tengsizliklarni echish va talqin qilish.",
    difficulty: "medium"
  },
  {
    id: "percentages",
    title: "Foizlar",
    icon: Percent,
    description: "Foiz hisoblash, o'zgarish va amaliy masalalar.",
    difficulty: "easy"
  },

];