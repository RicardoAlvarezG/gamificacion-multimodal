"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionDondeEstaOsito } from "@/components/personalizacion-juegos/PersonalizarDondeEstaOsito";

type Ubicacion = "arriba" | "abajo";

type Ronda = {
  nombre: string;
  imagen: string;
  respuesta: Ubicacion;
};

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionDondeEstaOsito;
};

const escenariosBase: Ronda[] = [
  {
    nombre: "Sobre la mesa",
    imagen: "/juegos/donde-esta/osito/sobremesa.webp",
    respuesta: "arriba",
  },
  {
    nombre: "Bajo la mesa",
    imagen: "/juegos/donde-esta/osito/bajomesa.webp",
    respuesta: "abajo",
  },
  {
    nombre: "Sobre la silla",
    imagen: "/juegos/donde-esta/osito/sobresilla.webp",
    respuesta: "arriba",
  },
  {
    nombre: "Bajo la silla",
    imagen: "/juegos/donde-esta/osito/bajosilla.webp",
    respuesta: "abajo",
  },
  {
    nombre: "Sobre la cama",
    imagen: "/juegos/donde-esta/osito/sobrecama.webp",
    respuesta: "arriba",
  },
  {
    nombre: "Bajo la cama",
    imagen: "/juegos/donde-esta/osito/bajocama.webp",
    respuesta: "abajo",
  },
];

const opciones: { nombre: Ubicacion; imagen: string }[] = [
  {
    nombre: "arriba",
    imagen: "/juegos/donde-esta/arriba.webp",
  },
  {
    nombre: "abajo",
    imagen: "/juegos/donde-esta/abajo.webp",
  },
];

export default function DondeEstaOsito({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo(() => {
    if (
      configuracion?.rondasPersonalizadas &&
      configuracion.rondasPersonalizadas.length > 0
    ) {
      return configuracion.rondasPersonalizadas.map((ronda) => ({
        nombre: ronda.titulo || "¿Dónde está?",
        imagen: ronda.imagen,
        respuesta: ronda.respuesta,
      }));
    }

    return [...escenariosBase].sort(() => Math.random() - 0.5);
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const opcionesAleatorias = useMemo(() => {
    return [...opciones].sort(() => Math.random() - 0.5);
  }, [rondaActual]);

  const seleccionarRespuesta = (respuesta: Ubicacion) => {
    if (bloqueado || !ronda) return;

    setBloqueado(true);

    const esCorrecta = respuesta === ronda.respuesta;

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
          ¿Dónde está el Osito?
        </h2>

        <p className="text-center text-gray-600 mb-6 text-lg">
          Observa la imagen y selecciona la flecha correcta
        </p>

        <div className="text-center mb-6">
          <span className="inline-block bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-bold text-xl">
            Ronda {rondaActual + 1} de {rondas.length}
          </span>
        </div>

        {!juegoTerminado && ronda && (
          <>
            <div className="bg-purple-50 rounded-3xl p-6 mb-8">
              <h3 className="text-center text-3xl font-bold text-purple-700 mb-5">
                {ronda.nombre}
              </h3>

              <div className="flex justify-center">
                <img
                  src={ronda.imagen}
                  alt={ronda.nombre}
                  className="w-[850px] h-[520px] object-contain rounded-3xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 max-w-3xl mx-auto">
              {opcionesAleatorias.map((opcion) => (
                <button
                  key={opcion.nombre}
                  type="button"
                  onClick={() => seleccionarRespuesta(opcion.nombre)}
                  disabled={bloqueado}
                  className="bg-white hover:bg-purple-50 border-4 border-purple-200 rounded-3xl p-8 transition-all hover:scale-105 disabled:opacity-80"
                >
                  <img
                    src={opcion.imagen}
                    alt={opcion.nombre}
                    className="w-56 h-56 mx-auto object-contain"
                  />
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