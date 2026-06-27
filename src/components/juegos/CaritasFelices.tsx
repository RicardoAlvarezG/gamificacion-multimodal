"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionCaritasFelices } from "@/components/personalizacion-juegos/PersonalizarCaritasFelices";

type Emocion = {
  codigo: string;
  nombre: string;
  imagen: string;
};

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionCaritasFelices;
};

const emocionesBase: Emocion[] = [
  { codigo: "FELIZ", nombre: "Feliz", imagen: "/juegos/emociones/alegre.webp" },
  { codigo: "TRISTE", nombre: "Triste", imagen: "/juegos/emociones/triste.webp" },
  { codigo: "ENOJADO", nombre: "Enojado", imagen: "/juegos/emociones/enojado.webp" },
  { codigo: "SORPRENDIDO", nombre: "Sorprendido", imagen: "/juegos/emociones/sorprendido.webp" },
  { codigo: "ASUSTADO", nombre: "Asustado", imagen: "/juegos/emociones/asustado.webp" },
  { codigo: "CANSADO", nombre: "Cansado", imagen: "/juegos/emociones/cansado.webp" },
  { codigo: "ENFERMO", nombre: "Enfermo", imagen: "/juegos/emociones/enfermo.webp" },
  { codigo: "CONFUNDIDO", nombre: "Confundido", imagen: "/juegos/emociones/confundido.webp" },
  { codigo: "ORGULLOSO", nombre: "Orgulloso", imagen: "/juegos/emociones/orgulloso.webp" },
];

const mezclar = <T,>(lista: T[]) => {
  return [...lista].sort(() => Math.random() - 0.5);
};

export default function CaritasFelices({
  onFinalizar,
  configuracion,
}: Props) {
  const modo = configuracion?.modo || "VER_EMOCION_Y_ELEGIR_NOMBRE";
  const cantidadOpciones = configuracion?.opciones || 3;

  const emocionesSeleccionadas = useMemo(() => {
    if (!configuracion?.emociones?.length) {
      return emocionesBase.filter((emocion) =>
        ["FELIZ", "TRISTE", "ENOJADO", "SORPRENDIDO", "ASUSTADO"].includes(
          emocion.codigo
        )
      );
    }

    return emocionesBase.filter((emocion) =>
      configuracion.emociones.includes(emocion.codigo)
    );
  }, [configuracion]);

  const rondas = useMemo(() => {
    return mezclar(emocionesSeleccionadas);
  }, [emocionesSeleccionadas]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const emocionCorrecta = rondas[rondaActual];

  const opciones = useMemo(() => {
    if (!emocionCorrecta) return [];

    const incorrectas = mezclar(
      emocionesSeleccionadas.filter(
        (emocion) => emocion.codigo !== emocionCorrecta.codigo
      )
    ).slice(0, cantidadOpciones - 1);

    return mezclar([emocionCorrecta, ...incorrectas]);
  }, [emocionCorrecta, emocionesSeleccionadas, cantidadOpciones]);

  const seleccionarEmocion = (emocion: Emocion) => {
    if (bloqueado || !emocionCorrecta) return;

    setBloqueado(true);

    const esCorrecta = emocion.codigo === emocionCorrecta.codigo;

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
      <div className="rounded-[2rem] shadow-xl p-8 border-4 border-pink-200 bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100">
        <h2 className="text-5xl font-extrabold text-center text-purple-700 mb-3">
          Caritas Felices
        </h2>

        <p className="text-center text-purple-600 mb-6 text-xl font-semibold">
          {modo === "VER_EMOCION_Y_ELEGIR_NOMBRE"
            ? "Observa la carita y selecciona la emoción correcta"
            : "Lee la emoción y selecciona la carita correcta"}
        </p>

        <div className="text-center mb-6">
          <span className="inline-block bg-white text-purple-700 px-7 py-3 rounded-full font-bold text-xl shadow-md border-2 border-purple-200">
            Ronda {rondaActual + 1} de {rondas.length}
          </span>
        </div>

        {!juegoTerminado && emocionCorrecta && (
          <>
            {modo === "VER_EMOCION_Y_ELEGIR_NOMBRE" ? (
              <>
                <div className="bg-white/80 rounded-[2rem] p-8 mb-10 border-4 border-yellow-200 shadow-md">
                  <h3 className="text-center text-4xl font-extrabold text-pink-600 mb-6">
                    ¿Qué emoción muestra esta carita?
                  </h3>

                  <div className="flex justify-center">
                    <img
                      src={emocionCorrecta.imagen}
                      alt={emocionCorrecta.nombre}
                      className="w-[430px] h-[430px] object-contain mx-auto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {opciones.map((emocion) => (
                    <button
                      key={emocion.codigo}
                      type="button"
                      onClick={() => seleccionarEmocion(emocion)}
                      disabled={bloqueado}
                      className="bg-gradient-to-br from-white to-pink-100 hover:from-yellow-100 hover:to-pink-200 border-4 border-purple-200 rounded-[2rem] p-8 transition-all hover:scale-105 disabled:opacity-80 shadow-lg text-3xl font-extrabold text-purple-700"
                    >
                      {emocion.nombre}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/80 rounded-[2rem] p-8 mb-10 border-4 border-yellow-200 shadow-md">
                  <h3 className="text-center text-4xl font-extrabold text-pink-600 mb-4">
                    Selecciona la carita que está:
                  </h3>

                  <p className="text-center text-6xl font-extrabold text-purple-700">
                    {emocionCorrecta.nombre.toUpperCase()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {opciones.map((emocion) => (
                    <button
                      key={emocion.codigo}
                      type="button"
                      onClick={() => seleccionarEmocion(emocion)}
                      disabled={bloqueado}
                      className="bg-gradient-to-br from-white to-pink-100 hover:from-yellow-100 hover:to-pink-200 border-4 border-purple-200 rounded-[2rem] p-8 transition-all hover:scale-105 disabled:opacity-80 shadow-lg"
                    >
                      <img
                        src={emocion.imagen}
                        alt={emocion.nombre}
                        className="w-[330px] h-[330px] mx-auto object-contain"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {mensaje && (
          <div className="mt-8 text-center">
            <div className="inline-block text-4xl font-extrabold text-purple-700 bg-white px-8 py-4 rounded-full shadow-md border-4 border-yellow-200">
              {mensaje}
            </div>
          </div>
        )}

        {juegoTerminado && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onFinalizar}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-5 rounded-full text-2xl shadow-lg"
            >
              Finalizar Juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}