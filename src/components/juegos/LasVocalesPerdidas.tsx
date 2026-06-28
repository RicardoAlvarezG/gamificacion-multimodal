"use client";

import { useMemo, useState } from "react";
import type { ConfiguracionVocalesPerdidas } from "../personalizacion-juegos/PersonalizarVocalesPerdidas";

type Props = {
  configuracion?: ConfiguracionVocalesPerdidas;
  onFinalizar: () => void;
};

type Vocal = "A" | "E" | "I" | "O" | "U";

type ImagenObjeto = {
  nombre: string;
  vocal: Vocal;
  imagen: string;
};

const vocales: Vocal[] = ["A", "E", "I", "O", "U"];

const imagenesPorVocal: Record<Vocal, ImagenObjeto[]> = {
  A: [
    { nombre: "Abeja", vocal: "A", imagen: "/juegos/vocales/abeja.webp" },
    { nombre: "Aguacate", vocal: "A", imagen: "/juegos/vocales/aguacate.webp" },
    { nombre: "Anillo", vocal: "A", imagen: "/juegos/vocales/anillo.webp" },
    { nombre: "Araña", vocal: "A", imagen: "/juegos/vocales/arana.webp" },
    { nombre: "Árbol", vocal: "A", imagen: "/juegos/vocales/arbol.webp" },
    { nombre: "Arco", vocal: "A", imagen: "/juegos/vocales/arco.webp" },
    { nombre: "Arcoíris", vocal: "A", imagen: "/juegos/vocales/arcoiris.webp" },
    { nombre: "Ardilla", vocal: "A", imagen: "/juegos/vocales/ardilla.webp" },
    { nombre: "Arena", vocal: "A", imagen: "/juegos/vocales/arena.webp" },
    { nombre: "Arroz", vocal: "A", imagen: "/juegos/vocales/arroz.webp" },
    { nombre: "Ambulancia", vocal: "A", imagen: "/juegos/vocales/ambulancia.webp" },
    { nombre: "Avión", vocal: "A", imagen: "/juegos/vocales/avion.webp" },
    { nombre: "Avioneta", vocal: "A", imagen: "/juegos/vocales/avioneta.webp" },
  ],
  E: [
    { nombre: "Elefante", vocal: "E", imagen: "/juegos/vocales/elefante.webp" },
    { nombre: "Escalera", vocal: "E", imagen: "/juegos/vocales/escalera.webp" },
    { nombre: "Escoba", vocal: "E", imagen: "/juegos/vocales/escoba.webp" },
    { nombre: "Escudo", vocal: "E", imagen: "/juegos/vocales/escudo.webp" },
    { nombre: "Escuela", vocal: "E", imagen: "/juegos/vocales/escuela.webp" },
    { nombre: "Escritorio", vocal: "E", imagen: "/juegos/vocales/escritorio.webp" },
    { nombre: "Espejo", vocal: "E", imagen: "/juegos/vocales/espejo.webp" },
    { nombre: "Esponja", vocal: "E", imagen: "/juegos/vocales/esponja.webp" },
    { nombre: "Estrella", vocal: "E", imagen: "/juegos/vocales/estrella.webp" },
    { nombre: "Estufa", vocal: "E", imagen: "/juegos/vocales/estufa.webp" },
    { nombre: "Erizo", vocal: "E", imagen: "/juegos/vocales/erizo.webp" },
    { nombre: "Ensalada", vocal: "E", imagen: "/juegos/vocales/ensalada.webp" },
    { nombre: "Enchufe", vocal: "E", imagen: "/juegos/vocales/enchufe.webp" },
  ],
  I: [
    { nombre: "Iglesia", vocal: "I", imagen: "/juegos/vocales/iglesia.webp" },
    { nombre: "Iguana", vocal: "I", imagen: "/juegos/vocales/iguana.webp" },
    { nombre: "Iglú", vocal: "I", imagen: "/juegos/vocales/iglu.webp" },
    { nombre: "Iceberg", vocal: "I", imagen: "/juegos/vocales/iceberg.webp" },
    { nombre: "Imán", vocal: "I", imagen: "/juegos/vocales/iman.webp" },
    { nombre: "Isla", vocal: "I", imagen: "/juegos/vocales/isla.webp" },
    { nombre: "Insecto", vocal: "I", imagen: "/juegos/vocales/insecto.webp" },
    { nombre: "Incendio", vocal: "I", imagen: "/juegos/vocales/incendio.webp" },
    { nombre: "Impresora", vocal: "I", imagen: "/juegos/vocales/impresora.webp" },
    { nombre: "Instrumento", vocal: "I", imagen: "/juegos/vocales/instrumento.webp" },
    { nombre: "Impermeable", vocal: "I", imagen: "/juegos/vocales/impermeable.webp" },
    { nombre: "Inyección", vocal: "I", imagen: "/juegos/vocales/inyeccion.webp" },
    { nombre: "Invierno", vocal: "I", imagen: "/juegos/vocales/invierno.webp" },
  ],
  O: [
    { nombre: "Ojo", vocal: "O", imagen: "/juegos/vocales/ojo.webp" },
    { nombre: "Oso", vocal: "O", imagen: "/juegos/vocales/oso.webp" },
    { nombre: "Oveja", vocal: "O", imagen: "/juegos/vocales/oveja.webp" },
    { nombre: "Océano", vocal: "O", imagen: "/juegos/vocales/oceano.webp" },
    { nombre: "Ocho", vocal: "O", imagen: "/juegos/vocales/ocho.webp" },
    { nombre: "Olla", vocal: "O", imagen: "/juegos/vocales/olla.webp" },
    { nombre: "Olivo", vocal: "O", imagen: "/juegos/vocales/olivo.webp" },
    { nombre: "Ombligo", vocal: "O", imagen: "/juegos/vocales/ombligo.webp" },
    { nombre: "Oreja", vocal: "O", imagen: "/juegos/vocales/oreja.webp" },
    { nombre: "Oruga", vocal: "O", imagen: "/juegos/vocales/oruga.webp" },
    { nombre: "Orquesta", vocal: "O", imagen: "/juegos/vocales/orquesta.webp" },
    { nombre: "Orquídea", vocal: "O", imagen: "/juegos/vocales/orquidea.webp" },
    { nombre: "Ovni", vocal: "O", imagen: "/juegos/vocales/ovni.webp" },
  ],
  U: [
    { nombre: "Ukelele", vocal: "U", imagen: "/juegos/vocales/ukelele.webp" },
    { nombre: "Unicornio", vocal: "U", imagen: "/juegos/vocales/unicornio.webp" },
    { nombre: "Uva", vocal: "U", imagen: "/juegos/vocales/uva.webp" },
    { nombre: "Uniforme", vocal: "U", imagen: "/juegos/vocales/uniforme.webp" },
    { nombre: "Uno", vocal: "U", imagen: "/juegos/vocales/uno.webp" },
    { nombre: "Urna", vocal: "U", imagen: "/juegos/vocales/urna.webp" },
    { nombre: "Universo", vocal: "U", imagen: "/juegos/vocales/universo.webp" },
    { nombre: "Utensilios", vocal: "U", imagen: "/juegos/vocales/utensilios.webp" },
    { nombre: "Uña", vocal: "U", imagen: "/juegos/vocales/uña.webp" },
    { nombre: "Uniforme escolar", vocal: "U", imagen: "/juegos/vocales/uniforme_escolar.webp" },
    { nombre: "Unicornio bebé", vocal: "U", imagen: "/juegos/vocales/unicornio_bebe.webp" },
    { nombre: "Uvas", vocal: "U", imagen: "/juegos/vocales/uvas.webp" },
    { nombre: "UFO", vocal: "U", imagen: "/juegos/vocales/ufo.webp" },
  ],
};

const imagenVocal: Record<Vocal, string> = {
  A: "/juegos/vocales/A.webp",
  E: "/juegos/vocales/E.webp",
  I: "/juegos/vocales/I.webp",
  O: "/juegos/vocales/O.webp",
  U: "/juegos/vocales/U.webp",
};

function mezclar<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function elegirAleatorio<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function obtenerBanco(configuracion?: ConfiguracionVocalesPerdidas) {
  const todas = vocales.flatMap((vocal) => imagenesPorVocal[vocal]);

  if (!configuracion || configuracion.imagenes.length === 0) {
    return vocales.map((vocal) => elegirAleatorio(imagenesPorVocal[vocal]));
  }

  return todas.filter((item) =>
    configuracion.imagenes.includes(
      item.imagen.replace("/juegos/vocales/", "").replace(".webp", "")
    )
  );
}

export default function LasVocalesPerdidas({
  configuracion,
  onFinalizar,
}: Props) {
  const [ronda, setRonda] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  const rondas = useMemo(() => mezclar(obtenerBanco(configuracion)), [configuracion]);
  const rondaActual = rondas[ronda];
  const vocalActual = rondaActual.vocal;

  const opciones = useMemo(() => {
    const distractores = mezclar(
      vocales
        .filter((v) => v !== vocalActual)
        .flatMap((v) => imagenesPorVocal[v])
    ).slice(0, 2);

    return mezclar([rondaActual, ...distractores]);
  }, [rondaActual, vocalActual]);

  const seleccionar = (opcion: ImagenObjeto) => {
    if (bloqueado) return;

    if (opcion.nombre === rondaActual.nombre) {
      setMensaje("¡Muy bien!");
      setBloqueado(true);

      setTimeout(() => {
        if (ronda + 1 >= rondas.length) {
          onFinalizar();
        } else {
          setRonda((prev) => prev + 1);
          setMensaje("");
          setBloqueado(false);
        }
      }, 1200);
    } else {
      setMensaje("Sigamos intentando");
    }
  };

  return (
    <div className="min-h-[600px] w-full rounded-3xl bg-gradient-to-br from-pink-100 via-yellow-100 to-sky-100 p-6 shadow-xl">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-full bg-white px-5 py-2 text-lg font-bold text-purple-700 shadow">
            Ronda {ronda + 1} de {rondas.length}
          </div>

          <button
            onClick={onFinalizar}
            className="rounded-full bg-red-400 px-5 py-2 font-bold text-white shadow transition hover:bg-red-500"
          >
            Finalizar juego
          </button>
        </div>

        <h2 className="mb-2 text-4xl font-extrabold text-purple-700">
          Las Vocales Perdidas
        </h2>

        <p className="mb-6 text-xl font-semibold text-slate-700">
          Selecciona la imagen que empieza con la vocal:
        </p>

        <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-4 shadow-lg">
          <img
            src={imagenVocal[vocalActual]}
            alt={`Vocal ${vocalActual}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {opciones.map((opcion) => (
            <button
              key={opcion.nombre}
              onClick={() => seleccionar(opcion)}
              disabled={bloqueado}
              className="rounded-3xl bg-white p-5 shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-70"
            >
              <div className="flex h-48 items-center justify-center">
                <img
                  src={opcion.imagen}
                  alt={opcion.nombre}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <p className="mt-4 text-2xl font-extrabold text-slate-700">
                {opcion.nombre}
              </p>
            </button>
          ))}
        </div>

        {mensaje && (
          <div
            className={`mx-auto w-fit rounded-full px-8 py-3 text-2xl font-extrabold shadow ${
              mensaje === "¡Muy bien!"
                ? "bg-green-400 text-white"
                : "bg-orange-300 text-white"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}