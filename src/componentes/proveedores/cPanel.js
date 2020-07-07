import React, { useState, useEffect } from "react";
import { NavLink, Link, Redirect } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
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
  Grid,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  SettingsApplications as SettingsApplicationsIcon,
  RecentActors as RecentActorsIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
} from "@material-ui/icons";
import jwt from "jsonwebtoken";
import swal from "sweetalert";
import LoadingComponent from "../componentsHelpers/loadingComponent";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "#FFFFFF",
    color: "#868E96",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: "#1D2939",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "#1D2939",
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    background: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  toolbarMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nestedFirstLevel: {
    paddingLeft: theme.spacing(4),
    alignItems: "baseline",
  },
  nestedSecondLevel: {
    paddingLeft: theme.spacing(6),
  },
  titleTypography: {
    fontSize: "13px",
    marginRight: "5px",
  },
  toolbarIcons: {
    color: "#868E96",
  },
  toolbarIconButton1: {
    marginRight: "15px",
  },
  toolbarList: {
    padding: "0",
    display: "inline-flex",
    marginInlineStart: "auto",
  },
  toolbarListItemText: {
    fontSize: "13px",
    textAlign: "center",
  },
  toolbarListItemAvatar: {
    marginLeft: "20px",
    cursor: "pointer",
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
      transition: "all 0.2s ease-in-out",
    },
  },
  drawerToolbarTitleLeftSquareBracket: {
    color: "#00b297",
    marginRight: "5px",
  },
  drawerToolbarTitleRightSquareBracket: {
    color: "#00b297",
    marginLeft: "5px",
  },
  drawerNavHomeLinks: {
    textDecoration: "none",
    color: "#BDFAFF",
  },
  drawerNavLinks: {
    textDecoration: "none",
    color: "#ADB5BD",
  },
  drawerHomeNavLink: {
    background: "#00B297",
    "&:hover": {
      background: "#00B280",
    },
  },
  drawerHomeIcon: {
    color: "#BDFAFF",
  },
  drawerListTextAndItems: {
    color: "#ADB5BD",
  },
}));

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

export default function CPanel(props) {
  const classes = useStyles();
  const theme = useTheme();
  const component = props.component;
  const usuarioDatos = props.usuarioDatos;
  const setUsuarioDatos = props.setUsuarioDatos;
  const loading = props.loading;
  const [openDrawer, setOpenDrawer] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [userAuth, setUserAuth] = useState(true);
  const [proveedorAuth, setProveedorAuth] = useState(true);
  const [anchorMenuEl, setAnchorMenuEl] = useState(null);
  localStorage.removeItem("emToken");

  useEffect(() => {
    function putUserName() {
      try {
        if (localStorage.getItem("token")) {
          const decodedToken = jwt.verify(
            localStorage.getItem("token"),
            "mysecretpassword"
          );
          if(nombreUsuario === "") {
            setNombreUsuario(
              `${decodedToken.userData.nombre} ${decodedToken.userData.apellidop} ${decodedToken.userData.apellidom}`
            );
          }
          if (decodedToken.userData.idusuario !== usuarioDatos.idusuario) {
            setUsuarioDatos(decodedToken.userData);
          }
          if (decodedToken.userData.tipo !== 4) {
            setProveedorAuth(false);
          }
        } else {
          setUserAuth(false);
        }
      } catch (err) {
        setUserAuth(false);
      }
    }

    putUserName();
  });

  window.onhashchange = function () {
    const token = jwt.sign(
      {
        menuTemporal: {
          modulo: "",
          showComponent: 0,
          idUsuario: 0,
          busquedaFiltro: "",
          page: 0,
        },
      },
      "mysecretpassword"
    );
    localStorage.setItem("menuTemporal", token);
    //localStorage.removeItem("menuTemporal");
    window.location = `${window.location.origin}/${window.location.hash}`;
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleOpenMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const closeSesion = () => {
    swal({
      text: "¿Está seguro de cerrar sesión?",
      buttons: ["No", "Sí"],
      dangerMode: true,
    }).then((value) => {
      if (value) {
        localStorage.removeItem("token");
        setUserAuth(false);
      }
    });
  };

  return !userAuth ? (
    <Redirect to="/login" />
  ) : !proveedorAuth ? (
    <Redirect to="/empresas" />
  ) : (
    <div className={classes.root}>
      {loading ? <LoadingComponent /> : null}
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.titleTypography}>
            {`CPanel Proveedores`}
          </Typography>
          <List className={classes.toolbarList}>
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
                    {`Proveedor`}
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
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <Grid container justify="center">
            <Link to="/cPanel" className={classes.drawerToolbarTitle}>
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
          <NavLink to="/cPanel" className={classes.drawerNavHomeLinks}>
            <ListItem
              button
              className={classes.drawerHomeNavLink}
            >
              <ListItemIcon>
                <HomeIcon className={classes.drawerHomeIcon} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </NavLink>
          <NavLink
            to="/proveedores/usuarios"
            className={classes.drawerNavLinks}
          >
            <ListItem button className={classes.drawerListTextAndItems}>
              <ListItemIcon>
                <PersonIcon className={classes.drawerListTextAndItems} />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItem>
          </NavLink>
          <NavLink
            to="/proveedores/empresas"
            className={classes.drawerNavLinks}
          >
            <ListItem button className={classes.drawerListTextAndItems}>
              <ListItemIcon>
                <BusinessIcon className={classes.drawerListTextAndItems} />
              </ListItemIcon>
              <ListItemText primary="Empresas" />
            </ListItem>
          </NavLink>
          <NavLink
            to="/proveedores/perfiles"
            className={classes.drawerNavLinks}
          >
            <ListItem button className={classes.drawerListTextAndItems}>
              <ListItemIcon>
                <RecentActorsIcon className={classes.drawerListTextAndItems} />
              </ListItemIcon>
              <ListItemText primary="Perfiles" />
            </ListItem>
          </NavLink>
          <NavLink
            to="/proveedores/servicios"
            className={classes.drawerNavLinks}
          >
            <ListItem button className={classes.drawerListTextAndItems}>
              <ListItemIcon>
                <SettingsApplicationsIcon className={classes.drawerListTextAndItems} />
              </ListItemIcon>
              <ListItemText primary="Servicios" />
            </ListItem>
          </NavLink>
        </List>
      </Drawer>
      <main
        className={classes.content}
        style={{
          maxWidth: `calc(100% - ${openDrawer ? drawerWidth : 57}px)`,
        }}
      >
        <div className={classes.toolbarMain} />
        {component}
      </main>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorMenuEl}
        keepMounted
        open={Boolean(anchorMenuEl)}
        onClose={handleCloseMenu}
      >
        <NavLink
          to="/empresas"
          style={{ textDecoration: "none", color: "black" }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Panel de Usuario" />
          </MenuItem>
        </NavLink>
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
    </div>
  );
}
