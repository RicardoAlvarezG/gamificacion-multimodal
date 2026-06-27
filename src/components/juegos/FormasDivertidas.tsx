"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionFormasDivertidas } from "@/components/personalizacion-juegos/PersonalizarFormasDivertidas";

type Forma = {
  nombre: string;
  imagen: string;
};

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionFormasDivertidas;
};

const formasDisponibles: Forma[] = [
  {
    nombre: "CIRCULO",
    imagen: "/juegos/formas/circulo.webp",
  },
  {
    nombre: "CUADRADO",
    imagen: "/juegos/formas/cuadrado.webp",
  },
  {
    nombre: "TRIANGULO",
    imagen: "/juegos/formas/triangulo.webp",
  },
  {
    nombre: "RECTANGULO",
    imagen: "/juegos/formas/rectangulo.webp",
  },
  {
    nombre: "ROMBO",
    imagen: "/juegos/formas/rombo.webp",
  },
  {
    nombre: "PENTAGONO",
    imagen: "/juegos/formas/pentagono.webp",
  },
  {
    nombre: "HEXAGONO",
    imagen: "/juegos/formas/hexagono.webp",
  },
  {
    nombre: "OVALO",
    imagen: "/juegos/formas/ovalo.webp",
  },
  {
    nombre: "ESTRELLA",
    imagen: "/juegos/formas/estrella.webp",
  },
  {
    nombre: "OCTOGONO",
    imagen: "/juegos/formas/octogono.webp",
  },
];

export default function FormasDivertidas({
  onFinalizar,
  configuracion,
}: Props) {
  const formasJuego = useMemo(() => {
    if (!configuracion?.formas?.length) {
      return formasDisponibles.filter((forma) =>
        ["CIRCULO", "CUADRADO", "TRIANGULO", "RECTANGULO"].includes(
          forma.nombre
        )
      );
    }

    return formasDisponibles.filter((forma) =>
      configuracion.formas.includes(forma.nombre)
    );
  }, [configuracion]);

  const rondas = useMemo(() => {
    return [...formasJuego]
      .sort(() => Math.random() - 0.5)
      .slice(0, configuracion?.rondas || 4);
  }, [formasJuego, configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const formaCorrecta = rondas[rondaActual];

  const opciones = useMemo(() => {
    if (!formaCorrecta) return [];

    const incorrectas = formasJuego
      .filter((forma) => forma.nombre !== formaCorrecta.nombre)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return [formaCorrecta, ...incorrectas].sort(() => Math.random() - 0.5);
  }, [formaCorrecta, formasJuego]);

  const seleccionarForma = (forma: Forma) => {
    if (bloqueado || !formaCorrecta) return;

    setBloqueado(true);

    const esCorrecta = forma.nombre === formaCorrecta.nombre;

    setMensaje(esCorrecta ? "🎉 ¡Muy bien!" : "😊 Sigamos intentando");

    setTimeout(() => {
      if (esCorrecta) {
        if (rondaActual < rondas.length - 1) {
          setRondaActual((prev) => prev + 1);
          setMensaje("");
        } else {
          setMensaje("🏆 ¡Juego completado!");
        }
      }

      setBloqueado(false);
    }, 1200);
  };

  const juegoTerminado =
    rondaActual === rondas.length - 1 &&
    mensaje === "🏆 ¡Juego completado!";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 border-4 border-purple-200">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-2">
          Formas Divertidas
        </h2>

        <p className="text-center text-gray-600 mb-6 text-lg">
          Selecciona la forma correcta
        </p>

        <div className="text-center mb-8">
          <span className="inline-block bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-bold text-xl">
            Ronda {rondaActual + 1} de {rondas.length}
          </span>
        </div>

        {!juegoTerminado && formaCorrecta && (
          <>
            <div className="bg-purple-50 rounded-3xl p-8 mb-10">
              <h3 className="text-center text-3xl font-bold text-purple-700 mb-6">
                Encuentra esta forma
              </h3>

              <div className="flex justify-center">
                <img
                  src={formaCorrecta.imagen}
                  alt={formaCorrecta.nombre}
                  className="w-80 h-80 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {opciones.map((forma) => (
                <button
                  key={forma.nombre}
                  type="button"
                  onClick={() => seleccionarForma(forma)}
                  disabled={bloqueado}
                  className="bg-white hover:bg-purple-50 border-4 border-purple-200 rounded-3xl p-10 transition-all hover:scale-105 disabled:opacity-80"
                >
                  <img
                    src={forma.imagen}
                    alt={forma.nombre}
                    className="w-56 h-56 mx-auto object-contain"
                  />

                  <p className="mt-4 text-2xl font-bold text-gray-700">
                    {forma.nombre}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {mensaje && (
          <div className="mt-8 text-center">
            <div className="text-4xl font-bold text-purple-700">{mensaje}</div>
          </div>
        )}

        {juegoTerminado && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onFinalizar}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-5 rounded-full text-2xl"
            >
              Finalizar Juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}