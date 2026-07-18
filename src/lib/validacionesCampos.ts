export const limpiarLetras = (valor: string) =>
  valor.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]/g, "");

export const limpiarLetrasNumeros = (valor: string) =>
  valor.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9\s]/g, "");

export const limpiarUsuario = (valor: string) =>
  valor.replace(/[^A-Za-z0-9]/g, "");

export const normalizarEspacios = (valor: string) =>
  valor.trim().replace(/\s+/g, " ");

export const soloLetras = (valor: string) =>
  /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?: [A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/.test(valor);

export const soloLetrasNumeros = (valor: string) =>
  /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9]+(?: [A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9]+)*$/.test(
    valor
  );

export const soloUsuario = (valor: string) =>
  /^[A-Za-z0-9]+$/.test(valor);