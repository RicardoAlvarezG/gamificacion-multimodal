"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Estudiante = {
  id: number;
  aulaId: number;
  nombres: string;
  apellidos: string;
  perfil?: {
    avatar?: string | null;
    nivel: number;
    puntosTotal: number;
  } | null;
};

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docenteId?: number | null;
  creadoPorId?: number | null;
  estudiantes?: Estudiante[];
};

export default function DocenteReportesPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  const [docente, setDocente] = useState({
    id: 0,
    tipo: "independiente",
  });

  const cargarAulas = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No hay usuario logueado");
        return;
      }

      const user = JSON.parse(usuarioGuardado);

      const tipoDocente = user.institucionId
        ? "institucional"
        : "independiente";

      setDocente({
        id: user.id,
        tipo: tipoDocente,
      });

      const res = await fetch("/api/aulas");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar aulas");
        return;
      }

      const aulasFiltradas =
        tipoDocente === "institucional"
          ? data.filter((aula: Aula) => aula.docenteId === user.id)
          : data.filter((aula: Aula) => aula.creadoPorId === user.id);

      setAulas(aulasFiltradas);
    } catch (error) {
      console.error("Error al cargar aulas:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAulas();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              📊
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Reportes
              </h1>

              <p className="mt-2 text-lg text-slate-700">
                Revisa el avance de tus aulas y el progreso individual de tus estudiantes.
              </p>

              <p className="mt-2 text-sm font-bold text-purple-600">
                Tipo de docente:{" "}
                {docente.tipo === "institucional"
                  ? "Docente institucional"
                  : "Docente independiente"}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/docente"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
          >
            ← Regresar
          </Link>
        </div>

        {loading ? (
          <p className="text-xl font-bold text-slate-600">
            Cargando reportes...
          </p>
        ) : aulas.length === 0 ? (
          <div className="rounded-[2rem] bg-white/80 p-10 text-center shadow-xl">
            <p className="text-2xl font-extrabold text-slate-600">
              No tienes aulas disponibles para reportes.
            </p>

            <p className="mt-3 text-slate-500">
              Cuando tengas aulas asignadas o creadas, aparecerán en esta sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {aulas.map((aula, index) => (
              <article
                key={aula.id}
                className={`${
                  index % 3 === 0
                    ? "bg-green-100"
                    : index % 3 === 1
                    ? "bg-blue-100"
                    : "bg-pink-100"
                } rounded-[2rem] p-8 shadow-xl transition hover:scale-[1.02]`}
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {index % 3 === 0 ? "🏫" : index % 3 === 1 ? "⭐" : "📚"}
                </div>

                <h2 className="text-3xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-4 text-lg font-semibold text-slate-700">
                  {aula.turno === "Tarde" ? "☁️" : "☀️"} Turno: {aula.turno}
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-700">
                  👦 Estudiantes: {aula.estudiantes?.length ?? 0}
                </p>

                <Link
                  href={`/dashboard/docente/reportes/aula/${aula.id}`}
                  className="mt-8 block w-full rounded-2xl bg-white px-5 py-4 text-center font-bold text-purple-700 shadow-md transition hover:scale-105"
                >
                  Ver reporte →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}