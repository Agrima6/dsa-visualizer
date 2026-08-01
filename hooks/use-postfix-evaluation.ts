import { useEffect, useState } from 'react'
import { Token } from '@/components/visualizer/stack-applications/types'
import { isOperator } from '@/lib/stack-operations'
import { playNarration, stopNarration } from '@/lib/narration'

interface EvaluationStep {
  stack: number[]
  currentToken?: Token
  currentPosition: number
  message: string
  timestamp: number
}

export function usePostfixEvaluation() {
  const [steps, setSteps] = useState<EvaluationStep[]>([])
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [speed, setSpeed] = useState(700)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  useEffect(() => { if (!voiceEnabled) stopNarration() }, [voiceEnabled])

  const addStep = (
    stack: number[], 
    currentToken: Token | undefined,
    position: number,
    message: string
  ) => {
    setSteps(prev => [...prev, {
      stack: [...stack],
      currentToken,
      currentPosition: position,
      message,
      timestamp: Date.now()
    }])
  }

  const evaluate = async (tokens: Token[]) => {
    setIsEvaluating(true)
    setSteps([])
    setResult(null)
    setError(null)
    
    const stack: number[] = []
    
    try { for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      await new Promise(resolve => setTimeout(resolve, speed))

      if (token.type === 'operand') {
        const num = Number(token.value)
        if (!Number.isFinite(num)) throw new Error(`“${token.value}” is a variable. Evaluation needs numbers, for example 3+4*2.`)
        stack.push(num)
        addStep(stack, token, i, `Push operand ${token.value} to stack`)
        if (voiceEnabled) await playNarration(`Push ${token.value} onto the stack.`)
      } 
      else if (token.type === 'operator' && isOperator(token.value)) {
        if (stack.length < 2) {
          throw new Error('Invalid postfix expression')
        }

        const b = stack.pop()!
        const a = stack.pop()!
        let result: number

        switch (token.value) {
          case '+': result = a + b; break
          case '-': result = a - b; break
          case '*': result = a * b; break
          case '/': result = a / b; break
          case '^': result = Math.pow(a, b); break
          default: throw new Error('Unknown operator')
        }

        addStep(
          [a, b], 
          token, 
          i, 
          `Pop ${b} and ${a}, compute ${a} ${token.value} ${b} = ${result}`
        )
        
        stack.push(result)
        addStep(stack, token, i, `Push result ${result} to stack`)
        if (voiceEnabled) await playNarration(`${a} ${token.value} ${b} equals ${result}.`)
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid postfix expression')
    }

    setResult(stack[0])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to evaluate this expression.')
    } finally { setIsEvaluating(false) }
  }

  return {
    steps,
    isEvaluating,
    result,
    error,
    speed,
    setSpeed,
    voiceEnabled,
    setVoiceEnabled,
    evaluate
  }
} 
