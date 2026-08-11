import { ComplexityId } from "./complexity-data"

export interface QuizQuestion {
  id: string
  code: string
  answer: ComplexityId
  explanation: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    code: `function first(arr) {
  return arr[0];
}`,
    answer: "o1",
    explanation: "No loop, no recursion — just one direct access. The size of arr never enters the picture.",
  },
  {
    id: "q2",
    code: `function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`,
    answer: "on",
    explanation: "One loop touching every element once. Double the array, double the iterations — that's linear.",
  },
  {
    id: "q3",
    code: `function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
    answer: "on2",
    explanation: "A loop inside a loop, both running the full length of arr — n × n comparisons in the worst case.",
  },
  {
    id: "q4",
    code: `function countDigits(n) {
  let count = 0;
  while (n > 0) {
    n = Math.floor(n / 10);
    count++;
  }
  return count;
}`,
    answer: "ologn",
    explanation: "Each iteration divides n by 10 — the input shrinks by a constant factor every step, the signature of log n.",
  },
  {
    id: "q5",
    code: `function printTwice(arr) {
  for (let i = 0; i < arr.length; i++) console.log(arr[i]);
  for (let j = 0; j < arr.length; j++) console.log(arr[j]);
}`,
    answer: "on",
    explanation: "Two separate loops, not nested — that's n + n = 2n, and constants get dropped in Big-O, leaving O(n).",
  },
  {
    id: "q6",
    code: `function search(matrix, target) {
  for (const row of matrix) {
    for (let k = 0; k < 3; k++) {
      if (row[k] === target) return true;
    }
  }
  return false;
}`,
    answer: "on",
    explanation: "The inner loop always runs exactly 3 times — a constant, not tied to n. So this is really n × (constant) = O(n), not O(n²). Nested loops don't automatically mean quadratic.",
  },
  {
    id: "q7",
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
    answer: "onlogn",
    explanation: "The array is split in half each time (log n levels of recursion), and merging at each level costs O(n) total — n work × log n levels.",
  },
  {
    id: "q8",
    code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
    answer: "o2n",
    explanation: "Every call branches into two more calls until the base case — the number of calls roughly doubles with each increase in n.",
  },
]
