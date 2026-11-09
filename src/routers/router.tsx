import { Route, Routes } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AsignarTarea from "../pages/AsignarTarea";
import EnviarTarea from "../pages/EnviarTarea";
import TareasActividades from "../pages/TareasActividades";


function MyRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/MenuPrincipal" element={<MenuPrincipal />}>
        <Route index element={<Home />} />
        <Route path="AsignarTarea" element={<AsignarTarea />} />
        <Route path="EnviarTarea" element={<EnviarTarea />} />
        <Route path="Tareas" element={<TareasActividades/>}/>
      </Route>
    </Routes>
  );
}

export default MyRouter;