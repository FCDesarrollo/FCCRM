import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  useMediaQuery,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  AddCircle as AddCircleIcon,
  ClearAll as ClearAllIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  SentimentVerySatisfied as SentimentVerySatisfiedIcon,
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  SettingsEthernet as SettingsEthernetIcon,
} from "@material-ui/icons";
import swal from "sweetalert";
import swalReact from "@sweetalert/with-react";
import moment from "moment";
import jwt from "jsonwebtoken";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  doublePasteValidation,
} from "../../helpers/inputHelpers";
import { Fragment } from "react";
import { verificarExtensionArchivo } from "../../helpers/extensionesArchivos";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
  },
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
  tableWrapper: {
    overflowX: "auto",
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
  formButtons: {
    width: "100%",
  },
}));

function createData(
  id,
  fecha,
  usuario,
  sucursal,
  detalle,
  importe,
  status,
  statusEscrito,
  idUsuario,
  requerimientoGasto,
  gastoRequerimiento,
  gastoSurtido,
  gasto,
  requerimiento,
  estatusProcesado,
  estatusProcesadoEscrito
) {
  return {
    id,
    fecha,
    usuario,
    sucursal,
    detalle,
    importe,
    status,
    statusEscrito,
    idUsuario,
    requerimientoGasto,
    gastoRequerimiento,
    gastoSurtido,
    gasto,
    requerimiento,
    estatusProcesado,
    estatusProcesadoEscrito,
  };
}

//let rows = [];
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
    disablePadding: true,
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
    id: "sucursal",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sucursal",
  },
  {
    id: "detalle",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Detalle",
  },
  {
    id: "importe",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Importe",
  },
  {
    id: "asociado",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Asociado",
  },
  {
    id: "status",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Status",
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

export default function AutorizacionesGastos(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const setLoading = props.setLoading;
  const usuarioDatos = props.usuarioDatos;
  const empresaDatos = props.empresaDatos;
  console.log(empresaDatos);
  const usuario = usuarioDatos.correo;
  const usuarioPassword = usuarioDatos.password;
  const rfcEmpresa = empresaDatos.RFC;
  const sucursales = empresaDatos.sucursales;
  const statusEmpresa = empresaDatos.statusempresa;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [showComponent, setShowComponent] = useState(0);
  const [tittleTableComponent, setTittleTableComponent] = useState("");
  const [idModulo, setIdModulo] = useState(0);
  const [idMenu, setIdMenu] = useState(0);
  const [idSubmenu, setIdSubmenu] = useState(0);
  const [accionAG, setAccionAG] = useState(0);
  const [idRequerimiento, setIdRequerimiento] = useState(0);
  const [radioTipo, setRadioTipo] = useState("requerimientos");
  const [estatusRequerimiento, setEstatusRequerimiento] = useState(1);
  const [
    {
      data: listaRequerimientosData,
      loading: listaRequerimientosLoading,
      error: listaRequerimientosError,
    },
    executeListaRequerimientos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaRequerimientos`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        estatus: estatusRequerimiento,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    for (let x = 0; x < submenuContent.length; x++) {
      if (submenuContent[x].submenu.idsubmenu === parseInt(idSubmenu)) {
        setPermisosSubmenu(submenuContent[x].permisos);
      }
    }
  }, [idSubmenu, submenuContent, showComponent]);

  useEffect(() => {
    if (showComponent === 0 && tittleTableComponent === "") {
      if (localStorage.getItem("menuTemporal")) {
        try {
          const decodedToken = jwt.verify(
            localStorage.getItem("menuTemporal"),
            "mysecretpassword"
          );
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setTittleTableComponent(decodedToken.menuTemporal.tableTittle);
          setIdModulo(decodedToken.menuTemporal.idModulo);
          setIdMenu(decodedToken.menuTemporal.idMenu);
          setIdSubmenu(decodedToken.menuTemporal.idSubmenu);
          setAccionAG(decodedToken.menuTemporal.accionAG);
          setIdRequerimiento(decodedToken.menuTemporal.idRequerimiento);
          setEstatusRequerimiento(
            decodedToken.menuTemporal.estatusRequerimiento
              ? decodedToken.menuTemporal.estatusRequerimiento
              : 1
          );
          setRadioTipo(
            decodedToken.menuTemporal.estatusRequerimiento
              ? decodedToken.menuTemporal.estatusRequerimiento === 1
                ? "requerimientos"
                : "gastos"
              : "requerimientos"
          );
          setPage(
            decodedToken.menuTemporal.page ? decodedToken.menuTemporal.page : 0
          );
          setBusquedaFiltro(
            decodedToken.menuTemporal.busquedaFiltro
              ? decodedToken.menuTemporal.busquedaFiltro
              : ""
          );
        } catch (err) {
          localStorage.removeItem("menuTemporal");
        }
      } else if (localStorage.getItem("notificacionData")) {
        try {
          const decodedToken = jwt.verify(
            localStorage.getItem("notificacionData"),
            "mysecretpassword"
          );
          setShowComponent(decodedToken.notificacionData.showComponent);
          setTittleTableComponent(decodedToken.notificacionData.tableTittle);
          setIdModulo(decodedToken.notificacionData.idModulo);
          setIdMenu(decodedToken.notificacionData.idMenu);
          setIdSubmenu(decodedToken.notificacionData.idSubmenu);
          setAccionAG(decodedToken.notificacionData.accionAG);
          setIdRequerimiento(decodedToken.notificacionData.idRequerimiento);
          setEstatusRequerimiento(
            decodedToken.notificacionData.estatusRequerimiento
              ? decodedToken.notificacionData.estatusRequerimiento
              : 1
          );
          setRadioTipo(
            decodedToken.notificacionData.estatusRequerimiento
              ? decodedToken.notificacionData.estatusRequerimiento === 1
                ? "requerimientos"
                : "gastos"
              : "requerimientos"
          );
        } catch (err) {
          localStorage.removeItem("notificacionData");
        }
      }
    }
  }, [showComponent, tittleTableComponent]);

  useEffect(() => {
    if (radioTipo === "gastos" && idSubmenu === 44) {
      setEstatusRequerimiento(2);
    } else if (radioTipo === "requerimientos" && idSubmenu === 44) {
      setEstatusRequerimiento(1);
    }
  }, [radioTipo, idSubmenu]);

  useEffect(() => {
    function checkData() {
      if (listaRequerimientosData) {
        if (listaRequerimientosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(listaRequerimientosData.error)}
            </Typography>
          );
        } else {
          //rows = [];
          filterRows = [];
          listaRequerimientosData.requerimientos.map((requerimiento) => {
            return filterRows.push(
              createData(
                requerimiento.idReq,
                requerimiento.fecha_req,
                `${requerimiento.nombre} ${requerimiento.apellidop} ${requerimiento.apellidom}`,
                requerimiento.sucursal,
                `Concepto: ${requerimiento.id_concepto} Folio: ${requerimiento.folio} Serie: ${requerimiento.serie}`,
                requerimiento.importe_estimado,
                requerimiento.estado_documento,
                requerimiento.estado_documento !== 2
                  ? requerimiento.estado_documento === 1
                    ? "Pendiente"
                    : requerimiento.estado_documento === 2
                    ? "Cancelado"
                    : requerimiento.estado_documento === 3
                    ? "Autorizado"
                    : requerimiento.estado_documento === 4
                    ? "Surtido"
                    : requerimiento.estado_documento === 5
                    ? "Surtido Parcial"
                    : requerimiento.estado_documento === 6
                    ? "Sin Surtir"
                    : requerimiento.estado_documento === 7
                    ? "No autorizado"
                    : ""
                  : requerimiento.estado_documento === 1
                  ? "Pendiente"
                  : requerimiento.estado_documento === 3
                  ? "Autorizado"
                  : "No autorizado",
                requerimiento.id_usuario,
                requerimiento.requerimiento_gasto,
                requerimiento.gasto_requerimiento,
                requerimiento.gasto_surtido,
                requerimiento.gasto,
                requerimiento.requerimiento,
                requerimiento.estatus_procesado,
                requerimiento.estatus_procesado === 1 ? "Sí" : "No"
              )
            );
          });
          //filterRows = rows;
          setRows(filterRows);
        }
      }
    }

    checkData();
  }, [listaRequerimientosData]);

  if (listaRequerimientosLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (listaRequerimientosError) {
    return <ErrorQueryDB />;
  }

  const getSubmenuPorOrden = (orden) => {
    return submenuContent.map((content, index) => {
      return content.submenu.orden === orden ? (
        <Tooltip
          title={content.submenu.nombre_submenu}
          key={index}
          style={{ float: "right" }}
        >
          <span>
            <Link
              to="/configuracionesPermisos"
              style={{ cursor: content.permisos === 0 ? "default" : "" }}
              onClick={(e) => {
                if (content.permisos === 0) {
                  e.preventDefault();
                }
              }}
            >
              <IconButton
                disabled={content.permisos === 0}
                onClick={() => {
                  const token = jwt.sign(
                    {
                      idMenuTemporal: {
                        idMenu: submenuContent[0].submenu.idmenu,
                        permisos: submenuContent[0].permisos,
                      },
                    },
                    "mysecretpassword"
                  );
                  localStorage.setItem("idMenuTemporal", token);
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Link>
          </span>
        </Tooltip>
      ) : null;
    });
  };

  return (
    <div className={classes.root}>
      <Card
        className={classes.card}
        style={{ display: showComponent > 1 ? "none" : "block" }}
      >
        <Grid
          container
          justify="center"
          spacing={3}
          style={{ padding: "15px" }}
        >
          <Grid item xs={12} md={10}>
            <Typography variant="h6" className={classes.title}>
              Autorizaciones y Gastos {getSubmenuPorOrden(-1)}
            </Typography>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden > 0 ? (
              <Grid item xs={12} md={5} key={index}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    //if (showComponent === 2) {
                    executeListaRequerimientos({
                      data: {
                        usuario: usuario,
                        pwd: usuarioPassword,
                        rfc: rfcEmpresa,
                        idsubmenu: content.submenu.idsubmenu,
                        idRequerimiento: idRequerimiento,
                      },
                    });
                    //}
                    setIdRequerimiento(0);
                    setShowComponent(1);
                    setTittleTableComponent(content.submenu.nombre_submenu);
                    setIdModulo(content.idModulo);
                    setIdMenu(content.submenu.idmenu);
                    setIdSubmenu(content.submenu.idsubmenu);
                    setEstatusRequerimiento(content.submenu.idsubmenu !== 44 ? 1 : 2);
                    setRadioTipo(
                      content.submenu.idsubmenu !== 44
                        ? "requerimientos"
                        : "gastos"
                    );
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          tableTittle: content.submenu.nombre_submenu,
                          showComponent: 1,
                          idModulo: content.idModulo,
                          idMenu: content.submenu.idmenu,
                          idSubmenu: content.submenu.idsubmenu,
                          estatusRequerimiento: 1,
                          page: 0,
                          busquedaFiltro: "",
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token);
                    localStorage.removeItem("notificacionData");
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
        {showComponent === 1 ? (
          <TablaAYG
            rows={rows}
            setRows={setRows}
            page={page}
            setPage={setPage}
            busquedaFiltro={busquedaFiltro}
            setBusquedaFiltro={setBusquedaFiltro}
            tittle={tittleTableComponent}
            setShowComponent={setShowComponent}
            setLoading={setLoading}
            usuarioDatos={usuarioDatos}
            empresaDatos={empresaDatos}
            idModulo={idModulo}
            idMenu={idMenu}
            setIdSubmenu={setIdSubmenu}
            idSubmenu={idSubmenu}
            setAccionAG={setAccionAG}
            setIdRequerimiento={setIdRequerimiento}
            executeListaRequerimientos={executeListaRequerimientos}
            permisosSubmenu={permisosSubmenu}
            radioTipo={radioTipo}
            setRadioTipo={setRadioTipo}
            estatusRequerimiento={estatusRequerimiento}
            statusEmpresa={statusEmpresa}
          />
        ) : showComponent === 2 ? (
          <FormularioAYG
            tittle={tittleTableComponent}
            page={page}
            busquedaFiltro={busquedaFiltro}
            setShowComponent={setShowComponent}
            sucursales={sucursales}
            setLoading={setLoading}
            usuarioDatos={usuarioDatos}
            empresaDatos={empresaDatos}
            idModulo={idModulo}
            idMenu={idMenu}
            idSubmenu={idSubmenu}
            accionAG={accionAG}
            setAccionAG={setAccionAG}
            executeListaRequerimientos={executeListaRequerimientos}
            idRequerimiento={idRequerimiento}
            setIdRequerimiento={setIdRequerimiento}
            estatusRequerimiento={estatusRequerimiento}
            permisosSubmenu={permisosSubmenu}
            radioTipo={radioTipo}
            statusEmpresa={statusEmpresa}
          />
        ) : null}
      </Card>
    </div>
  );
}

function TablaAYG(props) {
  const classes = useStyles();
  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const rows = props.rows;
  const setRows = props.setRows;
  const page = props.page;
  const setPage = props.setPage;
  const busquedaFiltro = props.busquedaFiltro;
  const setBusquedaFiltro = props.setBusquedaFiltro;
  const tableTittle = props.tittle;
  const setShowComponent = props.setShowComponent;
  const setLoading = props.setLoading;
  const usuarioDatos = props.usuarioDatos;
  const idUsuarioLogueado = usuarioDatos.idusuario;
  const usuario = usuarioDatos.correo;
  const usuarioPassword = usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const rfcEmpresa = empresaDatos.RFC;
  const usuarioStorage = empresaDatos.usuario_storage;
  const passwordStorage = empresaDatos.password_storage;
  const statusEmpresa = props.statusEmpresa;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  //const setIdSubmenu = props.setIdSubmenu;
  const setAccionAG = props.setAccionAG;
  const setIdRequerimiento = props.setIdRequerimiento;
  const executeListaRequerimientos = props.executeListaRequerimientos;
  const permisosSubmenu = props.permisosSubmenu;
  const radioTipo = props.radioTipo;
  const setRadioTipo = props.setRadioTipo;
  //const estatusRequerimiento = props.estatusRequerimiento;
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("fecha");
  //const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  //const [validarFiltro, setValidarFiltro] = useState(0);
  //const [filterRows, setFilterRows] = useState([]);
  //const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [
    {
      data: eliminaRequerimientoData,
      loading: eliminaRequerimientoLoading,
      error: eliminaRequerimientoError,
    },
    executeEliminaRequerimiento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaRequerimiento`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {}, []);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          filterRows[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRows[x].fecha)
            .format("DD/MM/YYYY")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].usuario
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].sucursal
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].detalle
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].importe.toString().indexOf(busquedaFiltro) !== -1 ||
          filterRows[x].estatusProcesadoEscrito
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].statusEscrito
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRows[x]);
        }
      }
      return dataFilter;
    }
    //aqui
    const decodedToken = jwt.verify(
      localStorage.getItem("menuTemporal"),
      "mysecretpassword"
    );
    setRows(busquedaFiltro.trim() !== "" ? getFilterRows() : filterRows);
    setPage(
      rows.length < rowsPerPage
        ? 0
        : decodedToken.menuTemporal.page
        ? decodedToken.menuTemporal.page
        : 0
    );
    const token = jwt.sign(
      {
        menuTemporal: {
          tableTittle: tableTittle,
          showComponent: 1,
          idModulo: idModulo,
          idMenu: idMenu,
          idSubmenu: idSubmenu,
          accionAG: 0,
          idRequerimiento: 0,
          estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
          page:
            rows.length < rowsPerPage && rows.length !== 0
              ? 0
              : decodedToken.menuTemporal.page
              ? decodedToken.menuTemporal.page
              : 0,
          busquedaFiltro: busquedaFiltro,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  }, [
    busquedaFiltro,
    setRows,
    rows.length,
    rowsPerPage,
    page,
    setPage,
    idMenu,
    idModulo,
    idSubmenu,
    radioTipo,
    tableTittle,
  ]);

  useEffect(() => {
    function checkData() {
      if (eliminaRequerimientoData) {
        if (eliminaRequerimientoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(eliminaRequerimientoData.error)}
            </Typography>
          );
        } else {
          swal(
            radioTipo !== "gastos"
              ? "Requerimiento eliminado"
              : "Gasto Eliminado",
            radioTipo !== "gastos"
              ? "El requerimiento ha sido eliminado"
              : "El gasto ha sido eliminado",
            "success"
          );
          executeListaRequerimientos();
        }
      }
    }

    checkData();
  }, [eliminaRequerimientoData, executeListaRequerimientos, radioTipo]);

  if (eliminaRequerimientoLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (eliminaRequerimientoError) {
    return <ErrorQueryDB />;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const token = jwt.sign(
      {
        menuTemporal: {
          tableTittle: tableTittle,
          showComponent: 1,
          idModulo: idModulo,
          idMenu: idMenu,
          idSubmenu: idSubmenu,
          accionAG: 0,
          idRequerimiento: 0,
          estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
          page: newPage,
          busquedaFiltro: busquedaFiltro,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeRadioTipo = (event) => {
    setRadioTipo(event.target.value);
    /* if(idSubmenu === 44) {
      setIdSubmenu(event.target.value !== "gastos" ? 444 : 44)
    }
    console.log(event.target.value); */
    setPage(0);
    const token = jwt.sign(
      {
        menuTemporal: {
          tableTittle: tableTittle,
          showComponent: 1,
          idModulo: idModulo,
          idMenu: idMenu,
          idSubmenu: idSubmenu,
          estatusRequerimiento: event.target.value === "requerimientos" ? 1 : 2,
          page: 0,
          busquedaFiltro: busquedaFiltro,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  };

  const eliminarRequerimiento = (
    idRequerimiento,
    estatusActualRequerimiento,
    idUsuario,
    requerimientoGasto,
    gastoRequerimiento
  ) => {
    if (idUsuarioLogueado !== idUsuario) {
      swal(
        "Error",
        `No puedes eliminar los ${
          radioTipo !== "gastos" ? "requerimientos" : "gastos"
        } de otro usuario`,
        "warning"
      );
    } else if (requerimientoGasto === 1) {
      swal(
        "Error",
        "No se pueden eliminar requerimientos creados a partir de un gasto",
        "warning"
      );
    } else if (gastoRequerimiento === 1 && estatusActualRequerimiento !== 1) {
      swal(
        "Error",
        "Solo se pueden eliminar los gastos que necesitan autorización con estatus pendiente",
        "warning"
      );
    } else if (estatusActualRequerimiento !== 1 && radioTipo !== "gastos") {
      swal(
        "Error",
        "Solo se pueden eliminar requerimientos con estatus pendiente",
        "warning"
      );
    } else {
      swal({
        text: `¿Está seguro de eliminar el ${
          radioTipo !== "gastos" ? "requerimiento" : "gasto"
        }?`,
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeEliminaRequerimiento({
            data: {
              usuario: usuario,
              pwd: usuarioPassword,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idmenu: idMenu,
              usuario_storage: usuarioStorage,
              password_storage: passwordStorage,
              idrequerimiento: idRequerimiento,
              estatus: radioTipo !== "gastos" ? 1 : 2,
              gastoRequerimiento: gastoRequerimiento,
            },
          });
        }
      });
    }
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar
          style={{
            marginTop: xsScreen ? "10px" : "0px",
            marginBottom: xsScreen ? "10px" : "0px",
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={5} style={{ alignSelf: "flex-end" }}>
              <Typography
                className={classes.titleTable}
                variant="h6"
                id="tableTitle"
              >
                <Tooltip title="Cerrar">
                  <IconButton
                    aria-label="cerrar"
                    onClick={() => {
                      setShowComponent(0);
                      setAccionAG(0);
                      localStorage.removeItem("menuTemporal");
                      localStorage.removeItem("notificacionData");
                    }}
                  >
                    <CloseIcon color="secondary" />
                  </IconButton>
                </Tooltip>
                {tableTittle}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid
                container
                spacing={1}
                justify={xsScreen ? "flex-start" : "flex-end"}
              >
                <Grid item style={{ alignSelf: "flex-end" }}>
                  <Tooltip title="Nuevo">
                    <span>
                      <IconButton
                        aria-label="nuevo"
                        disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
                        onClick={() => {
                          setShowComponent(2);
                          setAccionAG(1);
                          setIdRequerimiento(0);
                          const token = jwt.sign(
                            {
                              menuTemporal: {
                                tableTittle: tableTittle,
                                showComponent: 2,
                                idModulo: idModulo,
                                idMenu: idMenu,
                                idSubmenu: idSubmenu,
                                accionAG: 1,
                                idRequerimiento: 0,
                                estatusRequerimiento:
                                  radioTipo !== "gastos" ? 1 : 2,
                                page: page,
                                busquedaFiltro: busquedaFiltro,
                              },
                            },
                            "mysecretpassword"
                          );
                          localStorage.setItem("menuTemporal", token);
                        }}
                      >
                        <AddCircleIcon
                          style={{
                            color:
                              permisosSubmenu < 2 || statusEmpresa !== 1
                                ? "disabled"
                                : "#4caf50",
                          }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item style={{ alignSelf: "flex-end" }}>
                  <Tooltip title="Limpiar Filtro">
                    <IconButton
                      aria-label="filtro"
                      onClick={() => {
                        setBusquedaFiltro("");
                      }}
                    >
                      <ClearAllIcon style={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textFields}
                    label="Escriba algo para filtrar"
                    type="text"
                    margin="normal"
                    value={busquedaFiltro}
                    inputProps={{
                      maxLength: 20,
                    }}
                    onChange={(e) => {
                      setBusquedaFiltro(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
        {idSubmenu === 44 ? (
          <Toolbar>
            <RadioGroup
              row
              aria-label="tipo"
              name="tipo"
              value={radioTipo}
              onChange={handleChangeRadioTipo}
            >
              <FormControlLabel
                value="requerimientos"
                control={<Radio color="primary" />}
                label="Requerimientos"
              />
              <FormControlLabel
                value="gastos"
                control={<Radio color="primary" />}
                label="Gastos"
              />
            </RadioGroup>
          </Toolbar>
        ) : null}
        <div className={classes.tableWrapper}>
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell padding="checkbox" />
                        <TableCell component="th" id={labelId} scope="row">
                          {row.fecha}
                        </TableCell>
                        <TableCell align="right">{row.usuario}</TableCell>
                        <TableCell align="right">{row.sucursal}</TableCell>
                        <TableCell align="right">{row.detalle}</TableCell>
                        <TableCell align="right">{row.importe}</TableCell>
                        <TableCell align="right">
                          {row.estatusProcesadoEscrito}
                        </TableCell>
                        <TableCell align="right">
                          {radioTipo !== "gastos"
                            ? row.status === 1
                              ? "Pendiente"
                              : row.status === 2
                              ? "Cancelado"
                              : row.status === 3
                              ? "Autorizado"
                              : row.status === 4
                              ? "Surtido"
                              : row.status === 5
                              ? "Surtido Parcial"
                              : row.status === 6
                              ? "Sin Surtir"
                              : row.status === 7
                              ? "No autorizado"
                              : "Pendiente"
                            : row.status === 1
                            ? "Pendiente"
                            : row.status === 3
                            ? "Autorizado"
                            : "No autorizado"}
                        </TableCell>
                        <TableCell align="right">
                          <div>
                            <Tooltip
                              title={
                                radioTipo === "requerimientos"
                                  ? "Editar requerimiento"
                                  : "Editar gasto"
                              }
                            >
                              <span>
                                <IconButton
                                  disabled={
                                    permisosSubmenu < 2 }
                                  onClick={() => {
                                    setAccionAG(2);
                                    setShowComponent(2);
                                    setIdRequerimiento(row.id);
                                    const token = jwt.sign(
                                      {
                                        menuTemporal: {
                                          tableTittle: tableTittle,
                                          showComponent: 2,
                                          idModulo: idModulo,
                                          idMenu: idMenu,
                                          idSubmenu: idSubmenu,
                                          accionAG: 2,
                                          idRequerimiento: row.id,
                                          estatusRequerimiento:
                                            radioTipo !== "gastos" ? 1 : 2,
                                          page: page,
                                          busquedaFiltro: busquedaFiltro,
                                        },
                                      },
                                      "mysecretpassword"
                                    );
                                    localStorage.setItem("menuTemporal", token);
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
                            <Tooltip title="Eliminar requerimiento">
                              <span>
                                <IconButton
                                  disabled={
                                    permisosSubmenu < 3 || statusEmpresa !== 1
                                  }
                                  onClick={() => {
                                    eliminarRequerimiento(
                                      row.id,
                                      row.status,
                                      row.idUsuario,
                                      row.requerimientoGasto,
                                      row.gastoRequerimiento
                                    );
                                  }}
                                >
                                  <DeleteIcon
                                    color={
                                      permisosSubmenu < 3 || statusEmpresa !== 1
                                        ? "disabled"
                                        : "secondary"
                                    }
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography variant="subtitle1">
                      <ErrorIcon
                        style={{ color: "red", verticalAlign: "sub" }}
                      />
                      {idSubmenu === 44 && radioTipo === "gastos"
                        ? "No hay gastos disponibles"
                        : "No hay requerimientos disponibles"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={(e) => {
            return `${e.from}-${e.to} de ${e.count}`;
          }}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={rows.length > 0 && rows.length >= rowsPerPage ? page : 0} //aqui
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
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

function FormularioAYG(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [proveedores, setProveedores] = useState([]);
  const tableTittle = props.tittle;
  const page = props.page;
  const busquedaFiltro = props.busquedaFiltro;
  const setShowComponent = props.setShowComponent;
  const usuarioDatos = props.usuarioDatos;
  const idUsuarioLogueado = usuarioDatos.idusuario;
  const empresaDatos = props.empresaDatos;
  const nombreEmpresa = empresaDatos.nombreempresa;
  const empresaId = empresaDatos.idempresa;
  const usuarioStorage = empresaDatos.usuario_storage;
  const passwordStorage = empresaDatos.password_storage;
  const statusEmpresa = props.statusEmpresa;
  const usuario = usuarioDatos.correo;
  const usuarioPassword = usuarioDatos.password;
  const usuarioNombreCompleto = `${usuarioDatos.nombre} ${usuarioDatos.apellidop} ${usuarioDatos.apellidom}`;
  const rfcEmpresa = empresaDatos.RFC;
  const sucursales = props.sucursales;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  const setLoading = props.setLoading;
  const accionAG = props.accionAG;
  const setAccionAG = props.setAccionAG;
  const setIdRequerimiento = props.setIdRequerimiento;
  const executeListaRequerimientos = props.executeListaRequerimientos;
  const idRequerimiento = props.idRequerimiento;
  const permisosSubmenu = props.permisosSubmenu;
  const radioTipo = props.radioTipo;
  const [RADatos, setRADatos] = useState({
    sucursal: "0",
    fecha: moment().format("YYYY-MM-DD"),
    importe: "",
    concepto: "0",
    serie: "",
    folio: "",
    descripcion: "",
  });
  const [rfcGasto, setRfcGasto] = useState("");
  const [nombreGasto, setNombreGasto] = useState("");
  const [rfcGastoNoRFC, setRfcGastoNoRFC] = useState("");
  const [nombreGastoNoRFC, setNombreGastoNoRFC] = useState("");
  const [importeEstatus, setImporteEstatus] = useState("");
  const [fechaEstatus, setFechaEstatus] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [rfcEstatus, setRfcEstatus] = useState("");
  const [nombreLargoEstatus, setNombreLargoEstatus] = useState("");
  const [rfcEstatusNoRFC, setRfcEstatusNoRFC] = useState("");
  const [nombreLargoEstatusNoRFC, setNombreLargoEstatusNoRFC] = useState("");
  const [descripcionAntigua, setDescripcionAntigua] = useState("");
  const [fechaAntigua, setFechaAntigua] = useState("");
  const [importeAntiguo, setImporteAntiguo] = useState("");
  const [archivosPrincipal, setArchivosPrincipal] = useState(null);
  const [archivosSecundario, setArchivosSecundario] = useState(null);
  const [documentosGuardados, setDocumentosGuardados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [requerimiento, setRequerimiento] = useState([]);
  const [gastoAutorizacion, setGastoAutorizacion] = useState(false);
  const [selectedListItem1Index, setSelectedListItem1Index] = useState(-1);
  const [selectedListItem2Index, setSelectedListItem2Index] = useState(-1);
  const [idDocumentoPrincipal, setIdDocumentoPrincipal] = useState(0);
  const [idDocumentoSecundario, setIdDocumentoSecundario] = useState(0);
  const [idUsuarioRequerimiento, setIdUsuarioRequerimiento] = useState(0);
  const [estatusRequerimiento, setEstatusRequerimiento] = useState(0);
  const [
    idUsuarioEstatusRequerimiento,
    setIdUsuarioEstatusRequerimiento,
  ] = useState(0);
  const [observacionesHistorial, setObservacionesHistorial] = useState("");
  const [estatusActualRequerimiento, setEstatusActualRequerimiento] = useState(
    0
  );
  const [
    estatusAnteriorRequerimiento,
    setEstatusAnteriorRequerimiento,
  ] = useState(0);
  const [sumaActualGasto, setSumaActualGasto] = useState(0);
  const [idHistorialSelected, setIdHistorialSelected] = useState(0);
  const [rutaDocumento, setRutaDocumento] = useState("");
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [
    openMenuReenviarNotificacion,
    setOpenMenuReenviarNotificacion,
  ] = useState(false);
  const [conceptoRequerimientoGasto, setConceptoRequerimientoGasto] = useState(
    "0"
  );
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const [
    usuariosNotificacionesSelected,
    setUsuariosNotificacionesSelected,
  ] = useState([]);
  const [limiteImporteGasto, setLimiteImporteGasto] = useState(0);
  const [gastoRequiereAutorizacion, setGastoRequiereAutorizacion] = useState(
    false
  );
  const [checkNoRFCEstatus, setCheckNoRFCEstatus] = useState(false);
  const [checkNoRFC, setCheckNoRFC] = useState(false);
  const [siguienteFolio, setSiguienteFolio] = useState("1");
  const inputSerie = useRef(null);
  const [
    {
      data: cargaConceptosData,
      loading: cargaConceptosLoading,
      error: cargaConceptosError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/cargaConceptos`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        all: 0,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: cargaEstatusData,
      loading: cargaEstatusLoading,
      error: cargaEstatusError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/cargaEstatus`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: nuevoRequerimientoData,
      loading: nuevoRequerimientoLoading,
      error: nuevoRequerimientoError,
    },
    executeNuevoRequerimiento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/nuevoRequerimiento`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: datosRequerimientoData,
      loading: datosRequerimientoLoading,
      error: datosRequerimientoError,
    },
    executeDatosRequerimiento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/datosRequerimiento`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        idrequerimiento: idRequerimiento,
      },
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: agregaEstatusData,
      loading: agregaEstatusLoading,
      error: agregaEstatusError,
    },
    executeAgregaEstatus,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregaEstatus`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: eliminaEstatusData,
      loading: eliminaEstatusLoading,
      error: eliminaEstatusError,
    },
    executeEliminaEstatus,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaEstatus`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: editarRequerimientoData,
      loading: editarRequerimientoLoading,
      error: editarRequerimientoError,
    },
    executeEditarRequerimiento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editarRequerimiento`,
      method: "POST",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: eliminaDocumentoData,
      loading: eliminaDocumentoLoading,
      error: eliminaDocumentoError,
    },
    executeEliminaDocumento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaDocumento`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: eliminaRequerimientoData,
      loading: eliminaRequerimientoLoading,
      error: eliminaRequerimientoError,
    },
    executeEliminaRequerimiento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaRequerimiento`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: usuariosNotificacionData,
      loading: usuariosNotificacionLoading,
      error: usuariosNotificacionError,
    },
    executeUsuariosNotificacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/usuariosNotificacion`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        idconcepto: RADatos.concepto,
      },
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: reenviarNotificacionData,
      loading: reenviarNotificacionLoading,
      error: reenviarNotificacionError,
    },
    executeReenviarNotificacion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/reenviarNotificacion`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    { data: creaGastoData, loading: creaGastoLoading, error: creaGastoError },
    executeCreaGasto,
  ] = useAxios(
    {
      url: API_BASE_URL + `/creaGasto`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: getTotalImporteData,
      loading: getTotalImporteLoading,
      error: getTotalImporteError,
    },
    executeGetTotalImporte,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getTotalImporte`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        idrequerimiento: idRequerimiento,
      },
    },
    {
      manual: true,
      useCache: false,
    }
  );
  const [
    {
      data: traerLimiteGastosUsuarioData,
      loading: traerLimiteGastosUsuarioLoading,
      error: traerLimiteGastosUsuarioError,
    },
    executeTraerLimiteGastosUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerLimiteGastosUsuario`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        idusuario: idUsuarioLogueado,
        idconcepto: RADatos.concepto,
      },
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: traerProveedoresData,
      loading: traerProveedoresLoading,
      error: traerProveedoresError,
    } /* ,
    executeTraerProveedores */,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerProveedores`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    } /* ,
    {
      manual: true
    } */
  );
  const [
    {
      data: traerRequerimientoPorSeriesData,
      loading: traerRequerimientoPorSerieLoading,
      error: traerRequerimientoPorSerieError,
    },
    executeTraerRequerimientoPorSerie,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerRequerimientoPorSerie`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        serie: RADatos.serie,
      },
    },
    {
      manual: true,
      useCache: false,
    }
  );

  useEffect(() => {
    if (RADatos.serie.trim() !== "" /* && RADatos.folio.trim() === "" */) {
      executeTraerRequerimientoPorSerie();
    }
  }, [RADatos.serie /* , RADatos.folio */, executeTraerRequerimientoPorSerie]);

  useEffect(() => {
    function checkData() {
      if (traerRequerimientoPorSeriesData) {
        if (traerRequerimientoPorSeriesData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerRequerimientoPorSeriesData.error)}
            </Typography>
          );
        } else {
          //console.log(traerRequerimientoPorSeriesData.requerimiento);
          setSiguienteFolio(
            traerRequerimientoPorSeriesData.requerimiento.length !== 0
              ? parseInt(
                  traerRequerimientoPorSeriesData.requerimiento[0].folio
                ) + 1
              : 1
          );
          if (accionAG === 1) {
            inputSerie.current.focus();
          }
          /* setRADatos(R => ({
            ...R,
            folio: traerRequerimientoPorSeriesData.requerimiento.length !== 0
            ? parseInt(
                traerRequerimientoPorSeriesData.requerimiento[0].folio
              ) + 1
            : 1
          })); */
          /* setFolioSiguiente(traerRequerimientoPorSeriesData.requerimiento.length !== 0
            ? parseInt(
                traerRequerimientoPorSeriesData.requerimiento[0].folio
              ) + 1
            : 1) */
        }
      }
    }
    checkData();
  }, [traerRequerimientoPorSeriesData, accionAG]);

  useEffect(() => {
    if (
      gastos.length > 0 &&
      gastos[0].id_bit === 0 &&
      gastos[0].idrequerimiento !== gastos[0].idgasto
    ) {
      setGastoAutorizacion(true);
    }
  }, [gastos]);

  /* useEffect(() => {
    if (radioTipo === "gastos" && accionAG === 1) {
      executeTraerProveedores();
    }
  }, [executeTraerProveedores, radioTipo, accionAG]); */

  useEffect(() => {
    if (accionAG === 2) {
      executeDatosRequerimiento();
      executeUsuariosNotificacion();
    }
  }, [
    accionAG,
    radioTipo,
    executeDatosRequerimiento,
    executeUsuariosNotificacion,
  ]);

  useEffect(() => {
    if (radioTipo === "gastos" && RADatos.concepto !== "0") {
      executeTraerLimiteGastosUsuario();
    }
  }, [radioTipo, executeTraerLimiteGastosUsuario, RADatos.concepto]);

  useEffect(() => {
    function checkData() {
      if (datosRequerimientoData) {
        if (datosRequerimientoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(datosRequerimientoData.error)}
            </Typography>
          );
        } else {
          if (datosRequerimientoData.requerimiento) {
            setRADatos({
              sucursal: datosRequerimientoData.requerimiento[0].id_sucursal,
              fecha: datosRequerimientoData.requerimiento[0].fecha_req,
              importe: datosRequerimientoData.requerimiento[0].importe_estimado,
              concepto: datosRequerimientoData.requerimiento[0].id_concepto,
              serie: datosRequerimientoData.requerimiento[0].serie,
              folio: datosRequerimientoData.requerimiento[0].folio,
              descripcion:
                datosRequerimientoData.requerimiento[0].descripcion !== null
                  ? datosRequerimientoData.requerimiento[0].descripcion
                  : "",
            });
            setDescripcionAntigua(
              datosRequerimientoData.requerimiento[0].descripcion !== null
                ? datosRequerimientoData.requerimiento[0].descripcion
                : ""
            );
            setDocumentosGuardados(
              datosRequerimientoData.requerimiento[0].documentos
            );
            setHistorial(datosRequerimientoData.requerimiento[0].historial);
            const historialLength =
              datosRequerimientoData.requerimiento[0].historial.length - 1;
            setEstatusActualRequerimiento(
              historialLength !== -1
                ? datosRequerimientoData.requerimiento[0].historial[
                    historialLength
                  ].status
                : 0
            );
            setGastos(datosRequerimientoData.requerimiento[0].gastos);
            setRequerimiento(
              datosRequerimientoData.requerimiento[0].requerimiento
            );
            setIdUsuarioRequerimiento(
              datosRequerimientoData.requerimiento[0].id_usuario
            );
            if (radioTipo === "gastos") {
              setRfcGastoNoRFC(
                datosRequerimientoData.requerimiento[0].rfcproveedor
              );
              setNombreGastoNoRFC(
                datosRequerimientoData.requerimiento[0].nombreproveedor !== null
                  ? datosRequerimientoData.requerimiento[0].nombreproveedor
                  : ""
              );
              setFechaAntigua(
                datosRequerimientoData.requerimiento[0].fecha_req
              );
              setImporteAntiguo(
                datosRequerimientoData.requerimiento[0].importe_estimado
              );
            }
          } else {
            setShowComponent(1);
            setAccionAG(0);
            setIdRequerimiento(0);
            const token = jwt.sign(
              {
                menuTemporal: {
                  tableTittle: tableTittle,
                  showComponent: 1,
                  idModulo: idModulo,
                  idMenu: idMenu,
                  idSubmenu: idSubmenu,
                  accionAG: 0,
                  idRequerimiento: 0,
                  estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                  page: page,
                  busquedaFiltro: busquedaFiltro,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            localStorage.removeItem("notificacionData");
          }
        }
      }
    }

    checkData();
  }, [
    datosRequerimientoData,
    idMenu,
    idModulo,
    idSubmenu,
    setAccionAG,
    setIdRequerimiento,
    setShowComponent,
    tableTittle,
    radioTipo,
    page,
    busquedaFiltro,
  ]);

  useEffect(() => {
    function checkData() {
      if (traerProveedoresData) {
        if (traerProveedoresData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerProveedoresData.error)}
            </Typography>
          );
        } else {
          setProveedores(traerProveedoresData.proveedores);
        }
      }
    }
    checkData();
  }, [traerProveedoresData, proveedores]);

  useEffect(() => {
    function checkData() {
      if (cargaConceptosData) {
        if (cargaConceptosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(cargaConceptosData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [cargaConceptosData]);

  useEffect(() => {
    function checkData() {
      if (cargaEstatusData) {
        if (cargaEstatusData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(cargaEstatusData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [cargaEstatusData]);

  useEffect(() => {
    async function checkData() {
      if (nuevoRequerimientoData) {
        if (nuevoRequerimientoData.error !== 0) {
          swal(
            "Aviso",
            `${dataBaseErrores(nuevoRequerimientoData.error)}`,
            "warning"
          ).then(async () => {
            if (nuevoRequerimientoData.error === 10) {
              if (nuevoRequerimientoData.archivos) {
                swalReact({
                  title: "Status de archivo(s)",
                  buttons: {
                    cancel: "Cerrar",
                  },
                  icon: "info",
                  content: (
                    <List style={{ maxHeight: "40vh", overflowY: "auto" }}>
                      {nuevoRequerimientoData.archivos.map((archivo, index) => {
                        return (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {archivo.status === 0 ? (
                                <SentimentVerySatisfiedIcon
                                  style={{ color: "green" }}
                                />
                              ) : (
                                <SentimentVeryDissatisfiedIcon
                                  style={{ color: "red" }}
                                />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={archivo.archivo}
                              secondary={
                                archivo.status === 0
                                  ? "Archivo subido con éxito"
                                  : archivo.status === 1
                                  ? "Error al subir el archivo"
                                  : archivo.status === 2
                                  ? "No se pudo generar el link del archivo"
                                  : archivo.status === 3
                                  ? "El archivo está en blanco"
                                  : "Ya existe el archivo"
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  ),
                });
              }
              if (gastoRequiereAutorizacion) {
                /* const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${nuevoRequerimientoData.idrequerimiento}&tipo=${radioTipo}`;
                const encabezadoMensaje = "Nuevo gasto agregado";
                const mensaje = `${usuarioNombreCompleto} ha agregado un nuevo gasto en ${nombreEmpresa}: \n ${linkMensaje}`; */
                await executeCreaGasto({
                  data: {
                    usuario: usuario,
                    pwd: usuarioPassword,
                    rfc: rfcEmpresa,
                    idmenu: idMenu,
                    idsubmenu: idSubmenu,
                    idrequerimiento: nuevoRequerimientoData.idrequerimiento,
                    importe: parseFloat(RADatos.importe),
                    idconcepto: RADatos.concepto,
                    estatusgasto: 1,
                    fecha: moment().format("YYYY-MM-DD"),
                    fechagasto: RADatos.fecha,
                    rfcproveedor: rfcGasto,
                    nombreproveedor: nombreGasto.trim(),
                    idbitacora: 0,
                    /* encabezado: encabezadoMensaje,
                    mensaje: mensaje */
                  },
                });
              }
              executeListaRequerimientos();
              setShowComponent(1);
              setAccionAG(0);
              setIdRequerimiento(0);
              const token = jwt.sign(
                {
                  menuTemporal: {
                    tableTittle: tableTittle,
                    showComponent: 1,
                    idModulo: idModulo,
                    idMenu: idMenu,
                    idSubmenu: idSubmenu,
                    accionAG: 0,
                    idRequerimiento: 0,
                    estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                    page: page,
                    busquedaFiltro: busquedaFiltro,
                  },
                },
                "mysecretpassword"
              );
              localStorage.setItem("menuTemporal", token);
            }
          });
        } else {
          swal(
            radioTipo !== "gastos"
              ? "Requerimiento agregado"
              : "Gasto agregado",
            radioTipo !== "gastos"
              ? "El requerimiento se agregó correctamente"
              : "El gasto se agregó correctamentre",
            "success"
          ).then(() => {
            swalReact({
              title: "Status de archivo(s)",
              buttons: {
                cancel: "Cerrar",
              },
              icon: "info",
              content: (
                <List style={{ maxHeight: "40vh", overflowY: "auto" }}>
                  {nuevoRequerimientoData.archivos.map((archivo, index) => {
                    return (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {archivo.status === 0 ? (
                            <SentimentVerySatisfiedIcon
                              style={{ color: "green" }}
                            />
                          ) : (
                            <SentimentVeryDissatisfiedIcon
                              style={{ color: "red" }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={archivo.archivo}
                          secondary={
                            archivo.status === 0
                              ? "Archivo subido con éxito"
                              : archivo.status === 1
                              ? "Error al subir el archivo"
                              : archivo.status === 2
                              ? "No se pudo generar el link del archivo"
                              : archivo.status === 3
                              ? "El archivo está en blanco"
                              : "Ya existe el archivo"
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ),
            });
          });

          if (gastoRequiereAutorizacion) {
            /*  const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${nuevoRequerimientoData.idrequerimiento}&tipo=${radioTipo}`;
            const encabezadoMensaje = "Nuevo gasto agregado";
            const mensaje = `${usuarioNombreCompleto} ha agregado un nuevo gasto en ${nombreEmpresa}: \n ${linkMensaje}`; */
            await executeCreaGasto({
              data: {
                usuario: usuario,
                pwd: usuarioPassword,
                rfc: rfcEmpresa,
                idmenu: idMenu,
                idsubmenu: idSubmenu,
                idrequerimiento: nuevoRequerimientoData.idrequerimiento,
                importe: parseFloat(RADatos.importe),
                idconcepto: RADatos.concepto,
                estatusgasto: 1,
                fecha: moment().format("YYYY-MM-DD"),
                fechagasto: RADatos.fecha,
                rfcproveedor: rfcGasto,
                nombreproveedor: nombreGasto.trim(),
                idbitacora: 0,
                /* encabezado: encabezadoMensaje,
                mensaje: mensaje */
              },
            });
          }

          executeListaRequerimientos();
          setShowComponent(1);
          setAccionAG(0);
          setIdRequerimiento(0);
          const token = jwt.sign(
            {
              menuTemporal: {
                tableTittle: tableTittle,
                showComponent: 1,
                idModulo: idModulo,
                idMenu: idMenu,
                idSubmenu: idSubmenu,
                accionAG: 0,
                idRequerimiento: 0,
                estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                page: page,
                busquedaFiltro: busquedaFiltro,
              },
            },
            "mysecretpassword"
          );
          localStorage.setItem("menuTemporal", token);
        }
      }
    }

    checkData();
  }, [
    nuevoRequerimientoData,
    executeListaRequerimientos,
    idModulo,
    idMenu,
    idSubmenu,
    setAccionAG,
    setIdRequerimiento,
    setShowComponent,
    tableTittle,
    radioTipo,
    page,
    busquedaFiltro,
    RADatos.importe,
    limiteImporteGasto,
    RADatos.concepto,
    RADatos.fecha,
    empresaId,
    executeCreaGasto,
    gastoRequiereAutorizacion,
    idRequerimiento,
    nombreEmpresa,
    nombreGasto,
    rfcEmpresa,
    rfcGasto,
    usuario,
    usuarioNombreCompleto,
    usuarioPassword,
  ]);

  useEffect(() => {
    function checkData() {
      if (agregaEstatusData) {
        if (agregaEstatusData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(agregaEstatusData.error)}
            </Typography>
          );
        } else {
          swal(
            "Estatus cambiado",
            "El estatus del requerimiento ha sido cambiado",
            "success"
          ).then(() => {
            if (
              (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
              idSubmenu === 44
            ) {
              /* const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${idRequerimiento}&tipo=${radioTipo}`;
              const encabezadoMensaje = "Nuevo gasto agregado";
              const mensaje = `${usuarioNombreCompleto} ha agregado un nuevo gasto en ${nombreEmpresa}: \n ${linkMensaje}`; */
              executeCreaGasto({
                data: {
                  usuario: usuario,
                  pwd: usuarioPassword,
                  rfc: rfcEmpresa,
                  idmenu: idMenu,
                  idsubmenu: idSubmenu,
                  idrequerimiento: idRequerimiento,
                  importe: parseFloat(importeEstatus),
                  idconcepto: 4,
                  estatusgasto: 3,
                  fecha: moment().format("YYYY-MM-DD"),
                  fechagasto: fechaEstatus,
                  rfcproveedor: rfcEstatus,
                  nombreproveedor: nombreLargoEstatus.trim(),
                  idbitacora: agregaEstatusData.idbitacora,
                  /* encabezado: encabezadoMensaje,
                  mensaje: mensaje */
                },
              });
            } else {
              executeDatosRequerimiento();
              executeListaRequerimientos();
            }
          });
        }
      }
    }

    checkData();
  }, [
    agregaEstatusData,
    estatusRequerimiento,
    idSubmenu,
    executeCreaGasto,
    executeDatosRequerimiento,
    executeListaRequerimientos,
    usuario,
    usuarioPassword,
    rfcEmpresa,
    idRequerimiento,
    importeEstatus,
    fechaEstatus,
    rfcEstatus,
    nombreLargoEstatus,
    empresaId,
    idMenu,
    idModulo,
    nombreEmpresa,
    usuarioNombreCompleto,
    radioTipo,
  ]);

  useEffect(() => {
    function checkData() {
      if (creaGastoData) {
        if (creaGastoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(creaGastoData.error)}
            </Typography>
          );
        } else {
          if (!gastoRequiereAutorizacion) {
            swal("Gasto creado", "Se creo el gasto con éxito", "success");
            executeDatosRequerimiento();
            executeListaRequerimientos();
          }
        }
      }
    }

    checkData();
  }, [
    creaGastoData,
    executeDatosRequerimiento,
    executeListaRequerimientos,
    gastoRequiereAutorizacion,
  ]);

  useEffect(() => {
    function checkData() {
      if (getTotalImporteData) {
        if (getTotalImporteData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(getTotalImporteData.error)}
            </Typography>
          );
        } else {
          setSumaActualGasto(
            getTotalImporteData.importe !== null
              ? getTotalImporteData.importe
              : 0
          );
        }
      }
    }

    checkData();
  }, [getTotalImporteData]);

  useEffect(() => {
    function checkData() {
      if (eliminaEstatusData) {
        if (eliminaEstatusData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(eliminaEstatusData.error)}
            </Typography>
          );
        } else {
          swal(
            "Estatus eliminado",
            "El estatus del requerimiento ha sido eliminado",
            "success"
          );
          setIdHistorialSelected(0);
          executeDatosRequerimiento();
          executeListaRequerimientos();
        }
      }
    }

    checkData();
  }, [
    eliminaEstatusData,
    executeDatosRequerimiento,
    executeListaRequerimientos,
  ]);

  useEffect(() => {
    function checkData() {
      if (editarRequerimientoData) {
        if (editarRequerimientoData.error !== 0) {
          swal(
            "Aviso",
            `${dataBaseErrores(editarRequerimientoData.error)}`,
            "warning"
          );
        } else {
          swal(
            radioTipo !== "gastos" ? "Requerimiento editado" : "Gasto editado",
            radioTipo !== "gastos"
              ? "El requerimiento se editó correctamente"
              : "El gasto se editó correctamentre",
            "success"
          ).then(() => {
            if (editarRequerimientoData.archivos) {
              swalReact({
                title: "Status de archivo(s)",
                buttons: {
                  cancel: "Cerrar",
                },
                icon: "info",
                content: (
                  <List style={{ maxHeight: "40vh", overflowY: "auto" }}>
                    {editarRequerimientoData.archivos.map((archivo, index) => {
                      return (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {archivo.status === 0 ? (
                              <SentimentVerySatisfiedIcon
                                style={{ color: "green" }}
                              />
                            ) : (
                              <SentimentVeryDissatisfiedIcon
                                style={{ color: "red" }}
                              />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={archivo.archivo}
                            secondary={
                              archivo.status === 0
                                ? "Archivo subido con éxito"
                                : archivo.status === 1
                                ? "Error al subir el archivo"
                                : archivo.status === 2
                                ? "No se pudo generar el link del archivo"
                                : archivo.status === 3
                                ? "El archivo está en blanco"
                                : "Ya existe el archivo"
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ),
              });
            }
          });
          setArchivosPrincipal(null);
          setArchivosSecundario(null);
          executeDatosRequerimiento();
          executeListaRequerimientos();
        }
      }
    }

    checkData();
  }, [
    editarRequerimientoData,
    executeDatosRequerimiento,
    executeListaRequerimientos,
    radioTipo,
  ]);

  useEffect(() => {
    function checkData() {
      if (eliminaDocumentoData) {
        if (eliminaDocumentoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(eliminaDocumentoData.error)}
            </Typography>
          );
        } else {
          swal(
            "Documento eliminado",
            "El documento ha sido eliminado",
            "success"
          );
          setSelectedListItem1Index(-1);
          setSelectedListItem2Index(-1);
          executeDatosRequerimiento();
        }
      }
    }

    checkData();
  }, [eliminaDocumentoData, executeDatosRequerimiento]);

  useEffect(() => {
    function checkData() {
      if (eliminaRequerimientoData) {
        if (eliminaRequerimientoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(eliminaRequerimientoData.error)}
            </Typography>
          );
        } else {
          swal(
            radioTipo !== "gastos"
              ? "Requerimiento eliminado"
              : "Gasto Eliminado",
            radioTipo !== "gastos"
              ? "El requerimiento ha sido eliminado"
              : "El gasto ha sido eliminado",
            "success"
          );
          executeListaRequerimientos();
          setShowComponent(1);
          setAccionAG(0);
          setIdRequerimiento(0);
          const token = jwt.sign(
            {
              menuTemporal: {
                tableTittle: tableTittle,
                showComponent: 1,
                idModulo: idModulo,
                idMenu: idMenu,
                idSubmenu: idSubmenu,
                accionAG: 0,
                idRequerimiento: 0,
                estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                page: page,
                busquedaFiltro: busquedaFiltro,
              },
            },
            "mysecretpassword"
          );
          localStorage.setItem("menuTemporal", token);
        }
      }
    }

    checkData();
  }, [
    eliminaRequerimientoData,
    executeListaRequerimientos,
    idModulo,
    idMenu,
    idSubmenu,
    setAccionAG,
    setIdRequerimiento,
    setShowComponent,
    tableTittle,
    radioTipo,
    page,
    busquedaFiltro,
  ]);

  useEffect(() => {
    function checkData() {
      if (reenviarNotificacionData) {
        if (reenviarNotificacionData.error !== 0) {
          swal(
            "Aviso",
            dataBaseErrores(reenviarNotificacionData.error),
            "warning"
          );
        } else {
          swal(
            "Notificaciones enviadas",
            "Las notificaciones se han enviado con éxito",
            "success"
          );
          setOpenMenuReenviarNotificacion(false);
        }
      }
    }

    checkData();
  }, [reenviarNotificacionData]);

  useEffect(() => {
    function checkData() {
      if (traerLimiteGastosUsuarioData) {
        if (traerLimiteGastosUsuarioData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerLimiteGastosUsuarioData.error)}
            </Typography>
          );
        } else {
          if (traerLimiteGastosUsuarioData.limiteGasto.length > 0) {
            setLimiteImporteGasto(
              traerLimiteGastosUsuarioData.limiteGasto[0].importe
            );
          }
        }
      }
    }

    checkData();
  }, [traerLimiteGastosUsuarioData]);

  if (
    cargaConceptosLoading ||
    cargaEstatusLoading ||
    nuevoRequerimientoLoading ||
    datosRequerimientoLoading ||
    agregaEstatusLoading ||
    eliminaEstatusLoading ||
    editarRequerimientoLoading ||
    eliminaDocumentoLoading ||
    eliminaRequerimientoLoading ||
    usuariosNotificacionLoading ||
    reenviarNotificacionLoading ||
    creaGastoLoading ||
    getTotalImporteLoading ||
    traerLimiteGastosUsuarioLoading ||
    traerProveedoresLoading ||
    traerRequerimientoPorSerieLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    cargaConceptosError ||
    cargaEstatusError ||
    nuevoRequerimientoError ||
    datosRequerimientoError ||
    agregaEstatusError ||
    eliminaEstatusError ||
    editarRequerimientoError ||
    eliminaDocumentoError ||
    eliminaRequerimientoError ||
    usuariosNotificacionError ||
    reenviarNotificacionError ||
    creaGastoError ||
    getTotalImporteError ||
    traerLimiteGastosUsuarioError ||
    traerProveedoresError ||
    traerRequerimientoPorSerieError
  ) {
    if (datosRequerimientoError) {
      setShowComponent(1);
      const token = jwt.sign(
        {
          menuTemporal: {
            tableTittle: tableTittle,
            showComponent: 1,
            idModulo: idModulo,
            idMenu: idMenu,
            idSubmenu: idSubmenu,
            estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
            page: page,
            busquedaFiltro: busquedaFiltro,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
    return <ErrorQueryDB />;
  }

  const getConceptos = () => {
    return cargaConceptosData.conceptos.map((concepto, index) => {
      return (radioTipo === "gastos" && concepto.concepto_relacion === 2) ||
        (radioTipo !== "gastos" && concepto.concepto_relacion === 1) ||
        idSubmenu !== 44 ? (
        <option key={index} value={concepto.id}>
          {concepto.nombre_concepto}
        </option>
      ) : null;
    });
  };

  const getConceptosRequerimientoGasto = () => {
    return cargaConceptosData.conceptos.map((concepto, index) => {
      return idSubmenu === 44 && concepto.concepto_relacion === 1 ? (
        <option key={index} value={concepto.id}>
          {concepto.nombre_concepto}
        </option>
      ) : null;
    });
  };

  const getEstatusPermitidos = (idEstatus) => {
    if (idUsuarioLogueado === idUsuarioRequerimiento) {
      switch (estatusActualRequerimiento) {
        case 1:
          return idEstatus === 2 ? true : false;
        case 3:
        case 5:
          return !gastoAutorizacion && (idEstatus === 4 || idEstatus === 5)
            ? true
            : false;
        default:
          return false;
      }
    } else {
      switch (estatusActualRequerimiento) {
        case 1:
          return idEstatus === 3 || idEstatus === 7 ? true : false;
        case 3:
        case 5:
          return !gastoAutorizacion && (idEstatus === 4 || idEstatus === 5)
            ? true
            : false;
        case 7:
          return idEstatus === 3 ? true : false;
        default:
          return false;
      }
    }
  };

  const getUsuarioEstatus = () => {
    return cargaEstatusData.estatus.map((estatus, index) => {
      return getEstatusPermitidos(estatus.id) ? (
        <option key={index} value={estatus.id}>
          {estatus.nombre_estado}
        </option>
      ) : null;
    });
  };

  const handleListItem1Click = (event, index, idDocumento) => {
    setSelectedListItem1Index(index !== selectedListItem1Index ? index : -1);
    setIdDocumentoPrincipal(idDocumento);
  };

  const handleListItem2Click = (event, index, idDocumento) => {
    setSelectedListItem2Index(index !== selectedListItem2Index ? index : -1);
    setIdDocumentoSecundario(idDocumento);
  };

  const handleCheckNoRFCEstatus = (event) => {
    setCheckNoRFCEstatus(!checkNoRFCEstatus);
    if (event.target.checked) {
      setRfcEstatus("");
      setNombreLargoEstatus("");
    }
  };

  const handleCheckNoRFC = (event) => {
    setCheckNoRFC(!checkNoRFC);
    if (event.target.checked) {
      setRfcGasto("");
      setNombreGasto("");
    }
  };

  const getSucursalesEmpresa = () => {
    return sucursales.map((sucursal, index) => {
      return (
        <option key={index} value={sucursal.idsucursal}>
          {sucursal.sucursal}
        </option>
      );
    });
  };

  const guardarRA = () => {
    const {
      sucursal,
      fecha,
      importe,
      concepto,
      serie,
      folio,
      descripcion,
    } = RADatos;
    if (archivosPrincipal === null || archivosPrincipal.length === 0) {
      swal(
        "Error en campos",
        "Seleccione por lo menos un documento principal",
        "warning"
      );
      return;
    } else {
      for (let x = 0; x < archivosPrincipal.length; x++) {
        if (!verificarExtensionArchivo(archivosPrincipal[x].name)) {
          swal(
            "Error de archivo",
            `Extensión de archivo no permitida en archivo ${archivosPrincipal[x].name}`,
            "warning"
          );
          return;
        }
      }
      if (archivosSecundario !== null) {
        for (let x = 0; x < archivosSecundario.length; x++) {
          if (!verificarExtensionArchivo(archivosSecundario[x].name)) {
            swal(
              "Error de archivo",
              `Extensión de archivo no permitida en archivo ${archivosSecundario[x].name}`,
              "warning"
            );
            return;
          }
        }
      }
    }
    if (sucursal === "0") {
      swal("Error en campos", "Seleccione una sucursal", "warning");
    } else if (fecha === "") {
      swal("Error en campos", "Ingrese una fecha", "warning");
    } else if (importe === "") {
      swal("Error en campos", "Ingrese un importe", "warning");
    } else if (concepto === "0") {
      swal("Error en campos", "Seleccione un concepto", "warning");
    } else if (folio === "") {
      swal("Error en campos", "Ingrese un folio", "warning");
    } else if (
      radioTipo === "gastos" &&
      !checkNoRFC &&
      rfcGasto.trim() === ""
    ) {
      swal("Error en campos", "Ingrese un RFC", "warning");
    } else if (
      radioTipo === "gastos" &&
      !checkNoRFC &&
      nombreGasto.trim() === ""
    ) {
      swal("Error en campos", "Ingrese una razón social", "warning");
    } else if (
      radioTipo === "gastos" &&
      checkNoRFC &&
      rfcGastoNoRFC.trim() === ""
    ) {
      swal("Error en campos", "Ingrese un RFC", "warning");
    } else if (
      radioTipo === "gastos" &&
      checkNoRFC &&
      nombreGastoNoRFC.trim() === ""
    ) {
      swal("Error en campos", "Ingrese una razón social", "warning");
    } else if (
      radioTipo === "gastos" &&
      importe > limiteImporteGasto &&
      limiteImporteGasto !== 0 &&
      conceptoRequerimientoGasto === "0"
    ) {
      swal(
        "Error en campos",
        "Seleccione un concepto del requerimiento",
        "warning"
      );
    } else {
      const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${idRequerimiento}&tipo=${radioTipo}`;
      const encabezadoMensaje =
        radioTipo !== "gastos"
          ? `Nuevo requerimiento de ${tableTittle.toLowerCase()}`
          : "Nuevo gasto agregado";
      const mensaje =
        radioTipo !== "gastos"
          ? `${usuarioNombreCompleto} ha agregado un nuevo requerimiento de ${tableTittle.toLowerCase()} en ${nombreEmpresa}: \n ${linkMensaje}`
          : `${usuarioNombreCompleto} ha agregado un nuevo gasto en ${nombreEmpresa}: \n ${linkMensaje}`;
      const formData = new FormData();
      formData.append("idsucursal", sucursal);
      formData.append("fecha", moment().format("YYYY-MM-DD"));
      formData.append("usuario", usuario);
      formData.append("pwd", usuarioPassword);
      formData.append("rfc", rfcEmpresa);
      formData.append("idsubmenu", idSubmenu);
      formData.append("fechareq", fecha);
      formData.append("descripcion", descripcion.trim());
      formData.append("importe", parseFloat(importe));
      formData.append("serie", serie);
      formData.append("folio", folio);
      formData.append("idmenu", idMenu);
      formData.append("usuario_storage", usuarioStorage);
      formData.append("password_storage", passwordStorage);
      formData.append("encabezado", encabezadoMensaje);
      formData.append("mensaje", mensaje);
      for (let x = 0; x < archivosPrincipal.length; x++) {
        formData.append("principal" + x, archivosPrincipal[x]);
      }
      if (archivosSecundario !== null) {
        for (let x = 0; x < archivosSecundario.length; x++) {
          formData.append("secundario" + x, archivosSecundario[x]);
        }
      }

      if (radioTipo === "gastos") {
        if (limiteImporteGasto !== 0) {
          if (importe <= limiteImporteGasto) {
            formData.append("estadodocumento", 3);
            formData.append("idconcepto", concepto);
            formData.append(
              "rfcproveedor",
              !checkNoRFC ? rfcGasto : rfcGastoNoRFC
            );
            formData.append(
              "nombreproveedor",
              !checkNoRFC ? nombreGasto : nombreGastoNoRFC
            );
            formData.append("estatus", 2);
          } else {
            formData.append("estadodocumento", 1);
            formData.append("idconcepto", conceptoRequerimientoGasto);
            formData.append("estatus", 1);
            setGastoRequiereAutorizacion(true);
          }
        } else {
          formData.append("estadodocumento", 3);
          formData.append("idconcepto", concepto);
          formData.append(
            "rfcproveedor",
            !checkNoRFC ? rfcGasto : rfcGastoNoRFC
          );
          formData.append(
            "nombreproveedor",
            !checkNoRFC ? nombreGasto : nombreGastoNoRFC
          );
          formData.append("estatus", 2);
        }
      } else {
        formData.append("estadodocumento", 1);
        formData.append("idconcepto", concepto);
        formData.append("estatus", 1);
      }

      executeNuevoRequerimiento({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  const actualizarRA = () => {
    if (
      (radioTipo === "requerimientos" &&
        descripcionAntigua === RADatos.descripcion.trim() &&
        (archivosPrincipal === null || archivosPrincipal.length === 0) &&
        (archivosSecundario === null || archivosSecundario.length === 0)) ||
      (radioTipo === "gastos" &&
        descripcionAntigua === RADatos.descripcion.trim() &&
        fechaAntigua === RADatos.fecha &&
        importeAntiguo === RADatos.importe &&
        (archivosPrincipal === null || archivosPrincipal.length === 0) &&
        (archivosSecundario === null || archivosSecundario.length === 0))
    ) {
      swal(
        radioTipo !== "gastos" ? "Requerimiento editado" : "Gasto editado",
        radioTipo !== "gastos"
          ? "Se ha editado el requerimiento"
          : "Se ha editado el gasto",
        "success"
      );
    } else {
      if (archivosPrincipal !== null) {
        for (let x = 0; x < archivosPrincipal.length; x++) {
          if (!verificarExtensionArchivo(archivosPrincipal[x].name)) {
            swal(
              "Error de archivo",
              `Extensión de archivo no permitida en archivo ${archivosPrincipal[x].name}`,
              "warning"
            );
            return;
          }
        }
      }
      if (archivosSecundario !== null) {
        for (let x = 0; x < archivosSecundario.length; x++) {
          if (!verificarExtensionArchivo(archivosSecundario[x].name)) {
            swal(
              "Error de archivo",
              `Extensión de archivo no permitida en archivo ${archivosSecundario[x].name}`,
              "warning"
            );
            return;
          }
        }
      }
      if (radioTipo === "gastos") {
        if (RADatos.fecha === "") {
          swal("Error de archivo", `Ingrese una fecha`, "warning");
          return;
        } else if (RADatos.importe === "") {
          swal("Error de archivo", `Ingrese un importe`, "warning");
          return;
        }
      }
      const encabezadoMensaje = `Se actualizo un requerimiento de ${tableTittle.toLowerCase()}`;
      const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${idRequerimiento}&tipo=${radioTipo}`;
      const mensaje = `${usuarioNombreCompleto} ha actualizado un requerimiento de ${tableTittle.toLowerCase()} en ${nombreEmpresa}: \n ${linkMensaje}`;
      const formData = new FormData();
      formData.append("usuario", usuario);
      formData.append("pwd", usuarioPassword);
      formData.append("rfc", rfcEmpresa);
      formData.append("idrequerimiento", idRequerimiento);
      formData.append("idmenu", idMenu);
      formData.append("idsubmenu", idSubmenu);
      formData.append("descripcion", RADatos.descripcion);
      formData.append("usuario_storage", empresaDatos.usuario_storage);
      formData.append("password_storage", empresaDatos.password_storage);
      formData.append("fecha", moment().format("YYYY-MM-DD"));
      formData.append("encabezado", encabezadoMensaje);
      formData.append("mensaje", mensaje);
      if (archivosPrincipal !== null) {
        for (let x = 0; x < archivosPrincipal.length; x++) {
          formData.append("principal" + x, archivosPrincipal[x]);
        }
      }
      if (archivosSecundario !== null) {
        for (let x = 0; x < archivosSecundario.length; x++) {
          formData.append("secundario" + x, archivosSecundario[x]);
        }
      }

      if (radioTipo === "gastos") {
        formData.append("fecha_req", RADatos.fecha);
        formData.append("importe", RADatos.importe);
      }

      executeEditarRequerimiento({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  const getDocumentosGuardados = (tipoDoc) => {
    let documentoPrincipal = 0;
    let documentoAccesorio = 0;
    return documentosGuardados.length > 0 ? (
      documentosGuardados.map((documento, index) => {
        documento.tipo_doc === 1 ? documentoPrincipal++ : documentoAccesorio++;
        return documento.tipo_doc === tipoDoc ? (
          <ListItem
            key={index}
            button
            selected={
              tipoDoc === 1
                ? selectedListItem1Index === index
                : selectedListItem2Index === index
            }
            onClick={(e) => {
              if (tipoDoc === 1) {
                handleListItem1Click(e, index, documento.id);
              } else {
                handleListItem2Click(e, index, documento.id);
              }
            }}
          >
            <ListItemText
              primary={documento.documento}
              secondary={`${documento.nombre} ${documento.apellidop} ${documento.apellidom}`}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Opciones">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    setRutaDocumento(documento.download);
                    handleOpenMenu(e);
                  }}
                >
                  <SettingsEthernetIcon sryle={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ) : documentosGuardados.length === index + 1 &&
          (documentoPrincipal === 0 || documentoAccesorio === 0) ? (
          <ListItem key={index}>
            <ListItemText
              primary={
                tipoDoc === 1
                  ? "Sin documentos principales"
                  : "Sin documentos accesorios"
              }
            />
          </ListItem>
        ) : null;
      })
    ) : (
      <ListItem>
        <ListItemText
          primary={
            tipoDoc === 1
              ? "Sin documentos principales"
              : "Sin documentos accesorios"
          }
        />
      </ListItem>
    );
  };

  const getEstatus = (idEstatus) => {
    for (let x = 0; x < cargaEstatusData.estatus.length; x++) {
      if (cargaEstatusData.estatus[x].id === idEstatus) {
        return cargaEstatusData.estatus[x].nombre_estado;
      }
    }
    return "";
  };

  const handleClickCheckBox = (
    event,
    idHistorial,
    estatusAnterior,
    idUsuarioHistorial
  ) => {
    if (event.target.checked) {
      setIdHistorialSelected(idHistorial);
      setEstatusAnteriorRequerimiento(estatusAnterior);
      setIdUsuarioEstatusRequerimiento(idUsuarioHistorial);
    } else {
      setIdHistorialSelected(0);
      setEstatusAnteriorRequerimiento(0);
      setIdUsuarioEstatusRequerimiento(0);
    }
  };

  const getHistorial = () => {
    return historial.map((item, index) => {
      return (
        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
          <TableCell padding="checkbox">
            {historial.length !== 1 && historial.length === index + 1 ? (
              <Checkbox
                onChange={(e) => {
                  handleClickCheckBox(
                    e,
                    item.id_bit,
                    historial[index - 1].status,
                    item.id_usuario
                  );
                }}
              />
            ) : null}
          </TableCell>
          <TableCell align="left">{`${item.nombre} ${item.apellidop} ${item.apellidom}`}</TableCell>
          <TableCell align="left">{item.fecha}</TableCell>
          <TableCell align="left">{getEstatus(item.status)}</TableCell>
          <TableCell align="left">
            {item.observaciones !== null
              ? item.observaciones
              : "Sin observaciones"}
          </TableCell>
        </TableRow>
      );
    });
  };

  const cambiarEstatus = () => {
    if (estatusRequerimiento === "0" || estatusRequerimiento === 0) {
      swal("Error", "Seleccione un estatus", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      importeEstatus.trim() === ""
    ) {
      swal("Error", "Ingrese un importe del gasto", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      parseFloat(importeEstatus.trim()) + sumaActualGasto >
        parseFloat(RADatos.importe)
    ) {
      swal(
        "Error",
        "Solo puede poner como máximo un importe del gasto de $" +
          (RADatos.importe - sumaActualGasto),
        "warning"
      );
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      fechaEstatus === ""
    ) {
      swal("Error", "Ingrese una fecha del gasto", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      !checkNoRFCEstatus &&
      rfcEstatus.trim() === ""
    ) {
      swal("Error", "Ingrese un RFC", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      !checkNoRFCEstatus &&
      nombreLargoEstatus.trim() === ""
    ) {
      swal("Error", "Ingrese una razón social", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      checkNoRFCEstatus &&
      rfcEstatusNoRFC.trim() === ""
    ) {
      swal("Error", "Ingrese un RFC", "warning");
    } else if (
      (estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
      idSubmenu === 44 &&
      checkNoRFCEstatus &&
      nombreLargoEstatusNoRFC.trim() === ""
    ) {
      swal("Error", "Ingrese una razón social", "warning");
    } else {
      let cambioEstatus = false;
      if (idUsuarioLogueado === idUsuarioRequerimiento) {
        switch (estatusActualRequerimiento) {
          case 1:
            if (parseInt(estatusRequerimiento) !== 2) {
              swal(
                "Error",
                "Solo puedes marcar como cancelado el estatus de tus propios requerimientos",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          case 3:
            if (
              parseInt(estatusRequerimiento) !== 4 &&
              parseInt(estatusRequerimiento) !== 5
            ) {
              swal(
                "Error",
                "Solo puedes marcar como surtido o surtido parcial los requerimientos con estatus autorizado",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          case 5:
            if (
              parseInt(estatusRequerimiento) !== 4 &&
              parseInt(estatusRequerimiento) !== 5
            ) {
              swal(
                "Error",
                "Solo puedes marcar como surtido o surtido parcial los requerimientos con estatus surtido parcial",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          default:
            swal(
              "Error",
              "No puedes cambiar el estatus de este requerimiento",
              "warning"
            );
            break;
        }
      } else {
        switch (estatusActualRequerimiento) {
          case 1:
            if (
              parseInt(estatusRequerimiento) !== 3 &&
              parseInt(estatusRequerimiento) !== 7
            ) {
              swal(
                "Error",
                "Solo puedes marcar como autorizado o no autorizado los requerimientos con estatus pendiente",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          case 3:
            if (
              parseInt(estatusRequerimiento) !== 4 &&
              parseInt(estatusRequerimiento) !== 5
            ) {
              swal(
                "Error",
                "Solo puedes marcar como surtido o surtido parcial los requerimientos con estatus autorizado",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          case 5:
            if (
              parseInt(estatusRequerimiento) !== 4 &&
              parseInt(estatusRequerimiento) !== 5
            ) {
              swal(
                "Error",
                "Solo puedes marcar como surtido o surtido parcial los requerimientos con estatus surtido parcial",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          case 7:
            if (parseInt(estatusRequerimiento) !== 3) {
              swal(
                "Error",
                "Solo puedes marcar como autorizado los requerimientos con estatus no autorizado",
                "warning"
              );
            } else {
              cambioEstatus = true;
            }
            break;
          default:
            swal(
              "Error",
              "No puedes cambiar el estatus de este requerimiento",
              "warning"
            );
            break;
        }
      }
      if (cambioEstatus) {
        const encabezadoMensaje = `Se actualizo el estatus de un requerimiento de ${tableTittle.toLowerCase()}`;
        const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${idRequerimiento}&tipo=${radioTipo}`;
        const mensaje = `${usuarioNombreCompleto} ha actualizado el estatus de un requerimiento de ${tableTittle.toLowerCase()} en ${nombreEmpresa}: \n ${linkMensaje}`;
        let estatusGasto = 0;
        if (
          (parseInt(estatusRequerimiento) === 4 ||
            parseInt(estatusRequerimiento) === 5) &&
          idSubmenu === 44
        ) {
          estatusGasto =
            parseFloat(importeEstatus) + sumaActualGasto <
            parseFloat(RADatos.importe)
              ? 5
              : 4;
        }
        executeAgregaEstatus({
          data: {
            usuario: usuario,
            pwd: usuarioPassword,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idmenu: idMenu,
            idrequerimiento: idRequerimiento,
            fecha: moment().format("YYYY-MM-DD"),
            estatus:
              parseInt(estatusRequerimiento) === 4 ||
              parseInt(estatusRequerimiento) === 5
                ? estatusGasto
                : parseInt(estatusRequerimiento),
            observaciones: observacionesHistorial,
            encabezado: encabezadoMensaje,
            mensaje: mensaje,
          },
        });
      }
    }
  };

  const eliminarHistorialRequerimiento = () => {
    if (idHistorialSelected === 0) {
      swal("Error", "Selecciona un estatus para eliminar", "warning");
    } else if (idUsuarioLogueado !== idUsuarioEstatusRequerimiento) {
      swal(
        "Error",
        "No puedes eliminar los estatus de otros usuarios",
        "warning"
      );
    } else if (
      (estatusActualRequerimiento === 4 || estatusActualRequerimiento === 5) &&
      idSubmenu === 44
    ) {
      swal(
        "Error",
        "No puedes eliminar los estatus surtido y surtido parcial en un requerimiento de gastos",
        "warning"
      );
    } else {
      swal({
        text: "¿Está seguro de eliminar este estatus?",
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeEliminaEstatus({
            data: {
              usuario: usuario,
              pwd: usuarioPassword,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idbitacora: idHistorialSelected,
              idrequerimiento: idRequerimiento,
              estatus: estatusAnteriorRequerimiento,
            },
          });
        }
      });
    }
  };

  const getLengthDocumentosPrincipales = () => {
    let cantidadDocumentosPrincipales = 0;
    for (let x = 0; x < documentosGuardados.length; x++) {
      if (documentosGuardados[x].tipo_doc === 1) {
        cantidadDocumentosPrincipales++;
      }
    }
    return cantidadDocumentosPrincipales;
  };

  const eliminarDocumentoPrincipal = () => {
    if (selectedListItem1Index === -1) {
      swal("Error", "Selecciona un documento principal", "warning");
    } else if (radioTipo === "gastos") {
      swal("Error", "No se pueden eliminar documentos en gastos", "warning");
    } else if (
      estatusActualRequerimiento === 3 ||
      estatusActualRequerimiento === 4 ||
      estatusActualRequerimiento === 5 ||
      estatusActualRequerimiento === 7
    ) {
      swal(
        "Error",
        "No se pueden eliminar documentos cuando el estatus del requerimiento  es autorizado, no autorizado, surtido o surtido parcial",
        "warning"
      );
    } else if (getLengthDocumentosPrincipales() === 1) {
      swal(
        "Error",
        "Tiene que haber por lo menos un documento principal",
        "warning"
      );
    } else {
      swal({
        text: "¿Está seguro de eliminar el documento?",
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeEliminaDocumento({
            data: {
              usuario: usuario,
              pwd: usuarioPassword,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idmenu: idMenu,
              usuario_storage: usuarioStorage,
              password_storage: passwordStorage,
              idarchivo: idDocumentoPrincipal,
              idrequerimiento: idRequerimiento,
            },
          });
        }
      });
    }
  };

  const eliminarDocumentoSecundario = () => {
    if (selectedListItem2Index === -1) {
      swal("Error", "Selecciona un documento accesorio", "warning");
    } else if (radioTipo === "gastos") {
      swal("Error", "No se pueden eliminar documentos en gastos", "warning");
    } else if (
      estatusActualRequerimiento === 3 ||
      estatusActualRequerimiento === 4 ||
      estatusActualRequerimiento === 5 ||
      estatusActualRequerimiento === 7
    ) {
      swal(
        "Error",
        "No se pueden eliminar documentos cuando el estatus del requerimiento  es autorizado, no autorizado, surtido o surtido parcial",
        "warning"
      );
    } else {
      swal({
        text: "¿Está seguro de eliminar el documento?",
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeEliminaDocumento({
            data: {
              usuario: usuario,
              pwd: usuarioPassword,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idmenu: idMenu,
              usuario_storage: usuarioStorage,
              password_storage: passwordStorage,
              idarchivo: idDocumentoSecundario,
              idrequerimiento: idRequerimiento,
            },
          });
        }
      });
    }
  };

  const eliminarRequerimiento = () => {
    if (idUsuarioRequerimiento !== idUsuarioLogueado) {
      swal(
        "Error",
        `No puedes eliminar los ${
          radioTipo !== "gastos" ? "requerimientos" : "gastos"
        } de otro usuario`,
        "warning"
      );
    } else if (radioTipo !== "gastos" && gastoAutorizacion) {
      swal(
        "Error",
        "No se pueden eliminar requerimientos creados a partir de un gasto",
        "warning"
      );
    } else if (
      datosRequerimientoData.requerimiento[0].estado_documento !== 1 &&
      radioTipo === "gastos" &&
      datosRequerimientoData.requerimiento[0].requerimiento.length > 0 &&
      datosRequerimientoData.requerimiento[0].requerimiento[0]
        .gasto_requerimiento === 1
    ) {
      swal(
        "Error",
        "Solo se pueden eliminar los gastos que necesitan autorización con estatus pendiente",
        "warning"
      );
    } else if (estatusActualRequerimiento !== 1 && radioTipo !== "gastos") {
      swal(
        "Error",
        "Solo se pueden eliminar requerimientos con estatus pendiente",
        "warning"
      );
    } else {
      swal({
        text: `¿Está seguro de eliminar el ${
          radioTipo !== "gastos" ? "requerimiento" : "gasto"
        }?`,
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeEliminaRequerimiento({
            data: {
              usuario: usuario,
              pwd: usuarioPassword,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idmenu: idMenu,
              usuario_storage: usuarioStorage,
              password_storage: passwordStorage,
              idrequerimiento: idRequerimiento,
              estatus: radioTipo !== "gastos" ? 1 : 2,
              gastoRequerimiento:
                radioTipo === "gastos" &&
                requerimiento.length > 0 &&
                requerimiento[0].gasto_requerimiento === 1
                  ? 1
                  : 0,
            },
          });
        }
      });
    }
  };

  const reenviarNotificacionUsuarios = () => {
    if (usuariosNotificacionesSelected.length > 0) {
      const linkMensaje = `http://${window.location.host}/#/?ruta=autorizacionesGastos&idempresa=${empresaId}&idmodulo=${idModulo}&idmenu=${idMenu}&idsubmenu=${idSubmenu}&iddocumento=${idRequerimiento}&tipo=${radioTipo}`;
      const reenviarNotificacionDatos = {
        usuario: usuario,
        pwd: usuarioPassword,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        idregistro: idRequerimiento,
        idmenu: idMenu,
        encabezado: `Tiene una nueva notificación de un requerimiento de ${tableTittle.toLowerCase()}`,
        mensaje: `Mensaje reenviado del requerimiento de ${tableTittle.toLowerCase()} en ${nombreEmpresa}: ${linkMensaje}`,
        usuarios: usuariosNotificacionesSelected,
      };
      executeReenviarNotificacion({
        data: reenviarNotificacionDatos,
      });
    } else {
      swal("Error", "Seleccione al menos un usuario", "warning");
    }
  };

  const getUsuariosNotificacion = () => {
    return usuariosNotificacionData.usuarios.map((usuario, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{`${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`}</TableCell>
          <TableCell align="right">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={(e) => {
                      handleClickCheckBoxUsuariosNotificacion(
                        e,
                        usuario.id_usuario,
                        usuario.correo,
                        usuario.cel,
                        4
                      );
                    }}
                  />
                }
                label="Aplicación Móvil"
                style={{ textAlign: "initial" }}
                labelPlacement="end"
              />
              <Tooltip title={usuario.correo}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={(e) => {
                        handleClickCheckBoxUsuariosNotificacion(
                          e,
                          usuario.id_usuario,
                          usuario.correo,
                          usuario.cel,
                          1
                        );
                      }}
                    />
                  }
                  label="Email"
                  labelPlacement="end"
                />
              </Tooltip>
              <Tooltip title={usuario.cel}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={(e) => {
                        handleClickCheckBoxUsuariosNotificacion(
                          e,
                          usuario.id_usuario,
                          usuario.correo,
                          usuario.cel,
                          2
                        );
                      }}
                    />
                  }
                  label="SMS"
                  labelPlacement="end"
                />
              </Tooltip>
            </FormGroup>
          </TableCell>
        </TableRow>
      );
    });
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleClickCheckBoxUsuariosNotificacion = (
    event,
    id_usuario,
    correo,
    cel,
    notificaciones
  ) => {
    let newSelected = [];
    const dataUsuario = [
      {
        id_usuario,
        correo,
        cel,
        notificaciones,
      },
    ];
    let pos = -1;
    if (usuariosNotificacionesSelected.length === 0) {
      newSelected = newSelected.concat(
        usuariosNotificacionesSelected,
        dataUsuario
      );
      setUsuariosNotificacionesSelected(newSelected);
    } else {
      for (let x = 0; x < usuariosNotificacionesSelected.length; x++) {
        if (usuariosNotificacionesSelected[x].id_usuario === id_usuario) {
          if (event.target.checked) {
            usuariosNotificacionesSelected[x].notificaciones =
              usuariosNotificacionesSelected[x].notificaciones + notificaciones;
          } else {
            usuariosNotificacionesSelected[x].notificaciones =
              usuariosNotificacionesSelected[x].notificaciones - notificaciones;
          }
          if (usuariosNotificacionesSelected[x].notificaciones === 0) {
            usuariosNotificacionesSelected.splice(x, 1);
          }
          pos = x;
          break;
        }
      }
      if (pos === -1) {
        newSelected = newSelected.concat(
          usuariosNotificacionesSelected,
          dataUsuario
        );
        setUsuariosNotificacionesSelected(newSelected);
      }
    }
  };

  const handleOpenMenuReenviarNotificacion = () => {
    setOpenMenuReenviarNotificacion(true);
  };

  const handleCloseMenuReenviarNotificacion = () => {
    setOpenMenuReenviarNotificacion(false);
  };

  return (
    <Grid container justify="center" style={{ padding: "10px" }}>
      <Grid item xs={12}>
        <Typography variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              aria-label="regresar"
              onClick={() => {
                setShowComponent(1);
                setAccionAG(0);
                setIdRequerimiento(0);
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      tableTittle: tableTittle,
                      showComponent: 1,
                      idModulo: idModulo,
                      idMenu: idMenu,
                      idSubmenu: idSubmenu,
                      accionAG: 0,
                      idRequerimiento: 0,
                      estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                      page: page,
                      busquedaFiltro: busquedaFiltro,
                    },
                  },
                  "mysecretpassword"
                );
                localStorage.setItem("menuTemporal", token);
                localStorage.removeItem("notificacionData");
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          {radioTipo !== "gastos"
            ? gastoAutorizacion
              ? "Autorización de Gasto"
              : " Requerimiento de " + tableTittle
            : "Gasto"}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "15px" }}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              color="primary"
              disabled={statusEmpresa !== 1}
              variant="contained"
              className={classes.formButtons}
              onClick={() => {
                accionAG === 1 ? guardarRA() : actualizarRA();
              }}
            >
              Guardar
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              className={classes.formButtons}
              disabled={accionAG !== 2 || statusEmpresa !== 1}
              style={{
                background: accionAG !== 2 || statusEmpresa !== 1 ? "disabled" : "#4caf50",
                color: accionAG !== 2 || statusEmpresa !== 1 ? "disabled" : "#ffffff",
              }}
              variant="contained"
              onClick={() => {
                /* setShowComponent(2);
                setAccionAG(1);
                setIdRequerimiento(0); */
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      tableTittle: tableTittle,
                      showComponent: 2,
                      idModulo: idModulo,
                      idMenu: idMenu,
                      idSubmenu: idSubmenu,
                      accionAG: 1,
                      idRequerimiento: 0,
                      estatusRequerimiento: radioTipo !== "gastos" ? 1 : 2,
                      page: page,
                      busquedaFiltro: busquedaFiltro,
                    },
                  },
                  "mysecretpassword"
                );
                localStorage.setItem("menuTemporal", token);
                window.location.reload();
              }}
            >
              Nuevo
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button
              color="secondary"
              variant="contained"
              className={classes.formButtons}
              disabled={accionAG !== 2 || permisosSubmenu < 3 || statusEmpresa !== 1}
              onClick={() => {
                eliminarRequerimiento();
              }}
            >
              Eliminar
            </Button>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={2}>
            <Button
              className={classes.formButtons}
              disabled={accionAG !== 2}
              style={{
                background: accionAG === 2 ? "#ff9800" : "",
                color: accionAG === 2 ? "#ffffff" : ""
              }}
              variant="contained"
            >
              Cerrar
            </Button>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "30px", marginBottom: "30px" }}>
        <Grid container justify="flex-end" spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              color="primary"
              variant="outlined"
              className={classes.formButtons}
              style={{ float: "right", height: "100%" }}
              disabled={accionAG !== 2 || statusEmpresa !== 1}
              onClick={() => {
                handleOpenMenuReenviarNotificacion();
              }}
            >
              Reenviar Notificación
            </Button>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4}>
            <Button
              color="primary"
              variant="outlined"
              className={classes.formButtons}
              style={{ float: "right", height: "100%" }}
              disabled={accionAG !== 2}
            >
              Enviar a Terceros
            </Button>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} style={{ alignSelf: "center" }}>
        <Grid
          container
          justify="center"
          spacing={3}
          style={{ padding: "10px", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              className={classes.textFields}
              select
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              label="Sucursal"
              type="text"
              inputProps={{
                maxLength: 20,
              }}
              value={RADatos.sucursal}
              disabled={accionAG === 2}
              onChange={(e) => {
                setRADatos({
                  ...RADatos,
                  sucursal: e.target.value,
                });
              }}
            >
              <option value="0">Selecciona una sucursal</option>
              {getSucursalesEmpresa()}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={classes.textFields}
              variant="outlined"
              label="Fecha"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={RADatos.fecha}
              disabled={accionAG === 2 && radioTipo !== "gastos"}
              onChange={(e) => {
                setRADatos({
                  ...RADatos,
                  fecha: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              className={classes.textFields}
              id="importe"
              variant="outlined"
              label="Importe"
              type="text"
              inputProps={{
                maxLength: 20,
              }}
              value={RADatos.importe}
              disabled={accionAG === 2 && radioTipo !== "gastos"}
              onKeyPress={(e) => {
                doubleKeyValidation(e, 2);
              }}
              onChange={(e) => {
                doublePasteValidation(e, 2);
                setRADatos({
                  ...RADatos,
                  importe: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              className={classes.textFields}
              select
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              label="Concepto"
              type="text"
              value={RADatos.concepto}
              disabled={accionAG === 2}
              onChange={(e) => {
                setRADatos({
                  ...RADatos,
                  concepto: e.target.value,
                });
              }}
            >
              <option value="0">Selecciona un concepto</option>
              {getConceptos()}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={classes.textFields}
              variant="outlined"
              id="serie"
              label="Serie"
              type="text"
              inputProps={{
                maxLength: 20,
                ref: inputSerie,
              }}
              value={RADatos.serie}
              disabled={accionAG === 2}
              onKeyPress={(e) => {
                keyValidation(e, 5);
              }}
              onChange={(e) => {
                pasteValidation(e, 5);
                setRADatos({
                  ...RADatos,
                  serie: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              className={classes.textFields}
              id="folio"
              variant="outlined"
              label={
                accionAG !== 1
                  ? `Folio`
                  : `Folio (Recomendado ${siguienteFolio})`
              }
              type="text"
              inputProps={{
                maxLength: 30,
              }}
              value={RADatos.folio}
              disabled={accionAG === 2}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={(e) => {
                pasteValidation(e, 2);
                setRADatos({
                  ...RADatos,
                  folio: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: "100%" }}
              id="descripcion"
              label="Descripción"
              multiline
              rows="5"
              variant="outlined"
              value={RADatos.descripcion}
              onKeyPress={(e) => {
                keyValidation(e, 3);
              }}
              onChange={(e) => {
                pasteValidation(e, 3);
                setRADatos({
                  ...RADatos,
                  descripcion: e.target.value,
                });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={1}>
        <Divider orientation="vertical" style={{ margin: "auto" }} />
      </Grid>
      {radioTipo === "requerimientos" ? (
        <Grid item xs={12} sm={12} md={12} lg={5} style={{ padding: "10px" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Historial Requerimiento</Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                className={classes.textFields}
                style={{ marginTop: 0 }}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Estatus"
                type="text"
                margin="normal"
                value={estatusRequerimiento}
                inputProps={{
                  maxLength: 20,
                }}
                disabled={accionAG !== 2}
                onChange={(e) => {
                  if (e.target.value === "4" || e.target.value === "5") {
                    executeGetTotalImporte();
                  }
                  setEstatusRequerimiento(e.target.value);
                }}
              >
                <option value="0">Selecciona un estatus</option>
                {getUsuarioEstatus()}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3} lg={4}>
              <Button
                className={classes.formButtons}
                style={{
                  background: accionAG === 2 ? "#4caf50" : "",
                  color: accionAG === 2 ? "#ffffff" : "",
                }}
                variant="contained"
                disabled={accionAG !== 2}
                onClick={() => {
                  cambiarEstatus();
                }}
              >
                Agregar
              </Button>
            </Grid>
            <Grid item xs={12} sm={3} lg={4}>
              <Button
                className={classes.formButtons}
                color="secondary"
                variant="contained"
                disabled={
                  accionAG !== 2 ||
                  //idUsuarioLogueado !== idUsuarioRequerimiento ||
                  historial.length === 1 ||
                  permisosSubmenu < 3 ||
                  statusEmpresa !== 1
                }
                onClick={() => {
                  eliminarHistorialRequerimiento();
                }}
              >
                Eliminar
              </Button>
            </Grid>
            {(estatusRequerimiento === "4" || estatusRequerimiento === "5") &&
            idSubmenu === 44 ? (
              <Fragment>
                <Grid item xs={12}>
                  <Typography>{`Suma pendiente: ${
                    parseFloat(RADatos.importe) - sumaActualGasto
                  }`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    style={{ width: "100%" }}
                    id="importeEstatus"
                    type="text"
                    inputProps={{
                      maxLength: 20,
                    }}
                    label="Importe de Gasto"
                    variant="outlined"
                    value={importeEstatus}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      doublePasteValidation(e, 2);
                      setImporteEstatus(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.textFields}
                    variant="outlined"
                    label="Fecha de Gasto"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={fechaEstatus}
                    onChange={(e) => {
                      setFechaEstatus(e.target.value);
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    style={{ width: "100%" }}
                    id="rfcEstatus"
                    type="text"
                    label="RFC"
                    variant="outlined"
                    value={rfcEstatus}
                    inputProps={{
                      maxLength: 20
                    }}
                    onKeyPress={e => {
                      keyValidation(e, 5);
                    }}
                    onChange={e => {
                      pasteValidation(e, 5);
                      setRfcEstatus(e.target.value);
                    }}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkeNoRfcEstatus"
                        color="primary"
                        checked={checkNoRFCEstatus}
                        onChange={handleCheckNoRFCEstatus}
                      />
                    }
                    label="¿No aparece tu RFC?"
                  />
                </Grid>
                {!checkNoRFCEstatus ? (
                  <Fragment>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={proveedores}
                        getOptionLabel={(option) =>
                          `${option.rfc}-${option.razonsocial}`
                        }
                        id="debug"
                        onInputChange={(e, value) => {
                          const separacion = value.split("-");
                          if (separacion.length === 2) {
                            const rfc = separacion[0];
                            const nombreLargo = separacion[1];
                            setRfcEstatus(rfc);
                            setNombreLargoEstatus(nombreLargo);
                          } else {
                            setRfcEstatus("");
                            setNombreLargoEstatus("");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="rfcAutocompleteStatus"
                            style={{ width: "100%" }}
                            value={rfcEstatus}
                            onKeyPress={(e) => {
                              keyValidation(e, 5);
                            }}
                            onChange={(e) => {
                              pasteValidation(e, 5);
                            }}
                            label="RFC"
                            margin="normal"
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        style={{
                          width: "100%",
                        }}
                        disabled
                        id="nombreLargoEstatus"
                        type="text"
                        label="Razón social"
                        variant="outlined"
                        value={nombreLargoEstatus}
                        inputProps={{
                          maxLength: 100,
                        }}
                        onKeyPress={(e) => {
                          keyValidation(e, 1);
                        }}
                        onChange={(e) => {
                          pasteValidation(e, 1);
                          setNombreLargoEstatus(e.target.value);
                        }}
                      />
                    </Grid>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Grid item xs={12}>
                      <TextField
                        id="rfcEstatusNoRFC"
                        style={{ width: "100%" }}
                        value={rfcEstatusNoRFC}
                        onKeyPress={(e) => {
                          keyValidation(e, 5);
                        }}
                        onChange={(e) => {
                          pasteValidation(e, 5);
                          setRfcEstatusNoRFC(e.target.value);
                        }}
                        label="RFC"
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        style={{
                          width: "100%",
                        }}
                        disabled
                        id="nombreLargoEstatusNoRFC"
                        type="text"
                        label="Razón social"
                        variant="outlined"
                        value={nombreLargoEstatusNoRFC}
                        inputProps={{
                          maxLength: 100,
                        }}
                        onKeyPress={(e) => {
                          keyValidation(e, 1);
                        }}
                        onChange={(e) => {
                          pasteValidation(e, 1);
                          setNombreLargoEstatusNoRFC(e.target.value);
                        }}
                      />
                    </Grid>
                  </Fragment>
                )}
              </Fragment>
            ) : null}
            <Grid item xs={12}>
              <TextField
                style={{ width: "100%" }}
                id="observaciones"
                label="Observaciones"
                variant="outlined"
                value={observacionesHistorial}
                disabled={accionAG !== 2}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setObservacionesHistorial(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: "15px" }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell align="left">Usuario</TableCell>
                    <TableCell align="left">Fecha</TableCell>
                    <TableCell align="left">Estatus</TableCell>
                    <TableCell align="left">Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{historial ? getHistorial() : null}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} sm={12} md={12} lg={5} style={{ padding: "10px" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Información de Gasto</Typography>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                style={{ width: "100%" }}
                id="rfcGasto"
                label="RFC"
                disabled={accionAG === 2}
                variant="outlined"
                value={rfcGasto}
                inputProps={{
                  maxLength: 20
                }}
                onKeyPress={e => {
                  keyValidation(e, 5);
                }}
                onChange={e => {
                  pasteValidation(e, 5);
                  setRfcGasto(e.target.value);
                }}
              />
            </Grid> */}
            {accionAG === 1 ? (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkeNoRfc"
                      color="primary"
                      checked={checkNoRFC}
                      onChange={handleCheckNoRFC}
                    />
                  }
                  label="¿No aparece tu RFC?"
                />
              </Grid>
            ) : null}
            {!checkNoRFC && accionAG === 1 ? (
              <Fragment>
                <Grid item xs={12}>
                  <Autocomplete
                    options={proveedores}
                    getOptionLabel={(option) =>
                      `${option.rfc}-${option.razonsocial}`
                    }
                    disabled={accionAG === 2}
                    id="debug"
                    onInputChange={(e, value) => {
                      const separacion = value.split("-");
                      if (separacion.length === 2) {
                        const rfc = separacion[0];
                        const nombreLargo = separacion[1];
                        setRfcGasto(rfc);
                        setNombreGasto(nombreLargo);
                      } else {
                        setRfcGasto("");
                        setNombreGasto("");
                      }
                      /* setRfcGasto(value);
                      for (let x = 0; x < proveedores.length; x++) {
                        if (proveedores[x].rfc === value) {
                          setNombreGasto(proveedores[x].razonsocial);
                          break;
                        }
                      } */
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="rfcAutocomplete"
                        style={{ width: "100%" }}
                        onKeyPress={(e) => {
                          keyValidation(e, 5);
                        }}
                        onChange={(e) => {
                          pasteValidation(e, 5);
                        }}
                        label="RFC"
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    style={{
                      width: "100%",
                    }}
                    id="nombreGasto"
                    label="Razón social"
                    disabled
                    variant="outlined"
                    value={nombreGasto}
                    inputProps={{
                      maxLength: 100,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 1);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 1);
                      setNombreGasto(e.target.value);
                    }}
                  />
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item xs={12}>
                  <TextField
                    id="rfcGastoNoRFC"
                    style={{ width: "100%" }}
                    disabled={accionAG === 2}
                    value={rfcGastoNoRFC}
                    inputProps={{
                      maxLength: 20,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 5);
                      setRfcGastoNoRFC(e.target.value);
                    }}
                    label="RFC"
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    style={{
                      width: "100%",
                    }}
                    id="nombreGastoNoRFC"
                    label="Razón social"
                    variant="outlined"
                    disabled={accionAG === 2}
                    value={nombreGastoNoRFC}
                    inputProps={{
                      maxLength: 100,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 1);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 1);
                      setNombreGastoNoRFC(e.target.value);
                    }}
                  />
                </Grid>
              </Fragment>
            )}
            {accionAG === 1 &&
            RADatos.importe > limiteImporteGasto &&
            limiteImporteGasto !== 0 ? (
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  label="Concepto Del Requerimiento"
                  type="text"
                  value={conceptoRequerimientoGasto}
                  onChange={(e) => {
                    setConceptoRequerimientoGasto(e.target.value);
                  }}
                >
                  <option value="0">Selecciona un concepto</option>
                  {getConceptosRequerimientoGasto()}
                </TextField>
              </Grid>
            ) : null}
            {requerimiento.length > 0 ? (
              requerimiento[0].idReq !== idRequerimiento ? (
                <Fragment>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Requerimiento al que pertenece
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <Grid container spacing={1} style={{ padding: "10px" }}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Fecha: </strong>
                            {requerimiento[0].fecha_req}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Importe: </strong>
                            {requerimiento[0].importe_estimado}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Status: </strong>
                            {requerimiento[0].estado_documento === 1
                              ? "Pendiente"
                              : requerimiento[0].estado_documento === 2
                              ? "Cancelado"
                              : requerimiento[0].estado_documento === 3
                              ? "Autorizado"
                              : requerimiento[0].estado_documento === 4
                              ? "Surtido"
                              : requerimiento[0].estado_documento === 5
                              ? "Surtido Parcial"
                              : requerimiento[0].estado_documento === 7
                              ? "No autorizado"
                              : ""}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Sucursal: </strong>
                            {requerimiento[0].sucursal}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Concepto: </strong>
                            {requerimiento[0].concepto}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Folio: </strong>
                            {requerimiento[0].folio}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Serie: </strong>
                            {requerimiento[0].serie}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle1">
                            <strong>Usuario: </strong>
                            {requerimiento[0].usuario}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                    {/* <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead style={{ background: "#FAFAFA" }}>
                          <TableRow>
                            <TableCell align="left">
                              <strong># Requerimiento</strong>
                            </TableCell>
                            <TableCell align="left">
                              <strong>Fecha</strong>
                            </TableCell>
                            <TableCell align="left">
                              <strong>Importe</strong>
                            </TableCell>
                            <TableCell align="left">
                              <strong>Status</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover>
                            <TableCell align="left">
                              {requerimiento[0].idReq}
                            </TableCell>
                            <TableCell align="left">
                              {requerimiento[0].fecha_req}
                            </TableCell>
                            <TableCell align="left">
                              {requerimiento[0].importe_estimado}
                            </TableCell>
                            <TableCell align="left">
                              {requerimiento[0].estado_documento === 1
                                ? "Pendiente"
                                : requerimiento[0].estado_documento === 2
                                ? "Cancelado"
                                : requerimiento[0].estado_documento === 3
                                ? "Autorizado"
                                : requerimiento[0].estado_documento === 4
                                ? "Surtido"
                                : requerimiento[0].estado_documento === 5
                                ? "Surtido Parcial"
                                : requerimiento[0].estado_documento === 7
                                ? "No autorizado"
                                : ""}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer> */}
                  </Grid>
                </Fragment>
              ) : (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    <strong>Gasto sin necesidad de autorización</strong>
                  </Typography>
                </Grid>
              )
            ) : null}
          </Grid>
        </Grid>
      )}
      <Grid item xs={12} style={{ marginTop: "15px" }}>
        <Grid container justify="center" spacing={5}>
          <Grid item xs={12} md={6}>
            <Grid container justify="center" spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6">Documentos Principales</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={12} lg={10}>
                <TextField
                  className={classes.textFields}
                  variant="outlined"
                  id="documentosPrincipales"
                  type="file"
                  inputProps={{
                    multiple: true,
                  }}
                  margin="normal"
                  onChange={(e) => {
                    setArchivosPrincipal(e.target.files);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                lg={2}
                style={{ alignSelf: "center" }}
              >
                <Button
                  className={classes.formButtons}
                  color="secondary"
                  variant="contained"
                  disabled={accionAG !== 2 || permisosSubmenu < 3 || statusEmpresa !== 1}
                  onClick={() => {
                    eliminarDocumentoPrincipal();
                  }}
                >
                  Eliminar
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  border: "solid black 1px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <List>
                  {documentosGuardados ? getDocumentosGuardados(1) : null}
                </List>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container justify="center" spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6">Documentos Accesorios</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={12} lg={10}>
                <TextField
                  className={classes.textFields}
                  variant="outlined"
                  id="documentosAccesorios"
                  type="file"
                  inputProps={{
                    multiple: true,
                  }}
                  margin="normal"
                  onChange={(e) => {
                    setArchivosSecundario(e.target.files);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                lg={2}
                style={{ alignSelf: "center" }}
              >
                <Button
                  className={classes.formButtons}
                  color="secondary"
                  variant="contained"
                  disabled={accionAG !== 2 || permisosSubmenu < 3 || statusEmpresa !== 1}
                  onClick={() => {
                    eliminarDocumentoSecundario();
                  }}
                >
                  Eliminar
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  border: "solid black 1px",
                  padding: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <List>
                  {documentosGuardados ? getDocumentosGuardados(2) : null}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
            window.open(rutaDocumento);
          }}
        >
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            window.open(`${rutaDocumento}/download`);
          }}
        >
          <ListItemText primary="Descargar" />
        </MenuItem>
      </StyledMenu>
      <Dialog
        onClose={handleCloseMenuReenviarNotificacion}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuReenviarNotificacion}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">
          Reenviar Notificación
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell>
                    <strong>Usuario</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Notificaciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accionAG === 2 ? getUsuariosNotificacion() : null}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="default"
            onClick={() => {
              handleCloseMenuReenviarNotificacion();
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            disabled={statusEmpresa !== 1}
            color="primary"
            onClick={() => {
              reenviarNotificacionUsuarios();
              //handleCloseMenuReenviarNotificacion();
            }}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
