import {
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Icon,
  Link,
  makeStyles,
  Paper,
  Tooltip,
  Typography
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import axios from 'axios';
import clsx from 'clsx';
import { authHeaderJSON, history, host } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { error, format_date as getDate, title as ucWords } from 'utils';
import { actions } from '_redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3)
    }
  },
  alerts: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  main: {
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  disableScale: {
    transform: 'scale(1, 1) !important'
  },
  owner: {
    fontSize: 11
  },
  iconButton: {
    fontSize: 15,
    margin: 5
  },
  rootTitleDialog: {
    flex: '0 0 auto',
    margin: 0,
    padding: '24px 24px'
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  alignItemsStart: {
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.5)
  },
  alignItemsEnd: {
    alignItems: 'center',
    height: 31
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(1),
    display: 'block',
    flexDirection: 'column'
  },
  paper: {
    padding: theme.spacing(2),
    '&:hover .actions': {
      whiteSpace: 'normal'
    },
    '&:focus .actions': {
      whiteSpace: 'normal'
    },
    '&:active .actions': {
      whiteSpace: 'normal'
    }
  },
  listItemIconRoot: {
    minWidth: '30px'
  },
  linearProgressRoot: {
    height: 2
  },
  fatherTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}));

export default function List(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [notifications, setnotifications] = useState([]);
  const [filter, setFilter] = useState([]);

  const to = (id, link) => () => {
    dispatch(actions.startLoading());
    axios
      .put(`${host}/accounts/notifications/${id}`, {}, authHeaderJSON())
      .then(function(res) {
        handleClose('notifications')();
        history.push(link);
        dispatch(actions.finishLoading());
      })
      .catch(function(err) {
        console.log(err);
        handleClose('notifications')();
        dispatch(actions.finishLoading());
      });
  };

  const handleModuleFilter = (index, name, value) => {
    let aux = [...filter];
    aux[index] = { ...aux[index], [name]: value };
    setFilter(aux);
  };

  const handleClose = index => () => {
    handleModuleFilter(index, 'anchor', null);
  };

  useEffect(() => {
    axios
      .get(`${host}/accounts/notifications/`, authHeaderJSON())
      .then(function(res) {
        console.log(res.data);
        const data = res.data.map(item => ({ ...item, anchor: null }));
        setnotifications(data);
        setFilter(data);
        setLoading(false);
      })
      .catch(function(err) {
        error(err);
      });
  }, []);

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <>
            <Grid container className="mt-3" justify="center" direction="row">
              <Grid item xs={12} sm={10} md={8} xl={6}>
                <div className={clsx(classes.main, 'm-2')}>
                  <Skeleton
                    className={classes.disableScale}
                    animation="wave"
                    width="100%"
                    height={50}
                    variant="text"
                  />
                </div>
              </Grid>
            </Grid>
            <>
              <Grid container className="mt-3" style={{ maxWidth: '100%' }}>
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <Grid item lg={6} md={6} sm={6} xs={12} key={item}>
                    <Card className="m-2">
                      <CardContent>
                        <Grid
                          container
                          direction="column"
                          justify="space-between"
                          alignItems="stretch"
                          spacing={3}>
                          <Grid item>
                            <Grid
                              container
                              direction="row"
                              justify="space-between"
                              alignItems="flex-start">
                              <Grid item>
                                <Skeleton
                                  animation="wave"
                                  variant="text"
                                  height={10}
                                  width={200}
                                />
                                <Skeleton
                                  animation="wave"
                                  variant="text"
                                  height={10}
                                  width={150}
                                />
                              </Grid>
                              <Grid item>
                                <Skeleton
                                  animation="wave"
                                  variant="text"
                                  height={10}
                                  width={40}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              direction="row"
                              justify="space-between"
                              alignItems="flex-start">
                              <Grid item>
                                <Skeleton
                                  animation="wave"
                                  variant="text"
                                  height={10}
                                  width={80}
                                />
                              </Grid>
                              <Grid item>
                                <Grid container spacing={1}>
                                  <Grid item>
                                    <Skeleton
                                      animation="wave"
                                      variant="circle"
                                      width={16}
                                      height={16}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton
                                      animation="wave"
                                      variant="circle"
                                      width={16}
                                      height={16}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Skeleton
                                      animation="wave"
                                      variant="circle"
                                      width={16}
                                      height={16}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          </>
        ) : (
          <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12} className="mb-2">
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography color="textSecondary">Notifications</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            {notifications.length === 0 ? (
              <Grid container className="mt-3" justify="center" direction="row">
                <Grid item xs={12} sm={10} md={8} xl={6}>
                  <Alert
                    severity="info"
                    variant="outlined"
                    className={clsx('mt-3', classes.alerts)}>
                    You don't have notifications yet
                  </Alert>
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid container className="mt-3" spacing={1}>
                  {notifications.map((item, index) => (
                    <Grid item lg={6} md={6} sm={6} xs={12} key={item.id}>
                      <Paper className={classes.paper} variant="outlined">
                        <div
                          className={clsx(
                            classes.details,
                            classes.alignItemsStart
                          )}>
                          <div className={classes.fatherTitle}>
                            <Tooltip title={item.kind} className="mr-2">
                              <Icon
                                fontSize="default"
                                className={clsx(
                                  `fal ${
                                    item.kind === 'success'
                                      ? 'fa-check-circle text-success'
                                      : 'fa-exclamation-circle text-secondary'
                                  }`
                                )}
                              />
                            </Tooltip>
                            <Typography noWrap>
                              <Link onClick={to(item.id, item.link)}>
                                {ucWords(item.title)}
                              </Link>
                            </Typography>
                          </div>

                          <span className={classes.owner}>
                            <Typography
                              noWrap
                              variant="caption"
                              color="textSecondary">
                              {getDate(item.created_at)}
                            </Typography>
                          </span>
                        </div>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          className={clsx(classes.title, 'actions')}>
                          {item.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
