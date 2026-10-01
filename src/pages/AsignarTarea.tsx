import { useEffect, useState } from "react";
import SelectField from "../components/SelectField";
import DateField from "../components/DateField";
import {
  type cursos,
  ListaCursos,
  ListaMateriasPorCurso,
  type materias,
  ListaEstudiantesPorCurso,
  type estudiantes,
} from "../Controllers/CursoController";

// ---------- Datos de prueba (reemplazar por tus datos reales) ----------

const ID_DOCENTE = 1;
const ID_PERIODO = "26-27";

// Fecha de hoy en formato YYYY-MM-DD usando la hora local
// (toISOString usa UTC y en la noche podría devolver el día siguiente)
const obtenerHoy = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};

function AsignarTarea() {
  const [listaCursos, setListaCursos] = useState<cursos[]>([]);

  useEffect(() => {
    ListaCursos(ID_DOCENTE, ID_PERIODO).then((data) =>
      setListaCursos(data ?? []),
    );
  }, []);

  const opcionesCursos = listaCursos.map((c) => ({
    id: c.id_curso,
    nombre: c.curso,
  }));

  const [listaMaterias, setListaMaterias] = useState<materias[]>([]);
  const [materiaId, setMateriaId] = useState("");
  const [listaEstudiantes, setListaEstudiantes] = useState<estudiantes[]>([]);

  const handleCursoChange = async (value: string) => {
    setCursoId(value);
    setMateriaId("");
    setListaMaterias([]);
    setListaEstudiantes([]);

    if (!value) return;

    const [materiasData, estudiantesData] = await Promise.all([
      ListaMateriasPorCurso(ID_DOCENTE, Number(value), ID_PERIODO),
      ListaEstudiantesPorCurso(Number(value), ID_PERIODO),
    ]);

    setListaMaterias(materiasData ?? []);
    setListaEstudiantes(estudiantesData ?? []);
  };

  const opcionesMaterias = listaMaterias.map((m) => ({
    id: m.id_docente_curso_detalle,
    nombre: m.materia,
  }));

  // Cuando tengas la API, cambia estos por useState + useEffect



  const [descripcion, setDescripcion] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  // Materias y estudiantes dependen del curso seleccionado



  const puedeAsignar =
    descripcion.trim() !== "" &&
    cursoId !== "" &&
    materiaId !== "" &&
    fechaEntrega !== "";

  const handleAsignar = () => {
    // TODO: aquí va la llamada al webhook de n8n
    console.log({
      descripcion,
      cursoId: Number(cursoId),
      materiaId: Number(materiaId),
      fechaEntrega,

    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-800">Asignar tarea</h1>

      {/* Descripción */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="descripcion"
          className="text-sm font-medium text-slate-700"
        >
          Descripción de la tarea
        </label>
        <textarea
          id="descripcion"
          rows={4}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe la tarea que quieres generar..."
          className="resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Selects + fecha + botón */}
      <div className="flex flex-wrap items-end gap-4">
        <SelectField
          id="curso"
          label="Curso"
          opciones={opcionesCursos}
          value={cursoId}
          onChange={handleCursoChange}
          placeholder="Selecciona un curso"
        />

        <SelectField
          id="materia"
          label="Materia"
          opciones={opcionesMaterias}
          value={materiaId}
          onChange={setMateriaId}
          placeholder="Selecciona una materia"
          disabled={cursoId === ""}
        />

        <DateField
          id="fechaEntrega"
          label="Fecha de entrega"
          value={fechaEntrega}
          onChange={setFechaEntrega}
          min={obtenerHoy()}
        />

        <button
          onClick={handleAsignar}
          disabled={!puedeAsignar}
          className="h-11 cursor-pointer rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Asignar tarea
        </button>
      </div>

      {/* Tabla de estudiantes */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Matricúla</th>
              <th className="px-4 py-3 font-medium">Estudiante</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Pasatiempo</th>
              
            </tr>
          </thead>
          <tbody>
            {cursoId === "" ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Selecciona un curso para ver los estudiantes
                </td>
              </tr>
            ) : listaEstudiantes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Este curso no tiene estudiantes
                </td>
              </tr>
            ) : (
              listaEstudiantes.map((est, i) => (
                <tr
                  key={est.matricula}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 text-slate-800">{est.matricula}</td>
                  <td className="px-4 py-3 text-slate-800">{est.nombres} {est.apellidos}</td>
                  <td className="px-4 py-3 text-slate-800">{est.nombres}.{est.apellidos}@edusmart.edu.do</td>
                  <td className="px-4 py-3 text-slate-800">leer, dormir y jugar</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AsignarTarea;
