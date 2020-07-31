import React, { useState, useEffect } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import {
  Settings as SettingsIcon,
  Error as ErrorIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ClearAll as ClearAllIcon,
  AddCircle as AddCircleIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import jwt from "jsonwebtoken";
import swal from "sweetalert";
import {
  keyValidation,
  pasteValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import { Fragment } from "react";

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

function createData(
  id,
  usuario,
  celular,
  correo,
  tipoUsuario,
  estatus,
  acciones
) {
  return { id, usuario, celular, correo, tipoUsuario, estatus, acciones };
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
    id: "tipoUsuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo de usuario",
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

export default function Usuarios(props) {
  const usuarioDatos = props.usuarioDatos;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const setLoading = props.setLoading;
  const [showComponent, setShowComponent] = useState(0);
  const [idUsuario, setIdUsuario] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");

  const [
    {
      data: getUsuariosData,
      loading: getUsuariosLoading,
      error: getUsuariosError,
    },
    executeGetUsuarios,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getUsuarios`,
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
        if (decodedToken.menuTemporal.modulo === "usuarios") {
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setIdUsuario(decodedToken.menuTemporal.idUsuario);
          setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
          setPage(decodedToken.menuTemporal.page);
        } else {
          const token = jwt.sign(
            {
              menuTemporal: {
                modulo: "usuarios",
                showComponent: 0,
                idUsuario: 0,
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
            modulo: "usuarios",
            showComponent: 0,
            idUsuario: 0,
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
    if (getUsuariosData) {
      if (getUsuariosData.error !== 0) {
        swal("Error", dataBaseErrores(getUsuariosData.error), "warning");
      } else {
        filterRows = [];
        getUsuariosData.usuarios.map((usuario) => {
          return filterRows.push(
            createData(
              usuario.idusuario,
              `${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`,
              usuario.cel,
              usuario.correo,
              usuario.tipoUsuario !== null
                ? usuario.tipoUsuario
                : "No Verificado",
              usuario.status,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRows(filterRows);
      }
    }
  }, [getUsuariosData]);

  if (getUsuariosLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getUsuariosError) {
    return <ErrorQueryDB />;
  }

  return (
    <div>
      {showComponent === 0 ? (
        <ListaUsuarios
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          executeGetUsuarios={executeGetUsuarios}
          rows={rows}
          setRows={setRows}
          idUsuario={idUsuario}
          setIdUsuario={setIdUsuario}
          page={page}
          setPage={setPage}
          busquedaFiltro={busquedaFiltro}
          setBusquedaFiltro={setBusquedaFiltro}
        />
      ) : showComponent === 1 ? (
        <AltaUsuarios
          correo={correo}
          password={password}
          setLoading={setLoading}
          setShowComponent={setShowComponent}
          executeGetUsuarios={executeGetUsuarios}
          idUsuario={idUsuario}
          setIdUsuario={setIdUsuario}
          page={page}
          busquedaFiltro={busquedaFiltro}
        />
      ) : null}
    </div>
  );
}

function ListaUsuarios(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const executeGetUsuarios = props.executeGetUsuarios;
  const rows = props.rows;
  const setRows = props.setRows;
  const idUsuario = props.idUsuario;
  const setIdUsuario = props.setIdUsuario;
  const page = props.page;
  const setPage = props.setPage;
  const busquedaFiltro = props.busquedaFiltro;
  const setBusquedaFiltro = props.setBusquedaFiltro;

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusUsuario, setStatusUsuario] = useState(0);

  const [anchorMenuEl, setAnchorMenuEl] = useState(null);

  const [
    {
      data: cambiarEstatusUsuarioData,
      loading: cambiarEstatusUsuarioLoading,
      error: cambiarEstatusUsuarioError,
    },
    executeCambiarEstatusUsuario,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarEstatusUsuario`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          filterRows[x].id.toString().indexOf(busquedaFiltro.toLowerCase()) !==
            -1 ||
          filterRows[x].usuario
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].celular
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].correo
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].tipoUsuario
            .toLowerCase()
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
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: 0,
          busquedaFiltro: busquedaFiltro,
          page:
            rows.length < rowsPerPage && rows.length !== 0
              ? 0
              : decodedToken.menuTemporal.page
              ? decodedToken.menuTemporal.page
              : 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  }, [busquedaFiltro, setRows, rows.length, rowsPerPage, setPage]);

  useEffect(() => {
    if (cambiarEstatusUsuarioData) {
      if (cambiarEstatusUsuarioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(cambiarEstatusUsuarioData.error),
          "warning"
        );
      } else {
        executeGetUsuarios();
        swal(
          statusUsuario === 1 ? "Usuario Eliminado" : "Usuario Restaurado",
          statusUsuario === 1
            ? "Usuario Eliminado Con Éxito"
            : "Usuario Restaurado Con Éxito",
          "success"
        );
        setIdUsuario(0);
      }
    }
  }, [
    cambiarEstatusUsuarioData,
    executeGetUsuarios,
    setIdUsuario,
    statusUsuario,
  ]);

  if (cambiarEstatusUsuarioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (cambiarEstatusUsuarioError) {
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
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: newPage,
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
          modulo: "usuarios",
          showComponent: 0,
          idUsuario: idUsuario,
          busquedaFiltro: busquedaFiltro,
          page: 0,
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
                Lista De Usuarios
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
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          modulo: "usuarios",
                          showComponent: 1,
                          idUsuario: 0,
                          busquedaFiltro: busquedaFiltro,
                          page: 0,
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
                        <TableCell padding="checkbox" />
                        <TableCell component="th" id={labelId} scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.usuario}</TableCell>
                        <TableCell align="right">{row.celular}</TableCell>
                        <TableCell align="right">{row.correo}</TableCell>
                        <TableCell align="right">{row.tipoUsuario}</TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => {
                            handleOpenMenu(e);
                            setIdUsuario(row.id);
                            setStatusUsuario(row.estatus);
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
                  modulo: "usuarios",
                  showComponent: 1,
                  idUsuario: idUsuario,
                  busquedaFiltro: busquedaFiltro,
                  page: 0,
                },
              },
              "mysecretpassword"
            );
            localStorage.setItem("menuTemporal", token);
            setShowComponent(1);
          }}
        >
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            swal({
              text:
                statusUsuario !== 0
                  ? "¿Está seguro de eliminar este usuario?"
                  : "¿Está seguro de restaurar este usuario?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                const status = statusUsuario === 1 ? 0 : 1;
                executeCambiarEstatusUsuario({
                  data: {
                    usuario: correo,
                    pwd: password,
                    idusuario: idUsuario,
                    estatus: status,
                  },
                });
              }
            });
          }}
        >
          <ListItemText
            primary={statusUsuario !== 0 ? "Eliminar" : "Restaurar"}
          />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function AltaUsuarios(props) {
  const classes = useStyles();
  const correoUsuario = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const executeGetUsuarios = props.executeGetUsuarios;
  const idUsuario = props.idUsuario;
  const setIdUsuario = props.setIdUsuario;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    correo: "",
    tipoUsuario: "0",
    contra: "",
    repiteContra: "",
    notificacionDB: 0,
  });
  const [celularAntiguo, setCelularAntiguo] = useState("");
  const [correoAntiguo, setCorreoAntiguo] = useState("");
  const [openMenuContra, setOpenMenuContra] = useState(false);
  const [contraNueva, setContraNueva] = useState("");
  const [repiteContraNueva, setRepiteContraNueva] = useState("");

  const [
    {
      data: getPerfilesData,
      loading: getPerfilesLoading,
      error: getPerfilesError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPerfiles`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: password,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getUsuarioData,
      loading: getUsuarioLoading,
      error: getUsuarioError,
    },
    executeGetUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getUsuario`,
      method: "GET",
      params: {
        idusuario: idUsuario,
        usuario: correoUsuario,
        pwd: password,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: guardarUsuarioData,
      loading: guardarUsuarioLoading,
      error: guardarUsuarioError,
    },
    executeGuardarUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarUsuario`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: cambioContraUsuarioData,
      loading: cambioContraUsuarioLoading,
      error: cambioContraUsuarioError,
    },
    executeCambioContraUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambioContraUsuario`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (idUsuario > 0) {
      executeGetUsuario();
    }
  }, [idUsuario, executeGetUsuario]);

  useEffect(() => {
    if (getUsuarioData) {
      if (getUsuarioData.error !== 0) {
        swal("Error", dataBaseErrores(getUsuarioData.error), "warning");
      } else {
        setDatosUsuario({
          nombre: getUsuarioData.usuario[0].nombre,
          apellidoPaterno: getUsuarioData.usuario[0].apellidop,
          apellidoMaterno: getUsuarioData.usuario[0].apellidom,
          celular: getUsuarioData.usuario[0].cel,
          correo: getUsuarioData.usuario[0].correo,
          tipoUsuario: getUsuarioData.usuario[0].tipo,
          contra: "",
          repiteContra: "",
          notificacionDB: getUsuarioData.usuario[0].notificaciondb,
        });
        setCelularAntiguo(getUsuarioData.usuario[0].cel);
        setCorreoAntiguo(getUsuarioData.usuario[0].correo);
      }
    }
  }, [getUsuarioData]);

  useEffect(() => {
    if (guardarUsuarioData) {
      if (guardarUsuarioData.error !== 0) {
        swal("Error", dataBaseErrores(guardarUsuarioData.error), "warning");
      } else {
        setShowComponent(0);
        executeGetUsuarios();
        swal(
          idUsuario === 0 ? "Usuario Agregado" : "Usuario Editado",
          idUsuario === 0
            ? "Usuario Agregado Con Éxito"
            : "Usuario Editado Con Éxito",
          "success"
        );
      }
    }
  }, [guardarUsuarioData, setShowComponent, executeGetUsuarios, idUsuario]);

  useEffect(() => {
    if (cambioContraUsuarioData) {
      if (cambioContraUsuarioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(cambioContraUsuarioData.error),
          "warning"
        );
      } else {
        swal("Contraseña Cambiada", "Contraseña Cambiada Con Éxito", "success");
        setOpenMenuContra(false);
      }
    }
  }, [cambioContraUsuarioData]);

  if (
    getPerfilesLoading ||
    getUsuarioLoading ||
    guardarUsuarioLoading ||
    cambioContraUsuarioLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getPerfilesError ||
    getUsuarioError ||
    guardarUsuarioError ||
    cambioContraUsuarioError
  ) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenMenuContra = () => {
    setOpenMenuContra(true);
    setContraNueva("");
    setRepiteContraNueva("");
  };

  const handleCloseMenuContra = () => {
    setOpenMenuContra(false);
  };

  const handleChangeNotificacion = (event) => {
    console.log(event.target.checked);
    setDatosUsuario({
      ...datosUsuario,
      notificacionDB: event.target.checked ? 1 : 0,
    });
  };

  const getPerfiles = () => {
    return getPerfilesData.perfiles.map((perfil, index) => {
      return (
        <option key={index} value={perfil.idperfil}>
          {perfil.nombre}
        </option>
      );
    });
  };

  const agregarUsuario = () => {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      celular,
      correo,
      tipoUsuario,
      contra,
      repiteContra,
      notificacionDB
    } = datosUsuario;
    if (nombre.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (apellidoPaterno.trim() === "") {
      swal("Error", "Agregue un apellido paterno", "warning");
    } else if (apellidoMaterno.trim() === "") {
      swal("Error", "Agregue un apellido materno", "warning");
    } else if (celular.trim() === "") {
      swal("Error", "Agregue un celular", "warning");
    } else if (correo.trim() === "") {
      swal("Error", "Agregue un correo", "warning");
    } else if (!validarCorreo(correo.trim())) {
      swal("Error", "Ingresa un correo valido", "warning");
    } else if (tipoUsuario === "0" || tipoUsuario === 0) {
      swal("Error", "Seleccione un tipo de usuario", "warning");
    } else if (contra.trim() === "" && idUsuario === 0) {
      swal("Error", "Agregue una contraseña", "warning");
    } else if (repiteContra.trim() === "" && idUsuario === 0) {
      swal("Error", "Vuelva a ingresar la contraseña", "warning");
    } else if (repiteContra.trim() !== contra.trim() && idUsuario === 0) {
      swal("Error", "Las contraseñas no coinciden", "warning");
    } else {
      const validacionCel =
        idUsuario === 0 ? 1 : celular.trim() !== celularAntiguo ? 1 : 0;
      const validacionCorreo =
        idUsuario === 0 ? 1 : correo.trim() !== correoAntiguo ? 1 : 0;
      executeGuardarUsuario({
        data: {
          usuario: correoUsuario,
          pwd: password,
          nombre: nombre.trim(),
          apellidop: apellidoPaterno.trim(),
          apellidom: apellidoMaterno.trim(),
          cel: celular.trim(),
          correo: correo.trim(),
          password: contra.trim(),
          tipo: tipoUsuario,
          notificaciondb: notificacionDB,
          accion: idUsuario === 0 ? 1 : 2,
          validacioncel: validacionCel,
          validacioncorreo: validacionCorreo,
          idusuario: idUsuario,
        },
      });
    }
  };

  const guardarNuevaContra = () => {
    if (contraNueva.trim() === "") {
      swal("Error", "Ingrese una contraseña", "warning");
    } else if (repiteContraNueva.trim() === "") {
      swal("Error", "Vuelva a ingresar la contraseña", "warning");
    } else if (repiteContraNueva.trim() !== contraNueva.trim()) {
      swal("Error", "La contraseñas no coinciden", "warning");
    } else {
      executeCambioContraUsuario({
        data: {
          usuario: correoUsuario,
          pwd: password,
          idusuario: idUsuario,
          password: contraNueva.trim(),
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
                    setIdUsuario(0);
                    const token = jwt.sign(
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
                    localStorage.setItem("menuTemporal", token);
                  }}
                >
                  <ArrowBackIcon color="primary" />
                </IconButton>
              </Tooltip>
              {idUsuario === 0 ? "Nuevo Usuario" : "Editar Usuario"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="nombre"
              className={classes.textFields}
              label="Nombre"
              variant="outlined"
              margin="normal"
              value={datosUsuario.nombre}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosUsuario({
                  ...datosUsuario,
                  nombre: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="apellidoPaterno"
              className={classes.textFields}
              label="Apellido Paterno"
              variant="outlined"
              margin="normal"
              value={datosUsuario.apellidoPaterno}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosUsuario({
                  ...datosUsuario,
                  apellidoPaterno: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="apellidoMaterno"
              className={classes.textFields}
              label="Apellido Materno"
              variant="outlined"
              margin="normal"
              value={datosUsuario.apellidoMaterno}
              inputProps={{
                maxLength: 50,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 1);
              }}
              onChange={(e) => {
                pasteValidation(e, 1);
                setDatosUsuario({
                  ...datosUsuario,
                  apellidoMaterno: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="celular"
              className={classes.textFields}
              label="Celular"
              variant="outlined"
              margin="normal"
              value={datosUsuario.celular}
              inputProps={{
                maxLength: 20,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 2);
              }}
              onChange={(e) => {
                pasteValidation(e, 2);
                setDatosUsuario({
                  ...datosUsuario,
                  celular: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="correo"
              className={classes.textFields}
              label="Correo"
              variant="outlined"
              margin="normal"
              value={datosUsuario.correo}
              inputProps={{
                maxLength: 70,
              }}
              onKeyPress={(e) => {
                keyValidation(e, 4);
              }}
              onChange={(e) => {
                pasteValidation(e, 4);
                setDatosUsuario({
                  ...datosUsuario,
                  correo: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="tipoUsuario"
              className={classes.textFields}
              select
              SelectProps={{
                native: true,
              }}
              label="Tipo De Usuario"
              variant="outlined"
              margin="normal"
              value={datosUsuario.tipoUsuario}
              onChange={(e) => {
                setDatosUsuario({
                  ...datosUsuario,
                  tipoUsuario: e.target.value,
                  notificacionDB: e.target.value !== 4 && e.target.value !== "4" ? 0 : datosUsuario.notificacionDB
                });
              }}
            >
              <option value="0">Selecciona un tipo de usuario</option>
              {getPerfiles()}
            </TextField>
          </Grid>
          {idUsuario === 0 ? (
            <Fragment>
              <Grid item xs={12} md={6}>
                <TextField
                  id="contra"
                  className={classes.textFields}
                  label="Contraseña"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  value={datosUsuario.contra}
                  inputProps={{
                    maxLength: 20,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 3);
                    setDatosUsuario({
                      ...datosUsuario,
                      contra: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="repiteContra"
                  className={classes.textFields}
                  label="Repetir Contraseña"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  value={datosUsuario.repiteContra}
                  inputProps={{
                    maxLength: 20,
                  }}
                  onKeyPress={(e) => {
                    keyValidation(e, 3);
                  }}
                  onChange={(e) => {
                    pasteValidation(e, 3);
                    setDatosUsuario({
                      ...datosUsuario,
                      repiteContra: e.target.value,
                    });
                  }}
                />
              </Grid>
            </Fragment>
          ) : null}
          {datosUsuario.tipoUsuario === 4 ||
          datosUsuario.tipoUsuario === "4" ? (
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={datosUsuario.notificacionDB === 1}
                    onChange={handleChangeNotificacion}
                    name="checkedDB"
                    color="primary"
                  />
                }
                label="Notificar cuando se ocupe una base de datos"
              />
            </Grid>
          ) : null}
          <Grid item xs={12} style={{ marginBottom: "15px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: "right" }}
              onClick={() => {
                agregarUsuario();
              }}
            >
              Guardar
            </Button>
            {idUsuario !== 0 ? (
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right", marginRight: "15px" }}
                onClick={() => {
                  handleClickOpenMenuContra();
                }}
              >
                Cambiar Contraseña
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Toolbar>
      <Dialog
        onClose={handleCloseMenuContra}
        aria-labelledby="simple-dialog-title"
        open={openMenuContra}
      >
        <DialogTitle id="simple-dialog-title">Cambiar Contraseña</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="nuevaContra"
                className={classes.textFields}
                label="Nueva Contraseña"
                value={contraNueva}
                type="password"
                margin="normal"
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setContraNueva(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="repiteNuevaContra"
                className={classes.textFields}
                label="Confirme Nueva Contraseña"
                value={repiteContraNueva}
                type="password"
                margin="normal"
                inputProps={{
                  maxLength: 20,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  setRepiteContraNueva(e.target.value);
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
              handleCloseMenuContra();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              guardarNuevaContra();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
