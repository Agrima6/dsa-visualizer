// components/visualizer/stack/stack-problems-data.ts
// Place at: components/visualizer/stack/stack-problems-data.ts

export type Difficulty = "Easy" | "Medium" | "Hard"
export type Company =
  | "Google"
  | "Amazon"
  | "Apple"
  | "Meta"
  | "Microsoft"
  | "Netflix"
  | "Adobe"
  | "Uber"
  | "LinkedIn"
  | "Twitter"
  | "ServiceNow"
  | "Salesforce"
  | "Oracle"
  | "SAP"
  | "Intuit"
  | "PayPal"
  | "Stripe"
  | "Atlassian"
  | "Airbnb"
  | "Dropbox"
  | "Pinterest"
  | "Snap"
  | "Spotify"
  | "Walmart"
  | "Cisco"
  | "VMware"
  | "Nvidia"
  | "GoldmanSachs"
  | "MorganStanley"
  | "Bloomberg"
  | "Zomato"
  | "Swiggy"
  | "Flipkart"
  | "Meesho"
  | "PhonePe"
export interface Approach {
  name: string
  complexity: string
  space: string
  description: string
}

// Each frame of the stack visualization
export interface StackVisStep {
  // stack state: top of stack is last element
  stack: { value: string | number; label?: string }[]
  // indices into `stack` that are highlighted (comparing / active)
  highlighted: number[]
  // indices that just got popped (flash red before removal)
  popped: number[]
  // extra output values to show beside the stack (e.g. result queue)
  auxiliary: { label: string; value: string | number }[]
  message: string
  codeLine: number
}

export interface StackProblem {
  id: number
  slug: string
  title: string
  difficulty: Difficulty
  companies: Company[]
  tags: string[]
  timeComplexity: string
  spaceComplexity: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  hints: string[]
  pitfalls: string[]
  approaches: Approach[]
  code: string
  generateSteps: () => StackVisStep[]
}

// ─── helpers ────────────────────────────────────────────────────
function frame(
  stack: { value: string | number; label?: string }[],
  highlighted: number[],
  message: string,
  codeLine: number,
  auxiliary: { label: string; value: string | number }[] = [],
  popped: number[] = []
): StackVisStep {
  return { stack: stack.map(s => ({ ...s })), highlighted, popped, auxiliary, message, codeLine }
}

// ════════════════════════════════════════════════════════════════
// 1. Valid Parentheses  (#46)
// ════════════════════════════════════════════════════════════════
const validParentheses: StackProblem = {
  id: 46,
  slug: "valid-parentheses",
  title: "Valid Parentheses",
  difficulty: "Easy",
  companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
  tags: ["Stack", "String"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type of brackets, open brackets are closed in the correct order, and every close bracket has a corresponding open bracket.",
  examples: [
    { input: 's = "()"', output: "true" },
    { input: 's = "()[]{}"', output: "true" },
    { input: 's = "(]"', output: "false" },
    { input: 's = "([)]"', output: "false", explanation: "Brackets closed out of order." },
  ],
  constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
  hints: [
    "When you see an opening bracket, push it onto the stack.",
    "When you see a closing bracket, the top of the stack must be the matching opener.",
    "At the end, the stack must be empty — any leftover opener means invalid.",
  ],
  pitfalls: [
    "Forgetting to check if the stack is empty before popping (when you see a closer with an empty stack → false).",
    "Returning true after the loop without checking stack.length === 0.",
    'Trying to solve with a counter — works for "()" only, fails for "([)]".',
  ],
  approaches: [
    {
      name: "Stack",
      complexity: "O(n)",
      space: "O(n)",
      description:
        "Push opening brackets. On closing bracket, pop and verify match. Return stack.length === 0.",
    },
  ],
  code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const ch of s) {
    if (!map[ch]) {
      stack.push(ch);       // opening bracket
    } else {
      if (stack.pop() !== map[ch]) {
        return false;       // mismatch
      }
    }
  }

  return stack.length === 0;
}`,
  generateSteps() {
    const input = "({[]})"
    const steps: StackVisStep[] = []
    const stack: { value: string }[] = []
    const map: Record<string, string> = { ")": "(", "}": "{", "]": "[" }

    steps.push(frame([], [], `Input: "${input}". Stack starts empty.`, 1))

    for (const ch of input) {
      if (!map[ch]) {
        stack.push({ value: ch })
        steps.push(frame([...stack], [stack.length - 1], `'${ch}' is an opener → push onto stack`, 6))
      } else {
        const top = stack[stack.length - 1]?.value
        steps.push(frame([...stack], [stack.length - 1], `'${ch}' is closer. Top of stack = '${top ?? "empty"}'`, 8))
        if (top === map[ch]) {
          steps.push(frame([...stack], [], `'${top}' matches '${ch}' ✓ → pop`, 8, [], [stack.length - 1]))
          stack.pop()
          steps.push(frame([...stack], [], `Popped '${top}'. Stack: [${stack.map(s => s.value).join(",")}]`, 8))
        } else {
          steps.push(frame([...stack], [stack.length - 1], `MISMATCH! '${top}' ≠ '${map[ch]}' → return false`, 9))
          return steps
        }
      }
    }

    steps.push(frame([], [], `Loop done. Stack empty → return true ✓`, 13))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 2. Min Stack  (#49)
// ════════════════════════════════════════════════════════════════
const minStack: StackProblem = {
  id: 49,
  slug: "min-stack",
  title: "Min Stack",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Microsoft", "Meta", "LinkedIn"],
  tags: ["Stack", "Design"],
  timeComplexity: "O(1) all ops",
  spaceComplexity: "O(n)",
  description:
    "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with push(val), pop(), top(), and getMin() — all in O(1).",
  examples: [
    {
      input: `MinStack()
push(-2), push(0), push(-3)
getMin() → -3
pop()
top()  → 0
getMin() → -2`,
      output: "[-3, 0, -2]",
    },
  ],
  constraints: ["-2³¹ ≤ val ≤ 2³¹ - 1", "pop/top/getMin will always be called on non-empty stack", "At most 3×10⁴ calls"],
  hints: [
    "Use two stacks: one for values, one for tracking the current minimum at each level.",
    "When you push a value, also push min(value, current_min) to the min stack.",
    "When you pop, pop from both stacks simultaneously.",
  ],
  pitfalls: [
    "Using a single variable for min — it breaks when you pop the current minimum.",
    "Not pushing to the min stack on every push (only pushing when value < currentMin).",
    "Forgetting to pop from the min stack when popping from the main stack.",
  ],
  approaches: [
    {
      name: "Two Stacks",
      complexity: "O(1)",
      space: "O(n)",
      description: "Main stack holds values. Min stack holds current minimum at each depth. Always in sync.",
    },
    {
      name: "One Stack (encode delta)",
      complexity: "O(1)",
      space: "O(n)",
      description: "Store (value - prevMin) on the main stack; when popped value < 0, it means min changed.",
    },
  ],
  code: `class MinStack {
  constructor() {
    this.stack    = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    const curMin = this.minStack.length
      ? Math.min(val, this.minStack.at(-1))
      : val;
    this.minStack.push(curMin);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack.at(-1);
  }

  getMin() {
    return this.minStack.at(-1);
  }
}`,
  generateSteps() {
    const steps: StackVisStep[] = []
    const main: number[] = []
    const mins: number[] = []

    const snap = (hl: number[], msg: string, line: number) => {
      const stackFrames = main.map((v, i) => ({
        value: v,
        label: i === main.length - 1 ? `min:${mins[i]}` : undefined,
      }))
      steps.push(frame(
        stackFrames, hl, msg, line,
        [{ label: "minStack top", value: mins.length ? mins[mins.length - 1] : "—" }]
      ))
    }

    steps.push(frame([], [], "MinStack created. main=[] minStack=[]", 2))

    const pushOp = (val: number) => {
      main.push(val)
      const curMin = mins.length ? Math.min(val, mins[mins.length - 1]) : val
      mins.push(curMin)
      snap([main.length - 1], `push(${val}) → main top=${val}, minStack top=${curMin}`, 7)
    }

    const popOp = () => {
      const v = main.pop()
      mins.pop()
      snap([], `pop() → removed ${v}. New minStack top=${mins.length ? mins[mins.length - 1] : "—"}`, 15)
    }

    pushOp(-2)
    pushOp(0)
    pushOp(-3)

    // getMin
    snap([main.length - 1], `getMin() → ${mins[mins.length - 1]} ✓`, 23)
    popOp()
    // top
    snap([main.length - 1], `top() → ${main[main.length - 1]}`, 19)
    // getMin again
    snap([main.length - 1], `getMin() → ${mins[mins.length - 1]} ✓`, 23)

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 3. Evaluate Reverse Polish Notation  (#50)
// ════════════════════════════════════════════════════════════════
const evalRPN: StackProblem = {
  id: 50,
  slug: "evaluate-reverse-polish-notation",
  title: "Evaluate Reverse Polish Notation",
  difficulty: "Medium",
  companies: ["Amazon", "LinkedIn", "Microsoft", "Google"],
  tags: ["Stack", "Math", "Array"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    'You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression and return an integer representing the value. Valid operators are +, -, *, and /. Division truncates toward zero.',
  examples: [
    { input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "((2+1)*3)=9" },
    { input: 'tokens = ["4","13","5","/","+"]', output: "6", explanation: "(4+(13/5))=6" },
  ],
  constraints: ["1 ≤ tokens.length ≤ 10⁴", "tokens[i] is an operator or integer in [-200, 200]"],
  hints: [
    "Push numbers onto the stack. When you see an operator, pop two numbers, compute, push result.",
    "Be careful about operand order: the first pop is the RIGHT operand, second pop is LEFT.",
    "Division must truncate toward zero — use Math.trunc() not Math.floor().",
  ],
  pitfalls: [
    "Swapping operand order: for '-' and '/', b-a ≠ a-b. First pop = right, second pop = left.",
    "Using parseInt which is slow; Number() or +token is cleaner.",
    "Using Math.floor for division — fails for negative numbers (-7/2 should be -3, not -4).",
  ],
  approaches: [
    {
      name: "Stack",
      complexity: "O(n)",
      space: "O(n)",
      description: "Iterate tokens. Push numbers. On operator: pop b then a, compute a op b, push result.",
    },
  ],
  code: `function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if ("+-*/".includes(token)) {
      const b = stack.pop();  // right operand
      const a = stack.pop();  // left operand

      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}`,
  generateSteps() {
    const tokens = ["2", "1", "+", "3", "*"]
    const steps: StackVisStep[] = []
    const stack: number[] = []

    steps.push(frame([], [], `tokens = [${tokens.map(t => `"${t}"`).join(",")}]`, 1))

    for (const token of tokens) {
      if ("+-*/".includes(token)) {
        const b = stack.pop()!
        const a = stack.pop()!
        steps.push(frame(stack.map(v => ({ value: v })), [], `Operator "${token}": pop b=${b}, pop a=${a}`, 6))
        let result: number
        if (token === "+") result = a + b
        else if (token === "-") result = a - b
        else if (token === "*") result = a * b
        else result = Math.trunc(a / b)
        stack.push(result)
        steps.push(frame(stack.map(v => ({ value: v })), [stack.length - 1], `${a} ${token} ${b} = ${result} → push ${result}`, 8))
      } else {
        stack.push(Number(token))
        steps.push(frame(stack.map(v => ({ value: v })), [stack.length - 1], `Number "${token}" → push ${token}`, 13))
      }
    }

    steps.push(frame(stack.map(v => ({ value: v })), [0], `Result = stack[0] = ${stack[0]} ✓`, 16))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 4. Daily Temperatures  (#52)
// ════════════════════════════════════════════════════════════════
const dailyTemperatures: StackProblem = {
  id: 52,
  slug: "daily-temperatures",
  title: "Daily Temperatures",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Meta", "Microsoft", "Uber"],
  tags: ["Stack", "Monotonic Stack", "Array"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future day with a warmer temperature, keep answer[i] = 0.",
  examples: [
    { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
    { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
    { input: "temperatures = [30,60,90]", output: "[1,1,0]" },
  ],
  constraints: ["1 ≤ temperatures.length ≤ 10⁵", "30 ≤ temperatures[i] ≤ 100"],
  hints: [
    "Use a monotonic decreasing stack that stores indices.",
    "When the current temp is warmer than the temp at the index on top of the stack, pop and compute the difference.",
    "The stack only ever holds indices of temperatures waiting for a warmer day.",
  ],
  pitfalls: [
    "Storing temperatures instead of indices — you need indices to compute the day gap.",
    "Not initializing answer array with zeros (elements with no warmer day should stay 0).",
    "Using a max approach instead of monotonic stack — O(n²) brute force is too slow.",
  ],
  approaches: [
    {
      name: "Monotonic Decreasing Stack",
      complexity: "O(n)",
      space: "O(n)",
      description: "Stack stores indices. For each day: while stack top is cooler, pop and record gap. Push current index.",
    },
    {
      name: "Brute Force",
      complexity: "O(n²)",
      space: "O(1)",
      description: "For each day, scan forward to find next warmer day. Too slow for n=10⁵.",
    },
  ],
  code: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < n; i++) {
    while (stack.length &&
           temperatures[i] > temperatures[stack.at(-1)]) {
      const idx = stack.pop();
      answer[idx] = i - idx;  // days waited
    }
    stack.push(i);
  }

  return answer;
}`,
  generateSteps() {
    const temps = [73, 74, 75, 71, 69, 72, 76, 73]
    const n = temps.length
    const answer = new Array(n).fill(0)
    const stack: number[] = []
    const steps: StackVisStep[] = []

    steps.push(frame([], [], `temps=[${temps.join(",")}]. answer=[${answer.join(",")}]`, 1))

    for (let i = 0; i < n; i++) {
      steps.push(frame(
        stack.map(idx => ({ value: `i=${idx}(${temps[idx]})` })),
        [stack.length - 1],
        `Day ${i}: temp=${temps[i]}. Check if warmer than stack top.`,
        6
      ))

      while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
        const idx = stack.pop()!
        answer[idx] = i - idx
        steps.push(frame(
          stack.map(ix => ({ value: `i=${ix}(${temps[ix]})` })),
          [],
          `${temps[i]} > ${temps[idx]} → answer[${idx}]=${answer[idx]} days ✓`,
          8,
          [{ label: `answer[${idx}]`, value: answer[idx] }],
          [0]
        ))
      }

      stack.push(i)
      steps.push(frame(
        stack.map(idx => ({ value: `i=${idx}(${temps[idx]})` })),
        [stack.length - 1],
        `Push index ${i} (temp=${temps[i]}) onto stack`,
        11
      ))
    }

    steps.push(frame(
      [],
      [],
      `Done! answer=[${answer.join(",")}] ✓`,
      14,
      answer.map((v, i) => ({ label: `[${i}]`, value: v }))
    ))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 5. Car Fleet  (#54)
// ════════════════════════════════════════════════════════════════
const carFleet: StackProblem = {
  id: 54,
  slug: "car-fleet",
  title: "Car Fleet",
  difficulty: "Medium",
  companies: ["Google", "Amazon"],
  tags: ["Stack", "Sorting", "Monotonic Stack"],
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  description:
    "There are n cars at given miles away from the starting point. Each car drives at a given speed. All cars are going to the same target point. A car can never pass another car, but it can catch up and form a fleet. Return the number of car fleets that will arrive at the destination.",
  examples: [
    { input: "target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]", output: "3", explanation: "Cars at 10 and 8 form a fleet. Car at 5 arrives alone. Cars at 3 and 0 would catch up to the fleet at 5, forming another fleet. Wait — actually 0 forms its own fleet arriving after 5." },
    { input: "target=10, position=[3], speed=[3]", output: "1" },
  ],
  constraints: ["n == position.length == speed.length", "1 ≤ n ≤ 10⁵", "0 < target ≤ 10⁶"],
  hints: [
    "Sort cars by position descending (closest to target first).",
    "Compute time to reach target for each car: (target - pos) / speed.",
    "Use a stack. If the next car takes longer (slower) than the top of stack, it forms a new fleet.",
    "If it's faster, it catches up to the car ahead → same fleet, don't add to stack.",
  ],
  pitfalls: [
    "Not sorting by position first.",
    "Sorting ascending instead of descending (process closest to target first).",
    "Comparing times incorrectly — a car forms a new fleet only if its time > the top of stack (it's slower).",
  ],
  approaches: [
    {
      name: "Sort + Monotonic Stack",
      complexity: "O(n log n)",
      space: "O(n)",
      description: "Sort by position desc. Compute arrival times. Stack tracks distinct fleets: push time if > top.",
    },
  ],
  code: `function carFleet(target, position, speed) {
  const n = position.length;
  const cars = position.map((p, i) => [p, speed[i]])
                       .sort((a, b) => b[0] - a[0]);

  const stack = [];

  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (!stack.length || time > stack.at(-1)) {
      stack.push(time);  // new fleet
    }
    // else: caught up to fleet ahead — same fleet
  }

  return stack.length;
}`,
  generateSteps() {
    const target = 12
    const cars = [[10, 2], [8, 4], [5, 1], [3, 3], [0, 1]].sort((a, b) => b[0] - a[0])
    const steps: StackVisStep[] = []
    const stack: number[] = []

    steps.push(frame([], [], `Sort by position desc: ${cars.map(c => `[${c[0]},spd=${c[1]}]`).join(" ")}`, 3))

    for (const [pos, spd] of cars) {
      const time = +(((target - pos) / spd).toFixed(2))
      steps.push(frame(
        stack.map(t => ({ value: t.toFixed(2), label: "fleet" })),
        [stack.length - 1],
        `Car pos=${pos},spd=${spd} → time=(${target}-${pos})/${spd}=${time}s`,
        8
      ))

      if (!stack.length || time > stack[stack.length - 1]) {
        stack.push(time)
        steps.push(frame(
          stack.map(t => ({ value: t.toFixed(2), label: "fleet" })),
          [stack.length - 1],
          `time=${time} > top=${stack[stack.length - 2]?.toFixed(2) ?? "none"} → NEW fleet`,
          10
        ))
      } else {
        steps.push(frame(
          stack.map(t => ({ value: t.toFixed(2), label: "fleet" })),
          [],
          `time=${time} ≤ top=${stack[stack.length - 1].toFixed(2)} → catches up, same fleet`,
          11
        ))
      }
    }

    steps.push(frame(
      stack.map(t => ({ value: t.toFixed(2), label: "fleet" })),
      [],
      `${stack.length} fleets total ✓`,
      14
    ))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 6. Largest Rectangle In Histogram  (#58)
// ════════════════════════════════════════════════════════════════
const largestRectangle: StackProblem = {
  id: 58,
  slug: "largest-rectangle-in-histogram",
  title: "Largest Rectangle in Histogram",
  difficulty: "Hard",
  companies: ["Google", "Amazon", "Microsoft", "Meta", "Apple"],
  tags: ["Stack", "Monotonic Stack", "Array"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "Given an array of integers heights representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
  examples: [
    { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "The rectangle spans bars 2 and 3 (heights 5 and 6), area = 5×2 = 10." },
    { input: "heights = [2,4]", output: "4" },
  ],
  constraints: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"],
  hints: [
    "Use a monotonic increasing stack that stores [index, height] pairs.",
    "When the current bar is shorter than the stack top, pop and calculate area using that bar's height times current width.",
    "The start index for the popped bar stretches back to its original insertion index.",
    "After the loop, pop remaining bars using the total array length as the right boundary.",
  ],
  pitfalls: [
    "Not tracking the leftmost valid start index when a bar is popped.",
    "Forgetting to process remaining elements in the stack after the loop ends.",
    "Off-by-one errors in width calculation: width = current_index - start_index.",
  ],
  approaches: [
    {
      name: "Monotonic Increasing Stack",
      complexity: "O(n)",
      space: "O(n)",
      description: "Push [index, height] pairs. When current bar is shorter, pop and compute max area. Track extended start position.",
    },
    {
      name: "Divide & Conquer",
      complexity: "O(n log n) avg",
      space: "O(n)",
      description: "Find min bar, compute rectangle spanning full range, recurse on left and right of min.",
    },
  ],
  code: `function largestRectangleArea(heights) {
  const stack = []; // [startIdx, height]
  let maxArea = 0;

  for (let i = 0; i < heights.length; i++) {
    let start = i;

    while (stack.length && stack.at(-1)[1] > heights[i]) {
      const [idx, h] = stack.pop();
      maxArea = Math.max(maxArea, h * (i - idx));
      start = idx;
    }

    stack.push([start, heights[i]]);
  }

  for (const [idx, h] of stack) {
    maxArea = Math.max(maxArea, h * (heights.length - idx));
  }

  return maxArea;
}`,
  generateSteps() {
    const heights = [2, 1, 5, 6, 2, 3]
    const stack: [number, number][] = []
    let maxArea = 0
    const steps: StackVisStep[] = []

    steps.push(frame([], [], `heights=[${heights.join(",")}]. Find largest rectangle.`, 1))

    for (let i = 0; i < heights.length; i++) {
      let start = i
      steps.push(frame(
        stack.map(([idx, h]) => ({ value: `[${idx},h=${h}]` })),
        [stack.length - 1],
        `i=${i}, heights[${i}]=${heights[i]}. Check stack top.`,
        5
      ))

      while (stack.length && stack[stack.length - 1][1] > heights[i]) {
        const [idx, h] = stack.pop()!
        const area = h * (i - idx)
        if (area > maxArea) maxArea = area
        start = idx
        steps.push(frame(
          stack.map(([ix, ht]) => ({ value: `[${ix},h=${ht}]` })),
          [],
          `Pop [${idx},h=${h}]: area=${h}×(${i}-${idx})=${area}. maxArea=${maxArea}`,
          8,
          [{ label: "maxArea", value: maxArea }],
          [0]
        ))
      }

      stack.push([start, heights[i]])
      steps.push(frame(
        stack.map(([ix, ht]) => ({ value: `[${ix},h=${ht}]` })),
        [stack.length - 1],
        `Push [start=${start}, h=${heights[i]}]`,
        11
      ))
    }

    // flush
    for (const [idx, h] of stack) {
      const area = h * (heights.length - idx)
      if (area > maxArea) maxArea = area
    }
    steps.push(frame(
      [],
      [],
      `Flush remaining. maxArea = ${maxArea} ✓`,
      15,
      [{ label: "maxArea", value: maxArea }]
    ))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 7. Implement Queue using Stacks  (#48)
// ════════════════════════════════════════════════════════════════
const queueUsingStacks: StackProblem = {
  id: 48,
  slug: "implement-queue-using-stacks",
  title: "Implement Queue using Stacks",
  difficulty: "Easy",
  companies: ["Amazon", "Google", "Meta", "Microsoft"],
  tags: ["Stack", "Queue", "Design"],
  timeComplexity: "O(1) amortized",
  spaceComplexity: "O(n)",
  description:
    "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, pop, peek, empty). Each element is moved between stacks at most once — giving amortized O(1) per operation.",
  examples: [
    {
      input: `MyQueue()
push(1), push(2)
peek() → 1
pop()  → 1
empty() → false`,
      output: "[1, 1, false]",
    },
  ],
  constraints: ["1 ≤ x ≤ 9", "At most 100 calls", "pop/peek only called on non-empty queue"],
  hints: [
    "Use two stacks: inbox and outbox.",
    "Push always goes to inbox.",
    "Pop/Peek: if outbox is empty, pour all of inbox into outbox (this reverses order = FIFO).",
    "Pouring happens at most once per element → amortized O(1).",
  ],
  pitfalls: [
    "Moving elements every single push/pop — that's O(n) per operation.",
    "Not checking if outbox is empty before popping — always check and refill from inbox if needed.",
    "Confusing which stack is inbox vs outbox.",
  ],
  approaches: [
    {
      name: "Two Stacks (lazy transfer)",
      complexity: "O(1) amortized",
      space: "O(n)",
      description: "Inbox for pushes. On pop/peek, transfer all to outbox only when outbox is empty.",
    },
  ],
  code: `class MyQueue {
  constructor() {
    this.inbox  = [];
    this.outbox = [];
  }

  push(x) {
    this.inbox.push(x);
  }

  pop() {
    this._transfer();
    return this.outbox.pop();
  }

  peek() {
    this._transfer();
    return this.outbox.at(-1);
  }

  empty() {
    return !this.inbox.length && !this.outbox.length;
  }

  _transfer() {
    if (!this.outbox.length) {
      while (this.inbox.length) {
        this.outbox.push(this.inbox.pop());
      }
    }
  }
}`,
  generateSteps() {
    const steps: StackVisStep[] = []
    let inbox: number[] = []
    let outbox: number[] = []

    const snap = (hl: number[], msg: string, line: number) => {
      const stackFrames = [
        ...inbox.map((v, i) => ({ value: v, label: i === 0 ? "inbox[0]" : undefined })),
      ]
      steps.push(frame(
        stackFrames, hl, msg, line,
        [
          { label: "inbox",  value: `[${inbox.join(",")}]` },
          { label: "outbox", value: `[${outbox.join(",")}]` },
        ]
      ))
    }

    snap([], "MyQueue created. inbox=[] outbox=[]", 2)

    inbox.push(1); snap([inbox.length - 1], "push(1) → inbox=[1]", 7)
    inbox.push(2); snap([inbox.length - 1], "push(2) → inbox=[1,2]", 7)

    // peek → transfer
    snap([], "peek(): outbox is empty → transfer inbox→outbox", 20)
    while (inbox.length) outbox.push(inbox.pop()!)
    inbox = []; 
    steps.push(frame(
      outbox.map(v => ({ value: v })),
      [outbox.length - 1],
      `After transfer: outbox=[${outbox.join(",")}]. peek()=${outbox[outbox.length - 1]} ✓`,
      21,
      [{ label: "inbox", value: "[]" }, { label: "outbox", value: `[${outbox.join(",")}]` }]
    ))

    // pop
    const popped = outbox.pop()!
    steps.push(frame(
      outbox.map(v => ({ value: v })),
      [],
      `pop() → ${popped}. outbox=[${outbox.join(",")}] ✓`,
      12,
      [{ label: "inbox", value: "[]" }, { label: "outbox", value: `[${outbox.join(",")}]` }],
      [0]
    ))

    steps.push(frame(
      outbox.map(v => ({ value: v })),
      [],
      `empty()=${inbox.length === 0 && outbox.length === 0} ✓`,
      16,
      [{ label: "inbox", value: "[]" }, { label: "outbox", value: `[${outbox.join(",")}]` }]
    ))

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 8. Asteroid Collision  (#51)
// ════════════════════════════════════════════════════════════════
const asteroidCollision: StackProblem = {
  id: 51,
  slug: "asteroid-collision",
  title: "Asteroid Collision",
  difficulty: "Medium",
  companies: ["Amazon", "Google", "Microsoft"],
  tags: ["Stack", "Array", "Simulation"],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  description:
    "We are given an array of integers asteroids representing asteroids in a row. The absolute value is the size, and the sign represents direction (positive = right, negative = left). Moving asteroids at the same speed. When two asteroids meet, the smaller one explodes. If equal, both explode. Asteroids moving in the same direction never meet. Return the state after all collisions.",
  examples: [
    { input: "asteroids = [5,10,-5]", output: "[5,10]", explanation: "10 and -5 collide → 10 survives." },
    { input: "asteroids = [8,-8]", output: "[]", explanation: "Equal → both explode." },
    { input: "asteroids = [10,2,-5]", output: "[10]", explanation: "2 and -5: -5 wins. Then 10 and -5: 10 wins." },
  ],
  constraints: ["2 ≤ asteroids.length ≤ 10⁴", "-1000 ≤ asteroids[i] ≤ 1000", "asteroids[i] ≠ 0"],
  hints: [
    "Use a stack. Push each asteroid.",
    "A collision only happens when top of stack is positive AND current asteroid is negative.",
    "Keep popping (the right-moving asteroid explodes) while the collision condition holds.",
    "If equal size, pop the stack top and don't push the current one.",
  ],
  pitfalls: [
    "Thinking two negatives or two positives can collide — they can't (same direction).",
    "Not handling the equal-size case separately.",
    "Infinite-looping by forgetting to break out of the while loop after equal collision.",
  ],
  approaches: [
    {
      name: "Stack",
      complexity: "O(n)",
      space: "O(n)",
      description: "Push each asteroid. Resolve collisions: pop right-movers when current is left-mover and bigger.",
    },
  ],
  code: `function asteroidCollision(asteroids) {
  const stack = [];

  for (const ast of asteroids) {
    let destroyed = false;

    while (stack.length && ast < 0 && stack.at(-1) > 0) {
      const top = stack.at(-1);

      if (Math.abs(ast) > top) {
        stack.pop();          // right-mover explodes
      } else if (Math.abs(ast) === top) {
        stack.pop();          // both explode
        destroyed = true;
        break;
      } else {
        destroyed = true;     // current explodes
        break;
      }
    }

    if (!destroyed) stack.push(ast);
  }

  return stack;
}`,
  generateSteps() {
    const asteroids = [10, 2, -5, -8]
    const stack: number[] = []
    const steps: StackVisStep[] = []

    steps.push(frame([], [], `asteroids=[${asteroids.join(",")}]`, 1))

    for (const ast of asteroids) {
      let destroyed = false
      steps.push(frame(
        stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
        [stack.length - 1],
        `Processing asteroid ${ast} (${ast > 0 ? "→ right" : "← left"})`,
        4
      ))

      while (stack.length && ast < 0 && stack[stack.length - 1] > 0) {
        const top = stack[stack.length - 1]
        steps.push(frame(
          stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
          [stack.length - 1],
          `Collision! ${top}→ vs ←${Math.abs(ast)}`,
          7
        ))

        if (Math.abs(ast) > top) {
          stack.pop()
          steps.push(frame(
            stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
            [],
            `|${ast}| > ${top} → ${top} explodes! Continue checking.`,
            9, [], [0]
          ))
        } else if (Math.abs(ast) === top) {
          stack.pop()
          destroyed = true
          steps.push(frame(
            stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
            [],
            `Equal size → both explode!`,
            11, [], [0]
          ))
          break
        } else {
          destroyed = true
          steps.push(frame(
            stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
            [],
            `|${ast}| < ${top} → ${ast} explodes!`,
            14
          ))
          break
        }
      }

      if (!destroyed) {
        stack.push(ast)
        steps.push(frame(
          stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
          [stack.length - 1],
          `No collision (or survived) → push ${ast}`,
          18
        ))
      }
    }

    steps.push(frame(
      stack.map(v => ({ value: v, label: v > 0 ? "→" : "←" })),
      [],
      `Final state: [${stack.join(",")}] ✓`,
      21
    ))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 9. Decode String  (#56)
// ════════════════════════════════════════════════════════════════
const decodeString: StackProblem = {
  id: 56,
  slug: "decode-string",
  title: "Decode String",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "Microsoft", "Adobe"],
  tags: ["Stack", "String", "Recursion"],
  timeComplexity: "O(n · k)",
  spaceComplexity: "O(n)",
  description:
    'Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where the encoded_string inside the brackets is being repeated exactly k times. You may assume the input is always valid.',
  examples: [
    { input: 's = "3[a]2[bc]"', output: '"aaabcbc"' },
    { input: 's = "3[a2[c]]"', output: '"accaccacc"' },
    { input: 's = "2[abc]3[cd]ef"', output: '"abcabccdcdcdef"' },
  ],
  constraints: ["1 ≤ s.length ≤ 30", "s consists of digits, lowercase letters, '[', ']'", "k in [1, 300]"],
  hints: [
    "When you see '[': push current string and current number onto stacks, reset both.",
    "When you see ']': pop the previous string and multiplier; append currentString × multiplier to previous.",
    "Digits can be multi-digit (e.g., 10[a]) — accumulate them.",
  ],
  pitfalls: [
    "Not handling multi-digit numbers (k can be > 9).",
    "Confusing what to push: push (currentString, k) when you see '[', not when you see ']'.",
    "Forgetting to reset currentString and k after pushing.",
  ],
  approaches: [
    {
      name: "Stack",
      complexity: "O(n·k)",
      space: "O(n)",
      description: "Two stacks: one for repeat counts, one for strings built so far. Process character by character.",
    },
    {
      name: "Recursion",
      complexity: "O(n·k)",
      space: "O(n)",
      description: "Recursive decode function that processes until ']' is encountered, then returns.",
    },
  ],
  code: `function decodeString(s) {
  const countStack  = [];
  const stringStack = [];
  let current = "";
  let k = 0;

  for (const ch of s) {
    if (/\d/.test(ch)) {
      k = k * 10 + Number(ch);
    } else if (ch === '[') {
      countStack.push(k);
      stringStack.push(current);
      current = "";
      k = 0;
    } else if (ch === ']') {
      const repeat = countStack.pop();
      const prev   = stringStack.pop();
      current = prev + current.repeat(repeat);
    } else {
      current += ch;
    }
  }

  return current;
}`,
  generateSteps() {
    const s = "3[a2[c]]"
    const steps: StackVisStep[] = []
    const countStack: number[] = []
    const stringStack: string[] = []
    let current = ""
    let k = 0

    steps.push(frame([], [], `Input: "${s}"`, 1))

    for (const ch of s) {
      if (/\d/.test(ch)) {
        k = k * 10 + Number(ch)
        steps.push(frame(
          stringStack.map(s => ({ value: `"${s}"` })),
          [],
          `Digit '${ch}' → k=${k}`,
          7,
          [{ label: "current", value: `"${current}"` }, { label: "k", value: k }]
        ))
      } else if (ch === "[") {
        countStack.push(k)
        stringStack.push(current)
        steps.push(frame(
          stringStack.map(s => ({ value: `"${s}"` })),
          [stringStack.length - 1],
          `'[' → push k=${k} & current="${current}". Reset.`,
          9,
          [{ label: "countStack", value: `[${countStack.join(",")}]` }]
        ))
        current = ""
        k = 0
      } else if (ch === "]") {
        const repeat = countStack.pop()!
        const prev = stringStack.pop()!
        const expanded = current.repeat(repeat)
        current = prev + expanded
        steps.push(frame(
          stringStack.map(s => ({ value: `"${s}"` })),
          [],
          `']' → pop k=${repeat}, prev="${prev}". current="${prev}"+"${expanded}"="${current}"`,
          14,
          [{ label: "current", value: `"${current}"` }],
          [0]
        ))
      } else {
        current += ch
        steps.push(frame(
          stringStack.map(s => ({ value: `"${s}"` })),
          [],
          `Letter '${ch}' → current="${current}"`,
          17,
          [{ label: "current", value: `"${current}"` }]
        ))
      }
    }

    steps.push(frame([], [], `Result: "${current}" ✓`, 21, [{ label: "output", value: `"${current}"` }]))
    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// 10. Online Stock Span  (#53)
// ════════════════════════════════════════════════════════════════
const onlineStockSpan: StackProblem = {
  id: 53,
  slug: "online-stock-span",
  title: "Online Stock Span",
  difficulty: "Medium",
  companies: ["Google", "Amazon", "LinkedIn"],
  tags: ["Stack", "Monotonic Stack", "Design"],
  timeComplexity: "O(1) amortized",
  spaceComplexity: "O(n)",
  description:
    "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day. The span of a stock's price on a given day is defined as the maximum number of consecutive days (starting from that day and going backwards) for which the stock price was less than or equal to today's price.",
  examples: [
    {
      input: 'StockSpanner()\nnext(100),next(80),next(60),next(70),next(60),next(75),next(85)',
      output: "[1, 1, 1, 2, 1, 4, 6]",
    },
  ],
  constraints: ["1 ≤ price ≤ 10⁵", "At most 10⁴ calls to next"],
  hints: [
    "Use a monotonic decreasing stack storing [price, span] pairs.",
    "When current price ≥ stack top price, pop and accumulate its span.",
    "This collapses multiple days into one entry, giving amortized O(1).",
  ],
  pitfalls: [
    "Storing just prices (not spans) — you lose the accumulated span info when popping.",
    "Using a brute-force scan backwards — O(n) per query.",
    "Not starting span at 1 (today always counts).",
  ],
  approaches: [
    {
      name: "Monotonic Stack with spans",
      complexity: "O(1) amortized",
      space: "O(n)",
      description: "Stack of [price, span]. For each price, pop while top.price ≤ current and accumulate spans.",
    },
  ],
  code: `class StockSpanner {
  constructor() {
    this.stack = []; // [price, span]
  }

  next(price) {
    let span = 1;

    while (this.stack.length &&
           this.stack.at(-1)[0] <= price) {
      span += this.stack.pop()[1];
    }

    this.stack.push([price, span]);
    return span;
  }
}`,
  generateSteps() {
    const prices = [100, 80, 60, 70, 60, 75, 85]
    const steps: StackVisStep[] = []
    const stack: [number, number][] = []

    steps.push(frame([], [], "StockSpanner created. stack=[]", 2))

    for (const price of prices) {
      let span = 1
      steps.push(frame(
        stack.map(([p, s]) => ({ value: p, label: `span=${s}` })),
        [stack.length - 1],
        `next(${price}): span=1. Check stack top.`,
        6
      ))

      while (stack.length && stack[stack.length - 1][0] <= price) {
        const [p, s] = stack.pop()!
        span += s
        steps.push(frame(
          stack.map(([p, s]) => ({ value: p, label: `span=${s}` })),
          [],
          `Pop [price=${p},span=${s}]: ${p}≤${price} → span+=${s} → span=${span}`,
          9,
          [{ label: "span so far", value: span }],
          [0]
        ))
      }

      stack.push([price, span])
      steps.push(frame(
        stack.map(([p, s]) => ({ value: p, label: `span=${s}` })),
        [stack.length - 1],
        `Push [${price},${span}]. Return span=${span} ✓`,
        12,
        [{ label: "return", value: span }]
      ))
    }

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════
export const STACK_PROBLEMS: StackProblem[] = [
  validParentheses,
  queueUsingStacks,
  minStack,
  evalRPN,
  asteroidCollision,
  dailyTemperatures,
  onlineStockSpan,
  carFleet,
  decodeString,
  largestRectangle,
]