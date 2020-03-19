import React, { useState } from "react";
import {
  Card,
  Typography,
  ExpansionPanel as MuiExpansionPanel,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  Grid,
  TextField,
  Button,
  Divider
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { keyValidation, pasteValidation } from "../../helpers/inputHelpers";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  card: {
    padding: "10px",
    height: "100%",
    width: "100%"
  },
  title: {
    marginTop: "10px",
    marginBottom: "20px"
  },
  textFields: {
    width: "100%"
  }
}));

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiExpansionPanelDetails);

export default function Empresa(props) {
  const classes = useStyles();
  const submenuContent = props.submenuContent;
  const [expanded, setExpanded] = useState(0);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h6" className={classes.title}>
        Empresa
      </Typography>
      <div>
        {submenuContent.map((content, index) => {
          return content.submenu.orden !== 0 ? (
            <ExpansionPanel
              square
              disabled={content.permisos === 0}
              expanded={expanded === content.submenu.orden}
              onChange={handleChange(content.submenu.orden)}
              key={index}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index + 1}d-content`}
                id={`panel${index + 1}d-header`}
              >
                <Typography>{content.submenu.nombre_submenu}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {content.submenu.idsubmenu === 39 ? (
                  <Grid container justify="center" spacing={3}>
                    <Grid item xs={12}>
                    <Typography variant="h6">Datos De La Empresa</Typography>
                    <Divider />
                  </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        className={classes.textFields}
                        id={`nombreEmpresa${index + 1}`}
                        label="Nombre Empresa"
                        variant="outlined"
                        type="text"
                        margin="normal"
                        onKeyPress={e => {
                          keyValidation(e, 5);
                        }}
                        onChange={e => {
                          pasteValidation(e, 5);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        className={classes.textFields}
                        id={`rfc${index + 1}`}
                        label="RFC"
                        variant="outlined"
                        type="text"
                        margin="normal"
                        onKeyPress={e => {
                          keyValidation(e, 5);
                        }}
                        onChange={e => {
                          pasteValidation(e, 5);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        className={classes.textFields}
                        id={`correoElectronico${index + 1}`}
                        label="Correo Electrónico"
                        variant="outlined"
                        type="text"
                        margin="normal"
                        onKeyPress={e => {
                          keyValidation(e, 4);
                        }}
                        onChange={e => {
                          pasteValidation(e, 4);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        className={classes.textFields}
                        id={`vigenciaCertificado${index + 1}`}
                        label="Vigencia Certificado"
                        variant="outlined"
                        type="text"
                        margin="normal"
                        onKeyPress={e => {
                          keyValidation(e, 2);
                        }}
                        onChange={e => {
                          pasteValidation(e, 2);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        style={{
                          float: "right",
                          borderColor: "#F49917"
                        }}
                      >
                        Renovar Certificado
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        Datos Para Facturación
                      </Typography>
                      <Divider />
                    </Grid>
                  </Grid>
                ) : (
                  <div></div>
                )}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ) : null;
        })}
      </div>
    </Card>
  );
}
