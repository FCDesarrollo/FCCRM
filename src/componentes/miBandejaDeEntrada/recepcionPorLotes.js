import React, { useState } from "react";
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
  TextField
} from "@material-ui/core";
import {
  Close as CloseIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "10px",
    marginBottom: "20px"
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px"
  },
  titleTable: {
    flex: "1 1 50%"
  },
  buttons: {
    width: "100%",
    height: "100%",
    marginTop: "5px",
    marginBottom: "5px",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF"
    }
  },
  root: {
    maxWidth: "100%"
  },
  paper: {
    width: "100%"
  },
  table: {
    minWidth: 750
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
    width: 1
  },
  textFields: {
    width: "100%"
  }
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
    acciones
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3, 67, 5),
  createData("Donut", 452, 25.0, 51, 4.9, 67, 6),
  createData("Eclair", 262, 16.0, 24, 6.0, 67, 4.3),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9, 67, 4.3),
  createData("Honeycomb", 408, 3.2, 87, 6.5, 6, 4.3),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 67, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0, 3, 4.3),
  createData("KitKat", 518, 26.0, 65, 7.0, 67, 4.3),
  createData("Lollipop", 392, 0.2, 98, 0.0, 67, 4),
  createData("Marshmallow", 318, 0, 81, 2.0, 67, 4.3),
  createData("Nougat", 360, 19.0, 9, 37.0, 44, 4.3),
  createData("Oreo", 437, 18.0, 63, 4.0, 67, 4.3)
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
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  {
    id: "fecha",
    align: "left",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha"
  },
  {
    id: "usuario",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Usuario"
  },
  {
    id: "tipoDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo De Documento"
  },
  {
    id: "sucursal",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sucursal"
  },
  {
    id: "detalles",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Detalles"
  },
  {
    id: "registros",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Registros"
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />
  }
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map(headCell => (
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
  rowCount: PropTypes.number.isRequired
};

export default function RecepcionPorLotes(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const [showComponent, setShowComponent] = useState(0);
  const [tittleTableComponent, setTittleTableComponent] = useState("");
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
                  }}
                >
                  {content.submenu.nombre_submenu}
                </Button>
              </Grid>
            ) : null;
          })}
          {/*
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Compras");
              }}
            >
              COMPRAS
            </Button>
          </Grid>
          <Grid item md={1} />
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Ventas");
              }}
            >
              VENTAS
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Pagos");
              }}
            >
              PAGOS
            </Button>
          </Grid>
          <Grid item md={1} />
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Cobros");
              }}
            >
              COBROS
            </Button>
          </Grid>
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Producción");
              }}
            >
              PRODUCCIÓN
            </Button>
          </Grid>
          <Grid item md={1} />
          <Grid item xs={12} md={5}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttons}
              onClick={() => {
                setShowComponent(1);
                setTittleTableComponent("Inventarios");
              }}
            >
              INVENTARIOS
            </Button>
          </Grid>*/}
        </Grid>
      </Card>
      <Card>
        {showComponent === 1 ? (
          <TablaRPL
            tittle={tittleTableComponent}
            setShowComponent={setShowComponent}
          />
        ) : null}
      </Card>
    </div>
  );
}

function TablaRPL(props) {
  const classes = useStyles();
  const tableTittle = props.tittle;
  const setShowComponent = props.setShowComponent;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("fecha");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
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
                width: "90%"
              }}
            >
              Procesar
            </Button>
          </Grid>
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
                      <TableCell align="right">{row.tipoDocumento}</TableCell>
                      <TableCell align="right">{row.sucursal}</TableCell>
                      <TableCell align="right">{row.detalles}</TableCell>
                      <TableCell align="right">{row.registros}</TableCell>
                      <TableCell align="right">{row.acciones}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={e => {
            return `${e.from}-${e.to} de ${e.count}`;
          }}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
