"use client";

import { useEffect, useState } from "react";
import {
  limpiarLetras,
  normalizarEspacios,
  soloLetras,
} from "@/lib/validacionesCampos";

type Estudiante = {
  id: number;
  nombres: string;
  apellidos: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  estudiante: Estudiante | null;
  aulaId: number;
  onUpdated: () => void;
};

export default function EditEstudianteModal({
  isOpen,
  onClose,
  estudiante,
  aulaId,
  onUpdated,
}: Props) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (estudiante) {
      setNombres(estudiante.nombres);
      setApellidos(estudiante.apellidos);
    }
  }, [estudiante]);

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estudiante) return;

    const nombresNormalizados = normalizarEspacios(nombres);
    const apellidosNormalizados = normalizarEspacios(apellidos);

    if (!nombresNormalizados || !apellidosNormalizados) {
      alert("Ingresa nombres y apellidos");
      return;
    }

    if (!soloLetras(nombresNormalizados)) {
      alert("Los nombres solo deben contener letras");
      return;
    }

    if (!soloLetras(apellidosNormalizados)) {
      alert("Los apellidos solo deben contener letras");
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

    try {
      setLoading(true);

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

      const res = await fetch("/api/estudiantes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteId: estudiante.id,
          nombres: nombresNormalizados,
          apellidos: apellidosNormalizados,
          aulaId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al editar estudiante");
        return;
      }

      alert("Estudiante actualizado correctamente");

      setNombres(nombresNormalizados);
      setApellidos(apellidosNormalizados);
      setPassword("");

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error al editar estudiante:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !estudiante) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="w-full max-w-md rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-3xl font-extrabold text-purple-700">
            Editar estudiante
          </h3>

          <button
            onClick={onClose}
            className="rounded-full bg-white px-4 py-2 font-bold text-purple-700 shadow-md"
          >
            ✕
          </button>
        </div>

        <form onSubmit={guardarCambios} className="space-y-4">
          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Nombres
            </label>

            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(limpiarLetras(e.target.value))}
              onBlur={() => setNombres(normalizarEspacios(nombres))}
              className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Apellidos
            </label>

            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(limpiarLetras(e.target.value))}
              onBlur={() => setApellidos(normalizarEspacios(apellidos))}
              className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
            />
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
              className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-white px-5 py-4 font-extrabold text-slate-600 shadow-md hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-yellow-300 px-5 py-4 font-extrabold text-yellow-900 shadow-md hover:bg-yellow-400 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}