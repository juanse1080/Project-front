import { Grid, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import React from 'react';
import Highcharts from './HighChart';
import Media from './Media';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent'
    }
  }
}));

export default function({ elements, change, updateView }) {
  const classes = useStyles();
  const md = useMediaQuery(theme => theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme => theme.breakpoints.up('lg'));

  return (
    <>
      <Paper className={classes.paper} elevation={3} variant="outlined">
        <Grid container spacing={2}>
          <Grid item lg={7} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <Media change={change('input')} element={elements.input} />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <Media change={change('output')} element={elements.output} />
              </Grid>
              {md ? (
                <Grid item lg={5} md={6} sm={12} xs={12}>
                  <Highcharts
                    oneToOne={true}
                    change={change('graph')}
                    element={elements.graph}
                  />
                </Grid>
              ) : null}
              <Grid item lg={12} md={6} sm={12} xs={12}>
                <span className="text-muted">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32. The standard chunk of
                  Lorem Ipsum used since the 1500s is reproduced below for those
                  interested. Sections 1.10.32 and 1.10.33 from "de Finibus
                  Bonorum et Malorum" by Cicero are also reproduced in their
                  exact original form, accompanied by English versions from the
                  1914 translation by H. Rackham.
                </span>
              </Grid>
            </Grid>
          </Grid>
          {lg ? (
            <Grid item lg={5} md={6}>
              <Highcharts
                oneToOne={true}
                change={change('graph')}
                element={elements.graph}
                updateView={updateView}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    </>
  );
}
