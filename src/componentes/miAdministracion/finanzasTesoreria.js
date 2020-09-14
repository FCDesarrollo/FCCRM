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
  ListItemIcon,
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
  const correoUsuario = usuarioDatos.correo;
  const passwordUsuario = usuarioDatos.password;
  const setLoading = props.setLoading;
  const empresaDatos = props.empresaDatos;
  const rfcEmpresa = empresaDatos.RFC;
  const [showComponent, setShowComponent] = useState(0);
  const [nombreSubmenu, setNombreSubmenu] = useState("");
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState([]);
  const [coordenada1, setCoordenada1] = useState(0);
  const [coordenada2, setCoordenada2] = useState(0);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState([]);
  const [disponible, setDisponible] = useState(10000);
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
    importes: [],
    cuentasOrigen: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    importes: [],
    cuentasOrigen: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const [instruccionesCombinadas, setInstruccionesCombinadas] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    importes: [],
    cuentasOrigen: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });
  const steps = [
    "1. Indicar el Efectivo Disponible y Aplicación  de Pagos",
    "2. Completar instrucciones de Pago",
    "3. Adicionar instrucciones de Pago sin CxP previa",
    "4. Generacion de Layout para Portales Bancarios",
  ];
  const cuentasOrigen = ["Bancomer", "Banamex", "Banorte", "HSBC", "Santander"];
  const cuentasDestino = [
    "Bancomer",
    "Banamex",
    "Banorte",
    "HSBC",
    "Santander",
  ];

  const handleNext = () => {
    let validacionPaso2 = 0;
    let validacionPaso3 = 0;
    if (activeStep === 1) {
      for (let x = 0; x < instrucciones.proveedores.length; x++) {
        if (
          instrucciones.cuentasOrigen[x] === "0" ||
          instrucciones.cuentasDestino[x] === "0" ||
          instrucciones.fechas[x] === ""
        ) {
          validacionPaso2++;
          break;
        }
      }
    } else if (activeStep === 2) {
      console.log(instrucciones);
      console.log(instruccionesAdicionales);
      let ids = instrucciones.ids.concat(instruccionesAdicionales.ids);
      let tipos = instrucciones.tipos.concat(instruccionesAdicionales.tipos);
      let proveedores = instrucciones.proveedores.concat(
        instruccionesAdicionales.proveedores
      );
      let importes = instrucciones.importes.concat(
        instruccionesAdicionales.importes
      );
      let cuentasOrigen = instrucciones.cuentasOrigen.concat(
        instruccionesAdicionales.cuentasOrigen
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
        cuentasOrigen: cuentasOrigen,
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
      for (let x = 0; x < instruccionesAdicionales.proveedores.length; x++) {
        if (
          instruccionesAdicionales.proveedores[x] === "0" ||
          instruccionesAdicionales.cuentasOrigen[x] === "0" ||
          instruccionesAdicionales.cuentasDestino[x] === "0" ||
          instruccionesAdicionales.fechas[x] === "" ||
          instruccionesAdicionales.importes[x] === "" ||
          parseFloat(instruccionesAdicionales.importes[x]) === "0"
        ) {
          validacionPaso3++;
          break;
        }
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
            correo={correoUsuario}
            password={passwordUsuario}
            setLoading={setLoading}
            rfc={rfcEmpresa}
            documentosSeleccionados={documentosSeleccionados}
            setDocumentosSeleccionados={setDocumentosSeleccionados}
            coordenada1={coordenada1}
            setCoordenada1={setCoordenada1}
            coordenada2={coordenada2}
            setCoordenada2={setCoordenada2}
            coordenadasSeleccionadas={coordenadasSeleccionadas}
            setCoordenadasSeleccionadas={setCoordenadasSeleccionadas}
            disponible={disponible}
            setDisponible={setDisponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            restante={restante}
            setRestante={setRestante}
            instruccionesPagoProveedores={instruccionesPagoProveedores}
            setInstruccionesPagoProveedores={setInstruccionesPagoProveedores}
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
            cuentasOrigen={cuentasOrigen}
            cuentasDestino={cuentasDestino}
            disponible={disponible}
            aplicado={aplicado}
            setAplicado={setAplicado}
            setRestante={setRestante}
          />
        );
      case 3:
        return <Paso4 instruccionesCombinadas={instruccionesCombinadas} />;
      default:
        return "Unknown stepIndex";
    }
  };

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
                    setNombreSubmenu(content.submenu.nombre_submenu);
                    setShowComponent(1);
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
          <div style={{ padding: "15px" }}>
            <Toolbar>
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={8}
                  sm={6}
                  md={6}
                  style={{ alignSelf: "flex-end" }}
                >
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
                    {nombreSubmenu}
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1
                        ? "Finalizar"
                        : "Siguiente"}
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
                          <span>{` $${number_format(
                            aplicado,
                            2,
                            ".",
                            ","
                          )}`}</span>
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
        ) : null}
      </Card>
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
  const correoUsuario = props.correo;
  const passwordUsuario = props.password;
  const setLoading = props.setLoading;
  const rfcEmpresa = props.rfc;
  const documentosSeleccionados = props.documentosSeleccionados;
  const setDocumentosSeleccionados = props.setDocumentosSeleccionados;
  const coordenada1 = props.coordenada1;
  const setCoordenada1 = props.setCoordenada1;
  const coordenada2 = props.coordenada2;
  const setCoordenada2 = props.setCoordenada2;
  const coordenadasSeleccionadas = props.coordenadasSeleccionadas;
  const setCoordenadasSeleccionadas = props.setCoordenadasSeleccionadas;
  const disponible = props.disponible;
  //const setDisponible = props.setDisponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  const restante = props.restante;
  const setRestante = props.setRestante;
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const setInstruccionesPagoProveedores = props.setInstruccionesPagoProveedores;
  const [flujosEfectivo, setFlujosEfectivo] = useState([]);
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [pendiente, setPendiente] = useState(0.0);
  const [openPrioritariosDialog, setOpenPrioritariosDialog] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresPrioritarios, setProveedoresPrioritarios] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
  const [tituloFlujosFiltrados, setTituloFlujosFiltrados] = useState("");
  const [showTable, setShowTable] = useState(1);
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
      data: traerProveedoresData,
      loading: traerProveedoresLoading,
      error: traerProveedoresError,
    },
    executeTraerProveedores,
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerProveedores`,
      method: "GET",
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
      if (traerProveedoresData) {
        if (traerProveedoresData.error !== 0) {
          return (
            <Typography variant="h5">
              {dataBaseErrores(traerProveedoresData.error)}
            </Typography>
          );
        } else {
          setProveedores(traerProveedoresData.proveedores);
        }
      }
    }

    checkData();
  }, [traerProveedoresData]);

  if (
    traerFlujosEfectivoLoading ||
    traerFlujosEfectivoFiltradosLoading ||
    traerProveedoresLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    traerFlujosEfectivoError ||
    traerFlujosEfectivoFiltradosError ||
    traerProveedoresError
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
        if (!filas.includes(flujosEfectivo[x].Razon)) {
          filas.push(flujosEfectivo[x].Razon);
        }
      }

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
              flujosEfectivo[z].Razon === filas[x]
            ) {
              pendientes[x][y] = flujosEfectivo[z].Pendiente;
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
                    return (
                      <TableCell
                        align="right"
                        key={index2}
                        style={{
                          cursor: "pointer",
                          background:
                            coordenadasSeleccionadas.indexOf(
                              `${index},${index2}`
                            ) !== -1
                              ? "#388e3c"
                              : "",
                        }}
                        onClick={() => {
                          setCoordenada1(index);
                          setCoordenada2(index2);
                          executeTraerFlujosEfectivoFiltrados({
                            data: {
                              usuario: correoUsuario,
                              pwd: passwordUsuario,
                              rfc: rfcEmpresa,
                              idsubmenu: 46,
                              forma: 3,
                              razon: filas[index],
                              tipo: columnas[index2],
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
      return <Typography variant="h6">Sin Datos</Typography>;
    }
  };

  const handleToggleDocumentosEspecificos = (value) => () => {
    const currentIndex = documentosSeleccionados.indexOf(value);
    const currentIndexCoordenadas = coordenadasSeleccionadas.indexOf(
      `${coordenada1},${coordenada2}`
    );
    const newChecked = [...documentosSeleccionados];
    const newCoordenadas = [...coordenadasSeleccionadas];

    if (currentIndex === -1) {
      newChecked.push(value);
      newCoordenadas.push(`${coordenada1},${coordenada2}`);
    } else {
      newChecked.splice(currentIndex, 1);
      newCoordenadas.splice(currentIndexCoordenadas, 1);
    }

    setDocumentosSeleccionados(newChecked);
    setCoordenadasSeleccionadas(newCoordenadas);
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
                  if (e.target.checked) {
                    setAplicado(aplicado + parseFloat(flujoEfectivo.Pendiente));
                    setRestante(
                      disponible -
                        (aplicado + parseFloat(flujoEfectivo.Pendiente))
                    );

                    let ids = instruccionesPagoProveedores.ids;
                    let proveedores = instruccionesPagoProveedores.proveedores;
                    let importes = instruccionesPagoProveedores.importes;
                    //let pos = proveedores.indexOf(flujoEfectivo.Razon);
                    ids.push(flujoEfectivo.id);
                    proveedores.push(flujoEfectivo.Razon);
                    importes.push(parseFloat(flujoEfectivo.Pendiente));
                    /* ids.push(flujoEfectivo.id);
                    if(pos === -1) {
                      proveedores.push(flujoEfectivo.Razon);
                      importes.push(parseFloat(flujoEfectivo.Pendiente));
                    }
                    else {
                      importes[pos] = parseFloat(importes[pos]) + parseFloat(flujoEfectivo.Pendiente);
                    } */
                    setInstruccionesPagoProveedores({
                      ids: ids,
                      proveedores: proveedores,
                      importes: importes,
                    });
                  } else {
                    setAplicado(aplicado - parseFloat(flujoEfectivo.Pendiente));
                    setRestante(restante + parseFloat(flujoEfectivo.Pendiente));

                    let ids = instruccionesPagoProveedores.ids;
                    let proveedores = instruccionesPagoProveedores.proveedores;
                    let importes = instruccionesPagoProveedores.importes;
                    let pos = ids.indexOf(flujoEfectivo.id);
                    ids.splice(pos, 1);
                    proveedores.splice(pos, 1);
                    importes.splice(pos, 1);
                    setInstruccionesPagoProveedores({
                      ids: ids,
                      proveedores: proveedores,
                      importes: importes,
                    });
                  }
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
            <Grid item xs={12} md={2} style={{ alignSelf: "flex-end" }}>
              <FormControlLabel
                control={<Checkbox name="soloPrioritarios" color="primary" />}
                label="Solo Prioritarios"
              />
            </Grid>
            <Grid item xs={8} md={2} style={{ alignSelf: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  executeTraerProveedores({
                    params: {
                      usuario: correoUsuario,
                      pwd: passwordUsuario,
                      rfc: rfcEmpresa,
                      idsubmenu: 46,
                    },
                  });
                  handleClickOpenPrioritariosDialog();
                }}
              >
                ...
              </Button>
            </Grid>
            <Grid item xs={4} md={2}>
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
              >
                Consultar
              </Button>
            </Grid>
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
                options={proveedores}
                getOptionLabel={(option) =>
                  `${option.rfc}-${option.razonsocial}`
                }
                id="debug"
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
                    label="RFC"
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
                  setProveedoresPrioritarios([]); //esto se remplazara por la llamada a la api que convertira en prioritario el proveedor escojido
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
                      <ListItem button>
                        <ListItemText
                          primary={proveedor.rfc}
                          secondary={proveedor.razonsocial}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete">
                            <CloseIcon color="secondary" />
                          </IconButton>
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
  const instruccionesPagoProveedores = props.instruccionesPagoProveedores;
  const instrucciones = props.instrucciones;
  const setInstrucciones = props.setInstrucciones;
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;

  useEffect(() => {
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
  }, [instruccionesPagoProveedores, setInstrucciones]);

  const getInstrucciones = () => {
    if (instrucciones.proveedores.length > 0) {
      return (
        <TableBody>
          {instrucciones.proveedores.map((proveedor, index) => {
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
                      maxLength: 20,
                    }}
                    value={instrucciones.cuentasOrigen[index]}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 5);
                      let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                      nuevasCuentasOrigen[index] = e.target.value;
                      setInstrucciones({
                        ...instrucciones,
                        cuentasOrigen: nuevasCuentasOrigen,
                      });
                    }}
                  >
                    <option value="0">Seleccione una cuenta de origen</option>
                    {cuentasOrigen.map((cuenta, index) => (
                      <option value={cuenta} key={index}>
                        {cuenta}
                      </option>
                    ))}
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
                    value={instrucciones.cuentasDestino[index]}
                    onKeyPress={(e) => {
                      keyValidation(e, 5);
                    }}
                    onChange={(e) => {
                      pasteValidation(e, 5);
                      let nuevasCuentasDestino = instrucciones.cuentasDestino;
                      nuevasCuentasDestino[index] = e.target.value;
                      setInstrucciones({
                        ...instrucciones,
                        cuentasDestino: nuevasCuentasDestino,
                      });
                    }}
                  >
                    <option value="0">Seleccione una cuenta de destino</option>
                    {cuentasDestino.map((cuenta, index) => (
                      <option value={cuenta} key={index}>
                        {cuenta}
                      </option>
                    ))}
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
                    <strong>Cuenta Destino</strong>
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
  const cuentasOrigen = props.cuentasOrigen;
  const cuentasDestino = props.cuentasDestino;
  const disponible = props.disponible;
  const aplicado = props.aplicado;
  const setAplicado = props.setAplicado;
  const setRestante = props.setRestante;
  const [tipoDocumento, setTipoDocumento] = useState("Anticipo a proveedores");
  const [openDialogInstrucciones, setOpenDialogInstrucciones] = useState(false);
  const [flujosEfectivoFiltrados, setFlujosEfectivoFiltrados] = useState([]);
  const [totalEspecificos, setTotalEspecificos] = useState(0.0);
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
              <TextField
                className={classes.textFields}
                id={"cuentaOrigen" + index}
                variant="outlined"
                type="text"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.cuentasOrigen[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  let nuevasCuentasOrigen = instrucciones.cuentasOrigen;
                  nuevasCuentasOrigen[index] = e.target.value;
                  setInstrucciones({
                    ...instrucciones,
                    cuentasOrigen: nuevasCuentasOrigen,
                  });
                }} */
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"cuentaDestino" + index}
                variant="outlined"
                type="text"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.cuentasDestino[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  let nuevasCuentasDestino = instrucciones.cuentasDestino;
                  nuevasCuentasDestino[index] = e.target.value;
                  setInstrucciones({
                    ...instrucciones,
                    cuentasDestino: nuevasCuentasDestino,
                  });
                }} */
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"fecha" + index}
                variant="outlined"
                type="date"
                disabled
                inputProps={{
                  maxLength: 20,
                }}
                value={instrucciones.fechas[index]}
                /* onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={(e) => {
                  let nuevasFechas = instrucciones.fechas;
                  nuevasFechas[index] = e.target.value;
                  setInstrucciones({
                    ...instrucciones,
                    fechas: nuevasFechas,
                  });
                }} */
              />
            </TableCell>
            <TableCell align="right">
              ${number_format(instrucciones.importes[index], 2, ".", ",")}
            </TableCell>
            <TableCell align="right">
              <TextField
                className={classes.textFields}
                id={"llavesMatch" + index}
                disabled
                variant="outlined"
                type="text"
              />
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
                inputProps={{
                  maxLength: 100,
                }}
                value={instruccionesAdicionales.proveedores[index]}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={(e) => {
                  pasteValidation(e, 3);
                  let nuevosProveedores = instruccionesAdicionales.proveedores;
                  nuevosProveedores[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    proveedores: nuevosProveedores,
                  });
                }}
              >
                <option value="0">Seleccione un proveedor</option>
                <option value="proveedor1">Proveedor 1</option>
                <option value="proveedor2">Proveedor 2</option>
                <option value="proveedor3">Proveedor 3</option>
              </TextField>
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
                value={instruccionesAdicionales.cuentasOrigen[index]}
                onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  let nuevasCuentasOrigen =
                    instruccionesAdicionales.cuentasOrigen;
                  nuevasCuentasOrigen[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    cuentasOrigen: nuevasCuentasOrigen,
                  });
                }}
              >
                <option value="0">Seleccione una cuenta de origen</option>
                {cuentasOrigen.map((cuenta, index) => (
                  <option value={cuenta} key={index}>
                    {cuenta}
                  </option>
                ))}
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
                value={instruccionesAdicionales.cuentasDestino[index]}
                onKeyPress={(e) => {
                  keyValidation(e, 5);
                }}
                onChange={(e) => {
                  pasteValidation(e, 5);
                  let nuevasCuentasDestino =
                    instruccionesAdicionales.cuentasDestino;
                  nuevasCuentasDestino[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    cuentasDestino: nuevasCuentasDestino,
                  });
                }}
              >
                <option value="0">Seleccione una cuenta de destino</option>
                {cuentasDestino.map((cuenta, index) => (
                  <option value={cuenta} key={index}>
                    {cuenta}
                  </option>
                ))}
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
                onChange={(e) => {
                  let nuevosImportes = instruccionesAdicionales.importes;
                  nuevosImportes[index] = e.target.value;
                  setInstruccionesAdicionales({
                    ...instruccionesAdicionales,
                    importes: nuevosImportes,
                  });

                  /* console.log(e.target);
                  console.log(e.target.value, e.target.value ? "si" : "no");
                  console.log(
                    aplicado,
                    parseFloat(e.target.value),
                    aplicado + parseFloat(e.target.value)
                  );
                  console.log(
                    disponible,
                    aplicado,
                    parseFloat(e.target.value),
                    disponible - (aplicado + parseFloat(e.target.value))
                  ); */
                  if (e.target.value) {
                    setAplicado(aplicado + parseFloat(e.target.value));
                    setRestante(
                      disponible - (aplicado + parseFloat(e.target.value))
                    );
                  } else {
                    setAplicado(aplicado);
                    setRestante(disponible - aplicado);
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
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    nuevosIds.push(1);
    nuevosTipos.push(tipoDocumento);
    nuevosProveedores.push("0");
    nuevosImportes.push(0.0);
    nuevasCuentasOrigen.push("0");
    nuevasCuentasDestino.push("0");
    nuevasFechas.push(moment().format("YYYY-MM-DD"));
    nuevasLlavesMatch.push("");
    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      importes: nuevosImportes,
      cuentasOrigen: nuevasCuentasOrigen,
      cuentasDestino: nuevasCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  };

  const quitarInstruccionesPago = (pos) => {
    let nuevosIds = instruccionesAdicionales.ids;
    let nuevosTipos = instruccionesAdicionales.tipos;
    let nuevosProveedores = instruccionesAdicionales.proveedores;
    let nuevosImportes = instruccionesAdicionales.importes;
    let nuevasCuentasOrigen = instruccionesAdicionales.cuentasOrigen;
    let nuevasCuentasDestino = instruccionesAdicionales.cuentasDestino;
    let nuevasFechas = instruccionesAdicionales.fechas;
    let nuevasLlavesMatch = instruccionesAdicionales.llavesMatch;
    nuevosIds.splice(pos, 1);
    nuevosTipos.splice(pos, 1);
    nuevosProveedores.splice(pos, 1);
    nuevosImportes.splice(pos, 1);
    nuevasCuentasOrigen.splice(pos, 1);
    nuevasCuentasDestino.splice(pos, 1);
    nuevasFechas.splice(pos, 1);
    nuevasLlavesMatch.splice(pos, 1);
    setInstruccionesAdicionales({
      ids: nuevosIds,
      tipos: nuevosTipos,
      proveedores: nuevosProveedores,
      importes: nuevosImportes,
      cuentasOrigen: nuevasCuentasOrigen,
      cuentasDestino: nuevasCuentasDestino,
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
                    <strong>Cuenta Destino</strong>
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
  const instruccionesCombinadas = props.instruccionesCombinadas;
  const [informacionBancos, setInformacionBancos] = useState({
    ids: [],
    tipos: [],
    proveedores: [],
    importes: [],
    cuentasOrigen: [],
    cuentasDestino: [],
    fechas: [],
    llavesMatch: [],
  });

  useEffect(() => {
    let nuevosIds = [];
    let nuevosTipos = [];
    let nuevosProveedores = [];
    let nuevosImportes = [];
    let nuevasCuentasOrigen = [];
    let nuevasCuentasDestino = [];
    let nuevasFechas = [];
    let nuevasLlavesMatch = [];

    function verExistencia(cuentaOrigen, cuentaDestino, proveedor) {
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
    }

    for (let x = 0; x < instruccionesCombinadas.cuentasOrigen.length; x++) {
      let pos = verExistencia(
        instruccionesCombinadas.cuentasOrigen[x],
        instruccionesCombinadas.cuentasDestino[x],
        instruccionesCombinadas.proveedores[x]
      );
      if (pos === -1) {
        nuevosIds.push(instruccionesCombinadas.ids[x]);
        nuevosTipos.push(instruccionesCombinadas.tipos[x]);
        nuevosProveedores.push(instruccionesCombinadas.proveedores[x]);
        nuevosImportes.push(instruccionesCombinadas.importes[x]);
        nuevasCuentasOrigen.push(instruccionesCombinadas.cuentasOrigen[x]);
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
      cuentasOrigen: nuevasCuentasOrigen,
      cuentasDestino: nuevasCuentasDestino,
      fechas: nuevasFechas,
      llavesMatch: nuevasLlavesMatch,
    });
  }, [instruccionesCombinadas]);

  const getInformacionBancos = () => {
    if (informacionBancos.cuentasOrigen.length > 0) {
      console.log(informacionBancos);
      let mismos = [];
      let diferentes = [];
      let mensajes = new Array(informacionBancos.cuentasOrigen.length);
      for (let x = 0; x < informacionBancos.cuentasOrigen.length; x++) {
        if (
          informacionBancos.cuentasOrigen[x] ===
          informacionBancos.cuentasDestino[x]
        ) {
          let pos = mismos.indexOf(informacionBancos.cuentasOrigen[x]);
          if (pos === -1) {
            mismos.push(informacionBancos.cuentasOrigen[x]);
            mensajes[x] = `Mi cuenta ${
              informacionBancos.cuentasOrigen[x]
            }:* A ${informacionBancos.proveedores[x]} en ${
              informacionBancos.cuentasDestino[x]
            } (${informacionBancos.fechas[x]}): $${number_format(
              informacionBancos.importes[x],
              2,
              ".",
              ","
            )} *`;
          } else {
            mensajes[pos] =
              mensajes[pos] +
              `A ${informacionBancos.proveedores[x]} en ${
                informacionBancos.cuentasDestino[x]
              } (${informacionBancos.fechas[x]}): $${number_format(
                informacionBancos.importes[x],
                2,
                ".",
                ","
              )} *`;
          }
        } else {
          let pos = diferentes.indexOf(informacionBancos.cuentasOrigen[x]);
          if (pos === -1) {
            diferentes.push(informacionBancos.cuentasOrigen[x]);
            mensajes[x] = `Mi cuenta ${
              informacionBancos.cuentasOrigen[x]
            }:* A ${informacionBancos.proveedores[x]} en ${
              informacionBancos.cuentasDestino[x]
            } (${informacionBancos.fechas[x]}): $${number_format(
              informacionBancos.importes[x],
              2,
              ".",
              ","
            )} *`;
          } else {
            mensajes[pos] =
              mensajes[pos] +
              `A ${informacionBancos.proveedores[x]} en ${
                informacionBancos.cuentasDestino[x]
              } (${informacionBancos.fechas[x]}): $${number_format(
                informacionBancos.importes[x],
                2,
                ".",
                ","
              )} *`;
          }
        }
      }

      mensajes = mensajes.filter(Boolean);

      return (
        <List>
          {mensajes.map((mensaje, index) => {
            console.log(mensaje.split("*"));
            let mensajesDividido = mensaje.split("*");
            mensajesDividido.splice(mensajesDividido.length - 1);
            console.log(mensajesDividido);
            return (
              <ListItem key={index} button>
                <ListItemIcon>
                  <Checkbox edge="start" tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={mensajesDividido[0]}
                  secondary={mensajesDividido.map((mensajeDividido, index) => {
                    return index !== 0 ? (
                      <span key={index} style={{ display: "flex" }}>
                        {mensajeDividido}
                      </span>
                    ) : null;
                  })}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Descargar">
                    <IconButton edge="end" aria-label={`descargar${index}`}>
                      <GetAppIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      );
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
          {getInformacionBancos()}
        </Grid>
      </Grid>
    </Grid>
  );
}
