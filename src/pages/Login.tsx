import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoText from "../assets/EduSmartIA.svg"

function Login() {

    const nagevate = useNavigate();

    const handleSumit = (e: any) => {
        e.preventDefault();
        nagevate('/MenuPrincipal')
    }
  return (
    <>
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col items-center bg-blue-100 w-100 h-100 rounded-xl border-2 p-5 ">
          
          <h1 className=" font-semibold mb-1">Welcome back</h1>
          <img src={LogoText} className="w-60 mb-5"/>
          <div className="flex flex-col ">
            <form className="flex flex-col">
              <label htmlFor="correo" className="text-gray-800">
                Correo
              </label>
              <input
                type="text"
                className="bg-white w-70 h-10 border-1 rounded-xl mb-7"
              />

              <label htmlFor="password" className="text-gray-800">
                Contraseña
              </label>
              <input
                type="password"
                className="bg-white w-70 h-10 border-1 rounded-xl mb-7"
              />

              <button className=" bg-blue-600 h-12 rounded-xl text-white font-semibold cursor-pointer" onClick={handleSumit}>
                Iniciar Sessión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
