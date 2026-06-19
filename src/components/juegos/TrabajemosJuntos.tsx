"use client";

import { useMemo, useState } from "react";

type Props = {
  onFinalizar: () => void;
};

const imagenesEquipo = [
  "equipo1.webp",
  "equipo2.webp",
  "equipo3.webp",
  "equipo4.webp",
  "equipo5.webp",
  "equipo6.webp",
  "equipo7.webp",
  "equipo8.webp",
];

const imagenesDistractoras = [
  "solo1.webp",
  "solo2.webp",
  "solo3.webp",
  "solo4.webp",
  "pelea1.webp",
  "pelea2.webp",
  "pelea3.webp",
  "pelea4.webp",
];

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

export default function TrabajemosJuntos({ onFinalizar }: Props) {
  const rondas = useMemo(() => mezclar(imagenesEquipo).slice(0, 4), []);

  const [rondaActual, setRondaActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState(
    "Observa y elige quiénes trabajan juntos."
  );
  const [bloqueado, setBloqueado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const imagenCorrecta = rondas[rondaActual];

  const opciones = useMemo(() => {
    const distractoresRandom = mezclar(imagenesDistractoras).slice(0, 2);
    return mezclar([imagenCorrecta, ...distractoresRandom]);
  }, [imagenCorrecta]);

  const elegirOpcion = (imagen: string) => {
    if (bloqueado || juegoTerminado) return;

    setSeleccionada(imagen);
    setBloqueado(true);

    if (imagen === imagenCorrecta) {
      setMensaje("¡Muy bien! Trabajar juntos es divertido.");

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual((prev) => prev + 1);
          setSeleccionada(null);
          setMensaje("Observa y elige quiénes trabajan juntos.");
          setBloqueado(false);
        } else {
          setJuegoTerminado(true);
        }
      }, 1200);
    } else {
      setMensaje("Sigamos intentando.");

      setTimeout(() => {
        setSeleccionada(null);
        setMensaje("Observa nuevamente y elige la acción correcta.");
        setBloqueado(false);
      }, 1000);
    }
  };

  if (juegoTerminado) {
    return (
      <div className="min-h-[620px] rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6 shadow-xl">
        <div className="mx-auto flex min-h-[560px] max-w-4xl items-center justify-center">
          <div className="w-full rounded-3xl border-4 border-purple-200 bg-white p-10 text-center shadow-2xl">
            <div className="mb-4 text-7xl">🎉</div>

            <h2 className="text-4xl font-extrabold text-purple-700">
              ¡Juego terminado!
            </h2>

            <p className="mt-4 text-xl font-semibold text-gray-700">
              Completaste todas las rondas de Trabajemos Juntos.
            </p>

            <p className="mt-2 text-lg text-gray-600">
              Ahora puedes finalizar para registrar las estrellas.
            </p>

            <button
              onClick={onFinalizar}
              className="mt-8 rounded-2xl bg-purple-500 px-10 py-4 text-xl font-extrabold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[620px] rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6 shadow-xl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-purple-700">
            Trabajemos Juntos
          </h2>

          <p className="mt-2 text-lg font-semibold text-gray-700">
            ¿Cuál imagen muestra trabajo en equipo?
          </p>

          <div className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-purple-600 shadow">
            Ronda {rondaActual + 1} de {rondas.length}
          </div>
        </div>

        <div className="mb-6 rounded-3xl border-4 border-dashed border-purple-300 bg-white p-5 text-center shadow-md">
          <p className="text-xl font-bold text-gray-700">{mensaje}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {opciones.map((imagen) => {
            const esSeleccionada = seleccionada === imagen;
            const esCorrecta = imagen === imagenCorrecta;

            return (
              <button
                key={imagen}
                onClick={() => elegirOpcion(imagen)}
                disabled={bloqueado && !esSeleccionada}
                className={`group rounded-3xl border-4 bg-white p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  esSeleccionada && esCorrecta
                    ? "border-green-400 bg-green-50"
                    : esSeleccionada && !esCorrecta
                    ? "border-red-400 bg-red-50"
                    : "border-purple-200"
                }`}
              >
                <div className="flex h-[290px] items-center justify-center overflow-hidden rounded-2xl bg-purple-50">
                  <img
                    src={`/juegos/trabajemos-juntos/${imagen}`}
                    alt="Escena del juego"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-4 rounded-full bg-purple-100 py-2 text-lg font-extrabold text-purple-700">
                  Elegir
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}