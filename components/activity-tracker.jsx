export async function trackActivity(userId, topic, action) {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          topic,
          action,
        }),
      });
    } catch (err) {
      console.error("Tracking failed", err);
    }
  }