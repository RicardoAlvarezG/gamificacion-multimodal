"use client";

import { useState } from "react";

export type RondaEmocionesAccionPersonalizada = {
  id: string;
  imagen: string;
  respuestaCorrecta: string;
};

export type ConfiguracionEmocionesAccion = {
  rondas: RondaEmocionesAccionPersonalizada[];
};

type Props = {
  configuracionInicial?: ConfiguracionEmocionesAccion;
  onGuardar: (configuracion: ConfiguracionEmocionesAccion) => void;
  onCancelar: () => void;
};

const EMOCIONES = [
  "FELIZ",
  "TRISTE",
  "ENOJADO",
  "SORPRENDIDO",
  "ASUSTADO",
  "CANSADO",
];

export default function PersonalizarEmocionesAccion({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [rondas, setRondas] = useState<RondaEmocionesAccionPersonalizada[]>(
    configuracionInicial?.rondas ?? []
  );

  const agregarImagen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(event.target.files ?? []);
    const disponibles = 5 - rondas.length;

    if (disponibles <= 0) {
      alert("Solo puedes crear hasta 5 rondas.");
      event.target.value = "";
      return;
    }

    const archivosPermitidos = archivos.slice(0, disponibles);

    if (archivos.length > disponibles) {
      alert(`Solo se agregarán ${disponibles} imagen(es). El máximo es 5.`);
    }

    const nuevasRondas = archivosPermitidos.map((archivo, index) => ({
      id: `ronda-${Date.now()}-${index}`,
      imagen: URL.createObjectURL(archivo),
      respuestaCorrecta: "FELIZ",
    }));

    setRondas((prev) => [...prev, ...nuevasRondas]);
    event.target.value = "";
  };

  const cambiarRespuesta = (id: string, respuestaCorrecta: string) => {
    setRondas((prev) =>
      prev.map((ronda) =>
        ronda.id === id ? { ...ronda, respuestaCorrecta } : ronda
      )
    );
  };

  const quitarRonda = (id: string) => {
    setRondas((prev) => prev.filter((ronda) => ronda.id !== id));
  };

  const guardar = () => {
    if (rondas.length === 0) {
      alert("Sube al menos una imagen para crear una ronda.");
      return;
    }

    onGuardar({
      rondas,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-extrabold text-purple-700">
          Subir imágenes para las rondas
        </h3>

        <p className="mb-3 text-sm font-bold text-gray-500">
          Puedes crear máximo 5 rondas. Cada imagen será una ronda del juego.
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={agregarImagen}
          className="w-full rounded-2xl border-4 border-dashed border-purple-300 bg-white p-4 text-purple-700"
        />
      </div>

      {rondas.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-extrabold text-purple-700">
            Rondas personalizadas
          </h3>

          <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
            {rondas.map((ronda, index) => (
              <div
                key={ronda.id}
                className="rounded-3xl border-4 border-purple-200 bg-white p-4 shadow"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-lg font-extrabold text-purple-700">
                    Ronda {index + 1}
                  </h4>

                  <button
                    type="button"
                    onClick={() => quitarRonda(ronda.id)}
                    className="rounded-full bg-red-400 px-4 py-2 text-sm font-bold text-white"
                  >
                    Quitar
                  </button>
                </div>

                <img
                  src={ronda.imagen}
                  alt={`Ronda ${index + 1}`}
                  className="mx-auto mb-4 h-40 w-full rounded-2xl border-2 border-purple-100 object-contain"
                />

                <label className="mb-2 block font-extrabold text-gray-600">
                  Respuesta correcta
                </label>

                <select
                  value={ronda.respuestaCorrecta}
                  onChange={(e) => cambiarRespuesta(ronda.id, e.target.value)}
                  className="w-full rounded-2xl border-4 border-purple-200 bg-white p-3 font-bold text-purple-700 outline-none"
                >
                  {EMOCIONES.map((emocion) => (
                    <option key={emocion} value={emocion}>
                      {emocion}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-purple-50 p-4 text-center text-lg font-bold text-purple-700">
        Rondas: {rondas.length} / 5
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