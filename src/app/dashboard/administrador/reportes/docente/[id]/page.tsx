"use client";

import Link from "next/link";

export default function ReporteDocentePage() {
  const aulas = [
    {
      id: 1,
      nombre: "Inicial 3 años",
      porcentaje: 68,
      estado: "LOGRADO",
      estudiantes: 15,
    },
    {
      id: 2,
      nombre: "Inicial 4 años",
      porcentaje: 75,
      estado: "LOGRADO",
      estudiantes: 18,
    },
    {
      id: 3,
      nombre: "Inicial 5 años",
      porcentaje: 85,
      estado: "DESTACADO",
      estudiantes: 20,
    },
  ];

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            👩‍🏫 Daniela
          </h1>

          <p className="mt-3 text-lg font-medium text-slate-600">
            Selecciona un aula para visualizar los reportes.
          </p>
        </div>

        <Link
          href="/dashboard/administrador/reportes"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700"
        >
          ← Regresar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {aulas.map((aula) => (
          <div
            key={aula.id}
            className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="mb-5 text-5xl">🏫</div>

            <h2 className="text-2xl font-extrabold text-purple-700">
              {aula.nombre}
            </h2>

            <div className="mt-6">
              <div className="mb-2 flex justify-between font-bold">
                <span>Progreso General</span>
                <span>{aula.porcentaje}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${aula.porcentaje}%` }}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2 font-semibold text-slate-600">
              <p>👦 Estudiantes: {aula.estudiantes}</p>
              <p>⭐ Estado: {aula.estado}</p>
            </div>

            <Link
            href={`/dashboard/administrador/reportes/aula/${aula.id}`}
            className="mt-8 block w-full rounded-3xl bg-purple-100 px-5 py-4 text-center font-extrabold text-purple-700 hover:bg-purple-200"
            >
            Ver Estudiantes →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}