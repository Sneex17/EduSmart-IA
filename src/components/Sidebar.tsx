import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronFirst,
  ChevronLast,
  Home,
  ClipboardPlus,
  Send,
  ListChecks,
  BarChart3,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Logo from "../assets/EduSmartIA.svg";
import { ROL } from "../context/auth";
import { useAuth } from "../hooks/useAuth";

interface LinkItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  roles: number[];
}

const AMBOS: number[] = [ROL.DOCENTE, ROL.ESTUDIANTE];

const links: LinkItem[] = [
  { to: "/MenuPrincipal", label: "Home", icon: Home, end: true, roles: AMBOS },
  { to: "/MenuPrincipal/AsignarTarea", label: "Asignar tarea", icon: ClipboardPlus, roles: [ROL.DOCENTE] },
  { to: "/MenuPrincipal/EnviarTarea", label: "Enviar tarea", icon: Send, roles: [ROL.DOCENTE] },
  { to: "/MenuPrincipal/Tareas", label: "Tareas y actividades", icon: ListChecks, roles: [ROL.ESTUDIANTE] },
  { to: "/MenuPrincipal/Reportes", label: "Reportes", icon: BarChart3, roles: [ROL.DOCENTE] },
];


function Sidebar() {
  const { perfil, logout } = useAuth();
const visibles = links.filter((l) => perfil && l.roles.includes(perfil.id_rol));
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen">
      <nav
        className={`h-full flex flex-col bg-blue-800 border-r border-blue-900 transition-all duration-200 ${
          expanded ? "w-60" : "w-16"
        }`}
      >
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={Logo}
            alt="EduSmart AI"
            className={`overflow-hidden transition-all ${
              expanded ? "w-35" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-blue-900 text-blue-100 hover:bg-blue-800 cursor-pointer"
            aria-label={expanded ? "Contraer menú" : "Expandir menú"}
          >
            {expanded ? <ChevronFirst size={18} /> : <ChevronLast size={18} />}
          </button>
        </div>
        {/*Perfil */}
        {expanded && (
          <p className="mb-2 truncate px-3 text-xs text-blue-200">
            {perfil?.nombres} {perfil?.apellidos}
          </p>
        )}
        {/* Links */}
        <ul className="flex-1 px-3 mt-4 space-y-1">
          {visibles.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                title={!expanded ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-blue-200 hover:bg-blue-900 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all ${
                    expanded ? "w-40" : "w-0"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          onClick={() => logout()}
          title={!expanded ? "Cerrar sesión" : undefined}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-200 transition-colors hover:bg-blue-900 hover:text-white"
        >
          <LogOut size={20} className="shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all ${expanded ? "w-40" : "w-0"}`}
          >
            Cerrar sesión
          </span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
