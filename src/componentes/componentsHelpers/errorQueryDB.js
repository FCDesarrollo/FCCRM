import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, Button } from "@material-ui/core";
import { PortableWifiOff as PortableWifiOffIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    width: "fit-content",
    marginTop: "10%"
  },
  container: {
    padding: theme.spacing(3, 2)
  },
  icon: {
    color: "#D32F2F",
    fontSize: 100
  },
  items: {
    marginTop: "20px"
  },
  button: {
      marginBottom: "20px"
  }
}));

export default function ErrorQueryDB(props) {
    const classes = useStyles();
    const mensaje = props.mensaje;
  return (
      <Grid container justify="center">
        <Grid item xs={8}>
        <Card className={classes.root}>
        <Grid container className={classes.container}>
          <Grid item xs={12} className={classes.items}>
            <PortableWifiOffIcon className={classes.icon} />
          </Grid>
          <Grid item xs={12} className={classes.items}>
            <Typography variant="h3">Error inesperado</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
            {mensaje ? mensaje : 'Ha surgido un error. Revise su conexión a Internet.'}
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.items}>
              <Button variant="contained" color="primary" className={classes.button} onClick={() => {
                window.location.reload();
              }}>
                Recargar Página
              </Button>
          </Grid>
        </Grid>
      </Card>
        </Grid>
      </Grid>
  );
}
