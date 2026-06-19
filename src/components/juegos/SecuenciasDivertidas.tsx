"use client";

import { useMemo, useState } from "react";

type Props = {
  onFinalizar: () => void;
};

type Figura = {
  nombre: string;
  imagen: string;
};

type Ronda = {
  secuencia: Figura[];
  respuesta: Figura;
  opciones: Figura[];
};

const figuras: Figura[] = [
  { nombre: "Círculo rojo", imagen: "circulo-rojo.webp" },
  { nombre: "Círculo azul", imagen: "circulo-azul.webp" },
  { nombre: "Círculo verde", imagen: "circulo-verde.webp" },
  { nombre: "Círculo amarillo", imagen: "circulo-amarillo.webp" },

  { nombre: "Cuadrado rojo", imagen: "cuadrado-rojo.webp" },
  { nombre: "Cuadrado azul", imagen: "cuadrado-azul.webp" },
  { nombre: "Cuadrado verde", imagen: "cuadrado-verde.webp" },
  { nombre: "Cuadrado amarillo", imagen: "cuadrado-amarillo.webp" },

  { nombre: "Triángulo rojo", imagen: "triangulo-rojo.webp" },
  { nombre: "Triángulo azul", imagen: "triangulo-azul.webp" },
  { nombre: "Triángulo verde", imagen: "triangulo-verde.webp" },
  { nombre: "Triángulo amarillo", imagen: "triangulo-amarillo.webp" },
];

const mezclar = <T,>(array: T[]) =>
  [...array].sort(() => Math.random() - 0.5);

const crearRondas = (): Ronda[] => {
  const rondas: Ronda[] = [];

  for (let i = 0; i < 3; i++) {
    const seleccionadas = mezclar(figuras).slice(0, 2);

    const primera = seleccionadas[0];
    const segunda = seleccionadas[1];

    const secuencia = [primera, segunda, primera, segunda];
    const respuesta = primera;

    const distractores = mezclar(
      figuras.filter((f) => f.imagen !== respuesta.imagen)
    ).slice(0, 2);

    rondas.push({
      secuencia,
      respuesta,
      opciones: mezclar([respuesta, ...distractores]),
    });
  }

  return rondas;
};

export default function SecuenciasDivertidas({
  onFinalizar,
}: Props) {
  const rondas = useMemo(() => crearRondas(), []);

  const [rondaActual, setRondaActual] = useState(0);
  const [opcionIncorrecta, setOpcionIncorrecta] = useState<string | null>(null);
  const [opcionCorrecta, setOpcionCorrecta] = useState<string | null>(null);
  const [finalizado, setFinalizado] = useState(false);

  const ronda = rondas[rondaActual];

  const seleccionarOpcion = (figura: Figura) => {
    if (opcionCorrecta) return;

    if (figura.imagen === ronda.respuesta.imagen) {
      setOpcionCorrecta(figura.imagen);

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual((prev) => prev + 1);
          setOpcionCorrecta(null);
          setOpcionIncorrecta(null);
        } else {
          setFinalizado(true);
        }
      }, 900);
    } else {
      setOpcionIncorrecta(figura.imagen);

      setTimeout(() => {
        setOpcionIncorrecta(null);
      }, 800);
    }
  };

  if (finalizado) {
    return (
      <div className="w-full max-w-6xl mx-auto rounded-[40px] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-12 text-center shadow-xl border-4 border-purple-200">
        <div className="text-8xl mb-6">🎉</div>

        <h2 className="text-5xl font-black text-purple-700 mb-4">
          ¡Excelente trabajo!
        </h2>

        <p className="text-3xl font-bold text-slate-700 mb-10">
          Has completado todas las secuencias.
        </p>

        <button
          onClick={onFinalizar}
          className="rounded-full bg-purple-600 px-12 py-5 text-3xl font-black text-white shadow-lg hover:scale-105 transition"
        >
          Finalizar Juego
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto rounded-[40px] bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-12 shadow-xl border-4 border-purple-200">
      <div className="text-center mb-10">
        <h2 className="text-6xl font-black text-purple-700">
          Secuencias Divertidas
        </h2>

        <p className="text-3xl font-bold text-slate-600 mt-4">
          Observa la secuencia y elige qué figura sigue
        </p>

        <div className="mt-6 inline-block rounded-full bg-purple-500 px-10 py-4 text-2xl font-black text-white">
          Ronda {rondaActual + 1} de {rondas.length}
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 mb-14">
        {ronda.secuencia.map((figura, index) => (
          <div
            key={`${figura.imagen}-${index}`}
            className="w-44 h-44 rounded-3xl bg-white border-4 border-purple-200 shadow-lg flex items-center justify-center"
          >
            <img
              src={`/juegos/secuencias/${figura.imagen}`}
              alt={figura.nombre}
              className="w-36 h-36 object-contain"
            />
          </div>
        ))}

        <div className="w-44 h-44 rounded-3xl bg-white border-4 border-dashed border-purple-400 shadow-lg flex items-center justify-center">
          <span className="text-8xl font-black text-purple-600">?</span>
        </div>
      </div>

      <h3 className="text-center text-4xl font-black text-slate-700 mb-10">
        ¿Cuál sigue?
      </h3>

      <div className="flex flex-wrap justify-center gap-10">
        {ronda.opciones.map((figura) => {
          const esIncorrecta = opcionIncorrecta === figura.imagen;
          const esCorrecta = opcionCorrecta === figura.imagen;

          return (
            <button
              key={figura.imagen}
              onClick={() => seleccionarOpcion(figura)}
              className={`w-56 h-56 rounded-[32px] bg-white border-4 shadow-xl flex items-center justify-center transition hover:scale-105 ${
                esCorrecta
                  ? "border-green-500 bg-green-100"
                  : esIncorrecta
                  ? "border-red-500 bg-red-100"
                  : "border-purple-200 hover:border-purple-400"
              }`}
            >
              <img
                src={`/juegos/secuencias/${figura.imagen}`}
                alt={figura.nombre}
                className="w-44 h-44 object-contain"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}