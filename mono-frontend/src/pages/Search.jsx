import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [followingSet, setFollowingSet] = useState(new Set());
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/search` +
            `?q=${encodeURIComponent(query)}` +
            `&me=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const users = await res.json();
        setResults(users);
        setFollowingSet(new Set(
          users.filter(u => u.isFollowing).map(u => u.username)
        ));
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }, 300);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query, username]);

  const toggleFollow = async (other) => {
    try {
      const method = followingSet.has(other) ? "DELETE" : "POST";
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/follow`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower: username, following: other }),
        }
      );
      if (res.ok) {
        setFollowingSet(prev => {
          const next = new Set(prev);
          prev.has(other) ? next.delete(other) : next.add(other);
          return next;
        });
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "BerlinType",
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto 2rem",
          backgroundColor: "#F8FAFC",
          padding: "1.5rem",
          borderRadius: "2rem",
          boxShadow: "0 0 50px rgba(32,64,167,0.1)",
          display: "flex",
        }}
      >
        <input
          type="text"
          placeholder="search users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontFamily: "BerlinType",
            fontSize: "1.2rem",
            fontWeight: 700,
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            color: "#1E293B",
            backgroundColor: "#F8FAFC",
            boxShadow: "none",
          }}
        />
      </div>

      {/* Live Results */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {results.map(user => (
          <div
            key={user.username}
            style={{
              backgroundColor: "#F8FAFC",
              padding: "1.5rem 2rem",
              borderRadius: "2rem",
              boxShadow: "0 0 50px rgba(32,64,167,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => navigate(`/profile/${user.username}`)}
              style={{
                backgroundColor: "#EBCC26",
                padding: "0.5rem 1rem",
                borderRadius: "1.5rem",
                fontWeight: 700,
                color: "#1E1E1E",
                cursor: "pointer",
              }}
            >
              @{user.username}
            </span>
            {user.username !== username && (
              <button
                onClick={() => toggleFollow(user.username)}
                style={{
                  backgroundColor: followingSet.has(user.username)
                    ? "#E2E8F0"
                    : "#2040A7",
                  color: followingSet.has(user.username)
                    ? "#1E293B"
                    : "#F8FAFC",
                  padding: "0.6rem 1.2rem",
                  border: "none",
                  borderRadius: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {followingSet.has(user.username)
                  ? "unfollow"
                  : "follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
