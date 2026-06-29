"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionRompecabezasInteligente } from "../personalizacion-juegos/PersonalizarRompecabezasInteligente";

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionRompecabezasInteligente;
};

type Pieza = {
  id: number;
  fila: number;
  columna: number;
};

type Ronda = {
  imagen: string;
  grid: number;
};

const imagenes = [
  "rompe1.webp",
  "rompe2.webp",
  "rompe3.webp",
  "rompe4.webp",
  "rompe5.webp",
  "rompe6.webp",
  "rompe7.webp",
  "rompe8.webp",
  "rompe9.webp",
  "rompe10.webp",
];

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

const crearPiezas = (grid: number): Pieza[] => {
  const piezas: Pieza[] = [];

  for (let fila = 0; fila < grid; fila++) {
    for (let columna = 0; columna < grid; columna++) {
      piezas.push({
        id: fila * grid + columna,
        fila,
        columna,
      });
    }
  }

  return piezas;
};

export default function RompecabezasInteligente({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo<Ronda[]>(() => {
    if (!configuracion) {
      const seleccionadas = mezclar(imagenes).slice(0, 3);

      return seleccionadas.map((imagen, index) => ({
        imagen,
        grid: index === 2 ? 3 : 2,
      }));
    }

      return configuracion.imagenes.map((imagen) => ({
      imagen: imagen.src,
      grid: imagen.grid,
    }));
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState<Pieza | null>(null);
  const [colocadas, setColocadas] = useState<Record<number, Pieza>>({});
  const [piezasDisponibles, setPiezasDisponibles] = useState<Pieza[]>(() => {
    const grid = rondas[0].grid;
    return mezclar(crearPiezas(grid));
  });

  const [piezaError, setPiezaError] = useState<number | null>(null);
  const [espacioError, setEspacioError] = useState<number | null>(null);
  const [espacioCorrecto, setEspacioCorrecto] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [finalizado, setFinalizado] = useState(false);

  const ronda = rondas[rondaActual];
  const totalPiezas = ronda.grid * ronda.grid;

  function obtenerRutaImagen(imagen: string) {
    if (imagen.startsWith("blob:") || imagen.startsWith("/")) {
      return imagen;
    }

    return `/juegos/rompecabezas/${imagen}`;
  }

  function reiniciarRonda(nuevaRonda: number) {
    const grid = rondas[nuevaRonda].grid;

    setPiezaSeleccionada(null);
    setColocadas({});
    setPiezasDisponibles(mezclar(crearPiezas(grid)));
    setPiezaError(null);
    setEspacioError(null);
    setEspacioCorrecto(null);
    setMensaje("");
  }

  function seleccionarPieza(pieza: Pieza) {
    setPiezaSeleccionada(pieza);
    setPiezaError(null);
    setEspacioError(null);
    setMensaje("");
  }

  function seleccionarEspacio(idEspacio: number) {
    if (!piezaSeleccionada || colocadas[idEspacio]) return;

    if (piezaSeleccionada.id === idEspacio) {
      const nuevasColocadas = {
        ...colocadas,
        [idEspacio]: piezaSeleccionada,
      };

      setColocadas(nuevasColocadas);
      setEspacioCorrecto(idEspacio);
      setPiezasDisponibles((prev) =>
        prev.filter((pieza) => pieza.id !== piezaSeleccionada.id)
      );
      setPiezaSeleccionada(null);
      setMensaje("¡Muy bien! 🎉");

      setTimeout(() => {
        setEspacioCorrecto(null);
        setMensaje("");
      }, 700);

      if (Object.keys(nuevasColocadas).length === totalPiezas) {
        setTimeout(() => {
          if (rondaActual + 1 < rondas.length) {
            const siguiente = rondaActual + 1;
            setRondaActual(siguiente);
            reiniciarRonda(siguiente);
          } else {
            setFinalizado(true);
          }
        }, 1000);
      }
    } else {
      setPiezaError(piezaSeleccionada.id);
      setEspacioError(idEspacio);
      setMensaje("Sigamos intentando 😊");

      setTimeout(() => {
        setPiezaError(null);
        setEspacioError(null);
        setMensaje("");
      }, 900);
    }
  }

  function estiloPieza(pieza: Pieza) {
    return {
      backgroundImage: `url(${obtenerRutaImagen(ronda.imagen)})`,
      backgroundSize: `${ronda.grid * 100}% ${ronda.grid * 100}%`,
      backgroundPosition: `${(pieza.columna / (ronda.grid - 1)) * 100}% ${
        (pieza.fila / (ronda.grid - 1)) * 100
      }%`,
    };
  }

  if (finalizado) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center rounded-[2rem] border-4 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-10 text-center">
        <div className="mb-6 text-8xl">🎉</div>
        <h2 className="mb-4 text-5xl font-black text-purple-700">
          ¡Excelente trabajo!
        </h2>
        <p className="mb-8 text-3xl font-bold text-gray-700">
          Completaste el rompecabezas inteligente.
        </p>
        <button
          onClick={onFinalizar}
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-12 py-5 text-3xl font-black text-white shadow-lg transition hover:scale-105"
        >
          Finalizar Juego
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border-4 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-8">
      <div className="mb-6 text-center">
        <h2 className="text-5xl font-black text-purple-700">
          🧩 Rompecabezas Inteligente
        </h2>

        <p className="mt-3 text-3xl font-bold text-gray-700">
          Ronda {rondaActual + 1} de {rondas.length}
        </p>

        <p className="mt-2 text-2xl font-semibold text-gray-600">
          Selecciona una pieza y luego toca el espacio correcto
        </p>

        <div className="mt-4 h-12">
          {mensaje && (
            <p
              className={`text-3xl font-black ${
                mensaje.includes("intentando")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 xl:flex-row xl:items-start xl:justify-center">
        <div
          className="grid overflow-hidden rounded-3xl border-8 border-white bg-white shadow-2xl"
          style={{
            width: 620,
            height: 620,
            gridTemplateColumns: `repeat(${ronda.grid}, 1fr)`,
            gridTemplateRows: `repeat(${ronda.grid}, 1fr)`,
          }}
        >
          {Array.from({ length: totalPiezas }).map((_, index) => {
            const pieza = colocadas[index];

            return (
              <button
                key={index}
                onClick={() => seleccionarEspacio(index)}
                className={`border-4 transition ${
                  espacioCorrecto === index
                    ? "border-green-500 bg-green-200"
                    : espacioError === index
                    ? "border-red-500 bg-red-200"
                    : "border-purple-200 bg-purple-50"
                }`}
              >
                {pieza && (
                  <div className="h-full w-full" style={estiloPieza(pieza)} />
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-[680px]">
          <h3 className="mb-4 text-center text-3xl font-black text-pink-600">
            Piezas mezcladas
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {piezasDisponibles.map((pieza) => (
              <button
                key={pieza.id}
                onClick={() => seleccionarPieza(pieza)}
                className={`overflow-hidden rounded-2xl border-8 bg-white shadow-xl transition hover:scale-105 ${
                  piezaSeleccionada?.id === pieza.id
                    ? "scale-105 border-yellow-400"
                    : piezaError === pieza.id
                    ? "border-red-500"
                    : "border-white"
                }`}
                style={{
                  width: ronda.grid === 3 ? 155 : 220,
                  height: ronda.grid === 3 ? 155 : 220,
                }}
              >
                <div className="h-full w-full" style={estiloPieza(pieza)} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}