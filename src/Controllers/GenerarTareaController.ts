import axios from "axios";
import type estudiantes from "../interfaces/estudiantes";
import type tareaPersonalizada from "../interfaces/tareaPersonalizada";

const url = import.meta.env.VITE_URL_GENERAR_TAREA;

interface datosTarea {
    Tarea: string
    Curso: string
    Materia: string
    Fecha: string
}

export async function GenerarTarea(
    datos: datosTarea,
    listaEstudiante: estudiantes[]
): Promise<tareaPersonalizada[]> {
    const body = {
        Tarea: datos.Tarea,
        Curso: datos.Curso,
        Materia: datos.Materia,
        FechaEntrega: datos.Fecha,
        estudiantes: listaEstudiante.map((e) => ({
            Matricúla: e.matricula,
            Estudiante: `${e.nombres} ${e.apellidos}`,
            Correo: e.correo,
            Perfil: e.perfil,
        })),
    };

    try {
        const { data } = await axios.post<tareaPersonalizada[]>(url, body, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error) {
        console.error("Error al generar la tarea:", error);
        throw error;
    }
}