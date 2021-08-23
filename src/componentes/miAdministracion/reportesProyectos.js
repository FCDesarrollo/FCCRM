import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Link,
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

export default function ReportesPDF(props) {
  const setLoading = props.setLoading;
  let correoUsuario = "";
  let passwordUsuario = "";
  let rfcEmpresa = "";
  let nombreEmpresa = "";
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
      nombreEmpresa = decodedToken.data.nombreEmpresa;
      idSubmenu = decodedToken.data.idSubmenu;
    } catch (err) {
      localStorage.removeItem("dataTemporal");
    }
  }

  const fechaActual = moment();
  const [proyectosData, setProyectosData] = useState([]);
  const estatus = ["Pendiente", "En proceso", "Terminado", "Cerrado"];
  const currentServer = window.location.origin;

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
        reportes: 1,
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
          setProyectosData(getPryProyActividadesInfoData.actividadesInfo);
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
      <PDFViewer
        style={{ width: "99%", height: "98vh" }}
      >
        <Document
        >
          <Page size="A4" style={stylesPDF.page}>
            <View style={stylesPDF.body}>
              <View style={stylesPDF.row}>
                <Image src={DublockLogo} style={{ width: "200px" }} />
              </View>
              <View style={stylesPDF.row}>
                <Text>{nombreEmpresa}</Text>
              </View>
              <View style={stylesPDF.row}>
                <Text>Reporte de Avance de Proyectos</Text>
              </View>
              <View style={stylesPDF.row}>
                <Text>Fecha de Corte: {fechaActual.format("YYYY-MM-DD")}</Text>
              </View>
              <View style={stylesPDF.row}>
                <Text>Resumen de Proyectos</Text>
              </View>
              <View style={stylesPDF.table}>
                <View style={stylesPDF.tableRow}>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Proyecto</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Actividades</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>FecIni</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>FecFin</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Avance</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Responsable</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Estatus</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>FecUltAccion</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Doctos</Text>
                  </View>
                  <View style={stylesPDF.tableColProyectos}>
                    <Text style={stylesPDF.tableHeader}>Dias Retraso</Text>
                  </View>
                </View>
                {proyectosData.map((proyecto, index) => {
                  let diasRetraso = 0;
                  proyecto.Actividades.filter(
                    (actividad) =>
                      actividad.Avance !== 100 &&
                      actividad.FecFin < fechaActual.format("YYYY-MM-DD")
                  ).map((actividad) => {
                    return (diasRetraso =
                      diasRetraso >= fechaActual.diff(actividad.FecFin, "days")
                        ? diasRetraso
                        : fechaActual.diff(actividad.FecFin, "days"));
                  });
                  return (
                    <View style={stylesPDF.tableRow} key={index}>
                      <View style={stylesPDF.tableColProyectos}>
                        <Link
                          id={`linkproyecto${proyecto.id}`}
                          style={stylesPDF.tableCellLink}
                          src={`${currentServer}/#/reportesProyectos/${proyecto.id}`}
                        >
                          <Text  style={stylesPDF.tableCell}>
                            {proyecto.Proyecto}
                          </Text>
                        </Link>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>{`${
                          proyecto.Actividades.length
                        } ${
                          proyecto.Actividades.length === 1
                            ? "Actividad"
                            : "Actividades"
                        }`}</Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {proyecto.FecIni}
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {proyecto.FecFin}
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {proyecto.Avance}%
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {proyecto.Agente}
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {estatus[proyecto.Estatus - 1]}
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>
                          {proyecto.FecUltAccion}
                        </Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>{`${
                          proyecto.Documentos.length
                        } ${
                          proyecto.Documentos.length === 1 ? "Docto" : "Doctos"
                        }`}</Text>
                      </View>
                      <View style={stylesPDF.tableColProyectos}>
                        <Text style={stylesPDF.tableCell}>{diasRetraso}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
  );
}
