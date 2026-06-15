export interface IQQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: "medium" | "hard";
}

export const iqQuestions: IQQuestion[] = [
  // === MEDIUM (1-20) ===
  {
    id: 1,
    question: "If all cats are mammals and some mammals are black, which statement is true?",
    options: ["All black animals are cats", "Some cats are black", "All cats are black", "None of the above"],
    correct: 3,
    category: "Logical Reasoning",
    difficulty: "medium",
  },
  {
    id: 2,
    question: "A train travels 60 km in 1 hour. How far will it travel in 45 minutes?",
    options: ["40 km", "45 km", "50 km", "55 km"],
    correct: 1,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 3,
    question: "Find the missing number: 3, 6, 11, 18, ?",
    options: ["25", "27", "29", "31"],
    correct: 1,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 4,
    question: "If you rearrange the letters 'CIFAIPC', you get the name of a:",
    options: ["City", "Animal", "Ocean", "Country"],
    correct: 3,
    category: "Verbal Reasoning",
    difficulty: "medium",
  },
  {
    id: 5,
    question: "Which number should replace the question mark? 8, 27, 64, 125, ?",
    options: ["196", "216", "225", "256"],
    correct: 1,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 6,
    question: "A clock shows 3:15. What is the angle between the hour and minute hand?",
    options: ["0°", "7.5°", "15°", "30°"],
    correct: 1,
    category: "Spatial Reasoning",
    difficulty: "medium",
  },
  {
    id: 7,
    question: "Which one does not belong to the same group?",
    options: ["Elephant", "Tiger", "Lion", "Leopard"],
    correct: 0,
    category: "Verbal Reasoning",
    difficulty: "medium",
  },
  {
    id: 8,
    question: "If A = 1, B = 2, C = 3, what is the value of 'EQ'?",
    options: ["27", "35", "39", "41"],
    correct: 1,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 9,
    question: "What comes next in the series: Z, X, V, T, ?",
    options: ["R", "S", "Q", "U"],
    correct: 0,
    category: "Pattern Recognition",
    difficulty: "medium",
  },
  {
    id: 10,
    question: "If you fold a square paper in half and then in half again, how many layers do you get?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    category: "Spatial Reasoning",
    difficulty: "medium",
  },
  {
    id: 11,
    question: "Which word is the odd one out?",
    options: ["Triangle", "Square", "Circle", "Prism"],
    correct: 3,
    category: "Spatial Reasoning",
    difficulty: "medium",
  },
  {
    id: 12,
    question: "If 5 cats can catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    options: ["5", "10", "20", "100"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "medium",
  },
  {
    id: 13,
    question: "What is the next number? 1, 4, 9, 16, 25, ?",
    options: ["30", "35", "36", "49"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 14,
    question: "Complete the analogy: Doctor : Hospital :: Teacher : ?",
    options: ["School", "College", "Classroom", "Education"],
    correct: 0,
    category: "Verbal Reasoning",
    difficulty: "medium",
  },
  {
    id: 15,
    question: "If North becomes West, West becomes South, what does East become?",
    options: ["North", "South", "West", "East"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "medium",
  },
  {
    id: 16,
    question: "Find the missing number: 7, 10, 15, 22, 31, ?",
    options: ["40", "42", "44", "46"],
    correct: 1,
    category: "Numerical Reasoning",
    difficulty: "medium",
  },
  {
    id: 17,
    question: "If 'LIGHT' is coded as 'MJIHS', how is 'DARK' coded?",
    options: ["EBSL", "CZQJ", "FCVN", "DWMS"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "medium",
  },
  {
    id: 18,
    question: "Complete the analogy: Oasis : Desert :: Island : ?",
    options: ["River", "Ocean", "Mountain", "Forest"],
    correct: 1,
    category: "Verbal Reasoning",
    difficulty: "medium",
  },
  {
    id: 19,
    question: "How many triangles can you count in a regular pentagon with all its diagonals drawn?",
    options: ["25", "30", "35", "40"],
    correct: 2,
    category: "Spatial Reasoning",
    difficulty: "medium",
  },
  {
    id: 20,
    question: "What is the next term in the series? AB, ABC, ABCD, ?",
    options: ["ABCE", "ABCDE", "ABCD", "ABC"],
    correct: 1,
    category: "Pattern Recognition",
    difficulty: "medium",
  },

  // === HARD (21-40) ===
  {
    id: 21,
    question: "Find the missing number: 2, 6, 30, 210, ?",
    options: ["420", "630", "840", "1890"],
    correct: 3,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 22,
    question: "If in a certain code, 'MAN' is written as 'NBO', how is 'CAT' written?",
    options: ["DBU", "DBS", "EBU", "EBS"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 23,
    question: "Which number does not belong in the sequence? 2, 3, 5, 7, 11, 13, 17, 19, 23, 25",
    options: ["11", "19", "25", "23"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 24,
    question: "If a cube is painted on all sides and then cut into 27 smaller cubes, how many have paint on exactly 2 faces?",
    options: ["4", "8", "12", "16"],
    correct: 2,
    category: "Spatial Reasoning",
    difficulty: "hard",
  },
  {
    id: 25,
    question: "Find the next letter: A, E, F, H, I, ?",
    options: ["K", "L", "M", "N"],
    correct: 0,
    category: "Pattern Recognition",
    difficulty: "hard",
  },
  {
    id: 26,
    question: "If 3x + 4 = 19, what is the value of 7x - 5?",
    options: ["25", "27", "30", "35"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 27,
    question: "Complete the series: J, F, M, A, M, J, ?",
    options: ["A", "J", "S", "O"],
    correct: 1,
    category: "Pattern Recognition",
    difficulty: "hard",
  },
  {
    id: 28,
    question: "If you have a 5-liter jug and a 3-liter jug, how can you measure exactly 4 liters?",
    options: [
      "Fill 5, pour to 3, empty 3, pour remaining to 3, fill 5, pour to 3",
      "Fill 3, pour to 5, fill 3, pour to 5, empty 5, pour 3 to 5",
      "Fill 5 and pour to 3 twice",
      "Fill 3 twice and pour to 5",
    ],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 29,
    question: "What is the value of √(144) + √(169)?",
    options: ["25", "23", "27", "29"],
    correct: 0,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 30,
    question: "If all squares are rectangles but not all rectangles are squares, then:",
    options: [
      "All rectangles have 4 equal sides",
      "Some rectangles are squares",
      "No square is a rectangle",
      "All squares have unequal sides",
    ],
    correct: 1,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 31,
    question: "Find the odd one out: 64, 125, 216, 256, 343",
    options: ["64", "125", "216", "256"],
    correct: 3,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 32,
    question: "If 'FISH' is coded as 'EHRG', how is 'BIRD' coded?",
    options: ["AHQC", "CHRF", "CJSE", "AHPC"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 33,
    question: "Two fathers and two sons are in a car, yet there are only three people. How?",
    options: ["Grandfather, Father, Son", "Twins with their father", "Adopted son", "Uncle with two nephews"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 34,
    question: "What number comes next? 0, 1, 1, 2, 3, 5, 8, 13, ?",
    options: ["18", "20", "21", "25"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 35,
    question: "A bat and a ball together cost ₹110. The bat costs ₹100 more than the ball. How much does the ball cost?",
    options: ["₹5", "₹10", "₹15", "₹20"],
    correct: 0,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 36,
    question: "Find the missing number: 1, 4, 27, 256, ?",
    options: ["625", "1024", "3125", "4096"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
  {
    id: 37,
    question: "If 3 persons can build 3 walls in 3 days, how many walls can 9 persons build in 9 days?",
    options: ["9", "18", "27", "36"],
    correct: 2,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 38,
    question: "Which letter is the 9th letter to the right of the 3rd letter from the left in the word 'EXTRAORDINARY'?",
    options: ["A", "R", "D", "N"],
    correct: 1,
    category: "Verbal Reasoning",
    difficulty: "hard",
  },
  {
    id: 39,
    question: "If today is Thursday, what day will it be after 100 days?",
    options: ["Wednesday", "Thursday", "Friday", "Saturday"],
    correct: 3,
    category: "Logical Reasoning",
    difficulty: "hard",
  },
  {
    id: 40,
    question: "A number when multiplied by 5 and then reduced by 7 gives 38. What is the number?",
    options: ["7", "8", "9", "10"],
    correct: 2,
    category: "Numerical Reasoning",
    difficulty: "hard",
  },
];

export const difficultyLabels: Record<string, string> = {
  medium: "Medium",
  hard: "Advanced",
};

export function calculateIQ(score: number, total: number): number {
  const pct = score / total;
  if (pct >= 0.975) return 145;
  if (pct >= 0.925) return 135;
  if (pct >= 0.875) return 128;
  if (pct >= 0.825) return 120;
  if (pct >= 0.775) return 115;
  if (pct >= 0.725) return 110;
  if (pct >= 0.675) return 105;
  if (pct >= 0.625) return 100;
  if (pct >= 0.575) return 96;
  if (pct >= 0.525) return 92;
  if (pct >= 0.475) return 88;
  if (pct >= 0.425) return 84;
  if (pct >= 0.375) return 80;
  if (pct >= 0.3) return 76;
  return 72;
}

export function getIQLabel(iq: number): string {
  if (iq >= 130) return "Genius";
  if (iq >= 120) return "Superior Intelligence";
  if (iq >= 110) return "Above Average";
  if (iq >= 90) return "Average";
  if (iq >= 80) return "Below Average";
  return "Needs Improvement";
}

export function getIQColor(iq: number): string {
  if (iq >= 130) return "text-purple-600";
  if (iq >= 120) return "text-indigo-600";
  if (iq >= 110) return "text-emerald-600";
  if (iq >= 90) return "text-blue-600";
  if (iq >= 80) return "text-amber-600";
  return "text-red-600";
}
