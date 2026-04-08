import { auth } from '@clerk/nextjs/server'
import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { topicSlug } = await req.json()

  const order = await razorpay.orders.create({
    amount: 900,           // ₹9 in paise
    currency: 'INR',
    receipt: `${userId}_${topicSlug}_${Date.now()}`,
    notes: { userId, topicSlug },
  })

  return NextResponse.json({ orderId: order.id, amount: order.amount })
}