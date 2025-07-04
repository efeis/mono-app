import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  // states to hold the search query, results, and following status
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [followingSet, setFollowingSet] = useState(new Set());
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // when the query changes, fetch results after a delay
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    // AbortController to cancel previous fetch if query changes
    const controller = new AbortController();

    // delay the fetch to avoid too many requests
    const handle = setTimeout(async () => {
      try {
        // fetch users matching the query, excluding the current user
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/search` +
            `?q=${encodeURIComponent(query)}` +
            `&me=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const users = await res.json();

        // save results and following status
        setResults(users);

        // build a set of usernames that the current user is following
        setFollowingSet(new Set(
          users.filter(u => u.isFollowing).map(u => u.username)
        ));
      } catch (err) {
        // ignore abort errors
        if (err.name !== "AbortError") console.error(err);
      }
    }, 300);

    // cleanup function to clear timeout and abort fetch
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query, username]);

  // toggle follow/unfollow for a user
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
          // Each user card
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
            {/* Display followers count */}
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
