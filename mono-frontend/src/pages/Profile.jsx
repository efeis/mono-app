import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Post from "./interaction/Post";

export default function Profile() {
  const [userPosts, setUserPosts]     = useState([]);
  const [followers, setFollowers]     = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileExists, setProfileExists] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const navigate       = useNavigate();
  const { username: paramUsername } = useParams();
  const myUsername     = localStorage.getItem("username");
  const username       = paramUsername || myUsername;
  const isOwnProfile   = username === myUsername;

  useEffect(() => {
    if (!myUsername) {
      navigate("/auth");
    } else {
      checkUserExists();
    }
  }, [username]);

  // 1) Check if profile exists
  async function checkUserExists() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/exists?username=${encodeURIComponent(username)}`
      );
      const { exists } = await res.json();
      setProfileExists(exists);
      if (exists) {
        fetchUserPosts();
        fetchFollowers();
        fetchBio();
      }
    } catch {
      setProfileExists(false);
    }
  }

  // 2) Fetch posts & include viewer info
  async function fetchUserPosts() {
    try {
      const url =
        `${import.meta.env.VITE_BACKEND_URL}/api/posts`
        + `?username=${encodeURIComponent(username)}`
        + `&viewer=${encodeURIComponent(myUsername)}`;
      const res  = await fetch(url);
      const data = await res.json();
      setUserPosts(data.reverse());
    } catch {
      setUserPosts([]);
    }
  }

  // 3) Load followers
  async function fetchFollowers() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/followers?username=${encodeURIComponent(username)}`
      );
      const { followers: list = [] } = await res.json();
      setFollowers(list);
      setIsFollowing(list.includes(myUsername));
    } catch {
      setFollowers([]);
      setIsFollowing(false);
    }
  }

  async function handleFollowToggle() {
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/follow`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follower:  myUsername,
            following: username
          }),
        }
      );
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setFollowers(prev =>
          isFollowing
            ? prev.filter(u => u !== myUsername)
            : [...prev, myUsername]
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchBio() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile?username=${encodeURIComponent(username)}`
      );
      const data = await res.json();
      setBio(data.bio || "");
      setFullName(data.fullName || "");
      setEmail(data.email || "");
    } catch {
      setBio(""); setFullName(""); setEmail("");
    }
  }

  function handleLogout() {
    localStorage.removeItem("username");
    navigate("/auth");
  }

  if (!profileExists) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>User not found</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding:     "2rem",
      fontFamily:  "BerlinType",
      backgroundColor: "#F8FAFC",
      minHeight:   "100vh",
    }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          padding: "1.5rem",
          borderRadius: "2rem",
          backgroundColor: "#F8FAFC",
          boxShadow: "0 0 80px rgba(32,64,167,0.05)",
          marginBottom: "2rem",
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ flex: "1 1 60ch", minWidth: "260px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              fontFamily: "BerlinType", // <- username and followers
            }}
          >
            <span style={{
              backgroundColor: "#EBCC26",
              color: "#1E1E1E",
              fontWeight: "700",
              padding: "0.7rem 1.2rem",
              borderRadius: "1.5rem",
              fontSize: "1rem",
            }}>
              @{username}
            </span>
            <span style={{
              color: "#2040A7",
              fontWeight: "700",
              fontSize: "1rem",
            }}>
              {followers.length} follower{followers.length !== 1 && "s"}
            </span>
          </div>

          {/* 👇 NotoSansMono for profile info */}
          <div style={{
            fontSize: "0.8rem",
            lineHeight: "1.2",
            fontFamily: "NotoSansMono",
          }}>
            <p><strong>full name:</strong> {fullName || "-"}</p>
            <p><strong>e-mail:</strong> {email || "-"}</p>
            <p><strong>bio:</strong> {bio || "-"}</p>
          </div>
        </div>

        {/* RIGHT SIDE (buttons) */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            flex: "1 1 auto",
          }}
        >
          {isOwnProfile ? (
            <>
              <button
                onClick={() => navigate("/edit-profile")}
                style={{
                  backgroundColor: "#E2E8F0",
                  color: "#1E293B",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: "1.2rem",
                  padding: "0.8rem 1.6rem",
                  cursor: "pointer",
                  fontFamily: "BerlinType",
                }}
              >
                edit profile
              </button>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#DA1313",
                  color: "#F8FAFC",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  border: "none",
                  borderRadius: "1.2rem",
                  padding: "0.8rem 1.6rem",
                  cursor: "pointer",
                  fontFamily: "BerlinType",
                }}
              >
                log out
              </button>
            </>
          ) : (
            <button
              onClick={handleFollowToggle}
              style={{
                backgroundColor: isFollowing ? "#E2E8F0" : "#2040A7",
                color: isFollowing ? "#1E293B" : "#F8FAFC",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "none",
                borderRadius: "1.2rem",
                padding: "0.8rem 1.6rem",
                cursor: "pointer",
                fontFamily: "BerlinType",
              }}
            >
              {isFollowing ? "unfollow" : "follow"}
            </button>
          )}
        </div>
      </div>

      {/* POSTS */}
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {userPosts.map(post => (
          <Post
            key={post.id}
            post={post}
            liked={post.likedByUser}
            onToggleLike={(id, now) => {
              setUserPosts(prev =>
                prev.map(p =>
                  p.id === id
                    ? { ...p, likes: now ? p.likes + 1 : p.likes - 1, likedByUser: now }
                    : p
                )
              );
            }}
            onDelete={(id) => {
              setUserPosts(prev => prev.filter(p => p.id !== id));  // ✅ remove from state
            }}
          />
        ))}
      </div>
    </div>
  );
}
 