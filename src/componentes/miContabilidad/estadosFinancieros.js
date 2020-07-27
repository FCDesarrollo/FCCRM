import React, { useState, useEffect } from "react";
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
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import moment from "moment";

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
  periodoEjercicio,
  fechaEntrega,
  archivo,
  usuarioEntrego,
  urlArchivo
) {
  return {
    id,
    servicio,
    periodoEjercicio,
    fechaEntrega,
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
    id: "periodoEjercicio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Periodo de ejercicio",
  },
  {
    id: "fechaEntrega",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha de entrega",
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

export default function EstadosFinancieros(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const idEmpresa = empresaDatos.idempresa;
  const rfc = empresaDatos.RFC;
  const setLoading = props.setLoading;
  //const [idSubmenu, setIdsubmenu] = useState(0);
  const [showComponent, setShowComponent] = useState(0);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [titulo, setTitulo] = useState("");

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
              bit.periodo,
              bit.fechaentregado,
              bit.archivo,
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
          (filterRows[x].periodoEjercicio !== null &&
            filterRows[x].periodoEjercicio
              .toString()
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].fechaEntrega !== null &&
            filterRows[x].fechaEntrega
              .toLowerCase()
              .indexOf(busquedaFiltro.toLowerCase()) !== -1) ||
          (filterRows[x].fechaEntrega !== null &&
            moment(filterRows[x].fechaEntrega)
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
    setPage(rows.length < rowsPerPage ? 0 : page);
  }, [busquedaFiltro, setRows, rows.length, rowsPerPage, page]);

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
              Estados Financieros
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
                    //setIdsubmenu(content.submenu.idsubmenu);3
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
                            <TableCell padding="checkbox" />
                            <TableCell align="right" id={labelId}>
                              {row.servicio}
                            </TableCell>
                            <TableCell align="right">
                              {row.periodoEjercicio}
                            </TableCell>
                            <TableCell align="right">
                              {row.fechaentrega}
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
                      <TableCell colSpan={6}>
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
