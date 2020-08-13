import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Divider,
  Typography,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@material-ui/core";
import {
  Person as PersonIcon,
  Add as AddIcon,
  Link as LinkIcon,
  Cancel as CancelIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import LoadingComponent from "../componentsHelpers/loadingComponent";
const jwt = require("jsonwebtoken");

const useStyles = makeStyles({
  root: {
    padding: "40px",
  },
  table: {
    minWidth: 650,
  },
  toolbarLink1: {
    fontSize: "14px",
    cursor: "pointer",
    color: "#428bca",
    textAlign: "center",
    "&:hover": {
      color: "black",
    },
  },
  toolbarLink2: {
    fontSize: "14px",
    cursor: "pointer",
    color: "dimgray",
    textAlign: "center",
    "&:hover": {
      color: "black",
    },
  },
  toolbarLink3: {
    fontSize: "14px",
    cursor: "pointer",
    color: "crimson",
    textAlign: "center",
    "&:hover": {
      color: "black",
    },
  },
  toolbarLink4: {
    fontSize: "14px",
    cursor: "pointer",
    color: "#009688",
    textAlign: "center",
    "&:hover": {
      color: "black",
    },
  },
  toolbarIconLinks: {
    verticalAlign: "text-bottom",
    fontSize: "20px",
  },
  links: {
    textDecoration: "none",
  },
  tableRowLinks: {
    textDecoration: "none",
    color: "#428bca",
    "&:hover": {
      color: "#2a6496",
      textDecoration: "underline",
    },
  },
});

export default function Empresas() {
  const classes = useStyles();
  let userEmail = "";
  let userPassword = "";
  let nombreUsuario = "";
  let tipoUsuario = 0;
  const [userAuth, setUserAuth] = useState(true);
  if (localStorage.getItem("token")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("token"),
        "mysecretpassword"
      );
      userEmail = decodedToken.userData.correo;
      userPassword = decodedToken.userData.password;
      nombreUsuario = `${decodedToken.userData.nombre} ${decodedToken.userData.apellidop} ${decodedToken.userData.apellidom}`;
      tipoUsuario = decodedToken.userData.tipo;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("emToken");
      setUserAuth(false);
    }
  }
  localStorage.removeItem("menuTemporal");//nuevo
  const [
    { data: empresasData, loading: empresasLoading, error: empresasError },
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaEmpresasUsuario`,
      method: "GET",
      params: {
        usuario: userEmail,
        pwd: userPassword,
      },
    },
    {
      useCache: false,
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
      if (empresasData) {
        if (empresasData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(empresasData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [empresasData]);

  if (empresasLoading) {
    return <LoadingComponent mensaje="Cargando empresas" />;
  }
  if (empresasError) {
    return <ErrorQueryDB />;
  }

  if (localStorage.getItem("notificacionData")) {
    const decodedToken = jwt.verify(
      localStorage.getItem("notificacionData"),
      "mysecretpassword"
    );
    //console.log(decodedToken.notificacionData.url);
    for (let x = 0; x < empresasData.empresas.length; x++) {
      if (
        parseInt(decodedToken.notificacionData.idEmpresa) ===
        empresasData.empresas[x].idempresa
      ) {
        const token = jwt.sign(
          { empresaData: empresasData.empresas[x] },
          "mysecretpassword"
        );
        localStorage.setItem("emToken", token);
        break;
      }
    }
    //return <Redirect to="autorizacionesGastos" />;
    return <Redirect to={decodedToken.notificacionData.url} />;
  }

  const closeSesion = () => {
    swal({
      text: "¿Está seguro de cerrar sesión?",
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        localStorage.removeItem("token");
        localStorage.removeItem("emToken");
        localStorage.removeItem("notificacionData");
        setUserAuth(false);
      }
    });
  };

  return userAuth ? (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={10}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={9} style={{ marginTop: "15px" }}>
        <Toolbar style={{ background: "#FFFFFF", padding: "10px" }}>
          <Grid container spacing={1} justify="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                <PersonIcon className={classes.toolbarIconLinks} />{" "}
                {nombreUsuario}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} style={{ alignSelf: "center" }}>
              <Link to="/agregarEmpresa" className={classes.links}>
                <Tooltip title="Agregar Empresa">
                  <Typography className={classes.toolbarLink1}>
                    <AddIcon className={classes.toolbarIconLinks} /> Agregar
                    Empresa
                  </Typography>
                </Tooltip>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3} style={{ alignSelf: "center" }}>
              <Link to="/vincularEmpresa" className={classes.links}>
                <Tooltip title="Vincular Empresa">
                  <Typography className={classes.toolbarLink2}>
                    <LinkIcon className={classes.toolbarIconLinks} /> Vincular
                    Empresa
                  </Typography>
                </Tooltip>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3} style={{ alignSelf: "center" }}>
              <Tooltip title="Cerrar Sesión" onClick={closeSesion}>
                <Typography className={classes.toolbarLink3}>
                  <CancelIcon className={classes.toolbarIconLinks} /> Cerrar
                  Sesión
                </Typography>
              </Tooltip>
            </Grid>
            {tipoUsuario === 4 ? (
              <Grid item xs={12} md={4} style={{ alignSelf: "center" }}>
                <Link to="/cPanel" className={classes.links}>
                  <Tooltip title="Cambiar a panel de proveedor">
                    <Typography className={classes.toolbarLink4}>
                      <SupervisorAccountIcon
                        className={classes.toolbarIconLinks}
                      />{" "}
                      Cambiar a panel de proveedor
                    </Typography>
                  </Tooltip>
                </Link>
              </Grid>
            ) : null}
          </Grid>
        </Toolbar>
        <TableContainer component={Paper}>
          <Divider />
          <Table className={classes.table} aria-label="simple table">
            <TableHead style={{ background: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Empresa</strong>
                </TableCell>
                <TableCell>
                  <strong>RFC</strong>
                </TableCell>
                <TableCell>
                  <strong>Perfil</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empresasData.empresas.map((row, index) => (
                <TableRow key={row.idempresa}>
                  <TableCell component="th" scope="row">
                    <Link
                      to="/"
                      className={classes.tableRowLinks}
                      onClick={() => {
                        const token = jwt.sign(
                          { empresaData: empresasData.empresas[index] },
                          "mysecretpassword"
                        );
                        localStorage.setItem("emToken", token);
                      }}
                    >
                      {row.nombreempresa}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.RFC}</TableCell>
                  <TableCell align="left">{row.perfil}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  ) : (
    <Redirect to="/login" />
  );
}
