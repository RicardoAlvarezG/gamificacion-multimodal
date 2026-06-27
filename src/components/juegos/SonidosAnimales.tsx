"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionSonidosAnimales } from "@/components/personalizacion-juegos/PersonalizarSonidosAnimales";

type Animal = {
  nombre: string;
  imagen: string;
  sonido: string;
  emoji: string;
  color: string;
};

type Props = {
  configuracion?: ConfiguracionSonidosAnimales;
  onFinalizar: () => void;
};

const ANIMALES_DISPONIBLES: Animal[] = [
  {
    nombre: "Perro",
    imagen: "/juegos/animales/perro.webp",
    sonido: "/juegos/sonidos/sonidoperro.mp3",
    emoji: "🐶",
    color: "from-orange-100 to-yellow-100",
  },
  {
    nombre: "Gato",
    imagen: "/juegos/animales/gato.webp",
    sonido: "/juegos/sonidos/sonidogato.mp3",
    emoji: "🐱",
    color: "from-purple-100 to-pink-100",
  },
  {
    nombre: "Pato",
    imagen: "/juegos/animales/pato.webp",
    sonido: "/juegos/sonidos/sonidopato.mp3",
    emoji: "🦆",
    color: "from-green-100 to-lime-100",
  },
  {
    nombre: "Pollito",
    imagen: "/juegos/animales/pollito.webp",
    sonido: "/juegos/sonidos/sonidopollito.mp3",
    emoji: "🐥",
    color: "from-yellow-100 to-orange-100",
  },
  {
    nombre: "Vaca",
    imagen: "/juegos/animales/vaca.webp",
    sonido: "/juegos/sonidos/sonidovaca.mp3",
    emoji: "🐮",
    color: "from-blue-100 to-slate-100",
  },
  {
    nombre: "Cabra",
    imagen: "/juegos/animales/cabra.webp",
    sonido: "/juegos/sonidos/sonidocabra.mp3",
    emoji: "🐐",
    color: "from-lime-100 to-green-100",
  },
  {
    nombre: "Burro",
    imagen: "/juegos/animales/burro.webp",
    sonido: "/juegos/sonidos/sonidoburro.mp3",
    emoji: "🫏",
    color: "from-stone-100 to-orange-100",
  },
  {
    nombre: "Gallina",
    imagen: "/juegos/animales/gallina.webp",
    sonido: "/juegos/sonidos/sonidogallina.mp3",
    emoji: "🐔",
    color: "from-red-100 to-yellow-100",
  },
  {
    nombre: "Gallo",
    imagen: "/juegos/animales/gallo.webp",
    sonido: "/juegos/sonidos/sonidogallo.mp3",
    emoji: "🐓",
    color: "from-orange-100 to-red-100",
  },
  {
    nombre: "Oveja",
    imagen: "/juegos/animales/oveja.webp",
    sonido: "/juegos/sonidos/sonidooveja.mp3",
    emoji: "🐑",
    color: "from-sky-100 to-white",
  },
  {
    nombre: "Pavo",
    imagen: "/juegos/animales/pavo.webp",
    sonido: "/juegos/sonidos/sonidopavo.mp3",
    emoji: "🦃",
    color: "from-yellow-100 to-red-100",
  },
  {
    nombre: "Caballo",
    imagen: "/juegos/animales/caballo.webp",
    sonido: "/juegos/sonidos/sonidocaballo.mp3",
    emoji: "🐴",
    color: "from-amber-100 to-orange-100",
  },
  {
    nombre: "Cerdo",
    imagen: "/juegos/animales/cerdo.webp",
    sonido: "/juegos/sonidos/sonidocerdo.mp3",
    emoji: "🐷",
    color: "from-pink-100 to-rose-100",
  },
  {
    nombre: "Cuy",
    imagen: "/juegos/animales/cuy.webp",
    sonido: "/juegos/sonidos/sonidocuy.mp3",
    emoji: "🐹",
    color: "from-yellow-100 to-stone-100",
  },
];

function mezclarArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function SonidosAnimales({
  configuracion,
  onFinalizar,
}: Props) {
  const modo = configuracion?.modo || "ESCUCHAR_Y_ELEGIR_ANIMAL";

  const animalesConfigurados = useMemo(() => {
    if (!configuracion?.animales || configuracion.animales.length < 3) {
      return ANIMALES_DISPONIBLES.slice(0, 5);
    }

    const seleccionados = ANIMALES_DISPONIBLES.filter((animal) =>
      configuracion.animales.includes(animal.nombre)
    );

    return seleccionados.length >= 3 ? seleccionados : ANIMALES_DISPONIBLES.slice(0, 5);
  }, [configuracion]);

  const cantidadRondas = Math.min(
    configuracion?.rondas || 5,
    animalesConfigurados.length
  );

  const rondas = useMemo(
    () => mezclarArray(animalesConfigurados).slice(0, cantidadRondas),
    [animalesConfigurados, cantidadRondas]
  );

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [respondido, setRespondido] = useState(false);
  const [animalElegido, setAnimalElegido] = useState<string | null>(null);

  const animalCorrecto = rondas[rondaActual];

  const opciones = useMemo(() => {
    if (!animalCorrecto) return [];

    const incorrectos = animalesConfigurados.filter(
      (animal) => animal.nombre !== animalCorrecto.nombre
    );

    return mezclarArray([
      animalCorrecto,
      ...mezclarArray(incorrectos).slice(0, 2),
    ]);
  }, [animalCorrecto, animalesConfigurados]);

  const reproducirSonido = (sonido?: string) => {
    const audio = new Audio(sonido || animalCorrecto.sonido);
    audio.play();
  };

  const seleccionarAnimal = (animal: Animal) => {
    if (respondido || !animalCorrecto) return;

    setAnimalElegido(animal.nombre);

    if (animal.nombre === animalCorrecto.nombre) {
      setMensaje("🎉 ¡Muy bien!");
      setRespondido(true);
    } else {
      setMensaje("😊 Sigamos intentando");
      setTimeout(() => {
        setAnimalElegido(null);
        setMensaje("");
      }, 1000);
    }
  };

  const siguienteRonda = () => {
    setMensaje("");
    setRespondido(false);
    setAnimalElegido(null);

    if (rondaActual < cantidadRondas - 1) {
      setRondaActual(rondaActual + 1);
    }
  };

  const juegoTerminado = rondaActual === cantidadRondas - 1 && respondido;

  if (!animalCorrecto) return null;

  return (
    <div className="w-full min-h-[75vh] rounded-[2rem] p-8 bg-gradient-to-br from-amber-50 via-pink-50 to-sky-100 shadow-xl border border-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg text-5xl mb-4">
            🐾
          </div>

          <h2 className="text-5xl font-extrabold text-purple-700">
            Sonidos de Animales
          </h2>

          <p className="text-slate-600 mt-3 text-lg">
            {configuracion?.pregunta ||
            (modo === "ESCUCHAR_Y_ELEGIR_ANIMAL"
              ? "Escucha el sonido y toca el animal correcto."
              : "Mira el animal y toca el sonido correcto.")}
          </p>

          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: cantidadRondas }).map((_, ronda) => (
              <div
                key={ronda}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow ${
                  ronda === rondaActual
                    ? "bg-purple-600 text-white scale-110"
                    : ronda < rondaActual
                    ? "bg-green-400 text-white"
                    : "bg-white text-purple-500"
                }`}
              >
                {ronda + 1}
              </div>
            ))}
          </div>
        </div>

        {modo === "ESCUCHAR_Y_ELEGIR_ANIMAL" ? (
          <>
            <div className="flex justify-center mb-8">
              <button
                onClick={() => reproducirSonido()}
                className="bg-gradient-to-r from-orange-400 to-pink-500 hover:scale-105 text-white text-3xl font-extrabold px-10 py-5 rounded-full shadow-xl transition"
              >
                🔊 Escuchar sonido
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {opciones.map((animal) => {
                const esElegido = animalElegido === animal.nombre;
                const esCorrecto = animal.nombre === animalCorrecto.nombre;

                return (
                  <button
                    key={animal.nombre}
                    onClick={() => seleccionarAnimal(animal)}
                    className={`rounded-[2rem] p-6 shadow-xl border-4 transition transform hover:scale-105 bg-gradient-to-br ${animal.color}
                      ${
                        esElegido && esCorrecto
                          ? "border-green-500 scale-105"
                          : esElegido && !esCorrecto
                          ? "border-red-400"
                          : "border-white"
                      }`}
                  >
                    <div className="bg-white rounded-[2rem] p-4 shadow-inner">
                      <img
                        src={animal.imagen}
                        alt={animal.nombre}
                        className="w-60 h-60 object-contain mx-auto"
                      />
                    </div>

                    <div className="mt-5 bg-white rounded-full py-3 shadow">
                      <p className="text-3xl font-extrabold text-slate-700">
                        {animal.emoji} {animal.nombre}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <div
                className={`rounded-[2rem] p-6 shadow-xl border-4 border-white bg-gradient-to-br ${animalCorrecto.color}`}
              >
                <div className="bg-white rounded-[2rem] p-4 shadow-inner">
                  <img
                    src={animalCorrecto.imagen}
                    alt={animalCorrecto.nombre}
                    className="w-72 h-72 object-contain mx-auto"
                  />
                </div>

                <div className="mt-5 bg-white rounded-full py-3 px-8 shadow text-center">
                  <p className="text-3xl font-extrabold text-slate-700">
                    {animalCorrecto.emoji} {animalCorrecto.nombre}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {opciones.map((animal) => {
                const esElegido = animalElegido === animal.nombre;
                const esCorrecto = animal.nombre === animalCorrecto.nombre;

                return (
                  <button
                    key={animal.nombre}
                    onClick={() => seleccionarAnimal(animal)}
                    className={`rounded-[2rem] bg-white p-8 shadow-xl border-4 transition transform hover:scale-105
                      ${
                        esElegido && esCorrecto
                          ? "border-green-500 scale-105"
                          : esElegido && !esCorrecto
                          ? "border-red-400"
                          : "border-purple-100"
                      }`}
                  >
                    <p className="mb-4 text-4xl font-extrabold text-purple-700">
                      🔊 Opción
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        reproducirSonido(animal.sonido);
                      }}
                      className="rounded-full bg-orange-400 px-8 py-4 text-2xl font-extrabold text-white shadow-md transition hover:scale-105"
                    >
                      Escuchar
                    </button>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {mensaje && (
          <div className="text-center mt-8">
            <div className="inline-block bg-white px-10 py-5 rounded-[2rem] shadow-xl">
              <p className="text-4xl font-extrabold text-purple-700">
                {mensaje}
              </p>
            </div>
          </div>
        )}

        {respondido && !juegoTerminado && (
          <div className="flex justify-center mt-8">
            <button
              onClick={siguienteRonda}
              className="bg-green-500 hover:bg-green-600 hover:scale-105 text-white text-2xl font-extrabold px-10 py-4 rounded-full shadow-xl transition"
            >
              Siguiente ronda ➜
            </button>
          </div>
        )}

        {juegoTerminado && (
          <div className="text-center mt-10 bg-white rounded-[2rem] p-8 shadow-xl max-w-xl mx-auto">
            <h3 className="text-4xl font-extrabold text-green-600">
              🎉 ¡Juego completado!
            </h3>

            <p className="text-slate-600 mt-3 text-lg">
              Los estudiantes terminaron la actividad.
            </p>

            <button
              onClick={onFinalizar}
              className="mt-6 bg-purple-600 hover:bg-purple-700 hover:scale-105 text-white text-2xl font-extrabold px-10 py-4 rounded-full shadow-xl transition"
            >
              Finalizar juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}