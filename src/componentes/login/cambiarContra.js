import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { Grid, Button, Typography, TextField, Card } from "@material-ui/core";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import LoadingComponent from "../componentsHelpers/loadingComponent";
import jwt from "jsonwebtoken";

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

export default function CambiarContra() {
  const classes = useStyles();
  const [contra, setContra] = useState("");
  const [repiteContra, setRepiteContra] = useState("");
  const [codigo, setCodigo] = useState("");
  const [idUsuarioRegistrado, setIdUsuarioRegistrado] = useState(-1);
  const [codigoUsuario, setCodigoUsuario] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (localStorage.getItem("usuarioRegistrado")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("usuarioRegistrado"),
        "mysecretpassword"
      );
      if (idUsuarioRegistrado === -1) {
        setIdUsuarioRegistrado(
          decodedToken.usuarioRegistrado.idUsuarioRegistrado
            ? decodedToken.usuarioRegistrado.idUsuarioRegistrado
            : 0
        );
      }
    } catch (err) {
      localStorage.removeItem("usuarioRegistrado");
    }
  } else {
    localStorage.removeItem("usuarioRegistrado");
    if (!redirect) {
      setRedirect(true);
    }
  }

  const [
    {
      data: traerNuevoUsuarioRegistradoData,
      loading: traerNuevoUsuarioRegistradoLoading,
      error: traerNuevoUsuarioRegistradoError,
    },
    executeTraerNuevoUsuarioRegistrado,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerNuevoUsuarioRegistrado`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: cambiarContraNuevoUsuarioRegistradoData,
      loading: cambiarContraNuevoUsuarioRegistradoLoading,
      error: cambiarContraNuevoUsuarioRegistradoError,
    },
    executeCambiarContraNuevoUsuarioRegistrado,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarContraNuevoUsuarioRegistrado`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (idUsuarioRegistrado !== -1) {
      executeTraerNuevoUsuarioRegistrado({
        params: {
          idusuario: idUsuarioRegistrado,
        },
      });
    }
  }, [idUsuarioRegistrado, executeTraerNuevoUsuarioRegistrado]);

  useEffect(() => {
    function checkData() {
      if (traerNuevoUsuarioRegistradoData) {
        if (traerNuevoUsuarioRegistradoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerNuevoUsuarioRegistradoData.error),
            "warning"
          );
        } else {
          if (traerNuevoUsuarioRegistradoData.usuario[0].tipo !== -1) {
            localStorage.removeItem("usuarioRegistrado");
            setRedirect(true);
          } else {
            setCodigoUsuario(
              traerNuevoUsuarioRegistradoData.usuario[0].identificador
            );
          }
        }
      }
    }

    checkData();
  }, [traerNuevoUsuarioRegistradoData]);

  useEffect(() => {
    function checkData() {
      if (cambiarContraNuevoUsuarioRegistradoData) {
        if (cambiarContraNuevoUsuarioRegistradoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarContraNuevoUsuarioRegistradoData.error),
            "warning"
          );
        } else {
          swal(
            "Contraseña Cambiada",
            "La contraseña se ha cambiado con éxito",
            "success"
          );
          localStorage.removeItem("usuarioRegistrado");
          setRedirect(true);
        }
      }
    }

    checkData();
  }, [cambiarContraNuevoUsuarioRegistradoData]);

  if (
    traerNuevoUsuarioRegistradoLoading ||
    cambiarContraNuevoUsuarioRegistradoLoading
  ) {
    return <LoadingComponent />;
  }
  if (
    traerNuevoUsuarioRegistradoError ||
    cambiarContraNuevoUsuarioRegistradoError
  ) {
    return <ErrorQueryDB />;
  }

  const cambiarContra = () => {
    if (contra.trim() === "") {
      swal("Error", "Ingrese una contraseña", "warning");
    } else if (repiteContra.trim() === "") {
      swal("Error", "Vuelva a ingresar la contraseña", "warning");
    } else if (repiteContra.trim() !== contra.trim()) {
      swal("Error", "Las contraseñas no coinciden", "warning");
    } else if (codigo.trim() === "") {
      swal("Error", "Ingrese un código de confirmación", "warning");
    } else if (codigo.trim() !== codigoUsuario) {
      swal("Error", "Código de confirmación incorrecto", "warning");
    } else {
      executeCambiarContraNuevoUsuarioRegistrado({
        data: {
          idusuario: idUsuarioRegistrado,
          password: contra,
        },
      });
    }
  };

  return redirect ? (
    <Redirect to="/login" />
  ) : (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={6}>
        <Card style={{ padding: "15px", marginTop: "20px" }}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.title}>
              Cambiar Contraseña
            </Typography>
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
        </Card>
      </Grid>
    </Grid>
  );
}
