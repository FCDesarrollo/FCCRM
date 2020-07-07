export const dataBaseErrores = error => {
  switch (error) {
    case 0:
      return "Sin error";
    case 1:
      return "RFC impreso no existe";
    case 2:
      return "Correo de usuario no existe";
    case 3:
      return "Contraseña incorrecta";
    case 4:
      return "Usuario sin permisos";
    case 5:
      return "Tipo de documento no valido";
    case 6:
      return "Código de verificación incorrecto";
    case 7:
      return "Usuario ya verificado";
    case 8:
      return "Sin permiso a la empresa";
    case 9:
      return "El registro no existe";
    case 10:
      return "No se pudieron enviar las notificaciones";
    case 11:
      return "Datos incorrectos (JSON)";
    case 12:
      return "No contiene el archivo file()";
    case 15:
      return "La carpeta del módulo no existe.";
    case 16:
      return "La carpeta del menú no existe.";
    case 17:
      return "La carpeta del submenú no existe.";
    case 21:
      return "La sucursal no existe.";
    case 30:
      return "Error de conexión.";
    case 31:
      return "No son archivos válidos.";
    case 32:
      return "Certificado mal.";
    case 33:
      return "Archivo Key mal.";
    case 34:
      return "No se pudo creó la carpeta.";
    case 35:
      return "No son pareja o contraseña incorrecta";
    case 36:
      return "No se logro obtener la fecha de vigencia del certificado.";
    case 37:
      return "Contraseña incorrecta.";
    case 38:
      return "No se logró validar el certificado.";
    case 39:
      return "El certificado ya está vencido.";
    case 40:
      return "RFC incorrecta.";
    case 41:
      return "El RFC ya está registrado.";
    case 42:
      return "Sin base de datos disponibles.";
    case 43:
      return "Error al crear las tablas.";
    case 44:
      return "Error al registrar la empresa.";
    case 46:
      return "No se pudieron crear las carpetas.";
    case 47:
      return "El usuario ya esta vinculado a esta empresa.";
    case 48:
      return "Ya existe un registro con ese concepto, folio y serie.";
    case 49:
      return "Error al validar el documento.";
    case 50:
      return "Documento no valido, favor de subir el correcto.";
    case 51:
      return "El archivo no es válido para este apartado.";
    case 52:
      return "El documento no tiene movimientos registrados.";
    case 53:
      return "Existen conceptos que no pertenecen al apartado actual.";
    case 54:
      return "Existen sucursales que no han sido dadas de alta.";
    case 55:
      return "Para eliminar un movimiento primero se tienen que eliminar todos sus abonos.";
    case 56:
      return "No se pueden eliminar ninguno de los cuatro perfiles principales.";
    case -1:
      return "El teléfono ya existe.";
    case -2:
      return "El correo electrónico ya existe.";
    default:
      return "Error inesperado";
  }
};
