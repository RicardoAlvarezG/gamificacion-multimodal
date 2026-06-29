"use client";

import { useState } from "react";

export type PalabraPersonalizada = {
  id: string;
  palabra: string;
  imagen: string;
};

export type ConfiguracionConstruyePalabras = {
  palabras: PalabraPersonalizada[];
};

type Props = {
  configuracionInicial?: ConfiguracionConstruyePalabras;
  onGuardar: (configuracion: ConfiguracionConstruyePalabras) => void;
  onCancelar: () => void;
};

const PALABRAS_DISPONIBLES: PalabraPersonalizada[] = [
  { id: "sol", palabra: "SOL", imagen: "/juegos/palabras/sol.webp" },
  { id: "casa", palabra: "CASA", imagen: "/juegos/palabras/casa.webp" },
  { id: "gato", palabra: "GATO", imagen: "/juegos/palabras/gato.webp" },
  { id: "pato", palabra: "PATO", imagen: "/juegos/palabras/pato.webp" },
  { id: "flor", palabra: "FLOR", imagen: "/juegos/palabras/flor.webp" },
  { id: "luna", palabra: "LUNA", imagen: "/juegos/palabras/luna.webp" },
  { id: "pez", palabra: "PEZ", imagen: "/juegos/palabras/pez.webp" },
  { id: "mano", palabra: "MANO", imagen: "/juegos/palabras/mano.webp" },
  { id: "mesa", palabra: "MESA", imagen: "/juegos/palabras/mesa.webp" },
  { id: "vaca", palabra: "VACA", imagen: "/juegos/palabras/vaca.webp" },

  { id: "aro", palabra: "ARO", imagen: "/juegos/palabras/aro.webp" },
  { id: "ave", palabra: "AVE", imagen: "/juegos/palabras/ave.webp" },
  { id: "boca", palabra: "BOCA", imagen: "/juegos/palabras/boca.webp" },
  { id: "cama", palabra: "CAMA", imagen: "/juegos/palabras/cama.webp" },
  { id: "copa", palabra: "COPA", imagen: "/juegos/palabras/copa.webp" },
  { id: "dedo", palabra: "DEDO", imagen: "/juegos/palabras/dedo.webp" },
  { id: "dado", palabra: "DADO", imagen: "/juegos/palabras/dado.webp" },
  { id: "foco", palabra: "FOCO", imagen: "/juegos/palabras/foco.webp" },
  { id: "hoja", palabra: "HOJA", imagen: "/juegos/palabras/hoja.webp" },
  { id: "lupa", palabra: "LUPA", imagen: "/juegos/palabras/lupa.webp" },
  { id: "nube", palabra: "NUBE", imagen: "/juegos/palabras/nube.webp" },
  { id: "oso", palabra: "OSO", imagen: "/juegos/palabras/oso.webp" },
  { id: "pera", palabra: "PERA", imagen: "/juegos/palabras/pera.webp" },
  { id: "sopa", palabra: "SOPA", imagen: "/juegos/palabras/sopa.webp" },
  { id: "taza", palabra: "TAZA", imagen: "/juegos/palabras/taza.webp" },
];

const idsIniciales = ["sol", "casa", "gato", "pato", "flor"];

export default function PersonalizarConstruyePalabras({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [palabras, setPalabras] = useState<PalabraPersonalizada[]>(
    configuracionInicial?.palabras ??
      PALABRAS_DISPONIBLES.filter((item) => idsIniciales.includes(item.id))
  );

  const estaSeleccionada = (id: string) =>
    palabras.some((item) => item.id === id);

  const alternarPalabra = (item: PalabraPersonalizada) => {
    setPalabras((actuales) => {
      if (actuales.some((palabra) => palabra.id === item.id)) {
        return actuales.filter((palabra) => palabra.id !== item.id);
      }

      return [...actuales, item];
    });
  };

  const actualizarTexto = (id: string, nuevoTexto: string) => {
    const textoLimpio = nuevoTexto
      .toUpperCase()
      .replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");

    setPalabras((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, palabra: textoLimpio } : item
      )
    );
  };

  const guardar = () => {
    if (palabras.length === 0) {
      alert("Selecciona al menos una imagen.");
      return;
    }

    if (palabras.some((item) => item.palabra.trim().length === 0)) {
      alert("Todas las imágenes seleccionadas deben tener una palabra.");
      return;
    }

    onGuardar({
      palabras,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-extrabold text-purple-700">
          Personalizar Construye Palabras
        </h3>
        <p className="text-sm font-semibold text-gray-600">
          Selecciona las imágenes y modifica la palabra que el niño deberá formar.
        </p>
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-700">
        Rondas: {palabras.length}. El número de rondas se calcula automáticamente según las imágenes seleccionadas.
      </div>

      <div className="grid max-h-[450px] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-4">
        {PALABRAS_DISPONIBLES.map((item) => {
          const activo = estaSeleccionada(item.id);
          const palabraActual =
            palabras.find((palabra) => palabra.id === item.id)?.palabra ??
            item.palabra;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border-4 bg-white p-3 transition ${
                activo
                  ? "border-purple-400 shadow-lg"
                  : "border-gray-100 opacity-70"
              }`}
            >
              <button
                type="button"
                onClick={() => alternarPalabra(item)}
                className="w-full"
              >
                <img
                  src={item.imagen}
                  alt={item.palabra}
                  className="h-24 w-full object-contain"
                />

                <p className={`mt-2 text-xs font-bold ${activo ? "text-purple-600" : "text-gray-400"}`}>
                  {activo ? "Seleccionado" : "Tocar para elegir"}
                </p>
              </button>

              <input
                type="text"
                value={palabraActual}
                disabled={!activo}
                maxLength={6}
                onChange={(e) => actualizarTexto(item.id, e.target.value)}
                className="mt-2 w-full rounded-xl border border-purple-200 px-3 py-2 text-center text-sm font-extrabold uppercase outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-600 hover:bg-gray-200"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-2xl bg-purple-500 px-5 py-3 font-bold text-white hover:bg-purple-600"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}