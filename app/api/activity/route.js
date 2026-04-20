let store = {}; // { userId: [activities] }

export async function POST(req) {
  const body = await req.json();

  const { userId, topic, action } = body;

  if (!store[userId]) {
    store[userId] = [];
  }

  store[userId].push({
    topic,
    action,
    timestamp: new Date(),
  });

  return Response.json({ success: true });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  return Response.json(store[userId] || []);
}