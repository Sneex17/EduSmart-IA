import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoText from "../assets/EduSmartIA.svg";

type LoginForm = {
  correo: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    // TODO: reemplazar por la llamada real a tu API
    console.log(data);
    navigate("/MenuPrincipal");
  };

  return (
    <div className="flex min-h-screen justify-center items-center  bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src={LogoText} alt="EduSmart AI" className="mb-4 w-52" />
          <h1 className="text-lg font-semibold text-slate-800">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-slate-500">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="correo" className="text-sm font-medium text-slate-700">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              className={`h-11 rounded-lg border px-3 text-sm outline-none transition
                focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                ${errors.correo ? "border-red-400" : "border-slate-300"}`}
              {...register("correo", {
                required: "Ingresa tu correo",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Correo no válido",
                },
              })}
            />
            {errors.correo && (
              <span className="text-xs text-red-500">{errors.correo.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`h-11 rounded-lg border px-3 text-sm outline-none transition
                focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                ${errors.password ? "border-red-400" : "border-slate-300"}`}
              {...register("password", { required: "Ingresa tu contraseña" })}
            />
            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 cursor-pointer rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;