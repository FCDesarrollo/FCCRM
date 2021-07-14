import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  CircularProgress,
  Collapse,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ViewModule as ViewModuleIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Minimize as MinimizeIcon,
} from "@material-ui/icons";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import LogoFrancoCabanillas from "../../assets/images/logo-fc-consultores.png";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    backgroundColor: "#FFFFFF",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  menuHeader: {
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  itemsMenuHeader: {
    position: "relative",
    color: "#000000",
    listStyle: "none",
    display: "inline-block",
    "&:hover": {
      backgroundColor: "#333333",
      "& > ul": {
        display: "block",
      },
    },
  },
  submenuHeader: {
    position: "absolute",
    backgroundColor: "#333333",
    width: "100%",
    display: "none",
    listStyle: "none",
    fontFamily: "Calibri",
    padding: 0,
    "&:hover < li": {
      color: "#FFFFFF",
    },
  },
  linksSubmenuHeader: {
    display: "block",
    padding: "15px",
    color: "#FFFFFF",
    textDecoration: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      color: "#000000",
      "& $linksMenuHeader": {
        color: "#000000",
      },
    },
  },
  linksMenuHeader: {
    color: "#43474d",
    display: "block",
    textDecoration: "none",
    fontSize: "17px",
    fontFamily: "Calibri",
    textTransform: "inherit",
    padding: "15px 20px",
    "&:hover": {
      color: "#FFFFFF",
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
    alignItems: "baseline",
  },
  listItemTextDrawer: {
    fontFamily: "Calibri",
  },
}));

export default function HeaderNuevaContabilidad(props) {
  const classes = useStyles();
  const component = props.component;
  const solucionesNuevaContabilidad = props.solucionesNuevaContabilidad;
  const setSolucionesNuevaContabilidad = props.setSolucionesNuevaContabilidad;
  const modulosNuevaContabilidad = props.modulosNuevaContabilidad;
  const setModulosNuevaContabilidad = props.setModulosNuevaContabilidad;
  const setDocumentosGeneralesNuevaContabilidad =
    props.setDocumentosGeneralesNuevaContabilidad;
  const setEstadosNuevaContabilidad = props.setEstadosNuevaContabilidad;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [
    openDrawerSolucionesOptions,
    setOpenDrawerSolucionesOptions,
  ] = useState(false);
  const [openDrawerModulosOptions, setOpenDrawerModulosOptions] = useState(
    false
  );
  /* const setIdSolucion = props.setIdSolucion; */
  /* const setIdModulo = props.setIdModulo; */
  /* const [soluciones, setSoluciones] = useState([]); */
  /* const [modulos, setModulos] = useState([]); */

  const [
    {
      data: traerDatosNuevaContabilidadData,
      loading: traerDatosNuevaContabilidadLoading,
      error: traerDatosNuevaContabilidadError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/traerDatosNuevaContabilidad`,
      method: "GET",
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (traerDatosNuevaContabilidadData) {
      setSolucionesNuevaContabilidad(
        traerDatosNuevaContabilidadData.soluciones
      );
      setModulosNuevaContabilidad(traerDatosNuevaContabilidadData.modulos);
      setDocumentosGeneralesNuevaContabilidad(
        traerDatosNuevaContabilidadData.generales
      );
      setEstadosNuevaContabilidad(traerDatosNuevaContabilidadData.estados);
    }
  }, [
    traerDatosNuevaContabilidadData,
    setSolucionesNuevaContabilidad,
    setModulosNuevaContabilidad,
    setDocumentosGeneralesNuevaContabilidad,
    setEstadosNuevaContabilidad,
  ]);

  if (traerDatosNuevaContabilidadLoading) {
    return <CircularProgress />;
  }
  if (traerDatosNuevaContabilidadError) {
    return <ErrorQueryDB />;
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <AppBar
          position="fixed"
          style={{ backgroundColor: "#FFFFFF", opacity: "90%" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              <MenuIcon style={{ color: "#000000" }} />
            </IconButton>
            <img
              src={LogoFrancoCabanillas}
              alt="Franco Cabanillas"
              style={{ flexGrow: 1, height: "50px", maxWidth: "170px" }}
            />
            <ul className={classes.menuHeader}>
              <li className={classes.itemsMenuHeader}>
                <a
                  className={classes.linksMenuHeader}
                  href="/#/laNuevaContabilidad"
                >
                  La Nueva Contabilidad
                </a>
              </li>
              <li className={classes.itemsMenuHeader}>
                <Button className={classes.linksMenuHeader}>
                  Soluciones para tu negocio{" "}
                  <ExpandMoreIcon style={{ verticalAlign: "text-bottom" }} />
                </Button>
                <ul className={classes.submenuHeader}>
                  {solucionesNuevaContabilidad.map((solucion, index) => {
                    return (
                      <li key={index}>
                        <span
                          className={classes.linksSubmenuHeader}
                          onClick={() => {
                            window.open(solucion.linkDocumento);
                          }}
                        >
                          <ViewModuleIcon
                            style={{ marginRight: 15, verticalAlign: "middle" }}
                          />
                          {solucion.nombre}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li
                className={classes.itemsMenuHeader}
                /* onMouseLeave={() => {
                  console.log("dejo el mouse");
                }} */
              >
                <Button
                  className={classes.linksMenuHeader}
                  /* onClick={() => {
                    setIdModulo(0);
                  }} */
                >
                  Módulos disponibles
                  <ExpandMoreIcon style={{ verticalAlign: "text-bottom" }} />
                </Button>
                <ul className={classes.submenuHeader}>
                  {modulosNuevaContabilidad.map((modulo, index) => {
                    return index < 4 ? (
                      <li key={index}>
                        <span
                          className={classes.linksSubmenuHeader}
                          onClick={() => {
                            window.open(modulo.linkDocumento);
                          }}
                        >
                          <ViewModuleIcon
                            style={{ marginRight: 15, verticalAlign: "middle" }}
                          />
                          {modulo.nombre}
                        </span>
                      </li>
                    ) : null;
                  })}
                  <li>
                    <a
                      className={classes.linksSubmenuHeader}
                      href="/#/laNuevaContabilidad/modulos"
                    >
                      <ViewModuleIcon
                        style={{ marginRight: 15, verticalAlign: "middle" }}
                      />
                      Ver más ...
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </Toolbar>
        </AppBar>
      </Grid>
      <Grid item xs={12} style={{ width: "min-content" }}>
        {component}
      </Grid>
      <div>
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <List>
            <Link
              to="/laNuevaContabilidad"
              style={{ textDecoration: "none", color: "#000000" }}
            >
              <ListItem
                button
                divider
                onClick={() => {
                  setOpenDrawer(false);
                }}
              >
                <ListItemIcon>
                  <ViewModuleIcon color="primary" />
                </ListItemIcon>
                <ListItemText classes={{ primary: classes.listItemTextDrawer }}>
                  La Nueva Contabilidad
                </ListItemText>
              </ListItem>
            </Link>
            <ListItem
              button
              divider
              onClick={() => {
                setOpenDrawerSolucionesOptions(!openDrawerSolucionesOptions);
                setOpenDrawerModulosOptions(false);
              }}
            >
              <ListItemIcon>
                <ViewModuleIcon color="primary" />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.listItemTextDrawer }}>
                Soluciones para tu negocio
              </ListItemText>
              {openDrawerSolucionesOptions ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ListItem>
            <Collapse
              in={openDrawerSolucionesOptions}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {solucionesNuevaContabilidad.map((solucion, index) => (
                  <ListItem
                    key={index}
                    button
                    className={classes.nested}
                    onClick={() => {
                      setOpenDrawerSolucionesOptions(false);
                      setOpenDrawer(false);
                      window.open(solucion.linkDocumento);
                    }}
                  >
                    <ListItemIcon>
                      <MinimizeIcon style={{ color: "#000000" }} />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.listItemTextDrawer }}
                      primary={solucion.nombre}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <ListItem
              button
              divider
              onClick={() => {
                setOpenDrawerModulosOptions(!openDrawerModulosOptions);
                setOpenDrawerSolucionesOptions(false);
              }}
            >
              <ListItemIcon>
                <ViewModuleIcon color="primary" />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.listItemTextDrawer }}>
                Módulos disponibles
              </ListItemText>
              {openDrawerModulosOptions ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ListItem>
            <Collapse
              in={openDrawerModulosOptions}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {modulosNuevaContabilidad.map((modulo, index) => {
                  return index < 4 ? (
                    <ListItem
                      key={index}
                      button
                      className={classes.nested}
                      onClick={() => {
                        setOpenDrawerModulosOptions(false);
                        setOpenDrawer(false);
                        window.open(modulo.linkDocumento);
                      }}
                    >
                      <ListItemIcon>
                        <MinimizeIcon style={{ color: "#000000" }} />
                      </ListItemIcon>
                      <ListItemText
                        classes={{ primary: classes.listItemTextDrawer }}
                        primary={modulo.nombre}
                      />
                    </ListItem>
                  ) : null;
                })}
                <Link
                  style={{ textDecoration: "none", color: "#000000" }}
                  to="/laNuevaContabilidad/modulos"
                >
                  <ListItem
                    button
                    className={classes.nested}
                    onClick={() => {
                      setOpenDrawerModulosOptions(false);
                      setOpenDrawer(false);
                    }}
                  >
                    <ListItemIcon>
                      <MinimizeIcon style={{ color: "#000000" }} />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.listItemTextDrawer }}
                      primary="Ver más ..."
                    />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </List>
        </Drawer>
      </div>
    </Grid>
  );
}
