"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DocenteCard from "@/components/cards/DocenteCard";
import SolicitudDocenteCard from "@/components/cards/SolicitudDocenteCard";

type Docente = {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  estado: string;
};

export default function DocentesPage() {
  const [activeTab, setActiveTab] = useState<"docentes" | "solicitudes">(
    "docentes"
  );
  const [docentes, setDocentes] = useState<Docente[]>([]);
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
      } catch {
        alert("Error de conexión al cargar docentes");
      } finally {
        setLoading(false);
      }
    };

    cargarDocentes();
  }, []);

  const aprobarDocente = async (id: number) => {
    try {
      const res = await fetch("/api/docentes/aprobar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al aprobar docente");
        return;
      }

      setDocentes((prev) =>
        prev.map((docente) =>
          docente.id === id ? { ...docente, estado: "activo" } : docente
        )
      );

      alert("Docente aprobado correctamente");
    } catch {
      alert("Error de conexión al aprobar docente");
    }
  };

  const docentesActivos = docentes.filter(
    (docente) => docente.estado === "activo"
  );

  const docentesPendientes = docentes.filter(
    (docente) => docente.estado === "pendiente"
  );

  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] border border-white/70 bg-white/90 p-12 shadow-2xl">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-6xl">👩‍🏫</div>

          <div>
            <h1 className="text-5xl font-extrabold text-purple-700">
              Docentes
            </h1>
            <p className="mt-3 text-lg font-medium text-slate-600">
              Visualiza docentes registrados y solicitudes pendientes.
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

      <div className="mb-10 flex gap-4">
        <button
          onClick={() => setActiveTab("docentes")}
          className={`rounded-3xl px-8 py-4 font-extrabold transition ${
            activeTab === "docentes"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          }`}
        >
          Docentes registrados
        </button>

        <button
          onClick={() => setActiveTab("solicitudes")}
          className={`rounded-3xl px-8 py-4 font-extrabold transition ${
            activeTab === "solicitudes"
              ? "bg-yellow-400 text-white shadow-lg"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          Solicitudes
        </button>
      </div>

      {loading ? (
        <p className="text-lg font-bold text-slate-500">Cargando docentes...</p>
      ) : activeTab === "docentes" ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {docentesActivos.length === 0 ? (
            <p className="text-lg font-bold text-slate-500">
              No hay docentes registrados activos.
            </p>
          ) : (
            docentesActivos.map((docente) => (
              <DocenteCard
                key={docente.id}
                nombre={docente.nombre}
                usuario={docente.usuario}
                aulas={0}
                estado="Activo"
              />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {docentesPendientes.length === 0 ? (
            <p className="text-lg font-bold text-slate-500">
              No hay solicitudes pendientes.
            </p>
          ) : (
            docentesPendientes.map((docente) => (
              <SolicitudDocenteCard
                key={docente.id}
                id={docente.id}
                nombre={docente.nombre}
                usuario={docente.usuario}
                codigo="Pendiente de aprobación"
                onAprobar={aprobarDocente}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}