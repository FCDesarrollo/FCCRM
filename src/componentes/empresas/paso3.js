import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, TextField, Typography } from "@material-ui/core";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  textFields: {
    width: "100%"
  }
}));

export default function Paso3(props) {
  const classes = useStyles();
  const setPaso3Datos = props.setPaso3Datos;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Grid container justify="center" className={classes.root}>
            <Grid item xs={12}>
              <Typography variant="h6" style={{textAlign: "center"}}>Se envió un código de verificación a su correo</Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                id="codigoVerificacion"
                label="Código de verificación"
                variant="outlined"
                type="text"
                margin="normal"
                onKeyPress={e => {
                  keyValidation(e, 2);
                }}
                onChange={e => {
                  pasteValidation(e, 2);
                  setPaso3Datos({
                    codigoVerificacion: e.target.value
                  });
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
