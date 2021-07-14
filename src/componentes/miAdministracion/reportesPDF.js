import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
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

const stylesPDF = StyleSheet.create({
  page: {
    flexDirection: "row",
    padding: 15,
  },
  pageConfig: {
    padding: 15,
  },
  section: {
    flexGrow: 1,
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
  tableCol: {
    width: 100 / 7 + "%",
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

  const [proyectos, setProyectos] = useState([]);
  const [proyectosDocumentos, setProyectosDocumentos] = useState([]);

  const [
    {
      data: getPryProyectosData,
      loading: getPryProyectosLoading,
      error: getPryProyectosError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyectos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  const [
    {
      data: getPryProyDocumentosData,
      loading: getPryProyDocumentosLoading,
      error: getPryProyDocumentosError,
    },
  ] = useAxios(
    {
      url: API_BASE_URL + `/getPryProyDocumentos`,
      method: "GET",
      params: {
        usuario: correoUsuario,
        pwd: passwordUsuario,
        rfc: rfcEmpresa,
        idsubmenu: idSubmenu,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    function checkData() {
      if (getPryProyectosData) {
        if (getPryProyectosData.error !== 0) {
          swal("Error", dataBaseErrores(getPryProyectosData.error), "warning");
        } else {
          setProyectos(getPryProyectosData.proyectos);
        }
      }
    }

    checkData();
  }, [getPryProyectosData]);

  useEffect(() => {
    function checkData() {
      if (getPryProyDocumentosData) {
        if (getPryProyDocumentosData.error !== 0) {
          swal(
            "Error",
            dataBaseErrores(getPryProyDocumentosData.error),
            "warning"
          );
        } else {
          setProyectosDocumentos(getPryProyDocumentosData.proyectosDocumentos);
        }
      }
    }

    checkData();
  }, [getPryProyDocumentosData]);

  if (getPryProyectosLoading || getPryProyDocumentosLoading) {
    setLoading(true);
    return <div></div>;
  } else {
    setLoading(false);
  }
  if (getPryProyectosError || getPryProyDocumentosError) {
    return <ErrorQueryDB />;
  }

  return (
    <PDFViewer style={{ width: "99%", height: "98vh" }}>
      <Document>
        <Page size="A4" style={stylesPDF.page}>
          <View style={stylesPDF.table}>
            {/* TableHeader */}
            <View style={stylesPDF.tableRow}>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Proyecto</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Responsable</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Clas 1</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Clas 2</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Clas 3</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Clas 4</Text>
              </View>
              <View style={stylesPDF.tableCol}>
                <Text style={stylesPDF.tableHeader}>Documentos</Text>
              </View>
            </View>
            {/* TableBody */}
            {proyectos.map((proyecto, index) => (
              <View style={stylesPDF.tableRow} key={index}>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.Proyecto}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.Agente}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.IdClas1}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.IdClas2}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.IdClas3}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Text style={stylesPDF.tableCell}>{proyecto.IdClas4}</Text>
                </View>
                <View style={stylesPDF.tableCol}>
                  <Link
                    style={stylesPDF.tableCellLink}
                    src={`#docs${proyecto.id}`}
                  >
                    {proyecto.numDocumentos}
                  </Link>
                </View>
              </View>
            ))}
          </View>
        </Page>
        {proyectosDocumentos.map((proyecto, indexProyectos) => (
          <Page
            id={`docs${proyecto.id}`}
            key={indexProyectos}
            style={stylesPDF.pageConfig}
          >
            <View>
              <Text
                style={{ textAlign: "center" }}
              >{`Documentos de proyecto "${proyecto.Proyecto}"`}</Text>
            </View>
            {proyecto.documentos.map((documento, indexDocumentos) => (
              <View key={indexDocumentos}>
                <Link
                  style={stylesPDF.linksDocumentos}
                  src={documento.LinkDocumento}
                  target={"_blank"}
                >
                  {documento.NombreDocumento}
                </Link>
              </View>
            ))}
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}
