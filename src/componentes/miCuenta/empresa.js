import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  ExpansionPanel as MuiExpansionPanel,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  Grid,
  TextField,
  Button,
  Divider,
  IconButton,
  Paper,
  Toolbar,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Menu,
  MenuItem,
  ListItemText,
  useMediaQuery,
  List,
  ListItem,
  ListItemSecondaryAction,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  SettingsEthernet as SettingsEthernetIcon,
  ClearAll as ClearAllIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  MonetizationOn as MonetizationOnIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import {
  keyValidation,
  pasteValidation,
  doubleKeyValidation,
  doublePasteValidation,
} from "../../helpers/inputHelpers";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import jwt from "jsonwebtoken";
import swal from "sweetalert";
//import swalReact from "@sweetalert/with-react";
import moment from "moment";
import {
  verificarArchivoCer,
  verificarArchivoKey,
} from "../../helpers/extensionesArchivos";
import serviciosImage from "../../assets/images/servicios.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  card: {
    padding: "10px",
    height: "100%",
    width: "100%",
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  textFields: {
    width: "100%",
  },
  rootCard: {
    maxWidth: 345,
  },
  media: {
    height: 140,
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
  table: {
    width: "100%",
  },
}));

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
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

export default function Empresa(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const correo = usuarioDatos.correo;
  const password = usuarioDatos.password;
  const empresaDatos = props.empresaDatos;
  const setEmpresaDatos = props.setEmpresaDatos;
  const idEmpresa = empresaDatos.idempresa;
  const rfc = empresaDatos.RFC;
  //const loading = props.loading;
  const setLoading = props.setLoading;
  const [expanded, setExpanded] = useState(0);
  const [idSubmenu, setIdsubmenu] = useState(0);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h6" className={classes.title}>
        Empresa
      </Typography>
      <div>
        {submenuContent.map((content, index) => {
          return content.submenu.orden !== 0 ? (
            <ExpansionPanel
              square
              disabled={content.permisos === 0}
              expanded={expanded === content.submenu.orden}
              onChange={handleChange(content.submenu.orden)}
              key={index}
              onClick={() => {
                if (content.permisos !== 0) {
                  setIdsubmenu(content.submenu.idsubmenu);
                }
              }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}d-content`}
                id={`panel${index + 1}d-header`}
              >
                <Typography>{content.submenu.nombre_submenu}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid item xs={12}>
                    {content.submenu.idsubmenu === 39 ? (
                      <InformacionGeneral
                        empresaDatos={empresaDatos}
                        setEmpresaDatos={setEmpresaDatos}
                        setLoading={setLoading}
                        correo={correo}
                        password={password}
                        idEmpresa={idEmpresa}
                        rfc={rfc}
                        idSubmenu={idSubmenu}
                      />
                    ) : content.submenu.idsubmenu === 71 ? (
                      <Sucursales
                        setLoading={setLoading}
                        idUsuario={idUsuario}
                        correo={correo}
                        password={password}
                        idEmpresa={idEmpresa}
                        rfc={rfc}
                        idSubmenu={idSubmenu}
                      />
                    ) : content.submenu.idsubmenu === 40 ? (
                      <ServiciosContratados
                        setLoading={setLoading}
                        idUsuario={idUsuario}
                        correo={correo}
                        password={password}
                        idEmpresa={idEmpresa}
                        rfc={rfc}
                        idSubmenu={idSubmenu}
                      />
                    ) : content.submenu.idsubmenu === 41 ? (
                      <EstadoDeCuenta
                        setLoading={setLoading}
                        correo={correo}
                        password={password}
                        idEmpresa={idEmpresa}
                        rfc={rfc}
                        idSubmenu={idSubmenu}
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ) : null;
        })}
      </div>
    </Card>
  );
}

function InformacionGeneral(props) {
  const classes = useStyles();
  const empresaDatos = props.empresaDatos;
  const usuarioStorage = empresaDatos.usuario_storage;
  const passwordStorage = empresaDatos.password_storage;
  const setEmpresaDatos = props.setEmpresaDatos;
  const correo = props.correo;
  const password = props.password;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  const idEmpresa = props.idEmpresa;
  const setLoading = props.setLoading;
  const [calle, setCalle] = useState(
    empresaDatos.calle !== null ? empresaDatos.calle : ""
  );
  const [colonia, setColonia] = useState(
    empresaDatos.colonia !== null ? empresaDatos.colonia : ""
  );
  const [numExt, setNumExt] = useState(
    empresaDatos.num_ext !== null ? empresaDatos.num_ext : ""
  );
  const [numInt, setNumInt] = useState(
    empresaDatos.num_int !== null ? empresaDatos.num_int : ""
  );
  const [codigoPostal, setCodigoPostal] = useState(
    empresaDatos.codigopostal !== null ? empresaDatos.codigopostal : ""
  );
  const [municipio, setMunicipio] = useState(
    empresaDatos.municipio !== null ? empresaDatos.municipio : ""
  );
  const [ciudad, setCiudad] = useState(
    empresaDatos.ciudad !== null ? empresaDatos.ciudad : ""
  );
  const [estado, setEstado] = useState(
    empresaDatos.estado !== null ? empresaDatos.estado : ""
  );
  const [telefono, setTelefono] = useState(
    empresaDatos.telefono !== null ? empresaDatos.telefono : ""
  );
  const [openMenuCambiarCorreo, setOpenMenuCambiarCorreo] = useState(false);
  const [openMenuRenovarCetificado, setOpenMenuRenovarCetificado] =
    useState(false);
  const [datosCertificado, setDatosCertificado] = useState({
    certificado: null,
    key: null,
    passwordcertificado: "",
  });

  const [
    {
      data: editarDatosFacturacionEmpresaData,
      loading: editarDatosFacturacionEmpresaLoading,
      error: editarDatosFacturacionEmpresaError,
    },
    executeEditarDatosFacturacionEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editarDatosFacturacionEmpresa`,
      method: "PUT",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: renovarCertificadoEmpresaData,
      loading: renovarCertificadoEmpresaLoading,
      error: renovarCertificadoEmpresaError,
    },
    executeRenovarCertificadoEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/renovarCertificadoEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (editarDatosFacturacionEmpresaData) {
      if (editarDatosFacturacionEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(editarDatosFacturacionEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Datos De Facturación Guardados",
          "Datos de facturación guardados con éxito",
          "success"
        );
        setEmpresaDatos(editarDatosFacturacionEmpresaData.datosempresa[0]);
        const token = jwt.sign(
          { empresaData: editarDatosFacturacionEmpresaData.datosempresa[0] },
          "mysecretpassword"
        );
        localStorage.setItem("emToken", token);
      }
    }
  }, [editarDatosFacturacionEmpresaData, setEmpresaDatos]);

  useEffect(() => {
    if (renovarCertificadoEmpresaData) {
      if (renovarCertificadoEmpresaData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(renovarCertificadoEmpresaData.error),
          "warning"
        );
      } else {
        swal(
          "Certificado Renovado",
          "Certificado renovado con éxito",
          "success"
        );
        setDatosCertificado({
          certificado: null,
          key: null,
          passwordcertificado: "",
        });
        setOpenMenuRenovarCetificado(false);
      }
    }
  }, [renovarCertificadoEmpresaData]);

  if (
    editarDatosFacturacionEmpresaLoading ||
    renovarCertificadoEmpresaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (editarDatosFacturacionEmpresaError || renovarCertificadoEmpresaError) {
    return <ErrorQueryDB />;
  }

  const handleClickOpenMenuCambiarCorreo = () => {
    setOpenMenuCambiarCorreo(true);
  };

  const handleCloseMenuCambiarCorreo = () => {
    setOpenMenuCambiarCorreo(false);
  };

  const handleClickOpenMenuRenovarCetificado = () => {
    setOpenMenuRenovarCetificado(true);
  };

  const handleCloseMenuRenovarCetificado = () => {
    setOpenMenuRenovarCetificado(false);
  };

  const guardarDatosFacturacionEmpresa = () => {
    executeEditarDatosFacturacionEmpresa({
      data: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: idSubmenu,
        idempresa: idEmpresa,
        calle: calle.trim(),
        colonia: colonia.trim(),
        num_ext: numExt,
        num_int: numInt,
        codigopostal: codigoPostal,
        municipio: municipio.trim(),
        ciudad: ciudad.trim(),
        estado: estado.trim(),
        telefono: telefono,
      },
    });
  };

  const renovarCertificadoEmpresa = () => {
    const { certificado, key, passwordcertificado } = datosCertificado;
    if (certificado === null || !certificado) {
      swal("Faltan llenar campos", "Seleccione un archivo .cer", "warning");
    } else if (!verificarArchivoCer(certificado.name)) {
      swal(
        "Error de extensión de archivo",
        "Extensión no valida, seleccione un archivo .cer",
        "warning"
      );
    } else if (key === null || !key) {
      swal("Faltan llenar campos", "Seleccione un archivo .key", "warning");
    } else if (!verificarArchivoKey(key.name)) {
      swal(
        "Error de extensión de archivo",
        "Extensión no valida, seleccione un archivo .key",
        "warning"
      );
    } else if (passwordcertificado.trim() === "") {
      swal("Faltan llenar campos", "Ingrese una contraseña FIEL", "warning");
    } else {
      const formData = new FormData();
      formData.append("usuario", correo);
      formData.append("pwd", password);
      formData.append("rfc", rfc);
      formData.append("idsubmenu", idSubmenu);
      formData.append("certificado", certificado);
      formData.append("key", key);
      formData.append("passwordcertificado", passwordcertificado);
      formData.append("idempresa", idEmpresa);
      formData.append("fecha", moment().format("YYYYMMDD"));
      formData.append("usuariostorage", usuarioStorage);
      formData.append("passwordstorage", passwordStorage);
      executeRenovarCertificadoEmpresa({
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Datos De La Empresa</Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          className={classes.textFields}
          disabled
          value={empresaDatos.nombreempresa}
          id={`nombreEmpresa`}
          label="Nombre Empresa"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 5);
          }}
          onChange={(e) => {
            pasteValidation(e, 5);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          className={classes.textFields}
          disabled
          value={empresaDatos.RFC}
          id={`rfc`}
          label="RFC"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 5);
          }}
          onChange={(e) => {
            pasteValidation(e, 5);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          className={classes.textFields}
          disabled
          value={empresaDatos.correo}
          id={`correoElectronico`}
          label="Correo Electrónico"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 4);
          }}
          onChange={(e) => {
            pasteValidation(e, 4);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          className={classes.textFields}
          disabled
          value={empresaDatos.vigencia}
          id={`vigenciaCertificado`}
          label="Vigencia Certificado"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          style={{
            float: "right",
            borderColor: "#F49917",
            margin: 5,
          }}
          onClick={() => {
            handleClickOpenMenuRenovarCetificado();
          }}
        >
          Renovar Certificado
        </Button>
        <Button
          variant="outlined"
          color="primary"
          style={{
            float: "right",
            margin: 5,
          }}
          onClick={() => {
            handleClickOpenMenuCambiarCorreo();
          }}
        >
          Cambiar Correo
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Datos Para Facturación</Typography>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={calle || ""}
          id={`calle`}
          label="Calle"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setCalle(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={colonia || ""}
          id={`colonia`}
          label="Colonia"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setColonia(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={numExt || ""}
          id={`numeroExterior`}
          label="Num. Ext."
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
            setNumExt(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={numInt || ""}
          id={`numInt`}
          label="Num. Int."
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
            setNumInt(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={codigoPostal || ""}
          id={`codigoPostal`}
          label="Código Postal"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
            setCodigoPostal(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={municipio || ""}
          id={`municipio`}
          label="Municipio"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setMunicipio(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={ciudad || ""}
          id={`ciudad`}
          label="Ciudad"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setCiudad(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={estado || ""}
          id={`estado`}
          label="Estado"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 3);
          }}
          onChange={(e) => {
            pasteValidation(e, 3);
            setEstado(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          className={classes.textFields}
          value={telefono || ""}
          id={`telefono`}
          label="Teléfono"
          variant="outlined"
          type="text"
          margin="normal"
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
            setTelefono(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="outlined"
          style={{
            float: "right",
            backgroundColor: "#17a2b8",
            borderColor: "#17a2b8",
            color: "#ffffff",
          }}
          onClick={() => {
            guardarDatosFacturacionEmpresa();
          }}
        >
          Guardar
        </Button>
      </Grid>
      <Dialog
        onClose={handleCloseMenuCambiarCorreo}
        aria-labelledby="simple-dialog-title"
        open={openMenuCambiarCorreo}
      >
        <DialogTitle id="simple-dialog-title">Cambiar Correo</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}></Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuCambiarCorreo();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              /* renovarCertificadoEmpresa(); */
            }}
          >
            Cambiar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseMenuRenovarCetificado}
        aria-labelledby="simple-dialog-title"
        open={openMenuRenovarCetificado}
      >
        <DialogTitle id="simple-dialog-title">Renovar Certificado</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .cer"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ accept: ".cer" }}
                onChange={(e) => {
                  setDatosCertificado({
                    ...datosCertificado,
                    certificado: e.target.files[0],
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .key"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ accept: ".key" }}
                onChange={(e) => {
                  setDatosCertificado({
                    ...datosCertificado,
                    key: e.target.files[0],
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                label="Contraseña FIEL"
                variant="outlined"
                type="password"
                value={datosCertificado.passwordcertificado}
                margin="normal"
                onChange={(e) => {
                  setDatosCertificado({
                    ...datosCertificado,
                    passwordcertificado: e.target.value,
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuRenovarCetificado();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              renovarCertificadoEmpresa();
            }}
          >
            Renovar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

/* function createDataAgentesPersonas(
  idAgentePersona,
  agente,
  estatus,
  tipo,
  idProyecto
) {
  return { idAgentePersona, agente, estatus, tipo, idProyecto };
} */

const headCellsSucursales = [
  {
    id: "sucursal",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Sucursal",
  },
  {
    id: "rutaadw",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Ruta ADW",
  },
  {
    id: "sincronizado",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Sincronizado",
  },
  {
    id: "idadw",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Id ADW",
  },
  {
    id: "default",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Default",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

function EnhancedTableHeadSucursales(props) {
  const { classes, order, orderBy, onRequestSort, headCellTable, actions } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ background: "#FAFAFA" }}>
      <TableRow>
        <TableCell />
        {headCellTable.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              display:
                headCell.id !== "acciones"
                  ? "table-cell"
                  : actions
                  ? "table-cell"
                  : "none",
            }}
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

EnhancedTableHeadSucursales.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCellTable: PropTypes.array.isRequired,
  actions: PropTypes.bool.isRequired,
};

function Sucursales(props) {
  const classes = useStyles();
  /* const idUsuario = props.idUsuario; */
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  /*  const idEmpresa = props.idEmpresa; */
  const rfc = props.rfc;
  /* const idSubmenu = props.idSubmenu; */

  const [sucursales, setSucursales] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialogSucursales, setOpenDialogSucursales] = useState(false);
  const [datosSucursal, setDatosSucursal] = useState({
    idSucursal: 0,
    sucursal: "",
    rutaadw: "",
    sincronizado: 0,
    idadw: 0,
    defaultRow: 0,
  });

  const [
    {
      data: getSucursalesEmpresaData,
      loading: getSucursalesEmpresaLoading,
      error: getSucursalesEmpresaError,
    },
    executeGetSucursalesEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getSucursalesEmpresa`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: 71,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: getSucursalEmpresaData,
      loading: getSucursalEmpresaLoading,
      error: getSucursalEmpresaError,
    },
    executeGetSucursalEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getSucursalEmpresa`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: guardarSucursalEmpresaData,
      loading: guardarSucursalEmpresaLoading,
      error: guardarSucursalEmpresaEmpresaError,
    },
    executeGuardarSucursalEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarSucursalEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [
    {
      data: eliminarSucursalEmpresaData,
      loading: eliminarSucursalEmpresaLoading,
      error: eliminarSucursalEmpresaError,
    },
    executeEliminarSucursalEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminarSucursalEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getSucursalesEmpresaData) {
        if (getSucursalesEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getSucursalesEmpresaData.error),
            "warning"
          );
        } else {
          setSucursales(getSucursalesEmpresaData.sucursales);
        }
      }
    }

    checkData();
  }, [getSucursalesEmpresaData]);

  useEffect(() => {
    function checkData() {
      if (getSucursalEmpresaData) {
        if (getSucursalEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getSucursalEmpresaData.error),
            "warning"
          );
        } else {
          setDatosSucursal({
            idSucursal: getSucursalEmpresaData.sucursal[0].idsucursal,
            sucursal: getSucursalEmpresaData.sucursal[0].sucursal,
            rutaadw: getSucursalEmpresaData.sucursal[0].rutaadw !== null ? getSucursalEmpresaData.sucursal[0].rutaadw : "",
            sincronizado: getSucursalEmpresaData.sucursal[0].sincronizado !== null ? getSucursalEmpresaData.sucursal[0].sincronizado : "",
            idadw: getSucursalEmpresaData.sucursal[0].idadw !== null ? getSucursalEmpresaData.sucursal[0].idadw : "",
            defaultRow: getSucursalEmpresaData.sucursal[0].default !== null ? getSucursalEmpresaData.sucursal[0].default : "",
          });
        }
      }
    }

    checkData();
  }, [getSucursalEmpresaData]);

  useEffect(() => {
    function checkData() {
      if (guardarSucursalEmpresaData) {
        if (guardarSucursalEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarSucursalEmpresaData.error),
            "warning"
          );
        } else {
          swal(
            "Información De Sucursal Guardada",
            "Información de sucursal guardada con éxito",
            "success"
          );
          executeGetSucursalesEmpresa();
          setDatosSucursal({
            idSucursal: 0,
            sucursal: "",
            rutaadw: "",
            sincronizado: 0,
            idadw: 0,
            defaultRow: 0,
          });
          setOpenDialogSucursales(false);
        }
      }
    }

    checkData();
  }, [guardarSucursalEmpresaData, executeGetSucursalesEmpresa]);

  useEffect(() => {
    function checkData() {
      if (eliminarSucursalEmpresaData) {
        if (eliminarSucursalEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminarSucursalEmpresaData.error),
            "warning"
          );
        } else {
          swal("Sucursal Eliminada", "Sucursal eliminada con éxito", "success");
          executeGetSucursalesEmpresa();
        }
      }
    }

    checkData();
  }, [eliminarSucursalEmpresaData, executeGetSucursalesEmpresa]);

  if (
    getSucursalesEmpresaLoading ||
    guardarSucursalEmpresaLoading ||
    getSucursalEmpresaLoading ||
    eliminarSucursalEmpresaLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getSucursalesEmpresaError ||
    guardarSucursalEmpresaEmpresaError ||
    getSucursalEmpresaError ||
    eliminarSucursalEmpresaError
  ) {
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

  const handleOpenDialogSucursales = () => {
    setOpenDialogSucursales(true);
  };

  const handleCloseDialogSucursales = () => {
    setOpenDialogSucursales(false);
    setDatosSucursal({
      ...datosSucursal,
      idSucursal: 0,
    });
  };

  const handleInputsInformacionSucursalChange = (e) => {
    if (e.target.id !== "rutaadw") {
      pasteValidation(e, e.target.id === "sucursal" ? 3 : 2);
    }
    setDatosSucursal({
      ...datosSucursal,
      [e.target.id]: e.target.value,
    });
  };

  const handleGuardarInformacionSucursal = () => {
    const { idSucursal, sucursal, rutaadw, sincronizado, idadw, defaultRow } =
      datosSucursal;
    if (sucursal.trim() === "") {
      swal("Error", "Ingrese una sucursal", "warning");
    } else {
      executeGuardarSucursalEmpresa({
        data: {
          usuario: correo,
          pwd: password,
          rfc: rfc,
          idsubmenu: 71,
          sucursal: sucursal,
          rutaadw: rutaadw,
          sincronizado: sincronizado,
          idadw: idadw,
          default: defaultRow,
          idsucursal: idSucursal,
        },
      });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={handleOpenDialogSucursales}
        >
          Agregar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHeadSucursales
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headCellTable={headCellsSucursales}
                actions={true}
              />
              <TableBody>
                {sucursales.length > 0 ? (
                  stableSort(sucursales, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sucursal, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          <TableCell />
                          <TableCell component="th" scope="row" padding="none">
                            {sucursal.sucursal}
                          </TableCell>
                          <TableCell align="right">
                            {sucursal.rutaadw}
                          </TableCell>
                          <TableCell align="right">
                            {sucursal.sincronizado}
                          </TableCell>
                          <TableCell align="right">{sucursal.idadw}</TableCell>
                          <TableCell align="right">
                            {sucursal.default}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => {
                                  handleOpenDialogSucursales();
                                  executeGetSucursalEmpresa({
                                    params: {
                                      usuario: correo,
                                      pwd: password,
                                      rfc: rfc,
                                      idsubmenu: 71,
                                      idsucursal: sucursal.idsucursal,
                                    },
                                  });
                                }}
                              >
                                <EditIcon style={{ color: "#F49917" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton onClick={() => {
                                swal({
                                  text: `¿Está seguro de eliminar la sucursal?`,
                                  buttons: ["No", "Sí"],
                                  dangerMode: true,
                                }).then((value) => {
                                  if (value) {
                                    executeEliminarSucursalEmpresa({
                                      params: {
                                        usuario: correo,
                                        pwd: password,
                                        rfc: rfc,
                                        idsubmenu: 71,
                                        idsucursal: sucursal.idsucursal,
                                      },
                                    });
                                  }
                                });
                              }}>
                                <DeleteIcon color="secondary" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1">
                        <ErrorIcon
                          style={{ color: "red", verticalAlign: "sub" }}
                        />
                        No hay sucursales
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
            count={sucursales.length}
            rowsPerPage={rowsPerPage}
            page={sucursales.length > 0 ? page : 0}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Dialog
        onClose={handleCloseDialogSucursales}
        aria-labelledby="simple-dialog-title"
        open={openDialogSucursales}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="guardarInformacionSucursal">{`Guardar Información Sucursal`}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                id="sucursal"
                label="Sucursal"
                type="text"
                margin="normal"
                value={datosSucursal.sucursal}
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 3);
                }}
                onChange={handleInputsInformacionSucursalChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                id="rutaadw"
                label="Ruta ADW"
                type="text"
                margin="normal"
                value={datosSucursal.rutaadw}
                inputProps={{
                  maxLength: 100,
                }}
                /* onKeyPress={(e) => {
                  keyValidation(e, 3);
                }} */
                onChange={handleInputsInformacionSucursalChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                id="sincronizado"
                label="Sincronizado"
                type="text"
                margin="normal"
                value={datosSucursal.sincronizado}
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={handleInputsInformacionSucursalChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                id="idadw"
                label="Id ADW"
                type="text"
                margin="normal"
                value={datosSucursal.idadw}
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={handleInputsInformacionSucursalChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                className={classes.textFields}
                id="default"
                label="Default"
                type="text"
                margin="normal"
                value={datosSucursal.defaultRow}
                inputProps={{
                  maxLength: 100,
                }}
                onKeyPress={(e) => {
                  keyValidation(e, 2);
                }}
                onChange={handleInputsInformacionSucursalChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDialogSucursales}
          >
            Salir
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGuardarInformacionSucursal}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
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

function ServiciosContratados(props) {
  const classes = useStyles();
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const idUsuario = props.idUsuario;
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const idEmpresa = props.idEmpresa;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  const [servicios, setServicios] = useState([]);
  const [pagoMensual, setPagoMenual] = useState(0);
  const [validacionAgregarServicio, setValidacionAgregarServicio] =
    useState(false);
  const [validacionCancelarServicio, setValidacionCancelarServicio] =
    useState(false);
  const [detallesServicios, setDetallesServicios] = useState({
    idsServicios: [],
    preciosServicios: [],
  });
  const [totalPrecioServicios, setTotalPreciosServicios] = useState(0);
  const [openDialogContenido, setOpenDialogContenido] = useState(false);
  const [
    openDialogConfigurarNotificaciones,
    setOpenDialogConfigurarNotificaciones,
  ] = useState(false);
  const [contenido, setContenido] = useState([]);
  const [servicioSelected, setServicioSelected] = useState(0);
  const [usuariosNotificaciones, setUsuarioNotificaciones] = useState([]);

  const [
    {
      data: getServiciosEmpresaClienteData,
      loading: getServiciosEmpresaClienteLoading,
      error: getServiciosEmpresaClienteError,
    },
    executeGetServiciosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServiciosEmpresaCliente`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: idSubmenu,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: agregarServicioEmpresaClienteData,
      loading: agregarServicioEmpresaClienteLoading,
      error: agregarServicioEmpresaClienteError,
    },
    executeAgregarServicioEmpresaCliente,
  ] = useAxios(
    {
      url: API_BASE_URL + `/agregarServicioEmpresaCliente`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: cancelarServicioEmpresaClienteData,
      loading: cancelarServicioEmpresaClienteLoading,
      error: cancelarServicioEmpresaClienteError,
    },
    executeCancelarServicioEmpresaCliente,
  ] = useAxios(
    {
      url: API_BASE_URL + `/cancelarServicioEmpresaCliente`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: getContenidoServicioClientesData,
      loading: getContenidoServicioClientesLoading,
      error: getContenidoServicioClientesError,
    },
    executeGetContenidoServicioClientes,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getContenidoServicioClientes`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: getNotificacionesUsuarioPorServicioData,
      loading: getNotificacionesUsuarioPorServicioLoading,
      error: getNotificacionesUsuarioPorServicioError,
    },
    executeGetNotificacionesUsuarioPorServicio,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getNotificacionesUsuarioPorServicio`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: guardarConfiguracionUsuariosNotificacionesData,
      loading: guardarConfiguracionUsuariosNotificacionesLoading,
      error: guardarConfiguracionUsuariosNotificacionesError,
    },
    executeGuardarConfiguracionUsuariosNotificaciones,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarConfiguracionUsuariosNotificaciones`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (idSubmenu === 40) {
      executeGetServiciosEmpresa();
    }
  }, [idSubmenu, executeGetServiciosEmpresa]);

  useEffect(() => {
    if (getServiciosEmpresaClienteData) {
      if (getServiciosEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getServiciosEmpresaClienteData.error),
          "warning"
        );
      } else {
        setServicios(getServiciosEmpresaClienteData.servicios);
        let cantidad = 0;
        for (
          let x = 0;
          x < getServiciosEmpresaClienteData.servicios.length;
          x++
        ) {
          if (
            getServiciosEmpresaClienteData.servicios[x].statuscontratacion !== 0
          ) {
            cantidad =
              cantidad + getServiciosEmpresaClienteData.servicios[x].precio;
          }
        }
        setPagoMenual(cantidad);
      }
    }
  }, [getServiciosEmpresaClienteData]);

  useEffect(() => {
    if (agregarServicioEmpresaClienteData) {
      if (agregarServicioEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(agregarServicioEmpresaClienteData.error),
          "warning"
        );
      } else {
        setValidacionAgregarServicio(true);
      }
    }
  }, [agregarServicioEmpresaClienteData]);

  useEffect(() => {
    if (cancelarServicioEmpresaClienteData) {
      if (cancelarServicioEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(cancelarServicioEmpresaClienteData.error),
          "warning"
        );
      } else {
        setValidacionCancelarServicio(true);
      }
    }
  }, [cancelarServicioEmpresaClienteData]);

  useEffect(() => {
    if (validacionAgregarServicio) {
      swal("Servicio Agregado", "Servicio agregado con éxito", "success");
      setDetallesServicios({
        idsServicios: [],
        preciosServicios: [],
      });
      executeGetServiciosEmpresa();
      setValidacionAgregarServicio(false);
    }
  }, [validacionAgregarServicio, executeGetServiciosEmpresa]);

  useEffect(() => {
    if (validacionCancelarServicio) {
      swal("Servicio Cancelado", "Servicio cancelado con éxito", "success");
      /* setDetallesServicios({
        idsServicios: [],
        preciosServicios: [],
      }); */
      executeGetServiciosEmpresa();
      setValidacionCancelarServicio(false);
    }
  }, [validacionCancelarServicio, executeGetServiciosEmpresa]);

  useEffect(() => {
    if (getContenidoServicioClientesData) {
      if (getContenidoServicioClientesData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getContenidoServicioClientesData.error),
          "warning"
        );
      } else {
        setContenido(getContenidoServicioClientesData.contenido);
      }
    }
  }, [getContenidoServicioClientesData]);

  useEffect(() => {
    if (getNotificacionesUsuarioPorServicioData) {
      if (getNotificacionesUsuarioPorServicioData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getNotificacionesUsuarioPorServicioData.error),
          "warning"
        );
      } else {
        setUsuarioNotificaciones(
          getNotificacionesUsuarioPorServicioData.usuariosNotificaciones
        );
      }
    }
  }, [getNotificacionesUsuarioPorServicioData]);

  useEffect(() => {
    if (guardarConfiguracionUsuariosNotificacionesData) {
      if (guardarConfiguracionUsuariosNotificacionesData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(guardarConfiguracionUsuariosNotificacionesData.error),
          "warning"
        );
      } else {
        setUsuarioNotificaciones(
          guardarConfiguracionUsuariosNotificacionesData.usuariosNotificaciones
        );
      }
    }
  }, [guardarConfiguracionUsuariosNotificacionesData]);

  if (
    getServiciosEmpresaClienteLoading ||
    agregarServicioEmpresaClienteLoading ||
    cancelarServicioEmpresaClienteLoading ||
    getContenidoServicioClientesLoading ||
    getNotificacionesUsuarioPorServicioLoading ||
    guardarConfiguracionUsuariosNotificacionesLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    getServiciosEmpresaClienteError ||
    agregarServicioEmpresaClienteError ||
    cancelarServicioEmpresaClienteError ||
    getContenidoServicioClientesError ||
    getNotificacionesUsuarioPorServicioError ||
    guardarConfiguracionUsuariosNotificacionesError
  ) {
    return <ErrorQueryDB />;
  }

  const handleOpenDialogContenido = () => {
    setOpenDialogContenido(true);
  };

  const handleCloseDialogContenido = () => {
    setOpenDialogContenido(false);
  };

  const handleOpenDialogConfigurarNotificaciones = () => {
    setOpenDialogConfigurarNotificaciones(true);
  };

  const handleCloseDialogConfigurarNotificaciones = () => {
    setOpenDialogConfigurarNotificaciones(false);
  };

  const handleChangeNotificaciones = (e, index, variable) => {
    let newUsuariosNotificaciones = usuariosNotificaciones.slice();
    switch (variable) {
      case 1:
        newUsuariosNotificaciones[index].notificacionCRM = e.target.checked
          ? 1
          : 0;
        break;
      case 2:
        newUsuariosNotificaciones[index].notificacionCorreo = e.target.checked
          ? 1
          : 0;
        break;
      default:
        newUsuariosNotificaciones[index].notificacionSMS = e.target.checked
          ? 1
          : 0;
        break;
    }

    setUsuarioNotificaciones(newUsuariosNotificaciones);
  };

  const handleClickGuardarUsuarioNotificaciones = () => {
    executeGuardarConfiguracionUsuariosNotificaciones({
      data: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: idSubmenu,
        idservicio: servicioSelected,
        idempresa: idEmpresa,
        usuariosnotificaciones: usuariosNotificaciones,
      },
    });
  };

  const getServicios = () => {
    if (servicios.length > 0) {
      return servicios.map((servicio, index) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.rootCard}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={
                    servicio.download !== null && servicio.download !== ""
                      ? `${servicio.download}/preview`
                      : serviciosImage
                  }
                  title="Servicio"
                  style={{ height: "150px" }}
                />
              </CardActionArea>
              <CardContent style={{ height: "200px", overflowY: "auto" }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <span style={{ color: "#4CAF50" }}>${servicio.precio}</span> -{" "}
                  {servicio.nombreservicio.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {servicio.descripcion}
                </Typography>
              </CardContent>
              <CardActions
                style={{
                  /* bottom: 0, position: "absolute", marginBottom: "15px",  */ height:
                    "50px",
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  style={{
                    flex: "auto",
                  }}
                  onClick={() => {
                    handleOpenDialogContenido();
                    executeGetContenidoServicioClientes({
                      params: {
                        usuario: correo,
                        pwd: password,
                        rfc: rfc,
                        idsubmenu: idSubmenu,
                        idservicio: servicio.id,
                      },
                    });
                  }}
                >
                  Ver Contenido
                </Button>
              </CardActions>
              <CardActions
                style={{
                  /* bottom: 0, position: "absolute", marginBottom: "15px",  */ height:
                    "50px",
                }}
              >
                <Button
                  size="small"
                  color={
                    servicio.statuscontratacion !== 0 ? "primary" : "secondary"
                  }
                  style={{
                    flex: "auto",
                    background: "none",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    cursor: "default",
                    outline: "inherit",
                  }}
                >
                  {servicio.statuscontratacion !== 0
                    ? "Contratado"
                    : "No Contratado"}
                </Button>
                {servicio.statuscontratacion === 0 ? (
                  <Checkbox
                    color="primary"
                    onChange={(e) => {
                      let nuevosIds = detallesServicios.idsServicios;
                      let nuevosPrecios = detallesServicios.preciosServicios;
                      if (e.target.checked) {
                        nuevosIds.push(servicio.id);
                        nuevosPrecios.push(servicio.precio);
                        setDetallesServicios({
                          idsServicios: nuevosIds,
                          preciosServicios: nuevosPrecios,
                        });
                      } else {
                        nuevosIds.filter((id, index) => {
                          if (id === servicio.id) {
                            nuevosIds.splice(index, 1);
                            nuevosPrecios.splice(index, 1);
                            setDetallesServicios({
                              idsServicios: nuevosIds,
                              preciosServicios: nuevosPrecios,
                            });
                          }
                          return null;
                        });
                      }
                      let nuevoTotal = 0;
                      nuevosPrecios.map((precio) => {
                        return (nuevoTotal = nuevoTotal + precio);
                      });
                      setTotalPreciosServicios(nuevoTotal);
                    }}
                  />
                ) : (
                  <Tooltip title="Cancelar Contratación">
                    <IconButton
                      onClick={() => {
                        swal({
                          text: `¿Está seguro de cancelar este servicio?`,
                          buttons: ["No", "Sí"],
                          dangerMode: true,
                        }).then((value) => {
                          if (value) {
                            executeCancelarServicioEmpresaCliente({
                              data: {
                                usuario: correo,
                                pwd: password,
                                rfc: rfc,
                                idsubmenu: idSubmenu,
                                idempresa: idEmpresa,
                                idservicio: servicio.id,
                                fechacancelacion: moment().format("YYYY-MM-DD"),
                                idusuariocancelacion: idUsuario,
                              },
                            });
                          }
                        });
                      }}
                    >
                      <CloseIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      });
    } else {
      return <Typography variant="h6">No hay servicios disponibles</Typography>;
    }
  };

  const getContenido = () => {
    if (contenido.length > 0) {
      return contenido.map((contenido, index) => {
        return (
          <ListItem
            key={index}
            button
            onClick={() => {
              window.open(contenido.url);
            }}
          >
            <ListItemText primary={contenido.nombre} />
            <ListItemSecondaryAction>
              <Tooltip title="Ver">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    window.open(contenido.url);
                  }}
                >
                  <VisibilityIcon style={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Contenido" />
        </ListItem>
      );
    }
  };

  return (
    <div>
      {smScreen ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Grid container>
              <Grid item xs={12}>
                <Tooltip
                  title="Configurar notificaciones"
                  style={{ float: "right" }}
                >
                  <IconButton
                    onClick={handleOpenDialogConfigurarNotificaciones}
                  >
                    <SettingsIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <strong>Pago mensual actual:</strong>
                        </TableCell>
                        <TableCell align="right">{`$${pagoMensual}`}</TableCell>
                      </TableRow>
                    </TableHead>
                    {detallesServicios.idsServicios.length > 0 ? (
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>{`Total de servicios contratados:`}</strong>
                          </TableCell>
                          <TableCell align="right">{`$${totalPrecioServicios}`}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            <strong>Nuevo pago mensual:</strong>
                          </TableCell>
                          <TableCell align="right">{`$${
                            pagoMensual + totalPrecioServicios
                          }`}</TableCell>
                        </TableRow>
                      </TableBody>
                    ) : null}
                  </Table>
                </TableContainer>
              </Grid>
              {detallesServicios.idsServicios.length > 0 ? (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%", marginTop: "15px" }}
                    onClick={() => {
                      executeAgregarServicioEmpresaCliente({
                        data: {
                          usuario: correo,
                          pwd: password,
                          rfc: rfc,
                          idsubmenu: idSubmenu,
                          idempresa: idEmpresa,
                          idservicios: detallesServicios.idsServicios,
                          fechaContratacion: moment().format("YYYY-MM-DD"),
                          idusuariocontratacion: idUsuario,
                        },
                      });
                    }}
                  >
                    Confirmar
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {getServicios()}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {getServicios()}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container>
              <Grid item xs={12}>
                <Tooltip
                  title="Configurar notificaciones"
                  style={{ float: "right" }}
                >
                  <IconButton
                    onClick={handleOpenDialogConfigurarNotificaciones}
                  >
                    <SettingsIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <strong>Pago mensual actual:</strong>
                        </TableCell>
                        <TableCell align="right">{`$${pagoMensual}`}</TableCell>
                      </TableRow>
                    </TableHead>
                    {detallesServicios.idsServicios.length > 0 ? (
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <strong>{`Total de servicios contratados:`}</strong>
                          </TableCell>
                          <TableCell align="right">{`$${totalPrecioServicios}`}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            <strong>Nuevo pago mensual:</strong>
                          </TableCell>
                          <TableCell align="right">{`$${
                            pagoMensual + totalPrecioServicios
                          }`}</TableCell>
                        </TableRow>
                      </TableBody>
                    ) : null}
                  </Table>
                </TableContainer>
              </Grid>
              {detallesServicios.idsServicios.length > 0 ? (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%", marginTop: "15px" }}
                    onClick={() => {
                      executeAgregarServicioEmpresaCliente({
                        data: {
                          usuario: correo,
                          pwd: password,
                          rfc: rfc,
                          idsubmenu: idSubmenu,
                          idempresa: idEmpresa,
                          idservicios: detallesServicios.idsServicios,
                          fechaContratacion: moment().format("YYYY-MM-DD"),
                          idusuariocontratacion: idUsuario,
                        },
                      });
                    }}
                  >
                    Confirmar
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      )}
      <Dialog
        onClose={handleCloseDialogContenido}
        aria-labelledby="simple-dialog-title"
        open={openDialogContenido}
        fullScreen={smScreen}
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">Contenido</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <List
                style={{
                  height: "200px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {getContenido()}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseDialogContenido();
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseDialogConfigurarNotificaciones}
        aria-labelledby="simple-dialog-title"
        open={openDialogConfigurarNotificaciones}
        fullScreen={smScreen}
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="simple-dialog-title">
          Configurar Notificaciones
        </DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={classes.textFields}
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Tipo"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                value={servicioSelected}
                onChange={(e) => {
                  setServicioSelected(parseInt(e.target.value));
                  if (parseInt(e.target.value) !== 0) {
                    executeGetNotificacionesUsuarioPorServicio({
                      params: {
                        usuario: correo,
                        pwd: password,
                        rfc: rfc,
                        idsubmenu: idSubmenu,
                        idempresa: idEmpresa,
                        idservicio: parseInt(e.target.value),
                      },
                    });
                  }
                }}
              >
                <option value={0}>Elija un servicio</option>
                {servicios
                  .filter((servicio) => servicio.statuscontratacion === 1)
                  .map((servicio, index) => (
                    <option value={servicio.id} key={index}>
                      {servicio.nombreservicio}
                    </option>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead style={{ background: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell>
                        <strong>Usuario</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>CRM</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Correo</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>SMS</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {servicioSelected !== 0 ? (
                      usuariosNotificaciones.map(
                        (usuarioNotificacion, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {usuarioNotificacion.usuario}
                            </TableCell>
                            <TableCell align="right">
                              <Checkbox
                                color="primary"
                                /* checked={true}
                              disabled */
                                checked={
                                  usuarioNotificacion.notificacionCRM === 1
                                }
                                onChange={(e) => {
                                  handleChangeNotificaciones(e, index, 1);
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Checkbox
                                color="primary"
                                checked={
                                  usuarioNotificacion.notificacionCorreo === 1
                                }
                                onChange={(e) => {
                                  handleChangeNotificaciones(e, index, 2);
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Checkbox
                                color="primary"
                                checked={
                                  usuarioNotificacion.notificacionSMS === 1
                                }
                                onChange={(e) => {
                                  handleChangeNotificaciones(e, index, 3);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="subtitle1" align="center">
                            Seleccione un servicio
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseDialogConfigurarNotificaciones();
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickGuardarUsuarioNotificaciones}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function createDataMovimientos(
  id,
  fecha,
  documento,
  cargo,
  abono,
  pendienteDocumento,
  saldo,
  acciones
) {
  return {
    id,
    fecha,
    documento,
    cargo,
    abono,
    pendienteDocumento,
    saldo,
    acciones,
  };
}

let filterRowsMovimientos = [];

const headCellsMovimientos = [
  {
    id: "fecha",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "documento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Documento",
  },
  {
    id: "cargo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Cargo",
  },
  {
    id: "abono",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Abono",
  },
  {
    id: "pendienteDocumento",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Pendiente Del Documento",
  },
  {
    id: "saldo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Saldo",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
];

function EstadoDeCuenta(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const idEmpresa = props.idEmpresa;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [idMovimiento, setIdMovimiento] = useState(0);
  const [fechaMovimiento, setFechaMovimiento] = useState("");
  const [documento, setDocumento] = useState("");
  const [importe, setImporte] = useState("");
  const [pendiente, setPendiente] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("0");
  const [archivos, setArchivos] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [openMenuNuevoPago, setOpenMenuNuevoPago] = useState(false);
  const [openMenuInfoMovimiento, setOpenMenuInfoMovimiento] = useState(false);
  const [rutaArchivo, setRutaArchivo] = useState("");
  const [anchorMenuArchivosEl, setAnchorMenuArchivosEl] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Cantidad a pagar", "Realizar pago", "Confirmación de pago"];
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [cantidadPagar, setCantidadPagar] = useState("");

  const [
    {
      data: getMovimientosEmpresaClienteData,
      loading: getMovimientosEmpresaClienteLoading,
      error: getMovimientosEmpresaClienteError,
    },
    executeGetMovimientosEmpresaCliente,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMovimientosEmpresaCliente`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: idSubmenu,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );
  const [
    {
      data: getMovimientoEmpresaClienteData,
      loading: getMovimientoEmpresaClienteLoading,
      error: getMovimientoEmpresaClienteError,
    },
    executeGetMovimientoEmpresaCliente,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getMovimientoEmpresaCliente`,
      method: "GET",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (idSubmenu === 41) {
      executeGetMovimientosEmpresaCliente();
    }
  }, [idSubmenu, executeGetMovimientosEmpresaCliente]);

  useEffect(() => {
    if (getMovimientosEmpresaClienteData) {
      if (getMovimientosEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getMovimientosEmpresaClienteData.error),
          "warning"
        );
      } else {
        //setRows(getMovimientosEmpresaClienteData.movimientos);
        filterRowsMovimientos = [];
        let saldo = 0;
        getMovimientosEmpresaClienteData.movimientos.map((movimiento) => {
          if (movimiento.tipomovimiento === 1) {
            saldo = saldo + movimiento.importe;
          } else {
            //saldo = saldo - (movimiento.importe - movimiento.pendiente);
            saldo = saldo - movimiento.importe;
          }
          return filterRowsMovimientos.push(
            createDataMovimientos(
              movimiento.idmovimiento,
              movimiento.fecha,
              movimiento.documento,
              movimiento.tipomovimiento === 1 ? `$${movimiento.importe}` : "",
              movimiento.tipomovimiento === 2 ? `$${movimiento.importe}` : "",
              `$${movimiento.pendiente}`,
              `$${saldo}`,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setSaldoPendiente(saldo);
        setRows(filterRowsMovimientos);
      }
    }
  }, [getMovimientosEmpresaClienteData]);

  useEffect(() => {
    if (getMovimientoEmpresaClienteData) {
      if (getMovimientoEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getMovimientoEmpresaClienteData.error),
          "warning"
        );
      } else {
        setFechaMovimiento(getMovimientoEmpresaClienteData.movimiento[0].fecha);
        setDocumento(getMovimientoEmpresaClienteData.movimiento[0].documento);
        setImporte(getMovimientoEmpresaClienteData.movimiento[0].importe);
        setPendiente(getMovimientoEmpresaClienteData.movimiento[0].pendiente);
        setTipoMovimiento(
          getMovimientoEmpresaClienteData.movimiento[0].tipomovimiento
        );
        setArchivos(getMovimientoEmpresaClienteData.archivos);
        setAbonos(getMovimientoEmpresaClienteData.abonos);
        setCargos(getMovimientoEmpresaClienteData.cargos);
      }
    }
  }, [getMovimientoEmpresaClienteData]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsMovimientos.length; x++) {
        if (
          filterRowsMovimientos[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRowsMovimientos[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].documento
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].cargo
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].abono
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsMovimientos[x].saldo
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsMovimientos[x]);
        }
      }
      return dataFilter;
    }

    setRows(
      busquedaFiltro.trim() !== "" ? getFilterRows() : filterRowsMovimientos
    );
    setPage(rows.length < rowsPerPage ? 0 : page);
  }, [busquedaFiltro, setRows, rows.length, rowsPerPage, page]);

  if (
    getMovimientosEmpresaClienteLoading ||
    getMovimientoEmpresaClienteLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getMovimientosEmpresaClienteError || getMovimientoEmpresaClienteError) {
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

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleOpenMenuNuevoPago = () => {
    setOpenMenuNuevoPago(true);
  };

  const handleCloseMenuNuevoPago = () => {
    setOpenMenuNuevoPago(false);
  };

  const handleOpenMenuInfoMovimiento = () => {
    setOpenMenuInfoMovimiento(true);
  };

  const handleCloseMenuInfoMovimiento = () => {
    setOpenMenuInfoMovimiento(false);
  };

  const handleOpenMenuArchivos = (event) => {
    setAnchorMenuArchivosEl(event.currentTarget);
  };

  const handleCloseMenuArchivos = () => {
    setAnchorMenuArchivosEl(null);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Paso1NuevoPago
            saldoPendiente={saldoPendiente}
            cantidadPagar={cantidadPagar}
            setCantidadPagar={setCantidadPagar}
          />
        );
      case 1:
        return "What is an ad group anyways?";
      case 2:
        return "This is the bit I really care about!";
      default:
        return "Unknown stepIndex";
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && cantidadPagar.trim() === "") {
      swal("Error", "Ingrese un importe a pagar", "warning");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getArchivosMovimiento = () => {
    if (archivos.length > 0) {
      return archivos.map((archivo, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={archivo.documento}
              secondary={archivo.fecha}
            />
            <ListItemSecondaryAction>
              <Tooltip title="Opciones">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    handleOpenMenuArchivos(e);
                    setRutaArchivo(archivo.download);
                  }}
                >
                  <SettingsEthernetIcon sryle={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Archivos" />
        </ListItem>
      );
    }
  };

  const getAbonosMovimiento = () => {
    if (abonos.length > 0) {
      return abonos.map((abono, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={`Importe: $${abono.importe}`}
              secondary={`${abono.documento} (${abono.fecha})`}
            />
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Abonos" />
        </ListItem>
      );
    }
  };

  const getCargosMovimiento = () => {
    if (cargos.length > 0) {
      return cargos.map((cargo, index) => {
        return (
          <ListItem key={index} button>
            <ListItemText
              primary={`Importe: $${cargo.abono}`}
              secondary={`${cargo.documento} (${cargo.fecha})`}
            />
          </ListItem>
        );
      });
    } else {
      return (
        <ListItem>
          <ListItemText primary="Sin Cargos" />
        </ListItem>
      );
    }
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
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
              <Tooltip title="Agregar Pago">
                <IconButton
                  aria-label="agregarPago"
                  style={{ float: "right" }}
                  onClick={() => {
                    handleOpenMenuNuevoPago();
                  }}
                >
                  <MonetizationOnIcon style={{ color: "#4CAF50" }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
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
              headCells={headCellsMovimientos}
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
                        <TableCell align="right" id={labelId}>
                          {row.fecha}
                        </TableCell>
                        <TableCell align="right">{row.documento}</TableCell>
                        <TableCell align="right">{row.cargo}</TableCell>
                        <TableCell align="right">{row.abono}</TableCell>
                        <TableCell align="right">
                          {row.pendienteDocumento}
                        </TableCell>
                        <TableCell align="right">{row.saldo}</TableCell>
                        <TableCell
                          align="right"
                          onClick={(e) => {
                            handleOpenMenu(e);
                            setIdMovimiento(row.id);
                          }}
                        >
                          {row.acciones}
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
                      No hay movimientos disponibles
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
            executeGetMovimientoEmpresaCliente({
              params: {
                usuario: correo,
                pwd: password,
                rfc: rfc,
                idsubmenu: idSubmenu,
                idmovimiento: idMovimiento,
              },
            });
            handleOpenMenuInfoMovimiento();
          }}
        >
          <ListItemText primary="Información" />
        </MenuItem>
      </StyledMenu>
      <Dialog
        onClose={handleCloseMenuNuevoPago}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuNuevoPago}
        maxWidth="lg"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="simple-dialog-title">Agregar Pago</DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>
                {activeStep === steps.length ? (
                  <div>
                    <Typography className={classes.instructions}>
                      All steps completed
                    </Typography>
                    <Button onClick={handleReset}>Reset</Button>
                  </div>
                ) : (
                  <div>
                    {getStepContent(activeStep)}
                    <div style={{ textAlign: "center", marginTop: "15px" }}>
                      <Button
                        disabled={activeStep === 0}
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
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuNuevoPago();
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleCloseMenuInfoMovimiento}
        aria-labelledby="simple-dialog-title"
        fullScreen={fullScreenDialog}
        open={openMenuInfoMovimiento}
        maxWidth="lg"
      >
        <DialogTitle id="simple-dialog-title">
          Información Movimiento
        </DialogTitle>
        <DialogContent dividers>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="fecha"
                className={classes.textFields}
                disabled
                label="Fecha"
                type="date"
                value={fechaMovimiento}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="documento"
                className={classes.textFields}
                disabled
                label="Documento"
                type="text"
                margin="normal"
                value={documento}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="importeTotal"
                className={classes.textFields}
                label="Importe Total"
                type="text"
                margin="normal"
                value={importe}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="importePendiente"
                className={classes.textFields}
                disabled
                label="Importe Pendiente"
                type="text"
                margin="normal"
                value={pendiente}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="tipoMovimiento"
                className={classes.textFields}
                label="Tipo De Movimiento"
                select
                SelectProps={{
                  native: true,
                }}
                value={tipoMovimiento}
                disabled
                margin="normal"
              >
                <option value="0">Seleccione un tipo</option>
                <option value="1">Cargo</option>
                <option value="2">Abono</option>
              </TextField>
            </Grid>

            <Grid item xs={12} style={{ marginTop: "15px" }}>
              <Grid container justify="center" spacing={5}>
                <Grid item xs={12} md={6}>
                  <Grid container justify="center" spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        {tipoMovimiento === 1 ? "Abonos" : "Cargos"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        border: "solid black 1px",
                        padding: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <List
                        style={{
                          height: "200px",
                          maxHeight: "200px",
                          overflow: "auto",
                        }}
                      >
                        {tipoMovimiento === 1
                          ? getAbonosMovimiento()
                          : getCargosMovimiento()}
                      </List>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container justify="center" spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">Archivos</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        border: "solid black 1px",
                        padding: "10px",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <List
                        style={{
                          height: "200px",
                          maxHeight: "200px",
                          overflow: "auto",
                        }}
                      >
                        {getArchivosMovimiento()}
                      </List>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleCloseMenuInfoMovimiento();
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuArchivosEl}
        keepMounted
        open={Boolean(anchorMenuArchivosEl)}
        onClose={handleCloseMenuArchivos}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenuArchivos();
            window.open(rutaArchivo);
          }}
        >
          <ListItemText primary="Ver" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenuArchivos();
            window.open(`${rutaArchivo}/download`);
          }}
        >
          <ListItemText primary="Descargar" />
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function Paso1NuevoPago(props) {
  const classes = useStyles();
  const saldoPendiente = props.saldoPendiente;
  const cantidadPagar = props.cantidadPagar;
  const setCantidadPagar = props.setCantidadPagar;

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ textAlign: "center" }}>
          Saldo pendiente: {saldoPendiente}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="salgopagar"
          className={classes.textFields}
          label="Importe a pagar"
          type="text"
          margin="normal"
          value={cantidadPagar}
          inputProps={{
            maxLength: 10,
          }}
          onKeyPress={(e) => {
            doubleKeyValidation(e, 2);
          }}
          onChange={(e) => {
            doublePasteValidation(e, 2);
            setCantidadPagar(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
}

/* function createDataServicios(
  id,
  servicio,
  precio,
  descripcion,
  tipo,
  fecha,
  estatus,
  acciones
) {
  return { id, servicio, precio, descripcion, tipo, fecha, estatus, acciones };
}

let filterRowsServicios = []; */
/* const headCellsServicios = [
  {
    id: "servicio",
    align: "left",
    sortHeadCell: true,
    disablePadding: true,
    label: "Servicio",
  },
  {
    id: "precio",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Precio",
  },
  {
    id: "descripcion",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Descripción",
  },
  {
    id: "tipo",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Tipo",
  },
  {
    id: "fecha",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Fecha",
  },
  {
    id: "estatus",
    align: "right",
    sortHeadCell: true,
    disablePadding: false,
    label: "Estatus",
  },
  {
    id: "acciones",
    align: "right",
    sortHeadCell: false,
    disablePadding: false,
    label: <SettingsIcon style={{ color: "black" }} />,
  },
]; */
/* function ServiciosContratados(props) {
  const classes = useStyles();
  const correo = props.correo;
  const password = props.password;
  const setLoading = props.setLoading;
  const idEmpresa = props.idEmpresa;
  const rfc = props.rfc;
  const idSubmenu = props.idSubmenu;
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [busquedaFiltro, setBusquedaFiltro] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [
    {
      data: getServiciosEmpresaClienteData,
      loading: getServiciosEmpresaClienteLoading,
      error: getServiciosEmpresaClienteError,
    },
    executeGetServiciosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/getServiciosEmpresaCliente`,
      method: "GET",
      params: {
        usuario: correo,
        pwd: password,
        rfc: rfc,
        idsubmenu: idSubmenu,
        idempresa: idEmpresa,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (idSubmenu === 40) {
      executeGetServiciosEmpresa();
    }
  }, [idSubmenu, executeGetServiciosEmpresa]);

  useEffect(() => {
    if (getServiciosEmpresaClienteData) {
      if (getServiciosEmpresaClienteData.error !== 0) {
        swal(
          "Error",
          dataBaseErrores(getServiciosEmpresaClienteData.error),
          "warning"
        );
      } else {
        filterRowsServicios = [];
        getServiciosEmpresaClienteData.servicios.map((servicio) => {
          return filterRowsServicios.push(
            createDataServicios(
              servicio.id,
              servicio.nombreservicio,
              servicio.precio,
              servicio.descripcion,
              servicio.tipo,
              servicio.fecha,
              servicio.status,
              <IconButton>
                <SettingsEthernetIcon style={{ color: "black" }} />
              </IconButton>
            )
          );
        });
        setRows(filterRowsServicios);
      }
    }
  }, [getServiciosEmpresaClienteData, setRows]);

  useEffect(() => {
    function getFilterRows() {
      let dataFilter = [];
      for (let x = 0; x < filterRowsServicios.length; x++) {
        if (
          filterRowsServicios[x].servicio
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsServicios[x].precio
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsServicios[x].descripcion
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsServicios[x].tipo
            .toString()
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          filterRowsServicios[x].fecha
            .toLowerCase()
            .indexOf(busquedaFiltro.toLowerCase()) !== -1 ||
          moment(filterRowsServicios[x].fecha)
            .format("DD/MM/YYYY h:mm:ss a")
            .indexOf(busquedaFiltro.toLowerCase()) !== -1
        ) {
          dataFilter.push(filterRowsServicios[x]);
        }
      }
      return dataFilter;
    }

    setRows(
      busquedaFiltro.trim() !== "" ? getFilterRows() : filterRowsServicios
    );
    setPage(rows.length < rowsPerPage ? 0 : page);
  }, [busquedaFiltro, setRows, rows.length, rowsPerPage, page]);

  if (getServiciosEmpresaClienteLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getServiciosEmpresaClienteError) {
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
      <Paper className={classes.paper}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
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
            <Grid item xs={12} sm={12} md={6}>
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
              headCells={headCellsServicios}
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
                          {row.servicio}
                        </TableCell>
                        <TableCell align="right">{`$${row.precio}`}</TableCell>
                        <TableCell align="right">{row.descripcion}</TableCell>
                        <TableCell align="right">{row.tipo}</TableCell>
                        <TableCell align="right">{row.fecha}</TableCell>
                        <TableCell align="right">
                          {row.estatus === 1 ? "Activo" : "Inactivo"}
                        </TableCell>
                        <TableCell align="right">{row.acciones}</TableCell>
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
                      No hay servicios disponibles
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
    </div>
  );
} */
