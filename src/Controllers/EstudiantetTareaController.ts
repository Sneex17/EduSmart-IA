import type { FilaMateria } from "../interfaces/FilaMateria";
import type { MateriaEstudiante } from "../interfaces/MateriaEstudiante";
import supabase from "../services/supabase";

export async function ListaMateriasEstudiante(
  matricula: string,
  idPeriodo: string
): Promise<MateriaEstudiante[] | null> {
  const { data, error } = await supabase.rpc("materias_del_estudiante", {
    p_matricula: matricula,
    p_id_periodo: idPeriodo,
  });

  if (error) {
    console.error("Error", error.message);
    return null;
  }

  return (data as FilaMateria[]).map((m) => ({
    id: m.id_materia_curso,
    codigo_materia: m.codigo_materia,
    nombre: m.materia,
  }));
}