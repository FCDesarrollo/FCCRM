import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Grid,
  TextField,
  CardContent,
  CardActions,
  Button,
  Typography
} from "@material-ui/core";
import { API_BASE_URL } from "../../config";
import axios from "axios";
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
  loginTittle: {
    textAlign: "center"
  },
  textFields: {
    width: "100%"
  },
  button: {
    width: "100%",
    background: "#00AD5F",
    color: "#FFFFFF",
    "&:hover": {
      background: "#00AD9F"
    }
  },
  links: {
    color: "#00ad5f",
    cursor: "pointer",
    "&:hover": {
      color: "black"
    }
  }
}));

export default function Login() {
  const classes = useStyles();
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [redirectCodigoValidacion, setRedirectCodigoValidacion] = useState(false);

  if(localStorage.getItem("token")) {
    if(!redirect) {
      setRedirect(true);
    }
  }

  const logIn = () => {
    setDisabledButton(true);
    if (emailState.trim() === "") {
      swal("Faltan llenar campos", "Ingresa un usuario", "warning");
      setDisabledButton(false);
    } else if (passwordState.trim() === "") {
      swal("Faltan llenar campos", "Ingresa una contraseña", "warning");
      setDisabledButton(false);
    } else {
      axios({
          url: API_BASE_URL + `/inicioUsuario`,
          method: "POST",
          data: {
            usuario: emailState,
            pwd: passwordState
          }
        })
        .then(function(response) {
          if(response.data.error !== 0) {
            swal("Error", dataBaseErrores(response.data.error), "error");
            setDisabledButton(false);
          }
          else if(response.data.usuario[0].tipo === -1) {
            swal("Error", "Usuario y/o contraseña incorrecta", "error");
            setDisabledButton(false);
          }
          else if(response.data.usuario[0].tipo === 0) {
            const usuarioToken = jwt.sign(
              { usuario: emailState.trim() },
              "mysecretpassword"
            );
            localStorage.setItem("usuarioToken", usuarioToken);
            setRedirectCodigoValidacion(true);
          }
          else {
            const token = jwt.sign(
              { userData: response.data.usuario[0] },
              "mysecretpassword",
              {
                expiresIn: 60 * 60 * 24
              }
            );
            localStorage.setItem("token", token);
            setRedirect(true);
          }
        })
        .catch(function(error) {
          setDisabledButton(false);
        });
    }
  };

  return ( redirectCodigoValidacion ? (
    <Redirect to="/verificarCodigo" />
  ) : !redirect ?
    <Grid container justify="center" className={classes.container}>
      <Grid item md={4}>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.loginTittle} variant="h5">
              CUENTA DE INGRESO
            </Typography>
            <TextField
              className={classes.textFields}
              label="Correo electrónico"
              type="text"
              required
              value={emailState}
              margin="normal"
              inputProps={{
                maxLength: 50
              }}
              onChange={e => {
                setEmailState(e.target.value);
              }}
            />
            <TextField
              className={classes.textFields}
              label="Contraseña"
              type="password"
              required
              value={passwordState}
              margin="normal"
              inputProps={{
                maxLength: 30
              }}
              onChange={e => {
                setPasswordState(e.target.value);
              }}
              onKeyPress={e => {
                const pressKey = e.keyCode ? e.keyCode : e.which;
                if (pressKey === 13) {
                  logIn();
                }
              }}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              className={classes.button}
              disabled={disabledButton}
              onClick={() => {
                logIn();
              }}
            >
              Iniciar
            </Button>
          </CardActions>
          <Typography style={{ textAlign: "center", marginTop: "15px" }}>
            <Link to="/registrate" style={{textDecoration: "none"}}><strong className={classes.links}>Regístrate</strong></Link> /{" "}
            <span className={classes.links}>¿olvidaste tu contraseña?</span>
          </Typography>
        </Card>
      </Grid>
    </Grid> : <Redirect to="/empresas" />
  );
}
