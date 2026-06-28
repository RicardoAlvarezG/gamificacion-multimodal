"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionRutinasDiarias } from "../personalizacion-juegos/PersonalizarRutinasDiarias";

type Paso = {
  id: string;
  texto: string;
  imagen: string;
  pregunta?: string;
};

type Rutina = {
  id: string;
  titulo: string;
  emoji: string;
  color: string;
  pasos: Paso[];
};

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionRutinasDiarias;
};

const rutinas: Rutina[] = [
  {
    id: "manana",
    titulo: "Rutina de la mañana",
    emoji: "🌅",
    color: "from-yellow-200 to-orange-200",
    pasos: [
      { id: "levantar", texto: "Me levanto", imagen: "/juegos/rutinas/levantar.webp" },
      { id: "cama", texto: "Tiendo mi cama", imagen: "/juegos/rutinas/cama.webp" },
      { id: "aseo", texto: "Me aseo", imagen: "/juegos/rutinas/aseo.webp" },
      { id: "vestir", texto: "Me visto", imagen: "/juegos/rutinas/vestir.webp" },
      { id: "desayuno", texto: "Desayuno", imagen: "/juegos/rutinas/desayuno.webp" },
      { id: "colegio", texto: "Voy al colegio", imagen: "/juegos/rutinas/colegio.webp" },
    ],
  },
  {
    id: "tarde",
    titulo: "Rutina de la tarde",
    emoji: "☀️",
    color: "from-sky-200 to-green-200",
    pasos: [
      { id: "almuerzo", texto: "Almuerzo", imagen: "/juegos/rutinas/almuerzo.webp" },
      { id: "descanso", texto: "Descanso", imagen: "/juegos/rutinas/descanso.webp" },
      { id: "juego", texto: "Juego", imagen: "/juegos/rutinas/juego.webp" },
      { id: "tareas", texto: "Hago mis tareas", imagen: "/juegos/rutinas/tareas.webp" },
      { id: "ordenar", texto: "Ordeno mis cosas", imagen: "/juegos/rutinas/ordenar.webp" },
      { id: "merienda", texto: "Meriendo", imagen: "/juegos/rutinas/merienda.webp" },
    ],
  },
  {
    id: "noche",
    titulo: "Rutina de la noche",
    emoji: "🌙",
    color: "from-indigo-200 to-purple-200",
    pasos: [
      { id: "cena", texto: "Ceno", imagen: "/juegos/rutinas/cena.webp" },
      { id: "familia", texto: "Juego en familia", imagen: "/juegos/rutinas/familia.webp" },
      { id: "bano", texto: "Me baño", imagen: "/juegos/rutinas/bano.webp" },
      { id: "pijama", texto: "Me pongo pijama", imagen: "/juegos/rutinas/pijama.webp" },
      { id: "dientes", texto: "Me cepillo los dientes", imagen: "/juegos/rutinas/dientes.webp" },
      { id: "dormir", texto: "Me acuesto", imagen: "/juegos/rutinas/dormir.webp" },
    ],
  },
];

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function crearRutinaPersonalizada(
  configuracion: ConfiguracionRutinasDiarias
): Rutina {
  const rutinaBase =
    rutinas.find((rutina) => rutina.id === configuracion.rutinaId) ??
    rutinas[0];

  return {
    ...rutinaBase,
    pasos: configuracion.pasos.map((paso) => ({
      id: paso.id,
      texto: paso.texto,
      imagen: paso.imagen,
      pregunta: paso.pregunta,
    })),
  };
}

export default function RutinasDiarias({
  onFinalizar,
  configuracion,
}: Props) {
  const rutinasJuego = useMemo(() => {
    if (!configuracion) {
      return mezclar(rutinas);
    }

    return [crearRutinaPersonalizada(configuracion)];
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [pasoActual, setPasoActual] = useState(0);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState<Paso[]>([]);
  const [opciones, setOpciones] = useState<Paso[]>(mezclar(rutinasJuego[0].pasos));
  const [mensaje, setMensaje] = useState("Ordena la rutina en el orden correcto");
  const [tarjetaError, setTarjetaError] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);

  const rutina = rutinasJuego[rondaActual];
  const pasoEsperado = rutina.pasos[pasoActual];

  const seleccionarPaso = (paso: Paso) => {
    if (tarjetaError || completado) return;

    if (paso.id === pasoEsperado.id) {
      const nuevoOrden = [...ordenSeleccionado, paso];
      setOrdenSeleccionado(nuevoOrden);
      setOpciones((prev) => prev.filter((item) => item.id !== paso.id));
      setMensaje("¡Muy bien!");

      if (nuevoOrden.length === rutina.pasos.length) {
        setTimeout(() => {
          if (rondaActual + 1 < rutinasJuego.length) {
            const siguienteRonda = rondaActual + 1;
            setRondaActual(siguienteRonda);
            setPasoActual(0);
            setOrdenSeleccionado([]);
            setOpciones(mezclar(rutinasJuego[siguienteRonda].pasos));
            setMensaje("Ordena la siguiente rutina");
          } else {
            setCompletado(true);
            setMensaje("¡Excelente! Completaste todas las rutinas");
          }
        }, 900);
      } else {
        setPasoActual((prev) => prev + 1);
      }
    } else {
      setTarjetaError(paso.id);
      setMensaje("Sigamos intentando");

      setTimeout(() => {
        setTarjetaError(null);
        setMensaje("Intenta elegir la actividad correcta");
      }, 900);
    }
  };

  if (completado) {
    return (
      <div className="w-full rounded-3xl bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 p-8 text-center shadow-xl">
        <div className="text-7xl mb-4">🏆</div>

        <h2 className="text-4xl font-black text-purple-700 mb-3">
          ¡Excelente!
        </h2>

        <p className="text-xl font-bold text-gray-700 mb-8">
          Completaste todas las rutinas del día.
        </p>

        <button
          onClick={onFinalizar}
          className="rounded-full bg-purple-600 px-8 py-4 text-xl font-black text-white shadow-lg hover:bg-purple-700"
        >
          Finalizar juego
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-white p-5 shadow-xl">
      <div className={`rounded-3xl bg-gradient-to-r ${rutina.color} p-5 mb-5`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-purple-700">
              {rutina.emoji} {rutina.titulo}
            </h2>

            <p className="text-lg font-bold text-gray-700">
              Ronda {rondaActual + 1} de {rutinasJuego.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 px-5 py-3 text-center shadow">
            <p className="text-sm font-bold text-gray-500">Busca el paso</p>
            <p className="text-2xl font-black text-purple-700">
              {pasoActual + 1}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/80 p-4 text-center">
          <p className="text-2xl font-black text-gray-800">{mensaje}</p>

          <p className="mt-1 text-lg font-bold text-purple-700">
            {pasoEsperado.pregunta
              ? pasoEsperado.pregunta
              : `Ahora toca: ${pasoEsperado.texto}`}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border-4 border-dashed border-purple-200 bg-purple-50 p-4">
        <h3 className="mb-3 text-xl font-black text-purple-700">
          Mi rutina
        </h3>

        <div className="grid grid-cols-6 gap-3">
          {rutina.pasos.map((_, index) => {
            const paso = ordenSeleccionado[index];

            return (
              <div
                key={index}
                className="flex h-32 items-center justify-center rounded-2xl bg-white shadow"
              >
                {paso ? (
                  <div className="text-center">
                    <img
                      src={paso.imagen}
                      alt={paso.texto}
                      className="mx-auto h-20 w-20 object-contain"
                    />

                    <p className="text-xs font-black text-gray-700">
                      {paso.texto}
                    </p>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-purple-300">
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="mb-4 text-2xl font-black text-gray-800">
        Elige la siguiente actividad
      </h3>

      <div className="grid grid-cols-3 gap-5">
        {opciones.map((paso) => {
          const esError = tarjetaError === paso.id;

          return (
            <button
              key={paso.id}
              onClick={() => seleccionarPaso(paso)}
              className={`rounded-3xl border-4 bg-white p-4 shadow-lg transition-all hover:scale-105 ${
                esError
                  ? "border-red-500 bg-red-100 scale-95"
                  : "border-purple-200 hover:border-purple-400"
              }`}
            >
              <img
                src={paso.imagen}
                alt={paso.texto}
                className="mx-auto h-40 w-full object-contain"
              />

              <p className="mt-3 text-xl font-black text-gray-800">
                {paso.texto}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}