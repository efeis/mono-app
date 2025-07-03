// imports for react and unused bootstrap components
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

// api endpoint configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

    const handlePost = async () => {
    if (postText.trim() === "" || username.trim() === "") return;

    try {
      // send post data to backend api
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postText,
          username: username,
        }),
      });

      const result = await res.text();
      // handle successful post creation
      if (result === "post-created") {
        const newPost = {
          id: Date.now(),
          content: postText,
          username: username,
          timestamp: new Date().toISOString(),
        };
        setPosts([newPost, ...posts]);
        setPostText("");
      } else {
        setError("failed to create post");
      }
    } catch (err) {
      setError("connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // main form container with centered layout
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Create a Post</h2>
      <form onSubmit={handlePost}>
        {/* username input field */}
        <input
          type="text"
          placeholder="your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "8px" }}
        />
        {/* post content textarea */}
        <textarea
          placeholder="what's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="4"
          style={{ width: "100%", padding: "0.5rem", borderRadius: "8px" }}
        />
        {/* submit button */}
        <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}>
          Post
        </button>
      </form>
      {/* display feedback message */}
      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
