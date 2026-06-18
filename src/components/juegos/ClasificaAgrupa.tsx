"use client";

import { useMemo, useState } from "react";

type RondaColor = {
  tipo: "color";
  titulo: string;
  correctas: string[];
  distractores: string[];
};

type RondaTamano = {
  tipo: "tamano";
  titulo: string;
  correcta: string;
  incorrecta: string;
};

type Ronda = RondaColor | RondaTamano;

type Props = {
  onFinalizar: () => void;
};

const rondasColorBase: RondaColor[] = [
  {
    tipo: "color",
    titulo: "Selecciona los objetos de color rojo",
    correctas: [
      "/juegos/clasifica/colorrojo1.webp",
      "/juegos/clasifica/colorrojo2.webp",
      "/juegos/clasifica/colorrojo3.webp",
    ],
    distractores: [
      "/juegos/clasifica/colorazul1.webp",
      "/juegos/clasifica/colorverde1.webp",
      "/juegos/clasifica/colornaranja1.webp",
    ],
  },
  {
    tipo: "color",
    titulo: "Selecciona los objetos de color azul",
    correctas: [
      "/juegos/clasifica/colorazul1.webp",
      "/juegos/clasifica/colorazul2.webp",
      "/juegos/clasifica/colorazul3.webp",
    ],
    distractores: [
      "/juegos/clasifica/colorrojo1.webp",
      "/juegos/clasifica/colorverde2.webp",
      "/juegos/clasifica/colornaranja2.webp",
    ],
  },
  {
    tipo: "color",
    titulo: "Selecciona los objetos de color verde",
    correctas: [
      "/juegos/clasifica/colorverde1.webp",
      "/juegos/clasifica/colorverde2.webp",
      "/juegos/clasifica/colorverde3.webp",
    ],
    distractores: [
      "/juegos/clasifica/colorrojo2.webp",
      "/juegos/clasifica/colorazul2.webp",
      "/juegos/clasifica/colornaranja3.webp",
    ],
  },
  {
    tipo: "color",
    titulo: "Selecciona los objetos de color naranja",
    correctas: [
      "/juegos/clasifica/colornaranja1.webp",
      "/juegos/clasifica/colornaranja2.webp",
      "/juegos/clasifica/colornaranja3.webp",
    ],
    distractores: [
      "/juegos/clasifica/colorrojo3.webp",
      "/juegos/clasifica/colorazul3.webp",
      "/juegos/clasifica/colorverde3.webp",
    ],
  },
];

const rondasTamanoBase: RondaTamano[] = [
  {
    tipo: "tamano",
    titulo: "Selecciona el oso grande",
    correcta: "/juegos/clasifica/osogrande.webp",
    incorrecta: "/juegos/clasifica/osopequeño.webp",
  },
  {
    tipo: "tamano",
    titulo: "Selecciona el carro grande",
    correcta: "/juegos/clasifica/carrogrande.webp",
    incorrecta: "/juegos/clasifica/carropequeño.webp",
  },
  {
    tipo: "tamano",
    titulo: "Selecciona la manzana grande",
    correcta: "/juegos/clasifica/manzanagrande.webp",
    incorrecta: "/juegos/clasifica/manzanapequeña.webp",
  },
  {
    tipo: "tamano",
    titulo: "Selecciona el barco grande",
    correcta: "/juegos/clasifica/barcogrande.webp",
    incorrecta: "/juegos/clasifica/barcopequeño.webp",
  },
  {
    tipo: "tamano",
    titulo: "Selecciona la pelota grande",
    correcta: "/juegos/clasifica/pelotagrande.webp",
    incorrecta: "/juegos/clasifica/pelotapequeña.webp",
  },
];

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ClasificaAgrupa({ onFinalizar }: Props) {
  const rondas = useMemo<Ronda[]>(() => {
    const colores = mezclar(rondasColorBase).slice(0, 2);
    const tamanos = mezclar(rondasTamanoBase).slice(0, 2);

    return [...colores, ...tamanos];
  }, []);

  const [rondaActual, setRondaActual] = useState(0);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const opcionesColor = useMemo(() => {
    if (!ronda || ronda.tipo !== "color") return [];

    return mezclar([
      ...ronda.correctas.map((imagen) => ({
        imagen,
        correcta: true,
      })),
      ...ronda.distractores.map((imagen) => ({
        imagen,
        correcta: false,
      })),
    ]);
  }, [ronda]);

  const opcionesTamano = useMemo(() => {
    if (!ronda || ronda.tipo !== "tamano") return [];

    return mezclar([
      {
        imagen: ronda.correcta,
        correcta: true,
      },
      {
        imagen: ronda.incorrecta,
        correcta: false,
      },
    ]);
  }, [ronda]);

  const avanzarRonda = () => {
    setTimeout(() => {
      if (rondaActual < rondas.length - 1) {
        setRondaActual((prev) => prev + 1);
        setSeleccionadas([]);
        setMensaje("");
        setBloqueado(false);
      } else {
        setMensaje("🏆 ¡Juego completado!");
        setBloqueado(false);
      }
    }, 1200);
  };

  const seleccionarColor = (imagen: string, correcta: boolean) => {
    if (bloqueado || !ronda || ronda.tipo !== "color") return;

    if (!correcta) {
      setMensaje("😊 Sigamos intentando");
      return;
    }

    if (seleccionadas.includes(imagen)) return;

    const nuevasSeleccionadas = [...seleccionadas, imagen];
    setSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === 3) {
      setBloqueado(true);
      setMensaje("🎉 ¡Muy bien!");
      avanzarRonda();
    } else {
      setMensaje("✅ ¡Bien! Sigue buscando");
    }
  };

  const seleccionarTamano = (correcta: boolean) => {
    if (bloqueado || !ronda || ronda.tipo !== "tamano") return;

    if (!correcta) {
      setMensaje("😊 Sigamos intentando");
      return;
    }

    setBloqueado(true);
    setMensaje("🎉 ¡Muy bien!");
    avanzarRonda();
  };

  const juegoTerminado = mensaje === "🏆 ¡Juego completado!";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="rounded-[2rem] shadow-xl p-8 border-4 border-pink-200 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100">
        <h2 className="text-5xl font-extrabold text-center text-purple-700 mb-3">
          Clasifica y Agrupa
        </h2>

        <p className="text-center text-purple-600 mb-6 text-xl font-semibold">
          Observa, piensa y selecciona correctamente
        </p>

        <div className="text-center mb-6">
          <span className="inline-block bg-white text-purple-700 px-7 py-3 rounded-full font-bold text-xl shadow-md border-2 border-purple-200">
            Ronda {rondaActual + 1} de {rondas.length}
          </span>
        </div>

        {!juegoTerminado && ronda && (
          <>
            <div className="bg-white/80 rounded-[2rem] p-6 mb-8 border-4 border-yellow-200 shadow-md">
              <h3 className="text-center text-4xl font-extrabold text-pink-600">
                {ronda.titulo}
              </h3>

              {ronda.tipo === "color" && (
                <p className="text-center text-purple-600 text-xl font-bold mt-3">
                  Selecciona 3 objetos correctos
                </p>
              )}
            </div>

            {ronda.tipo === "color" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
                {opcionesColor.map((opcion) => {
                  const estaSeleccionada = seleccionadas.includes(
                    opcion.imagen
                  );

                  return (
                    <button
                      key={opcion.imagen}
                      type="button"
                      onClick={() =>
                        seleccionarColor(opcion.imagen, opcion.correcta)
                      }
                      disabled={bloqueado}
                      className={`rounded-[2rem] p-6 border-4 shadow-lg transition-all hover:scale-105 ${
                        estaSeleccionada
                          ? "bg-green-100 border-green-400"
                          : "bg-white hover:bg-yellow-50 border-purple-200"
                      }`}
                    >
                      <img
                        src={opcion.imagen}
                        alt="Objeto"
                        className="w-[230px] h-[230px] mx-auto object-contain"
                      />

                      {estaSeleccionada && (
                        <div className="text-4xl mt-2">✅</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {ronda.tipo === "tamano" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {opcionesTamano.map((opcion) => (
                  <button
                    key={opcion.imagen}
                    type="button"
                    onClick={() => seleccionarTamano(opcion.correcta)}
                    disabled={bloqueado}
                    className="rounded-[2rem] p-8 border-4 border-purple-200 bg-white hover:bg-yellow-50 shadow-lg transition-all hover:scale-105"
                  >
                    <img
                      src={opcion.imagen}
                      alt="Objeto por tamaño"
                      className="w-[360px] h-[360px] mx-auto object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {mensaje && (
          <div className="mt-8 text-center">
            <div className="inline-block text-4xl font-extrabold text-purple-700 bg-white px-8 py-4 rounded-full shadow-md border-4 border-yellow-200">
              {mensaje}
            </div>
          </div>
        )}

        {juegoTerminado && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onFinalizar}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-5 rounded-full text-2xl shadow-lg"
            >
              Finalizar Juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}