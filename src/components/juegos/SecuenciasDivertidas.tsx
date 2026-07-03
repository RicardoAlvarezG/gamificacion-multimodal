"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionSecuenciasDivertidas } from "../personalizacion-juegos/PersonalizarSecuenciasDivertidas";

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionSecuenciasDivertidas;
};

type Figura = {
  nombre: string;
  imagen: string;
  esTemporal?: boolean;
};

type Ronda = {
  titulo: string;
  secuencia: Figura[];
  respuesta: Figura;
  opciones: Figura[];
};

const figurasBase: Figura[] = [
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

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

const obtenerSrc = (figura: Figura) => {
  if (figura.esTemporal) return figura.imagen;
  return `/juegos/secuencias/${figura.imagen}`;
};

function crearRondasPredeterminadas(): Ronda[] {
  return Array.from({ length: 3 }, () => {
    const seleccionadas = mezclar(figurasBase).slice(0, 2);
    const primera = seleccionadas[0];
    const segunda = seleccionadas[1];

    const distractores = mezclar(
      figurasBase.filter(
        (figura) =>
          figura.imagen !== primera.imagen && figura.imagen !== segunda.imagen
      )
    ).slice(0, 2);

    return {
      titulo: "Observa la secuencia y elige qué imagen sigue",
      secuencia: [primera, segunda, primera],
      respuesta: segunda,
      opciones: mezclar([segunda, ...distractores]),
    };
  });
}

function crearRondasPersonalizadas(
  configuracion: ConfiguracionSecuenciasDivertidas
): Ronda[] {
  const personalizadas = configuracion.rondasPersonalizadas ?? [];

  const bancoTemporal: Figura[] = personalizadas.flatMap((ronda, index) => [
    {
      nombre: `Imagen 1 ronda ${index + 1}`,
      imagen: ronda.imagen1,
      esTemporal: true,
    },
    {
      nombre: `Imagen 2 ronda ${index + 1}`,
      imagen: ronda.imagen2,
      esTemporal: true,
    },
  ]);

  return personalizadas.map((ronda, index) => {
    const imagen1: Figura = {
      nombre: `Imagen 1 ronda ${index + 1}`,
      imagen: ronda.imagen1,
      esTemporal: true,
    };

    const imagen2: Figura = {
      nombre: `Imagen 2 ronda ${index + 1}`,
      imagen: ronda.imagen2,
      esTemporal: true,
    };

    let distractores = mezclar(
      bancoTemporal.filter(
        (figura) =>
          figura.imagen !== imagen1.imagen && figura.imagen !== imagen2.imagen
      )
    ).slice(0, 2);

    if (distractores.length < 2) {
      const extras = mezclar(figurasBase).slice(0, 2 - distractores.length);
      distractores = [...distractores, ...extras];
    }

    return {
      titulo: ronda.titulo || "Observa la secuencia y elige qué imagen sigue",
      secuencia: [imagen1, imagen2, imagen1],
      respuesta: imagen2,
      opciones: mezclar([imagen2, ...distractores]),
    };
  });
}

export default function SecuenciasDivertidas({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo(() => {
    if (
      configuracion?.rondasPersonalizadas &&
      configuracion.rondasPersonalizadas.length > 0
    ) {
      return crearRondasPersonalizadas(configuracion);
    }

    return crearRondasPredeterminadas();
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [opcionIncorrecta, setOpcionIncorrecta] = useState<string | null>(null);
  const [opcionCorrecta, setOpcionCorrecta] = useState<string | null>(null);
  const [finalizado, setFinalizado] = useState(false);

  const ronda = rondas[rondaActual];

  const seleccionarOpcion = (figura: Figura) => {
    if (opcionCorrecta || !ronda) return;

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

  if (!ronda) {
    return (
      <div className="w-full max-w-6xl mx-auto rounded-[40px] bg-white p-12 text-center shadow-xl border-4 border-purple-200">
        <h2 className="text-4xl font-black text-purple-700">
          No hay secuencias disponibles.
        </h2>

        <button
          onClick={onFinalizar}
          className="mt-8 rounded-full bg-purple-600 px-10 py-4 text-2xl font-black text-white shadow-lg hover:scale-105 transition"
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
          {ronda.titulo}
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
              src={obtenerSrc(figura)}
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
        {ronda.opciones.map((figura, index) => {
          const esIncorrecta = opcionIncorrecta === figura.imagen;
          const esCorrecta = opcionCorrecta === figura.imagen;

          return (
            <button
              key={`${figura.imagen}-${index}`}
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
                src={obtenerSrc(figura)}
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