import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Razorpay keys are missing in environment variables." },
        { status: 500 }
      );
    }

    const { topicSlug } = await req.json();

    if (!topicSlug) {
      return NextResponse.json(
        { error: "topicSlug is required." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const shortUserId = userId.slice(-8);
    const shortTopicSlug = topicSlug.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 12);
    const shortTime = Date.now().toString().slice(-8);

    const receipt = `rcpt_${shortUserId}_${shortTopicSlug}_${shortTime}`;

    const order = await razorpay.orders.create({
      amount: 1900, // ₹19 in paise
      currency: "INR",
      receipt,
      notes: {
        userId,
        topicSlug,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Create order error:", error);

    const razorpayMessage =
      error?.error?.description ||
      error?.message ||
      "Failed to create order.";

    return NextResponse.json(
      { error: razorpayMessage },
      { status: 500 }
    );
  }
}