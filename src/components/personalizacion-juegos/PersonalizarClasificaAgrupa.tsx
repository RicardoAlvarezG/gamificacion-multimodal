"use client";

import { useState } from "react";

export type ConfiguracionClasificaAgrupa = {
  categorias: ("COLOR" | "FORMA" | "TAMANO")[];
  colores: string[];
  formas: string[];
  objetosTamano: string[];
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionClasificaAgrupa;
  onGuardar: (configuracion: ConfiguracionClasificaAgrupa) => void;
  onCancelar: () => void;
};

const CATEGORIAS_DISPONIBLES = [
  { codigo: "COLOR", nombre: "Color" },
  { codigo: "FORMA", nombre: "Forma" },
  { codigo: "TAMANO", nombre: "Tamaño" },
] as const;

const COLORES_DISPONIBLES = [
  "ROJO",
  "AZUL",
  "VERDE",
  "NARANJA",
  "AMARILLO",
  "MORADO",
  "ROSADO",
];

const FORMAS_DISPONIBLES = [
  "CIRCULO",
  "CUADRADO",
  "TRIANGULO",
  "RECTANGULO",
  "ROMBO",
  "OVALO",
  "ESTRELLA",
  "PENTAGONO",
  "HEXAGONO",
  "OCTOGONO",
];

const OBJETOS_TAMANO_DISPONIBLES = [
  "BARCO",
  "CARRO",
  "MANZANA",
  "OSO",
  "PELOTA",
  "CASA",
  "LIBRO",
  "ARBOL",
  "FLOR",
  "LAPIZ",
];

export default function PersonalizarClasificaAgrupa({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [categorias, setCategorias] = useState<
    ConfiguracionClasificaAgrupa["categorias"]
  >(
    configuracionInicial?.categorias || ["COLOR", "FORMA", "TAMANO"]
  );

  const [colores, setColores] = useState<string[]>(
    configuracionInicial?.colores || ["ROJO", "AZUL", "VERDE", "NARANJA"]
  );

  const [formas, setFormas] = useState<string[]>(
    configuracionInicial?.formas || [
      "CIRCULO",
      "CUADRADO",
      "TRIANGULO",
      "RECTANGULO",
    ]
  );

  const [objetosTamano, setObjetosTamano] = useState<string[]>(
    configuracionInicial?.objetosTamano || [
      "BARCO",
      "CARRO",
      "MANZANA",
      "OSO",
      "PELOTA",
    ]
  );

  const toggleCategoria = (
    categoria: ConfiguracionClasificaAgrupa["categorias"][number]
  ) => {
    setCategorias((actuales) =>
      actuales.includes(categoria)
        ? actuales.filter((item) => item !== categoria)
        : [...actuales, categoria]
    );
  };

  const toggleValor = (
    valor: string,
    lista: string[],
    setLista: (valores: string[]) => void
  ) => {
    setLista(
      lista.includes(valor)
        ? lista.filter((item) => item !== valor)
        : [...lista, valor]
    );
  };

  const guardar = () => {
    if (categorias.length === 0) {
      alert("Debe seleccionar al menos una categoría.");
      return;
    }

    if (categorias.includes("COLOR") && colores.length < 2) {
      alert("Debe seleccionar al menos 2 colores.");
      return;
    }

    if (categorias.includes("FORMA") && formas.length < 2) {
      alert("Debe seleccionar al menos 2 formas.");
      return;
    }

    if (categorias.includes("TAMANO") && objetosTamano.length < 2) {
      alert("Debe seleccionar al menos 2 objetos para tamaño.");
      return;
    }

    onGuardar({
      categorias,
      colores,
      formas,
      objetosTamano,
      rondas: categorias.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-purple-700 mb-3">
          Categorías a trabajar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CATEGORIAS_DISPONIBLES.map((categoria) => (
            <button
              key={categoria.codigo}
              type="button"
              onClick={() => toggleCategoria(categoria.codigo)}
              className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                categorias.includes(categoria.codigo)
                  ? "bg-purple-500 text-white border-purple-600"
                  : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      {categorias.includes("COLOR") && (
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3">
            Colores
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COLORES_DISPONIBLES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleValor(color, colores, setColores)}
                className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                  colores.includes(color)
                    ? "bg-pink-500 text-white border-pink-600"
                    : "bg-white text-pink-700 border-pink-200 hover:bg-pink-50"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {categorias.includes("FORMA") && (
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3">
            Formas
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FORMAS_DISPONIBLES.map((forma) => (
              <button
                key={forma}
                type="button"
                onClick={() => toggleValor(forma, formas, setFormas)}
                className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                  formas.includes(forma)
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {forma}
              </button>
            ))}
          </div>
        </div>
      )}

      {categorias.includes("TAMANO") && (
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3">
            Objetos para tamaño
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OBJETOS_TAMANO_DISPONIBLES.map((objeto) => (
              <button
                key={objeto}
                type="button"
                onClick={() =>
                  toggleValor(objeto, objetosTamano, setObjetosTamano)
                }
                className={`rounded-2xl border-2 px-4 py-3 font-bold transition ${
                  objetosTamano.includes(objeto)
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-white text-green-700 border-green-200 hover:bg-green-50"
                }`}
              >
                {objeto}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm font-semibold text-yellow-800">
        Las rondas se calcularán automáticamente según la cantidad de categorías seleccionadas.
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-5 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}