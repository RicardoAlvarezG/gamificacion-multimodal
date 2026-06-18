"use client";

import { useMemo, useState } from "react";

type Ficha = {
  objeto: string;
  cantidad: number;
  imagen: string;
};

type Ronda = Ficha & {
  opciones: number[];
};

type Props = {
  onFinalizar: () => void;
};

const fichas: Ficha[] = [
  { objeto: "patos", cantidad: 1, imagen: "/juegos/conteo/pato1.webp" },
  { objeto: "carros", cantidad: 1, imagen: "/juegos/conteo/carro1.webp" },
  { objeto: "árboles", cantidad: 1, imagen: "/juegos/conteo/arbol1.webp" },

  { objeto: "manzanas", cantidad: 2, imagen: "/juegos/conteo/manzana2.webp" },
  { objeto: "pelotas", cantidad: 2, imagen: "/juegos/conteo/pelota2.webp" },
  { objeto: "lápices", cantidad: 2, imagen: "/juegos/conteo/lapiz2.webp" },

  { objeto: "estrellas", cantidad: 3, imagen: "/juegos/conteo/estrella3.webp" },
  { objeto: "flores", cantidad: 3, imagen: "/juegos/conteo/flor3.webp" },
  { objeto: "peces", cantidad: 3, imagen: "/juegos/conteo/pez3.webp" },

  { objeto: "globos", cantidad: 4, imagen: "/juegos/conteo/globo4.webp" },
  { objeto: "mariposas", cantidad: 4, imagen: "/juegos/conteo/mariposa4.webp" },
  { objeto: "zapatos", cantidad: 4, imagen: "/juegos/conteo/zapato4.webp" },

  { objeto: "bananas", cantidad: 5, imagen: "/juegos/conteo/banana5.webp" },
  { objeto: "corazones", cantidad: 5, imagen: "/juegos/conteo/corazon5.webp" },
  { objeto: "libros", cantidad: 5, imagen: "/juegos/conteo/libro5.webp" },
];

const numerosImagen: Record<number, string> = {
  1: "/juegos/conteo/uno.webp",
  2: "/juegos/conteo/dos.webp",
  3: "/juegos/conteo/tres.webp",
  4: "/juegos/conteo/cuatro.webp",
  5: "/juegos/conteo/cinco.webp",
};

const mezclar = <T,>(array: T[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function CuentaConmigo({ onFinalizar }: Props) {
  const rondas: Ronda[] = useMemo(() => {
    const numeros = mezclar([1, 2, 3, 4, 5]);

    return numeros.map((numero) => {
      const fichasDelNumero = fichas.filter(
        (ficha) => ficha.cantidad === numero
      );

      const fichaElegida =
        fichasDelNumero[Math.floor(Math.random() * fichasDelNumero.length)];

      const opcionesIncorrectas = mezclar(
        [1, 2, 3, 4, 5].filter((n) => n !== numero)
      ).slice(0, 2);

      const opciones = mezclar([numero, ...opcionesIncorrectas]);

      return {
        ...fichaElegida,
        opciones,
      };
    });
  }, []);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const seleccionarRespuesta = (numero: number) => {
    if (bloqueado) return;

    setBloqueado(true);

    if (numero === ronda.cantidad) {
      setMensaje("¡Muy bien!");
    } else {
      setMensaje("Sigamos intentando");
    }

    setTimeout(() => {
      setMensaje("");
      setBloqueado(false);

      if (rondaActual + 1 < rondas.length) {
        setRondaActual((prev) => prev + 1);
      } else {
        onFinalizar();
      }
    }, 1200);
  };

  return (
    <div className="w-full min-h-[560px] rounded-3xl bg-gradient-to-br from-yellow-100 via-purple-100 to-pink-100 p-6 shadow-lg border-4 border-dashed border-purple-300 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-1">
        Cuenta Conmigo
      </h2>

      <p className="text-base font-bold text-gray-700 mb-4">
        Ronda {rondaActual + 1} de 5
      </p>

      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-3xl flex flex-col items-center">
        <h3 className="text-3xl font-extrabold text-orange-500 mb-5 text-center">
          ¿Cuántos {ronda.objeto} hay en la imagen?
        </h3>

        <img
          src={ronda.imagen}
          alt={`Imagen con ${ronda.cantidad} ${ronda.objeto}`}
          className="w-full max-w-md h-[360px] object-contain rounded-2xl mb-6"
        />

        <div className="grid grid-cols-3 gap-5 w-full max-w-xl">
          {ronda.opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => seleccionarRespuesta(opcion)}
              disabled={bloqueado}
              className="h-28 rounded-3xl bg-gradient-to-br from-blue-200 to-purple-400 shadow-lg hover:scale-105 transition flex items-center justify-center disabled:opacity-70"
            >
              <img
                src={numerosImagen[opcion]}
                alt={`Número ${opcion}`}
                className="h-24 w-24 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {mensaje && (
        <div className="mt-5 text-3xl font-extrabold text-purple-700 animate-bounce">
          {mensaje}
        </div>
      )}
    </div>
  );
}