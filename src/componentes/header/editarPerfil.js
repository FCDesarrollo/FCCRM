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
  TableCell
} from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "10px",
    marginBottom: "20px"
  },
  buttons: {
    width: "100%",
    height: "100%",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF"
    }
  },
  textFields: {
    width: "100%"
  }
}));

export default function EditarPerfil(props) {
  const classes = useStyles();
  const usuarioDatos = props.usuarioDatos;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const [nombre, setNombre] = useState(usuarioDatos.nombre);
  const [apellidoPaterno, setApellidoPaterno] = useState(
    usuarioDatos.apellidop
  );
  const [apellidoMaterno, setApellidoMaterno] = useState(
    usuarioDatos.apellidom
  );
  const setLoading = props.setLoading;
  const [openMenuNotificaciones, setOpenMenuNotificaciones] = useState(false);
  const [{ data: menuData, loading: menuLoading, error: menuError }] = useAxios(
    {
      url: API_BASE_URL + `/menuWeb`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd
      }
    },
    {
      useCache: false
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

  if (menuLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (menuError) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenMenuNotificaciones = () => {
    setOpenMenuNotificaciones(true);
  };

  const handleCloseMenuNotificaciones = () => {
    setOpenMenuNotificaciones(false);
  };

  const getSubmenus = () => {
    return menuData.modulos.map(modulo => {
        return modulo.menus.map((menu) => {
            return menu.submenus.map(submenu => {
                return submenu.nombre_submenu;
            });
        });
    })
  }

  console.log(getSubmenus());

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
              maxLength: 20
            }}
            onChange={e => {
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
              maxLength: 20
            }}
            onChange={e => {
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
              maxLength: 20
            }}
            onChange={e => {
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
              maxLength: 20
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
              maxLength: 20
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
              maxLength: 20
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{ alignSelf: "center", textAlign: "center" }}
        >
          <FormControlLabel
            control={<SettingsIcon style={{ marginRight: "10px" }} />}
            label="Notificaciones"
            labelPlacement="end"
            onClick={() => {
              handleClickOpenMenuNotificaciones();
            }}
          />
        </Grid>
      </Grid>
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
                  <TableCell><strong>Submenú</strong></TableCell>
                  <TableCell align="right"><strong>Notificaciones</strong></TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
