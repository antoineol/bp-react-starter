import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './auth.service';
import GoogleSignIn from './GoogleSignIn';

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialog: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing(4),
    },
  }),
);

function SignInDialog() {
  const classes = useStyles(); // MUI Styles
  const isLoggedIn = useSelector(selectIsLoggedIn); // Redux Selector

  return <Dialog fullScreen disableBackdropClick disableEscapeKeyDown
                 open={!isLoggedIn} classes={{ paper: classes.dialog }}>
    <Typography variant={'h2'} className={classes.title}>My starter app</Typography>
    <GoogleSignIn />
  </Dialog>;
}

export default memo(SignInDialog);
