"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionCuentaConmigo } from "../personalizacion-juegos/PersonalizarCuentaConmigo";

type Ficha = {
  titulo: string;
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

const fichasBase: Ficha[] = [
  {
    titulo: "¿Cuántos patos hay en la imagen?",
    objeto: "patos",
    cantidad: 1,
    imagen: "/juegos/conteo/pato1.webp",
  },
  {
    titulo: "¿Cuántos carros hay en la imagen?",
    objeto: "carros",
    cantidad: 1,
    imagen: "/juegos/conteo/carro1.webp",
  },
  {
    titulo: "¿Cuántos árboles hay en la imagen?",
    objeto: "árboles",
    cantidad: 1,
    imagen: "/juegos/conteo/arbol1.webp",
  },
  {
    titulo: "¿Cuántas manzanas hay en la imagen?",
    objeto: "manzanas",
    cantidad: 2,
    imagen: "/juegos/conteo/manzana2.webp",
  },
  {
    titulo: "¿Cuántas pelotas hay en la imagen?",
    objeto: "pelotas",
    cantidad: 2,
    imagen: "/juegos/conteo/pelota2.webp",
  },
  {
    titulo: "¿Cuántos lápices hay en la imagen?",
    objeto: "lápices",
    cantidad: 2,
    imagen: "/juegos/conteo/lapiz2.webp",
  },
  {
    titulo: "¿Cuántas estrellas hay en la imagen?",
    objeto: "estrellas",
    cantidad: 3,
    imagen: "/juegos/conteo/estrella3.webp",
  },
  {
    titulo: "¿Cuántas flores hay en la imagen?",
    objeto: "flores",
    cantidad: 3,
    imagen: "/juegos/conteo/flor3.webp",
  },
  {
    titulo: "¿Cuántos peces hay en la imagen?",
    objeto: "peces",
    cantidad: 3,
    imagen: "/juegos/conteo/pez3.webp",
  },
  {
    titulo: "¿Cuántos globos hay en la imagen?",
    objeto: "globos",
    cantidad: 4,
    imagen: "/juegos/conteo/globo4.webp",
  },
  {
    titulo: "¿Cuántas mariposas hay en la imagen?",
    objeto: "mariposas",
    cantidad: 4,
    imagen: "/juegos/conteo/mariposa4.webp",
  },
  {
    titulo: "¿Cuántos zapatos hay en la imagen?",
    objeto: "zapatos",
    cantidad: 4,
    imagen: "/juegos/conteo/zapato4.webp",
  },
  {
    titulo: "¿Cuántas bananas hay en la imagen?",
    objeto: "bananas",
    cantidad: 5,
    imagen: "/juegos/conteo/banana5.webp",
  },
  {
    titulo: "¿Cuántos corazones hay en la imagen?",
    objeto: "corazones",
    cantidad: 5,
    imagen: "/juegos/conteo/corazon5.webp",
  },
  {
    titulo: "¿Cuántos libros hay en la imagen?",
    objeto: "libros",
    cantidad: 5,
    imagen: "/juegos/conteo/libro5.webp",
  },
];

const numerosImagen: Record<number, string> = {
  1: "/juegos/conteo/uno.webp",
  2: "/juegos/conteo/dos.webp",
  3: "/juegos/conteo/tres.webp",
  4: "/juegos/conteo/cuatro.webp",
  5: "/juegos/conteo/cinco.webp",
};

const mezclar = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

const elegirAleatorio = <T,>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

function crearOpciones(correcta: number) {
  const opcionesIncorrectas = mezclar(
    [1, 2, 3, 4, 5].filter((n) => n !== correcta)
  ).slice(0, 2);

  return mezclar([correcta, ...opcionesIncorrectas]);
}

function crearRondasPersonalizadas(
  configuracion: ConfiguracionCuentaConmigo
): Ronda[] {
  const imagenes = configuracion.imagenesPorNumero ?? [];

  return mezclar(imagenes).map((item) => ({
    titulo: item.titulo,
    objeto: "objetos",
    cantidad: item.numero,
    imagen: item.imagen,
    opciones: crearOpciones(item.numero),
  }));
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
      configuracion?.imagenesPorNumero &&
      configuracion.imagenesPorNumero.length > 0
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
    <div className="flex min-h-[560px] w-full flex-col items-center rounded-3xl border-4 border-dashed border-purple-300 bg-gradient-to-br from-yellow-100 via-purple-100 to-pink-100 p-6 shadow-lg">
      <h2 className="mb-1 text-3xl font-extrabold text-purple-700">
        Cuenta Conmigo
      </h2>

      <p className="mb-4 text-base font-bold text-gray-700">
        Ronda {rondaActual + 1} de {rondas.length}
      </p>

      <div className="flex w-full max-w-3xl flex-col items-center rounded-3xl bg-white p-6 shadow-xl">
        <h3 className="mb-5 text-center text-3xl font-extrabold text-orange-500">
          {ronda.titulo || `¿Cuántos ${ronda.objeto} hay en la imagen?`}
        </h3>

        <div className="mb-6 flex min-h-[340px] w-full max-w-xl items-center justify-center rounded-2xl border-4 border-dashed border-yellow-300 bg-yellow-50 p-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {Array.from({ length: ronda.cantidad }).map((_, index) => (
              <img
                key={`${ronda.imagen}-${index}`}
                src={ronda.imagen}
                alt={ronda.objeto}
                className="h-32 w-32 object-contain"
              />
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-xl grid-cols-3 gap-5">
          {ronda.opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => seleccionarRespuesta(opcion)}
              disabled={bloqueado}
              className="flex h-28 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-200 to-purple-400 shadow-lg transition hover:scale-105 disabled:opacity-70"
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
        <div className="mt-5 animate-bounce text-3xl font-extrabold text-purple-700">
          {mensaje}
        </div>
      )}
    </div>
  );
}