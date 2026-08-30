import { auth, clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const EXPECTED_AMOUNT = 1900; // ₹19 in paise — must match create-order/route.ts
const EXPECTED_CURRENCY = "INR";

/**
 * This endpoint used to trust the client-supplied `topicSlug` directly after
 * only checking the Razorpay signature — meaning anyone who completed ONE
 * real payment could replay that same (valid) signature with a different
 * `topicSlug` in the body and unlock every paid topic for ₹19 total. Fixed
 * by re-fetching the order from Razorpay and unlocking whatever topic is
 * recorded in *that order's own notes* (set server-side at order-creation
 * time, see create-order/route.ts) — the client's topicSlug is only used to
 * assert which topic the caller *expects* to have paid for, purely for a
 * friendlier error message, never as the value that actually gets unlocked.
 *
 * The Razorpay webhook (app/api/payment/webhook/route.ts) already performs
 * these same checks independently and is the authoritative unlock path even
 * if the client never calls this endpoint at all — this route exists only
 * to unlock immediately for a snappier UI instead of waiting on webhook
 * delivery, with the same server-side guarantees.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      topicSlug,
    } = await req.json();

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      typeof topicSlug !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !topicSlug
    ) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Payment verification is unavailable right now." },
        { status: 500 }
      );
    }

    // 1. Signature must be valid for this exact (order, payment) pair.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSig);
    const providedBuffer = Buffer.from(razorpay_signature);
    const isValidSignature =
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, providedBuffer);

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

    // 2. Re-fetch the order server-side — never trust anything about what
    // was paid for from the request body.
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const orderUserId = order.notes?.userId as string | undefined;
    const orderTopicSlug = order.notes?.topicSlug as string | undefined;

    if (!orderUserId || !orderTopicSlug) {
      return NextResponse.json({ error: "Order is missing required metadata." }, { status: 400 });
    }

    // 3. The order must belong to the caller — otherwise anyone who ever
    // sees an order id (or brute-forces one) could unlock content by
    // pairing it with their own signature from a different payment.
    if (orderUserId !== userId) {
      return NextResponse.json({ error: "This order does not belong to you." }, { status: 403 });
    }

    // 4. The topic the client says it's unlocking must match what was
    // actually purchased. This is the core fix: the value that gets written
    // to Clerk below is orderTopicSlug (server-derived), not the client's
    // topicSlug — this check exists only to fail fast with a clear message
    // if the two disagree (e.g. a stale client state).
    if (orderTopicSlug !== topicSlug) {
      return NextResponse.json({ error: "This payment was for a different topic." }, { status: 400 });
    }

    // 5. Amount/currency sanity check — catches a tampered or unexpected order.
    if (order.amount !== EXPECTED_AMOUNT || order.currency !== EXPECTED_CURRENCY) {
      return NextResponse.json({ error: "Unexpected order amount." }, { status: 400 });
    }

    // 6. The payment itself must be captured, and must actually belong to
    // this order — a valid signature alone doesn't prove capture.
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Payment does not match this order." }, { status: 400 });
    }
    if (payment.status !== "captured") {
      return NextResponse.json({ error: "Payment has not been captured yet." }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const existing =
      (user.privateMetadata?.unlockedTopics as string[] | undefined) || [];

    if (!existing.includes(orderTopicSlug)) {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          unlockedTopics: [...existing, orderTopicSlug],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
