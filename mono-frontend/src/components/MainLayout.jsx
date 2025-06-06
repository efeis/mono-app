import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Profile", path: "/profile" }
  ];

  return (
    <div className="flex h-screen font-[BerlinTypeOffice] bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-56 bg-white shadow-lg p-6 flex flex-col items-center">
        <img src="/logo-4x.png" alt="Mono Logo"
        style={{ width: "90px", borderRadius: "1.5rem", boxShadow: "0 0 50px rgba(32, 64, 167, 0.1)"}} />
        <nav className="flex flex-col gap-4 w-full">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full py-2 px-4 rounded-xl text-left transition-all font-semibold ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
