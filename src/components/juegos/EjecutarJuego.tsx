"use client";

import type { ReactNode } from "react";

import ColoresMagicos from "@/components/juegos/ColoresMagicos";
import SonidosAnimales from "@/components/juegos/SonidosAnimales";
import FormasDivertidas from "@/components/juegos/FormasDivertidas";
import DondeEstaOsito from "@/components/juegos/DondeEstaOsito";
import CaritasFelices from "@/components/juegos/CaritasFelices";
import CuentaConmigo from "@/components/juegos/CuentaConmigo";
import MemoriaVisual from "@/components/juegos/MemoriaVisual";
import FigurasPosiciones from "@/components/juegos/FigurasPosiciones";
import RutinasDiarias from "@/components/juegos/RutinasDiarias";
import TrabajemosJuntos from "@/components/juegos/TrabajemosJuntos";
import ConstruyePalabras from "@/components/juegos/ConstruyePalabras";
import SecuenciasDivertidas from "@/components/juegos/SecuenciasDivertidas";
import AsociacionImagenPalabra from "@/components/juegos/AsociacionImagenPalabra";
import RompecabezasInteligente from "@/components/juegos/RompecabezasInteligente";
import EmocionesAccion from "@/components/juegos/EmocionesAccion";
import LasVocalesPerdidas from "@/components/juegos/LasVocalesPerdidas";
import ClasificaAgrupa from "@/components/juegos/ClasificaAgrupa";
import ElIntruso from "@/components/juegos/ElIntruso";
import type { ConfiguracionColoresMagicos } from "@/components/personalizacion-juegos/PersonalizarColoresMagicos";
import type { ConfiguracionSonidosAnimales } from "@/components/personalizacion-juegos/PersonalizarSonidosAnimales";

type Juego = {
  nombre: string;
};
type ConfiguracionJuego =
  | ConfiguracionColoresMagicos
  | ConfiguracionSonidosAnimales;

type Props = {
  juego: Juego;
  configuracionPersonalizada: ConfiguracionJuego | null;
  onFinalizar: () => void;
};

export default function EjecutarJuego({
  juego,
  configuracionPersonalizada,
  onFinalizar,
}: Props) {
  const propsBasicos = { onFinalizar };

  const juegos: Record<string, ReactNode> = {
    "Colores Mágicos": (
      <ColoresMagicos
            configuracion={
                configuracionPersonalizada as ConfiguracionColoresMagicos | undefined
            }
            onFinalizar={onFinalizar}
            />
    ),
    "Sonidos de Animales": (
        <SonidosAnimales
            configuracion={
            configuracionPersonalizada as ConfiguracionSonidosAnimales | undefined
            }
            onFinalizar={onFinalizar}
        />
        ),
    "Formas Divertidas": <FormasDivertidas {...propsBasicos} />,
    "¿Dónde está el Osito?": <DondeEstaOsito {...propsBasicos} />,
    "Caritas Felices": <CaritasFelices {...propsBasicos} />,
    "Cuenta Conmigo": <CuentaConmigo {...propsBasicos} />,
    "Memoria Visual": <MemoriaVisual {...propsBasicos} />,
    "Figuras y Posiciones": <FigurasPosiciones {...propsBasicos} />,
    "Rutinas Diarias": <RutinasDiarias {...propsBasicos} />,
    "Trabajemos Juntos": <TrabajemosJuntos {...propsBasicos} />,
    "Construye Palabras": <ConstruyePalabras {...propsBasicos} />,
    "Secuencias Divertidas": <SecuenciasDivertidas {...propsBasicos} />,
    "Asociación Imagen-Palabra": <AsociacionImagenPalabra {...propsBasicos} />,
    "Rompecabezas Inteligente": <RompecabezasInteligente {...propsBasicos} />,
    "Emociones en Acción": <EmocionesAccion {...propsBasicos} />,
    "Las Vocales Perdidas": <LasVocalesPerdidas {...propsBasicos} />,
    "Clasifica y Agrupa": <ClasificaAgrupa {...propsBasicos} />,
    "Pequeños Retos": <ElIntruso {...propsBasicos} />,
  };

  return juegos[juego.nombre] ?? null;
}