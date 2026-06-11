"use client";

import Link from "next/link";
import ReporteDocenteCard from "@/components/cards/ReporteDocenteCard";

export default function ReportesPage() {
  const docentes = [
    {
      id: 1,
      nombre: "Daniela",
      aulas: 2,
      estudiantes: 36,
      porcentaje: 72,
      estado: "LOGRADO",
    },
    {
      id: 2,
      nombre: "Katia",
      aulas: 1,
      estudiantes: 18,
      porcentaje: 85,
      estado: "DESTACADO",
    },
  ];

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-6xl">📊</div>

          <div>
            <h1 className="text-5xl font-extrabold text-purple-700">
              Reportes
            </h1>

            <p className="mt-3 text-lg font-medium text-slate-600">
              Selecciona un docente para visualizar sus reportes.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/administrador"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-purple-700"
        >
          ← Regresar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {docentes.map((docente) => (
          <ReporteDocenteCard
            key={docente.id}
            id={docente.id}
            nombre={docente.nombre}
            aulas={docente.aulas}
            estudiantes={docente.estudiantes}
            porcentaje={docente.porcentaje}
            estado={docente.estado}
          />
        ))}
      </div>
    </div>
  );
}