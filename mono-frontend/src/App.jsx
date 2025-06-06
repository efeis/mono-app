import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
