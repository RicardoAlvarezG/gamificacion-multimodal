"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionTrabajemosJuntos } from "../personalizacion-juegos/PersonalizarTrabajemosJuntos";

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionTrabajemosJuntos;
};

type ImagenJuego = {
  id: string;
  nombre: string;
  imagen: string;
};

const imagenesEquipoPredeterminadas: ImagenJuego[] = Array.from(
  { length: 8 },
  (_, index) => {
    const numero = index + 1;

    return {
      id: `equipo${numero}`,
      nombre: `Observa y elige quiénes trabajan juntos.`,
      imagen: `/juegos/trabajemos-juntos/equipo${numero}.webp`,
    };
  }
);

const imagenesDistractorasPredeterminadas: ImagenJuego[] = [
  { id: "solo1", nombre: "Solo", imagen: "/juegos/trabajemos-juntos/solo1.webp" },
  { id: "solo2", nombre: "Solo", imagen: "/juegos/trabajemos-juntos/solo2.webp" },
  { id: "solo3", nombre: "Solo", imagen: "/juegos/trabajemos-juntos/solo3.webp" },
  { id: "solo4", nombre: "Solo", imagen: "/juegos/trabajemos-juntos/solo4.webp" },
  { id: "pelea1", nombre: "Conflicto", imagen: "/juegos/trabajemos-juntos/pelea1.webp" },
  { id: "pelea2", nombre: "Conflicto", imagen: "/juegos/trabajemos-juntos/pelea2.webp" },
  { id: "pelea3", nombre: "Conflicto", imagen: "/juegos/trabajemos-juntos/pelea3.webp" },
  { id: "pelea4", nombre: "Conflicto", imagen: "/juegos/trabajemos-juntos/pelea4.webp" },
];

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

export default function TrabajemosJuntos({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo(() => {
    if (configuracion?.situaciones?.length) {
      return mezclar(configuracion.situaciones);
    }

    return mezclar(imagenesEquipoPredeterminadas).slice(0, 4);
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const imagenCorrecta = rondas[rondaActual];

  const opciones = useMemo(() => {
    if (!imagenCorrecta) return [];

    const distractoresRandom = mezclar(
      imagenesDistractorasPredeterminadas
    ).slice(0, 2);

    return mezclar([imagenCorrecta, ...distractoresRandom]);
  }, [imagenCorrecta]);

  const elegirOpcion = (imagen: ImagenJuego) => {
    if (bloqueado || juegoTerminado || !imagenCorrecta) return;

    setSeleccionada(imagen.id);
    setBloqueado(true);

    if (imagen.id === imagenCorrecta.id) {
      setMensaje("¡Muy bien! Trabajar juntos es divertido.");

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual((prev) => prev + 1);
          setSeleccionada(null);
          setMensaje("");
          setBloqueado(false);
        } else {
          setJuegoTerminado(true);
        }
      }, 1200);
    } else {
      setMensaje("Sigamos intentando.");

      setTimeout(() => {
        setSeleccionada(null);
        setMensaje("");
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

  if (!imagenCorrecta) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center">
        <p className="text-2xl font-bold text-purple-700">
          No hay imágenes para jugar.
        </p>
        <button
          type="button"
          onClick={onFinalizar}
          className="mt-5 rounded-full bg-green-500 px-8 py-4 font-bold text-white"
        >
          Finalizar Juego
        </button>
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
          <p className="text-xl font-bold text-gray-700">
            {imagenCorrecta.nombre}
          </p>

          {mensaje && (
            <p
              className={`mt-2 text-2xl font-extrabold ${
                mensaje.includes("Muy bien")
                  ? "text-green-500"
                  : "text-orange-500"
              }`}
            >
              {mensaje}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {opciones.map((imagen, index) => {
            const esSeleccionada = seleccionada === imagen.id;
            const esCorrecta = imagen.id === imagenCorrecta.id;

            return (
              <button
                key={`${imagen.id}-${index}`}
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
                <div className="flex h-[330px] items-center justify-center overflow-hidden rounded-2xl bg-purple-50">
                  <img
                    src={imagen.imagen}
                    alt="Opción del juego"
                    className="h-full w-full object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}