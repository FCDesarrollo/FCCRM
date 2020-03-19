export const keyValidation = (e, tipo) => {
  const key = e.keyCode || e.which;
  const teclado = String.fromCharCode(key).toLowerCase();
  const letras = "áéíóúüabcdefghijklmnñopqrstuvwxyz";
  const espacio = " ";
  const numeros = "0123456789";
  const direccion = "#.,";
  const correo = "@-_.";
  const validos =
    tipo === 1
      ? letras + espacio
      : tipo === 2
      ? numeros
      : tipo === 3
      ? letras + espacio + numeros + direccion
      : tipo === 4
      ? letras + numeros + correo
      : letras + numeros;
  if (validos.indexOf(teclado) === -1) {
    e.preventDefault();
  }
};

export const pasteValidation = (e, tipo) => {
  const value = e.target.value;
  const letras = "áéíóúüabcdefghijklmnñopqrstuvwxyz";
  const espacio = " ";
  const numeros = "0123456789";
  const direccion = "#.,";
  const correo = "@-_.";
  const validos =
    tipo === 1
      ? letras + espacio
      : tipo === 2
      ? numeros
      : tipo === 3
      ? letras + espacio + numeros + direccion
      : tipo === 4
      ? letras + numeros + correo
      : letras + numeros;
  let aprovadas = "";
  for (let x = 0; x < value.length; x++) {
    if (validos.indexOf(value[x].toLowerCase()) !== -1) {
      aprovadas += value[x];
    }
  }
  document.getElementById([e.target.id]).value = aprovadas;
};

export const doubleKeyValidation = (e, decimalsNumber) => {
  const key = e.keyCode || e.which;
  const teclado = String.fromCharCode(key).toLowerCase();
  const validos = "0123456789.";
  if (
    (e.target.value.indexOf(".") !== -1 && teclado === ".") ||
    (e.target.value.indexOf(".") !== -1 &&
      e.target.value.indexOf(".") + decimalsNumber < e.target.value.length &&
      e.target.value.indexOf(".") < e.target.selectionStart)
  ) {
    e.preventDefault();
  }
  if (validos.indexOf(teclado) === -1) {
    e.preventDefault();
  }
  if (teclado === "." && e.target.selectionStart === 0) {
    e.preventDefault();
  }
};

export const doublePasteValidation = (e, decimalsNumber) => {
  const value = e.target.value;
  const validos = "0123456789.";
  let aprovadas = "";
  let validacion = true;
  let numeroPuntos = 0;
  for (let x = 0; x < value.length; x++) {
    validacion = true;
    if (value[x] === ".") {
      numeroPuntos++;
    }
    if (validos.indexOf(value[x]) === -1) {
      validacion = false;
    }
    if (value[x] === "." && numeroPuntos > 1) {
      validacion = false;
    }
    if (numeroPuntos >= 1 && value.indexOf(".") + decimalsNumber < x) {
      validacion = false;
    }
    if (validacion) {
      aprovadas += value[x];
    }
  }
  document.getElementById([e.target.id]).value = aprovadas;
};

export const validarCorreo = correo => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    correo
  )
    ? true
    : false;
};
