"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Estudiante = {
  id: number;
  nombres: string;
  apellidos: string;

  perfil?: {
    avatar: string | null;
    nivel: number;
  } | null;
};

type AulaDetalle = {
  id: number;
  nombre: string;
  turno: string;
  docente?: {
    nombre: string;
    apellido?: string | null;
  } | null;
  estudiantes: Estudiante[];
};

export default function AulaDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [aula, setAula] = useState<AulaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    cargarAula();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-xl font-bold text-slate-600">
        Cargando aula...
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="p-10">
        <p className="text-xl font-bold text-red-500">No se encontró el aula.</p>
        <Link href="/dashboard/administrador/aulas">← Volver</Link>
      </div>
    );
  }

  const nombreDocente = aula.docente
    ? `${aula.docente.nombre} ${aula.docente.apellido ?? ""}`
    : "Docente en espera";

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] bg-white/90 p-12 shadow-2xl border border-white/70">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-extrabold text-purple-700">
            {aula.nombre}
          </h1>
          <p className="mt-3 text-lg font-semibold text-slate-600">
            👩‍🏫 Docente: {nombreDocente}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-600">
            {aula.turno === "Tarde" ? "☁️" : "☀️"} Turno: {aula.turno}
          </p>
        </div>

        <Link
          href="/dashboard/administrador/aulas"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg hover:bg-purple-700"
        >
          ← Volver
        </Link>
      </div>

      <div className="rounded-[2rem] bg-purple-50 p-8">
        <h2 className="mb-6 text-3xl font-extrabold text-purple-700">
          Estudiantes del aula
        </h2>

        {aula.estudiantes.length === 0 ? (
          <p className="text-lg font-semibold text-slate-500">
            Aún no hay estudiantes registrados en esta aula.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
  {aula.estudiantes.map((estudiante) => (
    <div
      key={estudiante.id}
      className="rounded-[2rem] bg-white p-10 shadow-lg border border-purple-100 text-center"
    >
     <div className="flex justify-center">
      <img
        src={`/avatares/${estudiante.perfil?.avatar ?? "oso"}/nivel${
          estudiante.perfil?.nivel ?? 1
        }.webp`}
        alt="Avatar"
        className="h-52 w-52 object-contain"
      />
    </div>
      <p className="mt-3 text-lg font-bold text-purple-700">
        Nivel {estudiante.perfil?.nivel ?? 1}
      </p>

      <h3 className="mt-2 text-base font-extrabold text-slate-800">
        {estudiante.nombres}
      </h3>
    </div>
  ))}
</div>
        )}
      </div>
    </div>
  );
}