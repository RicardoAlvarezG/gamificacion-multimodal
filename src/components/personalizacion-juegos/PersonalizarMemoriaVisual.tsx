"use client";

import Image from "next/image";
import { useState } from "react";

export type ConfiguracionMemoriaVisual = {
  objetos: string[];
  cantidadTarjetas: 2 | 4 | 6 | 8;
  rondas: number;
};

type Props = {
  configuracionInicial?: ConfiguracionMemoriaVisual;
  onGuardar: (configuracion: ConfiguracionMemoriaVisual) => void;
  onCancelar: () => void;
};

const OBJETOS_DISPONIBLES = [
  { id: "abejita", nombre: "Abejita", imagen: "/juegos/memoria/abejita.webp" },
  { id: "barco", nombre: "Barco", imagen: "/juegos/memoria/barco.webp" },
  { id: "carrito", nombre: "Carrito", imagen: "/juegos/memoria/carrito.webp" },
  { id: "cuadrado", nombre: "Cuadrado", imagen: "/juegos/memoria/cuadrado.webp" },
  { id: "elefante", nombre: "Elefante", imagen: "/juegos/memoria/elefantepequeño.webp" },
  { id: "estrellita", nombre: "Estrellita", imagen: "/juegos/memoria/estrellita.webp" },
  { id: "gatito", nombre: "Gatito", imagen: "/juegos/memoria/gatito.webp" },
  { id: "manzana", nombre: "Manzana", imagen: "/juegos/memoria/manzana.webp" },
  { id: "mochila", nombre: "Mochila", imagen: "/juegos/memoria/mochila.webp" },
  { id: "osito", nombre: "Osito", imagen: "/juegos/memoria/osito.webp" },
  { id: "perrito", nombre: "Perrito", imagen: "/juegos/memoria/perrito.webp" },
  { id: "pollo", nombre: "Pollito", imagen: "/juegos/memoria/pollo.webp" },

  { id: "conejo", nombre: "Conejo", imagen: "/juegos/memoria/conejo.webp" },
  { id: "pato", nombre: "Pato", imagen: "/juegos/memoria/pato.webp" },
  { id: "vaca", nombre: "Vaca", imagen: "/juegos/memoria/vaca.webp" },
  { id: "cerdito", nombre: "Cerdito", imagen: "/juegos/memoria/cerdito.webp" },
  { id: "rana", nombre: "Rana", imagen: "/juegos/memoria/rana.webp" },
  { id: "tortuga", nombre: "Tortuga", imagen: "/juegos/memoria/tortuga.webp" },
  { id: "pez", nombre: "Pez", imagen: "/juegos/memoria/pez.webp" },
  { id: "mariposa", nombre: "Mariposa", imagen: "/juegos/memoria/mariposa.webp" },
  { id: "pelota", nombre: "Pelota", imagen: "/juegos/memoria/pelota.webp" },
  { id: "flor", nombre: "Flor", imagen: "/juegos/memoria/flor.webp" },
  { id: "arbol", nombre: "Árbol", imagen: "/juegos/memoria/arbol.webp" },
  { id: "sol", nombre: "Sol", imagen: "/juegos/memoria/sol.webp" },
  { id: "luna", nombre: "Luna", imagen: "/juegos/memoria/luna.webp" },
  { id: "nube", nombre: "Nube", imagen: "/juegos/memoria/nube.webp" },
  { id: "globo", nombre: "Globo", imagen: "/juegos/memoria/globo.webp" },
  { id: "lapiz", nombre: "Lápiz", imagen: "/juegos/memoria/lapiz.webp" },
  { id: "libro", nombre: "Libro", imagen: "/juegos/memoria/libro.webp" },
  { id: "casa", nombre: "Casa", imagen: "/juegos/memoria/casa.webp" },
  { id: "tren", nombre: "Tren", imagen: "/juegos/memoria/tren.webp" },
  { id: "avion", nombre: "Avión", imagen: "/juegos/memoria/avion.webp" },
];

export default function PersonalizarMemoriaVisual({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [objetos, setObjetos] = useState<string[]>(
    configuracionInicial?.objetos ?? [
      "abejita",
      "barco",
      "carrito",
      "osito",
      "perrito",
      "pollo",
    ]
  );

  const [cantidadTarjetas, setCantidadTarjetas] = useState<2 | 4 | 6 | 8>(
    configuracionInicial?.cantidadTarjetas ?? 6
  );

  const [rondas, setRondas] = useState(configuracionInicial?.rondas ?? 4);

  const alternarObjeto = (id: string) => {
    setObjetos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((objeto) => objeto !== id)
        : [...actuales, id]
    );
  };

  const guardar = () => {
    if (objetos.length < 2) {
      alert("Selecciona al menos dos objetos.");
      return;
    }

    onGuardar({
      objetos,
      cantidadTarjetas,
      rondas,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-lg font-black text-purple-700">
          Objetos del juego
        </h3>

        <p className="mb-5 text-sm font-semibold text-slate-500">
          Selecciona los objetos que aparecerán durante el juego.
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {OBJETOS_DISPONIBLES.map((objeto) => {
            const seleccionado = objetos.includes(objeto.id);

            return (
              <button
                key={objeto.id}
                type="button"
                onClick={() => alternarObjeto(objeto.id)}
                className={`rounded-3xl border-2 p-4 transition ${
                  seleccionado
                    ? "border-pink-400 bg-pink-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="flex justify-center">
                  <Image
                    src={objeto.imagen}
                    alt={objeto.nombre}
                    width={76}
                    height={76}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                <p className="mt-3 text-center text-sm font-black text-slate-700">
                  {objeto.nombre}
                </p>

                {seleccionado && (
                  <p className="mt-1 text-center text-xs font-black text-pink-600">
                    ✓ Seleccionado
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Cantidad de tarjetas
        </h3>

        <div className="grid grid-cols-4 gap-4">
          {[2, 4, 6, 8].map((cantidad) => (
            <button
              key={cantidad}
              type="button"
              onClick={() =>
                setCantidadTarjetas(cantidad as 2 | 4 | 6 | 8)
              }
              className={`rounded-2xl py-4 text-xl font-black transition ${
                cantidadTarjetas === cantidad
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-purple-100"
              }`}
            >
              {cantidad}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Número de rondas
        </h3>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setRondas((r) => Math.max(1, r - 1))}
            className="h-12 w-12 rounded-full bg-pink-100 text-2xl font-black text-pink-600"
          >
            −
          </button>

          <span className="w-10 text-center text-3xl font-black text-purple-700">
            {rondas}
          </span>

          <button
            type="button"
            onClick={() => setRondas((r) => Math.min(10, r + 1))}
            className="h-12 w-12 rounded-full bg-pink-100 text-2xl font-black text-pink-600"
          >
            +
          </button>

          <span className="text-sm font-semibold text-slate-500">
            Máximo 10 rondas
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-full bg-slate-200 px-6 py-2 font-bold text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={guardar}
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-black text-white shadow-md hover:scale-105"
        >
          Guardar personalización
        </button>
      </div>
    </div>
  );
}