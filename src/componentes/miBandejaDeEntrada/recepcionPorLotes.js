import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Grid,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  useMediaQuery,
  List,
  ListItem,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ArrowBack as ArrowBackIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Error as ErrorIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import { verificarArchivoLote } from "../../helpers/extensionesArchivos";
import jwt from "jsonwebtoken";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "10px",
    marginBottom: "20px",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  titleTable: {
    flex: "1 1 50%",
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
  root: {
    maxWidth: "100%",
  },
  paper: {
    width: "100%",
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

function createData(
  fecha,
  usuario,
  tipoDocumento,
  sucursal,
  detalles,
  registros,
  acciones
) {
  return {
    fecha,
    usuario,
    tipoDocumento,
    sucursal,
    detalles,
    registros,
    acciones,
  };
}

let filterRows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "fecha",
    align: "left",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "usuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario",
  },
  {
    id: "tipoDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo De Documento",
  },
  {
    id: "sucursal",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sucursal",
  },
  {
    id: "detalles",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Detalles",
  },
  {
    id: "registros",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Registros",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortHeadCell ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function RecepcionPorLotes(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const submenuContent = props.submenuContent;
  const [openDialogPlantillas, setOpenDialogPlantillas] = useState(false);
  const [showComponent, setShowComponent] = useState(0);
  const [tittleTableComponent, setTittleTableComponent] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const empresaDatos = props.empresaDatos;
  //const nombreEmpresa = empresaDatos.nombreempresa;
  const idEmpresa = empresaDatos.idempresa;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const rfc = empresaDatos.RFC;
  const statusEmpresa = empresaDatos.statusempresa;
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [idSubmenu, setIdSubmenu] = useState(0);
  const setLoading = props.setLoading;
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [subtitulo, setSubtitulo] = useState("");
  const [idLote, setIdLote] = useState(0);
  const [tipoLote, setTipoLote] = useState(0);
  const [
    {
      data: traerLotesData,
      loading: traerLotesLoading,
      error: traerLotesError,
    },
    executeTraerLotes,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerLotes`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        idmenu: 6,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: traerPlantillasData,
      loading: traerPlantillasLoading,
      error: traerPlantillasError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerPlantillas`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 17,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (
      idLote === 0 &&
      showComponent === 0 &&
      tittleTableComponent === "" &&
      idSubmenu === 0
    ) {
      if (localStorage.getItem("menuTemporal")) {
        try {
          const decodedToken = jwt.verify(
            localStorage.getItem("menuTemporal"),
            "mysecretpassword"
          );
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setTittleTableComponent(decodedToken.menuTemporal.tableTittle);
          setIdSubmenu(decodedToken.menuTemporal.idSubmenu);
        } catch (err) {
          localStorage.removeItem("menuTemporal");
        }
      }
    }
  }, [idLote, showComponent, tittleTableComponent, idSubmenu]);

  useEffect(() => {
    for (let x = 0; x < submenuContent.length; x++) {
      if (submenuContent[x].submenu.idsubmenu === parseInt(idSubmenu)) {
        setPermisosSubmenu(submenuContent[x].permisos);
      }
    }
  }, [idSubmenu, submenuContent, showComponent]);

  useEffect(() => {
    function checkData() {
      if (traerLotesData) {
        if (traerLotesData.error !== 0) {
          swal("Error", dataBaseErrores(traerLotesData.error), "warning");
        } else {
          filterRows = [];
          traerLotesData.lotes.map((lote) => {
            return filterRows.push(
              createData(
                lote.fechadecarga,
                lote.usuario,
                lote.tipodet,
                lote.sucursal,
                `Registros: ${lote.totalregistros} Cargados: ${lote.totalcargados} Error: ${lote.cError}`,
                `Procesados ${lote.procesados} de ${lote.totalregistros}`,
                <IconButton
                  onClick={(e) => {
                    handleOpenMenu(e);
                    setSubtitulo(lote.tipodet);
                    setIdLote(lote.id);
                    setTipoLote(lote.tipo);
                  }}
                >
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              )
            );
          });
          setRows(filterRows);
        }
      }
    }

    checkData();
  }, [traerLotesData]);

  if (traerLotesLoading || traerPlantillasLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerLotesError || traerPlantillasError) {
    return <ErrorQueryDB />;
  }

  const handleOpenDialogPlantillas = () => {
    setOpenDialogPlantillas(true);
  };

  const handleCloseDialogPlantillas = () => {
    setOpenDialogPlantillas(false);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const getPlantillas = () => {
    return traerPlantillasData.plantillas.map((plantilla, index) => {
      return (
        <List key={index}>
          <ListItem
            button
            onClick={() => {
              window.open(plantilla.link);
            }}
          >
            <ListItemText primary={plantilla.tipo} />
          </ListItem>
          <Divider />
        </List>
      );
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Recepción Por Lotes
            </Typography>
          </Grid>
          <Grid item xs={12} md={10} style={{ alignSelf: "center" }}>
            <Button
              color="default"
              variant="contained"
              style={{ float: "right", marginBottom: "10px" }}
              onClick={handleOpenDialogPlantillas}
            >
              Plantillas
            </Button>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden !== 0 ? (
              <Grid item xs={12} md={5} key={index}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    setShowComponent(1);
                    setTittleTableComponent(content.submenu.nombre_submenu);
                    setIdSubmenu(content.submenu.idsubmenu);
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          tableTittle: content.submenu.nombre_submenu,
                          showComponent: 1,
                          idSubmenu: content.submenu.idsubmenu
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token);
                  }}
                >
                  {content.submenu.nombre_submenu}
                </Button>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Card>
      <Card>
        {showComponent > 0 ? (
          <TablaRPL
            tittle={tittleTableComponent}
            showComponent={showComponent}
            setShowComponent={setShowComponent}
            page={page}
            setPage={setPage}
            rows={rows}
            setRows={setRows}
            anchorMenuEl={anchorMenuEl}
            handleCloseMenu={handleCloseMenu}
            subtitulo={subtitulo}
            idEmpresa={idEmpresa}
            idLote={idLote}
            setLoading={setLoading}
            idUsuario={idUsuario}
            usuario={usuario}
            pwd={pwd}
            rfc={rfc}
            idSubmenu={idSubmenu}
            executeTraerLotes={executeTraerLotes}
            tipoLote={tipoLote}
            statusEmpresa={statusEmpresa}
            permisosSubmenu={permisosSubmenu}
          />
        ) : null}
      </Card>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogPlantillas}
        onClose={handleCloseDialogPlantillas}
        aria-labelledby="responsive-dialog-title"
      >
        <Typography
          variant="subtitle1"
          style={{ marginTop: "10px", marginBottom: "10px", padding: "20px" }}
        >
          <strong>PLANTILLAS DISPONIBLES PARA DESCARGA.</strong>
        </Typography>
        <Divider />
        <DialogContent>{getPlantillas()}</DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogPlantillas}
            color="default"
            variant="contained"
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    maxWidth: "500px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

function TablaRPL(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const tableTittle = props.tittle;
  const page = props.page;
  const setPage = props.setPage;
  const rows = props.rows;
  const idUsuario = props.idUsuario;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  //const setRows = props.setRows;
  const showComponent = props.showComponent;
  const setShowComponent = props.setShowComponent;
  const anchorMenuEl = props.anchorMenuEl;
  const handleCloseMenu = props.handleCloseMenu;
  const subtitulo = props.subtitulo;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setLoading = props.setLoading;
  const executeTraerLotes = props.executeTraerLotes;
  const tipoLote = props.tipoLote;
  const statusEmpresa = props.statusEmpresa;
  const permisosSubmenu = props.permisosSubmenu;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [folioSerie, setFolioSerie] = useState("");
  const [idNivelDocumento, setIdNivelDocumento] = useState(0);
  const [lotes, setLotes] = useState([]);
  const [tituloDocumento, setTituloDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState(0);
  const [disabledProcesar, setDisabledProcesar] = useState(true);
  const [openDialogNuevosDatos, setOpenDialogNuevosDatos] = useState(false);
  const [clientesNuevos, setClientesNuevos] = useState([]);
  const [datosClientesNuevos, setDatosClientesNuevos] = useState({
    elementos: [],
    codigos: [],
    rfcs: [],
    razonesSociales: [],
  });
  const [productosNuevos, setProductosNuevos] = useState([]);
  const [datosProductosNuevos, setDatosProductosNuevos] = useState({
    elementos: [],
    codigoProductos: [],
    nombreProductos: [],
  });
  const [visibilityNuevosProductos, setVisibilityNuevosProductos] = useState(
    false
  );
  const [visibilityNuevosClientes, setVisibilityNuevosClientes] = useState(
    false
  );
  const [
    {
      data: eliminaLoteData,
      loading: eliminaLoteLoading,
      error: eliminaLoteError,
    },
    executeEliminaLote,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaLote`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: validarDocumentoLoteData,
      loading: validarDocumentoLoteLoading,
      error: validarDocumentoLoteError,
    },
    executeValidarDocumentoLote,
  ] = useAxios(
    {
      url: API_BASE_URL + `/validarDocumentoLote`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: guardarLoteData,
      loading: guardarLoteLoading,
      error: guardarLoteError,
    },
    executeGuardarLote,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarLote`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: registrarElementosData,
      loading: registrarElementosLoading,
      error: registrarElementosError,
    },
    executeRegistrarElementos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/registrarElementos`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (eliminaLoteData) {
        if (eliminaLoteData.error !== 0) {
          swal("Error", dataBaseErrores(eliminaLoteData.error), "warning");
        } else {
          swal("Registro Eliminado", "Registro eliminado con éxito", "success");
          executeTraerLotes();
        }
      }
    }

    checkData();
  }, [eliminaLoteData, executeTraerLotes]);

  useEffect(() => {
    function checkData() {
      if (validarDocumentoLoteData) {
        if (validarDocumentoLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(validarDocumentoLoteData.error),
            "warning"
          );
        } else {
          let nuevosClientes = [];
          let nuevosProductos = [];
          let elementoProductos = [];
          let codigoProductos = [];
          let nombreProductos = [];
          let elementoClientes = [];
          let codigoClientes = [];
          let rfcClientes = [];
          let razonSocialClientes = [];
          for (let x = 0; x < validarDocumentoLoteData.documentos.length; x++) {
            if (validarDocumentoLoteData.documentos[x].productoreg === 1) {
              nuevosProductos.push(validarDocumentoLoteData.documentos[x]);
              elementoProductos.push(
                validarDocumentoLoteData.documentos[x].codigoproducto
              );
              codigoProductos.push(
                validarDocumentoLoteData.documentos[x].codigoproducto
              );
              nombreProductos.push(
                validarDocumentoLoteData.documentos[x].nombreproducto
              );
            }
            if (validarDocumentoLoteData.documentos[x].clienprovreg === 1) {
              let validarRFC = 0;
              for (let y = 0; y < codigoClientes.length; y++) {
                if (
                  validarDocumentoLoteData.documentos[x].rfc ===
                  elementoClientes[y]
                ) {
                  validarRFC++;
                  break;
                }
              }
              if (validarRFC === 0) {
                nuevosClientes.push(validarDocumentoLoteData.documentos[x]);
                elementoClientes.push(
                  validarDocumentoLoteData.documentos[x].rfc
                );
                codigoClientes.push(
                  validarDocumentoLoteData.documentos[x].codigocliprov === ""
                    ? validarDocumentoLoteData.documentos[x].rfc
                    : validarDocumentoLoteData.documentos[x].codigocliprov
                );
                rfcClientes.push(validarDocumentoLoteData.documentos[x].rfc);
                razonSocialClientes.push(
                  validarDocumentoLoteData.documentos[x].razonsocial
                );
              }
            }
          }

          setProductosNuevos(nuevosProductos);
          setClientesNuevos(nuevosClientes);
          setDatosProductosNuevos({
            elementos: elementoProductos,
            codigoProductos: codigoProductos,
            nombreProductos: nombreProductos,
          });
          setDatosClientesNuevos({
            elementos: elementoClientes,
            codigos: codigoClientes,
            rfcs: rfcClientes,
            razonesSociales: razonSocialClientes,
          });

          if (nuevosClientes.length > 0 || nuevosProductos.length > 0) {
            setOpenDialogNuevosDatos(true);
          }

          setLotes(validarDocumentoLoteData.documentos);
          setTituloDocumento(
            validarDocumentoLoteData.tipodocto === 2
              ? "Consumo Diesel"
              : validarDocumentoLoteData.tipodocto === 3
              ? "Remisión"
              : validarDocumentoLoteData.tipodocto === 4
              ? "Entrada De Materia Prima"
              : validarDocumentoLoteData.tipodocto === 5
              ? "Salida De Materia Prima"
              : ""
          );
          setTipoDocumento(validarDocumentoLoteData.tipodocto);
          setShowComponent(5);
          setDisabledProcesar(false);
        }
      }
    }

    checkData();
  }, [validarDocumentoLoteData, setShowComponent]);

  useEffect(() => {
    function checkData() {
      if (guardarLoteData) {
        if (guardarLoteData.error !== 0) {
          swal("Error", dataBaseErrores(guardarLoteData.error), "warning");
        } else {
          swal("Registro agregado", "Registro agregado con éxito", "success");
          executeTraerLotes();
          setDisabledProcesar(true);
          setShowComponent(1);
        }
      }
    }

    checkData();
  }, [guardarLoteData, executeTraerLotes, setShowComponent]);

  useEffect(() => {
    function checkData() {
      if (registrarElementosData) {
        if (registrarElementosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(registrarElementosData.error),
            "warning"
          );
        } else {
          swal(
            "Elementos Registrados",
            "Se han registrado con éxito los elementos",
            "success"
          );
          setOpenDialogNuevosDatos(false);
        }
      }
    }

    checkData();
  }, [registrarElementosData]);

  useEffect(() => {
    if (lotes.length > 0) {
      setDisabledProcesar(false);
    } else {
      setDisabledProcesar(true);
    }
  }, [lotes.length]);

  if (
    eliminaLoteLoading ||
    validarDocumentoLoteLoading ||
    guardarLoteLoading ||
    registrarElementosLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    eliminaLoteError ||
    validarDocumentoLoteError ||
    guardarLoteError ||
    registrarElementosError
  ) {
    return <ErrorQueryDB />;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialogNuevosDatos = () => {
    setOpenDialogNuevosDatos(false);
    setVisibilityNuevosProductos(false);
    setVisibilityNuevosClientes(false);
    setShowComponent(1);
  };

  const agregarNuevosDatos = () => {
    let validacion = 0;
    for (let x = 0; x < datosProductosNuevos.codigoProductos.length; x++) {
      if (
        datosProductosNuevos.codigoProductos[x].trim() === "" ||
        datosProductosNuevos.nombreProductos[x].trim() === ""
      ) {
        validacion++;
      }
    }
    for (let x = 0; x < datosClientesNuevos.codigos.length; x++) {
      if (
        datosClientesNuevos.rfcs[x].trim() === "" ||
        datosClientesNuevos.razonesSociales[x].trim() === ""
      ) {
        validacion++;
      }
    }
    if (validacion === 0) {
      executeRegistrarElementos({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idsubmenu: idSubmenu,
          tipodocumento: tipoDocumento,
          productosnuevos: datosProductosNuevos,
          clientesnuevos: datosClientesNuevos,
        },
      });
    } else {
      swal("Error", "No deje campos vacíos", "warning");
    }
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container>
            <Tooltip title="Cerrar">
              <IconButton
                aria-label="cerrar"
                onClick={() => {
                  setShowComponent(0);
                  const token = jwt.sign(
                    {
                      menuTemporal: {
                        tableTittle: "",
                        showComponent: 0,
                        idSubmenu: 0
                      },
                    },
                    "mysecretpassword"
                  );
                  localStorage.setItem("menuTemporal", token);
                }}
              >
                <CloseIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Typography
              className={classes.titleTable}
              variant="h6"
              style={{ alignSelf: "center" }}
              id="tableTitle"
            >
              {tableTittle}
            </Typography>
          </Grid>
        </Toolbar>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              disabled={permisosSubmenu < 1 || statusEmpresa !== 1}
              type="file"
              style={{ marginLeft: "15px", width: "90%" }}
              onChange={(e) => {
                const documento = e.target.files[0];
                if (!verificarArchivoLote(documento.name)) {
                  swal(
                    "Error de extensión de archivo",
                    "Extensión no valida, seleccione un archivo .xlsm",
                    "warning"
                  );
                } else {
                  const formData = new FormData();
                  formData.append("usuario", usuario);
                  formData.append("pwd", pwd);
                  formData.append("rfc", rfc);
                  formData.append("idmenu", 6);
                  formData.append("idsubmenu", idSubmenu);
                  formData.append("documento", documento);
                  executeValidarDocumentoLote({
                    data: formData,
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3} style={{ alignSelf: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              disabled={disabledProcesar}
              style={{
                marginTop: 0,
                marginBottom: 0,
                marginLeft: "15px",
                width: "90%",
              }}
              onClick={() => {
                if (lotes.length > 0) {
                  executeGuardarLote({
                    data: {
                      usuario: usuario,
                      pwd: pwd,
                      rfc: rfc,
                      idsubmenu: idSubmenu,
                      movimientos: lotes,
                      idusuario: idUsuario,
                      tipodocto: tipoDocumento,
                    },
                  });
                } else {
                  swal("Error", "No hay documentos para procesar", "warning");
                }
              }}
            >
              Procesar
            </Button>
          </Grid>
        </Grid>
        {showComponent === 1 ? (
          <Fragment>
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ margin: "20px" }}>
                <strong>Listado De Los Últimos Lotes Cargados.</strong>
              </Typography>
            </Grid>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows.length > 0 ? (
                    stableSort(rows, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.fecha}
                          >
                            <TableCell padding="checkbox" />
                            <TableCell component="th" id={labelId} scope="row">
                              {row.fecha}
                            </TableCell>
                            <TableCell align="right">{row.usuario}</TableCell>
                            <TableCell align="right">
                              {row.tipoDocumento}
                            </TableCell>
                            <TableCell align="right">{row.sucursal}</TableCell>
                            <TableCell align="right">{row.detalles}</TableCell>
                            <TableCell align="right">{row.registros}</TableCell>
                            <TableCell align="right">{row.acciones}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography variant="subtitle1">
                          <ErrorIcon
                            style={{ color: "red", verticalAlign: "sub" }}
                          />
                          No hay registros disponibles
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={(e) => {
                return `${e.from}-${e.to} de ${e.count}`;
              }}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Fragment>
        ) : showComponent === 2 ? (
          <NivelDocumentos
            subtitulo={subtitulo}
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idLote={idLote}
            setIdNivelDocumento={setIdNivelDocumento}
            setLoading={setLoading}
            setFolioSerie={setFolioSerie}
            usuario={usuario}
            pwd={pwd}
            rfc={rfc}
            idSubmenu={idSubmenu}
            executeTraerLotes={executeTraerLotes}
            tipoLote={tipoLote}
            statusEmpresa={statusEmpresa}
            permisosSubmenu={permisosSubmenu}
          />
        ) : showComponent === 3 ? (
          <VerMovimientosDocumentos
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idNivelDocumento={idNivelDocumento}
            subtitulo={subtitulo}
            folioSerie={folioSerie}
            setLoading={setLoading}
            tipoLote={tipoLote}
          />
        ) : showComponent === 4 ? (
          <VerNivelMovimientos
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idLote={idLote}
            subtitulo={subtitulo}
            setLoading={setLoading}
            tipoLote={tipoLote}
          />
        ) : showComponent === 5 ? (
          <PreviewsDocumentos
            setShowComponent={setShowComponent}
            lotes={lotes}
            setLotes={setLotes}
            tituloDocumento={tituloDocumento}
            setLoading={setLoading}
            executeTraerLotes={executeTraerLotes}
            usuario={usuario}
            pwd={pwd}
            rfc={rfc}
            idSubmenu={idSubmenu}
            tipoDocumento={tipoDocumento}
          />
        ) : null}
      </Paper>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuEl}
        keepMounted
        open={Boolean(anchorMenuEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setShowComponent(2);
          }}
        >
          <ListItemText primary="Nivel de Documentos" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setShowComponent(4);
          }}
        >
          <ListItemText primary="Nivel de Movimientos" />
        </MenuItem>
        {permisosSubmenu < 3 || statusEmpresa !== 1 ? (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              swal({
                text: "¿Está seguro de eliminar el registro?",
                buttons: ["No", "Sí"],
                dangerMode: true,
              }).then((value) => {
                if (value) {
                  executeEliminaLote({
                    data: {
                      usuario: usuario,
                      pwd: pwd,
                      rfc: rfc,
                      idsubmenu: idSubmenu,
                      idlote: idLote,
                    },
                  });
                }
              });
            }}
          >
            <ListItemText primary="Eliminar Lote" />
          </MenuItem>
        ) : null}
      </StyledMenu>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogNuevosDatos}
        onClose={handleCloseDialogNuevosDatos}
        aria-labelledby="responsive-dialog-title"
        maxWidth="md"
      >
        <Typography
          variant="subtitle1"
          style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}
        >
          CATALOGOS CON ELEMENTOS PENDIENTES POR REGISTRAR.
        </Typography>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>
                    <strong>CATÁLOGOS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>PENDIENTES</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosNuevos.length > 0 ? (
                  <TableRow
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setVisibilityNuevosProductos(!visibilityNuevosProductos);
                      setVisibilityNuevosClientes(false);
                    }}
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell align="left">Productos</TableCell>
                    <TableCell align="right">
                      {productosNuevos.length}
                    </TableCell>
                  </TableRow>
                ) : null}
                {clientesNuevos.length > 0 ? (
                  <TableRow
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setVisibilityNuevosClientes(!visibilityNuevosClientes);
                      setVisibilityNuevosProductos(false);
                    }}
                  >
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell align="left">Clientes/Proveedores</TableCell>
                    <TableCell align="right">{clientesNuevos.length}</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          {productosNuevos.length > 0 && visibilityNuevosProductos ? (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead style={{ background: "#FAFAFA" }}>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell align="center">
                      <strong>ELEMENTO</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>CÓDIGO DEL PRODUCTO</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>NOMBRE DEL PRODUCTO</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosNuevos.map((producto, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell align="center">
                          {datosProductosNuevos.elementos[index]}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id={`codigoProducto${index}`}
                            className={classes.textFields}
                            variant="outlined"
                            type="text"
                            inputProps={{
                              maxLength: 20,
                            }}
                            onKeyPress={(e) => {
                              keyValidation(e, 5);
                            }}
                            value={datosProductosNuevos.codigoProductos[index]}
                            onChange={(e) => {
                              pasteValidation(e, 5);
                              const nuevosCodigosProductos =
                                datosProductosNuevos.codigoProductos;
                              nuevosCodigosProductos[index] = e.target.value;
                              setDatosProductosNuevos({
                                ...datosProductosNuevos,
                                codigoProductos: nuevosCodigosProductos,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id={`nombreProducto${index}`}
                            className={classes.textFields}
                            variant="outlined"
                            type="text"
                            inputProps={{
                              maxLength: 100,
                            }}
                            onKeyPress={(e) => {
                              keyValidation(e, 3);
                            }}
                            value={datosProductosNuevos.nombreProductos[index]}
                            onChange={(e) => {
                              pasteValidation(e, 3);
                              const nuevosNombresProductos =
                                datosProductosNuevos.nombreProductos;
                              nuevosNombresProductos[index] = e.target.value;
                              setDatosProductosNuevos({
                                ...datosProductosNuevos,
                                nombreProductos: nuevosNombresProductos,
                              });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
          {clientesNuevos.length > 0 && visibilityNuevosClientes ? (
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead style={{ background: "#FAFAFA" }}>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell align="center">
                      <strong>ELEMENTO</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>CÓDIGO</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>RFC</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>RAZÓN SOCIAL</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientesNuevos.map((cliente, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell align="center">
                          {datosClientesNuevos.elementos[index]}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            className={classes.textFields}
                            variant="outlined"
                            type="text"
                            disabled
                            inputProps={{
                              maxLength: 20,
                            }}
                            value={datosClientesNuevos.codigos[index]}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id={`rfc${index}`}
                            className={classes.textFields}
                            variant="outlined"
                            type="text"
                            inputProps={{
                              maxLength: 20,
                            }}
                            onKeyPress={(e) => {
                              keyValidation(e, 5);
                            }}
                            value={datosClientesNuevos.rfcs[index]}
                            onChange={(e) => {
                              pasteValidation(e, 5);
                              const nuevosRfcsClientes =
                                datosClientesNuevos.rfcs;
                              nuevosRfcsClientes[index] = e.target.value;
                              setDatosClientesNuevos({
                                ...datosClientesNuevos,
                                rfcs: nuevosRfcsClientes,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            id={`razonSocial${index}`}
                            className={classes.textFields}
                            variant="outlined"
                            type="text"
                            inputProps={{
                              maxLength: 100,
                            }}
                            onKeyPress={(e) => {
                              keyValidation(e, 3);
                            }}
                            value={datosClientesNuevos.razonesSociales[index]}
                            onChange={(e) => {
                              pasteValidation(e, 3);
                              const nuevasRazonesSocialesClientes =
                                datosClientesNuevos.razonesSociales;
                              nuevasRazonesSocialesClientes[index] =
                                e.target.value;
                              setDatosClientesNuevos({
                                ...datosClientesNuevos,
                                razonesSociales: nuevasRazonesSocialesClientes,
                              });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              agregarNuevosDatos();
            }}
          >
            Continuar
          </Button>
          <Button
            onClick={handleCloseDialogNuevosDatos}
            color="default"
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function PreviewsDocumentos(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  const lotes = props.lotes;
  const setLotes = props.setLotes;
  const tituloDocumento = props.tituloDocumento;
  const setLoading = props.setLoading;
  //const executeTraerLotes = props.executeTraerLotes;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  const tipoDocumento = props.tipoDocumento;

  const [
    {
      data: eliminaDocumentoLoteData,
      loading: eliminaDocumentoLoteLoading,
      error: eliminaDocumentoLoteError,
    },
    executeEliminaDocumentoLote,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaDocumentoLote`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (eliminaDocumentoLoteData) {
        if (eliminaDocumentoLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminaDocumentoLoteData.error),
            "warning"
          );
        } else {
          swal(
            "Documento Eliminado",
            "Documento eliminado con éxito",
            "success"
          );
          const datosLotes = lotes;
          datosLotes[eliminaDocumentoLoteData.index].estatus = "False";
          setLotes(datosLotes);
          //executeTraerLotes();
        }
      }
    }

    checkData();
  }, [eliminaDocumentoLoteData, lotes, setLotes /* , executeTraerLotes */]);

  if (eliminaDocumentoLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (eliminaDocumentoLoteError) {
    return <ErrorQueryDB />;
  }

  const getDocumentosLote = () => {
    return lotes.map((lote, index) => {
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="left">{lote.fecha}</TableCell>
          <TableCell align="right">{lote.nombreconcepto}</TableCell>
          {tipoDocumento === 2 ? (
            <Fragment>
              <TableCell align="right">{lote.cantidad}</TableCell>
              <TableCell align="right">{lote.total}</TableCell>
            </Fragment>
          ) : tipoDocumento === 3 ? (
            <Fragment>
              <TableCell align="right">{`${lote.folio}-${lote.serie}`}</TableCell>
              <TableCell align="right">{lote.total}</TableCell>
            </Fragment>
          ) : tipoDocumento === 4 || tipoDocumento === 5 ? (
            <Fragment>
              <TableCell align="right">{lote.cantidad}</TableCell>
              <TableCell align="right">{lote.unidad}</TableCell>
            </Fragment>
          ) : null}

          <TableCell align="right">
            {lote.estatus === "True" ? "Registro Duplicado." : ""}
          </TableCell>
          <TableCell align="right">
            <Tooltip title="Eliminar De La Lista">
              <IconButton
                onClick={() => {
                  let newLotes = [];
                  for (let x = 0; x < lotes.length; x++) {
                    if (x !== index) {
                      newLotes.push(lotes[x]);
                    }
                  }
                  setLotes(newLotes);
                }}
              >
                <RemoveIcon color="secondary" />
              </IconButton>
            </Tooltip>
            {lote.estatus === "True" ? (
              <Tooltip title="Eliminar De La Base De Datos">
                <IconButton
                  onClick={() => {
                    swal({
                      text: "¿Está seguro de eliminar el documento?",
                      buttons: ["No", "Sí"],
                      dangerMode: true,
                    }).then((value) => {
                      if (value) {
                        executeEliminaDocumentoLote({
                          data: {
                            usuario: usuario,
                            pwd: pwd,
                            rfc: rfc,
                            idsubmenu: idSubmenu,
                            iddocumento: lote.iddocto,
                            index: index,
                          },
                        });
                      }
                    });
                  }}
                >
                  <DeleteIcon color="secondary" />
                </IconButton>
              </Tooltip>
            ) : null}
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Tipo de Documento: {tituloDocumento}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CONCEPTO</strong>
              </TableCell>
              {tipoDocumento === 2 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>LITROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoDocumento === 3 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>FOLIO-SERIE</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoDocumento === 4 || tipoDocumento === 5 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>CANTIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                </Fragment>
              ) : null}
              <TableCell align="right">
                <strong>DETALLE</strong>
              </TableCell>
              <TableCell align="right">
                <SettingsIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function NivelDocumentos(props) {
  const classes = useStyles();
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  //const subtitulo = props.subtitulo;
  const setShowComponent = props.setShowComponent;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setFolioSerie = props.setFolioSerie;
  const setIdNivelDocumento = props.setIdNivelDocumento;
  const setLoading = props.setLoading;
  const executeTraerLotes = props.executeTraerLotes;
  const tipoLote = props.tipoLote;
  const statusEmpresa = props.statusEmpresa;
  const permisosSubmenu = props.permisosSubmenu;
  const [
    {
      data: traerDocumentosLoteData,
      loading: traerDocumentosLoteLoading,
      error: traerDocumentosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerDocumentosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        idlote: idLote,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: eliminaDocumentoLoteData,
      loading: eliminaDocumentoLoteLoading,
      error: eliminaDocumentoLoteError,
    },
    executeEliminaDocumentoLote,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaDocumentoLote`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerDocumentosLoteData) {
        if (traerDocumentosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerDocumentosLoteData.error),
            "warning"
          );
        }
      }
    }

    checkData();
  }, [traerDocumentosLoteData]);

  useEffect(() => {
    function checkData() {
      if (eliminaDocumentoLoteData) {
        if (eliminaDocumentoLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminaDocumentoLoteData.error),
            "warning"
          );
        } else {
          swal(
            "Documento Eliminado",
            "Documento eliminado con éxito",
            "success"
          );
          executeTraerLotes();
        }
      }
    }

    checkData();
  }, [eliminaDocumentoLoteData, executeTraerLotes]);

  if (traerDocumentosLoteLoading || eliminaDocumentoLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerDocumentosLoteError || eliminaDocumentoLoteError) {
    return <ErrorQueryDB />;
  }

  const getDocumentosLote = () => {
    return traerDocumentosLoteData.doctos.map((documento, index) => {
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="left">{documento.fecha}</TableCell>
          <TableCell align="right">{documento.concepto}</TableCell>
          {tipoLote === 2 ? (
            <Fragment>
              <TableCell align="right">{documento.campoextra1}</TableCell>
              <TableCell align="right">{documento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 3 ? (
            <Fragment>
              <TableCell align="right">{`${documento.folio}-${documento.serie}`}</TableCell>
              <TableCell align="right">{documento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 4 ? (
            <Fragment>
              <TableCell align="right">{documento.campoextra1}</TableCell>
              <TableCell align="right">{documento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 5 ? (
            <Fragment>
              <TableCell align="right">{documento.campoextra1}</TableCell>
              <TableCell align="right">{documento.campoextra2}</TableCell>
            </Fragment>
          ) : null}
          <TableCell align="right">
            {documento.estatus === 0 ? "No Procesado" : "Procesado"}
          </TableCell>
          <TableCell align="right">
            <Tooltip title="Ver Movimientos">
              <IconButton
                onClick={() => {
                  setShowComponent(3);
                  setFolioSerie(`${documento.folio}-${documento.serie}`);
                  setIdNivelDocumento(documento.id);
                }}
              >
                <PlayArrowIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar De La Base De Datos">
              <span>
                <IconButton
                  disabled={permisosSubmenu < 3 || statusEmpresa !== 1}
                  onClick={() => {
                    swal({
                      text: "¿Está seguro de eliminar el documento?",
                      buttons: ["No", "Sí"],
                      dangerMode: true,
                    }).then((value) => {
                      if (value) {
                        executeEliminaDocumentoLote({
                          data: {
                            usuario: usuario,
                            pwd: pwd,
                            rfc: rfc,
                            idsubmenu: idSubmenu,
                            iddocumento: documento.id,
                            index: 0,
                          },
                        });
                      }
                    });
                  }}
                >
                  <DeleteIcon color={permisosSubmenu < 3 || statusEmpresa !== 1 ? "disabled" : "secondary"} />
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Tipo de Documento:{" "}
          {tipoLote === 2
            ? "Consumo Diesel"
            : tipoLote === 3
            ? "Remisión"
            : tipoLote === 4
            ? "Entrada De Materia Prima"
            : tipoLote === 5
            ? "Salida De Materia Prima"
            : ""}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CONCEPTO</strong>
              </TableCell>
              {tipoLote === 2 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>LITROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 3 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>FOLIO-SERIE</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 4 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>CANTIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>PRECIO</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 5 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>CANTIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>ALMACÉN</strong>
                  </TableCell>
                </Fragment>
              ) : null}
              <TableCell align="right">
                <strong>DETALLE</strong>
              </TableCell>
              <TableCell align="right">
                <SettingsIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function VerMovimientosDocumentos(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  //const subtitulo = props.subtitulo;
  //const folioSerie = props.folioSerie;
  const idEmpresa = props.idEmpresa;
  const idNivelDocumento = props.idNivelDocumento;
  const setLoading = props.setLoading;
  const tipoLote = props.tipoLote;

  const [
    {
      data: traerMovimientosDocumentosLoteData,
      loading: traerMovimientosDocumentosLoteLoading,
      error: traerMovimientosDocumentosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerMovimientosDocumentosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        id: idNivelDocumento,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerMovimientosDocumentosLoteData) {
        if (traerMovimientosDocumentosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerMovimientosDocumentosLoteData.error),
            "warning"
          );
        }
      }
    }

    checkData();
  }, [traerMovimientosDocumentosLoteData]);

  if (traerMovimientosDocumentosLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerMovimientosDocumentosLoteError) {
    return <ErrorQueryDB />;
  }

  const getMovimientosDocumentosLote = () => {
    return traerMovimientosDocumentosLoteData.movtos.map(
      (movimiento, index) => {
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox"></TableCell>
            <TableCell align="left">{movimiento.fechamov}</TableCell>
            <TableCell align="right">{movimiento.producto}</TableCell>
            <TableCell align="right">{movimiento.cantidad}</TableCell>
            {tipoLote === 2 ? (
              <Fragment>
                <TableCell align="right">{movimiento.kilometros}</TableCell>
                <TableCell align="right">{movimiento.horometro}</TableCell>
                <TableCell align="right">{movimiento.unidad}</TableCell>
                <TableCell align="right">{movimiento.total}</TableCell>
              </Fragment>
            ) : tipoLote === 3 ? (
              <Fragment>
                <TableCell align="right">{movimiento.subtotal}</TableCell>
                <TableCell align="right">{movimiento.descuento}</TableCell>
                <TableCell align="right">{movimiento.iva}</TableCell>
                <TableCell align="right">{movimiento.total}</TableCell>
              </Fragment>
            ) : tipoLote === 4 ? (
              <Fragment>
                <TableCell align="right">{movimiento.almacen}</TableCell>
                <TableCell align="right">{movimiento.unidad}</TableCell>
                <TableCell align="right">{movimiento.total}</TableCell>
              </Fragment>
            ) : tipoLote === 5 ? (
              <Fragment>
                <TableCell align="right">{movimiento.almacen}</TableCell>
                <TableCell align="right">{movimiento.unidad}</TableCell>
              </Fragment>
            ) : null}
          </TableRow>
        );
      }
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(2);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Tipo de Documento:{" "}
          {tipoLote === 2
            ? "Consumo Diesel"
            : tipoLote === 3
            ? "Remisión"
            : tipoLote === 4
            ? "Entrada De Materia Prima"
            : tipoLote === 5
            ? "Salida De Materia Prima"
            : ""}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>PRODUCTO</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CANTIDAD</strong>
              </TableCell>
              {tipoLote === 2 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>KILÓMETROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>HORÓMETROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 3 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>SUBTOTAL</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>DESC.</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>IVA</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 4 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>ALMACÉN</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>PRECIO</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 5 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>ALMACÉN</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                </Fragment>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>{getMovimientosDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function VerNivelMovimientos(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  //const subtitulo = props.subtitulo;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setLoading = props.setLoading;
  const tipoLote = props.tipoLote;

  const [
    {
      data: traerMovimientosLoteData,
      loading: traerMovimientosLoteLoading,
      error: traerMovimientosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerMovimientosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        id: idLote,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerMovimientosLoteData) {
        if (traerMovimientosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerMovimientosLoteData.error),
            "warning"
          );
        }
      }
    }

    checkData();
  }, [traerMovimientosLoteData]);

  if (traerMovimientosLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerMovimientosLoteError) {
    return <ErrorQueryDB />;
  }

  const getMovimientosDocumentosLote = () => {
    return traerMovimientosLoteData.movtos.map((movimiento, index) => {
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="left">{movimiento.fechamov}</TableCell>
          <TableCell align="right">{movimiento.producto}</TableCell>
          <TableCell align="right">{movimiento.cantidad}</TableCell>
          {tipoLote === 2 ? (
            <Fragment>
              <TableCell align="right">{movimiento.kilometros}</TableCell>
              <TableCell align="right">{movimiento.horometro}</TableCell>
              <TableCell align="right">{movimiento.unidad}</TableCell>
              <TableCell align="right">{movimiento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 3 ? (
            <Fragment>
              <TableCell align="right">{movimiento.subtotal}</TableCell>
              <TableCell align="right">{movimiento.descuento}</TableCell>
              <TableCell align="right">{movimiento.iva}</TableCell>
              <TableCell align="right">{movimiento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 4 ? (
            <Fragment>
              <TableCell align="right">{movimiento.almacen}</TableCell>
              <TableCell align="right">{movimiento.unidad}</TableCell>
              <TableCell align="right">{movimiento.total}</TableCell>
            </Fragment>
          ) : tipoLote === 5 ? (
            <Fragment>
              <TableCell align="right">{movimiento.almacen}</TableCell>
              <TableCell align="right">{movimiento.unidad}</TableCell>
            </Fragment>
          ) : null}
        </TableRow>
      );
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Tipo de Documento:{" "}
          {tipoLote === 2
            ? "Consumo Diesel"
            : tipoLote === 3
            ? "Remisión"
            : tipoLote === 4
            ? "Entrada De Materia Prima"
            : tipoLote === 5
            ? "Salida De Materia Prima"
            : ""}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>PRODUCTO</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CANTIDAD</strong>
              </TableCell>
              {tipoLote === 2 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>KILÓMETROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>HORÓMETROS</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 3 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>SUBTOTAL</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>DESC.</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>IVA</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 4 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>ALMACÉN</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>PRECIO</strong>
                  </TableCell>
                </Fragment>
              ) : tipoLote === 5 ? (
                <Fragment>
                  <TableCell align="right">
                    <strong>ALMACÉN</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>UNIDAD</strong>
                  </TableCell>
                </Fragment>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>{getMovimientosDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
