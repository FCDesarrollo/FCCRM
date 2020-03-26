import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
  Radio
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  AddCircle as AddCircleIcon,
  FilterList as FilterListIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  AccountBox as AccountBoxIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  Minimize as MinimizeIcon
} from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
//import jwt from "jsonwebtoken";

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
    <TableHead style={{ background: "#fafafa" }}>
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
    id: "nombrePerfil",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Nombre Perfil"
  },
  {
    id: "descripcion",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Descripción"
  },
  {
    id: "estatus",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Estatus"
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
  /* const submenuContent = props.submenuContent;
  console.log(submenuContent); */
  const usuarioDatos = props.usuarioDatos;
  const empresaDatos = props.empresaDatos;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const rfc = empresaDatos.RFC;
  const setLoading = props.setLoading;
  const [idPerfilEditar, setIdPerfilEditar] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("nombrePerfil");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showComponent, setShowComponent] = useState(0);
  const [
    {
      data: listaPerfilesData,
      loading: listaPerfilesLoading,
      error: listaPerfilesError
    } /* ,
    executeListaPerfiles */
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaPerfiles`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 22
      }
    },
    {
      useCache: false
    }
  );

  useEffect(() => {
    function checkData() {
      if (listaPerfilesData) {
        if (listaPerfilesData.error !== 0) {
          swal("Error", dataBaseErrores(listaPerfilesData.error), "warning");
        } else {
          rows = [];
          for (let x = 0; x < listaPerfilesData.perfiles.length; x++) {
            rows.push(listaPerfilesData.perfiles[x]);
          }
          //console.log(rows);
        }
      }
    }

    checkData();
  }, [listaPerfilesData]);

  if (listaPerfilesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (listaPerfilesError) {
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

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //console.log(submenuContent);
  return (
    <div>
      {showComponent === 0 ? (
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
              <IconButton
                disabled
                aria-label="nuevo"
                onClick={() => {
                  setShowComponent(1);
                }}
              >
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
                            {row.status === 1 ? "Activo" : "No Activo"}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => {
                                  setIdPerfilEditar(row.id);
                                }}
                              >
                                <EditIcon style={{ color: "black" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <span>
                                <IconButton
                                  disabled={
                                    row.id === 1 || row.id === 2 || row.id === 3
                                  }
                                >
                                  <DeleteIcon
                                    color={
                                      row.id === 1 ||
                                      row.id === 2 ||
                                      row.id === 3
                                        ? "inherit"
                                        : "secondary"
                                    }
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
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
      ) : showComponent === 1 ? (
        <Card style={{ padding: "10px" }}>
          <CrearPerfil
            setShowComponent={setShowComponent}
            usuario={usuario}
            pwd={pwd}
            rfc={rfc}
            idPerfilEditar={idPerfilEditar}
          />
        </Card>
      ) : null}
    </div>
  );
}

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)"
    }
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2)
    }
  },
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit"
  },
  labelRoot: {
    alignItems: "center",
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  },
  treeView: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)"
    }
  }
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
            display: matches ? "flex" : "block"
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
        "--tree-view-bg-color": bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
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
  const usuario = props.usuario;
  const pwd = props.pwd;
  //const rfc = props.rfc;
  //const idPerfilEditar = props.idPerfilEditar;
  const [expanded, setExpanded] = useState([]);
  //const [permiso, setPermiso] = useState(-1);
  //const [idModulo, setIdModulo] = useState(0);
  const [{ data: menuData, loading: menuLoading, error: menuError }] = useAxios(
    {
      url: API_BASE_URL + `/menuWeb`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd
      }
    },
    {
      useCache: false
    }
  );

  useEffect(() => {
    function checkData() {
      if (menuData) {
        if (menuData.error !== 0) {
          swal(
            "Error al cambiar permisos",
            dataBaseErrores(menuData.error),
            "error"
          );
        }
      }
    }

    checkData();
  }, [menuData]);

  if (menuLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (menuError) {
    return <ErrorQueryDB />;
  }

  const handleChangeTreeView = (event, nodes) => {
    setExpanded(nodes);
    /* const token = jwt.sign(
      {
        menuTemporal: {
          showComponent: 4,
          idUsuarioEditar: idUsuarioEditar,
          permisosSubmenu: permisosSubmenu,
          treeNodes: nodes,
          idSubmenuActual: idSubmenuActual
        }
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token); */
  };

  const getModulos = () => {
    //console.log(menuData);
    return menuData.modulos.map((modulo, index) => {
      return modulo.orden !== 0 ? (
        <StyledTreeItem
          key={modulo.idmodulo}
          nodeId={modulo.idmodulo.toString()}
          labelText={modulo.nombre_modulo}
          isMenu={false}
          labelIcon={
            modulo.idmodulo === 1
              ? AccountBoxIcon
              : modulo.idmodulo === 2
              ? EmailIcon
              : modulo.idmodulo === 3
              ? SettingsIcon
              : modulo.idmodulo === 4
              ? AssessmentIcon
              : MinimizeIcon
          }
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              row
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label="Sí" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        >
          {/* {getMenus(modulo)} */}
        </StyledTreeItem>
      ) : null;
    });
  };

  return (
    <Grid container spacing={3} style={{ padding: "10px" }}>
      <Grid item xs={12}>
        <Typography className={classes.titleTable} variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          Crear Perfil
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          className={classes.textFields}
          label="Nombre Perfil"
          type="text"
          margin="normal"
          inputProps={{
            maxLength: 50
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          className={classes.textFields}
          label="Descripción"
          type="text"
          margin="normal"
          inputProps={{
            maxLength: 100
          }}
        />
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
