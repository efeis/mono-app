import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // icons for password visibility toggle
const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
console.log("authForm loaded");

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // login or register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "login" : "register";

    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${endpoint}`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.text();

      if (result === "ok") {
        localStorage.setItem("username", username);  // Store username
        setMessage(`🥳 welcome back, ${username}!`);
        navigate("/");
      } else if (result === "wrong-password") {
        setMessage("😕 the password's not quite right.")
      } else if (result === "taken") {
        setMessage("⚠️ that username is already taken.")
      } else if (result === "not-found") {
        setMessage("🤔 we couldn't find you. please register.")
      } else {
        setMessage("🚨 something went wrong. try again later.");
      }

    } catch (err) {
      console.error("fetch error:", err);
      setMessage("🛑 could not reach backend.")
    }
  };

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "BerlinType",
      fontWeight: '400',
      backgroundColor: "#F8FAFC",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#F8FAFC",
        padding: "2.5rem",
        borderRadius: "3rem",
        boxShadow: "0 0 100px rgba(32, 64, 167, 0.1)",
        textAlign: "center"
      }}>

        {/* LOGO AND HEADING */}
        <img
          src="/logo-4x.png"
          alt="Mono Logo"
          style={{
            width: "100px",
            borderRadius: "1.2rem",
            boxShadow: "0 0 50px rgba(32, 64, 167, 0.1)",
            display: "block",
            margin: "0 auto",      
          }}
        />

        <h2 style={{ color: "#2040A7", marginBottom: "0.8rem"}}>
          {mode === "login" ? "welcome to mono!" : "join mono today!"}
          </h2>

        <p style={{ color: "#64748B", marginBottom: "3.2rem", fontSize: "0.9rem" }}>
          {mode === "login" ? "log in with your credentials to continue" : "create a username and password to register."}
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          
          {/* password input with a toggle button for visibility */}
          <div style={{ position: "relative" }}>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: "0.8rem" }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "40%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748B"
              }}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          <button type="submit" style={buttonStyle}>
            {mode === "login" ? "log in" : "register"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p style={{ marginTop: "3.2rem", color: "#334155", fontWeight: "700"}}>{message}</p>
        )}

        {/* REGISTER & LOG IN LINK */}
        <div style={{ marginTop: "2.4rem", fontSize: "0.85rem", color: "#64748B" }}>
          {mode === "login" ? (
            <>
              <p>not a member yet?</p>
              <button
              onClick={() => setMode("register")}
              style={linkStyle}
              >register now
              </button>
            </>
          ) : (
            <>
              <p>already have an account?</p>
              <button
              onClick={() => setMode("login")} 
              style={linkStyle}
              >log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "93%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "1rem",
  border: "1px",
  fontFamily: "NotoSansMono",
  fontWeight: "400",
  transition: "border-color 1s ease, box-shadow 0.2s ease"
};

const buttonStyle = {
  width: "30%",
  padding: "1rem",
  backgroundColor: "#2040A7",
  color: "white",
  fontWeight: "bold",
  borderRadius: "1.5rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1.2rem",
  fontFamily: "BerlinType",
  transition: "background-color 1s ease, transform 0.2s ease"
};

const linkStyle = {
  background: "none",
  border: "none",
  color: "#EA9DF1",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "BerlinType",
  textDecoration: "underline"
};

