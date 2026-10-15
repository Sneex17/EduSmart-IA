import supabase from '../services/supabase'
import type estudiantes   from '../interfaces/estudiantes'
import type cursos   from '../interfaces/curso'

export async function ListaCursos(idDocente: number, idPeriodo: string): Promise<cursos[] | null> {
    const { data, error } = await supabase
        .rpc('cursos_del_docente', {
            p_id_docente: idDocente,
            p_id_periodo: idPeriodo,
        })

    if (error) {
        console.error('Error', error.message)
        return null
    }

    return data as cursos[]
}

//Lista de los estudiantes del curso


export async function ListaEstudiantesPorCurso(
    idCurso: number,
    idPeriodo: string
): Promise<estudiantes[] | null> {
    const { data, error } = await supabase
        .rpc('estudiantes_por_curso', {
            p_id_curso: idCurso,
            p_id_periodo: idPeriodo,
        })

    if (error) {
        console.error('Error', error.message)
        return null
    }

    return data as estudiantes[]
}

//Carga de las materias del docente
export interface materias {
    id_docente_curso_detalle: number
    codigo_materia: string
    materia: string
}

export async function ListaMateriasPorCurso(
    idDocente: number,
    idCurso: number,
    idPeriodo: string
): Promise<materias[] | null> {
    const { data, error } = await supabase
        .rpc('materias_del_docente_por_curso', {
            p_id_docente: idDocente,
            p_id_curso: idCurso,
            p_id_periodo: idPeriodo,
        })

    if (error) {
        console.error('Error', error.message)
        return null
    }

    return data as materias[]
}