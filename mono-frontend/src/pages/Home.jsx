import { useState, useEffect } from "react";
import Post from "./interaction/Post";

export default function Home() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchFeed();
  }, [username]);

  const fetchFeed = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/feed?username=${username}`
      );
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch feed", err);
    }
  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postText, username }),
      });
      if ((await res.text()) === "post-created") {
        setPostText("");
        await fetchFeed(); // Refresh posts after new post
      }
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  const handleLikeToggle = (postId, isNowLiked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: isNowLiked ? p.likes + 1 : p.likes - 1,
              likedByUser: isNowLiked,
            }
          : p
      )
    );
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        padding: "2rem",
        fontFamily: "BerlinType",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Post Creation */}
      <div
        style={{
          backgroundColor: "#F8FAFC",
          boxShadow: "0 0 100px rgba(32, 64, 167, 0.1)",
          padding: "1.5rem",
          borderRadius: "2rem",
          maxWidth: "700px",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <textarea
          placeholder="what’s on your mind?"
          value={postText}
          onChange={(e) => {
            if (e.target.value.length <= 300) setPostText(e.target.value);
          }}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "1.2rem",
            fontFamily: "BerlinType",
            fontWeight: "700",
            color: "#64748B",
            backgroundColor: "#F8FAFC",
            resize: "none",
            minHeight: "4rem",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <span
            style={{
              color: "#64748B",
              marginRight: "1rem",
              fontSize: "1rem",
              fontFamily: "BerlinType",
              fontWeight: "700",
            }}
          >
            {postText.length}/300
          </span>
          <button
            onClick={handlePost}
            style={{
              backgroundColor: "#2040A7",
              color: "white",
              padding: "0.6rem 1.2rem",
              borderRadius: "1rem",
              fontSize: "1.2rem",
              fontFamily: "BerlinType",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(32, 64, 167, 0.1)",
            }}
          >
            post
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      <div style={{ maxWidth: "700px", width: "100%", margin: "0 auto" }}>
        {posts.map((p) => (
          <Post
            key={p.id}
            post={p}
            liked={p.likedByUser}
            onToggleLike={handleLikeToggle}
            onDelete={handleDelete} // ✅ Pass delete handler
          />
        ))}
      </div>
    </div>
  );
}
