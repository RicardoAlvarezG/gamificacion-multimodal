"use client";

import { useEffect, useState } from "react";

interface CreateAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Docente = {
  id: number;
  nombre: string;
  apellido?: string | null;
  estado: string;
};

export default function CreateAulaModal({
  isOpen,
  onClose,
}: CreateAulaModalProps) {
  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("Mañana");
  const [docenteId, setDocenteId] = useState("");
  const [password, setPassword] = useState("");
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const cargarDocentes = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!usuarioGuardado) {
          alert("No hay usuario logueado");
          return;
        }

        const admin = JSON.parse(usuarioGuardado);

        const res = await fetch(
          `/api/docentes?institucionId=${admin.institucionId}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Error al cargar docentes");
          return;
        }

        const docentesActivos = data.filter(
          (docente: Docente) => docente.estado === "activo"
        );

        setDocentes(docentesActivos);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      }
    };

    cargarDocentes();
  }, [isOpen]);

  const crearAula = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Ingresa el nombre del aula");
      return;
    }

    if (!password.trim()) {
      alert("Confirma tu contraseña");
      return;
    }

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      alert("No hay usuario logueado");
      return;
    }

      const admin = JSON.parse(usuarioGuardado);

      const validacion = await fetch("/api/validar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: admin.id,
          password,
        }),
      });

      const resultado = await validacion.json();

      if (!validacion.ok) {
        alert(resultado.error || "Contraseña incorrecta");
        return;
      }

    try {
      setLoading(true);

      const res = await fetch("/api/aulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          turno,
          institucionId: admin.institucionId,
          docenteId: docenteId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear aula");
        return;
      }

      alert("Aula creada correctamente");

      setNombre("");
      setTurno("Mañana");
      setDocenteId("");
      setPassword("");

      onClose();
    } catch (error) {
      console.error("Error al crear aula:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-purple-700">
              Crear aula
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Registra una nueva aula para tu institución.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-purple-100 px-4 py-2 text-xl font-bold text-purple-700 hover:bg-purple-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={crearAula} className="space-y-5">
          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Nombre del aula
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Inicial 4 años"
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Docente asignado
            </label>
            <select
              value={docenteId}
              onChange={(e) => setDocenteId(e.target.value)}
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="">Docente en espera</option>

              {docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>
                  {docente.nombre} {docente.apellido ?? ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Turno
            </label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Confirma tu contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-100 px-5 py-4 font-extrabold text-slate-600 hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-purple-600 px-5 py-4 font-extrabold text-white shadow-lg hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear aula"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 