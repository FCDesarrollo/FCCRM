import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Grid,
  Button,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  Paper,
  Toolbar,
  Tooltip,
  IconButton,
  TextField,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  ClearAll as ClearAllIcon,
  Error as ErrorIcon,
  KeyboardReturn as KeyboardReturnIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import moment from "moment";
import jwt from "jsonwebtoken";

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
  link: {
    cursor: "pointer",
    color: "#428bca",
    "&:hover": {
      textDecoration: "underline",
      color: "#2a6496",
    },
  },
}));

function createData(
  id,
  servicio,
  periodo,
  ejercicio,
  fechaCorte,
  archivo,
  usuarioEntrego,
  urlArchivo
) {
  return {
    id,
    servicio,
    periodo,
    ejercicio,
    fechaCorte,
    archivo,
    usuarioEntrego,
    urlArchivo,
  };
}

let filterRows = [];

const headCells = [
  {
    id: "servicio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Servicio",
  },
  {
    id: "periodo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Periodo",
  },
  {
    id: "ejercicio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Ejercicio",
  },
  {
    id: "fechaCorte",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha de corte",
  },
  {
    id: "archivo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Archivo",
  },
  {
    id: "usuarioEntrego",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario que entregó",
  },
];

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

export default function ExpedientesContables(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const idEmpresa = empresaDatos.idempresa;
  const rfc = empresaDatos.RFC;
  const setLoading = props.setLoading;
  const [idSubmenu, setIdsubmenu] = useState(0);
  const [showComponent, setShowComponent] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [titulo, setTitulo] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(0);

  const [
    {
      data: getBitContabilidadData,
      loading: getBitContabilidadLoading,
      error: getBitContabilidadError,
    },
    executeGetBitContabilidad,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getBitContabilidad`,
      method: "GET",
    },
    {
      useCache: false,
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
        setShowComponent(decodedToken.menuTemporal.showComponent);
        setTitulo(decodedToken.menuTemporal.titulo);
        setIdsubmenu(decodedToken.menuTemporal.idSubmenu);
        setBusquedaFiltro(decodedToken.menuTemporal.busquedaFiltro);
        setPage(decodedToken.menuTemporal.page);
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
        setIdsubmenu(decodedToken.notificacionData.idSubmenu);
        setBusquedaFiltro(decodedToken.notificacionData.busquedaFiltro);
        //setPage(decodedToken.notificacionData.page);
      } catch (err) {
        localStorage.removeItem("notificacionData");
      }
    } else {
      const token = jwt.sign(
        {
          menuTemporal: {
            showComponent: 0,
            titulo: "",
            idSubmenu: 0,
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
    if (localStorage.getItem("notificacionData")) {
      if (submenuContent.length > 0 && titulo === "") {
        const decodedToken = jwt.verify(
          localStorage.getItem("notificacionData"),
          "mysecretpassword"
        );
        for (let x = 0; x < submenuContent.length; x++) {
          if (
            submenuContent[x].submenu.idsubmenu ===
            parseInt(decodedToken.notificacionData.idSubmenu)
          ) {
            setTitulo(submenuContent[x].submenu.nombre_submenu);
          }
        }
      }
    }
  }, [submenuContent, titulo]);

  useEffect(() => {
    if (idSubmenu !== 0) {
      executeGetBitContabilidad({
        params: {
          usuario: correo,
          pwd: password,
          rfc: rfc,
          idsubmenu: idSubmenu,
          idempresa: idEmpresa,
        },
      });
    }
  }, [idSubmenu, executeGetBitContabilidad, correo, password, rfc, idEmpresa]);

  useEffect(() => {
    if (getBitContabilidadData) {
      if (getBitContabilidadData.error !== 0) {
        swal("Error", dataBaseErrores(getBitContabilidadData.error), "warning");
      } else {
        filterRows = [];
        getBitContabilidadData.bitcontabilidad.map((bit) => {
          return filterRows.push(
            createData(
              bit.id,
              bit.servicio,
              bit.periodo < 10 ? `0${bit.periodo}` : bit.periodo,
              bit.ejercicio,
              bit.fechacorte,
              bit.nombrearchivoE !== null ? bit.nombrearchivoE : bit.archivodet,
              bit.usuarioEntrego,
              bit.urlarchivo
            )
          );
        });
        setRows(filterRows);
      }
    }
  }, [getBitContabilidadData]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRows.length; x++) {
        if (
          (filterRows[x].servicio !== null &&
            filterRows[x].servicio
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].periodo !== null &&
            filterRows[x].periodo
              .toString()
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].ejercicio !== null &&
            filterRows[x].ejercicio
              .toString()
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].fechaCorte !== null &&
            filterRows[x].fechaCorte
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].fechaCorte !== null &&
            moment(filterRows[x].fechaCorte)
              .format("DD/MM/YYYY h:mm:ss a")
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].archivo !== null &&
            filterRows[x].archivo
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].usuarioEntrego !== null &&
            filterRows[x].usuarioEntrego
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1)
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
      setSelectedEstado(decodedToken.notificacionData.idEstado);
      const token = jwt.sign(
        {
          menuTemporal: {
            showComponent: 1,
            titulo: titulo,
            idSubmenu: decodedToken.notificacionData.idSubmenu,
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
            showComponent: showComponent,
            titulo: titulo,
            idSubmenu: idSubmenu,
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
    } else {
      const token = jwt.sign(
        {
          menuTemporal: {
            showComponent: showComponent,
            titulo: titulo,
            idSubmenu: idSubmenu,
            busquedaFiltro: busquedaFiltro,
            page: page,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
  }, [
    busquedaFiltro,
    setRows,
    rows.length,
    rowsPerPage,
    page,
    idSubmenu,
    titulo,
    showComponent,
  ]);

  if (getBitContabilidadLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getBitContabilidadError) {
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

  return (
    <div>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Expedientes Contables
            </Typography>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden !== 0 ? (
              <Grid item xs={12} md={4} key={index}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    executeGetBitContabilidad({
                      params: {
                        usuario: correo,
                        pwd: password,
                        rfc: rfc,
                        idsubmenu: content.submenu.idsubmenu,
                        idempresa: idEmpresa,
                      },
                    });
                    setTitulo(content.submenu.nombre_submenu);
                    setShowComponent(1);
                    setIdsubmenu(content.submenu.idsubmenu);
                    setSelectedEstado(0);
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          showComponent: 1,
                          titulo: content.submenu.nombre_submenu,
                          idSubmenu: content.submenu.idsubmenu,
                          busquedaFiltro: "",
                          page: 0,
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
      {showComponent !== 0 ? (
        <Card style={{ marginTop: "15px", padding: "15px" }}>
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
                    <Tooltip title="Cerrar">
                      <IconButton
                        aria-label="cerrar"
                        onClick={() => {
                          setShowComponent(0);
                          setSelectedEstado(0);
                          const token = jwt.sign(
                            {
                              menuTemporal: {
                                showComponent: 0,
                                titulo: "",
                                idSubmenu: 0,
                                busquedaFiltro: "",
                                page: 0,
                              },
                            },
                            "mysecretpassword"
                          );
                          localStorage.setItem("menuTemporal", token);
                          localStorage.removeItem("notificacionData");
                        }}
                      >
                        <CloseIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                    {titulo}
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
                  headCells={headCells}
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
                            key={index}
                          >
                            <TableCell
                              padding="checkbox"
                              style={{
                                background:
                                  selectedEstado === row.id ? "green" : "",
                              }}
                            >
                              {selectedEstado === row.id ? (
                                <Link to="/">
                                  <Tooltip title="Regresar a Home">
                                    <IconButton
                                      onClick={() => {
                                        localStorage.removeItem(
                                          "notificacionData"
                                        );
                                      }}
                                    >
                                      <KeyboardReturnIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Link>
                              ) : null}
                            </TableCell>
                            <TableCell align="right" id={labelId}>
                              {row.servicio}
                            </TableCell>
                            <TableCell align="right">{row.periodo}</TableCell>
                            <TableCell align="right">{row.ejercicio}</TableCell>
                            <TableCell align="right">
                              {row.fechaCorte}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip
                                title="Click para abrir archivo"
                                onClick={() => {
                                  window.open(row.urlArchivo);
                                }}
                              >
                                <span className={classes.link}>
                                  {row.archivo}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                              {row.usuarioEntrego}
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
                          No hay bitácoras disponibles
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
        </Card>
      ) : null}
    </div>
  );
}
