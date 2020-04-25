import {
  Button,
  CircularProgress,
  createStyles,
  IconButton,
  Snackbar,
  Theme,
  Tooltip,
  TooltipProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import React, { FC, memo, ReactNode, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWsConnectionStatus, WsConnectionStatus } from '../../common/graphql.client';
import { env } from '../../environment/env';
import { selectJwt } from '../auth/auth.service';
import {
  checkUpdates,
  installUpdatePromise,
  swReadyPromise,
  updateAvailablePromise,
} from './sw.service';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
);

const tempLabels = {
  installingUpdate: 'Installing the latest version of the application...',
  connecting: 'Connecting to the back-end...',
  networkError: 'Network error',
  updateAvailable: 'An update is available. Click here to refresh and use the latest version.',
};

const isStandalone = !env.isJest && window.matchMedia('(display-mode: standalone)').matches;

const ConnectionStatus: FC<Partial<TooltipProps>> = props => {
  const classes = useStyles();
  const jwt = useSelector(selectJwt);
  const [installUpdate, setInstallUpdate] = useState<ServiceWorkerRegistration | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState<ServiceWorkerRegistration | null>(null);
  const [newUpdate, setNewUpdate] = useState(false);
  const [wsStatus, setWsStatus] = useState<WsConnectionStatus>(WsConnectionStatus.connecting);
  const reg = (registration || updateAvailable) as ServiceWorkerRegistration;
  useEffect(() => {
    // Mount component, subscribe to PWA and websocket status updates
    updateAvailablePromise.then(update => {
      setUpdateAvailable(update);
      setNewUpdate(!!update);
    });
    swReadyPromise.then(setRegistration);
    installUpdatePromise.then(setInstallUpdate);
    const sub = getWsConnectionStatus().subscribe(setWsStatus);
    return () => {
      // Unmount component, unsubscribe to avoid memory leak
      sub.unsubscribe();
    };
  }, []);
  // Regularly check if an update is available
  useEffect(() => checkUpdates(reg), [reg]);
  // Click handler on update button
  const refreshAndUpdate = useCallback(() => {
    if (!reg || !reg.waiting) {
      return console.error('No waiting service worker! This is not supposed to happen, there' +
        ' should be a check upfront. Registration:', reg);
    }
    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [reg]);
  const handleClose = useCallback(() => setNewUpdate(false), []);

  const isUpdateAvailable = !!(reg && reg.waiting);
  const isOfflineReady = !!(reg && reg.active);

  let icon: ReactNode;
  if (installUpdate || (wsStatus === WsConnectionStatus.connecting && !!jwt)) {
    icon = <Tooltip
      title={installUpdate ? tempLabels.installingUpdate : tempLabels.connecting} {...props}>
      <CircularProgress size={20} className={classes.root} />
    </Tooltip>;
  } else if (wsStatus === WsConnectionStatus.offline && !!jwt) {
    icon = <Tooltip title={tempLabels.networkError} {...props}>
      <SignalWifiOffIcon fontSize={'default'} className={classes.root} />
    </Tooltip>;
  } else if (isUpdateAvailable) {
    icon = <Tooltip title={tempLabels.updateAvailable} {...props}>
      <IconButton aria-label="update" className={classes.root} onClick={refreshAndUpdate}>
        <SystemUpdateAltIcon fontSize={'small'} />
      </IconButton>
    </Tooltip>;
  } else if (!isStandalone && isOfflineReady) {
    icon = <Tooltip title={<>The application is downloaded and ready to be used offline. Click
      the <ControlPointIcon fontSize={'small'} /> on Chrome desktop (right of the URL bar) to
      install it and create a shortcut.</>} {...props}>
      <OfflinePinIcon fontSize={'default'} className={classes.root} />
    </Tooltip>;
  } else {
    icon = null;
  }
  return <>
    {icon}
    <Snackbar
      open={newUpdate}
      onClose={handleClose}
      message="Update available"
      action={<>
        <Button color="inherit" size="small" onClick={refreshAndUpdate}
                endIcon={<SystemUpdateAltIcon fontSize={'small'} />}>
          Refresh
        </Button>
      </>}
    />
  </>;
};

export default memo(ConnectionStatus);
