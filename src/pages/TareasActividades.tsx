import { useEffect, useState } from "react";
import SelectField from "../components/SelectField";
import { ListaMateriasEstudiante } from "../Controllers/EstudiantetTareaController";
import { useAuth } from "../hooks/useAuth";
// ---------- Tipos ----------

interface MateriaEstudiante {
  id: number;
  nombre: string;
}

interface TareaEstudiante {
  id: number;
  titulo: string;
  descripcion: string;
  instrucciones: string;
  fechaEntrega: string; // YYYY-MM-DD
  nota: number | null;
}


const PERIODO_ACTUAL = "26-27";

const TAREAS_PRUEBA: Record<number, TareaEstudiante[]> = {
  1: [
    {
      id: 101,
      titulo: "Fracciones en la cocina",
      descripcion:
        "Resuelve problemas de suma y resta de fracciones usando recetas sencillas.",
      instrucciones:
        "1. Elige una receta de tu casa.\n2. Escribe las cantidades como fracciones.\n3. Suma los ingredientes secos y resta lo que ya usaste.\n4. Entrega el procedimiento completo.",
      fechaEntrega: "2026-10-30",
      nota: null,
    },
    {
      id: 102,
      titulo: "Problemas de proporcionalidad",
      descripcion: "Ejercicios de regla de tres con situaciones del día a día.",
      instrucciones:
        "Resuelve los 5 problemas planteados y explica cada paso con tus palabras.",
      fechaEntrega: "2026-10-20",
      nota: 92,
    },
  ],
  2: [
    {
      id: 201,
      titulo: "Reseña de un cuento",
      descripcion: "Escribe una reseña breve de un cuento que hayas leído.",
      instrucciones:
        "Máximo una página. Incluye el tema, los personajes y tu opinión.",
      fechaEntrega: "2026-11-02",
      nota: null,
    },
  ],
  3: [],
};

// "2026-10-30" -> "30/10/2026" (sin pasar por Date para evitar desfases de zona horaria)
const formatearFecha = (fecha: string) => {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

function TareasActividades() {
  // ---------- Estados ----------
  const { estudiante } = useAuth();
const matricula = estudiante?.matricula;
  const [listaMaterias, setListaMaterias] = useState<MateriaEstudiante[]>([]);
  const [listaTareas, setListaTareas] = useState<TareaEstudiante[]>([]);
  const [materiaId, setMateriaId] = useState("");
  const [tareaDetalle, setTareaDetalle] = useState<TareaEstudiante | null>(
    null,
  );

  // ---------- Carga inicial de materias ----------
  useEffect(() => {
    if (!matricula) return;
    let cancelado = false;

    ListaMateriasEstudiante(matricula, PERIODO_ACTUAL).then((materias) => {
      if (!cancelado) setListaMaterias(materias ?? []);
    });

    return () => {
      cancelado = true;
    };
  }, [matricula]);

  // ---------- Cerrar el detalle con Escape ----------
  useEffect(() => {
    if (!tareaDetalle) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTareaDetalle(null);
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [tareaDetalle]);

  const opcionesMaterias = listaMaterias.map((m) => ({
    id: m.id,
    nombre: m.nombre,
  }));

  // ---------- Handlers ----------
  const handleMateriaChange = (value: string) => {
    setMateriaId(value);
    setTareaDetalle(null);

    if (!value) {
      setListaTareas([]);
      return;
    }

    // TODO: reemplazar por la función que trae las tareas de la materia
    setListaTareas(TAREAS_PRUEBA[Number(value)] ?? []);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-800">Mis tareas</h1>

      {/* Select de materias */}
      <div className="flex flex-wrap items-end gap-4">
        <SelectField
          id="materia"
          label="Materia"
          opciones={listaMaterias}
          value={materiaId}
          onChange={handleMateriaChange}
          placeholder="Selecciona una materia"
        />
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Tarea</th>
              <th className="px-4 py-3 font-medium">Fecha de entrega</th>
              <th className="px-4 py-3 font-medium">Nota</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiaId === "" ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Selecciona una materia para ver tus tareas
                </td>
              </tr>
            ) : listaTareas.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Esta materia no tiene tareas asignadas
                </td>
              </tr>
            ) : (
              listaTareas.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 text-slate-800">{t.titulo}</td>
                  <td className="px-4 py-3 text-slate-800">
                    {formatearFecha(t.fechaEntrega)}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {t.nota ?? "Sin calificar"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setTareaDetalle(t)}
                      className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detalle de la tarea */}
      {tareaDetalle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setTareaDetalle(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-titulo"
            className="flex max-h-[85vh] w-full max-w-xl flex-col gap-5 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="detalle-titulo"
                className="text-xl font-semibold text-slate-800"
              >
                {tareaDetalle.titulo}
              </h2>
              <button
                onClick={() => setTareaDetalle(null)}
                aria-label="Cerrar detalle"
                className="cursor-pointer rounded-md px-2 text-2xl leading-none text-slate-400 transition hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <dl className="flex gap-8 text-sm">
              <div>
                <dt className="text-slate-500">Fecha de entrega</dt>
                <dd className="font-medium text-slate-800">
                  {formatearFecha(tareaDetalle.fechaEntrega)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Nota</dt>
                <dd className="font-medium text-slate-800">
                  {tareaDetalle.nota ?? "Sin calificar"}
                </dd>
              </div>
            </dl>

            <section className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-slate-700">
                Descripción
              </h3>
              <p className="text-sm text-slate-800">
                {tareaDetalle.descripcion}
              </p>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-slate-700">
                Instrucciones
              </h3>
              <p className="whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
                {tareaDetalle.instrucciones}
              </p>
            </section>

            <button
              onClick={() => setTareaDetalle(null)}
              className="h-11 cursor-pointer self-end rounded-lg border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TareasActividades;
