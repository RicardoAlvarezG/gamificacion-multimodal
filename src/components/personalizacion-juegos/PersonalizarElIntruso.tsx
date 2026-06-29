"use client";

import { useState } from "react";

export type ImagenElIntrusoPersonalizada = {
  id: string;
  src: string;
  nombre: string;
};

export type RondaElIntrusoPersonalizada = {
  id: string;
  nombreGrupo: string;
  imagenes: ImagenElIntrusoPersonalizada[];
};

export type ConfiguracionElIntruso = {
  rondas: RondaElIntrusoPersonalizada[];
};

type Props = {
  configuracionInicial?: ConfiguracionElIntruso;
  onGuardar: (configuracion: ConfiguracionElIntruso) => void;
  onCancelar: () => void;
};

const crearRondaVacia = (index: number): RondaElIntrusoPersonalizada => ({
  id: `ronda-${Date.now()}-${index}`,
  nombreGrupo: "",
  imagenes: [],
});

export default function PersonalizarElIntruso({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [cantidadRondas, setCantidadRondas] = useState(
    configuracionInicial?.rondas.length ?? 1
  );

  const [rondas, setRondas] = useState<RondaElIntrusoPersonalizada[]>(
    configuracionInicial?.rondas ?? [crearRondaVacia(0)]
  );

  const cambiarCantidadRondas = (cantidad: number) => {
    setCantidadRondas(cantidad);

    setRondas((prev) => {
      if (cantidad > prev.length) {
        const nuevas = Array.from(
          { length: cantidad - prev.length },
          (_, index) => crearRondaVacia(prev.length + index)
        );

        return [...prev, ...nuevas];
      }

      return prev.slice(0, cantidad);
    });
  };

  const cambiarNombreGrupo = (id: string, nombreGrupo: string) => {
    setRondas((prev) =>
      prev.map((ronda) =>
        ronda.id === id ? { ...ronda, nombreGrupo } : ronda
      )
    );
  };

  const subirImagenesRonda = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivos = Array.from(event.target.files ?? []);
    const ronda = rondas.find((item) => item.id === id);

    if (!ronda) return;

    const disponibles = 4 - ronda.imagenes.length;

    if (disponibles <= 0) {
      alert("Cada ronda solo puede tener 4 imágenes.");
      event.target.value = "";
      return;
    }

    const archivosPermitidos = archivos.slice(0, disponibles);

    if (archivos.length > disponibles) {
      alert(`Solo se agregarán ${disponibles} imagen(es). Cada ronda necesita 4.`);
    }

    const nuevasImagenes: ImagenElIntrusoPersonalizada[] =
      archivosPermitidos.map((archivo, index) => ({
        id: `img-${Date.now()}-${index}`,
        src: URL.createObjectURL(archivo),
        nombre: archivo.name.replace(/\.[^/.]+$/, ""),
      }));

    setRondas((prev) =>
      prev.map((ronda) =>
        ronda.id === id
          ? { ...ronda, imagenes: [...ronda.imagenes, ...nuevasImagenes] }
          : ronda
      )
    );

    event.target.value = "";
  };

  const quitarImagen = (rondaId: string, imagenId: string) => {
    setRondas((prev) =>
      prev.map((ronda) =>
        ronda.id === rondaId
          ? {
              ...ronda,
              imagenes: ronda.imagenes.filter((img) => img.id !== imagenId),
            }
          : ronda
      )
    );
  };

  const guardar = () => {
    for (let i = 0; i < rondas.length; i++) {
      const ronda = rondas[i];

      if (!ronda.nombreGrupo.trim()) {
        alert(`Escribe el nombre del grupo en la ronda ${i + 1}.`);
        return;
      }

      if (ronda.imagenes.length !== 4) {
        alert(`La ronda ${i + 1} debe tener exactamente 4 imágenes.`);
        return;
      }
    }

    onGuardar({
      rondas: rondas.map((ronda) => ({
        ...ronda,
        nombreGrupo: ronda.nombreGrupo.trim(),
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-extrabold text-purple-700">
          Número de rondas
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((cantidad) => (
            <button
              key={cantidad}
              type="button"
              onClick={() => cambiarCantidadRondas(cantidad)}
              className={`rounded-2xl border-4 px-4 py-4 text-xl font-extrabold transition ${
                cantidadRondas === cantidad
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : "border-purple-200 bg-white text-purple-400"
              }`}
            >
              {cantidad}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[520px] space-y-5 overflow-y-auto pr-2">
        {rondas.map((ronda, index) => (
          <div
            key={ronda.id}
            className="rounded-3xl border-4 border-purple-200 bg-white p-5 shadow"
          >
            <h4 className="mb-4 text-xl font-extrabold text-purple-700">
              Ronda {index + 1}
            </h4>

            <label className="mb-2 block font-extrabold text-gray-600">
              Nombre del grupo
            </label>

            <input
              value={ronda.nombreGrupo}
              onChange={(e) => cambiarNombreGrupo(ronda.id, e.target.value)}
              placeholder="Ejemplo: Animales"
              className="mb-4 w-full rounded-2xl border-4 border-purple-200 bg-white p-3 font-bold text-purple-700 outline-none"
            />

            <label className="mb-2 block font-extrabold text-gray-600">
              Sube 4 imágenes del grupo
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => subirImagenesRonda(ronda.id, e)}
              className="w-full rounded-2xl border-4 border-dashed border-purple-300 bg-purple-50 p-4 text-purple-700"
            />

            <p className="mt-2 text-sm font-bold text-gray-500">
              Imágenes: {ronda.imagenes.length} / 4
            </p>

            {ronda.imagenes.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {ronda.imagenes.map((imagen) => (
                  <div
                    key={imagen.id}
                    className="rounded-2xl border-4 border-yellow-300 bg-white p-3 text-center shadow"
                  >
                    <img
                      src={imagen.src}
                      alt={imagen.nombre}
                      className="mx-auto h-24 w-full object-contain"
                    />

                    <p className="mt-2 truncate text-sm font-extrabold text-purple-700">
                      {imagen.nombre}
                    </p>

                    <button
                      type="button"
                      onClick={() => quitarImagen(ronda.id, imagen.id)}
                      className="mt-2 rounded-full bg-red-400 px-3 py-1 text-xs font-bold text-white"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-center text-lg font-bold text-purple-700">
        Rondas configuradas: {rondas.length} / 3
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