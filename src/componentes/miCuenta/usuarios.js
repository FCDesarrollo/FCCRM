import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Button,
  Typography,
  IconButton,
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormGroup,
  Checkbox,
  useMediaQuery,
  Paper,
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Assessment as AssessmentIcon,
  AccountBox as AccountBoxIcon,
  Email as EmailIcon,
  Minimize as MinimizeIcon,
  Star as StarIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  keyValidation,
  pasteValidation,
  validarCorreo,
} from "../../helpers/inputHelpers";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import jwt from "jsonwebtoken";
import moment from "moment";

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
  textFields: {
    width: "100%",
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
}));

export default function Usuarios(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const usuarioDatos = props.usuarioDatos;
  const idUsuario = usuarioDatos.idusuario;
  const empresaDatos = props.empresaDatos;
  const statusEmpresa = empresaDatos.statusempresa;
  const nombreEmpresa = empresaDatos.nombreempresa;
  const idEmpresa = empresaDatos.idempresa;
  const usuario = usuarioDatos.correo;
  const pwd = usuarioDatos.password;
  const rfc = empresaDatos.RFC;
  const setLoading = props.setLoading;
  const setExecuteQueriesHeader = props.setExecuteQueriesHeader;
  const [permisosSubmenu, setPermisosSubmenu] = useState(-1);
  const [errorDB, setErrorDB] = useState(false);
  const [idUsuarioEditar, setIdUsuarioEditar] = useState(0);
  const [expanded, setExpanded] = useState([]);
  const [mensajeErrorDB, setMensajeErrorDB] = useState("");
  const [showComponent, setShowComponent] = useState(0);
  const [idSubmenuActual, setIdSubmenuActua] = useState(0);
  const [
    {
      data: listaUsuariosEmpresaData,
      loading: listaUsuariosEmpresaLoading,
      error: listaUsuariosEmpresaError,
    },
    executeListaUsuariosEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaUsuariosEmpresa`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 21,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    for (let x = 0; x < submenuContent.length; x++) {
      //console.log(submenuContent[x].submenu.idsubmenu, idSubmenu);
      if (submenuContent[x].submenu.idsubmenu === idSubmenuActual) {
        setPermisosSubmenu(submenuContent[x].permisos);
        /* const token = jwt.sign(
          {
            menuTemporal: {
              showComponent: showComponent,
              permisosSubmenu: submenuContent[x].permisos,
              submenuActual: idSubmenuActual
            }
          },
          "mysecretpassword"
        );
        localStorage.setItem("menuTemporal", token); */
      }
    }
  }, [idSubmenuActual, submenuContent, showComponent]);

  useEffect(() => {
    if (showComponent === 0 && permisosSubmenu === -1) {
      if (localStorage.getItem("menuTemporal")) {
        try {
          const decodedToken = jwt.verify(
            localStorage.getItem("menuTemporal"),
            "mysecretpassword"
          );
          setShowComponent(decodedToken.menuTemporal.showComponent);
          if (permisosSubmenu === -1) {
            setPermisosSubmenu(decodedToken.menuTemporal.permisosSubmenu);
          }
          setIdUsuarioEditar(
            decodedToken.menuTemporal.idUsuarioEditar
              ? decodedToken.menuTemporal.idUsuarioEditar
              : 0
          );
          setExpanded(
            decodedToken.menuTemporal.treeNodes
              ? decodedToken.menuTemporal.treeNodes
              : []
          );
          setIdSubmenuActua(decodedToken.menuTemporal.idSubmenuActual);
        } catch (err) {
          localStorage.removeItem("menuTemporal");
        }
      }
    }
  }, [showComponent, permisosSubmenu]);

  useEffect(() => {
    function checkData() {
      if (listaUsuariosEmpresaData) {
        if (listaUsuariosEmpresaData.error !== 0) {
          setMensajeErrorDB(dataBaseErrores(listaUsuariosEmpresaData.error));
          setErrorDB(true);
        }
      }
    }

    checkData();
  }, [listaUsuariosEmpresaData]);

  if (listaUsuariosEmpresaLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (listaUsuariosEmpresaError) {
    return <ErrorQueryDB />;
  }

  return errorDB ? (
    <ErrorQueryDB mensaje={mensajeErrorDB} />
  ) : (
    <div>
      <Card className={classes.card}>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={11}>
            <Typography variant="h6" className={classes.title}>
              Usuarios
            </Typography>
          </Grid>
          {submenuContent.map((content, index) => {
            if (
              (showComponent === 1 &&
                content.submenu.idsubmenu === 21 &&
                content.permisos === 0) ||
              (showComponent === 2 &&
                content.submenu.idsubmenu === 42 &&
                content.permisos === 0) ||
              (showComponent === 3 &&
                content.submenu.idsubmenu === 43 &&
                content.permisos === 0)
            ) {
              setShowComponent(0);
              localStorage.removeItem("menuTemporal");
            }
            return content.submenu.orden !== 0 ? (
              <Grid
                item
                xs={12}
                md={4}
                key={index}
                style={{ marginBottom: "10px" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={content.permisos === 0}
                  className={classes.buttons}
                  onClick={() => {
                    setIdSubmenuActua(content.submenu.idsubmenu);
                    setShowComponent(
                      content.submenu.idsubmenu === 21
                        ? 1
                        : content.submenu.idsubmenu === 42
                        ? 2
                        : 3
                    );
                    setPermisosSubmenu(content.permisos);
                    setExpanded([]);
                    const token = jwt.sign(
                      {
                        menuTemporal: {
                          showComponent:
                            content.submenu.idsubmenu === 21
                              ? 1
                              : content.submenu.idsubmenu === 42
                              ? 2
                              : 3,
                          permisosSubmenu: content.permisos,
                          idSubmenuActual: content.submenu.idsubmenu,
                        },
                      },
                      "mysecretpassword"
                    );
                    localStorage.setItem("menuTemporal", token);
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
        <Grid container justify="center">
          <Grid item xs={12} md={11}>
            {showComponent === 1 ? (
              <ListaUsuarios
                permisosSubmenu={permisosSubmenu}
                listaUsuariosEmpresaData={listaUsuariosEmpresaData}
                setShowComponent={setShowComponent}
                executeListaUsuariosEmpresa={executeListaUsuariosEmpresa}
                setIdUsuarioEditar={setIdUsuarioEditar}
                idSubmenuActual={idSubmenuActual}
                usuario={usuario}
                pwd={pwd}
                rfc={rfc}
                setLoading={setLoading}
                statusEmpresa={statusEmpresa}
              />
            ) : showComponent === 2 ? (
              <CrearUsuario
                permisosSubmenu={permisosSubmenu}
                setShowComponent={setShowComponent}
                executeListaUsuariosEmpresa={executeListaUsuariosEmpresa}
                usuario={usuario}
                idUsuario={idUsuario}
                pwd={pwd}
                rfc={rfc}
                idEmpresa={idEmpresa}
                idSubmenu={idSubmenuActual}
                setLoading={setLoading}
                statusEmpresa={statusEmpresa}
              />
            ) : showComponent === 3 ? (
              <VincularUsuario
                permisosSubmenu={permisosSubmenu}
                setShowComponent={setShowComponent}
                executeListaUsuariosEmpresa={executeListaUsuariosEmpresa}
                usuario={usuario}
                idUsuario={idUsuario}
                pwd={pwd}
                rfc={rfc}
                idEmpresa={idEmpresa}
                nombreEmpresa={nombreEmpresa}
                idSubmenu={idSubmenuActual}
                setLoading={setLoading}
                statusEmpresa={statusEmpresa}
              />
            ) : showComponent === 4 ? (
              <EditarPermisosUsuario
                permisosSubmenu={permisosSubmenu}
                setPermisosSubmenu={setPermisosSubmenu}
                setShowComponent={setShowComponent}
                setLoading={setLoading}
                usuario={usuario}
                pwd={pwd}
                rfc={rfc}
                idUsuarioEditar={idUsuarioEditar}
                setExecuteQueriesHeader={setExecuteQueriesHeader}
                expanded={expanded}
                setExpanded={setExpanded}
                idSubmenuActual={idSubmenuActual}
              />
            ) : showComponent === 5 ? (
              <EditarNotificacionesUsuario
                permisosSubmenu={permisosSubmenu}
                setPermisosSubmenu={setPermisosSubmenu}
                setShowComponent={setShowComponent}
                setLoading={setLoading}
                usuario={usuario}
                pwd={pwd}
                rfc={rfc}
                idUsuarioEditar={idUsuarioEditar}
                idEmpresa={idEmpresa}
                setExecuteQueriesHeader={setExecuteQueriesHeader}
                expanded={expanded}
                setExpanded={setExpanded}
                idSubmenuActual={idSubmenuActual}
              />
            ) : null}
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

function ListaUsuarios(props) {
  const classes = useStyles();
  const permisosSubmenu = props.permisosSubmenu;
  const statusEmpresa = props.statusEmpresa;
  const executeListaUsuariosEmpresa = props.executeListaUsuariosEmpresa;
  const listaUsuariosEmpresaData = props.listaUsuariosEmpresaData;
  const setShowComponent = props.setShowComponent;
  const setIdUsuarioEditar = props.setIdUsuarioEditar;
  const idSubmenuActual = props.idSubmenuActual;
  const usuarioActual = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const setLoading = props.setLoading;
  const [
    {
      data: desvinculaUsuarioData,
      loading: desvinculaUsuarioLoading,
      error: desvinculaUsuarioError,
    },
    executeDesvinculaUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/desvinculaUsuario`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: eliminaUsuarioEmpresaData,
      loading: eliminaUsuarioEmpresaLoading,
      error: eliminaUsuarioEmpresaError,
    },
    executeEliminaUsuarioEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaUsuarioEmpresa`,
      method: "DELETE",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (desvinculaUsuarioData) {
        if (desvinculaUsuarioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(desvinculaUsuarioData.error),
            "warning"
          );
        } else {
          swal(
            desvinculaUsuarioData.estatus === "0"
              ? "Usuario Desvinculado"
              : "Usuario Vinculado",
            desvinculaUsuarioData.estatus === "0"
              ? "Usuario desvinculado con éxito"
              : "Usuario vinculado con éxito",
            "success"
          );
          executeListaUsuariosEmpresa();
        }
      }
    }

    checkData();
  }, [desvinculaUsuarioData, executeListaUsuariosEmpresa]);

  useEffect(() => {
    function checkData() {
      if (eliminaUsuarioEmpresaData) {
        if (eliminaUsuarioEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminaUsuarioEmpresaData.error),
            "warning"
          );
        } else {
          swal("Usuario Eliminado", "Usuario eliminado con éxito", "success");
          executeListaUsuariosEmpresa();
        }
      }
    }

    checkData();
  }, [eliminaUsuarioEmpresaData, executeListaUsuariosEmpresa]);

  if (desvinculaUsuarioLoading || eliminaUsuarioEmpresaLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (desvinculaUsuarioError || eliminaUsuarioEmpresaError) {
    return <ErrorQueryDB />;
  }

  const getListaUsuariosEmpresa = () => {
    return listaUsuariosEmpresaData.usuarios ? (
      listaUsuariosEmpresaData.usuarios.map((usuario, index) => {
        return (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {`${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`}
            </TableCell>
            <TableCell align="right">
              {usuario.estatus_vinculacion === 1 ? "Vinculado" : "No Vinculado"}
            </TableCell>
            <TableCell align="right">
              <Tooltip title="Editar notificaciones">
                <span>
                  <IconButton
                    disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
                    onClick={() => {
                      setIdUsuarioEditar(usuario.idusuario);
                      setShowComponent(5);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            showComponent: 5,
                            idUsuarioEditar: usuario.idusuario,
                            permisosSubmenu: permisosSubmenu,
                            idSubmenuActual: idSubmenuActual,
                          },
                        },
                        "mysecretpassword"
                      );
                      localStorage.setItem("menuTemporal", token);
                    }}
                  >
                    <NotificationsIcon
                      style={{
                        color:
                          permisosSubmenu < 2 || statusEmpresa !== 1
                            ? "disabled"
                            : "#3f51b5",
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Editar permisos">
                <span>
                  <IconButton
                    disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
                    onClick={() => {
                      setIdUsuarioEditar(usuario.idusuario);
                      setShowComponent(4);
                      const token = jwt.sign(
                        {
                          menuTemporal: {
                            showComponent: 4,
                            idUsuarioEditar: usuario.idusuario,
                            permisosSubmenu: permisosSubmenu,
                            idSubmenuActual: idSubmenuActual,
                          },
                        },
                        "mysecretpassword"
                      );
                      localStorage.setItem("menuTemporal", token);
                    }}
                  >
                    <EditIcon
                      style={{
                        color:
                          permisosSubmenu < 2 || statusEmpresa !== 1
                            ? "disabled"
                            : "black",
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
              {usuario.estatus_vinculacion === 1 ? (
                <Tooltip title="Desvincular">
                  <span>
                    <IconButton
                      disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
                      onClick={() => {
                        swal({
                          text: "¿Está seguro de desvincular este usuario?",
                          buttons: ["No", "Sí"],
                          dangerMode: true,
                        }).then((value) => {
                          if (value) {
                            executeDesvinculaUsuario({
                              params: {
                                usuario: usuarioActual,
                                pwd: pwd,
                                rfc: rfc,
                                idsubmenu: 21,
                                idusuario: usuario.idusuario,
                                estatus: 0,
                              },
                            });
                          }
                        });
                      }}
                    >
                      <LinkOffIcon
                        style={{
                          color:
                            permisosSubmenu < 2 || statusEmpresa !== 1
                              ? "disabled"
                              : "#ffc400",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Vincular">
                  <span>
                    <IconButton
                      disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
                      onClick={() => {
                        swal({
                          text: "¿Está seguro de vincular este usuario?",
                          buttons: ["No", "Sí"],
                          dangerMode: true,
                        }).then((value) => {
                          if (value) {
                            executeDesvinculaUsuario({
                              params: {
                                usuario: usuarioActual,
                                pwd: pwd,
                                rfc: rfc,
                                idsubmenu: 21,
                                idusuario: usuario.idusuario,
                                estatus: 1,
                              },
                            });
                          }
                        });
                      }}
                    >
                      <LinkIcon
                        style={{
                          color:
                            permisosSubmenu < 2 || statusEmpresa !== 1
                              ? "disabled"
                              : "#ffc400",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip title="Eliminar usuario">
                <span>
                  <IconButton
                    disabled={permisosSubmenu !== 3 || statusEmpresa !== 1}
                    onClick={() => {
                      swal({
                        text: "¿Está seguro de eliminar este usuario?",
                        buttons: ["No", "Sí"],
                        dangerMode: true,
                      }).then((value) => {
                        if (value) {
                          executeEliminaUsuarioEmpresa({
                            params: {
                              usuario: usuarioActual,
                              pwd: pwd,
                              rfc: rfc,
                              idsubmenu: 21,
                              idusuario: usuario.idusuario,
                            },
                          });
                        }
                      });
                    }}
                  >
                    <DeleteIcon
                      color={
                        permisosSubmenu !== 3 || statusEmpresa !== 1
                          ? "disabled"
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
        <TableCell colSpan={3}>
          <Typography variant="subtitle1">
            <ErrorIcon style={{ color: "red", verticalAlign: "sub" }} />
            No hay usuarios
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.title}>
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
                localStorage.removeItem("menuTemporal");
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
          Lista de Usuarios
        </Typography>
      </Grid>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead style={{ background: "#FAFAFA" }}>
            <TableRow>
              <TableCell>
                <strong>Nombre Usuario</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Estatus</strong>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Acciones">
                  <SettingsIcon />
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{getListaUsuariosEmpresa()}</TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  treeView: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
  },
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
            display: matches ? "flex" : "block",
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
        "--tree-view-bg-color": bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

function EditarPermisosUsuario(props) {
  //const classes = useStyles();
  const TreeClasses = useTreeItemStyles();
  const setShowComponent = props.setShowComponent;
  const permisosSubmenu = props.permisosSubmenu;
  const setPermisosSubmenu = props.setPermisosSubmenu;
  const setLoading = props.setLoading;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idUsuarioEditar = props.idUsuarioEditar;
  const setExecuteQueriesHeader = props.setExecuteQueriesHeader;
  const expanded = props.expanded;
  const setExpanded = props.setExpanded;
  const idSubmenuActual = props.idSubmenuActual;
  const [permiso, setPermiso] = useState(-1);
  const [idModulo, setIdModulo] = useState(0);
  const [idMenu, setIdMenu] = useState(0);
  const [idSubmenu, setIdSubmenu] = useState(0);
  const [sumaSubmenuNotificacion, setSumaSubmenuNotificacion] = useState(-1);
  const [{ data: menuData, loading: menuLoading, error: menuError }] = useAxios(
    {
      url: API_BASE_URL + `/menuWeb`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    { data: permisosData, loading: permisosLoading, error: permisosError },
    executePermisos,
  ] = useAxios(
    {
      url: API_BASE_URL + `/permisosUsuarioGeneral`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idusuario: idUsuarioEditar,
        idsubmenu: 21,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: modificaPermisosModuloData,
      loading: modificaPermisosModuloLoading,
      error: modificaPermisosModuloError,
    },
    executeModificaPermisosModulo,
  ] = useAxios(
    {
      url: API_BASE_URL + `/modificaPermisoModulo`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: modificaPermisosMenuData,
      loading: modificaPermisosMenuLoading,
      error: modificaPermisosMenuError,
    },
    executeModificaPermisosMenu,
  ] = useAxios(
    {
      url: API_BASE_URL + `/modificaPermisoMenu`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: modificaPermisosSubmenuData,
      loading: modificaPermisosSubmenuLoading,
      error: modificaPermisosSubmenuError,
    },
    executeModificaPermisosSubmenu,
  ] = useAxios(
    {
      url: API_BASE_URL + `/modificaPermisoSubmenu`,
      method: "PUT",
    },
    {
      manual: true,
    }
  );
  const [
    {
      data: modificaNotificacionesSubmenuData,
      loading: modificaNotificacionesSubmenuLoading,
      error: modificaNotificacionesSubmenuError,
    },
    executeModificaNotificacionesSubmenu,
  ] = useAxios(
    {
      url: API_BASE_URL + `/editaNotificacion`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (idModulo !== 0 && permiso !== -1) {
      executeModificaPermisosModulo({
        params: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idusuario: idUsuarioEditar,
          idsubmenu: 21,
          permiso: permiso,
          idmodulo: idModulo,
        },
      });
      setIdModulo(0);
      setPermiso(-1);
    }
  }, [
    idModulo,
    permiso,
    usuario,
    pwd,
    rfc,
    idUsuarioEditar,
    executeModificaPermisosModulo,
  ]);

  useEffect(() => {
    function checkData() {
      if (modificaPermisosModuloData) {
        if (modificaPermisosModuloData.error !== 0) {
          swal(
            "Error al cambiar permisos",
            dataBaseErrores(modificaPermisosModuloData.error),
            "warning"
          );
        } else {
          /* swal(
            "Cambio de permisos exitoso",
            "Se han cambiado los permisos con éxito",
            "success"
          ); */
          //executePermisos();
          setExecuteQueriesHeader(true);
        }
      }
    }

    checkData();
  }, [modificaPermisosModuloData, executePermisos, setExecuteQueriesHeader]);

  useEffect(() => {
    if (idMenu !== 0 && permiso !== -1) {
      executeModificaPermisosMenu({
        params: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idusuario: idUsuarioEditar,
          idsubmenu: 21,
          permiso: permiso,
          idmenu: idMenu,
        },
      });
      setIdMenu(0);
      setPermiso(-1);
    }
  }, [
    idMenu,
    permiso,
    usuario,
    pwd,
    rfc,
    idUsuarioEditar,
    executeModificaPermisosMenu,
  ]);

  useEffect(() => {
    function checkData() {
      if (modificaPermisosMenuData) {
        if (modificaPermisosMenuData.error !== 0) {
          swal(
            "Error al cambiar permisos",
            dataBaseErrores(modificaPermisosMenuData.error),
            "warning"
          );
        } else {
          /* swal(
            "Cambio de permisos exitoso",
            "Se han cambiado los permisos con éxito",
            "success"
          ); */
          setExecuteQueriesHeader(true);
        }
      }
    }

    checkData();
  }, [modificaPermisosMenuData, setExecuteQueriesHeader]);

  useEffect(() => {
    if (idSubmenu !== 0 && permiso !== -1) {
      executeModificaPermisosSubmenu({
        params: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idusuario: idUsuarioEditar,
          idsubmenu: 21,
          permiso: permiso,
          modidsubmenu: idSubmenu,
        },
      });
      setIdSubmenu(0);
    }
  }, [
    idSubmenu,
    permiso,
    usuario,
    pwd,
    rfc,
    idUsuarioEditar,
    executeModificaPermisosSubmenu,
  ]);

  useEffect(() => {
    function checkData() {
      if (modificaPermisosSubmenuData && permiso !== -1) {
        if (modificaPermisosSubmenuData.error !== 0) {
          swal(
            "Error al cambiar permisos",
            dataBaseErrores(modificaPermisosSubmenuData.error),
            "warning"
          );
        } else {
          /* swal(
            "Cambio de permisos exitoso",
            "Se han cambiado los permisos con éxito",
            "success"
          ); */
          const token = jwt.sign(
            {
              menuTemporal: {
                showComponent: 4,
                idUsuarioEditar: idUsuarioEditar,
                permisosSubmenu: permiso,
                treeNodes: expanded,
                idSubmenuActual: idSubmenuActual,
              },
            },
            "mysecretpassword"
          );
          localStorage.setItem("menuTemporal", token);
          setExecuteQueriesHeader(true);
        }
      }
    }

    checkData();
  }, [
    modificaPermisosSubmenuData,
    setExecuteQueriesHeader,
    permiso,
    idUsuarioEditar,
    expanded,
    idSubmenuActual,
  ]);

  useEffect(() => {
    if (idSubmenu !== 0 && sumaSubmenuNotificacion !== -1) {
      executeModificaNotificacionesSubmenu({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idusuario: idUsuarioEditar,
          idsubmenu: 21,
          notificacion: sumaSubmenuNotificacion,
          idsubmenuMod: idSubmenu,
        },
      });
      setIdSubmenu(0);
    }
  }, [
    sumaSubmenuNotificacion,
    idSubmenu,
    executeModificaNotificacionesSubmenu,
    idUsuarioEditar,
    pwd,
    rfc,
    usuario,
  ]);

  useEffect(() => {
    function checkData() {
      if (modificaNotificacionesSubmenuData && sumaSubmenuNotificacion !== -1) {
        if (modificaNotificacionesSubmenuData.error !== 0) {
          swal(
            "Error al cambiar permisos de notificación",
            dataBaseErrores(modificaNotificacionesSubmenuData.error),
            "warning"
          );
        } else {
          swal(
            "Cambio de permisos de notificación exitoso",
            "Se han cambiado los permisos de notificación con éxito",
            "success"
          );
          const token = jwt.sign(
            {
              menuTemporal: {
                showComponent: 4,
                idUsuarioEditar: idUsuarioEditar,
                permisosSubmenu: permisosSubmenu,
                treeNodes: expanded,
                idSubmenuActual: idSubmenuActual,
              },
            },
            "mysecretpassword"
          );
          localStorage.setItem("menuTemporal", token);
          setExecuteQueriesHeader(true);
        }
      }
    }

    checkData();
  }, [
    modificaNotificacionesSubmenuData,
    setExecuteQueriesHeader,
    permisosSubmenu,
    sumaSubmenuNotificacion,
    setPermisosSubmenu,
    idUsuarioEditar,
    expanded,
    idSubmenuActual,
  ]);

  if (
    menuLoading ||
    permisosLoading ||
    modificaPermisosModuloLoading ||
    modificaPermisosMenuLoading ||
    modificaPermisosSubmenuLoading ||
    modificaNotificacionesSubmenuLoading
  ) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (
    menuError ||
    permisosError ||
    modificaPermisosModuloError ||
    modificaPermisosMenuError ||
    modificaPermisosSubmenuError ||
    modificaNotificacionesSubmenuError
  ) {
    return <ErrorQueryDB />;
  }

  const getPermisosSubMenus = (idSubMenu, notificaciones) => {
    if (permisosData.permisomodulos) {
      for (let x = 0; x < permisosData.permisomodulos.length; x++) {
        for (
          let y = 0;
          y < permisosData.permisomodulos[x].permisosmenu.length;
          y++
        ) {
          for (
            let z = 0;
            z <
            permisosData.permisomodulos[x].permisosmenu[y].permisossubmenus
              .length;
            z++
          ) {
            if (
              idSubMenu ===
              permisosData.permisomodulos[x].permisosmenu[y].permisossubmenus[z]
                .idsubmenu
            ) {
              return notificaciones
                ? permisosData.permisomodulos[x].permisosmenu[y]
                    .permisossubmenus[z].notificaciones
                : permisosData.permisomodulos[x].permisosmenu[y]
                    .permisossubmenus[z].tipopermiso;
            }
          }
        }
      }
    }
    return 0;
  };

  const getSubMenus = (menu) => {
    return menu.submenus.map((submenu, index) => {
      let permisoNotificacion = getPermisosSubMenus(submenu.idsubmenu, true);
      return submenu.orden !== 0 ? (
        <StyledTreeItem
          key={submenu.idsubmenu}
          nodeId={`${submenu.idsubmenu}00`}
          labelText={submenu.nombre_submenu}
          labelIcon={StarIcon}
          isMenu={false}
          labelInfo={
            <div>
              <TextField
                select
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                label="Permisos"
                type="text"
                value={getPermisosSubMenus(submenu.idsubmenu, false)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  setIdSubmenu(submenu.idsubmenu);
                  //console.log(parseInt(e.target.value));
                  setPermiso(parseInt(e.target.value));
                }}
              >
                <option value="0">Bloqueado</option>
                <option value="1">Lectura</option>
                <option value="2">Lectura y Escritura</option>
                <option value="3">Todos</option>
              </TextField>
              <Typography style={{ fontSize: "13px" }}>
                Notificaciones
              </Typography>
              <FormGroup
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        permisoNotificacion === 4 ||
                        permisoNotificacion === 5 ||
                        permisoNotificacion === 6 ||
                        permisoNotificacion === 7
                      }
                      onClick={(e) => {
                        setSumaSubmenuNotificacion(
                          e.target.checked
                            ? permisoNotificacion + 4
                            : permisoNotificacion - 4
                        );
                        setIdSubmenu(submenu.idsubmenu);
                      }}
                    />
                  }
                  label="Aplicación Móvil"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        permisoNotificacion === 1 ||
                        permisoNotificacion === 3 ||
                        permisoNotificacion === 5 ||
                        permisoNotificacion === 7
                      }
                      onClick={(e) => {
                        setSumaSubmenuNotificacion(
                          e.target.checked
                            ? permisoNotificacion + 1
                            : permisoNotificacion - 1
                        );
                        setIdSubmenu(submenu.idsubmenu);
                      }}
                    />
                  }
                  label="Email"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        permisoNotificacion === 2 ||
                        permisoNotificacion === 3 ||
                        permisoNotificacion === 6 ||
                        permisoNotificacion === 7
                      }
                      onClick={(e) => {
                        setSumaSubmenuNotificacion(
                          e.target.checked
                            ? permisoNotificacion + 2
                            : permisoNotificacion - 2
                        );
                        setIdSubmenu(submenu.idsubmenu);
                      }}
                    />
                  }
                  label="SMS"
                  labelPlacement="end"
                />
              </FormGroup>
            </div>
          }
          color="#00c853"
          bgColor="#b9f6ca"
        />
      ) : (
        <div key={submenu.idsubmenu}></div>
      );
    });
  };

  const getPermisosMenus = (idMenu) => {
    if (permisosData.permisomodulos) {
      for (let x = 0; x < permisosData.permisomodulos.length; x++) {
        for (
          let y = 0;
          y < permisosData.permisomodulos[x].permisosmenu.length;
          y++
        ) {
          if (
            idMenu === permisosData.permisomodulos[x].permisosmenu[y].idmenu
          ) {
            return (
              permisosData.permisomodulos[x].permisosmenu[y].tipopermiso === 1
            );
          }
        }
      }
    }
    return false;
  };

  const getMenus = (modulo) => {
    return modulo.menus.map((menu, index) => {
      let permisoMenu = getPermisosMenus(menu.idmenu);
      return menu.orden !== 0 ? (
        <StyledTreeItem
          key={menu.idmenu}
          nodeId={`${menu.idmenu}0`}
          labelText={menu.nombre_menu}
          labelIcon={MinimizeIcon}
          isMenu={true}
          labelInfo={
            <RadioGroup
              aria-label="permisos"
              name="permisos"
              style={{ display: "block" }}
              value={permisoMenu}
              onClick={(e) => {
                e.stopPropagation();
                if (
                  e.target.value &&
                  e.target.value.toString() !== permisoMenu.toString()
                ) {
                  setIdMenu(menu.idmenu);
                  setPermiso(e.target.value === "true" ? 1 : 0);
                }
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label="Sí" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#e3742f"
          bgColor="#fcefe3"
        >
          {getSubMenus(menu)}
        </StyledTreeItem>
      ) : (
        <div key={modulo.idmodulo}></div>
      );
    });
  };

  const getPermisosModulos = (idmodulo) => {
    if (permisosData.permisomodulos) {
      for (let x = 0; x < permisosData.permisomodulos.length; x++) {
        if (idmodulo === permisosData.permisomodulos[x].idmodulo) {
          return permisosData.permisomodulos[x].tipopermiso === 1;
        }
      }
    } else {
      setShowComponent(1);
      const token = jwt.sign(
        {
          menuTemporal: {
            showComponent: 1,
            permisosSubmenu: permisosSubmenu,
          },
        },
        "mysecretpassword"
      );
      localStorage.setItem("menuTemporal", token);
    }
    return false;
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
              value={getPermisosModulos(modulo.idmodulo)}
              onClick={(e) => {
                e.stopPropagation();
                if (
                  e.target.value &&
                  e.target.value.toString() !==
                    getPermisosModulos(modulo.idmodulo).toString()
                ) {
                  setIdModulo(modulo.idmodulo);
                  setPermiso(e.target.value === "true" ? 1 : 0);
                }
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label="Sí" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          }
          color="#1a73e8"
          bgColor="#e8f0fe"
        >
          {getMenus(modulo)}
        </StyledTreeItem>
      ) : null;
    });
  };

  const handleChangeTreeView = (event, nodes) => {
    setExpanded(nodes);
    const token = jwt.sign(
      {
        menuTemporal: {
          showComponent: 4,
          idUsuarioEditar: idUsuarioEditar,
          permisosSubmenu: permisosSubmenu,
          treeNodes: nodes,
          idSubmenuActual: idSubmenuActual,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setExpanded([]);
                setShowComponent(1);
                //localStorage.removeItem("menuTemporal");
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      showComponent: 1,
                      permisosSubmenu: permisosSubmenu,
                      idSubmenuActual: idSubmenuActual,
                    },
                  },
                  "mysecretpassword"
                );
                localStorage.setItem("menuTemporal", token);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          EDITAR PERMISOS USUARIO
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Configure los permisos de acceso al usuario
        </Typography>
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

function CrearUsuario(props) {
  const classes = useStyles();
  const permisosSubmenu = props.permisosSubmenu;
  const setShowComponent = props.setShowComponent;
  const executeListaUsuariosEmpresa = props.executeListaUsuariosEmpresa;
  const idUsuario = props.idUsuario;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idEmpresa = props.idEmpresa;
  const idSubmenu = props.idSubmenu;
  const statusEmpresa = props.statusEmpresa;
  const setLoading = props.setLoading;
  const [usuarioDatos, setUsuarioDatos] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    celular: "",
    perfil: "0",
  });
  const [
    { data: perfilesData, loading: perfilesLoading, error: perfilesError },
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaPerfiles`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: crearNuevoUsuarioData,
      loading: crearNuevoUsuarioLoading,
      error: crearNuevoUsuarioError,
    },
    executeCrearNuevoUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/crearNuevoUsuario`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (perfilesData) {
        if (perfilesData.error !== 0) {
          swal("Error", dataBaseErrores(perfilesData.error), "warning");
        }
      }
    }

    checkData();
  }, [perfilesData]);

  useEffect(() => {
    function checkData() {
      if (crearNuevoUsuarioData) {
        if (crearNuevoUsuarioData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(crearNuevoUsuarioData.error),
            "warning"
          );
        } else {
          swal("Usuario Creado", "Usuario creado con éxito", "success");
          executeListaUsuariosEmpresa();
        }
      }
    }

    checkData();
  }, [crearNuevoUsuarioData, executeListaUsuariosEmpresa]);

  if (perfilesLoading || crearNuevoUsuarioLoading) {
    setLoading(true);
  } else {
    setLoading(false);
  }

  if (perfilesError || crearNuevoUsuarioError) {
    return <ErrorQueryDB />;
  }

  const getPerfiles = () => {
    return perfilesData.perfiles.map((perfil, index) => {
      return (
        <option key={index} value={perfil.idperfil}>
          {perfil.nombre}
        </option>
      );
    });
  };

  const agregarNuevoUsuario = () => {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      celular,
      perfil,
    } = usuarioDatos;
    if (nombre.trim() === "") {
      swal("Error", "Ingrese un nombre", "warning");
    } else if (apellidoPaterno.trim() === "") {
      swal("Error", "Ingrese un apellido paterno", "warning");
    } else if (apellidoMaterno.trim() === "") {
      swal("Error", "Ingrese un apellido materno", "warning");
    } else if (correo.trim() === "") {
      swal("Error", "Ingrese un correo", "warning");
    } else if (!validarCorreo(correo.trim())) {
      swal("Error", "Ingrese un correo valido", "warning");
    } else if (celular.trim() === "") {
      swal("Error", "Ingrese un celular", "warning");
    } else if (perfil === "0") {
      swal("Error", "Seleccione un perfil", "warning");
    } else {
      const identificador = Math.floor(Math.random() * 1000000);
      const linkConfirmacion = `http://${window.location.host}/#/?ruta=cambiarContra&usuario=`;
      executeCrearNuevoUsuario({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idsubmenu: idSubmenu,
          correo: correo,
          celular: celular,
          nombre: nombre,
          apellidop: apellidoPaterno,
          apellidom: apellidoMaterno,
          perfil: parseInt(perfil),
          password: "12345678",
          identificador: identificador,
          idempresa: idEmpresa,
          fecha_vinculacion: moment().format("YYYY-MM-DD"),
          idusuario_vinculador: idUsuario,
          linkconfirmacion: linkConfirmacion,
        },
      });
    }
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.title}>
          <Tooltip title="Cerrar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
                localStorage.removeItem("menuTemporal");
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
          Crear Nuevo Usuario
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="nombre"
          label="Nombre"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.nombre}
          inputProps={{
            maxLength: 50,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 1);
          }}
          onChange={(e) => {
            pasteValidation(e, 1);
            setUsuarioDatos({
              ...usuarioDatos,
              nombre: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="apellidoPaterno"
          label="Apellido Paterno"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.apellidoPaterno}
          inputProps={{
            maxLength: 50,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 1);
          }}
          onChange={(e) => {
            pasteValidation(e, 1);
            setUsuarioDatos({
              ...usuarioDatos,
              apellidoPaterno: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="apellidoMaterno"
          label="Apellido Materno"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.apellidoMaterno}
          inputProps={{
            maxLength: 50,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 1);
          }}
          onChange={(e) => {
            pasteValidation(e, 1);
            setUsuarioDatos({
              ...usuarioDatos,
              apellidoMaterno: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="correoElectronico"
          label="Correo Electrónico"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.correo}
          inputProps={{
            maxLength: 70,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 4);
          }}
          onChange={(e) => {
            pasteValidation(e, 4);
            setUsuarioDatos({
              ...usuarioDatos,
              correo: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="telefonoCelular"
          label="Teléfono Celular"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.celular}
          inputProps={{
            maxLength: 20,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 2);
          }}
          onChange={(e) => {
            pasteValidation(e, 2);
            setUsuarioDatos({
              ...usuarioDatos,
              celular: e.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="asignarPerfil"
          label="Asignar Perfil"
          variant="outlined"
          type="text"
          margin="normal"
          value={usuarioDatos.perfil}
          select
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setUsuarioDatos({
              ...usuarioDatos,
              perfil: e.target.value,
            });
          }}
        >
          <option value="0">Selecciona un perfil</option>
          {perfilesData ? getPerfiles() : null}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
          style={{
            background:
              permisosSubmenu < 2 || statusEmpresa !== 1
                ? "disabled"
                : "#17A2B8",
            color:
              permisosSubmenu < 2 || statusEmpresa !== 1
                ? "disabled"
                : "#FFFFFF",
            float: "right",
            marginBottom: "10px",
          }}
          onClick={() => {
            agregarNuevoUsuario();
          }}
        >
          Agregar Usuario
        </Button>
      </Grid>
    </Grid>
  );
}

function VincularUsuario(props) {
  const classes = useStyles();
  const permisosSubmenu = props.permisosSubmenu;
  const setShowComponent = props.setShowComponent;
  const executeListaUsuariosEmpresa = props.executeListaUsuariosEmpresa;
  const idUsuario = props.idUsuario;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idEmpresa = props.idEmpresa;
  const nombreEmpresa = props.nombreEmpresa;
  const idSubmenu = props.idSubmenu;
  const setLoading = props.setLoading;
  const statusEmpresa = props.statusEmpresa;
  const [correo, setCorreo] = useState("");
  const [perfil, setPerfil] = useState("0");
  const [
    { data: perfilesData, loading: perfilesLoading, error: perfilesError },
  ] = useAxios(
    {
      url: API_BASE_URL + `/listaPerfiles`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );
  const [
    {
      data: vincularUsuarioData,
      loading: vincularUsuarioLoading,
      error: vincularUsuarioError,
    },
    executeVincularUsuario,
  ] = useAxios(
    {
      url: API_BASE_URL + `/vincularUsuario`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (perfilesData) {
        if (perfilesData.error !== 0) {
          swal("Error", dataBaseErrores(perfilesData.error), "warning");
        }
      }
    }

    checkData();
  }, [perfilesData]);

  useEffect(() => {
    function checkData() {
      if (vincularUsuarioData) {
        if (vincularUsuarioData.error !== 0) {
          swal("Error", dataBaseErrores(vincularUsuarioData.error), "warning");
        } else {
          swal("Usuario vinculado", "Usuario vinculado con éxito", "success");
          executeListaUsuariosEmpresa();
        }
      }
    }

    checkData();
  }, [vincularUsuarioData, executeListaUsuariosEmpresa]);

  if (perfilesLoading || vincularUsuarioLoading) {
    setLoading(true);
  } else {
    setLoading(false);
  }

  if (perfilesError || vincularUsuarioError) {
    return <ErrorQueryDB />;
  }

  const getPerfiles = () => {
    return perfilesData.perfiles.map((perfil, index) => {
      return (
        <option key={index} value={perfil.idperfil}>
          {perfil.nombre}
        </option>
      );
    });
  };

  const vincularUsuario = () => {
    if (correo.trim() === "") {
      swal("Error", "Ingrese un correo", "warning");
    } else if (!validarCorreo(correo.trim())) {
      swal("Error", "Ingrese un correo valido", "warning");
    } else if (perfil === "0") {
      swal("Error", "Seleccione un perfil", "warning");
    } else {
      executeVincularUsuario({
        data: {
          usuario: usuario,
          pwd: pwd,
          rfc: rfc,
          idsubmenu: idSubmenu,
          correo: correo,
          perfil: parseInt(perfil),
          idempresa: idEmpresa,
          nombreempresa: nombreEmpresa,
          fecha_vinculacion: moment().format("YYYY-MM-DD"),
          idusuario_vinculador: idUsuario,
        },
      });
    }
  };

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.title}>
          <Tooltip title="Cerrar">
            <IconButton
              onClick={() => {
                setShowComponent(0);
                localStorage.removeItem("menuTemporal");
              }}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          </Tooltip>
          Vinculación De Usuarios
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="correoElectronico"
          label="Correo Electrónico"
          variant="outlined"
          type="text"
          margin="normal"
          value={correo}
          inputProps={{
            maxLength: 70,
          }}
          onKeyPress={(e) => {
            keyValidation(e, 4);
          }}
          onChange={(e) => {
            pasteValidation(e, 4);
            setCorreo(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textFields}
          id="asignarPerfil"
          label="Asignar Perfil"
          variant="outlined"
          select
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={perfil}
          onChange={(e) => {
            setPerfil(e.target.value);
          }}
        >
          <option value="0">Selecciona un perfil</option>
          {perfilesData ? getPerfiles() : null}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={permisosSubmenu < 2 || statusEmpresa !== 1}
          variant="contained"
          style={{
            background:
              permisosSubmenu < 2 || statusEmpresa !== 1
                ? "disabled"
                : "#17A2B8",
            color:
              permisosSubmenu < 2 || statusEmpresa !== 1
                ? "disabled"
                : "#FFFFFF",
            float: "right",
            marginBottom: "10px",
          }}
          onClick={() => {
            vincularUsuario();
          }}
        >
          Vincular Usuario
        </Button>
      </Grid>
    </Grid>
  );
}

function EditarNotificacionesUsuario(props) {
  const classes = useStyles();
  const setShowComponent = props.setShowComponent;
  const permisosSubmenu = props.permisosSubmenu;
  /* const setPermisosSubmenu = props.setPermisosSubmenu; */
  const setLoading = props.setLoading;
  const usuario = props.usuario;
  const pwd = props.pwd;
  const rfc = props.rfc;
  const idUsuarioEditar = props.idUsuarioEditar;
  const idEmpresa = props.idEmpresa;
  /* const setExecuteQueriesHeader = props.setExecuteQueriesHeader;
  const expanded = props.expanded; */
  const setExpanded = props.setExpanded;
  const idSubmenuActual = props.idSubmenuActual;

  const [notificacionesUsuario, setNotificacionesUsuario] = useState([]);

  const [
    {
      data: getNotificacionesServiciosUsuarioEmpresaData,
      loading: getNotificacionesServiciosUsuarioEmpresaLoading,
      error: getNotificacionesServiciosUsuarioEmpresaError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getNotificacionesServiciosUsuarioEmpresa`,
      method: "GET",
      params: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: 21,
        idempresa: idEmpresa,
        idusuario: idUsuarioEditar,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: guardarNotificacionesServiciosUsuarioEmpresaData,
      loading: guardarNotificacionesServiciosUsuarioEmpresaLoading,
      error: guardarNotificacionesServiciosUsuarioEmpresaError,
    }, executeGuardarNotificacionesServiciosUsuarioEmpresa,
  ] = useAxios(
    {
      url: API_BASE_URL + `/guardarNotificacionesServiciosUsuarioEmpresa`,
      method: "POST",
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getNotificacionesServiciosUsuarioEmpresaData) {
        if (getNotificacionesServiciosUsuarioEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getNotificacionesServiciosUsuarioEmpresaData.error),
            "warning"
          );
        } else {
          setNotificacionesUsuario(
            getNotificacionesServiciosUsuarioEmpresaData.servicios
          );
        }
      }
    }

    checkData();
  }, [getNotificacionesServiciosUsuarioEmpresaData]);

  useEffect(() => {
    function checkData() {
      if (guardarNotificacionesServiciosUsuarioEmpresaData) {
        if (guardarNotificacionesServiciosUsuarioEmpresaData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(guardarNotificacionesServiciosUsuarioEmpresaData.error),
            "warning"
          );
        } else {
          setNotificacionesUsuario(
            guardarNotificacionesServiciosUsuarioEmpresaData.servicios
          );
        }
      }
    }

    checkData();
  }, [guardarNotificacionesServiciosUsuarioEmpresaData]);

  if (getNotificacionesServiciosUsuarioEmpresaLoading || guardarNotificacionesServiciosUsuarioEmpresaLoading) {
    setLoading(true);
  } else {
    setLoading(false);
  }

  if (getNotificacionesServiciosUsuarioEmpresaError || guardarNotificacionesServiciosUsuarioEmpresaError) {
    return <ErrorQueryDB />;
  }

  const handleChangeNotificaciones = (e, index, variable) => {
    let newUsuariosNotificaciones = notificacionesUsuario.slice();
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

    setNotificacionesUsuario(newUsuariosNotificaciones);
  };

  const handleClickGuardarNotificaciones = () => {
    console.log(notificacionesUsuario);
    executeGuardarNotificacionesServiciosUsuarioEmpresa({
      data: {
        usuario: usuario,
        pwd: pwd,
        rfc: rfc,
        idsubmenu: idSubmenuActual,
        idempresa: idEmpresa,
        idusuario: idUsuarioEditar,
        datosnotificaciones: notificacionesUsuario,
      }
    })
  }

  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">
          <Tooltip title="Regresar">
            <IconButton
              onClick={() => {
                setExpanded([]);
                setShowComponent(1);
                //localStorage.removeItem("menuTemporal");
                const token = jwt.sign(
                  {
                    menuTemporal: {
                      showComponent: 1,
                      permisosSubmenu: permisosSubmenu,
                      idSubmenuActual: idSubmenuActual,
                    },
                  },
                  "mysecretpassword"
                );
                localStorage.setItem("menuTemporal", token);
              }}
            >
              <ArrowBackIcon color="primary" />
            </IconButton>
          </Tooltip>
          EDITAR NOTIFICACIONES USUARIO
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" style={{ float: "right" }} onClick={handleClickGuardarNotificaciones}>Guardar</Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead style={{ background: "#FAFAFA" }}>
              <TableRow>
                <TableCell>
                  <strong>Servicio</strong>
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
              {notificacionesUsuario.map((notificacionUsuario, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {notificacionUsuario.nombreservicio}
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      color="primary"
                      checked={notificacionUsuario.notificacionCRM === 1}
                      onChange={(e) => {
                        handleChangeNotificaciones(e, index, 1);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      color="primary"
                      checked={notificacionUsuario.notificacionCorreo === 1}
                      onChange={(e) => {
                        handleChangeNotificaciones(e, index, 2);
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Checkbox
                      color="primary"
                      checked={notificacionUsuario.notificacionSMS === 1}
                      onChange={(e) => {
                        handleChangeNotificaciones(e, index, 3);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
