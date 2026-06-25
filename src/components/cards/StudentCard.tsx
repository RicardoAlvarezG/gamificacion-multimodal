"use client";

import { useState } from "react";

type StudentCardProps = {
  estudianteId: number;
  nombres: string;
  apellidos: string;
  aula: string;
  avatar: string | null;
  puntos: number;
  nivel: number;
};

const avatares = [
  { id: "perro", icono: "🐶", nombre: "Perrito" },
  { id: "gato", icono: "🐱", nombre: "Gatito" },
  { id: "conejo", icono: "🐰", nombre: "Conejo" },
  { id: "panda", icono: "🐼", nombre: "Panda" },
  { id: "zorro", icono: "🦊", nombre: "Zorro" },
  { id: "cerdito", icono: "🐷", nombre: "Cerdito" },
  { id: "pinguino", icono: "🐧", nombre: "Pingüino" },
  { id: "nutria", icono: "🦦", nombre: "Nutria" },
  { id: "capibara", icono: "🦫", nombre: "Capibara" },
];

export default function StudentCard({
  estudianteId,
  nombres,
  apellidos,
  aula,
  avatar,
  puntos,
  nivel,
}: StudentCardProps) {
  const [avatarActual, setAvatarActual] = useState(avatar);
  const [mostrarAvatares, setMostrarAvatares] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const seleccionarAvatar = async (avatarId: string) => {
    try {
      setGuardando(true);

      const res = await fetch("/api/gamificacion/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteId,
          avatar: avatarId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al guardar avatar");
        return;
      }

      setAvatarActual(avatarId);
      setMostrarAvatares(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al seleccionar avatar");
    } finally {
      setGuardando(false);
    }
  };

  const avatarSeleccionado = avatares.find((a) => a.id === avatarActual);

  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMostrarAvatares(!mostrarAvatares)}
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-4xl hover:scale-105 transition"
        >
          {avatarSeleccionado ? avatarSeleccionado.icono : "➕"}
        </button>

        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {nombres} {apellidos}
          </h3>
          <p className="text-sm text-slate-500">{aula}</p>
          <button
            type="button"
            onClick={() => setMostrarAvatares(!mostrarAvatares)}
            className="mt-1 text-sm font-semibold text-purple-600 hover:text-purple-800"
          >
            {avatarSeleccionado ? "Cambiar avatar" : "Elegir avatar"}
          </button>
        </div>
      </div>

      {mostrarAvatares && (
        <div className="mt-5 grid grid-cols-3 gap-3 rounded-3xl bg-purple-50 p-4">
          {avatares.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={guardando}
              onClick={() => seleccionarAvatar(item.id)}
              className="rounded-2xl bg-white p-3 text-center shadow-sm hover:scale-105 transition disabled:opacity-60"
            >
              <div className="text-3xl">{item.icono}</div>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                {item.nombre}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-yellow-100 p-4 text-center">
          <p className="text-sm font-semibold text-yellow-700">Puntos</p>
          <p className="text-2xl font-bold text-yellow-600">{puntos}</p>
        </div>

        <div className="rounded-2xl bg-sky-100 p-4 text-center">
          <p className="text-sm font-semibold text-sky-700">Nivel</p>
          <p className="text-2xl font-bold text-sky-600">{nivel}</p>
        </div>
      </div>
    </article>
  );
}