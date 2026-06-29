"use client";

import { useState } from "react";

export type ImagenRompecabezasPersonalizada = {
  id: string;
  nombre: string;
  src: string;
  grid: 2 | 3;
  temporal?: boolean;
};

export type ConfiguracionRompecabezasInteligente = {
  imagenes: ImagenRompecabezasPersonalizada[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionRompecabezasInteligente;
  onGuardar: (configuracion: ConfiguracionRompecabezasInteligente) => void;
  onCancelar: () => void;
};

const IMAGENES_DISPONIBLES: ImagenRompecabezasPersonalizada[] = Array.from(
  { length: 10 },
  (_, index) => ({
    id: `rompe${index + 1}`,
    nombre: `Imagen ${index + 1}`,
    src: `/juegos/rompecabezas/rompe${index + 1}.webp`,
    grid: index === 2 ? 3 : 2,
  })
);

export default function PersonalizarRompecabezasInteligente({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<
    ImagenRompecabezasPersonalizada[]
  >(configuracionInicial?.imagenes ?? IMAGENES_DISPONIBLES.slice(0, 3));

  const [imagenesTemporales, setImagenesTemporales] = useState<
    ImagenRompecabezasPersonalizada[]
  >(
    configuracionInicial?.imagenes.filter((img) => img.temporal) ?? []
  );

  const estaSeleccionada = (id: string) =>
    imagenesSeleccionadas.some((img) => img.id === id);

  const alternarImagen = (imagen: ImagenRompecabezasPersonalizada) => {
    setImagenesSeleccionadas((prev) => {
      const existe = prev.some((img) => img.id === imagen.id);

      if (existe) {
        return prev.filter((img) => img.id !== imagen.id);
      }

      return [...prev, imagen];
    });
  };

  const cambiarGridImagen = (id: string, grid: 2 | 3) => {
    setImagenesSeleccionadas((prev) =>
      prev.map((img) => (img.id === id ? { ...img, grid } : img))
    );

    setImagenesTemporales((prev) =>
      prev.map((img) => (img.id === id ? { ...img, grid } : img))
    );
  };

  const subirImagenesTemporales = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivos = Array.from(event.target.files ?? []);

    const disponibles = 5 - imagenesTemporales.length;

    if (disponibles <= 0) {
      alert("Solo puedes subir hasta 5 imágenes temporales.");
      event.target.value = "";
      return;
    }

    const archivosPermitidos = archivos.slice(0, disponibles);

    if (archivos.length > disponibles) {
      alert(`Solo se agregarán ${disponibles} imagen(es). El máximo es 5.`);
    }

    const nuevasImagenes = archivosPermitidos.map((archivo, index) => ({
      id: `temporal-${Date.now()}-${index}`,
      nombre: archivo.name.replace(/\.[^/.]+$/, ""),
      src: URL.createObjectURL(archivo),
      grid: 2 as 2 | 3,
      temporal: true,
    }));

    setImagenesTemporales((prev) => [...prev, ...nuevasImagenes]);
    setImagenesSeleccionadas((prev) => [...prev, ...nuevasImagenes]);

    event.target.value = "";
  };

  const quitarImagenTemporal = (id: string) => {
    setImagenesTemporales((prev) => prev.filter((img) => img.id !== id));
    setImagenesSeleccionadas((prev) => prev.filter((img) => img.id !== id));
  };

  const guardar = () => {
    if (imagenesSeleccionadas.length === 0) {
      alert("Selecciona o sube al menos una imagen.");
      return;
    }

    onGuardar({
      imagenes: imagenesSeleccionadas,
      rondas: imagenesSeleccionadas.length,
    });
  };

  const renderSelectorGrid = (imagen: ImagenRompecabezasPersonalizada) => {
    const seleccionada = imagenesSeleccionadas.find(
      (img) => img.id === imagen.id
    );

    if (!seleccionada) return null;

    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cambiarGridImagen(imagen.id, 2);
          }}
          className={`rounded-xl border-2 px-2 py-1 text-sm font-black ${
            seleccionada.grid === 2
              ? "border-purple-500 bg-purple-100 text-purple-700"
              : "border-purple-200 bg-white text-purple-400"
          }`}
        >
          2×2
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cambiarGridImagen(imagen.id, 3);
          }}
          className={`rounded-xl border-2 px-2 py-1 text-sm font-black ${
            seleccionada.grid === 3
              ? "border-pink-500 bg-pink-100 text-pink-700"
              : "border-pink-200 bg-white text-pink-400"
          }`}
        >
          3×3
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-extrabold text-purple-700">
          Imágenes del juego
        </h3>

        <div className="grid max-h-[360px] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-3">
          {IMAGENES_DISPONIBLES.map((imagen) => {
            const seleccionada = estaSeleccionada(imagen.id);

            return (
              <button
                key={imagen.id}
                type="button"
                onClick={() => alternarImagen(imagen)}
                className={`rounded-2xl border-4 bg-white p-3 text-center shadow transition hover:scale-105 ${
                  seleccionada ? "border-purple-500" : "border-purple-100"
                }`}
              >
                <img
                  src={imagen.src}
                  alt={imagen.nombre}
                  className="mx-auto h-24 w-full object-contain"
                />

                <p className="mt-2 font-extrabold text-purple-700">
                  {imagen.nombre}
                </p>

                {renderSelectorGrid(imagen)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-extrabold text-purple-700">
          Subir imágenes temporales
        </h3>

        <p className="mb-2 text-sm font-bold text-gray-500">
          Puedes subir hasta 5 imágenes temporales.
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={subirImagenesTemporales}
          className="w-full rounded-2xl border-4 border-dashed border-purple-300 bg-white p-4 text-purple-700"
        />

        {imagenesTemporales.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-3 font-extrabold text-purple-700">
              Previsualización de imágenes subidas
            </h4>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {imagenesTemporales.map((imagen) => (
                <div
                  key={imagen.id}
                  className="rounded-2xl border-4 border-yellow-300 bg-white p-3 text-center shadow"
                >
                  <img
                    src={imagen.src}
                    alt={imagen.nombre}
                    className="mx-auto h-24 w-full object-contain"
                  />

                  <p className="mt-2 truncate font-extrabold text-purple-700">
                    {imagen.nombre}
                  </p>

                  {renderSelectorGrid(imagen)}

                  <button
                    type="button"
                    onClick={() => quitarImagenTemporal(imagen.id)}
                    className="mt-3 rounded-full bg-red-400 px-4 py-2 text-sm font-bold text-white"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-center text-lg font-bold text-purple-700">
        Rondas: {imagenesSeleccionadas.length}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl border px-5 py-3 font-bold text-gray-600"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-xl bg-purple-600 px-5 py-3 font-bold text-white"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}