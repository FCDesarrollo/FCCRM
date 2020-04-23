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
} from "@material-ui/core";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";

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
    flex: "1 1 50%",
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
}));

function createData(
  fecha,
  usuario,
  tipoDocumento,
  sucursal,
  detalles,
  registros,
  acciones
) {
  return {
    fecha,
    usuario,
    tipoDocumento,
    sucursal,
    detalles,
    registros,
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
    disablePadding: false,
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
    id: "tipoDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo De Documento",
  },
  {
    id: "sucursal",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sucursal",
  },
  {
    id: "detalles",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Detalles",
  },
  {
    id: "registros",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Registros",
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
    <TableHead>
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
                {headCell.label}
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

export default function RecepcionPorLotes(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const [showComponent, setShowComponent] = useState(0);
  const [tittleTableComponent, setTittleTableComponent] = useState("");
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  //const usuarioDatos = props.usuarioDatos;
  //const idUsuario = usuarioDatos.idusuario;
  const empresaDatos = props.empresaDatos;
  //const nombreEmpresa = empresaDatos.nombreempresa;
  const idEmpresa = empresaDatos.idempresa;
  /* const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const rfc = empresaDatos.RFC; */
  const [idSubmenu, setIdSubmenu] = useState(0);
  const setLoading = props.setLoading;
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [subtitulo, setSubtitulo] = useState("");
  const [idLote, setIdLote] = useState(0);
  const [
    {
      data: traerLotesData,
      loading: traerLotesLoading,
      error: traerLotesError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerLotes`,
      method: "GET",
      params: {
        /* usuario: usuario,
        pwd: pwd,
        rfc: rfc, */
        idempresa: idEmpresa,
        idmenu: 6,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerLotesData) {
        if (traerLotesData.error !== 0) {
          swal("Error", dataBaseErrores(traerLotesData.error), "warning");
        } else {
          filterRows = [];
          traerLotesData.lotes.map((lote) => {
            return filterRows.push(
              createData(
                lote.fechadecarga,
                lote.usuario,
                lote.tipodet,
                lote.sucursal,
                `Registros: ${lote.totalregistros} Cargados: ${lote.totalcargados} Error: ${lote.cError}`,
                `Procesados ${lote.procesados} de ${lote.totalregistros}`,
                <IconButton
                  onClick={(e) => {
                    handleOpenMenu(e);
                    setSubtitulo(lote.tipodet);
                    setIdLote(lote.id);
                  }}
                >
                  <SettingsEthernetIcon style={{ color: "black" }} />
                </IconButton>
              )
            );
          });
          setRows(filterRows);
        }
      }
    }

    checkData();
  }, [traerLotesData]);

  if (traerLotesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerLotesError) {
    return <ErrorQueryDB />;
  }

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  return (
    <div>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Recepción Por Lotes
            </Typography>
          </Grid>
          <Grid item xs={12} md={10} style={{ alignSelf: "center" }}>
            <Button
              color="default"
              variant="contained"
              style={{ float: "right", marginBottom: "10px" }}
            >
              Plantillas
            </Button>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden !== 0 ? (
              <Grid item xs={12} md={5} key={index}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    setShowComponent(1);
                    setTittleTableComponent(content.submenu.nombre_submenu);
                    setIdSubmenu(content.submenu.idsubmenu);
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
        {showComponent > 0 ? (
          <TablaRPL
            tittle={tittleTableComponent}
            showComponent={showComponent}
            setShowComponent={setShowComponent}
            page={page}
            setPage={setPage}
            rows={rows}
            setRows={setRows}
            anchorMenuEl={anchorMenuEl}
            handleCloseMenu={handleCloseMenu}
            subtitulo={subtitulo}
            idEmpresa={idEmpresa}
            idLote={idLote}
            setLoading={setLoading}
          />
        ) : null}
      </Card>
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    maxWidth: "500px",
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

function TablaRPL(props) {
  const classes = useStyles();
  const tableTittle = props.tittle;
  const page = props.page;
  const setPage = props.setPage;
  const rows = props.rows;
  //const setRows = props.setRows;
  const showComponent = props.showComponent;
  const setShowComponent = props.setShowComponent;
  const anchorMenuEl = props.anchorMenuEl;
  const handleCloseMenu = props.handleCloseMenu;
  const subtitulo = props.subtitulo;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setLoading = props.setLoading;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [folioSerie, setFolioSerie] = useState("");
  const [idNivelDocumento, setIdNivelDocumento] = useState(0);

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
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container>
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
            <Typography
              className={classes.titleTable}
              variant="h6"
              style={{ alignSelf: "center" }}
              id="tableTitle"
            >
              {tableTittle}
            </Typography>
          </Grid>
        </Toolbar>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              type="file"
              style={{ marginLeft: "15px", width: "90%" }}
            />
          </Grid>
          <Grid item xs={12} md={3} style={{ alignSelf: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              style={{
                marginTop: 0,
                marginBottom: 0,
                marginLeft: "15px",
                width: "90%",
              }}
            >
              Procesar
            </Button>
          </Grid>
        </Grid>
        {showComponent === 1 ? (
          <Fragment>
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ margin: "20px" }}>
                <strong>Listado De Los Últimos Lotes Cargados.</strong>
              </Typography>
            </Grid>
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
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.fecha}
                        >
                          <TableCell padding="checkbox" />
                          <TableCell component="th" id={labelId} scope="row">
                            {row.fecha}
                          </TableCell>
                          <TableCell align="right">{row.usuario}</TableCell>
                          <TableCell align="right">
                            {row.tipoDocumento}
                          </TableCell>
                          <TableCell align="right">{row.sucursal}</TableCell>
                          <TableCell align="right">{row.detalles}</TableCell>
                          <TableCell align="right">{row.registros}</TableCell>
                          <TableCell align="right">{row.acciones}</TableCell>
                        </TableRow>
                      );
                    })}
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
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Fragment>
        ) : showComponent === 2 ? (
          <NivelDocumentos
            subtitulo={subtitulo}
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idLote={idLote}
            setIdNivelDocumento={setIdNivelDocumento}
            setLoading={setLoading}
            setFolioSerie={setFolioSerie}
          />
        ) : showComponent === 3 ? (
          <VerMovimientosDocumentos
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idNivelDocumento={idNivelDocumento}
            subtitulo={subtitulo}
            folioSerie={folioSerie}
            setLoading={setLoading}
          />
        ) : showComponent === 4 ? (
          <VerNivelMovimientos
            setShowComponent={setShowComponent}
            idEmpresa={idEmpresa}
            idLote={idLote}
            subtitulo={subtitulo}
            setLoading={setLoading}
          />
        ) : null}
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
          }}
        >
          <ListItemText primary="Nivel de Documentos" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setShowComponent(4);
          }}
        >
          <ListItemText primary="Nivel de Movimientos" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
          }}
        >
          <ListItemText primary="Eliminar Lote" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function NivelDocumentos(props) {
  const classes = useStyles();
  const subtitulo = props.subtitulo;
  const setShowComponent = props.setShowComponent;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setFolioSerie = props.setFolioSerie;
  const setIdNivelDocumento = props.setIdNivelDocumento;
  const setLoading = props.setLoading;
  const [
    {
      data: traerDocumentosLoteData,
      loading: traerDocumentosLoteLoading,
      error: traerDocumentosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerDocumentosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        idlote: idLote,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerDocumentosLoteData) {
        if (traerDocumentosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerDocumentosLoteData.error),
            "warning"
          );
        }
      }
    }

    checkData();
  }, [traerDocumentosLoteData]);

  if (traerDocumentosLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerDocumentosLoteError) {
    return <ErrorQueryDB />;
  }

  const getDocumentosLote = () => {
    return traerDocumentosLoteData.doctos.map((documento, index) => {
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="left">{documento.fecha}</TableCell>
          <TableCell align="right">{documento.concepto}</TableCell>
          <TableCell align="right">{`${documento.folio}-${documento.serie}`}</TableCell>
          <TableCell align="right">{documento.total}</TableCell>
          <TableCell align="right">
            {documento.estatus === 0 ? "No Procesado" : "Procesado"}
          </TableCell>
          <TableCell align="right">
            <Tooltip title="Ver Movimientos">
              <IconButton
                onClick={() => {
                  setShowComponent(3);
                  setFolioSerie(`${documento.folio}-${documento.serie}`);
                  setIdNivelDocumento(documento.id);
                }}
              >
                <PlayArrowIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar De La Base De Datos">
              <IconButton>
                <DeleteIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Tipo de Documento: {subtitulo}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CONCEPTO</strong>
              </TableCell>
              <TableCell align="right">
                <strong>FOLIO-SERIE</strong>
              </TableCell>
              <TableCell align="right">
                <strong>TOTAL</strong>
              </TableCell>
              <TableCell align="right">
                <strong>DETALLE</strong>
              </TableCell>
              <TableCell align="right">
                <SettingsIcon />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function VerMovimientosDocumentos(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  const subtitulo = props.subtitulo;
  const folioSerie = props.folioSerie;
  const idEmpresa = props.idEmpresa;
  const idNivelDocumento = props.idNivelDocumento;
  const setLoading = props.setLoading;

  const [
    {
      data: traerMovimientosDocumentosLoteData,
      loading: traerMovimientosDocumentosLoteLoading,
      error: traerMovimientosDocumentosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerMovimientosDocumentosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        id: idNivelDocumento,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerMovimientosDocumentosLoteData) {
        if (traerMovimientosDocumentosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerMovimientosDocumentosLoteData.error),
            "warning"
          );
        } else {
          console.log(traerMovimientosDocumentosLoteData);
        }
      }
    }

    checkData();
  }, [traerMovimientosDocumentosLoteData]);

  if (traerMovimientosDocumentosLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerMovimientosDocumentosLoteError) {
    return <ErrorQueryDB />;
  }

  const getMovimientosDocumentosLote = () => {
    return traerMovimientosDocumentosLoteData.movtos.map(
      (movimiento, index) => {
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox"></TableCell>
            <TableCell align="left">{movimiento.fechamov}</TableCell>
            <TableCell align="right">{movimiento.producto}</TableCell>
            <TableCell align="right">{movimiento.cantidad}</TableCell>
            <TableCell align="right">{movimiento.subtotal}</TableCell>
            <TableCell align="right">{movimiento.descuento}</TableCell>
            <TableCell align="right">{movimiento.iva}</TableCell>
            <TableCell align="right">{movimiento.total}</TableCell>
          </TableRow>
        );
      }
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(2);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          {`Tipo de Documento: ${subtitulo} con Folio-Serie: ${folioSerie}`}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>PRODUCTO</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CANTIDAD</strong>
              </TableCell>
              <TableCell align="right">
                <strong>SUBTOTAL</strong>
              </TableCell>
              <TableCell align="right">
                <strong>DESC.</strong>
              </TableCell>
              <TableCell align="right">
                <strong>IVA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>TOTAL</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getMovimientosDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

function VerNivelMovimientos(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  const subtitulo = props.subtitulo;
  const idEmpresa = props.idEmpresa;
  const idLote = props.idLote;
  const setLoading = props.setLoading;

  const [
    {
      data: traerMovimientosLoteData,
      loading: traerMovimientosLoteLoading,
      error: traerMovimientosLoteError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerMovimientosLote`,
      method: "GET",
      params: {
        idempresa: idEmpresa,
        id: idLote,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerMovimientosLoteData) {
        if (traerMovimientosLoteData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerMovimientosLoteData.error),
            "warning"
          );
        } else {
          console.log(traerMovimientosLoteData);
        }
      }
    }

    checkData();
  }, [traerMovimientosLoteData]);

  if (traerMovimientosLoteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerMovimientosLoteError) {
    return <ErrorQueryDB />;
  }

  const getMovimientosDocumentosLote = () => {
    return traerMovimientosLoteData.movtos.map((movimiento, index) => {
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="left">{movimiento.fechamov}</TableCell>
          <TableCell align="right">{movimiento.producto}</TableCell>
          <TableCell align="right">{movimiento.cantidad}</TableCell>
          <TableCell align="right">{movimiento.subtotal}</TableCell>
          <TableCell align="right">{movimiento.descuento}</TableCell>
          <TableCell align="right">{movimiento.iva}</TableCell>
          <TableCell align="right">{movimiento.total}</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ margin: "20px" }}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(1);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          {`Tipo de Documento: ${subtitulo}`}
        </Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>
                <strong>FECHA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>PRODUCTO</strong>
              </TableCell>
              <TableCell align="right">
                <strong>CANTIDAD</strong>
              </TableCell>
              <TableCell align="right">
                <strong>SUBTOTAL</strong>
              </TableCell>
              <TableCell align="right">
                <strong>DESC.</strong>
              </TableCell>
              <TableCell align="right">
                <strong>IVA</strong>
              </TableCell>
              <TableCell align="right">
                <strong>TOTAL</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getMovimientosDocumentosLote()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
