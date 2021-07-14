import React, { useEffect } from "react";
/* import { makeStyles } from "@material-ui/core/styles"; */
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";

/* const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}); */

export default function ModulosNuevaContabilidad(props) {
  /* const classes = useStyles(); */
  const modulosNuevaContabilidad = props.modulosNuevaContabilidad;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ marginTop: 40, backgroundColor: "#ededed" }}>
      <Container maxWidth="sm" style={{ padding: "64px 20px 48px" }}>
        <Typography
          variant="h3"
          color="textPrimary"
          align="center"
        >{`Módulos Disponibles`}</Typography>
        <Paper elevation={3} style={{ marginTop: 20, padding: "20px" }}>
          <List>
            {modulosNuevaContabilidad.map((modulo, index) => (
              <ListItem key={index} button divider>
                <ListItemText
                  primary={modulo.nombre}
                  onClick={() => {
                    window.open(modulo.linkDocumento);
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </div>
  );
}
