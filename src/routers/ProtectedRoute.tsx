import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  roles?: number[]; // si no se pasa, basta con estar autenticado
}

function ProtectedRoute({ roles }: Props) {
  const { session, perfil, docente, estudiante, loading } = useAuth();

  const datosListos = perfil !== null && (docente !== null || estudiante !== null);

  if (loading || (session && !datosListos)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Cargando...
      </div>
    );
  }
  if (!session || !perfil) return <Navigate to="/" replace />;
  if (roles && !roles.includes(perfil.id_rol)) {
    return <Navigate to="/MenuPrincipal" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;