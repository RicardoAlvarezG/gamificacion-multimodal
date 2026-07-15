export const PUNTOS_POR_ESTRELLA = 15;
export const PUNTAJE_MAXIMO_AVATAR = 2000;

export function calcularNivelCapacidad(puntos: number) {
  if (puntos >= 161) return "DESTACADO";
  if (puntos >= 81) return "LOGRADO";
  if (puntos >= 41) return "EN_PROCESO";
  return "EN_INICIO";
}

export function calcularNivelAvatar(puntos: number) {
  const puntosLimitados = Math.min(
    puntos,
    PUNTAJE_MAXIMO_AVATAR
  );

  if (puntosLimitados >= 1701) return 6;
  if (puntosLimitados >= 1351) return 5;
  if (puntosLimitados >= 1001) return 4;
  if (puntosLimitados >= 651) return 3;
  if (puntosLimitados >= 301) return 2;
  return 1;
}

export function calcularPorcentajeCapacidad(
  puntos: number
): number {
  return Math.min(
    Math.round((puntos / 200) * 100),
    100
  );
}

export function calcularEstadoPorcentaje(
  porcentaje: number
): string {
  if (porcentaje >= 81) return "DESTACADO";
  if (porcentaje >= 61) return "LOGRADO";
  if (porcentaje >= 41) return "EN PROCESO";
  return "EN INICIO";
}