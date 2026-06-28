"use client";

import { useMemo, useState } from "react";

export type ConfiguracionVocalesPerdidas = {
  vocales: string[];
  imagenes: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionVocalesPerdidas;
  onGuardar: (configuracion: ConfiguracionVocalesPerdidas) => void;
  onCancelar: () => void;
};

const IMAGENES_POR_VOCAL = {
  A: [
    "abeja",
    "aguacate",
    "anillo",
    "arana",
    "arbol",
    "arco",
    "arcoiris",
    "ardilla",
    "arena",
    "arroz",
    "ambulancia",
    "avion",
    "avioneta",
  ],
  E: [
    "elefante",
    "escalera",
    "escoba",
    "escudo",
    "escuela",
    "escritorio",
    "espejo",
    "esponja",
    "estrella",
    "estufa",
    "erizo",
    "ensalada",
    "enchufe",
  ],
  I: [
    "iglesia",
    "iguana",
    "iglu",
    "iceberg",
    "iman",
    "isla",
    "insecto",
    "incendio",
    "impresora",
    "instrumento",
    "impermeable",
    "inyeccion",
    "invierno",
  ],
  O: [
    "ojo",
    "oso",
    "oveja",
    "oceano",
    "ocho",
    "olla",
    "olivo",
    "ombligo",
    "oreja",
    "oruga",
    "orquesta",
    "orquidea",
    "ovni",
  ],
  U: [
    "ukelele",
    "unicornio",
    "uva",
    "uniforme",
    "uno",
    "urna",
    "universo",
    "utensilios",
    "uña",
    "uniforme_escolar",
    "unicornio_bebe",
    "uvas",
    "ufo",
  ],
} as const;

const VOCALES = ["A", "E", "I", "O", "U"] as const;

type Vocal = (typeof VOCALES)[number];

const nombreBonito = (texto: string) =>
  texto
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());

export default function PersonalizarVocalesPerdidas({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [vocalesSeleccionadas, setVocalesSeleccionadas] = useState<string[]>(
    configuracionInicial?.vocales ?? []
  );

  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<string[]>(
    configuracionInicial?.imagenes ?? []
  );

  const imagenesDisponibles = useMemo(() => {
    return vocalesSeleccionadas.flatMap((vocal) =>
      IMAGENES_POR_VOCAL[vocal as Vocal].map((imagen) => ({
        vocal,
        imagen,
      }))
    );
  }, [vocalesSeleccionadas]);

  const alternarVocal = (vocal: Vocal) => {
    const existe = vocalesSeleccionadas.includes(vocal);

    if (existe) {
      setVocalesSeleccionadas((actual) =>
        actual.filter((item) => item !== vocal)
      );

      setImagenesSeleccionadas((actual) =>
        actual.filter(
          (imagen) => !IMAGENES_POR_VOCAL[vocal].includes(imagen as never)
        )
      );
      return;
    }

    setVocalesSeleccionadas((actual) => [...actual, vocal]);
  };

  const alternarImagen = (imagen: string) => {
    setImagenesSeleccionadas((actual) =>
      actual.includes(imagen)
        ? actual.filter((item) => item !== imagen)
        : [...actual, imagen]
    );
  };

  const guardar = () => {
    if (vocalesSeleccionadas.length === 0) {
      alert("Selecciona al menos una vocal.");
      return;
    }

    if (imagenesSeleccionadas.length === 0) {
      alert("Selecciona al menos una imagen.");
      return;
    }

    onGuardar({
      vocales: vocalesSeleccionadas,
      imagenes: imagenesSeleccionadas,
      rondas: imagenesSeleccionadas.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige las vocales
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {VOCALES.map((vocal) => {
            const activo = vocalesSeleccionadas.includes(vocal);

            return (
              <button
                key={vocal}
                type="button"
                onClick={() => alternarVocal(vocal)}
                className={`rounded-2xl border-2 px-4 py-3 text-2xl font-black transition ${
                  activo
                    ? "border-purple-500 bg-purple-100 text-purple-700"
                    : "border-purple-200 bg-white text-purple-400 hover:bg-purple-50"
                }`}
              >
                {vocal}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige las imágenes
        </h3>

        {vocalesSeleccionadas.length === 0 ? (
          <p className="rounded-2xl bg-purple-50 p-4 text-sm font-semibold text-purple-500">
            Primero selecciona una vocal para ver sus imágenes.
          </p>
        ) : (
          <div className="max-h-[360px] space-y-5 overflow-y-auto pr-2">
            {vocalesSeleccionadas.map((vocal) => (
              <div key={vocal}>
                <h4 className="mb-2 text-base font-black text-purple-600">
                  Vocal {vocal}
                </h4>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {imagenesDisponibles
                    .filter((item) => item.vocal === vocal)
                    .map(({ imagen }) => {
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
                            src={`/juegos/vocales/${imagen}.webp`}
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
            ))}
          </div>
        )}
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