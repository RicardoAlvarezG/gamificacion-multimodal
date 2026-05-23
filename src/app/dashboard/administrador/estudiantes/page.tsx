"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateEstudianteModal from "@/components/forms/CreateEstudianteModal";

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docente?: {
    nombre: string;
    apellido?: string | null;
  } | null;
  estudiantes?: Estudiante[];
};

type Perfil = {
  nivel: number;
  puntosTotal: number;
  avatar?: string | null;
};

type Estudiante = {
  id: number;
  aulaId: number;
  nombres: string;
  apellidos: string;
  perfil?: Perfil | null;
};

export default function EstudiantesPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const cargarAulas = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No hay usuario logueado");
        return;
      }

      const admin = JSON.parse(usuarioGuardado);

      const res = await fetch("/api/aulas");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar aulas");
        return;
      }

      const aulasInstitucion = data.filter(
        (aula: Aula & { institucionId?: number | null }) =>
          aula.institucionId === admin.institucionId
      );

      setAulas(aulasInstitucion);
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

  const alumnosDelAula = estudiantes.filter(
    (estudiante) => estudiante.aulaId === aulaSeleccionada
  );

  const aulaActual = aulas.find((aula) => aula.id === aulaSeleccionada);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              👧
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Estudiantes
              </h1>
              <p className="mt-2 text-lg text-slate-700">
                Selecciona un aula para ver la lista de alumnos.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/administrador"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
          >
            ← Regresar
          </Link>
        </div>

        {loading ? (
          <p className="text-xl font-bold text-slate-600">Cargando aulas...</p>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {aulas.map((aula, index) => {
                const total = aula.estudiantes?.length ?? 0;

                return (
                  <button
                    key={aula.id}
                    onClick={() => {
                      setAulaSeleccionada(aula.id);
                      setEstudianteSeleccionado(null);
                      cargarEstudiantes(aula.id);
                    }}
                    className={`${
                      index % 3 === 0
                        ? "bg-green-100"
                        : index % 3 === 1
                        ? "bg-orange-100"
                        : "bg-blue-100"
                    } rounded-[2rem] p-7 text-left shadow-xl transition hover:scale-[1.03] ${
                      aulaSeleccionada === aula.id
                        ? "ring-4 ring-purple-400"
                        : ""
                    }`}
                  >
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                      {index % 3 === 0 ? "🧸" : index % 3 === 1 ? "🐰" : "⭐"}
                    </div>

                    <h2 className="text-3xl font-extrabold text-purple-700">
                      {aula.nombre}
                    </h2>

                    <p className="mt-3 text-slate-700">
                      👩‍🏫 <strong>Docente:</strong>{" "}
                      {aula.docente
                        ? `${aula.docente.nombre} ${
                            aula.docente.apellido ?? ""
                          }`
                        : "Docente en espera"}
                    </p>

                    <p className="mt-2 text-slate-700">
                      👦 <strong>Estudiantes:</strong> {total}
                    </p>
                  </button>
                );
              })}
            </div>

            {aulaSeleccionada && aulaActual && (
              <div className="rounded-[2rem] bg-white/80 p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-purple-700">
                      Lista de alumnos - {aulaActual.nombre}
                    </h2>
                    <p className="text-slate-600">
                      Visualiza la información principal de cada estudiante.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-2xl bg-green-300 px-6 py-3 font-bold text-green-900 shadow-md transition hover:scale-105"
                  >
                    + Agregar estudiante
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-purple-100">
                  <table className="w-full border-collapse bg-white text-left">
                    <thead className="bg-purple-200 text-purple-900">
                      <tr>
                        <th className="p-4">Nombres</th>
                        <th className="p-4">Apellidos</th>
                        <th className="p-4">Puntos</th>
                        <th className="p-4">Nivel</th>
                        <th className="p-4 text-center">Detalle</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alumnosDelAula.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-6 text-center font-semibold text-slate-500"
                          >
                            No hay estudiantes registrados en esta aula.
                          </td>
                        </tr>
                      ) : (
                        alumnosDelAula.map((estudiante) => (
                          <tr
                            key={estudiante.id}
                            className="border-b border-purple-100 hover:bg-yellow-50"
                          >
                            <td className="p-4 font-semibold text-slate-700">
                              {estudiante.nombres}
                            </td>
                            <td className="p-4 text-slate-700">
                              {estudiante.apellidos}
                            </td>
                            <td className="p-4 text-slate-700">
                              ⭐ {estudiante.perfil?.puntosTotal ?? 0}
                            </td>
                            <td className="p-4 text-slate-700">
                              Nivel {estudiante.perfil?.nivel ?? 1}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() =>
                                  setEstudianteSeleccionado(estudiante)
                                }
                                className="rounded-full bg-blue-200 px-4 py-2 text-xl shadow-md transition hover:scale-110"
                              >
                                🔍
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {estudianteSeleccionado && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
                <div className="w-full max-w-md rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-3xl font-extrabold text-purple-700">
                      Detalle del alumno
                    </h3>

                    <button
                      onClick={() => setEstudianteSeleccionado(null)}
                      className="rounded-full bg-white px-4 py-2 font-bold text-purple-700 shadow-md"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-7xl shadow-lg">
                      {estudianteSeleccionado.perfil?.avatar || "🧒"}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-white/80 p-6 text-slate-700">
                    <p>
                      👦 <strong>Nombre:</strong>{" "}
                      {estudianteSeleccionado.nombres}{" "}
                      {estudianteSeleccionado.apellidos}
                    </p>

                    <p>
                      🏫 <strong>Aula:</strong> {aulaActual?.nombre}
                    </p>

                    <p>
                      ⭐ <strong>Puntos:</strong>{" "}
                      {estudianteSeleccionado.perfil?.puntosTotal ?? 0}
                    </p>

                    <p>
                      🐾 <strong>Nivel de mascota:</strong> Nivel{" "}
                      {estudianteSeleccionado.perfil?.nivel ?? 1}
                    </p>
                  </div>
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
          </>
        )}
      </section>
    </main>
  );
}