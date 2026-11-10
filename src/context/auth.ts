import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export const ROL = { DOCENTE: 1, ADMINISTRATIVO: 2, ESTUDIANTE: 3 } as const;

// Lo que tienen en común todos los usuarios
export interface Perfil {
  id_usuario: number;
  id_persona: number;
  nombres: string;
  apellidos: string;
  id_rol: number;
  rol: string;
  id_estado: number;
}

export interface DatosDocente {
  id_docente: number;
  ocupacion: string | null;
  fecha_ingreso: string | null;
}

export interface DatosEstudiante {
  matricula: string;
  fecha_ingreso: string | null;
}

export interface AuthContextType {
  session: Session | null;
  perfil: Perfil | null;
  docente: DatosDocente | null;
  estudiante: DatosEstudiante | null;
  loading: boolean;
  cerradaPorInactividad: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);