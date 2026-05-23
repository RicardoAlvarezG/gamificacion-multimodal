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

export default function DocenteAulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [alumnos, setAlumnos] = useState<Estudiante[]>([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState<number | null>(null);
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

  const cargarEstudiantes = async (aulaId: number) => {
    try {
      const res = await fetch(`/api/estudiantes?aulaId=${aulaId}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar estudiantes");
        return;
      }

      setAlumnos(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      alert("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    cargarAulas();
  }, []);

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

        {loading ? (
          <p className="text-xl font-bold text-slate-600">Cargando aulas...</p>
        ) : (
          <>
            {!aulaSeleccionada && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {aulas.length === 0 ? (
                  <p className="text-lg font-bold text-slate-600">
                    No tienes aulas disponibles.
                  </p>
                ) : (
                  aulas.map((aula, index) => (
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
                        {index % 3 === 0
                          ? "🧸"
                          : index % 3 === 1
                          ? "⭐"
                          : "🐰"}
                      </div>

                      <h2 className="text-3xl font-extrabold text-purple-700">
                        {aula.nombre}
                      </h2>

                      <p className="mt-4 text-lg font-semibold text-slate-700">
                        🌞 Turno: {aula.turno}
                      </p>

                      <p className="mt-2 text-lg font-semibold text-slate-700">
                        👦 Estudiantes: {aula.estudiantes?.length ?? 0}
                      </p>

                      <button
                        onClick={() => {
                          setAulaSeleccionada(aula.id);
                          cargarEstudiantes(aula.id);
                        }}
                        className="mt-8 w-full rounded-2xl bg-white px-5 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105"
                      >
                        Ver detalle →
                      </button>
                    </article>
                  ))
                )}
              </div>
            )}

            {aulaSeleccionada && aulaActual && (
              <div className="rounded-[2rem] bg-white/80 p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-purple-700">
                      🏫 {aulaActual.nombre}
                    </h2>

                    <p className="mt-1 text-slate-600">
                      Lista básica de estudiantes del aula seleccionada.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAulaSeleccionada(null);
                      setAlumnos([]);
                    }}
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
                        <th className="p-4">Puntos</th>
                        <th className="p-4">Nivel</th>
                        <th className="p-4">Aula</th>
                      </tr>
                    </thead>

                    <tbody>
                      {alumnosDelAula.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-6 text-center font-semibold text-slate-500"
                          >
                            No hay estudiantes registrados en esta aula.
                          </td>
                        </tr>
                      ) : (
                        alumnosDelAula.map((alumno) => (
                          <tr
                            key={alumno.id}
                            className="border-b border-purple-100 hover:bg-yellow-50"
                          >
                            <td className="p-4 text-3xl">
                              {alumno.perfil?.avatar || "🧒"}
                            </td>

                            <td className="p-4 font-semibold text-slate-700">
                              {alumno.nombres} {alumno.apellidos}
                            </td>

                            <td className="p-4 text-slate-700">
                              ⭐ {alumno.perfil?.puntosTotal ?? 0}
                            </td>

                            <td className="p-4 text-slate-700">
                              Nivel {alumno.perfil?.nivel ?? 1}
                            </td>

                            <td className="p-4 text-slate-700">
                              {aulaActual.nombre}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}