import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  keyValidation,
  pasteValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Divider,
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import swal from "sweetalert";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import LoadingComponent from "../componentsHelpers/loadingComponent";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "10px",
    height: "100%",
    width: "100%",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
    textAlign: "centerx",
  },
  textFields: {
    width: "100%",
  },
  buttons: {
    width: "100%",
    height: "100%",
    marginTop: "5px",
    marginBottom: "5px",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF",
    },
  },
}));

export default function OlvidoContra() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [correo, setCorreo] = useState("");
  const [paso, setPaso] = useState(1);
  const [contra, setContra] = useState("");
  const [repiteContra, setRepiteContra] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState("");

  const [
    {
      data: olvidoContraData,
      loading: olvidoContraLoading,
      error: olvidoContraError,
    },
    executeOlvidoContra,
  ] = useAxios(
    {
      url: API_BASE_URL + `/olvidoContra`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (olvidoContraData) {
      if (olvidoContraData.error !== 0) {
        swal("Error", dataBaseErrores(olvidoContraData.error), "warning");
      } else {
        if (olvidoContraData.paso === 1) {
          setCodigoEnviado(olvidoContraData.codigo);
          setPaso(2);
        } else {
          swal(
            "Contraseña Cambiada",
            "Contraseña cambiada con éxito",
            "success"
          );
          setRedirect(true);
        }
      }
    }
  }, [olvidoContraData]);

  if (olvidoContraLoading) {
    return <LoadingComponent />;
  }
  if (olvidoContraError) {
    return <ErrorQueryDB />;
  }

  const enviarCorreo = () => {
    if (correo.trim() === "") {
      swal("Error", "Ingrese un correo", "warning");
    } else if (!validarCorreo(correo.trim())) {
      swal("Error", "Ingrese un correo valido", "warning");
    } else {
      executeOlvidoContra({
        data: {
          paso: 1,
          correo: correo.trim(),
        },
      });
    }
  };

  const cambiarContra = () => {
    if (contra.trim() === "") {
      swal("Error", "Ingrese una contraseña", "warning");
    } else if (repiteContra.trim() === "") {
      swal("Error", "Vuelva a ingresar la contraseña", "warning");
    } else if (repiteContra.trim() !== contra.trim()) {
      swal("Error", "Las contraseñas no coinciden", "warning");
    } else if (codigo.trim() === "") {
      swal("Error", "Ingrese un código de confirmación", "warning");
    } else if (parseInt(codigo.trim()) !== codigoEnviado) {
      swal("Error", "Código de confirmación incorrecto", "warning");
    } else {
      executeOlvidoContra({
        data: {
          paso: 2,
          correo: correo.trim(),
          password: contra.trim(),
        },
      });
    }
  };

  return redirect ? (
    <Redirect to="login" />
  ) : (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={10} md={6}>
        <Card style={{ padding: "15px", marginTop: "20px" }}>
          {paso === 1 ? (
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12} md={1} style={{ padding: 0 }}>
                <Link to="/login">
                  <Tooltip title="Regresar al login">
                    <IconButton style={{ float: "left" }}>
                      <ArrowBackIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </Link>
              </Grid>
              <Grid item xs={12} md={11}>
                <Typography variant="h6" className={classes.title}>
                  Ingresa un correo valido
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="correo"
                  label="Correo"
                  variant="outlined"
                  type="text"
                  margin="normal"
                  value={correo}
                  inputProps={{
                    maxLength: 50,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 4);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 4);
                    setCorreo(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  style={{
                    background: "#17A2B8",
                    color: "#FFFFFF",
                    float: "right",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    enviarCorreo();
                  }}
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12} md={1} style={{ padding: 0 }}>
                <Tooltip title="Regresar">
                  <IconButton
                    style={{ float: "left" }}
                    onClick={() => {
                      setPaso(1);
                    }}
                  >
                    <ArrowBackIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={11}>
                <Typography variant="h6" className={classes.title}>
                  Se ha enviado un código de verificación al correo ingresado.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="contra"
                  label="Contraseña"
                  variant="outlined"
                  type="password"
                  margin="normal"
                  value={contra}
                  inputProps={{
                    maxLength: 20,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 3);
                    setContra(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="repiteContra"
                  label="Repita la Contraseña"
                  variant="outlined"
                  type="password"
                  margin="normal"
                  value={repiteContra}
                  inputProps={{
                    maxLength: 20,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 3);
                    setRepiteContra(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="codigo"
                  label="Código De Confirmación"
                  variant="outlined"
                  type="text"
                  margin="normal"
                  value={codigo}
                  inputProps={{
                    maxLength: 10,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 2);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 2);
                    setCodigo(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  style={{
                    background: "#17A2B8",
                    color: "#FFFFFF",
                    float: "right",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    cambiarContra();
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}
