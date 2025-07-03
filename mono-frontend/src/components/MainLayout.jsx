import { Link, Outlet, useLocation } from "react-router-dom";
console.log("MainLayout rendered");

export default function MainLayout() {
  const location = useLocation();
  const navItems = [];

  return (
    <div className="flex h-screen bg-slate-50 font-[BerlinType]">
      <aside className="fixed top-6 left-6 z-50 flex flex-col items-center gap-4 w-16 p-3 bg-white shadow-xl rounded-3xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <div
                className={`flex items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-100 shadow-inner w-12 h-12"
                    : "hover:bg-slate-50 w-8 h-8"
                }`}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>
          );
        })}
      </aside>
      <main className="flex-1 ml-0 p-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
