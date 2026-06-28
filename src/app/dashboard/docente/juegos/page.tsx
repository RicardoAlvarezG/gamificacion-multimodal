"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PersonalizarJuegoModal from "@/components/personalizacion-juegos/PersonalizarJuegoModal";
import EjecutarJuego from "@/components/juegos/EjecutarJuego";
import type { ConfiguracionColoresMagicos } from "@/components/personalizacion-juegos/PersonalizarColoresMagicos";
import type { ConfiguracionSonidosAnimales } from "@/components/personalizacion-juegos/PersonalizarSonidosAnimales";
import type { ConfiguracionFormasDivertidas } from "@/components/personalizacion-juegos/PersonalizarFormasDivertidas";
import type { ConfiguracionDondeEstaOsito } from "@/components/personalizacion-juegos/PersonalizarDondeEstaOsito";
import type { ConfiguracionCaritasFelices } from "@/components/personalizacion-juegos/PersonalizarCaritasFelices";
import type { ConfiguracionClasificaAgrupa } from "@/components/personalizacion-juegos/PersonalizarClasificaAgrupa";
import type { ConfiguracionVocalesPerdidas } from "@/components/personalizacion-juegos/PersonalizarVocalesPerdidas";

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

type ConfiguracionJuego =
  | ConfiguracionColoresMagicos
  | ConfiguracionSonidosAnimales
  | ConfiguracionFormasDivertidas
  | ConfiguracionDondeEstaOsito
  | ConfiguracionCaritasFelices
  | ConfiguracionClasificaAgrupa
  | ConfiguracionVocalesPerdidas;
  

type ConfiguracionesPersonalizadas = Partial<
  Record<string, ConfiguracionJuego>
>;


export default function DocenteJuegosPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);

  const [mostrarPersonalizar, setMostrarPersonalizar] = useState(false);

  const [configuracionesPersonalizadas, setConfiguracionesPersonalizadas] =
  useState<ConfiguracionesPersonalizadas>({});

  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [juegoFinalizado, setJuegoFinalizado] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(false);

  const [evaluaciones, setEvaluaciones] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [loadingJuegos, setLoadingJuegos] = useState(false);
  const obtenerImagenJuego = (nombre: string) => {
    const imagenes: Record<string, string> = {
      "Colores Mágicos": "/juegos/JUEGO1.webp",
      "Sonidos de Animales": "/juegos/JUEGO2.webp",
      "Formas Divertidas": "/juegos/JUEGO3.webp",
      "¿Dónde está el Osito?": "/juegos/JUEGO4.webp",
      "Caritas Felices": "/juegos/JUEGO5.webp",
      "Clasifica y Agrupa": "/juegos/JUEGO6.webp",
      "Las Vocales Perdidas": "/juegos/JUEGO7.webp",
      "Cuenta Conmigo": "/juegos/JUEGO8.webp",
      "Memoria Visual": "/juegos/JUEGO9.webp",
      "Figuras y Posiciones": "/juegos/JUEGO10.webp",
      "Rutinas Diarias": "/juegos/JUEGO11.webp",
      "Trabajemos Juntos": "/juegos/JUEGO12.webp",
      "Construye Palabras": "/juegos/JUEGO13.webp",
      "Secuencias Divertidas": "/juegos/JUEGO14.webp",
      "Asociación Imagen-Palabra": "/juegos/JUEGO15.webp",
      "Rompecabezas Inteligente": "/juegos/JUEGO16.webp",
      "Emociones en Acción": "/juegos/JUEGO17.webp",
      "Pequeños Retos": "/juegos/JUEGO18.webp",
    };

    return imagenes[nombre] || "/juegos/JUEGO1.webp";
  };

    const fechaActual = new Date().toLocaleDateString("es-PE");
    const [numeroSesion, setNumeroSesion] = useState(1);
    const nombreSesion = `Sesión ${numeroSesion}`;

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

  const cargarNumeroSesion = async (aulaId: number) => {
  try {
    const res = await fetch(`/api/sesiones?aulaId=${aulaId}`);
    const data = await res.json();

    if (res.ok) {
      setNumeroSesion(data.numeroSesion);
    }
  } catch (error) {
    console.error("Error cargando número de sesión:", error);
  }
  };

  const abrirPersonalizarJuego = () => {
  if (!juegoSeleccionado) return;

  setMostrarPersonalizar(true);
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
    setConfiguracionesPersonalizadas({});
    setMostrarPersonalizar(false);
  };

const guardarEvaluacion = async () => {
  if (!juegoSeleccionado) return;

  const evidenciasMarcadas = Object.keys(evaluaciones).filter(
    (key) => evaluaciones[key]
  );

  if (evidenciasMarcadas.length === 0) {
    alert("Debes marcar al menos una estrella antes de guardar.");
    return;
  }

  try {
    for (const key of evidenciasMarcadas) {
      const [estudianteId, capacidadId] = key.split("-");

      const res = await fetch("/api/gamificacion/evidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteId: Number(estudianteId),
          juegoId: juegoSeleccionado.id,
          capacidadId: Number(capacidadId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al guardar una evidencia");
        return;
      }
    }

    alert("Evaluación guardada correctamente.");

    setJuegoFinalizado(false);
    setJuegoIniciado(false);
    setEvaluaciones({});

    // Restablece la personalización temporal.
    // La próxima vez que se inicie el juego utilizará
    // la configuración predeterminada.
    setConfiguracionesPersonalizadas({});
    setMostrarPersonalizar(false);
  } catch (error) {
    console.error("Error al guardar evaluación:", error);
    alert("Error al conectar con el servidor");
  }
};

const finalizarSesion = async () => {
  if (!aulaSeleccionada) {
    alert("No hay aula seleccionada.");
    return;
  }

  const usuarioGuardado = localStorage.getItem("usuario");

  if (!usuarioGuardado) {
    alert("No se encontró el usuario en sesión.");
    return;
  }

  const usuario = JSON.parse(usuarioGuardado);

  try {
    const res = await fetch("/api/sesiones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aulaId: aulaSeleccionada.id,
        docenteId: usuario.id,
        numeroSesion,
        juegosIds: [],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al finalizar la sesión.");
      return;
    }

    setSesionActiva(false);
    setJuegoFinalizado(false);
    setJuegoIniciado(false);
    setJuegoSeleccionado(null);
    setAulaSeleccionada(null);
    setEstudiantes([]);
    setEvaluaciones({});
    setConfiguracionesPersonalizadas({});
    setMostrarPersonalizar(false);
    setNumeroSesion(1);

    alert("Sesión finalizada correctamente.");
  } catch (error) {
    console.error("Error al finalizar sesión:", error);
    alert("Error al conectar con el servidor.");
  }
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
                  cargarNumeroSesion(aula.id);
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
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-xl">
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

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    onClick={cambiarAula}
                    className="rounded-2xl bg-white px-6 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105"
                  >
                    ← Cambiar aula
                  </button>

                  <button
                    onClick={iniciarJuego}
                    disabled={!juegoSeleccionado}
                    className="rounded-2xl bg-green-400 px-6 py-4 font-bold text-green-950 shadow-md transition hover:scale-105 disabled:opacity-50"
                  >
                    ▶ Iniciar juego
                  </button>

                  <button
                    onClick={finalizarSesion}
                    className="rounded-2xl bg-red-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105"
                  >
                    🔒 Finalizar sesión
                  </button>
                </div>

                  <button
                    onClick={abrirPersonalizarJuego}
                    disabled={!juegoSeleccionado}
                    className={`mt-4 w-full rounded-2xl px-6 py-4 font-bold shadow-md transition ${
                      juegoSeleccionado
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "cursor-not-allowed bg-slate-700 text-white opacity-60"
                    }`}
                  >
                    ⚙ Personalizar juego
                  </button>

              </div>

              <div className="rounded-[2rem] bg-white/90 p-8 shadow-xl">
                <h3 className="mb-4 text-2xl font-extrabold text-purple-700">
                  Juegos disponibles
                </h3>

                {loadingJuegos ? (
                  <p>Cargando juegos...</p>
                ) : juegos.length === 0 ? (
                  <p className="font-semibold text-slate-600">
                    No hay juegos registrados para este grado.
                  </p>
                ) : (
                  <div>
                    <select
                      value={juegoSeleccionado?.id || ""}
                      onChange={(e) => {
                        const juego = juegos.find(
                          (j) => j.id === Number(e.target.value)
                        );

                        setJuegoSeleccionado(juego || null);
                        setConfiguracionesPersonalizadas({});
                        setMostrarPersonalizar(false);
                      }}
                      className="w-full rounded-2xl border border-purple-200 bg-white p-4 font-bold text-purple-700 shadow-sm outline-none"
                    >
                      <option value="">Selecciona un juego</option>

                      {juegos.map((juego) => (
                        <option key={juego.id} value={juego.id}>
                          {juego.nombre}
                        </option>
                      ))}
                    </select>

                    {juegoSeleccionado && (
                      <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
                        <h4 className="text-xl font-extrabold text-purple-700">
                          {juegoSeleccionado.nombre}
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {juegoSeleccionado.capacidades.map((c) => (
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

                     <div className="mt-5 flex h-64 items-center justify-center overflow-hidden rounded-2xl border-4 border-dashed border-purple-300 bg-white p-2">
                        <img
                          src={obtenerImagenJuego(juegoSeleccionado.nombre)}
                          alt={juegoSeleccionado.nombre}
                          className="max-h-full max-w-full rounded-xl object-contain"
                        />
                      </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {juegoIniciado && juegoSeleccionado && (
              <EjecutarJuego
                juego={juegoSeleccionado}
                configuracionPersonalizada={
                    juegoSeleccionado
                      ? configuracionesPersonalizadas[juegoSeleccionado.nombre] ?? null
                      : null
                  }
                onFinalizar={() => {
                  setJuegoIniciado(false);
                  setJuegoFinalizado(true);
                }}
              />
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

            </div>
          </div>
        )}

        {/* ===========================
            MODAL: PERSONALIZAR JUEGO
            Se muestra únicamente cuando el docente
            presiona "Personalizar juego".
            La configuración realizada es temporal
            y solo se utilizará durante la sesión
            actual del juego.
            =========================== */}

        <PersonalizarJuegoModal
          juego={juegoSeleccionado}
          abierto={mostrarPersonalizar}
          configuracionInicial={
            juegoSeleccionado
              ? configuracionesPersonalizadas[juegoSeleccionado.nombre] ?? null
              : null
          }
          onGuardar={(configuracion) => {
            if (!juegoSeleccionado) return;

            setConfiguracionesPersonalizadas((prev) => ({
              ...prev,
              [juegoSeleccionado.nombre]: configuracion,
            }));

            setMostrarPersonalizar(false);
            alert("Juego personalizado correctamente.");
          }}
          onCerrar={() => setMostrarPersonalizar(false)}
        />
      </section>
    </main>
  );
}