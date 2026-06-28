"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionCuentaConmigo } from "../personalizacion-juegos/PersonalizarCuentaConmigo";

type Ficha = {
  objeto: string;
  cantidad: number;
  imagen: string;
};

type Ronda = Ficha & {
  opciones: number[];
};

type Props = {
  configuracion?: ConfiguracionCuentaConmigo;
  onFinalizar: () => void;
};

const objetosDisponibles = [
  "auto",
  "avion",
  "balon",
  "barco",
  "conejo",
  "flor",
  "gato",
  "helado",
  "lapiz",
  "libro",
  "manzana",
  "mariposa",
  "oso",
  "paleta",
  "pelota",
  "pez",
  "pollo",
  "sol",
  "tren",
  "vaca",
];

const nombresObjeto: Record<string, string> = {
  auto: "autos",
  avion: "aviones",
  balon: "balones",
  barco: "barcos",
  conejo: "conejos",
  flor: "flores",
  gato: "gatos",
  helado: "helados",
  lapiz: "lápices",
  libro: "libros",
  manzana: "manzanas",
  mariposa: "mariposas",
  oso: "osos",
  paleta: "paletas",
  pelota: "pelotas",
  pez: "peces",
  pollo: "pollos",
  sol: "soles",
  tren: "trenes",
  vaca: "vacas",
};

const fichasBase: Ficha[] = [
  { objeto: "patos", cantidad: 1, imagen: "/juegos/conteo/pato1.webp" },
  { objeto: "carros", cantidad: 1, imagen: "/juegos/conteo/carro1.webp" },
  { objeto: "árboles", cantidad: 1, imagen: "/juegos/conteo/arbol1.webp" },

  { objeto: "manzanas", cantidad: 2, imagen: "/juegos/conteo/manzana2.webp" },
  { objeto: "pelotas", cantidad: 2, imagen: "/juegos/conteo/pelota2.webp" },
  { objeto: "lápices", cantidad: 2, imagen: "/juegos/conteo/lapiz2.webp" },

  { objeto: "estrellas", cantidad: 3, imagen: "/juegos/conteo/estrella3.webp" },
  { objeto: "flores", cantidad: 3, imagen: "/juegos/conteo/flor3.webp" },
  { objeto: "peces", cantidad: 3, imagen: "/juegos/conteo/pez3.webp" },

  { objeto: "globos", cantidad: 4, imagen: "/juegos/conteo/globo4.webp" },
  { objeto: "mariposas", cantidad: 4, imagen: "/juegos/conteo/mariposa4.webp" },
  { objeto: "zapatos", cantidad: 4, imagen: "/juegos/conteo/zapato4.webp" },

  { objeto: "bananas", cantidad: 5, imagen: "/juegos/conteo/banana5.webp" },
  { objeto: "corazones", cantidad: 5, imagen: "/juegos/conteo/corazon5.webp" },
  { objeto: "libros", cantidad: 5, imagen: "/juegos/conteo/libro5.webp" },
];

const numerosImagen: Record<number, string> = {
  1: "/juegos/conteo/uno.webp",
  2: "/juegos/conteo/dos.webp",
  3: "/juegos/conteo/tres.webp",
  4: "/juegos/conteo/cuatro.webp",
  5: "/juegos/conteo/cinco.webp",
};

const mezclar = <T,>(array: T[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const elegirAleatorio = <T,>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

function crearOpciones(correcta: number) {
  const opcionesIncorrectas = mezclar(
    [1, 2, 3, 4, 5].filter((n) => n !== correcta)
  ).slice(0, 2);

  return mezclar([correcta, ...opcionesIncorrectas]);
}

function crearRondasPersonalizadas(
  configuracion: ConfiguracionCuentaConmigo
): Ronda[] {
  return mezclar(configuracion.imagenes).map((imagen) => {
    const cantidad = elegirAleatorio(configuracion.numeros);

    return {
      objeto: nombresObjeto[imagen] ?? imagen,
      cantidad,
      imagen: `/juegos/conteo/${imagen}.webp`,
      opciones: crearOpciones(cantidad),
    };
  });
}

function crearRondasBase(): Ronda[] {
  const numeros = mezclar([1, 2, 3, 4, 5]);

  return numeros.map((numero) => {
    const fichasDelNumero = fichasBase.filter(
      (ficha) => ficha.cantidad === numero
    );

    const fichaElegida = elegirAleatorio(fichasDelNumero);

    return {
      ...fichaElegida,
      opciones: crearOpciones(numero),
    };
  });
}

export default function CuentaConmigo({
  configuracion,
  onFinalizar,
}: Props) {
  const rondas: Ronda[] = useMemo(() => {
    if (
      configuracion &&
      configuracion.numeros.length > 0 &&
      configuracion.imagenes.length > 0
    ) {
      return crearRondasPersonalizadas(configuracion);
    }

    return crearRondasBase();
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const seleccionarRespuesta = (numero: number) => {
    if (bloqueado) return;

    setBloqueado(true);

    if (numero === ronda.cantidad) {
      setMensaje("¡Muy bien!");
    } else {
      setMensaje("Sigamos intentando");
    }

    setTimeout(() => {
      setMensaje("");
      setBloqueado(false);

      if (rondaActual + 1 < rondas.length) {
        setRondaActual((prev) => prev + 1);
      } else {
        onFinalizar();
      }
    }, 1200);
  };

  return (
    <div className="w-full min-h-[560px] rounded-3xl bg-gradient-to-br from-yellow-100 via-purple-100 to-pink-100 p-6 shadow-lg border-4 border-dashed border-purple-300 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-1">
        Cuenta Conmigo
      </h2>

      <p className="text-base font-bold text-gray-700 mb-4">
        Ronda {rondaActual + 1} de {rondas.length}
      </p>

      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-3xl flex flex-col items-center">
        <h3 className="text-3xl font-extrabold text-orange-500 mb-5 text-center">
          ¿Cuántos {ronda.objeto} hay en la imagen?
        </h3>

        <div className="w-full max-w-md min-h-[320px] rounded-2xl mb-6 bg-yellow-50 border-4 border-dashed border-yellow-300 p-5 grid grid-cols-3 gap-4 place-items-center">
          {Array.from({ length: ronda.cantidad }).map((_, index) => (
            <img
              key={`${ronda.imagen}-${index}`}
              src={ronda.imagen}
              alt={ronda.objeto}
              className="h-24 w-24 object-contain"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5 w-full max-w-xl">
          {ronda.opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => seleccionarRespuesta(opcion)}
              disabled={bloqueado}
              className="h-28 rounded-3xl bg-gradient-to-br from-blue-200 to-purple-400 shadow-lg hover:scale-105 transition flex items-center justify-center disabled:opacity-70"
            >
              <img
                src={numerosImagen[opcion]}
                alt={`Número ${opcion}`}
                className="h-24 w-24 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {mensaje && (
        <div className="mt-5 text-3xl font-extrabold text-purple-700 animate-bounce">
          {mensaje}
        </div>
      )}
    </div>
  );
}