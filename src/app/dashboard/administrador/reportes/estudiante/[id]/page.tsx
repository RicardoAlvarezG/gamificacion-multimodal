"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReporteEstudiantePage() {
  const [cursoAbierto, setCursoAbierto] = useState<string | null>(null);

  const estudiante = {
    nombre: "María Valentina Benites Olmedo",
    aula: "Inicial 5 años",
    avatar: "🐻",
    nivel: 2,
    progresoGeneral: 76,
    estadoGeneral: "LOGRADO",
  };

  const cursos = [
    {
      nombre: "Comunicación",
      porcentaje: 82,
      estado: "DESTACADO",
      capacidades: [
        { nombre: "Reconoce vocales", porcentaje: 80, estado: "LOGRADO" },
        { nombre: "Identifica sonidos", porcentaje: 90, estado: "DESTACADO" },
        { nombre: "Relaciona imagen-palabra", porcentaje: 75, estado: "LOGRADO" },
      ],
    },
    {
      nombre: "Matemática",
      porcentaje: 65,
      estado: "LOGRADO",
      capacidades: [
        { nombre: "Reconoce números", porcentaje: 70, estado: "LOGRADO" },
        { nombre: "Identifica formas", porcentaje: 60, estado: "EN PROCESO" },
      ],
    },
    {
      nombre: "Personal Social",
      porcentaje: 48,
      estado: "EN PROCESO",
      capacidades: [
        { nombre: "Reconoce emociones", porcentaje: 55, estado: "EN PROCESO" },
        { nombre: "Participa en actividades grupales", porcentaje: 40, estado: "EN INICIO" },
      ],
    },
  ];

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            Reporte del Estudiante
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-600">
            Visualiza el progreso por curso y capacidades.
          </p>
        </div>

        <Link
          href="/dashboard/administrador/reportes/aula/1"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700"
        >
          ← Regresar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-white text-7xl shadow-xl">
              {estudiante.avatar}
            </div>

            <h2 className="text-2xl font-extrabold text-purple-700">
              {estudiante.nombre}
            </h2>

            <p className="mt-2 font-bold text-slate-600">{estudiante.aula}</p>
            <p className="mt-1 font-bold text-slate-600">
              Avatar Nivel {estudiante.nivel}
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-white/80 p-5 shadow-md">
            <div className="mb-2 flex justify-between font-extrabold text-slate-700">
              <span>Progreso General</span>
              <span>{estudiante.progresoGeneral}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${estudiante.progresoGeneral}%` }}
              />
            </div>

            <p className="mt-4 text-center text-lg font-extrabold text-purple-700">
              {estudiante.estadoGeneral}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-xl">
          <h3 className="mb-6 text-3xl font-extrabold text-purple-700">
            Cursos evaluados
          </h3>

          <div className="space-y-5">
            {cursos.map((curso) => (
              <div
                key={curso.nombre}
                className="rounded-3xl border border-purple-100 bg-purple-50 p-5"
              >
                <button
                  onClick={() =>
                    setCursoAbierto(
                      cursoAbierto === curso.nombre ? null : curso.nombre
                    )
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-extrabold text-purple-700">
                      {curso.nombre}
                    </h4>

                    <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-purple-700">
                      {curso.estado}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span>Avance del curso</span>
                      <span>{curso.porcentaje}%</span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${curso.porcentaje}%` }}
                      />
                    </div>
                  </div>
                </button>

                {cursoAbierto === curso.nombre && (
                  <div className="mt-5 space-y-4 rounded-3xl bg-white p-5">
                    {curso.capacidades.map((capacidad) => (
                      <div key={capacidad.nombre}>
                        <div className="mb-2 flex justify-between font-bold text-slate-700">
                          <span>{capacidad.nombre}</span>
                          <span>{capacidad.porcentaje}% - {capacidad.estado}</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${capacidad.porcentaje}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}