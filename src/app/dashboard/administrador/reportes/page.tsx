"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReporteDocenteCard from "@/components/cards/ReporteDocenteCard";

type Docente = {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  estado: string;
};

type Aula = {
  id: number;
  docenteId?: number | null;
  estudiantes?: {
    id: number;
  }[];
};

export default function ReportesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          alert("No hay usuario logueado");
          return;
        }

        const user = JSON.parse(usuarioGuardado);

        if (!user.institucionId) {
          alert(
            "No se encontró la institución del administrador. Vuelve a iniciar sesión."
          );
          return;
        }

        const res = await fetch(
          `/api/docentes?institucionId=${user.institucionId}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al cargar docentes");
          return;
        }

        setDocentes(data);

        const resAulas = await fetch("/api/aulas");
        const dataAulas = await resAulas.json();

        if (!resAulas.ok) {
          alert(dataAulas.error || "Error al cargar aulas");
          return;
        }

        const aulasInstitucion = dataAulas.filter(
          (aula: any) => aula.institucionId === user.institucionId
        );

        setAulas(aulasInstitucion);


      } catch {
        alert("Error de conexión al cargar docentes");
      } finally {
        setLoading(false);
      }
    };

    cargarDocentes();
  }, []);

        const docentesActivos = docentes.filter(
          (docente) => docente.estado === "activo"
        );

        const obtenerAulasDocente = (docenteId: number) => {
          return aulas.filter((aula) => Number(aula.docenteId) === docenteId);
        };

        const contarEstudiantesDocente = (docenteId: number) => {
          const aulasDocente = obtenerAulasDocente(docenteId);

          return aulasDocente.reduce((total, aula) => {
            return total + (aula.estudiantes?.length ?? 0);
          }, 0);
        };

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

      {loading ? (
        <p className="text-lg font-bold text-slate-500">
          Cargando reportes de docentes...
        </p>
      ) : docentesActivos.length === 0 ? (
        <p className="text-lg font-bold text-slate-500">
          No hay docentes activos para mostrar reportes.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {docentesActivos.map((docente, index) => (
            <ReporteDocenteCard
              key={docente.id}
              id={docente.id}
              nombre={docente.nombre}
              aulas={obtenerAulasDocente(docente.id).length}
              estudiantes={contarEstudiantesDocente(docente.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}