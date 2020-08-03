import React from "react";
import { Grid, Card, Typography } from "@material-ui/core";
import Chart from "react-apexcharts";

export default function Home(props) {
  const menu = props.menu;
  const permisos = props.permisos;
  console.log(menu);
  console.log(permisos);
  const num = [1, 2, 3, 4, 5];

  const series = [25, 15, 44, 55, 41, 17];
  const options = {
    chart: {
      width: "100%",
      type: "pie",
    },
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      text: "Number of leads",
    },
    dataLabels: {
      formatter(val, opts) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                style={{
                  fontSize: ".625rem",
                  color: "#818ea3",
                  letterSpacing: ".125rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Home
              </Typography>
              <Typography
                variant="subtitle1"
                style={{
                  fontSize: "1.625rem",
                  color: "#3d5170",
                  lineHeight: "1",
                  fontWeight: "500",
                  margin: 0,
                  padding: 0,
                }}
              >
                Período de Julio
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {num.map((n, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card style={{ padding: "15px" }}>
                    <Typography
                      variant="h6"
                      style={{
                        color: "#818ea3",
                        textAlign: "center",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    >
                      Submenu
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontSize: "2.0625rem",
                        color: "#3d5170",
                        textAlign: "center",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    >
                      {n}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Chart options={options} series={series} type="pie" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
