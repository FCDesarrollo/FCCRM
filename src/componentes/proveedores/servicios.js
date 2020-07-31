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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
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
import moment from "moment";
import { verificarImagenesServicios } from "../../helpers/extensionesArchivos";

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
  const [openDialogContenido, setOpenDialogContenido] = useState(false);
  const [openDialogAgregarContenido, setOpenDialogAgregarContenido] = useState(
    false
  );
  const [nuevaImagenServicio, setNuevaImagenervicio] = useState(null);
  const [nombreImagen, setNombreImagen] = useState("");
  const [contenido, setContenido] = useState([]);
  const [idContenido, setIdContenido] = useState(0);
  const [nombreContenido, setNombreContenido] = useState("");
  const [urlContenido, setUrlContenido] = useState("");
  const [validacionContenido, setValidacionContenido] = useState(false);

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
      data: cambiarImagenServicioData,
      loading: cambiarImagenServicioLoading,
      error: cambiarImagenServicioError,
    },
    executeCambiarImagenServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarImagenServicio`,
      method: "POST",
    },
    {
      manual: true,
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
  const [
    {
      data: getContenidoServicioData,
      loading: getContenidoServicioLoading,
      error: getContenidoServicioError,
    },
    executeGetContenidoServicio,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getContenidoServicio`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idservicio: idServicio,
      },
    },
    {
      useCache: false,
      /* manual: true, */
    }
  );
  const [
    {
      data: guardarContenidoServicioData,
      loading: guardarContenidoServicioLoading,
      error: guardarContenidoServicioError,
    },
    executeGuardarContenidoServicio,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarContenidoServicio`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: borrarContenidoServicioData,
      loading: borrarContenidoServicioLoading,
      error: borrarContenidoServicioError,
    },
    executeBorrarContenidoServicio,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarContenidoServicio`,
      method: "DELETE",
    },
    {
      useCache: false,
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
      if (cambiarImagenServicioData) {
        if (cambiarImagenServicioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarImagenServicioData.error),
            "warning"
          );
        } else {
          swal("Imagen Guardada", "Imagen guardada con éxito", "success");
          executeGetServicios();
        }
      }
    }

    checkData();
  }, [cambiarImagenServicioData, executeGetServicios]);

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

  useEffect(() => {
    if (getContenidoServicioData) {
      if (getContenidoServicioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getContenidoServicioData.error),
          "warning"
        );
      } else {
        setContenido(getContenidoServicioData.contenido);
      }
    }
  }, [getContenidoServicioData]);

  useEffect(() => {
    if (guardarContenidoServicioData) {
      if (guardarContenidoServicioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarContenidoServicioData.error),
          "warning"
        );
      } else {
        swal("Contenido Guardado", "Contenido guardado con éxito", "success");
        setValidacionContenido(true);
      }
    }
  }, [guardarContenidoServicioData]);

  useEffect(() => {
    if (borrarContenidoServicioData) {
      if (borrarContenidoServicioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(borrarContenidoServicioData.error),
          "warning"
        );
      } else {
        swal("Contenido eliminado", "Contenido eliminado con éxito", "success");
        setValidacionContenido(true);
      }
    }
  }, [borrarContenidoServicioData]);

  useEffect(() => {
    if (validacionContenido) {
      executeGetContenidoServicio();
      setValidacionContenido(false);
    }
  }, [validacionContenido, executeGetContenidoServicio]);

  if (
    getServiciosLoading ||
    cambiarImagenServicioLoading ||
    cambiarStatusServicioLoading ||
    getContenidoServicioLoading ||
    guardarContenidoServicioLoading ||
    borrarContenidoServicioLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getServiciosError ||
    cambiarImagenServicioError ||
    cambiarStatusServicioError ||
    getContenidoServicioError ||
    guardarContenidoServicioError ||
    borrarContenidoServicioError
  ) {
    return <ErrorQueryDB />;
  }

  const handleOpenDialogCambiarImagen = () => {
    setOpenDialogCambiarImagen(true);
  };

  const handleCloseDialogCambiarImagen = () => {
    setOpenDialogCambiarImagen(false);
  };

  const handleOpenDialogContenido = () => {
    setOpenDialogContenido(true);
  };

  const handleCloseDialogContenido = () => {
    setOpenDialogContenido(false);
  };

  const handleOpenDialogAgregarContenido = () => {
    setOpenDialogAgregarContenido(true);
  };

  const handleCloseDialogAgregarContenido = () => {
    setOpenDialogAgregarContenido(false);
    /* executeGetContenidoServicio({
      params: {
        usuario: correo,
        pwd: password,
        idservicio: idServicio,
      },
    }); */
    setNombreContenido("");
    setUrlContenido("");
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
                  image={
                    servicio.download !== null && servicio.download !== ""
                      ? `${servicio.download}/preview`
                      : serviciosImage
                  }
                  title="Imagen Servicio"
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
                    setIdServicio(servicio.id);
                    setNombreImagen(servicio.imagen);
                  }}
                >
                  Cambiar Imagen
                </Button>
                <Button
                  size="small"
                  color="primary"
                  style={{ flex: "auto", textAlign: "center" }}
                  onClick={() => {
                    handleOpenDialogContenido();
                    setIdServicio(servicio.id);
                    /* executeGetContenidoServicio({
                      params: {
                        usuario: correo,
                        pwd: password,
                        idservicio: servicio.id,
                      },
                    }); */
                    executeGetContenidoServicio();
                  }}
                >
                  Contenido
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

  const guardarNuevaImagenServicio = () => {
    if (nuevaImagenServicio === null) {
      swal("Error", "Seleccione una imagen o una imagen valida", "warning");
    } else {
      //console.log(nombreImagen, idServicio);
      const formData = new FormData();
      formData.append("usuario", correo);
      formData.append("pwd", password);
      formData.append("idservicio", idServicio);
      formData.append("fecharegistro", moment().format("YYYYMMDDHHmmss"));
      formData.append("nombreimagenantigua", nombreImagen);
      formData.append("imagen", nuevaImagenServicio);
      executeCambiarImagenServicio({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  const getContenido = () => {
    if (contenido.length > 0) {
      return contenido.map((contenido, index) => {
        return (
          <ListItem
            key={index}
            button
            onClick={() => {
              window.open(contenido.url);
            }}
          >
            <ListItemText primary={contenido.nombre} />
            <ListItemSecondaryAction>
              <Tooltip title="Editar">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    setIdContenido(contenido.id);
                    setNombreContenido(contenido.nombre);
                    setUrlContenido(contenido.url);
                    handleOpenDialogAgregarContenido();
                  }}
                >
                  <EditIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    swal({
                      text: "¿Está seguro de eliminar este contenido?",
                      buttons: ["No", "Sí"],
                      dangerMode: true,
                    }).then((value) => {
                      if (value) {
                        executeBorrarContenidoServicio({
                          data: {
                            usuario: correo,
                            pwd: password,
                            idcontenido: contenido.id,
                          },
                        });
                      }
                    });
                  }}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Contenido" />
        </ListItem>
      );
    }
  };

  const guardarContenido = () => {
    if (nombreContenido.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (urlContenido.trim() === "") {
      swal("Error", "Agregue una url", "warning");
    } else {
      executeGuardarContenidoServicio({
        data: {
          usuario: correo,
          pwd: password,
          idcontenido: idContenido,
          idservicio: idServicio,
          nombre: nombreContenido.trim(),
          url: urlContenido.trim(),
        },
      });
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
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">Cambiar Imagen</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="imagenServicioNueva"
                className={classes.textFields}
                type="file"
                margin="normal"
                onChange={(e) => {
                  if (
                    e.target.files.length > 0 &&
                    !verificarImagenesServicios(e.target.files[0].name)
                  ) {
                    swal(
                      "Error de archivo",
                      `Solo se permiten imágenes con extensiones .jpg y .png`,
                      "warning"
                    );
                    setNuevaImagenervicio(null);
                  } else if (
                    e.target.files.length > 0 &&
                    e.target.files[0].size > 5000000
                  ) {
                    swal(
                      "Error de archivo",
                      `Solo se permiten imágenes con un tamaño no mayor a los 5 MB.`,
                      "warning"
                    );
                    setNuevaImagenervicio(null);
                  } else {
                    setNuevaImagenervicio(
                      e.target.files.length > 0 ? e.target.files[0] : null
                    );
                  }
                }}
              />
            </Grid>
          </Grid>
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
              guardarNuevaImagenServicio();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogContenido}
        aria-labelledby="simple-dialog-title"
        open={openDialogContenido}
        fullScreen={fullScreenDialog}
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">Contenido</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right" }}
                onClick={() => {
                  handleOpenDialogAgregarContenido();
                  setIdContenido(0);
                }}
              >
                Agregar Contenido
              </Button>
            </Grid>
            <Grid item xs={12}>
              <List
                style={{
                  height: "200px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {getContenido()}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseDialogContenido();
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogAgregarContenido}
        aria-labelledby="simple-dialog-title"
        open={openDialogAgregarContenido}
        fullScreen={fullScreenDialog}
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">
          {idContenido === 0 ? "Agregar Contenido" : "Editar Contenido"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={classes.textFields}
                id="nombreContenido"
                label="Nombre"
                type="text"
                required
                margin="normal"
                value={nombreContenido}
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setNombreContenido(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.textFields}
                id="urlContenido"
                label="Url"
                type="text"
                required
                margin="normal"
                value={urlContenido}
                inputProps={{
                  maxLength: 250,
                }}
                /* onKeyPress={(e) => {
                  keyValidation(e, 3);
                }} */
                onChange={(e) => {
                  //pasteValidation(e, 3);
                  setUrlContenido(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseDialogAgregarContenido();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarContenido();
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
  const [fcModulos, setFcModulos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [menus, setMenus] = useState([]);
  const [submenus, setSubmenus] = useState([]);
  const [idFcModulo, setIdFcModulo] = useState("");
  const [idModulo, setIdModulo] = useState("");
  const [idMenu, setIdMenu] = useState("");
  const [idSubmenu, setIdSubmenu] = useState("");
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
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: getModulosAndSubmenusData,
      loading: getModulosAndSubmenusLoading,
      error: getModulosAndSubmenusError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getModulosAndSubmenus`,
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
      useCache: false,
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
          setCodigoServicio(getServicioData.servicio[0].codigoservicio);
          setNombreServicio(getServicioData.servicio[0].nombreservicio);
          setPrecioServicio(getServicioData.servicio[0].precio);
          setDescripcionServicio(getServicioData.servicio[0].descripcion);
          setTipoServicio(getServicioData.servicio[0].tipo);
          setActualizableServicio(getServicioData.servicio[0].actualizable);
          setfechaServicio(getServicioData.servicio[0].fecha);
          setIdFcModulo(
            getServicioData.servicio[0].idfcmodulo !== null
              ? getServicioData.servicio[0].idfcmodulo
              : "0"
          );
          setIdModulo(
            getServicioData.servicio[0].idmodulo !== null
              ? getServicioData.servicio[0].idmodulo
              : "0"
          );
          setIdMenu(
            getServicioData.servicio[0].idmenu !== null
              ? getServicioData.servicio[0].idmenu
              : "0"
          );
          setIdSubmenu(
            getServicioData.servicio[0].idsubmenu !== null
              ? getServicioData.servicio[0].idsubmenu
              : "0"
          );
        }
      }
    }

    checkData();
  }, [getServicioData]);

  useEffect(() => {
    function checkData() {
      if (getModulosAndSubmenusData) {
        if (getModulosAndSubmenusData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getModulosAndSubmenusData.error),
            "warning"
          );
        } else {
          console.log(getModulosAndSubmenusData);
          setFcModulos(getModulosAndSubmenusData.fcmodulos);
          setModulos(getModulosAndSubmenusData.modulos);
          setMenus(getModulosAndSubmenusData.menus);
          setSubmenus(getModulosAndSubmenusData.submenus);
        }
      }
    }

    checkData();
  }, [getModulosAndSubmenusData]);

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
          }
        }
      }
    }

    checkData();
  }, [
    guardarServicioData,
    executeGetServicios,
    setShowComponent,
    idServicio,
    busquedaFiltro,
    page,
  ]);

  if (
    getServicioLoading ||
    getModulosAndSubmenusLoading ||
    guardarServicioLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServicioError || getModulosAndSubmenusError || guardarServicioError) {
    return <ErrorQueryDB />;
  }

  const guardarServicio = () => {
    if (codigoServicio.trim() === "") {
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
    } else if (fechaServicio === "") {
      swal("Error", "Seleccione una fecha", "warning");
    } else if (idFcModulo === "0" || idFcModulo === 0) {
      swal("Error", "Seleccione un módulo desktop", "warning");
    } else if (idModulo === "0" || idModulo === 0) {
      swal("Error", "Seleccione un módulo", "warning");
    } else if (idMenu === "0" || idMenu === 0) {
      swal("Error", "Seleccione un menú", "warning");
    } else if (idSubmenu === "0" || idSubmenu === 0) {
      swal("Error", "Seleccione un submenu", "warning");
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
      formData.append("fecharegistro", moment().format("YYYYMMDDHHmmss"));
      formData.append("fcmodulo", idFcModulo);
      formData.append("modulo", idModulo);
      formData.append("menu", idMenu);
      formData.append("submenu", idSubmenu);
      if (imagenServicio !== null) {
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

  const getFcModulos = () => {
    if (fcModulos.length > 0) {
      return fcModulos.map((fcModulo, index) => {
        return (
          <option key={index} value={fcModulo.idmodulo}>
            {fcModulo.nombre_modulo}
          </option>
        );
      });
    } else {
      return <option value="0">No hay módulos desktop disponibles</option>;
    }
  };

  const getModulos = () => {
    if (modulos.length > 0) {
      return modulos.map((modulo, index) => {
        return (
          <option key={index} value={modulo.idmodulo}>
            {modulo.nombre_modulo}
          </option>
        );
      });
    } else {
      return <option value="0">No hay módulos disponibles</option>;
    }
  };

  const getMenus = () => {
    if (menus.length > 0) {
      return menus.map((menu, index) => {
        if (menu.idmodulo === parseInt(idModulo)) {
          return (
            <option key={index} value={menu.idmenu}>
              {menu.nombre_menu}
            </option>
          );
        } else {
          return null;
        }
      });
    } else {
      return <option value="0">No hay menús disponibles</option>;
    }
  };

  const getSubmenus = () => {
    if (submenus.length > 0) {
      return submenus.map((submenu, index) => {
        if (submenu.idmenu === parseInt(idMenu)) {
          return (
            <option key={index} value={submenu.idsubmenu}>
              {submenu.nombre_submenu}
            </option>
          );
        } else {
          return null;
        }
      });
    } else {
      return <option value="0">No hay submenus disponibles</option>;
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
              if (
                e.target.files.length > 0 &&
                !verificarImagenesServicios(e.target.files[0].name)
              ) {
                swal(
                  "Error de archivo",
                  `Solo se permiten imágenes con extensiones .jpg y .png`,
                  "warning"
                );
                setImagenServicio(null);
              } else if (
                e.target.files.length > 0 &&
                e.target.files[0].size > 5000000
              ) {
                swal(
                  "Error de archivo",
                  `Solo se permiten imágenes con un tamaño no mayor a los 5 MB.`,
                  "warning"
                );
                setImagenServicio(null);
              } else {
                setImagenServicio(
                  e.target.files.length > 0 ? e.target.files[0] : null
                );
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="idFcModulo"
            label="Módulo Desktop"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={idFcModulo}
            onChange={(e) => {
              setIdFcModulo(e.target.value);
            }}
          >
            <option value="0">Seleccione un modulo</option>
            {getFcModulos()}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="idModulo"
            label="Módulo"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={idModulo}
            onChange={(e) => {
              setIdModulo(e.target.value);
              if (e.target.value === "0") {
                setIdMenu("0");
                setIdSubmenu("0");
              }
            }}
          >
            <option value="0">Seleccione un modulo</option>
            {getModulos()}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="idMenu"
            label="Menú"
            type="text"
            disabled={idModulo === "" || idModulo === "0"}
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={idMenu}
            onChange={(e) => {
              setIdMenu(e.target.value);
              if (e.target.value === "0") {
                setIdSubmenu("0");
              }
            }}
          >
            <option value="0">Seleccione un menú</option>
            {getMenus()}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="idSubmenu"
            label="Submenu"
            type="text"
            disabled={idMenu === "" || idMenu === "0"}
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={idSubmenu}
            onChange={(e) => {
              setIdSubmenu(e.target.value);
            }}
          >
            <option value="0">Seleccione un submenu</option>
            {getSubmenus()}
          </TextField>
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
