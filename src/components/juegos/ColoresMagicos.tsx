"use client";

import { useState } from "react";

type ColoresMagicosProps = {
  onFinalizar: () => void;
};

const rondas = [
  "rojo",
  "azul",
  "amarillo",
  "rojo",
  "azul",
  "amarillo",
];

const colores = [
  {
    nombre: "rojo",
    clase: "bg-red-500",
    texto: "text-red-500",
  },
  {
    nombre: "azul",
    clase: "bg-blue-500",
    texto: "text-blue-500",
  },
  {
    nombre: "amarillo",
    clase: "bg-yellow-300",
    texto: "text-yellow-400",
  },
];

function mezclarColores() {
  return [...colores].sort(() => Math.random() - 0.5);
}

export default function ColoresMagicos({
  onFinalizar,
}: ColoresMagicosProps) {
  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [opciones, setOpciones] = useState(mezclarColores());

  const verificarColor = (color: string) => {
    const respuestaCorrecta = rondas[rondaActual];

    if (color === respuestaCorrecta) {
      setMensaje("🎉 ¡Muy bieeeen!");

      setTimeout(() => {
        if (rondaActual === rondas.length - 1) {
          setJuegoTerminado(true);
        } else {
          setRondaActual((prev) => prev + 1);
          setOpciones(mezclarColores());
        }

        setMensaje("");
      }, 1000);
    } else {
      setMensaje("😊 Sigamos intentando");
    }
  };

  const colorActual = colores.find(
    (color) => color.nombre === rondas[rondaActual]
  );

  if (juegoTerminado) {
    return (
      <div className="mx-auto mt-8 max-w-7xl rounded-[3rem] bg-gradient-to-b from-sky-200 via-green-100 to-lime-200 p-16 text-center shadow-xl">
        <div className="rounded-[3rem] bg-white/90 p-12 shadow-md">
          <h2 className="mb-6 text-7xl font-extrabold text-purple-700">
            🌟 ¡Excelente trabajo!
          </h2>

          <p className="mb-10 text-3xl font-semibold text-slate-600">
            Has completado Colores Mágicos
          </p>

          <button
            onClick={onFinalizar}
            className="rounded-3xl bg-green-500 px-12 py-6 text-3xl font-bold text-white shadow-md transition hover:scale-105"
          >
            Finalizar Juego
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[3rem] bg-gradient-to-b from-sky-200 via-green-100 to-lime-200 p-16 text-center shadow-xl">
      <div className="mb-12 rounded-[3rem] bg-white/90 p-10 shadow-md">
        <h2 className="mb-6 text-6xl font-extrabold text-purple-700">
          🎨 Colores Mágicos
        </h2>

        <p className="text-5xl font-bold text-slate-700">
          Selecciona el color{" "}
          <span className={`uppercase ${colorActual?.texto}`}>
            {rondas[rondaActual]}
          </span>
        </p>
      </div>

      <div className="mb-12 flex flex-wrap justify-center gap-16">
        {opciones.map((color) => (
          <button
            key={color.nombre}
            onClick={() => verificarColor(color.nombre)}
            className={`h-72 w-72 ${color.clase} shadow-xl transition hover:scale-110`}
            style={{
              borderRadius: "55% 45% 60% 40% / 45% 60% 40% 55%",
              border: "12px solid white",
            }}
            aria-label={color.nombre}
          />
        ))}
      </div>

      {mensaje && (
        <div className="mx-auto w-fit rounded-3xl bg-white/90 px-12 py-6 text-5xl font-bold text-green-600 shadow-md">
          {mensaje}
        </div>
      )}

      <p className="mt-10 text-3xl font-extrabold text-slate-700">
        Ronda {rondaActual + 1} de {rondas.length}
      </p>
    </div>
  );
}