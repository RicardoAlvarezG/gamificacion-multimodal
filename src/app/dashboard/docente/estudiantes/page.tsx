"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateEstudianteModal from "@/components/forms/CreateEstudianteModal";
import EditEstudianteModal from "@/components/forms/EditEstudianteModal";

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docenteId?: number | null;
  creadoPorId?: number | null;
  estudiantes?: Estudiante[];
};

type Estudiante = {
  id: number;
  aulaId: number;
  nombres: string;
  apellidos: string;
  perfil?: {
    avatar?: string | null;
    nivel: number;
    puntosTotal: number;
  } | null;
};

export default function DocenteEstudiantesPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Estudiante | null>(null);
  const [mostrarAvatares, setMostrarAvatares] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const avataresDisponibles = ["🐻", "🦊", "🐰", "🐼", "🦁", "🐯", "🐨", "🐸"];

  const obtenerAvatarVisual = (avatar?: string | null, nivel?: number) => {
  if (!avatar) return "👤";

  const nivelActual = nivel ?? 1;

  const evoluciones: Record<string, string[]> = {
    "🐶": ["🐶", "🐕", "🦮", "🐺", "🦊", "🦁"],
    "🐱": ["🐱", "🐈", "🐯", "🦁", "🐆", "🐅"],
    "🐼": ["🐼", "🐻", "🐨", "🦝", "🦊", "🦁"],
    "🐰": ["🐰", "🐇", "🦌", "🦙", "🦄", "🦁"],
    "🦊": ["🦊", "🐺", "🦝", "🐯", "🐆", "🦁"],
    "🐷": ["🐷", "🐽", "🐗", "🐻", "🦬", "🦁"],
    "🐨": ["🐨", "🐻", "🐼", "🦝", "🦊", "🦁"],
    "🦦": ["🦦", "🐿️", "🦫", "🦝", "🐺", "🦁"],
  };

  return evoluciones[avatar]?.[nivelActual - 1] ?? avatar;
};

const calcularPorcentajeAvatar = (puntos: number) => {
  return Math.min(Math.round((puntos / 2000) * 100), 100);
};

const calcularPuntosSiguienteNivel = (nivel: number) => {
  if (nivel === 1) return 301;
  if (nivel === 2) return 651;
  if (nivel === 3) return 1001;
  if (nivel === 4) return 1351;
  if (nivel === 5) return 1701;
  return 2000;
};  

  const cargarAulas = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No hay usuario logueado");
        return;
      }

      const user = JSON.parse(usuarioGuardado);
      const tipoDocente = user.institucionId ? "institucional" : "independiente";

      const res = await fetch("/api/aulas");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar aulas");
        return;
      }

      const aulasFiltradas =
        tipoDocente === "institucional"
          ? data.filter((aula: Aula) => aula.docenteId === user.id)
          : data.filter((aula: Aula) => aula.creadoPorId === user.id);

      setAulas(aulasFiltradas);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantes = async (aulaId: number) => {
    try {
      const res = await fetch(`/api/estudiantes?aulaId=${aulaId}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar estudiantes");
        return;
      }

      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      alert("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    cargarAulas();
  }, []);

  const eliminarEstudiante = async (estudianteId: number) => {
    const password = prompt("Confirma tu contraseña:");

    if (!password) {
      alert("Debes ingresar tu contraseña");
      return;
    }

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      alert("No hay usuario logueado");
      return;
    }

    const user = JSON.parse(usuarioGuardado);

    try {
      const validacion = await fetch("/api/validar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id,
          password,
        }),
      });

      const resultado = await validacion.json();

      if (!validacion.ok) {
        alert(resultado.error || "Contraseña incorrecta");
        return;
      }

      const res = await fetch("/api/estudiantes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al eliminar estudiante");
        return;
      }

      alert("Estudiante eliminado correctamente");

      if (aulaSeleccionada) {
        cargarEstudiantes(aulaSeleccionada);
      }

      setEstudianteSeleccionado(null);
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

 const seleccionarAvatar = async (avatar: string) => {
  if (!estudianteSeleccionado) return;

  try {
    const res = await fetch("/api/gamificacion/avatar", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estudianteId: estudianteSeleccionado.id,
        avatar,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al guardar avatar");
      return;
    }

    setEstudianteSeleccionado({
      ...estudianteSeleccionado,
      perfil: {
        nivel: estudianteSeleccionado.perfil?.nivel ?? 1,
        puntosTotal: estudianteSeleccionado.perfil?.puntosTotal ?? 0,
        avatar,
      },
    });

    if (aulaSeleccionada) {
      cargarEstudiantes(aulaSeleccionada);
    }

    setMostrarAvatares(false);

    alert("Avatar asignado correctamente");
  } catch (error) {
    console.error("Error al guardar avatar:", error);
    alert("Error al guardar avatar");
  }
};

  const aulaActual = aulas.find((aula) => aula.id === aulaSeleccionada);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🧒
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Estudiantes
              </h1>

              <p className="mt-2 text-lg text-slate-700">
                Gestiona los estudiantes de tus aulas.
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

        {loading ? (
          <p className="text-xl font-bold text-slate-600">Cargando aulas...</p>
        ) : (
          <>
            {!aulaSeleccionada && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {aulas.map((aula, index) => (
                  <button
                    key={aula.id}
                    onClick={() => {
                      setAulaSeleccionada(aula.id);
                      cargarEstudiantes(aula.id);
                    }}
                    className={`${
                      index % 3 === 0
                        ? "bg-green-100"
                        : index % 3 === 1
                        ? "bg-blue-100"
                        : "bg-pink-100"
                    } rounded-[2rem] p-8 text-left shadow-xl transition hover:scale-[1.02]`}
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                      {index % 3 === 0 ? "🧸" : index % 3 === 1 ? "⭐" : "🐰"}
                    </div>

                    <h2 className="text-3xl font-extrabold text-purple-700">
                      {aula.nombre}
                    </h2>

                    <p className="mt-4 font-semibold text-slate-700">
                      Click para gestionar estudiantes
                    </p>
                  </button>
                ))}
              </div>
            )}

            {aulaSeleccionada && aulaActual && (
              <div className="rounded-[2rem] bg-white/80 p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-purple-700">
                      🏫 {aulaActual.nombre}
                    </h2>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="rounded-2xl bg-green-400 px-6 py-3 font-bold text-green-950 shadow-md"
                    >
                      + Agregar estudiante
                    </button>

                    <button
                      onClick={() => {
                        setAulaSeleccionada(null);
                        setEstudiantes([]);
                      }}
                      className="rounded-2xl bg-purple-500 px-6 py-3 font-bold text-white shadow-md"
                    >
                      ← Volver
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-purple-100">
                  <table className="w-full border-collapse bg-white">
                    <thead className="bg-purple-200">
                      <tr>
                        <th className="p-4 text-left">Nombre</th>
                        <th className="p-4 text-left">Puntos</th>
                        <th className="p-4 text-left">Nivel</th>
                        <th className="p-4 text-center">Detalle</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {estudiantes.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-6 text-center font-semibold text-slate-500"
                          >
                            No hay estudiantes registrados en esta aula.
                          </td>
                        </tr>
                      ) : (
                        estudiantes.map((estudiante) => (
                          <tr
                            key={estudiante.id}
                            className="border-b border-purple-100 hover:bg-yellow-50"
                          >
                            <td className="p-4 font-semibold text-slate-700">
                              {estudiante.nombres} {estudiante.apellidos}
                            </td>

                            <td className="p-4">
                              ⭐ {estudiante.perfil?.puntosTotal ?? 0}
                            </td>

                            <td className="p-4">
                              Nivel {estudiante.perfil?.nivel ?? 1}
                            </td>

                            <td className="p-4 text-center">
                              <button
                                onClick={() =>
                                  setEstudianteSeleccionado(estudiante)
                                }
                                className="rounded-full bg-blue-200 px-4 py-2 text-xl shadow-md"
                              >
                                🔍
                              </button>
                            </td>

                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEstudianteSeleccionado(estudiante);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="rounded-full bg-yellow-200 px-4 py-2 text-xl shadow-md"
                                >
                                  ✏️
                                </button>

                                <button
                                  onClick={() =>
                                    eliminarEstudiante(estudiante.id)
                                  }
                                  className="rounded-full bg-red-200 px-4 py-2 text-xl shadow-md"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {estudianteSeleccionado && !isEditModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
                <div className="w-full max-w-md rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-3xl font-extrabold text-purple-700">
                      Estudiante
                    </h3>

                    <button
                      onClick={() => setEstudianteSeleccionado(null)}
                      className="rounded-full bg-white px-4 py-2 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-6 flex justify-center">
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white text-8xl shadow-xl">
                      {estudianteSeleccionado.perfil?.avatar || "👤"}

                      <button
                        onClick={() => setMostrarAvatares(true)}
                        className="absolute bottom-0 right-0 rounded-full bg-yellow-300 px-3 py-2 shadow-md"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-6 shadow-md">
                    <p className="mb-3">
                      <strong>Nombre:</strong>{" "}
                      {estudianteSeleccionado.nombres}{" "}
                      {estudianteSeleccionado.apellidos}
                    </p>

                    <p className="mb-3">
                      <strong>Puntos:</strong> ⭐{" "}
                      {estudianteSeleccionado.perfil?.puntosTotal ?? 0} / 2000
                    </p>

                    <p className="mb-4">
                      <strong>Nivel:</strong> Nivel{" "}
                      {estudianteSeleccionado.perfil?.nivel ?? 1}
                    </p>

                    <div className="mb-2 h-4 w-full rounded-full bg-purple-100">
                      <div
                        className="h-4 rounded-full bg-purple-500 transition-all"
                        style={{
                          width: `${
                            Math.min(
                              ((estudianteSeleccionado.perfil?.puntosTotal ?? 0) / 2000) * 100,
                              100
                            )
                          }%`,
                        }}
                      />
                    </div>

                    <p className="text-center text-sm font-bold text-purple-700">
                      {Math.round(
                        Math.min(
                          ((estudianteSeleccionado.perfil?.puntosTotal ?? 0) / 2000) * 100,
                          100
                        )
                      )}
                      % de progreso total
                    </p>
                  </div>

                  {mostrarAvatares && (
                    <div className="mt-6 rounded-2xl bg-white p-5 shadow-md">
                      <h4 className="mb-4 text-center font-bold text-purple-700">
                        Selecciona un avatar
                      </h4>

                      <div className="grid grid-cols-4 gap-4">
                        {avataresDisponibles.map((avatar) => (
                          <button
                            key={avatar}
                            onClick={() => seleccionarAvatar(avatar)}
                            className="rounded-2xl bg-purple-100 p-4 text-4xl transition hover:scale-110"
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {aulaSeleccionada && (
              <CreateEstudianteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                aulaId={aulaSeleccionada}
                onCreated={() => cargarEstudiantes(aulaSeleccionada)}
              />
            )}

            <EditEstudianteModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              estudiante={estudianteSeleccionado}
              aulaId={aulaSeleccionada || 0}
              onUpdated={() => {
                if (aulaSeleccionada) {
                  cargarEstudiantes(aulaSeleccionada);
                }
              }}
            />
          </>
        )}
      </section>
    </main>
  );
}