import React, { useState, useEffect } from "react";
import { NavLink, Link, Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Collapse,
  Grid,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Button,
  Tooltip,
  Badge
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  ExpandLess,
  ExpandMore,
  MonetizationOn as MonetizationOnIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Minimize as MinimizeIcon,
  Email as EmailIcon,
  AccountBox as AccountBoxIcon,
  EmojiObjects as EmojiObjectsIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import swal from "sweetalert";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import LoadingComponent from "../componentsHelpers/loadingComponent";
import Home from "../home/home";
//import Websocket from "react-websocket";
import jwt from "jsonwebtoken";
import { getUrlVariable } from "../../helpers/funciones";
/* import Pusher from "pusher-js";
import Echo from "laravel-echo"; */

/* const options = {
  broadcaster: 'pusher',
  key: 'myKey',
  wsHost: '127.0.0.1',
  wsPort: 6001,
  disableStats: true,
};

const echo = new Echo(options);

echo.private('prueba').listen((data) => {
  console.log(data);
}); */

/* const options = {
  broadcaster: 'pusher',
    key: 'myKey',
    wsHost: '127.0.0.1',
    wsPort: 6001,
    disableStats: true,
};

const echo = new Echo(options);

echo.listen(".prueba", data => {
  console.log("holis");
  console.log(data);
}); */

/* window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'myKey',
    wsHost: '127.0.0.1',
    wsPort: 6001,
    disableStats: true,
});

window.Echo.private().listen("prueba", data => {
  console.log("holis");
  console.log(data);
}); */

const drawerWidth = 350;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "#FFFFFF",
    color: "#868E96"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    background: "#1D2939"
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "#1D2939",
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: "flex",
    background: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  toolbarMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  nestedFirstLevel: {
    paddingLeft: theme.spacing(4),
    alignItems: "baseline"
  },
  nestedSecondLevel: {
    paddingLeft: theme.spacing(6)
  },
  titleTypography: {
    fontSize: "13px",
    marginRight: "5px"
  },
  toolbarIcons: {
    color: "#868E96"
  },
  toolbarIconButton1: {
    marginRight: "15px"
  },
  toolbarList: {
    padding: "0",
    display: "inline-flex",
    marginInlineStart: "auto"
  },
  toolbarListItemText: {
    fontSize: "13px",
    textAlign: "center"
  },
  toolbarListItemAvatar: {
    marginLeft: "20px",
    cursor: "pointer"
  },
  drawerToolbarTitle: {
    color: "#212529",
    letterSpacing: "-0.5px",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center",
    fontSize: "25px",
    display: "flex",
    "&:hover": {
      display: "inline-block",
      transition: "all 0.2s ease-in-out"
    }
  },
  drawerToolbarTitleLeftSquareBracket: {
    color: "#00b297",
    marginRight: "5px"
  },
  drawerToolbarTitleRightSquareBracket: {
    color: "#00b297",
    marginLeft: "5px"
  },
  drawerNavHomeLinks: {
    textDecoration: "none",
    color: "#BDFAFF"
  },
  drawerNavLinks: {
    textDecoration: "none",
    color: "#ADB5BD"
  },
  drawerHomeNavLink: {
    background: "#00B297",
    "&:hover": {
      background: "#00B280"
    }
  },
  drawerHomeIcon: {
    color: "#BDFAFF"
  },
  drawerListTextAndItems: {
    color: "#ADB5BD"
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    maxWidth: "500px"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

export default function Header(props) {
  const urlRuta = getUrlVariable("ruta");
  const urlIdEmpresa = getUrlVariable("idempresa");
  const urlIdModulo = getUrlVariable("idmodulo");
  const urlIdMenu = getUrlVariable("idmenu");
  const urlIdSubmenu = getUrlVariable("idsubmenu");
  const urlIdDocumento = getUrlVariable("iddocumento");
  const classes = useStyles();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("xs"));
  const currentPath = window.location.hash.substr(2);
  const submenuContent = props.submenuContent;
  const setSubmenuContent = props.setSubmenuContent;
  const usuarioDatos = props.usuarioDatos;
  const setUsuarioDatos = props.setUsuarioDatos;
  const empresaDatos = props.empresaDatos;
  const setEmpresaDatos = props.setEmpresaDatos;
  const loading = props.loading;
  const executeQueriesHeader = props.executeQueriesHeader;
  const setExecuteQueriesHeader = props.setExecuteQueriesHeader;
  let userId = 0;
  let userEmail = "";
  let userPassword = "";
  let empresaRFC = "";
  const [userAuth, setUserAuth] = useState(true);
  const [empresaAuth, setEmpresaAuth] = useState(true);

  if (localStorage.getItem("token")) {
    if (localStorage.getItem("emToken")) {
      try {
        const decodedToken = jwt.verify(
          localStorage.getItem("token"),
          "mysecretpassword"
        );
        const decodedEToken = jwt.verify(
          localStorage.getItem("emToken"),
          "mysecretpassword"
        );
        setUsuarioDatos(
          usuarioDatos.length === 0 ? decodedToken.userData : usuarioDatos
        );
        setEmpresaDatos(
          empresaDatos.length === 0 ? decodedEToken.empresaData : empresaDatos
        );
        userId = decodedToken.userData.idusuario;
        userEmail = decodedToken.userData.correo;
        userPassword = decodedToken.userData.password;
        empresaRFC = decodedEToken.empresaData.RFC;
      } catch (err) {
        localStorage.removeItem("emToken");
        //localStorage.removeItem("token");
        setEmpresaAuth(false);
      }
    }
  }
  const [empresaPermisos, setEmpresaPermisos] = useState(true);
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [perfilUsuario, setPerfilUsuario] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialogEmpresas, setOpenDialogEmpresas] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(0);
  const [collapseHistorial, setCollapseHistorial] = useState(0);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  const [anchorNotificacionesEl, setAnchorNotificacionesEl] = useState(null);
  const [badgeVisibility, setBadgeVisibility] = useState(true);
  const [
    { data: menuData, loading: menuLoading, error: menuError },
    executeMenu
  ] = useAxios(
    {
      url: API_BASE_URL + `/menuWeb`,
      method: "GET",
      params: {
        usuario: userEmail,
        pwd: userPassword
      }
    },
    {
      useCache: false
    }
  );
  const [
    { data: perfilData, loading: perfilLoading, error: perfilError },
    executePerfil
  ] = useAxios(
    {
      url: API_BASE_URL + `/permisosUsuario`,
      method: "GET",
      params: {
        usuario: userEmail,
        pwd: userPassword,
        rfc: empresaRFC
      }
    },
    {
      useCache: false
    }
  );
  const [
    { data: empresasData, loading: empresasLoading, error: empresasError }
  ] = useAxios({
    url: API_BASE_URL + `/listaEmpresasUsuario`,
    method: "GET",
    params: {
      usuario: userEmail,
      pwd: userPassword
    }
  });
  const [
    {
      data: notificacionesData,
      loading: notificacionesLoading,
      error: notificacionesError
    }/* , executeNotificaciones */
  ] = useAxios(
    {
      url: API_BASE_URL + `/notificacionesCRM`,
      method: "GET",
      params: {
        usuario: userEmail,
        pwd: userPassword,
        rfc: empresaRFC,
        idsubmenu: 1
      }
    },
    {
      useCache: false
    }
  );
  const [
    {
      data: eliminaNotificacionData,
      loading: eliminaNotificacionLoading,
      error: eliminaNotificacionError
    },
    executeEliminaNotificacion
  ] = useAxios(
    {
      url: API_BASE_URL + `/eliminaNotificacion`,
      method: "DELETE"
    },
    {
      useCache: false,
      manual: true
    }
  );

  useEffect(() => {
    function executeQueries() {
      if (executeQueriesHeader) {
        executeMenu();
        executePerfil();
        setExecuteQueriesHeader(false);
      }
    }

    executeQueries();
  }, [
    executeQueriesHeader,
    executeMenu,
    executePerfil,
    setExecuteQueriesHeader
  ]);

  useEffect(() => {
    executeMenu();
    executePerfil();
  }, [currentPath, executeMenu, executePerfil]);

  useEffect(() => {
    function putEmpresaName() {
      try {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("emToken")) {
            const decodedToken = jwt.verify(
              localStorage.getItem("token"),
              "mysecretpassword"
            );
            const decodedEToken = jwt.verify(
              localStorage.getItem("emToken"),
              "mysecretpassword"
            );
            setNombreUsuario(
              `${decodedToken.userData.nombre} ${decodedToken.userData.apellidop} ${decodedToken.userData.apellidom}`
            );
            setPerfilUsuario(decodedEToken.empresaData.perfil);
            setNombreEmpresa(decodedEToken.empresaData.nombreempresa);
          } else {
            setEmpresaAuth(false);
          }
        } else {
          localStorage.removeItem("emToken");
          setUserAuth(false);
        }
      } catch (err) {
        localStorage.removeItem("emToken");
        //localStorage.removeItem("token");
        setEmpresaAuth(false);
      }
    }

    putEmpresaName();
  });

  useEffect(() => {
    function sortSubmenus(subMenu) {
      return subMenu.sort(function(a, b) {
        if (a.orden > b.orden) {
          return 1;
        }
        if (a.orden < b.orden) {
          return -1;
        }
        return 0;
      });
    }

    function getPermisosSubMenus(idModulo, idMenu) {
      if (perfilData && perfilData.permisomodulos) {
        for (let x = 0; x < perfilData.permisomodulos.length; x++) {
          if (perfilData.permisomodulos[x].idmodulo === idModulo) {
            for (
              let y = 0;
              y < perfilData.permisomodulos[x].permisosmenu.length;
              y++
            ) {
              if (
                perfilData.permisomodulos[x].permisosmenu[y].idmenu === idMenu
              ) {
                return perfilData.permisomodulos[x].permisosmenu[y]
                  .permisossubmenus;
              }
            }
          }
        }
      }
    }

    function getPermisosMenus(idModulo, idMenu) {
      if (perfilData && perfilData.permisomodulos) {
        for (let x = 0; x < perfilData.permisomodulos.length; x++) {
          if (perfilData.permisomodulos[x].idmodulo === idModulo) {
            for (
              let y = 0;
              y < perfilData.permisomodulos[x].permisosmenu.length;
              y++
            ) {
              if (
                perfilData.permisomodulos[x].permisosmenu[y].idmenu === idMenu
              ) {
                return perfilData.permisomodulos[x].permisosmenu[y].tipopermiso;
              }
            }
          }
        }
      }
    }

    let permisosSubmenu = [];
    let submenuData = [];
    let idModulo = [];
    if (menuData && menuData.modulos) {
      menuData.modulos.map(modulo => {
        return modulo.menus.map(menu => {
          if (menu.ref === currentPath) {
            const permisosMenus = getPermisosMenus(menu.idmodulo, menu.idmenu);
            setEmpresaPermisos(permisosMenus !== 0 ? true : false);
            permisosSubmenu = getPermisosSubMenus(menu.idmodulo, menu.idmenu);
            idModulo = menu.idmodulo;
            submenuData = sortSubmenus(menu.submenus);
          }
          return null;
        });
      });
      let dataSubmenuAndPermisos = [];
      if (permisosSubmenu !== undefined) {
        for (let x = 0; x < submenuData.length; x++) {
          for (let y = 0; y < permisosSubmenu.length; y++) {
            if (submenuData[x].idsubmenu === permisosSubmenu[y].idsubmenu) {
              dataSubmenuAndPermisos.push({
                submenu: submenuData[x],
                permisos: permisosSubmenu[y].tipopermiso,
                idModulo: idModulo
              });
              break;
            }
          }
        }
        setSubmenuContent(dataSubmenuAndPermisos);
      }
    }
  }, [menuData, perfilData, currentPath, setSubmenuContent]);

  useEffect(() => {
    function checkData() {
      if (eliminaNotificacionData) {
        console.log(eliminaNotificacionData);
        if (eliminaNotificacionData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(eliminaNotificacionData.error),
            "warning"
          );
        } else {
          swal(
            "Notificación eliminada",
            "Se ha eliminado la notificación",
            "success"
          );
        }
      }
    }

    checkData();
  }, [eliminaNotificacionData]);

  window.onhashchange = function() {
    localStorage.removeItem("menuTemporal");
    if (window.location.hash.substr(2) !== "configuracionesPermisos") {
      localStorage.removeItem("idMenuTemporal");
    }
    window.location = `${window.location.origin}/${window.location.hash}`;
  };

  if (
    menuLoading ||
    perfilLoading ||
    empresasLoading ||
    notificacionesLoading ||
    eliminaNotificacionLoading
  ) {
    return <LoadingComponent />;
  }
  if (
    menuError ||
    perfilError ||
    empresasError ||
    notificacionesError ||
    eliminaNotificacionError
  ) {
    return <ErrorQueryDB />;
  }

  if (userEmail.trim() !== "" && userPassword.trim() !== "") {
    if (menuData.error !== 0) {
      return (
        <Typography variant="h5">{dataBaseErrores(menuData.error)}</Typography>
      );
    }
    if (perfilData.error !== 0) {
      return (
        <Typography variant="h5">
          {dataBaseErrores(perfilData.error)}
        </Typography>
      );
    }
    if (empresasData.error !== 0) {
      return (
        <Typography variant="h5">
          {dataBaseErrores(empresasData.error)}
        </Typography>
      );
    }
  }

  if (
    urlRuta !== false &&
    urlIdEmpresa !== false &&
    urlIdModulo !== false &&
    urlIdMenu !== false &&
    urlIdSubmenu !== false &&
    urlIdDocumento !== false
  ) {
    if (!userAuth) {
      const token = jwt.sign(
        {
          notificacionData: {
            tableTittle:
              urlIdModulo === 4 && urlIdSubmenu === 44
                ? "Gastos"
                : urlIdModulo === 4 && urlIdSubmenu === 68
                ? "Compras"
                : urlIdModulo === 4 && urlIdSubmenu === 69
                ? "Ventas"
                : "Pagos",
            showComponent: 2,
            idModulo: urlIdModulo,
            idMenu: urlIdMenu,
            idSubmenu: urlIdSubmenu,
            accionAG: 2,
            idRequerimiento: urlIdDocumento,
            idEmpresa: urlIdEmpresa
          }
        },
        "mysecretpassword"
      );
      localStorage.setItem("notificacionData", token);
    } else {
      for (let x = 0; x < empresasData.empresas.length; x++) {
        if (parseInt(urlIdEmpresa) === empresasData.empresas[x].idempresa) {
          setEmpresaDatos(empresasData.empresas[x]);
          const token = jwt.sign(
            { empresaData: empresasData.empresas[x] },
            "mysecretpassword"
          );
          localStorage.setItem("emToken", token);
          break;
        }
      }
      const token = jwt.sign(
        {
          notificacionData: {
            tableTittle:
              urlIdModulo === 4 && urlIdSubmenu === 44
                ? "Gastos"
                : urlIdModulo === 4 && urlIdSubmenu === 68
                ? "Compras"
                : urlIdModulo === 4 && urlIdSubmenu === 69
                ? "Ventas"
                : "Pagos",
            showComponent: 2,
            idModulo: urlIdModulo,
            idMenu: urlIdMenu,
            idSubmenu: urlIdSubmenu,
            accionAG: 2,
            idRequerimiento: urlIdDocumento
          }
        },
        "mysecretpassword"
      );
      localStorage.setItem("notificacionData", token);
      return <Redirect to={`/${urlRuta}`} />;
    }
  }

  const menuIcon = menu => {
    switch (menu) {
      case 1:
        return <SettingsIcon className={classes.drawerListTextAndItems} />;
      case 2:
        return <AssessmentIcon className={classes.drawerListTextAndItems} />;
      case 3:
        return <AccountBoxIcon className={classes.drawerListTextAndItems} />;
      case 4:
        return <EmailIcon className={classes.drawerListTextAndItems} />;
      case 5:
        return (
          <MonetizationOnIcon className={classes.drawerListTextAndItems} />
        );
      case 6:
        return <EmojiObjectsIcon className={classes.drawerListTextAndItems} />;
      default:
        return <MinimizeIcon className={classes.drawerListTextAndItems} />;
    }
  };

  const sortMenuData = menu => {
    return menu.sort(function(a, b) {
      if (a.orden > b.orden) {
        return 1;
      }
      if (a.orden < b.orden) {
        return -1;
      }
      return 0;
    });
  };

  const checkMenus = modulo => {
    let exist = false;
    for (let x = 0; x < modulo.menus.length; x++) {
      if (modulo.menus[x].idmodulo === modulo.idmodulo) {
        exist = true;
        break;
      }
    }
    return exist;
  };

  const getMenusPermisos = (idMenu, idModulo) => {
    let permisos = 0;
    for1: for (let x = 0; x < perfilData.permisomodulos.length; x++) {
      if (perfilData.permisomodulos[x].idmodulo === idModulo) {
        for (
          let y = 0;
          y < perfilData.permisomodulos[x].permisosmenu.length;
          y++
        ) {
          if (perfilData.permisomodulos[x].permisosmenu[y].idmenu === idMenu) {
            permisos = perfilData.permisomodulos[x].permisosmenu[y].tipopermiso;
            break for1;
          }
        }
      }
    }
    return permisos;
  };

  const getMenusData = (modulo, indexModulo, permisosModulo) => {
    if (checkMenus(modulo)) {
      return sortMenuData(modulo.menus).map((submenu, index) => {
        let permisos =
          permisosModulo !== 0
            ? getMenusPermisos(submenu.idmenu, submenu.idmodulo)
            : 0;
        return submenu.orden !== 0 ? (
          <Collapse
            in={openCollapse === indexModulo}
            timeout="auto"
            unmountOnExit
            key={index}
          >
            <List component="div" disablePadding>
              <NavLink
                onClick={e => {
                  if (permisos !== 1) {
                    e.preventDefault();
                  }
                  if (currentPath !== submenu.ref) {
                    localStorage.removeItem("menuTemporal");
                    localStorage.removeItem("notificacionData");
                  }
                }}
                to={`/${submenu.ref}`}
                className={classes.drawerNavLinks}
                style={{ cursor: permisos !== 1 ? "default" : "pointer" }}
              >
                <ListItem
                  button
                  className={classes.nestedFirstLevel}
                  disabled={permisos !== 1}
                  onClick={() => {
                    setOpenDrawer(false);
                    setOpenCollapse(0);
                  }}
                >
                  <ListItemIcon>
                    <MinimizeIcon className={classes.drawerListTextAndItems} />
                  </ListItemIcon>
                  <ListItemText primary={submenu.nombre_menu} />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>
        ) : null;
      });
    }
    return null;
  };

  const getModulosPermisos = idModulo => {
    let permisos = 0;
    perfilData.permisomodulos.map(modulo => {
      if (modulo.idmodulo === idModulo) {
        permisos = modulo.tipopermiso;
      }
      return null;
    });
    return permisos;
  };

  const getModulosData = () => {
    return sortMenuData(menuData.modulos).map((modulo, index) => {
      let permisos = getModulosPermisos(modulo.idmodulo);
      return (
        <div key={index}>
          <ListItem
            button
            disabled={permisos !== 1}
            className={classes.drawerListTextAndItems}
            onClick={() => {
              handleClickOpenCollapse(index + 1);
              if (modulo.menus.length > 0) {
                setOpenDrawer(true);
              }
            }}
          >
            <ListItemIcon>{menuIcon(modulo.icono)}</ListItemIcon>
            <ListItemText primary={modulo.nombre_modulo} />
            {modulo.menus.length > 0 ? (
              openCollapse === index + 1 ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : null}
          </ListItem>
          {getMenusData(modulo, index + 1, permisos)}
        </div>
      );
    });
  };

  const getEmpresas = () => {
    return empresasData.empresas.map((empresa, index) => {
      return (
        <List key={index}>
          <ListItem
            button
            onClick={() => {
              setBadgeVisibility(true);
              setEmpresaDatos(empresa);
              const token = jwt.sign(
                { empresaData: empresa },
                "mysecretpassword"
              );
              localStorage.setItem("emToken", token);
              handleCloseDialogEmpresas();
            }}
          >
            <ListItemText primary={empresa.nombreempresa} />
          </ListItem>
          <Divider />
        </List>
      );
    });
  };

  const handleClickOpenCollapse = collapse => {
    setOpenCollapse(collapse !== openCollapse ? collapse : 0);
    setCollapseHistorial(collapse !== openCollapse ? collapse : 0);
  };

  const handleOpenMenu = event => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const handleOpenNotificaciones = event => {
    setAnchorNotificacionesEl(event.currentTarget);
  };

  const handleCloseNotificaciones = () => {
    setAnchorNotificacionesEl(null);
  };

  const handleClickOpenDialogEmpresas = () => {
    setOpenDialogEmpresas(true);
  };

  const handleCloseDialogEmpresas = () => {
    setOpenDialogEmpresas(false);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
    setOpenCollapse(collapseHistorial);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setOpenCollapse(0);
  };

  const closeSesion = () => {
    swal({
      text: "¿Está seguro de cerrar sesión?",
      buttons: ["No", "Sí"],
      dangerMode: true
    }).then(value => {
      if (value) {
        localStorage.removeItem("token");
        localStorage.removeItem("emToken");
        localStorage.removeItem("notificacionData");
        setUserAuth(false);
      }
    });
  };

  const eliminarNotificacion = idNotificacion => {
    swal({
      text: "¿Está seguro de eliminar esta notificación?",
      buttons: ["No", "Sí"],
      dangerMode: true
    }).then(value => {
      if (value) {
        executeEliminaNotificacion({
          data: {
            usuario: userEmail,
            pwd: userPassword,
            rfc: empresaRFC,
            idnotificacion: idNotificacion
          }
        });
        console.log("Se eliminara la notificacion: ", idNotificacion);
      }
    });
  };

  const getNotificacionesLength = () => {
    let notificacionesLength = 0;
    for(let x=0 ; x<notificacionesData.notificacion.length ; x++) {
      if(notificacionesData.notificacion[x].idusuario === userId) {
        notificacionesLength ++;
      }
    }
    return notificacionesLength;
  }

  const getNotificaciones = () => {
    if (notificacionesData.notificacion) {
      const conteoNotificaciones = getNotificacionesLength();
      if (conteoNotificaciones === 0) {
        if (!badgeVisibility) {
          setBadgeVisibility(true);
        }
      }
      return conteoNotificaciones > 0 ? (
        notificacionesData.notificacion.map((notificacion, index) => {
          if (notificacion.status === 0 && badgeVisibility) {
            setBadgeVisibility(false);
          }
          //console.log(notificacion);
          return notificacion.idusuario === userId ? (
            <NavLink
              to={notificacion.idmodulo === 4 ? "/autorizacionesGastos" : "/"}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <ListItem
                button
                style={{
                  background: notificacion.status === 0 ? "#f8f9fa" : "#ffffff"
                }}
                onClick={() => {
                  const token = jwt.sign(
                    {
                      notificacionData: {
                        tableTittle:
                          notificacion.idsubmenu === 44
                            ? "Gastos"
                            : notificacion.idsubmenu === 68
                            ? "Compras"
                            : notificacion.idsubmenu === 69
                            ? "Ventas"
                            : "Pagos",
                        showComponent: 2,
                        idModulo: notificacion.idmodulo,
                        idMenu: notificacion.idmenu,
                        idSubmenu: notificacion.idsubmenu,
                        accionAG: 2,
                        idRequerimiento: notificacion.idregistro,
                        estatusRequerimiento: notificacion.estatus
                      }
                    },
                    "mysecretpassword"
                  );
                  localStorage.removeItem("menuTemporal");
                  localStorage.setItem("notificacionData", token);
                  if (currentPath === "autorizacionesGastos") {
                    window.location.reload();
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography style={{ fontSize: "13px", color: "black" }}>
                      <strong>{notificacion.encabezado}</strong>
                    </Typography>
                  }
                  secondary={
                    <span style={{ display: "grid" }}>
                      <Typography style={{ fontSize: "13px" }} component="span">
                        {notificacion.mensaje.indexOf(":") !== -1
                          ? notificacion.mensaje.substr(
                              0,
                              notificacion.mensaje.indexOf(":")
                            )
                          : notificacion.mensaje}
                      </Typography>
                      <Typography style={{ fontSize: "11px" }} component="span">
                        {notificacion.fecha}
                      </Typography>
                    </span>
                  }
                />
                <ListItemAvatar
                  style={{ alignSelf: "end" }}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <Tooltip title="Eliminar notificación" onClick={(e)=> {
                    e.stopPropagation();
                  }}>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        eliminarNotificacion(notificacion.idnotificacion);
                      }}
                    >
                      <CloseIcon style={{ color: "gray" }} fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemAvatar>
              </ListItem>
            </NavLink>
          ) : null;
        })
      ) : (
        <ListItem>
          <ListItemText
            primary={
              <Typography style={{ fontSize: "13px" }}>
                <strong>Sin Notificaciones</strong>
              </Typography>
            }
          />
        </ListItem>
      );
    } else {
      return (
        <ListItem>
          <ListItemText
            primary={
              <Typography style={{ fontSize: "13px" }}>
                <strong>Sin Notificaciones</strong>
              </Typography>
            }
          />
        </ListItem>
      );
    }
  };

  /* const testWebSocket = () => {
    console.log("si");
  } */

  return !userAuth ? (
    <Redirect to="/login" />
  ) : !empresaAuth ? (
    <Redirect to="/empresas" />
  ) : !empresaPermisos ? (
    <div>
      <Redirect to="/" />
      <Header
        submenuContent={submenuContent}
        setSubmenuContent={setSubmenuContent}
        usuarioDatos={usuarioDatos}
        setUsuarioDatos={setUsuarioDatos}
        empresaDatos={empresaDatos}
        setEmpresaDatos={setEmpresaDatos}
        component={
          <Home
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
          />
        }
      />
    </div>
  ) : (
    <div className={classes.root}>
      {loading ? <LoadingComponent /> : null}
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.titleTypography}>
            {nombreEmpresa}
          </Typography>

          <List className={classes.toolbarList}>
            <Tooltip title="Cambiar Empresa">
              <IconButton
                onClick={() => {
                  handleCloseMenu();
                  handleClickOpenDialogEmpresas();
                }}
              >
                <BusinessIcon className={classes.toolbarIcons} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notificaciones">
              <IconButton
                className={classes.toolbarIconButton1}
                onClick={e => {
                  handleOpenNotificaciones(e);
                  setBadgeVisibility(true);
                }}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={badgeVisibility}
                >
                  <NotificationsIcon className={classes.toolbarIcons} />
                </Badge>
                {/* <Websocket url='ws://127.0.0.1:6001' onMessage={testWebSocket} /> */}
              </IconButton>
            </Tooltip>
            <ListItem className={classes.toolbarList}>
              <ListItemText
                disableTypography
                primary={
                  <Typography className={classes.toolbarListItemText}>
                    {nombreUsuario}
                  </Typography>
                }
                secondary={
                  <Typography className={classes.toolbarListItemText}>
                    {perfilUsuario}
                  </Typography>
                }
              />
              <ListItemAvatar
                className={classes.toolbarListItemAvatar}
                onClick={handleOpenMenu}
              >
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer
          })
        }}
      >
        <div className={classes.toolbar}>
          <Grid container justify="center">
            <Link to="/" className={classes.drawerToolbarTitle}>
              <span className={classes.drawerToolbarTitleLeftSquareBracket}>
                [{" "}
              </span>
              <strong>C R M</strong>
              <span className={classes.drawerToolbarTitleRightSquareBracket}>
                {" "}
                ]
              </span>
            </Link>
          </Grid>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <NavLink to="/" className={classes.drawerNavHomeLinks}>
            <ListItem
              button
              className={classes.drawerHomeNavLink}
              onClick={() => {
                handleClickOpenCollapse(0);
                setOpenDrawer(false);
                localStorage.removeItem("menuTemporal");
                localStorage.removeItem("notificacionData");
              }}
            >
              <ListItemIcon>
                <HomeIcon className={classes.drawerHomeIcon} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </NavLink>
          {getModulosData()}
        </List>
      </Drawer>
      <main
        className={classes.content}
        style={{
          maxWidth: `calc(100% - ${openDrawer ? drawerWidth : 57}px)`
        }}
      >
        <div className={classes.toolbarMain} />
        {props.component}
      </main>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuEl}
        keepMounted
        open={Boolean(anchorMenuEl)}
        onClose={handleCloseMenu}
      >
        <NavLink
          to="/editarPerfil"
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Editar Perfil" />
          </MenuItem>
        </NavLink>
        {/* <MenuItem
          onClick={() => {
            handleCloseMenu();
            handleClickOpenDialogEmpresas();
          }}
        >
          <ListItemIcon>
            <BusinessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cambiar Empresa" />
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            closeSesion();
          }}
        >
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </StyledMenu>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorNotificacionesEl}
        open={Boolean(anchorNotificacionesEl)}
        onClose={handleCloseNotificaciones}
      >
        <Typography
          variant="subtitle1"
          style={{ marginLeft: "10px", color: "#17a2b8" }}
        >
          <strong>Notificaciones</strong>
        </Typography>
        <List style={{ overflow: "auto" }}>{getNotificaciones()}</List>
      </StyledMenu>
      <Dialog
        fullScreen={fullScreenDialog}
        open={openDialogEmpresas}
        onClose={handleCloseDialogEmpresas}
        aria-labelledby="responsive-dialog-title"
      >
        <Typography
          variant="h5"
          style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}
        >
          Seleccionar Empresa
        </Typography>
        <Divider />
        <DialogContent>{getEmpresas()}</DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogEmpresas}
            color="default"
            variant="contained"
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
