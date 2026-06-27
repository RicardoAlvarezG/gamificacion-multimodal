"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionClasificaAgrupa } from "@/components/personalizacion-juegos/PersonalizarClasificaAgrupa";

type RondaMultiple = {
  tipo: "color" | "forma";
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

type Ronda = RondaMultiple | RondaTamano;

type Props = {
  onFinalizar: () => void;
  configuracion?: ConfiguracionClasificaAgrupa;
};

const coloresTexto: Record<string, string> = {
  ROJO: "rojo",
  AZUL: "azul",
  VERDE: "verde",
  NARANJA: "naranja",
  AMARILLO: "amarillo",
  MORADO: "morado",
  ROSADO: "rosado",
};

const formasTexto: Record<string, string> = {
  CIRCULO: "círculos",
  CUADRADO: "cuadrados",
  TRIANGULO: "triángulos",
  RECTANGULO: "rectángulos",
  ROMBO: "rombos",
  OVALO: "óvalos",
  ESTRELLA: "estrellas",
  PENTAGONO: "pentágonos",
  HEXAGONO: "hexágonos",
  OCTOGONO: "octógonos",
};

const objetosTexto: Record<string, string> = {
  BARCO: "barco",
  CARRO: "carro",
  MANZANA: "manzana",
  OSO: "oso",
  PELOTA: "pelota",
  CASA: "casa",
  LIBRO: "libro",
  ARBOL: "árbol",
  FLOR: "flor",
  LAPIZ: "lápiz",
};

const objetosArchivo: Record<string, string> = {
  BARCO: "barco",
  CARRO: "carro",
  MANZANA: "manzana",
  OSO: "oso",
  PELOTA: "pelota",
  CASA: "casa",
  LIBRO: "libro",
  ARBOL: "arbol",
  FLOR: "flor",
  LAPIZ: "lapiz",
};

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function crearRondaColor(color: string, coloresDisponibles: string[]): RondaMultiple {
  const colorNombre = coloresTexto[color];

  const correctas = [1, 2, 3].map(
    (numero) => `/juegos/clasifica/color${colorNombre}${numero}.webp`
  );

  const distractores = mezclar(
    coloresDisponibles
      .filter((item) => item !== color)
      .flatMap((otroColor) =>
        [1, 2, 3].map(
          (numero) => `/juegos/clasifica/color${coloresTexto[otroColor]}${numero}.webp`
        )
      )
  ).slice(0, 3);

  return {
    tipo: "color",
    titulo: `Selecciona los objetos de color ${colorNombre}`,
    correctas,
    distractores,
  };
}

function crearRondaForma(
  forma: string,
  formasDisponibles: string[],
  coloresDisponibles: string[]
): RondaMultiple {
  const formaArchivo = forma.toLowerCase();
  const coloresParaForma = mezclar(coloresDisponibles).slice(0, 3);

  const correctas = coloresParaForma.map(
    (color) => `/juegos/clasifica/${formaArchivo}${coloresTexto[color]}.webp`
  );

  const distractores = mezclar(
    formasDisponibles
      .filter((item) => item !== forma)
      .flatMap((otraForma) =>
        mezclar(coloresDisponibles)
          .slice(0, 2)
          .map(
            (color) =>
              `/juegos/clasifica/${otraForma.toLowerCase()}${coloresTexto[color]}.webp`
          )
      )
  ).slice(0, 3);

  return {
    tipo: "forma",
    titulo: `Selecciona todos los ${formasTexto[forma]}`,
    correctas,
    distractores,
  };
}

function crearRondaTamano(objeto: string): RondaTamano {
  const archivo = objetosArchivo[objeto];
  const nombre = objetosTexto[objeto];

  return {
    tipo: "tamano",
    titulo: `Selecciona el ${nombre} grande`,
    correcta: `/juegos/clasifica/${archivo}grande.webp`,
    incorrecta: `/juegos/clasifica/${archivo}pequeño.webp`,
  };
}

export default function ClasificaAgrupa({
  onFinalizar,
  configuracion,
}: Props) {
  const rondas = useMemo<Ronda[]>(() => {
    if (!configuracion) {
      return [
        crearRondaColor("ROJO", ["ROJO", "AZUL", "VERDE", "NARANJA"]),
        crearRondaColor("AZUL", ["ROJO", "AZUL", "VERDE", "NARANJA"]),
        crearRondaTamano("OSO"),
        crearRondaTamano("CARRO"),
      ];
    }

    const nuevasRondas: Ronda[] = [];

    if (configuracion.categorias.includes("COLOR")) {
      const color = mezclar(configuracion.colores)[0];
      nuevasRondas.push(crearRondaColor(color, configuracion.colores));
    }

    if (configuracion.categorias.includes("FORMA")) {
      const forma = mezclar(configuracion.formas)[0];
      nuevasRondas.push(
        crearRondaForma(
          forma,
          configuracion.formas,
          configuracion.colores.length > 0
            ? configuracion.colores
            : ["ROJO", "AZUL", "VERDE", "NARANJA"]
        )
      );
    }

    if (configuracion.categorias.includes("TAMANO")) {
      const objeto = mezclar(configuracion.objetosTamano)[0];
      nuevasRondas.push(crearRondaTamano(objeto));
    }

    return nuevasRondas;
  }, [configuracion]);

  const [rondaActual, setRondaActual] = useState(0);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const ronda = rondas[rondaActual];

  const opcionesMultiple = useMemo(() => {
    if (!ronda || (ronda.tipo !== "color" && ronda.tipo !== "forma")) return [];

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

  const seleccionarMultiple = (imagen: string, correcta: boolean) => {
    if (
      bloqueado ||
      !ronda ||
      (ronda.tipo !== "color" && ronda.tipo !== "forma")
    )
      return;

    if (!correcta) {
      setMensaje("😊 Sigamos intentando");
      return;
    }

    if (seleccionadas.includes(imagen)) return;

    const nuevasSeleccionadas = [...seleccionadas, imagen];
    setSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === ronda.correctas.length) {
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

              {(ronda.tipo === "color" || ronda.tipo === "forma") && (
                <p className="text-center text-purple-600 text-xl font-bold mt-3">
                  Selecciona {ronda.correctas.length} objetos correctos
                </p>
              )}
            </div>

            {(ronda.tipo === "color" || ronda.tipo === "forma") && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
                {opcionesMultiple.map((opcion) => {
                  const estaSeleccionada = seleccionadas.includes(opcion.imagen);

                  return (
                    <button
                      key={opcion.imagen}
                      type="button"
                      onClick={() =>
                        seleccionarMultiple(opcion.imagen, opcion.correcta)
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