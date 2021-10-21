import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import swal from "sweetalert";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
const jwt = require("jsonwebtoken");

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3)
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  buttons: {
    width: "100%",
    marginBottom: "20px"
  },
  textFields: {
    width: "100%"
  },
  link: {
    textAlign: "center",
    color: "#000000",
    "&:hover": {
      color: "blue"
    }
  }
}));

export default function VerificarCodigo() {
  const classes = useStyles();
  const [emailRegistrado, setEmailRegistrado] = useState("");
  const [codigo, setCodigo] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [redirectEmpresas, setRedirectEmpresas] = useState(false);
  const inputCodigo = useRef(null);
  const [
    {
      data: verificarCodigoData,
      loading: verificarCodigoLoading,
      error: verificarCodigoError
    },
    executeVerificarCodigo
  ] = useAxios(
    {
      url: "https://apicrm.dublock.com/verificaCodigo",
      method: "POST"
    },
    { manual: true }
  );

  useEffect(() => {
    function getRegistroData() {
      try {
        if (localStorage.getItem("usuarioToken")) {
          const decodedUsuarioToken = jwt.verify(
            localStorage.getItem("usuarioToken"),
            "mysecretpassword"
          );
          setEmailRegistrado(decodedUsuarioToken.usuario);
        }
      } catch (err) {
        localStorage.removeItem("usuarioToken");
      }
    }

    getRegistroData();
  });

  useEffect(() => {
    if (verificarCodigoData) {
      if (verificarCodigoData.error !== 0) {
        swal("Error", dataBaseErrores(verificarCodigoData.error), "error");
        setDisabledButton(false);
      } else {
        swal(
          "Verificación correcta",
          "Se redireccionará a la página principal",
          "success"
        ).then(() => {
          localStorage.removeItem("usuarioToken");
          const token = jwt.sign(
            { userData: verificarCodigoData.usuario },
            "mysecretpassword",
            {
              expiresIn: 60 * 60 * 24
            }
          );
          localStorage.setItem("token", token);
          setRedirectEmpresas(true);
        });
      }
    }
  }, [verificarCodigoData]);

  if (verificarCodigoLoading) {
    return <CircularProgress />;
  }
  if (verificarCodigoError) {
    return "Error";
  }

  const verificarCodigo = () => {
    setDisabledButton(true);
    if (codigo.trim() === "") {
      swal("Error", "Ingresa un código", "error").then(() => {
        inputCodigo.current.focus();
        setCodigo("");
      });
      setDisabledButton(false);
    } else if (codigo.length < 6) {
      swal("Error", "El código debe ser de 6 dígitos", "error").then(() => {
        inputCodigo.current.focus();
      });
      setDisabledButton(false);
    } else {
      executeVerificarCodigo({
        data: {
          usuario: emailRegistrado,
          codigo: codigo
        }
      });
      setDisabledButton(false);
    }
  };

  return redirectEmpresas ? (
    <Redirect to="/empresas" />
  ) : (
    <Grid container justify="center" className={classes.container}>
      <Grid item xs={10} sm={6}>
        <Card className={classes.root}>
          <CardContent>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={8}>
                <Typography variant="h6">VERIFICACIÓN DE USUARIO</Typography>
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
              <Grid item xs={12} lg={10}>
                <TextField
                  className={classes.textFields}
                  autoFocus
                  id="codigo"
                  variant="outlined"
                  label="Código de Verificación"
                  type="text"
                  required
                  value={codigo}
                  inputProps={{
                    maxLength: 6,
                    ref: inputCodigo
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 2);
                  }}
                  onChange={e => {
                    pasteValidation(e, 2);
                    setCodigo(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={10}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={disabledButton}
                  className={classes.buttons}
                  onClick={() => {
                    verificarCodigo();
                  }}
                >
                  Enviar Datos
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Link to="/reenviarCodigoVerificacion" style={{ textDecoration: "none" }}>
                  <Typography variant="subtitle2" className={classes.link}>
                    ¿No recibiste el correo con el código de verificación?
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
