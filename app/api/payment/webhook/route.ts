import crypto from "crypto";
import Razorpay from "razorpay";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Razorpay webhook: source of truth for unlocking a topic, independent of
// whether the client is still around to call /api/payment/verify after
// checkout. Configure this URL under Razorpay Dashboard -> Settings ->
// Webhooks, subscribe to "payment.captured", and set RAZORPAY_WEBHOOK_SECRET
// to the secret shown there.
export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!webhookSecret || !razorpayKeyId || !razorpayKeySecret) {
    console.error("Razorpay webhook env vars are missing.");
    return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  const isValid =
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    // Acknowledge other events so Razorpay doesn't retry; we only act on captures.
    return NextResponse.json({ received: true });
  }

  try {
    const payment = event.payload?.payment?.entity;
    const orderId: string | undefined = payment?.order_id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const order = await razorpay.orders.fetch(orderId);
    const userId = order.notes?.userId as string | undefined;
    const topicSlug = order.notes?.topicSlug as string | undefined;

    if (!userId || !topicSlug) {
      console.error("Webhook: order missing userId/topicSlug notes", orderId);
      return NextResponse.json({ error: "Order missing metadata." }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const existing =
      (user.privateMetadata?.unlockedTopics as string[] | undefined) || [];

    if (!existing.includes(topicSlug)) {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          unlockedTopics: [...existing, topicSlug],
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
