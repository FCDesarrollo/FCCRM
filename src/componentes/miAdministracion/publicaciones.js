import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Button,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  CardContent,
  CardActions,
  ListItem,
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  ClearAll as ClearAllIcon,
} from "@material-ui/icons";
import moment from "moment";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "10px",
    marginBottom: "25px",
    width: "100%",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  submenusForms: {
    padding: 15,
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
  table: {
    minWidth: 650,
  },
  link: {
    cursor: "pointer",
    color: "#428bca",
    /* "&:hover": {
      textDecoration: "underline",
      color: "#2a6496",
    }, */
  },
  documentosTexto: {
    fontSize: "14px",
  },
}));

let filterRowsPublicaciones = [];

export default function Publicaciones(props) {
  const classes = useStyles();
  const usuarioDatos = props.usuarioDatos;
  const empresaDatos = props.empresaDatos;
  const idUsuario = usuarioDatos.idusuario;
  const correoUsuario = usuarioDatos.correo;
  const passwordUsuario = usuarioDatos.password;
  const rfcEmpresa = empresaDatos.RFC;
  const submenuContent = props.submenuContent;
  const setLoading = props.setLoading;
  const [idModulo, setIdModulo] = useState(0);
  const [idMenu, setIdMenu] = useState(0);
  const [idSubmenu, setIdSubmenu] = useState(0);
  const [tipoPublicacion, setTipoPublicacion] = useState(0);
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [nombreSubmenu, setNombreSubmenu] = useState("");
  const [publicaciones, setPublicaciones] = useState([]);
  const [catalogos, setCatalogos] = useState([]);
  const [openDialogAgregarCatalogo, setOpenDialogAgregarCatalogo] = useState(
    false
  );

  const [
    {
      data: getPublicacionesData,
      loading: getPublicacionesLoading,
      error: getPublicacionesError,
    },
    executeGetPublicaciones,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPublicaciones`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: getCatalogosPublicacionesData,
      loading: getCatalogosPublicacionesLoading,
      error: getCatalogosPublicacionesError,
    },
    executeGetCatalogosPublicaciones,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getCatalogosPublicaciones`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPublicacionesData) {
        if (getPublicacionesData.error !== 0) {
          swal("Error", dataBaseErrores(getPublicacionesData.error), "warning");
        } else {
          filterRowsPublicaciones = [];
          filterRowsPublicaciones = getPublicacionesData.publicaciones;
          setPublicaciones(filterRowsPublicaciones);
        }
      }
    }

    checkData();
  }, [getPublicacionesData]);

  useEffect(() => {
    function checkData() {
      if (getCatalogosPublicacionesData) {
        if (getCatalogosPublicacionesData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getCatalogosPublicacionesData.error),
            "warning"
          );
        } else {
          setCatalogos(getCatalogosPublicacionesData.catalogos);
        }
      }
    }

    checkData();
  }, [getCatalogosPublicacionesData]);

  if (getPublicacionesLoading || getCatalogosPublicacionesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPublicacionesError || getCatalogosPublicacionesError) {
    return <ErrorQueryDB />;
  }

  return (
    <Fragment>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Publicaciones
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              justify="center"
              spacing={3}
              style={{ marginBottom: "15px" }}
            >
              {submenuContent.map((content, index) => {
                return content.submenu.orden !== 0 ? (
                  <Grid item xs={12} md={4} key={index}>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={content.permisos === 0}
                      className={classes.buttons}
                      onClick={() => {
                        setIdModulo(content.idModulo);
                        setIdMenu(content.submenu.idmenu);
                        setIdSubmenu(content.submenu.idsubmenu);
                        setTipoPublicacion(
                          content.submenu.idsubmenu === 58
                            ? 1
                            : content.submenu.idsubmenu === 59
                            ? 2
                            : 3
                        );
                        setPermisosSubmenu(content.permisos);
                        setNombreSubmenu(content.submenu.nombre_submenu);
                        executeGetPublicaciones({
                          params: {
                            usuario: correoUsuario,
                            pwd: passwordUsuario,
                            rfc: rfcEmpresa,
                            idsubmenu: content.submenu.idsubmenu,
                          },
                        });
                        executeGetCatalogosPublicaciones({
                          params: {
                            usuario: correoUsuario,
                            pwd: passwordUsuario,
                            rfc: rfcEmpresa,
                            idsubmenu: content.submenu.idsubmenu,
                            idTipoPublicacion:
                              content.submenu.idsubmenu === 58
                                ? 1
                                : content.submenu.idsubmenu === 59
                                ? 2
                                : 3,
                          },
                        });
                      }}
                    >
                      {content.submenu.nombre_submenu}
                    </Button>
                  </Grid>
                ) : null;
              })}
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <Card style={{ marginTop: "10px" }}>
        {idSubmenu !== 0 ? (
          <PublicacionesHechas
            idUsuario={idUsuario}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idModulo={idModulo}
            idMenu={idMenu}
            idSubmenu={idSubmenu}
            setIdSubmenu={setIdSubmenu}
            tipoPublicacion={tipoPublicacion}
            permisosSubmenu={permisosSubmenu}
            nombreSubmenu={nombreSubmenu}
            publicaciones={publicaciones}
            catalogos={catalogos}
            setLoading={setLoading}
            executeGetPublicaciones={executeGetPublicaciones}
            executeGetCatalogosPublicaciones={executeGetCatalogosPublicaciones}
            openDialogAgregarCatalogo={openDialogAgregarCatalogo}
            setOpenDialogAgregarCatalogo={setOpenDialogAgregarCatalogo}
          />
        ) : null}
      </Card>
    </Fragment>
  );
}

function PublicacionesHechas(props) {
  const classes = useStyles();
  const setLoading = props.setLoading;
  const idUsuario = props.idUsuario;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  const setIdSubmenu = props.setIdSubmenu;
  const tipoPublicacion = props.tipoPublicacion;
  const permisosSubmenu = props.permisosSubmenu;
  const nombreSubmenu = props.nombreSubmenu;
  const publicaciones = props.publicaciones;
  const catalogos = props.catalogos;
  const executeGetPublicaciones = props.executeGetPublicaciones;
  const executeGetCatalogosPublicaciones =
    props.executeGetCatalogosPublicaciones;
  const openDialogAgregarCatalogo = props.openDialogAgregarCatalogo;
  const setOpenDialogAgregarCatalogo = props.setOpenDialogAgregarCatalogo;
  const [catalogoElegido, setCatalogoElegido] = useState(0);
  const [
    openDialogAgregarPublicacion,
    setOpenDialogAgregarPublicacion,
  ] = useState(false);
  /* const [
    openDialogAgregarDocumentosPublicacion,
    setOpenDialogAgregarDocumentosPublicacion,
  ] = useState(false); */
  const [
    openDialogEditarPublicacion,
    setOpenDialogEditarPublicacion,
  ] = useState(false);
  const [idPublicacion, setIdPublicacion] = useState(0);
  const [tituloPublicacion, setTituloPublicacion] = useState("");
  const [descripcionPublicacion, setDescripcionPublicacion] = useState("");
  const [tipoPublicacionCatalogo, setTipoPublicacionCatalogo] = useState(0);
  const [documentosPublicacion, setDocumentosPublicacion] = useState(null);
  /* const [
    documentosAdicionalesPublicacion,
    setDocumentosAdicionalesPublicacion,
  ] = useState(null); */
  const [nombreCatalogo, setNombreCatalogo] = useState("");
  const [idCatalogo, setIdCatalogo] = useState(0);
  const [infoDocumentosSubidos, setInfoDocumentosSubidos] = useState(false);
  const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
  const [habilitarNombreCatalogo, setHabilitarNombreCatalogo] = useState(false);
  const [busquedaPublicacion, setBusquedaPublicacion] = useState("");

  const [
    {
      data: agregarPublicacionData,
      loading: agregarPublicacionLoading,
      error: agregarPublicacionError,
    },
    executeAgregarPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarPublicacion`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: agregarDocumentosPublicacionData,
      loading: agregarDocumentosPublicacionLoading,
      error: agregarDocumentosPublicacionError,
    },
    executeAgregarDocumentosPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarDocumentosPublicacion`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: editarPublicacionData,
      loading: editarPublicacionLoading,
      error: editarPublicacionError,
    },
    executeEditarPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editarPublicacion`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarCatalogoPublicacionData,
      loading: guardarCatalogoPublicacionLoading,
      error: guardarCatalogoPublicacionError,
    },
    executeGuardarCatalogoPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarCatalogoPublicacion`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: eliminarPublicacionData,
      loading: eliminarPublicacionLoading,
      error: eliminarPublicacionError,
    },
    executeEliminarPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarPublicacion`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: eliminarDocumentoPublicacionData,
      loading: eliminarDocumentoPublicacionLoading,
      error: eliminarDocumentoPublicacionError,
    },
    executeEliminarDocumentoPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarDocumentoPublicacion`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: eliminarCatalogoPublicacionData,
      loading: eliminarCatalogoPublicacionLoading,
      error: eliminarCatalogoPublicacionError,
    },
    executeEliminarCatalogoPublicacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarCatalogoPublicacion`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    setPublicacionesFiltradas(
      publicaciones.filter(
        (publicacion) => publicacion.tipoPublicacion === tipoPublicacion
      )
    );
    filterRowsPublicaciones = publicaciones.filter(
      (publicacion) => publicacion.tipoPublicacion === tipoPublicacion
    );
  }, [publicaciones, tipoPublicacion]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsPublicaciones.length; x++) {
        if (
          filterRowsPublicaciones[x].titulo
            .toLowerCase()
            .indexOf(busquedaPublicacion.toLowerCase()) !== -1 ||
          filterRowsPublicaciones[x].descripcion
            .toLowerCase()
            .indexOf(busquedaPublicacion.toLowerCase()) !== -1 ||
          filterRowsPublicaciones[x].nombreUsuario
            .toLowerCase()
            .indexOf(busquedaPublicacion.toLowerCase()) !==
            -1 
        ) {
          dataFilter.push(filterRowsPublicaciones[x]);
        }
      }
      return dataFilter;
    }

    setPublicacionesFiltradas(
      busquedaPublicacion.trim() !== ""
        ? getFilterRows()
        : filterRowsPublicaciones
    );
  }, [busquedaPublicacion, catalogoElegido]);

  useEffect(() => {
    function checkData() {
      if (guardarCatalogoPublicacionData) {
        if (guardarCatalogoPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarCatalogoPublicacionData.error),
            "warning"
          );
        } else {
          executeGetCatalogosPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idTipoPublicacion:
                idSubmenu === 58 ? 1 : idSubmenu === 59 ? 2 : 3,
            },
          });
          setOpenDialogAgregarCatalogo(true);
        }
      }
    }

    checkData();
  }, [
    guardarCatalogoPublicacionData,
    executeGetCatalogosPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
    setOpenDialogAgregarCatalogo,
  ]);

  useEffect(() => {
    function checkData() {
      if (editarPublicacionData) {
        if (editarPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(editarPublicacionData.error),
            "warning"
          );
        } else {
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
        }
      }
    }

    checkData();
  }, [
    editarPublicacionData,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
  ]);

  useEffect(() => {
    function checkData() {
      if (agregarPublicacionData) {
        if (agregarPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(agregarPublicacionData.error),
            "warning"
          );
        } else {
          setInfoDocumentosSubidos(
            agregarPublicacionData.statusDocumentos !== 1 ? true : false
          );
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
        }
      }
    }

    checkData();
  }, [
    agregarPublicacionData,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
  ]);

  useEffect(() => {
    function checkData() {
      if (agregarDocumentosPublicacionData) {
        if (agregarDocumentosPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(agregarDocumentosPublicacionData.error),
            "warning"
          );
        } else {
          setInfoDocumentosSubidos(
            agregarDocumentosPublicacionData.statusDocumentos !== 1
              ? true
              : false
          );
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
        }
      }
    }

    checkData();
  }, [
    agregarDocumentosPublicacionData,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
  ]);

  useEffect(() => {
    function checkData() {
      if (eliminarPublicacionData) {
        if (eliminarPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminarPublicacionData.error),
            "warning"
          );
        } else {
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
        }
      }
    }

    checkData();
  }, [
    eliminarPublicacionData,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
  ]);

  useEffect(() => {
    function checkData() {
      if (eliminarDocumentoPublicacionData) {
        if (eliminarDocumentoPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminarDocumentoPublicacionData.error),
            "warning"
          );
        } else {
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
        }
      }
    }

    checkData();
  }, [
    eliminarDocumentoPublicacionData,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
  ]);

  useEffect(() => {
    function checkData() {
      if (eliminarCatalogoPublicacionData) {
        if (eliminarCatalogoPublicacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminarCatalogoPublicacionData.error),
            "warning"
          );
        } else {
          executeGetCatalogosPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idTipoPublicacion:
                idSubmenu === 58 ? 1 : idSubmenu === 59 ? 2 : 3,
            },
          });
          executeGetPublicaciones({
            params: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
            },
          });
          setOpenDialogAgregarCatalogo(true);
        }
      }
    }

    checkData();
  }, [
    eliminarCatalogoPublicacionData,
    executeGetCatalogosPublicaciones,
    executeGetPublicaciones,
    correoUsuario,
    idSubmenu,
    passwordUsuario,
    rfcEmpresa,
    setOpenDialogAgregarCatalogo,
  ]);

  if (
    guardarCatalogoPublicacionLoading ||
    agregarPublicacionLoading ||
    editarPublicacionLoading ||
    eliminarDocumentoPublicacionLoading ||
    eliminarPublicacionLoading ||
    agregarDocumentosPublicacionLoading ||
    eliminarCatalogoPublicacionLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    guardarCatalogoPublicacionError ||
    agregarPublicacionError ||
    editarPublicacionError ||
    eliminarDocumentoPublicacionError ||
    eliminarPublicacionError ||
    agregarDocumentosPublicacionError ||
    eliminarCatalogoPublicacionError
  ) {
    return <ErrorQueryDB />;
  }

  const handleCloseDialogAgregarPublicacion = () => {
    setOpenDialogAgregarPublicacion(false);
  };

  /* const handleCloseDialogAgregarDocumentosPublicacion = () => {
    setOpenDialogAgregarDocumentosPublicacion(false);
  }; */

  const handleCloseDialogEditarPublicacion = () => {
    setOpenDialogEditarPublicacion(false);
    setIdPublicacion(0);
    setTituloPublicacion("");
    setDescripcionPublicacion("");
    setTipoPublicacionCatalogo(0);
  };

  const handleCloseDialogAgregarCatalogo = () => {
    setOpenDialogAgregarCatalogo(false);
    setIdCatalogo(0);
    setNombreCatalogo("");
    setHabilitarNombreCatalogo(false);
  };

  const guardarPublicacion = () => {
    if (tituloPublicacion.trim() === "") {
      swal("Error", "Ingrese un título", "warning");
    } else if (descripcionPublicacion.trim() === "") {
      swal("Error", "Ingrese una descripción", "warning");
    } else if (tipoPublicacionCatalogo === 0) {
      swal("Error", "Seleccione un cátalogo", "warning");
    } else if (
      (documentosPublicacion === null || documentosPublicacion.length === 0) &&
      idPublicacion === 0
    ) {
      swal("Error", "Seleccione un archivo", "warning");
    } else {
      const fechaActual = moment().format("YYYY-MM-DD H:mm:ss");
      if (idPublicacion === 0) {
        const codigoArchivo = moment().format("YYYYMMDDHmmss");
        const formData = new FormData();
        formData.append("usuario", correoUsuario);
        formData.append("pwd", passwordUsuario);
        formData.append("rfc", rfcEmpresa);
        formData.append("idsubmenu", idSubmenu);
        formData.append("idmenu", idMenu);
        formData.append("idmodulo", idModulo);
        formData.append("titulo", tituloPublicacion.trim());
        formData.append("descripcion", descripcionPublicacion.trim());
        formData.append(
          "tipoPublicacion",
          idSubmenu === 58 ? 1 : idSubmenu === 59 ? 2 : 3
        );
        formData.append("tipoCatalogo", tipoPublicacionCatalogo);
        formData.append("idUsuario", idUsuario);
        formData.append("fechaPublicacion", fechaActual);
        formData.append("codigoArchivo", codigoArchivo);
        for (let x = 0; x < documentosPublicacion.length; x++) {
          formData.append("documento" + x, documentosPublicacion[x]);
        }
        executeAgregarPublicacion({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        executeEditarPublicacion({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idPublicacion: idPublicacion,
            titulo: tituloPublicacion.trim(),
            descripcion: descripcionPublicacion.trim(),
            tipoCatalogo: tipoPublicacionCatalogo,
            fechaEditado: fechaActual,
          },
        });
      }
    }
  };

  /* const guardarDocumentosPublicacion = () => {
    if (
      documentosAdicionalesPublicacion === null ||
      documentosAdicionalesPublicacion.length === 0
    ) {
      swal("Error", "Seleccione un archivo", "warning");
    } else {
      const codigoArchivo = moment().format("YYYYMMDDHmmss");
      const formData = new FormData();
      formData.append("usuario", correoUsuario);
      formData.append("pwd", passwordUsuario);
      formData.append("rfc", rfcEmpresa);
      formData.append("idsubmenu", idSubmenu);
      formData.append("idPublicacion", idPublicacion);
      formData.append("idmenu", idMenu);
      formData.append("idmodulo", idModulo);
      formData.append("idUsuario", idUsuario);
      formData.append("codigoArchivo", codigoArchivo);
      for (let x = 0; x < documentosAdicionalesPublicacion.length; x++) {
        formData.append("documento" + x, documentosAdicionalesPublicacion[x]);
      }
      executeAgregarDocumentosPublicacion({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  }; */

  const guardarCatalogo = () => {
    if (nombreCatalogo.trim() === "") {
      swal("Error", "Ingrese un nombre del catálogo", "warning");
    } else {
      executeGuardarCatalogoPublicacion({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idCatalogo: idCatalogo,
          nombre: nombreCatalogo.trim(),
          tipo: idSubmenu === 58 ? 1 : idSubmenu === 59 ? 2 : 3,
          accion: idCatalogo === 0 ? 1 : 2,
        },
      });
    }
  };

  return (
    <Grid
      container
      justify="center"
      spacing={3}
      className={classes.submenusForms}
    >
      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          <Tooltip title="Cerrar">
            <IconButton
              aria-label="cerrar"
              onClick={() => {
                setIdSubmenu(0);
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
          {nombreSubmenu}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          disabled={permisosSubmenu < 2}
          onClick={() => {
            setOpenDialogAgregarPublicacion(true);
            setIdPublicacion(0);
          }}
        >
          {`Agregar ${idSubmenu === 58 ? "Folio Oficial" : nombreSubmenu}`}
        </Button>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          label="Catálogos"
          type="text"
          value={catalogoElegido}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          onChange={(e) => {
            setCatalogoElegido(parseInt(e.target.value));
            setPublicacionesFiltradas(
              parseInt(e.target.value) === 0
                ? publicaciones.filter(
                    (publicacion) =>
                      publicacion.tipoPublicacion === tipoPublicacion
                  )
                : publicaciones.filter(
                    (publicacion) =>
                      publicacion.tipoPublicacion === tipoPublicacion &&
                      publicacion.tipoCatalogo === parseInt(e.target.value)
                  )
            );
            filterRowsPublicaciones =
              parseInt(e.target.value) === 0
                ? publicaciones.filter(
                    (publicacion) =>
                      publicacion.tipoPublicacion === tipoPublicacion
                  )
                : publicaciones.filter(
                    (publicacion) =>
                      publicacion.tipoPublicacion === tipoPublicacion &&
                      publicacion.tipoCatalogo === parseInt(e.target.value)
                  );
          }}
        >
          <option value={0}>Todos los catálogos</option>
          <option value={1}>No Clasificadas</option>
          {catalogos.map((catalogo, index) => {
            return (
              <option key={index} value={catalogo.id}>
                {catalogo.nombre}
              </option>
            );
          })}
        </TextField>
        <Tooltip title="Configuración de catálogos">
          <IconButton
            disabled={permisosSubmenu < 2}
            onClick={() => {
              setOpenDialogAgregarCatalogo(true);
            }}
          >
            <SettingsIcon style={{ color: "#000000" }} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={2} md={1} style={{ alignSelf: "center" }}>
        <Tooltip title="Limpiar Búsqueda">
          <IconButton
            aria-label="filtro"
            style={{ float: "right" }}
            onClick={() => {
              setBusquedaPublicacion("");
            }}
          >
            <ClearAllIcon style={{ color: "black" }} />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={10} md={5}>
        <TextField
          className={classes.textFields}
          label="Buscar"
          type="text"
          value={busquedaPublicacion}
          margin="normal"
          onChange={(e) => {
            setBusquedaPublicacion(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} style={{ alignSelf: "center" }}></Grid>
      {infoDocumentosSubidos ? (
        <Grid item xs={12}>
          <Alert
            severity="error"
            onClose={() => {
              setInfoDocumentosSubidos(false);
            }}
          >
            No se han podido subir los archivos
          </Alert>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {publicacionesFiltradas.map((publicacion, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card className={classes.root}>
                <CardContent style={{ height: "200px", overflowY: "auto" }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {publicacion.titulo}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {publicacion.descripcion}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <span
                      style={{ fontSize: "14px" }}
                    >{`${publicacion.nombreUsuario}`}</span>
                    <br />
                    <span style={{ fontSize: "14px" }}>{`Última Edición: ${
                      publicacion.fechaEditado !== null
                        ? publicacion.fechaEditado
                        : publicacion.fechaPublicacion
                    }`}</span>
                  </Typography>
                </CardContent>
                <CardContent
                  style={{ height: "150px", overflowY: "auto", padding: 0 }}
                >
                  <List
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        Documentos
                      </ListSubheader>
                    }
                  >
                    {publicacion.documentos.map((documento, index2) => (
                      <ListItem
                        button
                        key={index2}
                        variant="subtitle1"
                        className={classes.link}
                        onClick={() => {
                          window.open(documento.link);
                        }}
                      >
                        <ListItemText
                          classes={{ primary: classes.documentosTexto }}
                          primary={documento.nombre}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip
                            title="Eliminar"
                            disabled={permisosSubmenu < 3}
                          >
                            <span>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                disabled={permisosSubmenu < 3}
                                onClick={() => {
                                  swal({
                                    text:
                                      "¿Está seguro de eliminar este documento?",
                                    buttons: ["No", "Sí"],
                                    dangerMode: true,
                                  }).then((value) => {
                                    if (value) {
                                      const fechaActual = moment().format(
                                        "YYYY-MM-DD H:mm:ss"
                                      );
                                      executeEliminarDocumentoPublicacion({
                                        data: {
                                          usuario: correoUsuario,
                                          pwd: passwordUsuario,
                                          rfc: rfcEmpresa,
                                          idsubmenu: idSubmenu,
                                          idDocumento: documento.id,
                                          rutaDocumento:
                                            documento.ruta +
                                            "/" +
                                            documento.nombre,
                                          idPublicacion: publicacion.id,
                                          fechaEditado: fechaActual,
                                        },
                                      });
                                    }
                                  });
                                }}
                              >
                                <CloseIcon
                                  color={
                                    permisosSubmenu < 3
                                      ? "disabled"
                                      : "secondary"
                                  }
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    disabled={
                      idUsuario !== publicacion.idUsuario || permisosSubmenu < 2
                    }
                    onClick={() => {
                      /* setOpenDialogAgregarDocumentosPublicacion(true); */
                      /* setIdPublicacion(publicacion.id); */
                      var input = document.createElement("input");
                      input.type = "file";
                      input.setAttribute("multiple", true);
                      input.onchange = (e) => {
                        var documentosAdicionalesPublicacion = e.target.files;
                        const fechaActual = moment().format(
                          "YYYY-MM-DD H:mm:ss"
                        );
                        const codigoArchivo = moment().format("YYYYMMDDHmmss");
                        const formData = new FormData();
                        formData.append("usuario", correoUsuario);
                        formData.append("pwd", passwordUsuario);
                        formData.append("rfc", rfcEmpresa);
                        formData.append("idsubmenu", idSubmenu);
                        formData.append("idPublicacion", publicacion.id);
                        formData.append("idmenu", idMenu);
                        formData.append("idmodulo", idModulo);
                        formData.append("idUsuario", idUsuario);
                        formData.append("codigoArchivo", codigoArchivo);
                        formData.append("fechaEditado", fechaActual);
                        for (
                          let x = 0;
                          x < documentosAdicionalesPublicacion.length;
                          x++
                        ) {
                          formData.append(
                            "documento" + x,
                            documentosAdicionalesPublicacion[x]
                          );
                        }
                        executeAgregarDocumentosPublicacion({
                          data: formData,
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        });
                      };
                      input.click();
                    }}
                  >
                    Agregar Documento
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    disabled={
                      idUsuario !== publicacion.idUsuario || permisosSubmenu < 2
                    }
                    onClick={() => {
                      setOpenDialogEditarPublicacion(true);
                      setIdPublicacion(publicacion.id);
                      setTituloPublicacion(publicacion.titulo);
                      setDescripcionPublicacion(publicacion.descripcion);
                      setTipoPublicacionCatalogo(
                        publicacion.tipoCatalogo !== 1
                          ? publicacion.tipoCatalogo
                          : 0
                      );
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    disabled={
                      idUsuario !== publicacion.idUsuario || permisosSubmenu < 3
                    }
                    onClick={() => {
                      swal({
                        text: "¿Está seguro de eliminar esta publicación?",
                        buttons: ["No", "Sí"],
                        dangerMode: true,
                      }).then((value) => {
                        if (value) {
                          const fechaActual = moment().format(
                            "YYYY-MM-DD H:mm:ss"
                          );
                          executeEliminarPublicacion({
                            data: {
                              usuario: correoUsuario,
                              pwd: passwordUsuario,
                              rfc: rfcEmpresa,
                              idsubmenu: idSubmenu,
                              idPublicacion: publicacion.id,
                              fechaEliminacion: fechaActual,
                            },
                          });
                        }
                      });
                    }}
                  >
                    Eliminar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Dialog
        onClose={handleCloseDialogAgregarPublicacion}
        aria-labelledby="simple-dialog-title"
        open={openDialogAgregarPublicacion}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">{`Agregar ${
          idSubmenu === 58 ? "Folio Oficial" : nombreSubmenu
        }`}</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Título"
                type="text"
                value={tituloPublicacion}
                margin="normal"
                onChange={(e) => {
                  setTituloPublicacion(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Descripción"
                type="text"
                value={descripcionPublicacion}
                margin="normal"
                onChange={(e) => {
                  setDescripcionPublicacion(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Catálogos"
                type="text"
                value={tipoPublicacionCatalogo}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setTipoPublicacionCatalogo(parseInt(e.target.value));
                }}
              >
                <option value={0}>Elija un catálogo</option>
                {catalogos.map((catalogo, index) => {
                  return (
                    <option key={index} value={catalogo.id}>
                      {catalogo.nombre}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                type="file"
                inputProps={{
                  multiple: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setDocumentosPublicacion(e.target.files);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogAgregarPublicacion}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarPublicacion();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogAgregarCatalogo}
        aria-labelledby="simple-dialog-title"
        open={openDialogAgregarCatalogo}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">{`Catálogos`}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} style={{ display: "flex" }}>
              <TextField
                className={classes.textFields}
                label="Nombre"
                type="text"
                required
                disabled={!habilitarNombreCatalogo}
                value={nombreCatalogo}
                margin="normal"
                onChange={(e) => {
                  setNombreCatalogo(e.target.value);
                }}
              />
              {/* {idCatalogo !== 0 ? (
                <Tooltip title="Cancelar">
                  <IconButton
                    style={{ alignSelf: "flex-end" }}
                    onClick={() => {
                      setIdCatalogo(0);
                      setNombreCatalogo("");
                      setHabilitarNombreCatalogo(false);
                    }}
                  >
                    <CloseIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              ) : null} */}
            </Grid>
            <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
              <Button
                variant="contained"
                color={!habilitarNombreCatalogo ? "primary" : "secondary"}
                style={{ float: "right", width: "150px" }}
                disabled={permisosSubmenu < 2}
                onClick={() => {
                  if (habilitarNombreCatalogo) {
                    setIdCatalogo(0);
                    setNombreCatalogo("");
                  }
                  setHabilitarNombreCatalogo(!habilitarNombreCatalogo);
                }}
              >
                {!habilitarNombreCatalogo ? `Nuevo` : `Cancelar`}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Lista de Catálogos</Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell>
                        <strong>Nombre</strong>
                      </TableCell>
                      <TableCell align="right">
                        <SettingsIcon style={{ color: "#000000" }} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {catalogos.map((catalogo, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {catalogo.nombre}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip
                            title="Editar"
                            disabled={permisosSubmenu < 2}
                          >
                            <span>
                              <IconButton
                                disabled={permisosSubmenu < 2}
                                onClick={() => {
                                  setIdCatalogo(catalogo.id);
                                  setNombreCatalogo(catalogo.nombre);
                                  setHabilitarNombreCatalogo(true);
                                }}
                              >
                                <EditIcon
                                  style={{
                                    color:
                                      permisosSubmenu < 2
                                        ? "disabled"
                                        : "black",
                                  }}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip
                            title="Eliminar"
                            disabled={permisosSubmenu < 3}
                          >
                            <span>
                              <IconButton
                                disabled={permisosSubmenu < 3}
                                onClick={() => {
                                  swal({
                                    text: `¿Está seguro de eliminar este catálogo? Si existen publicaciones con este catálogo, pasaran a estar "no clasificadas".`,
                                    buttons: ["No", "Sí"],
                                    dangerMode: true,
                                  }).then((value) => {
                                    if (value) {
                                      executeEliminarCatalogoPublicacion({
                                        data: {
                                          usuario: correoUsuario,
                                          pwd: passwordUsuario,
                                          rfc: rfcEmpresa,
                                          idsubmenu: idSubmenu,
                                          idCatalogo: catalogo.id,
                                        },
                                      });
                                    }
                                  });
                                }}
                              >
                                <CloseIcon
                                  color={
                                    permisosSubmenu < 3
                                      ? "disabled"
                                      : "secondary"
                                  }
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogAgregarCatalogo}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            disabled={permisosSubmenu < 2 || !habilitarNombreCatalogo}
            onClick={() => {
              guardarCatalogo();
            }}
          >
            {`Guardar`}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogEditarPublicacion}
        aria-labelledby="simple-dialog-title"
        open={openDialogEditarPublicacion}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">{`Editar ${
          idSubmenu === 58 ? "Folio Oficial" : nombreSubmenu
        }`}</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Título"
                type="text"
                value={tituloPublicacion}
                margin="normal"
                onChange={(e) => {
                  setTituloPublicacion(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Descripción"
                type="text"
                value={descripcionPublicacion}
                margin="normal"
                onChange={(e) => {
                  setDescripcionPublicacion(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Catálogos"
                type="text"
                value={tipoPublicacionCatalogo}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setTipoPublicacionCatalogo(parseInt(e.target.value));
                }}
              >
                <option value={0}>Elija un catálogo</option>
                {catalogos.map((catalogo, index) => {
                  return (
                    <option key={index} value={catalogo.id}>
                      {catalogo.nombre}
                    </option>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogEditarPublicacion}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarPublicacion();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        onClose={handleCloseDialogAgregarDocumentosPublicacion}
        aria-labelledby="simple-dialog-title"
        open={openDialogAgregarDocumentosPublicacion}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">{`Agregar Documentos`}</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                type="file"
                inputProps={{
                  multiple: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setDocumentosAdicionalesPublicacion(e.target.files);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogAgregarDocumentosPublicacion}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarDocumentosPublicacion();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog> */}
    </Grid>
  );
}
