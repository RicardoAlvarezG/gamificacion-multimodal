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

type Docente = {
  id: number;
  nombre: string;
  apellido?: string | null;
  estado: string;
  rol?: string;
  institucionId?: number | null;
};

export default function AulasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [aulaEditando, setAulaEditando] = useState<Aula | null>(null);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState("");
  const [guardandoDocente, setGuardandoDocente] = useState(false);

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

  const cargarDocentes = async () => {
  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      alert("No hay usuario logueado");
      return;
    }

    const admin = JSON.parse(usuarioGuardado);

    const res = await fetch(`/api/docentes?institucionId=${admin.institucionId}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al cargar docentes");
      return;
    }

    const docentesActivos = data.filter(
  (docente: any) => docente.estado?.toLowerCase() === "activo"
    );

    setDocentes(docentesActivos);
  } catch (error) {
    console.error("Error al cargar docentes:", error);
    alert("Error al conectar con el servidor");
  }
};
const abrirModalDocente = (aula: Aula) => {
  setAulaEditando(aula);
  setDocenteSeleccionado("");
};

const guardarDocenteAula = async () => {
  if (!aulaEditando) return;

  if (!docenteSeleccionado) {
    alert("Selecciona un docente");
    return;
  }

  try {
    setGuardandoDocente(true);

    const res = await fetch("/api/aulas", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aulaId: aulaEditando.id,
        docenteId: Number(docenteSeleccionado),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al asignar docente");
      return;
    }

    alert("Docente asignado correctamente");

    setAulaEditando(null);
    setDocenteSeleccionado("");
    cargarAulas();
  } catch (error) {
    console.error("Error al asignar docente:", error);
    alert("Error al conectar con el servidor");
  } finally {
    setGuardandoDocente(false);
  }
};

  useEffect(() => {
    cargarAulas();
    cargarDocentes();
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
              <div key={aula.id} className="space-y-4">
                <AulaCard
                  name={aula.nombre}
                  docente={nombreDocente}
                  turno={aula.turno === "Tarde" ? "Tarde" : "Mañana"}
                  estado={aula.docente ? "Activa" : "Docente en espera"}
                  emoji={aula.docente ? "🐰" : "🧸"}
                  href={`/dashboard/administrador/aulas/${aula.id}`}
                />

                <button
                  type="button"
                  onClick={() => abrirModalDocente(aula)}
                  className="w-full rounded-3xl bg-amber-400 px-6 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-amber-500"
                >
                  {aula.docente ? "Cambiar docente" : "Asignar docente"}
                </button>
              </div>
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
          {aulaEditando && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
                <h2 className="text-3xl font-extrabold text-purple-700">
                  Asignar docente
                </h2>

                <p className="mt-2 text-slate-600">
                  Aula seleccionada:
                  <span className="ml-2 font-bold">{aulaEditando.nombre}</span>
                </p>

                <div className="mt-6">
                  <label className="mb-2 block font-bold text-slate-700">
                    Selecciona un docente
                  </label>

                  <select
                    value={docenteSeleccionado}
                    onChange={(e) => setDocenteSeleccionado(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  >
                    <option value="">Seleccionar docente</option>

                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombre} {docente.apellido ?? ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setAulaEditando(null)}
                    className="flex-1 rounded-2xl bg-slate-200 px-6 py-3 font-bold"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={guardarDocenteAula}
                    disabled={guardandoDocente}
                    className="flex-1 rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white"
                  >
                    {guardandoDocente ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}