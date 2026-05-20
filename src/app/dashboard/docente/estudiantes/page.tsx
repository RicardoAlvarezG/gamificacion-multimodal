"use client";

import { useState } from "react";
import Link from "next/link";

const aulas = [
  {
    id: 1,
    nombre: "Aula Ositos",
    icono: "🧸",
    color: "bg-green-100",
  },
  {
    id: 2,
    nombre: "Aula Estrellitas",
    icono: "⭐",
    color: "bg-blue-100",
  },
  {
    id: 3,
    nombre: "Aula Conejitos",
    icono: "🐰",
    color: "bg-pink-100",
  },
];

const avataresDisponibles = ["🐻", "🦊", "🐰", "🐼", "🦁", "🐯", "🐨", "🐸"];

const estudiantesIniciales = [
  {
    id: 1,
    aulaId: 1,
    nombre: "Mateo Ramírez",
    edad: 5,
    puntos: 250,
    avatar: "🐻",
  },
  {
    id: 2,
    aulaId: 1,
    nombre: "Lucía Torres",
    edad: 4,
    puntos: 180,
    avatar: "",
  },
  {
    id: 3,
    aulaId: 2,
    nombre: "Thiago Castillo",
    edad: 5,
    puntos: 400,
    avatar: "🐯",
  },
];

export default function DocenteEstudiantesPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);
  const [estudiantes, setEstudiantes] = useState(estudiantesIniciales);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null);
  const [mostrarAvatares, setMostrarAvatares] = useState(false);

  const alumnosDelAula = estudiantes.filter(
    (estudiante) => estudiante.aulaId === aulaSeleccionada
  );

  const aulaActual = aulas.find((aula) => aula.id === aulaSeleccionada);

  const seleccionarAvatar = (avatar: string) => {
    const actualizados = estudiantes.map((est) =>
      est.id === estudianteSeleccionado.id ? { ...est, avatar } : est
    );

    setEstudiantes(actualizados);

    const actualizado = actualizados.find(
      (est) => est.id === estudianteSeleccionado.id
    );

    setEstudianteSeleccionado(actualizado);
    setMostrarAvatares(false);
  };

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

        {!aulaSeleccionada && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {aulas.map((aula) => (
              <button
                key={aula.id}
                onClick={() => setAulaSeleccionada(aula.id)}
                className={`${aula.color} rounded-[2rem] p-8 text-left shadow-xl transition hover:scale-[1.02]`}
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {aula.icono}
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
                  {aulaActual.icono} {aulaActual.nombre}
                </h2>
              </div>

              <div className="flex gap-3">
                <button className="rounded-2xl bg-green-400 px-6 py-3 font-bold text-green-950 shadow-md">
                  + Agregar estudiante
                </button>

                <button
                  onClick={() => setAulaSeleccionada(null)}
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
                    <th className="p-4 text-left">Edad</th>
                    <th className="p-4 text-left">Puntos</th>
                    <th className="p-4 text-center">Detalle</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosDelAula.map((estudiante) => (
                    <tr
                      key={estudiante.id}
                      className="border-b border-purple-100 hover:bg-yellow-50"
                    >
                      <td className="p-4 font-semibold text-slate-700">
                        {estudiante.nombre}
                      </td>

                      <td className="p-4">{estudiante.edad} años</td>

                      <td className="p-4">⭐ {estudiante.puntos}</td>

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
                    </tr>
                  ))}
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
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white text-7xl shadow-lg">
                  {estudianteSeleccionado.avatar || "👤"}

                  {!estudianteSeleccionado.avatar && (
                    <button
                      onClick={() => setMostrarAvatares(true)}
                      className="absolute bottom-0 right-0 rounded-full bg-yellow-300 px-3 py-2 shadow-md"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-white/80 p-6">
                <p>
                  <strong>Nombre:</strong> {estudianteSeleccionado.nombre}
                </p>

                <p>
                  <strong>Edad:</strong> {estudianteSeleccionado.edad} años
                </p>

                <p>
                  <strong>Puntos:</strong> ⭐ {estudianteSeleccionado.puntos}
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
      </section>
    </main>
  );
}