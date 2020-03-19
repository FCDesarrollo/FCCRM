import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import Paso1 from "./paso1";
import swal from "sweetalert";
import {
  verificarArchivoCer,
  verificarArchivoKey
} from "../../helpers/extensionesArchivos";
import { API_BASE_URL } from "../../config";
import useAxios from "axios-hooks";
import { dataBaseErrores } from "../../helpers/erroresDB";
import ErrorQueryDB from "../componentsHelpers/errorQueryDB";
import LoadingComponent from "../componentsHelpers/loadingComponent";
import Paso2 from "./paso2";
import { validarCorreo } from "../../helpers/inputHelpers";
import Paso3 from "./paso3";
const jwt = require("jsonwebtoken");

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

function getSteps() {
  return ["Paso 1", "Paso 2", "Paso 3"];
}

export default function AgregarEmpresa() {
  const classes = useStyles();
  const [userAuth, setUserAuth] = useState(true);
  const [redirectEmpresas, setRedirectEmpresas] = useState(false);
  let userEmail = "";
  let userPassword = "";
  if (localStorage.getItem("token")) {
    try {
      const decodedToken = jwt.verify(
        localStorage.getItem("token"),
        "mysecretpassword"
      );
      userEmail = decodedToken.userData.correo;
      userPassword = decodedToken.userData.password;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("emToken");
      setUserAuth(false);
    }
  }
  const [activeStep, setActiveStep] = useState(0);
  const [paso1Datos, setPaso1Datos] = useState({
    certificado: null,
    key: null,
    passwordcertificado: ""
  });
  const [paso2Datos, setPaso2Datos] = useState({
    nombreEmpresa: "",
    rfcEmpresa: "",
    fechaVencimiento: "",
    emailEmpresa: ""
  });
  const [paso3Datos, setPaso3Datos] = useState({
    codigoVerificacion: 0
  });
  const [codigo, setCodigo] = useState(0);
  const steps = getSteps();
  const [
    {
      data: validaEmpresaData,
      loading: validaEmpresaLoading,
      error: validaEmpresaError
    },
    executeValidaEmpresa
  ] = useAxios(
    {
      url: API_BASE_URL + `/validaEmpresa`,
      method: "POST"
    },
    {
      manual: true
    }
  );
  const [
    {
      data: enviaCorreoEmpresaData,
      loading: enviaCorreoEmpresaLoading,
      error: enviaCorreoEmpresaError
    },
    executeEnviaCorreoEmpresa
  ] = useAxios(
    {
      url: API_BASE_URL + `/enviaCorreoEmpresa`,
      method: "GET"
    },
    {
      manual: true
    }
  );
  const [
    {
      data: registraEmpresaData,
      loading: registraEmpresaLoading,
      error: registraEmpresaError
    },
    executeRegistraEmpresa
  ] = useAxios(
    {
      url: API_BASE_URL + `/registraEmpresa`,
      method: "POST"
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    function isUserAuth() {
      try {
        if (localStorage.getItem("token")) {
          jwt.verify(localStorage.getItem("token"), "mysecretpassword");
        } else {
          setUserAuth(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("emToken");
        setUserAuth(false);
      }
    }

    isUserAuth();
  });

  useEffect(() => {
    function checkData() {
      if (validaEmpresaData) {
        if (validaEmpresaData.error !== 0) {
          swal(
            "Error al validar la empresa",
            dataBaseErrores(validaEmpresaData.error),
            "error"
          );
        } else {
          if (activeStep === 0) {
            setPaso2Datos({
              ...paso2Datos,
              nombreEmpresa: validaEmpresaData.datos.empresa,
              rfcEmpresa: validaEmpresaData.datos.rfc,
              fechaVencimiento: validaEmpresaData.datos.fechavencimiento
            });
            setActiveStep(prevActiveStep => prevActiveStep + 1);
          }
        }
      }
    }

    checkData();
  }, [validaEmpresaData, activeStep, paso2Datos]);

  useEffect(() => {
    function checkData() {
      if (enviaCorreoEmpresaData) {
        if (enviaCorreoEmpresaData.error !== 0) {
          swal(
            "Error al crear la empresa",
            dataBaseErrores(enviaCorreoEmpresaData.error),
            "error"
          );
        } else {
          if (activeStep === 1) {
            setCodigo(enviaCorreoEmpresaData.codigo);
            setActiveStep(prevActiveStep => prevActiveStep + 1);
          }
        }
      }
    }

    checkData();
  }, [enviaCorreoEmpresaData, activeStep]);

  useEffect(() => {
    function checkData() {
      if (registraEmpresaData) {
        if (registraEmpresaData.error !== 0) {
          swal(
            "Error al crear la empresa",
            dataBaseErrores(registraEmpresaData.error),
            "error"
          );
        } else {
          if (activeStep === 2) {
            swal(
              "Registro exitoso",
              "La empresa se registró correctamente",
              "success"
            ).then(() => {
              setRedirectEmpresas(true);
            });
          }
        }
      }
    }

    checkData();
  }, [registraEmpresaData, activeStep]);

  if (
    validaEmpresaLoading ||
    enviaCorreoEmpresaLoading ||
    registraEmpresaLoading
  ) {
    return (
      <LoadingComponent
        mensaje={
          activeStep === 0
            ? "Validando empresa"
            : activeStep === 1
            ? "Validando datos de empresa"
            : "Registrando empresa (esto puede tardar varios minutos)"
        }
      />
    );
  }
  if (validaEmpresaError || enviaCorreoEmpresaError || registraEmpresaError) {
    return <ErrorQueryDB />;
  }

  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 0:
        return <Paso1 paso1Datos={paso1Datos} setPaso1Datos={setPaso1Datos} />;
      case 1:
        return <Paso2 paso2Datos={paso2Datos} setPaso2Datos={setPaso2Datos} />;
      case 2:
        return <Paso3 setPaso3Datos={setPaso3Datos} />;
      default:
        return "Paso desconocido";
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const { certificado, key, passwordcertificado } = paso1Datos;
      if (certificado === null) {
        swal("Faltan llenar campos", "Seleccione un archivo .cer", "warning");
      } else if (!verificarArchivoCer(certificado.name)) {
        swal(
          "Error de extensión de archivo",
          "Extensión no valida, seleccione un archivo .cer",
          "warning"
        );
      } else if (key === null) {
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
        formData.append("usuario", userEmail);
        formData.append("pwd", userPassword);
        formData.append("certificado", certificado);
        formData.append("key", key);
        formData.append("passwordcertificado", passwordcertificado);
        executeValidaEmpresa({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
    } else if (activeStep === 1) {
      const { nombreEmpresa, rfcEmpresa, emailEmpresa } = paso2Datos;
      if (nombreEmpresa.trim() === "") {
        swal("Error inesperado", "Falta el nombre de la empresa", "warning");
      } else if (rfcEmpresa.trim() === "") {
        swal("Error inesperado", "Falta el RFC de la empresa", "warning");
      } else if (emailEmpresa.trim() === "") {
        swal(
          "Faltan llenar campos",
          "Ingrese un correo electrónico",
          "warning"
        );
      } else if (!validarCorreo(emailEmpresa.trim())) {
        swal(
          "Error de formato",
          "Ingrese un correo electrónico valido",
          "warning"
        );
      } else {
        executeEnviaCorreoEmpresa({
          params: {
            usuario: userEmail,
            pwd: userPassword,
            correo: emailEmpresa
          }
        });
      }
    } else if (activeStep === 2) {
      const { codigoVerificacion } = paso3Datos;
      if (codigoVerificacion === "") {
        swal(
          "Faltan llenar campos",
          "Ingrese un código de verificación",
          "warning"
        );
      } else if (parseInt(codigoVerificacion) !== codigo) {
        swal(
          "Error en el código de verificación",
          "El código de verificación no coincide",
          "warning"
        );
      } else {
        const formData = new FormData();
        formData.append("usuario", userEmail);
        formData.append("pwd", userPassword);
        formData.append("rfc", paso2Datos.rfcEmpresa);
        formData.append("nombreempresa", paso2Datos.nombreEmpresa);
        formData.append("password", paso1Datos.passwordcertificado);
        formData.append("correo", paso2Datos.emailEmpresa);
        formData.append("fechavencimiento", paso2Datos.fechaVencimiento);
        formData.append("certificado", paso1Datos.certificado);
        formData.append("key", paso1Datos.key);
        executeRegistraEmpresa({
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return !userAuth ? (
    <Redirect to="/login" />
  ) : redirectEmpresas ? (
    <Redirect to="/empresas" />
  ) : (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
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
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </div>
            <div style={{ textAlign: "center" }}>
              <Tooltip title="Regresar">
                <Link to="/empresas">
                  <IconButton>
                    <ArrowBackIcon color="primary" />
                  </IconButton>
                </Link>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
