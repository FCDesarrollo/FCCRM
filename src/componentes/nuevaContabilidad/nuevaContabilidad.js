import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  /* Container, */
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  NativeSelect,
  Paper,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { GetApp as GetAppIcon } from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import {
  keyValidation,
  pasteValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import IMGPrincipal from "../../assets/images/Banner01.jpg";
import PDFIcon from "../../assets/images/PDFIcon.png";
import IMGContactanos from "../../assets/images/contactanos.png";
import IMGLaNuevaContabilidad from "../../assets/images/La-nueva-contabilidad-banner.jpg";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    backgroundColor: "#FFFFFF",
  },
  /* containerImagenPrincipal: {
    width: "100%",
    height: "500px",
    backgroundImage: `url(${IMGPrincipal})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }, */
  buttonImagenPrincipal: {
    position: "absolute",
    [theme.breakpoints.down("lg")]: {
      top: "70%",
      left: "92%",
      transform: "translate(-70%, -92%)",
    },
    [theme.breakpoints.down("xs")]: {
      height: "20px",
      fontSize: "10px",
      top: "70%",
      left: "87%",
      transform: "translate(-70%, -87%)",
    },
  },
  textFieldsContactanos: {
    width: "100%",
  },
  buttonContactanos: {
    backgroundColor: "#00b4b8",
    color: "#FFFFFF",
    borderRadius: "62px",
    [theme.breakpoints.up("xs")]: {
      minWidth: "300px",
    },
    "&:hover": {
      backgroundColor: "#34495e",
    },
  },
  ordenamientos: {
    cursor: "pointer",
    "&:hover": {
      color: "blue",
    },
  },
}));

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#00b4b8",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#00b4b8",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#00b4b8",
      },
      "&:hover fieldset": {
        borderColor: "#009688",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#009688",
      },
    },
  },
})(TextField);

export default function LaNuevaContabilidad(props) {
  const classes = useStyles();
  const solucionesNuevaContabilidad = props.solucionesNuevaContabilidad;
  const documentosGeneralesNuevaContabilidad = props.documentosGeneralesNuevaContabilidad;
  const documentoLaNuevaContabilidad = documentosGeneralesNuevaContabilidad.filter((documento) => documento.id === 1)[0];
  const estadosNuevaContabilidad = props.estadosNuevaContabilidad;
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [correo, setCorreo] = useState("");
  const [numeroTelefono, setNumeroTelefono] = useState("");
  const [estadoElegido, setEstadoElegido] = useState(0);
  const [planInteres, setPlanInteres] = useState(0);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [temasDocumentos, setTemasDocumentos] = useState([]);
  const [documentosOriginales, setDocumentosOriginales] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [ordenamientoAntiguedad, setOrdenamientoAntiguedad] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [
    {
      data: traerTiposDocumentosNuevaContabilidadData,
      loading: traerTiposDocumentosNuevaContabilidadLoading,
      error: traerTiposDocumentosNuevaContabilidadError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerTiposDocumentosNuevaContabilidad`,
      method: "GET",
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: traerTemasDocumentosNuevaContabilidadData,
      loading: traerTemasDocumentosNuevaContabilidadLoading,
      error: traerTemasDocumentosNuevaContabilidadError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerTemasDocumentosNuevaContabilidad`,
      method: "GET",
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: traerDocumentosNuevaContabilidadData,
      loading: traerDocumentosNuevaContabilidadLoading,
      error: traerDocumentosNuevaContabilidadError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerDocumentosNuevaContabilidad`,
      method: "GET",
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: enviarInformacionNuevaContabilidadData,
      loading: enviarInformacionNuevaContabilidadLoading,
      error: enviarInformacionNuevaContabilidadError,
    },
    executeEnviarInformacionNuevaContabilidad,
  ] = useAxios(
    {
      url: API_BASE_URL + `/enviarInformacionNuevaContabilidad`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (traerTiposDocumentosNuevaContabilidadData) {
      setTiposDocumentos(
        traerTiposDocumentosNuevaContabilidadData.tiposDocumentos
      );
    }
  }, [traerTiposDocumentosNuevaContabilidadData]);

  useEffect(() => {
    if (traerTemasDocumentosNuevaContabilidadData) {
      setTemasDocumentos(
        traerTemasDocumentosNuevaContabilidadData.temasDocumentos
      );
    }
  }, [traerTemasDocumentosNuevaContabilidadData]);

  useEffect(() => {
    if (traerDocumentosNuevaContabilidadData) {
      setDocumentosOriginales(traerDocumentosNuevaContabilidadData.documentos);
      setDocumentos(traerDocumentosNuevaContabilidadData.documentos);
    }
  }, [traerDocumentosNuevaContabilidadData]);

  useEffect(() => {
    if (enviarInformacionNuevaContabilidadData) {
      if (enviarInformacionNuevaContabilidadData.error === 0) {
        swal(
          "Mensaje Enviado",
          "Espere la información que solicito en unos momentos",
          "success"
        );
        setNombre("");
        setApellido("");
        setNombreEmpresa("");
        setCorreo("");
        setNumeroTelefono("");
        setEstadoElegido(0);
        setPlanInteres(0);
      }
    }
  }, [enviarInformacionNuevaContabilidadData]);

  if (
    traerTiposDocumentosNuevaContabilidadLoading ||
    traerTemasDocumentosNuevaContabilidadLoading ||
    traerDocumentosNuevaContabilidadLoading ||
    enviarInformacionNuevaContabilidadLoading
  ) {
    return <CircularProgress />;
  }
  if (
    traerTiposDocumentosNuevaContabilidadError ||
    traerTemasDocumentosNuevaContabilidadError ||
    traerDocumentosNuevaContabilidadError ||
    enviarInformacionNuevaContabilidadError
  ) {
    return <ErrorQueryDB />;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getOrdenamientos = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <strong>Tipos De Documentos</strong>
          </Typography>
        </Grid>
        {tiposDocumentos.map((tipoDocumento, indexTipoDocumento) => {
          const cantidadDocumentos = documentosOriginales.filter(
            (documento) => documento.idTipoDocumento === tipoDocumento.id
          ).length;
          return cantidadDocumentos > 0 ? (
            <Grid item xs={12} key={indexTipoDocumento}>
              <Typography
                className={classes.ordenamientos}
                variant="subtitle2"
                onClick={() => {
                  setDocumentos(
                    documentosOriginales.filter(
                      (documento) =>
                        documento.idTipoDocumento === tipoDocumento.id
                    )
                  );
                }}
              >
                {`${tipoDocumento.nombre} (${cantidadDocumentos})`}
              </Typography>
            </Grid>
          ) : null;
        })}
        <Grid item xs={12} style={{ marginTop: "15px" }}>
          <Typography variant="subtitle1">
            <strong>Temas De Documentos</strong>
          </Typography>
        </Grid>
        {temasDocumentos.map((temaDocumento, indexTemaDocumento) => {
          const cantidadDocumentos = documentosOriginales.filter(
            (documento) => documento.idTemaDocumento === temaDocumento.id
          ).length;
          return cantidadDocumentos > 0 ? (
            <Grid item xs={12} key={indexTemaDocumento}>
              <Typography
                className={classes.ordenamientos}
                variant="subtitle2"
                onClick={() => {
                  setDocumentos(
                    documentosOriginales.filter(
                      (documento) =>
                        documento.idTemaDocumento === temaDocumento.id
                    )
                  );
                }}
              >
                {`${temaDocumento.nombre} (${cantidadDocumentos})`}
              </Typography>
            </Grid>
          ) : null;
        })}
      </Grid>
    );
  };

  const getDocumentos = () => {
    if (documentos.length > 0) {
      return (
        <Fragment>
          <List style={{ backgroundColor: "#FFFFFF" }}>
            {documentos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((documento, indexDocumento) => {
                return (
                  <ListItem
                    key={indexDocumento}
                    button
                    divider
                    onClick={() => {
                      window.open(documento.linkDocumento);
                    }}
                  >
                    <ListItemAvatar>
                      <img
                        src={PDFIcon}
                        alt="icon"
                        style={{ width: 150, height: 100 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${documento.nombre}`}
                      secondary={documento.descripcion}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Descargar">
                        <IconButton
                          onClick={() => {
                            window.open(documento.linkDocumento + "/download");
                          }}
                        >
                          <GetAppIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
          </List>
          <TablePagination
            component="div"
            count={documentos.length}
            color="primary"
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={(e) => {
              return `${e.from}-${e.to} de ${e.count}`;
            }}
          />
        </Fragment>
      );
    } else {
      return (
        <Typography variant="h6">No Hay Documentos Para Mostrar</Typography>
      );
    }
  };

  const enviarInformacion = () => {
    if (nombre.trim() === "") {
      swal("Error", "Ingrese un nombre por favor", "warning");
    } else if (apellido.trim() === "") {
      swal("Error", "Ingrese un apellido por favor", "warning");
    } else if (nombreEmpresa.trim() === "") {
      swal("Error", "Ingrese un nombre de empresa por favor", "warning");
    } else if (correo.trim() === "") {
      swal("Error", "Ingrese un correo por favor", "warning");
    } else if (!validarCorreo(correo.trim())) {
      swal("Error", "Ingrese un correo valido por favor", "warning");
    } else if (numeroTelefono.trim() === "") {
      swal("Error", "Ingrese un número de teléfono por favor", "warning");
    } else if (estadoElegido === 0) {
      swal("Error", "Seleccione un(a) estado/región por favor", "warning");
    } else if (planInteres === 0) {
      swal("Error", "Seleccione un plan de interés por favor", "warning");
    } else {
      const estadoSeleccionado = estadosNuevaContabilidad.filter(
        (estado) => estado.id === estadoElegido
      )[0].estado;
      const planInteresSeleccionado = solucionesNuevaContabilidad.filter(
        (solucion) => solucion.id === planInteres
      )[0].nombre;
      executeEnviarInformacionNuevaContabilidad({
        data: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          nombreEmpresa: nombreEmpresa.trim(),
          correo: correo.trim(),
          numeroTelefono: numeroTelefono.trim(),
          estado: estadoSeleccionado,
          planInteres: planInteresSeleccionado,
        },
      });
    }
  };

  return (
    <Grid container className={classes.root}>
      {/* <Grid item xs={12} className={classes.containerImagenPrincipal}>
        <Grid
          container
          direction="column"
          justify="center"
          style={{ minHeight: "-webkit-fill-available" }}
        >
          <Grid item xs={12}>
            <Typography variant="h4" style={{ textAlign: "center" }}>
              Título
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" style={{ textAlign: "center" }}>
              Descripción
            </Typography>
          </Grid>
        </Grid>
      </Grid> */}
      <Grid
        item
        xs={12}
        style={{
          marginTop: "64px",
          position: "relative",
          display: "inline-block",
          textAlign: "center",
        }}
      >
        <img src={IMGPrincipal} alt="Fondo" style={{ width: "100%" }} />
        <Button
          className={ classes.buttonImagenPrincipal }
          variant="contained"
          color="primary"
          onClick={() => {
            window.open(documentoLaNuevaContabilidad.linkDocumento);
          }}
        >
          Conoce más
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 50 }}>
        <Grid
          container
          justify="center"
          spacing={3}
          style={{ padding: 20, maxWidth: "100%", margin: 0, placeItems: "center" }}
        >
          <Grid item xs={12} md={6}>
            <img
              src={IMGLaNuevaContabilidad}
              alt="La Nueva Contabilidad"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/Ua9ITDXtaUc"
              title="La Nueva Contabilidad"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 50, backgroundColor: "#ededed" }}>
        <Grid
          container
          justify="center"
          spacing={3}
          style={{ padding: 20, maxWidth: "100%", margin: 0, placeItems: "center" }}
        >
          <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
            <img
              src={IMGContactanos}
              alt="contactanos"
              style={{ maxWidth: "-webkit-fill-available", marginLeft: "40px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  align="center"
                  style={{ color: "#00b4b8" }}
                >
                  ¿Quieres más información? Llena el siguiente formulario y nos
                  pondremos en contacto a la brevedad…
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  id="nombre"
                  variant="outlined"
                  label="Nombre"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={nombre}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 1);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 1);
                    setNombre(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  id="apellido"
                  variant="outlined"
                  label="Apellido"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={apellido}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 1);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 1);
                    setApellido(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  id="nombreEmpresa"
                  variant="outlined"
                  label="Nombre de la empresa"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={nombreEmpresa}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 3);
                    setNombreEmpresa(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  id="correo"
                  variant="outlined"
                  label="correo"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={correo}
                  inputProps={{
                    maxLength: 100,
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
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  id="numeroTelefono"
                  variant="outlined"
                  label="Número de teléfono"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={numeroTelefono}
                  inputProps={{
                    maxLength: 10,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 2);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 2);
                    setNumeroTelefono(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  variant="outlined"
                  label="Estado / Región"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={estadoElegido}
                  onChange={(e) => {
                    setEstadoElegido(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>Seleccionar</option>
                  {estadosNuevaContabilidad.map((estado, index) => (
                    <option key={index} value={estado.id}>
                      {estado.estado}
                    </option>
                  ))}
                </CssTextField>
              </Grid>
              <Grid item xs={12}>
                <CssTextField
                  className={classes.textFieldsContactanos}
                  variant="outlined"
                  label="Plan de interés"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={planInteres}
                  onChange={(e) => {
                    setPlanInteres(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>Seleccionar</option>
                  {solucionesNuevaContabilidad.map((solucion, index) => (
                    <option key={index} value={solucion.id}>
                      {solucion.nombre}
                    </option>
                  ))}
                </CssTextField>
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  className={classes.buttonContactanos}
                  variant="contained"
                  size="large"
                  onClick={() => {
                    enviarInformacion();
                  }}
                >
                  Enviar
                </Button>
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <span>Leer nuestro</span>{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      "http://www.francocabanillas.com.mx/aviso-de-privacidad"
                    );
                  }}
                >
                  Aviso de Privacidad
                </strong>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ padding: 20, marginTop: 50, display: "none" }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            Biblioteca De Documentos
          </Typography>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant="h6">
              <strong>Documentos Existentes</strong>
            </Typography>
            <Typography
              className={classes.ordenamientos}
              variant="subtitle2"
              onClick={() => {
                if (ordenamientoAntiguedad === 1) {
                  documentosOriginales.sort(function (a, b) {
                    a = new Date(a.fechaSubida);
                    b = new Date(b.fechaSubida);
                    return a < b ? -1 : a > b ? 1 : 0;
                  });
                } else {
                  documentosOriginales.sort(function (a, b) {
                    a = new Date(a.fechaSubida);
                    b = new Date(b.fechaSubida);
                    return a > b ? -1 : a < b ? 1 : 0;
                  });
                }
                setDocumentos(documentosOriginales);
              }}
            >
              {documentosOriginales.length} resultados
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl style={{ float: "right" }}>
              <InputLabel htmlFor="age-native-helper">Ordenar por:</InputLabel>
              <NativeSelect
                value={ordenamientoAntiguedad}
                onChange={(e) => {
                  const valor = parseInt(e.target.value);
                  setOrdenamientoAntiguedad(valor);
                  if (valor === 1) {
                    documentos.sort(function (a, b) {
                      a = new Date(a.fechaSubida);
                      b = new Date(b.fechaSubida);
                      return a < b ? -1 : a > b ? 1 : 0;
                    });
                  } else {
                    documentos.sort(function (a, b) {
                      a = new Date(a.fechaSubida);
                      b = new Date(b.fechaSubida);
                      return a > b ? -1 : a < b ? 1 : 0;
                    });
                  }
                }}
              >
                <option value={1}>Más Reciente</option>
                <option value={2}>Más Antiguo</option>
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 15 }}>
          <Grid item xs={3}>
            {getOrdenamientos()}
          </Grid>
          <Grid item xs={9}>
            <Paper elevation={3}>{getDocumentos()}</Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
