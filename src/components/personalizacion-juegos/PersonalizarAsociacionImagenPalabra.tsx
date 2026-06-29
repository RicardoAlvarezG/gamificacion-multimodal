"use client";

import { useState } from "react";

export type ConfiguracionAsociacionImagenPalabra = {
  modo: "IMAGEN_A_PALABRA" | "PALABRA_A_IMAGEN";
  imagenes: string[];
  rondas: number;
};

type ImagenDisponible = {
  id: string;
  nombre: string;
};

type Props = {
  configuracionInicial?: ConfiguracionAsociacionImagenPalabra;
  onGuardar: (configuracion: ConfiguracionAsociacionImagenPalabra) => void;
  onCancelar: () => void;
};

const IMAGENES_DISPONIBLES: ImagenDisponible[] = [
  { id: "abeja", nombre: "Abeja" },
  { id: "barco", nombre: "Barco" },
  { id: "carro", nombre: "Carro" },
  { id: "casa", nombre: "Casa" },
  { id: "estrella", nombre: "Estrella" },
  { id: "flor", nombre: "Flor" },
  { id: "gato", nombre: "Gato" },
  { id: "luna", nombre: "Luna" },
  { id: "mano", nombre: "Mano" },
  { id: "manzana", nombre: "Manzana" },
  { id: "mesa", nombre: "Mesa" },
  { id: "pato", nombre: "Pato" },
  { id: "pez", nombre: "Pez" },
  { id: "sol", nombre: "Sol" },
  { id: "vaca", nombre: "Vaca" },

  // Nuevas imágenes
  { id: "perro", nombre: "Perro" },
  { id: "arbol", nombre: "Árbol" },
  { id: "pelota", nombre: "Pelota" },
  { id: "mariposa", nombre: "Mariposa" },
  { id: "zapato", nombre: "Zapato" },
];

export default function PersonalizarAsociacionImagenPalabra({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [modo, setModo] = useState<
    "IMAGEN_A_PALABRA" | "PALABRA_A_IMAGEN"
  >(configuracionInicial?.modo ?? "IMAGEN_A_PALABRA");

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<string[]>(
    configuracionInicial?.imagenes ??
      IMAGENES_DISPONIBLES.map((imagen) => imagen.id)
  );

  const alternarImagen = (id: string) => {
    setImagenesSeleccionadas((prev) =>
      prev.includes(id)
        ? prev.filter((img) => img !== id)
        : [...prev, id]
    );
  };

  const guardar = () => {
    if (imagenesSeleccionadas.length === 0) {
      alert("Selecciona al menos una imagen.");
      return;
    }

    onGuardar({
      modo,
      imagenes: imagenesSeleccionadas,
      rondas: imagenesSeleccionadas.length,
    });
  };

  return (
    <div className="space-y-6">

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          Modo de juego
        </h3>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={modo === "IMAGEN_A_PALABRA"}
              onChange={() => setModo("IMAGEN_A_PALABRA")}
            />
            Imagen → Palabra
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={modo === "PALABRA_A_IMAGEN"}
              onChange={() => setModo("PALABRA_A_IMAGEN")}
            />
            Palabra → Imagen
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">
          Imágenes disponibles
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {IMAGENES_DISPONIBLES.map((imagen) => (
            <label
              key={imagen.id}
              className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={imagenesSeleccionadas.includes(imagen.id)}
                onChange={() => alternarImagen(imagen.id)}
              />
              <span>{imagen.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Rondas: <strong>{imagenesSeleccionadas.length}</strong>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancelar}
          className="px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Guardar
        </button>
      </div>

    </div>
  );
}