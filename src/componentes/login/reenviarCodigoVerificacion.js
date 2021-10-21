import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Tooltip,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
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
  typographys: {
    textAlign: "center"
  }
}));

const codigo = Math.floor(Math.random() * 1000000);

export default function ReenviarCodigoVerificacion() {
  const classes = useStyles();
  const [usuario, setUsuario] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [redirectVerificacion, setRedirectVerificacion] = useState(false);
  const inputUsuario = useRef(null);
  const [
    {
      data: reenviarCodigoData,
      loading: reenviarCodigoLoading,
      error: reenviarCodigoError
    },
    executeReenviarCodigo
  ] = useAxios(
    {
      url: "https://apicrm.dublock.com/reenviaCodigo",
      method: "POST"
    },
    { manual: true }
  );

  useEffect(() => {
    if (reenviarCodigoData) {
      if (reenviarCodigoData.error !== 0) {
        swal("Error", dataBaseErrores(reenviarCodigoData.error), "error");
        setDisabledButton(false);
      }
      else {
        swal(
            "Código de verificación enviado",
            "Revise su bandeja de entrada",
            "success"
          ).then(() => {
            const usuarioToken = jwt.sign(
              { usuario: usuario },
              "mysecretpassword"
            );
            localStorage.setItem("usuarioToken", usuarioToken);
            setRedirectVerificacion(true);
          });
      }
    }
  }, [reenviarCodigoData, usuario]);

  if (reenviarCodigoLoading) {
    return <CircularProgress />;
  }
  if (reenviarCodigoError) {
    return "Error";
  }

  const reenviarCodigo = () => {
    setDisabledButton(true);
    if (usuario.trim() === "") {
      swal("Error", "Ingresa un correo electrónico o un celular", "error");
      setDisabledButton(false);
    } else {
      executeReenviarCodigo({
        data: {
          usuario: usuario,
          identificador: codigo
        }
      });
      setDisabledButton(false);
    }
  };

  return ( redirectVerificacion ? <Redirect to="/verificarCodigo" /> : 
    <Grid container justify="center" className={classes.container}>
      <Grid item xs={12} sm={8}>
        <Link to="/login">
          <Tooltip title="Regresar al login">
            <IconButton style={{ float: "right" }}>
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Link>
        <Typography
          variant="h5"
          className={classes.typographys}
          style={{ marginBottom: "15px" }}
        >
          Reenvió de Código de Verificación
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Divider style={{ marginBottom: "15px" }} />
      </Grid>
      <Grid item xs={10} sm={8}>
        <Card className={classes.root}>
          <CardContent>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  className={classes.typographys}
                  style={{ marginBottom: "10px" }}
                >
                  Disculpe las molestias.
                </Typography>
                <Typography variant="subtitle1" className={classes.typographys}>
                  Introduce el correo electrónico o el celular con el que te
                  registraste.
                </Typography>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  className={classes.textFields}
                  autoFocus
                  id="codigo"
                  variant="outlined"
                  label="Correo electrónico o celular"
                  type="text"
                  required
                  value={usuario}
                  inputProps={{
                    maxLength: 70,
                    ref: inputUsuario
                  }}
                  onKeyPress={e => {
                    keyValidation(e, 4);
                  }}
                  onChange={e => {
                    pasteValidation(e, 4);
                    setUsuario(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={10}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={disabledButton}
                  className={classes.buttons}
                  onClick={() => {
                    reenviarCodigo();
                  }}
                >
                  Enviar Código
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
