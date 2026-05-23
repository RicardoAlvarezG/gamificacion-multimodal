"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Docente = {
  id: number;
  nombre: string;
  apellido?: string | null;
  estado: string;
};

type Aula = {
  id: number;
  nombre: string;
  turno: string;
  docenteId?: number | null;
  docente?: {
    id: number;
    nombre: string;
    apellido?: string | null;
  } | null;
};

export default function AsignarAulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [selecciones, setSelecciones] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("No hay usuario logueado");
        return;
      }

      const admin = JSON.parse(usuarioGuardado);

      const [resAulas, resDocentes] = await Promise.all([
        fetch("/api/aulas"),
        fetch(`/api/docentes?institucionId=${admin.institucionId}`),
      ]);

      const dataAulas = await resAulas.json();
      const dataDocentes = await resDocentes.json();

      if (!resAulas.ok) {
        alert(dataAulas.error || "Error al cargar aulas");
        return;
      }

      if (!resDocentes.ok) {
        alert(dataDocentes.error || "Error al cargar docentes");
        return;
      }

      const docentesActivos = dataDocentes.filter(
        (docente: Docente) => docente.estado === "activo"
      );

      setAulas(dataAulas);
      setDocentes(docentesActivos);

      const valoresIniciales: Record<number, string> = {};

      dataAulas.forEach((aula: Aula) => {
        valoresIniciales[aula.id] = aula.docenteId
          ? String(aula.docenteId)
          : "";
      });

      setSelecciones(valoresIniciales);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarDocente = async (aulaId: number) => {
    try {
      const password = prompt("Confirma tu contraseña de administrador:");

      if (!password) {
        alert("Debes ingresar tu contraseña");
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

      const res = await fetch("/api/aulas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aulaId,
          docenteId: selecciones[aulaId] || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al actualizar aula");
        return;
      }

      alert("Docente actualizado correctamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar docente:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 backdrop-blur-md p-10 shadow-2xl">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🏫
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Asignar aulas
              </h1>
              <p className="mt-2 text-slate-700 text-lg">
                Gestiona las aulas y asigna docentes fácilmente.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/administrador"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
          >
            ← Regresar
          </Link>
        </div>

        {loading ? (
          <p className="text-xl font-bold text-slate-600">Cargando aulas...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {aulas.map((aula, index) => {
              const tieneDocente = Boolean(aula.docente);

              return (
                <article
                  key={aula.id}
                  className={`${
                    index % 2 === 0 ? "bg-purple-100" : "bg-pink-100"
                  } rounded-[2rem] p-8 shadow-xl transition hover:scale-[1.02]`}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                      {tieneDocente ? "🧸" : "🐰"}
                    </div>

                    <span
                      className={`rounded-full px-5 py-2 text-sm font-bold shadow-sm ${
                        tieneDocente
                          ? "bg-green-200 text-green-800"
                          : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      {tieneDocente ? "Asignado" : "Pendiente"}
                    </span>
                  </div>

                  <h2 className="mb-5 text-3xl font-extrabold text-purple-700">
                    {aula.nombre}
                  </h2>

                  <p className="mb-3 text-slate-700 text-lg">
                    🌞 <strong>Turno:</strong> {aula.turno}
                  </p>

                  <p className="mb-5 text-slate-700 text-lg">
                    👩‍🏫 <strong>Docente actual:</strong>{" "}
                    {aula.docente
                      ? `${aula.docente.nombre} ${aula.docente.apellido ?? ""}`
                      : "Docente en espera"}
                  </p>

                  <label className="mb-2 block font-bold text-slate-700">
                    Cambiar / asignar docente
                  </label>

                  <select
                    value={selecciones[aula.id] ?? ""}
                    onChange={(e) =>
                      setSelecciones({
                        ...selecciones,
                        [aula.id]: e.target.value,
                      })
                    }
                    className="mb-6 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 font-semibold outline-none focus:border-purple-500"
                  >
                    <option value="">Docente en espera</option>

                    {docentes.map((docente) => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombre} {docente.apellido ?? ""}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => guardarDocente(aula.id)}
                    className="w-full rounded-2xl bg-purple-500 px-6 py-4 font-bold text-white shadow-md transition hover:scale-105 hover:bg-purple-600"
                  >
                    💾 Guardar cambios
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}