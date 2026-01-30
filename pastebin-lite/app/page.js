export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Pastebin-Lite</h1>
      <p>
        This is a minimal Pastebin-like application built as a take-home assignment.
      </p>
      <p>
        Use the API to create a paste and visit <code>/p/&lt;id&gt;</code> to view it.
      </p>
    </main>
  );
}
