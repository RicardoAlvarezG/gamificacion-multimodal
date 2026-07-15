import { describe, it, expect } from "vitest";
import {
  calcularNivelCapacidad,
  calcularNivelAvatar,
  PUNTOS_POR_ESTRELLA,
  calcularPorcentajeCapacidad,
  calcularEstadoPorcentaje,
} from "../../src/lib/gamificacion";

describe("Lógica de gamificación", () => {

  it("Debe calcular correctamente el nivel de una capacidad", () => {
    expect(calcularNivelCapacidad(30)).toBe("EN_INICIO");
    expect(calcularNivelCapacidad(60)).toBe("EN_PROCESO");
    expect(calcularNivelCapacidad(100)).toBe("LOGRADO");
    expect(calcularNivelCapacidad(180)).toBe("DESTACADO");
  });

  it("Debe calcular correctamente el nivel del avatar", () => {
    expect(calcularNivelAvatar(0)).toBe(1);
    expect(calcularNivelAvatar(350)).toBe(2);
    expect(calcularNivelAvatar(700)).toBe(3);
    expect(calcularNivelAvatar(1100)).toBe(4);
    expect(calcularNivelAvatar(1500)).toBe(5);
    expect(calcularNivelAvatar(1900)).toBe(6);
  });

  it("Cada estrella debe otorgar 15 puntos", () => {
    expect(PUNTOS_POR_ESTRELLA).toBe(15);
  });


it("Debe calcular correctamente el porcentaje de una capacidad", () => {
  expect(calcularPorcentajeCapacidad(0)).toBe(0);
  expect(calcularPorcentajeCapacidad(100)).toBe(50);
  expect(calcularPorcentajeCapacidad(200)).toBe(100);
});

it("Debe calcular correctamente el estado según el porcentaje", () => {
  expect(calcularEstadoPorcentaje(20)).toBe("EN INICIO");
  expect(calcularEstadoPorcentaje(50)).toBe("EN PROCESO");
  expect(calcularEstadoPorcentaje(70)).toBe("LOGRADO");
  expect(calcularEstadoPorcentaje(90)).toBe("DESTACADO");
});


});