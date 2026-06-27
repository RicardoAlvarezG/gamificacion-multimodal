"use client";

import { useState } from "react";

export type ConfiguracionDondeEstaOsito = {
  objeto: string;
  escenarios: string[];
};

type Props = {
  configuracionInicial?: ConfiguracionDondeEstaOsito;
  onGuardar: (configuracion: ConfiguracionDondeEstaOsito) => void;
  onCancelar: () => void;
};

const OBJETOS_DISPONIBLES = [
  { nombre: "OSITO", carpeta: "osito" },
  { nombre: "CONEJO", carpeta: "conejo" },
  { nombre: "GATO", carpeta: "gato" },
  { nombre: "TAZA", carpeta: "taza" },
  { nombre: "PELOTA", carpeta: "pelota" },
];

const ESCENARIOS_DISPONIBLES = [
  { nombre: "SOBRE LA CAMA", archivo: "sobrecama" },
  { nombre: "BAJO LA CAMA", archivo: "bajocama" },
  { nombre: "SOBRE LA MESA", archivo: "sobremesa" },
  { nombre: "BAJO LA MESA", archivo: "bajomesa" },
  { nombre: "SOBRE LA SILLA", archivo: "sobresilla" },
  { nombre: "BAJO LA SILLA", archivo: "bajosilla" },
];

export default function PersonalizarDondeEstaOsito({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<string>(
    configuracionInicial?.objeto || "osito"
  );

  const [escenariosSeleccionados, setEscenariosSeleccionados] = useState<
    string[]
  >(
    configuracionInicial?.escenarios || [
      "sobrecama",
      "bajocama",
      "sobremesa",
      "bajomesa",
      "sobresilla",
      "bajosilla",
    ]
  );

  const alternarEscenario = (archivo: string) => {
    if (escenariosSeleccionados.includes(archivo)) {
      if (escenariosSeleccionados.length === 1) return;

      setEscenariosSeleccionados(
        escenariosSeleccionados.filter((escenario) => escenario !== archivo)
      );
    } else {
      setEscenariosSeleccionados([...escenariosSeleccionados, archivo]);
    }
  };

  const guardar = () => {
    onGuardar({
      objeto: objetoSeleccionado,
      escenarios: escenariosSeleccionados,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-purple-700">
          Personalizar ¿Dónde está el Osito?
        </h3>
        <p className="text-sm text-gray-600">
          Elige el objeto y los escenarios que se trabajarán en esta sesión.
        </p>
      </div>

      <div>
        <p className="mb-2 font-bold text-slate-700">Objeto a encontrar</p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {OBJETOS_DISPONIBLES.map((objeto) => (
            <button
              key={objeto.carpeta}
              type="button"
              onClick={() => setObjetoSeleccionado(objeto.carpeta)}
              className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                objetoSeleccionado === objeto.carpeta
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              {objeto.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-bold text-slate-700">Escenarios</p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {ESCENARIOS_DISPONIBLES.map((escenario) => (
            <button
              key={escenario.archivo}
              type="button"
              onClick={() => alternarEscenario(escenario.archivo)}
              className={`rounded-2xl border-2 px-4 py-3 text-left font-bold transition ${
                escenariosSeleccionados.includes(escenario.archivo)
                  ? "border-purple-500 bg-purple-100 text-purple-700"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              {escenario.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-700">
        Se jugarán {escenariosSeleccionados.length} rondas, una por cada
        escenario seleccionado.
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