import { kv } from "@vercel/kv";

/**
 * Get current time in ms.
 * Supports deterministic time for tests.
 */
export function getNowMs(headers) {
  if (
    process.env.TEST_MODE === "1" &&
    headers &&
    headers.get("x-test-now-ms")
  ) {
    return Number(headers.get("x-test-now-ms"));
  }
  return Date.now();
}

/**
 * Generate a short random id.
 */
export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Save a paste to KV.
 */
export async function savePaste(paste) {
  await kv.set(`paste:${paste.id}`, paste);
}

/**
 * Get a paste from KV.
 */
export async function getPaste(id) {
  return await kv.get(`paste:${id}`);
}

/**
 * Delete a paste from KV.
 */
export async function deletePaste(id) {
  await kv.del(`paste:${id}`);
}
