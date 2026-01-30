import {
  getNowMs,
  getPaste,
  savePaste,
  deletePaste
} from "@/lib/pasteStore";

export async function GET(request, { params }) {
  const { id } =  await params;

  const paste = await getPaste(id);

  if (!paste) {
    return Response.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const now = getNowMs(request.headers);

  // Check expiry
  if (paste.expires_at !== null && now >= paste.expires_at) {
    await deletePaste(id);
    return Response.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // Check views
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await deletePaste(id);
      return Response.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    paste.remaining_views -= 1;
    await savePaste(paste);
  }

  return Response.json(
    {
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at:
        paste.expires_at !== null
          ? new Date(paste.expires_at).toISOString()
          : null
    },
    { status: 200 }
  );
}
