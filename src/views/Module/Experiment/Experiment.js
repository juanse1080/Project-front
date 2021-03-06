import {
  Backdrop,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Icon,
  IconButton,
  Link,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import { authHeaderJSON, history, host, ws } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { title as ucWords } from 'utils';
import errores from 'utils/error';
import { actions } from '_redux';
import { Build } from '../Show/components';
import { ShowExperiment } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3)
      // backgroundColor: theme.palette.white
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.appBar + 1,
    color: '#fff'
  }
}));

export default function({ match, ...others }) {
  const classes = useStyles();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const access = useSelector(state => state.user.id);
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [module, setModule] = useState({});

  const [execute, setExecute] = useState(true);
  const [experiment, setExperiment] = useState({});
  const [progress, setProgress] = useState([]);

  const deleting = () => {
    axios
      .delete(
        `${host}/accounts/experiment/delete/${match.params.id}`,
        authHeaderJSON()
      )
      .then(function(res) {
        to(`/subscriptions/${module.image_name}`)();
      })
      .catch(function(err) {
        console.log(err);
        setDialog(false);
      });
  };

  const algorithms = () => {
    dispatch(actions.startLoading());
    history.push(
      user.role === 'developer' || !module.subscribe
        ? '/module'
        : '/subscriptions'
    );
    dispatch(actions.finishLoading());
  };

  const triedDelete = () => {
    setDialog(true);
  };

  const cancelDelete = () => {
    setDialog(false);
  };

  const newTest = () => {
    dispatch(actions.startLoading());
    history.push(`/module/run/${module.image_name}`);
    dispatch(actions.finishLoading());
  };

  const handleExecute = () => {
    setExecute(execute => !execute);
  };

  const connect = id => {
    const webSocket = new WebSocket(`${ws}/ws/execute/${access}/${id}`);
    webSocket.onmessage = e => {
      addDescription(JSON.parse(e.data));
    };
    return webSocket;
  };

  const addDescription = state => {
    setProgress(progress => [...progress, ...state]);
    if (state.length > 0) {
      if (state[state.length - 1].state === 'success') getData();
    }
  };

  const to = href => () => {
    dispatch(actions.startLoading());
    if (experiment.ws) {
      experiment.ws.close();
    }
    setExecute(true);
    setLoading(true);
    setModule({});
    setExperiment({});
    setProgress([]);
    history.push(href);
    dispatch(actions.finishLoading());
  };

  const clone = () => {
    axios
      .post(
        `${host}/accounts/experiment/clone/${match.params.id}`,
        {},
        authHeaderJSON()
      )
      .then(function(res) {
        dispatch(actions.startLoading());
        history.push(`/module/run/${module.image_name}`);
        dispatch(actions.finishLoading());
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  const handlePage = (e, value) => {
    to(`/module/experiment/${module.experiments[value - 1]}`)();
  };

  const getData = () => {
    axios
      .get(`${host}/modules/experiment/${match.params.id}`, authHeaderJSON())
      .then(function(res) {
        console.log(res.data);
        setExperiment({ ...res.data });
        setTimeout(
          () => setExecute(res.data.state === 'executed' ? false : true),
          1000
        );
      })
      .catch(function(err) {
        console.log(err);
        errores(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${host}/modules/experiment/${match.params.id}`, authHeaderJSON())
      .then(function(res) {
        console.log(res.data);
        if (res.data.state === 'executing') {
          setExperiment({ ...res.data, ws: connect(res.data.id) });
        } else {
          setExperiment({ ...res.data });
          setProgress(res.data.records);
        }
        let types = {};
        res.data.docker.elements_type.forEach(item => {
          if (item.kind in types) {
            types[item.kind] = Array.isArray(types[item.kind])
              ? [...types[item.kind], { ...item }]
              : [{ ...types[item.kind] }, { ...item }];
          } else {
            types[item.kind] = { ...item };
          }
        });

        setExecute(res.data.state === 'executed' ? false : true);
        setModule({
          ...res.data.docker,
          owner: res.data.owner,
          subscribe: res.data.subscribe,
          experiments: res.data.experiments,
          elements_type: types,
          index: res.data.experiments.indexOf(match.params.id) + 1
        });
        setLoading(false);
      })
      .catch(function(err) {
        console.log(err, execute);
        errores(err);
      });
    return () => {
      if (experiment.ws) {
        experiment.ws.close();
      }
    };
  }, [match.params.id]);

  return (
    <>
      <div className={classes.root}>
        {loading ? (
          <>
            <Backdrop className={classes.backdrop} open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        ) : (
          <>
            <Grid container justify="center" direction="row">
              <Grid item xs={12}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={sm ? 8 : 2}>
                  <Link color="inherit" onClick={algorithms}>
                    {user.role === 'developer' || !module.subscribe
                      ? 'Algorithms'
                      : 'Subscriptions'}
                  </Link>
                  <Link
                    color="inherit"
                    onClick={to(`/module/${module.image_name}`)}>
                    {ucWords(module.name)}
                  </Link>
                  {console.log(module.owner && module.subscribe)}
                  {module.owner && module.subscribe ? (
                    <Link
                      color="inherit"
                      onClick={to(`/subscriptions/${module.image_name}`)}>
                      Test
                    </Link>
                  ) : (
                    <Typography color="textSecondary">Test</Typography>
                  )}
                  <Typography color="textSecondary">{module.index}</Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            {execute ? (
              <>
                <Build
                  progress={progress}
                  download={
                    experiment.state === 'executed' ? experiment.file : false
                  }
                />
              </>
            ) : (
              <ShowExperiment
                to={to}
                value={experiment.elements}
                docker={module}
                id={match.params.id}
              />
            )}
            {module.owner && module.subscribe ? (
              <>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justify="space-around"
                  className="mt-3">
                  {sm ? (
                    <Grid item>
                      {experiment.state === 'executed' ? (
                        <>
                          {module.state !== 'active' ? (
                            <Button
                              disabled
                              size="small"
                              variant="outlined"
                              color="default"
                              startIcon={
                                <Icon
                                  fontSize="small"
                                  className="fal fa-vial"
                                />
                              }
                              className="mr-2">
                              {' '}
                              New{' '}
                            </Button>
                          ) : (
                            <Tooltip title="Test algorith">
                              <Button
                                onClick={newTest}
                                size="small"
                                variant="outlined"
                                color="default"
                                startIcon={
                                  <Icon
                                    fontSize="small"
                                    className="fal fa-vial "
                                  />
                                }
                                className="mr-2">
                                {' '}
                                New{' '}
                              </Button>
                            </Tooltip>
                          )}
                          {module.state !== 'active' ? (
                            <Button
                              disabled
                              size="small"
                              variant="outlined"
                              color="default"
                              startIcon={
                                <Icon
                                  fontSize="small"
                                  className="fal fa-clone"
                                />
                              }
                              className="mr-2">
                              {' '}
                              Clone{' '}
                            </Button>
                          ) : (
                            <Tooltip title="Clone test with same data">
                              <Button
                                onClick={clone}
                                size="small"
                                variant="outlined"
                                color="default"
                                startIcon={
                                  <Icon
                                    fontSize="small"
                                    className="fal fa-clone "
                                  />
                                }
                                className="mr-2">
                                {' '}
                                Clone{' '}
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title={execute ? 'Less info' : 'More info'}>
                            <Button
                              onClick={handleExecute}
                              size="small"
                              variant="outlined"
                              color="default"
                              startIcon={
                                <Icon
                                  fontSize="small"
                                  className="fal fa-info-circle "
                                />
                              }
                              className="mr-2">
                              {' '}
                              {execute ? 'Less' : 'More'}{' '}
                            </Button>
                          </Tooltip>
                          <Tooltip className="mr-1" title="Delete test">
                            <Button
                              onClick={triedDelete}
                              size="small"
                              variant="outlined"
                              color="default"
                              startIcon={
                                <Icon
                                  fontSize="small"
                                  className="fal fa-trash-alt text-danger"
                                />
                              }>
                              Delete
                            </Button>
                          </Tooltip>
                        </>
                      ) : null}
                    </Grid>
                  ) : (
                    <Grid item>
                      {experiment.state === 'executed' ? (
                        <>
                          {module.state !== 'active' ? null : (
                            <Tooltip title="Test algorith">
                              <IconButton
                                size="small"
                                onClick={newTest}
                                variant="outlined"
                                color="default"
                                className="mr-2">
                                <Icon
                                  fontSize="small"
                                  className="fal fa-vial "
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                          {module.state !== 'active' ? null : (
                            <Tooltip title="Clone test with same data">
                              <IconButton
                                size="small"
                                onClick={clone}
                                variant="outlined"
                                color="default"
                                className="mr-2">
                                <Icon
                                  fontSize="small"
                                  className="fal fa-clone "
                                />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={execute ? 'Less info' : 'More info'}>
                            <IconButton
                              size="small"
                              onClick={handleExecute}
                              variant="outlined"
                              color="default"
                              className="mr-2">
                              <Icon
                                fontSize="small"
                                className="fal fa-info-circle "
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip className="mr-1" title="Delete test">
                            <IconButton
                              size="small"
                              onClick={triedDelete}
                              variant="outlined"
                              color="default">
                              <Icon
                                fontSize="small"
                                className="fal fa-trash-alt text-danger"
                              />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : null}
                    </Grid>
                  )}
                  <Grid item>
                    <Pagination
                      variant="outlined"
                      size="small"
                      count={module.experiments.length}
                      page={module.index}
                      onChange={handlePage}
                    />
                  </Grid>
                </Grid>
                <Dialog
                  open={dialog !== false}
                  keepMounted
                  onClose={cancelDelete}
                  maxWidth="xs"
                  fullWidth>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      ¿Do want delete this test?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={cancelDelete}>Cancel</Button>
                    <Button onClick={deleting}>Confirm</Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
