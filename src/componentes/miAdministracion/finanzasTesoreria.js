import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Tooltip,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  FindInPage as FindInPageIcon,
  GetApp as GetAppIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
} from "../../helpers/inputHelpers";
import { number_format } from "../../helpers/funciones";
import NumberFormat from "react-number-format";
import moment from "moment";
import swal from "sweetalert";

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
  textFields: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  table: {
    overflow: "auto",
  },
}));

/* function getSteps() {
  return [
    "1. Indicar el Efectivo Disponible y Aplicación  de Pagos",
    "2. Completar instrucciones de Pago",
    "3. Adicionar instrucciones de Pago sin CxP previa",
    "4. Generacion de Layout para Portales Bancarios",
  ];
} */

export default function FinanzasTesoreria(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const correoUsuario = usuarioDatos.correo;
  const passwordUsuario = usuarioDatos.password;
  const setLoading = props.setLoading;
  const empresaDatos = props.empresaDatos;
  const rfcEmpresa = empresaDatos.RFC;
  const [showComponent, setShowComponent] = useState(0);
  //const [nombreSubmenu, setNombreSubmenu] = useState("");

  return (
    <div>
      <Card className={classes.card} style={{ marginBottom: "15px" }}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Finanzas y tesorería
            </Typography>
          </Grid>
          {submenuContent.map((content, index) => {
            return content.submenu.orden !== 0 ? (
              <Grid
                item
                xs={12}
                md={5}
                key={index}
                style={{ marginBottom: "15px" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    //setNombreSubmenu(content.submenu.nombre_submenu);
                    setShowComponent(content.submenu.idsubmenu === 46 ? 1 : 2);
                  }}
                >
                  {content.submenu.nombre_submenu}
                </Button>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Card>
      <Card style={{ marginTop: "15px" }}>
        {showComponent === 1 ? (
          <FlujosEfectivo
            idUsuario={idUsuario}
            correoUsuario={correoUsuario}
            passwordUsuario={passwordUsuario}
            rfcEmpresa={rfcEmpresa}
            setLoading={setLoading}
            setShowComponent={setShowComponent}
          />
        ) : null}
      </Card>
    </div>
  );
}

function FlujosEfectivo(props) {
  const classes = useStyles();
  const idUsuario = props.idUsuario;
  const correoUsuario = props.correoUsuario;
  const passwordUsuario = props.passwordUsuario;
  const rfcEmpresa = props.rfcEmpresa;
  const setLoading = props.setLoading;
  const setShowComponent = props.setShowComponent;
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState([]);
  /* const [coordenada1, setCoordenada1] = useState(0);
  const [coordenada2, setCoordenada2] = useState(0); */
  /* const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState([]); */
  const [disponible, setDisponible] = useState(100000);
  const [aplicado, setAplicado] = useState(0.0);
  const [restante, setRestante] = useState(disponible - aplicado);
  const [activeStep, setActiveStep] = React.useState(0);
  const [
    instruccionesPagoProveedores,
    setInstruccionesPagoProveedores,
  ] = useState({
    ids: [],
    proveedores: [],
    importes: [],
  });
  const [instrucciones, setInstrucciones] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    importes: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    valoresCuentasOrigen: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    valoresCuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    rfcProveedores: [],
    valoresProveedores: [],
    importes: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    valoresCuentasOrigen: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    valoresCuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const [instruccionesCombinadas, setInstruccionesCombinadas] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    importes: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const [cuentasOrigen, setCuentasOrigen] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresPrioritarios, setProveedoresPrioritarios] = useState([]);
  const [proveedoresNoPrioritarios, setProveedoresNoPrioritarios] = useState(
    []
  );
  const [cuentasDestino, setCuentasDestino] = useState([]);
  const [proveedorAutocomplete, setProveedorAutocomplete] = useState("");
  const [openPrioritariosDialog, setOpenPrioritariosDialog] = useState(false);
  const [
    validacionDialogProveedoresPrioritarios,
    setValidacionDialogProveedoresPrioritarios,
  ] = useState(false);
  const [
    filtroApiTraerFlujosEfectivo,
    setFiltroApiTraerFlujosEfectivo,
  ] = useState(1);
  const steps = [
    "1. Indicar el Efectivo Disponible y Aplicación  de Pagos",
    "2. Completar instrucciones de Pago",
    "3. Adicionar instrucciones de Pago sin CxP previa",
    "4. Generacion de Layout para Portales Bancarios",
  ];
  /* const cuentasOrigen = ["Bancomer", "Banamex", "Banorte", "HSBC", "Santander"];
  const cuentasDestino = [
    "Bancomer",
    "Banamex",
    "Banorte",
    "HSBC",
    "Santander",
  ]; */
  const [
    {
      data: getCuentasPropiasData,
      loading: getCuentasPropiasLoading,
      error: getCuentasPropiasError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getCuentasPropias`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: getCuentasClientesProveedoresData,
      loading: getCuentasClientesProveedoresLoading,
      error: getCuentasClientesProveedoresError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getCuentasClientesProveedores`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: traerProveedoresFiltroData,
      loading: traerProveedoresFiltroLoading,
      error: traerProveedoresFiltroError,
    },
    executeTraerProveedoresFiltro,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerProveedoresFiltro`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
      },
    },
    {
      useCache: false,
      /* manual: true, */
    }
  );

  useEffect(() => {
    function checkData() {
      if (getCuentasPropiasData) {
        if (getCuentasPropiasData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(getCuentasPropiasData.error)}
            </Typography>
          );
        } else {
          /* let cuentas = [];
          for (let x = 0; x < getCuentasPropiasData.cuentas.length; x++) {
            cuentas.push(getCuentasPropiasData.cuentas[x].Nombre);
          } */
          setCuentasOrigen(getCuentasPropiasData.cuentas);
        }
      }
    }

    checkData();
  }, [getCuentasPropiasData]);

  useEffect(() => {
    function checkData() {
      if (getCuentasClientesProveedoresData) {
        if (getCuentasClientesProveedoresData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(getCuentasClientesProveedoresData.error)}
            </Typography>
          );
        } else {
          /* for (
            let x = 0;
            x < getCuentasClientesProveedoresData.cuentas.length;
            x++
          ) {
            let nombre = getCuentasClientesProveedoresData.cuentas[
              x
            ].Banco.replace(", S.A.", "");
            let numero = getCuentasClientesProveedoresData.cuentas[
              x
            ].Num.substr(-4);
            getCuentasClientesProveedoresData.cuentas[x].Layout =
              nombre + " " + numero;
          } */
          setCuentasDestino(getCuentasClientesProveedoresData.cuentas);
        }
      }
    }

    checkData();
  }, [getCuentasClientesProveedoresData]);

  useEffect(() => {
    function checkData() {
      if (traerProveedoresFiltroData) {
        if (traerProveedoresFiltroData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerProveedoresFiltroData.error)}
            </Typography>
          );
        } else {
          setProveedores(traerProveedoresFiltroData.proveedores);
          setProveedoresPrioritarios(
            traerProveedoresFiltroData.proveedores.filter(
              (proveedor) => proveedor.Prioridad === 1
            )
          );
          setProveedoresNoPrioritarios(
            traerProveedoresFiltroData.proveedores.filter(
              (proveedor) => proveedor.Prioridad === 0
            )
          );
        }
      }
    }

    checkData();
  }, [traerProveedoresFiltroData]);

  useEffect(() => {
    if (validacionDialogProveedoresPrioritarios) {
      setOpenPrioritariosDialog(true);
      setValidacionDialogProveedoresPrioritarios(false);
    }
  }, [validacionDialogProveedoresPrioritarios]);

  if (
    getCuentasPropiasLoading ||
    getCuentasClientesProveedoresLoading ||
    traerProveedoresFiltroLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getCuentasPropiasError ||
    getCuentasClientesProveedoresError ||
    traerProveedoresFiltroError
  ) {
    return <ErrorQueryDB />;
  }

  const handleNext = () => {
    let validacionPaso2 = 0;
    let validacionPaso3 = 0;
    if (activeStep === 1) {
      for (let x = 0; x < instrucciones.proveedores.length; x++) {
        if (
          instrucciones.valoresCuentasOrigen[x] === "-1" ||
          instrucciones.valoresCuentasDestino[x] === "-1" ||
          instrucciones.fechas[x] === ""
        ) {
          validacionPaso2++;
          break;
        }
      }
    } else if (activeStep === 2) {
      /* console.log(instrucciones);
      console.log(instruccionesAdicionales); */
      let ids = instrucciones.ids.concat(instruccionesAdicionales.ids);
      let tipos = instrucciones.tipos.concat(instruccionesAdicionales.tipos);
      let proveedores = instrucciones.proveedores.concat(
        instruccionesAdicionales.proveedores
      );
      let importes = instrucciones.importes.concat(
        instruccionesAdicionales.importes
      );
      let idsBancosOrigen = instrucciones.idsBancosOrigen.concat(
        instruccionesAdicionales.idsBancosOrigen
      );
      let cuentasOrigen = instrucciones.cuentasOrigen.concat(
        instruccionesAdicionales.cuentasOrigen
      );
      let idsBancosDestino = instrucciones.idsBancosDestino.concat(
        instruccionesAdicionales.idsBancosDestino
      );
      let cuentasDestino = instrucciones.cuentasDestino.concat(
        instruccionesAdicionales.cuentasDestino
      );
      let fechas = instrucciones.fechas.concat(instruccionesAdicionales.fechas);
      let llavesMatch = instrucciones.llavesMatch.concat(
        instruccionesAdicionales.llavesMatch
      );
      setInstruccionesCombinadas({
        ids: ids,
        tipos: tipos,
        proveedores: proveedores,
        importes: importes,
        idsBancosOrigen: idsBancosOrigen,
        cuentasOrigen: cuentasOrigen,
        idsBancosDestino: idsBancosDestino,
        cuentasDestino: cuentasDestino,
        fechas: fechas,
        llavesMatch: llavesMatch,
      });
      /* let importes = instrucciones.importes.concat(
        instruccionesAdicionales.importes
      );
      for (let x=0; x<proveedores.length; x++) {
        if (proveedores.indexOf(proveedores[x]) !== x) {
          proveedores.splice(x, 1);
        }
      } */
      /* for (let x=0; x<cuentasOrigen.length; x++) {
        if (cuentasOrigen.indexOf(cuentasOrigen[x]) !== x) {
          cuentasOrigen.splice(x, 1);
        }
      }
      for (let x=0; x<cuentasDestino.length; x++) {
        if (cuentasDestino.indexOf(cuentasDestino[x]) !== x) {
          cuentasDestino.splice(x, 1);
        }
      } */
      /* console.log(cuentasOrigen);
      console.log(cuentasDestino); */
      /* console.log(instrucciones.ids.length, instruccionesAdicionales.ids.length); */
      if (instruccionesAdicionales.ids.length !== 0) {
        for (let x = 0; x < instruccionesAdicionales.proveedores.length; x++) {
          if (
            instruccionesAdicionales.valoresProveedores[x] === "-1" ||
            instruccionesAdicionales.valoresCuentasOrigen[x] === "-1" ||
            instruccionesAdicionales.valoresCuentasDestino[x] === "-1" ||
            instruccionesAdicionales.fechas[x] === "" ||
            instruccionesAdicionales.importes[x] === "" ||
            parseFloat(instruccionesAdicionales.importes[x]) === "0"
          ) {
            validacionPaso3++;
            break;
          }
        }
      } else if (instrucciones.ids.length === 0) {
        validacionPaso3++;
      }
    }

    if (activeStep === 0 && documentosSeleccionados.length === 0) {
      swal(
        "No ha seleccionado ningún documento",
        "Seleccione al menos un documento. En caso de que no haya pagos a proveedores presione el botón SIN PAGOS A PROVEEDORES.",
        "warning"
      );
    } else if (activeStep === 1 && validacionPaso2 > 0) {
      swal(
        "Datos incompletos",
        "Debe de llenar todos los campos correctamente para poder continuar.",
        "warning"
      );
    } else if (activeStep === 2 && validacionPaso3 > 0) {
      swal(
        "Datos incompletos",
        "Debe de llenar todos los campos correctamente para poder continuar.",
        "warning"
      );
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleSinPagosProveedores = () => {
    setActiveStep(2);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Paso1
            idUsuario={idUsuario}
            correo={correoUsuario}
            password={passwordUsuario}
            setLoading={setLoading}
            rfc={rfcEmpresa}
            //proveedores={proveedores}
            proveedoresPrioritarios={proveedoresPrioritarios}
            proveedoresNoPrioritarios={proveedoresNoPrioritarios}
            documentosSeleccionados={documentosSeleccionados}
            executeTraerProveedoresFiltro={executeTraerProveedoresFiltro}
            setDocumentosSeleccionados={setDocumentosSeleccionados}
            /* coordenada1={coordenada1}
            setCoordenada1={setCoordenada1}
            coordenada2={coordenada2}
            setCoordenada2={setCoordenada2} */
            /* coordenadasSeleccionadas={coordenadasSeleccionadas}
            setCoordenadasSeleccionadas={setCoordenadasSeleccionadas} */
            disponible={disponible}
            setDisponible={setDisponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            restante={restante}
            setRestante={setRestante}
            instrucciones={instrucciones}
            setInstrucciones={setInstrucciones}
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            setInstruccionesPagoProveedores={setInstruccionesPagoProveedores}
            openPrioritariosDialog={openPrioritariosDialog}
            setOpenPrioritariosDialog={setOpenPrioritariosDialog}
            setValidacionDialogProveedoresPrioritarios={
              setValidacionDialogProveedoresPrioritarios
            }
            filtroApiTraerFlujosEfectivo={filtroApiTraerFlujosEfectivo}
            setFiltroApiTraerFlujosEfectivo={setFiltroApiTraerFlujosEfectivo}
          />
        );
      case 1:
        return (
          <Paso2
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            instrucciones={instrucciones}
            setInstrucciones={setInstrucciones}
            cuentasOrigen={cuentasOrigen}
            cuentasDestino={cuentasDestino}
          />
        );
      case 2:
        return (
          <Paso3
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            instrucciones={instrucciones}
            /* setInstrucciones={setInstrucciones} */
            instruccionesAdicionales={instruccionesAdicionales}
            setInstruccionesAdicionales={setInstruccionesAdicionales}
            correo={correoUsuario}
            password={passwordUsuario}
            setLoading={setLoading}
            rfc={rfcEmpresa}
            proveedores={proveedores}
            cuentasOrigen={cuentasOrigen}
            cuentasDestino={cuentasDestino}
            disponible={disponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            setRestante={setRestante}
            proveedorAutocomplete={proveedorAutocomplete}
            setProveedorAutocomplete={setProveedorAutocomplete}
          />
        );
      case 3:
        return <Paso4 instruccionesCombinadas={instruccionesCombinadas} />;
      default:
        return "Unknown stepIndex";
    }
  };

  return (
    <div style={{ padding: "15px" }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={8} sm={6} md={6} style={{ alignSelf: "flex-end" }}>
            <Typography
              className={classes.titleTable}
              variant="h6"
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
              Flujos de Efectivo
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>

      <Grid container spacing={3} style={{ marginBottom: "15px" }}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                disabled={activeStep === 0}
                variant="contained"
                color="primary"
                onClick={handleBack}
                className={classes.backButton}
              >
                Anterior
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Grid>
            {activeStep === 0 ? (
              <Grid item xs={12}>
                <Button
                  disabled={activeStep >= 2}
                  variant="contained"
                  onClick={handleSinPagosProveedores}
                >
                  Sin pagos a proveedores
                </Button>
              </Grid>
            ) : null}
            <Grid item xs={12} style={{ marginTop: "15px" }}>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    className={classes.textFields}
                    id="disponible"
                    variant="outlined"
                    type="text"
                    label="Disponible"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    value={disponible}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    /* onChange={handleChange} */
                    onChange={(e) => {
                      /* doublePasteValidation(e, 2); */
                      setDisponible(e.target.value);
                      setRestante(parseFloat(e.target.value) - aplicado);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ alignSelf: "center" }}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    <span>
                      <strong>Aplicado:</strong>
                    </span>
                    <span>{` $${number_format(aplicado, 2, ".", ",")}`}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} style={{ alignSelf: "center" }}>
                  <Typography
                    variant="subtitle1"
                    style={{ textAlign: "center" }}
                  >
                    <span>
                      <strong>Restante: </strong>
                    </span>
                    <span
                      style={{
                        color:
                          restante > 0
                            ? "#8bc34a"
                            : restante < 0
                            ? "#d50000"
                            : "black",
                      }}
                    >{` $${number_format(restante, 2, ".", ",")}`}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {getStepContent(activeStep)}
      </Grid>
    </div>
  );
}

function NumberFormatCustom(props) {
  const { id, inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.floatValue,
          },
        });
        /* const e = {target: {
          value: values.floatValue,
          id: id
        }}; */
        /* doublePasteValidation(e, 2); */
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

function Paso1(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const idUsuario = props.idUsuario;
  const correoUsuario = props.correo;
  const passwordUsuario = props.password;
  const setLoading = props.setLoading;
  const rfcEmpresa = props.rfc;
  //const proveedores = props.proveedores;
  const proveedoresPrioritarios = props.proveedoresPrioritarios;
  const proveedoresNoPrioritarios = props.proveedoresNoPrioritarios;
  const executeTraerProveedoresFiltro = props.executeTraerProveedoresFiltro;
  const documentosSeleccionados = props.documentosSeleccionados;
  const setDocumentosSeleccionados = props.setDocumentosSeleccionados;
  /* const coordenada1 = props.coordenada1;
  const setCoordenada1 = props.setCoordenada1;
  const coordenada2 = props.coordenada2;
  const setCoordenada2 = props.setCoordenada2; */
  /* const coordenadasSeleccionadas = props.coordenadasSeleccionadas;
  const setCoordenadasSeleccionadas = props.setCoordenadasSeleccionadas; */
  const disponible = props.disponible;
  //const setDisponible = props.setDisponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  const restante = props.restante;
  const setRestante = props.setRestante;
  //descomentar estas dos variables
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const openPrioritariosDialog = props.openPrioritariosDialog;
  const setOpenPrioritariosDialog = props.setOpenPrioritariosDialog;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const setInstruccionesPagoProveedores = props.setInstruccionesPagoProveedores;
  const setValidacionDialogProveedoresPrioritarios =
    props.setValidacionDialogProveedoresPrioritarios;
  const filtroApiTraerFlujosEfectivo = props.filtroApiTraerFlujosEfectivo;
  const setFiltroApiTraerFlujosEfectivo = props.setFiltroApiTraerFlujosEfectivo;
  const [flujosEfectivo, setFlujosEfectivo] = useState([]);
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [pendiente, setPendiente] = useState(0.0);
  /*  const [proveedoresPrioritarios, setProveedoresPrioritarios] = useState([]); */
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [tituloFlujosFiltrados, setTituloFlujosFiltrados] = useState("");
  const [showTable, setShowTable] = useState(1);
  const [idProveedor, setIdProveedor] = useState(0);
  const [pendienteGuardado, setPendienteGuardado] = useState(0.0);

  const [
    {
      data: traerFlujosEfectivoData,
      loading: traerFlujosEfectivoLoading,
      error: traerFlujosEfectivoError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivo`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        filtro: filtroApiTraerFlujosEfectivo,
        pendiente: pendienteGuardado
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: getFlwPagosData,
      loading: getFlwPagosLoading,
      error: getFlwPagosError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getFlwPagos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        Layout: 0,
        IdUsuario: idUsuario,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: traerFlujosEfectivoFiltradosData,
      loading: traerFlujosEfectivoFiltradosLoading,
      error: traerFlujosEfectivoFiltradosError,
    },
    executeTraerFlujosEfectivoFiltrados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoFiltrados`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarFlwPagosData,
      loading: guardarFlwPagosLoading,
      error: guardarFlwPagosError,
    },
    executeGuardarFlwPagos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarFlwPagos`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: cambiarPrioridadProveedorData,
      loading: cambiarPrioridadProveedorLoading,
      error: cambiarPrioridadProveedorError,
    },
    executeCambiarPrioridadProveedor,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cambiarPrioridadProveedor`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoData) {
        if (traerFlujosEfectivoData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerFlujosEfectivoData.error)}
            </Typography>
          );
        } else {
          setFlujosEfectivo(traerFlujosEfectivoData.flujosefectivo);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoData]);

  useEffect(() => {
    function checkData() {
      if (getFlwPagosData) {
        if (getFlwPagosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(getFlwPagosData.error)}
            </Typography>
          );
        } else {
          //console.log(getFlwPagosData.pagospendientes);
        }
      }
    }

    checkData();
  }, [getFlwPagosData]);

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoFiltradosData) {
        if (traerFlujosEfectivoFiltradosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerFlujosEfectivoFiltradosData.error)}
            </Typography>
          );
        } else {
          setFlujosEfectivoFiltrados(
            traerFlujosEfectivoFiltradosData.flujosefectivo
          );
          let total = 0;
          for (
            let x = 0;
            x < traerFlujosEfectivoFiltradosData.flujosefectivo.length;
            x++
          ) {
            total =
              total +
              parseFloat(
                traerFlujosEfectivoFiltradosData.flujosefectivo[x].Pendiente
              );
          }
          setTotalEspecificos(total);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoFiltradosData]);

  useEffect(() => {
    function checkData() {
      if (guardarFlwPagosData) {
        if (guardarFlwPagosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(guardarFlwPagosData.error)}
            </Typography>
          );
        }
      }
    }

    checkData();
  }, [guardarFlwPagosData]);

  useEffect(() => {
    function checkData() {
      if (cambiarPrioridadProveedorData) {
        if (cambiarPrioridadProveedorData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(cambiarPrioridadProveedorData.error)}
            </Typography>
          );
        } else {
          executeTraerProveedoresFiltro();
          /* setOpenPrioritariosDialog(true); */
        }
      }
    }

    checkData();
  }, [cambiarPrioridadProveedorData, executeTraerProveedoresFiltro]);

  if (
    traerFlujosEfectivoLoading ||
    getFlwPagosLoading ||
    traerFlujosEfectivoFiltradosLoading ||
    guardarFlwPagosLoading ||
    cambiarPrioridadProveedorLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    traerFlujosEfectivoError ||
    getFlwPagosError ||
    traerFlujosEfectivoFiltradosError ||
    guardarFlwPagosError ||
    cambiarPrioridadProveedorError
  ) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenPrioritariosDialog = () => {
    setOpenPrioritariosDialog(true);
  };

  const handleClosePrioritariosDialog = () => {
    setOpenPrioritariosDialog(false);
  };

  const getFlujosEfectivo = () => {
    if (flujosEfectivo.length > 0) {
      let columnas = [];
      let filas = [];
      for (let x = 0; x < flujosEfectivo.length; x++) {
        if (!columnas.includes(flujosEfectivo[x].Tipo)) {
          columnas.push(flujosEfectivo[x].Tipo);
        }
        if (!filas.includes(flujosEfectivo[x].RazonPrincipal)) {
          filas.push(flujosEfectivo[x].RazonPrincipal);
        }
      }

      let ids = new Array(filas.length)
        .fill(null)
        .map((item) => new Array(columnas.length).fill(0));
      let pendientes = new Array(filas.length)
        .fill(null)
        .map((item) => new Array(columnas.length).fill(0));
      let sumaFilas = new Array(filas.length).fill(0);
      let sumaColumnas = new Array(columnas.length).fill(0);

      for (let x = 0; x < filas.length; x++) {
        for (let y = 0; y < columnas.length; y++) {
          for (let z = 0; z < flujosEfectivo.length; z++) {
            if (
              flujosEfectivo[z].Tipo === columnas[y] &&
              flujosEfectivo[z].RazonPrincipal === filas[x]
            ) {
              pendientes[x][y] =
                pendientes[x][y] + parseFloat(flujosEfectivo[z].Pendiente);
              ids[x][y] =
                ids[x][y] !== 0
                  ? ids[x][y] + "," + flujosEfectivo[z].id
                  : flujosEfectivo[z].id;
            }
          }
        }
      }

      for (let x = 0; x < pendientes.length; x++) {
        for (let y = 0; y < pendientes[x].length; y++) {
          sumaFilas[x] = sumaFilas[x] + parseFloat(pendientes[x][y]);
          sumaColumnas[y] = sumaColumnas[y] + parseFloat(pendientes[x][y]);
        }
      }
      let sumaTotal = 0;

      for (let x = 0; x < sumaFilas.length; x++) {
        sumaTotal = sumaTotal + sumaFilas[x];
      }

      /* console.log(columnas);
      console.log(filas);
      console.log(pendiente); */

      return (
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Proveedor</strong>
              </TableCell>
              {columnas.map((columna, index) => (
                <TableCell align="right" key={index}>
                  <strong>{columna}</strong>
                </TableCell>
              ))}
              <TableCell align="right">
                <strong>Total Resultado</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filas.map((fila, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {fila}
                  </TableCell>
                  {pendientes[index].map((pendiente, index2) => {
                    let validacion = 0;
                    let idsEstraidos = ids[index][index2].toString().split(",");
                    ciclo1: for (let x = 0; x < idsEstraidos.length; x++) {
                      for (let y = 0; y < documentosSeleccionados.length; y++) {
                        console.log(
                          documentosSeleccionados[y],
                          parseInt(idsEstraidos[x])
                        );
                        if (
                          documentosSeleccionados[y] ===
                          parseInt(idsEstraidos[x])
                        ) {
                          validacion = 1;
                          break ciclo1;
                        }
                      }
                    }
                    return (
                      <TableCell
                        align="right"
                        key={index2}
                        style={{
                          cursor: "pointer",
                          background: validacion === 1 ? "#388e3c" : "",
                        }}
                        onClick={() => {
                          executeTraerFlujosEfectivoFiltrados({
                            data: {
                              usuario: correoUsuario,
                              pwd: passwordUsuario,
                              rfc: rfcEmpresa,
                              idsubmenu: 46,
                              forma: 3,
                              razon: filas[index],
                              tipo: columnas[index2],
                              filtro: filtroApiTraerFlujosEfectivo,
                            },
                          });
                          setShowTable(2);
                          setTituloFlujosFiltrados(
                            `Documentos con razon ${filas[index]} y tipo ${columnas[index2]}`
                          );
                        }}
                      >
                        ${number_format(pendiente, 2, ".", ",")}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    align="right"
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      executeTraerFlujosEfectivoFiltrados({
                        data: {
                          usuario: correoUsuario,
                          pwd: passwordUsuario,
                          rfc: rfcEmpresa,
                          idsubmenu: 46,
                          forma: 1,
                          razon: filas[index],
                          filtro: filtroApiTraerFlujosEfectivo,
                        },
                      });
                      setShowTable(2);
                      setTituloFlujosFiltrados(
                        "Documentos con razon " + filas[index]
                      );
                    }}
                  >
                    ${number_format(sumaFilas[index], 2, ".", ",")}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow style={{ background: "#FAFAFA" }}>
              <TableCell component="th" scope="row">
                <strong>Total Resultado</strong>
              </TableCell>
              {sumaColumnas.map((columna, index) => (
                <TableCell
                  align="right"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    executeTraerFlujosEfectivoFiltrados({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 2,
                        tipo: columnas[index],
                        filtro: filtroApiTraerFlujosEfectivo,
                      },
                    });
                    setShowTable(2);
                    setTituloFlujosFiltrados(
                      "Documentos con tipo " + columnas[index]
                    );
                  }}
                >
                  <strong>${number_format(columna, 2, ".", ",")}</strong>
                </TableCell>
              ))}
              <TableCell
                align="right"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  executeTraerFlujosEfectivoFiltrados({
                    data: {
                      usuario: correoUsuario,
                      pwd: passwordUsuario,
                      rfc: rfcEmpresa,
                      idsubmenu: 46,
                      forma: 5,
                      filtro: filtroApiTraerFlujosEfectivo,
                    },
                  });
                  setShowTable(2);
                  setTituloFlujosFiltrados("Todos los documentos");
                }}
              >
                <strong>${number_format(sumaTotal, 2, ".", ",")}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else {
      return (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Sin Datos
        </Typography>
      );
    }
  };

  const handleToggleDocumentosEspecificos = (value) => () => {
    const currentIndex = documentosSeleccionados.indexOf(value);
    const newChecked = [...documentosSeleccionados];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setDocumentosSeleccionados(newChecked);
  };

  const getDocumentosEspecificos = () => {
    if (flujosEfectivoFiltrados.length > 0) {
      return flujosEfectivoFiltrados.map((flujoEfectivo, index) => {
        const labelId = `checkbox-list-label-${index}`;
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <Checkbox
                onClick={handleToggleDocumentosEspecificos(flujoEfectivo.id)}
                checked={
                  documentosSeleccionados.indexOf(flujoEfectivo.id) !== -1
                }
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
                onChange={(e) => {
                  let nuevosIds = instrucciones.ids;
                  let nuevosTipos = instrucciones.tipos;
                  let nuevosProveedores = instrucciones.proveedores;
                  let nuevosRfcProveedores = instrucciones.rfcProveedores;
                  let nuevosImportes = instrucciones.importes;
                  let nuevosIdsBancosOrigen = instrucciones.idsBancosOrigen;
                  let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                  let nuevosValoresCuentasOrigen =
                    instrucciones.valoresCuentasOrigen;
                  let nuevosIdsBancosDestino = instrucciones.idsBancosDestino;
                  let nuevasCuentasDestino = instrucciones.cuentasDestino;
                  let nuevosValoresCuentasDestino =
                    instrucciones.valoresCuentasDestino;
                  let nuevasFechas = instrucciones.fechas;
                  let nuevasLlavesMatch = instrucciones.llavesMatch;

                  let ids = instruccionesPagoProveedores.ids;
                  let proveedores = instruccionesPagoProveedores.proveedores;
                  let importes = instruccionesPagoProveedores.importes;

                  if (e.target.checked) {
                    setAplicado(aplicado + parseFloat(flujoEfectivo.Pendiente));
                    setRestante(
                      disponible -
                        (aplicado + parseFloat(flujoEfectivo.Pendiente))
                    );
                    //
                    let posicion = nuevosProveedores.indexOf(
                      flujoEfectivo.Razon
                    );
                    if (posicion === -1) {
                      nuevosIds.push(flujoEfectivo.id);
                      nuevosTipos.push("Pago a proveedor");
                      nuevosProveedores.push(flujoEfectivo.Razon);
                      nuevosRfcProveedores.push(flujoEfectivo.cRFC);
                      nuevosImportes.push(flujoEfectivo.Pendiente);
                      nuevosIdsBancosOrigen.push(0);
                      nuevasCuentasOrigen.push("");
                      nuevosValoresCuentasOrigen.push("-1");
                      nuevosIdsBancosDestino.push(0);
                      nuevasCuentasDestino.push("");
                      nuevosValoresCuentasDestino.push("-1");
                      nuevasFechas.push(moment().format("YYYY-MM-DD"));
                      nuevasLlavesMatch.push("");
                    } else {
                      nuevosIds[posicion] =
                        nuevosIds[posicion] + "," + flujoEfectivo.id;
                      nuevosImportes[posicion] =
                        parseFloat(nuevosImportes[posicion]) +
                        parseFloat(flujoEfectivo.Pendiente);
                    }

                    ids.push(flujoEfectivo.id);
                    proveedores.push(flujoEfectivo.Razon);
                    importes.push(parseFloat(flujoEfectivo.Pendiente));

                    /* console.log(flujoEfectivo); */

                    executeGuardarFlwPagos({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 1,
                        IdFlw: flujoEfectivo.id,
                        IdDoc: flujoEfectivo.IdDoc,
                        Idcon: flujoEfectivo.Idcon,
                        Fecha: flujoEfectivo.Fecha,
                        Vence: flujoEfectivo.Vence,
                        Idclien: flujoEfectivo.Idclien,
                        Razon: flujoEfectivo.Razon,
                        Concepto: flujoEfectivo.Concepto,
                        Serie: flujoEfectivo.Serie,
                        Folio: flujoEfectivo.Folio,
                        Total: flujoEfectivo.Total,
                        Pendiente: flujoEfectivo.Pendiente,
                        Tipo: flujoEfectivo.Tipo,
                        Suc: flujoEfectivo.Suc,
                        cRFC: flujoEfectivo.cRFC,
                        SaldoInt: flujoEfectivo.SaldoInt,
                        FechaPago: moment().format("YYYY-MM-DD"),
                        Importe: parseFloat(flujoEfectivo.Pendiente),
                        LlaveMatch: "",
                        IdUsuario: idUsuario,
                      },
                    });
                  } else {
                    setAplicado(aplicado - parseFloat(flujoEfectivo.Pendiente));
                    setRestante(restante + parseFloat(flujoEfectivo.Pendiente));

                    let contador = 0;
                    for (
                      let x = 0;
                      x < instruccionesPagoProveedores.proveedores.length;
                      x++
                    ) {
                      if (
                        instruccionesPagoProveedores.proveedores[x] ===
                        flujoEfectivo.Razon
                      ) {
                        contador++;
                      }
                    }

                    let posicionEliminar = 0;
                    cicloInstrucciones1: for (
                      let x = 0;
                      x < instrucciones.proveedores.length;
                      x++
                    ) {
                      let ids = instrucciones.ids[x].toString().split(",");
                      for (let y = 0; y < ids.length; y++) {
                        if (parseInt(ids[y]) === flujoEfectivo.id) {
                          posicionEliminar = x;
                          break cicloInstrucciones1;
                        }
                      }
                    }

                    if (contador === 1) {
                      nuevosIds.splice(posicionEliminar, 1);
                      nuevosTipos.splice(posicionEliminar, 1);
                      nuevosProveedores.splice(posicionEliminar, 1);
                      nuevosRfcProveedores.splice(posicionEliminar, 1);
                      nuevosImportes.splice(posicionEliminar, 1);
                      nuevosIdsBancosOrigen.splice(posicionEliminar, 1);
                      nuevasCuentasOrigen.splice(posicionEliminar, 1);
                      nuevosValoresCuentasOrigen.splice(posicionEliminar, 1);
                      nuevosIdsBancosDestino.splice(posicionEliminar, 1);
                      nuevasCuentasDestino.splice(posicionEliminar, 1);
                      nuevosValoresCuentasDestino.splice(posicionEliminar, 1);
                      nuevasFechas.splice(posicionEliminar, 1);
                      nuevasLlavesMatch.splice(posicionEliminar, 1);
                    } else {
                      nuevosImportes[posicionEliminar] =
                        nuevosImportes[posicionEliminar] -
                        parseFloat(flujoEfectivo.Pendiente);
                      let ids = instrucciones.ids[posicionEliminar]
                        .toString()
                        .split(",")
                        .map((id) => parseFloat(id));
                      let pos = ids.indexOf(flujoEfectivo.id);
                      ids.splice(pos, 1);

                      nuevosIds[posicionEliminar] = ids[0];
                      if (ids.length > 1) {
                        for (let x = 1; x < ids.length; x++) {
                          nuevosIds[posicionEliminar] =
                            nuevosIds[posicionEliminar] + "," + ids[x];
                        }
                      }
                    }

                    let pos = ids.indexOf(flujoEfectivo.id);
                    ids.splice(pos, 1);
                    proveedores.splice(pos, 1);
                    importes.splice(pos, 1);

                    executeGuardarFlwPagos({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        forma: 2,
                        IdFlw: flujoEfectivo.id,
                      },
                    });
                  }
                  setInstrucciones({
                    ids: nuevosIds,
                    tipos: nuevosTipos,
                    proveedores: nuevosProveedores,
                    rfcProveedores: nuevosRfcProveedores,
                    importes: nuevosImportes,
                    idsBancosOrigen: nuevosIdsBancosOrigen,
                    cuentasOrigen: nuevasCuentasOrigen,
                    valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                    idsBancosDestino: nuevosIdsBancosDestino,
                    cuentasDestino: nuevasCuentasDestino,
                    valoresCuentasDestino: nuevosValoresCuentasDestino,
                    fechas: nuevasFechas,
                    llavesMatch: nuevasLlavesMatch,
                  });

                  setInstruccionesPagoProveedores({
                    ids: ids,
                    proveedores: proveedores,
                    importes: importes,
                  });
                }}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              {flujoEfectivo.IdDoc}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.Vence}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.Pendiente, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.Suc}</TableCell>
            <TableCell align="right">{flujoEfectivo.cRFC}</TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={5}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  /* const getCarritoCompra = () => {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Disponible:</strong>
              </TableCell>
              <TableCell align="right">
                <TextField
                  className={classes.textFields}
                  id="disponible"
                  variant="outlined"
                  type="text"
                  inputProps={{
                    maxLength: 20,
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  value={disponible}
                  onKeyPress={(e) => {
                    doubleKeyValidation(e, 2);
                  }}
                  onChange={(e) => {
                    setDisponible(e.target.value);
                    setRestante(parseFloat(e.target.value) - aplicado);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>{`Aplicado:`}</strong>
              </TableCell>
              <TableCell align="right">{`$${number_format(
                aplicado,
                2,
                ".",
                ","
              )}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Restante:</strong>
              </TableCell>
              <TableCell align="right">{`$${number_format(
                restante,
                2,
                ".",
                ","
              )}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }; */

  return showTable === 1 ? (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "flex-end" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="soloProveedoresPrioritarios"
                        color="primary"
                        checked={
                          filtroApiTraerFlujosEfectivo === 3 ||
                          filtroApiTraerFlujosEfectivo === 6
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo + 2
                            );
                          } else {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo - 2
                            );
                          }
                        }}
                      />
                    }
                    label="Solo Proveedores Prioritarios"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "center" }}
                >
                  <Tooltip title="Configurar proveedores prioritarios">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        /* executeTraerProveedores({
                          params: {
                            usuario: correoUsuario,
                            pwd: passwordUsuario,
                            rfc: rfcEmpresa,
                            idsubmenu: 46,
                          },
                        }); */
                        handleClickOpenPrioritariosDialog();
                      }}
                    >
                      ...
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "flex-end" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="soloDocumentosPrioritarios"
                        color="primary"
                        checked={
                          filtroApiTraerFlujosEfectivo === 4 ||
                          filtroApiTraerFlujosEfectivo === 6
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo + 3
                            );
                          } else {
                            setFiltroApiTraerFlujosEfectivo(
                              filtroApiTraerFlujosEfectivo - 3
                            );
                          }
                        }}
                      />
                    }
                    label="Solo Documentos Prioritarios"
                  />
                </Grid>
                {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2}
                  style={{ alignSelf: "center" }}
                >
                  <Tooltip title="Configurar documentos prioritarios">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                      }}
                    >
                      ...
                    </Button>
                  </Tooltip>
                </Grid> */}
                <Grid item xs={12} md={2}>
                  <TextField
                    className={classes.textFields}
                    id="pendienteMayorIgual"
                    label="Pendiente >="
                    type="text"
                    margin="normal"
                    value={pendiente}
                    inputProps={{
                      maxLength: 20,
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    onKeyPress={(e) => {
                      doubleKeyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      setPendiente(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} style={{ alignSelf: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%" }}
                    onClick={() => {
                      setPendienteGuardado(pendiente);
                    }}
                  >
                    Consultar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {/* {flujosEfectivo.length > 0 ? (
              
            ) : null} */}
            <Grid item xs={12} /* md={8} */>
              <TableContainer>{getFlujosEfectivo()}</TableContainer>
            </Grid>
            {/* <Grid item xs={12} md={4}>
              {getCarritoCompra()}
            </Grid> */}
          </Grid>
        </Grid>
        {/* <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Datos del Egreso
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      className={classes.textFields}
                      id="fecha"
                      label="Fecha"
                      type="date"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      className={classes.textFields}
                      id="importe"
                      label="Importe"
                      type="text"
                      margin="normal"
                      inputProps={{
                        maxLength: 20,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      className={classes.textFields}
                      id="llaveMatch"
                      label="Llave Match"
                      type="text"
                      margin="normal"
                      inputProps={{
                        maxLength: 200,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      className={classes.textFields}
                      id="formaPago"
                      label="Forma de Pago"
                      type="text"
                      margin="normal"
                      inputProps={{
                        maxLength: 20,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid> */}
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openPrioritariosDialog}
        onClose={handleClosePrioritariosDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Proveedores</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Autocomplete
                options={proveedoresNoPrioritarios}
                getOptionLabel={(option) =>
                  `${option.razonsocial} (${option.rfc})`
                }
                id="debug"
                onChange={(event, values) => {
                  setIdProveedor(values !== null ? values.id : 0);
                }}
                onInputChange={(e, value) => {
                  const separacion = value.split("-");
                  if (separacion.length === 2) {
                    /* const rfc = separacion[0];
                    const nombreLargo = separacion[1];
                    console.log(rfc);
                    console.log(nombreLargo); */
                  } /* else {
                    setRfcEstatus("");
                    setNombreLargoEstatus("");
                  } */
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="rfcAutocompleteStatus"
                    style={{ width: "100%" }}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 5);
                    }}
                    label="Proveedores"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} style={{ alignSelf: "center" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100%" }}
                onClick={() => {
                  if (idProveedor !== 0) {
                    executeCambiarPrioridadProveedor({
                      data: {
                        usuario: correoUsuario,
                        pwd: passwordUsuario,
                        rfc: rfcEmpresa,
                        idsubmenu: 46,
                        idproveedor: idProveedor,
                        prioridad: 1,
                      },
                    });
                    setValidacionDialogProveedoresPrioritarios(true);
                  } else {
                    swal("Error", "Selecciona un proveedor", "warning");
                  }

                  //setProveedoresPrioritarios([]); //esto se remplazara por la llamada a la api que convertira en prioritario el proveedor escojido
                }}
              >
                Agregar a prioritarios
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Proveedores Prioritarios</Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                {proveedoresPrioritarios.length > 0 ? (
                  proveedoresPrioritarios.map((proveedor, index) => {
                    return (
                      <ListItem button key={index}>
                        <ListItemText
                          primary={proveedor.razonsocial}
                          secondary={proveedor.rfc}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Quitar de prioritarios">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
                                swal({
                                  text:
                                    "¿Está seguro de quitar este proveedor de prioritarios?",
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    executeCambiarPrioridadProveedor({
                                      data: {
                                        usuario: correoUsuario,
                                        pwd: passwordUsuario,
                                        rfc: rfcEmpresa,
                                        idsubmenu: 46,
                                        idproveedor: proveedor.id,
                                        prioridad: 0,
                                      },
                                    });
                                    setValidacionDialogProveedoresPrioritarios(
                                      true
                                    );
                                  }
                                });
                              }}
                            >
                              <CloseIcon color="secondary" />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })
                ) : (
                  <ListItem button>
                    <ListItemText primary="Sin proveedores prioritarios" />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePrioritariosDialog}
            variant="contained"
            color="secondary"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  ) : (
    <Grid item xs={12} style={{ padding: "15px" }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={12} style={{ alignSelf: "flex-end" }}>
            <Typography
              className={classes.titleTable}
              variant="h6"
              id="tableTitle"
            >
              <Tooltip title="Regresar">
                <IconButton
                  aria-label="regresar"
                  onClick={() => {
                    setShowTable(1);
                  }}
                >
                  <ArrowBackIcon color="primary" />
                </IconButton>
              </Tooltip>
              {tituloFlujosFiltrados}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
      <Grid container spacing={3}>
        <Grid item xs={12} /* md={8} */>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>#Doc</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Vencimiento</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pendiente</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Sucursal</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>RFC</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getDocumentosEspecificos()}
                <TableRow>
                  <TableCell colSpan="4" />
                  <TableCell align="right">
                    <strong>Total Pendiente: </strong>
                  </TableCell>
                  <TableCell align="right">
                    ${number_format(totalEspecificos, 2, ".", ",")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          {getCarritoCompra()}
        </Grid> */}
      </Grid>
    </Grid>
  );
}

function Paso2(props) {
  const classes = useStyles();
  //comentar la variable instruccionesPagoProveedores
  /* const instruccionesPagoProveedores = props.instruccionesPagoProveedores; */
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;

  //comentar este useEffect
  /* useEffect(() => {
    let nuevosIds = [];
    let nuevosTipos = [];
    let nuevosProveedores = [];
    let nuevosImportes = [];
    let nuevasCuentasOrigen = [];
    let nuevasCuentasDestino = [];
    let nuevasFechas = [];
    let nuevasLlavesMatch = [];
    for (let x = 0; x < instruccionesPagoProveedores.proveedores.length; x++) {
      let pos = nuevosProveedores.indexOf(
        instruccionesPagoProveedores.proveedores[x]
      );
      if (pos === -1) {
        nuevosIds.push(instruccionesPagoProveedores.ids[x]);
        nuevosTipos.push("Pago a proveedor");
        nuevosProveedores.push(instruccionesPagoProveedores.proveedores[x]);
        nuevosImportes.push(instruccionesPagoProveedores.importes[x]);
        nuevasCuentasOrigen.push("0");
        nuevasCuentasDestino.push("0");
        nuevasFechas.push(moment().format("YYYY-MM-DD"));
        nuevasLlavesMatch.push("");
      } else {
        nuevosIds[pos] =
          nuevosIds[pos] + "," + instruccionesPagoProveedores.ids[x];
        nuevosImportes[pos] =
          nuevosImportes[pos] + instruccionesPagoProveedores.importes[x];
      }
    }
    setInstrucciones({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      importes: nuevosImportes,
      cuentasOrigen: nuevasCuentasOrigen,
      cuentasDestino: nuevasCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  }, [instruccionesPagoProveedores, setInstrucciones]); */

  const getInstrucciones = () => {
    if (instrucciones.proveedores.length > 0) {
      return (
        <TableBody>
          {instrucciones.proveedores.map((proveedor, index) => {
            /* console.log(instrucciones.rfcProveedores[index]);
            console.log(
              cuentasDestino.filter(
                (cuenta) => cuenta.RFC === instrucciones.rfcProveedores[index]
              )
            ); */
            return (
              <TableRow key={index}>
                <TableCell padding="checkbox" />
                <TableCell align="right">
                  {instrucciones.tipos[index]}
                </TableCell>
                <TableCell align="right">{proveedor}</TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"cuentaOrigen" + index}
                    variant="outlined"
                    type="text"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    inputProps={{
                      maxLength: 100,
                    }}
                    value={instrucciones.valoresCuentasOrigen[index]}
                    /* onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }} */
                    onChange={(e) => {
                      /* pasteValidation(e, 5); */

                      let nuevosIdsBancosOrigen = instrucciones.idsBancosOrigen;
                      nuevosIdsBancosOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].IdBanco
                          : 0;
                      let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                      nuevasCuentasOrigen[index] =
                        e.target.value !== "-1"
                          ? cuentasOrigen[parseInt(e.target.value)].Nombre
                          : "";
                      let nuevosValoresCuentasOrigen =
                        instrucciones.valoresCuentasOrigen;
                      nuevosValoresCuentasOrigen[index] =
                        e.target.value !== "-1" ? e.target.value : "-1";
                      setInstrucciones({
                        ...instrucciones,
                        idsBancosOrigen: nuevosIdsBancosOrigen,
                        cuentasOrigen: nuevasCuentasOrigen,
                        valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                      });
                    }}
                  >
                    <option value="-1">Seleccione una cuenta de origen</option>
                    {cuentasOrigen.length > 0
                      ? cuentasOrigen.map((cuenta, index) => (
                          <option value={index} key={index}>
                            {cuenta.Nombre}
                          </option>
                        ))
                      : null}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"cuentaDestino" + index}
                    variant="outlined"
                    type="text"
                    inputProps={{
                      maxLength: 20,
                    }}
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={instrucciones.valoresCuentasDestino[index]}
                    /* onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }} */
                    onChange={(e) => {
                      /* pasteValidation(e, 5); */

                      let nuevosIdsBancosDestino =
                        instrucciones.idsBancosDestino;
                      nuevosIdsBancosDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestino.filter(
                              (cuenta) =>
                                cuenta.RFC ===
                                instrucciones.rfcProveedores[index]
                            )[parseInt(e.target.value)].IdBanco
                          : 0;
                      let nuevasCuentasDestino = instrucciones.cuentasDestino;
                      nuevasCuentasDestino[index] =
                        e.target.value !== "-1"
                          ? cuentasDestino.filter(
                              (cuenta) =>
                                cuenta.RFC ===
                                instrucciones.rfcProveedores[index]
                            )[parseInt(e.target.value)].Layout
                          : "";
                      let nuevosValoresCuentasDestino =
                        instrucciones.valoresCuentasDestino;
                      nuevosValoresCuentasDestino[index] =
                        e.target.value !== "-1" ? e.target.value : "-1";
                      setInstrucciones({
                        ...instrucciones,
                        idsBancosDestino: nuevosIdsBancosDestino,
                        cuentasDestino: nuevasCuentasDestino,
                        valoresCuentasDestino: nuevosValoresCuentasDestino,
                      });
                    }}
                  >
                    <option value="-1">Seleccione una cuenta de destino</option>
                    {cuentasDestino.length > 0
                      ? cuentasDestino
                          .filter(
                            (cuenta) =>
                              cuenta.RFC === instrucciones.rfcProveedores[index]
                          )
                          .map((cuenta, index) => (
                            <option value={index} key={index}>
                              {cuenta.Layout}
                            </option>
                          ))
                      : null}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"fecha" + index}
                    variant="outlined"
                    type="date"
                    inputProps={{
                      maxLength: 20,
                    }}
                    value={instrucciones.fechas[index]}
                    onKeyPress={(e) => {
                      keyValidation(e, 2);
                    }}
                    onChange={(e) => {
                      let nuevasFechas = instrucciones.fechas;
                      nuevasFechas[index] = e.target.value;
                      setInstrucciones({
                        ...instrucciones,
                        fechas: nuevasFechas,
                      });
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  ${number_format(instrucciones.importes[index], 2, ".", ",")}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    className={classes.textFields}
                    id={"llavesMatch" + index}
                    variant="outlined"
                    type="text"
                    value={instrucciones.llavesMatch[index]}
                    disabled
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell align="right">Sin Instrucciones</TableCell>
          </TableRow>
        </TableBody>
      );
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell align="right">
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Llave Match</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              {getInstrucciones()}
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}

function Paso3(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const correoUsuario = props.correo;
  const passwordUsuario = props.password;
  const setLoading = props.setLoading;
  const rfcEmpresa = props.rfc;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const instrucciones = props.instrucciones;
  //const setInstrucciones = props.setInstrucciones;
  const instruccionesAdicionales = props.instruccionesAdicionales;
  const setInstruccionesAdicionales = props.setInstruccionesAdicionales;
  const proveedores = props.proveedores;
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;
  const disponible = props.disponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  const setRestante = props.setRestante;
  /* const proveedorAutocomplete = props.proveedorAutocomplete;
  const setProveedorAutocomplete = props.setProveedorAutocomplete; */
  const [tipoDocumento, setTipoDocumento] = useState("Anticipo a proveedores");
  const [openDialogInstrucciones, setOpenDialogInstrucciones] = useState(false);
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [importeAntiguo, setImporteAntiguo] = useState(0.0);
  const [
    {
      data: traerFlujosEfectivoFiltradosData,
      loading: traerFlujosEfectivoFiltradosLoading,
      error: traerFlujosEfectivoFiltradosError,
    },
    executeTraerFlujosEfectivoFiltrados,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerFlujosEfectivoFiltrados`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (traerFlujosEfectivoFiltradosData) {
        if (traerFlujosEfectivoFiltradosData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerFlujosEfectivoFiltradosData.error)}
            </Typography>
          );
        } else {
          setFlujosEfectivoFiltrados(
            traerFlujosEfectivoFiltradosData.flujosefectivo
          );
          let total = 0;
          for (
            let x = 0;
            x < traerFlujosEfectivoFiltradosData.flujosefectivo.length;
            x++
          ) {
            total =
              total +
              parseFloat(
                traerFlujosEfectivoFiltradosData.flujosefectivo[x].Pendiente
              );
          }
          setTotalEspecificos(total);
        }
      }
    }

    checkData();
  }, [traerFlujosEfectivoFiltradosData]);

  if (traerFlujosEfectivoFiltradosLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (traerFlujosEfectivoFiltradosError) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenDialogInstrucciones = () => {
    setOpenDialogInstrucciones(true);
  };

  const handleCloseDialogInstrucciones = () => {
    setOpenDialogInstrucciones(false);
  };

  const getInstrucciones = () => {
    if (instrucciones.proveedores.length > 0) {
      return instrucciones.proveedores.map((proveedor, index) => {
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell align="right">{instrucciones.tipos[index]}</TableCell>
            <TableCell align="right">{proveedor}</TableCell>
            <TableCell align="right">
              {/* <TextField
                className={classes.textFields}
                id={"cuentaOrigen" + index}
                variant="outlined"
                type="text"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.cuentasOrigen[index]}
              /> */}
              {instrucciones.cuentasOrigen[index]}
            </TableCell>
            <TableCell align="right">
              {/* <TextField
                className={classes.textFields}
                id={"cuentaDestino" + index}
                variant="outlined"
                type="text"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.cuentasDestino[index]}
              /> */}
              {instrucciones.cuentasDestino[index]}
            </TableCell>
            <TableCell align="right">
              {/* <TextField
                className={classes.textFields}
                id={"fecha" + index}
                variant="outlined"
                type="date"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.fechas[index]}
              /> */}
              {instrucciones.fechas[index]}
            </TableCell>
            <TableCell align="right">
              ${number_format(instrucciones.importes[index], 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              {/* <TextField
                className={classes.textFields}
                id={"llavesMatch" + index}
                disabled
                variant="outlined"
                type="text"
              /> */}
              ---
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Ver Documentos">
                <IconButton
                  onClick={() => {
                    obtenerDocumentosPorPago(proveedor);
                  }}
                >
                  <FindInPageIcon color="primary" />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title="Quitar">
                <IconButton
                  onClick={() => {
                    let nuevosIds = instrucciones.ids;
                    let nuevosTipos = instrucciones.tipos;
                    let nuevosProveedores = instrucciones.proveedores;
                    let nuevosImportes = instrucciones.importes;
                    let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                    let nuevasCuentasDestino = instrucciones.cuentasDestino;
                    let nuevasFechas = instrucciones.fechas;
                    let nuevasLlavesMatch = instrucciones.llavesMatch;
                    nuevosIds.splice(index, 1);
                    nuevosTipos.splice(index, 1);
                    nuevosProveedores.splice(index, 1);
                    nuevosImportes.splice(index, 1);
                    nuevasCuentasOrigen.splice(index, 1);
                    nuevasCuentasDestino.splice(index, 1);
                    nuevasFechas.splice(index, 1);
                    nuevasLlavesMatch.splice(index, 1);
                    setInstrucciones({
                      ids: nuevosIds,
                      tipos: nuevosTipos,
                      proveedores: nuevosProveedores,
                      importes: nuevosImportes,
                      cuentasOrigen: nuevasCuentasOrigen,
                      cuentasDestino: nuevasCuentasDestino,
                      fechas: nuevasFechas,
                      llavesMatch: nuevasLlavesMatch,
                    });
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip> */}
            </TableCell>
          </TableRow>
        );
      });
    } else if (instruccionesAdicionales.proveedores.length === 0) {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell align="right" colSpan="7" style={{ textAlign: "center" }}>
            Sin Instrucciones
          </TableCell>
        </TableRow>
      );
    }
  };

  const obtenerDocumentosPorPago = (proveedor) => {
    const pos = [];
    for (let x = 0; x < instruccionesPagoProveedores.proveedores.length; x++) {
      if (instruccionesPagoProveedores.proveedores[x] === proveedor) {
        pos.push(x);
      }
    }
    let nuevosIds = [];
    let nuevosProveedores = [];
    let nuevosImportes = [];
    for (let x = 0; x < pos.length; x++) {
      nuevosIds.push(instruccionesPagoProveedores.ids[pos[x]]);
      nuevosProveedores.push(instruccionesPagoProveedores.proveedores[pos[x]]);
      nuevosImportes.push(instruccionesPagoProveedores.importes[pos[x]]);
    }

    executeTraerFlujosEfectivoFiltrados({
      data: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: 46,
        forma: 4,
        ids: nuevosIds,
        filtro: 1,
      },
    });
    handleClickOpenDialogInstrucciones();
  };

  const getFlujosEfectivoFiltrados = () => {
    if (flujosEfectivoFiltrados.length > 0) {
      return flujosEfectivoFiltrados.map((flujoEfectivo, index) => {
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell component="th" scope="row">
              {flujoEfectivo.IdDoc}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.Vence}</TableCell>
            <TableCell align="right">
              ${number_format(flujoEfectivo.Pendiente, 2, ".", ",")}
            </TableCell>
            <TableCell align="right">{flujoEfectivo.Suc}</TableCell>
            <TableCell align="right">{flujoEfectivo.cRFC}</TableCell>
          </TableRow>
        );
      });
    } else {
      return (
        <TableRow>
          <TableCell padding="checkbox" />
          <TableCell colSpan={5}>Sin Documentos</TableCell>
        </TableRow>
      );
    }
  };

  const getInstruccionesPago = () => {
    if (instruccionesAdicionales.proveedores.length > 0) {
      return instruccionesAdicionales.proveedores.map((proveedor, index) => {
        /* console.log(instruccionesAdicionales.rfcProveedores[index]);
        console.log(cuentasDestino.filter(cuenta => cuenta.RFC === instruccionesAdicionales.rfcProveedores[index])); */
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox" />
            <TableCell align="right">
              {instruccionesAdicionales.tipos[index]}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                id={"paso3Proveedor" + index}
                variant="outlined"
                type="text"
                /* inputProps={{
                  maxLength: 100,
                }} */
                value={instruccionesAdicionales.valoresProveedores[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 3);
                }} */
                onChange={(e) => {
                  /* pasteValidation(e, 3); */
                  let nuevosProveedores = instruccionesAdicionales.proveedores;
                  nuevosProveedores[index] =
                    e.target.value !== "-1"
                      ? proveedores[parseInt(e.target.value)].razonsocial
                      : "";
                  let nuevosRfcProveedores =
                    instruccionesAdicionales.rfcProveedores;
                  nuevosRfcProveedores[index] =
                    e.target.value !== "-1"
                      ? proveedores[parseInt(e.target.value)].rfc
                      : "";
                  let nuevosValoresProveedores =
                    instruccionesAdicionales.valoresProveedores;
                  nuevosValoresProveedores[index] =
                    e.target.value !== "-1" ? parseInt(e.target.value) : "-1";
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    proveedores: nuevosProveedores,
                    rfcProveedores: nuevosRfcProveedores,
                    valoresProveedores: nuevosValoresProveedores,
                  });
                }}
              >
                <option value="-1">Seleccione un proveedor</option>
                {proveedores.length > 0
                  ? proveedores.map((proveedor, index) => {
                      return (
                        <option value={index} key={index}>
                          {`${proveedor.razonsocial} (${proveedor.rfc})`}
                        </option>
                      );
                    })
                  : null}
                {/* <option value="proveedor1">Proveedor 1</option>
                <option value="proveedor2">Proveedor 2</option>
                <option value="proveedor3">Proveedor 3</option> */}
              </TextField>
              {/* <Autocomplete
                options={proveedores}
                getOptionLabel={(option) =>
                  `${option.rfc}-${option.razonsocial}`
                }
                id="autocomplete2"
                inputValue={proveedorAutocomplete}
                onInputChange={(e, value) => {
                  console.log(value);
                  setProveedorAutocomplete(value);
                  const separacion = value.split("-");
                  let nombreLargo = "0";
                  if (separacion.length === 2) {
                    nombreLargo = separacion[1];
                  }
                  let nuevosProveedores = instruccionesAdicionales.proveedores;
                  nuevosProveedores[index] = nombreLargo;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    proveedores: nuevosProveedores,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id={"paso3Proveedor" + index}
                    style={{ width: "100%" }}
                    value={instruccionesAdicionales.proveedores[index]}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      console.log(e.target.value);
                      pasteValidation(e, 5);
                    }}
                    label="Proveedor"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              /> */}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"paso3CuentaOrigen" + index}
                variant="outlined"
                type="text"
                select
                SelectProps={{
                  native: true,
                }}
                inputProps={{
                  maxLength: 20,
                }}
                value={instruccionesAdicionales.valoresCuentasOrigen[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 5);
                }} */
                onChange={(e) => {
                  /* pasteValidation(e, 5); */
                  //no pone el valor en el combo. Aqui me quede

                  let nuevosIdsBancosOrigen =
                    instruccionesAdicionales.idsBancosOrigen;
                  nuevosIdsBancosOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].IdBanco
                      : 0;
                  let nuevasCuentasOrigen =
                    instruccionesAdicionales.cuentasOrigen;
                  nuevasCuentasOrigen[index] =
                    e.target.value !== "-1"
                      ? cuentasOrigen[parseInt(e.target.value)].Nombre
                      : "";
                  let nuevosValoresCuentasOrigen =
                    instruccionesAdicionales.valoresCuentasOrigen;
                  nuevosValoresCuentasOrigen[index] =
                    e.target.value !== "-1" ? e.target.value : "-1";

                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    idsBancosOrigen: nuevosIdsBancosOrigen,
                    cuentasOrigen: nuevasCuentasOrigen,
                    valoresCuentasOrigen: nuevosValoresCuentasOrigen,
                  });

                  /* let nuevasCuentasOrigen =
                    instruccionesAdicionales.cuentasOrigen;
                  nuevasCuentasOrigen[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    cuentasOrigen: nuevasCuentasOrigen,
                  }); */
                }}
              >
                <option value="-1">Seleccione una cuenta de origen</option>
                {cuentasOrigen.length > 0
                  ? cuentasOrigen.map((cuenta, index) => (
                      <option value={index} key={index}>
                        {cuenta.Nombre}
                      </option>
                    ))
                  : null}
              </TextField>
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"paso3CuentaDestino" + index}
                variant="outlined"
                type="text"
                select
                SelectProps={{
                  native: true,
                }}
                inputProps={{
                  maxLength: 20,
                }}
                value={instruccionesAdicionales.valoresCuentasDestino[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 5);
                }} */
                onChange={(e) => {
                  /* pasteValidation(e, 5); */

                  let nuevosIdsBancosDestino =
                    instruccionesAdicionales.idsBancosDestino;
                  nuevosIdsBancosDestino[index] =
                    e.target.value !== "-1"
                      ? cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC ===
                            instruccionesAdicionales.rfcProveedores[index]
                        )[parseInt(e.target.value)].IdBanco
                      : 0;
                  let nuevasCuentasDestino =
                    instruccionesAdicionales.cuentasDestino;
                  nuevasCuentasDestino[index] =
                    e.target.value !== "-1"
                      ? cuentasDestino.filter(
                          (cuenta) =>
                            cuenta.RFC ===
                            instruccionesAdicionales.rfcProveedores[index]
                        )[parseInt(e.target.value)].Layout
                      : "";
                  let nuevosValoresCuentasDestino =
                    instruccionesAdicionales.valoresCuentasDestino;
                  nuevosValoresCuentasDestino[index] =
                    e.target.value !== "-1" ? e.target.value : "-1";

                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    idsBancosDestino: nuevosIdsBancosDestino,
                    cuentasDestino: nuevasCuentasDestino,
                    valoresCuentasDestino: nuevosValoresCuentasDestino,
                  });
                }}
              >
                <option value="-1">Seleccione una cuenta de destino</option>
                {cuentasDestino.length > 0
                  ? cuentasDestino
                      .filter(
                        (cuenta) =>
                          cuenta.RFC ===
                          instruccionesAdicionales.rfcProveedores[index]
                      )
                      .map((cuenta, index) => (
                        <option value={index} key={index}>
                          {cuenta.Layout}
                        </option>
                      ))
                  : null}
              </TextField>
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"paso3Fecha" + index}
                variant="outlined"
                type="date"
                value={instruccionesAdicionales.fechas[index]}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  let nuevasFechas = instruccionesAdicionales.fechas;
                  nuevasFechas[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    fechas: nuevasFechas,
                  });
                }}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"paso3CImporte" + index}
                variant="outlined"
                type="text"
                inputProps={{
                  maxLength: 20,
                }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                value={instruccionesAdicionales.importes[index]}
                onKeyPress={(e) => {
                  doubleKeyValidation(e, 2);
                }}
                onFocus={(e) => {
                  const valor = e.target.value
                    .replace("$", "")
                    .replace(",", "");
                  setImporteAntiguo(parseFloat(valor));
                }}
                onChange={(e) => {
                  let nuevosImportes = instruccionesAdicionales.importes;
                  nuevosImportes[index] =
                    typeof e.target.value !== "undefined" ? e.target.value : 0;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    importes: nuevosImportes,
                  });

                  if (typeof e.target.value !== "undefined") {
                    if (parseFloat(e.target.value) > importeAntiguo) {
                      setAplicado(
                        aplicado + (parseFloat(e.target.value) - importeAntiguo)
                      );
                      setRestante(
                        disponible -
                          (aplicado +
                            (parseFloat(e.target.value) - importeAntiguo))
                      );
                    } else if (parseFloat(e.target.value) < importeAntiguo) {
                      setAplicado(
                        aplicado - (importeAntiguo - parseFloat(e.target.value))
                      );
                      setRestante(
                        disponible -
                          (aplicado -
                            (importeAntiguo - parseFloat(e.target.value)))
                      );
                    }
                    setImporteAntiguo(parseFloat(e.target.value));
                  }
                }}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"paso3LlavesMatch" + index}
                variant="outlined"
                type="text"
                disabled
              />
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Quitar">
                <IconButton
                  onClick={() => {
                    quitarInstruccionesPago(index);
                  }}
                >
                  <CloseIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  const agregarInstruccionesPago = () => {
    let nuevosIds = instruccionesAdicionales.ids;
    let nuevosTipos = instruccionesAdicionales.tipos;
    let nuevosProveedores = instruccionesAdicionales.proveedores;
    let nuevosRfcProveedores = instruccionesAdicionales.rfcProveedores;
    let nuevosValoresProveedores = instruccionesAdicionales.valoresProveedores;
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevosIdsBancosOrigen = instruccionesAdicionales.idsBancosOrigen;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevosValoresCuentasOrigen =
      instruccionesAdicionales.valoresCuentasOrigen;
    let nuevosIdsBancosDestino = instruccionesAdicionales.idsBancosDestino;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevosValoresCuentasDestino =
      instruccionesAdicionales.valoresCuentasDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    nuevosIds.push(1);
    nuevosTipos.push(tipoDocumento);
    nuevosProveedores.push("-1");
    nuevosRfcProveedores.push("");
    nuevosValoresProveedores.push("-1");
    nuevosImportes.push(0.0);
    nuevosIdsBancosOrigen.push(0);
    nuevasCuentasOrigen.push("0");
    nuevosValoresCuentasOrigen.push("-1");
    nuevosIdsBancosDestino.push(0);
    nuevasCuentasDestino.push("0");
    nuevosValoresCuentasDestino.push("-1");
    nuevasFechas.push(moment().format("YYYY-MM-DD"));
    nuevasLlavesMatch.push("");
    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      rfcProveedores: nuevosRfcProveedores,
      valoresProveedores: nuevosValoresProveedores,
      importes: nuevosImportes,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      valoresCuentasOrigen: nuevosValoresCuentasOrigen,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      valoresCuentasDestino: nuevosValoresCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  };

  const quitarInstruccionesPago = (pos) => {
    let nuevosIds = instruccionesAdicionales.ids;
    let nuevosTipos = instruccionesAdicionales.tipos;
    let nuevosProveedores = instruccionesAdicionales.proveedores;
    let nuevosRfcProveedores = instruccionesAdicionales.rfcProveedores;
    let nuevosValoresProveedores = instruccionesAdicionales.valoresProveedores;
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevosIdsBancosOrigen = instruccionesAdicionales.idsBancosOrigen;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevosValoresCuentasOrigen =
      instruccionesAdicionales.valoresCuentasOrigen;
    let nuevosIdsBancosDestino = instruccionesAdicionales.idsBancosDestino;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevosValoresCuentasDestino =
      instruccionesAdicionales.valoresCuentasDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    nuevosIds.splice(pos, 1);
    nuevosTipos.splice(pos, 1);
    nuevosProveedores.splice(pos, 1);
    nuevosRfcProveedores.splice(pos, 1);
    nuevosValoresProveedores.splice(pos, 1);
    nuevosImportes.splice(pos, 1);
    nuevosIdsBancosOrigen.splice(pos, 1);
    nuevasCuentasOrigen.splice(pos, 1);
    nuevosValoresCuentasOrigen.splice(pos, 1);
    nuevosIdsBancosDestino.splice(pos, 1);
    nuevasCuentasDestino.splice(pos, 1);
    nuevosValoresCuentasDestino.splice(pos, 1);
    nuevasFechas.splice(pos, 1);
    nuevasLlavesMatch.splice(pos, 1);
    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      rfcProveedores: nuevosRfcProveedores,
      valoresProveedores: nuevosValoresProveedores,
      importes: nuevosImportes,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      valoresCuentasOrigen: nuevosValoresCuentasOrigen,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      valoresCuentasDestino: nuevosValoresCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={8} md={4}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Sucursales"
                type="text"
                value={tipoDocumento}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onChange={(e) => {
                  setTipoDocumento(e.target.value);
                }}
              >
                <option value="Anticipo a proveedores">
                  Anticipo a proveedores
                </option>
                <option value="Pago a prestamos a acreedores">
                  Pago a prestamos a acreedores
                </option>
                <option value="Entrega de prestamos a deudores">
                  Entrega de prestamos a deudores
                </option>
              </TextField>
            </Grid>
            <Grid item xs={4} md={2} style={{ alignSelf: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  agregarInstruccionesPago();
                }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell align="right">
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Llave Match</strong>
                  </TableCell>
                  <TableCell align="center">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getInstrucciones()}
                {getInstruccionesPago()}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogInstrucciones}
        onClose={handleCloseDialogInstrucciones}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Documentos Relacionados
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>#Doc</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Vencimiento</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Pendiente</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Sucursal</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>RFC</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFlujosEfectivoFiltrados()}
                <TableRow>
                  <TableCell colSpan="4" />
                  <TableCell align="right">
                    <strong>Total Pendiente: </strong>
                  </TableCell>
                  <TableCell align="right">
                    ${number_format(totalEspecificos, 2, ".", ",")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogInstrucciones}
            variant="contained"
            color="secondary"
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

function Paso4(props) {
  const classes = useStyles();
  const instruccionesCombinadas = props.instruccionesCombinadas;
  //console.log(instruccionesCombinadas);
  const [informacionBancos, setInformacionBancos] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    importes: [],
    idsBancosOrigen: [],
    cuentasOrigen: [],
    idsBancosDestino: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });

  useEffect(() => {
    let nuevosIds = [];
    let nuevosTipos = [];
    let nuevosProveedores = [];
    let nuevosImportes = [];
    let nuevosIdsBancosOrigen = [];
    let nuevasCuentasOrigen = [];
    let nuevosIdsBancosDestino = [];
    let nuevasCuentasDestino = [];
    let nuevasFechas = [];
    let nuevasLlavesMatch = [];

    /* function verExistencia(cuentaOrigen, cuentaDestino, proveedor) {
      let pos = -1;
      for (let x = 0; x < nuevasCuentasOrigen.length; x++) {
        if (
          nuevasCuentasOrigen[x] === cuentaOrigen &&
          nuevasCuentasDestino[x] === cuentaDestino &&
          nuevosProveedores[x] === proveedor
        ) {
          pos = x;
          break;
        }
      }
      return pos;
    } */

    function verExistencia(idBancoOrigen, idBancoDestino, proveedor) {
      let pos = -1;
      for (let x = 0; x < nuevasCuentasOrigen.length; x++) {
        if (
          nuevosIdsBancosOrigen[x] === idBancoOrigen &&
          nuevosIdsBancosDestino[x] === idBancoDestino &&
          nuevosProveedores[x] === proveedor
        ) {
          pos = x;
          break;
        }
      }
      return pos;
    }

    for (let x = 0; x < instruccionesCombinadas.idsBancosOrigen.length; x++) {
      /* let pos = verExistencia(
        instruccionesCombinadas.cuentasOrigen[x],
        instruccionesCombinadas.cuentasDestino[x],
        instruccionesCombinadas.proveedores[x]
      ); */
      let pos = verExistencia(
        instruccionesCombinadas.idsBancosOrigen[x],
        instruccionesCombinadas.idsBancosDestino[x],
        instruccionesCombinadas.proveedores[x]
      );
      if (pos === -1) {
        nuevosIds.push(instruccionesCombinadas.ids[x]);
        nuevosTipos.push(instruccionesCombinadas.tipos[x]);
        nuevosProveedores.push(instruccionesCombinadas.proveedores[x]);
        nuevosImportes.push(parseFloat(instruccionesCombinadas.importes[x]));
        nuevosIdsBancosOrigen.push(instruccionesCombinadas.idsBancosOrigen[x]);
        nuevasCuentasOrigen.push(instruccionesCombinadas.cuentasOrigen[x]);
        nuevosIdsBancosDestino.push(
          instruccionesCombinadas.idsBancosDestino[x]
        );
        nuevasCuentasDestino.push(instruccionesCombinadas.cuentasDestino[x]);
        nuevasFechas.push(instruccionesCombinadas.fechas[x]);
        nuevasLlavesMatch.push(instruccionesCombinadas.llavesMatch[x]);
      } else {
        nuevosIds[pos] = nuevosIds[pos] + "," + instruccionesCombinadas.ids[x];
        nuevosImportes[pos] =
          nuevosImportes[pos] + instruccionesCombinadas.importes[x];
        if (nuevasFechas[pos] !== instruccionesCombinadas.fechas[x]) {
          nuevasFechas[pos] =
            nuevasFechas[pos] + ", " + instruccionesCombinadas.fechas[x];
        }
      }
    }
    setInformacionBancos({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      importes: nuevosImportes,
      idsBancosOrigen: nuevosIdsBancosOrigen,
      cuentasOrigen: nuevasCuentasOrigen,
      idsBancosDestino: nuevosIdsBancosDestino,
      cuentasDestino: nuevasCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  }, [instruccionesCombinadas]);

  const getInformacionBancos = () => {
    if (informacionBancos.cuentasOrigen.length > 0) {
      console.log(informacionBancos);
      return informacionBancos.cuentasOrigen.map((cuentaOrigen, index) => {
        return (
          <TableRow key={index}>
            <TableCell padding="checkbox">
              <Checkbox color="primary" />
            </TableCell>
            <TableCell align="left">{informacionBancos.tipos[index]}</TableCell>
            <TableCell align="right">
              {informacionBancos.proveedores[index]}
            </TableCell>
            <TableCell align="right">{cuentaOrigen}</TableCell>
            <TableCell align="right">
              {informacionBancos.cuentasDestino[index].slice(0, -5)}
            </TableCell>
            <TableCell align="right">
              ${number_format(informacionBancos.importes[index], 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              {informacionBancos.fechas[index]}
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Descargar">
                <IconButton>
                  <GetAppIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ver Documentos">
                <IconButton>
                  <FindInPageIcon color="primary" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Descargar Seleccionados
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead style={{ background: "#FAFAFA" }}>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>
                    <strong>Tipo</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Proveedor</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Cuenta Origen</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Banco Destino</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Importe</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell align="right">
                    <SettingsIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{getInformacionBancos()}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
