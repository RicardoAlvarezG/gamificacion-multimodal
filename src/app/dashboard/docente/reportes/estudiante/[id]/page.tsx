"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Perfil = {
  avatar?: string | null;
  nivel?: number;
  puntosTotal?: number;
};

type Capacidad = {
  id: number;
  nombre: string;
  area: string;
  color: string;
};

type ProgresoCapacidad = {
  id: number;
  puntos: number;
  nivel: string;
  capacidad: Capacidad;
};

type Estudiante = {
  id: number;
  nombres: string;
  apellidos: string;
  aula: {
    id: number;
    docenteId: number | null;
  };
  perfil?: Perfil | null;
  progresosCapacidad?: ProgresoCapacidad[];
};

type CursoReporte = {
  nombre: string;
  porcentaje: number;
  estado: string;
  capacidades: {
    nombre: string;
    porcentaje: number;
    estado: string;
  }[];
};

const obtenerImagenAvatar = (avatar?: string | null, nivel?: number) => {
  if (!avatar) return null;
  return `/avatares/${avatar}/nivel${nivel || 1}.webp`;
};

const calcularPorcentajeCapacidad = (puntos: number) => {
  return Math.min(Math.round((puntos / 200) * 100), 100);
};

const normalizarEstado = (estado: string) => {
  return estado.replace("_", " ");
};

const calcularEstadoPorcentaje = (porcentaje: number) => {
  if (porcentaje >= 81) return "DESTACADO";
  if (porcentaje >= 61) return "LOGRADO";
  if (porcentaje >= 41) return "EN PROCESO";
  return "EN INICIO";
};

const construirCursosDesdeProgresos = (
  progresos: ProgresoCapacidad[] = []
): CursoReporte[] => {
  const cursosAgrupados: Record<string, CursoReporte> = {};

  progresos.forEach((progreso) => {
    const area = progreso.capacidad.area || "Sin área";
    const porcentajeCapacidad = calcularPorcentajeCapacidad(progreso.puntos);
    const estadoCapacidad = normalizarEstado(progreso.nivel);

    if (!cursosAgrupados[area]) {
      cursosAgrupados[area] = {
        nombre: area,
        porcentaje: 0,
        estado: "EN INICIO",
        capacidades: [],
      };
    }

    cursosAgrupados[area].capacidades.push({
      nombre: progreso.capacidad.nombre,
      porcentaje: porcentajeCapacidad,
      estado: estadoCapacidad,
    });
  });

  return Object.values(cursosAgrupados).map((curso) => {
    const suma = curso.capacidades.reduce(
      (total, capacidad) => total + capacidad.porcentaje,
      0
    );

    const promedio =
      curso.capacidades.length > 0
        ? Math.round(suma / curso.capacidades.length)
        : 0;

    return {
      ...curso,
      porcentaje: promedio,
      estado: calcularEstadoPorcentaje(promedio),
    };
  });
};

const calcularProgresoGeneral = (cursos: CursoReporte[]) => {
  if (cursos.length === 0) return 0;

  const suma = cursos.reduce((total, curso) => total + curso.porcentaje, 0);

  return Math.round(suma / cursos.length);
};

export default function ReporteEstudianteDocentePage() {
  const params = useParams();
  const estudianteId = Number(params.id);

  const [cursoAbierto, setCursoAbierto] = useState<string | null>(null);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstudiante = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          alert("No hay usuario logueado");
          return;
        }

        const res = await fetch(`/api/estudiantes/${estudianteId}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al cargar estudiante");
          return;
        }

        setEstudiante(data);
      } catch (error) {
        console.error("Error al cargar estudiante:", error);
        alert("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    cargarEstudiante();
  }, [estudianteId]);

  const cursos = construirCursosDesdeProgresos(
    estudiante?.progresosCapacidad ?? []
  );

  const progresoGeneral = calcularProgresoGeneral(cursos);
  const estadoGeneral = calcularEstadoPorcentaje(progresoGeneral);
  const nivelAvatar = estudiante?.perfil?.nivel ?? 1;
  const avatarRuta = obtenerImagenAvatar(
    estudiante?.perfil?.avatar,
    nivelAvatar
  );

  if (loading) {
    return (
      <div className="mx-10 mt-8 rounded-[3rem] bg-white/90 p-12 text-xl font-bold text-slate-600 shadow-2xl">
        Cargando reporte del estudiante...
      </div>
    );
  }

  if (!estudiante) {
    return (
      <div className="mx-10 mt-8 rounded-[3rem] bg-white/90 p-12 shadow-2xl">
        <p className="text-xl font-bold text-red-500">
          No se encontró el estudiante.
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
          href={`/dashboard/docente/reportes/aula/${estudiante.aula.id}`}
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700"
        >
          ← Regresar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-white text-7xl shadow-xl">
              {avatarRuta ? (
                <img
                  src={avatarRuta}
                  alt="Avatar"
                  className="h-full w-full object-cover scale-125"
                />
              ) : (
                <span>👤</span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-purple-700">
              {estudiante.nombres} {estudiante.apellidos}
            </h2>

            <p className="mt-2 font-bold text-slate-600">
              Reporte individual
            </p>

            <p className="mt-1 font-bold text-slate-600">
              Avatar Nivel {nivelAvatar}
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-white/80 p-5 shadow-md">
            <div className="mb-2 flex justify-between font-extrabold text-slate-700">
              <span>Progreso General</span>
              <span>{progresoGeneral}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${progresoGeneral}%` }}
              />
            </div>

            <p className="mt-4 text-center text-lg font-extrabold text-purple-700">
              {estadoGeneral}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-purple-100 bg-white p-8 shadow-xl">
          <h3 className="mb-6 text-3xl font-extrabold text-purple-700">
            Cursos evaluados
          </h3>

          <div className="space-y-5">
            {cursos.length === 0 ? (
              <div className="rounded-3xl bg-purple-50 p-6 text-lg font-bold text-slate-500">
                Aún no hay evidencias registradas para este estudiante.
              </div>
            ) : (
              cursos.map((curso) => (
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
                            <span>
                              {capacidad.porcentaje}% - {capacidad.estado}
                            </span>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}