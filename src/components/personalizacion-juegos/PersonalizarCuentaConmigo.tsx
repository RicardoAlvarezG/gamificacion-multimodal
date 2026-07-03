"use client";

import { useMemo, useState } from "react";

export type ImagenNumeroCuenta = {
  id: string;
  numero: number;
  titulo: string;
  imagen: string;
};

export type ConfiguracionCuentaConmigo = {
  numeros: number[];
  imagenes: string[];
  rondas: number;
  imagenesPorNumero?: ImagenNumeroCuenta[];
};

type Props = {
  configuracionInicial?: ConfiguracionCuentaConmigo;
  onGuardar: (configuracion: ConfiguracionCuentaConmigo) => void;
  onCancelar: () => void;
};

const NUMEROS_DISPONIBLES = [1, 2, 3, 4, 5];

export default function PersonalizarCuentaConmigo({
  configuracionInicial,
  onGuardar,
  onCancelar,
}: Props) {
  const [numerosSeleccionados, setNumerosSeleccionados] = useState<number[]>(
    configuracionInicial?.numeros ?? []
  );

  const [imagenesPorNumero, setImagenesPorNumero] = useState<
    ImagenNumeroCuenta[]
  >(configuracionInicial?.imagenesPorNumero ?? []);

  const totalRondas = useMemo(() => {
    return imagenesPorNumero.filter((item) =>
      numerosSeleccionados.includes(item.numero)
    ).length;
  }, [imagenesPorNumero, numerosSeleccionados]);

  const alternarNumero = (numero: number) => {
    setNumerosSeleccionados((actual) => {
      if (actual.includes(numero)) {
        setImagenesPorNumero((imagenes) =>
          imagenes.filter((item) => item.numero !== numero)
        );

        return actual.filter((item) => item !== numero);
      }

      return [...actual, numero];
    });
  };

  const subirImagen = (numero: number, archivo?: File) => {
    if (!archivo) return;

    const nuevaImagen: ImagenNumeroCuenta = {
      id: `numero-${numero}-${Date.now()}-${Math.random()}`,
      numero,
      titulo: `¿Cuántos objetos hay?`,
      imagen: URL.createObjectURL(archivo),
    };

    setImagenesPorNumero((actual) => [...actual, nuevaImagen]);
  };

  const actualizarTitulo = (id: string, titulo: string) => {
    setImagenesPorNumero((actual) =>
      actual.map((item) =>
        item.id === id ? { ...item, titulo } : item
      )
    );
  };

  const eliminarImagen = (id: string) => {
    setImagenesPorNumero((actual) =>
      actual.filter((item) => item.id !== id)
    );
  };

  const guardar = () => {
    if (numerosSeleccionados.length === 0) {
      alert("Selecciona al menos un número.");
      return;
    }

    const imagenesValidas = imagenesPorNumero.filter((item) =>
      numerosSeleccionados.includes(item.numero)
    );

    if (imagenesValidas.length === 0) {
      alert("Sube al menos una imagen.");
      return;
    }

    const numeroSinImagen = numerosSeleccionados.some(
      (numero) => !imagenesValidas.some((item) => item.numero === numero)
    );

    if (numeroSinImagen) {
      alert("Cada número seleccionado debe tener al menos una imagen.");
      return;
    }

    if (imagenesValidas.some((item) => item.titulo.trim() === "")) {
      alert("Todas las imágenes deben tener un título.");
      return;
    }

    onGuardar({
      numeros: numerosSeleccionados,
      imagenes: [],
      imagenesPorNumero: imagenesValidas,
      rondas: imagenesValidas.length,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-black text-purple-700">
          Elige los números a trabajar
        </h3>

        <div className="grid grid-cols-5 gap-3">
          {NUMEROS_DISPONIBLES.map((numero) => {
            const activo = numerosSeleccionados.includes(numero);

            return (
              <button
                key={numero}
                type="button"
                onClick={() => alternarNumero(numero)}
                className={`rounded-2xl border-2 px-4 py-3 text-3xl font-black transition ${
                  activo
                    ? "border-purple-500 bg-purple-100 text-purple-700"
                    : "border-purple-200 bg-white text-purple-400 hover:bg-purple-50"
                }`}
              >
                {numero}
              </button>
            );
          })}
        </div>
      </div>

      {numerosSeleccionados.length > 0 && (
        <div className="max-h-[440px] space-y-4 overflow-y-auto pr-2">
          {numerosSeleccionados.map((numero) => {
            const imagenesDelNumero = imagenesPorNumero.filter(
              (item) => item.numero === numero
            );

            return (
              <div
                key={numero}
                className="rounded-3xl border-2 border-purple-100 bg-purple-50 p-4"
              >
                <h4 className="mb-3 text-base font-black text-purple-700">
                  Número {numero}
                </h4>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    subirImagen(numero, e.target.files?.[0]);
                    e.currentTarget.value = "";
                  }}
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-slate-700"
                />

                {imagenesDelNumero.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {imagenesDelNumero.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <p className="mb-2 text-sm font-black text-purple-700">
                          Imagen {index + 1}
                        </p>

                        <div className="grid grid-cols-[90px_1fr] gap-3">
                          <img
                            src={item.imagen}
                            alt={item.titulo}
                            className="h-24 w-24 rounded-2xl bg-purple-50 object-contain p-2"
                          />

                          <div>
                            <label className="mb-1 block text-xs font-bold text-gray-600">
                              Título de la pregunta
                            </label>

                            <input
                              type="text"
                              value={item.titulo}
                              onChange={(e) =>
                                actualizarTitulo(item.id, e.target.value)
                              }
                              className="w-full rounded-xl border-2 border-purple-100 px-3 py-2 text-sm font-bold outline-none"
                              placeholder={`Ejemplo: ¿Cuántos conejos hay?`}
                            />

                            <button
                              type="button"
                              onClick={() => eliminarImagen(item.id)}
                              className="mt-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-200"
                            >
                              Eliminar imagen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-xs font-bold text-gray-600">
                  Las imágenes de esta sección se repetirán {numero} vez
                  {numero > 1 ? "es" : ""} en el juego.
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
        Rondas del juego: {totalRondas}
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