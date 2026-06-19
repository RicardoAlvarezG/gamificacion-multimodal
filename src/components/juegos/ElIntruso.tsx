"use client";

import { useMemo, useState } from "react";

type Props = {
  onFinalizar: () => void;
};

type ImagenJuego = {
  nombre: string;
  imagen: string;
  grupo: string;
};

type Ronda = {
  imagenesArriba: ImagenJuego[];
  opciones: ImagenJuego[];
  respuesta: ImagenJuego;
};

const imagenes: ImagenJuego[] = [
  { nombre: "Animal 1", imagen: "/juegos/intruso/animal1.webp", grupo: "animal" },
  { nombre: "Animal 2", imagen: "/juegos/intruso/animal2.webp", grupo: "animal" },
  { nombre: "Animal 3", imagen: "/juegos/intruso/animal3.webp", grupo: "animal" },
  { nombre: "Animal 4", imagen: "/juegos/intruso/animal4.webp", grupo: "animal" },

  { nombre: "Emoción 1", imagen: "/juegos/intruso/emocion1.webp", grupo: "emocion" },
  { nombre: "Emoción 2", imagen: "/juegos/intruso/emocion2.webp", grupo: "emocion" },
  { nombre: "Emoción 3", imagen: "/juegos/intruso/emocion3.webp", grupo: "emocion" },
  { nombre: "Emoción 4", imagen: "/juegos/intruso/emocion4.webp", grupo: "emocion" },

  { nombre: "Figura 1", imagen: "/juegos/intruso/figura1.webp", grupo: "figura" },
  { nombre: "Figura 2", imagen: "/juegos/intruso/figura2.webp", grupo: "figura" },
  { nombre: "Figura 3", imagen: "/juegos/intruso/figura3.webp", grupo: "figura" },
  { nombre: "Figura 4", imagen: "/juegos/intruso/figura4.webp", grupo: "figura" },

  { nombre: "Profesión 1", imagen: "/juegos/intruso/profesion1.webp", grupo: "profesion" },
  { nombre: "Profesión 2", imagen: "/juegos/intruso/profesion2.webp", grupo: "profesion" },
  { nombre: "Profesión 3", imagen: "/juegos/intruso/profesion3.webp", grupo: "profesion" },
  { nombre: "Profesión 4", imagen: "/juegos/intruso/profesion4.webp", grupo: "profesion" },

  { nombre: "Vehículo 1", imagen: "/juegos/intruso/vehiculo1.webp", grupo: "vehiculo" },
  { nombre: "Vehículo 2", imagen: "/juegos/intruso/vehiculo2.webp", grupo: "vehiculo" },
  { nombre: "Vehículo 3", imagen: "/juegos/intruso/vehiculo3.webp", grupo: "vehiculo" },
  { nombre: "Vehículo 4", imagen: "/juegos/intruso/vehiculo4.webp", grupo: "vehiculo" },

  { nombre: "Vocal 1", imagen: "/juegos/intruso/vocal1.webp", grupo: "vocal" },
  { nombre: "Vocal 2", imagen: "/juegos/intruso/vocal2.webp", grupo: "vocal" },
  { nombre: "Vocal 3", imagen: "/juegos/intruso/vocal3.webp", grupo: "vocal" },
  { nombre: "Vocal 4", imagen: "/juegos/intruso/vocal4.webp", grupo: "vocal" },
  { nombre: "Vocal 5", imagen: "/juegos/intruso/vocal5.webp", grupo: "vocal" },
];

const grupos = ["animal", "emocion", "figura", "profesion", "vehiculo", "vocal"];

function mezclar<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function tomarPorGrupo(grupo: string, cantidad: number) {
  return mezclar(imagenes.filter((item) => item.grupo === grupo)).slice(0, cantidad);
}

function crearRondas(): Ronda[] {
  const rondas: Ronda[] = [];

  const gruposMezclados = mezclar(grupos).slice(0, 5);

  gruposMezclados.forEach((grupoCorrecto) => {
    const gruposIntrusos = grupos.filter((grupo) => grupo !== grupoCorrecto);
    const grupoIntruso = mezclar(gruposIntrusos)[0];

    const correctas = tomarPorGrupo(grupoCorrecto, 4);
    const intruso = tomarPorGrupo(grupoIntruso, 1)[0];

    const imagenesArriba = mezclar([
      correctas[0],
      correctas[1],
      correctas[2],
      intruso,
    ]);

    const respuesta = correctas[3];

    const opcionesIncorrectas = mezclar(
      imagenes.filter(
        (img) =>
          img.grupo !== grupoCorrecto &&
          img.imagen !== intruso.imagen
      )
    ).slice(0, 2);

    const opciones = mezclar([respuesta, ...opcionesIncorrectas]);

    rondas.push({
      imagenesArriba,
      opciones,
      respuesta,
    });
  });

  return rondas;
}

export default function ElIntruso({ onFinalizar }: Props) {
  const rondas = useMemo(() => crearRondas(), []);
  const [rondaActual, setRondaActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const verificarRespuesta = (opcion: ImagenJuego) => {
    if (bloqueado) return;

    setSeleccionada(opcion.imagen);

    if (opcion.imagen === ronda.respuesta.imagen) {
      setMensaje("¡Muy bien! 🎉");
      setBloqueado(true);

      setTimeout(() => {
        if (rondaActual + 1 < rondas.length) {
          setRondaActual(rondaActual + 1);
          setMensaje("");
          setSeleccionada(null);
          setBloqueado(false);
        } else {
          setCompletado(true);
        }
      }, 1100);
    } else {
      setMensaje("Sigamos intentando 😊");

      setTimeout(() => {
        setMensaje("");
        setSeleccionada(null);
      }, 900);
    }
  };

  if (completado) {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 text-center shadow-xl">
        <div className="mb-4 text-7xl">🏆</div>

        <h2 className="text-4xl font-black text-purple-700">
          ¡Juego completado!
        </h2>

        <p className="mt-3 text-xl font-bold text-gray-700">
          Completaste todos los grupos.
        </p>

        <button
          onClick={onFinalizar}
          className="mt-8 rounded-full bg-purple-600 px-10 py-4 text-xl font-black text-white shadow-lg transition hover:scale-105 hover:bg-purple-700"
        >
          Finalizar Juego
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-violet-100 via-pink-100 to-orange-100 p-6 shadow-xl">
      <div className="mb-5 text-center">
        <h2 className="text-4xl font-black text-purple-700">
          El Intruso
        </h2>

        <p className="mt-2 text-lg font-bold text-gray-700">
          Observa el grupo y elige la imagen correcta
        </p>

        <p className="mt-1 text-sm font-black text-purple-500">
          Ronda {rondaActual + 1} de {rondas.length}
        </p>
      </div>

      <div className="mx-auto mb-6 max-w-6xl rounded-[2rem] border-4 border-dashed border-purple-300 bg-white/80 p-5">
        <p className="mb-5 text-center text-2xl font-black text-purple-700">
          ¿Qué imagen completa el grupo?
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          {ronda.imagenesArriba.map((item, index) => (
            <div
              key={`${item.imagen}-${index}`}
              className="flex h-52 w-52 items-center justify-center rounded-3xl bg-white p-4 shadow-lg"
            >
              <img
                src={item.imagen}
                alt={item.nombre}
                className="max-h-44 max-w-44 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white/80 p-5">
        <p className="mb-5 text-center text-xl font-black text-gray-700">
          Elige una opción:
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {ronda.opciones.map((opcion) => {
            const esSeleccionada = seleccionada === opcion.imagen;
            const esCorrecta = opcion.imagen === ronda.respuesta.imagen;

            return (
              <button
                key={opcion.imagen}
                onClick={() => verificarRespuesta(opcion)}
                className={`flex h-56 w-64 items-center justify-center rounded-3xl border-4 bg-white p-5 shadow-lg transition hover:scale-105 ${
                  esSeleccionada
                    ? esCorrecta
                      ? "border-green-400 bg-green-100"
                      : "border-red-400 bg-red-100"
                    : "border-transparent"
                }`}
              >
                <img
                  src={opcion.imagen}
                  alt={opcion.nombre}
                  className="max-h-48 max-w-48 object-contain"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 min-h-[52px] text-center">
        {mensaje && (
          <p className="text-3xl font-black text-purple-700">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}