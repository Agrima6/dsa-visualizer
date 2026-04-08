import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ unlockedTopics: [] });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const unlockedTopics =
      (user.privateMetadata?.unlockedTopics as string[] | undefined) || [];

    return NextResponse.json({ unlockedTopics });
  } catch (error) {
    console.error("Fetch unlocked topics error:", error);
    return NextResponse.json({ unlockedTopics: [] }, { status: 500 });
  }
}