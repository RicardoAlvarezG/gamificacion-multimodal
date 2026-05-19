"use client";

import { useState } from "react";
import Link from "next/link";
import DocenteCard from "@/components/cards/DocenteCard";
import SolicitudDocenteCard from "@/components/cards/SolicitudDocenteCard";

export default function DocentesPage() {
  const [activeTab, setActiveTab] = useState<"docentes" | "solicitudes">(
    "docentes"
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

      {activeTab === "docentes" ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <DocenteCard
            nombre="María Pérez"
            usuario="DOC-001"
            aulas={2}
            estado="Activo"
          />

          <DocenteCard
            nombre="Carlos López"
            usuario="DOC-002"
            aulas={1}
            estado="Activo"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <SolicitudDocenteCard
            nombre="Ana Torres"
            usuario="DOC-003"
            codigo="INST-X4K92A"
          />

          <SolicitudDocenteCard
            nombre="Luis Ramírez"
            usuario="DOC-004"
            codigo="INST-X4K92A"
          />
        </div>
      )}
    </div>
  );
}