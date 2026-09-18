import { getPayload } from "payload";
import config from "@payload-config";

let clientPromise: ReturnType<typeof getPayload> | null = null;

/** Cached singleton so route/page handlers share one Payload instance per server process. */
export function getPayloadClient() {
  if (!clientPromise) {
    clientPromise = getPayload({ config });
  }
  return clientPromise;
}
