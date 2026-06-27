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

type Juego = {
  nombre: string;
};

type ConfiguracionJuego =
  | ConfiguracionColoresMagicos
  | ConfiguracionSonidosAnimales
  | ConfiguracionFormasDivertidas
  | ConfiguracionDondeEstaOsito
  | ConfiguracionCaritasFelices;

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

  };

  const formulario = formularios[juego.nombre];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
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