// components/visualizer/recursion/recursion-problems-intermediate.ts
// Intermediate recursion problems (ids 10-15) — follows the exact same
// pattern as recursion-problems-core.ts: real `code`, and a
// `generateSteps()` that ACTUALLY RUNS that logic, pushing one
// `step(...)` per meaningful line executed.

import { RecursionProblem, frame, step } from "./recursion-problem-types"

// ════════════════════════════════════════════════════════════════
// 10. Check if an Array is Sorted (Recursion)
// ════════════════════════════════════════════════════════════════
const isArraySorted: RecursionProblem = {
  id: 10,
  slug: "check-if-array-is-sorted-recursion",
  title: "Check if an Array is Sorted (Recursion)",
  difficulty: "Easy",
  companies: ["Amazon", "Microsoft", "Adobe", "Flipkart"],
  tags: ["Recursion", "Array", "Base Case"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of integers, determine whether it is sorted in non-decreasing (ascending) order using recursion instead of a loop. Each call checks one adjacent pair and delegates the rest of the array to a smaller recursive call.",
  examples: [
    { input: "arr = [1,2,3,5]", output: "true", explanation: "Every adjacent pair satisfies arr[i] <= arr[i+1]." },
    { input: "arr = [1,3,2,5]", output: "false", explanation: "arr[1]=3 > arr[2]=2, so the array is not sorted." },
  ],
  constraints: ["0 ≤ arr.length ≤ 10⁴"],
  hints: [
    "The base case is when there's nothing left to compare: index >= length - 1.",
    "At each index i, you only need to check arr[i] against arr[i+1] — the rest is handled by the recursive call.",
    "As soon as one pair is out of order you can return false immediately without checking the rest.",
  ],
  pitfalls: [
    "Off-by-one in the base case — using `i >= arr.length` instead of `i >= arr.length - 1` reads past the end of the array.",
    "Forgetting to `return` the recursive call's result, so the function always resolves to `undefined`.",
    "Not short-circuiting on the first out-of-order pair, which wastes calls but more importantly makes it easy to accidentally overwrite a `false` result with a later recursive call.",
  ],
  approaches: [
    {
      name: "Recursive",
      complexity: "O(n)",
      space: "O(n) — one stack frame per index",
      description: "Compare arr[i] and arr[i+1]; if they're out of order return false immediately, otherwise recurse on i+1.",
    },
    {
      name: "Iterative",
      complexity: "O(n)",
      space: "O(1)",
      description: "A single loop comparing each adjacent pair — no call stack growth.",
    },
  ],
  code: `function isSorted(arr, i = 0) {
  if (i >= arr.length - 1) return true;
  if (arr[i] > arr[i + 1]) return false;
  return isSorted(arr, i + 1);
}`,
  generateSteps() {
    const arr = [1, 2, 3, 5]
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(i: number): boolean {
      const f = frame(`isSorted(i=${i})`, [["i", i]])
      stack.push(f)
      steps.push(step(1, stack, `Call isSorted(arr, ${i}).`, { array: arr, highlighted: [i] }))

      if (i >= arr.length - 1) {
        steps.push(step(2, stack, `i=${i} >= length-1=${arr.length - 1} — no pairs left, return true.`, { array: arr, highlighted: [i] }))
        stack.pop()
        return true
      }

      steps.push(step(3, stack, `Compare arr[${i}]=${arr[i]} with arr[${i + 1}]=${arr[i + 1]}.`, { array: arr, highlighted: [i, i + 1] }))
      if (arr[i] > arr[i + 1]) {
        steps.push(step(3, stack, `arr[${i}]=${arr[i]} > arr[${i + 1}]=${arr[i + 1]} — out of order, return false.`, { array: arr, highlighted: [i, i + 1] }))
        stack.pop()
        return false
      }

      steps.push(step(4, stack, `arr[${i}] <= arr[${i + 1}] — recurse on isSorted(arr, ${i + 1}).`, { array: arr, highlighted: [i, i + 1] }))
      const sub = run(i + 1)
      stack.pop()
      return sub
    }

    const result = run(0)
    steps.push(step(4, [], `Done — array is ${result ? "sorted" : "not sorted"}.`, { array: arr, result: [String(result)] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 11. Power of a Number (Fast Exponentiation)
// ════════════════════════════════════════════════════════════════
const powerOfNumber: RecursionProblem = {
  id: 11,
  slug: "power-of-a-number-fast-exponentiation",
  title: "Power of a Number (Fast Exponentiation)",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Apple", "Nvidia"],
  tags: ["Recursion", "Divide & Conquer", "Math"],
  timeComplexity: "O(log n)",
  spaceComplexity: "O(log n)",
  description:
    "Given a base x and a non-negative exponent n, compute x^n. A naive recursive solution multiplies x by itself n times in O(n) calls. Fast exponentiation instead halves n on every call, computing x^n in only O(log n) calls by reusing the result of x^(n/2).",
  examples: [
    { input: "x = 2, n = 10", output: "1024", explanation: "Computed as (2^5)^2 instead of 10 sequential multiplications." },
    { input: "x = 3, n = 4", output: "81", explanation: "3^4 = (3^2)^2 = 9^2 = 81." },
  ],
  constraints: ["0 ≤ n ≤ 30", "-10 ≤ x ≤ 10"],
  hints: [
    "If n is even, x^n = (x^(n/2))^2 — compute the half only once and square it, don't call power(x, n/2) twice.",
    "If n is odd, x^n = x · x^(n-1), which reduces to the even case with one extra factor of x.",
    "The base case is n = 0, where any x^0 = 1.",
  ],
  pitfalls: [
    "Calling `power(x, n/2) * power(x, n/2)` instead of storing the half in a variable — this silently turns the algorithm back into O(n) calls because each call still branches into two.",
    "Using `n/2` in JavaScript without `Math.floor`, which produces a non-integer exponent for odd n.",
    "Mishandling odd n by squaring first and then trying to divide out a factor of x, instead of the simpler x · x^(n-1) reduction.",
  ],
  approaches: [
    {
      name: "Fast exponentiation (divide & conquer)",
      complexity: "O(log n)",
      space: "O(log n) for the call stack",
      description: "Halve n each call; square the single recursive result for even n, and multiply in one extra factor of x for odd n.",
    },
    {
      name: "Naive recursion",
      complexity: "O(n)",
      space: "O(n)",
      description: "return x * power(x, n - 1) — correct but calls the function n times instead of log₂n times.",
    },
  ],
  code: `function power(x, n) {
  if (n === 0) return 1;
  const half = power(x, Math.floor(n / 2));
  if (n % 2 === 0) return half * half;
  return half * half * x;
}`,
  generateSteps() {
    const x = 2
    const n = 10
    const steps = []
    const stack: ReturnType<typeof frame>[] = []

    function run(k: number): number {
      const f = frame(`power(${x}, ${k})`, [["n", k]])
      stack.push(f)
      steps.push(step(1, stack, `Call power(${x}, ${k}).`))

      if (k === 0) {
        steps.push(step(2, stack, `Base case: n=0, return 1.`))
        stack.pop()
        return 1
      }

      const half_n = Math.floor(k / 2)
      steps.push(step(3, stack, `Need half = power(${x}, ${half_n}) before this call can finish.`))
      const half = run(half_n)
      steps.push(step(3, stack, `half = power(${x}, ${half_n}) returned ${half}.`))

      let result: number
      if (k % 2 === 0) {
        result = half * half
        steps.push(step(4, stack, `n=${k} is even → return half × half = ${half} × ${half} = ${result}.`))
      } else {
        result = half * half * x
        steps.push(step(5, stack, `n=${k} is odd → return half × half × x = ${half} × ${half} × ${x} = ${result}.`))
      }
      stack.pop()
      return result
    }

    const result = run(n)
    steps.push(step(5, [], `Done — ${x}^${n} = ${result}, computed in O(log n) calls.`, { result: [`${x}^${n} = ${result}`] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 12. Subsequences of a String
// ════════════════════════════════════════════════════════════════
const subsequencesOfString: RecursionProblem = {
  id: 12,
  slug: "subsequences-of-a-string",
  title: "Subsequences of a String",
  difficulty: "Medium",
  companies: ["Amazon", "Meta", "Microsoft", "Adobe", "Zomato"],
  tags: ["Recursion", "Backtracking", "String"],
  timeComplexity: "O(2ⁿ)",
  spaceComplexity: "O(n) recursion depth, O(2ⁿ) for the output",
  description:
    "Given a string, return all of its subsequences (contiguous or not, including the empty string). At every character, branch into two recursive calls: one that includes the character in the current subsequence, and one that excludes it.",
  examples: [
    { input: "s = \"abc\"", output: "[\"abc\",\"ab\",\"ac\",\"a\",\"bc\",\"b\",\"c\",\"\"]" },
    { input: "s = \"a\"", output: "[\"a\",\"\"]" },
  ],
  constraints: ["0 ≤ s.length ≤ 15"],
  hints: [
    "Every character has exactly two fates: it's either in the subsequence, or it isn't — that's the branching factor of 2 per character.",
    "The base case is reaching the end of the string, at which point the current partial string IS a complete subsequence.",
    "Unlike subsets-by-index-loop, this uses exactly two recursive calls per level rather than a for-loop over remaining choices.",
  ],
  pitfalls: [
    "Using a for-loop like the Subsets pattern instead of two explicit include/exclude calls — both are valid but mixing them up produces the wrong branching structure for this problem.",
    "Forgetting to record the base case as its own subsequence (including the empty string when nothing was ever included).",
    "Building the current string with mutation (push/pop) instead of string concatenation and forgetting to undo the mutation on the exclude branch.",
  ],
  approaches: [
    {
      name: "Include/Exclude recursion",
      complexity: "O(2ⁿ)",
      space: "O(n)",
      description: "At index i, recurse once with s[i] appended to the current string, and once without it, until index reaches the string's length.",
    },
  ],
  code: `function subsequences(s, index = 0, current = "", result = []) {
  if (index === s.length) {
    result.push(current);
    return result;
  }
  subsequences(s, index + 1, current + s[index], result);
  subsequences(s, index + 1, current, result);
  return result;
}`,
  generateSteps() {
    const s = "abc"
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const result: string[] = []

    function run(index: number, current: string) {
      const f = frame(`subsequences(index=${index})`, [
        ["index", index],
        ["current", `"${current}"`],
      ])
      stack.push(f)
      steps.push(step(1, stack, `Call subsequences(index=${index}, current="${current}").`, {
        array: s.split(""),
        highlighted: index < s.length ? [index] : [],
        result: [...result],
      }))

      if (index === s.length) {
        result.push(current)
        steps.push(step(3, stack, `index=${index} reached end of string — record subsequence "${current}".`, {
          array: s.split(""),
          result: [...result],
        }))
        stack.pop()
        return
      }

      steps.push(step(6, stack, `Include s[${index}]='${s[index]}' → recurse with current="${current + s[index]}".`, {
        array: s.split(""),
        highlighted: [index],
        result: [...result],
      }))
      run(index + 1, current + s[index])

      steps.push(step(7, stack, `Exclude s[${index}]='${s[index]}' → recurse with current="${current}".`, {
        array: s.split(""),
        highlighted: [index],
        result: [...result],
      }))
      run(index + 1, current)

      stack.pop()
    }

    run(0, "")
    steps.push(step(8, [], `All ${result.length} subsequences found.`, { array: s.split(""), result: [...result] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 13. Permutations of an Array
// ════════════════════════════════════════════════════════════════
const permutationsOfArray: RecursionProblem = {
  id: 13,
  slug: "permutations-of-an-array",
  title: "Permutations of an Array",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber"],
  tags: ["Recursion", "Backtracking", "Array"],
  timeComplexity: "O(n · n!)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of distinct integers, return all possible permutations, using a swap-based backtracking approach: fix each position in turn by swapping in every remaining candidate, recurse on the rest, then swap back.",
  examples: [
    { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]]" },
    { input: "nums = [1,2]", output: "[[1,2],[2,1]]" },
  ],
  constraints: ["1 ≤ nums.length ≤ 6", "All integers are distinct"],
  hints: [
    "Think of it as filling positions left to right: at position l, try every candidate at index i >= l by swapping it into position l.",
    "The base case is when the position being filled is the last index — the whole array is now one complete permutation.",
    "After recursing with one candidate swapped into place, swap back to restore the array before trying the next candidate — that's the backtrack step.",
  ],
  pitfalls: [
    "Forgetting to swap back after the recursive call returns — this corrupts the array for sibling branches and produces wrong or duplicate permutations.",
    "Pushing a reference to the array into the result list instead of a copy ([...arr]) — since the array keeps being swapped in place, every stored permutation ends up showing the same final state.",
    "Swapping arr[l] with arr[i] but recursing with the wrong start index (e.g. i+1 instead of l+1), which skips positions instead of fixing one per level.",
  ],
  approaches: [
    {
      name: "Swap-based backtracking",
      complexity: "O(n · n!)",
      space: "O(n)",
      description: "For each position l, swap in every remaining element, recurse to fill the rest, then swap back to try the next candidate.",
    },
    {
      name: "Used-array backtracking",
      complexity: "O(n · n!)",
      space: "O(n)",
      description: "Build permutations by picking one unused element at a time into a separate path array, tracked with a boolean 'used' array.",
    },
  ],
  code: `function permute(arr, l = 0, result = []) {
  if (l === arr.length - 1) {
    result.push([...arr]);
    return result;
  }
  for (let i = l; i < arr.length; i++) {
    [arr[l], arr[i]] = [arr[i], arr[l]];
    permute(arr, l + 1, result);
    [arr[l], arr[i]] = [arr[i], arr[l]];
  }
  return result;
}`,
  generateSteps() {
    const arr = [1, 2, 3]
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const result: number[][] = []

    const fmt = () => result.map((r) => `[${r.join(",")}]`)

    function swap(i: number, j: number) {
      const t = arr[i]
      arr[i] = arr[j]
      arr[j] = t
    }

    function run(l: number) {
      const f = frame(`permute(l=${l})`, [["l", l]])
      stack.push(f)
      steps.push(step(1, stack, `Call permute(arr, l=${l}) with arr=[${arr.join(",")}].`, { array: [...arr], result: fmt() }))

      if (l === arr.length - 1) {
        result.push([...arr])
        steps.push(step(3, stack, `l=${l} is the last index — record permutation [${arr.join(",")}].`, { array: [...arr], result: fmt() }))
        stack.pop()
        return
      }

      for (let i = l; i < arr.length; i++) {
        swap(l, i)
        steps.push(step(7, stack, `Swap positions ${l} and ${i} → arr=[${arr.join(",")}].`, { array: [...arr], swapped: [l, i], result: fmt() }))

        run(l + 1)

        swap(l, i)
        steps.push(step(9, stack, `Backtrack: swap ${l} and ${i} back → arr=[${arr.join(",")}].`, { array: [...arr], swapped: [l, i], result: fmt() }))
      }

      stack.pop()
    }

    run(0)
    steps.push(step(11, [], `All ${result.length} permutations found.`, { array: [...arr], result: fmt() }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 14. Generate Parentheses
// ════════════════════════════════════════════════════════════════
const generateParentheses: RecursionProblem = {
  id: 14,
  slug: "generate-parentheses",
  title: "Generate Parentheses",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "Airbnb"],
  tags: ["Recursion", "Backtracking", "String"],
  timeComplexity: "O(4ⁿ / √n) — the nth Catalan number",
  spaceComplexity: "O(n) recursion depth",
  description:
    "Given n pairs of parentheses, generate all combinations of well-formed (balanced) parentheses. Backtrack by tracking how many '(' and ')' have been placed so far, only ever closing when there's an unmatched open bracket to close.",
  examples: [
    { input: "n = 2", output: "[\"(())\",\"()()\"]" },
    { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
  ],
  constraints: ["1 ≤ n ≤ 8"],
  hints: [
    "You can add '(' any time you haven't used all n of them yet — track that with an `open` counter.",
    "You can only add ')' when there's an unmatched '(' still open, i.e. close < open — otherwise the string becomes invalid.",
    "The base case is when the current string reaches length 2n — every valid combination is exactly that long.",
  ],
  pitfalls: [
    "Allowing close >= open, which produces an invalid string like \")(\" that can never be balanced no matter what's appended later.",
    "Forgetting the guard `open < n` before adding '(' — without it you can add more than n open brackets.",
    "Checking length === 2n but not also verifying open === close === n implicitly — if the open/close guards above are correct this is automatic, but it's an easy place to introduce a subtle bug if the guards are loosened.",
  ],
  approaches: [
    {
      name: "Backtracking",
      complexity: "O(4ⁿ / √n)",
      space: "O(n)",
      description: "Grow the string one character at a time, branching into '(' (if open < n) and ')' (if close < open), recording completed strings of length 2n.",
    },
  ],
  code: `function generateParenthesis(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) backtrack(current + "(", open + 1, close);
    if (close < open) backtrack(current + ")", open, close + 1);
  }

  backtrack("", 0, 0);
  return result;
}`,
  generateSteps() {
    const n = 2
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const result: string[] = []

    function backtrack(current: string, open: number, close: number) {
      const f = frame(`backtrack(open=${open}, close=${close})`, [
        ["open", open],
        ["close", close],
      ])
      stack.push(f)
      steps.push(step(4, stack, `Call backtrack(current="${current}", open=${open}, close=${close}).`, {
        array: current.split(""),
        result: [...result],
      }))

      if (current.length === 2 * n) {
        result.push(current)
        steps.push(step(6, stack, `current="${current}" has length ${2 * n} — record it as a valid combination.`, {
          array: current.split(""),
          result: [...result],
        }))
        stack.pop()
        return
      }

      if (open < n) {
        steps.push(step(9, stack, `open=${open} < n=${n} — can add '(' → recurse with "${current}(".`, {
          array: current.split(""),
          result: [...result],
        }))
        backtrack(current + "(", open + 1, close)
      }

      if (close < open) {
        steps.push(step(10, stack, `close=${close} < open=${open} — can add ')' → recurse with "${current})".`, {
          array: current.split(""),
          result: [...result],
        }))
        backtrack(current + ")", open, close + 1)
      }

      stack.pop()
    }

    backtrack("", 0, 0)
    steps.push(step(14, [], `All ${result.length} valid combinations found for n=${n}.`, { result: [...result] }))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 15. Letter Combinations of a Phone Number
// ════════════════════════════════════════════════════════════════
const letterCombinationsPhone: RecursionProblem = {
  id: 15,
  slug: "letter-combinations-of-a-phone-number",
  title: "Letter Combinations of a Phone Number",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber", "PayPal"],
  tags: ["Recursion", "Backtracking", "String", "Hash Map"],
  timeComplexity: "O(4ⁿ · n)",
  spaceComplexity: "O(n) recursion depth",
  description:
    "Given a string of digits from 2-9, return all possible letter combinations the digits could represent on a classic telephone keypad (2=\"abc\", 3=\"def\", ..., 9=\"wxyz\"). Backtrack one digit at a time, trying every letter mapped to the current digit.",
  examples: [
    { input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]", explanation: "2→\"abc\" (3 letters) × 3→\"def\" (3 letters) = 9 combinations." },
    { input: "digits = \"\"", output: "[]" },
  ],
  constraints: ["0 ≤ digits.length ≤ 4", "digits[i] is a digit from '2' to '9'"],
  hints: [
    "Map each digit to its letters up front (a small lookup object/array indexed 2-9).",
    "The base case is reaching the end of the digit string — the current combination is exactly one letter per digit, which is a complete answer.",
    "At each digit, loop over its mapped letters and recurse once per letter, appending that letter to the current combination.",
  ],
  pitfalls: [
    "Returning an empty array is correct for empty input — but forgetting that special case and instead running backtrack on an empty string can incorrectly push a single empty-string result.",
    "Off-by-one in the keypad mapping (e.g. mixing up which letters belong to 7 and 9, the two keys with 4 letters instead of 3).",
    "Not resetting/removing the appended letter conceptually between sibling loop iterations — since this solution builds the string by concatenation (not push/pop), each recursive call already gets its own independent string, so this is only a risk if you switch to a mutable shared buffer instead.",
  ],
  approaches: [
    {
      name: "Backtracking over digits",
      complexity: "O(4ⁿ · n)",
      space: "O(n)",
      description: "For each digit position, try every letter that digit maps to, recursing to the next digit position until all digits are consumed.",
    },
  ],
  code: `const KEYPAD = {
  "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
  "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
};

function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const result = [];

  function backtrack(index, current) {
    if (index === digits.length) {
      result.push(current);
      return;
    }
    const letters = KEYPAD[digits[index]];
    for (const letter of letters) {
      backtrack(index + 1, current + letter);
    }
  }

  backtrack(0, "");
  return result;
}`,
  generateSteps() {
    const KEYPAD: Record<string, string> = {
      "2": "abc",
      "3": "def",
      "4": "ghi",
      "5": "jkl",
      "6": "mno",
      "7": "pqrs",
      "8": "tuv",
      "9": "wxyz",
    }
    const digits = "23"
    const steps = []
    const stack: ReturnType<typeof frame>[] = []
    const result: string[] = []

    function backtrack(index: number, current: string) {
      const f = frame(`backtrack(index=${index})`, [
        ["index", index],
        ["current", `"${current}"`],
      ])
      stack.push(f)
      steps.push(step(10, stack, `Call backtrack(index=${index}, current="${current}").`, {
        array: digits.split(""),
        highlighted: index < digits.length ? [index] : [],
        result: [...result],
      }))

      if (index === digits.length) {
        result.push(current)
        steps.push(step(12, stack, `index=${index} reached end of digits — record combination "${current}".`, {
          array: digits.split(""),
          result: [...result],
        }))
        stack.pop()
        return
      }

      const letters = KEYPAD[digits[index]]
      steps.push(step(15, stack, `Digit '${digits[index]}' maps to letters "${letters}".`, {
        array: digits.split(""),
        highlighted: [index],
        result: [...result],
      }))

      for (const letter of letters) {
        steps.push(step(17, stack, `Try letter '${letter}' → recurse with current="${current + letter}".`, {
          array: digits.split(""),
          highlighted: [index],
          result: [...result],
        }))
        backtrack(index + 1, current + letter)
      }

      stack.pop()
    }

    if (digits.length === 0) {
      steps.push(step(7, [], `digits is empty — return [] immediately.`, { result: [] }))
    } else {
      backtrack(0, "")
      steps.push(step(22, [], `All ${result.length} letter combinations found for digits="${digits}".`, { array: digits.split(""), result: [...result] }))
    }
    return steps
  },
}

export const RECURSION_INTERMEDIATE_PROBLEMS: RecursionProblem[] = [
  isArraySorted,
  powerOfNumber,
  subsequencesOfString,
  permutationsOfArray,
  generateParentheses,
  letterCombinationsPhone,
]
