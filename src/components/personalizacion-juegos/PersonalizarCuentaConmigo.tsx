"use client";

import { useState } from "react";

export type ConfiguracionCuentaConmigo = {
  numeros: number[];
  imagenes: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionCuentaConmigo;
  onGuardar: (configuracion: ConfiguracionCuentaConmigo) => void;
  onCancelar: () => void;
};

const NUMEROS_DISPONIBLES = [1, 2, 3, 4, 5];

const IMAGENES_DISPONIBLES = [
  "auto",
  "avion",
  "balon",
  "barco",
  "conejo",
  "flor",
  "gato",
  "helado",
  "lapiz",
  "libro",
  "manzana",
  "mariposa",
  "oso",
  "paleta",
  "pelota",
  "pez",
  "pollo",
  "sol",
  "tren",
  "vaca",
];

const nombreBonito = (texto: string) =>
  texto
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());

export default function PersonalizarCuentaConmigo({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>(
    configuracionInicial?.numeros ?? []
  );

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<string[]>(
    configuracionInicial?.imagenes ?? []
  );

  const alternarNumero = (numero: number) => {
    setNumerosSeleccionados((actual) =>
      actual.includes(numero)
        ? actual.filter((item) => item !== numero)
        : [...actual, numero]
    );
  };

  const alternarImagen = (imagen: string) => {
    setImagenesSeleccionadas((actual) =>
      actual.includes(imagen)
        ? actual.filter((item) => item !== imagen)
        : [...actual, imagen]
    );
  };

  const guardar = () => {
    if (numerosSeleccionados.length === 0) {
      alert("Selecciona al menos un número.");
      return;
    }

    if (imagenesSeleccionadas.length === 0) {
      alert("Selecciona al menos una imagen.");
      return;
    }

    onGuardar({
      numeros: numerosSeleccionados,
      imagenes: imagenesSeleccionadas,
      rondas: imagenesSeleccionadas.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige los números a trabajar
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {NUMEROS_DISPONIBLES.map((numero) => {
            const activo = numerosSeleccionados.includes(numero);

            return (
              <button
                key={numero}
                type="button"
                onClick={() => alternarNumero(numero)}
                className={`rounded-2xl border-2 px-4 py-3 text-3xl font-black transition ${
                  activo
                    ? "border-purple-500 bg-purple-100 text-purple-700"
                    : "border-purple-200 bg-white text-purple-400 hover:bg-purple-50"
                }`}
              >
                {numero}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige las imágenes
        </h3>

        <div className="max-h-[360px] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {IMAGENES_DISPONIBLES.map((imagen) => {
              const activo = imagenesSeleccionadas.includes(imagen);

              return (
                <button
                  key={imagen}
                  type="button"
                  onClick={() => alternarImagen(imagen)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    activo
                      ? "border-purple-500 bg-purple-100"
                      : "border-purple-200 bg-white hover:bg-purple-50"
                  }`}
                >
                  <img
                    src={`/juegos/conteo/${imagen}.webp`}
                    alt={nombreBonito(imagen)}
                    className="h-14 w-14 object-contain"
                  />

                  <span className="text-sm font-black text-purple-700">
                    {nombreBonito(imagen)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
        Rondas del juego: {imagenesSeleccionadas.length}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl bg-gray-100 px-5 py-3 font-bold text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}