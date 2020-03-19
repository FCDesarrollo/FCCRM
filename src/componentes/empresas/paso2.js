import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, TextField } from "@material-ui/core";
import {
  keyValidation,
  pasteValidation
} from "../../helpers/inputHelpers";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  textFields: {
    width: "100%"
  }
}));

export default function Paso2(props) {
  const classes = useStyles();
  const paso2Datos = props.paso2Datos;
  const setPaso2Datos = props.setPaso2Datos;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Grid container justify="center" className={classes.root}>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                disabled
                label="Nombre de la empresa"
                variant="outlined"
                type="text"
                value={paso2Datos.nombreEmpresa}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                disabled
                label="RFC"
                variant="outlined"
                type="text"
                value={paso2Datos.rfcEmpresa}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                id="emailEmpresa"
                label="Correo electrónico"
                variant="outlined"
                type="text"
                margin="normal"
                value={paso2Datos.emailEmpresa}
                inputProps={{
                  maxLength: 70
                }}
                onKeyPress={e => {
                  keyValidation(e, 4);
                }}
                onChange={e => {
                  pasteValidation(e, 4);
                  setPaso2Datos({
                    ...paso2Datos,
                    emailEmpresa: e.target.value
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
