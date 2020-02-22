import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React, { memo } from 'react';
import { useCache } from '../../common/utils/app.utils';
import ConnectionStatus from '../pwa/ConnectionStatus';
import { GET_JWT } from './auth.service';
import GoogleSignIn from './GoogleSignIn';

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialog: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    status: {
      position: 'absolute',
      top: theme.spacing(1),
      right: 0,
    },
    title: {
      marginBottom: theme.spacing(4),
    },
  }),
);

function SignInDialog() {
  const classes = useStyles(); // MUI Styles
  const { jwt } = useCache(GET_JWT);

  return <Dialog fullScreen disableBackdropClick disableEscapeKeyDown
                 open={!jwt} classes={{ paper: classes.dialog }}>
    <ConnectionStatus className={classes.status} />
    <Typography variant={'h2'} className={classes.title}>My starter app</Typography>
    <GoogleSignIn />
  </Dialog>;
}

export default memo(SignInDialog);
