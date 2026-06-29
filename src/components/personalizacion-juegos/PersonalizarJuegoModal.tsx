"use client";

import type { ReactNode } from "react";
import PersonalizarColoresMagicos, {
  type ConfiguracionColoresMagicos,
} from "./PersonalizarColoresMagicos";

import PersonalizarSonidosAnimales, {
  type ConfiguracionSonidosAnimales,
} from "./PersonalizarSonidosAnimales";

import PersonalizarFormasDivertidas, {
  type ConfiguracionFormasDivertidas,
} from "./PersonalizarFormasDivertidas";

import PersonalizarDondeEstaOsito, {
  type ConfiguracionDondeEstaOsito,
} from "./PersonalizarDondeEstaOsito";

import PersonalizarCaritasFelices, {
  type ConfiguracionCaritasFelices,
} from "./PersonalizarCaritasFelices";

import PersonalizarClasificaAgrupa, {
  type ConfiguracionClasificaAgrupa,
} from "./PersonalizarClasificaAgrupa";

import PersonalizarVocalesPerdidas, {
  type ConfiguracionVocalesPerdidas,
} from "./PersonalizarVocalesPerdidas";

import PersonalizarCuentaConmigo, {
  type ConfiguracionCuentaConmigo,
} from "./PersonalizarCuentaConmigo";

import PersonalizarMemoriaVisual, {
  type ConfiguracionMemoriaVisual,
} from "./PersonalizarMemoriaVisual";

import PersonalizarFigurasPosiciones, {
  type ConfiguracionFigurasPosiciones,
} from "./PersonalizarFigurasPosiciones";

import PersonalizarRutinasDiarias, {
  type ConfiguracionRutinasDiarias,
} from "./PersonalizarRutinasDiarias";

import PersonalizarTrabajemosJuntos, {
  type ConfiguracionTrabajemosJuntos,
} from "./PersonalizarTrabajemosJuntos";

import PersonalizarConstruyePalabras, {
  type ConfiguracionConstruyePalabras,
} from "./PersonalizarConstruyePalabras";

import PersonalizarSecuenciasDivertidas, {
  type ConfiguracionSecuenciasDivertidas,
} from "./PersonalizarSecuenciasDivertidas";

import PersonalizarAsociacionImagenPalabra, {
  type ConfiguracionAsociacionImagenPalabra,
} from "./PersonalizarAsociacionImagenPalabra";

import PersonalizarRompecabezasInteligente, {
  type ConfiguracionRompecabezasInteligente,
} from "./PersonalizarRompecabezasInteligente";

import PersonalizarEmocionesAccion, {
  type ConfiguracionEmocionesAccion,
} from "./PersonalizarEmocionesAccion";

import PersonalizarElIntruso, {
  type ConfiguracionElIntruso,
} from "./PersonalizarElIntruso";

type Juego = {
  nombre: string;
};

type ConfiguracionJuego =
  | ConfiguracionColoresMagicos
  | ConfiguracionSonidosAnimales
  | ConfiguracionFormasDivertidas
  | ConfiguracionDondeEstaOsito
  | ConfiguracionCaritasFelices
  | ConfiguracionClasificaAgrupa
  | ConfiguracionVocalesPerdidas
  | ConfiguracionCuentaConmigo
  | ConfiguracionMemoriaVisual
  | ConfiguracionFigurasPosiciones
  | ConfiguracionRutinasDiarias
  | ConfiguracionTrabajemosJuntos
  | ConfiguracionConstruyePalabras
  | ConfiguracionSecuenciasDivertidas
  | ConfiguracionAsociacionImagenPalabra
  | ConfiguracionRompecabezasInteligente
  | ConfiguracionEmocionesAccion
  | ConfiguracionElIntruso;

type Props = {
  juego: Juego | null;
  abierto: boolean;
  configuracionInicial: ConfiguracionJuego | null;
  onGuardar: (configuracion: ConfiguracionJuego) => void;
  onCerrar: () => void;
};

export default function PersonalizarJuegoModal({
  juego,
  abierto,
  configuracionInicial,
  onGuardar,
  onCerrar,
}: Props) {
  if (!abierto || !juego) return null;

  const formularios: Record<string, ReactNode> = {
    "Colores Mágicos": (
    <PersonalizarColoresMagicos
        configuracionInicial={
        configuracionInicial as ConfiguracionColoresMagicos | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),
    "Sonidos de Animales": (
      <PersonalizarSonidosAnimales
        configuracionInicial={
        configuracionInicial as ConfiguracionSonidosAnimales | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),
    "Formas Divertidas": (
      <PersonalizarFormasDivertidas
        configuracionInicial={
          configuracionInicial as ConfiguracionFormasDivertidas | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),
    "¿Dónde está el Osito?": (
    <PersonalizarDondeEstaOsito
        configuracionInicial={
        configuracionInicial as ConfiguracionDondeEstaOsito | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),
    "Caritas Felices": (
    <PersonalizarCaritasFelices
        configuracionInicial={
        configuracionInicial as ConfiguracionCaritasFelices | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),

    "Clasifica y Agrupa": (
    <PersonalizarClasificaAgrupa
        configuracionInicial={
        configuracionInicial as ConfiguracionClasificaAgrupa | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),

    "Las Vocales Perdidas": (
    <PersonalizarVocalesPerdidas
        configuracionInicial={
        configuracionInicial as ConfiguracionVocalesPerdidas | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),

    "Cuenta Conmigo": (
    <PersonalizarCuentaConmigo
        configuracionInicial={
        configuracionInicial as ConfiguracionCuentaConmigo | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
    />
    ),

    "Memoria Visual": (
    <PersonalizarMemoriaVisual
      configuracionInicial={
        configuracionInicial as ConfiguracionMemoriaVisual | undefined
      }
      onGuardar={onGuardar}
      onCancelar={onCerrar}
    />
    ),

    "Figuras y Posiciones": (
      <PersonalizarFigurasPosiciones
        configuracionInicial={
          configuracionInicial as ConfiguracionFigurasPosiciones | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

    "Rutinas Diarias": (
      <PersonalizarRutinasDiarias
        configuracionInicial={
          configuracionInicial as ConfiguracionRutinasDiarias | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

    "Trabajemos Juntos": (
      <PersonalizarTrabajemosJuntos
        configuracionInicial={
          configuracionInicial as ConfiguracionTrabajemosJuntos | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

    "Construye Palabras": (
      <PersonalizarConstruyePalabras
        configuracionInicial={
          configuracionInicial as ConfiguracionConstruyePalabras | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

    "Secuencias Divertidas": (
      <PersonalizarSecuenciasDivertidas
        configuracionInicial={
          configuracionInicial as
            | ConfiguracionSecuenciasDivertidas
            | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

    "Asociación Imagen-Palabra": (
      <PersonalizarAsociacionImagenPalabra
        configuracionInicial={
          configuracionInicial as
            | ConfiguracionAsociacionImagenPalabra
            | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),
    "Rompecabezas Inteligente": (
      <PersonalizarRompecabezasInteligente
        configuracionInicial={
          configuracionInicial as
            | ConfiguracionRompecabezasInteligente
            | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),
    "Emociones en Acción": (
      <PersonalizarEmocionesAccion
        configuracionInicial={
          configuracionInicial as ConfiguracionEmocionesAccion | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),
    "Pequeños Retos": (
      <PersonalizarElIntruso
        configuracionInicial={
          configuracionInicial as ConfiguracionElIntruso | undefined
        }
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />
    ),

  };

  const formulario = formularios[juego.nombre];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 overflow-y-auto">
  <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl my-8">
        <h2 className="mb-2 text-3xl font-extrabold text-purple-700">
          ⚙ Personalizar juego
        </h2>

        <p className="mb-6 font-bold text-slate-600">{juego.nombre}</p>

        {formulario || (
          <p className="rounded-2xl bg-yellow-100 p-4 font-bold text-yellow-800">
            La personalización de este juego se agregará después.
          </p>
        )}
      </div>
    </div>
  );
}