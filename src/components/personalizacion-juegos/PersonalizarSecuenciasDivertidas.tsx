"use client";

import { useState } from "react";

export type RondaPersonalizadaSecuencia = {
  titulo: string;
  imagen1: string;
  imagen2: string;
};

export type ConfiguracionSecuenciasDivertidas = {
  rondas: number;
  rondasPersonalizadas?: RondaPersonalizadaSecuencia[];
};

type Props = {
  configuracionInicial?: ConfiguracionSecuenciasDivertidas;
  onGuardar: (configuracion: ConfiguracionSecuenciasDivertidas) => void;
  onCancelar: () => void;
};

const MAX_RONDAS = 6;

const crearRondaVacia = (): RondaPersonalizadaSecuencia => ({
  titulo: "Observa la secuencia y elige qué imagen sigue",
  imagen1: "",
  imagen2: "",
});

export default function PersonalizarSecuenciasDivertidas({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const rondasIniciales =
    configuracionInicial?.rondasPersonalizadas &&
    configuracionInicial.rondasPersonalizadas.length > 0
      ? configuracionInicial.rondasPersonalizadas
      : [crearRondaVacia()];

  const [numeroRondas, setNumeroRondas] = useState(
    configuracionInicial?.rondas ?? rondasIniciales.length
  );

  const [rondasPersonalizadas, setRondasPersonalizadas] =
    useState<RondaPersonalizadaSecuencia[]>(rondasIniciales);

  const cambiarNumeroRondas = (cantidad: number) => {
    setNumeroRondas(cantidad);

    setRondasPersonalizadas((actuales) => {
      const nuevas = [...actuales];

      while (nuevas.length < cantidad) {
        nuevas.push(crearRondaVacia());
      }

      return nuevas.slice(0, cantidad);
    });
  };

  const actualizarTitulo = (index: number, titulo: string) => {
    setRondasPersonalizadas((actuales) =>
      actuales.map((ronda, i) =>
        i === index ? { ...ronda, titulo } : ronda
      )
    );
  };

  const subirImagen = (
    index: number,
    campo: "imagen1" | "imagen2",
    archivo?: File
  ) => {
    if (!archivo) return;

    const urlTemporal = URL.createObjectURL(archivo);

    setRondasPersonalizadas((actuales) =>
      actuales.map((ronda, i) =>
        i === index ? { ...ronda, [campo]: urlTemporal } : ronda
      )
    );
  };

  const guardar = () => {
    const rondasValidas = rondasPersonalizadas.slice(0, numeroRondas);

    const faltaImagen = rondasValidas.some(
      (ronda) => !ronda.imagen1 || !ronda.imagen2
    );

    if (faltaImagen) {
      alert("Debes subir las dos imágenes en cada ronda.");
      return;
    }

    onGuardar({
      rondas: numeroRondas,
      rondasPersonalizadas: rondasValidas,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-extrabold text-purple-700">
          Personalizar Secuencias Divertidas
        </h3>

        <p className="text-sm font-semibold text-gray-600">
          Elige el número de rondas. En cada ronda sube dos imágenes para
          formar la secuencia.
        </p>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700">
          Número de rondas
        </label>

        <select
          value={numeroRondas}
          onChange={(e) => cambiarNumeroRondas(Number(e.target.value))}
          className="mt-2 w-full rounded-2xl border border-purple-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-purple-300"
        >
          {Array.from({ length: MAX_RONDAS }, (_, index) => index + 1).map(
            (numero) => (
              <option key={numero} value={numero}>
                {numero} ronda{numero > 1 ? "s" : ""}
              </option>
            )
          )}
        </select>
      </div>

      <div className="max-h-[480px] space-y-4 overflow-y-auto pr-2">
        {rondasPersonalizadas.slice(0, numeroRondas).map((ronda, index) => (
          <div
            key={index}
            className="rounded-3xl border-2 border-purple-100 bg-purple-50 p-4"
          >
            <h4 className="mb-3 text-base font-extrabold text-purple-700">
              Ronda {index + 1}
            </h4>

            <label className="mb-1 block text-xs font-bold text-gray-600">
              Título de la ronda
            </label>

            <input
              type="text"
              value={ronda.titulo}
              onChange={(e) => actualizarTitulo(index, e.target.value)}
              className="mb-4 w-full rounded-xl border-2 border-purple-100 px-3 py-2 text-sm font-bold outline-none"
              placeholder="Ejemplo: Observa la secuencia"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-gray-600">
                  Imagen 1
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    subirImagen(index, "imagen1", e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700"
                />

                {ronda.imagen1 && (
                  <img
                    src={ronda.imagen1}
                    alt={`Imagen 1 ronda ${index + 1}`}
                    className="mt-3 h-32 w-full rounded-2xl bg-white object-contain p-2"
                  />
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-gray-600">
                  Imagen 2
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    subirImagen(index, "imagen2", e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-700"
                />

                {ronda.imagen2 && (
                  <img
                    src={ronda.imagen2}
                    alt={`Imagen 2 ronda ${index + 1}`}
                    className="mt-3 h-32 w-full rounded-2xl bg-white object-contain p-2"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-600"
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