import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { autoPublishScheduledArticles } from "@/hooks/autoPublishScheduled";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: Request) {
  const { success } = rateLimit(`cron:${getClientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const result = await autoPublishScheduledArticles(payload);
  return NextResponse.json(result);
}
