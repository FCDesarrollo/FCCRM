import React, { useState, useEffect, Fragment } from "react";
import {
  Grid,
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
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ExpansionPanel,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  useMediaQuery,
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
} from "@material-ui/core";
import {
  Settings as SettingsIcon,
  Error as ErrorIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ClearAll as ClearAllIcon,
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddCircleIcon,
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import jwt from "jsonwebtoken";
import swal from "sweetalert";
import moment from "moment";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  doublePasteValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import { verificarArchivoMovimiento } from "../../helpers/extensionesArchivos";

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
  formButtons: {
    width: "100%",
  },
}));

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

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

function createData(
  id,
  nombreEmpresa,
  rutaEmpresa,
  rfc,
  fechaRegistro,
  acciones
) {
  return { id, nombreEmpresa, rutaEmpresa, rfc, fechaRegistro, acciones };
}

function createDataUsuarios(
  id,
  usuario,
  celular,
  correo,
  perfil,
  estatus
  /* acciones */
) {
  return { id, usuario, celular, correo, perfil, estatus /* acciones */ };
}

function createDataNotificaciones(
  id,
  mensaje,
  usuario,
  fechaMensaje,
  estatus,
  estatusEscrito
) {
  return { id, mensaje, usuario, fechaMensaje, estatus, estatusEscrito };
}

function createDataMovimientos(
  id,
  fecha,
  documento,
  cargo,
  abono,
  pendienteDocumento,
  saldo,
  acciones
) {
  return {
    id,
    fecha,
    documento,
    cargo,
    abono,
    pendienteDocumento,
    saldo,
    acciones,
  };
}

function createDataServicios(
  id,
  servicio,
  precio,
  descripcion,
  tipo,
  fecha,
  estatus,
  acciones
) {
  return { id, servicio, precio, descripcion, tipo, fecha, estatus, acciones };
}

let filterRows = [];
let filterRowsUsuarios = [];
let filterRowsNotificaciones = [];
let filterRowsMovimientos = [];
let filterRowsServicios = [];

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
    id: "id",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "#",
  },
  {
    id: "nombreEmpresa",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Nombre Empresa",
  },
  {
    id: "rutaEmpresa",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Base de Datos",
  },
  {
    id: "rfc",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "RFC",
  },
  {
    id: "fechaRegistro",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha de Registro",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

const headCellsUsuarios = [
  {
    id: "id",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "#",
  },
  {
    id: "usuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario",
  },
  {
    id: "celular",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Celular",
  },
  {
    id: "correo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Correo",
  },
  {
    id: "perfil",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Perfil",
  },
  /* {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  }, */
];

const headCellsNotificaciones = [
  {
    id: "id",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "#",
  },
  {
    id: "mensaje",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Mensaje",
  },
  {
    id: "usuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario",
  },
  {
    id: "fechaMensaje",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha De Mensaje",
  },
  {
    id: "status",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Estatus",
  },
  /* {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  }, */
];

const headCellsMovimientos = [
  {
    id: "fecha",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "documento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Documento",
  },
  {
    id: "cargo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Cargo",
  },
  {
    id: "abono",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Abono",
  },
  {
    id: "pendienteDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Pendiente Del Documento",
  },
  {
    id: "saldo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Saldo",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

const headCellsMovimientosAsociacion = [
  {
    id: "fecha",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "documento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Documento",
  },
  {
    id: "cargo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Cargo",
  },
  {
    id: "abono",
    align: "center",
    sortHeadCell: true,
    disablePadding: false,
    label: "Abono",
  },
  {
    id: "saldo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Saldo",
  },
];

const headCellsServicios = [
  {
    id: "servicio",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Servicio",
  },
  {
    id: "precio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Precio",
  },
  {
    id: "descripcion",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Descripción",
  },
  {
    id: "tipo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo",
  },
  {
    id: "fecha",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "estatus",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Estatus",
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
}

export default function Empresas(props) {
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const setLoading = props.setLoading;
  const [showComponent, setShowComponent] = useState(0);
  const [idEmpresa, setIdEmpresa] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [rowsUsuarios, setRowsUsuarios] = useState([]);
  const [pageUsuarios, setPageUsuarios] = useState(0);
  const [pageMovimientos, setPageMovimientos] = useState(0);
  const [busquedaFiltroUsuarios, setBusquedaFiltroUsuarios] = useState("");
  const [busquedaFiltroMovimientos, setBusquedaFiltroMovimientos] =
    useState("");
  const [rowsServicios, setRowsServicios] = useState([]);
  const [pageServicios, setPageServicios] = useState(0);
  const [busquedaFiltroServicios, setBusquedaFiltroServicios] = useState("");
  const [baseDatosEmpresa, setBaseDatosEmpresa] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  const [
    {
      data: getEmpresasData,
      loading: getEmpresasLoading,
      error: getEmpresasError,
    },
    executeGetEmpresass,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getEmpresas`,
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

  useEffect(() => {
    if (localStorage.getItem("menuTemporal")) {
      try {
        const decodedToken = jwt.verify(
          localStorage.getItem("menuTemporal"),
          "mysecretpassword"
        );
        if (decodedToken.menuTemporal.modulo === "empresas") {
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setIdEmpresa(decodedToken.menuTemporal.idEmpresa);
          setBaseDatosEmpresa(decodedToken.menuTemporal.baseDatosEmpresa);
          setNombreEmpresa(decodedToken.menuTemporal.nombreEmpresa);
          setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
          setPage(decodedToken.menuTemporal.page);
          setBusquedaFiltroUsuarios(
            decodedToken.menuTemporal.busquedaFiltroUsuarios
          );
          setPageUsuarios(decodedToken.menuTemporal.pageUsuarios);
          setBusquedaFiltroServicios(
            decodedToken.menuTemporal.busquedaFiltroServicios
          );
          setPageServicios(decodedToken.menuTemporal.pageServicios);
          setBusquedaFiltroMovimientos(
            decodedToken.menuTemporal.busquedaFiltroMovimientos
          );
          setPageMovimientos(decodedToken.menuTemporal.pageMovimientos);
        } else {
          const token = jwt.sign(
            {
              menuTemporal: {
                modulo: "empresas",
                showComponent: 0,
                idEmpresa: 0,
                baseDatosEmpresa: "",
                nombreEmpresa: "",
                busquedaFiltro: "",
                page: 0,
                busquedaFiltroUsuarios: "",
                pageUsuarios: 0,
                busquedaFiltroServicios: "",
                pageServicios: 0,
                busquedaFiltroMovimientos: "",
                pageMovimientos: 0,
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
            modulo: "empresas",
            showComponent: 0,
            idEmpresa: 0,
            baseDatosEmpresa: "",
            nombreEmpresa: "",
            busquedaFiltro: "",
            page: 0,
            busquedaFiltroUsuarios: "",
            pageUsuarios: 0,
            busquedaFiltroServicios: "",
            pageServicios: 0,
            busquedaFiltroMovimientos: "",
            pageMovimientos: 0,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
  }, []);

  useEffect(() => {
    if (getEmpresasData) {
      if (getEmpresasData.error !== 0) {
        swal("Error", dataBaseErrores(getEmpresasData.error), "warning");
      } else {
        filterRows = [];
        getEmpresasData.empresas.map((empresa) => {
          return filterRows.push(
            createData(
              empresa.idempresa,
              empresa.nombreempresa,
              empresa.rutaempresa,
              empresa.RFC,
              empresa.fecharegistro,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRows(filterRows);
      }
    }
  }, [getEmpresasData]);

  if (getEmpresasLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getEmpresasError) {
    return <ErrorQueryDB />;
  }

  return (
    <div>
      {showComponent === 0 ? (
        <ListaEmpresas
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          executeGetEmpresass={executeGetEmpresass}
          rows={rows}
          setRows={setRows}
          idEmpresa={idEmpresa}
          setIdEmpresa={setIdEmpresa}
          page={page}
          setPage={setPage}
          busquedaFiltro={busquedaFiltro}
          setBusquedaFiltro={setBusquedaFiltro}
          baseDatosEmpresa={baseDatosEmpresa}
          setBaseDatosEmpresa={setBaseDatosEmpresa}
          setNombreEmpresa={setNombreEmpresa}
          nombreEmpresa={nombreEmpresa}
        />
      ) : showComponent === 1 ? (
        <ListaUsuariosPorEmpresa
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          idEmpresa={idEmpresa}
          rows={rowsUsuarios}
          setRows={setRowsUsuarios}
          page={page}
          pageUsuarios={pageUsuarios}
          setPageUsuarios={setPageUsuarios}
          busquedaFiltro={busquedaFiltro}
          busquedaFiltroUsuarios={busquedaFiltroUsuarios}
          setBusquedaFiltroUsuarios={setBusquedaFiltroUsuarios}
          baseDatosEmpresa={baseDatosEmpresa}
          nombreEmpresa={nombreEmpresa}
        />
      ) : showComponent === 2 ? (
        <InformacionEmpresa
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          idEmpresa={idEmpresa}
          setIdEmpresa={setIdEmpresa}
        />
      ) : showComponent === 3 ? (
        <EstadoDeCuenta
          idUsuario={idUsuario}
          correo={correo}
          password={password}
          setLoading={setLoading}
          idEmpresa={idEmpresa}
          setShowComponent={setShowComponent}
          busquedaFiltro={busquedaFiltro}
          page={page}
          nombreEmpresa={nombreEmpresa}
          baseDatosEmpresa={baseDatosEmpresa}
          busquedaFiltroUsuarios={busquedaFiltroUsuarios}
          busquedaFiltroMovimientos={busquedaFiltroMovimientos}
          setBusquedaFiltroMovimientos={setBusquedaFiltroMovimientos}
          pageMovimientos={pageMovimientos}
          setPageMovimientos={setPageMovimientos}
        />
      ) : showComponent === 4 ? (
        <ServiciosEmpresa
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          idEmpresa={idEmpresa}
          rows={rowsServicios}
          setRows={setRowsServicios}
          page={page}
          pageServicios={pageServicios}
          setPageServicios={setPageServicios}
          busquedaFiltro={busquedaFiltro}
          busquedaFiltroServicios={busquedaFiltroServicios}
          setBusquedaFiltroServicios={setBusquedaFiltroServicios}
          baseDatosEmpresa={baseDatosEmpresa}
          nombreEmpresa={nombreEmpresa}
        />
      ) : null}
    </div>
  );
}

function ListaEmpresas(props) {
  const classes = useStyles();
  /* const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading; */
  const setShowComponent = props.setShowComponent;
  //const executeGetUsuarios = props.executeGetUsuarios;
  const rows = props.rows;
  const setRows = props.setRows;
  const idEmpresa = props.idEmpresa;
  const setIdEmpresa = props.setIdEmpresa;
  const page = props.page;
  const setPage = props.setPage;
  const busquedaFiltro = props.busquedaFiltro;
  const setBusquedaFiltro = props.setBusquedaFiltro;
  const baseDatosEmpresa = props.baseDatosEmpresa;
  const setBaseDatosEmpresa = props.setBaseDatosEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const setNombreEmpresa = props.setNombreEmpresa;

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [anchorMenuEl, setAnchorMenuEl] = useState(null);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          filterRows[x].id.toString().indexOf(busquedaFiltro.toLowerCase()) !==
            -1 ||
          filterRows[x].nombreEmpresa
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].rutaEmpresa
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].rfc
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].fechaRegistro
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRows[x].fechaRegistro)
            .format("DD/MM/YYYY")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRows[x]);
        }
      }
      return dataFilter;
    }

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
          modulo: "empresas",
          showComponent: 0,
          idEmpresa: 0,
          baseDatosEmpresa: "",
          nombreEmpresa: "",
          busquedaFiltro: busquedaFiltro,
          page:
            rows.length < rowsPerPage && rows.length !== 0
              ? 0
              : decodedToken.menuTemporal.page
              ? decodedToken.menuTemporal.page
              : 0,
          busquedaFiltroUsuarios: "",
          pageUsuarios: 0,
          busquedaFiltroServicios: "",
          pageServicios: 0,
          busquedaFiltroMovimientos: "",
          pageMovimientos: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  }, [busquedaFiltro, setRows, rows.length, rowsPerPage, setPage]);

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
          modulo: "empresas",
          showComponent: 0,
          idEmpresa: idEmpresa,
          baseDatosEmpresa: "",
          nombreEmpresa: "",
          busquedaFiltro: busquedaFiltro,
          page: newPage,
          busquedaFiltroUsuarios: "",
          pageUsuarios: 0,
          busquedaFiltroServicios: "",
          pageServicios: 0,
          busquedaFiltroMovimientos: "",
          pageMovimientos: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "empresas",
          showComponent: 0,
          idEmpresa: idEmpresa,
          baseDatosEmpresa: "",
          nombreEmpresa: "",
          busquedaFiltro: busquedaFiltro,
          page: page,
          busquedaFiltroUsuarios: "",
          pageUsuarios: 0,
          busquedaFiltroServicios: "",
          pageServicios: 0,
          busquedaFiltroMovimientos: "",
          pageMovimientos: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={8} sm={6} md={6}>
              <Typography
                className={classes.titleTable}
                variant="h6"
                style={{ alignSelf: "center" }}
                id="tableTitle"
              >
                Lista De Empresas
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sm={6}
              md={2}
              style={{ alignSelf: "flex-end", textAlign: "center" }}
            >
              <Tooltip title="Limpiar Filtro">
                <IconButton
                  aria-label="filtro"
                  style={{ float: "right" }}
                  onClick={() => {
                    setBusquedaFiltro("");
                  }}
                >
                  <ClearAllIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Nuevo">
                <IconButton
                  aria-label="nuevo"
                  style={{ float: "right" }}
                  onClick={() => {
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          modulo: "empresas",
                          showComponent: 1,
                          idEmpresa: 0,
                          baseDatosEmpresa: "",
                          busquedaFiltro: busquedaFiltro,
                          page: 0,
                          busquedaFiltroUsuarios: "",
                          pageUsuarios: 0,
                          busquedaFiltroServicios: "",
                pageServicios: 0,
                          busquedaFiltroMovimientos: "",
                          pageMovimientos: 0,
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token);
                    setShowComponent(1);
                  }}
                >
                  <AddCircleIcon style={{ color: "#4caf50" }} />
                </IconButton>
              </Tooltip> */}
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                id="busquedaEmpresa"
                autoComplete="nope"
                className={classes.textFields}
                label="Escriba algo para filtrar"
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
        </Toolbar>
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
              headCells={headCells}
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
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.nombreEmpresa}</TableCell>
                        <TableCell align="right">{row.rutaEmpresa}</TableCell>
                        <TableCell align="right">{row.rfc}</TableCell>
                        <TableCell align="right">{row.fechaRegistro}</TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => {
                            handleOpenMenu(e);
                            setIdEmpresa(row.id);
                            setBaseDatosEmpresa(row.rutaEmpresa);
                            setNombreEmpresa(row.nombreEmpresa);
                          }}
                        >
                          {row.acciones}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="subtitle1">
                      <ErrorIcon
                        style={{ color: "red", verticalAlign: "sub" }}
                      />
                      No hay usuarios disponibles
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
          page={rows.length > 0 && rows.length >= rowsPerPage ? page : 0}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
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
            const token = jwt.sign(
              {
                menuTemporal: {
                  modulo: "empresas",
                  showComponent: 2,
                  idEmpresa: idEmpresa,
                  baseDatosEmpresa: baseDatosEmpresa,
                  nombreEmpresa: "",
                  busquedaFiltro: busquedaFiltro,
                  page: page,
                  busquedaFiltroUsuarios: "",
                  pageUsuarios: 0,
                  busquedaFiltroServicios: "",
                  pageServicios: 0,
                  busquedaFiltroMovimientos: "",
                  pageMovimientos: 0,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(2);
          }}
        >
          <ListItemText primary="Datos Generales" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            const token = jwt.sign(
              {
                menuTemporal: {
                  modulo: "empresas",
                  showComponent: 1,
                  idEmpresa: idEmpresa,
                  baseDatosEmpresa: baseDatosEmpresa,
                  nombreEmpresa: nombreEmpresa,
                  busquedaFiltro: busquedaFiltro,
                  page: page,
                  busquedaFiltroUsuarios: "",
                  pageUsuarios: 0,
                  busquedaFiltroServicios: "",
                  pageServicios: 0,
                  busquedaFiltroMovimientos: "",
                  pageMovimientos: 0,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(1);
          }}
        >
          <ListItemText primary="Usuarios" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            const token = jwt.sign(
              {
                menuTemporal: {
                  modulo: "empresas",
                  showComponent: 3,
                  idEmpresa: idEmpresa,
                  baseDatosEmpresa: baseDatosEmpresa,
                  nombreEmpresa: nombreEmpresa,
                  busquedaFiltro: busquedaFiltro,
                  page: page,
                  busquedaFiltroUsuarios: "",
                  pageUsuarios: 0,
                  busquedaFiltroServicios: "",
                  pageServicios: 0,
                  busquedaFiltroMovimientos: "",
                  pageMovimientos: 0,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(3);
          }}
        >
          <ListItemText primary="Estado De Cuenta" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            const token = jwt.sign(
              {
                menuTemporal: {
                  modulo: "empresas",
                  showComponent: 4,
                  idEmpresa: idEmpresa,
                  baseDatosEmpresa: baseDatosEmpresa,
                  nombreEmpresa: nombreEmpresa,
                  busquedaFiltro: busquedaFiltro,
                  page: page,
                  busquedaFiltroUsuarios: "",
                  pageUsuarios: 0,
                  busquedaFiltroServicios: "",
                  pageServicios: 0,
                  busquedaFiltroMovimientos: "",
                  pageMovimientos: 0,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(4);
          }}
        >
          <ListItemText primary="Servicios" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function ListaUsuariosPorEmpresa(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const idEmpresa = props.idEmpresa;
  const rows = props.rows;
  const setRows = props.setRows;
  const page = props.page;
  const pageUsuarios = props.pageUsuarios;
  const setPageUsuarios = props.setPageUsuarios;
  const busquedaFiltro = props.busquedaFiltro;
  const busquedaFiltroUsuarios = props.busquedaFiltroUsuarios;
  const setBusquedaFiltroUsuarios = props.setBusquedaFiltroUsuarios;
  const baseDatosEmpresa = props.baseDatosEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [
    {
      data: getUsuariosPorEmpresaData,
      loading: getUsuariosPorEmpresaLoading,
      error: getUsuariosPorEmpresaError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getUsuariosPorEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
        db: baseDatosEmpresa,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (getUsuariosPorEmpresaData) {
      if (getUsuariosPorEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getUsuariosPorEmpresaData.error),
          "warning"
        );
      } else {
        filterRowsUsuarios = [];
        getUsuariosPorEmpresaData.usuarios.map((usuario) => {
          return filterRowsUsuarios.push(
            createDataUsuarios(
              usuario.idusuario,
              `${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`,
              usuario.cel,
              usuario.correo,
              usuario.perfil,
              usuario.status,
              {
                /* <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton> */
              }
            )
          );
        });
        setRows(filterRowsUsuarios);
      }
    }
  }, [getUsuariosPorEmpresaData, setRows]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsUsuarios.length; x++) {
        if (
          filterRowsUsuarios[x].id
            .toString()
            .indexOf(busquedaFiltroUsuarios.toLowerCase()) !== -1 ||
          filterRowsUsuarios[x].usuario
            .toLowerCase()
            .indexOf(busquedaFiltroUsuarios.toLowerCase()) !== -1 ||
          filterRowsUsuarios[x].celular
            .toLowerCase()
            .indexOf(busquedaFiltroUsuarios.toLowerCase()) !== -1 ||
          filterRowsUsuarios[x].correo
            .toLowerCase()
            .indexOf(busquedaFiltroUsuarios.toLowerCase()) !== -1 ||
          filterRowsUsuarios[x].perfil
            .toLowerCase()
            .indexOf(busquedaFiltroUsuarios.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsUsuarios[x]);
        }
      }
      return dataFilter;
    }

    const decodedToken = jwt.verify(
      localStorage.getItem("menuTemporal"),
      "mysecretpassword"
    );
    setRows(
      busquedaFiltroUsuarios.trim() !== ""
        ? getFilterRows()
        : filterRowsUsuarios
    );
    setPageUsuarios(
      rows.length < rowsPerPage
        ? 0
        : decodedToken.menuTemporal.pageUsuarios
        ? decodedToken.menuTemporal.pageUsuarios
        : 0
    );

    const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "empresas",
          showComponent: 1,
          idEmpresa: idEmpresa,
          baseDatosEmpresa: baseDatosEmpresa,
          nombreEmpresa: nombreEmpresa,
          busquedaFiltro: busquedaFiltro,
          page: page,
          busquedaFiltroUsuarios: busquedaFiltroUsuarios,
          pageUsuarios:
            rows.length < rowsPerPage && rows.length !== 0
              ? 0
              : decodedToken.menuTemporal.pageUsuarios
              ? decodedToken.menuTemporal.pageUsuarios
              : 0,
          busquedaFiltroServicios: "",
          pageServicios: 0,
          busquedaFiltroMovimientos: "",
          pageMovimientos: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  }, [
    busquedaFiltro,
    busquedaFiltroUsuarios,
    setRows,
    rows.length,
    rowsPerPage,
    setPageUsuarios,
    idEmpresa,
    baseDatosEmpresa,
    nombreEmpresa,
    page,
  ]);

  if (getUsuariosPorEmpresaLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getUsuariosPorEmpresaError) {
    return <ErrorQueryDB />;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPageUsuarios(newPage);
    /* const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: newPage,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token); */
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageUsuarios(0);
    /* const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token); */
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={8} sm={6} md={6}>
              <Typography
                className={classes.titleTable}
                variant="h6"
                style={{ alignSelf: "center" }}
                id="tableTitle"
              >
                <Tooltip title="Regresar">
                  <IconButton
                    aria-label="regresar"
                    onClick={() => {
                      setShowComponent(0);
                      //setIdUsuario(0);
                      setBusquedaFiltroUsuarios("");
                      setPageUsuarios(0);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            modulo: "empresas",
                            showComponent: 0,
                            idEmpresa: 0,
                            baseDatosEmpresa: "",
                            nombreEmpresa: "",
                            busquedaFiltro: busquedaFiltro,
                            page: page,
                            busquedaFiltroUsuarios: "",
                            pageUsuarios: 0,
                            busquedaFiltroServicios: "",
                            pageServicios: 0,
                            busquedaFiltroMovimientos: "",
                            pageMovimientos: 0,
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
                Lista De Usuarios De {nombreEmpresa}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sm={6}
              md={2}
              style={{ alignSelf: "flex-end", textAlign: "center" }}
            >
              <Tooltip title="Limpiar Filtro">
                <IconButton
                  aria-label="filtro"
                  style={{ float: "right" }}
                  onClick={() => {
                    setBusquedaFiltroUsuarios("");
                  }}
                >
                  <ClearAllIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                className={classes.textFields}
                label="Escriba algo para filtrar"
                type="text"
                margin="normal"
                value={busquedaFiltroUsuarios}
                inputProps={{
                  maxLength: 20,
                }}
                onChange={(e) => {
                  setBusquedaFiltroUsuarios(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Toolbar>
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
              headCells={headCellsUsuarios}
            />
            <TableBody>
              {rows.length > 0 ? (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(
                    pageUsuarios * rowsPerPage,
                    pageUsuarios * rowsPerPage + rowsPerPage
                  )
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell padding="checkbox" />
                        <TableCell component="th" id={labelId} scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.usuario}</TableCell>
                        <TableCell align="right">{row.celular}</TableCell>
                        <TableCell align="right">{row.correo}</TableCell>
                        <TableCell align="right">{row.perfil}</TableCell>
                        {/* <TableCell
                          align="right"
                        >
                          {row.acciones}
                        </TableCell> */}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="subtitle1">
                      <ErrorIcon
                        style={{ color: "red", verticalAlign: "sub" }}
                      />
                      No hay usuarios disponibles
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
          page={
            rows.length > 0 && rows.length >= rowsPerPage ? pageUsuarios : 0
          }
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

function InformacionEmpresa(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const idEmpresa = props.idEmpresa;
  const setIdEmpresa = props.setIdEmpresa;
  const [datosEmpresa, setDatosEmpresa] = useState({
    RFC: "",
    calle: "",
    ciudad: "",
    codigopostal: 0,
    colonia: "",
    correoEmpresa: "",
    direccion: "",
    empresaBD: "",
    estado: "",
    fecharegistro: "",
    municipio: "",
    nombreempresa: "",
    num_ext: 0,
    num_int: 0,
    password: "",
    password_storage: "",
    rutaempresa: "",
    status: 0,
    telefono: "",
    usuario_storage: "",
    vigencia: "",
  });

  const [
    {
      data: getEmpresaData,
      loading: getEmpresaLoading,
      error: getEmpresaError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: guardarInformacionEmpresaData,
      loading: guardarInformacionEmpresaLoading,
      error: guardarInformacionEmpresaError,
    },
    executeGuardarInformacionEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarInformacionEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (getEmpresaData) {
      if (getEmpresaData.error !== 0) {
        swal("Error", dataBaseErrores(getEmpresaData.error), "warning");
      } else {
        setDatosEmpresa({
          RFC: getEmpresaData.empresa[0].RFC,
          calle: getEmpresaData.empresa[0].calle,
          ciudad: getEmpresaData.empresa[0].ciudad,
          codigopostal: getEmpresaData.empresa[0].codigopostal,
          colonia: getEmpresaData.empresa[0].colonia,
          correoEmpresa: getEmpresaData.empresa[0].correo,
          direccion: getEmpresaData.empresa[0].direccion,
          empresaBD: getEmpresaData.empresa[0].empresaBD,
          estado: getEmpresaData.empresa[0].estado,
          fecharegistro: getEmpresaData.empresa[0].fecharegistro,
          municipio: getEmpresaData.empresa[0].municipio,
          nombreempresa: getEmpresaData.empresa[0].nombreempresa,
          num_ext: getEmpresaData.empresa[0].num_ext,
          num_int: getEmpresaData.empresa[0].num_int,
          password: getEmpresaData.empresa[0].password,
          password_storage: getEmpresaData.empresa[0].password_storage,
          rutaempresa: getEmpresaData.empresa[0].rutaempresa,
          status: getEmpresaData.empresa[0].status,
          telefono: getEmpresaData.empresa[0].telefono,
          usuario_storage: getEmpresaData.empresa[0].usuario_storage,
          vigencia: getEmpresaData.empresa[0].vigencia,
        });
      }
    }
  }, [getEmpresaData]);

  useEffect(() => {
    if (guardarInformacionEmpresaData) {
      if (guardarInformacionEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarInformacionEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Información Guardada",
          "Información guardada con éxito",
          "success"
        );
      }
    }
  }, [guardarInformacionEmpresaData]);

  if (getEmpresaLoading || guardarInformacionEmpresaLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getEmpresaError || guardarInformacionEmpresaError) {
    return <ErrorQueryDB />;
  }

  const guardarInformacionEmpresa = () => {
    const {
      calle,
      ciudad,
      codigopostal,
      colonia,
      correoEmpresa,
      direccion,
      estado,
      municipio,
      num_ext,
      num_int,
    } = datosEmpresa;
    if (correoEmpresa.trim() === "") {
      swal("Error", "Ingrese un correo", "warning");
    } else if (!validarCorreo(correoEmpresa.trim())) {
      swal("Error", "Ingrese un correo valido", "warning");
    } else {
      executeGuardarInformacionEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          idempresa: idEmpresa,
          calle: calle !== null ? calle.trim() : calle,
          ciudad: ciudad !== null ? ciudad.trim() : ciudad,
          codigopostal: codigopostal,
          colonia: colonia !== null ? colonia.trim() : colonia,
          correo: correoEmpresa.trim(),
          direccion: direccion !== null ? direccion.trim() : direccion,
          estado: estado !== null ? estado.trim() : estado,
          municipio: municipio !== null ? municipio.trim() : municipio,
          num_ext: num_ext,
          num_int: num_int,
        },
      });
    }
  };

  return (
    <Card>
      <Toolbar>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12}>
            <Typography
              className={classes.titleTable}
              variant="h6"
              style={{ alignSelf: "center" }}
              id="tableTitle"
            >
              <Tooltip title="Regresar">
                <IconButton
                  aria-label="regresar"
                  onClick={() => {
                    setShowComponent(0);
                    setIdEmpresa(0);
                    /* const token = jwt.sign(
                      {
                        menuTemporal: {
                          modulo: "usuarios",
                          showComponent: 0,
                          idUsuario: 0,
                          busquedaFiltro: busquedaFiltro,
                          page: page,
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token); */
                  }}
                >
                  <ArrowBackIcon color="primary" />
                </IconButton>
              </Tooltip>
              Información de {datosEmpresa.nombreempresa}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="rfc"
              disabled
              className={classes.textFields}
              label="RFC"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.RFC !== null ? datosEmpresa.RFC : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  RFC: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="calle"
              /* disabled */
              className={classes.textFields}
              label="Calle"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.calle !== null ? datosEmpresa.calle : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  calle: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="ciudad"
              /* disabled */
              className={classes.textFields}
              label="Ciudad"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.ciudad !== null ? datosEmpresa.ciudad : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  ciudad: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="codigopostal"
              /* disabled */
              className={classes.textFields}
              label="Código Postal"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.codigopostal !== null
                  ? datosEmpresa.codigopostal
                  : ""
              }
              inputProps={{
                maxLength: 5,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={(e) => {
                pasteValidation(e, 2);
                setDatosEmpresa({
                  ...datosEmpresa,
                  codigopostal: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="colonia"
              /* disabled */
              className={classes.textFields}
              label="Colonia"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.colonia !== null ? datosEmpresa.colonia : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 3);
              }}
              onChange={(e) => {
                pasteValidation(e, 3);
                setDatosEmpresa({
                  ...datosEmpresa,
                  colonia: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="correo"
              /* disabled */
              required
              className={classes.textFields}
              label="Correo"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.correoEmpresa !== null ? datosEmpresa.correoEmpresa : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 4);
              }}
              onChange={(e) => {
                pasteValidation(e, 4);
                setDatosEmpresa({
                  ...datosEmpresa,
                  correoEmpresa: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="direccion"
              /* disabled */
              className={classes.textFields}
              label="Dirección"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.direccion !== null ? datosEmpresa.direccion : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  direccion: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="empresaBD"
              disabled
              className={classes.textFields}
              label="Base De Datos"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.empresaBD !== null ? datosEmpresa.empresaBD : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  empresaBD: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="estado"
              /* disabled */
              className={classes.textFields}
              label="Estado"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.estado !== null ? datosEmpresa.estado : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  estado: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="fecharegistro"
              disabled
              className={classes.textFields}
              label="Fecha De Registro"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.fecharegistro !== null
                  ? datosEmpresa.fecharegistro
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  fecharegistro: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="municipio"
              /* disabled */
              className={classes.textFields}
              label="Municipio"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.municipio !== null ? datosEmpresa.municipio : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  municipio: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="nombreempresa"
              disabled
              className={classes.textFields}
              label="Nombre De Empresa"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.nombreempresa !== null
                  ? datosEmpresa.nombreempresa
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  nombreempresa: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="num_ext"
              /* disabled */
              className={classes.textFields}
              label="Número Exterior"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.num_ext !== null ? datosEmpresa.num_ext : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={(e) => {
                pasteValidation(e, 2);
                setDatosEmpresa({
                  ...datosEmpresa,
                  num_ext: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="num_int"
              /* disabled */
              className={classes.textFields}
              label="Número Interior"
              variant="outlined"
              margin="normal"
              value={datosEmpresa.num_int !== null ? datosEmpresa.num_int : ""}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={(e) => {
                pasteValidation(e, 2);
                setDatosEmpresa({
                  ...datosEmpresa,
                  num_int: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="password"
              disabled
              className={classes.textFields}
              label="Contraseña"
              variant="outlined"
              margin="normal"
              type="password"
              value={
                datosEmpresa.password !== null ? datosEmpresa.password : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  password: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="password_storage"
              disabled
              className={classes.textFields}
              label="Password Storage"
              variant="outlined"
              margin="normal"
              type="text"
              value={
                datosEmpresa.password_storage !== null
                  ? datosEmpresa.password_storage
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  password_storage: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="rutaempresa"
              disabled
              className={classes.textFields}
              label="Base De Datos"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.rutaempresa !== null
                  ? datosEmpresa.rutaempresa
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  rutaempresa: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="status"
              disabled
              className={classes.textFields}
              label="Estatus"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.status !== null
                  ? datosEmpresa.status === 1
                    ? "Activa"
                    : "Inactiva"
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  status: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="telefono"
              disabled
              className={classes.textFields}
              label="Teléfono"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.telefono !== null ? datosEmpresa.telefono : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  telefono: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="usuario_storage"
              disabled
              className={classes.textFields}
              label="Usuario Storage"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.usuario_storage !== null
                  ? datosEmpresa.usuario_storage
                  : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  usuario_storage: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="vigencia"
              disabled
              className={classes.textFields}
              label="Vigencia"
              variant="outlined"
              margin="normal"
              value={
                datosEmpresa.vigencia !== null ? datosEmpresa.vigencia : ""
              }
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosEmpresa({
                  ...datosEmpresa,
                  vigencia: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "15px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: "right" }}
              onClick={guardarInformacionEmpresa}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </Card>
  );
}

function EstadoDeCuenta(props) {
  const classes = useStyles();
  const idUsuario = props.idUsuario;
  const correo = props.correo;
  const password = props.password;
  const idEmpresa = props.idEmpresa;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const busquedaFiltro = props.busquedaFiltro;
  const pageEmpresas = props.page;
  const nombreEmpresa = props.nombreEmpresa;
  const baseDatosEmpresa = props.baseDatosEmpresa;
  const busquedaFiltroUsuarios = props.busquedaFiltroUsuarios;
  const busquedaFiltroMovimientos = props.busquedaFiltroMovimientos;
  const setBusquedaFiltroMovimientos = props.setBusquedaFiltroMovimientos;
  const pageMovimientos = props.pageMovimientos;
  const setPageMovimientos = props.setPageMovimientos;
  const [idMovimiento, setIdMovimiento] = useState(0);
  const [notificacion, setNotificacion] = useState("");
  const [expanded, setExpanded] = useState(0);
  const [datosEmpresa, setDatosEmpresa] = useState({
    fechaLimite: "",
    fechaPeriodoPrueba: "",
    statusEmpresa: 0,
    rfc: "",
    usuarioStorage: "",
    passwordStorage: "",
  });
  const [fechaLimitePago, setFechaLimitePago] = useState("");
  const [fechaPeriodoPrueba, setFechaPeriodoPrueba] = useState("");
  const [rowsNotificaciones, setRowsNotificaciones] = useState([]);
  const [pageNotificaciones, setPageNotificaciones] = useState(0);
  const [orderNotificaciones, setOrderNotificaciones] = useState("desc");
  const [orderByNotificaciones, setOrderByNotificaciones] = useState("id");
  const [rowsPerPageNotificaciones, setRowsPerPageNotificaciones] =
    useState(10);
  const [busquedaFiltroNotificaciones, setBusquedaFiltroNotificaciones] =
    useState("");

  const [
    {
      data: getEmpresaData,
      loading: getEmpresaLoading,
      error: getEmpresaError,
    },
    executeGetEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getNotificacionesEmpresaData,
      loading: getNotificacionesEmpresaLoading,
      error: getNotificacionesEmpresaError,
    },
    executeGetNotificacionesEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getNotificacionesEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: guardarNotificacionEmpresaData,
      loading: guardarNotificacionEmpresaLoading,
      error: guardarNotificacionEmpresaError,
    },
    executeGuardarNotificacionEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarNotificacionEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: guardarFechaLimitePagoEmpresaData,
      loading: guardarFechaLimitePagoEmpresaLoading,
      error: guardarFechaLimitePagoEmpresaError,
    },
    executeGuardarFechaLimitePagoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarFechaLimitePagoEmpresa`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: guardarFechaPeriodoPruebaEmpresaData,
      loading: guardarFechaPeriodoPruebaEmpresaLoading,
      error: guardarFechaPeriodoPruebaEmpresaError,
    },
    executeGuardarFechaPeriodoPruebaEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarFechaPeriodoPruebaEmpresa`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: cambiarEstatusEmpresaData,
      loading: cambiarEstatusEmpresaLoading,
      error: cambiarEstatusEmpresaError,
    },
    executeCambiarEstatusEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarEstatusEmpresa`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (getEmpresaData) {
      if (getEmpresaData.error !== 0) {
        swal("Error", dataBaseErrores(getEmpresaData.error), "warning");
      } else {
        setDatosEmpresa({
          fechaLimite: getEmpresaData.empresa[0].fecharestriccion,
          fechaPeriodoPrueba: getEmpresaData.empresa[0].fechaprueba,
          statusEmpresa: getEmpresaData.empresa[0].statusempresa,
          rfc: getEmpresaData.empresa[0].RFC,
          usuarioStorage: getEmpresaData.empresa[0].usuario_storage,
          passwordStorage: getEmpresaData.empresa[0].password_storage,
        });
      }
    }
  }, [getEmpresaData]);

  useEffect(() => {
    if (getNotificacionesEmpresaData) {
      if (getNotificacionesEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getNotificacionesEmpresaData.error),
          "warning"
        );
      } else {
        setRowsNotificaciones(getNotificacionesEmpresaData.notificaciones);
        filterRowsNotificaciones = [];
        getNotificacionesEmpresaData.notificaciones.map((notificacion) => {
          return filterRowsNotificaciones.push(
            createDataNotificaciones(
              notificacion.idnotificacion,
              notificacion.mensaje,
              notificacion.usuario,
              notificacion.fechamensaje,
              notificacion.status,
              notificacion.status === 0 ? "No Visto" : "Visto"
            )
          );
        });
        setRowsNotificaciones(filterRowsNotificaciones);
      }
    }
  }, [getNotificacionesEmpresaData]);

  useEffect(() => {
    if (guardarNotificacionEmpresaData) {
      if (guardarNotificacionEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarNotificacionEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Notificacion Enviada",
          "Notificacion Enviada Con Éxito",
          "success"
        );
        executeGetNotificacionesEmpresa();
      }
    }
  }, [guardarNotificacionEmpresaData, executeGetNotificacionesEmpresa]);

  useEffect(() => {
    if (guardarFechaLimitePagoEmpresaData) {
      if (guardarFechaLimitePagoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarFechaLimitePagoEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Fecha Límite De Pago Actualizada",
          "Se actualizo la fecha límite de pago con éxito",
          "success"
        );
        executeGetEmpresa();
        setFechaLimitePago("");
      }
    }
  }, [guardarFechaLimitePagoEmpresaData, executeGetEmpresa]);

  useEffect(() => {
    if (guardarFechaPeriodoPruebaEmpresaData) {
      if (guardarFechaPeriodoPruebaEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarFechaPeriodoPruebaEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Fecha De Prueba Actualizada",
          "Se actualizo la fecha de prueba con éxito",
          "success"
        );
        executeGetEmpresa();
        setFechaPeriodoPrueba("");
      }
    }
  }, [guardarFechaPeriodoPruebaEmpresaData, executeGetEmpresa]);

  useEffect(() => {
    if (cambiarEstatusEmpresaData) {
      if (cambiarEstatusEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(cambiarEstatusEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          cambiarEstatusEmpresaData.status === 1
            ? "Empresa Restringida"
            : "Empresa Habilitada",
          cambiarEstatusEmpresaData.status === 1
            ? "Empresa Restringida Con Éxito"
            : "Empresa Habilitada Con Éxito",
          "success"
        );
        executeGetEmpresa();
        setFechaPeriodoPrueba("");
      }
    }
  }, [cambiarEstatusEmpresaData, executeGetEmpresa]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsNotificaciones.length; x++) {
        if (
          filterRowsNotificaciones[x].id
            .toString()
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1 ||
          filterRowsNotificaciones[x].mensaje
            .toLowerCase()
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1 ||
          filterRowsNotificaciones[x].usuario
            .toLowerCase()
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1 ||
          filterRowsNotificaciones[x].fechaMensaje
            .toLowerCase()
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1 ||
          moment(filterRowsNotificaciones[x].fechaMensaje)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1 ||
          filterRowsNotificaciones[x].estatusEscrito
            .toLowerCase()
            .indexOf(busquedaFiltroNotificaciones.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsNotificaciones[x]);
        }
      }
      return dataFilter;
    }

    setRowsNotificaciones(
      busquedaFiltroNotificaciones.trim() !== ""
        ? getFilterRows()
        : filterRowsNotificaciones
    );
  }, [busquedaFiltroNotificaciones]);

  if (
    getEmpresaLoading ||
    getNotificacionesEmpresaLoading ||
    guardarNotificacionEmpresaLoading ||
    guardarFechaLimitePagoEmpresaLoading ||
    guardarFechaPeriodoPruebaEmpresaLoading ||
    cambiarEstatusEmpresaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getEmpresaError ||
    getNotificacionesEmpresaError ||
    guardarNotificacionEmpresaError ||
    guardarFechaLimitePagoEmpresaError ||
    guardarFechaPeriodoPruebaEmpresaError ||
    cambiarEstatusEmpresaError
  ) {
    return <ErrorQueryDB />;
  }

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleRequestSortNotificaciones = (event, property) => {
    const isAsc =
      orderByNotificaciones === property && orderNotificaciones === "asc";
    setOrderNotificaciones(isAsc ? "desc" : "asc");
    setOrderByNotificaciones(property);
  };

  const handleChangePageNotificaciones = (event, newPage) => {
    setPageNotificaciones(newPage);
  };

  const handleChangeRowsPerPageNotificaciones = (event) => {
    setRowsPerPageNotificaciones(parseInt(event.target.value, 10));
    setPageNotificaciones(0);
  };

  const guardarLimitePago = () => {
    if (fechaLimitePago === "" || fechaLimitePago === null) {
      swal(
        "Error",
        "Agregue una fecha límite de pago o una fecha valida.",
        "warning"
      );
    } else {
      executeGuardarFechaLimitePagoEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          idempresa: idEmpresa,
          fecharestriccion: fechaLimitePago,
        },
      });
    }
  };

  const guardarPeriodoPrueba = () => {
    if (fechaPeriodoPrueba === "" || fechaPeriodoPrueba === null) {
      swal(
        "Error",
        "Agregue una fecha de período de prueba o una fecha valida",
        "warning"
      );
    } else {
      executeGuardarFechaPeriodoPruebaEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          idempresa: idEmpresa,
          fechaprueba: fechaPeriodoPrueba,
        },
      });
    }
  };

  const enviarNotificacion = () => {
    if (notificacion.trim() === "") {
      swal("Error", "Agregue un mensaje", "warning");
    } else {
      executeGuardarNotificacionEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          mensaje: notificacion.trim(),
          idempresa: idEmpresa,
          idusuario: idUsuario,
          fechamensaje: moment().format("YYYY-MM-DD h:mm:ss a"),
        },
      });
    }
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item xs={8} sm={6} md={6}>
          <Typography
            className={classes.titleTable}
            variant="h6"
            style={{ alignSelf: "center" }}
            id="tableTitle"
          >
            <Tooltip title="Regresar">
              <IconButton
                aria-label="regresar"
                onClick={() => {
                  setShowComponent(0);
                  const token = jwt.sign(
                    {
                      menuTemporal: {
                        modulo: "empresas",
                        showComponent: 0,
                        idEmpresa: 0,
                        baseDatosEmpresa: "",
                        nombreEmpresa: "",
                        busquedaFiltro: busquedaFiltro,
                        page: pageEmpresas,
                        busquedaFiltroUsuarios: "",
                        pageUsuarios: 0,
                        busquedaFiltroServicios: "",
                        pageServicios: 0,
                        busquedaFiltroMovimientos: "",
                        pageMovimientos: 0,
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
            Estado De Cuenta De {nombreEmpresa}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "right", marginRight: "15px" }}
            onClick={() => {
              swal({
                text:
                  datosEmpresa.statusEmpresa === 1
                    ? "¿Está seguro de restringir esta empresa?"
                    : "¿Está seguro de habilitar esta empresa?",
                buttons: ["No", "Sí"],
                dangerMode: true,
              }).then((value) => {
                if (value) {
                  const { statusEmpresa } = datosEmpresa;
                  executeCambiarEstatusEmpresa({
                    data: {
                      usuario: correo,
                      pwd: password,
                      idempresa: idEmpresa,
                      status: statusEmpresa === 1 ? 0 : 1,
                    },
                  });
                }
              });
            }}
          >
            {datosEmpresa.statusEmpresa === 1
              ? "Restringir Empresa"
              : "Habilitar Empresa"}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ExpansionPanel
            square
            expanded={expanded === 1}
            onChange={handleChange(1)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-notificaciones-content`}
              id={`panel-notificaciones-header`}
            >
              <Typography>Notificaciones</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} sm={6} md={5}>
                  <TextField
                    id="mensaje"
                    className={classes.textFields}
                    label="Mensaje"
                    type="text"
                    margin="normal"
                    inputProps={{
                      maxLength: 200,
                    }}
                    value={notificacion}
                    onKeyPress={(e) => {
                      keyValidation(e, 3);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 3);
                      setNotificacion(e.target.value);
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
                    /* style={{ float: "right", marginRight: "10px" }} */
                    onClick={() => {
                      enviarNotificacion();
                    }}
                  >
                    Enviar
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={1}
                  style={{ alignSelf: "flex-end", textAlign: "center" }}
                >
                  <Tooltip title="Limpiar Filtro">
                    <IconButton
                      aria-label="filtro"
                      style={{ float: "right" }}
                      onClick={() => {
                        setBusquedaFiltroNotificaciones("");
                      }}
                    >
                      <ClearAllIcon style={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={8} sm={8} md={4}>
                  <TextField
                    className={classes.textFields}
                    label="Escriba algo para filtrar"
                    type="text"
                    margin="normal"
                    value={busquedaFiltroNotificaciones}
                    inputProps={{
                      maxLength: 20,
                    }}
                    onChange={(e) => {
                      setBusquedaFiltroNotificaciones(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={"medium"}
                      aria-label="enhanced table"
                    >
                      <EnhancedTableHead
                        classes={classes}
                        order={orderNotificaciones}
                        orderBy={orderByNotificaciones}
                        onRequestSort={handleRequestSortNotificaciones}
                        rowCount={rowsNotificaciones.length}
                        headCells={headCellsNotificaciones}
                      />
                      <TableBody>
                        {rowsNotificaciones.length > 0 ? (
                          stableSort(
                            rowsNotificaciones,
                            getComparator(
                              orderNotificaciones,
                              orderByNotificaciones
                            )
                          )
                            .slice(
                              pageNotificaciones * rowsPerPageNotificaciones,
                              pageNotificaciones * rowsPerPageNotificaciones +
                                rowsPerPageNotificaciones
                            )
                            .map((row, index) => {
                              const labelId = `enhanced-table-checkbox-${index}`;

                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                >
                                  <TableCell padding="checkbox" />
                                  <TableCell
                                    component="th"
                                    id={labelId}
                                    scope="row"
                                  >
                                    {row.id}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.mensaje}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.usuario}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.fechaMensaje}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.estatusEscrito}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Typography variant="subtitle1">
                                <ErrorIcon
                                  style={{ color: "red", verticalAlign: "sub" }}
                                />
                                No hay notificaciones disponibles
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
                    count={rowsNotificaciones.length}
                    rowsPerPage={rowsPerPageNotificaciones}
                    page={
                      rowsNotificaciones.length > 0 &&
                      rowsNotificaciones.length >= rowsPerPageNotificaciones
                        ? pageNotificaciones
                        : 0
                    }
                    onChangePage={handleChangePageNotificaciones}
                    onChangeRowsPerPage={handleChangeRowsPerPageNotificaciones}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12}>
          <ExpansionPanel
            square
            expanded={expanded === 2}
            onChange={handleChange(2)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-notificaciones-content`}
              id={`panel-notificaciones-header`}
            >
              <Typography>Fecha Límite De Pago</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Fecha Límite De Pago:{" "}
                    <strong>
                      {datosEmpresa.fechaLimite !== null &&
                      datosEmpresa.fechaLimite !== "" ? (
                        <span>
                          {datosEmpresa.fechaLimite}{" "}
                          <Tooltip title="Quitar Fecha Límite De Pago">
                            <IconButton
                              onClick={() => {
                                swal({
                                  text: "¿Está seguro de quitar la fecha límite de pago?",
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    executeGuardarFechaLimitePagoEmpresa({
                                      data: {
                                        usuario: correo,
                                        pwd: password,
                                        idempresa: idEmpresa,
                                        fecharestriccion: null,
                                      },
                                    });
                                  }
                                });
                              }}
                            >
                              <ClearIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </span>
                      ) : (
                        "Sin fecha límite"
                      )}
                    </strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="fechaLimitePago"
                    className={classes.textFields}
                    label="Fecha Límite De Pago"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={fechaLimitePago}
                    margin="normal"
                    onKeyPress={(e) => {
                      keyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      setFechaLimitePago(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    onClick={() => {
                      guardarLimitePago();
                    }}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12}>
          <ExpansionPanel
            square
            expanded={expanded === 3}
            onChange={handleChange(3)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-notificaciones-content`}
              id={`panel-notificaciones-header`}
            >
              <Typography>Período De Prueba</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Período De Prueba:{" "}
                    <strong>
                      {datosEmpresa.fechaPeriodoPrueba !== null ? (
                        <span>
                          {datosEmpresa.fechaPeriodoPrueba}{" "}
                          <Tooltip title="Quitar Fecha de Período de Prueba">
                            <IconButton
                              onClick={() => {
                                swal({
                                  text: "¿Está seguro de quitar la fecha de período de prueba?",
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    executeGuardarFechaPeriodoPruebaEmpresa({
                                      data: {
                                        usuario: correo,
                                        pwd: password,
                                        idempresa: idEmpresa,
                                        fechaprueba: null,
                                      },
                                    });
                                  }
                                });
                              }}
                            >
                              <ClearIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </span>
                      ) : (
                        "Sin período de prueba"
                      )}
                    </strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="fechaLimitePago"
                    className={classes.textFields}
                    label="Fecha De Terminación De Período De Prueba"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={fechaPeriodoPrueba}
                    margin="normal"
                    onKeyPress={(e) => {
                      keyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      setFechaPeriodoPrueba(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} style={{ alignSelf: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    onClick={() => {
                      guardarPeriodoPrueba();
                    }}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12}>
          <MovimientosEmpresa
            idUsuario={idUsuario}
            correo={correo}
            password={password}
            idEmpresa={idEmpresa}
            setLoading={setLoading}
            rfc={datosEmpresa.rfc}
            usuarioStorage={datosEmpresa.usuarioStorage}
            passwordStorage={datosEmpresa.passwordStorage}
            idMovimiento={idMovimiento}
            setIdMovimiento={setIdMovimiento}
            baseDatosEmpresa={baseDatosEmpresa}
            nombreEmpresa={nombreEmpresa}
            busquedaFiltro={busquedaFiltro}
            page={pageEmpresas}
            busquedaFiltroUsuarios={busquedaFiltroUsuarios}
            busquedaFiltroMovimientos={busquedaFiltroMovimientos}
            setBusquedaFiltroMovimientos={setBusquedaFiltroMovimientos}
            pageMovimientos={pageMovimientos}
            setPageMovimientos={setPageMovimientos}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

function MovimientosEmpresa(props) {
  const classes = useStyles();
  const theme = useTheme();
  const idUsuario = props.idUsuario;
  const correo = props.correo;
  const password = props.password;
  const idEmpresa = props.idEmpresa;
  const setLoading = props.setLoading;
  const rfc = props.rfc;
  const usuarioStorage = props.usuarioStorage;
  const passwordStorage = props.passwordStorage;
  const idMovimiento = props.idMovimiento;
  const setIdMovimiento = props.setIdMovimiento;
  const baseDatosEmpresa = props.baseDatosEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const busquedaFiltroUsuarios = props.busquedaFiltroUsuarios;
  const busquedaFiltroMovimientos = props.busquedaFiltroMovimientos;
  const setBusquedaFiltroMovimientos = props.setBusquedaFiltroMovimientos;
  const pageMovimientos = props.pageMovimientos;
  const setPageMovimientos = props.setPageMovimientos;
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const [fechaMovimiento, setFechaMovimiento] = useState("");
  const [documento, setDocumento] = useState("");
  const [importe, setImporte] = useState("");
  const [importePorAplicar, setImportePorAplicar] = useState(0);
  const [importeAplicado, setImporteAplicado] = useState(0);
  const [pendiente, setPendiente] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("0");
  const [archivosMovimiento, setArchivosMovimiento] = useState(null);
  const [openMenuNuevoMovimiento, setOpenMenuNuevoMovimiento] = useState(false);
  const [openMenuAsociarMovimiento, setOpenMenuAsociarMovimiento] =
    useState(false);
  const [rowsMovimientos, setRowsMovimientos] = useState([]);
  const [
    rowsMovimientosAsociacionOriginales,
    setRowsMovimientosAsociacionOriginales,
  ] = useState([]);
  //const [pageMovimientos, setPageMovimientos] = useState(0);
  const [orderMovimientos, setOrderMovimientos] = useState("desc");
  const [orderByMovimientos, setOrderByMovimientos] = useState("fecha");
  const [rowsPerPageMovimientos, setRowsPerPageMovimientos] = useState(10);
  /* const [busquedaFiltroMovimientos, setBusquedaFiltroMovimientos] = useState(
    ""
  ); */
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [anchorMenuArchivosEl, setAnchorMenuArchivosEl] = useState(null);
  const [accion, setAccion] = useState(1);
  const [infoAbonos, setInfoAbonos] = useState({
    ids: [0],
    abonos: [""],
    pendientes: [""],
  });
  const [infoAbonoSelected, setInfoAbonoSelected] = useState({
    id: 0,
    abono: 0,
    pendiente: 0,
  });
  const [numeroAsociados, setNumeroAsociados] = useState(0);
  const [archivos, setArchivos] = useState([]);
  const [idArchivo, setIdArchivo] = useState(0);
  const [rutaArchivo, setRutaArchivo] = useState("");
  const [abonos, setAbonos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [idAbono, setIdAbono] = useState(0);
  const [anchorMenuAbonosEl, setAnchorMenuAbonosEl] = useState(null);
  const [validacionGetMovimiento, setValidacionGetMovimiento] = useState(false);
  const [importePendienteOriginal, setImportePendienteOriginal] = useState(0);
  const [rowsAsociacion, setRowsAsociacion] = useState(0);

  const [
    {
      data: getMovimientosEmpresaData,
      loading: getMovimientosEmpresaLoading,
      error: getMovimientosEmpresaError,
    },
    executeGetMovimientosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMovimientosEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
        tabla: 1,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getMovimientoEmpresaData,
      loading: getMovimientoEmpresaLoading,
      error: getMovimientoEmpresaError,
    },
    executeGetMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMovimientoEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idmovimiento: idMovimiento,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: editarMovimientoEmpresaData,
      loading: editarMovimientoEmpresaLoading,
      error: editarMovimientoEmpresaError,
    },
    executeEditarMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editarMovimientoEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: guardarMovimientoEmpresaData,
      loading: guardarMovimientoEmpresaLoading,
      error: guardarMovimientoEmpresaError,
    },
    executeGuardarMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarMovimientoEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: eliminarMovimientoEmpresaData,
      loading: eliminarMovimientoEmpresaLoading,
      error: eliminarMovimientoEmpresaError,
    },
    executeEliminarMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarMovimientoEmpresa`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: eliminarArchivoMovimientoEmpresaData,
      loading: eliminarArchivoMovimientoEmpresaLoading,
      error: eliminarArchivoMovimientoEmpresaError,
    },
    executeEliminarArchivoMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarArchivoMovimientoEmpresa`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: eliminarAbonoMovimientoEmpresaData,
      loading: eliminarAbonoMovimientoEmpresaLoading,
      error: eliminarAbonoMovimientoEmpresaError,
    },
    executeEliminarAbonoMovimientoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarAbonoMovimientoEmpresa`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (getMovimientosEmpresaData) {
      if (getMovimientosEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getMovimientosEmpresaData.error),
          "warning"
        );
      } else {
        setRowsMovimientos(getMovimientosEmpresaData.movimientos);
        filterRowsMovimientos = [];
        let saldo = 0;

        getMovimientosEmpresaData.movimientos.map((movimiento) => {
          if (movimiento.tipomovimiento === 1) {
            saldo = saldo + movimiento.importe;
          } else {
            //saldo = saldo - (movimiento.importe - movimiento.pendiente);
            saldo = saldo - movimiento.importe;
          }
          return filterRowsMovimientos.push(
            createDataMovimientos(
              movimiento.idmovimiento,
              movimiento.fecha,
              movimiento.documento,
              movimiento.tipomovimiento === 1 ? `$${movimiento.importe}` : "",
              movimiento.tipomovimiento === 2 ? `$${movimiento.importe}` : "",
              `$${movimiento.pendiente}`,
              `$${saldo}`,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        //setPendiente(saldo);
        setRowsMovimientos(filterRowsMovimientos);
      }
    }
  }, [getMovimientosEmpresaData]);

  useEffect(() => {
    if (getMovimientoEmpresaData) {
      if (getMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        setFechaMovimiento(getMovimientoEmpresaData.movimiento[0].fecha);
        setDocumento(getMovimientoEmpresaData.movimiento[0].documento);
        setImporte(getMovimientoEmpresaData.movimiento[0].importe);
        setPendiente(getMovimientoEmpresaData.movimiento[0].pendiente);
        setImportePendienteOriginal(
          getMovimientoEmpresaData.movimiento[0].pendiente
        );
        setTipoMovimiento(
          getMovimientoEmpresaData.movimiento[0].tipomovimiento
        );
        setArchivos(getMovimientoEmpresaData.archivos);
        setAbonos(getMovimientoEmpresaData.abonos);
        setCargos(getMovimientoEmpresaData.cargos);
      }
    }
  }, [getMovimientoEmpresaData]);

  useEffect(() => {
    if (guardarMovimientoEmpresaData) {
      if (guardarMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        swal("Movimiento Guardado", "Movimiento Guardado Con Éxito", "success");
        executeGetMovimientosEmpresa();
        setOpenMenuNuevoMovimiento(false);
        setFechaMovimiento("");
        setDocumento("");
        setImporte("");
        setPendiente("");
        setTipoMovimiento("");
        setArchivosMovimiento("");
        setInfoAbonos({
          ids: [0],
          abonos: [""],
          pendientes: [""],
        });
        setNumeroAsociados(0);
      }
    }
  }, [guardarMovimientoEmpresaData, executeGetMovimientosEmpresa]);

  useEffect(() => {
    if (editarMovimientoEmpresaData) {
      if (editarMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(editarMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        swal("Movimiento Editado", "Movimiento Editado Con Éxito", "success");
        executeGetMovimientosEmpresa();
        setOpenMenuNuevoMovimiento(false);
        setFechaMovimiento("");
        setDocumento("");
        setImporte("");
        setPendiente("");
        setTipoMovimiento("");
        setArchivosMovimiento("");
        setInfoAbonos({
          ids: [0],
          abonos: [""],
          pendientes: [""],
        });
        setNumeroAsociados(0);
      }
    }
  }, [editarMovimientoEmpresaData, executeGetMovimientosEmpresa]);

  useEffect(() => {
    if (eliminarMovimientoEmpresaData) {
      if (eliminarMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(eliminarMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Movimiento Eliminado",
          "Movimiento Eliminado Con Éxito",
          "success"
        );
        executeGetMovimientosEmpresa();
      }
    }
  }, [eliminarMovimientoEmpresaData, executeGetMovimientosEmpresa]);

  useEffect(() => {
    if (eliminarArchivoMovimientoEmpresaData) {
      if (eliminarArchivoMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(eliminarArchivoMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        swal("Archivo Eliminado", "Archivo Eliminado Con Éxito", "success");
        setValidacionGetMovimiento(true);
        /* executeGetMovimientoEmpresa(); */
      }
    }
  }, [eliminarArchivoMovimientoEmpresaData /* executeGetMovimientoEmpresa */]);

  useEffect(() => {
    if (eliminarAbonoMovimientoEmpresaData) {
      if (eliminarAbonoMovimientoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(eliminarAbonoMovimientoEmpresaData.error),
          "warning"
        );
      } else {
        swal("Abono Eliminado", "Abono Eliminado Con Éxito", "success");
        if (
          eliminarAbonoMovimientoEmpresaData.numeroabonosasociados !== 1 ||
          eliminarAbonoMovimientoEmpresaData.tipomovimiento === 1
        ) {
          setValidacionGetMovimiento(true);
        } else {
          executeGetMovimientosEmpresa();
          setOpenMenuNuevoMovimiento(false);
          /* if(tipoMovimiento === 2) {
            setOpenMenuNuevoMovimiento(false);
          } */
        }
        /* executeGetMovimientoEmpresa(); */
      }
    }
  }, [
    eliminarAbonoMovimientoEmpresaData,
    executeGetMovimientosEmpresa,
    setOpenMenuNuevoMovimiento,
    /* executeGetMovimientoEmpresa */
  ]);

  useEffect(() => {
    if (validacionGetMovimiento) {
      executeGetMovimientoEmpresa();
      executeGetMovimientosEmpresa();
      setValidacionGetMovimiento(false);
    }
  }, [
    validacionGetMovimiento,
    executeGetMovimientoEmpresa,
    executeGetMovimientosEmpresa,
  ]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsMovimientos.length; x++) {
        if (
          filterRowsMovimientos[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          moment(filterRowsMovimientos[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].documento
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].cargo
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].abono
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].saldo
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsMovimientos[x]);
        }
      }
      return dataFilter;
    }

    const decodedToken = jwt.verify(
      localStorage.getItem("menuTemporal"),
      "mysecretpassword"
    );
    setRowsMovimientos(
      busquedaFiltroMovimientos.trim() !== ""
        ? getFilterRows()
        : filterRowsMovimientos
    );
    setPageMovimientos(
      rowsMovimientos.length < rowsPerPageMovimientos
        ? 0
        : decodedToken.menuTemporal.pageMovimientos
        ? decodedToken.menuTemporal.pageMovimientos
        : 0
    );

    const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "empresas",
          showComponent: 3,
          idEmpresa: idEmpresa,
          baseDatosEmpresa: baseDatosEmpresa,
          nombreEmpresa: nombreEmpresa,
          busquedaFiltro: busquedaFiltro,
          page: page,
          busquedaFiltroUsuarios: busquedaFiltroUsuarios,
          pageUsuarios:
            rowsMovimientos.length < rowsPerPageMovimientos &&
            rowsMovimientos.length !== 0
              ? 0
              : decodedToken.menuTemporal.pageMovimientos
              ? decodedToken.menuTemporal.pageMovimientos
              : 0,
          busquedaFiltroServicios: "",
          pageServicios: 0,
          busquedaFiltroMovimientos: busquedaFiltroMovimientos,
          pageMovimientos: pageMovimientos,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);

    /* setRowsMovimientos(
      busquedaFiltroMovimientos.trim() !== ""
        ? getFilterRows()
        : filterRowsMovimientos
    ); */
  }, [
    busquedaFiltroMovimientos,
    baseDatosEmpresa,
    busquedaFiltro,
    busquedaFiltroUsuarios,
    idEmpresa,
    nombreEmpresa,
    page,
    pageMovimientos,
    rowsMovimientos.length,
    rowsPerPageMovimientos,
    setPageMovimientos,
  ]);

  if (
    getMovimientosEmpresaLoading ||
    getMovimientoEmpresaLoading ||
    guardarMovimientoEmpresaLoading ||
    editarMovimientoEmpresaLoading ||
    eliminarMovimientoEmpresaLoading ||
    eliminarArchivoMovimientoEmpresaLoading ||
    eliminarAbonoMovimientoEmpresaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getMovimientosEmpresaError ||
    getMovimientoEmpresaError ||
    guardarMovimientoEmpresaError ||
    editarMovimientoEmpresaError ||
    eliminarMovimientoEmpresaError ||
    eliminarArchivoMovimientoEmpresaError ||
    eliminarAbonoMovimientoEmpresaError
  ) {
    return <ErrorQueryDB />;
  }

  const handleRequestSortMovimientos = (event, property) => {
    const isAsc = orderByMovimientos === property && orderMovimientos === "asc";
    setOrderMovimientos(isAsc ? "desc" : "asc");
    setOrderByMovimientos(property);
  };

  const handleChangePageMovimientos = (event, newPage) => {
    setPageMovimientos(newPage);
  };

  const handleChangeRowsPerPageMovimientos = (event) => {
    setRowsPerPageMovimientos(parseInt(event.target.value, 10));
    setPageMovimientos(0);
  };

  const handleOpenMenuNuevoMovimiento = () => {
    setOpenMenuNuevoMovimiento(true);
  };

  const handleCloseMenuNuevoMovimiento = () => {
    setOpenMenuNuevoMovimiento(false);
    setFechaMovimiento("");
    setDocumento("");
    setImporte("");
    setPendiente("");
    setTipoMovimiento("");
    setArchivosMovimiento("");
    setAccion(1);
    setInfoAbonos({
      ids: [0],
      abonos: [""],
      pendientes: [""],
    });
    setNumeroAsociados(0);
  };

  const handleOpenMenuAsociarMovimiento = () => {
    setOpenMenuAsociarMovimiento(true);
    setImporteAplicado(0);
    //setImportePorAplicar(parseFloat(pendiente));
  };

  const handleCloseMenuAsociarMovimiento = () => {
    setOpenMenuAsociarMovimiento(false);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleOpenMenuArchivos = (event) => {
    setAnchorMenuArchivosEl(event.currentTarget);
  };

  const handleCloseMenuArchivos = () => {
    setAnchorMenuArchivosEl(null);
  };

  const handleOpenMenuAbonos = (event) => {
    setAnchorMenuAbonosEl(event.currentTarget);
  };

  const handleCloseMenuAbonos = () => {
    setAnchorMenuAbonosEl(null);
  };

  const getArchivosMovimiento = () => {
    if (archivos.length > 0) {
      return archivos.map((archivo, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={archivo.documento}
              secondary={archivo.fecha}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Opciones">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    handleOpenMenuArchivos(e);
                    setIdArchivo(archivo.iddocumento);
                    setRutaArchivo(archivo.download);
                  }}
                >
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Archivos" />
        </ListItem>
      );
    }
  };

  const getAbonosMovimiento = () => {
    if (abonos.length > 0) {
      return abonos.map((abono, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={`Importe: $${abono.importe}`}
              secondary={`${abono.documento} (${abono.fecha})`}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Opciones">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    handleOpenMenuAbonos(e);
                    setIdAbono(abono.iddocabono);
                  }}
                >
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Abonos" />
        </ListItem>
      );
    }
  };

  const getCargosMovimiento = () => {
    if (cargos.length > 0) {
      return cargos.map((cargo, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={`Importe: $${cargo.abono}`}
              secondary={`${cargo.documento} (${cargo.fecha})`}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Opciones">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    handleOpenMenuAbonos(e);
                    setIdAbono(cargo.iddocabono);
                  }}
                >
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Cargos" />
        </ListItem>
      );
    }
  };

  const guardarMovimiento = () => {
    if ((fechaMovimiento === "" || fechaMovimiento === null) && accion === 1) {
      swal("Error", "Seleccione una fecha", "warning");
    } else if (documento.trim() === "") {
      swal("Error", "Ingrese un documento", "warning");
    } else if (importe === "" && accion === 1) {
      swal("Error", "Ingrese un importe", "warning");
    } else if (tipoMovimiento === "0" && accion === 1) {
      swal("Error", "Seleccione un tipo de movimiento", "warning");
    } else if (
      tipoMovimiento === "2" &&
      numeroAsociados === 0 &&
      accion === 1
    ) {
      swal(
        "Error",
        "Asocie el abono con algún o algunos movimientos",
        "warning"
      );
    } else {
      for (
        let x = 0;
        archivosMovimiento !== null && x < archivosMovimiento.length;
        x++
      ) {
        if (!verificarArchivoMovimiento(archivosMovimiento[x].name)) {
          swal(
            "Error de archivo",
            `Extensión de archivo no permitida en archivo ${archivosMovimiento[x].name} (Solo se permiten los archivos con extensiones .xml y .pdf)`,
            "warning"
          );
          return;
        }
      }
      const codigoFecha =
        moment(fechaMovimiento).format("DDMMYYYY") + moment().format("Hmmss");
      if (accion === 1) {
        const formData = new FormData();
        formData.append("usuario", correo);
        formData.append("pwd", password);
        formData.append("idempresa", idEmpresa);
        formData.append("idusuario", idUsuario);
        formData.append("fecha", fechaMovimiento);
        formData.append("documento", documento.trim());
        formData.append("importe", importe);
        formData.append("pendiente", pendiente);
        formData.append("tipomovimiento", tipoMovimiento);
        formData.append("rfc", rfc);
        formData.append("codigofecha", codigoFecha);
        formData.append("usuariostorage", usuarioStorage);
        formData.append("passwordstorage", passwordStorage);
        formData.append("idsabonos", infoAbonos.ids);
        formData.append("abonos", infoAbonos.abonos);
        formData.append("pendientes", infoAbonos.pendientes);
        for (
          let x = 0;
          archivosMovimiento !== null && x < archivosMovimiento.length;
          x++
        ) {
          formData.append("documento" + x, archivosMovimiento[x]);
        }
        executeGuardarMovimientoEmpresa({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const formData = new FormData();
        formData.append("usuario", correo);
        formData.append("pwd", password);
        formData.append("idmovimiento", idMovimiento);
        formData.append("documento", documento.trim());
        formData.append("pendiente", pendiente);
        formData.append("tipomovimiento", tipoMovimiento);
        formData.append("rfc", rfc);
        formData.append("codigofecha", codigoFecha);
        formData.append("usuariostorage", usuarioStorage);
        formData.append("passwordstorage", passwordStorage);
        formData.append("fecha", moment().format("YYYY-MM-DD"));
        formData.append("idsabonos", infoAbonos.ids);
        formData.append("abonos", infoAbonos.abonos);
        formData.append("pendientes", infoAbonos.pendientes);
        formData.append("asociados", numeroAsociados);
        for (
          let x = 0;
          archivosMovimiento !== null && x < archivosMovimiento.length;
          x++
        ) {
          formData.append("documento" + x, archivosMovimiento[x]);
        }
        executeEditarMovimientoEmpresa({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          } /* {
            usuario: correo,
            pwd: password,
            idmovimiento: idMovimiento,
            documento: documento.trim(),
            pendiente: pendiente,
            tipomovimiento: tipoMovimiento,
            fecha: moment().format("YYYY-MM-DD"),
            idsabonos: infoAbonos.ids,
            abonos: infoAbonos.abonos,
            pendientes: infoAbonos.pendientes,
            asociados: numeroAsociados,
          }, */,
        });
      }
    }
  };

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} md={7}>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginLeft: "15px",
              marginTop: "15px",
            }}
            onClick={() => {
              handleOpenMenuNuevoMovimiento();
            }}
          >
            Nuevo Movimiento
          </Button>
        </Grid>
        <Grid
          item
          xs={2}
          sm={4}
          md={7}
          style={{ alignSelf: "flex-end", textAlign: "center" }}
        >
          <Tooltip title="Limpiar Filtro">
            <IconButton
              aria-label="filtro"
              style={{ float: "right" }}
              onClick={() => {
                setBusquedaFiltroMovimientos("");
              }}
            >
              <ClearAllIcon style={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={10} sm={8} md={5}>
          <TextField
            className={classes.textFields}
            label="Escriba algo para filtrar"
            type="text"
            margin="normal"
            value={busquedaFiltroMovimientos}
            inputProps={{
              maxLength: 20,
            }}
            onChange={(e) => {
              setBusquedaFiltroMovimientos(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={orderMovimientos}
                orderBy={orderByMovimientos}
                onRequestSort={handleRequestSortMovimientos}
                rowCount={rowsMovimientos.length}
                headCells={headCellsMovimientos}
              />
              <TableBody>
                {rowsMovimientos.length > 0 ? (
                  stableSort(
                    rowsMovimientos,
                    getComparator(orderMovimientos, orderByMovimientos)
                  )
                    .slice(
                      pageMovimientos * rowsPerPageMovimientos,
                      pageMovimientos * rowsPerPageMovimientos +
                        rowsPerPageMovimientos
                    )
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell padding="checkbox" />
                          <TableCell align="right" id={labelId}>
                            {row.fecha}
                          </TableCell>
                          <TableCell align="right">{row.documento}</TableCell>
                          <TableCell align="right">{row.cargo}</TableCell>
                          <TableCell align="right">{row.abono}</TableCell>
                          <TableCell align="right">
                            {row.pendienteDocumento}
                          </TableCell>
                          <TableCell align="right">{row.saldo}</TableCell>
                          <TableCell
                            align="right"
                            onClick={(e) => {
                              handleOpenMenu(e);
                              setIdMovimiento(row.id);
                            }}
                          >
                            {row.acciones}
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
                        No hay movimientos disponibles
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
            count={rowsMovimientos.length}
            rowsPerPage={rowsPerPageMovimientos}
            page={
              rowsMovimientos.length > 0 &&
              rowsMovimientos.length >= rowsPerPageMovimientos
                ? pageMovimientos
                : 0
            }
            onChangePage={handleChangePageMovimientos}
            onChangeRowsPerPage={handleChangeRowsPerPageMovimientos}
          />
        </Grid>
      </Grid>
      <Dialog
        onClose={handleCloseMenuNuevoMovimiento}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuNuevoMovimiento}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">
          {accion === 1 ? "Nuevo Movimiento" : "Editar Movimiento"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="fecha"
                className={classes.textFields}
                label="Fecha"
                type="date"
                value={fechaMovimiento}
                disabled={accion !== 1}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  setFechaMovimiento(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="documento"
                className={classes.textFields}
                label="Documento"
                type="text"
                margin="normal"
                value={documento}
                inputProps={{
                  maxLength: 200,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setDocumento(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="importeTotal"
                className={classes.textFields}
                label="Importe Total"
                type="text"
                margin="normal"
                value={importe}
                disabled={accion !== 1}
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  doubleKeyValidation(e, 2);
                }}
                onChange={(e) => {
                  doublePasteValidation(e, 2);
                  setImporte(e.target.value);
                  setPendiente(e.target.value);
                  setNumeroAsociados(0);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="importePendiente"
                className={classes.textFields}
                disabled
                label="Importe Pendiente"
                type="text"
                margin="normal"
                value={pendiente}
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  doubleKeyValidation(e, 2);
                }}
                onChange={(e) => {
                  doublePasteValidation(e, 2);
                  //setPendiente(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="tipoMovimiento"
                className={classes.textFields}
                label="Tipo De Movimiento"
                select
                SelectProps={{
                  native: true,
                }}
                value={tipoMovimiento}
                disabled={accion !== 1}
                margin="normal"
                onChange={(e) => {
                  setTipoMovimiento(e.target.value);
                }}
              >
                <option value="0">Seleccione un tipo</option>
                <option value="1">Cargo</option>
                <option value="2">Abono</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="documentoSeleccionado"
                className={classes.textFields}
                inputProps={{
                  multiple: true,
                }}
                type="file"
                margin="normal"
                onChange={(e) => {
                  setArchivosMovimiento(e.target.files);
                }}
              />
            </Grid>
            {tipoMovimiento === "2" || accion === 2 ? (
              <Fragment>
                <Grid item xs={12}>
                  <center>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={
                        accion === 2 &&
                        parseFloat(importePendienteOriginal) === 0
                      }
                      style={{ textAlign: "center" }}
                      onClick={() => {
                        /* if(pendiente === 0) {
                          swal(
                            "Error",
                            "No se pueden asociar movimientos sin importe pendiente",
                            "warning"
                          );
                        }
                        else  */ if (
                          importe === "" ||
                          parseInt(importe) === 0
                        ) {
                          swal(
                            "Error",
                            "Primero ingrese un importe o un importe valido (mayor a 0)",
                            "warning"
                          );
                        } else {
                          if (numeroAsociados > 0) {
                            swal({
                              text: `¿Está seguro de asociar el movimiento?, ya hay ${numeroAsociados} ${
                                numeroAsociados > 1
                                  ? "movimientos asociados"
                                  : "movimiento asociado"
                              } y se borrara la asociación si continua.`,
                              buttons: ["No", "Sí"],
                              dangerMode: true,
                            }).then((value) => {
                              if (value) {
                                setNumeroAsociados(0);
                                setPendiente(
                                  accion === 1
                                    ? parseFloat(importe)
                                    : importePendienteOriginal
                                );
                                setImportePorAplicar(
                                  accion === 1
                                    ? parseFloat(importe)
                                    : importePendienteOriginal
                                );
                                handleOpenMenuAsociarMovimiento();
                              }
                            });
                          } else {
                            setImportePorAplicar(parseFloat(pendiente));
                            handleOpenMenuAsociarMovimiento();
                          }
                        }
                      }}
                    >
                      Asociar Movimiento
                    </Button>
                  </center>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ marginBottom: "15px", textAlign: "center" }}
                  >
                    Movimientos asociados: {numeroAsociados}
                  </Typography>
                </Grid>
              </Fragment>
            ) : null}
            {accion === 2 ? (
              <Grid item xs={12} style={{ marginTop: "15px" }}>
                <Grid container justify="center" spacing={5}>
                  <Grid item xs={12} md={6}>
                    <Grid container justify="center" spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          {tipoMovimiento === 1 ? "Abonos" : "Cargos"}
                        </Typography>
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
                        <List
                          style={{
                            height: "200px",
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {tipoMovimiento === 1
                            ? getAbonosMovimiento()
                            : getCargosMovimiento()}
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container justify="center" spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">Archivos</Typography>
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
                        <List
                          style={{
                            height: "200px",
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {getArchivosMovimiento()}
                        </List>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuNuevoMovimiento();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarMovimiento();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseMenuAsociarMovimiento}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuAsociarMovimiento}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">Asociar Movimiento</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={12}>
              <Button
                variant="contained"
                style={{
                  background: "#FF9800",
                  float: "right",
                  marginLeft: "15px",
                  marginBottom: "15px",
                }}
                disabled={rowsAsociacion === 0}
                onClick={() => {
                  //handleCloseMenuAsociarMovimiento();
                  //console.log("saldo: "+parseFloat(importe));
                  //console.log(rowsMovimientosAsociacionOriginales);
                  let sumaAbonos = 0;
                  let sumaPendientes = 0;
                  let nuevosIds = [];
                  let nuevosAbonos = [];
                  let nuevosPendientes = [];
                  for (
                    let x = 0;
                    x < rowsMovimientosAsociacionOriginales.length;
                    x++
                  ) {
                    /* console.log(rowsMovimientosAsociacionOriginales[x].idmovimiento);
                    console.log(rowsMovimientosAsociacionOriginales[x].pendiente); */
                    nuevosIds.push(
                      rowsMovimientosAsociacionOriginales[x].idmovimiento
                    );
                    if (
                      (accion === 1 &&
                        sumaPendientes +
                          rowsMovimientosAsociacionOriginales[x].pendiente <
                          parseFloat(importe)) ||
                      (accion === 2 &&
                        sumaPendientes +
                          rowsMovimientosAsociacionOriginales[x].pendiente <
                          parseFloat(pendiente))
                    ) {
                      sumaPendientes =
                        sumaPendientes +
                        rowsMovimientosAsociacionOriginales[x].pendiente;
                      //console.log("suma: "+sumaPendientes);
                      nuevosAbonos.push(
                        rowsMovimientosAsociacionOriginales[x].pendiente
                      );
                      sumaAbonos =
                        sumaAbonos +
                        rowsMovimientosAsociacionOriginales[x].pendiente;
                      nuevosPendientes.push(0);
                    } else {
                      sumaPendientes =
                        accion === 1
                          ? parseFloat(importe) - sumaPendientes
                          : parseFloat(pendiente) - sumaPendientes;
                      sumaAbonos = sumaAbonos + sumaPendientes;
                      //console.log("suma extra: "+sumaPendientes);
                      //console.log("saldo nuevo:"+(rowsMovimientosAsociacionOriginales[x].pendiente - sumaPendientes));
                      nuevosAbonos.push(sumaPendientes);
                      nuevosPendientes.push(
                        rowsMovimientosAsociacionOriginales[x].pendiente -
                          sumaPendientes
                      );
                      break;
                    }
                  }
                  /* console.log(nuevosIds);                  
                  console.log(nuevosAbonos);
                  console.log(nuevosPendientes);
                  console.log(sumaPendientes, sumaAbonos, accion === 1 ? parseFloat(importe) : parseFloat(pendiente)); */

                  setInfoAbonos({
                    ids: nuevosIds,
                    abonos: nuevosAbonos,
                    pendientes: nuevosPendientes,
                  });
                  setNumeroAsociados(nuevosIds.length);
                  setPendiente(
                    accion === 1
                      ? parseFloat(importe) - sumaAbonos
                      : parseFloat(pendiente) - sumaAbonos
                  );
                  setOpenMenuAsociarMovimiento(false);
                }}
              >
                Saldar documentos a partir del más antiguo
              </Button>
              <Button
                variant="contained"
                style={{
                  background: "#FF9800",
                  float: "right",
                }}
                disabled={rowsAsociacion === 0}
                onClick={() => {
                  if (infoAbonoSelected.id === 0) {
                    swal("Error", "Elija un movimiento", "warning");
                  } else {
                    let nuevosIds = [];
                    let nuevosAbonos = [];
                    let nuevosPendientes = [];
                    for (let x = 0; x < infoAbonos.abonos.length; x++) {
                      if (
                        infoAbonos.abonos[x] !== "" &&
                        parseFloat(infoAbonos.abonos[x]) !== 0
                      ) {
                        nuevosIds.push(parseFloat(infoAbonos.ids[x]));
                        nuevosAbonos.push(parseFloat(infoAbonos.abonos[x]));
                        nuevosPendientes.push(
                          parseFloat(infoAbonos.pendientes[x])
                        );
                      }
                    }

                    setInfoAbonos({
                      ids: nuevosIds,
                      abonos: nuevosAbonos,
                      pendientes: nuevosPendientes,
                    });
                    setNumeroAsociados(1);
                    setPendiente(importePorAplicar);
                    setOpenMenuAsociarMovimiento(false);
                  }
                }}
              >
                Saldar documento actual
              </Button>
            </Grid>
            <Grid item xs={12}>
              <MovimientosAsociacionesEmpresa
                correo={correo}
                password={password}
                idEmpresa={idEmpresa}
                setLoading={setLoading}
                infoAbonos={infoAbonos}
                setInfoAbonos={setInfoAbonos}
                infoAbonoSelected={infoAbonoSelected}
                setInfoAbonoSelected={setInfoAbonoSelected}
                importe={importe}
                setImporte={setImporte}
                importePorAplicar={importePorAplicar}
                setImportePorAplicar={setImportePorAplicar}
                importeAplicado={importeAplicado}
                setImporteAplicado={setImporteAplicado}
                setRowsMovimientosAsociacionOriginales={
                  setRowsMovimientosAsociacionOriginales
                }
                tipomovimiento={tipoMovimiento}
                accion={accion}
                pendiente={pendiente}
                setRowsAsociacion={setRowsAsociacion}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuAsociarMovimiento();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={infoAbonoSelected.id !== 0 || rowsAsociacion === 0}
            onClick={() => {
              /* swal({
                text:
                  "¿Está seguro de hacer el pago a los movimientos que se les asigno un abono?",
                buttons: ["No", "Sí"],
                dangerMode: true,
              }).then((value) => {
                if (value) {
                  //aqui iba todo
                }
              }); */
              if (
                (importeAplicado > importe && accion === 1) ||
                (importeAplicado > pendiente && accion === 2)
              ) {
                swal(
                  "Error",
                  "El importe aplicado no puede ser mayor al importe pendiente",
                  "warning"
                );
              } else {
                let totalAbonos = 0;
                let nuevosIds = [];
                let nuevosAbonos = [];
                let nuevosPendientes = [];
                for (let x = 0; x < infoAbonos.abonos.length; x++) {
                  let abono =
                    infoAbonos.abonos[x] !== "" &&
                    parseFloat(infoAbonos.abonos[x]) !== 0
                      ? infoAbonos.abonos[x]
                      : 0;
                  totalAbonos = totalAbonos + parseFloat(abono);
                  if (
                    infoAbonos.abonos[x] !== "" &&
                    parseFloat(infoAbonos.abonos[x]) !== 0
                  ) {
                    nuevosIds.push(parseFloat(infoAbonos.ids[x]));
                    nuevosAbonos.push(parseFloat(infoAbonos.abonos[x]));
                    nuevosPendientes.push(parseFloat(infoAbonos.pendientes[x]));
                  }
                }
                if (nuevosIds.length === 0) {
                  swal(
                    "Error",
                    "No se ha asociado con ningún movimiento",
                    "warning"
                  );
                } else {
                  setPendiente(
                    accion === 1
                      ? parseFloat(importe) - totalAbonos
                      : parseFloat(pendiente) - totalAbonos
                  );
                  setInfoAbonos({
                    ids: nuevosIds,
                    abonos: nuevosAbonos,
                    pendientes: nuevosPendientes,
                  });
                  setNumeroAsociados(nuevosIds.length);
                  setOpenMenuAsociarMovimiento(false);
                }
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
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
            executeGetMovimientoEmpresa();
            setAccion(2);
            setOpenMenuNuevoMovimiento(true);
          }}
        >
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            swal({
              text: "¿Está seguro de eliminar este movimiento?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                executeEliminarMovimientoEmpresa({
                  data: {
                    usuario: correo,
                    pwd: password,
                    idmovimiento: idMovimiento,
                    rfc: rfc,
                    usuariostorage: usuarioStorage,
                    passwordstorage: passwordStorage,
                  },
                });
              }
            });
          }}
        >
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </StyledMenu>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuArchivosEl}
        keepMounted
        open={Boolean(anchorMenuArchivosEl)}
        onClose={handleCloseMenuArchivos}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenuArchivos();
            window.open(rutaArchivo);
          }}
        >
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenuArchivos();
            window.open(`${rutaArchivo}/download`);
          }}
        >
          <ListItemText primary="Descargar" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenuArchivos();
            swal({
              text: "¿Está seguro de eliminar este archivo?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                executeEliminarArchivoMovimientoEmpresa({
                  data: {
                    usuario: correo,
                    pwd: password,
                    iddocumento: idArchivo,
                    rfc: rfc,
                    usuariostorage: usuarioStorage,
                    passwordstorage: passwordStorage,
                  },
                });
                //console.log(idArchivo);
              }
            });
          }}
        >
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </StyledMenu>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuAbonosEl}
        keepMounted
        open={Boolean(anchorMenuAbonosEl)}
        onClose={handleCloseMenuAbonos}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenuAbonos();
            swal({
              text: "¿Está seguro de eliminar este abono?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                executeEliminarAbonoMovimientoEmpresa({
                  data: {
                    usuario: correo,
                    pwd: password,
                    idabono: idAbono,
                    tipomovimiento: tipoMovimiento,
                    rfc: rfc,
                    usuariostorage: usuarioStorage,
                    passwordstorage: passwordStorage,
                  },
                });
                //console.log(idArchivo);
              }
            });
          }}
        >
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </StyledMenu>
    </Card>
  );
}

function MovimientosAsociacionesEmpresa(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const idEmpresa = props.idEmpresa;
  const setLoading = props.setLoading;
  const tipomovimiento = props.tipomovimiento;
  const accion = props.accion;
  const pendiente = props.pendiente;
  const infoAbonos = props.infoAbonos;
  const setInfoAbonos = props.setInfoAbonos;
  const infoAbonoSelected = props.infoAbonoSelected;
  const setInfoAbonoSelected = props.setInfoAbonoSelected;
  const importe = props.importe;
  //const setImporte = props.setImporte;
  const importePorAplicar = props.importePorAplicar;
  const setImportePorAplicar = props.setImportePorAplicar;
  const importeAplicado = props.importeAplicado;
  const setImporteAplicado = props.setImporteAplicado;
  const setRowsMovimientosAsociacionOriginales =
    props.setRowsMovimientosAsociacionOriginales;
  const setRowsAsociacion = props.setRowsAsociacion;
  const [rowsMovimientos, setRowsMovimientos] = useState([]);
  const [pageMovimientos, setPageMovimientos] = useState(0);
  const [orderMovimientos, setOrderMovimientos] = useState("desc");
  const [orderByMovimientos, setOrderByMovimientos] = useState("fecha");
  const [rowsPerPageMovimientos, setRowsPerPageMovimientos] = useState(10);
  const [busquedaFiltroMovimientos, setBusquedaFiltroMovimientos] =
    useState("");

  const [
    {
      data: getMovimientosEmpresaData,
      loading: getMovimientosEmpresaLoading,
      error: getMovimientosEmpresaError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMovimientosEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
        tabla: 2,
        tipomovimientos: tipomovimiento,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (getMovimientosEmpresaData) {
      if (getMovimientosEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getMovimientosEmpresaData.error),
          "warning"
        );
      } else {
        setRowsMovimientos(getMovimientosEmpresaData.movimientos);
        setRowsMovimientosAsociacionOriginales(
          getMovimientosEmpresaData.movimientos
        );
        filterRowsMovimientos = [];
        let saldo = 0;
        let llenarIds = [];
        let llenarAbonos = [];
        let llenarPendientes = [];
        setRowsAsociacion(getMovimientosEmpresaData.movimientos.length);
        getMovimientosEmpresaData.movimientos.map((movimiento) => {
          saldo = saldo + movimiento.pendiente;
          llenarIds.push("");
          llenarAbonos.push("");
          llenarPendientes.push("");
          return filterRowsMovimientos.push(
            createDataMovimientos(
              movimiento.idmovimiento,
              movimiento.fecha,
              movimiento.documento,
              `$${movimiento.importe}`,
              `$${movimiento.abonos !== null ? movimiento.abonos : 0}`,
              `$${movimiento.pendiente}`,
              `$${movimiento.pendiente}`,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRowsMovimientos(filterRowsMovimientos);
        setInfoAbonos({
          ids: llenarIds,
          abonos: llenarAbonos,
          pendientes: llenarPendientes,
        });
        setInfoAbonoSelected({
          id: 0,
          abono: 0,
          pendiene: 0,
        });
      }
    }
  }, [
    getMovimientosEmpresaData,
    setRowsAsociacion,
    setInfoAbonos,
    setInfoAbonoSelected,
    setRowsMovimientosAsociacionOriginales,
  ]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsMovimientos.length; x++) {
        if (
          filterRowsMovimientos[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          moment(filterRowsMovimientos[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].documento
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].cargo
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].abono
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].saldo
            .toLowerCase()
            .indexOf(busquedaFiltroMovimientos.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsMovimientos[x]);
        }
      }
      return dataFilter;
    }

    setRowsMovimientos(
      busquedaFiltroMovimientos.trim() !== ""
        ? getFilterRows()
        : filterRowsMovimientos
    );
  }, [busquedaFiltroMovimientos]);

  if (getMovimientosEmpresaLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getMovimientosEmpresaError) {
    return <ErrorQueryDB />;
  }

  const handleRequestSortMovimientos = (event, property) => {
    const isAsc = orderByMovimientos === property && orderMovimientos === "asc";
    setOrderMovimientos(isAsc ? "desc" : "asc");
    setOrderByMovimientos(property);
  };

  const handleChangePageMovimientos = (event, newPage) => {
    setPageMovimientos(newPage);
  };

  const handleChangeRowsPerPageMovimientos = (event) => {
    setRowsPerPageMovimientos(parseInt(event.target.value, 10));
    setPageMovimientos(0);
  };

  return (
    <Card>
      <Grid container>
        <Grid
          item
          xs={2}
          sm={4}
          md={7}
          style={{ alignSelf: "flex-end", textAlign: "center" }}
        >
          <Tooltip title="Limpiar Filtro">
            <IconButton
              aria-label="filtro"
              style={{ float: "right" }}
              onClick={() => {
                setBusquedaFiltroMovimientos("");
              }}
            >
              <ClearAllIcon style={{ color: "black" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={10} sm={8} md={5}>
          <TextField
            className={classes.textFields}
            label="Escriba algo para filtrar"
            type="text"
            margin="normal"
            value={busquedaFiltroMovimientos}
            inputProps={{
              maxLength: 20,
            }}
            onChange={(e) => {
              setBusquedaFiltroMovimientos(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={orderMovimientos}
                orderBy={orderByMovimientos}
                onRequestSort={handleRequestSortMovimientos}
                rowCount={rowsMovimientos.length}
                headCells={headCellsMovimientosAsociacion}
              />
              <TableBody>
                {rowsMovimientos.length > 0 ? (
                  stableSort(
                    rowsMovimientos,
                    getComparator(orderMovimientos, orderByMovimientos)
                  )
                    .slice(
                      pageMovimientos * rowsPerPageMovimientos,
                      pageMovimientos * rowsPerPageMovimientos +
                        rowsPerPageMovimientos
                    )
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={infoAbonoSelected.id === row.id}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  /* if (
                                    importe > parseFloat(row.saldo.substr(1))
                                  ) {
                                    swal({
                                      text:
                                        "El importe ingresado es mayor al saldo de este movimiento. ¿desea cambiar el importe ingresado?",
                                      buttons: ["No", "Sí"],
                                      dangerMode: true,
                                    }).then((value) => {
                                      if (value) {
                                        let nuevosIds = infoAbonos.ids;
                                        let nuevosAbonos = infoAbonos.abonos;
                                        let nuevosPendientes =
                                          infoAbonos.pendientes;
                                        for (
                                          let x = 0;
                                          x < nuevosAbonos.length;
                                          x++
                                        ) {
                                          if (x !== index) {
                                            nuevosIds[x] = "";
                                            nuevosAbonos[x] = "";
                                            nuevosPendientes[x] = "";
                                          }
                                        }

                                        nuevosIds[index] = row.id;
                                        nuevosAbonos[index] = parseFloat(
                                          row.saldo.substr(1)
                                        );
                                        nuevosPendientes[index] = 0;

                                        setInfoAbonos({
                                          ids: nuevosIds,
                                          abonos: nuevosAbonos,
                                          pendientes: nuevosPendientes,
                                        });

                                        setImporte(
                                          parseFloat(row.saldo.substr(1))
                                        );
                                        setImporteAplicado(
                                          parseFloat(row.saldo.substr(1))
                                        );
                                        setImportePorAplicar(accion === 1 ? 0 : pendiente - parseFloat(row.saldo.substr(1)));

                                        setInfoAbonoSelected({
                                          id: row.id,
                                          abono: parseFloat(
                                            row.saldo.substr(1)
                                          ),
                                          pendiente: 0,
                                        });
                                      }
                                    });
                                  } else { */
                                  let nuevosIds = infoAbonos.ids;
                                  let nuevosAbonos = infoAbonos.abonos;
                                  let nuevosPendientes = infoAbonos.pendientes;
                                  for (
                                    let x = 0;
                                    x < nuevosAbonos.length;
                                    x++
                                  ) {
                                    if (x !== index) {
                                      nuevosIds[x] = "";
                                      nuevosAbonos[x] = "";
                                      nuevosPendientes[x] = "";
                                    }
                                  }
                                  nuevosIds[index] = row.id;
                                  nuevosAbonos[index] =
                                    accion === 1
                                      ? parseFloat(importe) >
                                        parseFloat(row.saldo.substr(1))
                                        ? parseFloat(row.saldo.substr(1))
                                        : parseFloat(importe)
                                      : parseFloat(pendiente) >
                                        parseFloat(row.saldo.substr(1))
                                      ? parseFloat(row.saldo.substr(1))
                                      : parseFloat(pendiente);
                                  nuevosPendientes[index] =
                                    accion === 1
                                      ? parseFloat(importe) >
                                        parseFloat(row.saldo.substr(1))
                                        ? 0
                                        : parseFloat(row.saldo.substr(1)) -
                                          parseFloat(importe)
                                      : parseFloat(pendiente) >
                                        parseFloat(row.saldo.substr(1))
                                      ? 0
                                      : parseFloat(row.saldo.substr(1)) -
                                        parseFloat(pendiente);
                                  setInfoAbonos({
                                    ids: nuevosIds,
                                    abonos: nuevosAbonos,
                                    pendientes: nuevosPendientes,
                                  });

                                  setImporteAplicado(
                                    accion === 1
                                      ? parseFloat(importe) >
                                        parseFloat(row.saldo.substr(1))
                                        ? parseFloat(row.saldo.substr(1))
                                        : parseFloat(importe)
                                      : parseFloat(pendiente) >
                                        parseFloat(row.saldo.substr(1))
                                      ? parseFloat(row.saldo.substr(1))
                                      : parseFloat(pendiente)
                                  );
                                  setImportePorAplicar(
                                    accion === 1
                                      ? parseFloat(importe) >
                                        parseFloat(row.saldo.substr(1))
                                        ? parseFloat(importe) -
                                          parseFloat(row.saldo.substr(1))
                                        : 0
                                      : parseFloat(pendiente) >
                                        parseFloat(row.saldo.substr(1))
                                      ? parseFloat(pendiente) -
                                        parseFloat(row.saldo.substr(1))
                                      : 0
                                  );

                                  setInfoAbonoSelected({
                                    id: row.id,
                                    abono:
                                      accion === 1
                                        ? parseFloat(importe)
                                        : parseFloat(pendiente),
                                    pendiente:
                                      accion === 1
                                        ? parseFloat(row.saldo.substr(1)) -
                                          parseFloat(importe)
                                        : parseFloat(row.saldo.substr(1)) -
                                          parseFloat(pendiente),
                                  });
                                  //}
                                } else {
                                  let nuevosIds = infoAbonos.ids;
                                  let nuevosAbonos = infoAbonos.abonos;
                                  let nuevosPendientes = infoAbonos.pendientes;
                                  for (
                                    let x = 0;
                                    x < nuevosAbonos.length;
                                    x++
                                  ) {
                                    nuevosIds[x] = "";
                                    nuevosAbonos[x] = "";
                                    nuevosPendientes[x] = "";
                                  }

                                  setInfoAbonos({
                                    ids: nuevosIds,
                                    abonos: nuevosAbonos,
                                    pendientes: nuevosPendientes,
                                  });
                                  setImporteAplicado(0);
                                  setImportePorAplicar(
                                    accion === 1
                                      ? parseFloat(importe)
                                      : parseFloat(pendiente)
                                  );
                                  setInfoAbonoSelected({
                                    id: 0,
                                    abono: 0,
                                    pendiene: 0,
                                  });
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" id={labelId}>
                            {row.fecha}
                          </TableCell>
                          <TableCell align="right">{row.documento}</TableCell>
                          <TableCell align="right">{row.cargo}</TableCell>
                          <TableCell align="center">
                            <TextField
                              id={`abono${index}`}
                              type="text"
                              disabled={infoAbonoSelected.id !== 0}
                              label={`Abono actual: ${row.abono}`}
                              margin="normal"
                              inputProps={{
                                maxLength: 20,
                              }}
                              value={infoAbonos.abonos[index] || ""}
                              onKeyPress={(e) => {
                                doubleKeyValidation(e, 2);
                              }}
                              onChange={(e) => {
                                doublePasteValidation(e, 2);
                                if (
                                  parseFloat(e.target.value) >
                                  parseFloat(row.saldo.substr(1))
                                ) {
                                  swal(
                                    "Error",
                                    "No puede abonar más del saldo actual del movimiento",
                                    "warning"
                                  );
                                } else {
                                  let nuevosAbonos = infoAbonos.abonos;
                                  nuevosAbonos[index] = e.target.value;
                                  let nuevosIds = infoAbonos.ids;
                                  nuevosIds[index] = row.id;
                                  let nuevosPendientes = infoAbonos.pendientes;
                                  nuevosPendientes[index] =
                                    parseFloat(row.saldo.substr(1)) -
                                    parseFloat(e.target.value);

                                  let nuevoImporteAplicado = 0;
                                  for (
                                    let x = 0;
                                    x < nuevosAbonos.length;
                                    x++
                                  ) {
                                    if (nuevosAbonos[x] !== "") {
                                      nuevoImporteAplicado =
                                        nuevoImporteAplicado +
                                        parseFloat(nuevosAbonos[x]);
                                    }
                                  }

                                  setInfoAbonos({
                                    ids: nuevosIds,
                                    abonos: nuevosAbonos,
                                    pendientes: nuevosPendientes,
                                  });
                                  setImporteAplicado(nuevoImporteAplicado);
                                  if (accion === 1) {
                                    setImportePorAplicar(
                                      importe - nuevoImporteAplicado
                                    );
                                  } else {
                                    setImportePorAplicar(
                                      pendiente - nuevoImporteAplicado
                                    );
                                  }
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">{row.saldo}</TableCell>
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
                        No hay movimientos disponibles
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell rowSpan={3} colSpan={4} />
                  <TableCell>Importe pendiente:</TableCell>
                  <TableCell align="right">
                    {accion === 1 ? `$${importe}` : `$${pendiente}`}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Importe por aplicar:</TableCell>
                  <TableCell align="right">{`$${importePorAplicar}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Importe aplicado:</TableCell>
                  <TableCell align="right">{`$${importeAplicado}`}</TableCell>
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
            count={rowsMovimientos.length}
            rowsPerPage={rowsPerPageMovimientos}
            page={
              rowsMovimientos.length > 0 &&
              rowsMovimientos.length >= rowsPerPageMovimientos
                ? pageMovimientos
                : 0
            }
            onChangePage={handleChangePageMovimientos}
            onChangeRowsPerPage={handleChangeRowsPerPageMovimientos}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

function ServiciosEmpresa(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const idEmpresa = props.idEmpresa;
  const rows = props.rows;
  const setRows = props.setRows;
  const page = props.page;
  const pageServicios = props.pageServicios;
  const setPageServicios = props.setPageServicios;
  const busquedaFiltro = props.busquedaFiltro;
  const busquedaFiltroServicios = props.busquedaFiltroServicios;
  const setBusquedaFiltroServicios = props.setBusquedaFiltroServicios;
  const baseDatosEmpresa = props.baseDatosEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openMenuAgregarServicio, setOpenMenuAgregarServicio] = useState(false);
  const [serviciosNoContratados, setServiciosNoContratados] = useState([]);
  const [serviciosElegidos, setServiciosElegidos] = useState([]);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [idServicio, setIdServicio] = useState(0);

  const [
    {
      data: getServiciosEmpresaData,
      loading: getServiciosEmpresaLoading,
      error: getServiciosEmpresaError,
    },
    executeGetServiciosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServiciosEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getServiciosNoContratadosEmpresaData,
      loading: getServiciosNoContratadosEmpresaLoading,
      error: getServiciosNoContratadosEmpresaError,
    },
    executeGetServiciosNoContratadosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServiciosNoContratadosEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: agregarServiciosEmpresaData,
      loading: agregarServiciosEmpresaLoading,
      error: agregarServiciosEmpresaError,
    },
    executeAgregarServiciosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarServiciosEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: eliminarServicioEmpresaData,
      loading: eliminarServicioEmpresaLoading,
      error: eliminarServicioEmpresaError,
    },
    executeEliminarServicioEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarServicioEmpresa`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (getServiciosEmpresaData) {
      if (getServiciosEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getServiciosEmpresaData.error),
          "warning"
        );
      } else {
        filterRowsServicios = [];
        getServiciosEmpresaData.servicios.map((servicio) => {
          return filterRowsServicios.push(
            createDataServicios(
              servicio.id,
              servicio.nombreservicio,
              servicio.precio,
              servicio.descripcion,
              servicio.tipo,
              servicio.fecha,
              servicio.status,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRows(filterRowsServicios);
      }
    }
  }, [getServiciosEmpresaData, setRows]);

  useEffect(() => {
    if (getServiciosNoContratadosEmpresaData) {
      if (getServiciosNoContratadosEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getServiciosNoContratadosEmpresaData.error),
          "warning"
        );
      } else {
        setServiciosNoContratados(
          getServiciosNoContratadosEmpresaData.servicios
        );
        let iniciarServiciosNoContratados = [];
        for (
          let x = 0;
          x < getServiciosNoContratadosEmpresaData.servicios.length;
          x++
        ) {
          iniciarServiciosNoContratados.push(0);
        }
        setServiciosElegidos(iniciarServiciosNoContratados);
      }
    }
  }, [getServiciosNoContratadosEmpresaData]);

  useEffect(() => {
    if (agregarServiciosEmpresaData) {
      if (agregarServiciosEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(agregarServiciosEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Servicio(s) Agregado(s)",
          "Servicio(s) agregado(s) con éxito",
          "success"
        );
        executeGetServiciosEmpresa();
        executeGetServiciosNoContratadosEmpresa();
      }
    }
  }, [
    agregarServiciosEmpresaData,
    executeGetServiciosEmpresa,
    executeGetServiciosNoContratadosEmpresa,
  ]);

  useEffect(() => {
    if (eliminarServicioEmpresaData) {
      if (eliminarServicioEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(eliminarServicioEmpresaData.error),
          "warning"
        );
      } else {
        swal("Servicio eliminado", "Servicio eliminado con éxito", "success");
        executeGetServiciosEmpresa();
        executeGetServiciosNoContratadosEmpresa();
      }
    }
  }, [
    eliminarServicioEmpresaData,
    executeGetServiciosEmpresa,
    executeGetServiciosNoContratadosEmpresa,
  ]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsServicios.length; x++) {
        if (
          filterRowsServicios[x].servicio
            .toLowerCase()
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1 ||
          filterRowsServicios[x].precio
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1 ||
          filterRowsServicios[x].descripcion
            .toLowerCase()
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1 ||
          filterRowsServicios[x].tipo
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1 ||
          filterRowsServicios[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1 ||
          moment(filterRowsServicios[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltroServicios.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsServicios[x]);
        }
      }
      return dataFilter;
    }

    const decodedToken = jwt.verify(
      localStorage.getItem("menuTemporal"),
      "mysecretpassword"
    );
    setRows(
      busquedaFiltroServicios.trim() !== ""
        ? getFilterRows()
        : filterRowsServicios
    );
    setPageServicios(
      rows.length < rowsPerPage
        ? 0
        : decodedToken.menuTemporal.pageServicios
        ? decodedToken.menuTemporal.pageServicios
        : 0
    );

    const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "empresas",
          showComponent: 4,
          idEmpresa: idEmpresa,
          baseDatosEmpresa: baseDatosEmpresa,
          nombreEmpresa: nombreEmpresa,
          busquedaFiltro: busquedaFiltro,
          page: page,
          busquedaFiltroUsuarios: "",
          pageUsuarios: 0,
          busquedaFiltroServicios: busquedaFiltroServicios,
          pageServicios:
            rows.length < rowsPerPage && rows.length !== 0
              ? 0
              : decodedToken.menuTemporal.pageUsuarios
              ? decodedToken.menuTemporal.pageUsuarios
              : 0,
          busquedaFiltroMovimientos: "",
          pageMovimientos: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  }, [
    busquedaFiltro,
    busquedaFiltroServicios,
    setRows,
    rows.length,
    rowsPerPage,
    setPageServicios,
    idEmpresa,
    baseDatosEmpresa,
    nombreEmpresa,
    page,
  ]);

  if (
    getServiciosEmpresaLoading ||
    getServiciosNoContratadosEmpresaLoading ||
    agregarServiciosEmpresaLoading ||
    eliminarServicioEmpresaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getServiciosEmpresaError ||
    getServiciosNoContratadosEmpresaError ||
    agregarServiciosEmpresaError ||
    eliminarServicioEmpresaError
  ) {
    return <ErrorQueryDB />;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPageServicios(newPage);
    /* const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: newPage,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token); */
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageServicios(0);
    /* const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token); */
  };

  const handleOpenMenuAgregarServicio = () => {
    setOpenMenuAgregarServicio(true);
  };

  const handleCloseMenuAgregarServicio = () => {
    setOpenMenuAgregarServicio(false);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const agregarServicio = () => {
    let nuevosServicios = [];
    for (let x = 0; x < serviciosElegidos.length; x++) {
      if (serviciosElegidos[x] !== 0) {
        nuevosServicios.push(serviciosElegidos[x]);
      }
    }
    if (nuevosServicios.length === 0) {
      swal("Error", "Seleccione por lo menos un servicio", "warning");
    } else {
      executeAgregarServiciosEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          idempresa: idEmpresa,
          servicios: nuevosServicios,
          fecha: moment().format("YYYY-MM-DD"),
        },
      });
    }
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={8} sm={6} md={6}>
              <Typography
                className={classes.titleTable}
                variant="h6"
                style={{ alignSelf: "center" }}
                id="tableTitle"
              >
                <Tooltip title="Regresar">
                  <IconButton
                    aria-label="regresar"
                    onClick={() => {
                      setShowComponent(0);
                      //setIdUsuario(0);
                      setBusquedaFiltroServicios("");
                      setPageServicios(0);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            modulo: "empresas",
                            showComponent: 0,
                            idEmpresa: 0,
                            baseDatosEmpresa: "",
                            nombreEmpresa: "",
                            busquedaFiltro: busquedaFiltro,
                            page: page,
                            busquedaFiltroUsuarios: "",
                            pageUsuarios: 0,
                            busquedaFiltroServicios: "",
                            pageServicios: "",
                            busquedaFiltroMovimientos: "",
                            pageMovimientos: 0,
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
                Lista De Servicios De {nombreEmpresa}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sm={6}
              md={2}
              style={{ alignSelf: "flex-end", textAlign: "center" }}
            >
              <Tooltip title="Limpiar Filtro">
                <IconButton
                  aria-label="filtro"
                  style={{ float: "right" }}
                  onClick={() => {
                    setBusquedaFiltroServicios("");
                  }}
                >
                  <ClearAllIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Agregar Servicio">
                <IconButton
                  aria-label="agregarServicio"
                  style={{ float: "right" }}
                  onClick={() => {
                    handleOpenMenuAgregarServicio();
                  }}
                >
                  <AddCircleIcon
                    style={{
                      color: "#4caf50",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                className={classes.textFields}
                label="Escriba algo para filtrar"
                type="text"
                margin="normal"
                value={busquedaFiltroServicios}
                inputProps={{
                  maxLength: 20,
                }}
                onChange={(e) => {
                  setBusquedaFiltroServicios(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Toolbar>
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
              headCells={headCellsServicios}
            />
            <TableBody>
              {rows.length > 0 ? (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(
                    pageServicios * rowsPerPage,
                    pageServicios * rowsPerPage + rowsPerPage
                  )
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell padding="checkbox" />
                        <TableCell component="th" id={labelId} scope="row">
                          {row.servicio}
                        </TableCell>
                        <TableCell align="right">{`$${row.precio}`}</TableCell>
                        <TableCell align="right">{row.descripcion}</TableCell>
                        <TableCell align="right">{row.tipo}</TableCell>
                        <TableCell align="right">{row.fecha}</TableCell>
                        <TableCell align="right">
                          {row.estatus === 1 ? "Activo" : "Inactivo"}
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => {
                            handleOpenMenu(e);
                            setIdServicio(row.id);
                          }}
                        >
                          {row.acciones}
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
                      No hay servicios disponibles
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
          page={
            rows.length > 0 && rows.length >= rowsPerPage ? pageServicios : 0
          }
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        onClose={handleCloseMenuAgregarServicio}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuAgregarServicio}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">Agregar Servicio</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="right">
                        <strong>Servicio</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Descripción</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Precio</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviciosNoContratados.length > 0 ? (
                      serviciosNoContratados.map((servicio, index) => (
                        <TableRow hover role="checkbox" key={index}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              onChange={(e) => {
                                let nuevosServiciosElegidos = serviciosElegidos;
                                nuevosServiciosElegidos[index] = e.target
                                  .checked
                                  ? servicio.id
                                  : 0;
                                setServiciosElegidos(nuevosServiciosElegidos);
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {servicio.nombreservicio}
                          </TableCell>
                          <TableCell align="right">
                            {servicio.descripcion}
                          </TableCell>
                          <TableCell align="right">{`$${servicio.precio}`}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="subtitle1">
                            <ErrorIcon
                              style={{ color: "red", verticalAlign: "sub" }}
                            />
                            No hay servicios disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
            onClick={() => {
              handleCloseMenuAgregarServicio();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              agregarServicio();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
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
            swal({
              text: "¿Está seguro de eliminar este servicio de la empresa?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                executeEliminarServicioEmpresa({
                  data: {
                    usuario: correo,
                    pwd: password,
                    idempresa: idEmpresa,
                    idservicio: idServicio,
                  },
                });
              }
            });
          }}
        >
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
