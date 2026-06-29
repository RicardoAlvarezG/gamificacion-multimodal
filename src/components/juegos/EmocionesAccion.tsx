"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionEmocionesAccion } from "../personalizacion-juegos/PersonalizarEmocionesAccion";

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionEmocionesAccion;
};

type Emocion = {
  nombre: string;
  imagen: string;
  personalizada?: boolean;
};

const TOTAL_RONDAS = 5;

const emocionesBase = [
  { nombre: "FELIZ", imagenes: ["feliz1.webp", "feliz2.webp"] },
  { nombre: "TRISTE", imagenes: ["triste1.webp", "triste2.webp"] },
  { nombre: "ENOJADO", imagenes: ["enojado1.webp", "enojado2.webp"] },
  {
    nombre: "SORPRENDIDO",
    imagenes: ["sorprendido1.webp", "sorprendido2.webp"],
  },
  { nombre: "ASUSTADO", imagenes: ["asustado1.webp", "asustado2.webp"] },
  { nombre: "CANSADO", imagenes: ["cansado1.webp", "cansado2.webp"] },
];

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

const crearRondas = (): Emocion[] => {
  return mezclar(emocionesBase)
    .slice(0, TOTAL_RONDAS)
    .map((emocion) => ({
      nombre: emocion.nombre,
      imagen:
        emocion.imagenes[Math.floor(Math.random() * emocion.imagenes.length)],
    }));
};

export default function EmocionesAccion({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo(() => {
    if (!configuracion) {
      return crearRondas();
    }

    return configuracion.rondas.map((ronda) => ({
      nombre: ronda.respuestaCorrecta,
      imagen: ronda.imagen,
      personalizada: true,
    }));
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [opcionMarcada, setOpcionMarcada] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const emocionActual = rondas[rondaActual];

  const opciones = useMemo(() => {
    const distractores = mezclar(
      emocionesBase.filter((e) => e.nombre !== emocionActual.nombre)
    )
      .slice(0, 2)
      .map((emocion) => ({
        nombre: emocion.nombre,
        imagen:
          emocion.imagenes[Math.floor(Math.random() * emocion.imagenes.length)],
      }));

    return mezclar([emocionActual, ...distractores]);
  }, [emocionActual]);

  const obtenerRutaImagen = (imagen: string, personalizada?: boolean) => {
    if (personalizada || imagen.startsWith("blob:") || imagen.startsWith("/")) {
      return imagen;
    }

    return `/juegos/emociones-accion/${imagen}`;
  };

  const seleccionarRespuesta = (opcion: Emocion) => {
    if (opcionMarcada) return;

    setOpcionMarcada(opcion.nombre);

    if (opcion.nombre === emocionActual.nombre) {
      setRespuestaCorrecta(true);
      setMensaje("¡Muy bien! 🎉");

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual(rondaActual + 1);
          setMensaje("");
          setOpcionMarcada(null);
          setRespuestaCorrecta(false);
        } else {
          setJuegoTerminado(true);
        }
      }, 1200);
    } else {
      setRespuestaCorrecta(false);
      setMensaje("Sigamos intentando 😊");

      setTimeout(() => {
        setMensaje("");
        setOpcionMarcada(null);
      }, 1000);
    }
  };

  if (juegoTerminado) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-[3rem] shadow-xl p-12 text-center border-4 border-purple-200">
        <div className="text-8xl mb-6">🎉</div>

        <h2 className="text-6xl font-black text-purple-700 mb-6">
          ¡Juego terminado!
        </h2>

        <p className="text-4xl font-bold text-gray-700 mb-10">
          Reconociste muchas emociones.
        </p>

        <button
          onClick={onFinalizar}
          className="bg-green-500 hover:bg-green-600 text-white text-4xl font-black px-14 py-6 rounded-3xl shadow-lg transition"
        >
          Finalizar Juego
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-[3rem] shadow-xl p-10 border-4 border-purple-200">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-black text-purple-700 mb-4">
          Emociones en Acción
        </h2>

        <p className="text-3xl font-bold text-gray-700">
          Ronda {rondaActual + 1} de {rondas.length}
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="bg-white rounded-[3rem] p-6 shadow-lg border-4 border-dashed border-purple-300">
          <img
            src={obtenerRutaImagen(emocionActual.imagen, emocionActual.personalizada)}
            alt={emocionActual.nombre}
            className="w-[760px] h-[520px] object-contain rounded-[2rem]"
          />
        </div>

        <h3 className="text-5xl font-black text-pink-600 text-center">
          ¿Qué emoción está sintiendo?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {opciones.map((opcion) => {
            const seleccionada = opcionMarcada === opcion.nombre;

            let estilo =
              "bg-white hover:bg-purple-100 text-purple-700 border-purple-300";

            if (seleccionada && respuestaCorrecta) {
              estilo = "bg-green-400 text-white border-green-500";
            }

            if (seleccionada && !respuestaCorrecta) {
              estilo = "bg-red-400 text-white border-red-500";
            }

            return (
              <button
                key={opcion.nombre}
                onClick={() => seleccionarRespuesta(opcion)}
                className={`${estilo} text-3xl md:text-4xl xl:text-5xl font-black py-8 px-3 rounded-3xl shadow-lg border-4 transition break-words leading-tight`}
              >
                {opcion.nombre}
              </button>
            );
          })}
        </div>

        <div className="h-16">
          {mensaje && (
            <p className="text-5xl font-black text-purple-700 animate-bounce">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}