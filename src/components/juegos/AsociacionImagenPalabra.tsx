"use client";

import { useMemo, useState } from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
});

type Props = {
  onFinalizar: () => void;
};

type Item = {
  palabra: string;
  imagen: string;
};

const elementos: Item[] = [
  { palabra: "MESA", imagen: "mesa2.webp" },
  { palabra: "MANO", imagen: "mano2.webp" },
  { palabra: "GATO", imagen: "gato2.webp" },
  { palabra: "VACA", imagen: "vaca2.webp" },
  { palabra: "PEZ", imagen: "pez2.webp" },
  { palabra: "LUNA", imagen: "luna2.webp" },
  { palabra: "FLOR", imagen: "flor2.webp" },
  { palabra: "PATO", imagen: "pato2.webp" },
  { palabra: "CASA", imagen: "casa2.webp" },
  { palabra: "SOL", imagen: "sol2.webp" },
  { palabra: "ESTRELLA", imagen: "estrellita2.webp" },
  { palabra: "ABEJA", imagen: "abejita2.webp" },
  { palabra: "BARCO", imagen: "barco2.webp" },
  { palabra: "MANZANA", imagen: "manzana2.webp" },
  { palabra: "CARRO", imagen: "carrito2.webp" },
];

const mezclar = <T,>(array: T[]) =>
  [...array].sort(() => Math.random() - 0.5);

export default function AsociacionImagenPalabra({
  onFinalizar,
}: Props) {
  const rondas = useMemo(
    () => mezclar(elementos).slice(0, 5),
    []
  );

  const [rondaActual, setRondaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] =
    useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] =
    useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const itemActual = rondas[rondaActual];

  const opciones = useMemo(() => {
    const distractores = mezclar(
      elementos.filter(
        (item) => item.palabra !== itemActual.palabra
      )
    )
      .slice(0, 2)
      .map((item) => item.palabra);

    return mezclar([
      itemActual.palabra,
      ...distractores,
    ]);
  }, [itemActual]);

  const seleccionarOpcion = (palabra: string) => {
    if (opcionSeleccionada) return;

    setOpcionSeleccionada(palabra);

    if (palabra === itemActual.palabra) {
      setRespuestaCorrecta(true);

      setTimeout(() => {
        if (rondaActual + 1 >= rondas.length) {
          setFinalizado(true);
        } else {
          setRondaActual((prev) => prev + 1);
          setOpcionSeleccionada(null);
          setRespuestaCorrecta(false);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setOpcionSeleccionada(null);
      }, 700);
    }
  };

  if (finalizado) {
    return (
      <div
        className={`${baloo.className} min-h-[900px] flex flex-col items-center justify-center rounded-[40px] bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-10 text-center shadow-xl`}
      >
        <div className="mb-6 text-9xl">🏆</div>

        <h2 className="mb-4 text-7xl font-extrabold text-purple-700">
          ¡Excelente trabajo!
        </h2>

        <p className="mb-8 text-4xl text-purple-600">
          Completaste todas las asociaciones.
        </p>

        <button
          onClick={onFinalizar}
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-14 py-6 text-4xl font-extrabold text-white shadow-lg transition hover:scale-105"
        >
          Finalizar Juego
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${baloo.className} min-h-[900px] rounded-[40px] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-10 shadow-xl`}
    >
      <div className="mb-8 text-center">
        <h2 className="text-7xl font-extrabold text-purple-700">
          Asociación Imagen-Palabra
        </h2>

        <p className="mt-4 text-4xl text-purple-600">
          Toca la palabra que corresponde a la imagen
        </p>

        <div className="mt-4 text-3xl font-bold text-blue-600">
          Ronda {rondaActual + 1} de {rondas.length}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-center gap-16">
        <div className="flex h-[650px] w-[650px] items-center justify-center rounded-[40px] border-8 border-dashed border-purple-300 bg-white p-6 shadow-xl">
          <img
            src={`/juegos/asociacion-palabra/${itemActual.imagen}`}
            alt={itemActual.palabra}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex w-[500px] flex-col gap-8">
          {opciones.map((palabra) => {
            const esSeleccionada =
              opcionSeleccionada === palabra;

            const esCorrecta =
              palabra === itemActual.palabra;

            let estilo =
              "bg-white text-purple-700 border-purple-300 hover:scale-105 hover:bg-yellow-100";

            if (esSeleccionada && esCorrecta) {
              estilo =
                "bg-green-300 text-green-900 border-green-500 scale-105";
            }

            if (esSeleccionada && !esCorrecta) {
              estilo =
                "bg-red-300 text-red-900 border-red-500";
            }

            return (
              <button
                key={palabra}
                onClick={() =>
                  seleccionarOpcion(palabra)
                }
                className={`rounded-[30px] border-4 px-8 py-8 text-6xl font-extrabold shadow-lg transition ${estilo}`}
              >
                {palabra}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-center">
        {opcionSeleccionada &&
          respuestaCorrecta && (
            <p className="text-5xl font-extrabold text-green-600">
              ¡Muy bien! 🎉
            </p>
          )}

        {opcionSeleccionada &&
          !respuestaCorrecta && (
            <p className="text-5xl font-extrabold text-red-500">
              Inténtalo otra vez 😊
            </p>
          )}
      </div>
    </div>
  );
}