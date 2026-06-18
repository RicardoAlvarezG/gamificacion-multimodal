"use client";

import { useMemo, useState } from "react";

type Animal = {
  nombre: string;
  imagen: string;
  sonido: string;
  emoji: string;
  color: string;
};

type Props = {
  onFinalizar: () => void;
};

const animales: Animal[] = [
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
];

function mezclarArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function SonidosAnimales({ onFinalizar }: Props) {
  const rondas = useMemo(() => mezclarArray(animales).slice(0, 5), []);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [respondido, setRespondido] = useState(false);
  const [animalElegido, setAnimalElegido] = useState<string | null>(null);

  const animalCorrecto = rondas[rondaActual];

  const opciones = useMemo(() => {
    const incorrectos = animales.filter(
      (animal) => animal.nombre !== animalCorrecto.nombre
    );

    return mezclarArray([
      animalCorrecto,
      ...mezclarArray(incorrectos).slice(0, 2),
    ]);
  }, [animalCorrecto, rondaActual]);

  const reproducirSonido = () => {
    const audio = new Audio(animalCorrecto.sonido);
    audio.play();
  };

  const seleccionarAnimal = (animal: Animal) => {
    if (respondido) return;

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

    if (rondaActual < 4) {
      setRondaActual(rondaActual + 1);
    }
  };

  const juegoTerminado = rondaActual === 4 && respondido;

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
            Escucha el sonido y toca el animal correcto.
          </p>

          <div className="flex justify-center gap-2 mt-5">
            {[0, 1, 2, 3, 4].map((ronda) => (
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

        <div className="flex justify-center mb-8">
          <button
            onClick={reproducirSonido}
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