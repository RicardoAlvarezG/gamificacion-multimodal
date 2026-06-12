"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProgresoCapacidad = {
  puntos: number;
};

type Estudiante = {
  id: number;
  nombres: string;
  apellidos: string;
  progresosCapacidad?: ProgresoCapacidad[];
};

type AulaDetalle = {
  id: number;
  nombre: string;
  turno: string;
  docenteId?: number | null;
  docente?: {
    nombre: string;
    apellido?: string | null;
  } | null;
  estudiantes: Estudiante[];
};

const calcularPorcentajeCapacidad = (puntos: number) => {
  return Math.min(Math.round((puntos / 200) * 100), 100);
};

const calcularEstadoPorcentaje = (porcentaje: number) => {
  if (porcentaje >= 81) return "DESTACADO";
  if (porcentaje >= 61) return "LOGRADO";
  if (porcentaje >= 41) return "EN PROCESO";
  return "EN INICIO";
};

const calcularPorcentajeEstudiante = (estudiante: Estudiante) => {
  const progresos = estudiante.progresosCapacidad ?? [];

  if (progresos.length === 0) return 0;

  const sumaPorcentajes = progresos.reduce((total, progreso) => {
    return total + calcularPorcentajeCapacidad(progreso.puntos);
  }, 0);

  return Math.round(sumaPorcentajes / progresos.length);
};

export default function ReporteAulaDocentePage() {
  const params = useParams();
  const id = params.id as string;

  const [aula, setAula] = useState<AulaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAula = async () => {
      try {
        const res = await fetch(`/api/aulas/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al cargar el aula");
          return;
        }

        setAula(data);
      } catch (error) {
        console.error("Error al cargar aula:", error);
        alert("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    cargarAula();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-10 mt-8 rounded-[3rem] bg-white/90 p-12 text-xl font-bold text-slate-600 shadow-2xl">
        Cargando reporte del aula...
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="mx-10 mt-8 rounded-[3rem] bg-white/90 p-12 shadow-2xl">
        <p className="text-xl font-bold text-red-500">
          No se encontró el aula.
        </p>

        <Link
          href="/dashboard/docente/reportes"
          className="mt-6 inline-block rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white"
        >
          ← Volver
        </Link>
      </div>
    );
  }

  const nombreDocente = aula.docente
    ? `${aula.docente.nombre} ${aula.docente.apellido ?? ""}`
    : "Docente";

  const porcentajesEstudiantes = aula.estudiantes.map((estudiante) =>
    calcularPorcentajeEstudiante(estudiante)
  );

  const porcentajeAula =
    porcentajesEstudiantes.length > 0
      ? Math.round(
          porcentajesEstudiantes.reduce((total, valor) => total + valor, 0) /
            porcentajesEstudiantes.length
        )
      : 0;

  const estadoAula = calcularEstadoPorcentaje(porcentajeAula);

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            🏫 {aula.nombre}
          </h1>

          <p className="mt-3 text-lg font-semibold text-slate-600">
            👩‍🏫 Docente: {nombreDocente}
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-600">
            {aula.turno === "Tarde" ? "☁️" : "☀️"} Turno: {aula.turno}
          </p>

          <div className="mt-6 max-w-xl rounded-3xl bg-purple-50 p-5 shadow-md">
            <div className="mb-2 flex justify-between font-extrabold text-slate-700">
              <span>Progreso general del aula</span>
              <span>{porcentajeAula}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${porcentajeAula}%` }}
              />
            </div>

            <p className="mt-3 font-extrabold text-purple-700">
              Estado: {estadoAula}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/docente/reportes"
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

        {aula.estudiantes.length === 0 ? (
          <div className="px-8 py-8 text-lg font-bold text-slate-500">
            Aún no hay estudiantes registrados en esta aula.
          </div>
        ) : (
          aula.estudiantes.map((estudiante) => {
            const porcentaje = calcularPorcentajeEstudiante(estudiante);
            const estado = calcularEstadoPorcentaje(porcentaje);

            return (
              <div
                key={estudiante.id}
                className="grid grid-cols-4 items-center border-t border-purple-100 px-8 py-5 font-semibold text-slate-700 transition hover:bg-purple-50"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">👧</span>
                  <span>
                    {estudiante.nombres} {estudiante.apellidos}
                  </span>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{porcentaje}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="font-extrabold text-purple-700">{estado}</div>

                <div className="text-center">
                  <Link
                    href={`/dashboard/docente/reportes/estudiante/${estudiante.id}`}
                    className="rounded-2xl bg-purple-100 px-6 py-3 font-extrabold text-purple-700 hover:bg-purple-200"
                  >
                    Ver Reporte →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}