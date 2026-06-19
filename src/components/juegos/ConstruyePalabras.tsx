"use client";

import { useMemo, useState } from "react";

type Props = {
  onFinalizar: () => void;
};

type Palabra = {
  palabra: string;
  imagen: string;
};

const palabrasBase: Palabra[] = [
  { palabra: "SOL", imagen: "sol.webp" },
  { palabra: "CASA", imagen: "casa.webp" },
  { palabra: "GATO", imagen: "gato.webp" },
  { palabra: "PATO", imagen: "pato.webp" },
  { palabra: "FLOR", imagen: "flor.webp" },
  { palabra: "LUNA", imagen: "luna.webp" },
  { palabra: "PEZ", imagen: "pez.webp" },
  { palabra: "MANO", imagen: "mano.webp" },
  { palabra: "MESA", imagen: "mesa.webp" },
  { palabra: "VACA", imagen: "vaca.webp" },
];

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

export default function ConstruyePalabras({ onFinalizar }: Props) {
  const rondas = useMemo(() => mezclar(palabrasBase).slice(0, 5), []);

  const [rondaActual, setRondaActual] = useState(0);
  const [letrasSeleccionadas, setLetrasSeleccionadas] = useState<string[]>([]);
  const [indicesUsados, setIndicesUsados] = useState<number[]>([]);
  const [indiceError, setIndiceError] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("Selecciona las letras en orden.");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const palabraActual = rondas[rondaActual];

  const letrasMezcladas = useMemo(() => {
    return rondas.map((ronda) => mezclar(ronda.palabra.split("")));
  }, [rondas]);

  const letrasActuales = letrasMezcladas[rondaActual];
  const siguienteLetra = palabraActual.palabra[letrasSeleccionadas.length];

  const seleccionarLetra = (letra: string, index: number) => {
    if (
      juegoTerminado ||
      indicesUsados.includes(index) ||
      indiceError !== null
    ) {
      return;
    }

    if (letra === siguienteLetra) {
      const nuevasLetras = [...letrasSeleccionadas, letra];
      const nuevosIndices = [...indicesUsados, index];

      setLetrasSeleccionadas(nuevasLetras);
      setIndicesUsados(nuevosIndices);
      setMensaje("¡Muy bien!");

      if (nuevasLetras.join("") === palabraActual.palabra) {
        setMensaje(`¡Excelente! Formaste la palabra ${palabraActual.palabra}`);

        setTimeout(() => {
          if (rondaActual + 1 < rondas.length) {
            setRondaActual(rondaActual + 1);
            setLetrasSeleccionadas([]);
            setIndicesUsados([]);
            setIndiceError(null);
            setMensaje("Selecciona las letras en orden.");
          } else {
            setJuegoTerminado(true);
          }
        }, 1200);
      }
    } else {
      setIndiceError(index);
      setMensaje("Intenta con otra letra.");

      setTimeout(() => {
        setIndiceError(null);
        setMensaje("Selecciona las letras en orden.");
      }, 900);
    }
  };

  if (juegoTerminado) {
    return (
      <div className="w-full rounded-3xl bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-8 text-center shadow-lg">
        <div className="mx-auto max-w-xl rounded-3xl border-4 border-dashed border-purple-300 bg-white p-8">
          <div className="mb-4 text-7xl">🏆</div>

          <h2 className="text-4xl font-extrabold text-purple-700">
            ¡Excelente trabajo!
          </h2>

          <p className="mt-4 text-xl font-bold text-gray-700">
            Has completado Construye Palabras
          </p>

          <p className="mt-3 text-2xl font-extrabold text-yellow-500">
            ⭐ 5/5 palabras construidas
          </p>

          <button
            onClick={onFinalizar}
            className="mt-8 rounded-full bg-purple-600 px-10 py-4 text-xl font-bold text-white shadow-md transition hover:scale-105 hover:bg-purple-700"
          >
            Finalizar Juego
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-5xl font-extrabold text-purple-700">
          Construye Palabras
        </h2>

        <p className="mt-3 text-2xl font-bold text-gray-700">
          Ronda {rondaActual + 1} de {rondas.length}
        </p>

        <p className="mt-3 text-2xl font-bold text-purple-600">
          {mensaje}
        </p>
      </div>

      <div className="mx-auto max-w-6xl rounded-3xl border-4 border-dashed border-purple-300 bg-white p-8">
        <div className="flex flex-col items-center gap-8">
          <img
            src={`/juegos/palabras/${palabraActual.imagen}`}
            alt={palabraActual.palabra}
            className="h-96 w-96 rounded-3xl bg-purple-50 p-4 object-contain shadow-md"
          />

          <div className="flex min-h-[110px] flex-wrap justify-center gap-4 rounded-2xl bg-yellow-50 p-5">
            {palabraActual.palabra.split("").map((_, index) => (
              <div
                key={index}
                className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-purple-300 bg-white text-5xl font-extrabold text-purple-700 shadow"
              >
                {letrasSeleccionadas[index] || ""}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-5 pt-4">
            {letrasActuales.map((letra, index) => {
              const usada = indicesUsados.includes(index);
              const error = indiceError === index;

              return (
                <button
                  key={`${letra}-${index}`}
                  onClick={() => seleccionarLetra(letra, index)}
                  disabled={usada}
                  className={`flex h-24 w-24 items-center justify-center rounded-2xl text-5xl font-extrabold shadow-md transition-all duration-200 ${
                    usada
                      ? "scale-90 bg-gray-200 text-gray-400"
                      : error
                      ? "bg-red-500 text-white"
                      : "bg-blue-600 text-white hover:scale-110 hover:bg-blue-700"
                  }`}
                >
                  {letra}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}