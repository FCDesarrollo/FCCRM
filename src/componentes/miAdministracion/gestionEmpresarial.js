import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Card,
  Grid,
  Button,
  Typography,
  Tooltip,
  IconButton,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  useMediaQuery,
  /* SvgIcon, */
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  List,
  Checkbox,
  CircularProgress,
  Collapse,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  ListItemIcon,
} from "@material-ui/core";
/* import { TreeView, TreeItem } from "@material-ui/lab"; */
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  FindInPage as FindInPageIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  GroupAdd as GroupAddIcon,
  ClearAll as ClearAllIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Assignment as AssignmentIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Fragment } from "react";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import swal from "sweetalert";
import moment from "moment";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import jwt from "jsonwebtoken";
import TreeMenu, { ItemComponent } from "react-simple-tree-menu";
import "../../../node_modules/react-simple-tree-menu/dist/main.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link as LinkPdf,
  Image,
} from "@react-pdf/renderer";
import DublockLogo from "../../assets/images/logodublock.png";

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
  submenusForms: {
    padding: 15,
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

export default function GestionEmpresarial(props) {
  const classes = useStyles();
  const usuarioDatos = props.usuarioDatos;
  const empresaDatos = props.empresaDatos;
  const nombreEmpresa = empresaDatos.nombreempresa;
  const idUsuario = usuarioDatos.idusuario;
  const correoUsuario = usuarioDatos.correo;
  const passwordUsuario = usuarioDatos.password;
  const rfcEmpresa = empresaDatos.RFC;
  const submenuContent = props.submenuContent;
  const setLoading = props.setLoading;
  const [idModulo, setIdModulo] = useState(0);
  const [idMenu, setIdMenu] = useState(0);
  const [idSubmenu, setIdSubmenu] = useState(0);
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [nombreSubmenu, setNombreSubmenu] = useState("");
  const [showSection, setShowSection] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("dataTemporal")) {
      try {
        const decodedToken = jwt.verify(
          localStorage.getItem("dataTemporal"),
          "mysecretpassword"
        );
        setIdModulo(decodedToken.data.idModulo);
        setIdMenu(decodedToken.data.idMenu);
        setIdSubmenu(decodedToken.data.idSubmenu);
        setPermisosSubmenu(decodedToken.data.permisosSubmenu);
        setNombreSubmenu(decodedToken.data.nombreSubmenu);
        setShowSection(decodedToken.data.showSection);
      } catch (err) {
        localStorage.removeItem("dataTemporal");
      }
    }
  }, []);

  return (
    <Fragment>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Gestión Empresarial
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
                        setPermisosSubmenu(content.permisos);
                        setNombreSubmenu(content.submenu.nombre_submenu);
                        setShowSection(0);
                        const token = jwt.sign(
                          {
                            data: {
                              idModulo: content.idModulo,
                              idMenu: content.submenu.idmenu,
                              idSubmenu: content.submenu.idsubmenu,
                              permisosSubmenu: content.permisos,
                              nombreSubmenu: content.submenu.nombre_submenu,
                              showSection: 0,
                              correoUsuario: correoUsuario,
                              passwordUsuario: passwordUsuario,
                              rfcEmpresa: rfcEmpresa,
                              nombreEmpresa: nombreEmpresa,
                            },
                          },
                          "mysecretpassword"
                        );
                        localStorage.setItem("dataTemporal", token);
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
        {idSubmenu === 49 ? (
          <PlanesTrabajo
            idUsuario={idUsuario}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idModulo={idModulo}
            idMenu={idMenu}
            idSubmenu={idSubmenu}
            setIdSubmenu={setIdSubmenu}
            permisosSubmenu={permisosSubmenu}
            nombreSubmenu={nombreSubmenu}
            setLoading={setLoading}
            showSection={showSection}
            setShowSection={setShowSection}
          />
        ) : null}
      </Card>
    </Fragment>
  );
}

/* const rows = []; */

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

function createDataProyectos(
  idProyecto,
  proyecto,
  idResponsable,
  responsable,
  estatus,
  clas1,
  clas2,
  clas3,
  clas4,
  codigo,
  fechaInicial,
  fechaFinal,
  porcentajeAvance,
  fechaUltimaAccion,
  numActividades,
  numAcciones,
  numDocumentos,
  numPlanes,
  nombreEstatus
) {
  return {
    idProyecto,
    proyecto,
    idResponsable,
    responsable,
    estatus,
    clas1,
    clas2,
    clas3,
    clas4,
    codigo,
    fechaInicial,
    fechaFinal,
    porcentajeAvance,
    fechaUltimaAccion,
    numActividades,
    numAcciones,
    numDocumentos,
    numPlanes,
    nombreEstatus,
  };
}

const headCellsProyectos = [
  { id: "proyecto", align: "left", sortHeadCell: true, label: "Proyecto" },
  {
    id: "responsable",
    align: "right",
    sortHeadCell: true,
    label: "Responsable",
  },
  { id: "idClas1", align: "right", sortHeadCell: true, label: "Clas 1" },
  { id: "idClas2", align: "right", sortHeadCell: true, label: "Clas 2" },
  { id: "idClas3", align: "right", sortHeadCell: true, label: "Clas 3" },
  { id: "idClas4", align: "right", sortHeadCell: true, label: "Clas 4" },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

function createDataAgentesPersonas(
  idAgentePersona,
  agente,
  estatus,
  tipo,
  idProyecto
) {
  return { idAgentePersona, agente, estatus, tipo, idProyecto };
}

const headCellsAgentesPersonas = [
  {
    id: "agente",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Agente",
  },
  {
    id: "estatus",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Estatus",
  },
  /* {
    id: "tipo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo",
  }, */
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCellTable, actions } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ background: "#FAFAFA" }}>
      <TableRow>
        <TableCell />
        {headCellTable.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              display:
                headCell.id !== "acciones"
                  ? "table-cell"
                  : actions
                  ? "table-cell"
                  : "none",
            }}
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCellTable: PropTypes.array.isRequired,
  actions: PropTypes.bool.isRequired,
};

const useProyectos = (
  correoUsuario,
  passwordUsuario,
  rfcEmpresa,
  idSubmenu
) => {
  const [proyectos, setProyectos] = useState([]);

  const [
    {
      data: getPryProyectosData,
      loading: getPryProyectosLoading,
      error: getPryProyectosError,
    },
    executeGetPryProyectos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyectos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyectosData) {
        if (getPryProyectosData.error !== 0) {
          swal("Error", dataBaseErrores(getPryProyectosData.error), "warning");
        } else {
          let proyectos = [];
          getPryProyectosData.proyectos.map((proyecto) =>
            proyectos.push(
              createDataProyectos(
                proyecto.id,
                proyecto.Proyecto,
                proyecto.idAgente,
                proyecto.Agente,
                proyecto.Estatus,
                proyecto.IdClas1,
                proyecto.IdClas2,
                proyecto.IdClas3,
                proyecto.IdClas4,
                proyecto.Codigo,
                proyecto.FecIni,
                proyecto.FecFin,
                proyecto.Avance,
                proyecto.FecUltAccion,
                proyecto.numActividades,
                proyecto.numAcciones,
                proyecto.numDocumentos,
                proyecto.numPlanes,
                proyecto.nombreEstatus
              )
            )
          );
          setProyectos(proyectos);
        }
      }
    }

    checkData();
  }, [getPryProyectosData]);

  return {
    proyectosData: proyectos,
    proyectosLoading: getPryProyectosLoading,
    proyectosError: getPryProyectosError,
    executeGetPryProyectos,
  };
};

const useAgentesPersonas = (
  correoUsuario,
  passwordUsuario,
  rfcEmpresa,
  idSubmenu
) => {
  const [agentesPersonas, setAgentesPersonas] = useState([]);

  const [
    {
      data: getPryAgentesPersonasData,
      loading: getPryAgentesPersonasLoading,
      error: getPryAgentesPersonasError,
    },
    executeGetPryAgentesPersonas,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryAgentesPersonas`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryAgentesPersonasData) {
        if (getPryAgentesPersonasData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getPryAgentesPersonasData.error),
            "warning"
          );
        } else {
          let agentesPersonas = [];
          getPryAgentesPersonasData.agentesPersonas.map((agentePersona) =>
            agentesPersonas.push(
              createDataAgentesPersonas(
                agentePersona.id,
                agentePersona.Agente,
                agentePersona.Estatus,
                agentePersona.tipo,
                agentePersona.idProyecto
              )
            )
          );
          setAgentesPersonas(agentesPersonas);
        }
      }
    }

    checkData();
  }, [getPryAgentesPersonasData]);

  return {
    agentesPersonasData: agentesPersonas,
    agentesPersonasLoading: getPryAgentesPersonasLoading,
    agentesPersonasError: getPryAgentesPersonasError,
    executeGetPryAgentesPersonas,
  };
};

function PlanesTrabajo(props) {
  const classes = useStyles();
  const theme = useTheme();
  const xsSize = useMediaQuery(theme.breakpoints.down("xs"));

  const setLoading = props.setLoading;
  const idUsuario = props.idUsuario;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  const setIdSubmenu = props.setIdSubmenu;
  const permisosSubmenu = props.permisosSubmenu;
  const nombreSubmenu = props.nombreSubmenu;
  const showSection = props.showSection;
  const setShowSection = props.setShowSection;
  const [openDialogAgentes, setOpenDialogAgentes] = useState(false);
  const [openDialogGuardarProyecto, setOpenDialogGuardarProyecto] =
    useState(false);
  const [idAgente, setIdAgente] = useState(0);
  const [estatus, setEstatus] = useState(0);
  const [busquedaProyecto, setBusquedaProyecto] = useState("");

  const [datosProyecto, setDatosProyecto] = useState({
    idProyecto: 0,
    codigo: "",
    proyecto: "",
    clas1: 0,
    clas2: 0,
    clas3: 0,
    clas4: 0,
    responsable: 0,
    estatus: 0,
    fechaInicial: moment().format("YYYY-MM-DD"),
    fechaFinal: "",
    porcientoAvance: "",
    fechaUltimaAccion: moment().format("YYYY-MM-DD"),
  });

  const [idProyectoSelected, setIdProyectoSelected] = useState(0);

  const {
    proyectosData,
    proyectosLoading,
    proyectosError,
    executeGetPryProyectos,
  } = useProyectos(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  const {
    agentesPersonasData,
    agentesPersonasLoading,
    agentesPersonasError,
    executeGetPryAgentesPersonas,
  } = useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  const [
    {
      data: guardarPryProyectoData,
      loading: guardarPryProyectoLoading,
      error: guardarPryProyectoError,
    },
    executeGuardarPryProyecto,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyecto`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (guardarPryProyectoData) {
        if (guardarPryProyectoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyectoData.error),
            "warning"
          );
        } else {
          executeGetPryProyectos();
          handleCloseDialogGuardarProyecto();
        }
      }
    }

    checkData();
  }, [guardarPryProyectoData, executeGetPryProyectos]);

  if (agentesPersonasLoading || guardarPryProyectoLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (agentesPersonasError || guardarPryProyectoError) {
    return <ErrorQueryDB />;
  }

  const handleOpenDialogAgentes = () => {
    setOpenDialogAgentes(true);
  };

  const handleCloseDialogAgentes = () => {
    setOpenDialogAgentes(false);
  };

  const handleOpenDialogGuardarProyecto = () => {
    setOpenDialogGuardarProyecto(true);
  };

  /* const handleOpenReportes = () => {
    setShowSection(2);
  }; */

  const handleCloseDialogGuardarProyecto = () => {
    setOpenDialogGuardarProyecto(false);
    setDatosProyecto({
      idProyecto: 0,
      codigo: "",
      proyecto: "",
      clas1: "0",
      clas2: "0",
      clas3: "0",
      clas4: "0",
      responsable: "0",
      estatus: "0",
      fechaInicial: moment().format("YYYY-MM-DD"),
      fechaFinal: "",
      porcientoAvance: "",
      fechaUltimaAccion: moment().format("YYYY-MM-DD"),
    });
  };

  const handleChangeIdAgente = (e) => {
    setIdAgente(parseInt(e.target.value));
  };

  const handleChangeEstatus = (e) => {
    setEstatus(parseInt(e.target.value));
  };

  const handleChangeBusquedaProyecto = (e) => {
    setBusquedaProyecto(e.target.value);
  };

  const handleClearBusquedaProyecto = () => {
    setBusquedaProyecto("");
  };

  const handleGuardarProyecto = () => {
    const {
      idProyecto,
      codigo,
      proyecto,
      clas1,
      clas2,
      clas3,
      clas4,
      responsable,
      estatus,
      fechaInicial,
      fechaFinal,
      porcientoAvance,
    } = datosProyecto;
    if (codigo.trim() === "") {
      swal("Error", "Ingrese un código", "warning");
    } else if (proyecto.trim() === "") {
      swal("Error", "Ingrese un proyecto", "warning");
    } else if (parseInt(clas1) === 0) {
      swal("Error", "Elija una clasificación 1", "warning");
    } else if (parseInt(clas2) === 0) {
      swal("Error", "Elija una clasificación 2", "warning");
    } else if (parseInt(clas3) === 0) {
      swal("Error", "Elija una clasificación 3", "warning");
    } else if (parseInt(clas4) === 0) {
      swal("Error", "Elija una clasificación 4", "warning");
    } else if (parseInt(responsable) === 0) {
      swal("Error", "Elija un responsable", "warning");
    } else if (parseInt(estatus) === 0) {
      swal("Error", "Elija un estatus", "warning");
    } else if (fechaInicial === "") {
      swal("Error", "Elija una fecha de inicio", "warning");
    } else if (fechaFinal === "") {
      swal("Error", "Elija una fecha de fin", "warning");
    } else if (porcientoAvance === "") {
      swal("Error", "Ingrese un porcentaje de avance", "warning");
    } else if (parseInt(porcientoAvance) > 100) {
      swal("Error", "Ingrese un porcentaje de avance valido", "warning");
    } else {
      executeGuardarPryProyecto({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idProyecto: idProyecto,
          Codigo: codigo.trim(),
          Proyecto: proyecto.trim(),
          IdClas1: clas1,
          IdClas2: clas2,
          IdClas3: clas3,
          IdClas4: clas4,
          idAgente: responsable,
          Estatus: estatus,
          FecIni: fechaInicial,
          FecFin: fechaFinal,
          Avance: porcientoAvance.toString().trim(),
          FecUltAccion: moment().format("YYYY-MM-DD"),
          accion: idProyecto === 0 ? 1 : 2,
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
      <Grid item xs={12}>
        <Typography variant="h6">
          <Tooltip title="Cerrar">
            <IconButton
              aria-label="cerrar"
              onClick={() => {
                setIdSubmenu(0);
                localStorage.removeItem("dataTemporal");
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
          {nombreSubmenu}
        </Typography>
      </Grid>

      {
        showSection === 0 ? (
          <Fragment>
            {xsSize ? (
              <Fragment>
                <Grid item xs={12}>
                  <Link to="/reportesProyectos" target="_blank">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={permisosSubmenu < 2}
                      style={{ float: "right" }}
                    >
                      Reportes
                    </Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={permisosSubmenu < 2}
                    style={{ float: "right" }}
                    onClick={handleOpenDialogGuardarProyecto}
                  >
                    Agregar Proyecto
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Filtros</Typography>
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item xs={12} sm={6} style={{ alignSelf: "flex-end" }}>
                  <Typography variant="subtitle1">Filtros</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={permisosSubmenu < 2}
                    style={{ float: "right" }}
                    onClick={handleOpenDialogGuardarProyecto}
                  >
                    Agregar Proyecto
                  </Button>
                  <Link to="/reportesProyectos" target="_blank">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={permisosSubmenu < 2}
                      style={{ float: "right", marginRight: 10 }}
                      /* onClick={handleOpenReportes} */
                    >
                      Reportes
                    </Button>
                  </Link>
                  <div>
              <PDFDownloadLink document={<ReportePorProyecto idProyecto={7} setLoading={setLoading} correoUsuario={correoUsuario} passwordUsuario={passwordUsuario} rfcEmpresa={rfcEmpresa} idSubmenu={idSubmenu} />} fileName="somename.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : <button>{url}</button>
                }
              </PDFDownloadLink>
            </div>
                </Grid>
              </Fragment>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Agente"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                value={idAgente}
                onChange={handleChangeIdAgente}
              >
                <option value={0}>Elija un agente</option>
                {agentesPersonasData
                  .filter(
                    (agentePersona) =>
                      agentePersona.estatus === 1 && agentePersona.tipo === 1
                  )
                  .map((agente, index) => (
                    <option key={index} value={agente.idAgentePersona}>
                      {agente.agente}
                    </option>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={1} style={{ alignSelf: "center" }}>
              <Tooltip title="Agentes">
                <IconButton onClick={handleOpenDialogAgentes}>
                  <GroupAddIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Estatus"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                value={estatus}
                onChange={handleChangeEstatus}
              >
                <option value={0}>Elija un estatus</option>
                <option value={1}>Pendiente</option>
                <option value={2}>En proceso</option>
                <option value={3}>Terminado</option>
                <option value={4}>Cerrado</option>
              </TextField>
            </Grid>
            <Grid item xs={3} sm={2} md={1} style={{ alignSelf: "flex-end" }}>
              <Tooltip title="Limpiar Filtro">
                <IconButton
                  aria-label="filtro"
                  style={{
                    float: "right",
                    width: xsSize ? "-webkit-fill-available" : "",
                  }}
                  onClick={handleClearBusquedaProyecto}
                >
                  <ClearAllIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={9} sm={10} md={4} style={{ alignSelf: "center" }}>
              <TextField
                className={classes.textFields}
                id="busquedaProyecto"
                label="Buscar"
                value={busquedaProyecto}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={handleChangeBusquedaProyecto}
              />
            </Grid>
            <Proyectos
              setLoading={setLoading}
              correoUsuario={correoUsuario}
              passwordUsuario={passwordUsuario}
              rfcEmpresa={rfcEmpresa}
              idSubmenu={idSubmenu}
              permisosSubmenu={permisosSubmenu}
              idAgente={idAgente}
              estatus={estatus}
              busquedaProyecto={busquedaProyecto}
              proyectosData={proyectosData}
              proyectosLoading={proyectosLoading}
              proyectosError={proyectosError}
              executeGetPryProyectos={executeGetPryProyectos}
              setDatosProyecto={setDatosProyecto}
              handleOpenDialogGuardarProyecto={handleOpenDialogGuardarProyecto}
              idProyectoSelected={idProyectoSelected}
              setIdProyectoSelected={setIdProyectoSelected}
              setShowSection={setShowSection}
            />
          </Fragment>
        ) : showSection === 1 ? (
          <Actividades
            setLoading={setLoading}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idSubmenu={idSubmenu}
            idMenu={idMenu}
            idModulo={idModulo}
            idUsuario={idUsuario}
            permisosSubmenu={permisosSubmenu}
            idProyecto={idProyectoSelected}
            setIdProyecto={setIdProyectoSelected}
            setShowSection={setShowSection}
            executeGetPryProyectos={executeGetPryProyectos}
          />
        ) : null /* (
        <Planes
          setLoading={setLoading}
          correoUsuario={correoUsuario}
          passwordUsuario={passwordUsuario}
          rfcEmpresa={rfcEmpresa}
          idSubmenu={idSubmenu}
          permisosSubmenu={permisosSubmenu}
          idProyecto={idProyectoSelected}
          setIdProyecto={setIdProyectoSelected}
          setShowSection={setShowSection}
        />
      ) */
      }
      <Dialog
        onClose={handleCloseDialogAgentes}
        aria-labelledby="simple-dialog-title"
        open={openDialogAgentes}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="dialogAgentes">{`Agentes`}</DialogTitle>
        <DialogContent dividers>
          <AgentesPersonas
            setLoading={setLoading}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idSubmenu={idSubmenu}
            permisosSubmenu={permisosSubmenu}
            executeGetPryAgentesPersonasProyectos={executeGetPryAgentesPersonas}
            tipoEncargado={1}
            idProyecto={0}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogAgentes}
          >
            Salir
          </Button>
          {/* <Button
            variant="contained"
            color="primary"
            disabled={!enabledAgentePersona}
            onClick={() => {}}
          >
            Guardar
          </Button> */}
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogGuardarProyecto}
        aria-labelledby="simple-dialog-title"
        open={openDialogGuardarProyecto}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="proyectoDialog">{`Guardar Proyecto`}</DialogTitle>
        <DialogContent dividers>
          <GuardarProyecto
            setLoading={setLoading}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idSubmenu={idSubmenu}
            permisosSubmenu={permisosSubmenu}
            datosProyecto={datosProyecto}
            setDatosProyecto={setDatosProyecto}
            agentesPersonasData={agentesPersonasData}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogGuardarProyecto}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={permisosSubmenu < 2}
            onClick={handleGuardarProyecto}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function Proyectos(props) {
  const classes = useStyles();

  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const permisosSubmenu = props.permisosSubmenu;
  const idAgente = props.idAgente;
  const estatus = props.estatus;
  const busquedaProyecto = props.busquedaProyecto;
  const proyectosData = props.proyectosData;
  const proyectosLoading = props.proyectosLoading;
  const proyectosError = props.proyectosError;
  const executeGetPryProyectos = props.executeGetPryProyectos;
  const setDatosProyecto = props.setDatosProyecto;
  const handleOpenDialogGuardarProyecto = props.handleOpenDialogGuardarProyecto;
  const idProyectoSelected = props.idProyectoSelected;
  const setIdProyectoSelected = props.setIdProyectoSelected;
  const setShowSection = props.setShowSection;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCollapseTable, setOpenCollapseTable] = useState(0);

  const [fechaInicialProyecto, setFechaInicialProyecto] = useState("");
  const [fechaFinalProyecto, setFechaFinalProyecto] = useState("");
  const [porcentajeAvanceProyecto, setPorcentajeAvanceProyecto] = useState("");
  const [fechaUltimaAccionProyecto, setFechaUltimaAccionProyecto] =
    useState("");
  const [filtradoProyectos, setFiltradoProyectos] = useState([]);
  const [openDialogPersonas, setOpenDialogPersonas] = useState(false);

  const {
    /* agentesPersonasData,
    agentesPersonasLoading,
    agentesPersonasError, */
    executeGetPryAgentesPersonas,
  } = useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  const [
    {
      data: borrarPryProyectoData,
      loading: borrarPryProyectoLoading,
      error: borrarPryProyectoError,
    },
    executeBorrarPryProyecto,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryProyecto`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function getFilterRows(data) {
      let dataFilter = [];
      for (let x = 0; x < data.length; x++) {
        if (
          data[x].proyecto
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].responsable
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].codigo
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].fechaInicial
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          moment(data[x].fechaInicial)
            .format("DD/MM/YYYY")
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].fechaFinal
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          moment(data[x].fechaFinal)
            .format("DD/MM/YYYY")
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].fechaUltimaAccion
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          moment(data[x].fechaUltimaAccion)
            .format("DD/MM/YYYY")
            .indexOf(busquedaProyecto.toLowerCase()) !== -1 ||
          data[x].porcentajeAvance
            .toString()
            .toLowerCase()
            .indexOf(busquedaProyecto.toLowerCase()) !== -1
        ) {
          dataFilter.push(data[x]);
        }
      }
      return dataFilter;
    }

    let proyectos = [];
    proyectos =
      idAgente !== 0
        ? proyectosData.filter(
            (proyecto) => proyecto.idResponsable === idAgente
          )
        : proyectosData;

    proyectos =
      estatus !== 0
        ? proyectos.filter((proyecto) => proyecto.estatus === estatus)
        : proyectos;

    proyectos =
      busquedaProyecto.trim() !== "" ? getFilterRows(proyectos) : proyectos;
    setFiltradoProyectos(proyectos);
  }, [idAgente, estatus, busquedaProyecto, proyectosData]);

  useEffect(() => {
    function checkData() {
      if (borrarPryProyectoData) {
        if (borrarPryProyectoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryProyectoData.error),
            "warning"
          );
        } else {
          executeGetPryProyectos();
        }
      }
    }

    checkData();
  }, [borrarPryProyectoData, executeGetPryProyectos]);

  if (proyectosLoading || borrarPryProyectoLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (proyectosError || borrarPryProyectoError) {
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

  const handleOpenDialogPersonas = () => {
    setOpenDialogPersonas(true);
  };

  const handleCloseDialogPersonas = () => {
    setOpenDialogPersonas(false);
    setIdProyectoSelected(0);
  };

  return (
    <Grid container justify="center" spacing={3}>
      <div style={{ display: "none" }}>
        <Grid item xs={12} sm={6} lg={3}>
          <strong>Fecha Inicial: </strong>{" "}
          {fechaInicialProyecto !== "" ? fechaInicialProyecto : "---"}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <strong>Fecha Final: </strong>{" "}
          {fechaFinalProyecto !== "" ? fechaFinalProyecto : "---"}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <strong>% Avance: </strong>{" "}
          {porcentajeAvanceProyecto !== ""
            ? `${porcentajeAvanceProyecto}%`
            : "---"}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <strong>Fecha Última Acción: </strong>
          {fechaUltimaAccionProyecto !== "" ? fechaUltimaAccionProyecto : "---"}
        </Grid>
      </div>
      <Grid item xs={12}>
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
                headCellTable={headCellsProyectos}
                actions={true}
              />
              <TableBody>
                {filtradoProyectos.length > 0 ? (
                  stableSort(filtradoProyectos, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((proyecto, index) => {
                      return (
                        <Fragment key={index}>
                          <TableRow
                            hover
                            style={{ cursor: "pointer" }}
                            role="checkbox"
                            tabIndex={-1}
                            onClick={() => {
                              setFechaInicialProyecto(proyecto.fechaInicial);
                              setFechaFinalProyecto(proyecto.fechaFinal);
                              setPorcentajeAvanceProyecto(
                                proyecto.porcentajeAvance
                              );
                              setFechaUltimaAccionProyecto(
                                proyecto.fechaUltimaAccion
                              );
                            }}
                          >
                            <TableCell>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() =>
                                  setOpenCollapseTable(
                                    proyecto.idProyecto === openCollapseTable
                                      ? 0
                                      : proyecto.idProyecto
                                  )
                                }
                              >
                                {proyecto.idProyecto === openCollapseTable ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              {proyecto.proyecto}
                            </TableCell>
                            <TableCell align="right">
                              {proyecto.responsable}
                            </TableCell>
                            <TableCell align="right">
                              {proyecto.clas1 !== null ? proyecto.clas1 : "---"}
                            </TableCell>
                            <TableCell align="right">
                              {proyecto.clas2 !== null ? proyecto.clas2 : "---"}
                            </TableCell>
                            <TableCell align="right">
                              {proyecto.clas3 !== null ? proyecto.clas3 : "---"}
                            </TableCell>
                            <TableCell align="right">
                              {proyecto.clas4 !== null ? proyecto.clas4 : "---"}
                            </TableCell>
                            <TableCell align="right">
                              {/* <Tooltip title="Ver Planes">
                                <IconButton
                                  onClick={() => {
                                    setIdProyectoSelected(proyecto.idProyecto);
                                    setShowSection(2);
                                  }}
                                >
                                  <PermContactCalendarIcon color="primary" />
                                </IconButton>
                              </Tooltip> */}
                              <Tooltip title="Ver Actividades">
                                <IconButton
                                  onClick={() => {
                                    setIdProyectoSelected(proyecto.idProyecto);
                                    setShowSection(1);
                                  }}
                                >
                                  <FindInPageIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reporte">
                                <Link to={`/reportesProyectos/${proyecto.idProyecto}`} target="_blank">
                                  <IconButton>
                                    <PictureAsPdfIcon color="primary" />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                              <Tooltip title="Personas">
                                <IconButton
                                  onClick={() => {
                                    setIdProyectoSelected(proyecto.idProyecto);
                                    handleOpenDialogPersonas();
                                  }}
                                >
                                  <GroupAddIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="Editar"
                                disabled={permisosSubmenu < 2}
                              >
                                <span>
                                  <IconButton
                                    disabled={permisosSubmenu < 2}
                                    onClick={() => {
                                      setDatosProyecto({
                                        idProyecto: proyecto.idProyecto,
                                        codigo: proyecto.codigo,
                                        proyecto: proyecto.proyecto,
                                        clas1: proyecto.clas1
                                          ? proyecto.clas1
                                          : 0,
                                        clas2: proyecto.clas2
                                          ? proyecto.clas2
                                          : 0,
                                        clas3: proyecto.clas3
                                          ? proyecto.clas3
                                          : 0,
                                        clas4: proyecto.clas4
                                          ? proyecto.clas4
                                          : 0,
                                        responsable: proyecto.idResponsable,
                                        estatus: proyecto.estatus,
                                        fechaInicial: proyecto.fechaInicial,
                                        fechaFinal: proyecto.fechaFinal,
                                        porcientoAvance:
                                          proyecto.porcentajeAvance,
                                        fechaUltimaAccion:
                                          proyecto.fechaUltimaAccion,
                                      });
                                      handleOpenDialogGuardarProyecto();
                                    }}
                                  >
                                    <EditIcon
                                      style={{
                                        color:
                                          permisosSubmenu > 2
                                            ? "#ffc107"
                                            : "gray",
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
                                        text: `¿Está seguro de eliminar este proyecto?`,
                                        buttons: ["No", "Sí"],
                                        dangerMode: true,
                                      }).then((value) => {
                                        if (value) {
                                          executeBorrarPryProyecto({
                                            data: {
                                              usuario: correoUsuario,
                                              pwd: passwordUsuario,
                                              rfc: rfcEmpresa,
                                              idsubmenu: idSubmenu,
                                              idProyecto: proyecto.idProyecto,
                                            },
                                          });
                                        }
                                      });
                                    }}
                                  >
                                    <CloseIcon
                                      color={
                                        permisosSubmenu === 3
                                          ? "secondary"
                                          : "disabled"
                                      }
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={9}
                            >
                              <Collapse
                                in={openCollapseTable === proyecto.idProyecto}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box margin={1}>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                  >
                                    Detalles de Proyecto
                                  </Typography>
                                  <Table size="small" aria-label="purchases">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          Número Actividades
                                        </TableCell>
                                        <TableCell>Número Acciones</TableCell>
                                        <TableCell align="right">
                                          Número Documentos
                                        </TableCell>
                                        <TableCell align="right">
                                          Número Planes
                                        </TableCell>
                                        <TableCell align="right">
                                          Avance
                                        </TableCell>
                                        <TableCell align="right">
                                          Estatus
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell component="th" scope="row">
                                          {proyecto.numActividades}
                                        </TableCell>
                                        <TableCell>
                                          {proyecto.numAcciones}
                                        </TableCell>
                                        <TableCell align="right">
                                          {proyecto.numDocumentos}
                                        </TableCell>
                                        <TableCell align="right">
                                          {proyecto.numPlanes}
                                        </TableCell>
                                        <TableCell align="right">
                                          {proyecto.porcentajeAvance}%
                                        </TableCell>
                                        <TableCell align="right">
                                          {proyecto.nombreEstatus}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="subtitle1">
                        <ErrorIcon
                          style={{ color: "red", verticalAlign: "sub" }}
                        />
                        No hay proyectos
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
            count={filtradoProyectos.length}
            rowsPerPage={rowsPerPage}
            page={filtradoProyectos.length > 0 ? page : 0}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Dialog
        onClose={handleCloseDialogPersonas}
        aria-labelledby="simple-dialog-title"
        open={openDialogPersonas}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="dialogPersonas">{`Personas`}</DialogTitle>
        <DialogContent dividers>
          <AgentesPersonas
            setLoading={setLoading}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idSubmenu={idSubmenu}
            permisosSubmenu={permisosSubmenu}
            executeGetPryAgentesPersonasProyectos={executeGetPryAgentesPersonas}
            tipoEncargado={2}
            idProyecto={idProyectoSelected}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogPersonas}
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function AgentesPersonas(props) {
  const classes = useStyles();

  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const permisosSubmenu = props.permisosSubmenu;
  const executeGetPryAgentesPersonasProyectos =
    props.executeGetPryAgentesPersonasProyectos;
  const tipoEncargado = props.tipoEncargado;
  const idProyecto = props.idProyecto;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [enabledAgentePersona, setEnableAgentePersona] = useState(false);
  const [idAgentePersona, setIdAgentePersona] = useState(0);
  const [nombreAgentePersona, setNombreAgentePersona] = useState("");
  /* const [tipoAgentePersona, setTipoAgentePersona] = useState(0); */

  const {
    agentesPersonasData,
    agentesPersonasLoading,
    agentesPersonasError,
    executeGetPryAgentesPersonas,
  } = useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  const [
    {
      data: guardarPryAgentePersonaData,
      loading: guardarPryAgentePersonaLoading,
      error: guardarPryAgentePersonaError,
    },
    executeGuardarPryAgentePersona,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryAgentePersona`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: cambiarEstatusPryAgentePersonaData,
      loading: cambiarEstatusPryAgentePersonaLoading,
      error: cambiarEstatusPryAgentePersonaError,
    },
    executeCambiarEstatusPryAgentePersona,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarEstatusPryAgentePersona`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: borrarPryAgentePersonaData,
      loading: borrarPryAgentePersonaLoading,
      error: borrarPryAgentePersonaError,
    },
    executeBorrarPryAgentePersona,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryAgentePersona`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (guardarPryAgentePersonaData) {
        if (guardarPryAgentePersonaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryAgentePersonaData.error),
            "warning"
          );
        } else {
          executeGetPryAgentesPersonas();
          executeGetPryAgentesPersonasProyectos();
          setIdAgentePersona(0);
          setNombreAgentePersona("");
          /* setTipoAgentePersona(0); */
          setEnableAgentePersona(false);
        }
      }
    }

    checkData();
  }, [
    guardarPryAgentePersonaData,
    executeGetPryAgentesPersonas,
    executeGetPryAgentesPersonasProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (cambiarEstatusPryAgentePersonaData) {
        if (cambiarEstatusPryAgentePersonaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarEstatusPryAgentePersonaData.error),
            "warning"
          );
        } else {
          executeGetPryAgentesPersonas();
          executeGetPryAgentesPersonasProyectos();
        }
      }
    }

    checkData();
  }, [
    cambiarEstatusPryAgentePersonaData,
    executeGetPryAgentesPersonas,
    executeGetPryAgentesPersonasProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (borrarPryAgentePersonaData) {
        if (borrarPryAgentePersonaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryAgentePersonaData.error),
            "warning"
          );
        } else {
          executeGetPryAgentesPersonas();
          executeGetPryAgentesPersonasProyectos();
        }
      }
    }

    checkData();
  }, [
    borrarPryAgentePersonaData,
    executeGetPryAgentesPersonas,
    executeGetPryAgentesPersonasProyectos,
  ]);

  if (
    agentesPersonasLoading ||
    guardarPryAgentePersonaLoading ||
    cambiarEstatusPryAgentePersonaLoading ||
    borrarPryAgentePersonaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    agentesPersonasError ||
    guardarPryAgentePersonaError ||
    cambiarEstatusPryAgentePersonaError ||
    borrarPryAgentePersonaError
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

  const handleEnabledAgentePersona = () => {
    if (enabledAgentePersona) {
      setIdAgentePersona(0);
      setNombreAgentePersona("");
      /* setTipoAgentePersona(0); */
    }
    setEnableAgentePersona(!enabledAgentePersona);
  };

  const handleInputChangeNombreAgentePersona = (event) => {
    setNombreAgentePersona(event.target.value);
  };

  /* const handleInputChangeTipoAgentePersona = (event) => {
    setTipoAgentePersona(parseInt(event.target.value));
  }; */

  const handleGuardarAgentePersona = () => {
    if (nombreAgentePersona.trim() === "") {
      swal("Error", "Ingrese un nombre", "warning");
    } /* else if (tipoAgentePersona === 0) {
      swal("Error", "Seleccione un tipo", "warning");
    }  */ else {
      executeGuardarPryAgentePersona({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idAgentePersona: idAgentePersona,
          Agente: nombreAgentePersona.trim(),
          Estatus: 1,
          tipo: tipoEncargado,
          idProyecto: idProyecto,
          accion: idAgentePersona === 0 ? 1 : 2,
        },
      });
    }
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid
        item
        xs={12}
        md={4}
        style={{ alignSelf: "center", textAlign: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={!enabledAgentePersona || permisosSubmenu < 2}
          onClick={handleGuardarAgentePersona}
        >
          Guardar
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        style={{ alignSelf: "center", textAlign: "center" }}
      >
        <Button
          variant="contained"
          color="default"
          disabled={enabledAgentePersona || permisosSubmenu < 2}
          onClick={handleEnabledAgentePersona}
        >
          Nuevo
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        style={{ alignSelf: "center", textAlign: "center" }}
      >
        <Button
          variant="contained"
          color="secondary"
          disabled={!enabledAgentePersona}
          onClick={handleEnabledAgentePersona}
        >
          Cancelar
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} /* md={4} */>
        <TextField
          className={classes.textFields}
          label="Nombre"
          type="text"
          margin="normal"
          disabled={!enabledAgentePersona}
          value={nombreAgentePersona}
          inputProps={{
            maxLength: 100,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 1);
          }}
          onChange={handleInputChangeNombreAgentePersona}
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          select
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          label="Tipo"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          disabled={!enabledAgentePersona}
          value={tipoAgentePersona}
          onChange={handleInputChangeTipoAgentePersona}
        >
          <option value={0}>Elija un tipo</option>
          <option value={1}>Agente</option>
          <option value={2}>Persona</option>
        </TextField>
      </Grid> */}
      <Grid item xs={12}>
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
                headCellTable={headCellsAgentesPersonas}
                actions={true}
              />
              <TableBody>
                {agentesPersonasData.length > 0 ? (
                  stableSort(agentesPersonasData, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .filter(
                      (agentePersona) =>
                        (agentePersona.tipo === 2 &&
                          agentePersona.idProyecto === idProyecto) ||
                        (agentePersona.tipo === 1 && idProyecto === 0)
                    )
                    .map((agentePersona, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell />
                          <TableCell component="th" scope="row" padding="none">
                            {agentePersona.agente}
                          </TableCell>
                          <TableCell align="right">
                            {agentePersona.estatus === 1
                              ? "Activo"
                              : "Inactivo"}
                          </TableCell>
                          {/* <TableCell align="right">
                            {agentePersona.tipo === 1 ? "Agente" : "Persona"}
                          </TableCell> */}
                          <TableCell align="right">
                            <Tooltip
                              title="Editar"
                              disabled={
                                permisosSubmenu < 2 || enabledAgentePersona
                              }
                            >
                              <span>
                                <IconButton
                                  disabled={
                                    permisosSubmenu < 2 || enabledAgentePersona
                                  }
                                  onClick={() => {
                                    setIdAgentePersona(
                                      agentePersona.idAgentePersona
                                    );
                                    setNombreAgentePersona(
                                      agentePersona.agente
                                    );
                                    /* setTipoAgentePersona(agentePersona.tipo); */
                                    setEnableAgentePersona(true);
                                  }}
                                >
                                  <EditIcon
                                    style={{
                                      color:
                                        permisosSubmenu < 2 ||
                                        enabledAgentePersona
                                          ? "gray"
                                          : "black",
                                    }}
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                agentePersona.estatus === 1
                                  ? "Deshabilitar"
                                  : "Habilitar"
                              }
                              disabled={
                                permisosSubmenu < 2 || enabledAgentePersona
                              }
                            >
                              <span>
                                <IconButton
                                  disabled={
                                    permisosSubmenu < 2 || enabledAgentePersona
                                  }
                                  onClick={() => {
                                    swal({
                                      text: `¿Está seguro de ${
                                        agentePersona.estatus === 1
                                          ? "deshabilitar"
                                          : "habilitar"
                                      } ${
                                        agentePersona.tipo === 1
                                          ? "este agente"
                                          : "esta persona"
                                      }?`,
                                      buttons: ["No", "Sí"],
                                      dangerMode: true,
                                    }).then((value) => {
                                      if (value) {
                                        executeCambiarEstatusPryAgentePersona({
                                          data: {
                                            usuario: correoUsuario,
                                            pwd: passwordUsuario,
                                            rfc: rfcEmpresa,
                                            idsubmenu: idSubmenu,
                                            idAgentePersona:
                                              agentePersona.idAgentePersona,
                                            Estatus:
                                              agentePersona.estatus === 1
                                                ? 0
                                                : 1,
                                          },
                                        });
                                      }
                                    });
                                  }}
                                >
                                  {agentePersona.estatus === 1 ? (
                                    <ArrowDownwardIcon
                                      color={
                                        permisosSubmenu < 2 ||
                                        enabledAgentePersona
                                          ? "disabled"
                                          : "error"
                                      }
                                    />
                                  ) : (
                                    <ArrowUpwardIcon
                                      style={{
                                        color:
                                          permisosSubmenu < 2 ||
                                          enabledAgentePersona
                                            ? "disabled"
                                            : "#4caf50",
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title="Eliminar"
                              disabled={
                                permisosSubmenu < 3 || enabledAgentePersona
                              }
                            >
                              <span>
                                <IconButton
                                  disabled={
                                    permisosSubmenu < 3 || enabledAgentePersona
                                  }
                                  onClick={() => {
                                    swal({
                                      text: `¿Está seguro de eliminar ${
                                        agentePersona.tipo === 1
                                          ? "este agente"
                                          : "esta persona"
                                      }?`,
                                      buttons: ["No", "Sí"],
                                      dangerMode: true,
                                    }).then((value) => {
                                      if (value) {
                                        executeBorrarPryAgentePersona({
                                          data: {
                                            usuario: correoUsuario,
                                            pwd: passwordUsuario,
                                            rfc: rfcEmpresa,
                                            idsubmenu: idSubmenu,
                                            idAgentePersona:
                                              agentePersona.idAgentePersona,
                                          },
                                        });
                                      }
                                    });
                                  }}
                                >
                                  <CloseIcon
                                    color={
                                      permisosSubmenu < 3 ||
                                      enabledAgentePersona
                                        ? "disabled"
                                        : "secondary"
                                    }
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1">
                        <ErrorIcon
                          style={{ color: "red", verticalAlign: "sub" }}
                        />
                        No hay agentes
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
            count={agentesPersonasData.length}
            rowsPerPage={rowsPerPage}
            page={agentesPersonasData.length > 0 ? page : 0}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

function GuardarProyecto(props) {
  const classes = useStyles();
  const datosProyecto = props.datosProyecto;
  const setDatosProyecto = props.setDatosProyecto;
  const agentesPersonasData = props.agentesPersonasData;

  const handleInputsGuardarProyectoChange = (e) => {
    if (e.target.id !== "fechaInicial" && e.target.id !== "fechaFinal") {
      pasteValidation(
        e,
        e.target.id === "codigo" ? 5 : e.target.id === "proyecto" ? 3 : 2
      );
    }
    setDatosProyecto({
      ...datosProyecto,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Paper elevation={3} style={{ margin: 10, padding: 10 }}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            className={classes.textFields}
            id="codigo"
            label="Código"
            type="text"
            margin="normal"
            value={datosProyecto.codigo}
            inputProps={{
              maxLength: 20,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 5);
            }}
            onChange={handleInputsGuardarProyectoChange}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            className={classes.textFields}
            id="proyecto"
            label="Proyecto"
            type="text"
            margin="normal"
            value={datosProyecto.proyecto}
            inputProps={{
              maxLength: 100,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={handleInputsGuardarProyectoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="clas1"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Clas 1"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.clas1}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija una clasificación 1</option>
            <option value={1}>Clasificación 1</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="clas2"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Clas 2"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.clas2}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija una clasificación 2</option>
            <option value={1}>Clasificación 2</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="clas3"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Clas 3"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.clas3}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija una clasificación 3</option>
            <option value={1}>Clasificación 3</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="clas4"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Clas 4"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.clas4}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija una clasificación 4</option>
            <option value={1}>Clasificación 4</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="responsable"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Responsable"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.responsable}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija un responsable</option>
            {agentesPersonasData
              .filter(
                (agentePersona) =>
                  agentePersona.estatus === 1 && agentePersona.tipo === 1
              )
              .map((agente, index) => (
                <option key={index} value={agente.idAgentePersona}>
                  {agente.agente}
                </option>
              ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="estatus"
            select
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            label="Estatus"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={datosProyecto.estatus}
            onChange={handleInputsGuardarProyectoChange}
          >
            <option value={0}>Elija un estatus</option>
            <option value={1}>Pendiente</option>
            <option value={2}>En proceso</option>
            <option value={3}>Terminado</option>
            <option value={4}>Cerrado</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={datosProyecto.idProyecto === 0 ? 4 : 3}>
          <TextField
            className={classes.textFields}
            id="fechaInicial"
            label="Fecha Inicial Plan"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            type="date"
            value={datosProyecto.fechaInicial}
            onChange={handleInputsGuardarProyectoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={datosProyecto.idProyecto === 0 ? 4 : 3}>
          <TextField
            className={classes.textFields}
            id="fechaFinal"
            label="Fecha Final Plan"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            type="date"
            value={datosProyecto.fechaFinal}
            onChange={handleInputsGuardarProyectoChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={datosProyecto.idProyecto === 0 ? 4 : 3}>
          <TextField
            className={classes.textFields}
            id="porcientoAvance"
            label="% Avance"
            type="text"
            margin="normal"
            value={datosProyecto.porcientoAvance}
            inputProps={{
              maxLength: 3,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 2);
            }}
            onChange={handleInputsGuardarProyectoChange}
          />
        </Grid>
        {datosProyecto.idProyecto !== 0 ? (
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              className={classes.textFields}
              id="fechaUltimaAccion"
              label="Fecha última Acción"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              type="date"
              value={datosProyecto.fechaUltimaAccion}
              onChange={handleInputsGuardarProyectoChange}
            />
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
}

/* function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    "&:hover > $content": {
      backgroundColor: "#c0c0ff",
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: "#c0c0ff",
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label":
      {
        backgroundColor: "transparent",
      },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
    color: "#000000",
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    labelText,
    labelInfo,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
}; 

const useStylesActividades = makeStyles({
  root: {
    height: "100%",
    flexGrow: 1,
  },
}); */

function Actividades(props) {
  /* const classes = useStylesActividades(); */
  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const idMenu = props.idMenu;
  const idModulo = props.idModulo;
  const idUsuario = props.idUsuario;
  const permisosSubmenu = props.permisosSubmenu;
  const idProyecto = props.idProyecto;
  const setIdProyecto = props.setIdProyecto;
  const setShowSection = props.setShowSection;
  const executeGetPryProyectos = props.executeGetPryProyectos;

  /* const [actividadesInfo, setActividadesInfo] = useState([]); */
  const [idProyectoSelected, setIdProyectoSelected] = useState(0);
  const [proyectoTitulo, setProyectoTitulo] = useState("");
  const [idActividadSelected, setIdActividadSelected] = useState(0);
  const [actividadTitulo, setActividadTitulo] = useState("");
  const [idAccionSelected, setIdAccionSelected] = useState(0);
  const [infoDocumentosSelected, setInfoDocumentosSelected] = useState({
    ids: [],
    rutas: [],
    links: [],
  });
  const [accionTitulo, setAccionTitulo] = useState("");
  const [idPlanSelected, setIdPlanSelected] = useState(0);
  const [planTitulo, setPlanTitulo] = useState("");
  const [agentesPersonasSelected, setAgentesPersonasSelected] = useState([]);
  const [accionesSelected, setAccionesSelected] = useState([]);
  const [documentosSelected, setDocumentosSelected] = useState([]);
  const [infoAcciones, setInfoAcciones] = useState({
    nombre: "",
    fecha: moment().format("YYYY-MM-DD"),
    porcientoAvance: "",
    estatus: 0,
    idActividad: 0,
    agentesPersonas: [],
  });
  const [idAccionEditar, setIdAccionEditar] = useState(0);
  const [
    openDialogAgentesPersonasAvances,
    setOpenDialogAgentesPersonasAvances,
  ] = useState(false);
  const [newPersonasSelected, setNewPersonasSelected] = useState([]);
  const [openDialogGuardarActividad, setOpenDialogGuardarActividad] =
    useState(false);
  const [infoActividad, setInfoActividad] = useState({
    id: 0,
    idProyecto: 0,
    pos: "",
    nivel: "",
    actividad: "",
    fechaInicial: moment().format("YYYY-MM-DD"),
    fechaFin: "",
    idAgente: "",
    avance: 0,
    estatus: 0,
    fechaUltimaAccion: "",
  });
  const [agentesPersonasFilter, setAgentesPersonasFilter] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [acciones, setAcciones] = useState([]);
  const [idDocumentoSelected, setIdDocumentoSelected] = useState(0);
  const [idActividadDocumentoSelected, setIdActividadDocumentoSelected] =
    useState(0);
  const [idAccionDocumentoSelected, setIdAccionDocumentoSelected] = useState(0);
  const [planes, setPlanes] = useState([]);
  const [infoPlan, setInfoPlan] = useState({
    id: 0,
    nombre: "",
    fechaInicio: moment().format("YYYY-MM-DD"),
    fechaFin: "",
    idAgente: 0,
    idActividad: 0,
  });
  const [treeData, setTreeData] = useState([]);
  const [vista, setVista] = useState(1);

  const [
    {
      data: getPryProyActividadesInfoData,
      loading: getPryProyActividadesLoading,
      error: getPryProyActividadesError,
    },
    executeGetPryProyActividades,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyActividadesInfo`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        IdProyecto: idProyecto,
        reportes: 0,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: guardarPryProyAccionData,
      loading: guardarPryProyAccionLoading,
      error: guardarPryProyAccionError,
    },
    executeGuardarPryProyAccion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyAccion`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: borrarPryProyAccionData,
      loading: borrarPryProyAccionLoading,
      error: borrarPryProyAccionError,
    },
    executeBorrarPryProyAccion,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryProyAccion`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarPryProyDocumentoData,
      loading: guardarPryProyDocumentoLoading,
      error: guardarPryProyDocumentoError,
    },
    executeGuardarPryProyDocumento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyDocumento`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: borrarPryProyDocumentoData,
      loading: borrarPryProyDocumentoLoading,
      error: borrarPryProyDocumentoError,
    },
    executeBorrarPryProyDocumento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryProyDocumento`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarPryProyPersonasData,
      loading: guardarPryProyPersonasLoading,
      error: guardarPryProyPersonasError,
    },
    executeGuardarPryProyPersonas,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyPersonas`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarPryProyActividadData,
      loading: guardarPryProyActividadLoading,
      error: guardarPryProyActividadError,
    },
    executeGuardarPryProyActividad,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyActividad`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: modificarInfoPryProyActividadData,
      loading: modificarInfoPryProyActividadLoading,
      error: modificarInfoPryProyActividadError,
    },
    executeModificarInfoPryProyActividad,
  ] = useAxios(
    {
      url: API_BASE_URL + `/modificarInfoPryProyActividad`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: modificarActividadAccionPryProyDocumentoData,
      loading: modificarActividadAccionPryProyDocumentoLoading,
      error: modificarActividadAccionPryProyDocumentoError,
    },
    executeModificarActividadAccionPryProyDocumento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/modificarActividadAccionPryProyDocumento`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: descargarDocumentosPryProyDocumentoData,
      loading: descargarDocumentosPryProyDocumentoLoading,
      error: descargarDocumentosPryProyDocumentoError,
    },
    executeDescargarDocumentosPryProyDocumento,
  ] = useAxios(
    {
      url: API_BASE_URL + `/descargarDocumentosPryProyDocumento`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: borrarPryProyActividadData,
      loading: borrarPryProyActividadLoading,
      error: borrarPryProyActividadError,
    },
    executeBorrarPryProyActividad,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryProyActividad`,
      method: "DELETE",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyActividadesInfoData) {
        if (getPryProyActividadesInfoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getPryProyActividadesInfoData.error),
            "warning"
          );
        } else {
          setIdProyectoSelected(
            getPryProyActividadesInfoData.actividadesInfo[0].id
          );
          setProyectoTitulo(
            getPryProyActividadesInfoData.actividadesInfo[0].Proyecto
          );
          /* setActividadesInfo(getPryProyActividadesInfoData.actividadesInfo); */
          setActividades(
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades
          );
          setAcciones(
            getPryProyActividadesInfoData.actividadesInfo[0].Acciones
          );
          setPlanes(getPryProyActividadesInfoData.actividadesInfo[0].Planes);
          setAgentesPersonasSelected(
            getPryProyActividadesInfoData.actividadesInfo[0].AgentesPersonas
          );
          setAccionesSelected(
            getPryProyActividadesInfoData.actividadesInfo[0].Acciones
          );
          setDocumentosSelected(
            getPryProyActividadesInfoData.actividadesInfo[0].Documentos
          );

          for (
            let x = 0;
            x <
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades.length;
            x++
          ) {
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades[
              x
            ].key =
              getPryProyActividadesInfoData.actividadesInfo[0].Actividades[
                x
              ].id;
            const numAcciones =
              getPryProyActividadesInfoData.actividadesInfo[0].Acciones.filter(
                (accion) =>
                  accion.idactividad ===
                  getPryProyActividadesInfoData.actividadesInfo[0].Actividades[
                    x
                  ].id
              ).length;
            const textoNumAcciones = numAcciones !== 1 ? "acciones" : "acción";
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades[
              x
            ].label = `Ps. ${getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x].Pos} Nv. ${getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x].Nivel} ${getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x].Actividad} (${getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x].Avance}% completada, ${numAcciones} ${textoNumAcciones})`;
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades[
              x
            ].nodes = [];
          }

          let nivelMaximo = 0;
          for (
            let x = 0;
            x <
            getPryProyActividadesInfoData.actividadesInfo[0].Actividades.length;
            x++
          ) {
            /* console.log(getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x]); */
            if (
              getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x]
                .Nivel > nivelMaximo
            ) {
              nivelMaximo =
                getPryProyActividadesInfoData.actividadesInfo[0].Actividades[x]
                  .Nivel;
            }
          }
          /* console.log("nivel maximo:",nivelMaximo); */
          let actividadesPorNivel = [];
          for (let x = 0; x <= nivelMaximo; x++) {
            actividadesPorNivel.push(
              getPryProyActividadesInfoData.actividadesInfo[0].Actividades.filter(
                (actividad) => actividad.Nivel === x
              )
            );
          }
          /* console.log(actividadesPorNivel); */
          let diferenciaPos = 10000;
          let posMasCerca = 0;
          for (let x = 1; x <= nivelMaximo; x++) {
            for (let y = 0; y < actividadesPorNivel[x].length; y++) {
              diferenciaPos = 10000;
              posMasCerca = 0;
              for (let z = 0; z < actividadesPorNivel[x - 1].length; z++) {
                if (
                  actividadesPorNivel[x][y].Pos -
                    actividadesPorNivel[x - 1][z].Pos <
                    diferenciaPos &&
                  actividadesPorNivel[x][y].Pos -
                    actividadesPorNivel[x - 1][z].Pos >
                    0
                ) {
                  diferenciaPos =
                    actividadesPorNivel[x][y].Pos -
                    actividadesPorNivel[x - 1][z].Pos;
                  posMasCerca = z;
                }
              }
              actividadesPorNivel[x - 1][posMasCerca].nodes.push(
                actividadesPorNivel[x][y]
              );
            }
          }
          /* console.log(actividadesPorNivel[0]); */
          setTreeData(actividadesPorNivel[0]);
        }
      }
    }

    checkData();
  }, [getPryProyActividadesInfoData]);

  useEffect(() => {
    function checkData() {
      if (guardarPryProyAccionData) {
        if (guardarPryProyAccionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyAccionData.error),
            "warning"
          );
        } else {
          if (guardarPryProyAccionData.nuevaAccion) {
            setIdActividadSelected(
              guardarPryProyAccionData.nuevaAccion[0].idactividad
            );
            setActividadTitulo(
              guardarPryProyAccionData.nuevaAccion[0].Actividad
            );
            setIdAccionSelected(guardarPryProyAccionData.nuevaAccion[0].id);
            setAccionTitulo(guardarPryProyAccionData.nuevaAccion[0].nombre);
          }
          setIdAccionEditar(0);
          setIdAccionSelected(0);
          setInfoAcciones({
            nombre: "",
            fecha: moment().format("YYYY-MM-DD"),
            porcientoAvance: "",
            estatus: 0,
            idActividad: 0,
            agentesPersonas: [],
          });
          executeGetPryProyActividades();
          executeGetPryProyectos();
        }
      }
    }

    checkData();
  }, [
    guardarPryProyAccionData,
    executeGetPryProyActividades,
    executeGetPryProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (borrarPryProyAccionData) {
        if (borrarPryProyAccionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryProyAccionData.error),
            "warning"
          );
        } else {
          setIdAccionSelected(0);
          setAccionTitulo("");
          setIdAccionEditar(0);
          setInfoAcciones({
            nombre: "",
            fecha: moment().format("YYYY-MM-DD"),
            porcientoAvance: "",
            estatus: 0,
            idActividad: 0,
            agentesPersonas: [],
          });
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [borrarPryProyAccionData, executeGetPryProyActividades]);

  useEffect(() => {
    function checkData() {
      if (guardarPryProyDocumentoData) {
        if (guardarPryProyDocumentoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyDocumentoData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
          executeGetPryProyectos();
        }
      }
    }

    checkData();
  }, [
    guardarPryProyDocumentoData,
    executeGetPryProyActividades,
    executeGetPryProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (borrarPryProyDocumentoData) {
        if (borrarPryProyDocumentoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryProyDocumentoData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [borrarPryProyDocumentoData, executeGetPryProyActividades]);

  useEffect(() => {
    function checkData() {
      if (guardarPryProyPersonasData) {
        if (guardarPryProyPersonasData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyPersonasData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [guardarPryProyPersonasData, executeGetPryProyActividades]);

  useEffect(() => {
    function checkData() {
      if (guardarPryProyActividadData) {
        if (guardarPryProyActividadData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyActividadData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
          executeGetPryProyectos();
          setOpenDialogGuardarActividad(false);
          setInfoActividad({
            id: 0,
            idProyecto: 0,
            pos: "",
            nivel: "",
            actividad: "",
            fechaInicial: moment().format("YYYY-MM-DD"),
            fechaFin: "",
            idAgente: "",
            avance: 0,
            estatus: 0,
            fechaUltimaAccion: "",
          });
        }
      }
    }

    checkData();
  }, [
    guardarPryProyActividadData,
    executeGetPryProyActividades,
    executeGetPryProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (modificarInfoPryProyActividadData) {
        if (modificarInfoPryProyActividadData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(modificarInfoPryProyActividadData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [modificarInfoPryProyActividadData, executeGetPryProyActividades]);

  useEffect(() => {
    function checkData() {
      if (modificarActividadAccionPryProyDocumentoData) {
        if (modificarActividadAccionPryProyDocumentoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(modificarActividadAccionPryProyDocumentoData.error),
            "warning"
          );
        } else {
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [
    modificarActividadAccionPryProyDocumentoData,
    executeGetPryProyActividades,
  ]);

  useEffect(() => {
    function checkData() {
      if (descargarDocumentosPryProyDocumentoData) {
        if (descargarDocumentosPryProyDocumentoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(descargarDocumentosPryProyDocumentoData.error),
            "warning"
          );
        } else {
          if (descargarDocumentosPryProyDocumentoData.link !== "") {
            var link = document.createElement("a");
            link.setAttribute(
              "href",
              descargarDocumentosPryProyDocumentoData.link + "/download"
            );
            link.setAttribute("download", true);
            link.click();
          } else {
            swal("Error", "No se pudierón descargar los documentos", "warning");
          }
        }
      }
    }

    checkData();
  }, [descargarDocumentosPryProyDocumentoData]);

  useEffect(() => {
    function checkData() {
      if (borrarPryProyActividadData) {
        if (borrarPryProyActividadData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryProyActividadData.error),
            "warning"
          );
        } else {
          swal("Actividad Borrada", "Actividad borrada con éxito", "success");
          executeGetPryProyActividades();
          setOpenDialogGuardarActividad(false);
          setInfoActividad({
            id: 0,
            idProyecto: 0,
            pos: "",
            nivel: "",
            actividad: "",
            fechaInicial: moment().format("YYYY-MM-DD"),
            fechaFin: "",
            idAgente: "",
            avance: 0,
            estatus: 0,
            fechaUltimaAccion: "",
          });
        }
      }
    }

    checkData();
  }, [borrarPryProyActividadData, executeGetPryProyActividades]);

  if (
    getPryProyActividadesLoading ||
    guardarPryProyAccionLoading ||
    borrarPryProyAccionLoading ||
    guardarPryProyDocumentoLoading ||
    borrarPryProyDocumentoLoading ||
    guardarPryProyPersonasLoading ||
    guardarPryProyActividadLoading ||
    modificarInfoPryProyActividadLoading ||
    modificarActividadAccionPryProyDocumentoLoading ||
    descargarDocumentosPryProyDocumentoLoading ||
    borrarPryProyActividadLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getPryProyActividadesError ||
    guardarPryProyAccionError ||
    borrarPryProyAccionError ||
    guardarPryProyDocumentoError ||
    borrarPryProyDocumentoError ||
    guardarPryProyPersonasError ||
    guardarPryProyActividadError ||
    modificarInfoPryProyActividadError ||
    modificarActividadAccionPryProyDocumentoError ||
    descargarDocumentosPryProyDocumentoError ||
    borrarPryProyActividadError
  ) {
    return <ErrorQueryDB />;
  }

  const handleChangueIdProyecto = () => {
    setIdProyecto(0);
    setShowSection(0);
  };

  const handleOpenDialogAgentesPersonasAvances = () => {
    setOpenDialogAgentesPersonasAvances(true);
  };

  const handleCloseDialogAgentesPersonasAvances = () => {
    setOpenDialogAgentesPersonasAvances(false);
  };

  const handleOpenDialogGuardarActividad = () => {
    setOpenDialogGuardarActividad(true);
  };

  const handleCloseDialogGuardarActividad = () => {
    setOpenDialogGuardarActividad(false);
    setInfoActividad({
      id: 0,
      idProyecto: 0,
      pos: "",
      nivel: "",
      actividad: "",
      fechaInicial: moment().format("YYYY-MM-DD"),
      fechaFin: "",
      idAgente: "",
      avance: 0,
      estatus: 0,
      fechaUltimaAccion: "",
    });
  };

  const handleGuardarAccion = () => {
    const {
      nombre,
      fecha,
      porcientoAvance,
      estatus,
      idActividad,
      agentesPersonas,
    } = infoAcciones;

    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else if (nombre.trim() === "") {
      swal("Error", "ingrese un nombre", "warning");
    } else if (fecha === "") {
      swal("Error", "Seleccione una fecha", "warning");
    } else if (porcientoAvance === "") {
      swal("Error", "Ingrese un porcentaje de avance", "warning");
    } else if (parseInt(porcientoAvance) > 100) {
      swal("Error", "Ingrese un porcentaje de avance valido", "warning");
    } else if (estatus === 0) {
      swal("Error", "Seleccione un estatus", "warning");
    } else if (agentesPersonas.length === 0) {
      swal("Error", "Seleccione un agente o persona", "warning");
    } else {
      executeGuardarPryProyAccion({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idProyAccion: idAccionEditar,
          idproyecto: idProyectoSelected,
          idactividad: idAccionEditar === 0 ? idActividadSelected : idActividad,
          nombre: nombre,
          fecha: fecha,
          Avance: porcientoAvance,
          estatus: estatus,
          agentesPersonas: agentesPersonas,
          accion: idAccionEditar === 0 ? 1 : 2,
        },
      });
    }
  };

  const handleBorrarAccion = () => {
    if (idAccionSelected === 0) {
      swal("Error", "Seleccione una acción", "warning");
    } else {
      swal({
        text: `¿Está seguro de eliminar la acción seleccionada?`,
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeBorrarPryProyAccion({
            data: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idProyAccion: idAccionSelected,
              idActividad: idActividadSelected,
            },
          });
        }
      });
    }
  };

  const handleGuardarDocumento = (nuevosDocumentos) => {
    if (nuevosDocumentos === null || nuevosDocumentos.length === 0) {
      swal("Error", "Seleccione un documento", "warning");
    } else {
      const codigoArchivo = moment().format("YYYYMMDDHmmss");
      const formData = new FormData();
      formData.append("usuario", correoUsuario);
      formData.append("pwd", passwordUsuario);
      formData.append("rfc", rfcEmpresa);
      formData.append("idsubmenu", idSubmenu);
      formData.append("idmenu", idMenu);
      formData.append("idmodulo", idModulo);
      formData.append("idUsuario", idUsuario);
      formData.append("codigoArchivo", codigoArchivo);
      formData.append("idproyecto", idProyectoSelected);
      formData.append("idactividad", idActividadSelected);
      formData.append("idaccion", idAccionSelected);
      for (let x = 0; x < nuevosDocumentos.length; x++) {
        formData.append("documento" + x, nuevosDocumentos[x]);
      }
      executeGuardarPryProyDocumento({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  const handleBorrarDocumento = () => {
    const { ids, rutas } = infoDocumentosSelected;
    if (ids.length === 0) {
      swal("Error", "Seleccione un documento", "warning");
    } else {
      swal({
        text: `¿Está seguro de eliminar ${
          ids.length === 1
            ? "el documento seleccionado"
            : "los documentos seleccionados"
        }?`,
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeBorrarPryProyDocumento({
            data: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idsPryProyDocumento: ids,
              rutasDocumentos: rutas,
            },
          });
        }
      });
    }
  };

  const handleClickGuardarAgentesPersonas = () => {
    if (newPersonasSelected.length === 0) {
      swal("Error", "Seleccione un agente o una persona", "warning");
    } else {
      executeGuardarPryProyPersonas({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idproyecto: idProyectoSelected,
          /* idactividad: idActividadSelected,
          idaccion: idAccionSelected, */
          idsAgentespersonas: newPersonasSelected,
        },
      });
    }
  };

  const handleClickGuardarActividad = () => {
    const {
      id,
      /* pos,
      nivel, */
      actividad,
      avance,
      fechaInicial,
      fechaFin,
      idAgente,
      estatus,
    } = infoActividad;

    /* if (pos.trim() === "") {
      swal("Error", "Ingrese una posición", "warning");
    } else if (nivel.trim() === "") {
      swal("Error", "Ingrese un nivel", "warning");
    } else  */ if (actividad.trim() === "") {
      swal("Error", "Ingrese una actividad", "warning");
    } else if (avance === "") {
      swal("Error", "Ingrese un porcentaje de avance", "warning");
    } else if (parseInt(avance) > 100) {
      swal("Error", "Ingrese un porcentaje de avance valido", "warning");
    } else if (fechaInicial === "") {
      swal("Error", "Seleccione una fecha inicial", "warning");
    } else if (fechaFin === "") {
      swal("Error", "Seleccione una fecha final", "warning");
    } else if (idAgente === 0) {
      swal("Error", "Seleccione un agente", "warning");
    } else if (estatus === 0) {
      swal("Error", "Ingrese un estatus", "warning");
    } else {
      let posicionActividadNueva = 0;
      let nivelActividadNueva = 0;

      if (idActividadSelected !== 0 && id === 0) {
        const actividadSelected = actividades.filter(
          (actividad) => actividad.id === idActividadSelected
        )[0];
        posicionActividadNueva = actividadSelected.Pos + 1;
        nivelActividadNueva = actividadSelected.Nivel + 1;
      }

      executeGuardarPryProyActividad({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idProyActividad: id,
          IdProyecto: idProyectoSelected,
          /* Pos: pos,
          Nivel: nivel, */
          Actividad: actividad.trim(),
          FecIni: fechaInicial,
          FecFin: fechaFin,
          idAgente: idAgente,
          Avance: avance,
          Estatus: estatus,
          FecUltAccion: moment().format("YYYY-MM-DD"),
          idActividadSelected: idActividadSelected,
          posicionActividadNueva: posicionActividadNueva,
          nivelActividadNueva: nivelActividadNueva,
          accion: id === 0 ? 1 : 2,
        },
      });
    }
  };

  const reacomodarArbol = (pos, nivel, arbol, accion) => {
    console.log(
      "Pos: " + pos,
      "Nivel: " + nivel,
      "Accion: " + accion,
      "Arbol: " + arbol
    );
    /* console.log(actividades); */
    /* let nuevoAcomodoArbol = [];
    let posArray = 0; */
    switch (accion) {
      case 1:
        for (let x = 1; x < actividades.length - 1; x++) {
          console.log(actividades[x].Arbol);
          console.log(
            hasChildren(
              actividades[x - 1].Arbol,
              actividades[x].Arbol,
              actividades[x + 1].Arbol
            )
              ? "Padre"
              : "No padre"
          );
          /* console.log(isChildren(actividades[x].Arbol, actividades[x].Arbol) ? "Hijo" : "No Hijo"); */

          /* if (actividades[x].Pos === pos) {
            console.log("Entro en la pos:", x);
            posArray = x + 1;
            if(actividades[posArray].Nivel !== nivel) {
              while (actividades[posArray].Nivel !== 0) {
                posArray++;
              }
            }
            else {
              nuevoAcomodoArbol.push(actividades[posArray]);
              if((posArray + 1) < actividades.length) {
                posArray++;
                if(actividades[posArray].Nivel !== nivel) {
                  
                  console.log("aqui");
                }
                else {
                  //aqui se entra si la actividad que se movio y la actividad que esta debajo es la ultima y es del mismo nivel.
                  nuevoAcomodoArbol.push(actividades[x]);
                  nuevoAcomodoArbol.push(actividades[posArray]);
                }
              }
              else {
                //aqui se entra si la actividad que se movio y las dos actividades que estan debajo de esta son del mismo nivel.
                nuevoAcomodoArbol.push(actividades[x]);
              }              
            }
            
            console.log("Arbol desde:", x, "Hasta:", posArray - 1);
            break;
          }
          nuevoAcomodoArbol.push(actividades[x]); */
        }
        break;
      default:
        console.log("default");
        break;
    }
    /* console.log(nuevoAcomodoArbol); */
  };

  const hasChildren = (arbolAnterior, arbolActual, arbolSiguiente) => {
    const decimalArbolAnterior = (arbolAnterior + "").split(".")[1];
    /* const decimalArbolActual = (arbolActual + "").split(".")[1];
    const decimalArbolSiguiente = (arbolSiguiente + "").split(".")[1]; */
    let isA = 0;
    if (decimalArbolAnterior) {
      isA++;
    }
    return isA;
  };

  /* const isChildren = (arbolActual, arbolAnterior) => {
    const decimalArbol = (arbolActual + "").split(".")[1];
    if (decimalArbol) {
      return true;
    }
    return false;
  }; */

  const handleClickBajarPosicion = () => {
    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else {
      const actividadSelected = actividades.filter(
        (actividad) => actividad.id === idActividadSelected
      )[0];
      const posiciones = actividades.map((actividad) => {
        return actividad.Pos;
      });
      const maximaPosicion = Math.max(...posiciones);

      if (actividadSelected.Pos === maximaPosicion) {
        swal(
          "Error",
          "La actividad ya esta en la posición mas baja",
          "warning"
        );
      } else {
        /* console.log(actividadSelected);
        console.log(actividades.filter((actividad) => actividad.Pos === (actividadSelected.Pos + 1))[0]);
        console.log(actividades.filter((actividad) => actividad.Pos >= (actividadSelected.Pos + 2))); */
        reacomodarArbol(
          actividadSelected.Pos,
          actividadSelected.Nivel,
          actividadSelected.Arbol,
          1
        );
        /* executeModificarInfoPryProyActividad({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idProyecto: idProyectoSelected,
            idProyActividad: idActividadSelected,
            PosActual: actividadSelected.Pos,
            PosNueva: actividadSelected.Pos + 1,
            Nivel: 0,
            FecUltAccion: moment().format("YYYY-MM-DD"),
            accion: 1,
          },
        }); */
      }
    }
  };

  const handleClickSubirPosicion = () => {
    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else {
      const actividadSelected = actividades.filter(
        (actividad) => actividad.id === idActividadSelected
      )[0];
      if (actividadSelected.Pos === 1) {
        swal(
          "Error",
          "La actividad ya esta en la posición mas alta",
          "warning"
        );
      } else {
        executeModificarInfoPryProyActividad({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idProyecto: idProyectoSelected,
            idProyActividad: idActividadSelected,
            PosActual: actividadSelected.Pos,
            PosNueva: actividadSelected.Pos - 1,
            Nivel: 0,
            FecUltAccion: moment().format("YYYY-MM-DD"),
            accion: 1,
          },
        });
      }
    }
  };

  const handleClickBajarNivel = () => {
    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else {
      const actividadSelected = actividades.filter(
        (actividad) => actividad.id === idActividadSelected
      )[0];
      if (actividadSelected.Nivel === 0) {
        swal("Error", "La actividad ya esta en el nivel mas bajo", "warning");
      } else {
        console.log(actividadSelected);
        const actividadAnterior =
          actividadSelected.Pos === 1
            ? []
            : actividades.filter(
                (actividad) => actividad.Pos === actividadSelected.Pos - 1
              )[0];
        console.log(actividadAnterior);

        /* executeModificarInfoPryProyActividad({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idProyecto: idProyectoSelected,
            idProyActividad: idActividadSelected,
            Nivel: actividadSelected.Nivel - 1,
            FecUltAccion: moment().format("YYYY-MM-DD"),
            accion: 2,
          },
        }); */
      }
    }
  };

  const handleClickSubirNivel = () => {
    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else {
      const actividadSelected = actividades.filter(
        (actividad) => actividad.id === idActividadSelected
      )[0];
      const niveles = actividades.map((actividad) => {
        return actividad.Nivel;
      });
      const maximoNivel = Math.max(...niveles);
      const actividadesNivelMaximo = actividades.filter(
        (actividad) => actividad.Nivel === maximoNivel
      );
      if (
        actividadSelected.Nivel === maximoNivel &&
        actividadesNivelMaximo.length === 1
      ) {
        swal("Error", "La actividad ya esta en el nivel mas alto", "warning");
      } else {
        executeModificarInfoPryProyActividad({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idProyecto: idProyectoSelected,
            idProyActividad: idActividadSelected,
            Nivel: actividadSelected.Nivel + 1,
            FecUltAccion: moment().format("YYYY-MM-DD"),
            accion: 2,
          },
        });
      }
    }
  };

  const handleGuardarActividadAccionDocumento = () => {
    if (idActividadDocumentoSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else if (idAccionDocumentoSelected === 0) {
      swal("Error", "Seleccione una acción", "warning");
    } else {
      executeModificarActividadAccionPryProyDocumento({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          iddocumento: idDocumentoSelected,
          idactividad: idActividadDocumentoSelected,
          idaccion: idAccionDocumentoSelected,
        },
      });
    }
  };

  const handleDescargarDocumentosSeleccionador = () => {
    const { ids, links } = infoDocumentosSelected;
    if (ids.length === 0) {
      swal("Error", "Seleccione un documento", "warning");
    } else {
      if (ids.length === 1) {
        var link = document.createElement("a");
        link.setAttribute("href", links);
        link.setAttribute("download", true);
        link.click();
      } else {
        executeDescargarDocumentosPryProyDocumento({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idmodulo: idModulo,
            idmenu: idMenu,
            idusuario: idUsuario,
            iddocumentos: ids,
            fechaActual: moment().format("YYYYMMDDHmmss"),
          },
        });
      }
    }
  };

  const handleClickEditarPlan = () => {
    const planSelected = planes.filter((plan) => plan.id === idPlanSelected)[0];
    setInfoPlan({
      id: planSelected.id,
      nombre: planSelected.nombre,
      fechaInicio: planSelected.fecini,
      fechaFin: planSelected.fecfin,
      idAgente: planSelected.idagente,
      idActividad: planSelected.idactividades,
    });
  };

  /* const treeData = [
    {
      key: "first-level-node-1",
      label: "Node 1 at the first level",
      nodes: [
        {
          key: "second-level-node-1",
          label: "Node 1 at the second level",
          nodes: [
            {
              key: "third-level-node-1",
              label: "Last node of the branch",
              nodes: [], // you can remove the nodes property or leave it as an empty array
            },
          ],
        },
      ],
    },
    {
      key: "first-level-node-2",
      label: "Node 2 at the first level",
    },
  ]; */

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} style={{ padding: 15 }}>
          <Typography variant="h6">
            <Tooltip title="Regresar">
              <IconButton onClick={handleChangueIdProyecto}>
                <ArrowBackIcon color="primary" />
              </IconButton>
            </Tooltip>
            Actividades
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} style={{ padding: 15 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handleOpenDialogGuardarActividad}
          >
            Agregar Actividad
          </Button>
        </Grid>
        {/* <Grid item xs={12}>
          <Link to="/reportesPDF" target="_blank">
            <Button>Reportes PDF</Button>
          </Link>
        </Grid> */}
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Tooltip title="Bajar Posición" disabled={permisosSubmenu < 2}>
            <span>
              <IconButton
                disabled={permisosSubmenu < 2}
                onClick={handleClickBajarPosicion}
              >
                <ExpandMoreIcon
                  color={permisosSubmenu >= 2 ? "primary" : "disabled"}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Subir Posición" disabled={permisosSubmenu < 2}>
            <span>
              <IconButton
                disabled={permisosSubmenu < 2}
                onClick={handleClickSubirPosicion}
              >
                <ExpandLessIcon
                  color={permisosSubmenu >= 2 ? "primary" : "disabled"}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Bajar Nivel" disabled={permisosSubmenu < 2}>
            <span>
              <IconButton
                disabled={permisosSubmenu < 2}
                onClick={handleClickBajarNivel}
              >
                <ChevronLeftIcon
                  color={permisosSubmenu >= 2 ? "primary" : "disabled"}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Subir Nivel" disabled={permisosSubmenu < 2}>
            <span>
              <IconButton
                disabled={permisosSubmenu < 2}
                onClick={handleClickSubirNivel}
              >
                <ChevronRightIcon
                  color={permisosSubmenu >= 2 ? "primary" : "disabled"}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <TreeMenu data={treeData}>
            {({ search, items }) => (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map(({ key, ...props }) => (
                  <div key={key}>
                    <ItemComponent
                      {...props}
                      style={{
                        background:
                          props.id === idActividadSelected ? "#c0c0ff" : "",
                      }}
                      onClick={() => {
                        /* console.log(props); */
                        setIdActividadSelected(
                          props.id === idActividadSelected ? 0 : props.id
                        );
                        setActividadTitulo(
                          props.id === idActividadSelected
                            ? ""
                            : props.Actividad
                        );
                        setIdAccionSelected(0);
                        setAccionTitulo("");
                        setIdPlanSelected(0);
                        setPlanTitulo("");
                      }}
                    />
                  </div>
                ))}
              </ul>
            )}
          </TreeMenu>
        </Grid>
        {/* <Grid item xs={12}>
          <TreeView
            className={classes.root}
            defaultExpanded={["1"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
          >
            {actividadesInfo.length > 0 ? (
              actividadesInfo.map((proyecto, indexProyecto) => {
                return (
                  <StyledTreeItem
                    key={indexProyecto}
                    nodeId={proyecto.id.toString()}
                    labelText={proyecto.Proyecto}
                    labelInfo={`${proyecto.Actividades.length} ${
                      proyecto.Actividades.length === 1
                        ? "Actividad"
                        : "Actividades"
                    }`}
                    onClick={(e) => {
                      setIdActividadSelected(0);
                      setActividadTitulo("");
                      setIdAccionSelected(0);
                      setAccionTitulo("");
                      setIdPlanSelected(0);
                      setPlanTitulo("");
                    }}
                  >
                    {proyecto.Actividades.map((actividad, indexActividad) => {
                      const numAcciones = proyecto.Acciones.filter(
                        (accion) => accion.idactividad === actividad.id
                      ).length;
                      return (
                        <Fragment key={indexActividad}>
                          <StyledTreeItem
                            nodeId={
                              proyecto.id.toString() + actividad.id.toString()
                            }
                            labelText={`Ps. ${actividad.Pos} Nv. ${actividad.Nivel} ${actividad.Actividad}`}
                            labelInfo={`${numAcciones} ${
                              numAcciones === 1 ? "Acción" : "Acciones"
                            } (${actividad.Avance}% avance)`}
                            style={{
                              paddingLeft: (actividad.Nivel + 1) * 16,
                              background:
                                actividad.id === idActividadSelected
                                  ? "#c0c0ff"
                                  : "",
                              display:
                                indexActividad !== 0 &&
                                actividad.Nivel >
                                  proyecto.Actividades[indexActividad - 1].Nivel
                                  ? "none"
                                  : "",
                            }}
                            onClick={() => {
                              setIdActividadSelected(
                                actividad.id === idActividadSelected
                                  ? 0
                                  : actividad.id
                              );
                              setActividadTitulo(
                                actividad.id === idActividadSelected
                                  ? ""
                                  : actividad.Actividad
                              );
                              setIdAccionSelected(0);
                              setAccionTitulo("");
                              setIdPlanSelected(0);
                              setPlanTitulo("");
                            }}
                          >
                            {indexActividad !==
                              proyecto.Actividades.length - 1 &&
                            actividad.Nivel <
                              proyecto.Actividades[indexActividad + 1].Nivel ? (
                              <StyledTreeItem
                                nodeId={
                                  proyecto.id.toString() +
                                  proyecto.Actividades[
                                    indexActividad + 1
                                  ].id.toString()
                                }
                                labelText={`Ps. ${
                                  proyecto.Actividades[indexActividad + 1].Pos
                                } Nv. ${
                                  proyecto.Actividades[indexActividad + 1].Nivel
                                } ${
                                  proyecto.Actividades[indexActividad + 1]
                                    .Actividad
                                }`}
                                style={{
                                  paddingLeft:
                                    proyecto.Actividades[indexActividad + 1]
                                      .Nivel * 16,
                                  background:
                                    proyecto.Actividades[indexActividad + 1]
                                      .id === idActividadSelected
                                      ? "#c0c0ff"
                                      : "",
                                }}
                              ></StyledTreeItem>
                            ) : null}
                          </StyledTreeItem>
                        </Fragment>
                      );
                    })}
                  </StyledTreeItem>
                );
              })
            ) : (
              <Typography variant="h6" style={{ textAlign: "center" }}>
                No hay actividades aún
              </Typography>
            )}
          </TreeView>
        </Grid> */}
        <Grid item xs={12}>
          <Avances
            setLoading={setLoading}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            idSubmenu={idSubmenu}
            permisosSubmenu={permisosSubmenu}
            idProyectoSelected={idProyectoSelected}
            proyectoTitulo={proyectoTitulo}
            idActividadSelected={idActividadSelected}
            setIdActividadSelected={setIdActividadSelected}
            actividadTitulo={actividadTitulo}
            setActividadTitulo={setActividadTitulo}
            idAccionSelected={idAccionSelected}
            setIdAccionSelected={setIdAccionSelected}
            accionTitulo={accionTitulo}
            setAccionTitulo={setAccionTitulo}
            idPlanSelected={idPlanSelected}
            setIdPlanSelected={setIdPlanSelected}
            planTitulo={planTitulo}
            setPlanTitulo={setPlanTitulo}
            infoDocumentosSelected={infoDocumentosSelected}
            setInfoDocumentosSelected={setInfoDocumentosSelected}
            agentesPersonasSelected={agentesPersonasSelected}
            accionesSelected={accionesSelected}
            documentosSelected={documentosSelected}
            infoAcciones={infoAcciones}
            setInfoAcciones={setInfoAcciones}
            idAccionEditar={idAccionEditar}
            setIdAccionEditar={setIdAccionEditar}
            handleGuardarAccion={handleGuardarAccion}
            handleBorrarAccion={handleBorrarAccion}
            handleGuardarDocumento={handleGuardarDocumento}
            handleBorrarDocumento={handleBorrarDocumento}
            handleOpenDialogAgentesPersonasAvances={
              handleOpenDialogAgentesPersonasAvances
            }
            agentesPersonasFilter={agentesPersonasFilter}
            setAgentesPersonasFilter={setAgentesPersonasFilter}
            handleOpenDialogGuardarActividad={handleOpenDialogGuardarActividad}
            actividades={actividades}
            setInfoActividad={setInfoActividad}
            acciones={acciones}
            setIdDocumentoSelected={setIdDocumentoSelected}
            idActividadDocumentoSelected={idActividadDocumentoSelected}
            setIdActividadDocumentoSelected={setIdActividadDocumentoSelected}
            idAccionDocumentoSelected={idAccionDocumentoSelected}
            setIdAccionDocumentoSelected={setIdAccionDocumentoSelected}
            handleGuardarActividadAccionDocumento={
              handleGuardarActividadAccionDocumento
            }
            handleDescargarDocumentosSeleccionador={
              handleDescargarDocumentosSeleccionador
            }
            executeGetPryProyActividades={executeGetPryProyActividades}
            planes={planes}
            infoPlan={infoPlan}
            setInfoPlan={setInfoPlan}
            handleClickEditarPlan={handleClickEditarPlan}
            vista={vista}
            setVista={setVista}
            executeGetPryProyectos={executeGetPryProyectos}
          />
        </Grid>
        <Dialog
          onClose={handleCloseDialogAgentesPersonasAvances}
          aria-labelledby="simple-dialog-title"
          open={openDialogAgentesPersonasAvances}
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle id="agentesPersonas">{`Agentes y Personas`}</DialogTitle>
          <DialogContent dividers>
            <AgentesPersonasAvances
              setLoading={setLoading}
              correoUsuario={correoUsuario}
              passwordUsuario={passwordUsuario}
              rfcEmpresa={rfcEmpresa}
              idSubmenu={idSubmenu}
              agentesPersonasExistentes={agentesPersonasFilter}
              newPersonasSelected={newPersonasSelected}
              setNewPersonasSelected={setNewPersonasSelected}
              idProyecto={idProyecto}
              /* agentesPersonasFilter={agentesPersonasFilter} */
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseDialogAgentesPersonasAvances}
            >
              Salir
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={permisosSubmenu < 2}
              onClick={handleClickGuardarAgentesPersonas}
            >
              Agregar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          onClose={handleCloseDialogGuardarActividad}
          aria-labelledby="simple-dialog-title"
          open={openDialogGuardarActividad}
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle id="agregaractividad">{`Guardar Actividad`}</DialogTitle>
          <DialogContent dividers>
            <GuardarActividad
              setLoading={setLoading}
              correoUsuario={correoUsuario}
              passwordUsuario={passwordUsuario}
              rfcEmpresa={rfcEmpresa}
              idSubmenu={idSubmenu}
              infoActividad={infoActividad}
              setInfoActividad={setInfoActividad}
              executeBorrarPryProyActividad={executeBorrarPryProyActividad}
              idProyecto={idProyecto}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseDialogGuardarActividad}
            >
              Salir
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={permisosSubmenu < 2}
              onClick={handleClickGuardarActividad}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Fragment>
  );
}

function Avances(props) {
  const classes = useStyles();
  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const idProyectoSelected = props.idProyectoSelected;
  const permisosSubmenu = props.permisosSubmenu;
  const proyectoTitulo = props.proyectoTitulo;
  const idActividadSelected = props.idActividadSelected;
  const setIdActividadSelected = props.setIdActividadSelected;
  const actividadTitulo = props.actividadTitulo;
  const setActividadTitulo = props.setActividadTitulo;
  const idAccionSelected = props.idAccionSelected;
  const accionTitulo = props.accionTitulo;
  const setIdAccionSelected = props.setIdAccionSelected;
  const setAccionTitulo = props.setAccionTitulo;
  const idPlanSelected = props.idPlanSelected;
  const setIdPlanSelected = props.setIdPlanSelected;
  const planTitulo = props.planTitulo;
  const setPlanTitulo = props.setPlanTitulo;
  const infoDocumentosSelected = props.infoDocumentosSelected;
  const setInfoDocumentosSelected = props.setInfoDocumentosSelected;
  const agentesPersonasSelected = props.agentesPersonasSelected;
  const accionesSelected = props.accionesSelected;
  const documentosSelected = props.documentosSelected;
  const infoAcciones = props.infoAcciones;
  const setInfoAcciones = props.setInfoAcciones;
  const idAccionEditar = props.idAccionEditar;
  const setIdAccionEditar = props.setIdAccionEditar;
  const handleGuardarAccion = props.handleGuardarAccion;
  const handleBorrarAccion = props.handleBorrarAccion;
  const handleGuardarDocumento = props.handleGuardarDocumento;
  const handleBorrarDocumento = props.handleBorrarDocumento;
  const handleOpenDialogAgentesPersonasAvances =
    props.handleOpenDialogAgentesPersonasAvances;
  const agentesPersonasFilter = props.agentesPersonasFilter;
  const setAgentesPersonasFilter = props.setAgentesPersonasFilter;
  const handleOpenDialogGuardarActividad =
    props.handleOpenDialogGuardarActividad;
  const actividades = props.actividades;
  const setInfoActividad = props.setInfoActividad;
  const acciones = props.acciones;
  const setIdDocumentoSelected = props.setIdDocumentoSelected;
  const idActividadDocumentoSelected = props.idActividadDocumentoSelected;
  const setIdActividadDocumentoSelected = props.setIdActividadDocumentoSelected;
  const idAccionDocumentoSelected = props.idAccionDocumentoSelected;
  const setIdAccionDocumentoSelected = props.setIdAccionDocumentoSelected;
  const handleGuardarActividadAccionDocumento =
    props.handleGuardarActividadAccionDocumento;
  const handleDescargarDocumentosSeleccionador =
    props.handleDescargarDocumentosSeleccionador;
  const executeGetPryProyActividades = props.executeGetPryProyActividades;
  const planes = props.planes;
  const infoPlan = props.infoPlan;
  const setInfoPlan = props.setInfoPlan;
  const handleClickEditarPlan = props.handleClickEditarPlan;
  const vista = props.vista;
  const setVista = props.setVista;
  const executeGetPryProyectos = props.executeGetPryProyectos;

  const [accionesFilter, setAccionesFilter] = useState([]);
  const [documentosFilter, setDocumentosFilter] = useState([]);
  const [
    openDialogAsignarActividadAccionDocumento,
    setOpenDialogAsignarActividadAccionDocumento,
  ] = useState(false);

  useEffect(() => {
    if (agentesPersonasSelected.length > 0) {
      let idsAgentesPersonas = [];
      let newAgentesPersonas = [];
      for (let x = 0; x < agentesPersonasSelected.length; x++) {
        if (
          idsAgentesPersonas.indexOf(agentesPersonasSelected[x].id) === -1 /* &&
          ((idActividadSelected === 0 ||
            idActividadSelected === agentesPersonasSelected[x].idActividad) &&
            (idAccionSelected === 0 ||
              idAccionSelected === agentesPersonasSelected[x].idAccion)) */
        ) {
          idsAgentesPersonas.push(agentesPersonasSelected[x].id);
          newAgentesPersonas.push(agentesPersonasSelected[x]);
        }
      }
      setAgentesPersonasFilter(newAgentesPersonas);
    }
  }, [
    agentesPersonasSelected,
    setAgentesPersonasFilter,
    /* idAccionSelected,
    idActividadSelected, */
  ]);

  useEffect(() => {
    if (accionesSelected.length > 0) {
      let idsAcciones = [];
      let newAcciones = [];
      for (let x = 0; x < accionesSelected.length; x++) {
        if (
          idsAcciones.indexOf(accionesSelected[x].id) === -1 &&
          (idActividadSelected === 0 ||
            idActividadSelected === accionesSelected[x].idactividad)
        ) {
          idsAcciones.push(accionesSelected[x].id);
          newAcciones.push(accionesSelected[x]);
        }
      }
      setAccionesFilter(newAcciones);
    } else {
      setAccionesFilter([]);
    }
  }, [accionesSelected, idActividadSelected]);

  useEffect(() => {
    if (documentosSelected.length > 0) {
      let idDocumentos = [];
      let newDocumentos = [];
      for (let x = 0; x < documentosSelected.length; x++) {
        if (
          idDocumentos.indexOf(documentosSelected[x].id) === -1 &&
          (idActividadSelected === 0 ||
            idActividadSelected === documentosSelected[x].idactividad) &&
          (idAccionSelected === 0 ||
            idAccionSelected === documentosSelected[x].idaccion)
        ) {
          idDocumentos.push(documentosSelected[x].id);
          newDocumentos.push(documentosSelected[x]);
        }
      }
      setDocumentosFilter(newDocumentos);
    } else {
      setDocumentosFilter([]);
    }
  }, [documentosSelected, idAccionSelected, idActividadSelected]);

  const handleInputsAgregarAccionChange = (e) => {
    if (e.target.id === "nombre") {
      pasteValidation(e, 3);
    }
    if (e.target.id === "porcientoAvance") {
      pasteValidation(e, 2);
    }
    setInfoAcciones({
      ...infoAcciones,
      [e.target.id]: e.target.value,
    });
  };

  /* const handleClickEditarAccion = () => {
    const accionSelected = accionesSelected.filter(
      (accion) => accion.id === idAccionSelected
    )[0];
    const idsAgentesPersonasAccionSelected = agentesPersonasSelected
      .filter((agentePersona) => agentePersona.idAccion === accionSelected.id)
      .map((agentePersona) => agentePersona.id);
    setInfoAcciones({
      nombre: accionSelected.nombre,
      fecha: accionSelected.fecha,
      porcientoAvance: accionSelected.Avance.toString(),
      estatus: accionSelected.estatus,
      idActividad: accionSelected.idactividad,
      agentesPersonas: idsAgentesPersonasAccionSelected,
    });
    setIdAccionEditar(idAccionSelected);
  }; */

  const handleLimpiarEdicionAccion = () => {
    setInfoAcciones({
      nombre: "",
      fecha: moment().format("YYYY-MM-DD"),
      porcientoAvance: "",
      estatus: 0,
      idActividad: 0,
      agentesPersonas: [],
    });
    setIdAccionEditar(0);
  };

  const handleOpenDialogAsignarActividadAccionDocumento = () => {
    setOpenDialogAsignarActividadAccionDocumento(true);
  };

  const handleCloseDialogAsignarActividadAccionDocumento = () => {
    setOpenDialogAsignarActividadAccionDocumento(false);
  };

  const handleChangueIdActividadDocumento = (e) => {
    setIdActividadDocumentoSelected(parseInt(e.target.value));
  };

  const handleChangueIdAccionDocumento = (e) => {
    setIdAccionDocumentoSelected(parseInt(e.target.value));
  };

  const handleChangeVista = (e) => {
    setVista(parseInt(e.target.value));
    setIdAccionEditar(0);
    setIdAccionSelected(0);
    setAccionTitulo("");
    setIdPlanSelected(0);
    setPlanTitulo("");
  };

  return (
    <Grid container style={{ margin: 0, padding: 0 }}>
      <Grid item xs={12} style={{ marginBottom: "30px" }}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={4}
            style={{ border: "1px solid", background: "#c0c0ff", height: 50 }}
          >
            <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
              <strong>Proyecto: </strong>
              {proyectoTitulo !== "" ? proyectoTitulo : "no seleccionado"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ border: "1px solid", background: "#c0c0ff", height: 50 }}
          >
            <Typography
              variant="subtitle1"
              style={{ marginTop: actividadTitulo === "" ? "10px" : "" }}
            >
              <strong>Actividad: </strong>
              {actividadTitulo !== "" ? actividadTitulo : "No Seleccionada"}
              {actividadTitulo !== "" ? (
                <Tooltip title="Editar" disabled={permisosSubmenu < 2}>
                  <span>
                    <IconButton
                      disabled={permisosSubmenu < 2}
                      onClick={() => {
                        handleOpenDialogGuardarActividad();
                        const actividadSelected = actividades.filter(
                          (actividad) => actividad.id === idActividadSelected
                        )[0];
                        setInfoActividad({
                          id: actividadSelected.id,
                          idProyecto: actividadSelected.IdProyecto,
                          pos: actividadSelected.Pos.toString(),
                          nivel: actividadSelected.Nivel.toString(),
                          actividad: actividadSelected.Actividad,
                          fechaInicial: actividadSelected.FecIni,
                          fechaFin: actividadSelected.FecFin,
                          idAgente: actividadSelected.idAgente,
                          avance: actividadSelected.Avance,
                          estatus: actividadSelected.Estatus,
                          fechaUltimaAccion: actividadSelected.FecUltAccion,
                        });
                      }}
                    >
                      <EditIcon
                        color={permisosSubmenu < 2 ? "disabled" : "primary"}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : null}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ border: "1px solid", background: "#c0c0ff", height: 50 }}
          >
            <Typography
              variant="subtitle1"
              style={{
                marginTop:
                  (vista === 1 && accionTitulo === "") ||
                  (vista === 2 && planTitulo === "")
                    ? "10px"
                    : "",
              }}
            >
              {vista === 1 ? (
                <Fragment>
                  <strong>Acción: </strong>
                  {accionTitulo !== "" ? accionTitulo : "No Seleccionada"}
                  {/* {accionTitulo !== "" ? (
                    <Tooltip title="Editar" disabled={permisosSubmenu < 2}>
                      <span>
                        <IconButton
                          disabled={permisosSubmenu < 2}
                          onClick={handleClickEditarAccion}
                        >
                          <EditIcon
                            color={permisosSubmenu < 2 ? "disabled" : "primary"}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : null} */}
                </Fragment>
              ) : (
                <Fragment>
                  <strong>Plan: </strong>
                  {planTitulo !== "" ? planTitulo : "No Seleccionado"}
                  {planTitulo !== "" ? (
                    <Tooltip title="Editar" disabled={permisosSubmenu < 2}>
                      <span>
                        <IconButton
                          disabled={permisosSubmenu < 2}
                          onClick={handleClickEditarPlan}
                        >
                          <EditIcon
                            color={permisosSubmenu < 2 ? "disabled" : "primary"}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : null}
                </Fragment>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginLeft: "5px" }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Vista</FormLabel>
          <RadioGroup
            row
            aria-label="vista"
            name="vista"
            value={vista}
            onChange={handleChangeVista}
          >
            <FormControlLabel value={1} control={<Radio />} label="Acciones" />
            <FormControlLabel value={2} control={<Radio />} label="Planes" />
          </RadioGroup>
        </FormControl>
      </Grid>
      {vista === 1 ? (
        <Fragment>
          <Grid item xs={12} md={4} style={{ padding: "3px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ textAlign: "end" }}>
                {idAccionEditar !== 0 ? (
                  <Tooltip title="Cancelar">
                    <IconButton
                      style={{
                        float: "right",
                        margin: 5,
                      }}
                      onClick={handleLimpiarEdicionAccion}
                    >
                      <CloseIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <Tooltip
                  title="Guardar Acción"
                  disabled={permisosSubmenu < 2}
                  style={{ display: "inline-block" }}
                >
                  <span>
                    <IconButton
                      style={{
                        background: "#1769aa",
                        margin: 5,
                      }}
                      disabled={permisosSubmenu < 2}
                      onClick={handleGuardarAccion}
                    >
                      <SaveIcon
                        style={{
                          color: permisosSubmenu < 2 ? "gray" : "#ffffff",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title="Eliminar Acción"
                  disabled={permisosSubmenu < 3}
                  style={{ display: "inline-block" }}
                >
                  <span>
                    <IconButton
                      style={{
                        background: permisosSubmenu < 3 ? "" : "#f50057",
                        margin: 5,
                      }}
                      disabled={permisosSubmenu < 3}
                      onClick={handleBorrarAccion}
                    >
                      <DeleteIcon
                        style={{
                          color: permisosSubmenu < 3 ? "gray" : "#ffffff",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="nombre"
                  label="Nombre"
                  variant="outlined"
                  type="text"
                  value={infoAcciones.nombre}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={handleInputsAgregarAccionChange}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  className={classes.textFields}
                  id="fecha"
                  label="Fecha"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  type="date"
                  value={infoAcciones.fecha}
                  onChange={handleInputsAgregarAccionChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  className={classes.textFields}
                  id="porcientoAvance"
                  label="% Avance"
                  type="text"
                  margin="normal"
                  value={infoAcciones.porcientoAvance}
                  inputProps={{
                    maxLength: 3,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 2);
                  }}
                  onChange={handleInputsAgregarAccionChange}
                />
              </Grid>
              <Grid item xs={idAccionEditar === 0 ? 12 : 6}>
                <TextField
                  className={classes.textFields}
                  id="estatus"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  label="Estatus"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  value={infoAcciones.estatus}
                  onChange={handleInputsAgregarAccionChange}
                >
                  <option value={0}>Elija un estatus</option>
                  <option value={1}>Pendiente</option>
                  <option value={2}>En proceso</option>
                  <option value={3}>Terminado</option>
                  <option value={4}>Cerrado</option>
                </TextField>
              </Grid>
              {idAccionEditar !== 0 ? (
                <Grid item xs={6}>
                  <TextField
                    className={classes.textFields}
                    id="idActividad"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                    label="Actividad"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    value={infoAcciones.idActividad}
                    onChange={handleInputsAgregarAccionChange}
                  >
                    <option value={0}>Elija una actividad</option>
                    {actividades.map((actividad, indexActividad) => {
                      return (
                        <option key={indexActividad} value={actividad.id}>
                          {actividad.Actividad}
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  <span style={{ position: "absolute", marginTop: "35px" }}>
                    Personas del proyecto
                  </span>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    onClick={handleOpenDialogAgentesPersonasAvances}
                  >
                    ...
                  </Button>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3}>
                  <List
                    component="nav"
                    aria-label="lista personas acciones"
                    style={{ height: "220px", padding: 0, overflow: "auto" }}
                  >
                    {agentesPersonasFilter.map(
                      (agentePersona, indexAgentePersona) => {
                        return (
                          <ListItem
                            button
                            key={indexAgentePersona}
                            style={{
                              background:
                                infoAcciones.agentesPersonas.indexOf(
                                  agentePersona.id
                                ) !== -1
                                  ? "#4caf50"
                                  : "",
                            }}
                            selected={
                              infoAcciones.agentesPersonas.indexOf(
                                agentePersona.id
                              ) !== -1
                            }
                            onClick={() => {
                              /* if (agentePersona.tipo === 1) {
                                swal(
                                  "Error",
                                  "Solo se pueden seleccionar personas en las acciones",
                                  "warning"
                                );
                              } else { */
                              let newAgentesPersonas =
                                infoAcciones.agentesPersonas;
                              const pos = newAgentesPersonas.indexOf(
                                agentePersona.id
                              );
                              if (pos === -1) {
                                newAgentesPersonas.push(agentePersona.id);
                              } else {
                                newAgentesPersonas.splice(pos, 1);
                              }
                              setInfoAcciones({
                                ...infoAcciones,
                                agentesPersonas: newAgentesPersonas,
                              });
                              /* } */
                            }}
                          >
                            <ListItemText
                              primary={`${indexAgentePersona + 1}. ${
                                agentePersona.Agente
                              }`}
                              secondary={`${
                                agentePersona.tipo === 1 ? "Agente" : "Persona"
                              }`}
                            />
                          </ListItem>
                        );
                      }
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8} style={{ margin: 0, padding: "3px" }}>
            <Grid container justify="center" spacing={3}>
              <Grid item xs={10}>
                <Button
                  variant="contained"
                  style={{
                    float: "right",
                    background: "#f44336",
                    color: "#ffffff",
                    margin: 5,
                  }}
                  disabled={permisosSubmenu < 3}
                  onClick={handleBorrarDocumento}
                >
                  -
                </Button>
                <Button
                  variant="contained"
                  style={{
                    float: "right",
                    background: "#4caf50",
                    color: "#ffffff",
                    margin: 5,
                  }}
                  disabled={permisosSubmenu < 2}
                  onClick={() => {
                    var input = document.createElement("input");
                    input.type = "file";
                    input.setAttribute("multiple", true);
                    input.onchange = (e) => {
                      handleGuardarDocumento(e.target.files);
                    };
                    input.click();
                  }}
                >
                  +
                </Button>
                <Tooltip title="Descargar Seleccionado(s)">
                  <IconButton
                    style={{
                      float: "right",
                      background: "#1769aa",
                      margin: 5,
                    }}
                    onClick={handleDescargarDocumentosSeleccionador}
                  >
                    <GetAppIcon style={{ color: "#ffffff" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2">
                  Acciones Registradas
                </Typography>
                <Paper elevation={3}>
                  <List
                    component="nav"
                    aria-label="lista acciones"
                    style={{ height: "540px", padding: 0, overflow: "auto" }}
                  >
                    {accionesFilter.length > 0 ? (
                      accionesFilter.map((accion, indexAcciones) => {
                        return (
                          <ListItem
                            button
                            key={indexAcciones}
                            style={{
                              background:
                                idAccionSelected === accion.id ? "#4caf50" : "",
                            }}
                            selected={idAccionSelected === accion.id}
                            onClick={() => {
                              setIdActividadSelected(
                                accion.idactividad !== 0 &&
                                  accion.idactividad !== null
                                  ? accion.idactividad
                                  : 0
                              );
                              setActividadTitulo(
                                accion.Actividad !== "" &&
                                  accion.Actividad !== null
                                  ? accion.Actividad
                                  : ""
                              );
                              setIdAccionSelected(
                                idAccionSelected === accion.id ? 0 : accion.id
                              );
                              setAccionTitulo(
                                idAccionSelected === accion.id
                                  ? ""
                                  : accion.nombre
                              );

                              let idsAgentesPersonasAccionSelected = [];
                              if (idAccionSelected !== accion.id) {
                                idsAgentesPersonasAccionSelected =
                                  agentesPersonasSelected
                                    .filter(
                                      (agentePersona) =>
                                        agentePersona.idAccion === accion.id
                                    )
                                    .map((agentePersona) => agentePersona.id);
                              }

                              setInfoAcciones({
                                nombre:
                                  idAccionSelected === accion.id
                                    ? ""
                                    : accion.nombre,
                                fecha:
                                  idAccionSelected === accion.id
                                    ? moment().format("YYYY-MM-DD")
                                    : accion.fecha,
                                porcientoAvance:
                                  idAccionSelected === accion.id
                                    ? ""
                                    : accion.Avance,
                                estatus:
                                  idAccionSelected === accion.id
                                    ? 0
                                    : accion.estatus,
                                idActividad:
                                  idAccionSelected === accion.id
                                    ? 0
                                    : accion.idactividad,
                                agentesPersonas:
                                  idAccionSelected === accion.id
                                    ? []
                                    : idsAgentesPersonasAccionSelected,
                              });
                              setIdAccionEditar(
                                idAccionSelected === accion.id ? 0 : accion.id
                              );
                            }}
                          >
                            <ListItemText
                              primary={`${indexAcciones + 1}. ${accion.nombre}`}
                              secondary={`Actividad: ${
                                accion.Actividad !== 0 &&
                                accion.Actividad !== null
                                  ? accion.Actividad
                                  : "Sin Actividad"
                              }`}
                            />
                            <ListItemSecondaryAction>
                              <CircularProgress
                                variant="determinate"
                                value={accion.Avance}
                                style={{
                                  position: "relative",
                                  display: "block",
                                }}
                              />
                              <Typography
                                variant="caption"
                                component="div"
                                color="textSecondary"
                                style={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: "absolute",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {accion.Avance}%
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <ListItemText
                          style={{ textAlign: "center" }}
                          primary={`No hay acciones`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2">Documentos</Typography>
                <Paper elevation={3}>
                  <List
                    component="nav"
                    aria-label="lista documentos"
                    style={{ height: "540px", padding: 0, overflow: "auto" }}
                  >
                    {documentosFilter.length > 0 ? (
                      documentosFilter.map((documento, indexDocumento) => {
                        return (
                          <ListItem
                            button
                            key={indexDocumento}
                            style={{
                              background:
                                infoDocumentosSelected.ids.indexOf(
                                  documento.id
                                ) !== -1
                                  ? "#4caf50"
                                  : "",
                            }}
                            selected={
                              infoDocumentosSelected.ids.indexOf(
                                documento.id
                              ) !== -1
                            }
                            onClick={() => {
                              let idsDocumentos = infoDocumentosSelected.ids;
                              let rutasDocumentos =
                                infoDocumentosSelected.rutas;
                              let linksDocumentos =
                                infoDocumentosSelected.links;
                              let pos = idsDocumentos.indexOf(documento.id);
                              if (pos === -1) {
                                idsDocumentos.push(documento.id);
                                rutasDocumentos.push(
                                  documento.RutaDocumento +
                                    "/" +
                                    documento.NombreDocumento +
                                    documento.ExtencionDocumento
                                );
                                linksDocumentos.push(
                                  documento.LinkDocumento + "/download"
                                );
                              } else {
                                idsDocumentos.splice(pos, 1);
                                rutasDocumentos.splice(pos, 1);
                                linksDocumentos.splice(pos, 1);
                              }
                              setInfoDocumentosSelected({
                                ids: idsDocumentos,
                                rutas: rutasDocumentos,
                                links: linksDocumentos,
                              });
                            }}
                          >
                            <ListItemText
                              primary={`${indexDocumento + 1}. ${
                                documento.NombreDocumento
                              }`}
                              secondary={
                                <Fragment>
                                  <span>{`Actividad: ${documento.Actividad}`}</span>
                                  <br />
                                  <span>{`Acción: ${documento.Accion}`}</span>
                                </Fragment>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Fragment>
                                <Tooltip title="Ver">
                                  <IconButton
                                    onClick={() => {
                                      window.open(documento.LinkDocumento);
                                    }}
                                  >
                                    <VisibilityIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                                {/* <Tooltip title="Descargar">
                              <IconButton>
                                <a
                                  href={documento.LinkDocumento + "/download"}
                                  download
                                >
                                  <GetAppIcon color="primary" />
                                </a>
                              </IconButton>
                            </Tooltip> */}
                                <Tooltip
                                  title="Asignar actividad y acción"
                                  disabled={permisosSubmenu < 2}
                                >
                                  <span>
                                    <IconButton
                                      disabled={permisosSubmenu < 2}
                                      onClick={() => {
                                        setIdDocumentoSelected(documento.id);
                                        setIdActividadDocumentoSelected(
                                          documento.idactividad
                                        );
                                        setIdAccionDocumentoSelected(
                                          documento.idaccion
                                        );
                                        handleOpenDialogAsignarActividadAccionDocumento();
                                      }}
                                    >
                                      <AssignmentIcon
                                        color={
                                          permisosSubmenu < 2
                                            ? "disabled"
                                            : "primary"
                                        }
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Fragment>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <ListItemText
                          style={{ textAlign: "center" }}
                          primary={`No hay documentos`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Fragment>
      ) : (
        <Planes
          setLoading={setLoading}
          correoUsuario={correoUsuario}
          passwordUsuario={passwordUsuario}
          rfcEmpresa={rfcEmpresa}
          idSubmenu={idSubmenu}
          permisosSubmenu={permisosSubmenu}
          idProyecto={idProyectoSelected}
          setActividadTitulo={setActividadTitulo}
          actividades={actividades}
          executeGetPryProyActividades={executeGetPryProyActividades}
          idPlanSelected={idPlanSelected}
          setIdPlanSelected={setIdPlanSelected}
          setPlanTitulo={setPlanTitulo}
          planes={planes}
          infoPlan={infoPlan}
          setInfoPlan={setInfoPlan}
          idActividadSelected={idActividadSelected}
          setIdActividadSelected={setIdActividadSelected}
          executeGetPryProyectos={executeGetPryProyectos}
        />
      )}
      <Dialog
        onClose={handleCloseDialogAsignarActividadAccionDocumento}
        aria-labelledby="simple-dialog-title"
        open={openDialogAsignarActividadAccionDocumento}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="documentoactividadaccion">{`Asignar actividad y acción`}</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                id="idActividad"
                variant="outlined"
                label="Actividad"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                value={idActividadDocumentoSelected}
                onChange={handleChangueIdActividadDocumento}
              >
                <option value={0}>Elija una actividad</option>
                {actividades.map((actividad, index) => (
                  <option key={index} value={actividad.id}>
                    {actividad.Actividad}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                id="idAccion"
                variant="outlined"
                label="Acción"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                value={idAccionDocumentoSelected}
                onChange={handleChangueIdAccionDocumento}
              >
                <option value={0}>Elija una actividad</option>
                {acciones
                  .filter(
                    (accion) =>
                      accion.idactividad === idActividadDocumentoSelected
                  )
                  .map((accion, index) => (
                    <option key={index} value={accion.id}>
                      {accion.fecha}
                    </option>
                  ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogAsignarActividadAccionDocumento}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={permisosSubmenu < 2}
            onClick={handleGuardarActividadAccionDocumento}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function not(a, b) {
  return a.filter((valueA) => b.indexOf(valueA.id) === -1);
}

function intersection(a, b) {
  return a.filter(
    (valueA) =>
      b
        .map((valueB) => {
          return valueB.id;
        })
        .indexOf(valueA) !== -1
  );
}

function AgentesPersonasAvances(props) {
  const classes = useStyles();

  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const agentesPersonasExistentes = props.agentesPersonasExistentes;
  const setNewPersonasSelected = props.setNewPersonasSelected;
  const idProyecto = props.idProyecto;

  /* const [agentesPersonas, setAgentesPersonas] = useState([]); */
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSelected, setProyectoSelected] = useState(0);
  const [personasProyectos, setPersonasProyectos] = useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  /* const leftChecked = [];
  const rightChecked = []; */

  const [
    {
      data: getPryProyectosData,
      loading: getPryProyectosLoading,
      error: getPryProyectosError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyectos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: getTodosPryProyCatAgentesData,
      loading: getTodosPryProyCatAgentesLoading,
      error: getTodosPryProyCatAgentesError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getTodosPryProyCatAgentes`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyectosData) {
        if (getPryProyectosData.error !== 0) {
          swal("Error", dataBaseErrores(getPryProyectosData.error), "warning");
        } else {
          setProyectos(getPryProyectosData.proyectos);
        }
      }
    }

    checkData();
  }, [getPryProyectosData]);

  useEffect(() => {
    function checkData() {
      if (getTodosPryProyCatAgentesData) {
        if (getTodosPryProyCatAgentesData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getTodosPryProyCatAgentesData.error),
            "warning"
          );
        } else {
          setPersonasProyectos(getTodosPryProyCatAgentesData.proycatagentes);
        }
      }
    }

    checkData();
  }, [getTodosPryProyCatAgentesData]);

  useEffect(() => {
    if (personasProyectos.length > 0) {
      const personasExistentes = agentesPersonasExistentes.filter(
        (agentePersona) => agentePersona.tipo === 2
      );

      let personasProyecto = personasProyectos.filter(
        (personaProyecto) => personaProyecto.idProyecto === proyectoSelected
      );

      /* for (let x = 0; x < personasExistentes.length; x++) {
        if (
          personasProyecto
            .map((personaProyecto) => {
              return personaProyecto.id;
            })
            .indexOf(personasExistentes[x].id) !== -1
        ) {
          personasProyecto.splice(x, 1);
        }
      } */

      for (let x = personasExistentes.length - 1; x >= 0; x--) {
        if (
          personasProyecto
            .map((personaProyecto) => {
              return personaProyecto.id;
            })
            .indexOf(personasExistentes[x].id) !== -1
        ) {
          personasProyecto.splice(x, 1);
        }
      }

      const idsExistentes = personasProyecto.map((personaProyecto) => {
        return personaProyecto.id;
      });
      for (let x = right.length - 1; x >= 0; x--) {
        /* console.log(idsExistentes);
        console.log(right[x].id); */
        const pos = idsExistentes.indexOf(right[x].id);
        if (pos !== -1) {
          personasProyecto.splice(pos, 1);
        }
      }
      /*  console.log(personasProyecto); */
      const idsPersonasSelected = right.map((value) => {
        return value.id;
      });
      /* console.log(idsPersonasSelected); */
      setNewPersonasSelected(idsPersonasSelected);
      setLeft(personasProyecto);
    }
  }, [
    agentesPersonasExistentes,
    personasProyectos,
    proyectoSelected,
    right,
    setNewPersonasSelected,
  ]);

  /* const { agentesPersonasData, agentesPersonasLoading, agentesPersonasError } =
    useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  useEffect(() => {
    if (agentesPersonasData.length > 0) {
      const idsAgentesPersonasExistentes = agentesPersonasExistentes.map(
        (agentePersona) => agentePersona.id
      );
      setAgentesPersonas(
        agentesPersonasData.filter(
          (agentePersona) =>
            idsAgentesPersonasExistentes.indexOf(
              agentePersona.idAgentePersona
            ) === -1
        )
      );
    }
  }, [agentesPersonasData, agentesPersonasExistentes]); */

  if (getPryProyectosLoading || getTodosPryProyCatAgentesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPryProyectosError || getTodosPryProyCatAgentesError) {
    return <ErrorQueryDB />;
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    /* setRight(right.concat(leftChecked)); */
    setRight(
      right.concat(left.filter((data) => leftChecked.indexOf(data.id) !== -1))
    );
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    /* setLeft(left.concat(rightChecked)); */
    setLeft(
      left.concat(right.filter((data) => rightChecked.indexOf(data.id) !== -1))
    );
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleInputsChangePoryectoSelected = (e) => {
    setProyectoSelected(parseInt(e.target.value));
  };

  /* const customList = (items) => (
    <Paper className={classes.paper}>
      <List
        dense
        component="div"
        role="list"
        style={{ height: "300px", overflow: "auto" }}
      >
        {items.length > 0 ? (
          items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <ListItem
                key={value}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`List item ${value + 1}`} />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary={`No Hay Personas`} />
          </ListItem>
        )}
        <ListItem />
      </List>
    </Paper>
  ); */

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      style={{ margin: "auto" }}
    >
      <Grid item>
        <TextField
          className={classes.textFields}
          select
          SelectProps={{
            native: true,
          }}
          id="idProyecto"
          variant="outlined"
          label="Proyecto"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={proyectoSelected}
          onChange={handleInputsChangePoryectoSelected}
        >
          <option value={0}>Personas sin proyecto</option>
          {proyectos
            .filter((proyecto) => proyecto.id !== idProyecto)
            .map((proyecto, index) => (
              <option key={index} value={proyecto.id}>
                {proyecto.Proyecto}
              </option>
            ))}
        </TextField>
        <Paper className={classes.paper}>
          <List
            dense
            component="div"
            role="list"
            style={{ height: "300px", overflow: "auto" }}
          >
            {left.length > 0 ? (
              left.map((value, index) => {
                const labelId = `transfer-list-item-${value.id}-label`;

                return (
                  <ListItem
                    key={index}
                    role="listitem"
                    button
                    onClick={handleToggle(value.id)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.indexOf(value.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.Agente}`} />
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText primary={`No Hay Personas`} />
              </ListItem>
            )}
            <ListItem />
          </List>
        </Paper>
      </Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <Typography>Personas a agregar</Typography>
        <Paper className={classes.paper}>
          <List
            dense
            component="div"
            role="list"
            style={{ height: "300px", overflow: "auto" }}
          >
            {right.length > 0 ? (
              right.map((value, index) => {
                const labelId = `transfer-list-item-${value.id}-label`;

                return (
                  <ListItem
                    key={index}
                    role="listitem"
                    button
                    onClick={handleToggle(value.id)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={checked.indexOf(value.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.Agente}`} />
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText primary={`No Hay Personas`} />
              </ListItem>
            )}
            <ListItem />
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

function GuardarActividad(props) {
  const classes = useStyles();

  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const infoActividad = props.infoActividad;
  const setInfoActividad = props.setInfoActividad;
  const executeBorrarPryProyActividad = props.executeBorrarPryProyActividad;
  const idProyecto = props.idProyecto;

  const { agentesPersonasData, agentesPersonasLoading, agentesPersonasError } =
    useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  if (agentesPersonasLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (agentesPersonasError) {
    return <ErrorQueryDB />;
  }

  const handleInputsGuardarActividadChange = (e) => {
    if (e.target.id !== "fechaInicial" && e.target.id !== "fechaFin") {
      pasteValidation(e, e.target.id === "actividad" ? 3 : 2);
    }
    setInfoActividad({
      ...infoActividad,
      [e.target.id]: e.target.value,
    });
  };

  const handleClickEliminarActividad = () => {
    swal({
      text: `¿Está seguro de eliminar la actividad?`,
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        executeBorrarPryProyActividad({
          data: {
            usuario: correoUsuario,
            pwd: passwordUsuario,
            rfc: rfcEmpresa,
            idsubmenu: idSubmenu,
            idProyActividad: infoActividad.id,
            pos: infoActividad.pos,
          },
        });
        /* swal({
          text: `Elija una opción de borrado`,
          buttons: ["Eliminar solo la actividad", "Eliminar todo el arbol desendente"],
          dangerMode: true,
        }).then((value) => {
          if (value) {
            console.log("Eliminar todo el arbol desendente");
          }
          else {
            console.log("Eliminar solo la actividad");
          }
        }); */
      }
    });
  };

  return (
    <Grid container spacing={3} justify="center">
      {infoActividad.id !== 0 && (
        <Fragment>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={classes.textFields}
              id="pos"
              label="Posición"
              disabled
              value={infoActividad.pos}
              inputProps={{
                maxLength: 3,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={handleInputsGuardarActividadChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              className={classes.textFields}
              id="nivel"
              label="Nivel"
              disabled
              value={infoActividad.nivel}
              inputProps={{
                maxLength: 3,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={handleInputsGuardarActividadChange}
            />
          </Grid>
        </Fragment>
      )}
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          id="actividad"
          label="Actividad"
          value={infoActividad.actividad}
          inputProps={{
            maxLength: 100,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={handleInputsGuardarActividadChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          id="avance"
          label="% Avance"
          value={infoActividad.avance}
          inputProps={{
            maxLength: 3,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={handleInputsGuardarActividadChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          id="fechaInicial"
          label="Fecha Inicial"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          type="date"
          value={infoActividad.fechaInicial}
          onChange={handleInputsGuardarActividadChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          id="fechaFin"
          label="Fecha Final"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          type="date"
          value={infoActividad.fechaFin}
          onChange={handleInputsGuardarActividadChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          select
          SelectProps={{
            native: true,
          }}
          id="idAgente"
          variant="outlined"
          label="Agente"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={infoActividad.idAgente}
          onChange={handleInputsGuardarActividadChange}
        >
          <option value={0}>Elija un agente</option>
          {agentesPersonasData
            .filter((agentePersona) => agentePersona.idProyecto === idProyecto)
            .map((agente, index) => (
              <option key={index} value={agente.idAgentePersona}>
                {agente.agente}
              </option>
            ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          id="estatus"
          select
          SelectProps={{
            native: true,
          }}
          variant="outlined"
          label="Estatus"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={infoActividad.estatus}
          onChange={handleInputsGuardarActividadChange}
        >
          <option value={0}>Elija un estatus</option>
          <option value={1}>Pendiente</option>
          <option value={2}>En proceso</option>
          <option value={3}>Terminado</option>
          <option value={4}>Cerrado</option>
        </TextField>
      </Grid>
      {infoActividad.id !== 0 ? (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          style={{ alignSelf: "center", marginTop: "9px" }}
        >
          <TextField
            className={classes.textFields}
            id="fechaUltimaAccion"
            label="Fecha Última Acción"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            type="date"
            disabled
            value={infoActividad.fechaUltimaAccion}
          />
        </Grid>
      ) : null}
      {infoActividad.id !== 0 && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "right" }}
            onClick={handleClickEliminarActividad}
          >
            Eliminar
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

function Planes(props) {
  const classes = useStyles();

  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;
  const permisosSubmenu = props.permisosSubmenu;
  const idProyecto = props.idProyecto;
  const setActividadTitulo = props.setActividadTitulo;
  const actividades = props.actividades;
  const executeGetPryProyActividades = props.executeGetPryProyActividades;
  const setPlanTitulo = props.setPlanTitulo;
  const idPlanSelected = props.idPlanSelected;
  const setIdPlanSelected = props.setIdPlanSelected;
  const planes = props.planes;
  const infoPlan = props.infoPlan;
  const setInfoPlan = props.setInfoPlan;
  const idActividadSelected = props.idActividadSelected;
  const setIdActividadSelected = props.setIdActividadSelected;
  const executeGetPryProyectos = props.executeGetPryProyectos;

  const [planesFilter, setPlanesFilter] = useState([]);

  const [agentesPersonas, setAgentesPersonas] = useState([]);

  const { agentesPersonasData, agentesPersonasLoading, agentesPersonasError } =
    useAgentesPersonas(correoUsuario, passwordUsuario, rfcEmpresa, idSubmenu);

  const [
    {
      data: guardarPryProyPlanData,
      loading: guardarPryProyPlanLoading,
      error: guardarPryProyPlanError,
    },
    executeGuardarPryProyPlan,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarPryProyPlan`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: borrarPryProyPlanData,
      loading: borrarPryProyPlanLoading,
      error: borrarPryProyPlanError,
    },
    executeBorrarPryProyPlan,
  ] = useAxios(
    {
      url: API_BASE_URL + `/borrarPryProyPlan`,
      method: "DELETE",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (agentesPersonasData.length > 0) {
      setAgentesPersonas(
        agentesPersonasData.filter(
          (agentePersona) =>
            agentePersona.tipo === 1 && agentePersona.estatus === 1
        )
      );
    }
  }, [agentesPersonasData]);

  useEffect(() => {
    function checkData() {
      if (guardarPryProyPlanData) {
        if (guardarPryProyPlanData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarPryProyPlanData.error),
            "warning"
          );
        } else {
          if (guardarPryProyPlanData.nuevoPlan) {
            setIdActividadSelected(
              guardarPryProyPlanData.nuevoPlan[0].idactividades
            );
            setActividadTitulo(guardarPryProyPlanData.nuevoPlan[0].Actividad);
            setIdPlanSelected(guardarPryProyPlanData.nuevoPlan[0].id);
            setPlanTitulo(guardarPryProyPlanData.nuevoPlan[0].nombre);
          }
          setInfoPlan({
            id: 0,
            nombre: "",
            fechaInicio: moment().format("YYYY-MM-DD"),
            fechaFin: "",
            idAgente: 0,
            idActividad: 0,
          });
          executeGetPryProyActividades();
          executeGetPryProyectos();
        }
      }
    }

    checkData();
  }, [
    guardarPryProyPlanData,
    setIdActividadSelected,
    setActividadTitulo,
    setIdPlanSelected,
    setPlanTitulo,
    setInfoPlan,
    executeGetPryProyActividades,
    executeGetPryProyectos,
  ]);

  useEffect(() => {
    function checkData() {
      if (borrarPryProyPlanData) {
        if (borrarPryProyPlanData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(borrarPryProyPlanData.error),
            "warning"
          );
        } else {
          setIdPlanSelected(0);
          setPlanTitulo("");
          setInfoPlan({
            id: 0,
            nombre: "",
            fechaInicio: moment().format("YYYY-MM-DD"),
            fechaFin: "",
            idAgente: 0,
            idActividad: 0,
          });
          executeGetPryProyActividades();
        }
      }
    }

    checkData();
  }, [
    borrarPryProyPlanData,
    setIdPlanSelected,
    setPlanTitulo,
    setInfoPlan,
    executeGetPryProyActividades,
  ]);

  useEffect(() => {
    if (planes.length > 0) {
      let idsPlanes = [];
      let newPlanes = [];
      for (let x = 0; x < planes.length; x++) {
        if (
          idsPlanes.indexOf(planes[x].id) === -1 &&
          (idActividadSelected === 0 ||
            idActividadSelected === planes[x].idactividades)
        ) {
          idsPlanes.push(planes[x].id);
          newPlanes.push(planes[x]);
        }
      }
      setPlanesFilter(newPlanes);
    } else {
      setPlanesFilter([]);
    }
  }, [planes, idActividadSelected]);

  if (
    agentesPersonasLoading ||
    guardarPryProyPlanLoading ||
    borrarPryProyPlanLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    agentesPersonasError ||
    guardarPryProyPlanError ||
    borrarPryProyPlanError
  ) {
    return <ErrorQueryDB />;
  }

  const handleInputsInfoPlanChange = (e) => {
    if (e.target.id === "nombre") {
      pasteValidation(e, 3);
    }
    setInfoPlan({
      ...infoPlan,
      [e.target.id]: e.target.value,
    });
  };

  const handleGuardarPlan = () => {
    const { id, nombre, fechaInicio, fechaFin, idAgente, idActividad } =
      infoPlan;
    if (idActividadSelected === 0) {
      swal("Error", "Seleccione una actividad", "warning");
    } else if (nombre.trim() === "") {
      swal("Error", "Ingrese un nombre", "warning");
    } else if (fechaInicio === "") {
      swal("Error", "Seleccione una fecha de inicio", "warning");
    } else if (fechaFin === "") {
      swal("Error", "Seleccione una fecha de fin", "warning");
    } else if (idAgente === 0) {
      swal("Error", "Seleccione un agente", "warning");
    } else {
      executeGuardarPryProyPlan({
        data: {
          usuario: correoUsuario,
          pwd: passwordUsuario,
          rfc: rfcEmpresa,
          idsubmenu: idSubmenu,
          idProyPlan: id,
          idproyecto: idProyecto,
          idactividades: id === 0 ? idActividadSelected : idActividad,
          nombre: nombre,
          fecini: fechaInicio,
          fecfin: fechaFin,
          idagente: idAgente,
          accion: id === 0 ? 1 : 2,
        },
      });
    }
  };

  const handleBorrarPlan = () => {
    if (idPlanSelected === 0) {
      swal("Error", "Seleccione un plan", "warning");
    } else {
      swal({
        text: `¿Está seguro de eliminar este plan?`,
        buttons: ["No", "Sí"],
        dangerMode: true,
      }).then((value) => {
        if (value) {
          executeBorrarPryProyPlan({
            data: {
              usuario: correoUsuario,
              pwd: passwordUsuario,
              rfc: rfcEmpresa,
              idsubmenu: idSubmenu,
              idProyPlan: idPlanSelected,
            },
          });
        }
      });
    }
  };

  const handleLimpiarEdicionPlan = () => {
    setInfoPlan({
      id: 0,
      nombre: "",
      fechaInicio: moment().format("YYYY-MM-DD"),
      fechaFin: "",
      idAgente: 0,
      idActividad: 0,
    });
  };

  return (
    <Grid container spacing={3} justify="center" style={{ marginBottom: 15 }}>
      <Grid item xs={12}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} justify="center">
              <Grid item xs={12} style={{ textAlign: "end" }}>
                {infoPlan.id !== 0 ? (
                  <Tooltip title="Cancelar">
                    <IconButton
                      style={{
                        float: "right",
                        margin: 5,
                      }}
                      onClick={handleLimpiarEdicionPlan}
                    >
                      <CloseIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <Tooltip
                  title="Guardar Plan"
                  disabled={permisosSubmenu < 2}
                  style={{ display: "inline-block" }}
                >
                  <span>
                    <IconButton
                      style={{
                        background: "#1769aa",
                        margin: 5,
                      }}
                      disabled={permisosSubmenu < 2}
                      onClick={handleGuardarPlan}
                    >
                      <SaveIcon
                        style={{
                          color: permisosSubmenu < 2 ? "gray" : "#ffffff",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title="Eliminar Plan"
                  disabled={permisosSubmenu < 3}
                  style={{ display: "inline-block" }}
                >
                  <span>
                    <IconButton
                      style={{
                        background: "#f50057",
                        margin: 5,
                      }}
                      disabled={permisosSubmenu < 3}
                      onClick={handleBorrarPlan}
                    >
                      <DeleteIcon
                        style={{
                          color: permisosSubmenu < 3 ? "gray" : "#ffffff",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  id="nombre"
                  label="Nombre"
                  variant="outlined"
                  type="text"
                  value={infoPlan.nombre}
                  inputProps={{
                    maxLength: 100,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={handleInputsInfoPlanChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.textFields}
                  id="fechaInicio"
                  label="Fecha Inicial"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  type="date"
                  value={infoPlan.fechaInicio}
                  onChange={handleInputsInfoPlanChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.textFields}
                  id="fechaFin"
                  label="Fecha Fin"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  type="date"
                  value={infoPlan.fechaFin}
                  onChange={handleInputsInfoPlanChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFields}
                  select
                  SelectProps={{
                    native: true,
                  }}
                  id="idAgente"
                  variant="outlined"
                  label="Agente"
                  type="text"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  value={infoPlan.idAgente}
                  onChange={handleInputsInfoPlanChange}
                >
                  <option value={0}>Elija un agente</option>
                  {agentesPersonas
                    .filter(
                      (agentePersona) => agentePersona.idProyecto === idProyecto
                    )
                    .map((agente, index) => (
                      <option key={index} value={agente.idAgentePersona}>
                        {agente.agente}
                      </option>
                    ))}
                </TextField>
              </Grid>
              {infoPlan.id !== 0 ? (
                <Grid item xs={12}>
                  <TextField
                    className={classes.textFields}
                    select
                    SelectProps={{
                      native: true,
                    }}
                    id="idActividad"
                    variant="outlined"
                    label="Actividad"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    value={infoPlan.idActividad}
                    onChange={handleInputsInfoPlanChange}
                  >
                    <option value={0}>Elija una actividad</option>
                    {actividades.map((actividad, indexActividad) => {
                      return (
                        <option key={indexActividad} value={actividad.id}>
                          {actividad.Actividad}
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container>
              <Typography variant="subtitle2">Planes Registrados</Typography>
              <Grid item xs={12}>
                <Paper elevation={3}>
                  <List
                    component="nav"
                    aria-label="lista planes"
                    style={{ height: "320px", padding: 0, overflow: "auto" }}
                  >
                    {planesFilter.length > 0 ? (
                      planesFilter.map((plan, indexPlan) => {
                        return (
                          <ListItem
                            key={indexPlan}
                            button
                            style={{
                              background:
                                idPlanSelected === plan.id ? "#4caf50" : "",
                            }}
                            selected={idPlanSelected === plan.id}
                            onClick={() => {
                              setIdActividadSelected(
                                plan.idactividades !== 0 &&
                                  plan.idactividades !== null
                                  ? plan.idactividades
                                  : 0
                              );
                              setActividadTitulo(
                                plan.Actividad !== "" && plan.Actividad !== null
                                  ? plan.Actividad
                                  : ""
                              );
                              setIdPlanSelected(
                                idPlanSelected === plan.id ? 0 : plan.id
                              );
                              setPlanTitulo(
                                idPlanSelected === plan.id ? "" : plan.nombre
                              );
                            }}
                          >
                            <ListItemText
                              primary={`${plan.nombre}`}
                              secondary={`Actividad: ${plan.Actividad}`}
                            />
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <ListItemText
                          style={{ textAlign: "center" }}
                          primary="No hay Planes"
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const stylesPDF = StyleSheet.create({
  page: {
    flexDirection: "row",
    padding: 15,
  },
  pageConfig: {
    padding: 15,
  },
  body: {
    flexGrow: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: "row",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row", cursor: "pointer" },
  tableColProyectos: {
    width: 100 / 10 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColActividades: {
    width: 100 / 11 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColAcciones: {
    width: 100 / 9 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDocumentos: {
    width: 100 / 3 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: { margin: "auto", marginTop: 5, fontSize: 12 },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  tableCellLink: { margin: "auto", marginTop: 5, fontSize: 10, color: "blue" },
  linksDocumentos: {
    color: "blue",
  },
});

function ReportePorProyecto(props) {
  const idProyecto = props.idProyecto;
  const setLoading = props.setLoading;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const idSubmenu = props.idSubmenu;

  /* if (localStorage.getItem("dataTemporal")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("dataTemporal"),
        "mysecretpassword"
      );
      correoUsuario = decodedToken.data.correoUsuario;
      passwordUsuario = decodedToken.data.passwordUsuario;
      rfcEmpresa = decodedToken.data.rfcEmpresa;
      idSubmenu = decodedToken.data.idSubmenu;
    } catch (err) {
      localStorage.removeItem("dataTemporal");
    }
  } */

  const fechaActual = moment();
  const [actividadesProyectosData, setActividadesProyectosData] = useState([]);
  const [accionesProyectosData, setAccionesProyectosData] = useState([]);
  const [documentosProyectosData, setDocumentosProyectosData] = useState([]);
  const estatus = ["Pendiente", "En proceso", "Terminado", "Cerrado"];

  const [
    {
      data: getPryProyActividadesInfoData,
      loading: getPryProyActividadesLoading,
      error: getPryProyActividadesError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyActividadesInfo`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        IdProyecto: idProyecto,
        reportes: 0,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyActividadesInfoData) {
        if (getPryProyActividadesInfoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getPryProyActividadesInfoData.error),
            "warning"
          );
        } else {
          let actividadesData = [];
          let accionesData = [];
          let documentosData = [];
          for (
            let x = 0;
            x < getPryProyActividadesInfoData.actividadesInfo.length;
            x++
          ) {
            actividadesData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              actividades:
                getPryProyActividadesInfoData.actividadesInfo[x].Actividades,
            });
            accionesData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              acciones:
                getPryProyActividadesInfoData.actividadesInfo[x].Acciones,
            });
            documentosData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              documentos:
                getPryProyActividadesInfoData.actividadesInfo[x].Documentos,
            });
          }
          setActividadesProyectosData(actividadesData);
          setAccionesProyectosData(accionesData);
          setDocumentosProyectosData(documentosData);
        }
      }
    }

    checkData();
  }, [getPryProyActividadesInfoData]);

  if (getPryProyActividadesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPryProyActividadesError) {
    return <ErrorQueryDB />;
  }
  return (
    <Document>
        {actividadesProyectosData.map(
          (actividadesProyecto, indexActividadesProyecto) => (
            <Page
              key={indexActividadesProyecto}
              size="A4"
              style={stylesPDF.page}
            >
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Image src={DublockLogo} style={{ width: "200px" }} />
                </View>
                <View style={stylesPDF.row}>
                  <Text style={{ textAlign: "center" }}>
                    Detalle de Proyecto
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {actividadesProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Ps</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>NV</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecIni</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecFin</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Avance</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Agente</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Estatus</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecUltAccion</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Doctos</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Dias Retraso</Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {actividadesProyecto.actividades.map((actividad, index) => {
                    let diasRetraso = 0;
                    diasRetraso =
                      actividad.Avance !== 100 &&
                      actividad.FecFin < fechaActual.format("YYYY-MM-DD")
                        ? fechaActual.diff(actividad.FecFin, "days")
                        : 0;
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColActividades}>
                          <Text
                            id={`actividad${actividad.id}`}
                            style={stylesPDF.tableCell}
                          >
                            {actividad.Pos}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Nivel}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Actividad}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.FecIni}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.FecFin}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Avance}%
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Agente}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {estatus[actividad.Estatus - 1]}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          {actividad.idUltimaAccion !== 0 ? (
                            <LinkPdf
                              style={stylesPDF.tableCellLink}
                              src={`#accion${actividad.idUltimaAccion}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {actividad.FecUltAccion}
                              </Text>
                            </LinkPdf>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {actividad.FecUltAccion}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          {actividad.numDocumentos > 0 ? (
                            <LinkPdf
                              style={stylesPDF.tableCellLink}
                              src={`#documentoActividad${actividad.id}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {actividad.numDocumentos}
                              </Text>
                            </LinkPdf>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {actividad.numDocumentos}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>{diasRetraso}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
        {accionesProyectosData.map(
          (accionesProyecto, indexAccionesProyecto) => (
            <Page key={indexAccionesProyecto} size="A4" style={stylesPDF.page}>
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Text style={{ textAlign: "center" }}>
                    Detalle de Acciones
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {accionesProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Accion</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>FecFinActividad</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>FechaAccion</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Ejecutó</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Avance</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Estatus</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Docto</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>
                        DiasRetrasoVsPlan
                      </Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {accionesProyecto.acciones.map((accion, index) => {
                    let diasRetraso = 0;
                    diasRetraso = moment(accion.fecha).diff(
                      accion.fecFinActividad,
                      "days"
                    );
                    diasRetraso = diasRetraso > 0 ? diasRetraso : 0;
                    let personas = "";
                    for (let x = 0; x < accion.personas.length; x++) {
                      personas += accion.personas[x].Agente;
                      personas +=
                        x === accion.personas.length - 1
                          ? ""
                          : x === accion.personas.length - 2
                          ? " y "
                          : " ,";
                    }
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColAcciones}>
                          <LinkPdf
                            style={stylesPDF.tableCellLink}
                            src={`#actividad${accion.idactividad}`}
                          >
                            <Text
                              id={`accion${accion.id}`}
                              style={stylesPDF.tableCell}
                            >
                              {accion.Actividad}
                            </Text>
                          </LinkPdf>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.nombre}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.fecFinActividad}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.fecha}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>{personas}</Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.Avance}%
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {estatus[accion.estatus - 1]}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          {accion.numDocumentos > 0 ? (
                            <LinkPdf
                              style={stylesPDF.tableCellLink}
                              src={`#documentoaccion${accion.id}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {accion.numDocumentos}
                              </Text>
                            </LinkPdf>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {accion.numDocumentos}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>{diasRetraso}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
        {documentosProyectosData.map(
          (documentosProyecto, indexDocumentosProyecto) => (
            <Page
              key={indexDocumentosProyecto}
              size="A4"
              style={stylesPDF.page}
            >
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Text
                    id={`documentos${documentosProyecto.idProyecto}`}
                    style={{ textAlign: "center" }}
                  >
                    Detalle de Documentos
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {documentosProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Accion</Text>
                    </View>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Documento</Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {documentosProyecto.documentos.map((documento, index) => {
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColDocumentos}>
                          {documento.idactividad !== 0 ? (
                            <LinkPdf
                              style={stylesPDF.linksDocumentos}
                              src={`#actividad${documento.idactividad}`}
                            >
                              <Text
                                id={`documentoActividad${documento.idactividad}`}
                                style={stylesPDF.tableCell}
                              >
                                {documento.Actividad}
                              </Text>
                            </LinkPdf>
                          ) : (
                            <Text
                              id={`documentoActividad${documento.idactividad}`}
                              style={stylesPDF.tableCell}
                            >
                              {documento.Actividad}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColDocumentos}>
                          {documento.idaccion !== 0 ? (
                            <LinkPdf
                              style={stylesPDF.linksDocumentos}
                              src={`#accion${documento.idaccion}`}
                            >
                              <Text
                                id={`documentoAccion${documento.idaccion}`}
                                style={stylesPDF.tableCell}
                              >
                                {documento.Accion}
                              </Text>
                            </LinkPdf>
                          ) : (
                            <Text
                              id={`documentoAccion${documento.idaccion}`}
                              style={stylesPDF.tableCell}
                            >
                              {documento.Accion}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColDocumentos}>
                          <LinkPdf
                            style={stylesPDF.linksDocumentos}
                            src={documento.LinkDocumento}
                            rel="noopener noreferrer meaning"
                            target="_blank"
                          >
                            <Text style={stylesPDF.tableCell}>
                              {documento.NombreDocumento}
                            </Text>
                          </LinkPdf>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
      </Document>
  );
}