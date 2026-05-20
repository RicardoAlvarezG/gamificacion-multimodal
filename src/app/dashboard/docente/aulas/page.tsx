"use client";

import { useState } from "react";
import Link from "next/link";

const docente = {
  tipo: "institucional", // cambiar a "independiente" para probar
};

const aulas = [
  {
    id: 1,
    nombre: "Aula Ositos",
    turno: "Mañana",
    estudiantes: 3,
    icono: "🧸",
    color: "bg-green-100",
  },
  {
    id: 2,
    nombre: "Aula Estrellitas",
    turno: "Tarde",
    estudiantes: 2,
    icono: "⭐",
    color: "bg-blue-100",
  },
  {
    id: 3,
    nombre: "Aula Conejitos",
    turno: "Mañana",
    estudiantes: 2,
    icono: "🐰",
    color: "bg-pink-100",
  },
];

const alumnos = [
  { id: 1, aulaId: 1, nombre: "Mateo Ramírez", edad: 5, avatar: "🐻" },
  { id: 2, aulaId: 1, nombre: "Lucía Torres", edad: 4, avatar: "🦊" },
  { id: 3, aulaId: 1, nombre: "Valentina Pérez", edad: 5, avatar: "🐰" },
  { id: 4, aulaId: 2, nombre: "Thiago Castillo", edad: 5, avatar: "🐯" },
  { id: 5, aulaId: 2, nombre: "Camila Rojas", edad: 4, avatar: "🐼" },
  { id: 6, aulaId: 3, nombre: "Santiago Vega", edad: 5, avatar: "🦁" },
  { id: 7, aulaId: 3, nombre: "Emma Flores", edad: 4, avatar: "🐨" },
];

export default function DocenteAulasPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);

  const aulaActual = aulas.find((aula) => aula.id === aulaSeleccionada);

  const alumnosDelAula = alumnos.filter(
    (alumno) => alumno.aulaId === aulaSeleccionada
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🏫
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Mis aulas
              </h1>

              <p className="mt-2 text-lg text-slate-700">
                Visualiza tus aulas y revisa la lista de estudiantes asignados.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {docente.tipo === "independiente" && (
              <Link
                href="/dashboard/docente/aulas/crear"
                className="rounded-2xl bg-green-400 px-6 py-4 font-bold text-green-950 shadow-lg transition hover:scale-105"
              >
                + Crear aula
              </Link>
            )}

            <Link
              href="/dashboard/docente"
              className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
            >
              ← Regresar
            </Link>
          </div>
        </div>

        {!aulaSeleccionada && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {aulas.map((aula) => (
              <article
                key={aula.id}
                className={`${aula.color} rounded-[2rem] p-8 shadow-xl transition hover:scale-[1.02]`}
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {aula.icono}
                </div>

                <h2 className="text-3xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-4 text-lg font-semibold text-slate-700">
                  🌞 Turno: {aula.turno}
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-700">
                  👦 Estudiantes: {aula.estudiantes}
                </p>

                <button
                  onClick={() => setAulaSeleccionada(aula.id)}
                  className="mt-8 w-full rounded-2xl bg-white px-5 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105"
                >
                  Ver detalle →
                </button>
              </article>
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

                <p className="mt-1 text-slate-600">
                  Lista básica de estudiantes del aula seleccionada.
                </p>
              </div>

              <button
                onClick={() => setAulaSeleccionada(null)}
                className="rounded-2xl bg-purple-500 px-6 py-3 font-bold text-white shadow-md transition hover:scale-105"
              >
                ← Volver a aulas
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-purple-100">
              <table className="w-full border-collapse bg-white text-left">
                <thead className="bg-purple-200 text-purple-900">
                  <tr>
                    <th className="p-4">Avatar</th>
                    <th className="p-4">Nombre del estudiante</th>
                    <th className="p-4">Edad</th>
                    <th className="p-4">Aula</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosDelAula.map((alumno) => (
                    <tr
                      key={alumno.id}
                      className="border-b border-purple-100 hover:bg-yellow-50"
                    >
                      <td className="p-4 text-3xl">{alumno.avatar}</td>
                      <td className="p-4 font-semibold text-slate-700">
                        {alumno.nombre}
                      </td>
                      <td className="p-4 text-slate-700">
                        {alumno.edad} años
                      </td>
                      <td className="p-4 text-slate-700">
                        {aulaActual.nombre}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}