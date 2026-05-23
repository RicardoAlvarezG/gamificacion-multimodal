"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CrearAulaDocentePage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [turno, setTurno] = useState("Mañana");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    const docente = JSON.parse(usuarioGuardado);

    if (docente.institucionId) {
      alert("Solo el docente independiente puede crear aulas");
      return;
    }

    try {
      setLoading(true);

      const validacion = await fetch("/api/validar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: docente.id,
          password,
        }),
      });

      const resultado = await validacion.json();

      if (!validacion.ok) {
        alert(resultado.error || "Contraseña incorrecta");
        return;
      }

      const res = await fetch("/api/aulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          turno,
          institucionId: null,
          docenteId: null,
          creadoPorId: docente.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear aula");
        return;
      }

      alert("Aula creada correctamente");
      router.push("/dashboard/docente/aulas");
    } catch (error) {
      console.error("Error al crear aula:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

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
                Crear aula
              </h1>

              <p className="mt-2 text-lg text-slate-700">
                Crea un aula propia para gestionar tus estudiantes.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/docente/aulas"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
          >
            ← Regresar
          </Link>
        </div>

        <div className="mx-auto max-w-xl rounded-[2rem] bg-white/80 p-8 shadow-xl">
          <form onSubmit={crearAula} className="space-y-5">
            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Nombre del aula
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Aula Conejitos"
                className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700">
                Turno
              </label>

              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
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
                className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard/docente/aulas"
                className="w-full rounded-2xl bg-white px-5 py-4 text-center font-extrabold text-slate-600 shadow-md hover:bg-slate-100"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-green-400 px-5 py-4 font-extrabold text-green-950 shadow-md hover:bg-green-500 disabled:opacity-60"
              >
                {loading ? "Creando..." : "Crear aula"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}