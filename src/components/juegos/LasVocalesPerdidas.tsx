"use client";

import { useMemo, useState } from "react";

type Props = {
  onFinalizar: () => void;
};

type Vocal = "A" | "E" | "I" | "O" | "U";

type ImagenObjeto = {
  nombre: string;
  vocal: Vocal;
  imagen: string;
};

const vocales: Vocal[] = ["A", "E", "I", "O", "U"];

const imagenesPorVocal: Record<Vocal, ImagenObjeto[]> = {
  A: [
    { nombre: "Abeja", vocal: "A", imagen: "/juegos/vocales/abeja.webp" },
    { nombre: "Avión", vocal: "A", imagen: "/juegos/vocales/avion.webp" },
    { nombre: "Árbol", vocal: "A", imagen: "/juegos/vocales/arbol.webp" },
  ],
  E: [
    { nombre: "Elefante", vocal: "E", imagen: "/juegos/vocales/elefante.webp" },
    { nombre: "Estrella", vocal: "E", imagen: "/juegos/vocales/estrella.webp" },
    { nombre: "Escoba", vocal: "E", imagen: "/juegos/vocales/escoba.webp" },
  ],
  I: [
    { nombre: "Isla", vocal: "I", imagen: "/juegos/vocales/isla.webp" },
    { nombre: "Imán", vocal: "I", imagen: "/juegos/vocales/iman.webp" },
    { nombre: "Iglesia", vocal: "I", imagen: "/juegos/vocales/iglesia.webp" },
  ],
  O: [
    { nombre: "Oso", vocal: "O", imagen: "/juegos/vocales/oso.webp" },
    { nombre: "Oveja", vocal: "O", imagen: "/juegos/vocales/oveja.webp" },
    { nombre: "Ojo", vocal: "O", imagen: "/juegos/vocales/ojo.webp" },
  ],
  U: [
    { nombre: "Uva", vocal: "U", imagen: "/juegos/vocales/uva.webp" },
    { nombre: "Unicornio", vocal: "U", imagen: "/juegos/vocales/unicornio.webp" },
    { nombre: "Ukelele", vocal: "U", imagen: "/juegos/vocales/ukelele.webp" },
  ],
};

const imagenVocal: Record<Vocal, string> = {
  A: "/juegos/vocales/A.webp",
  E: "/juegos/vocales/E.webp",
  I: "/juegos/vocales/I.webp",
  O: "/juegos/vocales/O.webp",
  U: "/juegos/vocales/U.webp",
};

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function elegirAleatorio<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function LasVocalesPerdidas({ onFinalizar }: Props) {
  const [ronda, setRonda] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const vocalActual = vocales[ronda];

  const rondaActual = useMemo(() => {
    const correcta = elegirAleatorio(imagenesPorVocal[vocalActual]);

    const distractores = mezclar(
      vocales
        .filter((v) => v !== vocalActual)
        .flatMap((v) => imagenesPorVocal[v])
    ).slice(0, 2);

    const opciones = mezclar([correcta, ...distractores]);

    return {
      correcta,
      opciones,
    };
  }, [ronda, vocalActual]);

  const seleccionar = (opcion: ImagenObjeto) => {
    if (bloqueado) return;

    if (opcion.vocal === vocalActual) {
      setMensaje("¡Muy bien!");
      setBloqueado(true);

      setTimeout(() => {
        if (ronda + 1 >= vocales.length) {
          onFinalizar();
        } else {
          setRonda((prev) => prev + 1);
          setMensaje("");
          setBloqueado(false);
        }
      }, 1200);
    } else {
      setMensaje("Sigamos intentando");
    }
  };

  return (
    <div className="min-h-[600px] w-full rounded-3xl bg-gradient-to-br from-pink-100 via-yellow-100 to-sky-100 p-6 shadow-xl">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-full bg-white px-5 py-2 text-lg font-bold text-purple-700 shadow">
            Ronda {ronda + 1} de 5
          </div>

          <button
            onClick={onFinalizar}
            className="rounded-full bg-red-400 px-5 py-2 font-bold text-white shadow transition hover:bg-red-500"
          >
            Finalizar juego
          </button>
        </div>

        <h2 className="mb-2 text-4xl font-extrabold text-purple-700">
          Las Vocales Perdidas
        </h2>

        <p className="mb-6 text-xl font-semibold text-slate-700">
          Selecciona la imagen que empieza con la vocal:
        </p>

        <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-4 shadow-lg">
          <img
            src={imagenVocal[vocalActual]}
            alt={`Vocal ${vocalActual}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {rondaActual.opciones.map((opcion) => (
            <button
              key={opcion.nombre}
              onClick={() => seleccionar(opcion)}
              disabled={bloqueado}
              className="rounded-3xl bg-white p-5 shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-70"
            >
              <div className="flex h-48 items-center justify-center">
                <img
                  src={opcion.imagen}
                  alt={opcion.nombre}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <p className="mt-4 text-2xl font-extrabold text-slate-700">
                {opcion.nombre}
              </p>
            </button>
          ))}
        </div>

        {mensaje && (
          <div
            className={`mx-auto w-fit rounded-full px-8 py-3 text-2xl font-extrabold shadow ${
              mensaje === "¡Muy bien!"
                ? "bg-green-400 text-white"
                : "bg-orange-300 text-white"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}