import React from "react";
import { Card, Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "10px",
    height: "100%",
    width: "100%"
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px"
  },
  buttons: {
    width: "100%",
    height: "100%",
    marginTop: "5px",
    marginBottom: "5px",
    "&:hover": {
      background: "#0866C6",
      color: "#FFFFFF"
    }
  }
}));

export default function ExpedientesDigitales(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  return (
    <Card className={classes.card}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} md={11}>
          <Typography variant="h6" className={classes.title}>
            Expedientes Digitales
          </Typography>
        </Grid>
        {submenuContent.map((content, index) => {
          return content.submenu.orden !== 0 ? (
            <Grid item xs={12} md={5} key={index}>
              <Button
                variant="outlined"
                color="primary"
                disabled={content.permisos === 0}
                className={classes.buttons}
              >
                {content.submenu.nombre_submenu}
              </Button>
            </Grid>
          ) : null;
        })}
        {/*<Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            CONSTITUCIÓN Y ESTATUTOS
          </Button>
        </Grid>
        <Grid item md={1} />
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            GOBIERNO
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            BANCOS
          </Button>
        </Grid>
        <Grid item md={1} />
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            RECURSOS HUMANOS
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            CLIENTES
          </Button>
        </Grid>
        <Grid item md={1} />
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            MPROVEEDORES
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttons}
          >
            ACTIVOS FIJOS
          </Button>
        </Grid>*/}
      </Grid>
    </Card>
  );
}
