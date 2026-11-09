import axios from "axios";
import type estudiantes from "../interfaces/estudiantes";
import type tareaPersonalizada from "../interfaces/tareaPersonalizada";

const url = '/n8n/webhook/crear-tareas2';

interface datosTarea {
    Tarea: string
    Curso: string
    Materia: string
    Fecha: string
}


interface EstudianteP {
  matricula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  perfil: string;
}

const listaEstudianteP: EstudianteP[] = [
  {
    matricula: "2021-0001",
    nombres: "Ana",
    apellidos: "Martínez",
    correo: "ana.martinez@example.com",
    perfil: "Creativa, visual y le gusta dibujar",
  },
  {
    matricula: "2021-0002",
    nombres: "Carlos",
    apellidos: "Pérez",
    correo: "carlos.perez@example.com",
    perfil: "Analítico, apasionado por los videojuegos",
  },
  {
    matricula: "2021-0003",
    nombres: "Laura",
    apellidos: "Gómez",
    correo: "laura.gomez@example.com",
    perfil: "Curiosa, le interesan la ciencia y la naturaleza",
  },
  {
    matricula: "2021-0004",
    nombres: "Miguel",
    apellidos: "Rodríguez",
    correo: "miguel.rodriguez@example.com",
    perfil: "Deportista, aprende mejor con retos prácticos",
  },
  {
    matricula: "2021-0005",
    nombres: "Sofía",
    apellidos: "Hernández",
    correo: "sofia.hernandez@example.com",
    perfil: "Tranquila, disfruta la música y la lectura",
  },
];


export async function GenerarTarea(
    datos: datosTarea,
    listaEstudiante: estudiantes[]
): Promise<any[]> {
    const body = {
        Tarea: datos.Tarea,
        Curso: datos.Curso,
        Materia: datos.Materia,
        FechaEntrega: datos.Fecha,
        estudiantes: listaEstudianteP.map((e) => ({
            Matricúla: e.matricula,
            Estudiante: `${e.nombres} ${e.apellidos}`,
            Correo: e.correo,
            Perfil: e.perfil,
        })),
    };

    try {
        const { data } = await axios.post<any[]>(url, body, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error: any) {
        console.error("Error al generar la tarea:", error.response?.data ?? error.message);
        throw error;
    }
}