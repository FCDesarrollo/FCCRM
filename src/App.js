import React, { useState } from "react";
import {
  /*BrowserRouter as Router,*/ Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import Header from "./componentes/header/header";
import Login from "./componentes/login/login";
import OlvidoContra from "./componentes/login/olvidoContra";
import Registrate from "./componentes/login/registrate";
import VerificarCodigo from "./componentes/login/verificarCodigo";
import ReenviarCodigoVerificacion from "./componentes/login/reenviarCodigoVerificacion";
import CambiarContra from "./componentes/login/cambiarContra";
import Empresas from "./componentes/empresas/empresas";
import CPanel from "./componentes/proveedores/cPanel";
import PUsuarios from "./componentes/proveedores/usuarios";
import PEmpresas from "./componentes/proveedores/empresas";
import PPerfiles from "./componentes/proveedores/perfiles";
import PServicios from "./componentes/proveedores/servicios";
import AgregarEmpresa from "./componentes/empresas/agregarEmpresa";
import VincularEmpresa from "./componentes/empresas/vincularEmpresa";
import Home from "./componentes/home/home";
import EditarPerfil from "./componentes/header/editarPerfil";
import Empresa from "./componentes/miCuenta/empresa";
import Usuarios from "./componentes/miCuenta/usuarios";
import Perfiles from "./componentes/miCuenta/perfiles";
import AutorizacionesGastos from "./componentes/miAdministracion/autorizacionesGastos";
import ConfiguracionesPermisos from "./componentes/miAdministracion/configuracionesPermisos";
import FinanzasTesoreria from "./componentes/miAdministracion/finanzasTesoreria";
import GestionEmpresarial from "./componentes/miAdministracion/gestionEmpresarial";
import ReportesPDF from "./componentes/miAdministracion/reportesPDF";
import ReportesProyectos from "./componentes/miAdministracion/reportesProyectos";
import ReportePorProyecto from "./componentes/miAdministracion/reportePorProyecto";
import ExpedientesDigitales from "./componentes/miAdministracion/expedientesDigitales";
import Publicaciones from "./componentes/miAdministracion/publicaciones";
import EstadosFinancieros from "./componentes/miContabilidad/estadosFinancieros";
import CumplimientoFiscal from "./componentes/miContabilidad/cumplimientoFiscal";
import ExpedientesContables from "./componentes/miContabilidad/expedientesContables";
import AlmacenDigitalOperaciones from "./componentes/miBandejaDeEntrada/almacenDigitalOperaciones";
import RecepcionPorLotes from "./componentes/miBandejaDeEntrada/recepcionPorLotes";
import AlmacenDigitalExpedientes from "./componentes/miBandejaDeEntrada/almacenDigitalExpedientes";
import CartasTecnicas from "./componentes/miPortalDeConocimiento/cartasTecnicas";
import Videos from "./componentes/miPortalDeConocimiento/videos";
import NoticiasFiscales from "./componentes/miPortalDeConocimiento/noticiasFiscales";
import NuevaContabilidad from "./componentes/nuevaContabilidad/nuevaContabilidad";
import HeaderContabilidad from "./componentes/nuevaContabilidad/headerNuevaContabilidad";
import SolucionesNuevaContabilidad from "./componentes/nuevaContabilidad/solucionesNuevaContabilidad";
import ModulosNuevaContabilidad from "./componentes/nuevaContabilidad/modulosNuevaContabilidad";
import NotFound from "./componentes/componentsHelpers/notFound";

function App() {
  const [submenuContent, setSubmenuContent] = useState([]);
  const [usuarioDatos, setUsuarioDatos] = useState([]);
  const [empresaDatos, setEmpresaDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [executeQueriesHeader, setExecuteQueriesHeader] = useState(false);
  const [solucionesNuevaContabilidad, setSolucionesNuevaContabilidad] =
    useState([]);
  const [modulosNuevaContabilidad, setModulosNuevaContabilidad] = useState([]);
  const [
    documentosGeneralesNuevaContabilidad,
    setDocumentosGeneralesNuevaContabilidad,
  ] = useState([]);
  const [estadosNuevaContabilidad, setEstadosNuevaContabilidad] = useState([]);

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/laNuevaContabilidad">
          <HeaderContabilidad
            solucionesNuevaContabilidad={solucionesNuevaContabilidad}
            setSolucionesNuevaContabilidad={setSolucionesNuevaContabilidad}
            modulosNuevaContabilidad={modulosNuevaContabilidad}
            setModulosNuevaContabilidad={setModulosNuevaContabilidad}
            documentosGeneralesNuevaContabilidad={
              documentosGeneralesNuevaContabilidad
            }
            setDocumentosGeneralesNuevaContabilidad={
              setDocumentosGeneralesNuevaContabilidad
            }
            estadosNuevaContabilidad={estadosNuevaContabilidad}
            setEstadosNuevaContabilidad={setEstadosNuevaContabilidad}
            component={
              <NuevaContabilidad
                solucionesNuevaContabilidad={solucionesNuevaContabilidad}
                documentosGeneralesNuevaContabilidad={
                  documentosGeneralesNuevaContabilidad
                }
                estadosNuevaContabilidad={estadosNuevaContabilidad}
              />
            }
          />
        </Route>
        <Route exact path="/laNuevaContabilidad/soluciones">
          <HeaderContabilidad
            solucionesNuevaContabilidad={solucionesNuevaContabilidad}
            setSolucionesNuevaContabilidad={setSolucionesNuevaContabilidad}
            modulosNuevaContabilidad={modulosNuevaContabilidad}
            setModulosNuevaContabilidad={setModulosNuevaContabilidad}
            documentosGeneralesNuevaContabilidad={
              documentosGeneralesNuevaContabilidad
            }
            setDocumentosGeneralesNuevaContabilidad={
              setDocumentosGeneralesNuevaContabilidad
            }
            estadosNuevaContabilidad={estadosNuevaContabilidad}
            setEstadosNuevaContabilidad={setEstadosNuevaContabilidad}
            component={<SolucionesNuevaContabilidad />}
          />
        </Route>
        <Route exact path="/laNuevaContabilidad/modulos">
          <HeaderContabilidad
            solucionesNuevaContabilidad={solucionesNuevaContabilidad}
            setSolucionesNuevaContabilidad={setSolucionesNuevaContabilidad}
            modulosNuevaContabilidad={modulosNuevaContabilidad}
            setModulosNuevaContabilidad={setModulosNuevaContabilidad}
            documentosGeneralesNuevaContabilidad={
              documentosGeneralesNuevaContabilidad
            }
            setDocumentosGeneralesNuevaContabilidad={
              setDocumentosGeneralesNuevaContabilidad
            }
            estadosNuevaContabilidad={estadosNuevaContabilidad}
            setEstadosNuevaContabilidad={setEstadosNuevaContabilidad}
            component={
              <ModulosNuevaContabilidad
                modulosNuevaContabilidad={modulosNuevaContabilidad}
              />
            }
          />
        </Route>
        <Route exact path="/olvidoContra">
          <OlvidoContra />
        </Route>
        <Route exact path="/registrate">
          <Registrate />
        </Route>
        <Route exact path="/verificarCodigo">
          <VerificarCodigo />
        </Route>
        <Route exact path="/reenviarCodigoVerificacion">
          <ReenviarCodigoVerificacion />
        </Route>
        <Route exact path="/cambiarContra">
          <CambiarContra />
        </Route>
        <Route exact path="/empresas">
          <Empresas setEmpresaDatos={setEmpresaDatos} />
        </Route>
        <Route exact path="/cpanel">
          <CPanel
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
          />
        </Route>
        <Route exact path="/proveedores/usuarios">
          <CPanel
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <PUsuarios
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/proveedores/empresas">
          <CPanel
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <PEmpresas
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/proveedores/perfiles">
          <CPanel
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <PPerfiles
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/proveedores/servicios">
          <CPanel
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <PServicios
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/agregarEmpresa">
          <AgregarEmpresa />
        </Route>
        <Route exact path="/vincularEmpresa">
          <VincularEmpresa />
        </Route>
        <Route exact path="/">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <Home
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/editarPerfil">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <EditarPerfil
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/empresa">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <Empresa
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/usuarios">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            executeQueriesHeader={executeQueriesHeader}
            setExecuteQueriesHeader={setExecuteQueriesHeader}
            component={
              <Usuarios
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
                setExecuteQueriesHeader={setExecuteQueriesHeader}
              />
            }
          />
        </Route>
        <Route exact path="/perfiles">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <Perfiles
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/autorizacionesGastos">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <AutorizacionesGastos
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/configuracionesPermisos">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <ConfiguracionesPermisos
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/finanzasTesoreria">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <FinanzasTesoreria
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/gestionEmpresarial">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <GestionEmpresarial
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/reportesPDF">
          <ReportesPDF
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
          />
        </Route>
        <Route exact path="/reportesProyectos">
          <ReportesProyectos
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
          />
        </Route>
        <Route exact path="/reportesProyectos/:idProyecto">
          <ReportePorProyecto
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
          />
        </Route>
        <Route exact path="/expedientesDigitales">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <ExpedientesDigitales
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/publicaciones">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <Publicaciones
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/estadosFinancieros">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <EstadosFinancieros
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/cumplimientoFiscal">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <CumplimientoFiscal
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/expedientesContables">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <ExpedientesContables
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/almacenDigitalOperaciones">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <AlmacenDigitalOperaciones
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/recepcionPorLotes">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <RecepcionPorLotes
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/almacenDigitalExpedientes">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <AlmacenDigitalExpedientes
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/cartasTecnicas">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <CartasTecnicas
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/videos">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <Videos
                submenuContent={submenuContent}
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="/noticiasFiscales">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={
              <NoticiasFiscales
                setSubmenuContent={setSubmenuContent}
                usuarioDatos={usuarioDatos}
                setUsuarioDatos={setUsuarioDatos}
                empresaDatos={empresaDatos}
                setEmpresaDatos={setEmpresaDatos}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
        <Route exact path="*">
          <Header
            submenuContent={submenuContent}
            setSubmenuContent={setSubmenuContent}
            usuarioDatos={usuarioDatos}
            setUsuarioDatos={setUsuarioDatos}
            empresaDatos={empresaDatos}
            setEmpresaDatos={setEmpresaDatos}
            loading={loading}
            setLoading={setLoading}
            component={<NotFound />}
          />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
