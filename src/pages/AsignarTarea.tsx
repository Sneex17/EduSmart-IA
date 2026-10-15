import { useEffect, useState } from "react";
import SelectField from "../components/SelectField";
import DateField from "../components/DateField";
import {
  ListaCursos,
  ListaMateriasPorCurso,
  type materias,
  ListaEstudiantesPorCurso,
} from "../Controllers/CursoController";
import { GenerarTarea } from "../Controllers/GenerarTareaController"; // ajusta la ruta según dónde guardaste el servicio
import type estudiantes from "../interfaces/estudiantes";
import type curso from "../interfaces/curso";

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

const quitarAcentos = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Correo provisional: nombres.apellidos@edusmart.edu.do (sin tildes ni espacios)
const armarCorreo = (e: { nombres: string; apellidos: string }) =>
  `${quitarAcentos(e.nombres)}.${quitarAcentos(e.apellidos)}`
    .toLowerCase()
    .replace(/\s+/g, "") + "@edusmart.edu.do";

function AsignarTarea() {
  // ---------- Estados ----------
  const [listaCursos, setListaCursos] = useState<curso[]>([]);
  const [listaMaterias, setListaMaterias] = useState<materias[]>([]);
  const [listaEstudiantes, setListaEstudiantes] = useState<estudiantes[]>([]);

  const [descripcion, setDescripcion] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [cargando, setCargando] = useState(false);

  // ---------- Carga inicial de cursos ----------
  useEffect(() => {
    ListaCursos(ID_DOCENTE, ID_PERIODO).then((data) =>
      setListaCursos(data ?? []),
    );
  }, []);

  // ---------- Opciones de los selects ----------
  const opcionesCursos = listaCursos.map((c) => ({
    id: c.id_curso,
    nombre: c.curso,
  }));

  const opcionesMaterias = listaMaterias.map((m) => ({
    id: m.id_docente_curso_detalle,
    nombre: m.materia,
  }));

  // ---------- Handlers ----------
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
    setListaEstudiantes(
      (estudiantesData ?? []).map((e) => ({
        ...e,
        correo: armarCorreo(e),
        perfil: "leer, dormir y jugar", // reemplazar por el dato real cuando exista
      })),
    );
  };

  const puedeAsignar =
    descripcion.trim() !== "" &&
    cursoId !== "" &&
    materiaId !== "" &&
    fechaEntrega !== "";

  const handleAsignar = async () => {
    const nombreCurso =
      listaCursos.find((c) => String(c.id_curso) === cursoId)?.curso ?? "";
    const nombreMateria =
      listaMaterias.find(
        (m) => String(m.id_docente_curso_detalle) === materiaId,
      )?.materia ?? "";

    try {
      setCargando(true);

      const resultado = await GenerarTarea(
        {
          Tarea: descripcion,
          Curso: nombreCurso,
          Materia: nombreMateria,
          Fecha: fechaEntrega,
        },
        listaEstudiantes,
      );

      // TODO: guardar Tarea + DetalleTarea en la BD con estado "generada"
      console.log(resultado);
    } catch {
      alert("No se pudo generar la tarea. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
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
          disabled={!puedeAsignar || cargando}
          className="h-11 cursor-pointer rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cargando ? "Generando..." : "Asignar tarea"}
        </button>
      </div>

      {/* Tabla de estudiantes */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Matrícula</th>
              <th className="px-4 py-3 font-medium">Estudiante</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Perfil Estudiante</th>
            </tr>
          </thead>
          <tbody>
            {cursoId === "" ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Selecciona un curso para ver los estudiantes
                </td>
              </tr>
            ) : listaEstudiantes.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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
                  <td className="px-4 py-3 text-slate-800">
                    {est.nombres} {est.apellidos}
                  </td>
                  <td className="px-4 py-3 text-slate-800">{est.correo}</td>
                  <td className="px-4 py-3 text-slate-800">{est.perfil}</td>
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