import { Outlet } from "react-router-dom";

console.log("MainLayout rendered");

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-[BerlinType]">
      <main className="flex-1 p-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
