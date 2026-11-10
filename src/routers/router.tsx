import { Route, Routes } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AsignarTarea from "../pages/AsignarTarea";
import EnviarTarea from "../pages/EnviarTarea";
import TareasActividades from "../pages/TareasActividades";
import { ROL } from "../context/auth";
import ProtectedRoute from "./ProtectedRoute";

function MyRouter() {
  return (
    <Routes>
  <Route path="/" element={<Login />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/MenuPrincipal" element={<MenuPrincipal />}>
      <Route index element={<Home />} />

      <Route element={<ProtectedRoute roles={[ROL.DOCENTE]} />}>
        <Route path="AsignarTarea" element={<AsignarTarea />} />
      </Route>

      <Route element={<ProtectedRoute roles={[ROL.ESTUDIANTE]} />}>
        <Route path="EnviarTarea" element={<EnviarTarea />} />
      </Route>

      <Route path="Tareas" element={<TareasActividades />} />
    </Route>
  </Route>
</Routes>
  );
}

export default MyRouter;