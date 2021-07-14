import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function SolucionesNuevaContabilidad() {
  const classes = useStyles();
  return (
    <div
      style={{
        marginTop: 80 /* height: "100vh" , */,
      }}
    >
      <Container maxWidth="sm" style={{ padding: "64px 0px 48px" }}>
        <Typography
          variant="h2"
          color="textPrimary"
          gutterBottom="0.35em"
          align="center"
        >{`FC Básico`}</Typography>
        <Typography variant="h5" color="textSecondary" paragraph align="center">
          Nuestros servicios de soporte son realizados por personal
          especializado. Contamos con un equipo multidisciplinario que nos
          permite brindar soporte técnico, implementaciones, asesorías y
          capacitaciones.
        </Typography>
      </Container>
      <Container
        maxWidth="md"
        style={{ paddingTop: "64px", paddingBottom: "64px" }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://upload.wikimedia.org/wikipedia/commons/4/42/Pdf-2127829.png"
                  title="pdf"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    PDF
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ placeContent: "center" }}>
                <Button size="small" color="primary">
                  Ver
                </Button>
                <Button size="small" color="primary">
                  Descargar
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image="https://cdn.icon-icons.com/icons2/1713/PNG/512/iconfinder-videologoplayicon-3993847_112649.png"
                  title="video"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Video
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ placeContent: "center" }}>
                <Button size="small" color="primary">
                  Ver
                </Button>
                <Button size="small" color="primary">
                  Descargar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
