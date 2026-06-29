"use client";

import { useMemo, useState } from "react";
import { Baloo_2 } from "next/font/google";
import type { ConfiguracionAsociacionImagenPalabra } from "../personalizacion-juegos/PersonalizarAsociacionImagenPalabra";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
});

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionAsociacionImagenPalabra;
};

type Item = {
  id: string;
  palabra: string;
  imagen: string;
};

const elementos: Item[] = [
  { id: "mesa", palabra: "MESA", imagen: "mesa2.webp" },
  { id: "mano", palabra: "MANO", imagen: "mano2.webp" },
  { id: "gato", palabra: "GATO", imagen: "gato2.webp" },
  { id: "vaca", palabra: "VACA", imagen: "vaca2.webp" },
  { id: "pez", palabra: "PEZ", imagen: "pez2.webp" },
  { id: "luna", palabra: "LUNA", imagen: "luna2.webp" },
  { id: "flor", palabra: "FLOR", imagen: "flor2.webp" },
  { id: "pato", palabra: "PATO", imagen: "pato2.webp" },
  { id: "casa", palabra: "CASA", imagen: "casa2.webp" },
  { id: "sol", palabra: "SOL", imagen: "sol2.webp" },
  { id: "estrella", palabra: "ESTRELLA", imagen: "estrellita2.webp" },
  { id: "abeja", palabra: "ABEJA", imagen: "abejita2.webp" },
  { id: "barco", palabra: "BARCO", imagen: "barco2.webp" },
  { id: "manzana", palabra: "MANZANA", imagen: "manzana2.webp" },
  { id: "carro", palabra: "CARRO", imagen: "carrito2.webp" },

  // Nuevas imágenes
  { id: "perro", palabra: "PERRO", imagen: "perro2.webp" },
  { id: "arbol", palabra: "ÁRBOL", imagen: "arbol2.webp" },
  { id: "pelota", palabra: "PELOTA", imagen: "pelota2.webp" },
  { id: "mariposa", palabra: "MARIPOSA", imagen: "mariposa2.webp" },
  { id: "zapato", palabra: "ZAPATO", imagen: "zapato2.webp" },
];

const mezclar = <T,>(array: T[]) =>
  [...array].sort(() => Math.random() - 0.5);

export default function AsociacionImagenPalabra({
  onFinalizar,
  configuracion,
}: Props) {
  const modo = configuracion?.modo ?? "IMAGEN_A_PALABRA";

  const bancoElementos = useMemo(() => {
    if (!configuracion) return elementos;

    const filtrados = elementos.filter((item) =>
      configuracion.imagenes.includes(item.id)
    );

    return filtrados.length > 0 ? filtrados : elementos;
  }, [configuracion]);

  const rondas = useMemo(() => {
    if (!configuracion) {
      return mezclar(elementos).slice(0, 5);
    }

    return mezclar(bancoElementos).slice(
      0,
      configuracion.rondas || bancoElementos.length
    );
  }, [bancoElementos, configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(
    null
  );
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const itemActual = rondas[rondaActual];

  const opciones = useMemo(() => {
    const distractores = mezclar(
      bancoElementos.filter((item) => item.id !== itemActual.id)
    ).slice(0, 2);

    return mezclar([itemActual, ...distractores]);
  }, [bancoElementos, itemActual]);

  const seleccionarOpcion = (id: string) => {
    if (opcionSeleccionada) return;

    setOpcionSeleccionada(id);

    if (id === itemActual.id) {
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
          {modo === "IMAGEN_A_PALABRA"
            ? "Toca la palabra que corresponde a la imagen"
            : "Toca la imagen que corresponde a la palabra"}
        </p>

        <div className="mt-4 text-3xl font-bold text-blue-600">
          Ronda {rondaActual + 1} de {rondas.length}
        </div>
      </div>

      {modo === "IMAGEN_A_PALABRA" ? (
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-16">
          <div className="flex h-[650px] w-[650px] items-center justify-center rounded-[40px] border-8 border-dashed border-purple-300 bg-white p-6 shadow-xl">
            <img
              src={`/juegos/asociacion-palabra/${itemActual.imagen}`}
              alt={itemActual.palabra}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex w-[500px] flex-col gap-8">
            {opciones.map((item) => {
              const esSeleccionada = opcionSeleccionada === item.id;
              const esCorrecta = item.id === itemActual.id;

              let estilo =
                "bg-white text-purple-700 border-purple-300 hover:scale-105 hover:bg-yellow-100";

              if (esSeleccionada && esCorrecta) {
                estilo =
                  "bg-green-300 text-green-900 border-green-500 scale-105";
              }

              if (esSeleccionada && !esCorrecta) {
                estilo = "bg-red-300 text-red-900 border-red-500";
              }

              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`rounded-[30px] border-4 px-8 py-8 text-6xl font-extrabold shadow-lg transition ${estilo}`}
                >
                  {item.palabra}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-12">
          <div className="rounded-[40px] border-8 border-dashed border-purple-300 bg-white px-24 py-14 text-center text-8xl font-extrabold text-purple-700 shadow-xl">
            {itemActual.palabra}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {opciones.map((item) => {
              const esSeleccionada = opcionSeleccionada === item.id;
              const esCorrecta = item.id === itemActual.id;

              let estilo =
                "bg-white border-purple-300 hover:scale-105 hover:bg-yellow-100";

              if (esSeleccionada && esCorrecta) {
                estilo = "bg-green-300 border-green-500 scale-105";
              }

              if (esSeleccionada && !esCorrecta) {
                estilo = "bg-red-300 border-red-500";
              }

              return (
                <button
                  key={item.id}
                  onClick={() => seleccionarOpcion(item.id)}
                  className={`flex h-[350px] w-[350px] items-center justify-center rounded-[35px] border-4 p-6 shadow-lg transition ${estilo}`}
                >
                  <img
                    src={`/juegos/asociacion-palabra/${item.imagen}`}
                    alt={item.palabra}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        {opcionSeleccionada && respuestaCorrecta && (
          <p className="text-5xl font-extrabold text-green-600">
            ¡Muy bien! 🎉
          </p>
        )}

        {opcionSeleccionada && !respuestaCorrecta && (
          <p className="text-5xl font-extrabold text-red-500">
            Inténtalo otra vez 😊
          </p>
        )}
      </div>
    </div>
  );
}