import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Post({ post, liked, onToggleLike }) {
  const [isLiked, setIsLiked]     = useState(liked);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const me = localStorage.getItem("username");

  // keep internal state in sync if parent updates
  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(post.likes || 0);
  }, [liked, post.likes]);

  // format: "13:49 - jun 27, 2025"
  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    const pad = (n) => n.toString().padStart(2, "0");
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleLikeToggle = async () => {
    // prevent liking your own post
    if (post.username === me && !isLiked) {
      alert("you can't like your own post.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: me }),
        }
      );
      const result = await res.text();

      if (result === "liked") {
        setIsLiked(true);
        setLikeCount((c) => c + 1);
        onToggleLike?.(post.id, true);
      } else if (result === "unliked") {
        setIsLiked(false);
        setLikeCount((c) => c - 1);
        onToggleLike?.(post.id, false);
      } else if (result === "cannot-like-own-post") {
        alert("you can't like your own post.");
      }
    } catch (err) {
      console.error("failed to toggle like:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/${post.id}?username=${me}`,
        { method: "DELETE" }
      );
      const result = await res.text();
      if (result === "deleted") {
        onDelete?.(post.id);
        alert("Deleted successfully.");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("failed to delete:", err);
    }
  };

  return (
    <div style={{
      backgroundColor: "#F8FAFC",
      borderRadius:    "1.5rem",
      padding:         "2rem",
      marginBottom:    "1rem",
      boxShadow:       "0 0 50px rgba(32,64,167,0.05)",
      fontWeight:      "700",
      position: "relative",
    }}>
      {post.username === me && (
        <button
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            color: "#DA1313",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          delete
        </button>
      )}
      
      {/* Username */}
      <Link to={`/profile/${post.username}`}>
        <p style={{
          color: "#EBCC26",
          cursor: "pointer",
          textDecoration: "underline",
          marginBottom: "1rem",
        }}>
          @{post.username}
        </p>
      </Link>

      {/* Content */}
      <p style={{ color: "#2040A7", fontSize: "1.2rem" }}>
        {post.content}
      </p>

      {/* Timestamp + Like */}
      <div style={{
        display:       "flex",
        justifyContent:"space-between",
        alignItems:   "center",
        marginTop:    "1rem",
      }}>
        <span style={{ color: "#64748B", fontSize: "0.9rem" }}>
          {formatTimestamp(post.timestamp)}
        </span>

        <div
          onClick={handleLikeToggle}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "0.4rem",
            cursor:        (post.username === me && !isLiked) ? "not-allowed" : "pointer",
            opacity:       (post.username === me && !isLiked) ? 0.5 : 1
          }}
        >
          <img
            src={isLiked
              ? "/mono-heart-liked.svg"
              : "/mono-heart.svg"}
            alt="Like"
            style={{ width: "25px" }}
          />
          <span style={{ color: "#64748B", fontSize: "0.9rem" }}>
            {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}
