"use client";

import { useState } from "react";
import Link from "next/link";

const aulas = [
  {
    id: 1,
    nombre: "Aula Ositos",
    docente: "María Pérez",
    icono: "🧸",
    color: "bg-green-100",
  },
  {
    id: 2,
    nombre: "Aula Conejitos",
    docente: "Docente en espera",
    icono: "🐰",
    color: "bg-orange-100",
  },
  {
    id: 3,
    nombre: "Aula Estrellitas",
    docente: "Carlos López",
    icono: "⭐",
    color: "bg-blue-100",
  },
];

const estudiantes = [
  {
    id: 1,
    aulaId: 1,
    nombres: "Mateo",
    apellidos: "Ramírez López",
    edad: 5,
    puntos: 420,
    nivel: 2,
    avatar: "🐻",
  },
  {
    id: 2,
    aulaId: 1,
    nombres: "Lucía",
    apellidos: "Torres Díaz",
    edad: 4,
    puntos: 760,
    nivel: 2,
    avatar: "🦊",
  },
  {
    id: 3,
    aulaId: 2,
    nombres: "Valentina",
    apellidos: "Pérez Rojas",
    edad: 5,
    puntos: 180,
    nivel: 1,
    avatar: "🐰",
  },
  {
    id: 4,
    aulaId: 3,
    nombres: "Thiago",
    apellidos: "Castillo Vega",
    edad: 5,
    puntos: 950,
    nivel: 3,
    avatar: "🐯",
  },
];

export default function EstudiantesPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<(typeof estudiantes)[0] | null>(null);

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

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {aulas.map((aula) => {
            const total = estudiantes.filter(
              (estudiante) => estudiante.aulaId === aula.id
            ).length;

            return (
              <button
                key={aula.id}
                onClick={() => setAulaSeleccionada(aula.id)}
                className={`${aula.color} rounded-[2rem] p-7 text-left shadow-xl transition hover:scale-[1.03] ${
                  aulaSeleccionada === aula.id
                    ? "ring-4 ring-purple-400"
                    : ""
                }`}
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {aula.icono}
                </div>

                <h2 className="text-3xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-3 text-slate-700">
                  👩‍🏫 <strong>Docente:</strong> {aula.docente}
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

              <button className="rounded-2xl bg-green-300 px-6 py-3 font-bold text-green-900 shadow-md transition hover:scale-105">
                + Agregar estudiante
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-purple-100">
              <table className="w-full border-collapse bg-white text-left">
                <thead className="bg-purple-200 text-purple-900">
                  <tr>
                    <th className="p-4">Nombres</th>
                    <th className="p-4">Apellidos</th>
                    <th className="p-4">Edad</th>
                    <th className="p-4">Puntos</th>
                    <th className="p-4">Nivel</th>
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
                        {estudiante.nombres}
                      </td>
                      <td className="p-4 text-slate-700">
                        {estudiante.apellidos}
                      </td>
                      <td className="p-4 text-slate-700">
                        {estudiante.edad} años
                      </td>
                      <td className="p-4 text-slate-700">
                        ⭐ {estudiante.puntos}
                      </td>
                      <td className="p-4 text-slate-700">
                        Nivel {estudiante.nivel}
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
                  {estudianteSeleccionado.avatar}
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
                  🎂 <strong>Edad:</strong> {estudianteSeleccionado.edad} años
                </p>

                <p>
                  ⭐ <strong>Puntos:</strong> {estudianteSeleccionado.puntos}
                </p>

                <p>
                  🐾 <strong>Nivel de mascota:</strong> Nivel{" "}
                  {estudianteSeleccionado.nivel}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}