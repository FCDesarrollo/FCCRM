import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  IconButton,
  CardActionArea,
  CardContent,
  TextField,
} from "@material-ui/core";
import {
  Settings as SettingsIcon,
  Error as ErrorIcon,
  SettingsEthernet as SettingsEthernetIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Chart from "react-apexcharts";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
/* import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert"; */

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

function createData(
  id,
  fecha,
  idModulo,
  nombreModulo,
  idMenu,
  nombreMenu,
  idSubmenu,
  nombreSubmenu,
  idUsuario,
  nombreUsuario,
  tipoDocumento,
  acciones
) {
  return {
    id,
    fecha,
    idModulo,
    nombreModulo,
    idMenu,
    nombreMenu,
    idSubmenu,
    nombreSubmenu,
    idUsuario,
    nombreUsuario,
    tipoDocumento,
    acciones,
  };
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
    id: "fecha",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Fecha",
  },
  {
    id: "menu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Menú",
  },
  {
    id: "submenu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Submenú",
  },
  {
    id: "usuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario",
  },
  {
    id: "tipoDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Documento",
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

export default function Home(props) {
  /* const menu = props.menu;
  const permisos = props.permisos;
  console.log(menu);
  console.log(permisos); */
  const classes = useStyles();
  const setLoading = props.setLoading;
  const empresaDatos = props.empresaDatos;
  const dbEmpresa = empresaDatos.rutaempresa;
  const [documentos, setDocumentos] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modulos, setModulos] = useState({
    ids: [],
    nombre: [],
    cantidad: [],
  });
  const [menus, setMenus] = useState({
    ids: [],
    nombre: [],
    cantidad: [],
  });
  const [usuarios, setUsuarios] = useState({
    ids: [],
    nombre: [],
    cantidad: [],
  });
  const [selectedIdModulo, setSelectedIdModulo] = useState(0);
  const [selectedModulo, setSelectedModulo] = useState("");
  const [selectedIdMenu, setSelectedIdMenu] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("");

  const [
    {
      data: getDatosHomeData,
      loading: getDatosHomeLoading,
      error: getDatosHomeError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getDatosHome`,
      method: "GET",
      params: {
        db: dbEmpresa,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (getDatosHomeData) {
      let idsModulos = [];
      let nombreModulos = [];
      let cantidadModulos = [];
      filterRows = [];
      for (let x = 0; x < getDatosHomeData.documento.length; x++) {
        filterRows.push(
          createData(
            getDatosHomeData.documento[x].id,
            getDatosHomeData.documento[x].fecha,
            getDatosHomeData.documento[x].idmodulo,
            getDatosHomeData.documento[x].nombre_modulo,
            getDatosHomeData.documento[x].idmenu,
            getDatosHomeData.documento[x].nombre_menu,
            getDatosHomeData.documento[x].idsubmenu,
            getDatosHomeData.documento[x].nombre_submenu,
            getDatosHomeData.documento[x].idusuario,
            getDatosHomeData.documento[x].usuario,
            "Requerimiento",
            <IconButton>
              <SettingsEthernetIcon style={{ color: "black" }} />
            </IconButton>
          )
        );
        if (
          !nombreModulos.includes(getDatosHomeData.documento[x].nombre_modulo)
        ) {
          idsModulos.push(getDatosHomeData.documento[x].idmodulo);
          nombreModulos.push(getDatosHomeData.documento[x].nombre_modulo);
          cantidadModulos.push(1);
        } else {
          const pos = nombreModulos.indexOf(
            getDatosHomeData.documento[x].nombre_modulo
          );
          if (cantidadModulos[pos]) {
            cantidadModulos[pos] = cantidadModulos[pos] + 1;
          } else {
            cantidadModulos[pos] = 1;
          }
        }
      }

      setDocumentos(filterRows);

      setSelectedModulo(nombreModulos[0]);
      setModulos({
        ids: idsModulos,
        nombre: nombreModulos,
        cantidad: cantidadModulos,
      });
    }
  }, [getDatosHomeData]);

  if (getDatosHomeLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getDatosHomeError) {
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

  const llenarTabla = (idModulo, idMenu, idUsuario) => {
    console.log(documentos);
    let newRows =
      idUsuario === 0
        ? documentos.filter(
            (documento) =>
              documento.idModulo === idModulo && documento.idMenu === idMenu
          )
        : documentos.filter(
            (documento) =>
              documento.idModulo === idModulo &&
              documento.idMenu === idMenu &&
              documento.idUsuario === idUsuario
          );
    let idUsuarios = [];
    let nombreUsuarios = [];
    let cantidadUsuarios = [];
    //console.log(newRows);

    for (let x = 0; x < newRows.length; x++) {
      if (!nombreUsuarios.includes(newRows[x].nombreUsuario)) {
        idUsuarios.push(newRows[x].idUsuario);
        nombreUsuarios.push(newRows[x].nombreUsuario);
        cantidadUsuarios.push(1);
      } else {
        const pos = nombreUsuarios.indexOf(newRows[x].nombreUsuario);
        if (cantidadUsuarios[pos]) {
          cantidadUsuarios[pos] = cantidadUsuarios[pos] + 1;
        } else {
          cantidadUsuarios[pos] = 1;
        }
      }
    }

    setRows(newRows);
    setUsuarios({
      ids: idUsuarios,
      nombre: nombreUsuarios,
      cantidad: cantidadUsuarios,
    });
  };

  const llenarGraficaMenu = (idModulo) => {
    let idsMenus = [];
    let nombreMenus = [];
    let cantidadMenus = [];
    for (let x = 0; x < getDatosHomeData.documento.length; x++) {
      if (getDatosHomeData.documento[x].idmodulo === idModulo) {
        if (!idsMenus.includes(getDatosHomeData.documento[x].idmenu)) {
          idsMenus.push(getDatosHomeData.documento[x].idmenu);
          nombreMenus.push(getDatosHomeData.documento[x].nombre_menu);
          cantidadMenus.push(1);
        } else {
          const pos = idsMenus.indexOf(getDatosHomeData.documento[x].idmenu);
          if (cantidadMenus[pos]) {
            cantidadMenus[pos] = cantidadMenus[pos] + 1;
          } else {
            cantidadMenus[pos] = 1;
          }
        }
      }
    }

    setMenus({
      ids: idsMenus,
      nombre: nombreMenus,
      cantidad: cantidadMenus,
    });
    setSelectedIdMenu(idsMenus[0]);
    setSelectedMenu(nombreMenus[0]);
    llenarTabla(idModulo, idsMenus[0], 0);
  };

  const seriesModulos = modulos.cantidad;
  const optionsModulos = {
    chart: {
      width: "100%",
      type: "pie",
      events: {
        mounted: function (chartContext, config) {
          llenarGraficaMenu(modulos.ids[0]);
          setSelectedIdModulo(modulos.ids[0]);
          setSelectedModulo(modulos.nombre[0]);
        },
        dataPointSelection: function (event, chartContext, { dataPointIndex }) {
          llenarGraficaMenu(modulos.ids[dataPointIndex]);
          /* console.log(dataPointIndex);
          console.log(modulos.nombre[dataPointIndex]); */
          setSelectedIdModulo(modulos.ids[dataPointIndex]);
          setSelectedModulo(modulos.nombre[dataPointIndex]);
        },
      },
    },
    labels: modulos.nombre,
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Módulos",
    },
    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: false,
    },
  };

  const seriesMenus = menus.cantidad;
  const optionsMenus = {
    chart: {
      width: "100%",
      type: "pie",
      events: {
        mounted: function (chartContext, config) {
          setSelectedIdMenu(menus.ids[0]);
          setSelectedMenu(menus.nombre[0]);
        },
        dataPointSelection: function (event, chartContext, { dataPointIndex }) {
          setSelectedIdMenu(menus.ids[dataPointIndex]);
          setSelectedMenu(menus.nombre[dataPointIndex]);
          llenarTabla(selectedIdModulo, menus.ids[dataPointIndex], 0);
        },
      },
    },
    labels: menus.nombre,
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Menús",
    },
    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                style={{
                  fontSize: ".625rem",
                  color: "#818ea3",
                  letterSpacing: ".125rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Dashboard de transacciones
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  fontSize: "1.625rem",
                  color: "#3d5170",
                  lineHeight: "1",
                  fontWeight: "500",
                  margin: 0,
                  padding: 0,
                }}
              >
                Período de Julio
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="periodo"
                className={classes.textFields}
                label="Período"
                select
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value="0">Seleccione un período</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="ejercicio"
                className={classes.textFields}
                label="Ejercicio"
                select
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value="0">Seleccione un ejercicio</option>
                <option value="1">2019</option>
                <option value="2">2020</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {`${selectedModulo} > ${selectedMenu}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {usuarios.nombre.map((usuario, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <CardActionArea
                      style={{ height: "200px" }}
                      onClick={() => {
                        llenarTabla(
                          selectedIdModulo,
                          selectedIdMenu,
                          usuarios.ids[index]
                        );
                        console.log(
                          selectedIdModulo,
                          selectedIdMenu,
                          usuarios.ids[index]
                        );
                      }}
                    >
                      <CardContent style={{ padding: "15px" }}>
                        <Typography
                          variant="h6"
                          style={{
                            color: "#818ea3",
                            textAlign: "center",
                            fontWeight: "500",
                            textTransform: "uppercase",
                          }}
                        >
                          {usuario}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          style={{
                            fontSize: "2.0625rem",
                            color: "#3d5170",
                            textAlign: "center",
                            fontWeight: "500",
                            textTransform: "uppercase",
                          }}
                        >
                          {usuarios.cantidad[index]}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper>
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
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                >
                                  {row.fecha}
                                </TableCell>
                                <TableCell align="right">
                                  {row.nombreMenu}
                                </TableCell>
                                <TableCell align="right">
                                  {row.nombreSubmenu}
                                </TableCell>
                                <TableCell align="right">
                                  {row.nombreUsuario}
                                </TableCell>
                                <TableCell align="right">
                                  {row.tipoDocumento}
                                </TableCell>
                                <TableCell align="right">
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
                              No hay documentos disponibles
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
                    rows.length > 0 && rows.length >= rowsPerPage ? page : 0
                  }
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Chart
                    options={optionsModulos}
                    series={seriesModulos}
                    type="pie"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Chart
                    options={optionsMenus}
                    series={seriesMenus}
                    type="pie"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
