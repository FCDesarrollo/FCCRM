import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
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
  TableSortLabel
} from "@material-ui/core";
import { AddCircle as AddCircleIcon, FilterList as FilterListIcon, Error as ErrorIcon, Settings as SettingsIcon } from "@material-ui/icons";
const useStyles = makeStyles(theme => ({
  card: {
    padding: "10px",
    height: "100%",
    width: "100%"
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
  title: {
    marginTop: "10px",
    marginBottom: "20px"
  },
  titleTable: {
    flex: "1 1 100%"
  },
  textFields: {
    width: "100%"
  }
}));

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

  let rows = [];

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
      disablePadding: true,
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
      id: "sucursal",
      align: "right",
      sortHeadCell: true,
      disablePadding: false,
      label: "Sucursal"
    },
    {
      id: "detalle",
      align: "right",
      sortHeadCell: true,
      disablePadding: false,
      label: "Detalle"
    },
    {
      id: "importe",
      align: "right",
      sortHeadCell: true,
      disablePadding: false,
      label: "Importe"
    },
    {
      id: "status",
      align: "right",
      sortHeadCell: true,
      disablePadding: false,
      label: "Status"
    },
    {
      id: "acciones",
      align: "right",
      sortHeadCell: false,
      disablePadding: false,
      label: <SettingsIcon style={{ color: "black" }} />
    }
  ];

export default function Perfiles(props) {
  const classes = useStyles();
  //const submenuContent = props.submenuContent;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fecha");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  //console.log(submenuContent);
  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography
            className={classes.titleTable}
            variant="h6"
            id="tableTitle"
          >
            Lista de Perfiles
          </Typography>
          <Tooltip title="Nuevo">
            <IconButton aria-label="nuevo">
              <AddCircleIcon style={{ color: "#4caf50" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtro">
            <IconButton aria-label="filtro">
              <FilterListIcon style={{ color: "black" }} />
            </IconButton>
          </Tooltip>
          <TextField
            className={classes.textFields}
            label="Escriba algo para filtrar"
            type="text"
            margin="normal"
            inputProps={{
              maxLength: 20
            }}
          />
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
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell padding="checkbox" />
                        <TableCell component="th" id={labelId} scope="row">
                          1
                        </TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">1</TableCell>
                        <TableCell align="right">1</TableCell>
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
