import { ChevronFirst } from "lucide-react";
import Logo from "../assets/Logo-EduSmart.svg";

function Sidebar() {
  return (
    <>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-blue-950 border-r shadow-sm w-40">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img src={Logo} className="w-10" />
            <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
