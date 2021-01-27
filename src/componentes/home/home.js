import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  CardActionArea,
  CardContent,
  TextField,
  Button,
} from "@material-ui/core";
import {
  Settings as SettingsIcon,
  Error as ErrorIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Chart from "react-apexcharts";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import jwt from "jsonwebtoken";
import moment from "moment";
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

function createDataPrincipal(
  nombreModulo,
  nombreMenu,
  idSubmenu,
  nombreSubmenu,
  cantidad,
  acciones
) {
  return {
    nombreModulo,
    nombreMenu,
    idSubmenu,
    nombreSubmenu,
    cantidad,
    acciones,
  };
}

function createData(
  id,
  fechaRegistro,
  fechaDocumento,
  ejercicio,
  periodo,
  idModulo,
  nombreModulo,
  idMenu,
  nombreMenu,
  idSubmenu,
  nombreSubmenu,
  idUsuario,
  nombreUsuario,
  detalles,
  acciones
) {
  return {
    id,
    fechaRegistro,
    fechaDocumento,
    ejercicio,
    periodo,
    idModulo,
    nombreModulo,
    idMenu,
    nombreMenu,
    idSubmenu,
    nombreSubmenu,
    idUsuario,
    nombreUsuario,
    detalles,
    acciones,
  };
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

const headCellsPrincipal = [
  {
    id: "nombreModulo",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Módulo",
  },
  {
    id: "nombreMenu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Menú",
  },
  {
    id: "nombreSubmenu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Submenú",
  },
  {
    id: "cantidad",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Cantidad",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

const headCells = [
  {
    id: "fechaRegistro",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Fecha de Registro",
  },
  {
    id: "fechaDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha de Documento",
  },
  {
    id: "nombreMenu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Menú",
  },
  {
    id: "nombreSubmenu",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Submenú",
  },
  {
    id: "nombreUsuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario",
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
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const classes = useStyles();
  const setLoading = props.setLoading;
  const empresaDatos = props.empresaDatos;
  const dbEmpresa = empresaDatos.rutaempresa;
  const [documentos, setDocumentos] = useState([]);
  const [rowsPrincipal, setRowsPrincipal] = useState([]);
  const [pagePrincipal, setPagePrincipal] = useState(0);
  const [orderPrincipal, setOrderPrincipal] = useState("desc");
  const [orderByPrincipal, setOrderByPrincipal] = useState("cantidad");
  const [rowsPerPagePrincipal, setRowsPerPagePrincipal] = useState(10);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("fechaRegistro");
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
  const [selectedIdUsuario, setSelectedIdUsuario] = useState(0);
  const [selectedNombreUsuario, setSelectedNombreUsuario] = useState("");
  const [periodos, setPeriodos] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState("0");
  const [selectedEjercicio, setSelectedEjercicio] = useState("0");
  const [selectedIdDocumento, setSelectedIdDocumento] = useState(0);
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

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
        idusuario: idUsuario,
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
      let datosDocumentos = [];
      for (let x = 0; x < getDatosHomeData.documento.length; x++) {
        datosDocumentos.push(
          createData(
            getDatosHomeData.documento[x].id,
            getDatosHomeData.documento[x].fecharegistro,
            getDatosHomeData.documento[x].fechadocumento,
            getDatosHomeData.documento[x].ejercicio,
            getDatosHomeData.documento[x].periodo,
            getDatosHomeData.documento[x].idmodulo,
            getDatosHomeData.documento[x].nombre_modulo,
            getDatosHomeData.documento[x].idmenu,
            getDatosHomeData.documento[x].nombre_menu,
            getDatosHomeData.documento[x].idsubmenu,
            getDatosHomeData.documento[x].nombre_submenu,
            getDatosHomeData.documento[x].idusuario,
            getDatosHomeData.documento[x].usuario,
            getDatosHomeData.documento[x].extra1,
            <Link
              to={getDatosHomeData.documento[x].refmenu}
              style={{ textDecoration: "none" }}
              onClick={() => {
                const token =
                  getDatosHomeData.documento[x].refmenu ===
                  "autorizacionesGastos"
                    ? jwt.sign(
                        {
                          notificacionData: {
                            tableTittle:
                              getDatosHomeData.documento[x].idsubmenu === 44
                                ? "Gastos"
                                : getDatosHomeData.documento[x].idsubmenu === 68
                                ? "Compras"
                                : getDatosHomeData.documento[x].idsubmenu === 69
                                ? "Ventas"
                                : "Pagos",
                            showComponent: 2,
                            idModulo: getDatosHomeData.documento[x].idmodulo,
                            idMenu: getDatosHomeData.documento[x].idmenu,
                            idSubmenu: getDatosHomeData.documento[x].idsubmenu,
                            accionAG: 2,
                            idRequerimiento: getDatosHomeData.documento[x].id,
                            estatusRequerimiento:
                              getDatosHomeData.documento[x].extra1,
                            page: -1,
                          },
                        },
                        "mysecretpassword"
                      )
                    : getDatosHomeData.documento[x].refmenu ===
                        "estadosFinancieros" ||
                      getDatosHomeData.documento[x].refmenu ===
                        "expedientesContables"
                    ? jwt.sign(
                        {
                          notificacionData: {
                            idEstado: getDatosHomeData.documento[x].id,
                            showComponent: 1,
                            idSubmenu: getDatosHomeData.documento[x].idsubmenu,
                            busquedaFiltro: "",
                            page: -1,
                          },
                        },
                        "mysecretpassword"
                      )
                    : getDatosHomeData.documento[x].refmenu ===
                        "almacenDigitalExpedientes" ||
                      getDatosHomeData.documento[x].refmenu ===
                        "almacenDigitalOperaciones"
                    ? jwt.sign(
                        {
                          notificacionData: {
                            idAlmacenDigital: getDatosHomeData.documento[x].id,
                            showComponent: 1,
                            tableTittle:
                              getDatosHomeData.documento[x].nombre_submenu,
                            idSubmenu: getDatosHomeData.documento[x].idsubmenu,
                            page: -1,
                            busquedaFiltro: "",
                          },
                        },
                        "mysecretpassword"
                      )
                    : getDatosHomeData.documento[x].refmenu ===
                      "recepcionPorLotes"
                    ? jwt.sign(
                        {
                          notificacionData: {
                            idLote: getDatosHomeData.documento[x].id,
                            showComponent: 1,
                            tableTittle:
                              getDatosHomeData.documento[x].nombre_submenu,
                            idSubmenu: getDatosHomeData.documento[x].idsubmenu,
                            page: -1,
                          },
                        },
                        "mysecretpassword"
                      )
                    : [];
                localStorage.setItem("notificacionData", token);

                const decodedToken = jwt.verify(
                  localStorage.getItem("home"),
                  "mysecretpassword"
                );
                decodedToken.home.idDocumento =
                  getDatosHomeData.documento[x].id;
                const home = decodedToken.home;
                const tokenHome = jwt.sign(
                  {
                    home,
                  },
                  "mysecretpassword"
                );
                localStorage.setItem("home", tokenHome);
              }}
            >
              <Button variant="contained" color="primary">
                Ir
              </Button>
            </Link>
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

      setDocumentos(datosDocumentos);

      for (let x = 0; x < cantidadModulos.length; x++) {
        for (let y = 0; y < cantidadModulos.length - 1; y++) {
          if (cantidadModulos[y] < cantidadModulos[y + 1]) {
            let idAuxiliar = idsModulos[y];
            idsModulos[y] = idsModulos[y + 1];
            idsModulos[y + 1] = idAuxiliar;
            let nombreAuxiliar = nombreModulos[y];
            nombreModulos[y] = nombreModulos[y + 1];
            nombreModulos[y + 1] = nombreAuxiliar;
            let cantidadAuxiliar = cantidadModulos[y];
            cantidadModulos[y] = cantidadModulos[y + 1];
            cantidadModulos[y + 1] = cantidadAuxiliar;
          }
        }
      }

      if (localStorage.getItem("home")) {
        const decodedToken = jwt.verify(
          localStorage.getItem("home"),
          "mysecretpassword"
        );
        const pos = idsModulos.indexOf(decodedToken.home.idModulo);
        setSelectedModulo(nombreModulos[pos]);
      } else {
        setSelectedModulo(nombreModulos[0]);
      }
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

  const handleRequestSortPrincipal = (event, property) => {
    const isAsc = orderByPrincipal === property && orderPrincipal === "asc";
    setOrderPrincipal(isAsc ? "desc" : "asc");
    setOrderByPrincipal(property);
  };

  const handleChangePagePrincipal = (event, newPage) => {
    setPagePrincipal(newPage);
  };

  const handleChangeRowsPerPagePrincipal = (event) => {
    setRowsPerPagePrincipal(parseInt(event.target.value, 10));
    setPagePrincipal(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const decodedToken = jwt.verify(
      localStorage.getItem("home"),
      "mysecretpassword"
    );
    decodedToken.home.page = newPage;
    const home = decodedToken.home;
    const token = jwt.sign(
      {
        home,
      },
      "mysecretpassword"
    );
    localStorage.setItem("home", token);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const decodedToken = jwt.verify(
      localStorage.getItem("home"),
      "mysecretpassword"
    );
    decodedToken.home.page = 0;
    const home = decodedToken.home;
    const token = jwt.sign(
      {
        home,
      },
      "mysecretpassword"
    );
    localStorage.setItem("home", token);
  };

  const llenarTabla = (
    idModulo,
    idMenu,
    idSubmenu,
    idUsuario,
    validacion,
    periodo,
    ejercicio
  ) => {
    let newRows = documentos.filter(
      (documento) =>
        documento.idModulo === idModulo && documento.idMenu === idMenu
    );

    if (idSubmenu !== 0) {
      newRows = newRows.filter(
        (documento) => documento.idSubmenu === idSubmenu
      );
    }

    if (idUsuario !== 0) {
      newRows = newRows.filter(
        (documento) => documento.idUsuario === idUsuario
      );
    }

    if (validacion !== 3) {
      if (periodo !== "0") {
        newRows = newRows.filter((documento) => documento.periodo === periodo);
      }

      if (ejercicio !== "0") {
        newRows = newRows.filter(
          (documento) => documento.ejercicio === ejercicio
        );
      }
    }

    let primerIdSubmenu = 0;
    if (validacion !== 2) {
      let idSubmenus = [];
      let nombreSubmenus = [];
      let cantidadSubmenus = [];
      let datos = newRows;

      if (validacion === 3) {
        if (periodo !== "0") {
          datos = datos.filter((documento) => documento.periodo === periodo);
        }

        if (ejercicio !== "0") {
          datos = datos.filter(
            (documento) => documento.ejercicio === ejercicio
          );
        }
      }

      for (let x = 0; x < datos.length; x++) {
        if (!nombreSubmenus.includes(datos[x].nombreSubmenu)) {
          idSubmenus.push(datos[x].idSubmenu);
          nombreSubmenus.push(datos[x].nombreSubmenu);
          cantidadSubmenus.push(1);
        } else {
          const pos = nombreSubmenus.indexOf(datos[x].nombreSubmenu);
          if (cantidadSubmenus[pos]) {
            cantidadSubmenus[pos] = cantidadSubmenus[pos] + 1;
          } else {
            cantidadSubmenus[pos] = 1;
          }
        }
      }

      let rowsPrincipalData = [];
      for (let x = 0; x < nombreSubmenus.length; x++) {
        rowsPrincipalData.push(
          createDataPrincipal(
            datos[0].nombreModulo,
            datos[0].nombreMenu,
            idSubmenus[x],
            nombreSubmenus[x],
            cantidadSubmenus[x],
            <Button variant="contained" color="primary">
              Ver Documentos
            </Button>
          )
        );
      }

      primerIdSubmenu =
        rowsPrincipalData.length > 0
          ? stableSort(
              rowsPrincipalData,
              getComparator(orderPrincipal, orderByPrincipal)
            )[0].idSubmenu
          : 0;

      setRowsPrincipal(rowsPrincipalData);
    }

    if (validacion === 1 || validacion === 3) {
      let idUsuarios = [];
      let nombreUsuarios = [];
      let cantidadUsuarios = [];
      let nuevosPeriodos = [];
      let nuevosEjercicios = [];

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

        if (!nuevosPeriodos.includes(newRows[x].periodo)) {
          nuevosPeriodos.push(newRows[x].periodo);
        }

        if (!nuevosEjercicios.includes(newRows[x].ejercicio)) {
          nuevosEjercicios.push(newRows[x].ejercicio);
        }
      }

      if (validacion === 3) {
        if (periodo !== "0") {
          newRows = newRows.filter(
            (documento) => documento.periodo === periodo
          );
        }

        if (ejercicio !== "0") {
          newRows = newRows.filter(
            (documento) => documento.ejercicio === ejercicio
          );
        }
      }

      setUsuarios({
        ids: idUsuarios,
        nombre: nombreUsuarios,
        cantidad: cantidadUsuarios,
      });
      setPeriodos(nuevosPeriodos);
      setEjercicios(nuevosEjercicios);
    }

    if (validacion !== 2) {
      newRows = newRows.filter(
        (documento) => documento.idSubmenu === primerIdSubmenu
      );
    }
    setRows(newRows);

    let idDocumento = 0;
    if(localStorage.getItem("home")) {
      const decodedToken = jwt.verify(
        localStorage.getItem("home"),
        "mysecretpassword"
      );
      idDocumento = decodedToken.home.idDocumento;
    }
    
    const token = jwt.sign(
      {
        home: {
          periodo: periodo,
          ejercicio: ejercicio,
          idUsuario: idUsuario,
          idModulo: idModulo,
          idMenu: idMenu,
          idSubmenu: primerIdSubmenu !== 0 ? primerIdSubmenu : idSubmenu,
          idDocumento: idDocumento,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("home", token);
  };

  const llenarTablaGuardada = (
    idModulo,
    idMenu,
    idSubmenu,
    idUsuario,
    periodo,
    ejercicio
  ) => {
    let newRows = documentos.filter(
      (documento) =>
        documento.idModulo === idModulo && documento.idMenu === idMenu
    );

    let idUsuarios = [];
    let nombreUsuarios = [];
    let cantidadUsuarios = [];
    let nuevosPeriodos = [];
    let nuevosEjercicios = [];

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

      if (!nuevosPeriodos.includes(newRows[x].periodo)) {
        nuevosPeriodos.push(newRows[x].periodo);
      }

      if (!nuevosEjercicios.includes(newRows[x].ejercicio)) {
        nuevosEjercicios.push(newRows[x].ejercicio);
      }
    }

    const pos = idUsuarios.indexOf(idUsuario);
    setSelectedNombreUsuario(nombreUsuarios[pos]);
    setUsuarios({
      ids: idUsuarios,
      nombre: nombreUsuarios,
      cantidad: cantidadUsuarios,
    });
    setPeriodos(nuevosPeriodos);
    setEjercicios(nuevosEjercicios);

    if (idUsuario !== 0) {
      newRows = newRows.filter(
        (documento) => documento.idUsuario === idUsuario
      );
    }

    if (periodo !== "0") {
      newRows = newRows.filter((documento) => documento.periodo === periodo);
    }

    if (ejercicio !== "0") {
      newRows = newRows.filter(
        (documento) => documento.ejercicio === ejercicio
      );
    }

    let noSubmenuFiltroRows = newRows;
    if (idSubmenu !== 0) {
      newRows = newRows.filter(
        (documento) => documento.idSubmenu === idSubmenu
      );
    }

    setRows(newRows);

    let idSubmenus = [];
    let nombreSubmenus = [];
    let cantidadSubmenus = [];

    for (let x = 0; x < noSubmenuFiltroRows.length; x++) {
      if (!nombreSubmenus.includes(noSubmenuFiltroRows[x].nombreSubmenu)) {
        idSubmenus.push(noSubmenuFiltroRows[x].idSubmenu);
        nombreSubmenus.push(noSubmenuFiltroRows[x].nombreSubmenu);
        cantidadSubmenus.push(1);
      } else {
        const pos = nombreSubmenus.indexOf(
          noSubmenuFiltroRows[x].nombreSubmenu
        );
        if (cantidadSubmenus[pos]) {
          cantidadSubmenus[pos] = cantidadSubmenus[pos] + 1;
        } else {
          cantidadSubmenus[pos] = 1;
        }
      }
    }

    let rowsPrincipalData = [];
    for (let x = 0; x < nombreSubmenus.length; x++) {
      rowsPrincipalData.push(
        createDataPrincipal(
          noSubmenuFiltroRows[0].nombreModulo,
          noSubmenuFiltroRows[0].nombreMenu,
          idSubmenus[x],
          nombreSubmenus[x],
          cantidadSubmenus[x],
          <Button variant="contained" color="primary">
            Ver Documentos
          </Button>
        )
      );
    }

    setRowsPrincipal(rowsPrincipalData);
  };

  const llenarGraficaMenu = (idModulo, validacion) => {
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

    for (let x = 0; x < cantidadMenus.length; x++) {
      for (let y = 0; y < cantidadMenus.length - 1; y++) {
        if (cantidadMenus[y] < cantidadMenus[y + 1]) {
          let idAuxiliar = idsMenus[y];
          idsMenus[y] = idsMenus[y + 1];
          idsMenus[y + 1] = idAuxiliar;
          let nombreAuxiliar = nombreMenus[y];
          nombreMenus[y] = nombreMenus[y + 1];
          nombreMenus[y + 1] = nombreAuxiliar;
          let cantidadAuxiliar = cantidadMenus[y];
          cantidadMenus[y] = cantidadMenus[y + 1];
          cantidadMenus[y + 1] = cantidadAuxiliar;
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
    setSelectedIdUsuario(0);
    if (validacion === 0) {
      setSelectedPeriodo(moment().format("MM"));
      setSelectedEjercicio(moment().format("YYYY"));
      llenarTabla(
        idModulo,
        idsMenus[0],
        0,
        0,
        3,
        moment().format("MM"),
        moment().format("YYYY")
      );
    } else if (validacion === 1) {
      setSelectedPeriodo("0");
      setSelectedEjercicio("0");
      const decodedToken = jwt.verify(
        localStorage.getItem("home"),
        "mysecretpassword"
      );
      llenarTabla(
        idModulo,
        decodedToken.home.idMenu,
        decodedToken.home.idSubmenu,
        0,
        1,
        "0",
        "0"
      );
    } else {
      setSelectedPeriodo("0");
      setSelectedEjercicio("0");
      llenarTabla(idModulo, idsMenus[0], 0, 0, 1, "0", "0");
    }
  };

  const getPeriodos = () => {
    if (periodos.length > 0) {
      return periodos.sort().map((periodo, index) => {
        return (
          <option value={periodo} key={index}>
            {meses[parseInt(periodo) - 1]}
          </option>
        );
      });
    } else {
      return <option value="0">No hay períodos disponibles</option>;
    }
  };

  const getEjercicios = () => {
    if (ejercicios.length > 0) {
      return ejercicios.sort().map((ejercicio, index) => {
        return (
          <option value={ejercicio} key={index}>
            {ejercicio}
          </option>
        );
      });
    } else {
      return <option value="0">No hay ejercicios disponibles</option>;
    }
  };

  const seriesModulos = modulos.cantidad;
  const optionsModulos = {
    chart: {
      id: "graficaModulos",
      width: "100%",
      type: "pie",
      events: {
        mounted: function (chartContext, config) {
          if (localStorage.getItem("home")) {
            const decodedToken = jwt.verify(
              localStorage.getItem("home"),
              "mysecretpassword"
            );
            llenarGraficaMenu(decodedToken.home.idModulo, 1);
            setSelectedIdModulo(decodedToken.home.idModulo);
            setSelectedIdMenu(decodedToken.home.idMenu);
            //setSelectedMenu(nombreMenus[0]);
            setSelectedIdUsuario(decodedToken.home.idUsuario);
            setSelectedPeriodo(decodedToken.home.periodo);
            setSelectedEjercicio(decodedToken.home.ejercicio);
            llenarTablaGuardada(
              decodedToken.home.idModulo,
              decodedToken.home.idMenu,
              decodedToken.home.idSubmenu,
              decodedToken.home.idUsuario,
              decodedToken.home.periodo,
              decodedToken.home.ejercicio
            );
            setPage(decodedToken.home.page ? decodedToken.home.page : 0);
            setSelectedIdDocumento(
              decodedToken.home.idDocumento ? decodedToken.home.idDocumento : 0
            );
          } else {
            llenarGraficaMenu(modulos.ids[0], 0);
            setSelectedIdModulo(modulos.ids[0]);
            setSelectedModulo(modulos.nombre[0]);
          }
        },
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          llenarGraficaMenu(modulos.ids[dataPointIndex], 2);
          setSelectedIdModulo(modulos.ids[dataPointIndex]);
          setSelectedModulo(modulos.nombre[dataPointIndex]);
          setPage(0);
          setSelectedIdDocumento(0);
          const decodedToken = jwt.verify(
            localStorage.getItem("home"),
            "mysecretpassword"
          );
          decodedToken.home.idDocumento = 0;
          const home = decodedToken.home;
          const token = jwt.sign(
            {
              home,
            },
            "mysecretpassword"
          );
          localStorage.setItem("home", token);
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
      id: "graficaMenus",
      width: "100%",
      type: "pie",
      events: {
        mounted: function (chartContext, config) {
          if (localStorage.getItem("home")) {
            const decodedToken = jwt.verify(
              localStorage.getItem("home"),
              "mysecretpassword"
            );
            const pos = menus.ids.indexOf(decodedToken.home.idMenu);
            setSelectedIdMenu(decodedToken.home.idMenu);
            setSelectedMenu(menus.nombre[pos]);
          } else {
            setSelectedIdMenu(menus.ids[0]);
            setSelectedMenu(menus.nombre[0]);
          }
        },
        dataPointSelection: function (event, chartContext, { dataPointIndex }) {
          setSelectedIdMenu(menus.ids[dataPointIndex]);
          setSelectedMenu(menus.nombre[dataPointIndex]);
          setSelectedIdUsuario(0);
          setSelectedPeriodo("0");
          setSelectedEjercicio("0");
          setPage(0);
          setSelectedIdDocumento(0);
          const decodedToken = jwt.verify(
            localStorage.getItem("home"),
            "mysecretpassword"
          );
          decodedToken.home.idDocumento = 0;
          const home = decodedToken.home;
          const token = jwt.sign(
            {
              home,
            },
            "mysecretpassword"
          );
          localStorage.setItem("home", token);
          llenarTabla(
            selectedIdModulo,
            menus.ids[dataPointIndex],
            0,
            0,
            1,
            "0",
            "0"
          );
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
                {selectedPeriodo === "0" && selectedEjercicio === "0"
                  ? "Todos los períodos y todos los ejercicios"
                  : selectedPeriodo === "0" && selectedEjercicio !== "0"
                  ? `Cualquier período de ${selectedEjercicio}`
                  : selectedPeriodo !== "0" && selectedEjercicio === "0"
                  ? `Período de ${
                      meses[parseInt(selectedPeriodo - 1)]
                    } de cualquier ejercicio`
                  : `Período de ${
                      meses[parseInt(selectedPeriodo - 1)]
                    } de ${selectedEjercicio}`}
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
                value={selectedPeriodo}
                margin="normal"
                onChange={(e) => {
                  setSelectedPeriodo(e.target.value);
                  setPage(0);
                  llenarTabla(
                    selectedIdModulo,
                    selectedIdMenu,
                    0,
                    selectedIdUsuario,
                    0,
                    e.target.value,
                    selectedEjercicio
                  );
                }}
              >
                <option value="0">Selecciona un período</option>
                {getPeriodos()}
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
                value={selectedEjercicio}
                margin="normal"
                onChange={(e) => {
                  setSelectedEjercicio(e.target.value);
                  setPage(0);
                  llenarTabla(
                    selectedIdModulo,
                    selectedIdMenu,
                    0,
                    selectedIdUsuario,
                    0,
                    selectedPeriodo,
                    e.target.value
                  );
                }}
              >
                <option value="0">Selecciona un ejercicio</option>
                {getEjercicios()}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {`${selectedModulo ? selectedModulo : 'Sin módulo elejido'} > ${selectedMenu ? selectedMenu : 'Sin menú elejido'} > ${
                  selectedIdUsuario !== 0
                    ? selectedNombreUsuario
                    : "Todos los usuarios"
                }`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {usuarios.nombre.map((usuario, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    style={{
                      border:
                        selectedIdUsuario === usuarios.ids[index]
                          ? "1px solid green"
                          : "",
                    }}
                  >
                    <CardActionArea
                      style={{ height: "200px" }}
                      onClick={() => {
                        setPage(0);
                        llenarTabla(
                          selectedIdModulo,
                          selectedIdMenu,
                          0,
                          selectedIdUsuario === usuarios.ids[index]
                            ? 0
                            : usuarios.ids[index],
                          0,
                          selectedPeriodo,
                          selectedEjercicio
                        );

                        setSelectedIdUsuario(
                          selectedIdUsuario === usuarios.ids[index]
                            ? 0
                            : usuarios.ids[index]
                        );
                        setSelectedNombreUsuario(
                          selectedNombreUsuario === usuarios.nombre[index]
                            ? ""
                            : usuarios.nombre[index]
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
                      order={orderPrincipal}
                      orderBy={orderByPrincipal}
                      onRequestSort={handleRequestSortPrincipal}
                      rowCount={rowsPrincipal.length}
                      headCells={headCellsPrincipal}
                    />
                    <TableBody>
                      {rowsPrincipal.length > 0 ? (
                        stableSort(
                          rowsPrincipal,
                          getComparator(orderPrincipal, orderByPrincipal)
                        )
                          .slice(
                            pagePrincipal * rowsPerPagePrincipal,
                            pagePrincipal * rowsPerPagePrincipal +
                              rowsPerPagePrincipal
                          )
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                className={classes.rootRow}
                                key={index}
                              >
                                <TableCell padding="checkbox" />
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                >
                                  {row.nombreModulo}
                                </TableCell>
                                <TableCell align="right">
                                  {row.nombreMenu}
                                </TableCell>
                                <TableCell align="right">
                                  {row.nombreSubmenu}
                                </TableCell>
                                <TableCell align="right">
                                  {row.cantidad}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  onClick={() => {
                                    setPage(0);
                                    llenarTabla(
                                      selectedIdModulo,
                                      selectedIdMenu,
                                      row.idSubmenu,
                                      selectedIdUsuario,
                                      2,
                                      selectedPeriodo,
                                      selectedEjercicio
                                    );
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
                  count={rowsPrincipal.length}
                  rowsPerPage={rowsPerPagePrincipal}
                  page={
                    rowsPrincipal.length > 0 &&
                    rowsPrincipal.length >= rowsPerPagePrincipal
                      ? pagePrincipal
                      : 0
                  }
                  onChangePage={handleChangePagePrincipal}
                  onChangeRowsPerPage={handleChangeRowsPerPagePrincipal}
                />
              </Paper>
              <Paper style={{ marginTop: "15px" }}>
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
                                className={classes.rootRow}
                                key={index}
                              >
                                <TableCell
                                  padding="checkbox"
                                  style={{
                                    backgroundColor:
                                      selectedIdDocumento === row.id
                                        ? "green"
                                        : "",
                                  }}
                                />
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                >
                                  {row.fechaRegistro}
                                </TableCell>
                                <TableCell align="right">
                                  {row.fechaDocumento}
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
