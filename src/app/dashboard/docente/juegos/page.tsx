"use client";

import { useState } from "react";
import Link from "next/link";

const aulas = [
  { id: 1, nombre: "Aula Ositos", icono: "🧸", color: "bg-green-100" },
  { id: 2, nombre: "Aula Estrellitas", icono: "⭐", color: "bg-blue-100" },
  { id: 3, nombre: "Aula Conejitos", icono: "🐰", color: "bg-pink-100" },
];

export default function DocenteJuegosPage() {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<any>(null);

  const fechaActual = new Date().toLocaleDateString("es-PE");
  const nombreSesion = "Sesión 1";

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-200 text-5xl shadow-md">
              🎮
            </div>

            <div>
              <h1 className="text-5xl font-extrabold text-purple-700">
                Juegos
              </h1>
              <p className="mt-2 text-lg text-slate-700">
                Selecciona un aula y crea una sesión de juego.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/docente"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105"
          >
            ← Regresar
          </Link>
        </div>

        {!aulaSeleccionada && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {aulas.map((aula) => (
              <button
                key={aula.id}
                onClick={() => setAulaSeleccionada(aula)}
                className={`${aula.color} rounded-[2rem] p-8 text-left shadow-xl transition hover:scale-[1.02]`}
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md">
                  {aula.icono}
                </div>

                <h2 className="text-3xl font-extrabold text-purple-700">
                  {aula.nombre}
                </h2>

                <p className="mt-4 font-semibold text-slate-700">
                  Click para crear sesión
                </p>
              </button>
            ))}
          </div>
        )}

        {aulaSeleccionada && (
          <div className="mx-auto max-w-xl rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl shadow-md">
                {aulaSeleccionada.icono}
              </div>

              <h2 className="text-3xl font-extrabold text-purple-700">
                {aulaSeleccionada.nombre}
              </h2>

              <p className="mt-2 font-semibold text-slate-600">
                Crea una sesión para iniciar los juegos del aula.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 shadow-md">
              <p className="mb-3 text-slate-700">
                📌 <strong>Nombre de sesión:</strong> {nombreSesion}
              </p>

              <p className="mb-3 text-slate-700">
                📅 <strong>Fecha:</strong> {fechaActual}
              </p>

              <p className="text-slate-700">
                🏫 <strong>Aula:</strong> {aulaSeleccionada.nombre}
              </p>
            </div>

            <div className="mt-7 flex gap-4">
              <button
                onClick={() => setAulaSeleccionada(null)}
                className="flex-1 rounded-2xl bg-white px-6 py-4 font-bold text-purple-700 shadow-md transition hover:scale-105"
              >
                ← Cambiar aula
              </button>

              <button className="flex-1 rounded-2xl bg-green-400 px-6 py-4 font-bold text-green-950 shadow-md transition hover:scale-105">
                ▶ Iniciar juego
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}