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
  Button,
  Menu,
  MenuItem,
  ListItemText,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  ClearAll as ClearAllIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  SettingsEthernet as SettingsEthernetIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import moment from "moment";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  doublePasteValidation,
} from "../../helpers/inputHelpers";
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

function createData(
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

export default function Servicios(props) {
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
  const [idServicio, setIdServicio] = useState(0);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [statusServicio, setStatusServicio] = useState(-1);

  const [
    {
      data: getServiciosData,
      loading: getServiciosLoading,
      error: getServiciosError,
    },
    executeGetServicios,
    ,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServicios`,
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
      data: cambiarStatusServicioData,
      loading: cambiarStatusServicioLoading,
      error: cambiarStatusServicioError,
    },
    executeCambiarStatusServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarStatusServicio`,
      method: "PUT",
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
        if (decodedToken.menuTemporal.modulo === "servicios") {
          setShowComponent(decodedToken.menuTemporal.showComponent);
          setIdServicio(decodedToken.menuTemporal.idServicio);
          setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
          setPage(decodedToken.menuTemporal.page);
        } else {
          const token = jwt.sign(
            {
              menuTemporal: {
                modulo: "servicios",
                showComponent: 0,
                idServicio: 0,
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
            modulo: "servicios",
            showComponent: 0,
            idServicio: 0,
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
    if (getServiciosData) {
      if (getServiciosData.error !== 0) {
        swal("Error", dataBaseErrores(getServiciosData.error), "warning");
      } else {
        filterRows = [];
        getServiciosData.servicios.map((servicio) => {
          return filterRows.push(
            createData(
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
        setRows(filterRows);
      }
    }
  }, [getServiciosData]);

  useEffect(() => {
    function checkData() {
      if (cambiarStatusServicioData) {
        if (cambiarStatusServicioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(cambiarStatusServicioData.error),
            "warning"
          );
        } else {
          swal(
            cambiarStatusServicioData.status === 0
              ? "Servicio Dado de Baja"
              : "Servicio Dado de Alta",
            cambiarStatusServicioData.status === 0
              ? "Servicio dado de baja con éxito"
              : "Servicio dado de alta con éxito",
            "success"
          );
          executeGetServicios();
        }
      }
    }

    checkData();
  }, [cambiarStatusServicioData, executeGetServicios]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          filterRows[x].servicio
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].precio
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].descripcion
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].tipo
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRows[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRows[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
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
            modulo: "servicios",
            showComponent: 0,
            idServicio: 0,
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
            modulo: "servicios",
            showComponent: 0,
            idServicio: 0,
            page: rows.length < rowsPerPage && rows.length !== 0 ? 0 : page,
            busquedaFiltro: busquedaFiltro,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
  }, [busquedaFiltro, page, rows.length, rowsPerPage]);

  if (getServiciosLoading || cambiarStatusServicioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServiciosError || cambiarStatusServicioError) {
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
                  Lista de Servicios
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
                      setIdServicio(0);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            modulo: "servicios",
                            showComponent: 1,
                            idServicio: idServicio,
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
                              setStatusServicio(row.estatus);
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
        <GuardarServicio
          correo={correo}
          password={password}
          setShowComponent={setShowComponent}
          busquedaFiltro={busquedaFiltro}
          page={page}
          executeGetServicios={executeGetServicios}
          setLoading={setLoading}
          idServicio={idServicio}
        />
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
                  modulo: "servicios",
                  showComponent: 1,
                  idServicio: idServicio,
                  busquedaFiltro: busquedaFiltro,
                  page: page,
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
                statusServicio === 0
                  ? "¿Está seguro de dar de alta este servicio?"
                  : "¿Está seguro de dar de baja este servicio?",
              buttons: ["No", "Sí"],
              dangerMode: true,
            }).then((value) => {
              if (value) {
                executeCambiarStatusServicio({
                  data: {
                    usuario: correo,
                    pwd: password,
                    idservicio: idServicio,
                    status: statusServicio === 0 ? 1 : 0,
                  },
                });
              }
            });
          }}
        >
          <ListItemText
            primary={statusServicio === 0 ? "Dar de alta" : "Dar de baja"}
          />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function GuardarServicio(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setShowComponent = props.setShowComponent;
  const busquedaFiltro = props.busquedaFiltro;
  const page = props.page;
  const executeGetServicios = props.executeGetServicios;
  const setLoading = props.setLoading;
  const idServicio = props.idServicio;
  const [codigoServicio, setCodigoServicio] = useState("");
  const [nombreServicio, setNombreServicio] = useState("");
  const [precioServicio, setPrecioServicio] = useState("");
  const [descripcionServicio, setDescripcionServicio] = useState("");
  const [tipoServicio, setTipoServicio] = useState("0");
  const [actualizableServicio, setActualizableServicio] = useState("0");
  const [fechaServicio, setfechaServicio] = useState("");
  const [
    {
      data: getServicioData,
      loading: getServicioLoading,
      error: getServicioError,
    },
    executeGetServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServicio`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        idservicio: idServicio,
      },
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: guardarServicioData,
      loading: guardarServicioLoading,
      error: guardarServicioError,
    },
    executeGuardarServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarServicio`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (idServicio !== 0) {
      executeGetServicio();
    }
  }, [idServicio, executeGetServicio]);

  useEffect(() => {
    function checkData() {
      if (getServicioData) {
        if (getServicioData.error !== 0) {
          swal("Error", dataBaseErrores(getServicioData.error), "warning");
        } else {
          console.log(getServicioData.servicio[0]);
          setCodigoServicio(getServicioData.servicio[0].codigoservicio);
          setNombreServicio(getServicioData.servicio[0].nombreservicio);
          setPrecioServicio(getServicioData.servicio[0].precio);
          setDescripcionServicio(getServicioData.servicio[0].descripcion);
          setTipoServicio(getServicioData.servicio[0].tipo);
          setActualizableServicio(getServicioData.servicio[0].actualizable);
          setfechaServicio(getServicioData.servicio[0].fecha);
        }
      }
    }

    checkData();
  }, [getServicioData]);

  useEffect(() => {
    function checkData() {
      if (guardarServicioData) {
        if (guardarServicioData.error !== 0) {
          swal("Error", dataBaseErrores(guardarServicioData.error), "warning");
        } else {
          swal(
            idServicio === 0 ? "Servicio Agregado" : "Servicio Editado",
            idServicio === 0
              ? "Servicio agregado con éxito"
              : "Servicio editado con éxito",
            "success"
          );
          executeGetServicios();
          if (idServicio === 0) {
            setShowComponent(0);
          }
        }
      }
    }

    checkData();
  }, [guardarServicioData, executeGetServicios, setShowComponent, idServicio]);

  if (getServicioLoading || guardarServicioLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServicioError || guardarServicioError) {
    return <ErrorQueryDB />;
  }

  const guardarServicio = () => {
    if (codigoServicio.trim() === "") {
      swal("Error", "Agregue un código", "warning");
    } else if (nombreServicio.trim() === "") {
      swal("Error", "Agregue un nombre", "warning");
    } else if (precioServicio === "") {
      swal("Error", "Agregue un precio", "warning");
    } else if (descripcionServicio.trim() === "") {
      swal("Error", "Agregue una descripción", "warning");
    } else if (tipoServicio === "0") {
      swal("Error", "Seleccione un tipo", "warning");
    } else if (actualizableServicio === "0") {
      swal("Error", "Seleccione un actualizable", "warning");
    } else if (fechaServicio === "") {
      swal("Error", "Seleccione una fecha", "warning");
    } else {
      executeGuardarServicio({
        data: {
          usuario: correo,
          pwd: password,
          codigo: codigoServicio.trim(),
          nombre: nombreServicio.trim(),
          precio: precioServicio,
          descripcion: descripcionServicio.trim(),
          tipo: tipoServicio,
          actualizable: actualizableServicio,
          fecha: fechaServicio,
          idservicio: idServicio,
        },
      });
    }
  };

  return (
    <Card style={{ padding: "15px" }}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.titleTable} variant="h6">
            <Tooltip title="Regresar">
              <IconButton
                onClick={() => {
                  setShowComponent(0);
                  const token = jwt.sign(
                    {
                      menuTemporal: {
                        modulo: "servicios",
                        showComponent: 0,
                        idServicio: 0,
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
            {idServicio === 0 ? "Crear Servicio" : "Editar Servicio"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="codigoServicio"
            label="Código"
            type="text"
            required
            margin="normal"
            value={codigoServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setCodigoServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="nombreServicio"
            label="Nombre"
            type="text"
            required
            margin="normal"
            value={nombreServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setNombreServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="precioServicio"
            label="Precio"
            type="text"
            required
            margin="normal"
            value={precioServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              doubleKeyValidation(e, 2);
            }}
            onChange={(e) => {
              doublePasteValidation(e, 2);
              setPrecioServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="descipcionServicio"
            label="Descripción"
            type="text"
            required
            margin="normal"
            value={descripcionServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 3);
            }}
            onChange={(e) => {
              pasteValidation(e, 3);
              setDescripcionServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="tipoServicio"
            label="Tipo"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={tipoServicio}
            inputProps={{
              maxLength: 50,
            }}
            onChange={(e) => {
              setTipoServicio(e.target.value);
            }}
          >
            <option value="0">Seleccione un tipo</option>
            <option value="1">Único</option>
            <option value="2">Semanal</option>
            <option value="3">Mensual</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="actualizableServicio"
            label="Actualizable"
            type="text"
            required
            select
            SelectProps={{
              native: true,
            }}
            margin="normal"
            value={actualizableServicio}
            inputProps={{
              maxLength: 50,
            }}
            onChange={(e) => {
              setActualizableServicio(e.target.value);
            }}
          >
            <option value="0">Seleccione un tipo</option>
            <option value="1">Único</option>
            <option value="2">Semanal</option>
            <option value="3">Mensual</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.textFields}
            id="fechaServicio"
            label="Fecha"
            type="date"
            required
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={fechaServicio}
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={(e) => {
              keyValidation(e, 2);
            }}
            onChange={(e) => {
              setfechaServicio(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={() => {
              guardarServicio();
            }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
