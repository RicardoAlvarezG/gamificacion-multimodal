"use client";

import { useState } from "react";

type Ubicacion = "arriba" | "abajo";

export type RondaPersonalizadaDondeEstaOsito = {
  titulo: string;
  imagen: string;
  respuesta: Ubicacion;
};

export type ConfiguracionDondeEstaOsito = {
  rondasPersonalizadas?: RondaPersonalizadaDondeEstaOsito[];
};

type Props = {
  configuracionInicial?: ConfiguracionDondeEstaOsito;
  onGuardar: (configuracion: ConfiguracionDondeEstaOsito) => void;
  onCancelar: () => void;
};

const MAX_RONDAS = 6;

export default function PersonalizarDondeEstaOsito({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const rondasIniciales =
    configuracionInicial?.rondasPersonalizadas &&
    configuracionInicial.rondasPersonalizadas.length > 0
      ? configuracionInicial.rondasPersonalizadas
      : [
          {
            titulo: "¿Dónde está?",
            imagen: "",
            respuesta: "arriba" as Ubicacion,
          },
        ];

  const [numeroRondas, setNumeroRondas] = useState(rondasIniciales.length);
  const [rondas, setRondas] = useState<RondaPersonalizadaDondeEstaOsito[]>(
    rondasIniciales
  );

  const cambiarNumeroRondas = (cantidad: number) => {
    setNumeroRondas(cantidad);

    setRondas((prev) => {
      const nuevas = [...prev];

      while (nuevas.length < cantidad) {
        nuevas.push({
          titulo: "¿Dónde está?",
          imagen: "",
          respuesta: "arriba",
        });
      }

      return nuevas.slice(0, cantidad);
    });
  };

  const actualizarRonda = (
    index: number,
    campo: keyof RondaPersonalizadaDondeEstaOsito,
    valor: string
  ) => {
    setRondas((prev) =>
      prev.map((ronda, i) =>
        i === index ? { ...ronda, [campo]: valor } : ronda
      )
    );
  };

  const subirImagen = (index: number, archivo?: File) => {
    if (!archivo) return;

    const urlTemporal = URL.createObjectURL(archivo);
    actualizarRonda(index, "imagen", urlTemporal);
  };

  const guardar = () => {
    const rondasValidas = rondas.slice(0, numeroRondas);

    const faltaImagen = rondasValidas.some((ronda) => !ronda.imagen);

    if (faltaImagen) {
      alert("Debes subir una imagen para cada ronda.");
      return;
    }

    onGuardar({
      rondasPersonalizadas: rondasValidas,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-purple-700">
          Personalizar ¿Dónde está el Osito?
        </h3>
        <p className="text-sm text-gray-600">
          Elige el número de rondas y sube una imagen para cada una. Esta
          configuración solo se usará durante esta sesión.
        </p>
      </div>

      <div>
        <p className="mb-2 font-bold text-slate-700">
          Número de rondas máximo 6
        </p>

        <select
          value={numeroRondas}
          onChange={(e) => cambiarNumeroRondas(Number(e.target.value))}
          className="w-full rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 font-bold text-purple-700 outline-none"
        >
          {Array.from({ length: MAX_RONDAS }, (_, i) => i + 1).map((numero) => (
            <option key={numero} value={numero}>
              {numero} ronda{numero > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {rondas.slice(0, numeroRondas).map((ronda, index) => (
          <div
            key={index}
            className="rounded-3xl border-2 border-purple-200 bg-purple-50 p-4"
          >
            <h4 className="mb-3 font-bold text-purple-700">
              Ronda {index + 1}
            </h4>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-bold text-slate-700">
                  Título de la ronda
                </p>
                <input
                  type="text"
                  value={ronda.titulo}
                  onChange={(e) =>
                    actualizarRonda(index, "titulo", e.target.value)
                  }
                  className="w-full rounded-xl border-2 border-purple-100 px-4 py-2 font-bold outline-none"
                  placeholder="Ejemplo: ¿Dónde está la pelota?"
                />
              </div>

              <div>
                <p className="mb-1 text-sm font-bold text-slate-700">
                  Imagen de la ronda
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => subirImagen(index, e.target.files?.[0])}
                  className="w-full rounded-xl bg-white px-4 py-2 font-bold text-slate-700"
                />

                {ronda.imagen && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={ronda.imagen}
                      alt={`Ronda ${index + 1}`}
                      className="h-40 w-full rounded-2xl object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  Respuesta correcta
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      actualizarRonda(index, "respuesta", "arriba")
                    }
                    className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                      ronda.respuesta === "arriba"
                        ? "border-purple-500 bg-purple-200 text-purple-800"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    Arriba
                  </button>

                  <button
                    type="button"
                    onClick={() => actualizarRonda(index, "respuesta", "abajo")}
                    className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                      ronda.respuesta === "abajo"
                        ? "border-purple-500 bg-purple-200 text-purple-800"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    Abajo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-purple-100 p-4 text-sm font-bold text-purple-700">
        Las imágenes subidas son temporales. No se guardarán en la base de datos
        ni en el proyecto.
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl bg-gray-200 px-4 py-2 font-bold text-gray-700"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}