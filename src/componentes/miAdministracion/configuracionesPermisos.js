import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  Card,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from "@material-ui/core";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  MoneyOff as MoneyOffIcon,
  Minimize as MinimizeIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from "@material-ui/icons";
import { Link, Redirect } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swalReact from "@sweetalert/with-react";
import swal from "sweetalert";
import jwt from "jsonwebtoken";
import { Fragment } from "react";
import {
  doubleKeyValidation,
  doublePasteValidation
} from "../../helpers/inputHelpers";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "10px",
    height: "100%",
    width: "100%"
  },
  title: {
    marginTop: "10px"
  },
  textFields: {
    width: "100%"
  }
}));

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
    display: "flex",
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
  const {
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    conceptos,
    itemPadre,
    color,
    bgColor,
    ...other
  } = props;

  function sortConceptos(conceptosDatos) {
    return conceptosDatos.sort(function(a, b) {
      if (a.nombre_concepto > b.nombre_concepto) {
        return 1;
      }
      if (a.nombre_concepto < b.nombre_concepto) {
        return -1;
      }
      return 0;
    });
  }

  const getConceptosUsuario = () => {
    return sortConceptos(conceptos).map((concepto, index) => {
      return `${concepto.nombre_concepto}${
        conceptos.length !== index + 1 ? "," : "."
      } `;
    });
  };

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon
            color="inherit"
            className={classes.labelIcon}
            style={{ color: "black" }}
          />
          <Typography
            variant="body2"
            className={classes.labelText}
            style={{ display: "inline-grid" }}
          >
            {labelText}{" "}
            <span style={{ fontSize: "12px" }}>
              {itemPadre ? getConceptosUsuario() : null}
            </span>
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

export default function ConfiguracionesPermisos(props) {
  const classes = useStyles();
  const TreeClasses = useTreeItemStyles();
  const usuarioDatos = props.usuarioDatos;
  const empresaDatos = props.empresaDatos;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const rfc = empresaDatos.RFC;
  const setLoading = props.setLoading;
  const [expanded, setExpanded] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [conceptoBusqueda, setConceptoBusqueda] = useState(0);
  const [conceptosLimite, setConceptosLimite] = useState([]);
  const [selectedConceptoLimite, setSelectedConceptoLimite] = useState("0");
  const [checkedLimite, setCheckedLimite] = useState(false);
  const [
    openDialogLimiteImporteGastos,
    setOpenDialogLimiteImporteGastos
  ] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);
  const [importeLimite, setImporteLimite] = useState(0);
  let idMenu;
  let permisos;
  if (localStorage.getItem("idMenuTemporal")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("idMenuTemporal"),
        "mysecretpassword"
      );
      idMenu = decodedToken.idMenuTemporal.idMenu;
      permisos = decodedToken.idMenuTemporal.permisos;
    } catch (err) {
      localStorage.removeItem("idMenuTemporal");
      if (!redirect) {
        setRedirect(true);
      }
    }
  } else {
    if (!redirect) {
      setRedirect(true);
    }
  }
  const [
    {
      data: permisosAutorizacionesData,
      loading: permisosAutorizacionesLoading,
      error: permisosAutorizacionesError
    },
    executepermisosAutorizaciones
  ] = useAxios(
    {
      url: API_BASE_URL + `/permisosAutorizaciones`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 45,
        idmenu: idMenu
      }
    },
    {
      useCache: false
    }
  );
  const [
    {
      data: cargaConceptosData,
      loading: cargaConceptosLoading,
      error: cargaConceptosError
    }
  ] = useAxios(
    {
      url: API_BASE_URL + `/cargaConceptos`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 45,
        all: 1
      }
    },
    {
      useCache: false
    }
  );
  const [
    {
      data: guardaPermisoAutorizacionData,
      loading: guardaPermisoAutorizacionLoading,
      error: guardaPermisoAutorizacionError
    },
    executeGuardaPermisoAutorizacion
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardaPermisoAutorizacion`,
      method: "PUT"
    },
    {
      manual: true
    }
  );
  const [
    {
      data: eliminaPermisoAutorizacionData,
      loading: eliminaPermisoAutorizacionLoading,
      error: eliminaPermisoAutorizacionError
    },
    executeEliminaPermisoAutorizacion
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaPermisoAutorizacion`,
      method: "DELETE"
    },
    {
      manual: true
    }
  );
  const [
    {
      data: traerLimiteGastosUsuarioData,
      loading: traerLimiteGastosUsuarioLoading,
      error: traerLimiteGastosUsuarioError
    },
    executeTraerLimiteGastosUsuario
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerLimiteGastosUsuario`,
      method: "GET"
    },
    {
      manual: true
    }
  );
  const [
    {
      data: guardaLimiteGastosData,
      loading: guardaLimiteGastosLoading,
      error: guardaLimiteGastosError
    },
    executeGuardaLimiteGastos
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardaLimiteGastos`,
      method: "POST"
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    function checkData() {
      if (permisosAutorizacionesData) {
        if (permisosAutorizacionesData.error !== 0) {
          return (
            <Typography variant="h6">
              {dataBaseErrores(permisosAutorizacionesData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [permisosAutorizacionesData]);

  useEffect(() => {
    function checkData() {
      if (cargaConceptosData) {
        if (cargaConceptosData.error !== 0) {
          return (
            <Typography variant="h6">
              {dataBaseErrores(cargaConceptosData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [cargaConceptosData]);

  useEffect(() => {
    function checkData() {
      if (guardaPermisoAutorizacionData) {
        if (guardaPermisoAutorizacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardaPermisoAutorizacionData.error),
            "warning"
          );
          /* return (
            <Typography variant="h6">
              {dataBaseErrores(guardaPermisoAutorizacionData.error)}
            </Typography>
          ); */
        } else {
          swal(
            "Concepto agregado",
            "El concepto se agregó al usuario",
            "success"
          );
          executepermisosAutorizaciones();
        }
      }
    }

    checkData();
  }, [guardaPermisoAutorizacionData, executepermisosAutorizaciones]);

  useEffect(() => {
    function checkData() {
      if (eliminaPermisoAutorizacionData) {
        if (eliminaPermisoAutorizacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminaPermisoAutorizacionData.error),
            "warning"
          );
          /* return (
            <Typography variant="h6">
              {dataBaseErrores(eliminaPermisoAutorizacionData.error)}
            </Typography>
          ); */
        } else {
          swal(
            "Concepto eliminado",
            "El concepto se eliminó al usuario",
            "success"
          );
          executepermisosAutorizaciones();
        }
      }
    }

    checkData();
  }, [eliminaPermisoAutorizacionData, executepermisosAutorizaciones]);

  useEffect(() => {
    function checkData() {
      if (guardaLimiteGastosData) {
        if (guardaLimiteGastosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardaLimiteGastosData.error),
            "warning"
          );
          /* return (
            <Typography variant="h6">
              {dataBaseErrores(guardaLimiteGastosData.error)}
            </Typography>
          ); */
        } else {
          swal(
            "Límite de gasto guardado",
            "El límite de gasto se ha guardado",
            "success"
          );
        }
      }
    }

    checkData();
  }, [guardaLimiteGastosData]);

  useEffect(() => {
    function checkData() {
      if (traerLimiteGastosUsuarioData) {
        if (traerLimiteGastosUsuarioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(traerLimiteGastosUsuarioData.error),
            "warning"
          );
          setOpenDialogLimiteImporteGastos(false);
          /* return (
            <Typography variant="h6">
              {dataBaseErrores(traerLimiteGastosUsuarioData.error)}
            </Typography>
          ); */
        } else {
          if (traerLimiteGastosUsuarioData.limiteGasto.length > 0) {
            setImporteLimite(
              traerLimiteGastosUsuarioData.limiteGasto[0].importe
            );
            setCheckedLimite(
              traerLimiteGastosUsuarioData.limiteGasto[0].importe > 0
                ? true
                : false
            );
          } else {
            setImporteLimite(0);
            setCheckedLimite(false);
          }
        }
      }
    }

    checkData();
  }, [traerLimiteGastosUsuarioData]);

  if (
    permisosAutorizacionesLoading ||
    cargaConceptosLoading ||
    guardaPermisoAutorizacionLoading ||
    eliminaPermisoAutorizacionLoading ||
    guardaLimiteGastosLoading ||
    traerLimiteGastosUsuarioLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    permisosAutorizacionesError ||
    cargaConceptosError ||
    guardaPermisoAutorizacionError ||
    eliminaPermisoAutorizacionError ||
    guardaLimiteGastosError ||
    traerLimiteGastosUsuarioError
  ) {
    return <ErrorQueryDB />;
  }

  const handleChangeTreeView = (event, nodes) => {
    setExpanded(nodes);
  };

  const handleChangeLimite = event => {
    setCheckedLimite(event.target.checked);
  };

  const handleOpenDialogLimiteImporteGastos = () => {
    setOpenDialogLimiteImporteGastos(true);
  };

  const handleCloseDialogLimiteImporteGastos = () => {
    setOpenDialogLimiteImporteGastos(false);
    setSelectedConceptoLimite("0");
  };

  const getConceptosUsuarioExistentes = (idUsuario, idConcepto) => {
    for (let x = 0; x < permisosAutorizacionesData.usuarios.length; x++) {
      if (permisosAutorizacionesData.usuarios[x].idusuario === idUsuario) {
        for (
          let y = 0;
          y < permisosAutorizacionesData.usuarios[x].conceptos.length;
          y++
        ) {
          if (
            permisosAutorizacionesData.usuarios[x].conceptos[y].id ===
            idConcepto
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const agregarConcepto = idUsuario => {
    let verificarConcepto;
    let conceptosLista = 0;
    swalReact({
      title: "Agregar concepto",
      buttons: {
        cancel: "Cerrar"
      },
      content: (
        <List style={{ maxHeight: "40vh", overflowY: "auto" }}>
          {cargaConceptosData.conceptos.map((concepto, index) => {
            verificarConcepto = getConceptosUsuarioExistentes(
              idUsuario,
              concepto.id
            );
            conceptosLista = !verificarConcepto
              ? conceptosLista + 1
              : conceptosLista;
            return !verificarConcepto ? (
              <ListItem key={index} button>
                <ListItemText
                  primary={concepto.nombre_concepto}
                  onClick={() => {
                    swal.close();
                    executeGuardaPermisoAutorizacion({
                      data: {
                        usuario: usuario,
                        pwd: pwd,
                        rfc: rfc,
                        idsubmenu: 45,
                        idusuario: idUsuario,
                        idconcepto: concepto.id
                      }
                    });
                  }}
                />
              </ListItem>
            ) : index + 1 === cargaConceptosData.conceptos.length &&
              conceptosLista === 0 ? (
              <ListItem key={index}>
                <ListItemText primary="No hay conceptos por agregar para este usuario" />
              </ListItem>
            ) : null;
          })}
        </List>
      )
    });
  };

  const eliminarConcepto = (idConcepto, idUsuario) => {
    swal({
      text: "¿Está seguro de quitar este concepto?",
      buttons: ["No", "Sí"],
      dangerMode: true
    }).then(value => {
      if (value) {
        executeEliminaPermisoAutorizacion({
          data: {
            usuario: usuario,
            pwd: pwd,
            rfc: rfc,
            idsubmenu: 45,
            idusuario: idUsuario,
            idconcepto: idConcepto
          }
        });
      }
    });
  };

  const getConseptosUsuario = (usuarioConceptos, idUsuario) => {
    return usuarioConceptos.map((concepto, index) => {
      return (
        <StyledTreeItem
          key={index}
          nodeId={`0${index}`}
          labelText={concepto.nombre_concepto}
          labelIcon={AccountBalanceWalletIcon}
          labelInfo={
            <Tooltip title="Quitar concepto">
              <span>
                <IconButton
                  disabled={permisos < 3}
                  onClick={e => {
                    e.stopPropagation();
                    eliminarConcepto(concepto.id, idUsuario);
                  }}
                >
                  <MinimizeIcon
                    color={permisos === 3 ? "secondary" : "inherit"}
                  />
                </IconButton>
              </span>
            </Tooltip>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        ></StyledTreeItem>
      );
    });
  };

  const conceptoUsuarioValidacion = conceptos => {
    for (let x = 0; x < conceptos.length; x++) {
      if (conceptos[x].id === parseInt(conceptoBusqueda)) {
        return true;
      }
    }
    return false;
  };

  const getUsuarios = () => {
    return permisosAutorizacionesData.usuarios.map((usuario, index) => {
      return conceptoUsuarioValidacion(usuario.conceptos) ||
        parseInt(conceptoBusqueda) === 0 ? (
        <StyledTreeItem
          key={index}
          nodeId={`${index}`}
          labelText={`${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`}
          labelIcon={PersonIcon}
          conceptos={usuario.conceptos}
          itemPadre={true}
          labelInfo={
            <Fragment>
              <Tooltip title="Máximo importe de gastos">
                <span>
                  <IconButton
                    disabled={permisos < 1}
                    onClick={e => {
                      e.stopPropagation();
                      setConceptosLimite(usuario.conceptos);
                      setIdUsuario(usuario.idusuario);
                      handleOpenDialogLimiteImporteGastos();
                    }}
                  >
                    <MoneyOffIcon
                      style={{ color: permisos >= 1 ? "black" : "" }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Agregar concepto">
                <span>
                  <IconButton
                    disabled={permisos < 2}
                    onClick={e => {
                      e.stopPropagation();
                      agregarConcepto(usuario.idusuario);
                    }}
                  >
                    <AddIcon
                      style={{ color: permisos >= 2 ? "#4caf50" : "" }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Fragment>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        >
          {getConseptosUsuario(usuario.conceptos, usuario.idusuario)}
        </StyledTreeItem>
      ) : (
        <StyledTreeItem
          style={{ display: "none" }}
          key={index}
          nodeId={`0000`}
          labelIcon={PersonIcon}
        ></StyledTreeItem>
      );
    });
  };

  const getConceptos = () => {
    return cargaConceptosData.conceptos.map((concepto, index) => {
      return (
        <option key={index} value={concepto.id}>
          {concepto.nombre_concepto}
        </option>
      );
    });
  };

  const getConceptosLimite = () => {
    return conceptosLimite.map((concepto, index) => {
      return (
      <option key={index} value={concepto.id}>{concepto.nombre_concepto}</option>
      )
    })
  };

  const guardarLimiteImporte = () => {
    if (checkedLimite && importeLimite === "") {
      swal("Error", "Ingresa un importe límite", "warning");
    } else {
      executeGuardaLimiteGastos({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idsubmenu: 45,
          idusuario: idUsuario,
          idconcepto: parseInt(selectedConceptoLimite),
          importe: checkedLimite ? parseFloat(importeLimite) : 0
        }
      });
    }
  };

  return redirect ? (
    <Redirect to="/autorizacionesGastos" />
  ) : (
    <Card className={classes.card}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.title}>
            <Link to="autorizacionesGastos">
              <Tooltip title="Regresar">
                <IconButton>
                  <ArrowBackIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>
            Configuraciones y Permisos
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" style={{ marginLeft: "10px" }}>
            Asocie a cada usuario los conceptos a los que tendrá facultades para
            autorización.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            className={classes.textFields}
            select
            SelectProps={{
              native: true
            }}
            variant="outlined"
            value={conceptoBusqueda}
            label="Buscar por concepto"
            type="text"
            onChange={e => {
              setConceptoBusqueda(e.target.value);
            }}
          >
            <option value="0">Todos</option>
            {cargaConceptosData && cargaConceptosData.conceptos ? (
              getConceptos()
            ) : (
              <Redirect to="/autorizacionesGastos" />
            )}
          </TextField>
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
            {permisosAutorizacionesData && permisosAutorizacionesData.usuarios
              ? getUsuarios()
              : null}
          </TreeView>
        </Grid>
      </Grid>
      <Dialog
        onClose={handleCloseDialogLimiteImporteGastos}
        aria-labelledby="simple-dialog-title"
        open={openDialogLimiteImporteGastos}
      >
        <DialogTitle id="simple-dialog-title">
          Asignar Límite de Importe de Gastos
        </DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true
                }}
                value={selectedConceptoLimite}
                variant="outlined"
                label="Concepto"
                type="text"
                onChange={(e) => {
                  setSelectedConceptoLimite(e.target.value);
                  if(e.target.value !== "0") {
                    executeTraerLimiteGastosUsuario({
                      params: {
                        usuario: usuario,
                        pwd: pwd,
                        rfc: rfc,
                        idsubmenu: 45,
                        idusuario: idUsuario,
                        idconcepto: parseInt(e.target.value)
                      }
                    });
                  }
                }}
              >
                <option value={0}>Selecciona un concepto</option>
                {getConceptosLimite()}
              </TextField>
            </Grid>
            {selectedConceptoLimite !== "0" ? (
              <Fragment>
                <Grid item xs={12} sm={6} style={{ alignSelf: "flex-end" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={checkedLimite}
                    onChange={handleChangeLimite}
                  />
                }
                label="Límite"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                style={{ verticalAlign: "text-bottom" }}
                id="maximoImporteGastos"
                type="text"
                disabled={!checkedLimite}
                label="Importe Máximo"
                value={importeLimite}
                inputProps={{
                  maxLength: 20
                }}
                onKeyPress={e => {
                  doubleKeyValidation(e, 2);
                }}
                onChange={e => {
                  doublePasteValidation(e, 2);
                  setImporteLimite(e.target.value);
                }}
              />
            </Grid>
              </Fragment>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogLimiteImporteGastos}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            disabled={permisos < 2 || selectedConceptoLimite === "0"}
            color="primary"
            onClick={() => {
              guardarLimiteImporte();
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
