import {
  generateId,
  getNowMs,
  savePaste
} from "@/lib/pasteStore";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // Validate content
  if (typeof content !== "string" || content.trim().length === 0) {
    return Response.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  // Validate ttl_seconds
  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  // Validate max_views
  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = generateId();
  const now = getNowMs(request.headers);

  const paste = {
    id,
    content,
    created_at: now,
    expires_at:
      ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null,
    remaining_views:
      max_views !== undefined ? max_views : null
  };

  await savePaste(paste);

  const url = `${request.nextUrl.origin}/p/${id}`;

  return Response.json(
    { id, url },
    { status: 201 }
  );
}
