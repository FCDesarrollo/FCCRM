import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, TextField} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  textFields: {
    width: "100%"
  }
}));

export default function Paso1(props) {
  const classes = useStyles();
  const paso1Datos= props.paso1Datos;
  const setPaso1Datos = props.setPaso1Datos;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <Grid container justify="center" className={classes.root}>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .cer"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(e) => {
                  setPaso1Datos({
                    ...paso1Datos,
                    certificado: e.target.files[0]
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                variant="outlined"
                label="Archivo .key"
                type="file"
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(e) => {
                  setPaso1Datos({
                    ...paso1Datos,
                    key: e.target.files[0]
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                className={classes.textFields}
                label="Contraseña FIEL"
                variant="outlined"
                type="password"
                value={paso1Datos.passwordcertificado}
                margin="normal"
                onChange={(e) => {
                  setPaso1Datos({
                    ...paso1Datos,
                    passwordcertificado: e.target.value
                  })
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
