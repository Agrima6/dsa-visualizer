import { auth, clerkClient } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Per-user, not per-IP — this is authenticated, and the thing worth
    // bounding is "how many real Razorpay orders can one account create,"
    // regardless of which network they're on.
    const { allowed } = await rateLimit(`payment-create-order:${userId}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many order attempts. Try again in a minute." }, { status: 429 });
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

    // Basic shape validation — a real catalog check happens implicitly at
    // verify time, since verify only ever unlocks whatever topic the paid
    // order's own notes record (see payment/verify/route.ts), so a bogus
    // slug here can't unlock anything real. This just keeps the field sane
    // (no oversized payloads, no characters that would break the receipt).
    const SLUG_RE = /^[a-zA-Z0-9_-]{1,64}$/;
    if (typeof topicSlug !== "string" || !SLUG_RE.test(topicSlug)) {
      return NextResponse.json(
        { error: "A valid topicSlug is required." },
        { status: 400 }
      );
    }

    // Nothing downstream ever checked this — a user could pay twice for a
    // topic they already have access to (forgot they'd bought it, double-
    // clicked, whatever) with zero warning, since verify/webhook both just
    // idempotently no-op the *unlock*, not the *charge*. Real money was
    // still taken for a second, functionally useless order.
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const unlockedTopics = (user.privateMetadata?.unlockedTopics as string[] | undefined) || [];
    if (unlockedTopics.includes(topicSlug)) {
      return NextResponse.json({ error: "You already have access to this topic." }, { status: 409 });
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
  } catch (error) {
    // Log the real Razorpay error server-side, but never forward it to the
    // client — it can include account-identifying details.
    console.error("Create order error:", error);

    return NextResponse.json(
      { error: "Failed to create order. Try again in a moment." },
      { status: 500 }
    );
  }
}