import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Grid,
  Card,
  Button,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useMediaQuery,
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  AddCircle as AddCircleIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  doublePasteValidation,
} from "../../helpers/inputHelpers";
import jwt from "jsonwebtoken";
import serviciosImage from "../../assets/images/servicios.jpg";

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  titleTable: {
    flex: "1 1 100%",
  },
  buttons: {
    width: "100%",
    height: "100%",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF",
    },
  },
  paper: {
    width: "100%",
    padding: "15px",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  textFields: {
    width: "100%",
  },
}));

export default function Servicios(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const usuarioDatos = props.usuarioDatos;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const setLoading = props.setLoading;
  const [showComponent, setShowComponent] = useState(0);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [idServicio, setIdServicio] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [openDialogCambiarImagen, setOpenDialogCambiarImagen] = useState(false);

  const [
    {
      data: getServiciosData,
      loading: getServiciosLoading,
      error: getServiciosError,
    },
    executeGetServicios,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServicios`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: cambiarStatusServicioData,
      loading: cambiarStatusServicioLoading,
      error: cambiarStatusServicioError,
    },
    executeCambiarStatusServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarStatusServicio`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (localStorage.getItem("menuTemporal")) {
      try {
        const decodedToken = jwt.verify(
          localStorage.getItem("menuTemporal"),
          "mysecretpassword"
        );
        if (decodedToken.menuTemporal.modulo === "servicios") {
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setIdServicio(decodedToken.menuTemporal.idServicio);
          setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
          setPage(decodedToken.menuTemporal.page);
        } else {
          const token = jwt.sign(
            {
              menuTemporal: {
                modulo: "servicios",
                showComponent: 0,
                idServicio: 0,
                busquedaFiltro: "",
                page: 0,
              },
            },
            "mysecretpassword"
          );
          localStorage.setItem("menuTemporal", token);
        }
      } catch (err) {
        localStorage.removeItem("menuTemporal");
      }
    } else {
      const token = jwt.sign(
        {
          menuTemporal: {
            modulo: "servicios",
            showComponent: 0,
            idServicio: 0,
            busquedaFiltro: "",
            page: 0,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
  }, []);

  useEffect(() => {
    if (getServiciosData) {
      if (getServiciosData.error !== 0) {
        swal("Error", dataBaseErrores(getServiciosData.error), "warning");
      } else {
        setServicios(getServiciosData.servicios);
      }
    }
  }, [getServiciosData]);

  useEffect(() => {
    function checkData() {
      if (cambiarStatusServicioData) {
        if (cambiarStatusServicioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarStatusServicioData.error),
            "warning"
          );
        } else {
          swal(
            cambiarStatusServicioData.status === 0
              ? "Servicio Dado de Baja"
              : "Servicio Dado de Alta",
            cambiarStatusServicioData.status === 0
              ? "Servicio dado de baja con éxito"
              : "Servicio dado de alta con éxito",
            "success"
          );
          executeGetServicios();
        }
      }
    }

    checkData();
  }, [cambiarStatusServicioData, executeGetServicios]);

  if (getServiciosLoading || cambiarStatusServicioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServiciosError || cambiarStatusServicioError) {
    return <ErrorQueryDB />;
  }

  const handleOpenDialogCambiarImagen = () => {
    setOpenDialogCambiarImagen(true);
  };

  const handleCloseDialogCambiarImagen = () => {
    setOpenDialogCambiarImagen(false);
  };

  const getServicios = () => {
    if (servicios.length > 0) {
      return servicios.map((servicio, index) => {
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className={classes.rootCard}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={serviciosImage}
                  title="Servicio"
                  style={{ height: "150px" }}
                />
              </CardActionArea>
              <CardContent style={{ height: "200px", overflowY: "auto" }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <span style={{ color: "#4CAF50" }}>${servicio.precio}</span> -{" "}
                  {servicio.nombreservicio.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {servicio.descripcion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  style={{ flex: "auto", textAlign: "center" }}
                  onClick={() => {
                    handleOpenDialogCambiarImagen();
                  }}
                >
                  Cambiar Imagen
                </Button>
              </CardActions>
              <CardActions
                style={{
                  height: "50px",
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  style={{ flex: "auto" }}
                  onClick={() => {
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          modulo: "servicios",
                          showComponent: 1,
                          idServicio: servicio.id,
                          busquedaFiltro: busquedaFiltro,
                          page: page,
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token);
                    setIdServicio(servicio.id);
                    setShowComponent(1);
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  style={{
                    flex: "auto",
                    color: servicio.status === 0 ? "#4CAF50" : "#f50057",
                  }}
                  onClick={() => {
                    swal({
                      text:
                        servicio.status === 0
                          ? "¿Está seguro de dar de alta este servicio?"
                          : "¿Está seguro de dar de baja este servicio?",
                      buttons: ["No", "Sí"],
                      dangerMode: true,
                    }).then((value) => {
                      if (value) {
                        executeCambiarStatusServicio({
                          data: {
                            usuario: correo,
                            pwd: password,
                            idservicio: servicio.id,
                            status: servicio.status === 0 ? 1 : 0,
                          },
                        });
                      }
                    });
                  }}
                >
                  {servicio.status === 1 ? "Dar de baja" : "Dar de alta"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      });
    } else {
      return <Typography variant="h6">No hay servicios disponibles</Typography>;
    }
  };

  return (
    <div>
      {showComponent === 0 ? (
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                className={classes.titleTable}
                variant="h6"
                style={{ alignSelf: "center" }}
                id="tableTitle"
              >
                Lista de Servicios
                <Tooltip title="Nuevo">
                  <IconButton
                    aria-label="nuevo"
                    onClick={() => {
                      setShowComponent(1);
                      setIdServicio(0);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            modulo: "servicios",
                            showComponent: 1,
                            idServicio: idServicio,
                            busquedaFiltro: busquedaFiltro,
                            page: page,
                          },
                        },
                        "mysecretpassword"
                      );
                      localStorage.setItem("menuTemporal", token);
                    }}
                  >
                    <AddCircleIcon
                      style={{
                        color: "#4caf50",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            {getServicios()}
          </Grid>
        </Paper>
      ) : showComponent === 1 ? (
        <GuardarServicio
          correo={correo}
          password={password}
          setShowComponent={setShowComponent}
          busquedaFiltro={busquedaFiltro}
          page={page}
          executeGetServicios={executeGetServicios}
          setLoading={setLoading}
          idServicio={idServicio}
        />
      ) : null}
      <Dialog
        onClose={handleCloseDialogCambiarImagen}
        aria-labelledby="simple-dialog-title"
        open={openDialogCambiarImagen}
        fullScreen={fullScreenDialog}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">Cambiar Imagen</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}></Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseDialogCambiarImagen();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCloseDialogCambiarImagen();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function GuardarServicio(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setShowComponent = props.setShowComponent;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const executeGetServicios = props.executeGetServicios;
  const setLoading = props.setLoading;
  const idServicio = props.idServicio;
  const [codigoServicio, setCodigoServicio] = useState("");
  const [nombreServicio, setNombreServicio] = useState("");
  const [precioServicio, setPrecioServicio] = useState("");
  const [descripcionServicio, setDescripcionServicio] = useState("");
  const [tipoServicio, setTipoServicio] = useState("0");
  const [actualizableServicio, setActualizableServicio] = useState("0");
  const [fechaServicio, setfechaServicio] = useState("");
  const [imagenServicio, setImagenServicio] = useState(null);
  const [
    {
      data: getServicioData,
      loading: getServicioLoading,
      error: getServicioError,
    },
    executeGetServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServicio`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idservicio: idServicio,
      },
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: guardarServicioData,
      loading: guardarServicioLoading,
      error: guardarServicioError,
    },
    executeGuardarServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarServicio`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (idServicio !== 0) {
      executeGetServicio();
    }
  }, [idServicio, executeGetServicio]);

  useEffect(() => {
    function checkData() {
      if (getServicioData) {
        if (getServicioData.error !== 0) {
          swal("Error", dataBaseErrores(getServicioData.error), "warning");
        } else {
          console.log(getServicioData.servicio[0]);
          setCodigoServicio(getServicioData.servicio[0].codigoservicio);
          setNombreServicio(getServicioData.servicio[0].nombreservicio);
          setPrecioServicio(getServicioData.servicio[0].precio);
          setDescripcionServicio(getServicioData.servicio[0].descripcion);
          setTipoServicio(getServicioData.servicio[0].tipo);
          setActualizableServicio(getServicioData.servicio[0].actualizable);
          setfechaServicio(getServicioData.servicio[0].fecha);
        }
      }
    }

    checkData();
  }, [getServicioData]);

  useEffect(() => {
    function checkData() {
      if (guardarServicioData) {
        if (guardarServicioData.error !== 0) {
          swal("Error", dataBaseErrores(guardarServicioData.error), "warning");
        } else {
          swal(
            idServicio === 0 ? "Servicio Agregado" : "Servicio Editado",
            idServicio === 0
              ? "Servicio agregado con éxito"
              : "Servicio editado con éxito",
            "success"
          );
          executeGetServicios();
          if (idServicio === 0) {
            setShowComponent(0);
          }
        }
      }
    }

    checkData();
  }, [guardarServicioData, executeGetServicios, setShowComponent, idServicio]);

  if (getServicioLoading || guardarServicioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServicioError || guardarServicioError) {
    return <ErrorQueryDB />;
  }

  const guardarServicio = () => {
    /* if (codigoServicio.trim() === "") {
      swal("Error", "Agregue un código", "warning");
    } else if (nombreServicio.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (precioServicio === "") {
      swal("Error", "Agregue un precio", "warning");
    } else if (descripcionServicio.trim() === "") {
      swal("Error", "Agregue una descripción", "warning");
    } else if (tipoServicio === "0") {
      swal("Error", "Seleccione un tipo", "warning");
    } else if (actualizableServicio === "0") {
      swal("Error", "Seleccione un actualizable", "warning");
    } else  */if (fechaServicio === "") {
      swal("Error", "Seleccione una fecha", "warning");
    } else {
      const formData = new FormData();
      formData.append("usuario", correo);
      formData.append("pwd", password);
      formData.append("codigo", codigoServicio.trim());
      formData.append("nombre", nombreServicio.trim());
      formData.append("precio", precioServicio);
      formData.append("descripcion", descripcionServicio.trim());
      formData.append("tipo", tipoServicio);
      formData.append("actualizable", actualizableServicio);
      formData.append("fecha", fechaServicio);
      formData.append("idservicio", idServicio);
      if(imagenServicio !== null) {
        formData.append("imagen", imagenServicio);
      }
      executeGuardarServicio({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      /* executeGuardarServicio({
        data: {
          usuario: correo,
          pwd: password,
          codigo: codigoServicio.trim(),
          nombre: nombreServicio.trim(),
          precio: precioServicio,
          descripcion: descripcionServicio.trim(),
          tipo: tipoServicio,
          actualizable: actualizableServicio,
          fecha: fechaServicio,
          idservicio: idServicio,
        },
      }); */
    }
  };

  return (
    <Card style={{ padding: "15px" }}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.titleTable} variant="h6">
            <Tooltip title="Regresar">
              <IconButton
                onClick={() => {
                  setShowComponent(0);
                  const token = jwt.sign(
                    {
                      menuTemporal: {
                        modulo: "servicios",
                        showComponent: 0,
                        idServicio: 0,
                        busquedaFiltro: busquedaFiltro,
                        page: page,
                      },
                    },
                    "mysecretpassword"
                  );
                  localStorage.setItem("menuTemporal", token);
                }}
              >
                <ArrowBackIcon color="primary" />
              </IconButton>
            </Tooltip>
            {idServicio === 0 ? "Crear Servicio" : "Editar Servicio"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="codigoServicio"
            label="Código"
            type="text"
            required
            margin="normal"
            value={codigoServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setCodigoServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="nombreServicio"
            label="Nombre"
            type="text"
            required
            margin="normal"
            value={nombreServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setNombreServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="precioServicio"
            label="Precio"
            type="text"
            required
            margin="normal"
            value={precioServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              doubleKeyValidation(e, 2);
            }}
            onChange={(e) => {
              doublePasteValidation(e, 2);
              setPrecioServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="descipcionServicio"
            label="Descripción"
            type="text"
            required
            margin="normal"
            value={descripcionServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setDescripcionServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="tipoServicio"
            label="Tipo"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={tipoServicio}
            inputProps={{
              maxLength: 50,
            }}
            onChange={(e) => {
              setTipoServicio(e.target.value);
            }}
          >
            <option value="0">Seleccione un tipo</option>
            <option value="1">Único</option>
            <option value="2">Semanal</option>
            <option value="3">Mensual</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="actualizableServicio"
            label="Actualizable"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={actualizableServicio}
            inputProps={{
              maxLength: 50,
            }}
            onChange={(e) => {
              setActualizableServicio(e.target.value);
            }}
          >
            <option value="0">Seleccione un tipo</option>
            <option value="1">Único</option>
            <option value="2">Semanal</option>
            <option value="3">Mensual</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="fechaServicio"
            label="Fecha"
            type="date"
            required
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={fechaServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 2);
            }}
            onChange={(e) => {
              setfechaServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <TextField
            id="imagenServicio"
            className={classes.textFields}
            type="file"
            margin="normal"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setImagenServicio(e.target.files[0]);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={() => {
              guardarServicio();
            }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
