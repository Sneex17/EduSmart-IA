import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import supabase from "../services/supabase";
import {
  AuthContext,
  ROL,
  type DatosDocente,
  type DatosEstudiante,
  type Perfil,
} from "./auth";

const IDLE_MS = 10 * 60 * 1000;   // 10 minutos sin actividad
const CHECK_MS = 15 * 1000;       // cada cuánto se revisa
const KEY = "edusmart:ultima-actividad";

const inactivoDemasiado = () => {
  const ultima = Number(localStorage.getItem(KEY));
  return ultima > 0 && Date.now() - ultima > IDLE_MS;
};

interface SesionCompleta {
  perfil: Perfil;
  docente: DatosDocente | null;
  estudiante: DatosEstudiante | null;
}

// 1) Datos comunes + rol
async function cargarPerfil(): Promise<Perfil | null> {
  const { data, error } = await supabase.rpc("perfil_usuario");
  if (error || !data || data.length === 0) return null;
  return data[0] as Perfil;
}

// 2) Datos propios del rol
async function cargarDatosRol(
  perfil: Perfil
): Promise<Pick<SesionCompleta, "docente" | "estudiante"> | null> {
  if (perfil.id_rol === ROL.DOCENTE) {
    const { data, error } = await supabase.rpc("perfil_docente");
    if (error || !data || data.length === 0) return null;
    return { docente: data[0] as DatosDocente, estudiante: null };
  }

  if (perfil.id_rol === ROL.ESTUDIANTE) {
    const { data, error } = await supabase.rpc("perfil_estudiante");
    if (error || !data || data.length === 0) return null;
    return { docente: null, estudiante: data[0] as DatosEstudiante };
  }

  return null; // Administrativo u otro rol: todavía sin acceso
}

async function cargarSesionCompleta(): Promise<SesionCompleta | null> {
  const perfil = await cargarPerfil();
  if (!perfil || perfil.id_estado !== 1) return null;

  const datos = await cargarDatosRol(perfil);
  if (!datos) return null;

  return { perfil, ...datos };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [docente, setDocente] = useState<DatosDocente | null>(null);
  const [estudiante, setEstudiante] = useState<DatosEstudiante | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [cerradaPorInactividad, setCerradaPorInactividad] = useState(false);

  const logout = useCallback(async () => {
    await supabase.auth.signOut({ scope: "local" });
    localStorage.removeItem(KEY);
  }, []);

  // A) Recuperar la sesión guardada y escuchar cambios
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session && inactivoDemasiado()) {
        await logout();
        setCerradaPorInactividad(true);
        setSession(null);
      } else {
        setSession(data.session);
      }
      setSessionReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSession(nuevaSesion);
      if (!nuevaSesion) {
        setPerfil(null);
        setDocente(null);
        setEstudiante(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [logout]);

  // B) Con sesión: cargar perfil común y luego los datos del rol
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;

    cargarSesionCompleta().then(async (s) => {
      if (cancelado) return;
      if (!s) {
        await logout();
        return;
      }
      setPerfil(s.perfil);
      setDocente(s.docente);
      setEstudiante(s.estudiante);
    });

    return () => {
      cancelado = true;
    };
  }, [userId, logout]);

  // C) Cierre por inactividad (funciona también entre pestañas)
  useEffect(() => {
    if (!userId) return;
    let ultimaEscritura = 0;

    const marcar = () => {
      const ahora = Date.now();
      if (ahora - ultimaEscritura > 5000) {
        localStorage.setItem(KEY, String(ahora));
        ultimaEscritura = ahora;
      }
    };
    const revisar = () => {
      if (inactivoDemasiado()) {
        setCerradaPorInactividad(true);
        logout();
      }
    };

    marcar();
    const eventos = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;
    eventos.forEach((e) => window.addEventListener(e, marcar, { passive: true }));
    document.addEventListener("visibilitychange", revisar);
    const intervalo = window.setInterval(revisar, CHECK_MS);

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, marcar));
      document.removeEventListener("visibilitychange", revisar);
      window.clearInterval(intervalo);
    };
  }, [userId, logout]);

  const login = useCallback(async (correo: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password });
    if (error) throw new Error("Correo o contraseña incorrectos");

    const s = await cargarSesionCompleta();
    if (!s) {
      await supabase.auth.signOut({ scope: "local" });
      throw new Error("Tu usuario no está activo o su rol aún no tiene acceso");
    }

    localStorage.setItem(KEY, String(Date.now()));
    setCerradaPorInactividad(false);
    setPerfil(s.perfil);
    setDocente(s.docente);
    setEstudiante(s.estudiante);
  }, []);

  const value = useMemo(
    () => ({
      session,
      perfil,
      docente,
      estudiante,
      loading: !sessionReady,
      cerradaPorInactividad,
      login,
      logout,
    }),
    [session, perfil, docente, estudiante, sessionReady, cerradaPorInactividad, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}