import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Grid,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Tooltip,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  TableSortLabel,
  TablePagination,
  /* CardActionArea, */
  Collapse,
  Box,
  Chip,
  Avatar,
  /* ListSubheader, */
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FixedSizeList } from "react-window";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  FindInPage as FindInPageIcon,
  GetApp as GetAppIcon,
  NewReleases as NewReleasesIcon,
  LocalAtm as LocalAtmIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
  ClearAll as ClearAllIcon,
  Email as EmailIcon,
  Drafts as DraftsIcon,
  Send as SendIcon,
  /* FileCopy as FileCopyIcon, */
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PersonAdd as PersonAddIcon,
  /* ListAlt as ListAltIcon, */
  //AddCircle as AddCircleIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import { number_format } from "../../helpers/funciones";
import NumberFormat from "react-number-format";
import moment from "moment";
import swal from "sweetalert";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: "10px",
    height: "100%",
    width: "100%",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
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
  textFields: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  paper: {
    width: "100%",
  },
  table: {
    overflow: "auto",
  },
  animatedItem: {
    animation: `$alertaEfecto 1000ms infinite ${theme.transitions.easing.easeInOut}`,
  },
  "@keyframes alertaEfecto": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
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
}));

/* function createData(proveedor, v4, v3, v2, v1, porVencer, totalResultado) {
  return { proveedor, v4, v3, v2, v1, porVencer, totalResultado };
}

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
    id: "proveedor",
    align: "center",
    sortHeadCell: true,
    disablePadding: true,
    label: "Proveedor",
  },
  {
    id: "v4",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "V4 +45",
  },
  {
    id: "v3",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "V3 30-45",
  },
  {
    id: "v2",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "V2 15-30",
  },
  {
    id: "v1",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "V1 01-15",
  },
  {
    id: "porVencer",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Por Vencer",
  },
  {
    id: "totalResultado",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Total Resultado",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ background: "#FAFAFA" }}>
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
                <strong>{headCell.label}</strong>
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
} */

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

/* function createDataPagosHechos(
  idPago,
  linkLayout,
  layout,
  importe,
  bancoOrigen,
  bancoDestino,
  pagos,
  correos
) {
  return {
    idPago,
    linkLayout,
    layout,
    importe,
    bancoOrigen,
    bancoDestino,
    pagos,
    correos,
  };
} */

function createDataTablaPorDocumento(
  id,
  serieFolio,
  proveedor,
  sucursal,
  fechaDoc,
  fechaVen,
  tipo,
  pendiente,
  rfc,
  idMoneda,
  importeOriginal,
  moneda,
  tipoCambio,
  rutaArchivo,
  nombreArchivo
) {
  return {
    id,
    serieFolio,
    proveedor,
    sucursal,
    fechaDoc,
    fechaVen,
    tipo,
    pendiente,
    rfc,
    idMoneda,
    importeOriginal,
    moneda,
    tipoCambio,
    rutaArchivo,
    nombreArchivo,
  };
}

let filterRowsTablaPorDocumento = [];
/* let filterRowsPagosHechos = []; */

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

const headCellsTablaPorDocumento = [
  {
    id: "serieFolio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Serie-Folio",
    width: "auto",
  },
  {
    id: "proveedor",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Proveedor",
    width: "auto",
  },
  {
    id: "sucursal",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sucursal",
    width: "auto",
  },
  {
    id: "fechaDoc",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "FechaDoc",
    width: "auto",
  },
  {
    id: "fechaVen",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "FechaVen",
    width: "auto",
  },
  {
    id: "tipo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo",
    width: "auto",
  },
  {
    id: "pendiente",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Pendiente",
    width: "auto",
  },
  {
    id: "detalles",
    align: "center",
    sortHeadCell: false,
    disablePadding: false,
    label: "Detalles",
    width: "250px",
  },
  {
    id: "archivos",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: "Archivos",
    width: "auto",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ background: "#FAFAFA" }}>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
          >
            {headCell.sortHeadCell ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <strong>{headCell.label}</strong>
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              <strong>{headCell.label}</strong>
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

export default function FinanzasTesoreria(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const correoUsuario = usuarioDatos.correo;
  const passwordUsuario = usuarioDatos.password;
  const setLoading = props.setLoading;
  const empresaDatos = props.empresaDatos;
  const nombreEmpresa = empresaDatos.nombreempresa;
  const rfcEmpresa = empresaDatos.RFC;
  const idEmpresa = empresaDatos.idempresa;
  const usuarioStorage = empresaDatos.usuario_storage;
  const passwordStorage = empresaDatos.password_storage;
  const [showComponent, setShowComponent] = useState(0);
  //const [nombreSubmenu, setNombreSubmenu] = useState("");

  return (
    <div>
      <Card className={classes.card} style={{ marginBottom: "15px" }}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Finanzas y tesorería
            </Typography>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden !== 0 ? (
              <Grid
                item
                xs={12}
                md={5}
                key={index}
                style={{ marginBottom: "15px" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    //setNombreSubmenu(content.submenu.nombre_submenu);
                    setShowComponent(content.submenu.idsubmenu === 46 ? 1 : 2);
                  }}
                >
                  {content.submenu.nombre_submenu}
                </Button>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Card>
      <Card style={{ marginTop: "15px" }}>
        {showComponent === 1 ? (
          <FlujosEfectivo
            idUsuario={idUsuario}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idEmpresa={idEmpresa}
            nombreEmpresa={nombreEmpresa}
            usuarioStorage={usuarioStorage}
            passwordStorage={passwordStorage}
            setLoading={setLoading}
            setShowComponent={setShowComponent}
          />
        ) : null}
      </Card>
    </div>
  );
}

function FlujosEfectivo(props) {
  const classes = useStyles();
  const theme = useTheme();
  const xsDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const idUsuario = props.idUsuario;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idEmpresa = props.idEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const usuarioStorage = props.usuarioStorage;
  const passwordStorage = props.passwordStorage;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState([]);
  const [disponible, setDisponible] = useState(0.0);
  const [aplicado, setAplicado] = useState(0.0);
  const [restante, setRestante] = useState(disponible - aplicado);
  /* const [tipoCambio, setTipoCambio] = useState({
    valores: [],
  }); */
  const [activeStep, setActiveStep] = useState(0);
  const [openDialogPagosHechos, setOpenDialogPagosHechos] = useState(false);
  const [openDialogPagosPendientes, setOpenDialogPagosPendientes] = useState(
    false
  );
  const [showTable, setShowTable] = useState(3);
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [tituloFlujosFiltrados, setTituloFlujosFiltrados] = useState("");
  const [tipoTabla, setTipoTabla] = useState(1);
  /* const [rowsPagosHechos, setRowsPagosHechos] = useState([]); */
  //const [nuevoDestinatario, setNuevoDestinatario] = useState("");
  const [
    instruccionesPagoProveedores,
    setInstruccionesPagoProveedores,
  ] = useState({
    ids: [],
    proveedores: [],
    importes: [],
    rfcs: [],
    pagos: [],
    importesOriginales: [],
    monedas: [],
    tiposCambio: [],
    pagosOriginales: [],
    correos: [],
    cuentasOrigen: [],
    cuentasDestino: [],
  });
  const [instrucciones, setInstrucciones] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    importes: [],
    idsCuentasOrigen: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    valoresCuentasOrigen: [],
    bancosOrigen: [],
    sucursalesOrigen: [],
    idsCuentasDestino: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    valoresCuentasDestino: [],
    sucursalesDestino: [],
    fechas: [],
    llavesMatch: [],
    pagos: [],
    correos: [],
  });
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    valoresProveedores: [],
    importes: [],
    idsCuentasOrigen: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    valoresCuentasOrigen: [],
    bancosOrigen: [],
    sucursalesOrigen: [],
    idsCuentasDestino: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    valoresCuentasDestino: [],
    sucursalesDestino: [],
    fechas: [],
    llavesMatch: [],
    pagos: [],
    correos: [],
  });
  const [instruccionesCombinadas, setInstruccionesCombinadas] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    importes: [],
    idsCuentasOrigen: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    bancosOrigen: [],
    sucursalesOrigen: [],
    idsCuentasDestino: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    sucursalesDestino: [],
    fechas: [],
    llavesMatch: [],
    pagos: [],
    correos: [],
  });
  const [informacionBancos, setInformacionBancos] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    importes: [],
    idsCuentasOrigen: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    bancosOrigen: [],
    sucursalesOrigen: [],
    idsCuentasDestino: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    sucursalesDestino: [],
    fechas: [],
    llavesMatch: [],
    tiposLayouts: [],
    pagos: [],
    importesPorPagos: [],
    idsFlwPorPago: [],
    combinacionesBancos: [],
    idsLayouts: [],
    nombresLayouts: [],
    linksLayouts: [],
  });
  const [correosProveedores, setCorreosProveedores] = useState({
    correo: [],
    enviar: [],
    obligatorio: [],
  });
  const [cuentasOrigen, setCuentasOrigen] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresPrioritarios, setProveedoresPrioritarios] = useState([]);
  const [proveedoresNoPrioritarios, setProveedoresNoPrioritarios] = useState(
    []
  );
  const [cuentasDestino, setCuentasDestino] = useState([]);
  const [proveedorAutocomplete, setProveedorAutocomplete] = useState("");
  const [openPrioritariosDialog, setOpenPrioritariosDialog] = useState(false);
  const [
    validacionDialogProveedoresPrioritarios,
    setValidacionDialogProveedoresPrioritarios,
  ] = useState(false);
  const [
    filtroApiTraerFlujosEfectivo,
    setFiltroApiTraerFlujosEfectivo,
  ] = useState(1);
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosAdicionalesPendientes, setPagosAdicionalesPendientes] = useState(
    []
  );
  const [pagosHechos, setPagosHechos] = useState([]);
  const [totalPendientes, setTotalPendientes] = useState(0.0);
  const [idsPagosPendientesFlw, setIdsPagosPendientesFlw] = useState([]);
  const [idsPagosPendientesDet, setIdsPagosPendientesDet] = useState([]);
  const [
    idsPagosAdicionalesPendientes,
    setIdsPagosAdicionalesPendientes,
  ] = useState([]);
  const [
    validacionEjecucionGetPagosApi,
    setValidacionEjecucionGetPagosApi,
  ] = useState(true);
  const [
    validacionMensajeFinalizado,
    setValidacionMensajeFinalizado,
  ] = useState(false);
  const [
    pagosPendientesSeleccionados,
    setPagosPendientesSeleccionados,
  ] = useState([]);
  const [
    pagosAdicionalesPendientesSeleccionados,
    setPagosAdicionalesPendientesSeleccionados,
  ] = useState([]);

  const [openPagosHechosLayouts, setOpenPagosHechosLayous] = useState(-1);
  const [openPagosHechosDocumentos, setOpenPagosHechosDocumentos] = useState(
    -1
  );
  const [openPagosHechosCorreos, setOpenPagosHechosCorreos] = useState(-1);
  //const [validacionOpenPagos, setValidacionOpenPagos] = useState(-1);
  /* const [validacionOpenDocumentos, setValidacionOpenDocumentos] = useState(-1);
  const [validacionOpenCorreos, setValidacionOpenCorreos] = useState(-1);
  const [validacionOpenNuevoDestinatario, setValidacionOpenNuevoDestinatario] = useState(-1); */
  const [linkDescargaLayouts, setLinkDescargaLayouts] = useState("");
  /* const [layoutsExistentes, setLayoutsExistentes] = useState([]); */
  const [
    idPagosAdicionalesExistentes,
    setIdPagosAdicionalesExistentes,
  ] = useState([]);
  const tiposPago = {
    valores: [1, 2, 3, 4],
    tipos: [
      "Pago a proveedor",
      "Anticipo a proveedores",
      "Pago a prestamos a acreedores",
      "Entrega de prestamos a deudores",
    ],
  };
  const steps = [
    "1. Indicar el Efectivo Disponible y Aplicación  de Pagos",
    "2. Completar instrucciones de Pago",
    "3. Adicionar instrucciones de Pago sin CxP previa",
    "4. Generacion de Layout para Portales Bancarios",
  ];
  const [
    {
      data: getCuentasPropiasData,
      loading: getCuentasPropiasLoading,
      error: getCuentasPropiasError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getCuentasPropias`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getCuentasClientesProveedoresData,
      loading: getCuentasClientesProveedoresLoading,
      error: getCuentasClientesProveedoresError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getCuentasClientesProveedores`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: traerProveedoresFiltroData,
      loading: traerProveedoresFiltroLoading,
      error: traerProveedoresFiltroError,
    },
    executeTraerProveedoresFiltro,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerProveedoresFiltro`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: getFlwPagosData,
      loading: getFlwPagosLoading,
      error: getFlwPagosError,
    },
    executeGetFlwPagos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getFlwPagos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        Layout: 0,
        IdUsuario: idUsuario,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: generarLayoutsData,
      loading: generarLayoutsLoading,
      error: generarLayoutsError,
    },
    executeGenerarLayouts,
  ] = useAxios(
    {
      url: API_BASE_URL + `/generarLayouts`,
      method: "POST",
      /* data: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        idusuario: idUsuario,
        usuario_storage: usuarioStorage,
        password_storage: passwordStorage,
        idsbancosorigen: [10, 9],
        tipolayout: [1, 2],
      }, */
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: cambiarEstatusLayoutFlwPagosData,
      loading: cambiarEstatusLayoutFlwPagosLoading,
      error: cambiarEstatusLayoutFlwPagosError,
    },
    executeCambiarEstatusLayoutFlwPagos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarEstatusLayoutFlwPagos`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarFlwPagosData,
      loading: guardarFlwPagosLoading,
      error: guardarFlwPagosError,
    },
    executeGuardarFlwPagos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarFlwPagos`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: eliminarFlwPagosData,
      loading: eliminarFlwPagosLoading,
      error: eliminarFlwPagosError,
    },
    executeEliminarFlwPagos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarFlwPagos`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: reenviarCorreoLayoutData,
      loading: reenviarCorreoLayoutLoading,
      error: reenviarCorreoLayoutError,
    },
    executeReenviarCorreoLayout,
  ] = useAxios(
    {
      url: API_BASE_URL + `/reenviarCorreoLayout`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getCuentasPropiasData) {
        if (getCuentasPropiasData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getCuentasPropiasData.error),
            "warning"
          );
        } else {
          setCuentasOrigen(getCuentasPropiasData.cuentas);
        }
      }
    }

    checkData();
  }, [getCuentasPropiasData]);

  useEffect(() => {
    function checkData() {
      if (getCuentasClientesProveedoresData) {
        if (getCuentasClientesProveedoresData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getCuentasClientesProveedoresData.error),
            "warning"
          );
        } else {
          setCuentasDestino(getCuentasClientesProveedoresData.cuentas);
        }
      }
    }

    checkData();
  }, [getCuentasClientesProveedoresData]);

  useEffect(() => {
    function checkData() {
      if (traerProveedoresFiltroData) {
        if (traerProveedoresFiltroData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerProveedoresFiltroData.error),
            "warning"
          );
        } else {
          setProveedores(traerProveedoresFiltroData.proveedores);
          setProveedoresPrioritarios(
            traerProveedoresFiltroData.proveedores.filter(
              (proveedor) => proveedor.Prioridad === 1
            )
          );
          setProveedoresNoPrioritarios(
            traerProveedoresFiltroData.proveedores.filter(
              (proveedor) => proveedor.Prioridad === 0
            )
          );
        }
      }
    }

    checkData();
  }, [traerProveedoresFiltroData]);

  useEffect(() => {
    if (validacionDialogProveedoresPrioritarios) {
      setOpenPrioritariosDialog(true);
      setValidacionDialogProveedoresPrioritarios(false);
    }
  }, [validacionDialogProveedoresPrioritarios]);

  useEffect(() => {
    function checkData() {
      if (getFlwPagosData) {
        if (getFlwPagosData.error !== 0) {
          swal("Error", dataBaseErrores(getFlwPagosData.error), "warning");
        } else {
          let nuevosPagosPendientes = [];
          let nuevosPagosAdicionalesPendientes = [];
          let nuevosPagosHechos = [];
          let nuevoTotalPendientes = 0.0;
          /* nuevosPagosPendientes = getFlwPagosData.pagospendientes.filter(
            (pagoPendiente) =>
              documentosSeleccionados.indexOf(pagoPendiente.IdFlw) === -1
          ); */
          for (let x = 0; x < getFlwPagosData.pagospendientes.length; x++) {
            if (getFlwPagosData.pagospendientes[x].Layout === 0) {
              nuevoTotalPendientes =
                nuevoTotalPendientes +
                parseFloat(getFlwPagosData.pagospendientes[x].Importe);
              if (getFlwPagosData.pagospendientes[x].Detalles) {
                for (
                  let y = 0;
                  y < getFlwPagosData.pagospendientes[x].Detalles.length;
                  y++
                ) {
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].idCuentaOrigen =
                    getFlwPagosData.pagospendientes[x].IdCuentaOrigen;
                  getFlwPagosData.pagospendientes[x].Detalles[y].idBancoOrigen =
                    getFlwPagosData.pagospendientes[x].idBancoOrigen;
                  getFlwPagosData.pagospendientes[x].Detalles[y].cuentaOrigen =
                    getFlwPagosData.pagospendientes[x].cuentaOrigen;
                  getFlwPagosData.pagospendientes[x].Detalles[y].bancoOrigen =
                    getFlwPagosData.pagospendientes[x].bancoOrigen;
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].sucursalOrigen =
                    getFlwPagosData.pagospendientes[x].sucursalOrigen;
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].idCuentaDestino =
                    getFlwPagosData.pagospendientes[x].IdCuentaDestino;
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].idBancoDestino =
                    getFlwPagosData.pagospendientes[x].idBancoDestino;
                  getFlwPagosData.pagospendientes[x].Detalles[y].cuentaDestino =
                    getFlwPagosData.pagospendientes[x].cuentaDestino;
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].sucursalDestino =
                    getFlwPagosData.pagospendientes[x].sucursalDestino;
                  getFlwPagosData.pagospendientes[x].Detalles[y].fechapagodet =
                    getFlwPagosData.pagospendientes[x].Fecha;
                  getFlwPagosData.pagospendientes[x].Detalles[
                    y
                  ].tipoDocumento = 1;
                  nuevosPagosPendientes.push(
                    getFlwPagosData.pagospendientes[x].Detalles[y]
                  );
                }
              } else {
                nuevosPagosAdicionalesPendientes.push(
                  getFlwPagosData.pagospendientes[x]
                );
              }
            } else {
              nuevosPagosHechos.push(getFlwPagosData.pagospendientes[x]);
            }
          }
          setPagosPendientes(nuevosPagosPendientes);
          setPagosAdicionalesPendientes(nuevosPagosAdicionalesPendientes);
          //setPagosHechos(nuevosPagosHechos);
          if (getFlwPagosData.layouts.length === 0) {
            setOpenDialogPagosHechos(false);
            setValidacionMensajeFinalizado(false);
            setOpenPagosHechosLayous(-1);
            setOpenPagosHechosDocumentos(-1);
            setOpenPagosHechosCorreos(-1);
          }
          setPagosHechos(getFlwPagosData.layouts);
          setTotalPendientes(nuevoTotalPendientes);
          /* setLayoutsExistentes(getFlwPagosData.layoutsexistentes); */

          /* filterRowsPagosHechos = [];
          for (let x = 0; x < nuevosPagosHechos.length; x++) {
            filterRowsPagosHechos.push(
              createDataPagosHechos(
                nuevosPagosHechos[x].id,
                nuevosPagosHechos[x].Layouts[0].LinkLayout,
                nuevosPagosHechos[x].Layouts[0].NombreLayout,
                nuevosPagosHechos[x].Importe,
                nuevosPagosHechos[x].cuentaOrigen,
                nuevosPagosHechos[x].cuentaDestino,
                [
                  {
                    fecha: nuevosPagosHechos[x].Fecha,
                    proveedor: nuevosPagosHechos[x].Proveedor,
                    llaveMatch: nuevosPagosHechos[x].LlaveMatch,
                    documentos: nuevosPagosHechos[x].Detalles,
                  },
                ],
                nuevosPagosHechos[x].Correos
              )
            );
          }
          setRowsPagosHechos(filterRowsPagosHechos); */
        }
      }
    }

    checkData();
  }, [getFlwPagosData, documentosSeleccionados]);

  useEffect(() => {
    function checkData() {
      if (generarLayoutsData) {
        if (generarLayoutsData.error !== 0) {
          swal("Error", dataBaseErrores(generarLayoutsData.error), "warning");
        } else {
          //console.log(generarLayoutsData);
          window.open(generarLayoutsData.link + "/download");
        }
      }
    }

    checkData();
  }, [generarLayoutsData]);

  useEffect(() => {
    async function checkData() {
      if (cambiarEstatusLayoutFlwPagosData) {
        if (cambiarEstatusLayoutFlwPagosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarEstatusLayoutFlwPagosData.error),
            "warning"
          );
        } else {
          /* console.log(cambiarEstatusLayoutFlwPagosData.link);
          console.log(linkDescargaLayouts); */
          if (
            validacionMensajeFinalizado &&
            cambiarEstatusLayoutFlwPagosData.link !== linkDescargaLayouts
          ) {
            setActiveStep(0);
            setShowTable(3);
            setTipoTabla(1);

            setInstruccionesPagoProveedores({
              ids: [],
              proveedores: [],
              importes: [],
              rfcs: [],
              pagos: [],
              importesOriginales: [],
              monedas: [],
              tiposCambio: [],
              pagosOriginales: [],
              correos: [],
              cuentasOrigen: [],
              cuentasDestino: [],
            });
            setInstrucciones({
              ids: [],
              tipos: [],
              proveedores: [],
              rfcProveedores: [],
              importes: [],
              idsCuentasOrigen: [],
              idsBancosOrigen: [],
              cuentasOrigen: [],
              valoresCuentasOrigen: [],
              bancosOrigen: [],
              sucursalesOrigen: [],
              idsCuentasDestino: [],
              idsBancosDestino: [],
              cuentasDestino: [],
              valoresCuentasDestino: [],
              sucursalesDestino: [],
              fechas: [],
              llavesMatch: [],
              pagos: [],
              correos: [],
            });
            setInstruccionesAdicionales({
              ids: [],
              tipos: [],
              proveedores: [],
              rfcProveedores: [],
              valoresProveedores: [],
              importes: [],
              idsCuentasOrigen: [],
              idsBancosOrigen: [],
              cuentasOrigen: [],
              valoresCuentasOrigen: [],
              bancosOrigen: [],
              sucursalesOrigen: [],
              idsCuentasDestino: [],
              idsBancosDestino: [],
              cuentasDestino: [],
              valoresCuentasDestino: [],
              sucursalesDestino: [],
              fechas: [],
              llavesMatch: [],
              pagos: [],
              correos: [],
            });
            setInstruccionesCombinadas({
              ids: [],
              tipos: [],
              proveedores: [],
              rfcProveedores: [],
              importes: [],
              idsCuentasOrigen: [],
              idsBancosOrigen: [],
              cuentasOrigen: [],
              bancosOrigen: [],
              sucursalesOrigen: [],
              idsCuentasDestino: [],
              idsBancosDestino: [],
              cuentasDestino: [],
              sucursalesDestino: [],
              fechas: [],
              llavesMatch: [],
              pagos: [],
              correos: [],
            });
            setInformacionBancos({
              ids: [],
              tipos: [],
              proveedores: [],
              rfcProveedores: [],
              importes: [],
              idsCuentasOrigen: [],
              idsBancosOrigen: [],
              cuentasOrigen: [],
              bancosOrigen: [],
              sucursalesOrigen: [],
              idsCuentasDestino: [],
              idsBancosDestino: [],
              cuentasDestino: [],
              sucursalesDestino: [],
              fechas: [],
              llavesMatch: [],
              tiposLayouts: [],
              pagos: [],
              importesPorPagos: [],
              idsFlwPorPago: [],
              combinacionesBancos: [],
              idsLayouts: [],
              nombresLayouts: [],
              linksLayouts: [],
            });
            setDisponible(0.0);
            setAplicado(0.0);
            setRestante(0.0);
            setDocumentosSeleccionados([]);
            await executeGetFlwPagos();
            swal(
              "Proceso Finalizado",
              "Proceso finalizado con éxito",
              "success"
            );

            /* for(let x=0 ; x<cambiarEstatusLayoutFlwPagosData.LinksLayouts.length ; x++) {
              window.open(cambiarEstatusLayoutFlwPagosData.LinksLayouts[x] + "/download");
            } */

            setValidacionMensajeFinalizado(false);
            setValidacionEjecucionGetPagosApi(false);
            setOpenDialogPagosHechos(true);
            window.open(cambiarEstatusLayoutFlwPagosData.link + "/download");
            setLinkDescargaLayouts(cambiarEstatusLayoutFlwPagosData.link);
          }
        }
      }
    }

    checkData();
  }, [
    cambiarEstatusLayoutFlwPagosData,
    executeGetFlwPagos,
    validacionMensajeFinalizado,
    linkDescargaLayouts,
  ]);

  /* useEffect(() => {
    if(linkDescargaLayouts !== "") {
      console.log(linkDescargaLayouts);
      window.open(linkDescargaLayouts);
      setOpenDialogPagosHechos(true);
      setLinkDescargaLayouts("");
    }
  }, [linkDescargaLayouts]); */

  useEffect(() => {
    function checkData() {
      if (guardarFlwPagosData) {
        if (guardarFlwPagosData.error !== 0) {
          swal("Error", dataBaseErrores(guardarFlwPagosData.error), "warning");
        } else {
          executeGetFlwPagos();
          if (guardarFlwPagosData.idPago) {
            setIdPagosAdicionalesExistentes(guardarFlwPagosData.idPago);
          }
        }
      }
    }

    checkData();
  }, [guardarFlwPagosData, executeGetFlwPagos]);

  useEffect(() => {
    function checkData() {
      if (eliminarFlwPagosData) {
        if (eliminarFlwPagosData.error !== 0) {
          swal("Error", dataBaseErrores(eliminarFlwPagosData.error), "warning");
        } else {
          executeGetFlwPagos();
          setIdsPagosPendientesDet([]);
          setIdsPagosPendientesFlw([]);
          setIdsPagosAdicionalesPendientes([]);
          setPagosPendientesSeleccionados([]);
          setPagosAdicionalesPendientesSeleccionados([]);
        }
      }
    }

    checkData();
  }, [eliminarFlwPagosData, executeGetFlwPagos]);

  useEffect(() => {
    if (
      (pagosPendientes.length > 0 || pagosAdicionalesPendientes.length > 0) &&
      validacionEjecucionGetPagosApi
    ) {
      setOpenDialogPagosPendientes(true);
      setValidacionEjecucionGetPagosApi(false);
    }
  }, [
    pagosPendientes,
    pagosAdicionalesPendientes,
    validacionEjecucionGetPagosApi,
  ]);

  useEffect(() => {
    async function checkData() {
      if (reenviarCorreoLayoutData) {
        if (reenviarCorreoLayoutData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(reenviarCorreoLayoutData.error),
            "warning"
          );
        } else {
          await executeGetFlwPagos();
          swal("Correo Enviado", "Correo enviado con éxito", "success");
        }
      }
    }

    checkData();
  }, [reenviarCorreoLayoutData, executeGetFlwPagos]);

  /* console.log(validacionEjecucionGetPagosApi); */

  if (
    getCuentasPropiasLoading ||
    getCuentasClientesProveedoresLoading ||
    traerProveedoresFiltroLoading ||
    getFlwPagosLoading ||
    generarLayoutsLoading ||
    cambiarEstatusLayoutFlwPagosLoading ||
    guardarFlwPagosLoading ||
    eliminarFlwPagosLoading ||
    reenviarCorreoLayoutLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getCuentasPropiasError ||
    getCuentasClientesProveedoresError ||
    traerProveedoresFiltroError ||
    getFlwPagosError ||
    generarLayoutsError ||
    cambiarEstatusLayoutFlwPagosError ||
    guardarFlwPagosError ||
    eliminarFlwPagosError ||
    reenviarCorreoLayoutError
  ) {
    return <ErrorQueryDB />;
  }

  const handleNext = () => {
    setValidacionEjecucionGetPagosApi(false);
    let validacionPaso2 = 0;
    let validacionPaso3 = 0;
    if (activeStep === 1) {
      for (let x = 0; x < instrucciones.proveedores.length; x++) {
        if (
          instrucciones.valoresCuentasOrigen[x] === "-1" ||
          instrucciones.valoresCuentasDestino[x] === "-1" ||
          instrucciones.fechas[x] === ""
        ) {
          validacionPaso2++;
          break;
        }
      }
    } else if (activeStep === 2) {
      let ids = instrucciones.ids.concat(instruccionesAdicionales.ids);
      let tipos = instrucciones.tipos.concat(instruccionesAdicionales.tipos);
      let proveedores = instrucciones.proveedores.concat(
        instruccionesAdicionales.proveedores
      );
      let rfcProveedores = instrucciones.rfcProveedores.concat(
        instruccionesAdicionales.rfcProveedores
      );
      let importes = instrucciones.importes.concat(
        instruccionesAdicionales.importes
      );
      let idsCuentasOrigen = instrucciones.idsCuentasOrigen.concat(
        instruccionesAdicionales.idsCuentasOrigen
      ); // se modificara esta parte cuando se agregue la funcionalidad del paso 3
      let idsBancosOrigen = instrucciones.idsBancosOrigen.concat(
        instruccionesAdicionales.idsBancosOrigen
      );
      let cuentasOrigen = instrucciones.cuentasOrigen.concat(
        instruccionesAdicionales.cuentasOrigen
      );
      let bancosOrigen = instrucciones.bancosOrigen.concat(
        instruccionesAdicionales.bancosOrigen
      );
      let sucursalesOrigen = instrucciones.sucursalesOrigen.concat(
        instruccionesAdicionales.sucursalesOrigen
      );
      let idsCuentasDestino = instrucciones.idsCuentasDestino.concat(
        instruccionesAdicionales.idsCuentasDestino
      ); // se modificara esta parte cuando se agregue la funcionalidad del paso 3
      let idsBancosDestino = instrucciones.idsBancosDestino.concat(
        instruccionesAdicionales.idsBancosDestino
      );
      let cuentasDestino = instrucciones.cuentasDestino.concat(
        instruccionesAdicionales.cuentasDestino
      );
      let sucursalesDestino = instrucciones.sucursalesDestino.concat(
        instruccionesAdicionales.sucursalesDestino
      );
      let fechas = instrucciones.fechas.concat(instruccionesAdicionales.fechas);
      let llavesMatch = instrucciones.llavesMatch.concat(
        instruccionesAdicionales.llavesMatch
      );
      let pagos = instrucciones.pagos.concat(instruccionesAdicionales.pagos);
      setInstruccionesCombinadas({
        ids: ids,
        tipos: tipos,
        proveedores: proveedores,
        rfcProveedores: rfcProveedores,
        importes: importes,
        idsCuentasOrigen: idsCuentasOrigen,
        idsBancosOrigen: idsBancosOrigen,
        cuentasOrigen: cuentasOrigen,
        bancosOrigen: bancosOrigen,
        sucursalesOrigen: sucursalesOrigen,
        idsCuentasDestino: idsCuentasDestino,
        idsBancosDestino: idsBancosDestino,
        cuentasDestino: cuentasDestino,
        sucursalesDestino: sucursalesDestino,
        fechas: fechas,
        llavesMatch: llavesMatch,
        pagos: pagos,
      });

      if (instruccionesAdicionales.ids.length !== 0) {
        for (let x = 0; x < instruccionesAdicionales.proveedores.length; x++) {
          if (
            instruccionesAdicionales.valoresProveedores[x] === "-1" ||
            instruccionesAdicionales.valoresCuentasOrigen[x] === "-1" ||
            instruccionesAdicionales.valoresCuentasDestino[x] === "-1" ||
            instruccionesAdicionales.fechas[x] === "" ||
            instruccionesAdicionales.importes[x] === "" ||
            parseFloat(instruccionesAdicionales.importes[x]) === "0"
          ) {
            validacionPaso3++;
            break;
          }
        }
      } else if (instrucciones.ids.length === 0) {
        validacionPaso3++;
      }
    }

    if (activeStep === 0 && documentosSeleccionados.length === 0) {
      swal(
        "No ha seleccionado ningún documento",
        "Seleccione al menos un documento. En caso de que no haya pagos a proveedores presione el botón SIN PAGOS A PROVEEDORES.",
        "warning"
      );
    } else if (activeStep === 1 && validacionPaso2 > 0) {
      swal(
        "Datos incompletos",
        "Debe de llenar todos los campos correctamente para poder continuar.",
        "warning"
      );
    } else if (activeStep === 2 && validacionPaso3 > 0) {
      swal(
        "Datos incompletos",
        "Debe de llenar todos los campos correctamente para poder continuar.",
        "warning"
      );
    } else if (activeStep === 3) {
      swal({
        text: "¿Está seguro de finalizar el proceso?",
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          let idsFlwsBancos = [];
          let idsFlwsBancosExtraidos = [];
          let tiposDocumentosBancos = [];
          let tiposDocumentosBancosExtraidos = [];
          //let existenciaLayout = [];
          for (let x = 0; x < informacionBancos.ids.length; x++) {
            let idsExtraidos = informacionBancos.ids[x].toString().split(",");
            idsFlwsBancosExtraidos = [];
            for (let y = 0; y < idsExtraidos.length; y++) {
              idsFlwsBancosExtraidos.push(parseInt(idsExtraidos[y]));
            }
            idsFlwsBancos.push(idsFlwsBancosExtraidos);
          }

          for (let x = 0; x < informacionBancos.tipos.length; x++) {
            let tiposDocumentosExtraidos = informacionBancos.tipos[x]
              .toString()
              .split("-$-");
            tiposDocumentosBancosExtraidos = [];
            for (let y = 0; y < tiposDocumentosExtraidos.length; y++) {
              tiposDocumentosBancosExtraidos.push(
                parseInt(tiposDocumentosExtraidos[y])
              );
            }
            tiposDocumentosBancos.push(tiposDocumentosBancosExtraidos);
          }

          /* console.log(instruccionesPagoProveedores);
          console.log(informacionBancos);
          console.log(layoutsExistentes);
          console.log(existenciaLayout);
          const posNoLayout = existenciaLayout.indexOf(false);
          console.log(posNoLayout); */

          /* if (existenciaLayout.indexOf(false) !== -1) {
            swal({
              text: `El banco de la cuenta ${
                informacionBancos.cuentasOrigen[posNoLayout]
              } no tiene un layout asignado para ${
                informacionBancos.combinacionesBancos[posNoLayout] === 1
                  ? "mismo banco"
                  : "otros bancos"
              }. Si continua se le asignara un layout genérico. ¿Desea continuar?`,
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {});
          } */

          const fechaHoraLayout = moment();
          const tiempoSumado = "01:30:00";
          fechaHoraLayout.add(moment.duration(tiempoSumado));
          setValidacionMensajeFinalizado(true);
          executeCambiarEstatusLayoutFlwPagos({
            data: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              nombreempresa: nombreEmpresa,
              idsubmenu: 46,
              IdsFlw: instruccionesPagoProveedores.ids,
              Importes: instruccionesPagoProveedores.pagos,
              PagosOriginales: instruccionesPagoProveedores.pagosOriginales,
              TiposCambio: instruccionesPagoProveedores.tiposCambio,
              Correos: instruccionesPagoProveedores.correos,
              CorreosPagosAdicionales: instruccionesAdicionales.correos,
              CuentasOrigen: instruccionesPagoProveedores.cuentasOrigen,
              CuentasDestino: instruccionesPagoProveedores.cuentasDestino,
              IdUsuario: idUsuario,
              IdEmpresa: idEmpresa,
              IdsCuentasOrigen: informacionBancos.idsCuentasOrigen,
              IdsCuentasDestino: informacionBancos.idsCuentasDestino,
              ProveedoresInfoBancos: informacionBancos.proveedores,
              IdsBancosOrigen: informacionBancos.idsBancosOrigen,
              TipoLayout: informacionBancos.tiposLayouts,
              CuentasBeneficiarios: informacionBancos.cuentasDestino,
              ImportesPagados: informacionBancos.pagos,
              idsFlwsBancos: idsFlwsBancos,
              ImportesPorPagos: informacionBancos.importesPorPagos,
              idsFlwPorPago: informacionBancos.idsFlwPorPago,
              rfcProveedores: informacionBancos.rfcProveedores,
              combinacionesBancos: informacionBancos.combinacionesBancos,
              sucursalesOrigen: informacionBancos.sucursalesOrigen,
              sucursalesDestino: informacionBancos.sucursalesDestino,
              TiposDocumentos: informacionBancos.tipos,
              TiposDocumentosBancos: tiposDocumentosBancos,
              FechaHoraLayout: fechaHoraLayout.format("DDMMYYHHmm"),
            },
          });
        }
      });
    } else {
      if (activeStep === 0) {
        executeGuardarFlwPagos({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: 46,
            forma: 1,
            paso: 1,
            IdsFlw: instruccionesPagoProveedores.ids,
            IdUsuario: idUsuario,
            Importes: instruccionesPagoProveedores.pagos,
            ImportesOriginales: instruccionesPagoProveedores.pagosOriginales,
            TiposCambio: instruccionesPagoProveedores.tiposCambio,
            LlaveMatch: "",
            Tipo: 1,
            RFCS: instruccionesPagoProveedores.rfcs,
            Proveedores: instruccionesPagoProveedores.proveedores,
          },
        });
        setShowTable(showTable === 1 || showTable === 2 ? 1 : 3);
      } else if (activeStep === 1 || activeStep === 2) {
        let idsFlw = [];
        let idsCuentasOrigen = [];
        let idsCuentasDestino = [];
        let fechas = [];
        /* let tipos = []; */
        for (let x = 0; x < instrucciones.ids.length; x++) {
          let idsExtraidos = instrucciones.ids[x].toString().split(",");
          for (let y = 0; y < idsExtraidos.length; y++) {
            idsFlw.push(parseInt(idsExtraidos[y]));
            idsCuentasOrigen.push(instrucciones.idsCuentasOrigen[x]);
            idsCuentasDestino.push(instrucciones.idsCuentasDestino[x]);
            fechas.push(instrucciones.fechas[x]);
            /* tipos.push(instrucciones.tipos[x]); */
          }
        }
        executeGuardarFlwPagos({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: 46,
            forma: 1,
            paso: activeStep + 1,
            IdUsuario: idUsuario,
            idsflw: idsFlw,
            idscuentasorigen: idsCuentasOrigen,
            idscuentasdestino: idsCuentasDestino,
            fechas: fechas,
            /* tipos: tipos, */
            fechasInstruccionesAdicionales: instruccionesAdicionales.fechas,
            importesInstruccionesAdicionales: instruccionesAdicionales.pagos,
            tiposInstruccionesAdicionales: instruccionesAdicionales.tipos,
            rfcsInstruccionesAdicionales:
              instruccionesAdicionales.rfcProveedores,
            proveedoresInstruccionesAdicionales:
              instruccionesAdicionales.proveedores,
            idsCuentasOrigenInstruccionesAdicionales:
              instruccionesAdicionales.idsCuentasOrigen,
            idsCuentasDestinoInstruccionesAdicionales:
              instruccionesAdicionales.idsCuentasDestino,
          },
        });
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleSinPagosProveedores = () => {
    setActiveStep(2);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Paso1
            idUsuario={idUsuario}
            correo={correoUsuario}
            password={passwordUsuario}
            setLoading={setLoading}
            rfc={rfcEmpresa}
            idEmpresa={idEmpresa}
            proveedoresPrioritarios={proveedoresPrioritarios}
            proveedoresNoPrioritarios={proveedoresNoPrioritarios}
            documentosSeleccionados={documentosSeleccionados}
            executeTraerProveedoresFiltro={executeTraerProveedoresFiltro}
            setDocumentosSeleccionados={setDocumentosSeleccionados}
            disponible={disponible}
            setDisponible={setDisponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            restante={restante}
            setRestante={setRestante}
            instrucciones={instrucciones}
            setInstrucciones={setInstrucciones}
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            setInstruccionesPagoProveedores={setInstruccionesPagoProveedores}
            openPrioritariosDialog={openPrioritariosDialog}
            setOpenPrioritariosDialog={setOpenPrioritariosDialog}
            setValidacionDialogProveedoresPrioritarios={
              setValidacionDialogProveedoresPrioritarios
            }
            filtroApiTraerFlujosEfectivo={filtroApiTraerFlujosEfectivo}
            setFiltroApiTraerFlujosEfectivo={setFiltroApiTraerFlujosEfectivo}
            executeGuardarFlwPagos={executeGuardarFlwPagos}
            showTable={showTable}
            setShowTable={setShowTable}
            flujosEfectivoFiltrados={flujosEfectivoFiltrados}
            setFlujosEfectivoFiltrados={setFlujosEfectivoFiltrados}
            totalEspecificos={totalEspecificos}
            setTotalEspecificos={setTotalEspecificos}
            tituloFlujosFiltrados={tituloFlujosFiltrados}
            setTituloFlujosFiltrados={setTituloFlujosFiltrados}
            /* tipoCambio={tipoCambio}
            setTipoCambio={setTipoCambio} */
            setValidacionEjecucionGetPagosApi={
              setValidacionEjecucionGetPagosApi
            }
            tipoTabla={tipoTabla}
            setTipoTabla={setTipoTabla}
            cuentasDestino={cuentasDestino}
            proveedores={proveedores}
          />
        );
      case 1:
        return (
          <Paso2
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            setInstruccionesPagoProveedores={setInstruccionesPagoProveedores}
            instrucciones={instrucciones}
            setInstrucciones={setInstrucciones}
            cuentasOrigen={cuentasOrigen}
            cuentasDestino={cuentasDestino}
            tiposPago={tiposPago}
          />
        );
      case 2:
        return (
          <Paso3
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            setInstruccionesPagoProveedores={setInstruccionesPagoProveedores}
            instrucciones={instrucciones}
            setInstrucciones={setInstrucciones}
            instruccionesAdicionales={instruccionesAdicionales}
            setInstruccionesAdicionales={setInstruccionesAdicionales}
            correo={correoUsuario}
            password={passwordUsuario}
            setLoading={setLoading}
            rfc={rfcEmpresa}
            proveedores={proveedores}
            setProveedores={setProveedores}
            cuentasOrigen={cuentasOrigen}
            cuentasDestino={cuentasDestino}
            setCuentasDestino={setCuentasDestino}
            disponible={disponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            /* restante={restante} */
            setRestante={setRestante}
            proveedorAutocomplete={proveedorAutocomplete}
            setProveedorAutocomplete={setProveedorAutocomplete}
            tiposPago={tiposPago}
            correosProveedores={correosProveedores}
            setCorreosProveedores={setCorreosProveedores}
          />
        );
      case 3:
        return (
          <Paso4
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            instruccionesCombinadas={instruccionesCombinadas}
            setInstruccionesCombinadas={setInstruccionesCombinadas}
            informacionBancos={informacionBancos}
            setInformacionBancos={setInformacionBancos}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idUsuario={idUsuario}
            usuarioStorage={usuarioStorage}
            passwordStorage={passwordStorage}
            executeGenerarLayouts={executeGenerarLayouts}
            setLoading={setLoading}
            tiposPago={tiposPago}
            idPagosAdicionalesExistentes={idPagosAdicionalesExistentes}
            instrucciones={instrucciones}
            instruccionesAdicionales={instruccionesAdicionales}
          />
        );
      default:
        return "Unknown stepIndex";
    }
  };

  /* const handleOpenDialogPagosPendientes = () => {
    setOpenDialogPagosPendientes(true);
  }; */

  const handleCloseDialogPagosPendientes = () => {
    setOpenDialogPagosPendientes(false);
    setIdsPagosPendientesFlw([]);
    setPagosPendientesSeleccionados([]);
    setPagosAdicionalesPendientesSeleccionados([]);
  };

  const handleCloseDialogPagosHechos = () => {
    setOpenDialogPagosHechos(false);
    setValidacionMensajeFinalizado(false);
    setOpenPagosHechosLayous(-1);
    setOpenPagosHechosDocumentos(-1);
    setOpenPagosHechosCorreos(-1);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newIdsSelecteds = pagosPendientes.map(
        (pagoPendiente) => pagoPendiente.IdPagoDet
      );
      const newIdsFlwSelecteds = pagosPendientes.map(
        (pagoPendiente) => pagoPendiente.id
      );
      const newIdsPagosAdicionalesSelecteds = pagosAdicionalesPendientes.map(
        (pagoAdicionalPendiente) => pagoAdicionalPendiente.id
      );
      setIdsPagosPendientesDet(newIdsSelecteds);
      setIdsPagosPendientesFlw(newIdsFlwSelecteds);
      setIdsPagosAdicionalesPendientes(newIdsPagosAdicionalesSelecteds);
      setPagosPendientesSeleccionados(pagosPendientes);
      setPagosAdicionalesPendientesSeleccionados(pagosAdicionalesPendientes);
      return;
    }
    setIdsPagosPendientesDet([]); //ids detalle
    setIdsPagosPendientesFlw([]); //ids flw
    setIdsPagosAdicionalesPendientes([]);
    setPagosPendientesSeleccionados([]); //todos los detalles de pago pendiente
    setPagosAdicionalesPendientesSeleccionados([]);
  };

  const handleClick = (event, pagoPendiente, tipo) => {
    if (tipo === 1) {
      const selectedIndex = idsPagosPendientesFlw.indexOf(pagoPendiente.id);
      let newIdsSelected = [];
      let newIdsFlwSelected = [];
      let newPagosPendientes = [];
      if (selectedIndex === -1) {
        newIdsSelected = newIdsSelected.concat(
          idsPagosPendientesDet,
          pagoPendiente.IdPagoDet
        );
        newIdsFlwSelected = newIdsFlwSelected.concat(
          idsPagosPendientesFlw,
          pagoPendiente.id
        );
        newPagosPendientes = newPagosPendientes.concat(
          pagosPendientesSeleccionados,
          pagoPendiente
        );
      } else if (selectedIndex === 0) {
        newIdsSelected = newIdsSelected.concat(idsPagosPendientesDet.slice(1));
        newIdsFlwSelected = newIdsFlwSelected.concat(
          idsPagosPendientesFlw.slice(1)
        );
        newPagosPendientes = newPagosPendientes.concat(
          pagosPendientesSeleccionados.slice(1)
        );
      } else if (selectedIndex === idsPagosPendientesFlw.length - 1) {
        newIdsSelected = newIdsSelected.concat(
          idsPagosPendientesDet.slice(0, -1)
        );
        newIdsFlwSelected = newIdsFlwSelected.concat(
          idsPagosPendientesFlw.slice(0, -1)
        );
        newPagosPendientes = newPagosPendientes.concat(
          pagosPendientesSeleccionados.slice(0, -1)
        );
      } else if (selectedIndex > 0) {
        newIdsSelected = newIdsSelected.concat(
          idsPagosPendientesDet.slice(0, selectedIndex),
          idsPagosPendientesDet.slice(selectedIndex + 1)
        );
        newIdsFlwSelected = newIdsFlwSelected.concat(
          idsPagosPendientesFlw.slice(0, selectedIndex),
          idsPagosPendientesFlw.slice(selectedIndex + 1)
        );
        newPagosPendientes = newPagosPendientes.concat(
          pagosPendientesSeleccionados.slice(0, selectedIndex),
          pagosPendientesSeleccionados.slice(selectedIndex + 1)
        );
      }
      setIdsPagosPendientesDet(newIdsSelected);
      setIdsPagosPendientesFlw(newIdsFlwSelected);
      setPagosPendientesSeleccionados(newPagosPendientes);
    } else {
      const selectedPagoAdicionalIndex = idsPagosAdicionalesPendientes.indexOf(
        pagoPendiente.id
      );
      let newIdsPagosAdicionalesSelected = [];
      let newPagosAdiconalesPendientes = [];
      if (selectedPagoAdicionalIndex === -1) {
        newIdsPagosAdicionalesSelected = newIdsPagosAdicionalesSelected.concat(
          idsPagosAdicionalesPendientes,
          pagoPendiente.id
        );
        newPagosAdiconalesPendientes = newPagosAdiconalesPendientes.concat(
          pagosAdicionalesPendientesSeleccionados,
          pagoPendiente
        );
      } else if (selectedPagoAdicionalIndex === 0) {
        newIdsPagosAdicionalesSelected = newIdsPagosAdicionalesSelected.concat(
          idsPagosAdicionalesPendientes.slice(1)
        );
        newPagosAdiconalesPendientes = newPagosAdiconalesPendientes.concat(
          pagosAdicionalesPendientesSeleccionados.slice(1)
        );
      } else if (
        selectedPagoAdicionalIndex ===
        idsPagosAdicionalesPendientes.length - 1
      ) {
        newIdsPagosAdicionalesSelected = newIdsPagosAdicionalesSelected.concat(
          idsPagosAdicionalesPendientes.slice(0, -1)
        );
        newPagosAdiconalesPendientes = newPagosAdiconalesPendientes.concat(
          pagosAdicionalesPendientesSeleccionados.slice(0, -1)
        );
      } else if (selectedPagoAdicionalIndex > 0) {
        newIdsPagosAdicionalesSelected = newIdsPagosAdicionalesSelected.concat(
          idsPagosAdicionalesPendientes.slice(0, selectedPagoAdicionalIndex),
          idsPagosAdicionalesPendientes.slice(selectedPagoAdicionalIndex + 1)
        );
        newPagosAdiconalesPendientes = newPagosAdiconalesPendientes.concat(
          pagosAdicionalesPendientesSeleccionados.slice(
            0,
            selectedPagoAdicionalIndex
          ),
          pagosAdicionalesPendientesSeleccionados.slice(
            selectedPagoAdicionalIndex + 1
          )
        );
      }
      setIdsPagosAdicionalesPendientes(newIdsPagosAdicionalesSelected);
      setPagosAdicionalesPendientesSeleccionados(newPagosAdiconalesPendientes);
    }
  };

  const PagosHechosLayouts = (props) => {
    const {
      layout,
      indexLayout,
      openPagosHechosLayouts,
      setOpenPagosHechosLayous,
    } = props;
    /* const [openPagos, setOpenPagos] = useState(false); */
    /* const [openDocumentos, setOpenDocumentos] = useState(false);
    const [openCorreos, setOpenCorreos] = useState(false);
    const [openNuevoDestinatario, setOpenNuevoDestinatario] = useState(false);
    const [nuevoDestinatario, setNuevoDestinatario] = useState(""); */
    const classes = useRowStyles();

    /* const clickOpenPagos = (indexLayout) => {
      setOpenPagos(!openPagos);
      setValidacionOpenPagos(indexLayout);
    }; */

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpenPagosHechosLayous(
                  indexLayout === openPagosHechosLayouts ? -1 : indexLayout
                );
                /* setOpenPagos(!openPagos); */
                /* clickOpenPagos(
                  indexLayout === validacionOpenPagos ? -1 : indexLayout
                ); */
              }}
            >
              {openPagosHechosLayouts === indexLayout /*  openPagos  */ ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {layout.NombreLayout}
          </TableCell>
          <TableCell align="right">
            {`$${number_format(layout.Importe, 2, ".", ",")}`}
          </TableCell>
          <TableCell align="right">{layout.CuentaOrigen}</TableCell>
          <TableCell align="right">{layout.BancoDestino}</TableCell>
          <TableCell align="center">
            <Tooltip title="Descargar Layout">
              <span>
                <IconButton
                  disabled={!layout.LinkLayout}
                  onClick={() => {
                    window.open(layout.LinkLayout + "/download");
                  }}
                >
                  <GetAppIcon
                    color={layout.LinkLayout ? "primary" : "disabled"}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={openPagosHechosLayouts === indexLayout /* openPagos */}
              timeout="auto"
              unmountOnExit
            >
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  <strong>Pagos</strong>
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <strong>Fecha</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Proveedor</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Importe</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Llave Match</strong>
                      </TableCell>
                      <TableCell align="center">
                        <SettingsIcon />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {layout.pagos.map((pago, indexPago) => (
                      <PagosHechosPagos
                        key={indexPago}
                        pago={pago}
                        indexPago={indexPago}
                        layout={layout}
                        openPagosHechosDocumentos={openPagosHechosDocumentos}
                        setOpenPagosHechosDocumentos={
                          setOpenPagosHechosDocumentos
                        }
                        openPagosHechosCorreos={openPagosHechosCorreos}
                        setOpenPagosHechosCorreos={setOpenPagosHechosCorreos}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const PagosHechosPagos = (props) => {
    const {
      pago,
      indexPago,
      openPagosHechosDocumentos,
      setOpenPagosHechosDocumentos,
      openPagosHechosCorreos,
      setOpenPagosHechosCorreos,
      layout,
    } = props;
    //const [openDocumentos, setOpenDocumentos] = useState(false);
    //const [openCorreos, setOpenCorreos] = useState(false);
    const [openNuevoDestinatario, setOpenNuevoDestinatario] = useState(false);
    const [nuevoDestinatario, setNuevoDestinatario] = useState("");
    const classes = useRowStyles();

    return (
      <Fragment key={indexPago}>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                /* setOpenDocumentos(!openDocumentos) */
                setOpenPagosHechosDocumentos(
                  openPagosHechosDocumentos === indexPago ? -1 : indexPago
                );
              }}
            >
              {
                /* openDocumentos */ openPagosHechosDocumentos === indexPago ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )
              }
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {pago.Fecha}
          </TableCell>
          <TableCell>{pago.Proveedor}</TableCell>
          <TableCell>{`$${number_format(
            pago.Importe,
            2,
            ".",
            ","
          )}`}</TableCell>
          <TableCell align="right">{pago.LlaveMatch}</TableCell>
          <TableCell align="center">
            <Tooltip title="Correos">
              <span>
                <IconButton
                  onClick={() => {
                    //setOpenCorreos(!openCorreos);
                    setOpenPagosHechosCorreos(
                      openPagosHechosCorreos === indexPago ? -1 : indexPago
                    );
                  }}
                >
                  {openPagosHechosCorreos === indexPago /* openCorreos */ ? (
                    <DraftsIcon color="primary" />
                  ) : (
                    <EmailIcon color="primary" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={/* openDocumentos */ openPagosHechosDocumentos === indexPago}
              timeout="auto"
              unmountOnExit
            >
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  <strong>
                    {pago.Tipo === 1 ? "Documentos" : "Pagos Sin CxP"}
                  </strong>
                </Typography>
                {pago.Tipo === 1 ? (
                  <Table size="small" aria-label="purchases">
                    <TableHead style={{ background: "#FAFAFA" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Serie-Folio</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Pagado</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Pendiente</strong>
                        </TableCell>
                        <TableCell align="center">
                          <SettingsIcon />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pago.documentos.map((documento, indexDocumento) => (
                        <PagosHechosDocumentos
                          key={indexDocumento}
                          documento={documento}
                          indexDocumento={indexDocumento}
                          layout={layout}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Table size="small" aria-label="purchases">
                    <TableHead style={{ background: "#FAFAFA" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Tipo</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Importe</strong>
                        </TableCell>
                        <TableCell align="center">
                          <SettingsIcon />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {tiposPago.tipos[pago.Tipo - 1]}
                        </TableCell>
                        <TableCell align="right">
                          {`$${number_format(pago.Importe, 2, ".", ",")}`}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Cancelar pago">
                            <IconButton
                              onClick={() => {
                                swal({
                                  text: "¿Está seguro de cancelar este pago?",
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    setShowTable(
                                      showTable === 1 || showTable === 2 ? 1 : 3
                                    );
                                    executeGuardarFlwPagos({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 2,
                                        IdUsuario: idUsuario,
                                        IdPago: pago.id,
                                        Tipo: pago.Tipo,
                                        IdEmpresa: idEmpresa,
                                      },
                                    });
                                  }
                                });
                              }}
                            >
                              <CancelIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={openPagosHechosCorreos === indexPago /* openCorreos */}
              timeout="auto"
              unmountOnExit
              exit={false}
            >
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  <strong>Correos</strong>
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Destinatarios: </strong>
                      </TableCell>
                      <TableCell>
                        {pago.correos.length > 0
                          ? pago.correos.map((correo, indexCorreo) => (
                              <PagosHechosCorreos
                                key={indexCorreo}
                                correo={correo}
                                indexCorreo={indexCorreo}
                                pago={pago}
                              />
                            ))
                          : "Sin Destinatarios"}
                        <span
                          style={{ marginLeft: "15px" }}
                          onClick={() => {
                            setOpenNuevoDestinatario(!openNuevoDestinatario);
                          }}
                        >
                          {openNuevoDestinatario ? (
                            <Button variant="contained" color="secondary">
                              Cancelar
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              style={{
                                background: "#4caf50",
                                color: "#ffffff",
                              }}
                            >
                              Enviar a nuevo destinatario
                            </Button>
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      style={{
                        display: openNuevoDestinatario ? "table-row" : "none",
                      }}
                    >
                      <TableCell>
                        <strong>Nuevo Destinatario:</strong>
                      </TableCell>
                      <TableCell>
                        <TextField
                          className={classes.textFields}
                          id={`nuevodestinatario`}
                          type="text"
                          margin="normal"
                          value={nuevoDestinatario}
                          inputProps={{
                            maxLength: 100,
                          }}
                          onKeyPress={(e) => {
                            keyValidation(e, 4);
                          }}
                          onChange={(e) => {
                            pasteValidation(e, 4);
                            setNuevoDestinatario(e.target.value);
                          }}
                        />
                        <Tooltip title="Enviar">
                          <IconButton
                            onClick={() => {
                              swal({
                                text:
                                  "¿Está seguro de enviar el correo a " +
                                  nuevoDestinatario.trim() +
                                  "?",
                                buttons: ["No", "Sí"],
                                dangerMode: true,
                              }).then((value) => {
                                if (value) {
                                  const titulo = "Pago de " + nombreEmpresa;
                                  const codigoMensaje =
                                    pago.correos.length > 0
                                      ? pago.correos[0].CodigoMensaje
                                      : 0;
                                  const cuentaOrigen = pago.cuentaOrigen;
                                  const cuentaDestino = pago.cuentaDestino;
                                  const proveedor = pago.Proveedor;
                                  const importePagado =
                                    "$" +
                                    number_format(pago.Importe, 2, ".", ",");
                                  executeReenviarCorreoLayout({
                                    data: {
                                      usuario: correoUsuario,
                                      pwd: passwordUsuario,
                                      rfc: rfcEmpresa,
                                      idsubmenu: 46,
                                      idPago: pago.id,
                                      titulo: titulo,
                                      codigoMensaje: codigoMensaje,
                                      cuentaOrigen: cuentaOrigen,
                                      cuentaDestino: cuentaDestino,
                                      proveedor: proveedor,
                                      importePagado: importePagado,
                                      correo: nuevoDestinatario.trim(),
                                      forma: 2,
                                      tipoPago: pago.Tipo
                                    },
                                  });
                                }
                              });
                            }}
                          >
                            <SendIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Código Mensaje:</strong>
                      </TableCell>
                      <TableCell>
                        {pago.correos.length > 0
                          ? pago.correos[0].CodigoMensaje
                          : "Sin Código Aún"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Cuenta Origen:</strong>
                      </TableCell>
                      <TableCell>{pago.cuentaOrigen}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Cuenta Destino:</strong>
                      </TableCell>
                      <TableCell>{pago.cuentaDestino}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Proveedor:</strong>
                      </TableCell>
                      <TableCell>{pago.Proveedor}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Importe Pagado:</strong>
                      </TableCell>
                      <TableCell>
                        {`$${number_format(pago.Importe, 2, ".", ",")}`}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                {pago.Tipo === 1 ? (
                  <Table
                    size="small"
                    aria-label="purchases"
                    style={{ marginTop: "15px" }}
                  >
                    <TableHead style={{ background: "#FAFAFA" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Fecha</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Serie-Folio</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Pagado</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Pendiente</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pago.documentos.map((documento, indexDocumento) => (
                        <TableRow key={indexDocumento}>
                          <TableCell>{pago.Fecha}</TableCell>
                          <TableCell align="right">{`${
                            documento.Serie !== null
                              ? documento.Serie
                              : "Sin Serie"
                          }-${
                            documento.Folio !== null
                              ? documento.Folio
                              : "Sin Folio"
                          }`}</TableCell>
                          <TableCell align="right">{`$${number_format(
                            parseFloat(documento.ImporteOriginalPago) +
                              parseFloat(documento.Pendiente),
                            2,
                            ".",
                            ","
                          )}`}</TableCell>
                          <TableCell align="right">{`$${number_format(
                            documento.ImporteOriginalPago,
                            2,
                            ".",
                            ","
                          )}`}</TableCell>
                          <TableCell align="right">{`$${number_format(
                            documento.Pendiente,
                            2,
                            ".",
                            ","
                          )}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Table
                    size="small"
                    aria-label="purchases"
                    style={{ marginTop: "15px" }}
                  >
                    <TableHead style={{ background: "#FAFAFA" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Tipo Pago</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Fecha</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Importe</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{tiposPago.tipos[pago.Tipo - 1]}</TableCell>
                        <TableCell align="right">{pago.Fecha}</TableCell>
                        <TableCell align="right">{`$${number_format(
                          pago.Importe,
                          2,
                          ".",
                          ","
                        )}`}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  };

  const PagosHechosDocumentos = (props) => {
    const { documento /* , layout */ /* , indexDocumento */ } = props;

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          {`${documento.Serie !== null ? documento.Serie : "Sin Serie"}-${
            documento.Folio !== null ? documento.Folio : "Sin Folio"
          }`}
        </TableCell>
        <TableCell>
          {`$${number_format(
            parseFloat(documento.ImporteOriginalPago) +
              parseFloat(documento.Pendiente),
            2,
            ".",
            ","
          )}`}
        </TableCell>
        <TableCell align="right">
          {`$${number_format(documento.ImporteOriginalPago, 2, ".", ",")}`}
        </TableCell>
        <TableCell align="right">
          {`$${number_format(documento.Pendiente, 2, ".", ",")}`}
        </TableCell>
        <TableCell align="center">
          <Tooltip title="Cancelar pago">
            <IconButton
              onClick={() => {
                swal({
                  text: "¿Está seguro de cancelar este pago?",
                  buttons: ["No", "Sí"],
                  dangerMode: true,
                }).then((value) => {
                  if (value) {
                    setShowTable(showTable === 1 || showTable === 2 ? 1 : 3);
                    executeGuardarFlwPagos({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 2,
                        IdFlw: documento.id,
                        IdUsuario: idUsuario,
                        IdPago: documento.IdPago,
                        Tipo: 1,
                        IdEmpresa: idEmpresa,
                      },
                    });
                  }
                });
              }}
            >
              <CancelIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  const PagosHechosCorreos = (props) => {
    const { correo /* , indexCorreo */, pago } = props;

    return (
      <Chip
        avatar={<Avatar>{correo.Correo.charAt(0).toUpperCase()}</Avatar>}
        label={correo.Correo}
        color="primary"
        style={{
          marginRight: "10px",
        }}
        onDelete={() => {
          swal({
            text: "¿Está seguro de reenviar el correo a " + correo.Correo + "?",
            buttons: ["No", "Sí"],
            dangerMode: true,
          }).then((value) => {
            if (value) {
              const titulo = "Pago de " + nombreEmpresa;
              const codigoMensaje = correo.CodigoMensaje;
              const cuentaOrigen = pago.cuentaOrigen;
              const cuentaDestino = pago.cuentaDestino;
              const proveedor = pago.Proveedor;
              const importePagado =
                "$" + number_format(pago.Importe, 2, ".", ",");
              executeReenviarCorreoLayout({
                data: {
                  usuario: correoUsuario,
                  pwd: passwordUsuario,
                  rfc: rfcEmpresa,
                  idsubmenu: 46,
                  idPago: pago.id,
                  titulo: titulo,
                  codigoMensaje: codigoMensaje,
                  cuentaOrigen: cuentaOrigen,
                  cuentaDestino: cuentaDestino,
                  proveedor: proveedor,
                  importePagado: importePagado,
                  correo: correo.Correo,
                  forma: 1,
                  tipoPago: pago.Tipo
                },
              });
            }
          });
        }}
        deleteIcon={
          <Tooltip
            title="Reenviar Correo"
            style={{
              marginLeft: "15px",
            }}
          >
            <IconButton>
              <SendIcon />
            </IconButton>
          </Tooltip>
        }
      />
    );
  };

  const getPagosHechos = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell />
              <TableCell>
                <strong>Layout</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Importe</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Cuenta Origen</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Cuenta Destino</strong>
              </TableCell>
              <TableCell align="center">
                <SettingsIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagosHechos.map((layout, index) => (
              <PagosHechosLayouts
                key={index}
                layout={layout}
                indexLayout={index}
                openPagosHechosLayouts={openPagosHechosLayouts}
                setOpenPagosHechosLayous={setOpenPagosHechosLayous}
                /* setValidacionOpenPagos={setValidacionOpenPagos}
                validacionOpenPagos={validacionOpenPagos} */
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div style={{ padding: "15px" }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={8} sm={6} md={6} style={{ alignSelf: "flex-end" }}>
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
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
              Flujos de Efectivo
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>

      <Grid container spacing={3} style={{ marginBottom: "15px" }}>
        {/* {pagosPendientes.length > 0 ? (
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<NewReleasesIcon className={classes.animatedItem} />}
              onClick={() => {
                executeGetFlwPagos();
                handleOpenDialogPagosPendientes();
              }}
            >
              Tiene pagos pendientes
            </Button>
          </Grid>
        ) : null} */}
        {pagosHechos.length > 0 ? (
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              style={{ color: "white", background: "#4caf50" }}
              startIcon={
                <LocalAtmIcon
                  className={classes.animatedItem}
                  style={{ color: "white" }}
                />
              }
              onClick={() => {
                setOpenDialogPagosHechos(true);
                setValidacionMensajeFinalizado(false);
                setOpenPagosHechosLayous(-1);
                setOpenPagosHechosDocumentos(-1);
                setOpenPagosHechosCorreos(-1);
                //handleOpenDialogPagosPendientes();
              }}
            >
              Pagos Hechos
            </Button>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} style={{ overflowX: "auto" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Button
                style={{
                  float: "right",
                  width: xsDialog ? "100%" : "",
                  marginRight: "0px",
                }}
                disabled={activeStep === 0}
                variant="contained"
                color="primary"
                onClick={handleBack}
                className={classes.backButton}
              >
                Anterior
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                style={{ float: "left", width: xsDialog ? "100%" : "" }}
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Grid>
            {activeStep === 0 ? (
              <Grid item xs={12}>
                <Button
                  style={{ width: xsDialog ? "100%" : "" }}
                  disabled={activeStep >= 2}
                  variant="contained"
                  onClick={handleSinPagosProveedores}
                >
                  Ir directo al paso 3
                </Button>
              </Grid>
            ) : null}
            <Grid item xs={12} style={{ marginTop: "15px" }}>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} sm={4} md={2}>
                  <TextField
                    className={classes.textFields}
                    id="disponible"
                    variant="outlined"
                    type="text"
                    label="Disponible"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    value={disponible}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      setDisponible(e.target.value);
                      setRestante(parseFloat(e.target.value) - aplicado);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={2}
                  style={{ alignSelf: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    <span>
                      <strong>Aplicado:</strong>
                    </span>
                    <span>{` $${number_format(aplicado, 2, ".", ",")}`}</span>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={2}
                  style={{ alignSelf: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    <span>
                      <strong>Restante: </strong>
                    </span>
                    <span
                      style={{
                        color:
                          restante > 0
                            ? "#8bc34a"
                            : restante < 0
                            ? "#d50000"
                            : "black",
                      }}
                    >{` $${number_format(restante, 2, ".", ",")}`}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {getStepContent(activeStep)}
      </Grid>
      <Dialog
        fullScreen={xsDialog}
        open={openDialogPagosHechos}
        onClose={handleCloseDialogPagosHechos}
        aria-labelledby="alert-dialog-title-pagos-pendientes"
        aria-describedby="alert-dialog-description-pagos-pendientes"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title-pagos-pendientes">
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h6" style={{ color: "#4caf50" }}>
              Pagos Hechos
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              {getPagosHechos()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogPagosHechos}
            variant="contained"
            color="secondary"
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={xsDialog}
        open={openDialogPagosPendientes && activeStep === 0}
        onClose={handleCloseDialogPagosPendientes}
        aria-labelledby="alert-dialog-title-pagos-pendientes"
        aria-describedby="alert-dialog-description-pagos-pendientes"
        maxWidth="lg"
        fullWidth={true}
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
      >
        <DialogTitle id="alert-dialog-title-pagos-pendientes">
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="h6" color="secondary">
              <NewReleasesIcon
                className={classes.animatedItem}
                color="secondary"
              />
              Tiene pagos pendientes
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  idsPagosPendientesFlw.length === 0 &&
                  idsPagosAdicionalesPendientes.length === 0
                }
                style={{
                  float: "right" /* , width: xsDialog ? "100%" : ""  */,
                }}
                onClick={() => {
                  swal({
                    text:
                      "¿Está seguro de agregar los pagos seleccionados? Los pagos que no hayan sido seleccionados se descartaran.",
                    buttons: ["No", "Sí"],
                    dangerMode: true,
                  }).then((value) => {
                    if (value) {
                      let nuevosIds = instrucciones.ids;
                      let nuevosTipos = instrucciones.tipos;
                      let nuevosProveedores = instrucciones.proveedores;
                      let nuevosRfcProveedores = instrucciones.rfcProveedores;
                      let nuevosImportes = instrucciones.importes;
                      let nuevosIdsCuentasOrigen =
                        instrucciones.idsCuentasOrigen;
                      let nuevosIdsBancosOrigen = instrucciones.idsBancosOrigen;
                      let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                      let nuevosValoresCuentasOrigen =
                        instrucciones.valoresCuentasOrigen;
                      let nuevosBancosOrigen = instrucciones.bancosOrigen;
                      let nuevasSucursalesOrigen =
                        instrucciones.sucursalesOrigen;
                      let nuevosIdsCuentasDestino =
                        instrucciones.idsCuentasDestino;
                      let nuevosIdsBancosDestino =
                        instrucciones.idsBancosDestino;
                      let nuevasCuentasDestino = instrucciones.cuentasDestino;
                      let nuevosValoresCuentasDestino =
                        instrucciones.valoresCuentasDestino;
                      let nuevasSucursalesDestino =
                        instrucciones.sucursalesDestino;
                      let nuevasFechas = instrucciones.fechas;
                      let nuevasLlavesMatch = instrucciones.llavesMatch;
                      let nuevosPagos = instrucciones.pagos;
                      let nuevosCorreos = instrucciones.correos;

                      let ids = instruccionesPagoProveedores.ids;
                      let proveedoresNombres =
                        instruccionesPagoProveedores.proveedores;
                      let importes = instruccionesPagoProveedores.importes;
                      let rfcs = instruccionesPagoProveedores.rfcs;
                      let pagos = instruccionesPagoProveedores.pagos;
                      let importesOriginales =
                        instruccionesPagoProveedores.importesOriginales;
                      let monedas = instruccionesPagoProveedores.monedas;
                      let tiposCambio =
                        instruccionesPagoProveedores.tiposCambio;
                      let pagosOriginales =
                        instruccionesPagoProveedores.pagosOriginales;
                      let correos = instruccionesPagoProveedores.correos;
                      let cuentasOrigenNombre =
                        instruccionesPagoProveedores.cuentasOrigen;
                      let cuentasDestinoNombre =
                        instruccionesPagoProveedores.cuentasDestino;

                      let nuevosIdsPagosAdicional =
                        instruccionesAdicionales.ids;
                      let nuevosTiposPagosAdicional =
                        instruccionesAdicionales.tipos;
                      let nuevosProveedoresPagosAdicional =
                        instruccionesAdicionales.proveedores;
                      let nuevosRfcProveedoresPagosAdicional =
                        instruccionesAdicionales.rfcProveedores;
                      let nuevosValoresProveedoresPagosAdicional =
                        instruccionesAdicionales.valoresProveedores;
                      let nuevosImportesPagosAdicional =
                        instruccionesAdicionales.importes;
                      let nuevosIdsCuentasOrigenPagosAdicional =
                        instruccionesAdicionales.idsCuentasOrigen;
                      let nuevosIdsBancosOrigenPagosAdicional =
                        instruccionesAdicionales.idsBancosOrigen;
                      let nuevasCuentasOrigenPagosAdicional =
                        instruccionesAdicionales.cuentasOrigen;
                      let nuevosValoresCuentasOrigenPagosAdicional =
                        instruccionesAdicionales.valoresCuentasOrigen;
                      let nuevosBancosOrigenPagosAdicional =
                        instruccionesAdicionales.bancosOrigen;
                      let nuevasSucursalesOrigenPagosAdicional =
                        instruccionesAdicionales.sucursalesOrigen;
                      let nuevosIdsCuentasDestinoPagosAdicional =
                        instruccionesAdicionales.idsCuentasDestino;
                      let nuevosIdsBancosDestinoPagosAdicional =
                        instruccionesAdicionales.idsBancosDestino;
                      let nuevasCuentasDestinoPagosAdicional =
                        instruccionesAdicionales.cuentasDestino;
                      let nuevosValoresCuentasDestinoPagosAdicional =
                        instruccionesAdicionales.valoresCuentasDestino;
                      let nuevasSucursalesDestinoPagosAdicional =
                        instruccionesAdicionales.sucursalesDestino;
                      let nuevasFechasPagosAdicional =
                        instruccionesAdicionales.fechas;
                      let nuevasLlavesMatchPagosAdicional =
                        instruccionesAdicionales.llavesMatch;
                      let nuevosPagosPagosAdicional =
                        instruccionesAdicionales.pagos;
                      let nuevosCorreosPagosAdicional =
                        instruccionesAdicionales.correos;

                      let nuevoAplicado = aplicado;
                      let nuevoRestante = 0;
                      let nuevosPagosPendientes = pagosPendientesSeleccionados.filter(
                        (pagoPendienteSeleccionado) =>
                          documentosSeleccionados.indexOf(
                            pagoPendienteSeleccionado.id
                          ) === -1
                      );
                      let pagosEliminar = pagosPendientes.filter(
                        (pagoPendiente) =>
                          idsPagosPendientesFlw.indexOf(pagoPendiente.id) === -1
                      );
                      let pagosAdicionalesEliminar = pagosAdicionalesPendientes.filter(
                        (pagoAdicionalPendiente) =>
                          idsPagosAdicionalesPendientes.indexOf(
                            pagoAdicionalPendiente.id
                          ) === -1
                      );
                      /* console.log(pagosEliminar); */
                      let idsPagosDetEliminar = pagosEliminar.map(
                        (pagoEliminar) => pagoEliminar.IdPagoDet
                      );
                      let idsPagosEliminar = pagosEliminar.map(
                        (pagoEliminar) => pagoEliminar.IdPago
                      );
                      let idsPagosAdicionalesEliminar = pagosAdicionalesEliminar.map(
                        (pagoAdicionalEliminar) => pagoAdicionalEliminar.id
                      );
                      /* console.log(idsPagosDetEliminar);
                      console.log(idsPagosEliminar);
                      console.log(nuevosPagosPendientes);
                      console.log(pagosPendientes); */

                      for (let x = 0; x < nuevosPagosPendientes.length; x++) {
                        nuevoAplicado =
                          nuevoAplicado +
                          parseFloat(nuevosPagosPendientes[x].Importe);

                        let posicion = nuevosProveedores.indexOf(
                          nuevosPagosPendientes[x].Razon
                        );
                        const cuentasDestinosProveedor = cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC === nuevosPagosPendientes[x].cRFC
                        );
                        const datosProveedor = proveedores.filter(
                          (proveedor) =>
                            proveedor.razonsocial ===
                              nuevosPagosPendientes[x].Razon &&
                            proveedor.rfc === nuevosPagosPendientes[x].cRFC
                        );
                        let correosProveedor = [];
                        if (datosProveedor[0].Correo1 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo1,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        if (datosProveedor[0].Correo2 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo2,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        if (datosProveedor[0].Correo3 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo3,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        if (posicion === -1) {
                          nuevosIds.push(nuevosPagosPendientes[x].id);
                          nuevosTipos.push(1);
                          nuevosProveedores.push(
                            nuevosPagosPendientes[x].Razon
                          );
                          nuevosRfcProveedores.push(
                            nuevosPagosPendientes[x].cRFC
                          );
                          nuevosImportes.push(
                            parseFloat(nuevosPagosPendientes[x].Importe)
                          );
                          nuevosIdsCuentasOrigen.push(
                            nuevosPagosPendientes[x].idCuentaOrigen !== null
                              ? nuevosPagosPendientes[x].idCuentaOrigen
                              : 0
                          );
                          nuevosIdsBancosOrigen.push(
                            nuevosPagosPendientes[x].idBancoOrigen !== null
                              ? nuevosPagosPendientes[x].idBancoOrigen
                              : 0
                          );
                          nuevasCuentasOrigen.push(
                            nuevosPagosPendientes[x].cuentaOrigen !== null
                              ? nuevosPagosPendientes[x].cuentaOrigen
                              : ""
                          );
                          nuevosValoresCuentasOrigen.push(
                            nuevosPagosPendientes[x].idCuentaOrigen !== null
                              ? cuentasOrigen
                                  .map((cuentaOrigen) => cuentaOrigen.Nombre)
                                  .indexOf(
                                    nuevosPagosPendientes[x].cuentaOrigen
                                  )
                              : "-1"
                          );
                          nuevosBancosOrigen.push(
                            nuevosPagosPendientes[x].bancoOrigen !== null
                              ? nuevosPagosPendientes[x].bancoOrigen
                              : ""
                          );
                          nuevasSucursalesOrigen.push(
                            nuevosPagosPendientes[x].sucursalOrigen !== null
                              ? nuevosPagosPendientes[x].sucursalOrigen
                              : ""
                          );
                          /* console.log(cuentasDestinosProveedor);
                          console.log(cuentasDestinosProveedor.length);
                          console.log(nuevosPagosPendientes[x]); */
                          nuevosIdsCuentasDestino.push(
                            nuevosPagosPendientes[x].idCuentaDestino !== null
                              ? nuevosPagosPendientes[x].idCuentaDestino
                              : cuentasDestinosProveedor.length === 1
                              ? cuentasDestinosProveedor[0].Id
                              : 0
                          );
                          nuevosIdsBancosDestino.push(
                            nuevosPagosPendientes[x].idBancoDestino !== null
                              ? nuevosPagosPendientes[x].idBancoDestino
                              : cuentasDestinosProveedor.length === 1
                              ? cuentasDestinosProveedor[0].IdBanco
                              : 0
                          );
                          nuevasCuentasDestino.push(
                            nuevosPagosPendientes[x].cuentaDestino !== null
                              ? nuevosPagosPendientes[x].cuentaDestino
                              : cuentasDestinosProveedor.length === 1
                              ? cuentasDestinosProveedor[0].Layout
                              : ""
                          );
                          nuevosValoresCuentasDestino.push(
                            nuevosPagosPendientes[x].idCuentaDestino !== null
                              ? cuentasDestinosProveedor
                                  .map((cuenta) => cuenta.Id)
                                  .indexOf(
                                    nuevosPagosPendientes[x].idCuentaDestino
                                  )
                              : cuentasDestinosProveedor.length === 1
                              ? 0
                              : "-1"
                          );
                          nuevasSucursalesDestino.push(
                            nuevosPagosPendientes[x].sucursalDestino !== null
                              ? nuevosPagosPendientes[x].sucursalDestino
                              : cuentasDestinosProveedor.length === 1
                              ? cuentasDestinosProveedor[0].Sucursal !== null
                                ? cuentasDestinosProveedor[0].Sucursal
                                : ""
                              : ""
                          );
                          nuevasFechas.push(
                            nuevosPagosPendientes[x].fechapagodet !== null
                              ? nuevosPagosPendientes[x].fechapagodet
                              : moment().format("YYYY-MM-DD")
                          );
                          nuevasLlavesMatch.push("");
                          nuevosPagos.push(
                            parseFloat(nuevosPagosPendientes[x].Importe)
                          );
                          nuevosCorreos.push(correosProveedor);
                        } else {
                          nuevosIds[posicion] =
                            nuevosIds[posicion] +
                            "," +
                            nuevosPagosPendientes[x].id;
                          nuevosTipos[posicion] = nuevosTipos[posicion] + "-$-1";
                          nuevosImportes[posicion] =
                            parseFloat(nuevosImportes[posicion]) +
                            parseFloat(nuevosPagosPendientes[x].Importe);
                          nuevosPagos[posicion] =
                            parseFloat(nuevosPagos[posicion]) +
                            parseFloat(nuevosPagosPendientes[x].Importe);
                          if (nuevosIdsCuentasOrigen[posicion] === 0) {
                            nuevosIdsCuentasOrigen[posicion] =
                              nuevosPagosPendientes[x].idCuentaOrigen !== null
                                ? nuevosPagosPendientes[x].idCuentaOrigen
                                : 0;
                            nuevosIdsBancosOrigen[posicion] =
                              nuevosPagosPendientes[x].idBancoOrigen !== null
                                ? nuevosPagosPendientes[x].idBancoOrigen
                                : 0;
                            nuevasCuentasOrigen[posicion] =
                              nuevosPagosPendientes[x].cuentaOrigen !== null
                                ? nuevosPagosPendientes[x].cuentaOrigen
                                : "";
                            nuevosValoresCuentasOrigen[posicion] =
                              nuevosPagosPendientes[x].idCuentaOrigen !== null
                                ? cuentasOrigen
                                    .map((cuentaOrigen) => cuentaOrigen.Nombre)
                                    .indexOf(
                                      nuevosPagosPendientes[x].cuentaOrigen
                                    )
                                : "-1";
                            nuevosBancosOrigen[posicion] =
                              nuevosPagosPendientes[x].bancoOrigen !== null
                                ? nuevosPagosPendientes[x].bancoOrigen
                                : "";
                            nuevasSucursalesOrigen[posicion] =
                              nuevosPagosPendientes[x].sucursalOrigen !== null
                                ? nuevosPagosPendientes[x].sucursalOrigen
                                : "";
                            nuevosIdsCuentasDestino[posicion] =
                              nuevosPagosPendientes[x].idCuentaDestino !== null
                                ? nuevosPagosPendientes[x].idCuentaDestino
                                : cuentasDestinosProveedor.length === 1
                                ? cuentasDestinosProveedor[0].Id
                                : 0;
                            nuevosIdsBancosDestino[posicion] =
                              nuevosPagosPendientes[x].idBancoDestino !== null
                                ? nuevosPagosPendientes[x].idBancoDestino
                                : cuentasDestinosProveedor.length === 1
                                ? cuentasDestinosProveedor[0].IdBanco
                                : 0;
                            nuevasCuentasDestino[posicion] =
                              nuevosPagosPendientes[x].cuentaDestino !== null
                                ? nuevosPagosPendientes[x].cuentaDestino
                                : cuentasDestinosProveedor.length === 1
                                ? cuentasDestinosProveedor[0].Layout
                                : "";
                            nuevosValoresCuentasDestino[posicion] =
                              nuevosPagosPendientes[x].idCuentaDestino !== null
                                ? cuentasDestinosProveedor
                                    .map((cuenta) => cuenta.Id)
                                    .indexOf(
                                      nuevosPagosPendientes[x].idCuentaDestino
                                    )
                                : cuentasDestinosProveedor.length === 1
                                ? 0
                                : "-1";
                            nuevasSucursalesDestino[posicion] =
                              nuevosPagosPendientes[x].sucursalDestino !== null
                                ? nuevosPagosPendientes[x].sucursalDestino
                                : cuentasDestinosProveedor.length === 1
                                ? cuentasDestinosProveedor[0].Sucursal !== null
                                  ? cuentasDestinosProveedor[0].Sucursal
                                  : ""
                                : "";
                            nuevasFechas[posicion] =
                              nuevosPagosPendientes[x].fechapagodet !== null
                                ? nuevosPagosPendientes[x].fechapagodet
                                : moment().format("YYYY-MM-DD");
                          }
                        }

                        ids.push(nuevosPagosPendientes[x].id);
                        proveedoresNombres.push(nuevosPagosPendientes[x].Razon);
                        importes.push(
                          parseFloat(nuevosPagosPendientes[x].Pendiente)
                        );
                        rfcs.push(nuevosPagosPendientes[x].cRFC);
                        pagos.push(
                          parseFloat(nuevosPagosPendientes[x].Importe)
                        );
                        importesOriginales.push(
                          parseFloat(nuevosPagosPendientes[x].ImporteOriginal)
                        );
                        monedas.push(nuevosPagosPendientes[x].Moneda);
                        tiposCambio.push(
                          parseFloat(
                            nuevosPagosPendientes[x].TipoCambioPago
                          ) !== 1
                            ? parseFloat(
                                nuevosPagosPendientes[x].TipoCambioPago
                              )
                            : -1
                        );
                        pagosOriginales.push(
                          parseFloat(
                            nuevosPagosPendientes[x].ImporteOriginalPago
                          )
                        );
                        correos.push(correosProveedor);
                        cuentasOrigenNombre.push(
                          nuevosPagosPendientes[x].cuentaOrigen !== null
                            ? nuevosPagosPendientes[x].cuentaOrigen
                            : ""
                        );
                        cuentasDestinoNombre.push(
                          nuevosPagosPendientes[x].cuentaDestino !== null
                            ? nuevosPagosPendientes[x].cuentaDestino
                            : cuentasDestinosProveedor.length === 1
                            ? cuentasDestinosProveedor[0].Layout
                            : ""
                        );
                      }

                      for (
                        let x = 0;
                        x < pagosAdicionalesPendientesSeleccionados.length;
                        x++
                      ) {
                        nuevoAplicado =
                          nuevoAplicado +
                          parseFloat(
                            pagosAdicionalesPendientesSeleccionados[x].Importe
                          );
                        const valorCuentaOrigen = cuentasOrigen
                          .map((cuentaOrigen) => cuentaOrigen.IdCuenta)
                          .indexOf(
                            pagosAdicionalesPendientesSeleccionados[x]
                              .IdCuentaOrigen
                          );
                        nuevosIdsPagosAdicional.push((x + 1) * -1);
                        nuevosTiposPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].Tipo
                        );
                        nuevosProveedoresPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].Proveedor
                        );
                        nuevosRfcProveedoresPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].RFC
                        );
                        nuevosValoresProveedoresPagosAdicional.push(0);
                        nuevosImportesPagosAdicional.push(
                          parseFloat(
                            pagosAdicionalesPendientesSeleccionados[x].Importe
                          )
                        );
                        nuevosIdsCuentasOrigenPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .IdCuentaOrigen
                        );
                        nuevosIdsBancosOrigenPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .idBancoOrigen
                        );
                        nuevasCuentasOrigenPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .cuentaOrigen
                        );
                        nuevosValoresCuentasOrigenPagosAdicional.push(
                          valorCuentaOrigen
                        );
                        nuevosBancosOrigenPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].bancoOrigen
                        );
                        nuevasSucursalesOrigenPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .sucursalOrigen !== null
                            ? pagosAdicionalesPendientesSeleccionados[x]
                                .sucursalOrigen
                            : ""
                        );
                        nuevosIdsCuentasDestinoPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .IdCuentaDestino
                        );
                        nuevosIdsBancosDestinoPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .idBancoDestino
                        );
                        nuevasCuentasDestinoPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .cuentaDestino
                        );
                        nuevosValoresCuentasDestinoPagosAdicional.push(0);
                        nuevasSucursalesDestinoPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x]
                            .sucursalDestino !== null
                            ? pagosAdicionalesPendientesSeleccionados[x]
                                .sucursalDestino
                            : ""
                        );
                        nuevasFechasPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].Fecha
                        );
                        nuevasLlavesMatchPagosAdicional.push(
                          pagosAdicionalesPendientesSeleccionados[x].LlaveMatch
                        );
                        nuevosPagosPagosAdicional.push(
                          parseFloat(
                            pagosAdicionalesPendientesSeleccionados[x].Importe
                          )
                        );
                        const datosProveedor = proveedores.filter(
                          (proveedor) =>
                            proveedor.razonsocial ===
                              pagosAdicionalesPendientesSeleccionados[x]
                                .Proveedor &&
                            proveedor.rfc ===
                              pagosAdicionalesPendientesSeleccionados[x].RFC
                        );
                        let correosProveedor = [];
                        if (datosProveedor[0].Correo1 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo1,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        if (datosProveedor[0].Correo2 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo2,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        if (datosProveedor[0].Correo3 !== null) {
                          correosProveedor.push({
                            correo: datosProveedor[0].Correo3,
                            enviar: true,
                            obligatorio: true,
                          });
                        }
                        nuevosCorreosPagosAdicional.push(correosProveedor);
                      }

                      nuevoRestante = nuevoRestante - nuevoAplicado;
                      setInstrucciones({
                        ids: nuevosIds,
                        tipos: nuevosTipos,
                        proveedores: nuevosProveedores,
                        rfcProveedores: nuevosRfcProveedores,
                        importes: nuevosImportes,
                        idsCuentasOrigen: nuevosIdsCuentasOrigen,
                        idsBancosOrigen: nuevosIdsBancosOrigen,
                        cuentasOrigen: nuevasCuentasOrigen,
                        valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                        bancosOrigen: nuevosBancosOrigen,
                        sucursalesOrigen: nuevasSucursalesOrigen,
                        idsCuentasDestino: nuevosIdsCuentasDestino,
                        idsBancosDestino: nuevosIdsBancosDestino,
                        cuentasDestino: nuevasCuentasDestino,
                        valoresCuentasDestino: nuevosValoresCuentasDestino,
                        sucursalesDestino: nuevasSucursalesDestino,
                        fechas: nuevasFechas,
                        llavesMatch: nuevasLlavesMatch,
                        pagos: nuevosPagos,
                        correos: nuevosCorreos,
                      });

                      setInstruccionesPagoProveedores({
                        ids: ids,
                        proveedores: proveedoresNombres,
                        importes: importes,
                        rfcs: rfcs,
                        pagos: pagos,
                        importesOriginales: importesOriginales,
                        monedas: monedas,
                        tiposCambio: tiposCambio,
                        pagosOriginales: pagosOriginales,
                        correos: correos,
                        cuentasOrigen: cuentasOrigenNombre,
                        cuentasDestino: cuentasDestinoNombre,
                      });

                      setInstruccionesAdicionales({
                        ids: nuevosIdsPagosAdicional,
                        tipos: nuevosTiposPagosAdicional,
                        proveedores: nuevosProveedoresPagosAdicional,
                        rfcProveedores: nuevosRfcProveedoresPagosAdicional,
                        valoresProveedores: nuevosValoresProveedoresPagosAdicional,
                        importes: nuevosImportesPagosAdicional,
                        idsCuentasOrigen: nuevosIdsCuentasOrigenPagosAdicional,
                        idsBancosOrigen: nuevosIdsBancosOrigenPagosAdicional,
                        cuentasOrigen: nuevasCuentasOrigenPagosAdicional,
                        valoresCuentasOrigen: nuevosValoresCuentasOrigenPagosAdicional,
                        bancosOrigen: nuevosBancosOrigenPagosAdicional,
                        sucursalesOrigen: nuevasSucursalesOrigenPagosAdicional,
                        idsCuentasDestino: nuevosIdsCuentasDestinoPagosAdicional,
                        idsBancosDestino: nuevosIdsBancosDestinoPagosAdicional,
                        cuentasDestino: nuevasCuentasDestinoPagosAdicional,
                        valoresCuentasDestino: nuevosValoresCuentasDestinoPagosAdicional,
                        sucursalesDestino: nuevasSucursalesDestinoPagosAdicional,
                        fechas: nuevasFechasPagosAdicional,
                        llavesMatch: nuevasLlavesMatchPagosAdicional,
                        pagos: nuevosPagosPagosAdicional,
                        correos: nuevosCorreosPagosAdicional,
                      });

                      setAplicado(nuevoAplicado);
                      setRestante(nuevoRestante);

                      let nuevosDocumentosSeleccionados = documentosSeleccionados;
                      for (let x = 0; x < idsPagosPendientesFlw.length; x++) {
                        if (
                          documentosSeleccionados.indexOf(
                            idsPagosPendientesFlw[x]
                          ) === -1
                        ) {
                          nuevosDocumentosSeleccionados.push(
                            idsPagosPendientesFlw[x]
                          );
                        }
                      }
                      setActiveStep(nuevosIdsCuentasOrigen.includes(0) ? 1 : 2);
                      setDocumentosSeleccionados(nuevosDocumentosSeleccionados);

                      handleCloseDialogPagosPendientes();
                      //executeGetFlwPagos();

                      executeEliminarFlwPagos({
                        data: {
                          usuario: correoUsuario,
                          pwd: passwordUsuario,
                          rfc: rfcEmpresa,
                          idsubmenu: 46,
                          idusuario: idUsuario,
                          idspagodet: idsPagosDetEliminar,
                          idspago: idsPagosEliminar,
                          idspagosadicionales: idsPagosAdicionalesEliminar,
                        },
                      });
                    }
                  });
                }}
              >
                Agregar seleccionados
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Tooltip title="Seleccionar Todos">
                          <Checkbox
                            indeterminate={
                              idsPagosPendientesFlw.length > 0 &&
                              idsPagosPendientesFlw.length <
                                pagosPendientes.length
                            }
                            checked={
                              pagosPendientes.length > 0 &&
                              idsPagosPendientesFlw.length ===
                                pagosPendientes.length
                            }
                            onChange={handleSelectAllClick}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <strong>Tipo Documento</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Proveedor</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>RFC</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Sucursal</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Pendiente</strong>
                      </TableCell>
                      {/* <TableCell align="right">
                    <strong>
                      <SettingsIcon />
                    </strong>
                  </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagosPendientes.map((pagoPendiente, index) => {
                      /* console.log(pagosPendientes);
                      console.log(pagosAdicionalesPendientes); */
                      const isItemSelected =
                        idsPagosPendientesFlw.indexOf(pagoPendiente.id) !== -1;
                      return (
                        <TableRow
                          key={index}
                          hover
                          onClick={(event) =>
                            handleClick(event, pagoPendiente, 1)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            Flujo de Efectivo
                          </TableCell>
                          <TableCell align="right">
                            {pagoPendiente.Razon}
                          </TableCell>
                          <TableCell align="right">
                            {pagoPendiente.cRFC}
                          </TableCell>
                          <TableCell align="right">
                            {pagoPendiente.Suc}
                          </TableCell>
                          <TableCell align="right">
                            {`$${number_format(
                              pagoPendiente.Importe,
                              2,
                              ".",
                              ","
                            )}`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {pagosAdicionalesPendientes.map(
                      (pagoAdicionalPendiente, index) => {
                        const isItemSelected =
                          idsPagosAdicionalesPendientes.indexOf(
                            pagoAdicionalPendiente.id
                          ) !== -1;
                        return (
                          <TableRow
                            key={index}
                            hover
                            onClick={(event) =>
                              handleClick(event, pagoAdicionalPendiente, 2)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {pagoAdicionalPendiente.Tipo === 2
                                ? "Anticipo a proveedores"
                                : pagoAdicionalPendiente.Tipo === 3
                                ? "Pago a prestamos a acreedores"
                                : pagoAdicionalPendiente.Tipo === 4
                                ? "Entrega de prestamos a deudores"
                                : ""}
                            </TableCell>
                            <TableCell align="right">
                              {pagoAdicionalPendiente.Proveedor}
                            </TableCell>
                            <TableCell align="right">
                              {pagoAdicionalPendiente.RFC}
                            </TableCell>
                            <TableCell align="right">{""}</TableCell>
                            <TableCell align="right">
                              {`$${number_format(
                                pagoAdicionalPendiente.Importe,
                                2,
                                ".",
                                ","
                              )}`}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                    <TableRow>
                      <TableCell colSpan="5" align="right">
                        <strong>Total Pendiente:</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{`$${number_format(
                          totalPendientes,
                          2,
                          ".",
                          ","
                        )}`}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              swal({
                text: "¿Está seguro de descartar todos los pagos pendientes?",
                buttons: ["No", "Sí"],
                dangerMode: true,
              }).then((value) => {
                /* console.log(pagosPendientes); */
                if (value) {
                  let idsPagosDetEliminar = pagosPendientes.map(
                    (pagoPendiente) => pagoPendiente.IdPagoDet
                  );
                  let idsPagosEliminar = pagosPendientes.map(
                    (pagoPendiente) => pagoPendiente.IdPago
                  );
                  let idsPagosAdicionalesEliminar = pagosAdicionalesPendientes.map(
                    (pagoAdicionalPendiente) => pagoAdicionalPendiente.id
                  );
                  executeEliminarFlwPagos({
                    data: {
                      usuario: correoUsuario,
                      pwd: passwordUsuario,
                      rfc: rfcEmpresa,
                      idsubmenu: 46,
                      idusuario: idUsuario,
                      idspagodet: idsPagosDetEliminar,
                      idspago: idsPagosEliminar,
                      idspagosadicionales: idsPagosAdicionalesEliminar,
                    },
                  });
                  setOpenDialogPagosPendientes(false);
                }
              });
            }}
            variant="contained"
            color="secondary"
            autoFocus
          >
            Descartar Todos
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function NumberFormatCustom(props) {
  const { id, inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

function Paso1(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  //const idUsuario = props.idUsuario;
  const correoUsuario = props.correo;
  const passwordUsuario = props.password;
  const setLoading = props.setLoading;
  const rfcEmpresa = props.rfc;
  const idEmpresa = props.idEmpresa;
  //const proveedores = props.proveedores;
  const proveedoresPrioritarios = props.proveedoresPrioritarios;
  const proveedoresNoPrioritarios = props.proveedoresNoPrioritarios;
  const executeTraerProveedoresFiltro = props.executeTraerProveedoresFiltro;
  const documentosSeleccionados = props.documentosSeleccionados;
  const setDocumentosSeleccionados = props.setDocumentosSeleccionados;
  const disponible = props.disponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  const restante = props.restante;
  const setRestante = props.setRestante;
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const openPrioritariosDialog = props.openPrioritariosDialog;
  const setOpenPrioritariosDialog = props.setOpenPrioritariosDialog;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const setInstruccionesPagoProveedores = props.setInstruccionesPagoProveedores;
  const setValidacionDialogProveedoresPrioritarios =
    props.setValidacionDialogProveedoresPrioritarios;
  const filtroApiTraerFlujosEfectivo = props.filtroApiTraerFlujosEfectivo;
  const setFiltroApiTraerFlujosEfectivo = props.setFiltroApiTraerFlujosEfectivo;
  //const executeGuardarFlwPagos = props.executeGuardarFlwPagos;
  const showTable = props.showTable;
  const setShowTable = props.setShowTable;
  const flujosEfectivoFiltrados = props.flujosEfectivoFiltrados;
  const setFlujosEfectivoFiltrados = props.setFlujosEfectivoFiltrados;
  const totalEspecificos = props.totalEspecificos;
  const setTotalEspecificos = props.setTotalEspecificos;
  const tituloFlujosFiltrados = props.tituloFlujosFiltrados;
  const setTituloFlujosFiltrados = props.setTituloFlujosFiltrados;
  /* const tipoCambio = props.tipoCambio;
  const setTipoCambio = props.setTipoCambio; */
  const setValidacionEjecucionGetPagosApi =
    props.setValidacionEjecucionGetPagosApi;
  const tipoTabla = props.tipoTabla;
  const setTipoTabla = props.setTipoTabla;
  const cuentasDestino = props.cuentasDestino;
  const proveedores = props.proveedores;
  const [flujosEfectivo, setFlujosEfectivo] = useState([]);
  //const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [pendiente, setPendiente] = useState(0.0);
  //const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  //const [tituloFlujosFiltrados, setTituloFlujosFiltrados] = useState("");
  //const [showTable, setShowTable] = useState(1);
  const [idProveedor, setIdProveedor] = useState(0);
  const [pendienteGuardado, setPendienteGuardado] = useState(0.0);
  const [ultimaActualizacionFlujos, setUltimaActualizacionFlujos] = useState(
    ""
  );
  const [
    totalPendienteTablaPorDocumentos,
    setTotalPendienteTablaPorDocumentos,
  ] = useState(0.0);
  //const [tipoTabla, setTipoTabla] = useState(1);
  /* const [filasTablaPorProveedores, setFilasTablaPorProveedores] = useState([]); */
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("pendiente");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialogTipoCambio, setOpenDialogTipoCambio] = useState(false);
  const [detallesFlujos, setDetallesFlujos] = useState({
    pagos: [],
    tiposCambio: [],
  });

  const [
    {
      data: traerFlujosEfectivoData,
      loading: traerFlujosEfectivoLoading,
      error: traerFlujosEfectivoError,
    },
    executeTraerFlujosEfectivo,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivo`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        filtro: filtroApiTraerFlujosEfectivo,
        pendiente: pendienteGuardado,
        tabla: tipoTabla,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: traerArchivosFlujosData,
      loading: traerArchivosFlujosLoading,
      error: traerArchivosFlujosError,
    },
    executeTraerArchivosFlujos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerArchivosFlujos`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  /* const [
    {
      data: traerFlujosEfectivoAcomodadosData,
      loading: traerFlujosEfectivoAcomodadosLoading,
      error: traerFlujosEfectivoAcomodadosError,
    },
    executeTraerFlujosEfectivoAcomodados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoAcomodados`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        filtro: filtroApiTraerFlujosEfectivo,
        pendiente: pendienteGuardado,
      },
    },
    {
      useCache: false,
    }
  ); */

  const [
    {
      data: traerFlujosEfectivoFiltradosData,
      loading: traerFlujosEfectivoFiltradosLoading,
      error: traerFlujosEfectivoFiltradosError,
    },
    executeTraerFlujosEfectivoFiltrados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoFiltrados`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: cambiarPrioridadProveedorData,
      loading: cambiarPrioridadProveedorLoading,
      error: cambiarPrioridadProveedorError,
    },
    executeCambiarPrioridadProveedor,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarPrioridadProveedor`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoData) {
        if (traerFlujosEfectivoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerFlujosEfectivoData.error),
            "warning"
          );
        } else {
          if (traerFlujosEfectivoData.tabla === "1") {
            filterRowsTablaPorDocumento = [];
            let totalPendiente = 0.0;
            traerFlujosEfectivoData.flujosefectivo.map((flujoEfectivo) => {
              totalPendiente =
                totalPendiente + parseFloat(flujoEfectivo.Pendiente);
              return filterRowsTablaPorDocumento.push(
                createDataTablaPorDocumento(
                  flujoEfectivo.id,
                  `${
                    flujoEfectivo.Serie !== null
                      ? flujoEfectivo.Serie
                      : "Sin Serie"
                  } - ${flujoEfectivo.Folio}`,
                  flujoEfectivo.Razon,
                  flujoEfectivo.Suc,
                  flujoEfectivo.Fecha,
                  flujoEfectivo.Vence,
                  flujoEfectivo.Tipo,
                  parseFloat(flujoEfectivo.Pendiente),
                  flujoEfectivo.cRFC,
                  flujoEfectivo.IdMoneda,
                  parseFloat(flujoEfectivo.ImporteOriginal),
                  flujoEfectivo.Moneda,
                  parseFloat(flujoEfectivo.TipoCambio),
                  flujoEfectivo.RutaArchivo,
                  flujoEfectivo.NombreArchivo
                )
              );
            });
            setRows(filterRowsTablaPorDocumento);
            setTotalPendienteTablaPorDocumentos(totalPendiente);
          } else {
            setFlujosEfectivo(traerFlujosEfectivoData.flujosefectivo);
          }
          setUltimaActualizacionFlujos(
            traerFlujosEfectivoData.ultimaactualizacion.length > 0
              ? traerFlujosEfectivoData.ultimaactualizacion[0].Actualizacion
              : null
          );
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoData]);

  useEffect(() => {
    function checkData() {
      if (traerArchivosFlujosData) {
        if (traerArchivosFlujosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerArchivosFlujosData.error),
            "warning"
          );
        } else {
          if (traerArchivosFlujosData.link !== "") {
            window.open(traerArchivosFlujosData.link);
          } else {
            swal("Error", "CFDI no encontrado", "warning");
          }
        }
      }
    }

    checkData();
  }, [traerArchivosFlujosData]);

  /* useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoAcomodadosData) {
        if (traerFlujosEfectivoAcomodadosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerFlujosEfectivoAcomodadosData.error),
            "warning"
          );
        } else {
          let filterRows = [];
          traerFlujosEfectivoAcomodadosData.flujosefectivo.map((flujo) => {
            return filterRows.push(
              createData(
                flujo.Proveedor,
                parseFloat(flujo.V4),
                parseFloat(flujo.V3),
                parseFloat(flujo.V2),
                parseFloat(flujo.V1),
                parseFloat(flujo.PorVencer),
                parseFloat(flujo.TotalResultado)
              )
            );
          });
          setRows(filterRows);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoAcomodadosData]); */

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoFiltradosData) {
        if (traerFlujosEfectivoFiltradosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerFlujosEfectivoFiltradosData.error),
            "warning"
          );
        } else {
          setFlujosEfectivoFiltrados(
            traerFlujosEfectivoFiltradosData.flujosefectivo
          );
          let total = 0;
          let nuevosTipoCambio = [];
          let nuevosImportesDocumentos = [];

          for (
            let x = 0;
            x < traerFlujosEfectivoFiltradosData.flujosefectivo.length;
            x++
          ) {
            total =
              total +
              parseFloat(
                traerFlujosEfectivoFiltradosData.flujosefectivo[x].Pendiente
              );
            nuevosTipoCambio.push(
              traerFlujosEfectivoFiltradosData.flujosefectivo[x].IdMoneda !== 1
                ? 0
                : -1
            );
            nuevosImportesDocumentos.push(
              traerFlujosEfectivoFiltradosData.flujosefectivo[x].IdMoneda !== 1
                ? parseFloat(
                    traerFlujosEfectivoFiltradosData.flujosefectivo[x]
                      .ImporteOriginal
                  )
                : parseFloat(
                    traerFlujosEfectivoFiltradosData.flujosefectivo[x].Pendiente
                  )
            );
          }

          setTotalEspecificos(total);
          /* setTipoCambio({
            valores: nuevosTipoCambio,
          }); */
          setDetallesFlujos({
            pagos: nuevosImportesDocumentos,
            tiposCambio: nuevosTipoCambio,
          });
        }
      }
    }

    checkData();
  }, [
    traerFlujosEfectivoFiltradosData,
    setFlujosEfectivoFiltrados,
    setTotalEspecificos,
    /* setTipoCambio, */
  ]);

  useEffect(() => {
    function checkData() {
      if (cambiarPrioridadProveedorData) {
        if (cambiarPrioridadProveedorData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarPrioridadProveedorData.error),
            "warning"
          );
        } else {
          executeTraerProveedoresFiltro();
        }
      }
    }

    checkData();
  }, [cambiarPrioridadProveedorData, executeTraerProveedoresFiltro]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsTablaPorDocumento.length; x++) {
        if (
          filterRowsTablaPorDocumento[x].serieFolio
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].proveedor
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].sucursal
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].fechaDoc
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRowsTablaPorDocumento[x].fechaDoc)
            .format("DD/MM/YYYY")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].fechaVen
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRowsTablaPorDocumento[x].fechaVen)
            .format("DD/MM/YYYY")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].tipo
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsTablaPorDocumento[x].pendiente
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsTablaPorDocumento[x]);
        }
      }
      return dataFilter;
    }

    if (showTable === 3) {
      setRows(
        busquedaFiltro.trim() !== ""
          ? getFilterRows()
          : filterRowsTablaPorDocumento
      );
      setPage(0);
    }
    /* else if(showTable === 1) {
      window.scroll({
        top: 100,
        left: 100,
        behavior: 'smooth'
      });
    } */
  }, [busquedaFiltro, showTable, tipoTabla]);

  useEffect(() => {
    let nuevosImportesDocumentos = [];
    let nuevosTiposCambio = [];
    stableSort(rows, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => {
        nuevosImportesDocumentos.push(
          row.idMoneda !== 1 ? row.importeOriginal : row.pendiente
        );
        nuevosTiposCambio.push(row.idMoneda !== 1 ? 0 : -1);
        return null;
      });
    setDetallesFlujos({
      pagos: nuevosImportesDocumentos,
      tiposCambio: nuevosTiposCambio,
    });
  }, [order, orderBy, page, rows, rowsPerPage]);

  if (
    traerFlujosEfectivoLoading ||
    traerArchivosFlujosLoading ||
    traerFlujosEfectivoFiltradosLoading ||
    cambiarPrioridadProveedorLoading /* ||
    traerFlujosEfectivoAcomodadosLoading */
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    traerFlujosEfectivoError ||
    traerArchivosFlujosError ||
    traerFlujosEfectivoFiltradosError ||
    cambiarPrioridadProveedorError /* ||
    traerFlujosEfectivoAcomodadosError */
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

  const handleClickOpenPrioritariosDialog = () => {
    setOpenPrioritariosDialog(true);
  };

  const handleClosePrioritariosDialog = () => {
    setOpenPrioritariosDialog(false);
  };

  const handleClickOpenDialogTipoCambio = () => {
    setOpenDialogTipoCambio(true);
  };

  const handleCloseDialogTipoCambio = () => {
    setOpenDialogTipoCambio(false);
  };

  const getFlujosEfectivo = () => {
    if (flujosEfectivo.length > 0) {
      let columnas = [];
      let filas = [];
      for (let x = 0; x < flujosEfectivo.length; x++) {
        if (!columnas.includes(flujosEfectivo[x].Tipo)) {
          columnas.push(flujosEfectivo[x].Tipo);
        }
        if (!filas.includes(flujosEfectivo[x].RazonPrincipal)) {
          filas.push(flujosEfectivo[x].RazonPrincipal);
        }
      }

      columnas.sort();
      columnas.reverse();

      let ids = new Array(filas.length)
        .fill(null)
        .map((item) => new Array(columnas.length).fill(0));
      let pendientes = new Array(filas.length)
        .fill(null)
        .map((item) => new Array(columnas.length).fill(0));
      let sumaFilas = new Array(filas.length).fill(0);
      let sumaColumnas = new Array(columnas.length).fill(0);

      for (let x = 0; x < filas.length; x++) {
        for (let y = 0; y < columnas.length; y++) {
          for (let z = 0; z < flujosEfectivo.length; z++) {
            if (
              flujosEfectivo[z].Tipo === columnas[y] &&
              flujosEfectivo[z].RazonPrincipal === filas[x]
            ) {
              pendientes[x][y] =
                pendientes[x][y] + parseFloat(flujosEfectivo[z].Pendiente);
              ids[x][y] =
                ids[x][y] !== 0
                  ? ids[x][y] + "," + flujosEfectivo[z].id
                  : flujosEfectivo[z].id;
            }
          }
        }
      }

      for (let x = 0; x < pendientes.length; x++) {
        for (let y = 0; y < pendientes[x].length; y++) {
          sumaFilas[x] = sumaFilas[x] + parseFloat(pendientes[x][y]);
          sumaColumnas[y] = sumaColumnas[y] + parseFloat(pendientes[x][y]);
        }
      }
      let sumaTotal = 0;

      for (let x = 0; x < sumaFilas.length; x++) {
        sumaTotal = sumaTotal + sumaFilas[x];
      }

      return (
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Proveedor</strong>
              </TableCell>
              {columnas.map((columna, index) => (
                <TableCell align="right" key={index}>
                  <strong>{columna}</strong>
                </TableCell>
              ))}
              <TableCell align="right">
                <strong>Total Resultado</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filas.map((fila, index) => {
              return (
                <TableRow key={index} id={`fila-${fila}`}>
                  <TableCell component="th" scope="row">
                    {fila}
                  </TableCell>
                  {pendientes[index].map((pendiente, index2) => {
                    let validacion = 0;
                    let idsEstraidos = ids[index][index2].toString().split(",");
                    ciclo1: for (let x = 0; x < idsEstraidos.length; x++) {
                      for (let y = 0; y < documentosSeleccionados.length; y++) {
                        if (
                          documentosSeleccionados[y] ===
                          parseInt(idsEstraidos[x])
                        ) {
                          validacion = 1;
                          break ciclo1;
                        }
                      }
                    }
                    return (
                      <TableCell
                        align="right"
                        key={index2}
                        style={{
                          cursor: "pointer",
                          background: validacion === 1 ? "#388e3c" : "",
                        }}
                        onClick={() => {
                          executeTraerFlujosEfectivoFiltrados({
                            data: {
                              usuario: correoUsuario,
                              pwd: passwordUsuario,
                              rfc: rfcEmpresa,
                              idsubmenu: 46,
                              forma: 3,
                              razon: filas[index],
                              tipo: columnas[index2],
                              filtro: filtroApiTraerFlujosEfectivo,
                              pendiente: pendienteGuardado,
                            },
                          });
                          setShowTable(2);
                          setTituloFlujosFiltrados(
                            `Documentos con razon ${filas[index]} y tipo ${columnas[index2]}`
                          );
                        }}
                      >
                        ${number_format(pendiente, 2, ".", ",")}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    align="right"
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      executeTraerFlujosEfectivoFiltrados({
                        data: {
                          usuario: correoUsuario,
                          pwd: passwordUsuario,
                          rfc: rfcEmpresa,
                          idsubmenu: 46,
                          forma: 1,
                          razon: filas[index],
                          filtro: filtroApiTraerFlujosEfectivo,
                          pendiente: pendienteGuardado,
                        },
                      });
                      setShowTable(2);
                      setTituloFlujosFiltrados(
                        "Documentos con razon " + filas[index]
                      );
                    }}
                  >
                    ${number_format(sumaFilas[index], 2, ".", ",")}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow style={{ background: "#FAFAFA" }}>
              <TableCell component="th" scope="row">
                <strong>Total Resultado</strong>
              </TableCell>
              {sumaColumnas.map((columna, index) => (
                <TableCell
                  align="right"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    executeTraerFlujosEfectivoFiltrados({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 2,
                        tipo: columnas[index],
                        filtro: filtroApiTraerFlujosEfectivo,
                        pendiente: pendienteGuardado,
                      },
                    });
                    setShowTable(2);
                    setTituloFlujosFiltrados(
                      "Documentos con tipo " + columnas[index]
                    );
                  }}
                >
                  <strong>${number_format(columna, 2, ".", ",")}</strong>
                </TableCell>
              ))}
              <TableCell
                align="right"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  executeTraerFlujosEfectivoFiltrados({
                    data: {
                      usuario: correoUsuario,
                      pwd: passwordUsuario,
                      rfc: rfcEmpresa,
                      idsubmenu: 46,
                      forma: 5,
                      filtro: filtroApiTraerFlujosEfectivo,
                      pendiente: pendienteGuardado,
                    },
                  });
                  setShowTable(2);
                  setTituloFlujosFiltrados("Todos los documentos");
                }}
              >
                <strong>${number_format(sumaTotal, 2, ".", ",")}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else {
      return (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Sin Datos
        </Typography>
      );
    }
  };

  const handleToggleDocumentosEspecificos = (value, validacion) => () => {
    //revisar validacion de monedas extranjeras
    const currentIndex = documentosSeleccionados.indexOf(value);
    const newChecked = [...documentosSeleccionados];

    if (currentIndex === -1) {
      if (validacion === 1) {
        newChecked.push(value);
      }
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setDocumentosSeleccionados(newChecked);
  };

  const handleToggleTablaPorDocumentos = (value, validacion) => () => {
    const currentIndex = documentosSeleccionados.indexOf(value);
    const newChecked = [...documentosSeleccionados];

    if (currentIndex === -1) {
      if (validacion === 1) {
        newChecked.push(value);
      }
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setDocumentosSeleccionados(newChecked);
  };

  const getDocumentosEspecificos = () => {
    setValidacionEjecucionGetPagosApi(false);
    if (flujosEfectivoFiltrados.length > 0) {
      return flujosEfectivoFiltrados.map((flujoEfectivo, index) => {
        const labelId = `checkbox-list-label-${index}`;
        const posPago = instruccionesPagoProveedores.ids.indexOf(
          flujoEfectivo.id
        );
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <Checkbox
                onClick={handleToggleDocumentosEspecificos(
                  flujoEfectivo.id,
                  detallesFlujos.pagos[index] === 0 ||
                    detallesFlujos.tiposCambio[index] === 0 ||
                    (flujoEfectivo.IdMoneda === 1 &&
                      detallesFlujos.pagos[index] > flujoEfectivo.Pendiente) ||
                    (flujoEfectivo.IdMoneda !== 1 &&
                      detallesFlujos.pagos[index] >
                        flujoEfectivo.ImporteOriginal)
                    ? 0
                    : 1
                )}
                checked={
                  documentosSeleccionados.indexOf(flujoEfectivo.id) !== -1
                }
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
                onChange={(e) => {
                  let nuevosIds = instrucciones.ids;
                  let nuevosTipos = instrucciones.tipos;
                  let nuevosProveedores = instrucciones.proveedores;
                  let nuevosRfcProveedores = instrucciones.rfcProveedores;
                  let nuevosImportes = instrucciones.importes;
                  let nuevosIdsCuentasOrigen = instrucciones.idsCuentasOrigen;
                  let nuevosIdsBancosOrigen = instrucciones.idsBancosOrigen;
                  let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                  let nuevosValoresCuentasOrigen =
                    instrucciones.valoresCuentasOrigen;
                  let nuevosBancosOrigen = instrucciones.bancosOrigen;
                  let nuevasSucursalesOrigen = instrucciones.sucursalesOrigen;
                  let nuevosIdsCuentasDestino = instrucciones.idsCuentasDestino;
                  let nuevosIdsBancosDestino = instrucciones.idsBancosDestino;
                  let nuevasCuentasDestino = instrucciones.cuentasDestino;
                  let nuevosValoresCuentasDestino =
                    instrucciones.valoresCuentasDestino;
                  let nuevasSucursalesDestino = instrucciones.sucursalesDestino;
                  let nuevasFechas = instrucciones.fechas;
                  let nuevasLlavesMatch = instrucciones.llavesMatch;
                  let nuevosPagos = instrucciones.pagos;
                  let nuevosCorreos = instrucciones.correos;

                  let ids = instruccionesPagoProveedores.ids;
                  let proveedoresNombres =
                    instruccionesPagoProveedores.proveedores;
                  let importes = instruccionesPagoProveedores.importes;
                  let rfcs = instruccionesPagoProveedores.rfcs;
                  let pagos = instruccionesPagoProveedores.pagos;
                  let importesOriginales =
                    instruccionesPagoProveedores.importesOriginales;
                  let monedas = instruccionesPagoProveedores.monedas;
                  let tiposCambio = instruccionesPagoProveedores.tiposCambio;
                  let pagosOriginales =
                    instruccionesPagoProveedores.pagosOriginales;
                  let correos = instruccionesPagoProveedores.correos;
                  let cuentasOrigenNombre =
                    instruccionesPagoProveedores.cuentasOrigen;
                  let cuentasDestinoNombre =
                    instruccionesPagoProveedores.cuentasDestino;

                  /* let importeAplicado =
                    flujoEfectivo.IdMoneda !== 1
                      ? parseFloat(tipoCambio.valores[index]) *
                        parseFloat(flujoEfectivo.Pendiente)
                      : parseFloat(flujoEfectivo.Pendiente); */
                  //let importeAplicado = detallesFlujos.pagos[index];
                  if (e.target.checked) {
                    if (
                      (flujoEfectivo.IdMoneda === 1 &&
                        detallesFlujos.pagos[index] >
                          flujoEfectivo.Pendiente) ||
                      (flujoEfectivo.IdMoneda !== 1 &&
                        detallesFlujos.pagos[index] >
                          flujoEfectivo.ImporteOriginal)
                    ) {
                      swal(
                        "Error",
                        "El pago no puede ser mayor al pendiente del documento",
                        "warning"
                      );
                      return;
                    }
                    if (detallesFlujos.pagos[index] === 0) {
                      swal(
                        "Error",
                        "El pago no puede ser igual a 0",
                        "warning"
                      );
                      return;
                    }
                    if (detallesFlujos.tiposCambio[index] === 0) {
                      swal("Error", "Ingrese un tipo de cambio", "warning");
                      return;
                    }
                    let importeAplicado =
                      flujoEfectivo.IdMoneda !== 1
                        ? detallesFlujos.pagos[index] *
                          detallesFlujos.tiposCambio[index]
                        : detallesFlujos.pagos[index];
                    setAplicado(aplicado + importeAplicado);
                    setRestante(disponible - (aplicado + importeAplicado));
                    let posicion = nuevosProveedores.indexOf(
                      flujoEfectivo.Razon
                    );
                    const datosProveedor = proveedores.filter(
                      (proveedor) =>
                        proveedor.razonsocial === flujoEfectivo.Razon &&
                        proveedor.rfc === flujoEfectivo.cRFC
                    );
                    let correosProveedor = [];
                    if (datosProveedor[0].Correo1 !== null) {
                      correosProveedor.push({
                        correo: datosProveedor[0].Correo1,
                        enviar: true,
                        obligatorio: true,
                      });
                    }
                    if (datosProveedor[0].Correo2 !== null) {
                      correosProveedor.push({
                        correo: datosProveedor[0].Correo2,
                        enviar: true,
                        obligatorio: true,
                      });
                    }
                    if (datosProveedor[0].Correo3 !== null) {
                      correosProveedor.push({
                        correo: datosProveedor[0].Correo3,
                        enviar: true,
                        obligatorio: true,
                      });
                    }
                    const cuentasDestinosProveedor = cuentasDestino.filter(
                      (cuenta) => cuenta.RFC === flujoEfectivo.cRFC
                    );
                    if (posicion === -1) {
                      nuevosIds.push(flujoEfectivo.id);
                      nuevosTipos.push(1);
                      nuevosProveedores.push(flujoEfectivo.Razon);
                      nuevosRfcProveedores.push(flujoEfectivo.cRFC);
                      nuevosImportes.push(parseFloat(flujoEfectivo.Pendiente));
                      nuevosIdsCuentasOrigen.push(0);
                      nuevosIdsBancosOrigen.push(0);
                      nuevasCuentasOrigen.push("");
                      nuevosValoresCuentasOrigen.push("-1");
                      nuevosBancosOrigen.push("");
                      nuevasSucursalesOrigen.push("");
                      /* const cuentasDestinosProveedor = cuentasDestino.filter(
                        (cuenta) => cuenta.RFC === flujoEfectivo.cRFC
                      ); */
                      nuevosIdsCuentasDestino.push(
                        cuentasDestinosProveedor.length === 1
                          ? cuentasDestinosProveedor[0].Id
                          : 0
                      );
                      nuevosIdsBancosDestino.push(
                        cuentasDestinosProveedor.length === 1
                          ? cuentasDestinosProveedor[0].IdBanco
                          : 0
                      );
                      nuevasCuentasDestino.push(
                        cuentasDestinosProveedor.length === 1
                          ? cuentasDestinosProveedor[0].Layout
                          : ""
                      );
                      nuevosValoresCuentasDestino.push(
                        cuentasDestinosProveedor.length === 1 ? 0 : "-1"
                      );
                      nuevasSucursalesDestino.push(
                        cuentasDestinosProveedor.length === 1
                          ? cuentasDestinosProveedor[0].Sucursal !== null
                            ? cuentasDestinosProveedor[0].Sucursal
                            : ""
                          : ""
                      );
                      nuevasFechas.push(moment().format("YYYY-MM-DD"));
                      nuevasLlavesMatch.push("");
                      nuevosPagos.push(importeAplicado);
                      nuevosCorreos.push(correosProveedor);
                    } else {
                      nuevosIds[posicion] =
                        nuevosIds[posicion] + "," + flujoEfectivo.id;
                      nuevosTipos[posicion] = nuevosTipos[posicion] + "-$-1";
                      nuevosImportes[posicion] =
                        parseFloat(nuevosImportes[posicion]) +
                        parseFloat(flujoEfectivo.Pendiente);
                      nuevosPagos[posicion] =
                        nuevosPagos[posicion] + importeAplicado;
                    }

                    ids.push(flujoEfectivo.id);
                    proveedoresNombres.push(flujoEfectivo.Razon);
                    importes.push(parseFloat(flujoEfectivo.Pendiente));
                    rfcs.push(flujoEfectivo.cRFC);
                    pagos.push(importeAplicado);
                    importesOriginales.push(
                      parseFloat(flujoEfectivo.ImporteOriginal)
                    );
                    monedas.push(flujoEfectivo.Moneda);
                    tiposCambio.push(detallesFlujos.tiposCambio[index]);
                    pagosOriginales.push(detallesFlujos.pagos[index]);
                    correos.push(correosProveedor);
                    cuentasOrigenNombre.push("");
                    cuentasDestinoNombre.push(
                      cuentasDestinosProveedor.length === 1
                        ? cuentasDestinosProveedor[0].Layout
                        : ""
                    );

                    /* executeGuardarFlwPagos({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 1,
                        paso: 1,
                        IdFlw: flujoEfectivo.id,
                        IdUsuario: idUsuario,
                        Importe: importeAplicado,
                        LlaveMatch: "",
                        Tipo: 1,
                        RFC: flujoEfectivo.cRFC,
                        Proveedor: flujoEfectivo.Razon,
                      },
                    }); */
                  } else {
                    let importeAplicado =
                      flujoEfectivo.IdMoneda !== 1
                        ? pagosOriginales[posPago] * tiposCambio[posPago]
                        : pagosOriginales[posPago];
                    setAplicado(aplicado - importeAplicado);
                    setRestante(restante + importeAplicado);

                    let contador = 0;
                    for (
                      let x = 0;
                      x < instruccionesPagoProveedores.proveedores.length;
                      x++
                    ) {
                      if (
                        instruccionesPagoProveedores.proveedores[x] ===
                        flujoEfectivo.Razon
                      ) {
                        contador++;
                      }
                    }

                    let posicionEliminar = 0;
                    cicloInstrucciones1: for (
                      let x = 0;
                      x < instrucciones.proveedores.length;
                      x++
                    ) {
                      let ids = instrucciones.ids[x].toString().split(",");
                      for (let y = 0; y < ids.length; y++) {
                        if (parseInt(ids[y]) === flujoEfectivo.id) {
                          posicionEliminar = x;
                          break cicloInstrucciones1;
                        }
                      }
                    }

                    if (contador === 1) {
                      nuevosIds.splice(posicionEliminar, 1);
                      nuevosTipos.splice(posicionEliminar, 1);
                      nuevosProveedores.splice(posicionEliminar, 1);
                      nuevosRfcProveedores.splice(posicionEliminar, 1);
                      nuevosImportes.splice(posicionEliminar, 1);
                      nuevosIdsCuentasOrigen.splice(posicionEliminar, 1);
                      nuevosIdsBancosOrigen.splice(posicionEliminar, 1);
                      nuevasCuentasOrigen.splice(posicionEliminar, 1);
                      nuevosValoresCuentasOrigen.splice(posicionEliminar, 1);
                      nuevosBancosOrigen.splice(posicionEliminar, 1);
                      nuevasSucursalesOrigen.splice(posicionEliminar, 1);
                      nuevosIdsCuentasDestino.splice(posicionEliminar, 1);
                      nuevosIdsBancosDestino.splice(posicionEliminar, 1);
                      nuevasCuentasDestino.splice(posicionEliminar, 1);
                      nuevosValoresCuentasDestino.splice(posicionEliminar, 1);
                      nuevasSucursalesDestino.splice(posicionEliminar, 1);
                      nuevasFechas.splice(posicionEliminar, 1);
                      nuevasLlavesMatch.splice(posicionEliminar, 1);
                      nuevosPagos.splice(posicionEliminar, 1);
                      nuevosCorreos.splice(posicionEliminar, 1);
                    } else {
                      nuevosImportes[posicionEliminar] =
                        nuevosImportes[posicionEliminar] -
                        parseFloat(flujoEfectivo.Pendiente);
                      nuevosPagos[posicionEliminar] =
                        nuevosPagos[posicionEliminar] - importeAplicado;
                      let ids = instrucciones.ids[posicionEliminar]
                        .toString()
                        .split(",")
                        .map((id) => parseFloat(id));
                      let pos = ids.indexOf(flujoEfectivo.id);
                      ids.splice(pos, 1);

                      nuevosIds[posicionEliminar] = ids[0];
                      if (ids.length > 1) {
                        for (let x = 1; x < ids.length; x++) {
                          nuevosIds[posicionEliminar] =
                            nuevosIds[posicionEliminar] + "," + ids[x];
                        }
                      }
                    }

                    let pos = ids.indexOf(flujoEfectivo.id);
                    ids.splice(pos, 1);
                    proveedoresNombres.splice(pos, 1);
                    importes.splice(pos, 1);
                    rfcs.splice(pos, 1);
                    pagos.splice(pos, 1);
                    importesOriginales.splice(pos, 1);
                    monedas.splice(pos, 1);
                    tiposCambio.splice(pos, 1);
                    pagosOriginales.splice(pos, 1);
                    correos.splice(pos, 1);
                    cuentasOrigenNombre.splice(pos, 1);
                    cuentasDestinoNombre.splice(pos, 1);

                    /* executeGuardarFlwPagos({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 2,
                        IdFlw: flujoEfectivo.id,
                        IdUsuario: idUsuario,
                      },
                    }); */
                  }
                  setInstrucciones({
                    ids: nuevosIds,
                    tipos: nuevosTipos,
                    proveedores: nuevosProveedores,
                    rfcProveedores: nuevosRfcProveedores,
                    importes: nuevosImportes,
                    idsCuentasOrigen: nuevosIdsCuentasOrigen,
                    idsBancosOrigen: nuevosIdsBancosOrigen,
                    cuentasOrigen: nuevasCuentasOrigen,
                    valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                    bancosOrigen: nuevosBancosOrigen,
                    sucursalesOrigen: nuevasSucursalesOrigen,
                    idsCuentasDestino: nuevosIdsCuentasDestino,
                    idsBancosDestino: nuevosIdsBancosDestino,
                    cuentasDestino: nuevasCuentasDestino,
                    valoresCuentasDestino: nuevosValoresCuentasDestino,
                    sucursalesDestino: nuevasSucursalesDestino,
                    fechas: nuevasFechas,
                    llavesMatch: nuevasLlavesMatch,
                    pagos: nuevosPagos,
                    correos: nuevosCorreos,
                  });

                  setInstruccionesPagoProveedores({
                    ids: ids,
                    proveedores: proveedoresNombres,
                    importes: importes,
                    rfcs: rfcs,
                    pagos: pagos,
                    importesOriginales: importesOriginales,
                    monedas: monedas,
                    tiposCambio: tiposCambio,
                    pagosOriginales: pagosOriginales,
                    correos: correos,
                    cuentasOrigen: cuentasOrigenNombre,
                    cuentasDestino: cuentasDestinoNombre,
                  });
                }}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              {flujoEfectivo.IdDoc}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.Vence}</TableCell>
            <TableCell align="right">{flujoEfectivo.Suc}</TableCell>
            <TableCell align="right">{flujoEfectivo.cRFC}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.Pendiente, 2, ".", ",")}
              {flujoEfectivo.IdMoneda !== 1 ? (
                <div>
                  <Typography variant="subtitle2">
                    <strong>Pendiente Original: </strong>
                  </Typography>
                  <Typography variant="subtitle2">
                    {`$${number_format(
                      flujoEfectivo.ImporteOriginal,
                      2,
                      ".",
                      ","
                    )} ${flujoEfectivo.Moneda}`}
                  </Typography>
                  <Typography variant="subtitle2">
                    <strong>Tipo Cambio Original: </strong>
                  </Typography>
                  <Typography variant="subtitle2">
                    {`$${number_format(flujoEfectivo.TipoCambio, 2, ".", ",")}`}
                  </Typography>
                </div>
              ) : null}
            </TableCell>
            <TableCell align="right">
              <Grid container spacing={3}>
                {flujoEfectivo.IdMoneda !== 1 ? (
                  <Grid item xs={12}>
                    <TextField
                      className={classes.textFields}
                      id="tipoDeCambioActualTablaPorProveedores"
                      label={`Tipo Cambio Actual`}
                      type="text"
                      disabled={
                        documentosSeleccionados.indexOf(flujoEfectivo.id) !== -1
                      }
                      margin="normal"
                      value={
                        posPago !== -1
                          ? instruccionesPagoProveedores.tiposCambio[posPago]
                          : detallesFlujos.tiposCambio[index]
                      }
                      inputProps={{
                        maxLength: 20,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      onKeyPress={(e) => {
                        doubleKeyValidation(e, 2);
                      }}
                      onChange={(e) => {
                        /* let nuevoTipoCambio = tipoCambio.valores;
                        nuevoTipoCambio[index] =
                          typeof e.target.value !== "undefined"
                            ? parseFloat(e.target.value)
                            : 0;
                        setTipoCambio({
                          valores: nuevoTipoCambio,
                        }); */
                        let nuevosTiposCambio = detallesFlujos.tiposCambio;
                        nuevosTiposCambio[index] =
                          typeof e.target.value !== "undefined"
                            ? parseFloat(e.target.value)
                            : 0;
                        setDetallesFlujos({
                          ...detallesFlujos,
                          tiposCambio: nuevosTiposCambio,
                        });
                      }}
                    />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <TextField
                    className={classes.textFields}
                    id={`pagoDocumentosEspecificos${index}`}
                    label={`Pago`}
                    type="text"
                    margin="normal"
                    disabled={
                      documentosSeleccionados.indexOf(flujoEfectivo.id) !== -1
                    }
                    //checar value de pagos y tipos cambio de flujos especificos
                    value={
                      posPago !== -1
                        ? flujoEfectivo.IdMoneda !== 1
                          ? instruccionesPagoProveedores.pagosOriginales[
                              posPago
                            ]
                          : instruccionesPagoProveedores.pagos[posPago]
                        : detallesFlujos.pagos[index]
                    }
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      let nuevosPagosFlujos = detallesFlujos.pagos;
                      nuevosPagosFlujos[index] =
                        typeof e.target.value !== "undefined"
                          ? parseFloat(e.target.value)
                          : 0;
                      setDetallesFlujos({
                        ...detallesFlujos,
                        pagos: nuevosPagosFlujos,
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </TableCell>
            {/* <TableCell align="right">...</TableCell> */}
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={6}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  let totalFiltroTablaPorDocumento = 0.0;
  const sumarPendientesFiltro = (pendiente, index) => {
    if (index === 0) {
      totalFiltroTablaPorDocumento = 0.0;
    }
    totalFiltroTablaPorDocumento = totalFiltroTablaPorDocumento + pendiente;
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={8}
                  sm={4}
                  md={2}
                  style={{ alignSelf: "flex-end" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="soloProveedoresPrioritarios"
                        color="primary"
                        checked={
                          filtroApiTraerFlujosEfectivo === 3 ||
                          filtroApiTraerFlujosEfectivo === 6
                        }
                        onChange={(e) => {
                          setPendienteGuardado(pendiente);
                          if (e.target.checked) {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo + 2
                            );
                          } else {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo - 2
                            );
                          }
                        }}
                      />
                    }
                    label="Solo Proveedores Prioritarios"
                  />
                </Grid>
                <Grid item xs={4} sm={2} md={1} style={{ alignSelf: "center" }}>
                  <Tooltip title="Configurar proveedores prioritarios">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleClickOpenPrioritariosDialog();
                      }}
                    >
                      ...
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "flex-end" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="soloDocumentosPrioritarios"
                        color="primary"
                        checked={
                          filtroApiTraerFlujosEfectivo === 4 ||
                          filtroApiTraerFlujosEfectivo === 6
                        }
                        onChange={(e) => {
                          setPendienteGuardado(pendiente);
                          if (e.target.checked) {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo + 3
                            );
                          } else {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo - 3
                            );
                          }
                        }}
                      />
                    }
                    label="Solo Documentos Prioritarios"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    className={classes.textFields}
                    id="pendienteMayorIgual"
                    label="Pendiente >="
                    type="text"
                    margin="normal"
                    value={pendiente}
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      setPendiente(
                        typeof e.target.value !== "undefined"
                          ? e.target.value
                          : 0
                      );
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "center" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%" }}
                    onClick={() => {
                      setPendienteGuardado(pendiente);
                      if (pendiente === pendienteGuardado) {
                        executeTraerFlujosEfectivo();
                      }
                    }}
                  >
                    Consultar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center", margin: "15px" }}
                  >
                    {`Última Actualización: ${
                      ultimaActualizacionFlujos !== null
                        ? ultimaActualizacionFlujos
                        : "No Actualizada"
                    }`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={7}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      Tipo De Presentación
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="tablas"
                      name="opcionTablas"
                      value={tipoTabla}
                      onChange={(e) => {
                        //console.log(e.target.value);
                        setTipoTabla(parseInt(e.target.value));
                        setShowTable(parseInt(e.target.value) === 1 ? 3 : 1);
                        setBusquedaFiltro("");
                      }}
                    >
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Por Documento"
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label="Por Proveedor"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={2} sm={1} md={1}>
                  <Tooltip title="Limpiar Filtro">
                    <IconButton
                      aria-label="filtro"
                      style={{
                        float: "right",
                        width: fullScreenDialog ? "-webkit-fill-available" : "",
                      }}
                      onClick={() => {
                        setBusquedaFiltro("");
                      }}
                    >
                      <ClearAllIcon style={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={10} sm={8} md={2}>
                  <TextField
                    className={classes.textFields}
                    id="txtBusquedaTablas"
                    label="Filtro"
                    value={busquedaFiltro}
                    onChange={(e) => {
                      setBusquedaFiltro(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%" }}
                    disabled /* ={showTable === 3} */
                    onClick={() => {
                      console.log(busquedaFiltro);
                    }}
                  >
                    Ir
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
              <Paper className={classes.paper}>
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
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell padding="checkbox" />
                                <TableCell align="right">
                                  {row.proveedor}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 3,
                                        razon: row.proveedor,
                                        tipo: "V4 +45",
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      `Documentos con razon ${row.proveedor} y tipo V4 +45`
                                    );
                                  }}
                                >
                                  ${number_format(row.v4, 2, ".", ",")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 3,
                                        razon: row.proveedor,
                                        tipo: "V3 30-45",
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      `Documentos con razon ${row.proveedor} y tipo V3 30-45`
                                    );
                                  }}
                                >
                                  ${number_format(row.v3, 2, ".", ",")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 3,
                                        razon: row.proveedor,
                                        tipo: "V2 15-30",
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      `Documentos con razon ${row.proveedor} y tipo V2 15-30`
                                    );
                                  }}
                                >
                                  ${number_format(row.v2, 2, ".", ",")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 3,
                                        razon: row.proveedor,
                                        tipo: "V1 01-15",
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      `Documentos con razon ${row.proveedor} y tipo V1 01-15`
                                    );
                                  }}
                                >
                                  ${number_format(row.v1, 2, ".", ",")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 3,
                                        razon: row.proveedor,
                                        tipo: "PorVencer",
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      `Documentos con razon ${row.proveedor} y tipo Por Vencer`
                                    );
                                  }}
                                >
                                  ${number_format(row.porVencer, 2, ".", ",")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    executeTraerFlujosEfectivoFiltrados({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        forma: 1,
                                        razon: row.proveedor,
                                        filtro: filtroApiTraerFlujosEfectivo,
                                        pendiente: pendienteGuardado,
                                      },
                                    });
                                    setShowTable(2);
                                    setTituloFlujosFiltrados(
                                      "Documentos con razon " + row.proveedor
                                    );
                                  }}
                                >
                                  $
                                  {number_format(
                                    row.totalResultado,
                                    2,
                                    ".",
                                    ","
                                  )}
                                </TableCell>
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
                              No hay flujos pendientes
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
                  page={rows.length > 0 ? page : 0}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid> */}
            <Grid item xs={12}>
              {showTable === 1 ? (
                <TableContainer>{getFlujosEfectivo()}</TableContainer>
              ) : showTable === 2 ? (
                <Grid item xs={12} style={{ padding: "15px" }}>
                  <Toolbar>
                    <Grid container alignItems="center">
                      <Grid item xs={12} style={{ alignSelf: "flex-end" }}>
                        <Typography
                          className={classes.titleTable}
                          variant="h6"
                          id="tableTitle"
                        >
                          <Tooltip title="Regresar">
                            <IconButton
                              aria-label="regresar"
                              onClick={() => {
                                setShowTable(1);
                              }}
                            >
                              <ArrowBackIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          {tituloFlujosFiltrados}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Toolbar>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead style={{ background: "#FAFAFA" }}>
                            <TableRow>
                              <TableCell padding="checkbox" />
                              <TableCell>
                                <strong>#Doc</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>Vencimiento</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>Sucursal</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>RFC</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>Pendiente</strong>
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ width: "250px" }}
                              >
                                <strong>Detalles</strong>
                              </TableCell>
                              {/* <TableCell align="right">
                                <strong>
                                  <SettingsIcon />
                                </strong>
                              </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getDocumentosEspecificos()}
                            <TableRow>
                              <TableCell colSpan="5" />
                              <TableCell align="right">
                                <strong>Total Pendiente: </strong>
                              </TableCell>
                              <TableCell align="right">
                                ${number_format(totalEspecificos, 2, ".", ",")}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Paper className={classes.paper}>
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
                        headCells={headCellsTablaPorDocumento}
                      />
                      <TableBody>
                        {rows.length > 0 ? (
                          stableSort(rows, getComparator(order, orderBy))
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => {
                              sumarPendientesFiltro(row.pendiente, index);
                              const labelId = `enhanced-table-checkbox-${index}`;
                              const posPago = instruccionesPagoProveedores.ids.indexOf(
                                row.id
                              );
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                  /* selected={documentosSeleccionados.indexOf(
                                    row.id
                                  ) !== -1} */
                                  style={{
                                    backgroundColor:
                                      documentosSeleccionados.indexOf(
                                        row.id
                                      ) !== -1
                                        ? "#a5d6a7"
                                        : "#ffffff",
                                  }}
                                >
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      color="primary"
                                      onClick={handleToggleTablaPorDocumentos(
                                        row.id,
                                        detallesFlujos.pagos[index] === 0 ||
                                          detallesFlujos.tiposCambio[index] ===
                                            0 ||
                                          (row.idMoneda === 1 &&
                                            detallesFlujos.pagos[index] >
                                              row.pendiente) ||
                                          (row.idMoneda !== 1 &&
                                            detallesFlujos.pagos[index] >
                                              row.importeOriginal)
                                          ? 0
                                          : 1
                                      )}
                                      checked={
                                        documentosSeleccionados.indexOf(
                                          row.id
                                        ) !== -1
                                      }
                                      onChange={(e) => {
                                        /* console.log(instrucciones);
                                        console.log(instruccionesPagoProveedores); */
                                        let nuevosIds = instrucciones.ids;
                                        let nuevosTipos = instrucciones.tipos;
                                        let nuevosProveedores =
                                          instrucciones.proveedores;
                                        let nuevosRfcProveedores =
                                          instrucciones.rfcProveedores;
                                        let nuevosImportes =
                                          instrucciones.importes;
                                        let nuevosIdsCuentasOrigen =
                                          instrucciones.idsCuentasOrigen;
                                        let nuevosIdsBancosOrigen =
                                          instrucciones.idsBancosOrigen;
                                        let nuevasCuentasOrigen =
                                          instrucciones.cuentasOrigen;
                                        let nuevasSucursalesOrigen =
                                          instrucciones.sucursalesOrigen;
                                        let nuevosValoresCuentasOrigen =
                                          instrucciones.valoresCuentasOrigen;
                                        let nuevosBancosOrigen =
                                          instrucciones.bancosOrigen;
                                        let nuevosIdsCuentasDestino =
                                          instrucciones.idsCuentasDestino;
                                        let nuevosIdsBancosDestino =
                                          instrucciones.idsBancosDestino;
                                        let nuevasCuentasDestino =
                                          instrucciones.cuentasDestino;
                                        let nuevosValoresCuentasDestino =
                                          instrucciones.valoresCuentasDestino;
                                        let nuevasSucursalesDestino =
                                          instrucciones.sucursalesDestino;
                                        let nuevasFechas = instrucciones.fechas;
                                        let nuevasLlavesMatch =
                                          instrucciones.llavesMatch;
                                        let nuevosPagos = instrucciones.pagos;
                                        let nuevosCorreos =
                                          instrucciones.correos;

                                        let ids =
                                          instruccionesPagoProveedores.ids;
                                        let proveedoresNombres =
                                          instruccionesPagoProveedores.proveedores;
                                        let importes =
                                          instruccionesPagoProveedores.importes;
                                        let rfcs =
                                          instruccionesPagoProveedores.rfcs;
                                        let pagos =
                                          instruccionesPagoProveedores.pagos;
                                        let importesOriginales =
                                          instruccionesPagoProveedores.importesOriginales;
                                        let monedas =
                                          instruccionesPagoProveedores.monedas;
                                        let tiposCambio =
                                          instruccionesPagoProveedores.tiposCambio;
                                        let pagosOriginales =
                                          instruccionesPagoProveedores.pagosOriginales;
                                        let correos =
                                          instruccionesPagoProveedores.correos;
                                        let cuentasOrigenNombre =
                                          instruccionesPagoProveedores.cuentasOrigen;
                                        let cuentasDestinoNombre =
                                          instruccionesPagoProveedores.cuentasDestino;

                                        /* let importeAplicado =
                                          row.idMoneda !== 1
                                            ? parseFloat(
                                                tipoCambio.valores[index]
                                              ) * parseFloat(row.pendiente)
                                            : parseFloat(row.pendiente); */
                                        if (e.target.checked) {
                                          if (
                                            (row.idMoneda === 1 &&
                                              detallesFlujos.pagos[index] >
                                                row.pendiente) ||
                                            (row.idMoneda !== 1 &&
                                              detallesFlujos.pagos[index] >
                                                row.importeOriginal)
                                          ) {
                                            swal(
                                              "Error",
                                              "El pago no puede ser mayor al pendiente del documento",
                                              "warning"
                                            );
                                            return;
                                          }
                                          if (
                                            detallesFlujos.pagos[index] === 0
                                          ) {
                                            swal(
                                              "Error",
                                              "El pago no puede ser igual a 0",
                                              "warning"
                                            );
                                            return;
                                          }
                                          if (
                                            detallesFlujos.tiposCambio[
                                              index
                                            ] === 0
                                          ) {
                                            swal(
                                              "Error",
                                              "Ingrese un tipo de cambio",
                                              "warning"
                                            );
                                            return;
                                          }
                                          let importeAplicado =
                                            row.idMoneda !== 1
                                              ? detallesFlujos.pagos[index] *
                                                detallesFlujos.tiposCambio[
                                                  index
                                                ]
                                              : detallesFlujos.pagos[index];
                                          setAplicado(
                                            aplicado + importeAplicado
                                          );
                                          setRestante(
                                            disponible -
                                              (aplicado + importeAplicado)
                                          );
                                          let posicion = nuevosProveedores.indexOf(
                                            row.proveedor
                                          );
                                          const datosProveedor = proveedores.filter(
                                            (proveedor) =>
                                              proveedor.razonsocial ===
                                                row.proveedor &&
                                              proveedor.rfc === row.rfc
                                          );
                                          let correosProveedor = [];
                                          if (
                                            datosProveedor[0].Correo1 !== null
                                          ) {
                                            correosProveedor.push({
                                              correo: datosProveedor[0].Correo1,
                                              enviar: true,
                                              obligatorio: true,
                                            });
                                          }
                                          if (
                                            datosProveedor[0].Correo2 !== null
                                          ) {
                                            correosProveedor.push({
                                              correo: datosProveedor[0].Correo2,
                                              enviar: true,
                                              obligatorio: true,
                                            });
                                          }
                                          if (
                                            datosProveedor[0].Correo3 !== null
                                          ) {
                                            correosProveedor.push({
                                              correo: datosProveedor[0].Correo3,
                                              enviar: true,
                                              obligatorio: true,
                                            });
                                          }
                                          const cuentasDestinosProveedor = cuentasDestino.filter(
                                            (cuenta) => cuenta.RFC === row.rfc
                                          );
                                          if (posicion === -1) {
                                            nuevosIds.push(row.id);
                                            nuevosTipos.push(1);
                                            nuevosProveedores.push(
                                              row.proveedor
                                            );
                                            nuevosRfcProveedores.push(row.rfc);
                                            nuevosImportes.push(
                                              parseFloat(row.pendiente)
                                            );
                                            nuevosIdsCuentasOrigen.push(0);
                                            nuevosIdsBancosOrigen.push(0);
                                            nuevasCuentasOrigen.push("");
                                            nuevasSucursalesOrigen.push("");
                                            nuevosValoresCuentasOrigen.push(
                                              "-1"
                                            );
                                            nuevosBancosOrigen.push("");
                                            /* const cuentasDestinosProveedor = cuentasDestino.filter(
                                              (cuenta) => cuenta.RFC === row.rfc
                                            ); */
                                            nuevosIdsCuentasDestino.push(
                                              cuentasDestinosProveedor.length ===
                                                1
                                                ? cuentasDestinosProveedor[0].Id
                                                : 0
                                            );
                                            nuevosIdsBancosDestino.push(
                                              cuentasDestinosProveedor.length ===
                                                1
                                                ? cuentasDestinosProveedor[0]
                                                    .IdBanco
                                                : 0
                                            );
                                            nuevasCuentasDestino.push(
                                              cuentasDestinosProveedor.length ===
                                                1
                                                ? cuentasDestinosProveedor[0]
                                                    .Layout
                                                : ""
                                            );
                                            nuevosValoresCuentasDestino.push(
                                              cuentasDestinosProveedor.length ===
                                                1
                                                ? 0
                                                : "-1"
                                            );
                                            nuevasSucursalesDestino.push(
                                              cuentasDestinosProveedor.length ===
                                                1
                                                ? cuentasDestinosProveedor[0]
                                                    .Sucursal !== null
                                                  ? cuentasDestinosProveedor[0]
                                                      .Sucursal
                                                  : ""
                                                : ""
                                            );
                                            nuevasFechas.push(
                                              moment().format("YYYY-MM-DD")
                                            );
                                            nuevasLlavesMatch.push("");
                                            nuevosPagos.push(importeAplicado);
                                            nuevosCorreos.push(
                                              correosProveedor
                                            );
                                          } else {
                                            nuevosIds[posicion] =
                                              nuevosIds[posicion] +
                                              "," +
                                              row.id;
                                            nuevosTipos[posicion] = nuevosTipos[posicion] + "-$-1";
                                            nuevosImportes[posicion] =
                                              parseFloat(
                                                nuevosImportes[posicion]
                                              ) + parseFloat(row.pendiente);
                                            nuevosPagos[posicion] =
                                              nuevosPagos[posicion] +
                                              importeAplicado;
                                          }

                                          ids.push(row.id);
                                          proveedoresNombres.push(
                                            row.proveedor
                                          );
                                          importes.push(row.pendiente);
                                          rfcs.push(row.rfc);
                                          pagos.push(importeAplicado);
                                          importesOriginales.push(
                                            row.importeOriginal
                                          );
                                          monedas.push(row.moneda);
                                          tiposCambio.push(
                                            detallesFlujos.tiposCambio[index]
                                          );
                                          pagosOriginales.push(
                                            detallesFlujos.pagos[index]
                                          );
                                          correos.push(correosProveedor);
                                          cuentasOrigenNombre.push("");
                                          cuentasDestinoNombre.push(
                                            cuentasDestinosProveedor.length ===
                                              1
                                              ? cuentasDestinosProveedor[0]
                                                  .Layout
                                              : ""
                                          );
                                        } else {
                                          let importeAplicado =
                                            row.idMoneda !== 1
                                              ? pagosOriginales[posPago] *
                                                tiposCambio[posPago]
                                              : pagosOriginales[posPago];
                                          setAplicado(
                                            aplicado - importeAplicado
                                          );
                                          setRestante(
                                            restante + importeAplicado
                                          );

                                          let contador = 0;
                                          for (
                                            let x = 0;
                                            x <
                                            instruccionesPagoProveedores
                                              .proveedores.length;
                                            x++
                                          ) {
                                            if (
                                              instruccionesPagoProveedores
                                                .proveedores[x] ===
                                              row.proveedor
                                            ) {
                                              contador++;
                                            }
                                          }

                                          let posicionEliminar = 0;
                                          cicloInstrucciones1: for (
                                            let x = 0;
                                            x <
                                            instrucciones.proveedores.length;
                                            x++
                                          ) {
                                            let ids = instrucciones.ids[x]
                                              .toString()
                                              .split(",");
                                            for (
                                              let y = 0;
                                              y < ids.length;
                                              y++
                                            ) {
                                              if (parseInt(ids[y]) === row.id) {
                                                posicionEliminar = x;
                                                break cicloInstrucciones1;
                                              }
                                            }
                                          }

                                          if (contador === 1) {
                                            nuevosIds.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosTipos.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosProveedores.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosRfcProveedores.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosImportes.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosIdsCuentasOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosIdsBancosOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasCuentasOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasSucursalesOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosValoresCuentasOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosBancosOrigen.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosIdsCuentasDestino.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosIdsBancosDestino.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasCuentasDestino.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosValoresCuentasDestino.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasSucursalesDestino.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasFechas.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevasLlavesMatch.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosPagos.splice(
                                              posicionEliminar,
                                              1
                                            );
                                            nuevosCorreos.splice(
                                              posicionEliminar,
                                              1
                                            );
                                          } else {
                                            nuevosImportes[posicionEliminar] =
                                              nuevosImportes[posicionEliminar] -
                                              parseFloat(row.pendiente);
                                            nuevosPagos[posicionEliminar] =
                                              nuevosPagos[posicionEliminar] -
                                              importeAplicado;
                                            let ids = instrucciones.ids[
                                              posicionEliminar
                                            ]
                                              .toString()
                                              .split(",")
                                              .map((id) => parseFloat(id));
                                            let pos = ids.indexOf(row.id);
                                            ids.splice(pos, 1);

                                            nuevosIds[posicionEliminar] =
                                              ids[0];
                                            if (ids.length > 1) {
                                              for (
                                                let x = 1;
                                                x < ids.length;
                                                x++
                                              ) {
                                                nuevosIds[posicionEliminar] =
                                                  nuevosIds[posicionEliminar] +
                                                  "," +
                                                  ids[x];
                                              }
                                            }
                                          }

                                          let pos = ids.indexOf(row.id);
                                          ids.splice(pos, 1);
                                          proveedoresNombres.splice(pos, 1);
                                          importes.splice(pos, 1);
                                          rfcs.splice(pos, 1);
                                          pagos.splice(pos, 1);
                                          importesOriginales.splice(pos, 1);
                                          monedas.splice(pos, 1);
                                          tiposCambio.splice(pos, 1);
                                          pagosOriginales.splice(pos, 1);
                                          correos.splice(pos, 1);
                                          cuentasOrigenNombre.splice(pos, 1);
                                          cuentasDestinoNombre.splice(pos, 1);

                                          /* executeGuardarFlwPagos({
                                            data: {
                                              usuario: correoUsuario,
                                              pwd: passwordUsuario,
                                              rfc: rfcEmpresa,
                                              idsubmenu: 46,
                                              forma: 2,
                                              IdFlw: flujoEfectivo.id,
                                              IdUsuario: idUsuario,
                                            },
                                          }); */
                                        }
                                        setInstrucciones({
                                          ids: nuevosIds,
                                          tipos: nuevosTipos,
                                          proveedores: nuevosProveedores,
                                          rfcProveedores: nuevosRfcProveedores,
                                          importes: nuevosImportes,
                                          idsCuentasOrigen: nuevosIdsCuentasOrigen,
                                          idsBancosOrigen: nuevosIdsBancosOrigen,
                                          cuentasOrigen: nuevasCuentasOrigen,
                                          sucursalesOrigen: nuevasSucursalesOrigen,
                                          valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                                          bancosOrigen: nuevosBancosOrigen,
                                          idsCuentasDestino: nuevosIdsCuentasDestino,
                                          idsBancosDestino: nuevosIdsBancosDestino,
                                          cuentasDestino: nuevasCuentasDestino,
                                          valoresCuentasDestino: nuevosValoresCuentasDestino,
                                          sucursalesDestino: nuevasSucursalesDestino,
                                          fechas: nuevasFechas,
                                          llavesMatch: nuevasLlavesMatch,
                                          pagos: nuevosPagos,
                                          correos: nuevosCorreos,
                                        });

                                        setInstruccionesPagoProveedores({
                                          ids: ids,
                                          proveedores: proveedoresNombres,
                                          importes: importes,
                                          rfcs: rfcs,
                                          pagos: pagos,
                                          importesOriginales: importesOriginales,
                                          monedas: monedas,
                                          tiposCambio: tiposCambio,
                                          pagosOriginales: pagosOriginales,
                                          correos: correos,
                                          cuentasOrigen: cuentasOrigenNombre,
                                          cuentasDestino: cuentasDestinoNombre,
                                        });
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    id={labelId}
                                    scope="row"
                                    align="right"
                                  >
                                    {row.serieFolio}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.proveedor}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.sucursal}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.fechaDoc}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.fechaVen}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.tipo}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.idMoneda === 10 ? (
                                      <Tooltip title="Moneda extranjera">
                                        <IconButton
                                          onClick={
                                            handleClickOpenDialogTipoCambio
                                          }
                                        >
                                          <ErrorIcon
                                            style={{
                                              color: "red",
                                              verticalAlign: "sub",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    ) : null}
                                    ${number_format(row.pendiente, 2, ".", ",")}
                                    {row.idMoneda !== 1 ? (
                                      <div>
                                        <Typography variant="subtitle2">
                                          <strong>Pendiente Original: </strong>
                                        </Typography>
                                        <Typography variant="subtitle2">
                                          {`$${number_format(
                                            row.importeOriginal,
                                            2,
                                            ".",
                                            ","
                                          )} ${row.moneda}`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                          <strong>
                                            Tipo Cambio Original:{" "}
                                          </strong>
                                        </Typography>
                                        <Typography variant="subtitle2">
                                          {`$${number_format(
                                            row.tipoCambio,
                                            2,
                                            ".",
                                            ","
                                          )}`}
                                        </Typography>
                                      </div>
                                    ) : null}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Grid container spacing={3}>
                                      {row.idMoneda !== 1 ? (
                                        <Grid item xs={12}>
                                          <TextField
                                            className={classes.textFields}
                                            id={`tipocambio${index}`}
                                            label={`Tipo Cambio Actual`}
                                            type="text"
                                            margin="normal"
                                            disabled={
                                              documentosSeleccionados.indexOf(
                                                row.id
                                              ) !== -1
                                            }
                                            value={
                                              posPago !== -1
                                                ? instruccionesPagoProveedores
                                                    .tiposCambio[posPago]
                                                : detallesFlujos.tiposCambio[
                                                    index
                                                  ]
                                            }
                                            inputProps={{
                                              maxLength: 20,
                                            }}
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                            InputProps={{
                                              inputComponent: NumberFormatCustom,
                                            }}
                                            onKeyPress={(e) => {
                                              doubleKeyValidation(e, 2);
                                            }}
                                            onChange={(e) => {
                                              let nuevosTiposCambio =
                                                detallesFlujos.tiposCambio;
                                              nuevosTiposCambio[index] =
                                                typeof e.target.value !==
                                                "undefined"
                                                  ? parseFloat(e.target.value)
                                                  : 0;
                                              setDetallesFlujos({
                                                ...detallesFlujos,
                                                tiposCambio: nuevosTiposCambio,
                                              });
                                            }}
                                          />
                                        </Grid>
                                      ) : null}
                                      <Grid item xs={12}>
                                        <TextField
                                          className={classes.textFields}
                                          id={`pago${index}`}
                                          label={`Pago`}
                                          type="text"
                                          margin="normal"
                                          disabled={
                                            documentosSeleccionados.indexOf(
                                              row.id
                                            ) !== -1
                                          }
                                          value={
                                            posPago !== -1
                                              ? row.idMoneda !== 1
                                                ? instruccionesPagoProveedores
                                                    .pagosOriginales[posPago]
                                                : instruccionesPagoProveedores
                                                    .pagos[posPago]
                                              : detallesFlujos.pagos[index]
                                          }
                                          inputProps={{
                                            maxLength: 20,
                                          }}
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          InputProps={{
                                            inputComponent: NumberFormatCustom,
                                          }}
                                          onKeyPress={(e) => {
                                            doubleKeyValidation(e, 2);
                                          }}
                                          onChange={(e) => {
                                            let nuevosPagosFlujos =
                                              detallesFlujos.pagos;
                                            nuevosPagosFlujos[index] =
                                              typeof e.target.value !==
                                              "undefined"
                                                ? parseFloat(e.target.value)
                                                : 0;
                                            setDetallesFlujos({
                                              ...detallesFlujos,
                                              pagos: nuevosPagosFlujos,
                                            });
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      disabled={
                                        row.rutaArchivo === null ||
                                        row.nombreArchivo === null
                                      }
                                      onClick={() => {
                                        executeTraerArchivosFlujos({
                                          params: {
                                            usuario: correoUsuario,
                                            pwd: passwordUsuario,
                                            rfc: rfcEmpresa,
                                            idsubmenu: 46,
                                            idEmpresa: idEmpresa,
                                            rutaArchivo: row.rutaArchivo,
                                            nombreArchivo: row.nombreArchivo,
                                          },
                                        });
                                      }}
                                    >
                                      Ver CFDI
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={10}>
                              <Typography variant="subtitle1">
                                <ErrorIcon
                                  style={{ color: "red", verticalAlign: "sub" }}
                                />
                                No hay documentos disponibles
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow style={{ background: "#FAFAFA" }}>
                          <TableCell colSpan={6} align="right">
                            <strong>
                              * Todos los pendientes y los totales están
                              presentados en moneda nacional.
                            </strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Total Filtro:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              $
                              {number_format(
                                totalFiltroTablaPorDocumento,
                                2,
                                ".",
                                ","
                              )}
                            </strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Total Pendiente:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              $
                              {number_format(
                                totalPendienteTablaPorDocumentos,
                                2,
                                ".",
                                ","
                              )}
                            </strong>
                          </TableCell>
                        </TableRow>
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
                    page={rows.length > 0 ? page : 0}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openPrioritariosDialog}
        onClose={handleClosePrioritariosDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Proveedores</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Autocomplete
                options={proveedoresNoPrioritarios}
                getOptionLabel={(option) =>
                  `${option.razonsocial} (${option.rfc})`
                }
                id="debug"
                onChange={(event, values) => {
                  setIdProveedor(values !== null ? values.id : 0);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="rfcAutocompleteStatus"
                    style={{ width: "100%" }}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 5);
                    }}
                    label="Proveedores"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} style={{ alignSelf: "center" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
                onClick={() => {
                  if (idProveedor !== 0) {
                    executeCambiarPrioridadProveedor({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        idproveedor: idProveedor,
                        prioridad: 1,
                      },
                    });
                    setValidacionDialogProveedoresPrioritarios(true);
                  } else {
                    swal("Error", "Seleccione un proveedor", "warning");
                  }
                }}
              >
                Agregar a prioritarios
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Proveedores Prioritarios</Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {proveedoresPrioritarios.length > 0 ? (
                  proveedoresPrioritarios.map((proveedor, index) => {
                    return (
                      <ListItem button key={index}>
                        <ListItemText
                          primary={proveedor.razonsocial}
                          secondary={proveedor.rfc}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Quitar de prioritarios">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
                                swal({
                                  text:
                                    "¿Está seguro de quitar este proveedor de prioritarios?",
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    executeCambiarPrioridadProveedor({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        idproveedor: proveedor.id,
                                        prioridad: 0,
                                      },
                                    });
                                    setValidacionDialogProveedoresPrioritarios(
                                      true
                                    );
                                  }
                                });
                              }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem button>
                    <ListItemText primary="Sin proveedores prioritarios" />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePrioritariosDialog}
            variant="contained"
            color="secondary"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogTipoCambio}
        onClose={handleCloseDialogTipoCambio}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Proveedores</DialogTitle>
        <DialogContent dividers></DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogTipoCambio}
            variant="contained"
            color="secondary"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function Paso2(props) {
  const classes = useStyles();
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const setInstruccionesPagoProveedores = props.setInstruccionesPagoProveedores;
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;
  const tiposPago = props.tiposPago;

  const getInstrucciones = () => {
    if (instrucciones.proveedores.length > 0) {
      return (
        <TableBody>
          {instrucciones.proveedores.map((proveedor, index) => {
            let pos = tiposPago.valores.indexOf(1/* instrucciones.tipos[index] */);
            const cuentasDestinosProveedor = cuentasDestino.filter(
              (cuenta) => cuenta.RFC === instrucciones.rfcProveedores[index]
            );
            /* console.log(cuentasDestinosProveedor);
            console.log(cuentasDestinosProveedor.length);
            if (cuentasDestinosProveedor.length === 1) {
              let nuevosIdsCuentasDestino = instrucciones.idsCuentasDestino;
              nuevosIdsCuentasDestino[index] = cuentasDestinosProveedor[0].Id
              let nuevosIdsBancosDestino = instrucciones.idsBancosDestino;
              nuevosIdsBancosDestino[index] = cuentasDestinosProveedor[0].IdBanco;
              let nuevasCuentasDestino = instrucciones.cuentasDestino;
              nuevasCuentasDestino[index] = cuentasDestinosProveedor[0].Layout;
              let nuevosValoresCuentasDestino =
                instrucciones.valoresCuentasDestino;
              nuevosValoresCuentasDestino[index] = 0;
              setInstrucciones({
                ...instrucciones,
                idsCuentasDestino: nuevosIdsCuentasDestino,
                idsBancosDestino: nuevosIdsBancosDestino,
                cuentasDestino: nuevasCuentasDestino,
                valoresCuentasDestino: nuevosValoresCuentasDestino,
              });
            } */
            return (
              <TableRow key={index}>
                <TableCell align="right">{tiposPago.tipos[pos]}</TableCell>
                <TableCell align="right">{proveedor}</TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"cuentaOrigen" + index}
                    variant="outlined"
                    type="text"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    inputProps={{
                      maxLength: 100,
                    }}
                    value={instrucciones.valoresCuentasOrigen[index]}
                    onChange={(e) => {
                      let nuevosIdsCuentasOrigen =
                        instrucciones.idsCuentasOrigen;
                      nuevosIdsCuentasOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].IdCuenta
                          : 0;
                      let nuevosIdsBancosOrigen = instrucciones.idsBancosOrigen;
                      nuevosIdsBancosOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].IdBanco
                          : 0;
                      let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                      nuevasCuentasOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].Nombre
                          : "";
                      let nuevosValoresCuentasOrigen =
                        instrucciones.valoresCuentasOrigen;
                      nuevosValoresCuentasOrigen[index] =
                        e.target.value !== "-1" ? e.target.value : "-1";
                      let nuevosBancosOrigen = instrucciones.bancosOrigen;
                      nuevosBancosOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].Banco
                          : "";
                      let nuevasSucursalesOrigen =
                        instrucciones.sucursalesOrigen;
                      nuevasSucursalesOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].Sucursal !==
                            null
                            ? cuentasOrigen[parseInt(e.target.value)].Sucursal
                            : ""
                          : "";
                      setInstrucciones({
                        ...instrucciones,
                        idsCuentasOrigen: nuevosIdsCuentasOrigen,
                        idsBancosOrigen: nuevosIdsBancosOrigen,
                        cuentasOrigen: nuevasCuentasOrigen,
                        valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                        bancosOrigen: nuevosBancosOrigen,
                        sucursalesOrigen: nuevasSucursalesOrigen,
                      });

                      const proveedorBuscar = instrucciones.proveedores[index];
                      let posProveedor = instruccionesPagoProveedores.proveedores.indexOf(
                        proveedorBuscar
                      );
                      let posicionesProveedor = [];
                      while (posProveedor !== -1) {
                        posicionesProveedor.push(posProveedor);
                        posProveedor = instruccionesPagoProveedores.proveedores.indexOf(
                          proveedorBuscar,
                          posProveedor + 1
                        );
                      }
                      let nuevosNombresBancosOrigen =
                        instruccionesPagoProveedores.cuentasOrigen;
                      for (let x = 0; x < posicionesProveedor.length; x++) {
                        nuevosNombresBancosOrigen[posicionesProveedor[x]] =
                          e.target.value !== "-1"
                            ? cuentasOrigen[parseInt(e.target.value)].Nombre
                            : 0;
                      }
                      setInstruccionesPagoProveedores({
                        ...instruccionesPagoProveedores,
                        cuentasOrigen: nuevosNombresBancosOrigen,
                      });
                    }}
                  >
                    <option value="-1">Seleccione una cuenta de origen</option>
                    {cuentasOrigen.length > 0
                      ? cuentasOrigen.map((cuenta, index) => (
                          <option value={index} key={index}>
                            {cuenta.Nombre}
                          </option>
                        ))
                      : null}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"cuentaDestino" + index}
                    variant="outlined"
                    type="text"
                    inputProps={{
                      maxLength: 20,
                    }}
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={instrucciones.valoresCuentasDestino[index]}
                    onChange={(e) => {
                      let nuevosIdsCuentasDestino =
                        instrucciones.idsCuentasDestino;
                      /* nuevosIdsCuentasDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestino.filter(
                              (cuenta) =>
                                cuenta.RFC ===
                                instrucciones.rfcProveedores[index]
                            )[parseInt(e.target.value)].Id
                          : 0; */
                      nuevosIdsCuentasDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestinosProveedor[parseInt(e.target.value)]
                              .Id
                          : 0;
                      /* console.log(
                        cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC === instrucciones.rfcProveedores[index]
                        )[parseInt(e.target.value)].Id
                      );
                      console.log(
                        cuentasDestinosProveedor[parseInt(e.target.value)].Id
                      ); */
                      let nuevosIdsBancosDestino =
                        instrucciones.idsBancosDestino;
                      /* nuevosIdsBancosDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestino.filter(
                              (cuenta) =>
                                cuenta.RFC ===
                                instrucciones.rfcProveedores[index]
                            )[parseInt(e.target.value)].IdBanco
                          : 0; */
                      nuevosIdsBancosDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestinosProveedor[parseInt(e.target.value)]
                              .IdBanco
                          : 0;
                      /* console.log(
                        cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC === instrucciones.rfcProveedores[index]
                        )[parseInt(e.target.value)].IdBanco
                      );
                      console.log(
                        cuentasDestinosProveedor[parseInt(e.target.value)]
                          .IdBanco
                      ); */
                      let nuevasCuentasDestino = instrucciones.cuentasDestino;
                      /* nuevasCuentasDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestino.filter(
                              (cuenta) =>
                                cuenta.RFC ===
                                instrucciones.rfcProveedores[index]
                            )[parseInt(e.target.value)].Layout
                          : ""; */
                      nuevasCuentasDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestinosProveedor[parseInt(e.target.value)]
                              .Layout
                          : "";
                      /* console.log(
                        cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC === instrucciones.rfcProveedores[index]
                        )[parseInt(e.target.value)].Layout
                      );
                      console.log(
                        cuentasDestinosProveedor[parseInt(e.target.value)]
                          .Layout
                      ); */
                      let nuevosValoresCuentasDestino =
                        instrucciones.valoresCuentasDestino;
                      nuevosValoresCuentasDestino[index] =
                        e.target.value !== "-1" ? e.target.value : "-1";
                      let nuevasSucursalesDestino =
                        instrucciones.sucursalesDestino;
                      nuevasSucursalesDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestinosProveedor[parseInt(e.target.value)]
                              .Sucursal !== null
                            ? cuentasDestinosProveedor[parseInt(e.target.value)]
                                .Sucursal
                            : ""
                          : "";
                      setInstrucciones({
                        ...instrucciones,
                        idsCuentasDestino: nuevosIdsCuentasDestino,
                        idsBancosDestino: nuevosIdsBancosDestino,
                        cuentasDestino: nuevasCuentasDestino,
                        valoresCuentasDestino: nuevosValoresCuentasDestino,
                        sucursalesDestino: nuevasSucursalesDestino,
                      });

                      const proveedorBuscar = instrucciones.proveedores[index];
                      let posProveedor = instruccionesPagoProveedores.proveedores.indexOf(
                        proveedorBuscar
                      );
                      let posicionesProveedor = [];
                      while (posProveedor !== -1) {
                        posicionesProveedor.push(posProveedor);
                        posProveedor = instruccionesPagoProveedores.proveedores.indexOf(
                          proveedorBuscar,
                          posProveedor + 1
                        );
                      }
                      let nuevosNombresBancosDestino =
                        instruccionesPagoProveedores.cuentasDestino;
                      for (let x = 0; x < posicionesProveedor.length; x++) {
                        nuevosNombresBancosDestino[posicionesProveedor[x]] =
                          e.target.value !== "-1"
                            ? cuentasDestinosProveedor[parseInt(e.target.value)]
                                .Layout
                            : "";
                      }
                      setInstruccionesPagoProveedores({
                        ...instruccionesPagoProveedores,
                        cuentasDestino: nuevosNombresBancosDestino,
                      });
                    }}
                  >
                    <option value="-1">Seleccione una cuenta de destino</option>
                    {cuentasDestinosProveedor.length > 0
                      ? cuentasDestinosProveedor.map((cuenta, index) => (
                          <option value={index} key={index}>
                            {cuenta.Layout}
                          </option>
                        ))
                      : null}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"fecha" + index}
                    variant="outlined"
                    type="date"
                    inputProps={{
                      maxLength: 20,
                    }}
                    value={instrucciones.fechas[index]}
                    onKeyPress={(e) => {
                      keyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      let nuevasFechas = instrucciones.fechas;
                      nuevasFechas[index] = e.target.value;
                      setInstrucciones({
                        ...instrucciones,
                        fechas: nuevasFechas,
                      });
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  ${number_format(instrucciones.pagos[index], 2, ".", ",")}
                </TableCell>
                {/* <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"llavesMatch" + index}
                    variant="outlined"
                    type="text"
                    value={instrucciones.llavesMatch[index]}
                    disabled
                  />
                </TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell align="right">Sin Instrucciones</TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell align="right">
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  {/* <TableCell align="center">
                    <strong>Llave Match</strong>
                  </TableCell> */}
                </TableRow>
              </TableHead>
              {getInstrucciones()}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}

function Paso3(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const correoUsuario = props.correo;
  const passwordUsuario = props.password;
  const setLoading = props.setLoading;
  const rfcEmpresa = props.rfc;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  //const setInstruccionesPagoProveedores = props.setInstruccionesPagoProveedores;
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const instruccionesAdicionales = props.instruccionesAdicionales;
  const setInstruccionesAdicionales = props.setInstruccionesAdicionales;
  const proveedores = props.proveedores;
  const setProveedores = props.setProveedores;
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;
  const setCuentasDestino = props.setCuentasDestino;
  const disponible = props.disponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  /* const restante = props.restante; */
  const setRestante = props.setRestante;
  const tiposPago = props.tiposPago;
  /* const correosProveedores = props.correosProveedores;
  const setCorreosProveedores = props.setCorreosProveedores; */
  const [tipoDocumento, setTipoDocumento] = useState(2);
  const [openDialogInstrucciones, setOpenDialogInstrucciones] = useState(false);
  const [openDialogProveedores, setOpenDialogProveedores] = useState(false);
  const [
    openDialogConfiguracionCorreos,
    setOpenDialogConfiguracionCorreos,
  ] = useState(false);
  const [
    openDialogConfiguracionCorreosPagosAdicionales,
    setOpenDialogConfiguracionCorreosPagosAdicionales,
  ] = useState(false);
  const [proveedorElegido, setProveedorElegido] = useState("");
  const [
    proveedorElegidoPagosAdicionales,
    setProveedorElegidoPagosAdicionales,
  ] = useState("");
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [importeAntiguo, setImporteAntiguo] = useState(0.0);
  const [correoSalidaSelected, setCorreoSalidaSelected] = useState(0);
  const [indexProveedorSelected, setIndexProveedorSelected] = useState(-1);
  const [
    indexProveedorSelectedPagosAdicionales,
    setIndexProveedorSelectedPagosAdicionales,
  ] = useState(-1);
  const [nuevoProveedorSelected, setNuevoProveedorSelected] = useState(false);
  const [proveedorSelected, setProveedorSelected] = useState(-1);
  const [cuentasDestinoProveedor, setCuentasDestinoProveedor] = useState([]);
  const [cuentaDestinoSelected, setCuentaDestinoSelected] = useState(-1);
  const [nuevaCuentaDestino, setNuevaCuentaDestino] = useState(false);
  const [
    indexInstruccionAdicionalSelected,
    setIndexInstruccionAdicionalSelected,
  ] = useState(-1);
  const [buscarProveedor, setBuscarProveedor] = useState("");
  const [razonSocialProveedorNuevo, setRazonSocialProveedorNuevo] = useState(
    ""
  );
  const [rfcProveedorNuevo, setRfcProveedorNuevo] = useState("");
  const [codigoProveedorNuevo, setCodigoProveedorNuevo] = useState("");
  const [sucursalProveedorNuevo, setSucursalProveedorNuevo] = useState("");
  const [idMonedaProveedorNuevo, setIdMonedaProveedorNuevo] = useState("");
  const [correo1ProveedorNuevo, setCorreo1ProveedorNuevo] = useState("");
  const [correo2ProveedorNuevo, setCorreo2ProveedorNuevo] = useState("");
  const [correo3ProveedorNuevo, setCorreo3ProveedorNuevo] = useState("");
  const [cuentaProveedorNuevo, setCuentaProveedorNuevo] = useState("");
  const [clabeProveedorNuevo, setClabeProveedorNuevo] = useState("");
  const [bancoProveedorNuevo, setBancoProveedorNuevo] = useState("");
  const [idBancoProveedorNuevo, setIdBancoProveedorNuevo] = useState("");
  const [
    sucursalCuentaProveedorNuevo,
    setSucursalCuentaProveedorNuevo,
  ] = useState("");
  const [esClienteProveedorNuevo, setEsClienteProveedorNuevo] = useState(true);
  const [infoNuevaCuenta, setInfoNuevaCuenta] = useState({
    rfcNuevaCuenta: "",
    cuentaNuevaCuenta: "",
    clabeNuevaCuenta: "",
    bancoNuevaCuenta: "",
    idBancoNuevaCuenta: "",
    sucursalNuevaCuenta: "",
    esClienteNuevaCuenta: true,
  });
  /* const [rfcNuevaCuenta, setRfcNuevaCuenta] = useState("");
  const [cuentaNuevaCuenta, setCuentaNuevaCuenta] = useState("");
  const [clabeNuevaCuenta, setClabeNuevaCuenta] = useState("");
  const [bancoNuevaCuenta, setBancoNuevaCuenta] = useState("");
  const [idBancoNuevaCuenta, setIdBancoNuevaCuenta] = useState(0);
  const [sucursalNuevaCuenta, setSucursalNuevaCuenta] = useState("");
  const [esClienteNuevaCuenta, setEsClienteNuevaCuenta] = useState(true); */
  const [
    {
      data: traerFlujosEfectivoFiltradosData,
      loading: traerFlujosEfectivoFiltradosLoading,
      error: traerFlujosEfectivoFiltradosError,
    },
    executeTraerFlujosEfectivoFiltrados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoFiltrados`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: agregarCuentaProveedorData,
      loading: agregarCuentaProveedorLoading,
      error: agregarCuentaProveedorError,
    },
    executeAgregarCuentaProveedor,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarCuentaProveedor`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: agregarNuevoProveedorData,
      loading: agregarNuevoProveedorLoading,
      error: agregarNuevoProveedorError,
    },
    executeAgregarNuevoProveedor,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarNuevoProveedor`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoFiltradosData) {
        if (traerFlujosEfectivoFiltradosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerFlujosEfectivoFiltradosData.error),
            "warning"
          );
        } else {
          setFlujosEfectivoFiltrados(
            traerFlujosEfectivoFiltradosData.flujosefectivo
          );
          let total = 0;
          for (
            let x = 0;
            x < traerFlujosEfectivoFiltradosData.flujosefectivo.length;
            x++
          ) {
            total =
              total +
              parseFloat(
                traerFlujosEfectivoFiltradosData.flujosefectivo[x].Importe
              );
          }
          setTotalEspecificos(total);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoFiltradosData]);

  useEffect(() => {
    function checkData() {
      if (agregarCuentaProveedorData) {
        if (agregarCuentaProveedorData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(agregarCuentaProveedorData.error),
            "warning"
          );
        } else {
          setCuentasDestino(agregarCuentaProveedorData.cuentas);
        }
      }
    }

    checkData();
  }, [agregarCuentaProveedorData, setCuentasDestino]);

  useEffect(() => {
    function checkData() {
      if (agregarNuevoProveedorData) {
        if (agregarNuevoProveedorData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(agregarNuevoProveedorData.error),
            "warning"
          );
        } else {
          setCuentasDestino(agregarNuevoProveedorData.cuentas);
          setProveedores(agregarNuevoProveedorData.proveedores);
          setRazonSocialProveedorNuevo("");
          setRfcProveedorNuevo("");
          setCodigoProveedorNuevo("");
          setSucursalProveedorNuevo("");
          setIdMonedaProveedorNuevo("");
          setCorreo1ProveedorNuevo("");
          setCorreo2ProveedorNuevo("");
          setCorreo3ProveedorNuevo("");
          setCuentaProveedorNuevo("");
          setClabeProveedorNuevo("");
          setBancoProveedorNuevo("");
          setIdBancoProveedorNuevo("");
          setSucursalCuentaProveedorNuevo("");
          setEsClienteProveedorNuevo(true);
        }
      }
    }

    checkData();
  }, [agregarNuevoProveedorData, setCuentasDestino, setProveedores]);

  if (
    traerFlujosEfectivoFiltradosLoading ||
    agregarCuentaProveedorLoading ||
    agregarNuevoProveedorLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    traerFlujosEfectivoFiltradosError ||
    agregarCuentaProveedorError ||
    agregarNuevoProveedorError
  ) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenDialogInstrucciones = () => {
    setOpenDialogInstrucciones(true);
  };

  const handleCloseDialogInstrucciones = () => {
    setOpenDialogInstrucciones(false);
  };

  const handleClickOpenDialogProveedores = () => {
    setOpenDialogProveedores(true);
  };

  const handleCloseDialogProveedores = () => {
    setOpenDialogProveedores(false);
    setProveedorSelected(-1);
    setCuentaDestinoSelected(-1);
    setCuentasDestinoProveedor([]);
    setBuscarProveedor("");
    setNuevoProveedorSelected(false);
    setNuevaCuentaDestino(false);
  };

  const handleClickOpenDialogConfiguracionCorreos = () => {
    setOpenDialogConfiguracionCorreos(true);
  };

  const handleCloseDialogConfiguracionCorreos = () => {
    let contador = 0;
    for (
      let x = 0;
      x < instrucciones.correos[indexProveedorSelected].length;
      x++
    ) {
      if (
        !validarCorreo(
          instrucciones.correos[indexProveedorSelected][x].correo.trim()
        )
      ) {
        contador++;
      }
    }
    if (contador === 0) {
      setOpenDialogConfiguracionCorreos(false);
    } else {
      swal("Error", "Ingrese correos validos", "warning");
    }
  };

  const handleClickOpenDialogConfiguracionCorreosPagosAdicionales = () => {
    setOpenDialogConfiguracionCorreosPagosAdicionales(true);
  };

  const handleCloseDialogConfiguracionCorreosPagosAdicionales = () => {
    let contador = 0;
    for (
      let x = 0;
      x <
      instruccionesAdicionales.correos[indexProveedorSelectedPagosAdicionales]
        .length;
      x++
    ) {
      if (
        !validarCorreo(
          instruccionesAdicionales.correos[
            indexProveedorSelectedPagosAdicionales
          ][x].correo.trim()
        )
      ) {
        contador++;
      }
    }
    if (contador === 0) {
      setOpenDialogConfiguracionCorreosPagosAdicionales(false);
    } else {
      swal("Error", "Ingrese correos validos", "warning");
    }
  };

  const getInstrucciones = () => {
    if (instrucciones.proveedores.length > 0) {
      return instrucciones.proveedores.map((proveedor, index) => {
        let pos = tiposPago.valores.indexOf(1/* instrucciones.tipos[index] */);
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell align="right">{tiposPago.tipos[pos]}</TableCell>
            <TableCell align="right">{proveedor}</TableCell>
            <TableCell align="right">
              {instrucciones.cuentasOrigen[index]}
            </TableCell>
            <TableCell align="right">
              {instrucciones.cuentasDestino[index]}
            </TableCell>
            <TableCell align="right">{instrucciones.fechas[index]}</TableCell>
            <TableCell align="right">
              ${number_format(instrucciones.pagos[index], 2, ".", ",")}
            </TableCell>
            {/* <TableCell align="right">---</TableCell> */}
            <TableCell align="right">
              <Tooltip title="Ver Documentos">
                <IconButton
                  onClick={() => {
                    obtenerDocumentosPorPago(proveedor);
                  }}
                >
                  <FindInPageIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Configuración de correos">
                <IconButton
                  onClick={() => {
                    setIndexProveedorSelected(index);
                    setProveedorElegido(proveedor);
                    handleClickOpenDialogConfiguracionCorreos();
                  }}
                >
                  <EmailIcon color="primary" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });
    } else if (instruccionesAdicionales.proveedores.length === 0) {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell align="right" colSpan="7" style={{ textAlign: "center" }}>
            Sin Instrucciones
          </TableCell>
        </TableRow>
      );
    }
  };

  const obtenerDocumentosPorPago = (proveedor) => {
    const pos = [];
    for (let x = 0; x < instruccionesPagoProveedores.proveedores.length; x++) {
      if (instruccionesPagoProveedores.proveedores[x] === proveedor) {
        pos.push(x);
      }
    }
    let nuevosIds = [];
    let nuevosProveedores = [];
    let nuevosImportes = [];
    for (let x = 0; x < pos.length; x++) {
      nuevosIds.push(instruccionesPagoProveedores.ids[pos[x]]);
      nuevosProveedores.push(instruccionesPagoProveedores.proveedores[pos[x]]);
      nuevosImportes.push(instruccionesPagoProveedores.importes[pos[x]]);
    }

    executeTraerFlujosEfectivoFiltrados({
      data: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        forma: 4,
        ids: nuevosIds,
        filtro: 0,
        pendiente: 0,
      },
    });
    handleClickOpenDialogInstrucciones();
  };

  const getFlujosEfectivoFiltrados = () => {
    if (flujosEfectivoFiltrados.length > 0) {
      return flujosEfectivoFiltrados.map((flujoEfectivo, index) => {
        const pos = instruccionesPagoProveedores.ids.indexOf(flujoEfectivo.id);
        const importe = instruccionesPagoProveedores.pagos[pos];
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell component="th" scope="row">
              {flujoEfectivo.Razon}
            </TableCell>
            <TableCell align="right">{`${
              flujoEfectivo.Serie !== null ? flujoEfectivo.Serie : "Sin Serie"
            }-${
              flujoEfectivo.Folio !== null ? flujoEfectivo.Folio : "Sin Folio"
            }`}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.Pendiente, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              ${number_format(importe, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              $
              {number_format(
                parseFloat(flujoEfectivo.Pendiente) - parseFloat(importe),
                2,
                ".",
                ","
              )}
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={5}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  const getInstruccionesPago = () => {
    if (instruccionesAdicionales.proveedores.length > 0) {
      return instruccionesAdicionales.proveedores.map((proveedor, index) => {
        let pos = tiposPago.valores.indexOf(
          instruccionesAdicionales.tipos[index]
        );
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell align="right">{tiposPago.tipos[pos]}</TableCell>
            <TableCell align="right">
              {instruccionesAdicionales.proveedores[index] !== "-1"
                ? instruccionesAdicionales.proveedores[index]
                : "Pendiente"}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                style={{ minWidth: "250px" }}
                id={"paso3CuentaOrigen" + index}
                variant="outlined"
                type="text"
                select
                SelectProps={{
                  native: true,
                }}
                inputProps={{
                  maxLength: 20,
                }}
                value={instruccionesAdicionales.valoresCuentasOrigen[index]}
                onChange={(e) => {
                  let nuevosIdsCuentasOrigen =
                    instruccionesAdicionales.idsCuentasOrigen;
                  nuevosIdsCuentasOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].IdCuenta
                      : 0;
                  let nuevosIdsBancosOrigen =
                    instruccionesAdicionales.idsBancosOrigen;
                  nuevosIdsBancosOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].IdBanco
                      : 0;
                  let nuevasCuentasOrigen =
                    instruccionesAdicionales.cuentasOrigen;
                  nuevasCuentasOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].Nombre
                      : "";
                  let nuevosValoresCuentasOrigen =
                    instruccionesAdicionales.valoresCuentasOrigen;
                  nuevosValoresCuentasOrigen[index] =
                    e.target.value !== "-1" ? e.target.value : "-1";
                  let nuevosBancosOrigen =
                    instruccionesAdicionales.bancosOrigen;
                  nuevosBancosOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].Banco
                      : "";
                  let nuevasSucursalesOrigen =
                    instruccionesAdicionales.sucursalesOrigen;
                  nuevasSucursalesOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].Sucursal !==
                        null
                        ? cuentasOrigen[parseInt(e.target.value)].Sucursal
                        : ""
                      : "";
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    idsCuentasOrigen: nuevosIdsCuentasOrigen,
                    idsBancosOrigen: nuevosIdsBancosOrigen,
                    cuentasOrigen: nuevasCuentasOrigen,
                    valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                    bancosOrigen: nuevosBancosOrigen,
                    sucursalesOrigen: nuevasSucursalesOrigen,
                  });
                }}
              >
                <option value="-1">Seleccione una cuenta de origen</option>
                {cuentasOrigen.length > 0
                  ? cuentasOrigen.map((cuenta, index) => (
                      <option value={index} key={index}>
                        {cuenta.Nombre}
                      </option>
                    ))
                  : null}
              </TextField>
            </TableCell>
            <TableCell align="right">
              {instruccionesAdicionales.cuentasDestino[index] !== "0"
                ? instruccionesAdicionales.cuentasDestino[index]
                : "Pendiente"}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                style={{ minWidth: "200px" }}
                id={"paso3Fecha" + index}
                variant="outlined"
                type="date"
                value={instruccionesAdicionales.fechas[index]}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  let nuevasFechas = instruccionesAdicionales.fechas;
                  nuevasFechas[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    fechas: nuevasFechas,
                  });
                }}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                style={{ minWidth: "150px" }}
                id={"paso3CImporte" + index}
                variant="outlined"
                type="text"
                inputProps={{
                  maxLength: 20,
                }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                value={instruccionesAdicionales.importes[index]}
                onKeyPress={(e) => {
                  doubleKeyValidation(e, 2);
                }}
                onFocus={(e) => {
                  const valor = e.target.value
                    .replace("$", "")
                    .replace(",", "");
                  setImporteAntiguo(parseFloat(valor));
                }}
                onChange={(e) => {
                  let nuevosImportes = instruccionesAdicionales.importes;
                  nuevosImportes[index] =
                    typeof e.target.value !== "undefined" ? e.target.value : 0;
                  let nuevosPagos = instruccionesAdicionales.pagos;
                  nuevosPagos[index] =
                    typeof e.target.value !== "undefined" ? e.target.value : 0;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    importes: nuevosImportes,
                    pagos: nuevosPagos,
                  });

                  if (typeof e.target.value !== "undefined") {
                    if (parseFloat(e.target.value) > importeAntiguo) {
                      setAplicado(
                        aplicado + (parseFloat(e.target.value) - importeAntiguo)
                      );
                      setRestante(
                        disponible -
                          (aplicado +
                            (parseFloat(e.target.value) - importeAntiguo))
                      );
                    } else if (parseFloat(e.target.value) < importeAntiguo) {
                      setAplicado(
                        aplicado - (importeAntiguo - parseFloat(e.target.value))
                      );
                      setRestante(
                        disponible -
                          (aplicado -
                            (importeAntiguo - parseFloat(e.target.value)))
                      );
                    }
                    setImporteAntiguo(parseFloat(e.target.value));
                  }
                }}
              />
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Configuración de correos">
                <IconButton
                  onClick={() => {
                    setIndexProveedorSelectedPagosAdicionales(index);
                    setProveedorElegidoPagosAdicionales(proveedor);
                    handleClickOpenDialogConfiguracionCorreosPagosAdicionales();
                  }}
                >
                  <EmailIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Proveedores">
                <IconButton
                  onClick={() => {
                    handleClickOpenDialogProveedores();
                    setIndexInstruccionAdicionalSelected(index);
                  }}
                >
                  <PersonAddIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Quitar">
                <IconButton
                  onClick={() => {
                    quitarInstruccionesPago(index);
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  function renderRowProveedores(props) {
    const { index, style, data } = props;
    return (
      <ListItem
        button
        style={style}
        key={index}
        selected={proveedorSelected === index}
        onClick={() => {
          setProveedorSelected(proveedorSelected !== index ? index : -1);
          setCuentaDestinoSelected(-1);
          setCuentasDestinoProveedor(
            proveedorSelected !== index
              ? cuentasDestino.filter(
                  (cuentaDestino) => cuentaDestino.RFC === data[index].rfc
                )
              : []
          );
          setNuevaCuentaDestino(false);
          setInfoNuevaCuenta({
            ...infoNuevaCuenta,
            rfcNuevaCuenta: data[index].rfc,
          });
        }}
      >
        <ListItemText
          primary={
            <span style={{ fontSize: "16px" }}>{data[index].razonsocial}</span>
          }
          secondary={`${data[index].rfc} - ${data[index].sucursal}`}
        />
      </ListItem>
    );
  }

  function renderRowCuentasDestino(props) {
    const { index, style, data } = props;
    return (
      <ListItem
        button
        style={style}
        key={index}
        selected={cuentaDestinoSelected === index}
        onClick={() => {
          setCuentaDestinoSelected(
            cuentaDestinoSelected !== index ? index : -1
          );
        }}
      >
        <ListItemText
          primary={
            <span style={{ fontSize: "16px" }}>{data[index].Layout}</span>
          }
          secondary={data[index].RFC}
        />
      </ListItem>
    );
  }

  const getDatosProveedor = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} style={{ alignSelf: "flex-end" }}>
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={nuevoProveedorSelected}
                onChange={(e) => {
                  setNuevoProveedorSelected(!nuevoProveedorSelected);
                  setProveedorSelected(-1);
                  setCuentaDestinoSelected(-1);
                  setNuevaCuentaDestino(false);
                  setCuentasDestinoProveedor([]);
                }}
                name="checkedNuevoProveedor"
                color="primary"
              />
            }
            label="Nuevo Proveedor"
          /> */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setNuevoProveedorSelected(!nuevoProveedorSelected);
              setProveedorSelected(-1);
              setCuentaDestinoSelected(-1);
              setNuevaCuentaDestino(false);
              setCuentasDestinoProveedor([]);
            }}
          >
            {!nuevoProveedorSelected ? "Nuevo Proveedor" : "Regresar"}
          </Button>
        </Grid>
        {!nuevoProveedorSelected ? (
          <Grid item xs={12} md={3}>
            <TextField
              className={classes.textFields}
              id="buscarProveedor"
              label="Buscar"
              type="text"
              inputProps={{
                maxLength: 20,
              }}
              value={buscarProveedor}
              onKeyPress={(e) => {
                keyValidation(e, 3);
              }}
              onChange={(e) => {
                pasteValidation(e, 3);
                setBuscarProveedor(e.target.value);
                setProveedorSelected(-1);
                setCuentaDestinoSelected(-1);
                setCuentasDestinoProveedor([]);
              }}
            />
          </Grid>
        ) : null}
        {!nuevoProveedorSelected ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} /* md={6} */>
                  <Typography variant="subtitle1">Proveedores</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FixedSizeList
                    height={350}
                    width="100%"
                    itemSize={80}
                    itemCount={
                      proveedores.filter(
                        (proveedor) =>
                          proveedor.razonsocial
                            .toLowerCase()
                            .indexOf(buscarProveedor.trim().toLowerCase()) !==
                            -1 ||
                          proveedor.rfc
                            .toLowerCase()
                            .indexOf(buscarProveedor.trim().toLowerCase()) !==
                            -1
                      ).length
                    }
                    itemData={proveedores.filter(
                      (proveedor) =>
                        proveedor.razonsocial
                          .toLowerCase()
                          .indexOf(buscarProveedor.trim().toLowerCase()) !==
                          -1 ||
                        proveedor.rfc
                          .toLowerCase()
                          .indexOf(buscarProveedor.trim().toLowerCase()) !== -1
                    )}
                  >
                    {renderRowProveedores}
                  </FixedSizeList>
                </Grid>
              </Grid>
            </Grid>
            {cuentasDestinoProveedor.length > 0 && !nuevaCuentaDestino ? (
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Cuentas Destino</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={() => {
                        setNuevaCuentaDestino(true);
                      }}
                    >
                      Nueva Cuenta
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <FixedSizeList
                      height={350}
                      width="100%"
                      itemSize={80}
                      itemCount={cuentasDestinoProveedor.length}
                      itemData={cuentasDestinoProveedor}
                    >
                      {renderRowCuentasDestino}
                    </FixedSizeList>
                  </Grid>
                </Grid>
              </Grid>
            ) : nuevaCuentaDestino ? (
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      Nueva Cuenta Destino
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={() => {
                        setNuevaCuentaDestino(false);
                        setCuentaDestinoSelected(-1);
                        const proveedoresExistentes = proveedores.filter(
                          (proveedor) =>
                            proveedor.razonsocial
                              .toLowerCase()
                              .indexOf(buscarProveedor.trim().toLowerCase()) !==
                              -1 ||
                            proveedor.rfc
                              .toLowerCase()
                              .indexOf(buscarProveedor.trim().toLowerCase()) !==
                              -1
                        );
                        setCuentasDestinoProveedor(
                          cuentasDestino.filter(
                            (cuentaDestino) =>
                              cuentaDestino.RFC ===
                              proveedoresExistentes[proveedorSelected].rfc
                          )
                        );
                      }}
                    >
                      Regresar
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="rfcNuevaCuenta"
                      label="RFC"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      disabled
                      value={infoNuevaCuenta.rfcNuevaCuenta}
                      /* inputProps={{
                        maxLength: 20,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 5);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 5);
                      }} */
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="cuentaNuevaCuenta"
                      label="Cuenta"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      value={infoNuevaCuenta.cuentaNuevaCuenta}
                      inputProps={{
                        maxLength: 100,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 3);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 3);
                        setInfoNuevaCuenta({
                          ...infoNuevaCuenta,
                          cuentaNuevaCuenta: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="clabeNuevaCuenta"
                      label="Clabe"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      value={infoNuevaCuenta.clabeNuevaCuenta}
                      inputProps={{
                        maxLength: 30,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 5);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 5);
                        setInfoNuevaCuenta({
                          ...infoNuevaCuenta,
                          clabeNuevaCuenta: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="bancoNuevaCuenta"
                      label="Banco"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      value={infoNuevaCuenta.bancoNuevaCuenta}
                      inputProps={{
                        maxLength: 100,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 3);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 3);
                        setInfoNuevaCuenta({
                          ...infoNuevaCuenta,
                          bancoNuevaCuenta: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="idBancoNuevaCuenta"
                      label="Id Banco"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      value={infoNuevaCuenta.idBancoNuevaCuenta}
                      inputProps={{
                        maxLength: 4,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 2);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 2);
                        setInfoNuevaCuenta({
                          ...infoNuevaCuenta,
                          idBancoNuevaCuenta: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      className={classes.textFields}
                      id="sucursalNuevaCuenta"
                      label="Sucursal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      type="text"
                      required
                      value={infoNuevaCuenta.sucursalNuevaCuenta}
                      inputProps={{
                        maxLength: 5,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 2);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 2);
                        setInfoNuevaCuenta({
                          ...infoNuevaCuenta,
                          sucursalNuevaCuenta: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="esClienteNuevaCuenta"
                          color="primary"
                          checked={infoNuevaCuenta.esClienteNuevaCuenta}
                          onChange={(e) => {
                            setInfoNuevaCuenta({
                              ...infoNuevaCuenta,
                              esClienteNuevaCuenta: e.target.checked,
                            });
                          }}
                        />
                      }
                      label="Cliente"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const {
                          rfcNuevaCuenta,
                          cuentaNuevaCuenta,
                          clabeNuevaCuenta,
                          bancoNuevaCuenta,
                          idBancoNuevaCuenta,
                          sucursalNuevaCuenta,
                          esClienteNuevaCuenta,
                        } = infoNuevaCuenta;
                        if (cuentaNuevaCuenta.trim() === "") {
                          swal("Error", "Ingrese una cuenta", "warning");
                        } else if (clabeNuevaCuenta.trim() === "") {
                          swal("Error", "Ingrese un clabe", "warning");
                        } else if (bancoNuevaCuenta.trim() === "") {
                          swal("Error", "Ingrese un banco", "warning");
                        } else if (idBancoNuevaCuenta.trim() === "") {
                          swal("Error", "Ingrese un id banco", "warning");
                        } else if (sucursalNuevaCuenta.trim() === "") {
                          swal("Error", "Ingrese una sucursal", "warning");
                        } else {
                          executeAgregarCuentaProveedor({
                            data: {
                              usuario: correoUsuario,
                              pwd: passwordUsuario,
                              rfc: rfcEmpresa,
                              idsubmenu: 46,
                              rfcProveedor: rfcNuevaCuenta.trim(),
                              cuenta: cuentaNuevaCuenta.trim(),
                              clabe: clabeNuevaCuenta.trim(),
                              banco: bancoNuevaCuenta.trim(),
                              idBanco: idBancoNuevaCuenta.trim(),
                              sucursal: sucursalNuevaCuenta.trim(),
                              esCliente: esClienteNuevaCuenta ? 1 : 2,
                            },
                          });
                          setInfoNuevaCuenta({
                            rfcNuevaCuenta: rfcNuevaCuenta,
                            cuentaNuevaCuenta: "",
                            clabeNuevaCuenta: "",
                            bancoNuevaCuenta: "",
                            idBancoNuevaCuenta: "",
                            sucursalNuevaCuenta: "",
                            esClienteNuevaCuenta: true,
                          });
                        }
                      }}
                    >
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : proveedorSelected !== -1 ? (
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      onClick={() => {
                        setNuevaCuentaDestino(true);
                      }}
                    >
                      Nueva Cuenta
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      style={{ textAlign: "center" }}
                    >
                      Sin Cuentas
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Datos Proveedor</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="razonSocialProveedor"
                label="Razon Social"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 200,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                value={razonSocialProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setRazonSocialProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="rfcProveedor"
                label="RFC"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 13,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                value={rfcProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  setRfcProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="codigoProveedor"
                label="Código"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                value={codigoProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  setCodigoProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="sucursalProveedor"
                label="Sucursal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                value={sucursalProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setSucursalProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="idMonedaNuevaCuenta"
                label="Id Moneda"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                value={idMonedaProveedorNuevo}
                inputProps={{
                  maxLength: 4,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  pasteValidation(e, 2);
                  setIdMonedaProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="correo1Proveedor"
                label="Correo 1"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 4);
                }}
                value={correo1ProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 4);
                  setCorreo1ProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="correo2Proveedor"
                label="Correo 2"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 4);
                }}
                value={correo2ProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 4);
                  setCorreo2ProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="correo3Proveedor"
                label="Correo 3"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 4);
                }}
                value={correo3ProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 4);
                  setCorreo3ProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Datos Cuenta Proveedor
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="cuentaProveedor"
                label="Cuenta"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                value={cuentaProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setCuentaProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="clabeProveedor"
                label="Clabe"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 30,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                value={clabeProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  setClabeProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="bancoProveedor"
                label="Banco"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                value={bancoProveedorNuevo}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setBancoProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="idBancoNuevaCuenta"
                label="Id Banco"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                value={idBancoProveedorNuevo}
                inputProps={{
                  maxLength: 4,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  pasteValidation(e, 2);
                  setIdBancoProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                className={classes.textFields}
                id="sucursalNuevaCuenta"
                label="Sucursal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                type="text"
                required
                value={sucursalCuentaProveedorNuevo}
                inputProps={{
                  maxLength: 5,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  pasteValidation(e, 2);
                  setSucursalCuentaProveedorNuevo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="esClienteProveedorNuevo"
                    color="primary"
                    checked={esClienteProveedorNuevo}
                    onChange={(e) => {
                      setEsClienteProveedorNuevo(e.target.checked);
                    }}
                  />
                }
                label="Cliente"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (razonSocialProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese una razón social", "warning");
                  } else if (rfcProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese un RFC", "warning");
                  } else if (rfcProveedorNuevo.trim().length !== 13) {
                    swal("Error", "El RFC debe tener 13 caracteres", "warning");
                  } else if (codigoProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese un código", "warning");
                  } else if (sucursalProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese una sucursal", "warning");
                  } else if (idMonedaProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese un id moneda", "warning");
                  } else if (
                    correo1ProveedorNuevo.trim() !== "" &&
                    !validarCorreo(correo1ProveedorNuevo.trim())
                  ) {
                    swal("Error", "Ingrese un correo 1 valido", "warning");
                  } else if (
                    correo2ProveedorNuevo.trim() !== "" &&
                    !validarCorreo(correo2ProveedorNuevo.trim())
                  ) {
                    swal("Error", "Ingrese un correo 2 valido", "warning");
                  } else if (
                    correo3ProveedorNuevo.trim() !== "" &&
                    !validarCorreo(correo3ProveedorNuevo.trim())
                  ) {
                    swal("Error", "Ingrese un correo 3 valido", "warning");
                  } else if (cuentaProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese una cuenta", "warning");
                  } else if (clabeProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese una clabe", "warning");
                  } else if (bancoProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese un banco", "warning");
                  } else if (idBancoProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese un id banco", "warning");
                  } else if (sucursalCuentaProveedorNuevo.trim() === "") {
                    swal("Error", "Ingrese una sucursal de banco", "warning");
                  } else {
                    executeAgregarNuevoProveedor({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        razonSocial: razonSocialProveedorNuevo.trim(),
                        rfcProveedor: rfcProveedorNuevo.trim(),
                        codigo: codigoProveedorNuevo.trim(),
                        sucursal: sucursalProveedorNuevo.trim(),
                        idMoneda: idMonedaProveedorNuevo.trim(),
                        correo1: correo1ProveedorNuevo.trim(),
                        correo2: correo2ProveedorNuevo.trim(),
                        correo3: correo3ProveedorNuevo.trim(),
                        cuenta: cuentaProveedorNuevo.trim(),
                        clabe: clabeProveedorNuevo.trim(),
                        banco: bancoProveedorNuevo.trim(),
                        idBanco: idBancoProveedorNuevo.trim(),
                        sucursalBanco: sucursalCuentaProveedorNuevo.trim(),
                        esCliente: esClienteProveedorNuevo ? 1 : 2,
                      },
                    });
                  }
                }}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  const agregarInstruccionesPago = () => {
    let nuevosIds = instruccionesAdicionales.ids;
    let nuevosTipos = instruccionesAdicionales.tipos;
    let nuevosProveedores = instruccionesAdicionales.proveedores;
    let nuevosRfcProveedores = instruccionesAdicionales.rfcProveedores;
    let nuevosValoresProveedores = instruccionesAdicionales.valoresProveedores;
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevosIdsCuentasOrigen = instruccionesAdicionales.idsCuentasOrigen;
    let nuevosIdsBancosOrigen = instruccionesAdicionales.idsBancosOrigen;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevosValoresCuentasOrigen =
      instruccionesAdicionales.valoresCuentasOrigen;
    let nuevosBancosOrigen = instruccionesAdicionales.bancosOrigen;
    let nuevasSucursalesOrigen = instruccionesAdicionales.sucursalesOrigen;
    let nuevosIdsCuentasDestino = instruccionesAdicionales.idsCuentasDestino;
    let nuevosIdsBancosDestino = instruccionesAdicionales.idsBancosDestino;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevosValoresCuentasDestino =
      instruccionesAdicionales.valoresCuentasDestino;
    let nuevasSucursalesDestino = instruccionesAdicionales.sucursalesDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    let nuevosPagos = instruccionesAdicionales.pagos;
    let nuevosCorreos = instruccionesAdicionales.correos;

    nuevosIds.push((nuevosIds.length + 1) * -1);
    nuevosTipos.push(tipoDocumento);
    nuevosProveedores.push("-1");
    nuevosRfcProveedores.push("");
    nuevosValoresProveedores.push("-1");
    nuevosImportes.push(0.0);
    nuevosIdsCuentasOrigen.push(0);
    nuevosIdsBancosOrigen.push(0);
    nuevasCuentasOrigen.push("0");
    nuevosValoresCuentasOrigen.push("-1");
    nuevosBancosOrigen.push("0");
    nuevasSucursalesOrigen.push("");
    nuevosIdsCuentasDestino.push(0);
    nuevosIdsBancosDestino.push(0);
    nuevasCuentasDestino.push("0");
    nuevosValoresCuentasDestino.push("-1");
    nuevasSucursalesDestino.push("");
    nuevasFechas.push(moment().format("YYYY-MM-DD"));
    nuevasLlavesMatch.push("");
    nuevosPagos.push(0.0);
    nuevosCorreos.push([]);

    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      rfcProveedores: nuevosRfcProveedores,
      valoresProveedores: nuevosValoresProveedores,
      importes: nuevosImportes,
      idsCuentasOrigen: nuevosIdsCuentasOrigen,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      valoresCuentasOrigen: nuevosValoresCuentasOrigen,
      bancosOrigen: nuevosBancosOrigen,
      sucursalesOrigen: nuevasSucursalesOrigen,
      idsCuentasDestino: nuevosIdsCuentasDestino,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      valoresCuentasDestino: nuevosValoresCuentasDestino,
      sucursalesDestino: nuevasSucursalesDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
      pagos: nuevosPagos,
      correos: nuevosCorreos,
    });
  };

  const quitarInstruccionesPago = (pos) => {
    let importeTotal = 0;
    let nuevosIds = instruccionesAdicionales.ids;
    let nuevosTipos = instruccionesAdicionales.tipos;
    let nuevosProveedores = instruccionesAdicionales.proveedores;
    let nuevosRfcProveedores = instruccionesAdicionales.rfcProveedores;
    let nuevosValoresProveedores = instruccionesAdicionales.valoresProveedores;
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevosIdsCuentasOrigen = instruccionesAdicionales.idsCuentasOrigen;
    let nuevosIdsBancosOrigen = instruccionesAdicionales.idsBancosOrigen;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevosValoresCuentasOrigen =
      instruccionesAdicionales.valoresCuentasOrigen;
    let nuevosBancosOrigen = instruccionesAdicionales.bancosOrigen;
    let nuevasSucursalesOrigen = instruccionesAdicionales.sucursalesOrigen;
    let nuevosIdsCuentasDestino = instruccionesAdicionales.idsCuentasDestino;
    let nuevosIdsBancosDestino = instruccionesAdicionales.idsBancosDestino;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevosValoresCuentasDestino =
      instruccionesAdicionales.valoresCuentasDestino;
    let nuevasSucursalesDestino = instruccionesAdicionales.sucursalesDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    let nuevosPagos = instruccionesAdicionales.pagos;
    let nuevosCorreos = instruccionesAdicionales.correos;

    nuevosIds.splice(pos, 1);
    nuevosTipos.splice(pos, 1);
    nuevosProveedores.splice(pos, 1);
    nuevosRfcProveedores.splice(pos, 1);
    nuevosValoresProveedores.splice(pos, 1);
    nuevosImportes.splice(pos, 1);
    nuevosIdsCuentasOrigen.splice(pos, 1);
    nuevosIdsBancosOrigen.splice(pos, 1);
    nuevasCuentasOrigen.splice(pos, 1);
    nuevosValoresCuentasOrigen.splice(pos, 1);
    nuevosBancosOrigen.splice(pos, 1);
    nuevasSucursalesOrigen.splice(pos, 1);
    nuevosIdsCuentasDestino.splice(pos, 1);
    nuevosIdsBancosDestino.splice(pos, 1);
    nuevasCuentasDestino.splice(pos, 1);
    nuevosValoresCuentasDestino.splice(pos, 1);
    nuevasSucursalesDestino.splice(pos, 1);
    nuevasFechas.splice(pos, 1);
    nuevasLlavesMatch.splice(pos, 1);
    nuevosPagos.splice(pos, 1);
    nuevosCorreos.splice(pos, 1);

    for (let x = 0; x < instrucciones.importes.length; x++) {
      importeTotal = importeTotal + instrucciones.importes[x];
    }

    for (let x = 0; x < nuevosImportes.length; x++) {
      importeTotal = importeTotal + parseFloat(nuevosImportes);
    }

    setAplicado(importeTotal);
    setRestante(disponible - importeTotal);

    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      rfcProveedores: nuevosRfcProveedores,
      valoresProveedores: nuevosValoresProveedores,
      importes: nuevosImportes,
      idsCuentasOrigen: nuevosIdsCuentasOrigen,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      valoresCuentasOrigen: nuevosValoresCuentasOrigen,
      bancosOrigen: nuevosBancosOrigen,
      sucursalesOrigen: nuevasSucursalesOrigen,
      idsCuentasDestino: nuevosIdsCuentasDestino,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      valoresCuentasDestino: nuevosValoresCuentasDestino,
      sucursalesDestino: nuevasSucursalesDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
      pagos: nuevosPagos,
      correos: nuevosCorreos,
    });
  };

  const agregarCorreoProveedor = () => {
    let nuevosCorreosProveedores = instrucciones.correos;
    nuevosCorreosProveedores[indexProveedorSelected].push({
      correo: "",
      enviar: true,
      obligatorio: false,
    });
    setInstrucciones({
      ...instrucciones,
      correos: nuevosCorreosProveedores,
    });
  };

  const quitarCorreoProveedor = (pos) => {
    let nuevosCorreosProveedores = instrucciones.correos;
    nuevosCorreosProveedores[indexProveedorSelected].splice(pos, 1);
    setInstrucciones({
      ...instrucciones,
      correos: nuevosCorreosProveedores,
    });
  };

  const agregarCorreoProveedorPagosAdicionales = () => {
    let nuevosCorreosProveedores = instruccionesAdicionales.correos;
    nuevosCorreosProveedores[indexProveedorSelectedPagosAdicionales].push({
      correo: "",
      enviar: true,
      obligatorio: false,
    });
    setInstruccionesAdicionales({
      ...instruccionesAdicionales,
      correos: nuevosCorreosProveedores,
    });
  };

  const quitarCorreoProveedorPagosAdicionales = (pos) => {
    let nuevosCorreosProveedores = instruccionesAdicionales.correos;
    nuevosCorreosProveedores[indexProveedorSelectedPagosAdicionales].splice(
      pos,
      1
    );
    setInstruccionesAdicionales({
      ...instruccionesAdicionales,
      correos: nuevosCorreosProveedores,
    });
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                /* disabled */
                variant="outlined"
                label="Tipo de pago"
                type="text"
                value={tipoDocumento}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setTipoDocumento(parseInt(e.target.value));
                }}
              >
                <option value={2}>Anticipo a proveedores</option>
                <option value={3}>Pago a prestamos a acreedores</option>
                <option value={4}>Entrega de prestamos a deudores</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2} style={{ alignSelf: "center" }}>
              <Button
                style={{ width: "100%" }}
                variant="contained"
                color="primary"
                /* disabled */
                onClick={() => {
                  agregarInstruccionesPago();
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell align="right">
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Importe</strong>
                  </TableCell>
                  {/* <TableCell align="center">
                    <strong>Llave Match</strong>
                  </TableCell> */}
                  <TableCell align="center">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getInstrucciones()}
                {getInstruccionesPago()}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogInstrucciones}
        onClose={handleCloseDialogInstrucciones}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Documentos Relacionados
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              {/* <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>#Doc</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Vencimiento</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Sucursal</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>RFC</strong>
                  </TableCell>
                </TableRow>
              </TableHead> */}
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Serie-Folio</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pagado</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pendiente</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFlujosEfectivoFiltrados()}
                <TableRow>
                  <TableCell colSpan="4" />
                  <TableCell align="right">
                    <strong>Importe Total: </strong>
                  </TableCell>
                  <TableCell align="right">
                    ${number_format(totalEspecificos, 2, ".", ",")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogInstrucciones}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogProveedores}
        onClose={handleCloseDialogProveedores}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Información Proveedores
        </DialogTitle>
        <DialogContent>{getDatosProveedor()}</DialogContent>
        <DialogActions>
          <Button
            disabled={nuevoProveedorSelected}
            onClick={() => {
              if (proveedorSelected === -1) {
                swal("Error", "Seleccione un proveedor", "warning");
              } else if (cuentaDestinoSelected === -1) {
                swal("Error", "Seleccione una cuenta destino", "warning");
              } else {
                const proveedoresFilter = proveedores.filter(
                  (proveedor) =>
                    proveedor.razonsocial
                      .toLowerCase()
                      .indexOf(buscarProveedor.trim().toLowerCase()) !== -1 ||
                    proveedor.rfc
                      .toLowerCase()
                      .indexOf(buscarProveedor.trim().toLowerCase()) !== -1
                )[proveedorSelected];

                let nuevosProveedores = instruccionesAdicionales.proveedores;
                nuevosProveedores[indexInstruccionAdicionalSelected] =
                  proveedoresFilter.razonsocial;
                let nuevosRfcProveedores =
                  instruccionesAdicionales.rfcProveedores;
                nuevosRfcProveedores[indexInstruccionAdicionalSelected] =
                  proveedoresFilter.rfc;
                let nuevosValoresProveedores =
                  instruccionesAdicionales.valoresProveedores;
                nuevosValoresProveedores[
                  indexInstruccionAdicionalSelected
                ] = proveedorSelected;

                let nuevosIdsCuentasDestino =
                  instruccionesAdicionales.idsCuentasDestino;
                nuevosIdsCuentasDestino[indexInstruccionAdicionalSelected] =
                  cuentasDestinoProveedor[cuentaDestinoSelected].Id;
                let nuevosIdsBancosDestino =
                  instruccionesAdicionales.idsBancosDestino;
                nuevosIdsBancosDestino[indexInstruccionAdicionalSelected] =
                  cuentasDestinoProveedor[cuentaDestinoSelected].IdBanco;
                let nuevasCuentasDestino =
                  instruccionesAdicionales.cuentasDestino;
                nuevasCuentasDestino[indexInstruccionAdicionalSelected] =
                  cuentasDestinoProveedor[cuentaDestinoSelected].Layout;
                let nuevosValoresCuentasDestino =
                  instruccionesAdicionales.valoresCuentasDestino;
                nuevosValoresCuentasDestino[
                  indexInstruccionAdicionalSelected
                ] = cuentaDestinoSelected;
                let nuevasSucursalesDestino =
                  instruccionesAdicionales.sucursalesDestino;
                nuevasSucursalesDestino[indexInstruccionAdicionalSelected] =
                  cuentasDestinoProveedor[cuentaDestinoSelected].Sucursal !==
                  null
                    ? cuentasDestinoProveedor[cuentaDestinoSelected].Sucursal
                    : "";

                setInstruccionesAdicionales({
                  ...instruccionesAdicionales,
                  proveedores: nuevosProveedores,
                  rfcProveedores: nuevosRfcProveedores,
                  valoresProveedores: nuevosValoresProveedores,
                  idsCuentasDestino: nuevosIdsCuentasDestino,
                  idsBancosDestino: nuevosIdsBancosDestino,
                  cuentasDestino: nuevasCuentasDestino,
                  valoresCuentasDestino: nuevosValoresCuentasDestino,
                  sucursalesDestino: nuevasSucursalesDestino,
                });
                handleCloseDialogProveedores();
              }
            }}
            variant="contained"
            color="primary"
          >
            Guardar
          </Button>
          <Button
            onClick={handleCloseDialogProveedores}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogConfiguracionCorreos}
        onClose={handleCloseDialogConfiguracionCorreos}
        disableEscapeKeyDown={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {`Configuración de correos a ${proveedorElegido}`}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {false ? (
              <Fragment>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Correo de salida</Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={1}
                  style={{ alignSelf: "center", textAlign: "center" }}
                >
                  <Radio
                    color="primary"
                    checked={correoSalidaSelected === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCorreoSalidaSelected(0);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={9} md={5}>
                  <TextField
                    className={classes.textFields}
                    id="correodesalidapredeterminado"
                    label="Correo Predeterminado"
                    disabled
                    type="text"
                    margin="normal"
                    value={`miconsultor2020@gmail.com`}
                    inputProps={{
                      maxLength: 70,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 4);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 4);
                    }}
                    onClick={(e) => {
                      setCorreoSalidaSelected(0);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={1}
                  style={{ alignSelf: "center", textAlign: "center" }}
                >
                  <Radio
                    color="primary"
                    checked={correoSalidaSelected === 1}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCorreoSalidaSelected(1);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={9} md={5}>
                  <TextField
                    className={classes.textFields}
                    id="correodesalida"
                    label="Correo Del Proveedor"
                    type="text"
                    margin="normal"
                    disabled={correoSalidaSelected !== 1}
                    inputProps={{
                      maxLength: 100,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 4);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 4);
                    }}
                    onClick={(e) => {
                      setCorreoSalidaSelected(1);
                    }}
                  />
                </Grid>
              </Fragment>
            ) : null}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Correos a enviar</Typography>
            </Grid>
            {indexProveedorSelected !== -1 ? (
              instrucciones.correos[indexProveedorSelected].length > 0 ? (
                instrucciones.correos[indexProveedorSelected].map(
                  (infoCorreo, index) => {
                    return (
                      <Fragment key={index}>
                        <Grid item xs={9} md={5}>
                          <TextField
                            className={classes.textFields}
                            id={`correoparaenviar${index + 1}`}
                            label={`Correo ${index + 1}`}
                            type="text"
                            margin="normal"
                            disabled={infoCorreo.obligatorio}
                            value={infoCorreo.correo}
                            inputProps={{
                              maxLength: 100,
                            }}
                            onKeyPress={(e) => {
                              keyValidation(e, 4);
                            }}
                            onChange={(e) => {
                              pasteValidation(e, 4);
                              let nuevosCorreosProveedores =
                                instrucciones.correos;
                              nuevosCorreosProveedores[indexProveedorSelected][
                                index
                              ].correo = e.target.value;
                              setInstrucciones({
                                ...instrucciones,
                                correos: nuevosCorreosProveedores,
                              });
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          md={1}
                          style={{ alignSelf: "center", textAlign: "center" }}
                        >
                          {infoCorreo.obligatorio ? (
                            <Checkbox
                              color="primary"
                              checked={infoCorreo.enviar}
                              onChange={(e) => {
                                let nuevosCorreos = instrucciones.correos;
                                nuevosCorreos[indexProveedorSelected][
                                  index
                                ].enviar = e.target.checked;
                                setInstrucciones({
                                  ...instrucciones,
                                  correos: nuevosCorreos,
                                });
                                /* let nuevosEnviarProveedores = infoCorreo.enviar;
                                nuevosEnviarProveedores[index] =
                                  e.target.checked;
                                setCorreosProveedores({
                                  ...correosProveedores,
                                  enviar: nuevosEnviarProveedores,
                                }); */
                              }}
                            />
                          ) : (
                            <Tooltip title="Quitar">
                              <IconButton
                                onClick={() => {
                                  quitarCorreoProveedor(index);
                                }}
                              >
                                <CloseIcon color="secondary" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                      </Fragment>
                    );
                  }
                )
              ) : (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    Este proveedor no tiene correos configurados
                  </Typography>
                </Grid>
              )
            ) : null}
            {/* {correosProveedores.correo.map((correo, index) => {
              return (
                <Fragment key={index}>
                  <Grid item xs={9} md={5}>
                    <TextField
                      className={classes.textFields}
                      id={`correoparaenviar${index + 1}`}
                      label={`Correo ${index + 1}`}
                      type="text"
                      margin="normal"
                      disabled={correosProveedores.obligatorio[index]}
                      value={correo}
                      inputProps={{
                        maxLength: 100,
                      }}
                      onKeyPress={(e) => {
                        keyValidation(e, 4);
                      }}
                      onChange={(e) => {
                        pasteValidation(e, 4);
                        let nuevosCorreosProveedores =
                          correosProveedores.correo;
                        nuevosCorreosProveedores[index] = e.target.value;
                        setCorreosProveedores({
                          ...correosProveedores,
                          correo: nuevosCorreosProveedores,
                        });
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    md={1}
                    style={{ alignSelf: "center", textAlign: "center" }}
                  >
                    {correosProveedores.obligatorio[index] ? (
                      <Checkbox
                        color="primary"
                        checked={correosProveedores.enviar[index]}
                        onChange={(e) => {
                          let nuevosEnviarProveedores =
                            correosProveedores.enviar;
                          nuevosEnviarProveedores[index] = e.target.checked;
                          setCorreosProveedores({
                            ...correosProveedores,
                            enviar: nuevosEnviarProveedores,
                          });
                        }}
                      />
                    ) : (
                      <Tooltip title="Quitar">
                        <IconButton
                          onClick={() => {
                            quitarCorreoProveedor(index);
                          }}
                        >
                          <CloseIcon color="secondary" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Fragment>
              );
            })} */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  agregarCorreoProveedor();
                }}
              >
                Agregar Correo
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogConfiguracionCorreos}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogConfiguracionCorreosPagosAdicionales}
        onClose={handleCloseDialogConfiguracionCorreosPagosAdicionales}
        disableEscapeKeyDown={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {`Configuración de correos a ${proveedorElegidoPagosAdicionales}`}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {false ? (
              <Fragment>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Correo de salida</Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={1}
                  style={{ alignSelf: "center", textAlign: "center" }}
                >
                  <Radio
                    color="primary"
                    checked={correoSalidaSelected === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCorreoSalidaSelected(0);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={9} md={5}>
                  <TextField
                    className={classes.textFields}
                    id="correodesalidapredeterminadopagoadicional"
                    label="Correo Predeterminado"
                    disabled
                    type="text"
                    margin="normal"
                    value={`miconsultor2020@gmail.com`}
                    inputProps={{
                      maxLength: 70,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 4);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 4);
                    }}
                    onClick={(e) => {
                      setCorreoSalidaSelected(0);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  md={1}
                  style={{ alignSelf: "center", textAlign: "center" }}
                >
                  <Radio
                    color="primary"
                    checked={correoSalidaSelected === 1}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCorreoSalidaSelected(1);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={9} md={5}>
                  <TextField
                    className={classes.textFields}
                    id="correodesalida"
                    label="Correo Del Proveedor"
                    type="text"
                    margin="normal"
                    disabled={correoSalidaSelected !== 1}
                    inputProps={{
                      maxLength: 100,
                    }}
                    onKeyPress={(e) => {
                      keyValidation(e, 4);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 4);
                    }}
                    onClick={(e) => {
                      setCorreoSalidaSelected(1);
                    }}
                  />
                </Grid>
              </Fragment>
            ) : null}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Correos a enviar</Typography>
            </Grid>
            {indexProveedorSelectedPagosAdicionales !== -1 ? (
              instruccionesAdicionales.correos[
                indexProveedorSelectedPagosAdicionales
              ].length > 0 ? (
                instruccionesAdicionales.correos[
                  indexProveedorSelectedPagosAdicionales
                ].map((infoCorreo, index) => {
                  return (
                    <Fragment key={index}>
                      <Grid item xs={9} md={5}>
                        <TextField
                          className={classes.textFields}
                          id={`correoparaenviar${index + 1}`}
                          label={`Correo ${index + 1}`}
                          type="text"
                          margin="normal"
                          disabled={infoCorreo.obligatorio}
                          value={infoCorreo.correo}
                          inputProps={{
                            maxLength: 100,
                          }}
                          onKeyPress={(e) => {
                            keyValidation(e, 4);
                          }}
                          onChange={(e) => {
                            pasteValidation(e, 4);
                            let nuevosCorreosProveedores =
                              instruccionesAdicionales.correos;
                            nuevosCorreosProveedores[
                              indexProveedorSelectedPagosAdicionales
                            ][index].correo = e.target.value;
                            setInstruccionesAdicionales({
                              ...instruccionesAdicionales,
                              correos: nuevosCorreosProveedores,
                            });
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        md={1}
                        style={{ alignSelf: "center", textAlign: "center" }}
                      >
                        {infoCorreo.obligatorio ? (
                          <Checkbox
                            color="primary"
                            checked={infoCorreo.enviar}
                            onChange={(e) => {
                              let nuevosCorreos =
                                instruccionesAdicionales.correos;
                              nuevosCorreos[
                                indexProveedorSelectedPagosAdicionales
                              ][index].enviar = e.target.checked;
                              setInstruccionesAdicionales({
                                ...instruccionesAdicionales,
                                correos: nuevosCorreos,
                              });
                            }}
                          />
                        ) : (
                          <Tooltip title="Quitar">
                            <IconButton
                              onClick={() => {
                                quitarCorreoProveedorPagosAdicionales(index);
                              }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>
                    </Fragment>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    Este proveedor no tiene correos configurados
                  </Typography>
                </Grid>
              )
            ) : null}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  agregarCorreoProveedorPagosAdicionales();
                }}
              >
                Agregar Correo
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogConfiguracionCorreosPagosAdicionales}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function Paso4(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const instruccionesCombinadas = props.instruccionesCombinadas;
  const setInstruccionesCombinadas = props.setInstruccionesCombinadas;
  const informacionBancos = props.informacionBancos;
  const setInformacionBancos = props.setInformacionBancos;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  /* const idUsuario = props.idUsuario; */
  /* const usuarioStorage = props.usuarioStorage;
  const passwordStorage = props.passwordStorage;
  const executeGenerarLayouts = props.executeGenerarLayouts; */
  const setLoading = props.setLoading;
  const tiposPago = props.tiposPago;
  const idPagosAdicionalesExistentes = props.idPagosAdicionalesExistentes;
  const instrucciones = props.instrucciones;
  const instruccionesAdicionales = props.instruccionesAdicionales;
  /* const [infoLayouts, setInfoLayouts] = useState({
    ids: [],
    idsBancosOrigen: [],
    cuentasBeneficiarios: [],
    importes: [],
    tiposLayouts: [],
    pagos: [],
  }); */
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [
    flujosEfectivoFiltradosExtras,
    setFlujosEfectivoFiltradosExtras,
  ] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [totalEspecificosExtras, setTotalEspecificosExtras] = useState(0.0);
  const [openDialogInstrucciones, setOpenDialogInstrucciones] = useState(false);
  const [openDialogLayoutsBancos, setOpenDialogLayoutsBancos] = useState(false);
  /* const [layoutsBancos, setLayoutsBancos] = useState([]); */
  const [layoutsExistentesBancos, setLayoutsExistentesBancos] = useState([]);
  /* const [layoutContentConfig, setLayoutContentConfig] = useState([]); */
  /* const [idBancoElegido, setIdBancoElegido] = useState(-1); */
  const [infoBancosLayouts, setInfoBancosLayouts] = useState({
    idsBancosOrigen: [],
    bancosOrigen: [],
    combinacionesBancos: [],
    idsLayouts: [],
    nombresLayouts: [],
    linksLayouts: [],
  });
  const [
    {
      data: traerFlujosEfectivoFiltradosData,
      loading: traerFlujosEfectivoFiltradosLoading,
      error: traerFlujosEfectivoFiltradosError,
    },
    executeTraerFlujosEfectivoFiltrados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoFiltrados`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: traerLayoutsPorIdBancoData,
      loading: traerLayoutsPorIdBancoLoading,
      error: traerLayoutsPorIdBancoError,
    },
    executeTraerLayoutsPorIdBanco,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerLayoutsPorIdBanco`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: cambiarLayoutElegidoData,
      loading: cambiarLayoutElegidoLoading,
      error: cambiarLayoutElegidoError,
    },
    executeCambiarLayoutElegido,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarLayoutElegido`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    /* console.log(instrucciones);
    console.log(instruccionesAdicionales);
    console.log(idPagosAdicionalesExistentes); */
    if (idPagosAdicionalesExistentes.length > 0) {
      /* let ids = instrucciones.ids.concat(instruccionesAdicionales.ids); */
      let ids = instrucciones.ids.concat(idPagosAdicionalesExistentes);
      let tipos = instrucciones.tipos.concat(instruccionesAdicionales.tipos);
      let proveedores = instrucciones.proveedores.concat(
        instruccionesAdicionales.proveedores
      );
      let rfcProveedores = instrucciones.rfcProveedores.concat(
        instruccionesAdicionales.rfcProveedores
      );
      let importes = instrucciones.importes.concat(
        instruccionesAdicionales.importes
      );
      let idsCuentasOrigen = instrucciones.idsCuentasOrigen.concat(
        instruccionesAdicionales.idsCuentasOrigen
      );
      let idsBancosOrigen = instrucciones.idsBancosOrigen.concat(
        instruccionesAdicionales.idsBancosOrigen
      );
      let cuentasOrigen = instrucciones.cuentasOrigen.concat(
        instruccionesAdicionales.cuentasOrigen
      );
      let bancosOrigen = instrucciones.bancosOrigen.concat(
        instruccionesAdicionales.bancosOrigen
      );
      let sucursalesOrigen = instrucciones.sucursalesOrigen.concat(
        instruccionesAdicionales.sucursalesOrigen
      );
      let idsCuentasDestino = instrucciones.idsCuentasDestino.concat(
        instruccionesAdicionales.idsCuentasDestino
      );
      let idsBancosDestino = instrucciones.idsBancosDestino.concat(
        instruccionesAdicionales.idsBancosDestino
      );
      let cuentasDestino = instrucciones.cuentasDestino.concat(
        instruccionesAdicionales.cuentasDestino
      );
      let sucursalesDestino = instrucciones.sucursalesDestino.concat(
        instruccionesAdicionales.sucursalesDestino
      );
      let fechas = instrucciones.fechas.concat(instruccionesAdicionales.fechas);
      let llavesMatch = instrucciones.llavesMatch.concat(
        instruccionesAdicionales.llavesMatch
      );
      let pagos = instrucciones.pagos.concat(instruccionesAdicionales.pagos);
      for (let x = 0; x < instruccionesAdicionales.correos.length; x++) {
        for (let y = 0; y < instruccionesAdicionales.correos[x].length; y++) {
          instruccionesAdicionales.correos[x][y].idPago =
            idPagosAdicionalesExistentes[x];
        }
      }
      let correos = instrucciones.correos.concat(
        instruccionesAdicionales.correos
      );
      setInstruccionesCombinadas({
        ...instruccionesAdicionales,
        ids: ids,
        tipos: tipos,
        proveedores: proveedores,
        rfcProveedores: rfcProveedores,
        importes: importes,
        idsCuentasOrigen: idsCuentasOrigen,
        idsBancosOrigen: idsBancosOrigen,
        cuentasOrigen: cuentasOrigen,
        bancosOrigen: bancosOrigen,
        sucursalesOrigen: sucursalesOrigen,
        idsCuentasDestino: idsCuentasDestino,
        idsBancosDestino: idsBancosDestino,
        cuentasDestino: cuentasDestino,
        sucursalesDestino: sucursalesDestino,
        fechas: fechas,
        llavesMatch: llavesMatch,
        pagos: pagos,
        correos: correos,
      });
    }
  }, [
    instrucciones,
    instruccionesAdicionales,
    idPagosAdicionalesExistentes,
    setInstruccionesCombinadas,
  ]);

  useEffect(() => {
    let nuevosIds = [];
    let nuevosTipos = [];
    let nuevosProveedores = [];
    let nuevosRFCProveedores = [];
    let nuevosImportes = [];
    let nuevosIdsCuentasOrigen = [];
    let nuevosIdsBancosOrigen = [];
    let nuevasCuentasOrigen = [];
    let nuevosBancosOrigen = [];
    let nuevasSucursalesOrigen = [];
    let nuevosIdsCuentasDestino = [];
    let nuevosIdsBancosDestino = [];
    let nuevasCuentasDestino = [];
    let nuevasSucursalesDestino = [];
    let nuevasFechas = [];
    let nuevasLlavesMatch = [];
    let nuevosTiposLayouts = [];
    let nuevosPagos = [];
    let nuevosImportesPorPagos = [];
    let nuevosIdsFlwPorPago = [];
    let nuevasCombinacionesBancos = [];
    let nuevosIdsLayouts = [];
    let nuevosNombresLayouts = [];
    let nuevosLinksLayouts = [];

    function verExistencia(idCuentaOrigen, idBancoOrigen, idBancoDestino) {
      let pos = -1;
      let posiciones = [];
      for (let x = 0; x < nuevosIdsCuentasOrigen.length; x++) {
        if (nuevosIdsCuentasOrigen[x] === idCuentaOrigen) {
          posiciones.push(x);
        }
      }

      for (let x = 0; x < posiciones.length; x++) {
        if (
          (nuevosIdsBancosOrigen[posiciones[x]] ===
            nuevosIdsBancosDestino[posiciones[x]] &&
            idBancoOrigen === idBancoDestino) ||
          (nuevosIdsBancosOrigen[posiciones[x]] !==
            nuevosIdsBancosDestino[posiciones[x]] &&
            idBancoOrigen !== idBancoDestino)
        ) {
          pos = posiciones[x];
          break;
        }
      }
      return pos;
    }

    for (let x = 0; x < instruccionesCombinadas.idsBancosOrigen.length; x++) {
      let pos = verExistencia(
        instruccionesCombinadas.idsCuentasOrigen[x],
        instruccionesCombinadas.idsBancosOrigen[x],
        instruccionesCombinadas.idsBancosDestino[x]
      );
      if (pos === -1) {
        nuevosIds.push(instruccionesCombinadas.ids[x]);
        nuevosTipos.push(instruccionesCombinadas.tipos[x]);
        nuevosProveedores.push(instruccionesCombinadas.proveedores[x]);
        nuevosRFCProveedores.push(instruccionesCombinadas.rfcProveedores[x]);
        nuevosImportes.push(parseFloat(instruccionesCombinadas.importes[x]));
        nuevosIdsCuentasOrigen.push(
          instruccionesCombinadas.idsCuentasOrigen[x]
        );
        nuevosIdsBancosOrigen.push(instruccionesCombinadas.idsBancosOrigen[x]);
        nuevasCuentasOrigen.push(instruccionesCombinadas.cuentasOrigen[x]);
        nuevosBancosOrigen.push(instruccionesCombinadas.bancosOrigen[x]);
        nuevasSucursalesOrigen.push(
          instruccionesCombinadas.sucursalesOrigen[x]
        );
        nuevosIdsCuentasDestino.push(
          instruccionesCombinadas.idsCuentasDestino[x]
        );
        nuevosIdsBancosDestino.push(
          instruccionesCombinadas.idsBancosDestino[x]
        );
        nuevasCuentasDestino.push(instruccionesCombinadas.cuentasDestino[x]);
        nuevasSucursalesDestino.push(
          instruccionesCombinadas.sucursalesDestino[x]
        );
        nuevasFechas.push(instruccionesCombinadas.fechas[x]);
        nuevasLlavesMatch.push(instruccionesCombinadas.llavesMatch[x]);
        nuevosTiposLayouts.push(1);
        nuevosPagos.push(parseFloat(instruccionesCombinadas.pagos[x]));
        nuevosImportesPorPagos.push(instruccionesCombinadas.importes[x]);
        nuevosIdsFlwPorPago.push(instruccionesCombinadas.ids[x]);
        nuevasCombinacionesBancos.push(
          instruccionesCombinadas.idsBancosOrigen[x] ===
            instruccionesCombinadas.idsBancosDestino[x]
            ? 1
            : 2
        );
        nuevosIdsLayouts.push("");
        nuevosNombresLayouts.push("");
        nuevosLinksLayouts.push("");
      } else {
        nuevosIds[pos] = nuevosIds[pos] + "," + instruccionesCombinadas.ids[x];
        nuevosTipos[pos] =
          nuevosTipos[pos] + "-$-" + instruccionesCombinadas.tipos[x];
        nuevosProveedores[pos] =
          nuevosProveedores[pos] +
          "-$-" +
          instruccionesCombinadas.proveedores[x];
        nuevosRFCProveedores[pos] =
          nuevosRFCProveedores[pos] +
          "-$-" +
          instruccionesCombinadas.rfcProveedores[x];
        nuevosImportes[pos] =
          nuevosImportes[pos] + instruccionesCombinadas.importes[x];
        nuevosPagos[pos] = nuevosPagos[pos] + instruccionesCombinadas.pagos[x];
        if (nuevasFechas[pos] !== instruccionesCombinadas.fechas[x]) {
          nuevasFechas[pos] =
            nuevasFechas[pos] + ", " + instruccionesCombinadas.fechas[x];
        }
        nuevasCuentasDestino[pos] =
          nuevasCuentasDestino[pos] +
          "-$-" +
          instruccionesCombinadas.cuentasDestino[x];
        nuevasSucursalesDestino[pos] =
          nuevasSucursalesDestino[pos] +
          "-$-" +
          instruccionesCombinadas.sucursalesDestino[x];
        nuevosImportesPorPagos[pos] =
          nuevosImportesPorPagos[pos] +
          "-$-" +
          instruccionesCombinadas.importes[x];
        nuevosIdsFlwPorPago[pos] =
          nuevosIdsFlwPorPago[pos] + "-$-" + instruccionesCombinadas.ids[x];
      }
    }
    setInformacionBancos({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      rfcProveedores: nuevosRFCProveedores,
      importes: nuevosImportes,
      idsCuentasOrigen: nuevosIdsCuentasOrigen,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      bancosOrigen: nuevosBancosOrigen,
      sucursalesOrigen: nuevasSucursalesOrigen,
      idsCuentasDestino: nuevosIdsCuentasDestino,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      sucursalesDestino: nuevasSucursalesDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
      tiposLayouts: nuevosTiposLayouts,
      pagos: nuevosPagos,
      importesPorPagos: nuevosImportesPorPagos,
      idsFlwPorPago: nuevosIdsFlwPorPago,
      combinacionesBancos: nuevasCombinacionesBancos,
      idsLayouts: nuevosIdsLayouts,
      nombresLayouts: nuevosNombresLayouts,
      linksLayouts: nuevosLinksLayouts,
    });
  }, [instruccionesCombinadas, setInformacionBancos]);

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoFiltradosData) {
        if (traerFlujosEfectivoFiltradosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerFlujosEfectivoFiltradosData.error),
            "warning"
          );
        } else {
          setFlujosEfectivoFiltrados(
            traerFlujosEfectivoFiltradosData.flujosefectivo
          );
          let total = 0;
          for (
            let x = 0;
            x < traerFlujosEfectivoFiltradosData.flujosefectivo.length;
            x++
          ) {
            total =
              total +
              parseFloat(
                traerFlujosEfectivoFiltradosData.flujosefectivo[x].Importe
              );
          }
          setTotalEspecificos(total);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoFiltradosData]);

  useEffect(() => {
    function checkData() {
      if (traerLayoutsPorIdBancoData) {
        if (traerLayoutsPorIdBancoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerLayoutsPorIdBancoData.error),
            "warning"
          );
        } else {
          /* setLayoutsBancos(traerLayoutsPorIdBancoData.layouts); */
          setLayoutsExistentesBancos(traerLayoutsPorIdBancoData.layouts);
          /* console.log(traerLayoutsPorIdBancoData.layouts);
          console.log(informacionBancos); */
          /* let bancosOrigen = informacionBancos.bancosOrigen;
          let combinacionesBancos = informacionBancos.combinacionesBancos; */

          let nuevosIdsBancosOrigen = [];
          let nuevosBancosOrigen = [];
          let nuevasCombinacionesBancos = [];
          let nuevosIdsLayouts = [];
          let nuevosNombresLayouts = [];
          let nuevosLinksLayouts = [];

          for (let x = 0; x < informacionBancos.idsBancosOrigen.length; x++) {
            nuevosIdsBancosOrigen.push(informacionBancos.idsBancosOrigen[x]);
            nuevosBancosOrigen.push(informacionBancos.bancosOrigen[x]);
            nuevasCombinacionesBancos.push(
              informacionBancos.combinacionesBancos[x]
            );
            nuevosIdsLayouts.push(0);
            nuevosNombresLayouts.push("");
            nuevosLinksLayouts.push("");
            const infoLayout = traerLayoutsPorIdBancoData.layouts.filter(
              (layout) =>
                layout.IdBanco === informacionBancos.idsBancosOrigen[x] &&
                layout.Destino === informacionBancos.combinacionesBancos[x]
            );
            if (infoLayout.length > 0) {
              nuevosIdsLayouts[x] = infoLayout[0].id;
              nuevosNombresLayouts[x] = infoLayout[0].NombreLayout;
              nuevosLinksLayouts[x] = infoLayout[0].LinkLayout;
            }
          }
          setInfoBancosLayouts({
            idsBancosOrigen: nuevosIdsBancosOrigen,
            bancosOrigen: nuevosBancosOrigen,
            combinacionesBancos: nuevasCombinacionesBancos,
            idsLayouts: nuevosIdsLayouts,
            nombresLayouts: nuevosNombresLayouts,
            linksLayouts: nuevosLinksLayouts,
          });
        }
      }
    }

    checkData();
  }, [traerLayoutsPorIdBancoData, informacionBancos]);

  useEffect(() => {
    function checkData() {
      if (cambiarLayoutElegidoData) {
        if (cambiarLayoutElegidoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarLayoutElegidoData.error),
            "warning"
          );
        } else {
          /* setLayoutsBancos(cambiarLayoutElegidoData.layouts); */
        }
      }
    }

    checkData();
  }, [cambiarLayoutElegidoData]);

  if (
    traerFlujosEfectivoFiltradosLoading ||
    traerLayoutsPorIdBancoLoading ||
    cambiarLayoutElegidoLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    traerFlujosEfectivoFiltradosError ||
    traerLayoutsPorIdBancoError ||
    cambiarLayoutElegidoError
  ) {
    return <ErrorQueryDB />;
  }

  const getInformacionBancos = () => {
    if (informacionBancos.cuentasOrigen.length > 0) {
      return informacionBancos.cuentasOrigen.map((cuentaOrigen, index) => {
        //let pos = tiposPago.valores.indexOf(informacionBancos.tipos[index]);
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              {/* <Checkbox
                color="primary"
                checked={
                  infoLayouts.ids.indexOf(informacionBancos.ids[index]) !== -1
                }
                onChange={(e) => {
                  let nuevosIds = infoLayouts.ids;
                  let nuevosIdsBancosOrigen = infoLayouts.idsBancosOrigen;
                  let nuevasCuentasBeneficiarios =
                    infoLayouts.cuentasBeneficiarios;
                  let nuevosImportes = infoLayouts.importes;
                  let nuevosTiposLayouts = infoLayouts.tiposLayouts;
                  let nuevosPagos = infoLayouts.pagos;

                  if (e.target.checked) {
                    nuevosIds.push(informacionBancos.ids[index]);
                    nuevosIdsBancosOrigen.push(
                      informacionBancos.idsBancosOrigen[index]
                    );
                    nuevasCuentasBeneficiarios.push(
                      informacionBancos.cuentasDestino[index].slice(-4)
                    );
                    nuevosImportes.push(informacionBancos.importes[index]);
                    nuevosTiposLayouts.push(1);
                    nuevosPagos.push(informacionBancos.pagos[index]);
                  } else {
                    const pos = nuevosIds.indexOf(informacionBancos.ids[index]);
                    nuevosIds.splice(pos, 1);
                    nuevosIdsBancosOrigen.splice(pos, 1);
                    nuevasCuentasBeneficiarios.splice(pos, 1);
                    nuevosImportes.splice(pos, 1);
                    nuevosTiposLayouts.splice(pos, 1);
                    nuevosPagos.splice(pos, 1);
                  }
                  setInfoLayouts({
                    ids: nuevosIds,
                    idsBancosOrigen: nuevosIdsBancosOrigen,
                    cuentasBeneficiarios: nuevasCuentasBeneficiarios,
                    importes: nuevosImportes,
                    tiposLayouts: nuevosTiposLayouts,
                    pagos: nuevosPagos,
                  });
                }}
              /> */}
            </TableCell>
            {/* <TableCell align="left">{tiposPago.tipos[pos]}</TableCell>
            <TableCell align="right">
              {informacionBancos.proveedores[index]}
            </TableCell> */}
            <TableCell align="right">{cuentaOrigen}</TableCell>
            <TableCell align="right">
              {/* {informacionBancos.cuentasDestino[index].slice(0, -5)} */}
              {informacionBancos.idsBancosOrigen[index] ===
              informacionBancos.idsBancosDestino[index]
                ? "Mismo Banco"
                : "Otros Bancos"}
            </TableCell>
            <TableCell align="right">
              ${number_format(informacionBancos.pagos[index], 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              {/* {informacionBancos.fechas[index]} */}
              {moment().format("YYYY-MM-DD")}
            </TableCell>
            <TableCell align="right">
              {/* <Tooltip title="Descargar">
                <IconButton
                  onClick={() => {
                    executeGenerarLayouts({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        idusuario: idUsuario,
                        usuario_storage: usuarioStorage,
                        password_storage: passwordStorage,
                        idsbancosorigen: [
                          informacionBancos.idsBancosOrigen[index],
                        ],
                        tipolayout: [1],
                        cuentabeneficiario: [
                          informacionBancos.cuentasDestino[index].slice(-4),
                        ],
                        importepagado: [informacionBancos.pagos[index]],
                      },
                    });
                  }}
                >
                  <GetAppIcon color="primary" />
                </IconButton>
              </Tooltip> */}
              <Tooltip title="Ver Documentos">
                <IconButton
                  onClick={() => {
                    /* console.log(informacionBancos);
                    console.log(instruccionesCombinadas);
                    console.log(informacionBancos.ids[index]); */
                    obtenerDocumentosPorPago(
                      informacionBancos.ids[index],
                      informacionBancos.tipos[index]
                    );
                  }}
                >
                  <FindInPageIcon color="primary" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Configuracion De Layouts">
                <IconButton
                  onClick={() => {
                    executeTraerLayoutsPorIdBanco({
                      params: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        idBanco: informacionBancos.idsBancosOrigen[index],
                        combinacion:
                          informacionBancos.combinacionesBancos[index],
                      },
                    });
                    handleClickOpenDialogLayoutsBancos();
                  }}
                >
                  <FileCopyIcon color="primary" />
                </IconButton>
              </Tooltip> */}
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  const obtenerDocumentosPorPago = (ids, tiposDocumentos) => {
    let idsExtraidos = ids.toString().split(",");
    let tiposDocumentosExtraidos = tiposDocumentos.toString().split("-$-");
    let nuevosIds = [];
    let nuevosFlujosEfectivosFiltradosExtras = [];
    let nuevoTotalExtra = 0.0;
    for (let x = 0; x < idsExtraidos.length; x++) {
      idsExtraidos[x] = parseInt(idsExtraidos[x]);
      tiposDocumentosExtraidos[x] = parseInt(tiposDocumentosExtraidos[x]);
      if (tiposDocumentosExtraidos[x] === 1) {
        nuevosIds.push(idsExtraidos[x]);
      } else {
        for (let y = 0; y < instruccionesCombinadas.ids.length; y++) {
          if (idsExtraidos[x] === instruccionesCombinadas.ids[y]) {
            nuevosFlujosEfectivosFiltradosExtras.push({
              cuentaOrigen: instruccionesCombinadas.cuentasOrigen[y],
              cuentaDestino: instruccionesCombinadas.cuentasDestino[y],
              importe: instruccionesCombinadas.importes[y],
              proveedor: instruccionesCombinadas.proveedores[y],
              tipo: instruccionesCombinadas.tipos[y],
            });
            nuevoTotalExtra =
              nuevoTotalExtra + parseFloat(instruccionesCombinadas.importes[y]);
            break;
          }
        }
      }
    }

    setFlujosEfectivoFiltradosExtras(nuevosFlujosEfectivosFiltradosExtras);
    setTotalEspecificosExtras(nuevoTotalExtra);

    if (nuevosIds.length > 0) {
      executeTraerFlujosEfectivoFiltrados({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: 46,
          forma: 4,
          ids: nuevosIds,
          filtro: 0,
          pendiente: 0,
        },
      });
    } else {
      setFlujosEfectivoFiltrados([]);
      setTotalEspecificos(0.0);
    }
    handleClickOpenDialogInstrucciones();
  };

  const getFlujosEfectivoFiltrados = () => {
    if (flujosEfectivoFiltrados.length > 0) {
      return flujosEfectivoFiltrados.map((flujoEfectivo, index) => {
        const pos = instruccionesPagoProveedores.ids.indexOf(flujoEfectivo.id);
        const importe = instruccionesPagoProveedores.pagos[pos];
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell component="th" scope="row">
              {flujoEfectivo.Razon}
            </TableCell>
            <TableCell align="right">{`${
              flujoEfectivo.Serie !== null ? flujoEfectivo.Serie : "Sin Serie"
            }-${
              flujoEfectivo.Folio !== null ? flujoEfectivo.Folio : "Sin Folio"
            }`}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.Pendiente, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              ${number_format(importe, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              $
              {number_format(
                parseFloat(flujoEfectivo.Pendiente) - parseFloat(importe),
                2,
                ".",
                ","
              )}
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={5}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  const getFlujosEfectivoFiltradosExtras = () => {
    if (flujosEfectivoFiltradosExtras.length > 0) {
      return flujosEfectivoFiltradosExtras.map((flujoEfectivo, index) => {
        let pos = tiposPago.valores.indexOf(flujoEfectivo.tipo);
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell component="th" scope="row">
              {flujoEfectivo.cuentaOrigen}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.cuentaDestino}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.importe, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.proveedor}</TableCell>
            <TableCell align="right">{tiposPago.tipos[pos]}</TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={5}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  const handleClickOpenDialogInstrucciones = () => {
    setOpenDialogInstrucciones(true);
  };

  const handleCloseDialogInstrucciones = () => {
    setOpenDialogInstrucciones(false);
  };

  const handleClickOpenDialogLayoutsBancos = () => {
    setOpenDialogLayoutsBancos(true);
  };

  const handleCloseDialogLayoutsBancos = () => {
    setOpenDialogLayoutsBancos(false);
    /* setLayoutContentConfig([]); */
  };

  /* const getLayoutsBancos2 = () => {
    console.log(layoutsExistentesBancos);
    if (layoutsBancos.length > 0) {
      return layoutsBancos.map((layout, index) => {
        return (
          <Grid item xs={12} md={4} key={index}>
            <CardActionArea>
              <Card
                style={{
                  height: "200px",
                  padding: "15px",
                  overflow: "auto",
                  border: layout.Eleccion === 1 ? "2px solid green" : "",
                }}
                onClick={() => {
                  executeCambiarLayoutElegido({
                    data: {
                      usuario: correoUsuario,
                      pwd: passwordUsuario,
                      rfc: rfcEmpresa,
                      idsubmenu: 46,
                      idUsuario: idUsuario,
                      idBancoActual: idBancoElegido,
                      idBanco: layout.IdBanco,
                      idLayout: layout.id,
                    },
                  });
                }}
              >
                <Typography
                  variant="h6"
                  style={{ textAlign: "center", fontSize: "xxx-large" }}
                >
                  {layout.NombreLayout}
                </Typography>
              </Card>
            </CardActionArea>
          </Grid>
        );
      });
    } else {
      return (
        <Typography variant="subtitle1" style={{ textAlign: "center" }}>
          Sin Layouts
        </Typography>
      );
    }
  }; */

  /* const getLayoutsBancos = () => {
    if (layoutsExistentesBancos.length > 0) {
      return layoutsExistentesBancos.map((layout, index) => {
        return (
          <ListItem key={index} button selected={layout.Eleccion === 1}>
            <ListItemText
              primary={layout.NombreLayout}
              secondary={
                layout.Destino === 1
                  ? "Mismo Banco"
                  : layout.Destino === 2
                  ? "Otros Bancos"
                  : ""
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Ver Contenido">
                <IconButton
                  edge="end"
                  aria-label="details"
                  onClick={() => {
                    setLayoutContentConfig(
                      layoutsExistentesBancos[index].ConfigContent
                    );
                  }}
                >
                  <ListAltIcon color="primary" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <Typography variant="subtitle1" style={{ textAlign: "center" }}>
          Sin Layouts
        </Typography>
      );
    }
  };

  const getLayoutConfigContent = () => {
    if (layoutContentConfig.length > 0) {
      return layoutContentConfig.map((layout, index) => {
        return (
          <ListItem key={index}>
            <ListItemText
              primary={`${layout.posicion}. ${layout.NombreVariable}`}
              secondary={`Longitud: ${layout.Longitud}. Alineación: ${
                layout.Alineacion === 1 ? "Derecha" : "Izquierda"
              }. Llenado: ${
                layout.Llenado === " " || layout.Llenado === null
                  ? "Espacios"
                  : layout.Llenado
              }.`}
            />
          </ListItem>
        );
      });
    } else {
      return (
        <Typography variant="subtitle1" style={{ textAlign: "center" }}>
          Sin Layout Seleccionado
        </Typography>
      );
    }
  }; */

  const getLayoutsBancos = () => {
    /* console.log(informacionBancos);
    console.log(layoutsExistentesBancos);
    console.log(infoBancosLayouts); */
    if (infoBancosLayouts.bancosOrigen.length > 0) {
      return infoBancosLayouts.bancosOrigen.map((bancoOrigen, index) => {
        /* const infoLayout = layoutsExistentesBancos.filter(
          (layout) =>
            layout.IdBanco === informacionBancos.idsBancosOrigen[index] &&
            layout.Destino === informacionBancos.combinacionesBancos[index]
        );
        console.log(infoLayout); */
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell component="th" scope="row">
              {infoBancosLayouts.bancosOrigen[index]}
            </TableCell>
            <TableCell align="right">
              {infoBancosLayouts.combinacionesBancos[index] === 1
                ? "Mismo Banco"
                : "Otros Bancos"}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                value={infoBancosLayouts.idsLayouts[index]}
                variant="outlined"
                type="text"
                margin="normal"
                onChange={(e) => {
                  let nuevosIdsLayouts = infoBancosLayouts.idsLayouts;
                  let nuevosNombresLayouts = infoBancosLayouts.nombresLayouts;
                  let nuevosLinksLayouts = infoBancosLayouts.linksLayouts;

                  const nuevoLayout = layoutsExistentesBancos.filter(
                    (layout) => layout.id === parseInt(e.target.value)
                  );
                  nuevosIdsLayouts[index] =
                    nuevoLayout.length > 0 ? nuevoLayout[0].id : 0;
                  nuevosNombresLayouts[index] =
                    nuevoLayout.length > 0 ? nuevoLayout[0].NombreLayout : "";
                  nuevosLinksLayouts[index] =
                    nuevoLayout.length > 0 ? nuevoLayout[0].LinkLayout : "";

                  setInfoBancosLayouts({
                    ...infoBancosLayouts,
                    idsLayouts: nuevosIdsLayouts,
                    nombresLayouts: nuevosNombresLayouts,
                    linksLayouts: nuevosLinksLayouts,
                  });
                }}
              >
                <option value={0}>Sin Layout</option>
                {layoutsExistentesBancos.map((layout, index) => {
                  return (
                    <option key={index} value={layout.id}>
                      {layout.NombreLayout}
                    </option>
                  );
                })}
              </TextField>
              {/* <span style={{ color: "blue" }}>
                  {infoLayout[0].NombreLayout}.txt
                </span> */}
              {/* {infoLayout.length > 0 ? (
                <TextField
                  className={classes.textFields}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={infoLayout[0].id}
                  variant="outlined"
                  type="text"
                  margin="normal"
                >
                  {layoutsExistentesBancos.map((layout, index) => {
                    return (
                      <option key={index} value={layout.id}>{layout.NombreLayout}</option>
                    )
                  })}
                </TextField>
              ) : (
                <TextField
                  className={classes.textFields}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  type="text"
                  margin="normal"
                >
                  <option value={0}>Sin Layout</option>
                  {layoutsExistentesBancos.map((layout, index) => {
                    return (
                      <option key={index} value={layout.id}>{layout.NombreLayout}</option>
                    )
                  })}
                </TextField>
              )} */}
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={3}>Sin Layouts</TableCell>
        </TableRow>
      );
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={infoLayouts.ids.length === 0}
            onClick={() => {
              executeGenerarLayouts({
                data: {
                  usuario: correoUsuario,
                  pwd: passwordUsuario,
                  rfc: rfcEmpresa,
                  idsubmenu: 46,
                  idusuario: idUsuario,
                  usuario_storage: usuarioStorage,
                  password_storage: passwordStorage,
                  idsbancosorigen: infoLayouts.idsBancosOrigen,
                  tipolayout: infoLayouts.tiposLayouts,
                  cuentabeneficiario: infoLayouts.cuentasBeneficiarios,
                  importepagado: infoLayouts.pagos,
                },
              });
            }}
          >
            Descargar Seleccionados
          </Button>
        </Grid> */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              executeTraerLayoutsPorIdBanco({
                params: {
                  usuario: correoUsuario,
                  pwd: passwordUsuario,
                  rfc: rfcEmpresa,
                  idsubmenu: 46,
                },
              });
              handleClickOpenDialogLayoutsBancos();
            }}
          >
            Configuración de Layouts
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  {/* <TableCell>
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell> */}
                  <TableCell align="right">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="right">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{getInformacionBancos()}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogInstrucciones}
        onClose={handleCloseDialogInstrucciones}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Documentos Relacionados
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="subtitle1"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            <strong>Pagos a proveedores</strong>
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Serie-Folio</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pagado</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pendiente</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFlujosEfectivoFiltrados()}
                <TableRow>
                  <TableCell colSpan="4" />
                  <TableCell align="right">
                    <strong>Total Pagado: </strong>
                  </TableCell>
                  <TableCell align="right">
                    ${number_format(totalEspecificos, 2, ".", ",")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            variant="subtitle1"
            style={{
              textAlign: "center",
              marginTop: "15px",
              marginBottom: "10px",
            }}
          >
            <strong>Otros pagos</strong>
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Tipo</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFlujosEfectivoFiltradosExtras()}
                <TableRow>
                  <TableCell colSpan="4" />
                  <TableCell align="right">
                    <strong>Total Pendiente: </strong>
                  </TableCell>
                  <TableCell align="right">
                    ${number_format(totalEspecificosExtras, 2, ".", ",")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogInstrucciones}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogLayoutsBancos}
        onClose={handleCloseDialogLayoutsBancos}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          Información de Layouts
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell>
                        <strong>Banco Origen</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Banco Destino</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Layout</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{getLayoutsBancos()}</TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                Layouts
              </Typography>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
              >
                {getLayoutsBancos()}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                Contenido Layout
              </Typography>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
                dense={false}
              >
                {getLayoutConfigContent()}
              </List>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              console.log(infoBancosLayouts);
              executeCambiarLayoutElegido({
                data: {
                  usuario: correoUsuario,
                  pwd: passwordUsuario,
                  rfc: rfcEmpresa,
                  idsubmenu: 46,
                  idsBancosOrigen: infoBancosLayouts.idsBancosOrigen,
                  combinacionesBancos: infoBancosLayouts.combinacionesBancos,
                  idsLayouts: infoBancosLayouts.idsLayouts,
                },
              });
            }}
            variant="contained"
            color="primary"
          >
            Guardar Cambios
          </Button>
          <Button
            onClick={handleCloseDialogLayoutsBancos}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
