import { auth, clerkClient } from '@clerk/nextjs/server'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, topicSlug } = await req.json()

  // 1. Verify signature — CRITICAL security step
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 2. Save unlocked topic to Clerk user metadata
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const existing: string[] = (user.privateMetadata?.unlockedTopics as string[]) || []

  if (!existing.includes(topicSlug)) {
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        unlockedTopics: [...existing, topicSlug],
      },
    })
  }

  return NextResponse.json({ success: true })
}