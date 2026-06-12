"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ProgresoCapacidad = {
  puntos: number;
};

type Estudiante = {
  id: number;
  progresosCapacidad?: ProgresoCapacidad[];
};

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docenteId?: number | null;
  estudiantes?: Estudiante[];
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

  const suma = progresos.reduce((total, progreso) => {
    return total + calcularPorcentajeCapacidad(progreso.puntos);
  }, 0);

  return Math.round(suma / progresos.length);
};

const calcularPorcentajeAula = (aula: Aula) => {
  const estudiantes = aula.estudiantes ?? [];

  if (estudiantes.length === 0) return 0;

  const suma = estudiantes.reduce((total, estudiante) => {
    return total + calcularPorcentajeEstudiante(estudiante);
  }, 0);

  return Math.round(suma / estudiantes.length);
};

export default function ReporteDocentePage() {
  const params = useParams();
  const docenteId = Number(params.id);

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAulas = async () => {
      try {
        const res = await fetch("/api/aulas");
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al cargar aulas");
          return;
        }

        const aulasDelDocente = data.filter(
          (aula: Aula) => Number(aula.docenteId) === docenteId
        );

        setAulas(aulasDelDocente);
      } catch (error) {
        console.error("Error al cargar aulas del docente:", error);
        alert("Error de conexión al cargar aulas del docente");
      } finally {
        setLoading(false);
      }
    };

    cargarAulas();
  }, [docenteId]);

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            👩‍🏫 Reporte del docente
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

      {loading ? (
        <p className="text-xl font-bold text-slate-500">
          Cargando aulas del docente...
        </p>
      ) : aulas.length === 0 ? (
        <p className="text-xl font-bold text-slate-500">
          Este docente no tiene aulas asignadas.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {aulas.map((aula, index) => {
            const porcentaje = calcularPorcentajeAula(aula);
            const estado = calcularEstadoPorcentaje(porcentaje);
            const cantidadEstudiantes = aula.estudiantes?.length ?? 0;

            return (
              <div
                key={aula.id}
                className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-5 text-5xl">🏫</div>

                <h2 className="text-2xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-2 font-bold text-slate-500">
                  Turno: {aula.turno}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between font-bold">
                    <span>Progreso General</span>
                    <span>{porcentaje}%</span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-purple-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2 font-semibold text-slate-600">
                  <p>👦 Estudiantes: {cantidadEstudiantes}</p>
                  <p>⭐ Estado: {estado}</p>
                </div>

                <Link
                  href={`/dashboard/administrador/reportes/aula/${aula.id}`}
                  className="mt-8 block w-full rounded-3xl bg-purple-100 px-5 py-4 text-center font-extrabold text-purple-700 hover:bg-purple-200"
                >
                  Ver Estudiantes →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}