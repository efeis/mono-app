import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MainLayout from "./components/MainLayout";
import RequireAuth from "./components/RequireAuth";

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/auth";
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = useMemo(
    () => [
      { icon: asset("mono-search-1x.png"),  path: "/search",  label: "search" },
      { icon: asset("mono-logo-1x.png"),    path: "/home",    label: "home" },
      { icon: asset("mono-profile-1x.png"), path: "/profile", label: "profile" },
    ],
    []
  );

  return (
    <div style={{ display: "flex" }}>
      {/* Bottom Nav (hide on /auth) */}
      {!isAuthPage && (
        <div
          style={{
            position: "fixed",
            bottom: "-2.7rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#F8FAFC",
            borderRadius: "25px",
            boxShadow: "0 0 50px rgba(32, 64, 167, 0.2)",
            padding: "1rem 1.5rem 4.5rem",
            display: "flex",
            gap: "1.5rem",
            zIndex: 1000,
          }}
        >
          {navItems.map((item) => {
            const isActive =
              item.path === "/profile"
                ? location.pathname.startsWith("/profile")
                : location.pathname === item.path;
            const isHovered = hoveredItem === item.path;

            return (
              <div
                key={item.path}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => navigate(item.path)}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    filter: isActive ? "none" : "grayscale(10%) opacity(0.8)",
                    transition: "filter 0.5s",
                  }}
                />
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "28px",
                      height: "6px",
                      backgroundColor: "#2040A7",
                      borderRadius: "3px",
                    }}
                  />
                )}
                {isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-30px",
                      color: "#2040A7",
                      backgroundColor: "#F8FAFC",
                      padding: "0.2rem 0.5rem",
                      fontFamily: "BerlinType",
                      fontSize: "1rem",
                      fontWeight: "800",
                      borderRadius: "5px",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.5s",
                      opacity: 1,
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <div style={{ backgroundColor: "#F8FAFC", width: "100%" }}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          {/* Protect all other routes using RequireAuth */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
