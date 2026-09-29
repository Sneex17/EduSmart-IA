import { useMemo, useState } from "react";
import SelectField from "../components/SelectField";
import DateField from "../components/DateField";

// ---------- Tipos ----------
type Curso = { id: number; nombre: string };
type Materia = { id: number; nombre: string; cursoId: number };
type Estudiante = {
  id: number;
  nombre: string;
  correo: string;
  cursoId: number;
};

// ---------- Datos de prueba (reemplazar por tus datos reales) ----------
const cursosMock: Curso[] = [
  { id: 1, nombre: "1ro A" },
  { id: 2, nombre: "2do B" },
  { id: 3, nombre: "3ro C" },
];

const materiasMock: Materia[] = [
  { id: 1, nombre: "Matemáticas", cursoId: 1 },
  { id: 2, nombre: "Lengua Española", cursoId: 1 },
  { id: 3, nombre: "Ciencias Naturales", cursoId: 2 },
  { id: 4, nombre: "Historia", cursoId: 2 },
  { id: 5, nombre: "Inglés", cursoId: 3 },
];

const estudiantesMock: Estudiante[] = [
  { id: 1, nombre: "Ana Pérez", correo: "ana@correo.com", cursoId: 1 },
  { id: 2, nombre: "Luis Gómez", correo: "luis@correo.com", cursoId: 1 },
  { id: 3, nombre: "María Rosario", correo: "maria@correo.com", cursoId: 2 },
  { id: 4, nombre: "Carlos Díaz", correo: "carlos@correo.com", cursoId: 3 },
];

// Fecha de hoy en formato YYYY-MM-DD usando la hora local
// (toISOString usa UTC y en la noche podría devolver el día siguiente)
const obtenerHoy = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};

function AsignarTarea() {
  // Cuando tengas la API, cambia estos por useState + useEffect
  const cursos = cursosMock;
  const materias = materiasMock;
  const estudiantes = estudiantesMock;

  const [descripcion, setDescripcion] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  // Materias y estudiantes dependen del curso seleccionado
  const materiasDelCurso = useMemo(
    () => materias.filter((m) => m.cursoId === Number(cursoId)),
    [materias, cursoId]
  );

  const estudiantesDelCurso = useMemo(
    () => estudiantes.filter((e) => e.cursoId === Number(cursoId)),
    [estudiantes, cursoId]
  );

  const handleCursoChange = (value: string) => {
    setCursoId(value);
    setMateriaId(""); // al cambiar de curso se reinicia la materia
  };

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
      estudiantes: estudiantesDelCurso,
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
          opciones={cursos}
          value={cursoId}
          onChange={handleCursoChange}
          placeholder="Selecciona un curso"
        />

        <SelectField
          id="materia"
          label="Materia"
          opciones={materiasDelCurso}
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
              <th className="px-4 py-3 font-medium">Estudiante</th>
              <th className="px-4 py-3 font-medium">Correo</th>
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
            ) : estudiantesDelCurso.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Este curso no tiene estudiantes
                </td>
              </tr>
            ) : (
              estudiantesDelCurso.map((est, i) => (
                <tr
                  key={est.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 text-slate-800">{est.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{est.correo}</td>
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