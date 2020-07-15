import React, { useState, useEffect } from 'react'

import clsx from 'clsx'

import { Alert, Skeleton, } from '@material-ui/lab'

import { Card, CardHeader, Link, CardContent, CardActions, Avatar, IconButton, Typography, makeStyles, Grid, Paper, InputBase, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Icon, Tooltip, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanel } from '@material-ui/core'
import { Search, Edit, Delete, Visibility, ExpandMore } from '@material-ui/icons'

import { host, authHeaderJSON, history, ws } from 'helpers'

import { title as ucWords, format_date as getDate, error } from 'utils'

import { useDispatch } from "react-redux";
import { actions } from '_redux';

import axios from "axios"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.white
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  colorPreview: {
    fontSize: '0.8rem'
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  fullHeight: {
    paddingTop: "100%",
    transform: 'scale(1, 1) !important'
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  owner: {
    fontSize: 11,
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '14px'
    }
  },
  rootTitleDialog: {
    flex: '0 0 auto',
    margin: 0,
    padding: '24px 24px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  fullWidth: {
    width: '100%'
  }
}))

const default_ = { name: '', owner: '' }

export default function List(props) {

  const classes = useStyles()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState([])

  const [dialog, setDialog] = useState(false)
  const [deleting, setDeleting] = useState(default_)

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }


  const handleDialog = (value = !dialog) => () => {
    setDialog(value)
  }

  const handleModule = (index, name, value) => {
    let aux = [...filter]
    aux[index] = { ...aux[index], [name]: value }
    setModules(modules.map(item => item.id === aux[index].id ? { ...item, [name]: value } : item))
    setFilter(aux)
  }

  const triedDelete = (index) => () => {
    setDeleting({ ...filter[index], index: index })
    handleDialog(true)()
  }

  const cancelDelete = () => {
    handleDialog(false)()
  }

  const deleteModule = () => {
    handleDialog(false)()
    handleModule(deleting.index, 'loading', true)
    axios.delete(`${host}/module/delete/${deleting.image_name}`, authHeaderJSON()).then(
      function (res) {
        handleModule(deleting.index, 'loading', false)
        setModules(modules => modules.filter(item => item.image_name !== deleting.image_name))
        setFilter(filter => filter.filter(item => item.image_name !== deleting.image_name))
        setDeleting(default_)
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(deleting.index, 'loading', false)
        setDeleting(default_)
      }
    )
  }

  const show = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/${id}`)
    dispatch(actions.finishLoading())
  }

  const run = (id) => () => {
    dispatch(actions.startLoading())
    history.push(`/module/run/${id}`)
    dispatch(actions.finishLoading())
  }

  const start = (index, id) => () => {
    handleModule(index, 'loading', true)
    axios.put(`${host}/module/start/${id}`, {}, authHeaderJSON()).then(
      function (res) {
        handleModule(index, 'loading', false)
        handleModule(index, 'state', 'active')
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(index, 'loading', false)
      }
    )
  }

  const stop = (index, id) => () => {
    handleModule(index, 'loading', true)
    axios.put(`${host}/module/stop/${id}`, {}, authHeaderJSON()).then(
      function (res) {
        handleModule(index, 'loading', false)
        handleModule(index, 'state', 'stopped')
      }
    ).catch(
      function (err) {
        console.error(err)
        handleModule(index, 'loading', false)
      }
    )
  }

  // Filtrar contenedores
  const filterModules = (e) => {
    const val = e.target.value
    if (val) {
      const query = modules.filter(module => module.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || module.image.toLowerCase().indexOf(val.toLowerCase()) > -1 || `${module.user.first_name} ${module.user.last_name}`.toLowerCase().indexOf(val.toLowerCase()) > -1)
      console.log(query)
      setFilter(query)
    } else {
      setFilter(modules)
    }
  }

  useEffect(() => {
    axios.get(`${host}/accounts/subscriptions`, authHeaderJSON()).then(function (res) {
      setModules(res.data)
      setFilter(res.data)
      setLoading(false)
    }).catch(function (err) {
      error(err)
    })
  }, [])

  return <>
    <div className={classes.root}>
      {
        loading ? <>
          <Grid container className="mt-3" justify="center" direction="row">
            <Grid item xs={12} sm={10} md={8} xl={6}>
              <div className={clsx(classes.main, "m-2")}>
                <Skeleton className={classes.disableScale} animation="wave" width="100%" height={50} variant="text" />
              </div>
            </Grid>
          </Grid>
          <>
            <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
              {
                [1, 2, 3, 4, 5, 6].map(item =>
                  <Grid item lg={6} md={6} sm={6} xs={12} key={item}>
                    <Card className="m-2">
                      <CardContent>
                        <Grid container direction="column" spacing={3}>
                          <Grid item>
                            <Grid container direction="row" alignItems="flex-start">
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={200} />
                                <Skeleton animation="wave" variant="text" height={10} width={150} />
                              </Grid>
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={40} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid container direction="row" justify="space-between" alignItems="flex-start">
                              <Grid item>
                                <Skeleton animation="wave" variant="text" height={10} width={80} />
                              </Grid>
                              <Grid item>
                                <Grid container spacing={1}>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton animation="wave" variant="circle" width={16} height={16} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              }
            </Grid>
          </>
        </> : <>
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <Paper className={classes.alerts}>
                  <IconButton size="small" color="primary" className={classes.iconButton} aria-label="search">
                    <Search />
                  </IconButton>
                  <InputBase
                    onChange={filterModules}
                    className={classes.input}
                    placeholder="Find modules"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Paper>
              </Grid>
            </Grid>
            {
              modules.length === 0 ? (
                <Grid container className="mt-3" justify="center" direction="row">
                  <Grid item xs={12} sm={10} md={8} xl={6}>
                    <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                      There are no records
                    </Alert>
                  </Grid>
                </Grid>
              ) : (
                  <>
                    {
                      filter.length === 0 ? (
                        <Grid container className="mt-3" justify="center" direction="row">
                          <Grid item xs={12} sm={10} md={8} xl={6}>
                            <Alert severity="info" variant="outlined" className={clsx("mt-3", classes.alerts)}>
                              No concurrences were found
                            </Alert>
                          </Grid>
                        </Grid>
                      ) : null
                    }
                    <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                      {
                        filter.map((item, index) =>
                          <ExpansionPanel key={item.id} expanded={expanded === index} onChange={handleExpanded(index)} className={classes.fullWidth}>
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMore />}
                              aria-controls="panel1bh-content"
                              id="panel1bh-header"
                            >
                              <Typography className={classes.heading}>{ucWords(item.name)}</Typography>
                              <Typography className={classes.secondaryHeading}>{ucWords(`${item.user.first_name} ${item.user.last_name}`)}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <Typography>
                                {item.description || "Description not supplied"}
                              </Typography>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        )
                      }
                    </Grid>
                    <Dialog open={dialog} keepMounted onClose={cancelDelete} aria-labelledby="alert-dialog-slide-title" aria-describedby="alert-dialog-slide-description">
                      <DialogTitle id="alert-dialog-slide-title" classes={{ root: classes.rootTitleDialog }}>{`Module ${deleting.name}`}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          {`¿Do want delete background "${deleting.name}"?`}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={cancelDelete} color="primary">Cancel</Button>
                        <Button onClick={deleteModule} color="primary">Confirm</Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )
            }
          </>

      }
    </div>
  </>
}