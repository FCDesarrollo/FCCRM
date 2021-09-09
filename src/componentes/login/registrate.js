import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import swal from "sweetalert";
import {
  keyValidation,
  pasteValidation,
  validarCorreo
} from "../../helpers/inputHelpers";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
const jwt = require("jsonwebtoken");

const useStyles = makeStyles(theme => ({
  root: {
    padding: "10px"
  },
  buttons: {
    width: "100%",
    marginBottom: "20px"
  },
  textFields: {
    width: "100%"
  }
}));

export default function Registrate() {
  const classes = useStyles();
  const [registroData, setRegistroData] = useState({
    idusuario: 0,
    nombre: "",
    apellidop: "",
    apellidom: "",
    cel: "",
    correo: "",
    password: "",
    identificador: Math.floor(Math.random() * 1000000),
    status: 1
  });
  const { nombre, apellidop, apellidom, cel, correo, password, identificador } = registroData;
  const [disabledButton, setDisabledButton] = useState(false);
  const [redirectCodigoValidacion, setRedirectCodigoValidacion] = useState(
    false
  );
  const inputNombre = useRef(null);
  const inputAP = useRef(null);
  const inputAM = useRef(null);
  const inputTelefono = useRef(null);
  const inputCorreo = useRef(null);
  const inputContra = useRef(null);
  const [
    {
      data: registrateData,
      loading: registrateLoading,
      error: registrateError
    },
    executeRegistrate
  ] = useAxios(
    {
      url: "http://apicrm.dublock.com/registrarUsuario",
      method: "POST"
    },
    { manual: true }
  );

  useEffect(() => {
    if (registrateData) {
      if (registrateData.error !== 0) {
        swal("Error", dataBaseErrores(registrateData.error), "error");
      } else {
        swal(
          "Registro correcto",
          "Se envió un código de confirmación al correo "+correo,
          "success"
        ).then(() => {
          const usuarioToken = jwt.sign(
            { usuario: correo },
            "mysecretpassword"
          );
          localStorage.setItem("usuarioToken", usuarioToken);
          setRedirectCodigoValidacion(true);
        });
      }
    }
  }, [registrateData, correo, identificador]);

  if (registrateLoading) {
    return <CircularProgress />;
  }
  if (registrateError) {
    return "Error";
  }

  const registrar = () => {
    setDisabledButton(true);
    if (nombre.trim() === "") {
      swal("Faltan llenar campos", "Ingrese un nombre", "warning").then(() => {
        setRegistroData({
          ...registroData,
          nombre: ""
        });
        inputNombre.current.focus();
      });
      setDisabledButton(false);
    } else if (apellidop.trim() === "") {
      swal(
        "Faltan llenar campos",
        "Ingrese un apellido paterno",
        "warning"
      ).then(() => {
        setRegistroData({
          ...registroData,
          apellidop: ""
        });
        inputAP.current.focus();
      });
      setDisabledButton(false);
    } else if (apellidom.trim() === "") {
      swal(
        "Faltan llenar campos",
        "Ingrese un apellido materno",
        "warning"
      ).then(() => {
        setRegistroData({
          ...registroData,
          apellidom: ""
        });
        inputAM.current.focus();
      });
      setDisabledButton(false);
    } else if (cel.trim() === "") {
      swal(
        "Faltan llenar campos",
        "Ingrese un teléfono paterno",
        "warning"
      ).then(() => {
        setRegistroData({
          ...registroData,
          cel: ""
        });
        inputTelefono.current.focus();
      });
      setDisabledButton(false);
    } else if (correo.trim() === "") {
      swal(
        "Faltan llenar campos",
        "Ingrese un correo electrónico",
        "warning"
      ).then(() => {
        setRegistroData({
          ...registroData,
          correo: ""
        });
        inputCorreo.current.focus();
      });
      setDisabledButton(false);
    } else if (!validarCorreo(correo.trim())) {
      swal(
        "Faltan llenar campos",
        "Ingrese un correo electrónico valido",
        "warning"
      ).then(() => {
        inputCorreo.current.focus();
      });
      setDisabledButton(false);
    } else if (password.trim() === "") {
      swal("Faltan llenar campos", "Ingrese una contraseña", "warning").then(
        () => {
          setRegistroData({
            ...registroData,
            password: ""
          });
          inputContra.current.focus();
        }
      );
      setDisabledButton(false);
    } else {
      executeRegistrate({
        data: registroData
      });
      setDisabledButton(false);
    }
  };

  return redirectCodigoValidacion ? (
    <Redirect to="/verificarCodigo" />
  ) : (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={10} sm={6}>
        <Card>
          <CardContent>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={8}>
                <Typography variant="h6">Registro</Typography>
              </Grid>
              <Grid item xs={4} style={{ padding: 0 }}>
                <Link to="/login">
                  <Tooltip title="Regresar al login">
                    <IconButton style={{ float: "right" }}>
                      <ArrowBackIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="nombre"
                  variant="outlined"
                  label="Nombre(s)"
                  type="text"
                  required
                  value={nombre}
                  inputProps={{
                    maxLength: 70,
                    ref: inputNombre
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 1);
                  }}
                  onChange={e => {
                    pasteValidation(e, 1);
                    setRegistroData({
                      ...registroData,
                      nombre: e.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="apellidop"
                  variant="outlined"
                  label="Apellido Paterno"
                  type="text"
                  required
                  value={apellidop}
                  inputProps={{
                    maxLength: 70,
                    ref: inputAP
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 1);
                  }}
                  onChange={e => {
                    pasteValidation(e, 1);
                    setRegistroData({
                      ...registroData,
                      apellidop: e.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="apellidom"
                  variant="outlined"
                  label="Apellido Materno"
                  type="text"
                  required
                  value={apellidom}
                  inputProps={{
                    maxLength: 70,
                    ref: inputAM
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 1);
                  }}
                  onChange={e => {
                    pasteValidation(e, 1);
                    setRegistroData({
                      ...registroData,
                      apellidom: e.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="cel"
                  variant="outlined"
                  label="Teléfono"
                  type="text"
                  required
                  value={cel}
                  inputProps={{
                    maxLength: 70,
                    ref: inputTelefono
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 2);
                  }}
                  onChange={e => {
                    pasteValidation(e, 2);
                    setRegistroData({
                      ...registroData,
                      cel: e.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="correo"
                  variant="outlined"
                  label="Correo Electrónico"
                  type="text"
                  required
                  value={correo}
                  inputProps={{
                    maxLength: 70,
                    ref: inputCorreo
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 4);
                  }}
                  onChange={e => {
                    pasteValidation(e, 4);
                    setRegistroData({
                      ...registroData,
                      correo: e.target.value
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <TextField
                  className={classes.textFields}
                  id="password"
                  variant="outlined"
                  label="Contraseña"
                  type="password"
                  required
                  value={password}
                  inputProps={{
                    maxLength: 70,
                    ref: inputContra
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 5);
                  }}
                  onChange={e => {
                    pasteValidation(e, 5);
                    setRegistroData({
                      ...registroData,
                      password: e.target.value
                    });
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container justify="center">
              <Grid item xs={12} lg={10}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={disabledButton}
                  className={classes.buttons}
                  onClick={() => {
                    registrar();
                  }}
                >
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
