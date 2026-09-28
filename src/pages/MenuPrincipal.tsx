import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MenuPrincipal() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MenuPrincipal;