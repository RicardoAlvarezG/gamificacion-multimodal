"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  grado: string;
  docenteId?: number | null;
  creadoPorId?: number | null;
};

type Estudiante = {
  id: number;
  nombres: string;
  apellidos: string;
  perfil?: {
    avatar?: string | null;
    nivel: number;
    puntosTotal: number;
  } | null;
};

type Capacidad = {
  id: number;
  codigo: string;
  nombre: string;
  area: string;
  color: string;
};

type Juego = {
  id: number;
  nombre: string;
  grado: string;
  descripcion?: string | null;
  capacidades: {
    capacidad: Capacidad;
  }[];
};

export default function DocenteJuegosPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);

  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);

  const [evaluaciones, setEvaluaciones] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [loadingJuegos, setLoadingJuegos] = useState(false);

  const fechaActual = new Date().toLocaleDateString("es-PE");
  const nombreSesion = "Sesión 1";

  const cargarAulas = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) return;

      const usuario = JSON.parse(usuarioGuardado);

      const res = await fetch("/api/aulas");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar aulas");
        return;
      }

      let aulasFiltradas = [];

      if (usuario.rol === "DOCENTE") {
        if (usuario.institucionId) {
          aulasFiltradas = data.filter(
            (aula: Aula) => aula.docenteId === usuario.id
          );
        } else {
          aulasFiltradas = data.filter(
            (aula: Aula) => aula.creadoPorId === usuario.id
          );
        }
      }

      setAulas(aulasFiltradas);
    } catch (error) {
      console.error("Error cargando aulas:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarJuegosPorGrado = async (grado: string) => {
    try {
      setLoadingJuegos(true);

      const res = await fetch(`/api/juegos?grado=${grado}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar juegos");
        return;
      }

      setJuegos(data);
    } catch (error) {
      console.error("Error cargando juegos:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoadingJuegos(false);
    }
  };

  const iniciarJuego = async () => {
    if (!aulaSeleccionada || !juegoSeleccionado) return;

    try {
      const res = await fetch(`/api/aulas/${aulaSeleccionada.id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar estudiantes");
        return;
      }

      const estudiantesAula = data.estudiantes || [];

      setEstudiantes(estudiantesAula);
      setJuegoIniciado(true);
      setJuegoFinalizado(false);
      setSesionActiva(true);
      setEvaluaciones({});

      alert("Juego iniciado correctamente.");
    } catch (error) {
      console.error("Error al iniciar juego:", error);
      alert("Error al iniciar juego");
    }
  };

  const toggleEvaluacion = (estudianteId: number, capacidadId: number) => {
    const key = `${estudianteId}-${capacidadId}`;

    setEvaluaciones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const cambiarAula = () => {
    setAulaSeleccionada(null);
    setJuegoSeleccionado(null);
    setJuegoIniciado(false);
    setJuegoFinalizado(false);
    setSesionActiva(false);
    setEstudiantes([]);
    setEvaluaciones({});
  };

  const guardarEvaluacion = () => {
    alert("Evaluación guardada correctamente.");

    setJuegoFinalizado(false);
    setJuegoIniciado(false);
    setJuegoSeleccionado(null);
    setEvaluaciones({});
  };

  const finalizarSesion = () => {
    setSesionActiva(false);
    setJuegoFinalizado(false);
    setJuegoIniciado(false);
    setJuegoSeleccionado(null);
    setAulaSeleccionada(null);
    setEstudiantes([]);
    setEvaluaciones({});

    alert("Sesión finalizada correctamente.");
  };

  useEffect(() => {
    cargarAulas();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🎮
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Juegos
              </h1>
              <p className="mt-2 text-lg text-slate-700">
                Selecciona un aula y crea una sesión de juego.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/docente"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105"
          >
            ← Regresar
          </Link>
        </div>

        {loading && (
          <p className="text-xl font-bold text-slate-600">
            Cargando aulas...
          </p>
        )}

        {!loading && !aulaSeleccionada && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {aulas.map((aula) => (
              <button
                key={aula.id}
                onClick={() => {
                  setAulaSeleccionada(aula);
                  setJuegoSeleccionado(null);
                  setJuegoIniciado(false);
                  setJuegoFinalizado(false);
                  setEstudiantes([]);
                  setEvaluaciones({});
                  cargarJuegosPorGrado(aula.grado);
                }}
                className="rounded-[2rem] bg-purple-100 p-8 text-left shadow-xl transition hover:scale-[1.02]"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  🏫
                </div>

                <h2 className="text-3xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-4 font-semibold text-slate-700">
                  Click para crear sesión
                </p>
              </button>
            ))}
          </div>
        )}

        {aulaSeleccionada && !juegoIniciado && !juegoFinalizado && (
          <div className="mx-auto max-w-xl rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl shadow-md">
                🏫
              </div>

              <h2 className="text-3xl font-extrabold text-purple-700">
                {aulaSeleccionada.nombre}
              </h2>

              <p className="mt-2 font-semibold text-slate-600">
                Crea una sesión para iniciar los juegos del aula.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 shadow-md">
              <p className="mb-3 text-slate-700">
                📌 <strong>Nombre de sesión:</strong> {nombreSesion}
              </p>

              <p className="mb-3 text-slate-700">
                📅 <strong>Fecha:</strong> {fechaActual}
              </p>

              <p className="text-slate-700">
                🏫 <strong>Aula:</strong> {aulaSeleccionada.nombre}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-white/80 p-6 shadow-md">
              <h3 className="mb-4 text-xl font-extrabold text-purple-700">
                Juegos disponibles
              </h3>

              {loadingJuegos ? (
                <p>Cargando juegos...</p>
              ) : juegos.length === 0 ? (
                <p className="font-semibold text-slate-600">
                  No hay juegos registrados para este grado.
                </p>
              ) : (
                <div className="space-y-3">
                  {juegos.map((juego) => (
                    <button
                      key={juego.id}
                      onClick={() => setJuegoSeleccionado(juego)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        juegoSeleccionado?.id === juego.id
                          ? "border-green-500 bg-green-100"
                          : "border-purple-200 bg-white"
                      }`}
                    >
                      <div className="font-bold text-purple-700">
                        {juego.nombre}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {juego.capacidades.map((c) => (
                          <span
                            key={c.capacidad.id}
                            className="rounded-full px-3 py-1 text-xs font-bold text-white"
                            style={{
                              backgroundColor: c.capacidad.color,
                            }}
                          >
                            {c.capacidad.nombre}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-7 flex gap-4">
              <button
                onClick={cambiarAula}
                className="flex-1 rounded-2xl bg-white px-6 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105"
              >
                ← Cambiar aula
              </button>

              <button
                onClick={iniciarJuego}
                disabled={!juegoSeleccionado}
                className="flex-1 rounded-2xl bg-green-400 px-6 py-4 font-bold text-green-950 shadow-md transition hover:scale-105 disabled:opacity-50"
              >
                ▶ Iniciar juego
              </button>
            </div>
          </div>
        )}

        {juegoIniciado && juegoSeleccionado && (
          <div className="mx-auto mt-8 max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="mb-4 text-3xl font-extrabold text-purple-700">
              🎮 {juegoSeleccionado.nombre}
            </h2>

            <p className="mb-6 text-slate-600">
              Juego en ejecución...
            </p>

            <button
              onClick={() => {
                setJuegoIniciado(false);
                setJuegoFinalizado(true);
              }}
              className="rounded-2xl bg-red-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105"
            >
              ⏹ Finalizar Juego
            </button>
          </div>
        )}

        {juegoFinalizado && juegoSeleccionado && (
          <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-3xl font-extrabold text-purple-700">
              ⭐ Evaluación del juego: {juegoSeleccionado.nombre}
            </h2>

            <p className="mb-6 font-semibold text-slate-600">
              Marca una estrella por cada capacidad evidenciada en cada
              estudiante.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-2xl bg-white">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="p-4 text-left text-purple-800">
                      Estudiante
                    </th>

                    {juegoSeleccionado.capacidades.map((c) => (
                      <th
                        key={c.capacidad.id}
                        className="p-4 text-center text-purple-800"
                      >
                        {c.capacidad.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.id} className="border-b">
                      <td className="p-4 font-bold text-slate-700">
                        {estudiante.nombres} {estudiante.apellidos}
                      </td>

                      {juegoSeleccionado.capacidades.map((c) => {
                        const key = `${estudiante.id}-${c.capacidad.id}`;

                        return (
                          <td
                            key={c.capacidad.id}
                            className="p-4 text-center"
                          >
                            <button
                              onClick={() =>
                                toggleEvaluacion(
                                  estudiante.id,
                                  c.capacidad.id
                                )
                              }
                              className="text-3xl transition hover:scale-125"
                            >
                              {evaluaciones[key] ? "⭐" : "☆"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={guardarEvaluacion}
                className="flex-1 rounded-2xl bg-green-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105"
              >
                💾 Guardar evaluación
              </button>

              <button
                onClick={finalizarSesion}
                className="flex-1 rounded-2xl bg-red-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105"
              >
                🔒 Finalizar sesión
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}