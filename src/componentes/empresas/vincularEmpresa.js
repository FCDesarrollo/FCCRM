import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Button
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon
} from "@material-ui/icons";
import {
  verificarArchivoCer,
  verificarArchivoKey
} from "../../helpers/extensionesArchivos";
import swal from "sweetalert";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import LoadingComponent from "../componentsHelpers/loadingComponent";
import jwt from "jsonwebtoken";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  textFields: {
    width: "100%"
  }
}));

export default function VincularEmpresa() {
  const classes = useStyles();
  const [userAuth, setUserAuth] = useState(true);
  let userEmail = "";
  let userPassword = "";
  if (localStorage.getItem("token")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("token"),
        "mysecretpassword"
      );
      userEmail = decodedToken.userData.correo;
      userPassword = decodedToken.userData.password;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("emToken");
      setUserAuth(false);
    }
  }
  const [redirectEmpresas, setRedirectEmpresas] = useState(false);
  const [vincularEmpresaDatos, setVincularEmpresaDatos] = useState({
    archivoCer: null,
    archivoKey: null,
    contraseñaFIEL: ""
  });
  const [
    {
      data: validaEmpresaData,
      loading: validaEmpresaLoading,
      error: validaEmpresaError
    },
    executeValidaEmpresa
  ] = useAxios(
    {
      url: API_BASE_URL + `/validaEmpresa`,
      method: "POST"
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    function isUserAuth() {
      try {
        if (localStorage.getItem("token")) {
          jwt.verify(localStorage.getItem("token"), "mysecretpassword");
        } else {
          setUserAuth(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("emToken");
        setUserAuth(false);
      }
    }

    isUserAuth();
  });

  useEffect(() => {
    function checkData() {
      if (validaEmpresaData) {
        if (validaEmpresaData.error !== 0) {
          swal(
            "Error al vincular la empresa",
            dataBaseErrores(validaEmpresaData.error),
            "error"
          );
        } else {
          swal(
            "Vinculación exitosa",
            "La empresa se vinculó correctamente",
            "success"
          ).then(() => {
            setRedirectEmpresas(true);
          });
        }
      }
    }

    checkData();
  }, [validaEmpresaData]);

  if (validaEmpresaLoading) {
    return <LoadingComponent />;
  }
  if (validaEmpresaError) {
    return <ErrorQueryDB />;
  }

  const vincularEmpresa = () => {
    const { archivoCer, archivoKey, contraseñaFIEL } = vincularEmpresaDatos;
    if (archivoCer === null) {
      swal("Faltan llenar campos", "Seleccione un archivo .cer", "warning");
    } else if (!verificarArchivoCer(archivoCer.name)) {
      swal(
        "Error de extensión de archivo",
        "Extensión no valida, seleccione un archivo .cer",
        "warning"
      );
    } else if (archivoKey === null) {
      swal("Faltan llenar campos", "Seleccione un archivo .key", "warning");
    } else if (!verificarArchivoKey(archivoKey.name)) {
      swal(
        "Error de extensión de archivo",
        "Extensión no valida, seleccione un archivo .key",
        "warning"
      );
    } else if (contraseñaFIEL.trim() === "") {
      swal("Faltan llenar campos", "Ingrese una contraseña FIEL", "warning");
    } else {
      const formData = new FormData();
      formData.append("usuario", userEmail);
      formData.append("pwd", userPassword);
      formData.append("certificado", archivoCer);
      formData.append("key", archivoKey);
      formData.append("passwordcertificado", contraseñaFIEL);
      formData.append("valida", 1);
      executeValidaEmpresa({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    }
  };

  return !userAuth ? (
    <Redirect to="/login" />
  ) : redirectEmpresas ? (
    <Redirect to="/empresas" />
  ) : (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={12} md={9}>
        <Card>
          <Grid container justify="center" spacing={1} className={classes.root}>
            <Grid item xs={12}>
              <Tooltip title="Regresar">
                <Link to="/empresas">
                  <IconButton>
                    <ArrowBackIcon color="primary" />
                  </IconButton>
                </Link>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Vincular Empresa
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .cer"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  setVincularEmpresaDatos({
                    ...vincularEmpresaDatos,
                    archivoCer: e.target.files[0]
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .key"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  setVincularEmpresaDatos({
                    ...vincularEmpresaDatos,
                    archivoKey: e.target.files[0]
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                label="Contraseña FIEL"
                variant="outlined"
                type="password"
                value={vincularEmpresaDatos.contraseñaFIEL}
                margin="normal"
                onChange={e => {
                  setVincularEmpresaDatos({
                    ...vincularEmpresaDatos,
                    contraseñaFIEL: e.target.value
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Button
                variant="contained"
                style={{
                  background: "#1AB188",
                  color: "#FFFFFF",
                  width: "100%"
                }}
                onClick={() => {
                  vincularEmpresa();
                }}
              >
                Vincular
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
