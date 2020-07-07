import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  TextField,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  DialogActions,
} from "@material-ui/core";
import {
  VpnKey as VpnKeyIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
const jwt = require("jsonwebtoken");

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "10px",
    marginBottom: "20px",
  },
  buttons: {
    width: "100%",
    height: "100%",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF",
    },
  },
  textFields: {
    width: "100%",
  },
}));

export default function EditarPerfil(props) {
  const classes = useStyles();
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const statusEmpresa = empresaDatos.statusempresa;
  const rfc = empresaDatos.RFC;
  const [nombre, setNombre] = useState(usuarioDatos.nombre);
  const [apellidoPaterno, setApellidoPaterno] = useState(
    usuarioDatos.apellidop
  );
  const [apellidoMaterno, setApellidoMaterno] = useState(
    usuarioDatos.apellidom
  );
  const setLoading = props.setLoading;
  const [openMenuContra, setOpenMenuContra] = useState(false);
  const [contraNueva, setContraNueva] = useState("");
  const [repiteContraNueva, setRepiteContraNueva] = useState("");
  const [openMenuNotificaciones, setOpenMenuNotificaciones] = useState(false);
  const [{ data: menuData, loading: menuLoading, error: menuError }] = useAxios(
    {
      url: API_BASE_URL + `/menuWeb`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: cambiarContraUsuarioData,
      loading: cambiarContraUsuarioLoading,
      error: cambiarContraUsuarioError,
    },
    executeCambiarContraUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarContraUsuario`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (menuData) {
        if (menuData.error !== 0) {
          swal("Error", dataBaseErrores(menuData.error), "warning");
        }
      }
    }

    checkData();
  }, [menuData]);

  useEffect(() => {
    function checkData() {
      if (cambiarContraUsuarioData) {
        if (cambiarContraUsuarioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarContraUsuarioData.error),
            "warning"
          );
        } else {
          swal(
            "Contraseña Cambiada",
            "La contraseña se ha cambiado con éxito",
            "success"
          );
          const token = jwt.sign(
            { userData: cambiarContraUsuarioData.usuario[0] },
            "mysecretpassword",
            {
              expiresIn: 60 * 60 * 24,
            }
          );
          localStorage.setItem("token", token);
        }
      }
    }

    checkData();
  }, [cambiarContraUsuarioData]);

  if (menuLoading || cambiarContraUsuarioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (menuError || cambiarContraUsuarioError) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenMenuContra = () => {
    setOpenMenuContra(true);
  };

  const handleCloseMenuContra = () => {
    setOpenMenuContra(false);
  };

  const handleClickOpenMenuNotificaciones = () => {
    setOpenMenuNotificaciones(true);
  };

  const handleCloseMenuNotificaciones = () => {
    setOpenMenuNotificaciones(false);
  };

  /* const getSubmenus = () => {
    return menuData.modulos.map((modulo) => {
      return modulo.menus.map((menu) => {
        return menu.submenus.map((submenu) => {
          return submenu.nombre_submenu;
        });
      });
    });
  }; */

  const guardarNuevaContra = () => {
    if (contraNueva.trim() === "") {
      swal("Error", "Ingrese una contraseña", "warning");
    } else if (repiteContraNueva.trim() === "") {
      swal("Error", "Vuelva a ingresar la contraseña", "warning");
    } else if (repiteContraNueva.trim() !== contraNueva.trim()) {
      swal("Error", "La contraseñas no coinciden", "warning");
    } else {
      executeCambiarContraUsuario({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idsubmenu: 1,
          idusuario: idUsuario,
          password: contraNueva.trim(),
        },
      });
    }
  };

  return (
    <Card className={classes.card}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            className={classes.textFields}
            label="Nombre"
            value={nombre}
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            className={classes.textFields}
            label="Apellido Paterno"
            value={apellidoPaterno}
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
            onChange={(e) => {
              setApellidoPaterno(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            className={classes.textFields}
            label="Apellido Materno"
            value={apellidoMaterno}
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
            onChange={(e) => {
              setApellidoMaterno(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            className={classes.textFields}
            label="Correo Electrónico"
            disabled
            value={usuario}
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            className={classes.textFields}
            label="Teléfono Celular"
            disabled
            value={usuarioDatos.cel}
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            className={classes.textFields}
            label="Contraseña"
            disabled
            value={pwd}
            type="password"
            margin="normal"
            inputProps={{
              maxLength: 20,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={2}
          style={{ alignSelf: "center", textAlign: "center" }}
        >
          <FormControlLabel
            disabled={statusEmpresa !== 1}
            control={
              <VpnKeyIcon
                style={{ marginRight: "10px" }}
                color={statusEmpresa !== 1 ? "disabled" : "inherit"}
              />
            }
            label="Cambiar Contraseña"
            labelPlacement="end"
            onClick={() => {
              if (statusEmpresa === 1) {
                handleClickOpenMenuContra();
              }
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={2}
          style={{ alignSelf: "center", textAlign: "center" }}
        >
          <FormControlLabel
            disabled={statusEmpresa !== 1}
            control={
              <SettingsIcon
                style={{ marginRight: "10px" }}
                color={statusEmpresa !== 1 ? "disabled" : "inherit"}
              />
            }
            label="Notificaciones"
            labelPlacement="end"
            onClick={() => {
              if (statusEmpresa === 1) {
                handleClickOpenMenuNotificaciones();
              }
            }}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Button
            variant="contained"
            style={{
              background: "#17A2B8",
              color: "#FFFFFF",
              float: "right",
              marginBottom: "10px",
            }}
          >
            Guardar
          </Button>
        </Grid> */}
      </Grid>
      <Dialog
        onClose={handleCloseMenuContra}
        aria-labelledby="simple-dialog-title"
        open={openMenuContra}
      >
        <DialogTitle id="simple-dialog-title">Cambiar Contraseña</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="nuevaContra"
                className={classes.textFields}
                label="Nueva Contraseña"
                value={contraNueva}
                type="password"
                margin="normal"
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setContraNueva(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="repiteNuevaContra"
                className={classes.textFields}
                label="Confirme Nueva Contraseña"
                value={repiteContraNueva}
                type="password"
                margin="normal"
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setRepiteContraNueva(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuContra();
            }}
          >
            Cancelar
          </Button>
          <Button
            disabled={statusEmpresa !== 1}
            variant="contained"
            color="primary"
            onClick={() => {
              guardarNuevaContra();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseMenuNotificaciones}
        aria-labelledby="simple-dialog-title"
        open={openMenuNotificaciones}
      >
        <DialogTitle id="simple-dialog-title">
          Configuración De Notificaciones
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">
            En este apartado se enlistan todos los submenús de los cuales podrá
            configurar si desea recibir notificaciones tipo SMS, Email o a la
            aplicación móvil.
          </Typography>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell>
                    <strong>Submenú</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Notificaciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuNotificaciones();
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
