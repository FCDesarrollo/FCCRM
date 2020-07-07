import React, { useState, useEffect } from "react";
import {
  Paper,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableHead,
  TableSortLabel,
  Grid,
  Card,
  useMediaQuery,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormGroup,
  Checkbox,
  Menu,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  AddCircle as AddCircleIcon,
  ClearAll as ClearAllIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  AccountBox as AccountBoxIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  Minimize as MinimizeIcon,
  Star as StarIcon,
  SettingsEthernet as SettingsEthernetIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import moment from "moment";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";
import jwt from "jsonwebtoken";

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
}));

function createData(id, nombre, descripcion, estatus, acciones) {
  return { id, nombre, descripcion, estatus, acciones };
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
    id: "nombre",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Nombre Perfil",
  },
  {
    id: "descripcion",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Descripción",
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

export default function Perfiles(props) {
  const classes = useStyles();
  const usuarioDatos = props.usuarioDatos;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const setLoading = props.setLoading;
  const [showComponent, setShowComponent] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("nombre");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [idPerfilEditar, setIdPerfilEditar] = useState(0);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  //const [statusPerfil, setStatusPerfil] = useState(0);

  const [
    {
      data: getPerfilesData,
      loading: getPerfilesLoading,
      error: getPerfilesError,
    },
    executeGetPerfiles,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPerfiles`,
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
      data: eliminarPerfilGlobalData,
      loading: eliminarPerfilGlobalLoading,
      error: eliminarPerfilGlobalError,
    },
    executeEliminarPerfilGlobal,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarPerfilGlobal`,
      method: "DELETE",
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
        if (decodedToken.menuTemporal.modulo === "perfiles") {
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setIdPerfilEditar(decodedToken.menuTemporal.idPerfil);
          setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
          setPage(decodedToken.menuTemporal.page);
        } else {
          const token = jwt.sign(
            {
              menuTemporal: {
                modulo: "perfiles",
                showComponent: 0,
                idPerfil: 0,
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
            modulo: "perfiles",
            showComponent: 0,
            idPerfil: 0,
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
    if (getPerfilesData) {
      if (getPerfilesData.error !== 0) {
        swal("Error", dataBaseErrores(getPerfilesData.error), "warning");
      } else {
        filterRows = [];
        getPerfilesData.perfiles.map((perfil) => {
          return filterRows.push(
            createData(
              perfil.idperfil,
              perfil.nombre,
              perfil.descripcion,
              perfil.status,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRows(filterRows);
      }
    }
  }, [getPerfilesData]);

  useEffect(() => {
    function checkData() {
      if (eliminarPerfilGlobalData) {
        if (eliminarPerfilGlobalData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminarPerfilGlobalData.error),
            "warning"
          );
        } else {
          swal("Perfil Eliminado", "Perfil eliminado con éxito", "success");
          executeGetPerfiles();
        }
      }
    }

    checkData();
  }, [eliminarPerfilGlobalData, executeGetPerfiles]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          filterRows[x].nombre
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].descripcion
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRows[x]);
        }
      }
      return dataFilter;
    }

    if (localStorage.getItem("menuTemporal")) {
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
            modulo: "perfiles",
            showComponent: 0,
            idPerfil: 0,
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
    } else {
      setRows(busquedaFiltro.trim() !== "" ? getFilterRows() : filterRows);
      setPage(rows.length < rowsPerPage ? 0 : page);
      const token = jwt.sign(
        {
          menuTemporal: {
            modulo: "perfiles",
            showComponent: 0,
            idPerfil: 0,
            page: rows.length < rowsPerPage && rows.length !== 0 ? 0 : page,
            busquedaFiltro: busquedaFiltro,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
  }, [busquedaFiltro, page, rows.length, rowsPerPage]);

  if (getPerfilesLoading || eliminarPerfilGlobalLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPerfilesError || eliminarPerfilGlobalError) {
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

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  return (
    <div>
      {showComponent === 0 ? (
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
                  Lista de Perfiles
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
                <Tooltip title="Nuevo">
                  <IconButton
                    aria-label="nuevo"
                    style={{ float: "right" }}
                    onClick={() => {
                      setShowComponent(1);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            modulo: "perfiles",
                            showComponent: 1,
                            idPerfil: idPerfilEditar,
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
                  }}
                />
              </Grid>
            </Grid>
          </Toolbar>
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
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell padding="checkbox" />
                          <TableCell component="th" id={labelId} scope="row">
                            {row.nombre}
                          </TableCell>
                          <TableCell align="right">{row.descripcion}</TableCell>
                          <TableCell align="right">
                            {row.estatus === 1 ? "Activo" : "No Activo"}
                          </TableCell>
                          <TableCell
                            align="right"
                            onClick={(e) => {
                              handleOpenMenu(e);
                              setIdPerfilEditar(row.id);
                              //setStatusPerfil(row.estatus);
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
                        No hay perfiles disponibles
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
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      ) : showComponent === 1 ? (
        <Card style={{ padding: "10px" }}>
          <CrearPerfil
            setShowComponent={setShowComponent}
            setLoading={setLoading}
            correo={correo}
            password={password}
            executeGetPerfiles={executeGetPerfiles}
            busquedaFiltro={busquedaFiltro}
            page={page}
          />
        </Card>
      ) : showComponent === 2 ? (
        <Card style={{ padding: "10px" }}>
          <EditarPerfil
            setShowComponent={setShowComponent}
            setLoading={setLoading}
            correo={correo}
            password={password}
            idPerfilEditar={idPerfilEditar}
            executeGetPerfiles={executeGetPerfiles}
            busquedaFiltro={busquedaFiltro}
            page={page}
          />
        </Card>
      ) : null}
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
                  modulo: "perfiles",
                  showComponent: 2,
                  idPerfil: idPerfilEditar,
                  busquedaFiltro: busquedaFiltro,
                  page: page,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(2);
          }}
        >
          <ListItemText primary="Editar" />
        </MenuItem>
        {idPerfilEditar > 4 ? (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              swal({
                text: "¿Está seguro de eliminar el perfil?",
                buttons: ["No", "Sí"],
                dangerMode: true,
              }).then((value) => {
                if (value) {
                  executeEliminarPerfilGlobal({
                    data: {
                      usuario: correo,
                      pwd: password,
                      idperfil: idPerfilEditar,
                    },
                  });
                }
              });
            }}
          >
            <ListItemText primary="Eliminar" />
          </MenuItem>
        ) : null}
      </StyledMenu>
    </div>
  );
}

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
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
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  treeView: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    isMenu,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div
          className={classes.labelRoot}
          style={{
            alignItems: isMenu ? "baseline" : "",
            display: matches ? "flex" : "block",
          }}
        >
          <LabelIcon
            color="inherit"
            className={classes.labelIcon}
            style={{ float: "left" }}
          />
          <Typography
            variant="body2"
            className={classes.labelText}
            style={{ float: "left" }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

function CrearPerfil(props) {
  const classes = useStyles();
  const TreeClasses = useTreeItemStyles();
  const setShowComponent = props.setShowComponent;
  const setLoading = props.setLoading;
  const usuario = props.correo;
  const pwd = props.password;
  const executeGetPerfiles = props.executeGetPerfiles;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const [expanded, setExpanded] = useState([]);
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [permisosModulos, setPermisosModulos] = useState([]);
  const [
    { data: getMenusData, loading: getMenusLoading, error: getMenusError },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMenus`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: agregarPerfilGlobalData,
      loading: agregarPerfilGlobalLoading,
      error: agregarPerfilGlobalError,
    },
    executeAgregarPerfil,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarPerfilGlobal`,
      method: "POST",
      data: {
        usuario: usuario,
        pwd: pwd,
        nombre: nombrePerfil,
        descripcion: descripcion,
        fecha: moment().format("YYYY-MM-DD"),
        permisosdatos: permisosModulos,
      },
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getMenusData) {
        if (getMenusData.error !== 0) {
          swal(
            "Error al cambiar permisos",
            dataBaseErrores(getMenusData.error),
            "error"
          );
        } else {
          let modulos = [];
          let menus = [];
          let submenus = [];
          for (let x = 0; x < getMenusData.modulos.length; x++) {
            modulos[x] = {
              idModulo: getMenusData.modulos[x].idmodulo,
              nombreModulo: getMenusData.modulos[x].nombre_modulo,
              status: getMenusData.modulos[x].status,
              orden: getMenusData.modulos[x].orden,
              icono: getMenusData.modulos[x].icono,
              permisos: 0,
            };
            menus = [];
            for (let y = 0; y < getMenusData.modulos[x].menus.length; y++) {
              menus[y] = {
                idMenu: getMenusData.modulos[x].menus[y].idmenu,
                idModulo: getMenusData.modulos[x].idmodulo,
                nombreMenu: getMenusData.modulos[x].menus[y].nombre_menu,
                status: getMenusData.modulos[x].menus[y].status,
                orden: getMenusData.modulos[x].menus[y].orden,
                permisos: 0,
              };
              submenus = [];
              for (
                let z = 0;
                z < getMenusData.modulos[x].menus[y].submenus.length;
                z++
              ) {
                submenus[z] = {
                  idSubmenu:
                    getMenusData.modulos[x].menus[y].submenus[z].idsubmenu,
                  idMenu: getMenusData.modulos[x].menus[y].idmenu,
                  idModulo: getMenusData.modulos[x].idmodulo,
                  nombreSubmenu:
                    getMenusData.modulos[x].menus[y].submenus[z].nombre_submenu,
                  status: getMenusData.modulos[x].menus[y].submenus[z].status,
                  orden: getMenusData.modulos[x].menus[y].submenus[z].orden,
                  permisos: 0,
                  permisosNotificaciones: 0,
                };
              }
              menus[y] = {
                ...menus[y],
                submenus: submenus,
              };
            }
            modulos[x] = {
              ...modulos[x],
              menus: menus,
            };
          }
          setPermisosModulos(modulos);
        }
      }
    }

    checkData();
  }, [getMenusData]);

  useEffect(() => {
    function checkData() {
      if (agregarPerfilGlobalData) {
        if (agregarPerfilGlobalData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(agregarPerfilGlobalData.error),
            "warning"
          );
        } else {
          swal("Perfil Agregado", "Perfil agregado con éxito", "success");
          executeGetPerfiles();
          setShowComponent(0);
        }
      }
    }

    checkData();
  }, [agregarPerfilGlobalData, executeGetPerfiles, setShowComponent]);

  if (getMenusLoading || agregarPerfilGlobalLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getMenusError || agregarPerfilGlobalError) {
    return <ErrorQueryDB />;
  }

  const handleChangeTreeView = (event, nodes) => {
    setExpanded(nodes);
  };

  const getSubMenus = (submenus, indexModulo, indexMenu) => {
    return submenus.map((submenu, index) => {
      return submenu.orden !== 0 ? (
        <StyledTreeItem
          key={submenu.idSubmenu}
          nodeId={`${submenu.idSubmenu}00`}
          labelText={submenu.nombreSubmenu}
          labelIcon={StarIcon}
          isMenu={false}
          labelInfo={
            <div>
              <TextField
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Permisos"
                type="text"
                value={submenu.permisos}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  let newData = [...permisosModulos];
                  newData[indexModulo].menus[indexMenu].submenus[
                    index
                  ].permisos = parseInt(e.target.value);
                  setPermisosModulos(newData);
                }}
              >
                <option value="0">Bloqueado</option>
                <option value="1">Lectura</option>
                <option value="2">Lectura y Escritura</option>
                <option value="3">Todos</option>
              </TextField>
              <Typography style={{ fontSize: "13px" }}>
                Notificaciones
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 4
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 4;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="Aplicación Móvil"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 1
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 1;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="Email"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 2
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 2;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="SMS"
                  labelPlacement="end"
                />
              </FormGroup>
            </div>
          }
          color="#00c853"
          bgColor="#b9f6ca"
        />
      ) : (
        <div key={index}></div>
      );
    });
  };

  const getMenus = (menus, indexModulo) => {
    return menus.map((menu, index) => {
      return menu.orden !== 0 ? (
        <StyledTreeItem
          key={menu.idMenu}
          nodeId={`${menu.idMenu}0`}
          labelText={menu.nombreMenu}
          labelIcon={MinimizeIcon}
          isMenu={true}
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              row
              value={menu.permisos}
              onClick={(e) => {
                e.stopPropagation();
                let newData = [...permisosModulos];
                newData[indexModulo].menus[index].permisos = parseInt(
                  e.target.value
                );
                setPermisosModulos(newData);
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Sí" />
              <FormControlLabel value={0} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#e3742f"
          bgColor="#fcefe3"
        >
          {getSubMenus(menu.submenus, indexModulo, index)}
        </StyledTreeItem>
      ) : (
        <div key={index}></div>
      );
    });
  };

  const getModulos = () => {
    return permisosModulos.map((modulo, index) => {
      return modulo.orden !== 0 ? (
        <StyledTreeItem
          key={modulo.idModulo}
          nodeId={modulo.idModulo.toString()}
          labelText={modulo.nombreModulo}
          isMenu={false}
          labelIcon={
            modulo.idModulo === 1
              ? AccountBoxIcon
              : modulo.idModulo === 2
              ? EmailIcon
              : modulo.idModulo === 3
              ? SettingsIcon
              : modulo.idModulo === 4
              ? AssessmentIcon
              : MinimizeIcon
          }
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              row
              value={modulo.permisos}
              onClick={(e) => {
                e.stopPropagation();
                let newModulosData = [...permisosModulos];
                newModulosData[index].permisos = parseInt(e.target.value);
                setPermisosModulos(newModulosData);
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Sí" />
              <FormControlLabel value={0} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        >
          {getMenus(modulo.menus, index)}
        </StyledTreeItem>
      ) : null;
    });
  };

  const guardarPerfil = () => {
    if (nombrePerfil.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (descripcion.trim() === "") {
      swal("Error", "Agregue una descripción", "warning");
    } else {
      executeAgregarPerfil();
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: "10px" }}>
      <Grid item xs={12}>
        <Typography className={classes.titleTable} variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      modulo: "perfiles",
                      showComponent: 0,
                      idPerfil: 0,
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
          Crear Perfil
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={() => {
            guardarPerfil();
          }}
        >
          Guardar
        </Button>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          className={classes.textFields}
          id="nombrePerfil"
          label="Nombre Perfil"
          type="text"
          required
          margin="normal"
          value={nombrePerfil}
          inputProps={{
            maxLength: 50,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setNombrePerfil(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          className={classes.textFields}
          id="descripcionPerfil"
          label="Descripción"
          type="text"
          required
          margin="normal"
          value={descripcion}
          inputProps={{
            maxLength: 100,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setDescripcion(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Permisos Del Perfil</Typography>
      </Grid>
      <Grid item xs={12}>
        <TreeView
          className={TreeClasses.treeView}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          expanded={expanded}
          onNodeToggle={handleChangeTreeView}
        >
          {getModulos()}
        </TreeView>
      </Grid>
    </Grid>
  );
}

function EditarPerfil(props) {
  const classes = useStyles();
  const TreeClasses = useTreeItemStyles();
  const setShowComponent = props.setShowComponent;
  const setLoading = props.setLoading;
  const correo = props.correo;
  const password = props.password;
  const executeGetPerfiles = props.executeGetPerfiles;
  const idPerfilEditar = props.idPerfilEditar;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const [expanded, setExpanded] = useState([]);
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [permisosModulos, setPermisosModulos] = useState([]);
  const [
    {
      data: datosPerfilGlobalData,
      loading: datosPerfilGlobalLoading,
      error: datosPerfilGlobalError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/datosPerfilGlobal`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idperfil: idPerfilEditar,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: editarPerfilGlobalData,
      loading: editarPerfilGlobalLoading,
      error: editarPerfilGlobalError,
    },
    executeEditarPerfilGlobal,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editarPerfilGlobal`,
      method: "PUT",
      data: {
        usuario: correo,
        pwd: password,
        nombre: nombrePerfil,
        descripcion: descripcion,
        permisosdatos: permisosModulos,
        idperfil: idPerfilEditar,
      },
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (datosPerfilGlobalData) {
        if (datosPerfilGlobalData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(datosPerfilGlobalData.error),
            "warning"
          );
        } else {
          let modulos = [];
          let menus = [];
          let submenus = [];
          for (let x = 0; x < datosPerfilGlobalData.modulos.length; x++) {
            modulos[x] = {
              idModulo: datosPerfilGlobalData.modulos[x].idmodulo,
              nombreModulo: datosPerfilGlobalData.modulos[x].nombre_modulo,
              status: datosPerfilGlobalData.modulos[x].status,
              orden: datosPerfilGlobalData.modulos[x].orden,
              icono: datosPerfilGlobalData.modulos[x].icono,
              permisos: datosPerfilGlobalData.modulos[x].permisos,
            };
            menus = [];
            for (
              let y = 0;
              y < datosPerfilGlobalData.modulos[x].menus.length;
              y++
            ) {
              menus[y] = {
                idMenu: datosPerfilGlobalData.modulos[x].menus[y].idmenu,
                idModulo: datosPerfilGlobalData.modulos[x].idmodulo,
                nombreMenu:
                  datosPerfilGlobalData.modulos[x].menus[y].nombre_menu,
                status: datosPerfilGlobalData.modulos[x].menus[y].status,
                orden: datosPerfilGlobalData.modulos[x].menus[y].orden,
                permisos: datosPerfilGlobalData.modulos[x].menus[y].permisos,
              };
              submenus = [];
              for (
                let z = 0;
                z < datosPerfilGlobalData.modulos[x].menus[y].submenus.length;
                z++
              ) {
                submenus[z] = {
                  idSubmenu:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z]
                      .idsubmenu,
                  idMenu: datosPerfilGlobalData.modulos[x].menus[y].idmenu,
                  idModulo: datosPerfilGlobalData.modulos[x].idmodulo,
                  nombreSubmenu:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z]
                      .nombre_submenu,
                  status:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z]
                      .status,
                  orden:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z].orden,
                  permisos:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z]
                      .permisos,
                  permisosNotificaciones:
                    datosPerfilGlobalData.modulos[x].menus[y].submenus[z]
                      .permisosNotificaciones,
                };
              }
              menus[y] = {
                ...menus[y],
                submenus: submenus,
              };
            }
            modulos[x] = {
              ...modulos[x],
              menus: menus,
            };
          }
          setPermisosModulos(modulos);
          setNombrePerfil(datosPerfilGlobalData.perfil[0].nombre);
          setDescripcion(datosPerfilGlobalData.perfil[0].descripcion);
        }
      }
    }

    checkData();
  }, [datosPerfilGlobalData]);

  useEffect(() => {
    function checkData() {
      if (editarPerfilGlobalData) {
        if (editarPerfilGlobalData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(editarPerfilGlobalData.error),
            "warning"
          );
        } else {
          swal("Perfil Editado", "Perfil editado con éxito", "success");
          executeGetPerfiles();
          setShowComponent(0);
        }
      }
    }

    checkData();
  }, [editarPerfilGlobalData, executeGetPerfiles, setShowComponent]);

  if (editarPerfilGlobalLoading || datosPerfilGlobalLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (editarPerfilGlobalError || datosPerfilGlobalError) {
    return <ErrorQueryDB />;
  }

  const handleChangeTreeView = (event, nodes) => {
    setExpanded(nodes);
  };

  const getSubMenus = (submenus, indexModulo, indexMenu) => {
    return submenus.map((submenu, index) => {
      return submenu.orden !== 0 ? (
        <StyledTreeItem
          key={submenu.idSubmenu}
          nodeId={`${submenu.idSubmenu}00`}
          labelText={submenu.nombreSubmenu}
          labelIcon={StarIcon}
          isMenu={false}
          labelInfo={
            <div>
              <TextField
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Permisos"
                type="text"
                value={submenu.permisos}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  let newData = [...permisosModulos];
                  newData[indexModulo].menus[indexMenu].submenus[
                    index
                  ].permisos = parseInt(e.target.value);
                  setPermisosModulos(newData);
                }}
              >
                <option value="0">Bloqueado</option>
                <option value="1">Lectura</option>
                <option value="2">Lectura y Escritura</option>
                <option value="3">Todos</option>
              </TextField>
              <Typography style={{ fontSize: "13px" }}>
                Notificaciones
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        submenu.permisosNotificaciones === 4 ||
                        submenu.permisosNotificaciones === 5 ||
                        submenu.permisosNotificaciones === 6 ||
                        submenu.permisosNotificaciones === 7
                      }
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 4
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 4;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="Aplicación Móvil"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        submenu.permisosNotificaciones === 1 ||
                        submenu.permisosNotificaciones === 3 ||
                        submenu.permisosNotificaciones === 5 ||
                        submenu.permisosNotificaciones === 7
                      }
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 1
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 1;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="Email"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        submenu.permisosNotificaciones === 2 ||
                        submenu.permisosNotificaciones === 3 ||
                        submenu.permisosNotificaciones === 6 ||
                        submenu.permisosNotificaciones === 7
                      }
                      onChange={(e) => {
                        let newData = [...permisosModulos];
                        newData[indexModulo].menus[indexMenu].submenus[
                          index
                        ].permisosNotificaciones = e.target.checked
                          ? newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones + 2
                          : newData[indexModulo].menus[indexMenu].submenus[
                              index
                            ].permisosNotificaciones - 2;
                        setPermisosModulos(newData);
                      }}
                    />
                  }
                  label="SMS"
                  labelPlacement="end"
                />
              </FormGroup>
            </div>
          }
          color="#00c853"
          bgColor="#b9f6ca"
        />
      ) : (
        <div key={index}></div>
      );
    });
  };

  const getMenus = (menus, indexModulo) => {
    return menus.map((menu, index) => {
      return menu.orden !== 0 ? (
        <StyledTreeItem
          key={menu.idMenu}
          nodeId={`${menu.idMenu}0`}
          labelText={menu.nombreMenu}
          labelIcon={MinimizeIcon}
          isMenu={true}
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              row
              value={menu.permisos}
              onClick={(e) => {
                e.stopPropagation();
                let newData = [...permisosModulos];
                newData[indexModulo].menus[index].permisos = parseInt(
                  e.target.value
                );
                setPermisosModulos(newData);
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Sí" />
              <FormControlLabel value={0} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#e3742f"
          bgColor="#fcefe3"
        >
          {getSubMenus(menu.submenus, indexModulo, index)}
        </StyledTreeItem>
      ) : (
        <div key={index}></div>
      );
    });
  };

  const getModulos = () => {
    return permisosModulos.map((modulo, index) => {
      return modulo.orden !== 0 ? (
        <StyledTreeItem
          key={modulo.idModulo}
          nodeId={modulo.idModulo.toString()}
          labelText={modulo.nombreModulo}
          isMenu={false}
          labelIcon={
            modulo.idModulo === 1
              ? AccountBoxIcon
              : modulo.idModulo === 2
              ? EmailIcon
              : modulo.idModulo === 3
              ? SettingsIcon
              : modulo.idModulo === 4
              ? AssessmentIcon
              : MinimizeIcon
          }
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              row
              value={modulo.permisos}
              onClick={(e) => {
                e.stopPropagation();
                let newModulosData = [...permisosModulos];
                newModulosData[index].permisos = parseInt(e.target.value);
                setPermisosModulos(newModulosData);
              }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Sí" />
              <FormControlLabel value={0} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        >
          {getMenus(modulo.menus, index)}
        </StyledTreeItem>
      ) : null;
    });
  };

  const guardarPerfil = () => {
    if (nombrePerfil.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (descripcion.trim() === "") {
      swal("Error", "Agregue una descripción", "warning");
    } else {
      executeEditarPerfilGlobal();
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: "10px" }}>
      <Grid item xs={12}>
        <Typography className={classes.titleTable} variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      modulo: "perfiles",
                      showComponent: 0,
                      idPerfil: 0,
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
          Editar Perfil
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={() => {
            guardarPerfil();
          }}
        >
          Guardar
        </Button>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          className={classes.textFields}
          id="nombrePerfil"
          label="Nombre Perfil"
          type="text"
          required
          margin="normal"
          value={nombrePerfil}
          inputProps={{
            maxLength: 50,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setNombrePerfil(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          className={classes.textFields}
          id="descripcionPerfil"
          label="Descripción"
          type="text"
          required
          margin="normal"
          value={descripcion}
          inputProps={{
            maxLength: 100,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setDescripcion(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Permisos Del Perfil</Typography>
      </Grid>
      <Grid item xs={12}>
        <TreeView
          className={TreeClasses.treeView}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          expanded={expanded}
          onNodeToggle={handleChangeTreeView}
        >
          {getModulos()}
        </TreeView>
      </Grid>
    </Grid>
  );
}
