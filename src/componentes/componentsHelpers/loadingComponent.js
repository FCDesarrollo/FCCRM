import React from "react";
import LoadingLogo from "../../assets/images/loading.gif";
import { Typography, Grid } from "@material-ui/core";

export default function LoadingComponent(props) {
  const mensaje = props.mensaje;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant="h6"
          style={{ textAlign: "center", background: "#FFFFFF" }}
        >
          {mensaje}
        </Typography>
        <div
          style={{
            backgroundColor: "#fff",
            position: "fixed",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            /* opacity: "0.8" */
          }}
        >
          <img src={LoadingLogo} alt="loading..." />
        </div>
      </Grid>
    </Grid>
  );
}
