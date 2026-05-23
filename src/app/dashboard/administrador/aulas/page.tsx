"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AulaCard from "@/components/cards/AulaCard";
import CreateAulaModal from "@/components/forms/CreateAulaModal";

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docente?: {
    nombre: string;
    apellido?: string | null;
  } | null;
};

export default function AulasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarAulas = async () => {
    try {
      const res = await fetch("/api/aulas");
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al cargar aulas");
        return;
      }

          const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No hay usuario logueado");
        return;
      }

      const admin = JSON.parse(usuarioGuardado);

      const aulasInstitucion = data.filter(
        (aula: any) => aula.institucionId === admin.institucionId
      );

      setAulas(aulasInstitucion);

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
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] bg-white/90 p-12 shadow-2xl border border-white/70">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-6xl">🏫</div>

          <div>
            <h1 className="text-5xl font-extrabold text-purple-700">
              Mis aulas
            </h1>
            <p className="mt-3 text-lg font-medium text-slate-600">
              Visualiza y administra las aulas creadas.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/administrador"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700 hover:-translate-y-1"
        >
          ← Regresar
        </Link>
      </div>

      {loading ? (
        <p className="text-xl font-bold text-slate-500">Cargando aulas...</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {aulas.map((aula) => {
            const nombreDocente = aula.docente
              ? `${aula.docente.nombre} ${aula.docente.apellido ?? ""}`
              : "Docente en espera";

            return (
              <AulaCard
                key={aula.id}
                name={aula.nombre}
                docente={nombreDocente}
                turno={aula.turno === "Tarde" ? "Tarde" : "Mañana"}
                estado={aula.docente ? "Activa" : "Docente en espera"}
                emoji={aula.docente ? "🐰" : "🧸"}
              />
            );
          })}

          <div
            onClick={() => setIsModalOpen(true)}
            className="flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-purple-300 bg-white p-8 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-7xl font-extrabold text-purple-600">
              +
            </div>

            <h2 className="mt-8 text-3xl font-extrabold text-purple-700">
              Crear aula
            </h2>

            <p className="mt-4 text-center text-lg font-medium text-slate-600">
              Agrega una nueva aula
            </p>
          </div>

          <CreateAulaModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              cargarAulas();
            }}
          />
        </div>
      )}
    </div>
  );
}