"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionFigurasPosiciones } from "../personalizacion-juegos/PersonalizarFigurasPosiciones";

type Zona = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Pregunta = {
  pregunta: string;
  respuesta: string;
  zona: Zona;
};

type Escena = {
  id: string;
  imagen: string;
  preguntas: Pregunta[];
};

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionFigurasPosiciones;
};

const escenas: Escena[] = [
  {
    id: "escena1",
    imagen: "/juegos/figuras-posiciones/escena1.webp",
    preguntas: [
      {
        pregunta: "¿Dónde está el triángulo verde?",
        respuesta: "Ventana",
        zona: { x: 53, y: 39, w: 12, h: 14 },
      },
      {
        pregunta: "¿Qué objeto está a la derecha de la casa?",
        respuesta: "Niño",
        zona: { x: 70, y: 43, w: 13, h: 27 },
      },
      {
        pregunta: "¿Qué animal está volando?",
        respuesta: "Pájaro azul",
        zona: { x: 18, y: 9, w: 12, h: 17 },
      },
    ],
  },
  {
    id: "escena2",
    imagen: "/juegos/figuras-posiciones/escena2.webp",
    preguntas: [
      {
        pregunta: "¿Qué objeto tiene forma de triángulo?",
        respuesta: "Cometa",
        zona: { x: 58, y: 4, w: 15, h: 17 },
      },
      {
        pregunta: "¿Qué objeto está debajo del árbol?",
        respuesta: "Pelota verde",
        zona: { x: 9, y: 62, w: 9, h: 12 },
      },
      {
        pregunta: "¿Dónde está el columpio?",
        respuesta: "Columpio",
        zona: { x: 48, y: 30, w: 23, h: 34 },
      },
    ],
  },
  {
    id: "escena3",
    imagen: "/juegos/figuras-posiciones/escena3.webp",
    preguntas: [
      {
        pregunta: "¿Qué figura tiene forma de rectángulo?",
        respuesta: "Granero",
        zona: { x: 31, y: 4, w: 32, h: 51 },
      },
      {
        pregunta: "¿Qué objeto está debajo del árbol?",
        respuesta: "Paca de heno",
        zona: { x: 72, y: 47, w: 18, h: 11 },
      },
      {
        pregunta: "¿Dónde está el pato?",
        respuesta: "Pato",
        zona: { x: 72, y: 67, w: 16, h: 16 },
      },
    ],
  },
  {
    id: "escena4",
    imagen: "/juegos/figuras-posiciones/escena4.webp",
    preguntas: [
      {
        pregunta: "¿Qué objeto tiene forma de estrella?",
        respuesta: "Estrella de mar",
        zona: { x: 29, y: 83, w: 13, h: 10 },
      },
      {
        pregunta: "¿Qué animal está arriba?",
        respuesta: "Delfín",
        zona: { x: 60, y: 4, w: 28, h: 27 },
      },
      {
        pregunta: "¿Dónde está el cofre del tesoro?",
        respuesta: "Cofre del tesoro",
        zona: { x: 2, y: 58, w: 20, h: 23 },
      },
    ],
  },
];

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function FigurasPosiciones({
  onFinalizar,
  configuracion,
}: Props) {
  const escenasJuego = useMemo(() => {
    if (!configuracion) {
      return escenas;
    }

    const seleccionadas = escenas.filter((escena) =>
      configuracion.escenas.includes(escena.id)
    );

    return seleccionadas.length > 0 ? seleccionadas : escenas;
  }, [configuracion]);

  const totalRondas = configuracion?.rondas ?? 3;

  const rondas = useMemo(() => {
    return Array.from({ length: totalRondas }).map((_, index) => {
      const escena = mezclar(escenasJuego)[index % escenasJuego.length];

      return {
        ...escena,
        preguntaActual: mezclar(escena.preguntas)[0],
      };
    });
  }, [escenasJuego, totalRondas]);

  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const validarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (bloqueado) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const { x, y, w, h } = ronda.preguntaActual.zona;

    const acerto =
      clickX >= x &&
      clickX <= x + w &&
      clickY >= y &&
      clickY <= y + h;

    if (acerto) {
      setBloqueado(true);
      setMensaje("¡Muy bien! 🎉");

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual((prev) => prev + 1);
          setMensaje("");
          setBloqueado(false);
        } else {
          onFinalizar();
        }
      }, 1200);
    } else {
      setMensaje("Sigamos intentando 😊");
      setTimeout(() => setMensaje(""), 1000);
    }
  };

  return (
    <div className="w-full min-h-[600px] rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6 shadow-xl border border-purple-100">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black text-purple-700">
          Figuras y Posiciones
        </h2>

        <p className="text-lg font-bold text-gray-600">
          Ronda {rondaActual + 1} de {rondas.length}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-md border-4 border-dashed border-purple-300">
        <div className="mb-4 text-center">
          <p className="text-2xl font-black text-orange-500">
            {ronda.preguntaActual.pregunta}
          </p>

          <p className="text-sm font-semibold text-gray-500">
            Haz clic en la imagen correcta
          </p>
        </div>

        <div
          onClick={validarClick}
          className="relative mx-auto w-full max-w-5xl cursor-pointer overflow-hidden rounded-3xl border-4 border-purple-200 bg-white"
        >
          <img
            src={ronda.imagen}
            alt="Escena del juego"
            className="w-full select-none"
            draggable={false}
          />
        </div>

        <div className="h-14 mt-4 flex items-center justify-center">
          {mensaje && (
            <p className="text-3xl font-black text-purple-700 animate-bounce">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}