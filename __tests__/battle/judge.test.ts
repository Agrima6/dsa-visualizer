// Locks in the exact behavior verified manually this session: every
// problem's reference solution passes, a wrong answer actually fails
// (the judge isn't a rubber stamp), and a timing-out submission is
// reported cleanly instead of hanging.
import { describe, expect, it } from "vitest"
import { judgeSubmission } from "@/lib/battle/judge"
import { BATTLE_PROBLEMS, getBattleProblem } from "@/lib/battle/problems"

const REFERENCE_SOLUTIONS: Record<string, string> = {
  "reverse-string": "function solve(s){ return s.split('').reverse().join(''); }",
  "find-maximum": "function solve(nums){ return Math.max(...nums); }",
  "valid-palindrome": "function solve(s){ return s === s.split('').reverse().join(''); }",
  "factorial": "function solve(n){ return n<=1?1:n*solve(n-1); }",
  "two-sum": "function solve(nums, target){ const seen=new Map(); for(let i=0;i<nums.length;i++){ const need=target-nums[i]; if(seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i);} return []; }",
  "valid-parentheses": "function solve(s){ const st=[]; const pairs={')':'(',']':'[','}':'{'}; for(const c of s){ if('([{'.includes(c)) st.push(c); else if(st.pop()!==pairs[c]) return false; } return st.length===0; }",
  "maximum-subarray": "function solve(nums){ let best=nums[0], cur=nums[0]; for(let i=1;i<nums.length;i++){ cur=Math.max(nums[i], cur+nums[i]); best=Math.max(best,cur);} return best; }",
  "merge-sorted-arrays": "function solve(a,b){ const out=[]; let i=0,j=0; while(i<a.length&&j<b.length) out.push(a[i]<=b[j]?a[i++]:b[j++]); while(i<a.length) out.push(a[i++]); while(j<b.length) out.push(b[j++]); return out; }",
  "longest-substring-no-repeat": "function solve(s){ let seen=new Map(), best=0, start=0; for(let i=0;i<s.length;i++){ const c=s[i]; if(seen.has(c)&&seen.get(c)>=start) start=seen.get(c)+1; seen.set(c,i); best=Math.max(best,i-start+1);} return best; }",
  "trapping-rain-water": "function solve(height){ let l=0,r=height.length-1,lm=0,rm=0,w=0; while(l<r){ if(height[l]<height[r]){ height[l]>=lm?lm=height[l]:w+=lm-height[l]; l++; } else { height[r]>=rm?rm=height[r]:w+=rm-height[r]; r--; } } return w; }",
  "kth-largest-element": "function solve(nums,k){ return [...nums].sort((a,b)=>b-a)[k-1]; }",
  "longest-common-subsequence": "function solve(a,b){ const m=a.length,n=b.length; const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0)); for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]); return dp[m][n]; }",
}

describe("battle judge", () => {
  it("every problem's reference solution passes all its own test cases", async () => {
    for (const problem of BATTLE_PROBLEMS) {
      const code = REFERENCE_SOLUTIONS[problem.slug]
      expect(code, `missing a reference solution for ${problem.slug}`).toBeTruthy()
      const result = await judgeSubmission(problem, code)
      expect(result.passed, `${problem.slug}: ${result.error}`).toBe(true)
      expect(result.testsPassed).toBe(result.testsTotal)
    }
  }, 30_000)

  it("rejects a wrong answer instead of rubber-stamping it", async () => {
    const problem = getBattleProblem("reverse-string")!
    const result = await judgeSubmission(problem, "function solve(s){ return 'nope'; }")
    expect(result.passed).toBe(false)
    expect(result.testsPassed).toBe(0)
  })

  it("reports a syntax error cleanly instead of throwing", async () => {
    const problem = getBattleProblem("factorial")!
    const result = await judgeSubmission(problem, "function solve(n) { return")
    expect(result.passed).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it("kills an infinite loop instead of hanging the judge", async () => {
    const problem = getBattleProblem("factorial")!
    const result = await judgeSubmission(problem, "function solve(n){ while(true){} }")
    expect(result.passed).toBe(false)
    expect(result.error).toMatch(/time|loop/i)
  }, 10_000)

  it("requires a function literally named solve", async () => {
    const problem = getBattleProblem("factorial")!
    const result = await judgeSubmission(problem, "function notSolve(n){ return n; }")
    expect(result.passed).toBe(false)
    expect(result.error).toMatch(/solve/i)
  })
})
