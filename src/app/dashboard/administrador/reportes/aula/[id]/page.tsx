"use client";

import Link from "next/link";

export default function ReporteAulaPage() {
  const estudiantes = [
    { id: 1, nombre: "María Valentina Benites Olmedo", avatar: "🐻", porcentaje: 76, estado: "LOGRADO" },
    { id: 2, nombre: "Luis Mateo Cabagnaro Palacios", avatar: "🦊", porcentaje: 58, estado: "EN PROCESO" },
    { id: 3, nombre: "Carlos Alberto Mendoza Ríos", avatar: "🐼", porcentaje: 84, estado: "DESTACADO" },
    { id: 4, nombre: "Pedro Andre Ramirez Palomino", avatar: "🐯", porcentaje: 35, estado: "EN INICIO" },
  ];

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            🏫 Inicial 5 años
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-600">
            Selecciona un estudiante para visualizar su reporte.
          </p>
        </div>

        <Link
          href="/dashboard/administrador/reportes/docente/1"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700"
        >
          ← Regresar
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-xl">
        <div className="grid grid-cols-4 bg-purple-200 px-8 py-5 font-extrabold text-slate-700">
          <div>Estudiante</div>
          <div>Progreso</div>
          <div>Estado</div>
          <div className="text-center">Acción</div>
        </div>

        {estudiantes.map((estudiante) => (
          <div
            key={estudiante.id}
            className="grid grid-cols-4 items-center border-t border-purple-100 px-8 py-5 font-semibold text-slate-700 transition hover:bg-purple-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{estudiante.avatar}</span>
              <span>{estudiante.nombre}</span>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>{estudiante.porcentaje}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${estudiante.porcentaje}%` }}
                />
              </div>
            </div>

            <div className="font-extrabold text-purple-700">
              {estudiante.estado}
            </div>

            <div className="text-center">
              <Link
                href={`/dashboard/administrador/reportes/estudiante/${estudiante.id}`}
                className="rounded-2xl bg-purple-100 px-6 py-3 font-extrabold text-purple-700 hover:bg-purple-200"
                >
                Ver Reporte →
                </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}