import { useMemo, useState } from "react";
import SelectField from "../components/SelectField";
import DateField from "../components/DateField";

// ---------- Estados ----------
const ESTADO = { GENERADA: 1, ENVIADA: 2 } as const;
const estadoLabel: Record<number, string> = {
  [ESTADO.GENERADA]: "Generada",
  [ESTADO.ENVIADA]: "Enviada",
};

// ---------- Tipos ----------
type Curso = { id: number; nombre: string };
type Materia = { id: number; nombre: string; cursoId: number };

type Tarea = {
  idTarea: number;
  idDocente: number;
  idCurso: number;
  idMateria: number;
  descripcion: string;
  fecha: string; // YYYY-MM-DD
  estado: number;
};

type DetalleTarea = {
  idTarea: number;
  idEstudiante: number;
  nombreEstudiante: string;
  tarea: string;
  nota: number | null;
  estado: number;
};

// ---------- Datos de prueba (reemplazar por tus datos reales) ----------
const cursosMock: Curso[] = [
  { id: 1, nombre: "1ro A" },
  { id: 2, nombre: "2do B" },
];

const materiasMock: Materia[] = [
  { id: 1, nombre: "Matemáticas", cursoId: 1 },
  { id: 2, nombre: "Lengua Española", cursoId: 1 },
  { id: 3, nombre: "Ciencias Naturales", cursoId: 2 },
];

const tareasMock: Tarea[] = [
  {
    idTarea: 1,
    idDocente: 1,
    idCurso: 1,
    idMateria: 1,
    descripcion: "Resolver los ejercicios de fracciones de la página 45",
    fecha: "2026-10-05",
    estado: ESTADO.GENERADA,
  },
  {
    idTarea: 2,
    idDocente: 1,
    idCurso: 1,
    idMateria: 1,
    descripcion: "Investigar sobre los números decimales y sus usos",
    fecha: "2026-10-12",
    estado: ESTADO.ENVIADA,
  },
  {
    idTarea: 3,
    idDocente: 1,
    idCurso: 1,
    idMateria: 2,
    descripcion: "Redactar un texto narrativo de una página",
    fecha: "2026-10-08",
    estado: ESTADO.GENERADA,
  },
];

const detallesMock: DetalleTarea[] = [
  { idTarea: 1, idEstudiante: 1, nombreEstudiante: "Ana Pérez", tarea: "Ana: resolver los ejercicios 1 al 10 de fracciones", nota: null, estado: ESTADO.GENERADA },
  { idTarea: 1, idEstudiante: 2, nombreEstudiante: "Luis Gómez", tarea: "Luis: resolver los ejercicios 5 al 15 de fracciones", nota: null, estado: ESTADO.GENERADA },
  { idTarea: 2, idEstudiante: 1, nombreEstudiante: "Ana Pérez", tarea: "Ana: investigar usos de los decimales en el comercio", nota: 90, estado: ESTADO.ENVIADA },
  { idTarea: 2, idEstudiante: 2, nombreEstudiante: "Luis Gómez", tarea: "Luis: investigar usos de los decimales en la cocina", nota: null, estado: ESTADO.ENVIADA },
  { idTarea: 3, idEstudiante: 1, nombreEstudiante: "Ana Pérez", tarea: "Ana: texto narrativo sobre un viaje", nota: null, estado: ESTADO.GENERADA },
  { idTarea: 3, idEstudiante: 2, nombreEstudiante: "Luis Gómez", tarea: "Luis: texto narrativo sobre un sueño", nota: null, estado: ESTADO.GENERADA },
];

// =====================================================================
// FUNCIONES A REEMPLAZAR (por ahora simulan la espera con un setTimeout)
// =====================================================================
const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

// REEMPLAZAR: llamada a n8n. Debe devolver el arreglo JSON de DetalleTarea.
const regenerarDetalles = async (
  tarea: Tarea,
  actuales: DetalleTarea[]
): Promise<DetalleTarea[]> => {
  await esperar(1500);
  return actuales.map((d) => ({
    ...d,
    tarea: `${d.nombreEstudiante.split(" ")[0]}: ${tarea.descripcion}`,
  }));
};

// REEMPLAZAR: guarda la tarea editada en la base de datos.
const actualizarTarea = async (_tarea: Tarea): Promise<void> => {
  await esperar(300);
};

// REEMPLAZAR: guarda en la base de datos los detalles que devolvió n8n.
const guardarDetalles = async (
  _idTarea: number,
  _detalles: DetalleTarea[]
): Promise<void> => {
  await esperar(300);
};
// =====================================================================

// ---------- Utilidades ----------
const obtenerHoy = () => {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
};

function EstadoBadge({ estado }: { estado: number }) {
  const estilos =
    estado === ESTADO.ENVIADA
      ? "bg-green-100 text-green-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estilos}`}>
      {estadoLabel[estado] ?? "Desconocido"}
    </span>
  );
}

const btnBase =
  "rounded-md px-3 py-1.5 text-xs font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";
const btnNeutro = `${btnBase} border border-slate-300 text-slate-700 hover:bg-slate-100`;
const btnPrimario = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
const btnPeligro = `${btnBase} border border-red-300 text-red-600 hover:bg-red-50`;

function EnviarTarea() {
  // Cuando tengas la API, cambia estos por useState + useEffect
  const cursos = cursosMock;
  const materias = materiasMock;
  const [tareas, setTareas] = useState<Tarea[]>(tareasMock);
  const [detalles, setDetalles] = useState<DetalleTarea[]>(detallesMock);

  const [cursoId, setCursoId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [tareaDetalleId, setTareaDetalleId] = useState<number | null>(null);

  // Edición de la tarea general (modal)
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null);
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState("");

  // Edición del texto de un estudiante (en la fila)
  const [editandoEstudianteId, setEditandoEstudianteId] = useState<number | null>(null);
  const [draftDetalle, setDraftDetalle] = useState("");

  const materiasDelCurso = useMemo(
    () => materias.filter((m) => m.cursoId === Number(cursoId)),
    [materias, cursoId]
  );

  const tareasFiltradas = useMemo(
    () =>
      materiaId === ""
        ? []
        : tareas.filter(
            (t) =>
              t.idCurso === Number(cursoId) &&
              t.idMateria === Number(materiaId)
          ),
    [tareas, cursoId, materiaId]
  );

  const tareaSeleccionada =
    tareas.find((t) => t.idTarea === tareaDetalleId) ?? null;

  const detallesSeleccionados = detalles.filter(
    (d) => d.idTarea === tareaDetalleId
  );

  const detalleEditable = tareaSeleccionada?.estado === ESTADO.GENERADA;

  // ---------- Filtros ----------
  const handleCursoChange = (value: string) => {
    setCursoId(value);
    setMateriaId("");
    setTareaDetalleId(null);
    setEditandoEstudianteId(null);
  };

  const handleMateriaChange = (value: string) => {
    setMateriaId(value);
    setTareaDetalleId(null);
    setEditandoEstudianteId(null);
  };

  // ---------- Acciones de la tabla de tareas ----------
  const verDetalle = (t: Tarea) => {
    setTareaDetalleId(t.idTarea);
    setEditandoEstudianteId(null);
  };

  const eliminarTarea = (t: Tarea) => {
    if (!window.confirm("¿Eliminar esta tarea y su detalle?")) return;
    // TODO: llamada a la API para eliminar
    setTareas((prev) => prev.filter((x) => x.idTarea !== t.idTarea));
    setDetalles((prev) => prev.filter((d) => d.idTarea !== t.idTarea));
    if (tareaDetalleId === t.idTarea) setTareaDetalleId(null);
  };

  const enviarTarea = (t: Tarea) => {
    if (!window.confirm("¿Enviar esta tarea a los estudiantes?")) return;
    // TODO: llamada a la API / n8n para enviar
    setTareas((prev) =>
      prev.map((x) =>
        x.idTarea === t.idTarea ? { ...x, estado: ESTADO.ENVIADA } : x
      )
    );
    setDetalles((prev) =>
      prev.map((d) =>
        d.idTarea === t.idTarea ? { ...d, estado: ESTADO.ENVIADA } : d
      )
    );
    if (tareaDetalleId === t.idTarea) setEditandoEstudianteId(null);
  };

  // ---------- Editar tarea general ----------
  const abrirEditar = (t: Tarea) => {
    setTareaEditando(t);
    setEditDescripcion(t.descripcion);
    setEditFecha(t.fecha);
    setErrorEdicion("");
  };

  const cerrarEditar = () => {
    if (guardando) return;
    setTareaEditando(null);
  };

  const puedeGuardarEdicion =
    editDescripcion.trim() !== "" && editFecha !== "";

  const guardarEdicion = async () => {
    if (!tareaEditando || !puedeGuardarEdicion || guardando) return;

    const nuevaDescripcion = editDescripcion.trim();
    const cambioDescripcion = nuevaDescripcion !== tareaEditando.descripcion;
    const tareaActualizada: Tarea = {
      ...tareaEditando,
      descripcion: nuevaDescripcion,
      fecha: editFecha,
    };

    setGuardando(true);
    setErrorEdicion("");

    try {
      let nuevosDetalles: DetalleTarea[] | null = null;

      // 1. Solo si cambió la descripción, n8n genera los nuevos detalles
      if (cambioDescripcion) {
        const actuales = detalles.filter(
          (d) => d.idTarea === tareaActualizada.idTarea
        );
        nuevosDetalles = await regenerarDetalles(tareaActualizada, actuales);
      }

      // 2. Se guarda en la base de datos
      await actualizarTarea(tareaActualizada);
      if (nuevosDetalles) {
        await guardarDetalles(tareaActualizada.idTarea, nuevosDetalles);
      }

      // 3. Recién ahora se actualiza la pantalla
      setTareas((prev) =>
        prev.map((t) =>
          t.idTarea === tareaActualizada.idTarea ? tareaActualizada : t
        )
      );
      if (nuevosDetalles) {
        const detallesNuevos = nuevosDetalles;
        setDetalles((prev) => [
          ...prev.filter((d) => d.idTarea !== tareaActualizada.idTarea),
          ...detallesNuevos,
        ]);
        if (tareaDetalleId === tareaActualizada.idTarea) {
          setEditandoEstudianteId(null);
        }
      }

      setTareaEditando(null);
    } catch (error) {
      console.error(error);
      setErrorEdicion("No se pudo guardar el cambio. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  // ---------- Editar detalle de un estudiante ----------
  const empezarEditarDetalle = (d: DetalleTarea) => {
    setEditandoEstudianteId(d.idEstudiante);
    setDraftDetalle(d.tarea);
  };

  const guardarDetalle = () => {
    if (editandoEstudianteId === null || draftDetalle.trim() === "") return;
    // TODO: llamada a la API para actualizar el detalle
    setDetalles((prev) =>
      prev.map((d) =>
        d.idTarea === tareaDetalleId && d.idEstudiante === editandoEstudianteId
          ? { ...d, tarea: draftDetalle.trim() }
          : d
      )
    );
    setEditandoEstudianteId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-800">Enviar tarea</h1>

      {/* Filtros */}
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
          onChange={handleMateriaChange}
          placeholder="Selecciona una materia"
          disabled={cursoId === ""}
        />
      </div>

      {/* Tabla de tareas */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Fecha de entrega</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiaId === "" ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  Selecciona un curso y una materia para ver las tareas
                </td>
              </tr>
            ) : tareasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                  Esta materia no tiene tareas
                </td>
              </tr>
            ) : (
              tareasFiltradas.map((t) => {
                const bloqueada = t.estado === ESTADO.ENVIADA;
                return (
                  <tr
                    key={t.idTarea}
                    className={`border-t border-slate-100 ${
                      t.idTarea === tareaDetalleId ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-800">{t.descripcion}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{t.fecha}</td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={t.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button className={btnNeutro} onClick={() => verDetalle(t)}>
                          Ver detalle
                        </button>
                        <button
                          className={btnNeutro}
                          onClick={() => abrirEditar(t)}
                          disabled={bloqueada}
                          title={bloqueada ? "Una tarea enviada no se puede editar" : undefined}
                        >
                          Editar
                        </button>
                        <button
                          className={btnPrimario}
                          onClick={() => enviarTarea(t)}
                          disabled={bloqueada}
                          title={bloqueada ? "Esta tarea ya fue enviada" : undefined}
                        >
                          Enviar
                        </button>
                        <button
                          className={btnPeligro}
                          onClick={() => eliminarTarea(t)}
                          disabled={bloqueada}
                          title={bloqueada ? "Una tarea enviada no se puede eliminar" : undefined}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tabla de detalle por estudiante */}
      {tareaSeleccionada && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Detalle por estudiante
            </h2>
            <button className={btnNeutro} onClick={() => setTareaDetalleId(null)}>
              Cerrar detalle
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Estudiante</th>
                  <th className="px-4 py-3 font-medium">Tarea</th>
                  <th className="px-4 py-3 font-medium">Nota</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detallesSeleccionados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      Esta tarea no tiene detalle
                    </td>
                  </tr>
                ) : (
                  detallesSeleccionados.map((d) => {
                    const enEdicion = editandoEstudianteId === d.idEstudiante;
                    return (
                      <tr key={d.idEstudiante} className="border-t border-slate-100">
                        <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                          {d.nombreEstudiante}
                        </td>
                        <td className="w-1/2 px-4 py-3 text-slate-700">
                          {enEdicion ? (
                            <textarea
                              rows={2}
                              value={draftDetalle}
                              onChange={(e) => setDraftDetalle(e.target.value)}
                              className="w-full resize-none rounded-lg border border-slate-300 p-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                            />
                          ) : (
                            d.tarea
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{d.nota ?? "—"}</td>
                        <td className="px-4 py-3">
                          <EstadoBadge estado={d.estado} />
                        </td>
                        <td className="px-4 py-3">
                          {enEdicion ? (
                            <div className="flex gap-2">
                              <button
                                className={btnPrimario}
                                onClick={guardarDetalle}
                                disabled={draftDetalle.trim() === ""}
                              >
                                Guardar
                              </button>
                              <button
                                className={btnNeutro}
                                onClick={() => setEditandoEstudianteId(null)}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              className={btnNeutro}
                              onClick={() => empezarEditarDetalle(d)}
                              disabled={!detalleEditable}
                              title={!detalleEditable ? "Una tarea enviada no se puede editar" : undefined}
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de edición de la tarea */}
      {tareaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-800">Editar tarea</h2>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="editDescripcion"
                className="text-sm font-medium text-slate-700"
              >
                Descripción de la tarea
              </label>
              <textarea
                id="editDescripcion"
                rows={4}
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
                disabled={guardando}
                className="resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-100"
              />
            </div>

            <DateField
              id="editFecha"
              label="Fecha de entrega"
              value={editFecha}
              onChange={setEditFecha}
              min={obtenerHoy()}
              disabled={guardando}
            />

            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              Si cambias la descripción, n8n generará de nuevo el detalle de
              todos los estudiantes y se perderán las ediciones individuales.
            </p>

            {errorEdicion && (
              <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {errorEdicion}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                className={btnNeutro}
                onClick={cerrarEditar}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                className={btnPrimario}
                onClick={guardarEdicion}
                disabled={!puedeGuardarEdicion || guardando}
              >
                {guardando ? "Generando detalle..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnviarTarea;