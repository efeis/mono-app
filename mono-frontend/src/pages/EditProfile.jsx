import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [bio, setBio]           = useState("");

  useEffect(() => {
    if (!username) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile?username=${username}`)
      .then(res => res.json())
      .then(data => {
        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
      });
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { username, fullName, email, bio };

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      navigate(`/profile/${username}`);
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#F8FAFC",
      borderRadius: "2rem",
      boxShadow: "0 0 50px rgba(32,64,167,0.05)",
      fontFamily: "BerlinType",
    }}>
      <h2 style={{ color: "#2040A7", marginBottom: "2rem" }}>edit your profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="full name"
          style={inputStyle}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email address"
          style={inputStyle}
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="short bio"
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <button type="submit" style={buttonStyle}>save changes</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "1rem",
  borderRadius: "1rem",
  border: "1px solid #CBD5E1",
  backgroundColor: "#F8FAFC", 
  color: "#1E293B",            
  fontFamily: "NotoSansMono",
  fontSize: "1rem",
};


const buttonStyle = {
  backgroundColor: "#2040A7",
  color: "#F8FAFC",
  fontWeight: "bold",
  padding: "0.8rem 1.6rem",
  borderRadius: "2rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontFamily: "BerlinType",
  textTransform: "lowercase"
};
