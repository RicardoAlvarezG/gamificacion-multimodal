"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConfiguracionMemoriaVisual } from "../personalizacion-juegos/PersonalizarMemoriaVisual";

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionMemoriaVisual;
};

type ImagenMemoria = {
  nombre: string;
  imagen: string;
};

type Tarjeta = ImagenMemoria & {
  id: string;
};

const IMAGENES_DISPONIBLES: ImagenMemoria[] = [
  { nombre: "abejita", imagen: "/juegos/memoria/abejita.webp" },
  { nombre: "barco", imagen: "/juegos/memoria/barco.webp" },
  { nombre: "carrito", imagen: "/juegos/memoria/carrito.webp" },
  { nombre: "cuadrado", imagen: "/juegos/memoria/cuadrado.webp" },
  { nombre: "elefante", imagen: "/juegos/memoria/elefantepequeño.webp" },
  { nombre: "estrellita", imagen: "/juegos/memoria/estrellita.webp" },
  { nombre: "gatito", imagen: "/juegos/memoria/gatito.webp" },
  { nombre: "manzana", imagen: "/juegos/memoria/manzana.webp" },
  { nombre: "mochila", imagen: "/juegos/memoria/mochila.webp" },
  { nombre: "osito", imagen: "/juegos/memoria/osito.webp" },
  { nombre: "perrito", imagen: "/juegos/memoria/perrito.webp" },
  { nombre: "pollo", imagen: "/juegos/memoria/pollo.webp" },

  { nombre: "conejo", imagen: "/juegos/memoria/conejo.webp" },
  { nombre: "pato", imagen: "/juegos/memoria/pato.webp" },
  { nombre: "vaca", imagen: "/juegos/memoria/vaca.webp" },
  { nombre: "cerdito", imagen: "/juegos/memoria/cerdito.webp" },
  { nombre: "rana", imagen: "/juegos/memoria/rana.webp" },
  { nombre: "tortuga", imagen: "/juegos/memoria/tortuga.webp" },
  { nombre: "pez", imagen: "/juegos/memoria/pez.webp" },
  { nombre: "mariposa", imagen: "/juegos/memoria/mariposa.webp" },
  { nombre: "pelota", imagen: "/juegos/memoria/pelota.webp" },
  { nombre: "flor", imagen: "/juegos/memoria/flor.webp" },
  { nombre: "arbol", imagen: "/juegos/memoria/arbol.webp" },
  { nombre: "sol", imagen: "/juegos/memoria/sol.webp" },
  { nombre: "luna", imagen: "/juegos/memoria/luna.webp" },
  { nombre: "nube", imagen: "/juegos/memoria/nube.webp" },
  { nombre: "globo", imagen: "/juegos/memoria/globo.webp" },
  { nombre: "lapiz", imagen: "/juegos/memoria/lapiz.webp" },
  { nombre: "libro", imagen: "/juegos/memoria/libro.webp" },
  { nombre: "casa", imagen: "/juegos/memoria/casa.webp" },
  { nombre: "tren", imagen: "/juegos/memoria/tren.webp" },
  { nombre: "avion", imagen: "/juegos/memoria/avion.webp" },
];

const IMAGENES_PREDETERMINADAS = [
  "osito",
  "estrellita",
  "elefante",
  "abejita",
  "barco",
  "manzana",
  "carrito",
  "mochila",
  "cuadrado",
  "perrito",
  "gatito",
  "pollo",
];

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function obtenerImagenesPorNombre(nombres: string[]) {
  return IMAGENES_DISPONIBLES.filter((imagen) =>
    nombres.includes(imagen.nombre)
  );
}

function obtenerColumnas(cantidadTarjetas: number) {
  if (cantidadTarjetas === 2) return "grid-cols-2 max-w-3xl";
  if (cantidadTarjetas === 4) return "grid-cols-2 max-w-4xl";
  if (cantidadTarjetas === 8) return "grid-cols-4 max-w-6xl";
  return "grid-cols-3 max-w-6xl";
}

export default function MemoriaVisual({ onFinalizar, configuracion }: Props) {
  const cantidadTarjetas = configuracion?.cantidadTarjetas ?? 6;
  const totalRondas = configuracion?.rondas ?? 4;

  const imagenesJuego = useMemo(() => {
    if (!configuracion) {
      return obtenerImagenesPorNombre(IMAGENES_PREDETERMINADAS);
    }

    const seleccionadas = obtenerImagenesPorNombre(configuracion.objetos);

    return seleccionadas.length >= 2
      ? seleccionadas
      : obtenerImagenesPorNombre(IMAGENES_PREDETERMINADAS);
  }, [configuracion]);

  const rondas = useMemo(() => {
    return Array.from({ length: totalRondas }).map((_, rondaIndex) => {
      const seleccionadas = mezclar(imagenesJuego).slice(0, cantidadTarjetas);

      const objetivo =
        seleccionadas[Math.floor(Math.random() * seleccionadas.length)];

      return {
        numero: rondaIndex + 1,
        tarjetas: seleccionadas.map((item, index) => ({
          ...item,
          id: `${rondaIndex}-${index}-${item.nombre}`,
        })),
        objetivo,
      };
    });
  }, [imagenesJuego, cantidadTarjetas, totalRondas]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mostrarImagenes, setMostrarImagenes] = useState(true);
  const [tarjetasVolteadas, setTarjetasVolteadas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [terminado, setTerminado] = useState(false);

  const ronda = rondas[rondaActual];

  useEffect(() => {
    setMostrarImagenes(true);
    setTarjetasVolteadas([]);
    setMensaje("👀 Observa bien las imágenes");
    setBloqueado(true);

    const tiempo = setTimeout(() => {
      setMostrarImagenes(false);
      setMensaje("");
      setBloqueado(false);
    }, 4500);

    return () => clearTimeout(tiempo);
  }, [rondaActual]);

  const responder = (tarjeta: Tarjeta) => {
    if (bloqueado || mostrarImagenes) return;
    if (tarjetasVolteadas.includes(tarjeta.id)) return;

    setBloqueado(true);
    setTarjetasVolteadas((prev) => [...prev, tarjeta.id]);

    const correcto = tarjeta.nombre === ronda.objetivo.nombre;

    if (correcto) {
      setMensaje("🎉 ¡Excelente memoria!");

      setTimeout(() => {
        if (rondaActual < rondas.length - 1) {
          setRondaActual((prev) => prev + 1);
        } else {
          setTerminado(true);
        }
      }, 1400);
    } else {
      setMensaje("😊 ¡Sigue buscando!");

      setTimeout(() => {
        setTarjetasVolteadas((prev) =>
          prev.filter((id) => id !== tarjeta.id)
        );
        setMensaje("");
        setBloqueado(false);
      }, 1200);
    }
  };

  if (terminado) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[32px] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 text-center shadow-xl">
        <div className="mb-4 text-7xl">🏆</div>

        <h2 className="text-3xl font-black text-purple-700">
          ¡Terminaste Memoria Visual!
        </h2>

        <p className="mt-3 text-lg font-semibold text-slate-600">
          Observaste, recordaste y encontraste las imágenes.
        </p>

        <button
          onClick={onFinalizar}
          className="mt-8 rounded-full bg-purple-600 px-8 py-4 text-lg font-black text-white shadow-lg transition hover:scale-105 hover:bg-purple-700"
        >
          Finalizar juego
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6 shadow-xl">
      <div className="mb-5 text-center">
        <h2 className="text-3xl font-black text-purple-700">
          🧠 Memoria Visual
        </h2>

        <p className="mt-2 text-lg font-bold text-slate-600">
          Ronda {ronda.numero} de {totalRondas}
        </p>
      </div>

      <div className="mb-5 rounded-3xl bg-white/80 p-4 text-center shadow-md">
        {mostrarImagenes ? (
          <p className="text-xl font-black text-pink-600">
            👀 Observa bien las imágenes
          </p>
        ) : (
          <p className="text-xl font-black text-purple-700">
            ¿Dónde estaba:{" "}
            <span className="capitalize text-pink-600">
              {ronda.objetivo.nombre}
            </span>
            ?
          </p>
        )}
      </div>

      <div className={`mx-auto grid gap-6 ${obtenerColumnas(cantidadTarjetas)}`}>
        {ronda.tarjetas.map((tarjeta) => {
          const estaVolteada =
            mostrarImagenes || tarjetasVolteadas.includes(tarjeta.id);

          return (
            <button
              key={tarjeta.id}
              onClick={() => responder(tarjeta)}
              disabled={bloqueado && !estaVolteada}
              className="flex aspect-square w-full items-center justify-center rounded-[32px] border-4 border-purple-200 bg-white shadow-lg transition hover:scale-105 hover:border-pink-300 disabled:cursor-not-allowed"
            >
              {estaVolteada ? (
                <img
                  src={tarjeta.imagen}
                  alt={tarjeta.nombre}
                  className="h-[220px] w-[220px] object-contain"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-300 to-pink-300 text-7xl font-black text-white shadow-inner">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {mensaje && (
        <div className="mt-6 rounded-3xl bg-white p-4 text-center text-2xl font-black text-purple-700 shadow-md">
          {mensaje}
        </div>
      )}

      <div className="mt-6 text-center text-sm font-bold text-slate-500">
        Primero observa, luego recuerda la posición correcta.
      </div>
    </div>
  );
}