import {
  getNowMs,
  getPaste,
  savePaste,
  deletePaste
} from "@/lib/pasteStore";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function PastePage({ params, headers }) {
  const { id } = await params;

  const paste = await getPaste(id);

  if (!paste) {
    return <h1>404 - Not Found</h1>;
  }

const now = Date.now();


  // Expiry check
  if (paste.expires_at !== null && now >= paste.expires_at) {
    await deletePaste(id);
    return <h1>404 - Not Found</h1>;
  }

  // View limit check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await deletePaste(id);
      return <h1>404 - Not Found</h1>;
    }

    paste.remaining_views -= 1;
    await savePaste(paste);
  }

  const safeContent = escapeHtml(paste.content);

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        fontFamily: "monospace",
        padding: "24px",
        background: "#fafafa"
      }}
    >
      {safeContent}
    </pre>
  );
}
