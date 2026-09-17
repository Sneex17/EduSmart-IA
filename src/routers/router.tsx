import { Route, Routes } from "react-router-dom";
import MenuPrincipal from "../pages/MenuPrincipal";
import Login from "../pages/Login";

function MyRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/MenuPrincipal" element={<MenuPrincipal />} />
      </Routes>
    </>
  );
}

export default MyRouter;