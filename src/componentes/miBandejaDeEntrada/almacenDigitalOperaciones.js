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
  ListItemIcon,
  Checkbox,
  Dialog,
  Divider,
  DialogContent,
  DialogActions,
  useMediaQuery,
  /* List,
  ListItem, */
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  ClearAll as ClearAllIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  SettingsEthernet as SettingsEthernetIcon,
  Error as ErrorIcon,
  FindInPage as FindInPageIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  /* SentimentVerySatisfied as SentimentVerySatisfiedIcon,
  SentimentVeryDissatisfied as SentimentVeryDissatisfiedIcon, */
  KeyboardReturn as KeyboardReturnIcon,
  GetApp as GetAppIcon,
} from "@material-ui/icons";
import {
  makeStyles,
  withStyles,
  lighten,
  useTheme,
} from "@material-ui/core/styles";
import clsx from "clsx";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import { verificarExtensionArchivo } from "../../helpers/extensionesArchivos";
import { Link } from "react-router-dom";
import moment from "moment";
import swal from "sweetalert";
/* import swalReact from "@sweetalert/with-react"; */
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";

const jwt = require("jsonwebtoken");

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
  toolbarRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
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

function createData(id, fecha, usuario, sucursal, detalle, acciones) {
  return { id, fecha, usuario, sucursal, detalle, acciones };
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function AlmacenDigitalOperaciones(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const idMenu =
    submenuContent.length !== 0 ? submenuContent[0].submenu.idmenu : 0;
  const idModulo = submenuContent.length !== 0 ? submenuContent[0].idModulo : 0;
  const userEmail = props.usuarioDatos.correo;
  const userPassword = props.usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const setLoading = props.setLoading;
  const empresaRFC = empresaDatos.RFC;
  const statusEmpresa = empresaDatos.statusempresa;
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [idAlmacenDigital, setIdAlmacenDigital] = useState(0);
  const [showComponent, setShowComponent] = useState(0);
  const [tittleTableComponent, setTittleTableComponent] = useState("");
  const [idSubmenu, setIdSubmenu] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [selectedAlmacen, setSelectedAlmacen] = useState(0);
  const [archivosAlmacen, setArchivosAlmacen] = useState([]);
  //const [dataTable, setDataTable] = useState([]);
  const [{ data: ADOData, loading: ADOLoading, error: ADOError }, executeADO] =
    useAxios(
      {
        url: API_BASE_URL + `/listaAlmacenDigital`,
        method: "GET",
        params: {
          usuario: userEmail,
          pwd: userPassword,
          rfc: empresaRFC,
          idsubmenu: idSubmenu,
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
    function checkData() {
      if (ADOData) {
        if (ADOData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(ADOData.error)}
            </Typography>
          );
        } else {
          //rows = [];
          filterRows = [];
          ADOData.registros.map((registro) => {
            return filterRows.push(
              createData(
                registro.id,
                registro.fechadocto,
                registro.usuario,
                registro.sucursal,
                `Registros: ${registro.totalregistros} Cargados: ${registro.totalcargados} Procesados: ${registro.procesados}`,
                <IconButton>
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              )
            );
          });
          //setDataTable(rows);
          setRows(filterRows);
        }
      }
    }

    checkData();
  }, [ADOData]);

  useEffect(() => {
    if (
      idAlmacenDigital === 0 &&
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
          setIdAlmacenDigital(decodedToken.menuTemporal.idAlmacenDigital);
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setTittleTableComponent(decodedToken.menuTemporal.tableTittle);
          setIdSubmenu(decodedToken.menuTemporal.idSubmenu);
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
          setIdAlmacenDigital(decodedToken.notificacionData.idAlmacenDigital);
          setShowComponent(decodedToken.notificacionData.showComponent);
          setTittleTableComponent(decodedToken.notificacionData.tableTittle);
          setIdSubmenu(decodedToken.notificacionData.idSubmenu);
          /* setPage(
            decodedToken.notificacionData.page
              ? decodedToken.notificacionData.page
              : 0
          ); */
          setBusquedaFiltro(
            decodedToken.notificacionData.busquedaFiltro
              ? decodedToken.notificacionData.busquedaFiltro
              : ""
          );
        } catch (err) {
          localStorage.removeItem("notificacionData");
        }
      }
    }
  }, [idAlmacenDigital, showComponent, tittleTableComponent, idSubmenu]);

  if (ADOLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (ADOError) {
    return <ErrorQueryDB />;
  }

  const getPermisosSubmenu = (idSubmenu) => {
    for (let x = 0; x < submenuContent.length; x++) {
      if (idSubmenu === submenuContent[x].submenu.idsubmenu) {
        return submenuContent[x].permisos;
      }
    }
    return 0;
  };

  return (
    <div>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Almacén Digital Operaciones
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
                    //if (showComponent === 2) {
                    executeADO({
                      data: {
                        usuario: userEmail,
                        pwd: userPassword,
                        rfc: empresaRFC,
                        idsubmenu: content.submenu.idsubmenu,
                      },
                    });
                    //}
                    setShowComponent(1);
                    setIdSubmenu(content.submenu.idsubmenu);
                    setTittleTableComponent(content.submenu.nombre_submenu);
                    setSelectedAlmacen(0);
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          tableTittle: content.submenu.nombre_submenu,
                          showComponent: 1,
                          idAlmacenDigital: idAlmacenDigital,
                          idSubmenu: content.submenu.idsubmenu,
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
          <TablaADO
            getPermisosSubmenu={getPermisosSubmenu}
            tittle={tittleTableComponent}
            setShowComponent={setShowComponent}
            userEmail={userEmail}
            userPassword={userPassword}
            empresaRFC={empresaRFC}
            rows={rows}
            setRows={setRows}
            page={page}
            setPage={setPage}
            busquedaFiltro={busquedaFiltro}
            setBusquedaFiltro={setBusquedaFiltro}
            idAlmacenDigital={idAlmacenDigital}
            setIdAlmacenDigital={setIdAlmacenDigital}
            empresaDatos={empresaDatos}
            idMenu={idMenu}
            idSubmenu={idSubmenu}
            idModulo={idModulo}
            executeADO={executeADO}
            setLoading={setLoading}
            statusEmpresa={statusEmpresa}
            permisosSubmenu={permisosSubmenu}
            selectedAlmacen={selectedAlmacen}
            setSelectedAlmacen={setSelectedAlmacen}
            setArchivosAlmacen={setArchivosAlmacen}
          />
        ) : showComponent === 2 ? (
          <VerDocumentos
            setShowComponent={setShowComponent}
            tittle={tittleTableComponent}
            userEmail={userEmail}
            userPassword={userPassword}
            empresaRFC={empresaRFC}
            empresaDatos={empresaDatos}
            idAlmacenDigital={idAlmacenDigital}
            idSubmenu={idSubmenu}
            idMenu={idMenu}
            idModulo={idModulo}
            executeADO={executeADO}
            setLoading={setLoading}
          />
        ) : showComponent === 3 ? (
          <ResumenDetalladoDeCarga
            setShowComponent={setShowComponent}
            archivosAlmacen={archivosAlmacen}
          />
        ) : null}
      </Card>
    </div>
  );
}

function TablaADO(props) {
  const classes = useStyles();
  const theme = useTheme();
  const now = moment().format("YYYY-MM-DD");
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const getPermisosSubmenu = props.getPermisosSubmenu;
  const userEmail = props.userEmail;
  const userPassword = props.userPassword;
  const empresaRFC = props.empresaRFC;
  const tableTittle = props.tittle;
  const rows = props.rows;
  const setRows = props.setRows;
  const page = props.page;
  const setPage = props.setPage;
  const busquedaFiltro = props.busquedaFiltro;
  const setBusquedaFiltro = props.setBusquedaFiltro;
  const setShowComponent = props.setShowComponent;
  const idAlmacenDigital = props.idAlmacenDigital;
  const setIdAlmacenDigital = props.setIdAlmacenDigital;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  const empresaDatos = props.empresaDatos;
  const executeADO = props.executeADO;
  const setLoading = props.setLoading;
  const statusEmpresa = props.statusEmpresa;
  const permisosSubmenu = props.permisosSubmenu;
  const selectedAlmacen = props.selectedAlmacen;
  const setSelectedAlmacen = props.setSelectedAlmacen;
  const setArchivosAlmacen = props.setArchivosAlmacen;
  const sucursalesEmpresa = empresaDatos.sucursales;
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("fecha");
  //const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [openDialogNuevoADO, setOpenDialogNuevoADO] = useState(false);
  const [nuevoADO, setNuevoADO] = useState({
    archivos: null,
    fecha: now,
    sucursal: "0",
    comentarios: "",
  });
  //const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [
    {
      data: cargaArchivosADOData,
      loading: cargaArchivosADOLoading,
      error: cargaArchivosADOError,
    },
    executeCargaArchivos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cargaArchivosAlmacenDigital`,
      method: "POST",
    },
    {
      manual: true,
      useCache: false,
    }
  );

  useEffect(() => {
    if (localStorage.getItem("notificacionData")) {
      stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
        if (row.id === selectedAlmacen) {
          const decodedToken = jwt.verify(
            localStorage.getItem("notificacionData"),
            "mysecretpassword"
          );
          setPage(
            decodedToken.notificacionData.page === -1
              ? Math.ceil((index + 1) / 10) - 1
              : page
          );
          decodedToken.notificacionData.page =
            decodedToken.notificacionData.page === -1
              ? Math.ceil((index + 1) / 10) - 1
              : page;
          const notificacionData = decodedToken.notificacionData;
          const token = jwt.sign(
            {
              notificacionData,
            },
            "mysecretpassword"
          );
          localStorage.setItem("notificacionData", token);
        }
        return null;
      });
    }
  }, [rows, selectedAlmacen, setPage, order, orderBy, page]);

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
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRows[x]);
        }
      }
      return dataFilter;
    }

    setRows(busquedaFiltro.trim() !== "" ? getFilterRows() : filterRows);
    if (localStorage.getItem("notificacionData")) {
      const decodedToken = jwt.verify(
        localStorage.getItem("notificacionData"),
        "mysecretpassword"
      );
      setSelectedAlmacen(decodedToken.notificacionData.idAlmacenDigital);
      //setSelectedAlmacen(decodedToken.notificacionData.idAlmacenDigital);
      /* setPage(
        rows.length < rowsPerPage
          ? 0
          : decodedToken.notificacionData.page
          ? decodedToken.notificacionData.page
          : 0
      ); */
      const token = jwt.sign(
        {
          menuTemporal: {
            tableTittle: tableTittle,
            showComponent: 1,
            idAlmacenDigital: idAlmacenDigital,
            idSubmenu: idSubmenu,
            page:
              rows.length < rowsPerPage && rows.length !== 0
                ? 0
                : decodedToken.notificacionData.page
                ? decodedToken.notificacionData.page
                : 0,
            busquedaFiltro: busquedaFiltro,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    } else if (localStorage.getItem("menuTemporal")) {
      const decodedToken = jwt.verify(
        localStorage.getItem("menuTemporal"),
        "mysecretpassword"
      );

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
            idAlmacenDigital: idAlmacenDigital,
            idSubmenu: idSubmenu,
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
    }
  }, [
    busquedaFiltro,
    setRows,
    setPage,
    idAlmacenDigital,
    idSubmenu,
    rows.length,
    rowsPerPage,
    tableTittle,
    setSelectedAlmacen,
  ]);

  useEffect(() => {
    function checkData() {
      if (cargaArchivosADOData) {
        if (cargaArchivosADOData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(cargaArchivosADOData.error)}
            </Typography>
          );
        } else {
          setArchivosAlmacen(cargaArchivosADOData.archivos);
          swal("Almacen Agregado", "Almacen agregado con éxito", "success");
          executeADO();
          setShowComponent(3);
        }
      }
    }

    checkData();
  }, [cargaArchivosADOData, executeADO, setArchivosAlmacen, setShowComponent]);

  if (cargaArchivosADOLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (cargaArchivosADOError) {
    return <ErrorQueryDB />;
  }

  const getSucursalesEmpresa = () => {
    return sucursalesEmpresa.map((sucursal, index) => {
      return (
        <option key={index} value={sucursal.sucursal}>
          {sucursal.sucursal}
        </option>
      );
    });
  };

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
          idAlmacenDigital: idAlmacenDigital,
          idSubmenu: idSubmenu,
          page: newPage,
          busquedaFiltro: busquedaFiltro,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
    //localStorage.removeItem("notificacionData");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleClickOpenDialogNuevoADO = () => {
    setOpenDialogNuevoADO(true);
  };

  const handleCloseDialogNuevoADO = () => {
    setOpenDialogNuevoADO(false);
  };

  const newADO = () => {
    const { archivos, fecha, sucursal } = nuevoADO;
    if (archivos === null || archivos.length === 0) {
      swal("Faltan llenar campos", "Seleccione un archivo", "warning");
    } else {
      for (let x = 0; x < archivos.length; x++) {
        if (!verificarExtensionArchivo(archivos[x].name)) {
          swal(
            "Error de archivo",
            `Extensión de archivo no permitida en archivo ${archivos[x].name}`,
            "warning"
          );
          return;
        }
      }
      if (fecha === "") {
        swal("Faltan llenar campos", "Seleccione una fecha", "warning");
      } else if (sucursal === "0") {
        swal("Faltan llenar campos", "Seleccione una sucursal", "warning");
      } else {
        const formData = new FormData();
        formData.append("usuario", userEmail);
        formData.append("pwd", userPassword);
        formData.append("rfc", empresaRFC);
        formData.append("idmodulo", idModulo);
        formData.append("idmenu", idMenu);
        formData.append("idsubmenu", idSubmenu);
        formData.append("fechadocto", nuevoADO.fecha);
        formData.append("sucursal", nuevoADO.sucursal);
        formData.append("observaciones", nuevoADO.comentarios);
        formData.append("usuario_storage", empresaDatos.usuario_storage);
        formData.append("password_storage", empresaDatos.password_storage);
        for (let x = 0; x < archivos.length; x++) {
          formData.append(x, archivos[x]);
        }

        executeCargaArchivos({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    }
  };

  return (
    <div>
      <Paper className={classes.paper}>
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
              {getPermisosSubmenu(idSubmenu) >= 2 ? (
                <Tooltip title="Nuevo">
                  <span>
                    <IconButton
                      aria-label="nuevo"
                      disabled={permisosSubmenu < 1 || statusEmpresa !== 1}
                      style={{ float: "right" }}
                      onClick={() => {
                        handleClickOpenDialogNuevoADO();
                        //localStorage.removeItem("notificacionData");
                      }}
                    >
                      <AddCircleIcon
                        style={{
                          color:
                            permisosSubmenu < 1 || statusEmpresa !== 1
                              ? "disabled"
                              : "#4caf50",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Nuevo">
                  <span>
                    <AddCircleIcon disabled color="disabled" />
                  </span>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
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
                  //localStorage.removeItem("notificacionData");
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
            />
            <TableBody>
              {rows.length > 0 ? (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell
                          padding="checkbox"
                          style={{
                            background:
                              selectedAlmacen === row.id ? "green" : "",
                          }}
                        >
                          {selectedAlmacen === row.id ? (
                            <Link to="/">
                              <Tooltip title="Regresar a Home">
                                <IconButton
                                  onClick={() => {
                                    localStorage.removeItem("notificacionData");
                                  }}
                                >
                                  <KeyboardReturnIcon />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          ) : null}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.fecha}
                        </TableCell>
                        <TableCell align="right">{row.usuario}</TableCell>
                        <TableCell align="right">{row.sucursal}</TableCell>
                        <TableCell align="right">{row.detalle}</TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => {
                            handleOpenMenu(e);
                            setIdAlmacenDigital(row.id);
                          }}
                        >
                          {row.acciones}
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
                      No hay archivos disponibles
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
            //localStorage.removeItem("notificacionData");
            /* const token = jwt.sign(
              {
                menuTemporal: {
                  tableTittle: tableTittle,
                  showComponent: 2,
                  idAlmacenDigital: idAlmacenDigital,
                  idSubmenu: idSubmenu
                }
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token); */
          }}
        >
          <ListItemIcon>
            <FindInPageIcon fontSize="small" style={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText primary="Ver Documentos" />
        </MenuItem>
      </StyledMenu>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogNuevoADO}
        onClose={handleCloseDialogNuevoADO}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg"
        fullWidth={true}
      >
        <Typography
          variant="h5"
          style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}
        >
          Almacén Digital
        </Typography>
        <Divider />
        <DialogContent>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                className={classes.textFields}
                id="archivoNewADO"
                variant="outlined"
                type="file"
                margin="normal"
                inputProps={{
                  multiple: true,
                }}
                onChange={(e) => {
                  setNuevoADO({
                    ...nuevoADO,
                    archivos: e.target.files,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                type="date"
                value={nuevoADO.fecha}
                label="Fecha del Documento"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setNuevoADO({
                    ...nuevoADO,
                    fecha: e.target.value,
                  });
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
                label="Sucursales"
                value={nuevoADO.sucursal}
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setNuevoADO({
                    ...nuevoADO,
                    sucursal: e.target.value,
                  });
                }}
              >
                <option value="0">Selecciona una sucursal</option>
                {getSucursalesEmpresa()}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-static"
                style={{ width: "100%" }}
                label="Comentarios"
                value={nuevoADO.comentarios}
                multiline
                rows="5"
                variant="outlined"
                onChange={(e) => {
                  setNuevoADO({
                    ...nuevoADO,
                    comentarios: e.target.value,
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={permisosSubmenu < 1 || statusEmpresa !== 1}
            onClick={() => {
              newADO();
            }}
            color="primary"
            variant="contained"
            autoFocus
          >
            Continuar
          </Button>
          <Button
            onClick={handleCloseDialogNuevoADO}
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

function VerDocumentos(props) {
  const classes = useStyles();
  //const page = props.page;
  const tittle = props.tittle;
  const userEmail = props.userEmail;
  const userPassword = props.userPassword;
  const empresaRFC = props.empresaRFC;
  const empresaDatos = props.empresaDatos;
  const setShowComponent = props.setShowComponent;
  const idAlmacenDigital = props.idAlmacenDigital;
  const idModulo = props.idModulo;
  const idMenu = props.idMenu;
  const idSubmenu = props.idSubmenu;
  const executeADO = props.executeADO;
  const setLoading = props.setLoading;
  const [selected, setSelected] = useState([]);
  const [selectedRutaArchivo, setSelectedRutaArchivo] = useState([]);
  const [numSelected, setNumSelected] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [rutaArchivo, setRutaArchivo] = useState("");
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [
    {
      data: archivosADOData,
      loading: archivosADOLoading,
      error: archivosADOError,
    },
    executeArchivosADO,
  ] = useAxios({
    url: API_BASE_URL + `/archivosAlmacenDigital`,
    method: "GET",
    params: {
      usuario: userEmail,
      pwd: userPassword,
      rfc: empresaRFC,
      idalmacendigital: idAlmacenDigital,
    },
  });
  const [
    {
      data: eliminarArchivosADOData,
      loading: eliminarArchivosADOLoading,
      error: eliminarArchivosADOError,
    },
    executeEliminarArchivos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaArchivosDigital`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const [
    {
      data: descargarArchivosAlmacenDigitalData,
      loading: descargarArchivosAlmacenDigitalLoading,
      error: descargarArchivosAlmacenDigitalError,
    },
    executeDescargarArchivosAlmacenDigital,
  ] = useAxios(
    {
      url: API_BASE_URL + `/descargarArchivosAlmacenDigital`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    setNumSelected(selected.length);
  }, [selected]);

  useEffect(() => {
    if (archivosADOData) {
      setRowCount(archivosADOData.archivos.length);
    }
  }, [archivosADOData]);

  useEffect(() => {
    async function eliminarArchivos() {
      if (eliminarArchivosADOData) {
        if (eliminarArchivosADOData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(eliminarArchivosADOData.error)}
            </Typography>
          );
        } else {
          setNumSelected(0);
          swal(
            "Eliminación realizada con éxito",
            "La eliminación de el/los archivo(s) se realizó con éxito",
            "success"
          );
          executeArchivosADO();
        }
      }
    }
    eliminarArchivos();
  }, [eliminarArchivosADOData, executeArchivosADO]);

  useEffect(() => {
    function eliminarArchivos() {
      if (descargarArchivosAlmacenDigitalData) {
        if (descargarArchivosAlmacenDigitalData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(descargarArchivosAlmacenDigitalData.error)}
            </Typography>
          );
        } else {
          if (descargarArchivosAlmacenDigitalData.link !== "") {
            var link = document.createElement("a");
            link.setAttribute("href", descargarArchivosAlmacenDigitalData.link + "/download");
            link.setAttribute("download", true);
            link.click();
            /* window.open(descargarArchivosAlmacenDigitalData.link + "/download"); */
          } else {
            swal(
              "Error en la descarga",
              "No fue posible descargar el/los archivo(s)",
              "warning"
            );
          }
        }
      }
    }
    eliminarArchivos();
  }, [descargarArchivosAlmacenDigitalData]);

  useEffect(() => {
    executeArchivosADO();
  }, [executeArchivosADO]);

  if (
    archivosADOLoading ||
    eliminarArchivosADOLoading ||
    descargarArchivosAlmacenDigitalLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }

  if (
    archivosADOError ||
    eliminarArchivosADOError ||
    descargarArchivosAlmacenDigitalError
  ) {
    return <ErrorQueryDB />;
  }

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleSelectAllClickCheckBox = (event) => {
    if (event.target.checked) {
      let newSelectedsRutasArchivo = [];
      const newSelecteds = archivosADOData.archivos.map(
        (archivo) => archivo.id
      );
      setSelected(newSelecteds);
      archivosADOData.archivos.map((archivo) => {
        newSelectedsRutasArchivo.push(`${archivo.download}/download`);
        return newSelectedsRutasArchivo;
      });
      setSelectedRutaArchivo(newSelectedsRutasArchivo);
      return;
    }
    setSelected([]);
    setSelectedRutaArchivo([]);
  };

  const handleClickCheckBox = (event, id, rutaArchivo) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newRutaArchivo = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newRutaArchivo = newRutaArchivo.concat(selectedRutaArchivo, rutaArchivo);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newRutaArchivo = newRutaArchivo.concat(selectedRutaArchivo.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newRutaArchivo = newRutaArchivo.concat(selectedRutaArchivo.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newRutaArchivo = newRutaArchivo.concat(
        selectedRutaArchivo.slice(0, selectedIndex),
        selectedRutaArchivo.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setSelectedRutaArchivo(newRutaArchivo);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const getArchivosADO = () => {
    return archivosADOData.archivos.map((archivo, index) => {
      const isItemSelected = isSelected(archivo.id);
      const labelId = `enhanced-table-checkbox-${index}`;
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={isItemSelected}
              inputProps={{ "aria-labelledby": labelId }}
              onClick={(e) => {
                handleClickCheckBox(
                  e,
                  archivo.id,
                  `${archivo.download}/download`
                );
              }}
            />
          </TableCell>
          <TableCell component="th" scope="row">
            <Link
              to=""
              onClick={(e) => {
                e.preventDefault();
                window.open(archivo.download);
              }}
              style={{
                textDecoration: "none",
                color: "#087ED7",
              }}
            >
              {archivo.documento}
            </Link>
          </TableCell>
          <TableCell align="right">{`${
            archivo.conceptoadw !== null ? archivo.conceptoadw : "Sin Concepto"
          } - ${archivo.serieadw !== null ? archivo.serieadw : "Sin Serie"} - ${
            archivo.folioadw !== null ? archivo.folioadw : "Sin Folio"
          }`}</TableCell>
          <TableCell align="right">{archivo.agente}</TableCell>
          <TableCell align="right">
            {archivo.fechaprocesado !== null
              ? archivo.fechaprocesado
              : "Sin Fecha Procesado"}
          </TableCell>
          <TableCell align="right">
            <IconButton
              onClick={(e) => {
                handleOpenMenu(e);
                setRutaArchivo(archivo.download);
              }}
            >
              <SettingsEthernetIcon style={{ color: "black" }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const eliminarArchivos = () => {
    swal({
      text: `¿Está seguro de eliminar ${
        numSelected > 1 ? "los " + numSelected + " archivos" : "el archivo"
      }?`,
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        let archivos = [];
        selected.map((idarchivo) => {
          return archivos.push({ idarchivo: idarchivo });
        });
        executeEliminarArchivos({
          data: {
            usuario: userEmail,
            pwd: userPassword,
            rfc: empresaRFC,
            idmodulo: idModulo,
            idmenu: idMenu,
            idsubmenu: idSubmenu,
            usuario_storage: empresaDatos.usuario_storage,
            password_storage: empresaDatos.password_storage,
            archivos: archivos,
          },
        });
      }
    });
  };

  return (
    <div>
      {numSelected > 0 ? (
        <Toolbar
          className={clsx(classes.toolbarRoot, {
            [classes.highlight]: numSelected > 0,
          })}
        >
          <Typography
            style={{ marginTop: "10px", marginBottom: "10px" }}
            color="inherit"
            variant="subtitle1"
          >
            {numSelected} seleccionados
          </Typography>
          <div style={{ float: "right", marginLeft: "auto" }}>
            <Tooltip title="Descargar seleccionado(s)">
              <IconButton
                onClick={() => {
                  if (selected.length > 1) {
                    let extencionesArchivos = [];
                    for (let x = 0; x < selected.length; x++) {
                      let archivo = archivosADOData.archivos.filter(
                        (archivo) => archivo.id === selected[x]
                      );
                      let archivosDesglosado = archivo[0].documento.split(".");
                      extencionesArchivos.push(
                        archivosDesglosado[archivosDesglosado.length - 1]
                      );
                    }
                    executeDescargarArchivosAlmacenDigital({
                      data: {
                        usuario: userEmail,
                        pwd: userPassword,
                        rfc: empresaRFC,
                        idmodulo: idModulo,
                        idmenu: idMenu,
                        idsubmenu: idSubmenu,
                        usuario_storage: empresaDatos.usuario_storage,
                        password_storage: empresaDatos.password_storage,
                        fechaActual: moment().format("YYYYMMDDHmmss"),
                        archivos: selectedRutaArchivo,
                        extencionesArchivos: extencionesArchivos,
                      },
                    });
                  } else {
                    var link = document.createElement("a");
                    link.setAttribute("href", selectedRutaArchivo[0]);
                    link.setAttribute("download", true);
                    link.click();
                  }
                }}
              >
                <GetAppIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar seleccionado(s)">
              <IconButton
                onClick={() => {
                  eliminarArchivos();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      ) : (
        <Fragment>
          <Tooltip
            title="Regresar"
            style={{ float: "left", marginBottom: "10px" }}
          >
            <IconButton
              onClick={() => {
                executeADO();
                setShowComponent(1);
                /* const token = jwt.sign(
              {
                menuTemporal: {
                  tableTittle: tableTittle,
                  showComponent: 1,
                  idAlmacenDigital: idAlmacenDigital,
                  idSubmenu: idSubmenu
                }
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token); */
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" style={{ float: "left", marginTop: "10px" }}>
            {tittle}
          </Typography>
        </Fragment>
      )}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Tooltip title="Seleccionar todos">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllClickCheckBox}
                    inputProps={{ "aria-label": "select all desserts" }}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>
                <strong>Archivo(s)</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Concepto-Serie-Folio</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Agente</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Fecha Procesado</strong>
              </TableCell>
              <TableCell align="right">
                <SettingsIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getArchivosADO()}</TableBody>
        </Table>
      </TableContainer>
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
            window.open(rutaArchivo);
          }}
        >
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            /* window.open(`${rutaArchivo}/download`); */
          }}
        >
          <a
            href={`${rutaArchivo}/download`}
            download
            style={{ textDecoration: "none", color: "#000000" }}
          >
            <ListItemText primary="Descargar" />
          </a>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function ResumenDetalladoDeCarga(props) {
  const classes = useStyles();
  const archivosAlmacen = props.archivosAlmacen;
  const setShowComponent = props.setShowComponent;
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        style={{ alignSelf: "flex-end", marginBottom: "15px", padding: "15px" }}
      >
        <Typography className={classes.titleTable} variant="h6" id="tableTitle">
          <Tooltip title="Regresar">
            <IconButton
              aria-label="regresar"
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          RESUMEN DETALLADO DE LA CARGA DE OPERACIONES DIGITALES.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ padding: "15px" }}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow
                style={{
                  background: "#FAFAFA",
                  maxHeight: "40vh",
                  overflowY: "auto",
                }}
              >
                <TableCell>
                  <strong>ARCHIVO</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>CARGADO</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>DETALLE</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archivosAlmacen.map((archivo, index) => (
                <TableRow
                  key={index}
                  style={{
                    background: archivo.status === 0 ? "#4caf50" : "#f44336",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {archivo.archivo}
                  </TableCell>
                  <TableCell align="right">
                    {archivo.status === 0 ? "Sí" : "No"}
                  </TableCell>
                  <TableCell align="right">{archivo.detalle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
