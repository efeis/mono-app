import { useState } from "react";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState(""); // For now, use a fixed or manual username
  const [message, setMessage] = useState("");

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          username,
        }),
      });

      const result = await res.text();
      setMessage(result === "post-created" ? "✅ Post submitted!" : "❌ Something went wrong");
      setContent("");
    } catch (err) {
      console.error("Post error:", err);
      setMessage("🚨 Could not reach server");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Create a Post</h2>
      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px" }}
        />
        <textarea
          placeholder="what’s on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="4"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
        />
        <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}>
          Post
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
