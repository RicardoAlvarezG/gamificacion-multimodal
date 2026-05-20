"use client";

import Link from "next/link";

const aulas = [
  {
    id: 1,
    nombre: "Aula Ositos",
    turno: "Mañana",
    docente: "María Pérez",
    estado: "Asignado",
    icono: "🧸",
    color: "bg-purple-100",
  },
  {
    id: 2,
    nombre: "Aula Conejitos",
    turno: "Tarde",
    docente: "Docente en espera",
    estado: "Pendiente",
    icono: "🐰",
    color: "bg-pink-100",
  },
  {
    id: 3,
    nombre: "Aula Estrellitas",
    turno: "Mañana",
    docente: "Carlos López",
    estado: "Asignado",
    icono: "⭐",
    color: "bg-yellow-100",
  },
];

export default function AsignarAulasPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 backdrop-blur-md p-10 shadow-2xl">
        {/* HEADER */}
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🏫
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Asignar aulas
              </h1>
              <p className="mt-2 text-slate-700 text-lg">
                Gestiona las aulas y asigna docentes fácilmente.
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

        {/* BOTONES */}
        <div className="mb-10 flex gap-4">
          <button className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-md transition hover:scale-105">
            Aulas registradas
          </button>

          <button className="rounded-2xl bg-yellow-200 px-8 py-4 font-bold text-yellow-800 shadow-md transition hover:scale-105">
            Pendientes
          </button>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {aulas.map((aula) => (
            <article
              key={aula.id}
              className={`${aula.color} rounded-[2rem] p-8 shadow-xl transition hover:scale-[1.02]`}
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {aula.icono}
                </div>

                <span
                  className={`rounded-full px-5 py-2 text-sm font-bold shadow-sm ${
                    aula.estado === "Asignado"
                      ? "bg-green-200 text-green-800"
                      : "bg-orange-200 text-orange-800"
                  }`}
                >
                  {aula.estado}
                </span>
              </div>

              <h2 className="mb-5 text-3xl font-extrabold text-purple-700">
                {aula.nombre}
              </h2>

              <p className="mb-3 text-slate-700 text-lg">
                🌞 <strong>Turno:</strong> {aula.turno}
              </p>

              <p className="mb-8 text-slate-700 text-lg">
                👩‍🏫 <strong>Docente:</strong> {aula.docente}
              </p>

              <div className="flex gap-4">
                <button className="flex-1 rounded-2xl bg-white px-6 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105">
                  ✏️ Cambiar docente
                </button>

                <button className="flex-1 rounded-2xl bg-purple-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105">
                  💾 Guardar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}