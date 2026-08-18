export interface FunctionQuizQuestion {
  id: string
  code: string
  options: string[]
  answerIndex: number
  explanation: string
}

export const FUNCTION_QUIZ: FunctionQuizQuestion[] = [
  {
    id: "q1",
    code: `function algoMaitriSquare(x) {
  return x * x;
}
console.log(algoMaitriSquare(4));`,
    options: ["16", "8", "4", "undefined"],
    answerIndex: 0,
    explanation: "4 × 4 = 16. A straightforward call and return.",
  },
  {
    id: "q2",
    code: `function algoMaitriGreet(name = "friend") {
  return \`Hi, \${name}\`;
}
console.log(algoMaitriGreet());`,
    options: ["Hi, friend", "Hi, undefined", "undefined", "Error"],
    answerIndex: 0,
    explanation: "No argument was passed, so name falls back to its default value, \"friend\".",
  },
  {
    id: "q3",
    code: `function algoMaitriAdd(a, b) {
  a + b;
}
console.log(algoMaitriAdd(2, 3));`,
    options: ["5", "undefined", "Error", "0"],
    answerIndex: 1,
    explanation: "Classic trap: the function computes a + b but never RETURNS it, so the call evaluates to undefined.",
  },
  {
    id: "q4",
    code: `function algoMaitriCountDown(n) {
  if (n <= 0) return;
  console.log(n);
  algoMaitriCountDown(n - 1);
}
algoMaitriCountDown(3);`,
    options: ["3 2 1", "1 2 3", "3 2 1 0", "Infinite loop"],
    answerIndex: 0,
    explanation: "Each call logs n BEFORE recursing with n-1. Once n hits 0, the base case returns immediately without logging.",
  },
  {
    id: "q5",
    code: `function algoMaitriMakeAdder(x) {
  return function(y) {
    return x + y;
  };
}
const add5 = algoMaitriMakeAdder(5);
console.log(add5(2));`,
    options: ["7", "2", "5", "undefined"],
    answerIndex: 0,
    explanation: "The inner function closes over x=5. Calling add5(2) computes 5 + 2 = 7 — the closure remembered x even after algoMaitriMakeAdder returned.",
  },
  {
    id: "q6",
    code: `function algoMaitriAddItem(arr) {
  arr.push("new");
}
const list = ["a", "b"];
algoMaitriAddItem(list);
console.log(list.length);`,
    options: ["3", "2", "undefined", "Error"],
    answerIndex: 0,
    explanation: "Arrays and objects are passed by reference — algoMaitriAddItem mutates the SAME array the caller owns, so the push is visible outside the function too.",
  },
  {
    id: "q7",
    code: `function algoMaitriTransform(arr, fn) {
  return arr.map(fn);
}
console.log(algoMaitriTransform([1, 2, 3], n => n * 10));`,
    options: ["[10, 20, 30]", "[1, 2, 3]", "10", "Error"],
    answerIndex: 0,
    explanation: "algoMaitriTransform is a higher-order function — it takes the callback fn and applies it to every element via .map().",
  },
  {
    id: "q8",
    code: `let count = 1;
function increment() {
  let count = 100;
  count = count + 1;
}
increment();
console.log(count);`,
    options: ["1", "101", "2", "100"],
    answerIndex: 0,
    explanation: "The inner `let count` creates a brand new variable that SHADOWS the outer one for the whole function body. Changing it never touches the outer count, which stays 1.",
  },
]
