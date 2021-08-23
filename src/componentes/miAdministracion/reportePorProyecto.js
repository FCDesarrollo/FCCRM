import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Link,
  Image,
} from "@react-pdf/renderer";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import swal from "sweetalert";
import jwt from "jsonwebtoken";
import moment from "moment";
import DublockLogo from "../../assets/images/logodublock.png";

const stylesPDF = StyleSheet.create({
  page: {
    flexDirection: "row",
    padding: 15,
  },
  pageConfig: {
    padding: 15,
  },
  body: {
    flexGrow: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: "row",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row", cursor: "pointer" },
  tableColProyectos: {
    width: 100 / 10 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColActividades: {
    width: 100 / 11 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColAcciones: {
    width: 100 / 9 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDocumentos: {
    width: 100 / 3 + "%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: { margin: "auto", marginTop: 5, fontSize: 12 },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  tableCellLink: { margin: "auto", marginTop: 5, fontSize: 10, color: "blue" },
  linksDocumentos: {
    color: "blue",
  },
});

export default function ReportePorProyecto(props) {
  const { idProyecto } = useParams();
  const setLoading = props.setLoading;
  let correoUsuario = "";
  let passwordUsuario = "";
  let rfcEmpresa = "";
  let idSubmenu = "";

  if (localStorage.getItem("dataTemporal")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("dataTemporal"),
        "mysecretpassword"
      );
      correoUsuario = decodedToken.data.correoUsuario;
      passwordUsuario = decodedToken.data.passwordUsuario;
      rfcEmpresa = decodedToken.data.rfcEmpresa;
      idSubmenu = decodedToken.data.idSubmenu;
    } catch (err) {
      localStorage.removeItem("dataTemporal");
    }
  }

  const fechaActual = moment();
  const [actividadesProyectosData, setActividadesProyectosData] = useState([]);
  const [accionesProyectosData, setAccionesProyectosData] = useState([]);
  const [documentosProyectosData, setDocumentosProyectosData] = useState([]);
  const estatus = ["Pendiente", "En proceso", "Terminado", "Cerrado"];

  const [
    {
      data: getPryProyActividadesInfoData,
      loading: getPryProyActividadesLoading,
      error: getPryProyActividadesError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyActividadesInfo`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
        IdProyecto: idProyecto,
        reportes: 0,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyActividadesInfoData) {
        if (getPryProyActividadesInfoData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getPryProyActividadesInfoData.error),
            "warning"
          );
        } else {
          let actividadesData = [];
          let accionesData = [];
          let documentosData = [];
          for (
            let x = 0;
            x < getPryProyActividadesInfoData.actividadesInfo.length;
            x++
          ) {
            actividadesData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              actividades:
                getPryProyActividadesInfoData.actividadesInfo[x].Actividades,
            });
            accionesData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              acciones:
                getPryProyActividadesInfoData.actividadesInfo[x].Acciones,
            });
            documentosData.push({
              idProyecto: getPryProyActividadesInfoData.actividadesInfo[x].id,
              nombreProyecto:
                getPryProyActividadesInfoData.actividadesInfo[x].Proyecto,
              documentos:
                getPryProyActividadesInfoData.actividadesInfo[x].Documentos,
            });
          }
          setActividadesProyectosData(actividadesData);
          setAccionesProyectosData(accionesData);
          setDocumentosProyectosData(documentosData);
        }
      }
    }

    checkData();
  }, [getPryProyActividadesInfoData]);

  if (getPryProyActividadesLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPryProyActividadesError) {
    return <ErrorQueryDB />;
  }
  return (
    <PDFViewer style={{ width: "99%", height: "98vh" }}>
      <Document>
        {actividadesProyectosData.map(
          (actividadesProyecto, indexActividadesProyecto) => (
            <Page
              key={indexActividadesProyecto}
              size="A4"
              style={stylesPDF.page}
            >
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Image src={DublockLogo} style={{ width: "200px" }} />
                </View>
                <View style={stylesPDF.row}>
                  <Text style={{ textAlign: "center" }}>
                    Detalle de Proyecto
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {actividadesProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Ps</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>NV</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecIni</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecFin</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Avance</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Agente</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Estatus</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>FecUltAccion</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Doctos</Text>
                    </View>
                    <View style={stylesPDF.tableColActividades}>
                      <Text style={stylesPDF.tableHeader}>Dias Retraso</Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {actividadesProyecto.actividades.map((actividad, index) => {
                    let diasRetraso = 0;
                    diasRetraso =
                      actividad.Avance !== 100 &&
                      actividad.FecFin < fechaActual.format("YYYY-MM-DD")
                        ? fechaActual.diff(actividad.FecFin, "days")
                        : 0;
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColActividades}>
                          <Text
                            id={`actividad${actividad.id}`}
                            style={stylesPDF.tableCell}
                          >
                            {actividad.Pos}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Nivel}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Actividad}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.FecIni}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.FecFin}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Avance}%
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {actividad.Agente}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>
                            {estatus[actividad.Estatus - 1]}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          {actividad.idUltimaAccion !== 0 ? (
                            <Link
                              style={stylesPDF.tableCellLink}
                              src={`#accion${actividad.idUltimaAccion}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {actividad.FecUltAccion}
                              </Text>
                            </Link>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {actividad.FecUltAccion}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          {actividad.numDocumentos > 0 ? (
                            <Link
                              style={stylesPDF.tableCellLink}
                              src={`#documentoActividad${actividad.id}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {actividad.numDocumentos}
                              </Text>
                            </Link>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {actividad.numDocumentos}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColActividades}>
                          <Text style={stylesPDF.tableCell}>{diasRetraso}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
        {accionesProyectosData.map(
          (accionesProyecto, indexAccionesProyecto) => (
            <Page key={indexAccionesProyecto} size="A4" style={stylesPDF.page}>
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Text style={{ textAlign: "center" }}>
                    Detalle de Acciones
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {accionesProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Accion</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>FecFinActividad</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>FechaAccion</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Ejecutó</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Avance</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Estatus</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>Docto</Text>
                    </View>
                    <View style={stylesPDF.tableColAcciones}>
                      <Text style={stylesPDF.tableHeader}>
                        DiasRetrasoVsPlan
                      </Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {accionesProyecto.acciones.map((accion, index) => {
                    let diasRetraso = 0;
                    diasRetraso = moment(accion.fecha).diff(
                      accion.fecFinActividad,
                      "days"
                    );
                    diasRetraso = diasRetraso > 0 ? diasRetraso : 0;
                    let personas = "";
                    for (let x = 0; x < accion.personas.length; x++) {
                      personas += accion.personas[x].Agente;
                      personas +=
                        x === accion.personas.length - 1
                          ? ""
                          : x === accion.personas.length - 2
                          ? " y "
                          : " ,";
                    }
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColAcciones}>
                          <Link
                            style={stylesPDF.tableCellLink}
                            src={`#actividad${accion.idactividad}`}
                          >
                            <Text
                              id={`accion${accion.id}`}
                              style={stylesPDF.tableCell}
                            >
                              {accion.Actividad}
                            </Text>
                          </Link>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.nombre}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.fecFinActividad}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.fecha}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>{personas}</Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {accion.Avance}%
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>
                            {estatus[accion.estatus - 1]}
                          </Text>
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          {accion.numDocumentos > 0 ? (
                            <Link
                              style={stylesPDF.tableCellLink}
                              src={`#documentoaccion${accion.id}`}
                            >
                              <Text style={stylesPDF.tableCell}>
                                {accion.numDocumentos}
                              </Text>
                            </Link>
                          ) : (
                            <Text style={stylesPDF.tableCell}>
                              {accion.numDocumentos}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColAcciones}>
                          <Text style={stylesPDF.tableCell}>{diasRetraso}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
        {documentosProyectosData.map(
          (documentosProyecto, indexDocumentosProyecto) => (
            <Page
              key={indexDocumentosProyecto}
              size="A4"
              style={stylesPDF.page}
            >
              <View style={stylesPDF.body}>
                <View style={stylesPDF.row}>
                  <Text
                    id={`documentos${documentosProyecto.idProyecto}`}
                    style={{ textAlign: "center" }}
                  >
                    Detalle de Documentos
                  </Text>
                </View>
                <View style={stylesPDF.row}>
                  <Text>Proyecto: {documentosProyecto.nombreProyecto}</Text>
                </View>
                <View style={stylesPDF.table}>
                  {/* TableHeader */}
                  <View style={stylesPDF.tableRow}>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Actividad</Text>
                    </View>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Accion</Text>
                    </View>
                    <View style={stylesPDF.tableColDocumentos}>
                      <Text style={stylesPDF.tableHeader}>Documento</Text>
                    </View>
                  </View>
                  {/* TableBody */}
                  {documentosProyecto.documentos.map((documento, index) => {
                    return (
                      <View style={stylesPDF.tableRow} key={index}>
                        <View style={stylesPDF.tableColDocumentos}>
                          {documento.idactividad !== 0 ? (
                            <Link
                              style={stylesPDF.linksDocumentos}
                              src={`#actividad${documento.idactividad}`}
                            >
                              <Text
                                id={`documentoActividad${documento.idactividad}`}
                                style={stylesPDF.tableCell}
                              >
                                {documento.Actividad}
                              </Text>
                            </Link>
                          ) : (
                            <Text
                              id={`documentoActividad${documento.idactividad}`}
                              style={stylesPDF.tableCell}
                            >
                              {documento.Actividad}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColDocumentos}>
                          {documento.idaccion !== 0 ? (
                            <Link
                              style={stylesPDF.linksDocumentos}
                              src={`#accion${documento.idaccion}`}
                            >
                              <Text
                                id={`documentoAccion${documento.idaccion}`}
                                style={stylesPDF.tableCell}
                              >
                                {documento.Accion}
                              </Text>
                            </Link>
                          ) : (
                            <Text
                              id={`documentoAccion${documento.idaccion}`}
                              style={stylesPDF.tableCell}
                            >
                              {documento.Accion}
                            </Text>
                          )}
                        </View>
                        <View style={stylesPDF.tableColDocumentos}>
                          <Link
                            style={stylesPDF.linksDocumentos}
                            src={documento.LinkDocumento}
                            rel="noopener noreferrer meaning"
                            target="_blank"
                          >
                            <Text style={stylesPDF.tableCell}>
                              {documento.NombreDocumento}
                            </Text>
                          </Link>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Page>
          )
        )}
      </Document>
    </PDFViewer>
  );
}
