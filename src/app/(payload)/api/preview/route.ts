import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  // Guards a secret-based auth mechanism — rate limit before even checking it,
  // so brute-forcing the preview secret can't be done at unbounded speed.
  const { success } = rateLimit(`preview:${getClientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  const { searchParams } = req.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "articles",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (result.docs.length === 0) {
    return new Response("Article not found", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(`/articulo/${slug}`);
}
